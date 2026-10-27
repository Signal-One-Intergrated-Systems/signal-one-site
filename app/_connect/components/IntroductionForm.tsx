"use client";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { InterestSelect } from "./InterestSelect";
import { type InterestId } from "../lib/interests";
import { NOTICE_VERSION, isReceipt, parseIntroduction } from "../lib/introduction";
import styles from "./IntroductionForm.module.css";
export function IntroductionForm({enabled,alreadyConnected=false}:{enabled:boolean;alreadyConnected?:boolean}) {
  const [interests,setInterests]=useState<InterestId[]>([]),[interestError,setInterestError]=useState<string>();
  const [phase,setPhase]=useState<"ready"|"sending"|"unknown"|"saved">(alreadyConnected?"saved":"ready");
  const [error,setError]=useState("");
  const inFlight=useRef(false);
  const pending=useRef<{raw:string;id:string}|null>(null);
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(inFlight.current || phase==="sending" || phase==="saved" || !enabled)return;
    const form=event.currentTarget;setError("");setInterestError(undefined);
    if(!pending.current){
      const values=new FormData(form);const field=(name:string)=>String(values.get(name)??"").trim();
      if(!interests.length){setInterestError("Choose at least one interest.");document.getElementById("interest-trigger")?.focus();return;}
      if(!field("email") && !field("phone")){setError("Please add an email address or phone number.");(form.elements.namedItem("email") as HTMLInputElement)?.focus();return;}
      const input=parseIntroduction({version:2,source:"signal_connect",presenterId:"andisiwe",submissionId:crypto.randomUUID(),contact:{name:field("name"),email:field("email")||null,phone:field("phone")||null,company:field("company")||null},interests,otherSpecification:interests.includes("other")?field("other")||null:null,message:field("message")||null,consent:{purpose:"respond_to_introduction",noticeVersion:NOTICE_VERSION,affirmative:values.get("privacy")==="on"},marketingConsent:{purpose:"signal_one_marketing",noticeVersion:NOTICE_VERSION,affirmative:values.get("marketing")==="on"}});
      if(!input){setError("Please check your contact details and privacy acknowledgement.");return;}
      const raw=JSON.stringify(input);
      if(new TextEncoder().encode(raw).byteLength>8192){setError("Please shorten your message or company details and try again.");return;}
      pending.current={raw,id:input.submissionId};
    }
    inFlight.current=true;setPhase("sending");const attempt=pending.current;const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
    try {
      const response=await fetch("/api/contact-intake",{method:"POST",credentials:"same-origin",cache:"no-store",headers:{"Content-Type":"application/json"},body:attempt.raw,signal:controller.signal});
      const body:unknown=await response.json();
      if((response.status!==200 && response.status!==201) || !isReceipt(body,attempt.id) || (response.status===201)!==(body.status==="created"))throw Error("No confirmed receipt");
      pending.current=null;form.reset();setInterests([]);setPhase("saved");
    }catch{setPhase("unknown");setError("Your introduction has not been confirmed. Keep this page open and retry to check the same introduction safely.");}
    finally{inFlight.current=false;clearTimeout(timer);}
  }
  if(!enabled)return <section className={styles.unavailable} aria-labelledby="introduction-heading"><h2 id="introduction-heading">Let’s connect.</h2><p>Online introductions are not available yet. You can reach Andisiwe using the business contact details above.</p></section>;
  if(phase==="saved")return <section className={styles.form} aria-live="polite"><h2>Good to meet you.</h2><p>Your introduction has been recorded.</p><a className="button primary" href="/contact/andisiwe" download="andisiwe.vcf">Save Contact</a><p className={styles.hint}>Your device will ask how to add the contact.</p></section>;
  const frozen=phase!=="ready";
  return <form method="post" action="/api/contact-intake" className={styles.form} aria-labelledby="introduction-heading" onSubmit={submit}>
    <div><h2 id="introduction-heading">Let’s connect.</h2><p className={styles.hint}>A few details so Andisiwe can follow up personally.</p></div>
    <noscript><p>Please enable JavaScript to send an introduction, or use the business contact details above.</p></noscript>
    <fieldset disabled={frozen}><legend className={styles.srOnly}>Your introduction</legend>
      <label htmlFor="intro-name">Full name <span aria-hidden="true">*</span></label><input id="intro-name" name="name" required maxLength={160} autoComplete="name" />
      <div className={styles.contactGrid}><div><label htmlFor="intro-email">Email</label><input id="intro-email" name="email" type="email" maxLength={320} autoComplete="email" aria-describedby="contact-hint" /></div><div><label htmlFor="intro-phone">Phone</label><input id="intro-phone" name="phone" type="tel" maxLength={32} autoComplete="tel" aria-describedby="contact-hint" /></div></div>
      <p id="contact-hint" className={styles.hint}>Add at least one: email or phone.</p>
      <label htmlFor="intro-company">Company <span className={styles.optional}>(optional)</span></label><input id="intro-company" name="company" maxLength={160} autoComplete="organization" />
      <InterestSelect value={interests} onChange={setInterests} disabled={frozen} error={interestError}/>
      {interests.includes("other") && <><label htmlFor="intro-other">Anything specific? <span className={styles.optional}>(optional)</span></label><input id="intro-other" name="other" maxLength={160}/></>}
      <label htmlFor="intro-message">Short message <span className={styles.optional}>(optional)</span></label><textarea id="intro-message" name="message" maxLength={2000} rows={2}/>
      <label className={styles.check}><input type="checkbox" name="privacy" required/><span>I acknowledge the <Link href="/privacy" target="_blank" rel="noopener noreferrer">privacy notice</Link> and agree that Signal One may use these details to respond to my introduction. <span aria-hidden="true">*</span></span></label>
      <label className={styles.check}><input type="checkbox" name="marketing"/><span>I would also like Signal One news and offers. <span className={styles.optional}>(optional)</span></span></label>
    </fieldset>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <button type="submit" className="button primary" disabled={phase==="sending"}>{phase==="sending"?"Connecting…":phase==="unknown"?"Retry introduction":"Connect with Andisiwe"}</button>
    <p className={styles.hint}>Your details are sent securely to Signal One when you connect. Marketing is a separate choice.</p>
  </form>;
}
