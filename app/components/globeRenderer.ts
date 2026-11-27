/**
 * The hero globe's drawing code. It runs in a Web Worker on an OffscreenCanvas where the browser supports
 * that, so the animation never blocks a tap (DR-026, INP), and on the main thread otherwise. Same geometry,
 * same draw order, same colours: the frames are pixel-identical to the previous main-thread renderer.
 */
export type GlobeHost = {
 /** CSS size and device-pixel ratio (capped at 2) of the canvas, read each frame. */
 size: () => { width: number; height: number; dpr: number };
 /** Absolute URL of the locally hosted world GeoJSON. */
 geoUrl: string;
 reduced: boolean;
};
export type GlobeController = { request: () => void; setVisible: (v: boolean) => void; setReduced: (r: boolean) => void; stop: () => void };
const frame:(cb:(t:number)=>void)=>number=(cb)=>typeof requestAnimationFrame==="function"?requestAnimationFrame(cb):(setTimeout(()=>cb(performance.now()),16) as unknown as number);
const cancel=(id:number)=>{if(typeof cancelAnimationFrame==="function")cancelAnimationFrame(id);else clearTimeout(id)};

type Point = [number,number];
type Coordinates = number[][][];
type Region = { rings: Coordinates; bounds: [number,number,number,number] };
const destinations: [string,number,number][] = [
 ["Lagos",6.46,3.38],["Nairobi",-1.29,36.82],["Cairo",30.04,31.24],
 ["London",51.51,-.13],["Dubai",25.20,55.27],["Mumbai",19.08,72.88],
 ["Singapore",1.35,103.82],["NYC",40.71,-74.01],
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
/**
 * The land dots. Same grid, same test, same points as before; computed a few latitude rows per task
 * (yielding between them) so this one-off ~300 ms job (4x-throttled phone) never blocks a tap (INP, W2).
 * Resolves null if the globe unmounts meanwhile.
 */
async function buildLand(regions:Region[],alive:()=>boolean):Promise<Point[]|null> {
 const points:Point[]=[];
 let rows=0;
 await new Promise(resolve=>setTimeout(resolve,0));if(!alive())return null;
 for(let lat=-85;lat<=85;lat+=2.8){
  for(let lon=-180;lon<180;lon+=2.8){
   for(const region of regions){
    const [left,right,bottom,top]=region.bounds;
    if(lon<left||lon>right||lat<bottom||lat>top)continue;
    if(inside(lon,lat,region.rings[0])&&!region.rings.slice(1).some(h=>inside(lon,lat,h))){
     points.push([lat,lon]);break;
    }
   }
  }
  if(++rows%4===0){await new Promise(resolve=>setTimeout(resolve,0));if(!alive())return null;}
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
 const height=1.004; // Earth-hugging surface route, never an elevated orbital arc.
 return [(a[0]*u+b[0]*v)*height,(a[1]*u+b[1]*v)*height,(a[2]*u+b[2]*v)*height] as [number,number,number];
}
/** Unit vectors as a flat [x,y,z,...] array: computed once, so a frame only rotates them (DR-026, INP). */
function vectors(points:Array<[number,number]>):Float64Array{
 const out=new Float64Array(points.length*3);
 points.forEach(([lat,lon],i)=>{const v=vector(lat,lon);out[i*3]=v[0];out[i*3+1]=v[1];out[i*3+2]=v[2];});
 return out;
}
const GRID_LAT:Float64Array[]=[];
for(let lat=-75;lat<=75;lat+=15){const row:Array<[number,number]>=[];for(let lon=-180;lon<=180;lon+=3)row.push([lat,lon]);GRID_LAT.push(vectors(row));}
const GRID_LON:Float64Array[]=[];
for(let lon=-180;lon<180;lon+=15){const col:Array<[number,number]>=[];for(let lat=-90;lat<=90;lat+=3)col.push([lat,lon]);GRID_LON.push(vectors(col));}
const ORIGIN_V=vector(...ORIGIN);
const DEST_V=destinations.map(([,lat,lon])=>vector(lat,lon));
// Each route's 66 static points (the moving pulse is still computed per frame).
const ROUTES=DEST_V.map(dest=>{const out=new Float64Array(66*3);for(let n=0;n<=65;n++){const v=interpolateArc(ORIGIN_V,dest,n/65);out[n*3]=v[0];out[n*3+1]=v[1];out[n*3+2]=v[2];}return out;});
export function runGlobe(target:HTMLCanvasElement|OffscreenCanvas,host:GlobeHost):GlobeController|null{

  const el=target;
  const ctx=el.getContext("2d") as CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D|null;if(!ctx)return null;
  let alive=true,raf=0,visible=true,reduced=host.reduced;
  let land:Float64Array=new Float64Array(0);
  let coastlines:Float64Array[]=[];
  let southAfricaOutline:Float64Array=new Float64Array(0);
  // Locally hosted world geometry; data only, never executable source.
  fetch(host.geoUrl)
   .then(r=>{if(!r.ok)throw Error("geography unavailable");return r.json()})
   .then(async data=>{if(alive){
     const regions=regionsFromGeoJSON(data);
     const points=await buildLand(regions,()=>alive);
     if(!points)return;
     // Coastlines, land and the South Africa outline appear together, exactly as before.
     land=vectors(points);
     coastlines=regions.map(region=>vectors(region.rings[0].map(([lon,lat])=>[lat,lon] as [number,number])));
     const sa=(data.features||[]).find((f:any)=>f.properties?.name==="South Africa");
     const saRing:number[][]=sa?.geometry?.type==="Polygon"?sa.geometry.coordinates[0]:sa?.geometry?.type==="MultiPolygon"?sa.geometry.coordinates[0][0]:[];
     southAfricaOutline=vectors(saRing.map(([lon,lat])=>[lat,lon] as [number,number]));
     request();
   }})
   .catch(()=>{ /* Render the ocean and grid if geographic data cannot load. */ });
  // Rotation terms are set once per frame; every point then needs only multiplications.
  let cyaw=1,syaw=0,ctilt=1,stilt=0,px=0,py=0,pd=0;
  const rotate=(yaw:number,tilt:number)=>{cyaw=Math.cos(yaw);syaw=Math.sin(yaw);ctilt=Math.cos(tilt);stilt=Math.sin(tilt);};
  /** Projects vector i of a flat table into px, py, pd (no allocation). */
  const at=(t:Float64Array,i:number,cx:number,cy:number,r:number)=>{
   const x=t[i*3],y=t[i*3+1],z=t[i*3+2];
   const xx=x*cyaw-z*syaw;
   const zz=x*syaw+z*cyaw;
   const yy=y*ctilt-zz*stilt;
   pd=y*stilt+zz*ctilt;px=cx+xx*r;py=cy-yy*r;
  };
  const project=(v:[number,number,number],_yaw:number,_tilt:number,cx:number,cy:number,r:number) => {
   const xx=v[0]*cyaw-v[2]*syaw;
   const zz=v[0]*syaw+v[2]*cyaw;
   const yy=v[1]*ctilt-zz*stilt;
   const depth=v[1]*stilt+zz*ctilt;
   return [cx+xx*r,cy-yy*r,depth] as const;
  };
  /** One polyline over a vector table, broken where it passes behind the sphere. */
  const polyline=(t:Float64Array,cx:number,cy:number,r:number,cut:number,inclusive:boolean)=>{
   ctx.beginPath();let started=false;
   for(let i=0,n=t.length/3;i<n;i++){
    at(t,i,cx,cy,r);
    if(inclusive?pd<=cut:!(pd>cut)){started=false;continue}
    if(!started){ctx.moveTo(px,py);started=true}else ctx.lineTo(px,py);
   }
   ctx.stroke();
  };
  const draw=(stamp:number)=>{
   raf=0;if(!alive||!visible)return;
   const size=host.size();
   const dpr=size.dpr;
   const width=size.width,height=size.height;
   if(!width||!height)return;
   const w=Math.round(width*dpr),h=Math.round(height*dpr);
   if(el.width!==w||el.height!==h){el.width=w;el.height=h}
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   const cx=width*.48,cy=height*.50,r=Math.min(width*.46,height*.47);
   const yaw=28*RAD+(reduced?0:stamp*.00009),tilt=-12*RAD;
   rotate(yaw,tilt);
   const halo=ctx.createRadialGradient(cx,cy,r*.54,cx,cy,r*1.45);
   halo.addColorStop(0,"rgba(63,169,245,.035)");halo.addColorStop(.72,"rgba(63,169,245,.09)");halo.addColorStop(1,"rgba(63,169,245,0)");
   ctx.fillStyle=halo;ctx.beginPath();ctx.arc(cx,cy,r*1.45,0,Math.PI*2);ctx.fill();
   const sea=ctx.createRadialGradient(cx-r*.28,cy-r*.3,r*.05,cx,cy,r);
   sea.addColorStop(0,"rgba(70,154,218,.24)");sea.addColorStop(.58,"rgba(9,51,101,.43)");sea.addColorStop(1,"rgba(2,16,47,.72)");
   ctx.fillStyle=sea;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
   const sheen=ctx.createRadialGradient(cx-r*.46,cy-r*.48,r*.02,cx-r*.12,cy-r*.18,r*1.12);
   sheen.addColorStop(0,"rgba(220,249,255,.27)");
   sheen.addColorStop(.42,"rgba(117,200,253,.075)");
   sheen.addColorStop(1,"rgba(7,32,65,0)");
   ctx.fillStyle=sheen;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
   ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);ctx.clip();
   // Fine latitude/longitude lines reinforce spherical depth without a flat atlas.
   ctx.strokeStyle="rgba(84,158,215,.13)";ctx.lineWidth=.65;
   for(const line of GRID_LAT)polyline(line,cx,cy,r,.02,false);
   for(const line of GRID_LON)polyline(line,cx,cy,r,.02,false);
   ctx.fillStyle="rgba(165,229,255,.95)";
   const dot=Math.max(.95,1.50*r/260);
   for(let i=0,n=land.length/3;i<n;i++){
    at(land,i,cx,cy,r);
    if(pd>0){ctx.globalAlpha=.28+.72*pd;ctx.beginPath();ctx.arc(px,py,dot,0,2*Math.PI);ctx.fill();}
   }ctx.globalAlpha=1;
   ctx.restore();
   // Accurate geography: trace the coastlines and island contours on the sphere.
   // The locally hosted GeoJSON retains its original polygon geometry.
   ctx.strokeStyle="rgba(145,207,246,.48)";ctx.lineWidth=.7;
   for(const outline of coastlines)polyline(outline,cx,cy,r*1.002,.015,true);
   if(southAfricaOutline.length){
     ctx.strokeStyle="rgba(197,240,255,.98)";ctx.lineWidth=2.2;
     ctx.shadowColor="#3FA9F5";ctx.shadowBlur=12;
     polyline(southAfricaOutline,cx,cy,r*1.012,0,true);
     ctx.shadowBlur=0;
   }
   const origin=ORIGIN_V;
   destinations.forEach((_d,i)=>{
    const dest=DEST_V[i];
    ctx.strokeStyle="rgba(82,184,245,.62)";ctx.lineWidth=1.15;
    polyline(ROUTES[i],cx,cy,r,.015,true);
    const t=(reduced?.72:(stamp*.00017+i*.115)%1);
    const pulse=project(interpolateArc(origin,dest,t),yaw,tilt,cx,cy,r);
    if(pulse[2] > .015){
     ctx.shadowBlur=22;ctx.shadowColor="#3FA9F5";ctx.fillStyle="#f7fdff";
     ctx.beginPath();ctx.arc(pulse[0],pulse[1],3.5,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;
    }
    const node=project(dest,yaw,tilt,cx,cy,r);
    if(node[2]>.015){ctx.fillStyle="rgba(165,224,255,.95)";ctx.beginPath();ctx.arc(node[0],node[1],2.6,0,2*Math.PI);ctx.fill();}
   });
   const j=project(origin,yaw,tilt,cx,cy,r);
   if(j[2]>0){
    const ripple=reduced?0:(stamp*.0005)%1;
    ctx.strokeStyle="rgba(63,169,245,"+(.55*(1-ripple))+")";ctx.lineWidth=1.4;
    ctx.beginPath();ctx.arc(j[0],j[1],9+ripple*20,0,2*Math.PI);ctx.stroke();
    ctx.shadowColor="#3FA9F5";ctx.shadowBlur=32;ctx.fillStyle="#fff";
    ctx.beginPath();ctx.arc(j[0],j[1],6.5,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;
    ctx.font="600 11px sans-serif";ctx.textAlign="left";ctx.textBaseline="middle";
    ctx.shadowBlur=7;ctx.shadowColor="rgba(1,11,25,.95)";
    ctx.fillStyle="#e7f7ff";ctx.fillText("JOHANNESBURG",j[0]+16,j[1]-16);ctx.shadowBlur=0;
   }
   ctx.strokeStyle="rgba(185,231,255,.77)";ctx.lineWidth=2.2;
   ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
   if(!reduced)raf=frame(draw);
  };
  const request=()=>{if(!raf&&visible&&alive)raf=frame(draw)};
  request();
  return {
   request,
   setVisible:(v:boolean)=>{visible=v;if(visible)request()},
   setReduced:(r:boolean)=>{reduced=r;cancel(raf);raf=0;request()},
   stop:()=>{alive=false;cancel(raf);raf=0},
  };
}
