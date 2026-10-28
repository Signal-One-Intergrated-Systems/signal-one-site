"use client";
import { useEffect, useRef } from "react";

type Point = [number,number];
type Coordinates = number[][][];
type Region = { rings: Coordinates; bounds: [number,number,number,number] };
const destinations: [string,number,number][] = [
 ["Lagos",6.46,3.38],["Nairobi",-1.29,36.82],["Cairo",30.04,31.24],
 ["London",51.51,-.13],["Dubai",25.20,55.27],["Mumbai",19.08,72.88],
 ["Singapore",1.35,103.82],["New York",40.71,-74.01],
 ["São Paulo",-23.55,-46.63],["Sydney",-33.87,151.21]
];
const ORIGIN:[number,number]=[-26.2,28.0];
const RAD=Math.PI/180;
function inside(lon:number,lat:number,ring:number[][]) {
 let hit=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=ring[i],b=ring[j];
  if(((a[1]>lat)!==(b[1]>lat))&&(lon<(b[0]-a[0])*(lat-a[1])/(b[1]-a[1]+1e-9)+a[0]))hit=!hit;
 }
 return hit;
}
function regionsFromGeoJSON(json:any):Region[] {
 const regions:Region[]=[];
 for(const feature of json.features||[]) {
  const geometry=feature.geometry;
  if(!geometry)continue;
  const polygons=geometry.type==="Polygon"?[geometry.coordinates]:geometry.type==="MultiPolygon"?geometry.coordinates:[];
  for(const rings of polygons) {
   const outer=rings[0] as number[][];
   if(!outer||outer.length<3)continue;
   const xs=outer.map(v=>v[0]),ys=outer.map(v=>v[1]);
   regions.push({rings,bounds:[Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)]});
  }
 }
 return regions;
}
function buildLand(regions:Region[]):Point[] {
 const points:Point[]=[];
 for(let lat=-85;lat<=85;lat+=2.8)for(let lon=-180;lon<180;lon+=2.8){
  for(const region of regions){
   const [left,right,bottom,top]=region.bounds;
   if(lon<left||lon>right||lat<bottom||lat>top)continue;
   if(inside(lon,lat,region.rings[0])&&!region.rings.slice(1).some(h=>inside(lon,lat,h))){
    points.push([lat,lon]);break;
   }
  }
 }
 return points;
}
function vector(lat:number,lon:number):[number,number,number]{
 const a=lat*RAD,b=lon*RAD;
 return [Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b)];
}
function interpolateArc(a:[number,number,number],b:[number,number,number],t:number) {
 const angle=Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2])));
 const sin=Math.sin(angle)||1;
 const u=Math.sin((1-t)*angle)/sin,v=Math.sin(t*angle)/sin;
 const height=1+.20*Math.sin(Math.PI*t);
 return [(a[0]*u+b[0]*v)*height,(a[1]*u+b[1]*v)*height,(a[2]*u+b[2]*v)*height] as [number,number,number];
}
export default function GlassGlobe(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;
  const ctx=el.getContext("2d");if(!ctx)return;
  let alive=true,raf=0,visible=true,reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let land:Point[]=[];
  // Natural Earth-derived geographic boundaries; data only, never executable source.
  fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
   .then(r=>{if(!r.ok)throw Error("geography unavailable");return r.json()})
   .then(data=>{if(alive)land=buildLand(regionsFromGeoJSON(data))})
   .catch(()=>{ /* Render the ocean and grid if geographic data cannot load. */ });
  const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)request()}, {threshold:0.02});
  io.observe(el);
  const project=(v:[number,number,number],yaw:number,tilt:number,cx:number,cy:number,r:number) => {
   const xx=v[0]*Math.cos(yaw)-v[2]*Math.sin(yaw);
   const zz=v[0]*Math.sin(yaw)+v[2]*Math.cos(yaw);
   const yy=v[1]*Math.cos(tilt)-zz*Math.sin(tilt);
   const depth=v[1]*Math.sin(tilt)+zz*Math.cos(tilt);
   return [cx+xx*r,cy-yy*r,depth] as const;
  };
  const draw=(stamp:number)=>{
   raf=0;if(!alive||!visible)return;
   const dpr=Math.min(devicePixelRatio||1,2);
   const rect=el.getBoundingClientRect();
   const width=rect.width,height=rect.height;
   if(!width||!height)return;
   const w=Math.round(width*dpr),h=Math.round(height*dpr);
   if(el.width!==w||el.height!==h){el.width=w;el.height=h}
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   const cx=width*.55,cy=height*.50,r=Math.min(width*.43,height*.47);
   const yaw=28*RAD+(reduced?0:stamp*.00005),tilt=-12*RAD;
   const halo=ctx.createRadialGradient(cx,cy,r*.54,cx,cy,r*1.45);
   halo.addColorStop(0,"rgba(63,169,245,.035)");halo.addColorStop(.72,"rgba(63,169,245,.09)");halo.addColorStop(1,"rgba(63,169,245,0)");
   ctx.fillStyle=halo;ctx.beginPath();ctx.arc(cx,cy,r*1.45,0,Math.PI*2);ctx.fill();
   const sea=ctx.createRadialGradient(cx-r*.28,cy-r*.3,r*.05,cx,cy,r);
   sea.addColorStop(0,"rgba(223,247,255,.18)");sea.addColorStop(.7,"rgba(38,101,159,.15)");sea.addColorStop(1,"rgba(6,38,76,.35)");
   ctx.fillStyle=sea;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
   ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);ctx.clip();
   // Fine latitude/longitude lines reinforce spherical depth without a flat atlas.
   ctx.strokeStyle="rgba(97,187,242,.15)";ctx.lineWidth=.65;
   for(let lat=-75;lat<=75;lat+=15){
    ctx.beginPath();let started=false;
    for(let lon=-180;lon<=180;lon+=3){
     const p=project(vector(lat,lon),yaw,tilt,cx,cy,r);
     if(p[2]>.02){if(!started){ctx.moveTo(p[0],p[1]);started=true}else ctx.lineTo(p[0],p[1]);}
     else started=false;
    }ctx.stroke();
   }
   for(let lon=-180;lon<180;lon+=15){
    ctx.beginPath();let started=false;
    for(let lat=-90;lat<=90;lat+=3){
     const p=project(vector(lat,lon),yaw,tilt,cx,cy,r);
     if(p[2]>.02){if(!started){ctx.moveTo(p[0],p[1]);started=true}else ctx.lineTo(p[0],p[1]);}
     else started=false;
    }ctx.stroke();
   }
   ctx.fillStyle="rgba(135,211,255,.76)";
   for(const [lat,lon] of land){
    const p=project(vector(lat,lon),yaw,tilt,cx,cy,r);
    if(p[2]>0){ctx.globalAlpha=.28+.72*p[2];ctx.beginPath();ctx.arc(p[0],p[1],Math.max(.65,1.07*r/260),0,2*Math.PI);ctx.fill();}
   }ctx.globalAlpha=1;
   ctx.restore();
   const origin=vector(...ORIGIN);
   destinations.forEach(([name,lat,lon],i)=>{
    const dest=vector(lat,lon);let prev=false;
    ctx.strokeStyle="rgba(63,169,245,.52)";ctx.lineWidth=1.1;ctx.beginPath();
    for(let n=0;n<=65;n++){
     const p=project(interpolateArc(origin,dest,n/65),yaw,tilt,cx,cy,r);
     if(p[2]<-.1){prev=false;continue}
     if(!prev)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);prev=true;
    }ctx.stroke();
    const t=(reduced?.72:(stamp*.00010+i*.115)%1);
    const pulse=project(interpolateArc(origin,dest,t),yaw,tilt,cx,cy,r);
    if(pulse[2] > -.1){
     ctx.shadowBlur=14;ctx.shadowColor="#3FA9F5";ctx.fillStyle="#e6f8ff";
     ctx.beginPath();ctx.arc(pulse[0],pulse[1],2.8,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;
    }
    const node=project(dest,yaw,tilt,cx,cy,r);
    if(node[2]>0){ctx.fillStyle="rgba(127,208,255,.85)";ctx.beginPath();ctx.arc(node[0],node[1],2.3,0,2*Math.PI);ctx.fill();}
   });
   const j=project(origin,yaw,tilt,cx,cy,r);
   if(j[2]>0){
    const ripple=reduced?0:(stamp*.0005)%1;
    ctx.strokeStyle="rgba(63,169,245,"+(.55*(1-ripple))+")";ctx.lineWidth=1.4;
    ctx.beginPath();ctx.arc(j[0],j[1],9+ripple*20,0,2*Math.PI);ctx.stroke();
    ctx.shadowColor="#3FA9F5";ctx.shadowBlur=24;ctx.fillStyle="#fff";
    ctx.beginPath();ctx.arc(j[0],j[1],5,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;
   }
   ctx.strokeStyle="rgba(126,212,255,.6)";ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
   if(!reduced)raf=requestAnimationFrame(draw);
  };
  const request=()=>{if(!raf&&visible)raf=requestAnimationFrame(draw)};
  const motion=matchMedia("(prefers-reduced-motion: reduce)");
  const changed=()=>{reduced=motion.matches;cancelAnimationFrame(raf);raf=0;request()};
  motion.addEventListener("change",changed);
  const ro=new ResizeObserver(request);ro.observe(el);request();
  return ()=>{alive=false;cancelAnimationFrame(raf);io.disconnect();ro.disconnect();motion.removeEventListener("change",changed)};
 },[]);
 return <canvas ref={canvas} className="s1-hero-globe-canvas" role="img" aria-label="Glass globe showing light paths from Johannesburg to ten international cities" />;
}
