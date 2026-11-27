"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { onAfterLoad } from "./AfterLoad";

const GlassGlobe=dynamic(()=>import("./GlassGlobe"),{ssr:false,loading:()=>null});
export default function HeroGlobeLayer(){
 const ref=useRef<HTMLDivElement>(null),[load,setLoad]=useState(false);
 useEffect(()=>{
  if(!ref.current)return;
  // DR-003: the globe and its 250 KB of geography start after the page has loaded, so they never
  // compete with the hero photograph. The fallback orb shows until then.
  const el=ref.current;let io:IntersectionObserver|null=null;
  const stop=onAfterLoad(()=>{io=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting)setLoad(true)},{rootMargin:"240px"});io.observe(el)});
  return()=>{stop();io?.disconnect()};
 },[]);
 return <div ref={ref} aria-hidden="true" className="s1-hero-globe-layer">
  <div className="s1-hero-orb-fallback" />
  {load&&<GlassGlobe/>}
 </div>;
}
