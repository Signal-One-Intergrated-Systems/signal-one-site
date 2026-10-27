// Post-deployment verification on the existing public host. Read-only GET only.
const expected=process.env.EXPECTED_RELEASE;
if(!/^[0-9a-f]{40}$/.test(expected??''))throw Error('Exact expected release SHA required');
let observed=false;
for(let attempt=0;attempt<120;attempt++) {
  try {
    const r=await fetch('https://www.signalone.co.za/api/connect-status',{redirect:'manual',signal:AbortSignal.timeout(10000),cache:'no-store'});
    if(r.status===200) {const data=await r.json();if(data.release===expected&&data.mode==='review-only'&&data.backendIntake==='disabled'){observed=true;break;}}
  } catch { /* Unavailable is not a PASS; wait for this exact Railway release. */ }
  if(attempt%12===0)console.log('Waiting for exact live review release, attempt',attempt+1);
  await new Promise(resolve=>setTimeout(resolve,5000));
}
if(!observed)throw Error('Exact live release not observed within qualification window. No success claimed.');
console.log('Verified actual HTTPS release:',expected);
