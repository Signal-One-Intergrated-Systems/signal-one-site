"use client";
import { useEffect, useRef, useState } from "react";
import { INTEREST_GROUPS, INTEREST_OPTIONS, type InterestId } from "../lib/interests";
import styles from "./IntroductionForm.module.css";
export function InterestSelect({value,onChange,disabled,error}:{value:InterestId[];onChange:(value:InterestId[])=>void;disabled:boolean;error?:string}) {
  const [open,setOpen]=useState(false),[query,setQuery]=useState("");
  const root=useRef<HTMLDivElement>(null),search=useRef<HTMLInputElement>(null),trigger=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!open)return;
    search.current?.focus();
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};
    document.addEventListener("pointerdown",outside);return()=>document.removeEventListener("pointerdown",outside);
  },[open]);
  const close=()=>{setOpen(false);trigger.current?.focus();};
  const normalized=query.trim().toLocaleLowerCase("en-ZA");
  const groups=INTEREST_GROUPS.map(group=>({...group,options:group.options.filter(option=>`${group.heading} ${option.label}`.toLocaleLowerCase("en-ZA").includes(normalized))})).filter(group=>group.options.length);
  return <div ref={root} className={styles.interests} onKeyDown={event=>{if(event.key==="Escape" && open){event.preventDefault();event.stopPropagation();close();}}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setOpen(false);}}>
    <label id="interest-label" htmlFor="interest-trigger">What can Signal One help you with? <span aria-hidden="true">*</span></label>
    <div className={styles.picker}><button id="interest-trigger" ref={trigger} type="button" className={styles.trigger} aria-labelledby="interest-label interest-summary" aria-haspopup="dialog" aria-expanded={open} aria-controls="interest-dialog" aria-describedby={error?"interest-error":undefined} disabled={disabled} onClick={()=>{setOpen(!open);setQuery("");}}>
      <span id="interest-summary">{value.length?`${value.length} selected`:"Select your interests"}</span><span aria-hidden="true">⌄</span>
    </button>
    {open && <div id="interest-dialog" role="dialog" aria-label="Choose interests" className={styles.dropdown}>
      <label className={styles.searchLabel} htmlFor="interest-search">Search interests</label>
      <input ref={search} id="interest-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} autoComplete="off" placeholder="Search services or equipment" />
      <div className={styles.options}>
        {groups.map(group=><fieldset key={group.heading}><legend>{group.heading}</legend>{group.options.map(option=><label key={option.id} className={styles.option}><input type="checkbox" checked={value.includes(option.id)} onChange={event=>onChange(event.target.checked?[...value,option.id]:value.filter(id=>id!==option.id))}/><span>{option.label}</span></label>)}</fieldset>)}
        {!groups.length && <p role="status">No matching interests. Try another search.</p>}
      </div>
      <button className={styles.done} type="button" onClick={close}>Done{value.length?` · ${value.length} selected`:""}</button>
    </div>}</div>
    {value.length>0 && <ul className={styles.selections} aria-label="Selected interests">{value.map(id=><li key={id}><button type="button" disabled={disabled} aria-label={`Remove ${INTEREST_OPTIONS.find(option=>option.id===id)!.label}`} onClick={()=>onChange(value.filter(item=>item!==id))}><span>{INTEREST_OPTIONS.find(option=>option.id===id)!.label}</span><span aria-hidden="true">×</span></button></li>)}</ul>}
    {error && <p role="alert" id="interest-error" className={styles.error}>{error}</p>}
  </div>;
}
