"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const GlassGlobe=dynamic(()=>import("./GlassGlobe"),{ssr:false,loading:()=>null});
export default function HeroGlobeLayer(){
 const ref=useRef<HTMLDivElement>(null),[load,setLoad]=useState(false);
 useEffect(()=>{
  if(!ref.current)return;
  const io=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting)setLoad(true)},{rootMargin:"240px"});
  io.observe(ref.current);return()=>io.disconnect();
 },[]);
 return <div ref={ref} aria-hidden="true" className="s1-hero-globe-layer">
  <div className="s1-hero-orb-fallback" />
  {load&&<GlassGlobe/>}
 </div>;
}
