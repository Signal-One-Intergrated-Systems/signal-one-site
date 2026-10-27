import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash,createHmac,randomUUID} from 'node:crypto';
import {parseIntroduction,NOTICE_VERSION,isReceipt} from '../../app/_connect/lib/introduction.ts';
import {INTEREST_OPTIONS} from '../../app/_connect/lib/interests.ts';
import {createReciprocalHandler} from '../../app/_connect/lib/server/reciprocal-handler.ts';
import {createGrant,validGrant,requestGrant,GRANT_COOKIE} from '../../app/_connect/lib/server/vcard-grant.ts';
import {exchangeReady} from '../../app/_connect/lib/server/exchange-gate.ts';
const origin='https://www.signalone.co.za';
const config={enabled:true,publicOrigin:origin,receiverOrigin:'https://receiver.example.invalid',allowedReceiverOrigin:'https://receiver.example.invalid',registrationId:randomUUID(),keyId:'test',secret:'synthetic-HMAC-key-minimum-32-bytes',grantSecret:'separate-synthetic-download-grant-key-32-bytes',privacyApproval:'synthetic-test-only',noticeVersion:NOTICE_VERSION};
export const payload=()=>({version:2,source:'signal_connect',presenterId:'andisiwe',submissionId:randomUUID(),contact:{name:'Synthetic QA',email:'synthetic@example.invalid',phone:null,company:null},interests:['guard','dmr','other'],otherSpecification:'Synthetic review',message:null,consent:{purpose:'respond_to_introduction',noticeVersion:NOTICE_VERSION,affirmative:true},marketingConsent:{purpose:'signal_one_marketing',noticeVersion:NOTICE_VERSION,affirmative:false}});
const request=body=>new Request(origin+'/api/contact-intake',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const hash=raw=>createHash('sha256').update(raw).digest('hex');
const mac=raw=>createHmac('sha256',config.secret).update(raw).digest('hex');
function signed(options={}) {return async(url,init)=>{
 assert.equal(url,config.receiverOrigin+'/api/v1/integrations/signal-connect/v1/intake');assert.equal(init.redirect,'manual');assert.equal(init.credentials,'omit');
 const h=init.headers,input=JSON.parse(init.body);assert.equal(h['X-S1-Signature'],mac(['signal-connect-request-v1',h['X-S1-Integration'],h['X-S1-Key-Id'],h['X-S1-Timestamp'],h['X-S1-Nonce'],origin,'POST','/api/v1/integrations/signal-connect/v1/intake',hash(init.body)].join('\n')));
 const raw=options.raw??JSON.stringify({status:options.existing?'existing':'created',source:'signal_connect',persisted:true,recordId:randomUUID(),submissionId:options.wrongId?randomUUID():input.submissionId});
 const status=options.status??(options.existing?200:201);
 const proof=['signal-connect-receipt-v1',h['X-S1-Integration'],h['X-S1-Key-Id'],h['X-S1-Timestamp'],h['X-S1-Nonce'],hash(init.body),String(status),hash(raw)].join('\n');
 return new Response(raw,{status,headers:{'X-S1-Receipt-Signature':options.badMac?'0'.repeat(64):mac(proof)}});
};}
test('all 20 interests fit one strict introduction; phone OR email; marketing false remains false',()=>{
 const input=payload();input.interests=INTEREST_OPTIONS.map(o=>o.id);assert.equal(input.interests.length,20);assert.deepEqual(parseIntroduction(input),input);
 input.contact.email=null;input.contact.phone='+27 11 000 0000';assert.ok(parseIntroduction(input));assert.equal(parseIntroduction(input).marketingConsent.affirmative,false);
 input.contact.phone=null;assert.equal(parseIntroduction(input),null);
});
test('unknown/duplicate/empty interests, unknown scope, absent privacy and fabricated marketing are rejected',()=>{
 const cases=[{interests:[]},{interests:['guard','guard']},{interests:['foreign']},{tenantId:randomUUID()},{ownerId:randomUUID()},{consent:{...payload().consent,affirmative:false}},{marketingConsent:{...payload().marketingConsent,affirmative:'true'}},{interests:['guard'],otherSpecification:'not other'}];
 for(const change of cases)assert.equal(parseIntroduction({...payload(),...change}),null);
});
test('full private gate is off by default, before body or transport reads',async()=>{
 for(const change of [{enabled:false},{privacyApproval:undefined},{noticeVersion:'old'},{grantSecret:config.secret},{secret:undefined},{allowedReceiverOrigin:'https://other.invalid'},{receiverOrigin:'http://receiver.example.invalid'}]){
  let calls=0;const receive=createReciprocalHandler({...config,...change},async()=>{calls++;throw Error('must not execute');});const req=request(payload());const res=await receive(req);assert.equal(res.status,503);assert.equal(req.bodyUsed,false);assert.equal(calls,0);assert.equal(res.headers.has('set-cookie'),false);
 }
 assert.equal(exchangeReady(config),true);
});
test('only signed created/existing persisted receipts issue HttpOnly Secure grants',async()=>{
 for(const existing of [false,true]){
 const input=payload();const res=await createReciprocalHandler(config,signed({existing}))(request(input));assert.equal(res.status,existing?200:201);assert.ok(isReceipt(await res.json(),input.submissionId));const cookie=res.headers.get('set-cookie');for(const text of ['Secure','HttpOnly','SameSite=Strict','Max-Age=900','Path=/'])assert.ok(cookie.includes(text));assert.ok(validGrant(cookie.split(';')[0].split('=')[1],config.grantSecret));assert.ok(!cookie.includes('example.invalid'));
 }
});
test('202, empty, unsigned, wrong identity and nonpersisted responses never grant downloads',async()=>{
 for(const options of [{status:202},{raw:''},{badMac:true},{wrongId:true},{raw:JSON.stringify({persisted:false})},{status:200}]){
 const res=await createReciprocalHandler(config,signed(options))(request(payload()));assert.equal(res.status,502);assert.equal(res.headers.has('set-cookie'),false);
 }
 const res=await createReciprocalHandler(config,async()=>{throw Error('timeout');})(request(payload()));assert.equal(res.status,502);assert.equal(res.headers.has('set-cookie'),false);
});
test('cross-origin, query scope, oversized body and browser tenant IDs fail before transport',async()=>{
 let calls=0;const handler=createReciprocalHandler(config,async()=>{calls++;throw Error('must not execute');});
 for(const req of [new Request(origin+'/api/contact-intake',{method:'POST',headers:{origin,'Content-Type':'application/x-www-form-urlencoded'},body:'name=Synthetic'}),new Request(origin+'/api/contact-intake?scope=platform',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(payload())}),new Request(origin+'/api/contact-intake',{method:'POST',headers:{origin:'https://evil.invalid','Content-Type':'application/json'},body:JSON.stringify(payload())}),request({...payload(),tenantId:randomUUID()}),request({...payload(),message:'a'.repeat(9000)})]){assert.ok([400,403,413].includes((await handler(req)).status));}assert.equal(calls,0);
});
test('grants reject forgery, expiry, wrong key, duplicate cookies and arbitrary profile/query input',()=>{
 const receipt={status:'created',source:'signal_connect',persisted:true,recordId:randomUUID(),submissionId:randomUUID()};const now=Date.now();const token=createGrant(receipt,config.grantSecret,now);
 assert.equal(validGrant(token,config.grantSecret,now),true);assert.equal(validGrant(token+'a',config.grantSecret,now),false);assert.equal(validGrant(token,config.grantSecret,now+900000),false);assert.equal(validGrant(token,'different-synthetic-secret-more-than-32bytes',now),false);assert.equal(validGrant(undefined,config.grantSecret),false);
 assert.equal(requestGrant(new Request(origin,{headers:{cookie:`${GRANT_COOKIE}=${token}; ${GRANT_COOKIE}=${token}`}})),undefined);
});
