"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ================================================================
   MIME — Design Token Learning Platform
   
   5 interactive tools:
   1. Token Flow     — mind map: primitive → semantic → component
   2. N-Dim Matrix   — how dimensions compose tokens
   3. Simulator      — build a system, see decisions cascade
   4. Debt Lab       — cost of skipping the token layer
   5. Naming Game    — learn naming conventions by doing
================================================================ */

/* ── Shell palette ─────────────────────────────────────────────── */
const SH = {
  bg:    "#F3EFE8",
  paper: "#FEFCF9",
  ink:   "#1C1A17",
  ink2:  "#52493F",
  ink3:  "#9A9087",
  ink4:  "#CEC6BA",
  rule:  "#E5DDD2",
  brand: "#C85A1E",
};

/* ================================================================
   TOOL 1 — TOKEN FLOW (Left-to-right mind map)
================================================================ */

const TF_TIER = {
  primitive: { node:"#B8460F", bg:"#FFF4EE", bd:"#F4B8A0", text:"#7A2D08", line:"#F4B8A0" },
  semantic:  { node:"#1A5FB4", bg:"#EBF4FF", bd:"#93C5FD", text:"#0F3D7A", line:"#93C5FD" },
  comptoken: { node:"#176E3C", bg:"#EDFAF3", bd:"#86EFAC", text:"#0C4226", line:"#86EFAC" },
  component: { node:"#5B3FA8", bg:"#F3EEFF", bd:"#C4B5FD", text:"#3B2577", line:"#C4B5FD" },
};
const TF_COL_X = { primitive:0, semantic:260, comptoken:520, component:790 };
const TF_COL_W = { primitive:190, semantic:190, comptoken:196, component:148 };
const TF_NH = 28; const TF_NG = 7; const TF_GG = 14;
interface TFNode {
  id: string;
  label: string;
  tier: string;
  group?: string;
  x: number;
  y: number;
}

const TF_GC: Record<string, string> = { color:"#C0531F",typo:"#7B3FA0",spacing:"#1A5FB4",radius:"#176E3C",shadow:"#B45309",motion:"#B91C1C",sizing:"#047857",opacity:"#553C9A",zindex:"#0E7490",button:"#1A5FB4",input:"#176E3C",badge:"#B45309",tooltip:"#7B3FA0",card:"#C0531F",modal:"#553C9A" };

const TF_NODES = [
  {id:"pc04",label:"--color-blue-600",tier:"primitive",group:"color"},{id:"pc05",label:"--color-blue-700",tier:"primitive",group:"color"},{id:"pc01",label:"--color-blue-50",tier:"primitive",group:"color"},{id:"pc11",label:"--color-gray-900",tier:"primitive",group:"color"},{id:"pc12",label:"--color-white",tier:"primitive",group:"color"},{id:"pc09",label:"--color-gray-400",tier:"primitive",group:"color"},{id:"pc07",label:"--color-gray-200",tier:"primitive",group:"color"},{id:"pc14",label:"--color-red-600",tier:"primitive",group:"color"},{id:"pc13",label:"--color-red-100",tier:"primitive",group:"color"},{id:"pc16",label:"--color-green-600",tier:"primitive",group:"color"},{id:"pc15",label:"--color-green-100",tier:"primitive",group:"color"},
  {id:"pt02",label:"--font-size-sm",tier:"primitive",group:"typo"},{id:"pt03",label:"--font-size-md",tier:"primitive",group:"typo"},{id:"pt01",label:"--font-size-xs",tier:"primitive",group:"typo"},{id:"pt07",label:"--fw-medium",tier:"primitive",group:"typo"},{id:"pt06",label:"--fw-normal",tier:"primitive",group:"typo"},{id:"pt12",label:"--tracking-wide",tier:"primitive",group:"typo"},{id:"pt13",label:"--tracking-wider",tier:"primitive",group:"typo"},
  {id:"ps03",label:"--sp-4",tier:"primitive",group:"spacing"},{id:"ps02",label:"--sp-2",tier:"primitive",group:"spacing"},{id:"ps01",label:"--sp-1",tier:"primitive",group:"spacing"},{id:"ps04",label:"--sp-6",tier:"primitive",group:"spacing"},
  {id:"pr03",label:"--radius-md",tier:"primitive",group:"radius"},{id:"pr04",label:"--radius-lg",tier:"primitive",group:"radius"},{id:"pr06",label:"--radius-full",tier:"primitive",group:"radius"},{id:"pr02",label:"--radius-sm",tier:"primitive",group:"radius"},
  {id:"psh1",label:"--shadow-xs",tier:"primitive",group:"shadow"},{id:"psh3",label:"--shadow-lg",tier:"primitive",group:"shadow"},
  {id:"pm01",label:"--dur-100",tier:"primitive",group:"motion"},{id:"pm04",label:"--ease-out",tier:"primitive",group:"motion"},{id:"pm02",label:"--dur-200",tier:"primitive",group:"motion"},
  {id:"pz02",label:"--sz-40",tier:"primitive",group:"sizing"},{id:"po02",label:"--op-40",tier:"primitive",group:"opacity"},{id:"pzi3",label:"--z-300",tier:"primitive",group:"zindex"},

  {id:"sc11",label:"--color-action-primary",tier:"semantic",group:"color"},{id:"sc12",label:"--color-action-hover",tier:"semantic",group:"color"},{id:"sc13",label:"--color-action-bg",tier:"semantic",group:"color"},{id:"sc03",label:"--color-text-primary",tier:"semantic",group:"color"},{id:"sc06",label:"--color-text-inverse",tier:"semantic",group:"color"},{id:"sc07",label:"--color-text-placeholder",tier:"semantic",group:"color"},{id:"sc08",label:"--color-border",tier:"semantic",group:"color"},{id:"sc10",label:"--color-focus-ring",tier:"semantic",group:"color"},{id:"sc16",label:"--color-error",tier:"semantic",group:"color"},{id:"sc17",label:"--color-error-bg",tier:"semantic",group:"color"},{id:"sc14",label:"--color-success",tier:"semantic",group:"color"},{id:"sc15",label:"--color-success-bg",tier:"semantic",group:"color"},{id:"sc02",label:"--color-bg-surface",tier:"semantic",group:"color"},
  {id:"st09",label:"--text-btn",tier:"semantic",group:"typo"},{id:"st04",label:"--text-body",tier:"semantic",group:"typo"},{id:"st05",label:"--text-label",tier:"semantic",group:"typo"},{id:"st08",label:"--text-badge",tier:"semantic",group:"typo"},{id:"st10",label:"--text-tooltip",tier:"semantic",group:"typo"},{id:"st07",label:"--text-helper",tier:"semantic",group:"typo"},
  {id:"ss03",label:"--inset-md",tier:"semantic",group:"spacing"},{id:"ss02",label:"--inset-sm",tier:"semantic",group:"spacing"},{id:"ss04",label:"--inset-lg",tier:"semantic",group:"spacing"},{id:"ss05",label:"--gap-xs",tier:"semantic",group:"spacing"},
  {id:"sr01",label:"--r-interactive",tier:"semantic",group:"radius"},{id:"sr02",label:"--r-container",tier:"semantic",group:"radius"},{id:"sr04",label:"--r-pill",tier:"semantic",group:"radius"},{id:"sr05",label:"--r-tooltip",tier:"semantic",group:"radius"},
  {id:"ssh1",label:"--elev-1",tier:"semantic",group:"shadow"},{id:"ssh3",label:"--elev-4",tier:"semantic",group:"shadow"},
  {id:"sm01",label:"--motion-hover",tier:"semantic",group:"motion"},{id:"sm03",label:"--motion-appear",tier:"semantic",group:"motion"},
  {id:"sz02",label:"--sz-ctrl-md",tier:"semantic",group:"sizing"},{id:"sop1",label:"--opacity-disabled",tier:"semantic",group:"opacity"},{id:"szi3",label:"--z-overlay",tier:"semantic",group:"zindex"},

  {id:"cb01",label:"--btn-bg",tier:"comptoken",group:"button"},{id:"cb02",label:"--btn-hover-bg",tier:"comptoken",group:"button"},{id:"cb03",label:"--btn-text",tier:"comptoken",group:"button"},{id:"cb04",label:"--btn-font-size",tier:"comptoken",group:"button"},{id:"cb09",label:"--btn-radius",tier:"comptoken",group:"button"},{id:"cb10",label:"--btn-shadow",tier:"comptoken",group:"button"},{id:"cb11",label:"--btn-height",tier:"comptoken",group:"button"},{id:"cb13",label:"--btn-transition",tier:"comptoken",group:"button"},{id:"cb14",label:"--btn-focus-ring",tier:"comptoken",group:"button"},{id:"cb12",label:"--btn-disabled-op",tier:"comptoken",group:"button"},
  {id:"ci01",label:"--input-bg",tier:"comptoken",group:"input"},{id:"ci04",label:"--input-border",tier:"comptoken",group:"input"},{id:"ci05",label:"--input-border-focus",tier:"comptoken",group:"input"},{id:"ci06",label:"--input-border-error",tier:"comptoken",group:"input"},{id:"ci07",label:"--input-font-size",tier:"comptoken",group:"input"},{id:"ci08",label:"--input-height",tier:"comptoken",group:"input"},{id:"ci09",label:"--input-radius",tier:"comptoken",group:"input"},{id:"ci13",label:"--form-label-size",tier:"comptoken",group:"input"},{id:"ci15",label:"--form-error-color",tier:"comptoken",group:"input"},
  {id:"cbg1",label:"--badge-bg-success",tier:"comptoken",group:"badge"},{id:"cbg2",label:"--badge-bg-error",tier:"comptoken",group:"badge"},{id:"cbg7",label:"--badge-font-size",tier:"comptoken",group:"badge"},{id:"cbg0",label:"--badge-radius",tier:"comptoken",group:"badge"},
  {id:"ctt1",label:"--tooltip-bg",tier:"comptoken",group:"tooltip"},{id:"ctt3",label:"--tooltip-font-size",tier:"comptoken",group:"tooltip"},{id:"ctt4",label:"--tooltip-radius",tier:"comptoken",group:"tooltip"},{id:"ctt5",label:"--tooltip-shadow",tier:"comptoken",group:"tooltip"},{id:"ctt6",label:"--tooltip-z",tier:"comptoken",group:"tooltip"},
  {id:"ccd1",label:"--card-bg",tier:"comptoken",group:"card"},{id:"ccd2",label:"--card-shadow",tier:"comptoken",group:"card"},{id:"ccd3",label:"--card-radius",tier:"comptoken",group:"card"},
  {id:"cmo1",label:"--modal-bg",tier:"comptoken",group:"modal"},{id:"cmo2",label:"--modal-shadow",tier:"comptoken",group:"modal"},{id:"cmo5",label:"--modal-z",tier:"comptoken",group:"modal"},

  {id:"cmp1",label:"Button",tier:"component"},{id:"cmp2",label:"Input",tier:"component"},{id:"cmp3",label:"Badge",tier:"component"},{id:"cmp4",label:"Tooltip",tier:"component"},{id:"cmp5",label:"Card",tier:"component"},{id:"cmp6",label:"Modal",tier:"component"},{id:"cmp7",label:"Select",tier:"component"},{id:"cmp8",label:"Checkbox",tier:"component"},{id:"cmp9",label:"Toggle",tier:"component"},
];

const TF_EDGES = [
  ["pc04","sc11"],["pc05","sc12"],["pc01","sc13"],["pc11","sc03"],["pc12","sc06"],["pc09","sc07"],["pc07","sc08"],["pc04","sc10"],["pc14","sc16"],["pc13","sc17"],["pc16","sc14"],["pc15","sc15"],["pc12","sc02"],
  ["pt02","st09"],["pt07","st09"],["pt12","st09"],["pt03","st04"],["pt06","st04"],["pt02","st05"],["pt07","st05"],["pt12","st05"],["pt01","st08"],["pt07","st08"],["pt13","st08"],["pt01","st10"],["pt06","st10"],["pt01","st07"],["pt06","st07"],
  ["ps03","ss03"],["ps02","ss02"],["ps04","ss04"],["ps01","ss05"],
  ["pr03","sr01"],["pr04","sr02"],["pr06","sr04"],["pr02","sr05"],
  ["psh1","ssh1"],["psh3","ssh3"],
  ["pm01","sm01"],["pm04","sm01"],["pm02","sm03"],["pm04","sm03"],
  ["pz02","sz02"],["po02","sop1"],["pzi3","szi3"],

  ["sc11","cb01"],["sc12","cb02"],["sc06","cb03"],["st09","cb04"],["sr01","cb09"],["ssh1","cb10"],["sz02","cb11"],["sm01","cb13"],["sc10","cb14"],["sop1","cb12"],
  ["sc02","ci01"],["sc08","ci04"],["sc10","ci05"],["sc16","ci06"],["st04","ci07"],["sz02","ci08"],["sr01","ci09"],["st05","ci13"],["sc16","ci15"],
  ["sc15","cbg1"],["sc17","cbg2"],["st08","cbg7"],["sr04","cbg0"],
  ["sc03","ctt1"],["st10","ctt3"],["sr05","ctt4"],["ssh3","ctt5"],["szi3","ctt6"],
  ["sc02","ccd1"],["ssh1","ccd2"],["sr02","ccd3"],
  ["sc02","cmo1"],["ssh3","cmo2"],["szi3","cmo5"],

  ["cb01","cmp1"],["cb02","cmp1"],["cb03","cmp1"],["cb04","cmp1"],["cb09","cmp1"],["cb10","cmp1"],["cb11","cmp1"],["cb13","cmp1"],["cb14","cmp1"],["cb12","cmp1"],
  ["ci01","cmp2"],["ci04","cmp2"],["ci05","cmp2"],["ci06","cmp2"],["ci07","cmp2"],["ci08","cmp2"],["ci09","cmp2"],["ci13","cmp2"],["ci15","cmp2"],
  ["cbg1","cmp3"],["cbg2","cmp3"],["cbg7","cmp3"],["cbg0","cmp3"],
  ["ctt1","cmp4"],["ctt3","cmp4"],["ctt4","cmp4"],["ctt5","cmp4"],["ctt6","cmp4"],
  ["ccd1","cmp5"],["ccd2","cmp5"],["ccd3","cmp5"],
  ["cmo1","cmp6"],["cmo2","cmp6"],["cmo5","cmp6"],
  ["ci04","cmp7"],["ci05","cmp7"],["ci08","cmp7"],["ci09","cmp7"],
  ["ci04","cmp8"],["ci05","cmp8"],["cb01","cmp8"],
  ["cb01","cmp9"],["cb02","cmp9"],["cb13","cmp9"],
];

function tfBuildPos(nodes: any[]): Record<string, TFNode> {
  const cols: Record<string, any[]> = {};
  ["primitive","semantic","comptoken","component"].forEach(t=>{cols[t]=[];});
  nodes.forEach(n=>cols[n.tier]&&cols[n.tier].push(n));
  const groupOrder = {
    primitive:["color","typo","spacing","radius","shadow","motion","sizing","opacity","zindex"],
    semantic: ["color","typo","spacing","radius","shadow","motion","sizing","opacity","zindex"],
    comptoken:["button","input","badge","tooltip","card","modal"],
    component:[""],
  };
  const pos={};
  ["primitive","semantic","comptoken","component"].forEach(tier=>{
    const order=groupOrder[tier]||[""];
    const sorted=[...cols[tier]].sort((a,b)=>{
      const ia=order.indexOf(a.group||""),ib=order.indexOf(b.group||"");
      return (ia<0?999:ia)-(ib<0?999:ib);
    });
    let y=44,lastG=null;
    sorted.forEach(n=>{
      const g=n.group||"";
      if(lastG!==null&&g!==lastG)y+=TF_GG;
      lastG=g;
      pos[n.id]={...n,x:TF_COL_X[tier],y};
      y+=TF_NH+TF_NG;
    });
  });
  return pos;
}
const TF_POS=tfBuildPos(TF_NODES);

function tfGetSub(startId: string): { nSet: Set<string>, eSet: Set<number> } {
  const nSet=new Set<string>([startId]);
  const eSet=new Set<number>();
  let changed=true;
  while(changed){
    changed=false;
    TF_EDGES.forEach(([f,t],i)=>{
      if(nSet.has(t)&&!nSet.has(f)){nSet.add(f);eSet.add(i);changed=true;}
    });
  }
  TF_EDGES.forEach(([f,t],i)=>{if(f===startId){nSet.add(t);eSet.add(i);}});
  return{nSet,eSet};
}

function tfGroupHeaders(){
  const seen: Record<string, boolean> = {}; const out: any[] = [];
  Object.values(TF_POS).forEach((n: TFNode) => {
    const k=n.tier+":"+n.group;
    if(!seen[k]&&n.group){seen[k]=true;out.push({tier:n.tier,group:n.group,x:TF_COL_X[n.tier as keyof typeof TF_COL_X],y:n.y-12});}
  });
  return out;
}
const TF_HEADERS=tfGroupHeaders();

function TokenFlow(){
  const svgRef=useRef(null);
  const[vx,setVx]=useState(16);const[vy,setVy]=useState(0);const[vs,setVs]=useState(0.78);
  const[drag,setDrag]=useState(false);const dragR=useRef<{x: number, y: number} | null>(null);
  const[sel,setSel]=useState<string | null>(null);
  const sub = useMemo<{nSet: Set<string>, eSet: Set<number>} | null>(()=>sel?tfGetSub(sel):null,[sel]);

  const onWheel=useCallback(e=>{e.preventDefault();const f=e.deltaY<0?1.1:0.91;setVs(s=>Math.max(0.2,Math.min(3,s*f)));},[]);
  useEffect(()=>{const el=svgRef.current;if(!el)return;el.addEventListener("wheel",onWheel,{passive:false});return()=>el.removeEventListener("wheel",onWheel);},[onWheel]);
  const onMD=e=>{if(e.target.closest(".tfn"))return;setDrag(true);dragR.current={x:e.clientX-vx,y:e.clientY-vy};};
  const onMM=e=>{if(!drag)return;setVx(e.clientX-dragR.current.x);setVy(e.clientY-dragR.current.y);};
  const onMU=()=>setDrag(false);

  return(
    <div style={{flex:1,position:"relative",overflow:"hidden",cursor:drag?"grabbing":"default"}}
      ref={svgRef} onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}>
      {sel&&(
        <div style={{position:"absolute",top:12,left:12,zIndex:10,background:TF_TIER[TF_POS[sel]?.tier]?.bg,border:`1px solid ${TF_TIER[TF_POS[sel]?.tier]?.bd}`,borderRadius:8,padding:"6px 12px",display:"flex",gap:8,alignItems:"center",fontSize:10,fontFamily:"monospace",color:TF_TIER[TF_POS[sel]?.tier]?.text,fontWeight:600}}>
          {TF_POS[sel]?.label}
          {sub&&<span style={{opacity:.5,fontWeight:400}}>{sub.nSet.size} nodes</span>}
          <button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",fontSize:13,opacity:.5,padding:0}}>×</button>
        </div>
      )}
      <div style={{position:"absolute",bottom:12,right:12,zIndex:10,display:"flex",gap:4}}>
        {[["+",()=>setVs(s=>Math.min(3,s*1.15))],["−",()=>setVs(s=>Math.max(0.2,s*0.87))],["⌂",()=>{setVx(16);setVy(0);setVs(0.78);}]].map(([l,f])=>(
          <button key={l as string} onClick={f as () => void} style={{width:28,height:28,border:`1px solid ${SH.rule}`,borderRadius:6,background:SH.paper,color:SH.ink2,fontSize:l==="⌂"?12:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{l as string}</button>
        ))}
      </div>
      <svg width="100%" height="100%">
        <defs><pattern id="tfg" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.7" fill={SH.ink4} opacity="0.4"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#tfg)"/>
        <g transform={`translate(${vx},${vy}) scale(${vs})`}>
          {/* col headers */}
          {["primitive","semantic","comptoken","component"].map(tier=>{
            const tc=TF_TIER[tier];
            const labels={primitive:"① Primitive",semantic:"② Semantic",comptoken:"③ Comp Token",component:"④ Component"};
            return(<g key={tier}><rect x={TF_COL_X[tier]} y={4} width={TF_COL_W[tier]} height={28} rx={6} fill={tc.bg} stroke={tc.bd} strokeWidth={1}/><text x={TF_COL_X[tier]+8} y={22} fontSize={9} fontWeight={700} fill={tc.text} fontFamily="system-ui">{labels[tier]}</text></g>);
          })}
          {/* group headers */}
          {TF_HEADERS.map((h,i)=>(
            <g key={i}><line x1={h.x} y1={h.y+10} x2={h.x+TF_COL_W[h.tier]} y2={h.y+10} stroke={SH.rule} strokeWidth={0.7}/><text x={h.x+TF_COL_W[h.tier]-3} y={h.y+8} fontSize={6.5} fill={TF_GC[h.group]||SH.ink3} textAnchor="end" fontFamily="system-ui" fontWeight={700} letterSpacing="0.08em">{h.group.toUpperCase()}</text></g>
          ))}
          {/* edges */}
          {TF_EDGES.map(([fId,tId],i)=>{
            const f=TF_POS[fId],t=TF_POS[tId];if(!f||!t)return null;
            if(!sub||!sub.eSet.has(i))return null;
            const fx=f.x+TF_COL_W[f.tier],fy=f.y+TF_NH/2,tx=t.x,ty=t.y+TF_NH/2,cx=(fx+tx)/2;
            return(<path key={i} d={`M ${fx} ${fy} C ${cx} ${fy} ${cx} ${ty} ${tx} ${ty}`} fill="none" stroke={TF_TIER[f.tier].line} strokeWidth={1.6} opacity={0.88}/>);
          })}
          {/* nodes */}
          {Object.values(TF_POS).map((node: TFNode)=>{
            const tc=TF_TIER[node.tier];
            const isComp=node.tier==="component";
            const w=TF_COL_W[node.tier];
            const isSel=sel===node.id;
            const inSub=sel!==null&&sub&&sub.nSet.has(node.id);
            const isDim=sel!==null&&!inSub;
            const isRest=sel===null;
            const gc=TF_GC[node.group]||tc.node;
            const fill=(inSub&&!isSel)?tc.bg:SH.paper;
            const stroke=isSel?tc.node:inSub?tc.node:SH.rule;
            const strokeW=isSel?2:inSub?1.5:0.7;
            const barOp=isRest?0:inSub?0.85:0;
            const lblCol=isRest?"#8A8480":inSub?tc.text:SH.ink4;
            const op=isDim?0.08:1;
            return(
              <g key={node.id} className="tfn" transform={`translate(${node.x},${node.y})`}
                onClick={()=>setSel(p=>p===node.id?null:node.id)}
                style={{opacity:op,transition:"opacity .18s",cursor:"pointer"}}>
                {isSel&&<rect x={-3} y={-3} width={w+6} height={TF_NH+6} rx={isComp?18:9} fill="none" stroke={tc.node} strokeWidth={1.8} opacity={0.35} strokeDasharray="4 3"/>}
                <rect x={0} y={0} width={w} height={TF_NH} rx={isComp?14:5} fill={fill} stroke={stroke} strokeWidth={strokeW}/>
                {!isComp&&<rect x={0} y={0} width={2.5} height={TF_NH} fill={gc} opacity={barOp}/>}
                <text x={isComp?w/2:8} y={TF_NH/2} dominantBaseline="middle" textAnchor={isComp?"middle":"start"} fontSize={isComp?10.5:8.5} fontWeight={isComp?700:inSub?600:400} fontFamily={isComp?"Georgia,serif":"monospace"} fill={lblCol} style={{pointerEvents:"none"}}>{node.label}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/* ================================================================
   TOOL 2 — N-DIMENSIONAL MATRIX
================================================================ */
const ND_DIMS=[
  {id:"color",  label:"Color",   icon:"◉",color:"#C85A1E",steps:[{label:"Slate",hex:"#475569",bg:"#F8FAFC",hov:"#334155"},{label:"Blue",hex:"#2563EB",bg:"#EFF6FF",hov:"#1D4ED8"},{label:"Teal",hex:"#0D9488",bg:"#F0FDFA",hov:"#0F766E"},{label:"Indigo",hex:"#4F46E5",bg:"#EEF2FF",hov:"#4338CA"},{label:"Emerald",hex:"#059669",bg:"#ECFDF5",hov:"#047857"},{label:"Rose",hex:"#E11D48",bg:"#FFF1F2",hov:"#BE123C"}]},
  {id:"radius", label:"Radius",  icon:"⌒",color:"#176E3C",steps:[{label:"None",r:0,rc:2,rp:4},{label:"Minimal",r:2,rc:4,rp:8},{label:"Subtle",r:4,rc:8,rp:999},{label:"Default",r:8,rc:12,rp:999},{label:"Rounded",r:12,rc:18,rp:999},{label:"Pill",r:999,rc:22,rp:999}]},
  {id:"shadow", label:"Shadow",  icon:"◫",color:"#B45309",steps:[{label:"Flat",card:"none",drop:"0 1px 4px rgba(0,0,0,.06)"},{label:"Soft",card:"0 1px 3px rgba(0,0,0,.06)",drop:"0 4px 12px rgba(0,0,0,.08)"},{label:"Default",card:"0 2px 6px rgba(0,0,0,.08)",drop:"0 8px 20px rgba(0,0,0,.1)"},{label:"Medium",card:"0 4px 12px rgba(0,0,0,.1)",drop:"0 12px 32px rgba(0,0,0,.12)"},{label:"Deep",card:"0 8px 24px rgba(0,0,0,.14)",drop:"0 20px 48px rgba(0,0,0,.16)"},{label:"Floating",card:"0 16px 48px rgba(0,0,0,.18)",drop:"0 32px 64px rgba(0,0,0,.2)"}]},
  {id:"typo",   label:"Type",    icon:"T",color:"#7B3FA0",steps:[{label:"Compact",body:13,lbl:11,h:16,w:400},{label:"Tight",body:14,lbl:12,h:18,w:400},{label:"Default",body:16,lbl:14,h:20,w:500},{label:"Open",body:17,lbl:14,h:22,w:500},{label:"Generous",body:18,lbl:15,h:24,w:600},{label:"Display",body:20,lbl:16,h:28,w:600}]},
  {id:"spacing",label:"Spacing", icon:"↔",color:"#1A5FB4",steps:[{label:"Dense",inset:7,gap:4},{label:"Compact",inset:10,gap:6},{label:"Default",inset:14,gap:8},{label:"Comfort",inset:18,gap:12},{label:"Open",inset:22,gap:16},{label:"Spacious",inset:28,gap:20}]},
  {id:"motion", label:"Motion",  icon:"▷",color:"#B91C1C",steps:[{label:"None",ms:0,ease:"linear"},{label:"Instant",ms:60,ease:"ease-out"},{label:"Fast",ms:100,ease:"ease-out"},{label:"Default",ms:160,ease:"cubic-bezier(0,0,.2,1)"},{label:"Slow",ms:260,ease:"cubic-bezier(0,0,.2,1)"},{label:"Expressive",ms:380,ease:"cubic-bezier(.16,1,.3,1)"}]},
];

function NDMatrix(){
  const[pos,setPos]=useState<Record<string, number>>(()=>{const p: Record<string, number>={};ND_DIMS.forEach(d=>{p[d.id]=0.5;});return p;});
  const[active,setActive]=useState("color");
  const[hov,setHov]=useState(false);const[foc,setFoc]=useState(false);

  const get=(id: string)=>{const dim=ND_DIMS.find(d=>d.id===id)!;const i=Math.round(pos[id]*(dim.steps.length-1));return dim.steps[Math.max(0,Math.min(i,dim.steps.length-1))] as any;};
  const col=get("color");const rad=get("radius");const sh=get("shadow");const ty=get("typo");const sp=get("spacing");const mo=get("motion");
  const tr=mo.ms===0?"none":`all ${mo.ms}ms ${mo.ease}`;
  const btnH=sp.inset*2+ty.lbl;
  const cardR=Math.min(rad.rc,28);
  const btnR=Math.min(rad.r,999);
  const fr=foc?`0 0 0 2px white, 0 0 0 4px ${col.hex}`:"none";

  const character=[
    get("radius").label,col.label,get("shadow").label,get("typo").label,get("spacing").label,get("motion").label
  ];

  return(
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      {/* sliders */}
      <div style={{width:240,borderRight:`1px solid ${SH.rule}`,overflowY:"auto",padding:12,background:SH.paper,display:"flex",flexDirection:"column",gap:6}}>
        <div style={{fontSize:8.5,fontWeight:700,color:SH.ink3,letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 0"}}>N Dimensions</div>
        {ND_DIMS.map(dim=>{
          const idx=Math.round(pos[dim.id]*(dim.steps.length-1));
          const step=dim.steps[idx];
          const isAct=active===dim.id;
          return(
            <div key={dim.id} onClick={()=>setActive(dim.id)}
              style={{background:isAct?"#fff":SH.paper,border:`1.5px solid ${isAct?dim.color:SH.rule}`,borderRadius:8,padding:"8px 10px",cursor:"pointer",boxShadow:isAct?`0 0 0 3px ${dim.color}18`:"none"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:10,fontWeight:700,color:isAct?dim.color:SH.ink2}}>{dim.icon} {dim.label}</span>
                <span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:isAct?dim.color:SH.rule,color:isAct?"#fff":SH.ink2,fontFamily:"monospace",fontWeight:600}}>{step.label}</span>
              </div>
              <div style={{position:"relative",height:5,background:SH.rule,borderRadius:3}} onClick={e=>e.stopPropagation()}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pos[dim.id]*100}%`,background:dim.color,borderRadius:3}}/>
                <input type="range" min={0} max={1} step={0.001} value={pos[dim.id]}
                  onChange={e=>{setPos(p=>({...p,[dim.id]:parseFloat(e.target.value)}));setActive(dim.id);}}
                  style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"ew-resize",margin:0,padding:0}}/>
                {dim.steps.map((_,i)=>(
                  <div key={i} style={{position:"absolute",left:`${(i/(dim.steps.length-1))*100}%`,top:"50%",transform:"translate(-50%,-50%)",width:i===idx?8:5,height:i===idx?8:5,borderRadius:"50%",background:i<=idx?dim.color:SH.ink4,border:i===idx?"2px solid white":"none",pointerEvents:"none"}}/>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                {dim.steps.map((s,i)=>(<span key={i} style={{fontSize:6.5,color:i===idx?dim.color:SH.ink4,fontWeight:i===idx?700:400}}>{s.label}</span>))}
              </div>
            </div>
          );
        })}
      </div>

      {/* preview + tokens */}
      <div style={{flex:1,overflowY:"auto",padding:20,display:"flex",flexDirection:"column",gap:16}}>
        {/* character tags */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {character.map((t,i)=>(<span key={i} style={{fontSize:9.5,fontWeight:600,padding:"2px 8px",borderRadius:4,background:SH.rule,color:SH.ink2,letterSpacing:"0.04em"}}>{t}</span>))}
        </div>

        {/* live preview */}
        <div style={{background:"#fff",borderRadius:cardR,boxShadow:sh.card||"none",padding:sp.inset*1.4,display:"flex",flexDirection:"column",gap:sp.gap,transition:tr,maxWidth:380}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:ty.h,fontWeight:ty.w,color:"#111827",lineHeight:1.2}}>Patient Record</div>
            <span style={{background:col.bg,color:col.hov,borderRadius:Math.min(rad.rp,999),padding:`2px ${Math.round(sp.inset*0.6)}px`,fontSize:Math.max(ty.lbl-2,10),fontWeight:500,transition:tr}}>Stable</span>
          </div>
          <input readOnly defaultValue="PT-2024-0847" onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
            style={{width:"100%",height:sp.inset*2+ty.body,padding:`0 ${sp.inset}px`,border:`1.5px solid ${foc?col.hex:"#E5E7EB"}`,borderRadius:Math.min(rad.r,16),fontSize:ty.body,outline:"none",boxShadow:fr,transition:tr,boxSizing:"border-box",fontFamily:"system-ui",background:"#FEFCF9",color:"#111827"}}/>
          <div style={{display:"flex",gap:sp.gap}}>
            <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
              style={{flex:1,height:btnH,background:hov?col.hov:col.hex,color:"#fff",border:"none",borderRadius:btnR,fontSize:ty.lbl,fontWeight:ty.w,cursor:"pointer",boxShadow:sh.card||"none",transition:tr,fontFamily:"system-ui"}}>Save</button>
            <button style={{flex:1,height:btnH,background:"transparent",color:col.hex,border:`1.5px solid ${col.hex}`,borderRadius:btnR,fontSize:ty.lbl,cursor:"pointer",transition:tr,fontFamily:"system-ui"}}>Cancel</button>
          </div>
        </div>

        {/* active dim tokens */}
        <div>
          <div style={{fontSize:9,fontWeight:700,color:SH.ink3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>
            {ND_DIMS.find(d=>d.id===active)?.label} dimension — affected tokens
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {[
              {id:"btn-radius",d:"radius",label:"--btn-radius",v:`${Math.min(rad.r,999)}px`},
              {id:"card-radius",d:"radius",label:"--card-radius",v:`${Math.min(rad.rc,28)}px`},
              {id:"btn-bg",d:"color",label:"--btn-bg",v:col.hex},
              {id:"btn-hover",d:"color",label:"--btn-hover-bg",v:col.hov},
              {id:"card-shadow",d:"shadow",label:"--card-shadow",v:(sh.card||"none").slice(0,24)},
              {id:"btn-font",d:"typo",label:"--btn-font-size",v:`${ty.lbl}px`},
              {id:"btn-px",d:"spacing",label:"--btn-px",v:`${sp.inset}px`},
              {id:"btn-height",d:"spacing",label:"--btn-height",v:`${btnH}px`},
              {id:"motion-hover",d:"motion",label:"--motion-hover",v:mo.ms===0?"none":`${mo.ms}ms`},
              {id:"btn-transition",d:"motion",label:"--btn-transition",v:mo.ms===0?"none":`all ${mo.ms}ms`},
            ].filter(t=>t.d===active).map(t=>(
              <div key={t.id} style={{background:"#fff",border:`1px solid ${ND_DIMS.find(d=>d.id===active)?.color}40`,borderRadius:7,padding:"8px 10px"}}>
                <code style={{fontSize:8.5,fontFamily:"monospace",color:ND_DIMS.find(d=>d.id===active)?.color,fontWeight:600}}>{t.label}</code>
                <div style={{fontSize:9,fontFamily:"monospace",color:SH.ink2,marginTop:3}}>{t.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TOOL 3 — DECISION SIMULATOR (condensed)
================================================================ */
const SIM_STEPS=[
  {id:"color",label:"Brand Color",icon:"◉",q:"Primary brand color?",opts:[{id:"blue",l:"Blue",hex:"#2563EB",hov:"#1D4ED8",bg:"#EFF6FF",txt:"#1E3A8A",feel:"Professional"},{id:"teal",l:"Teal",hex:"#0D9488",hov:"#0F766E",bg:"#F0FDFA",txt:"#134E4A",feel:"Clinical"},{id:"indigo",l:"Indigo",hex:"#4F46E5",hov:"#4338CA",bg:"#EEF2FF",txt:"#312E81",feel:"Modern"},{id:"slate",l:"Slate",hex:"#475569",hov:"#334155",bg:"#F8FAFC",txt:"#0F172A",feel:"Enterprise"},{id:"emerald",l:"Emerald",hex:"#059669",hov:"#047857",bg:"#ECFDF5",txt:"#064E3B",feel:"Positive"},{id:"rose",l:"Rose",hex:"#E11D48",hov:"#BE123C",bg:"#FFF1F2",txt:"#881337",feel:"Bold"}]},
  {id:"radius",label:"Corner Radius",icon:"⌒",q:"Product personality?",opts:[{id:"none",l:"None",r:0,rc:2,rp:4,feel:"Clinical"},{id:"minimal",l:"Minimal",r:2,rc:4,rp:20,feel:"Precise"},{id:"subtle",l:"Subtle",r:4,rc:8,rp:999,feel:"Structured"},{id:"default",l:"Default",r:8,rc:12,rp:999,feel:"Balanced"},{id:"rounded",l:"Rounded",r:12,rc:18,rp:999,feel:"Friendly"},{id:"pill",l:"Pill",r:999,rc:22,rp:999,feel:"Playful"}]},
  {id:"spacing",label:"Spacing",icon:"↔",q:"Information density?",opts:[{id:"ultra",l:"Ultra dense",inset:7,gap:4,feel:"Data"},{id:"compact",l:"Compact",inset:10,gap:6,feel:"Tight"},{id:"default",l:"Default",inset:14,gap:8,feel:"Balanced"},{id:"comfort",l:"Comfortable",inset:18,gap:12,feel:"Airy"},{id:"open",l:"Open",inset:22,gap:16,feel:"Spacious"},{id:"editorial",l:"Editorial",inset:28,gap:20,feel:"Generous"}]},
  {id:"typo",label:"Typography",icon:"T",q:"Type character?",opts:[{id:"compact",l:"Compact",body:13,lbl:11,h:16,w:400,feel:"Dense"},{id:"tight",l:"Tight",body:14,lbl:12,h:18,w:400,feel:"Efficient"},{id:"default",l:"Default",body:16,lbl:14,h:20,w:500,feel:"Standard"},{id:"open",l:"Open",body:16,lbl:14,h:22,w:500,feel:"Readable"},{id:"generous",l:"Generous",body:18,lbl:15,h:24,w:600,feel:"Accessible"},{id:"display",l:"Display",body:20,lbl:16,h:28,w:600,feel:"Editorial"}]},
  {id:"motion",label:"Motion",icon:"▷",q:"Animation character?",opts:[{id:"none",l:"None",ms:0,ease:"linear",feel:"Static"},{id:"instant",l:"Instant",ms:60,ease:"ease-out",feel:"Snappy"},{id:"fast",l:"Fast",ms:100,ease:"ease-out",feel:"Quick"},{id:"default",l:"Default",ms:160,ease:"cubic-bezier(0,0,.2,1)",feel:"Smooth"},{id:"deliberate",l:"Deliberate",ms:240,ease:"cubic-bezier(0,0,.2,1)",feel:"Calm"},{id:"expressive",l:"Expressive",ms:360,ease:"cubic-bezier(.16,1,.3,1)",feel:"Cinematic"}]},
  {id:"elevation",label:"Elevation",icon:"◫",q:"Visual hierarchy depth?",opts:[{id:"flat",l:"Flat",card:"none",feel:"Minimal"},{id:"subtle",l:"Subtle",card:"0 1px 3px rgba(0,0,0,.06)",feel:"Light"},{id:"default",l:"Default",card:"0 2px 6px rgba(0,0,0,.08)",feel:"Grounded"},{id:"medium",l:"Medium",card:"0 4px 12px rgba(0,0,0,.1)",feel:"Layered"},{id:"deep",l:"Deep",card:"0 8px 24px rgba(0,0,0,.14)",feel:"Dramatic"},{id:"floating",l:"Floating",card:"0 16px 48px rgba(0,0,0,.18)",feel:"Bold"}]},
];

function lumC(hex){const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;const f=c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);}
function contR(a,b){const la=lumC(a),lb=lumC(b);return(Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05);}

function Simulator(){
  const[dec,setDec]=useState<Record<string, any>>({});
  const[step,setStep]=useState(0);
  const[tab,setTab]=useState("wcag");
  const cur=SIM_STEPS[step];
  const col=dec.color||SIM_STEPS[0].opts[1];
  const rad=dec.radius||SIM_STEPS[1].opts[3];
  const sp=dec.spacing||SIM_STEPS[2].opts[2];
  const ty=dec.typo||SIM_STEPS[3].opts[2];
  const mo=dec.motion||SIM_STEPS[4].opts[3];
  const el=dec.elevation||SIM_STEPS[5].opts[2];
  const[hov,setHov]=useState(false);

  const tr=mo.ms===0?"none":`all ${mo.ms}ms ${mo.ease}`;
  const btnH=sp.inset*2+ty.lbl;
  const btnR=Math.min(rad.r,999);
  const cardR=Math.min(rad.rc,28);

  const wcagPairs=[
    {l:"White on brand",fg:"#FFFFFF",bg:col.hex},{l:"Brand on white",fg:col.hex,bg:"#FFFFFF"},
    {l:"Body on white",fg:"#111827",bg:"#FFFFFF"},{l:"Secondary on white",fg:"#6B7280",bg:"#FFFFFF"},
    {l:"Brand on brand-bg",fg:col.hex,bg:col.bg},{l:"Dark on brand-bg",fg:col.txt,bg:col.bg},
  ];

  const cascadeCounts={primitives:Object.keys(dec).length*5,semantics:Object.keys(dec).length*8,tokens:Object.keys(dec).length*14};

  return(
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      {/* left: steps */}
      <div style={{width:320,borderRight:`1px solid ${SH.rule}`,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {/* step tabs */}
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {SIM_STEPS.map((s,i)=>{
            const done=dec[s.id]!==undefined;
            const active=i===step;
            return(<button key={s.id} onClick={()=>setStep(i)}
              style={{padding:"3px 8px",border:`1px solid ${active?SH.brand:done?"#86EFAC":SH.rule}`,borderRadius:5,background:active?SH.brand+"12":done?"#F0FDF4":"#fff",color:active?SH.brand:done?"#166534":SH.ink3,fontSize:9,cursor:"pointer",fontWeight:active||done?600:400}}>
              {done?"✓ ":""}{s.icon} {s.label}
            </button>);
          })}
        </div>

        {/* current step */}
        <div style={{background:"#fff",borderRadius:10,border:`1px solid ${SH.rule}`,padding:14}}>
          <div style={{fontSize:13,fontWeight:700,color:SH.ink,marginBottom:10,fontFamily:"Georgia,serif"}}>{cur.q}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {cur.opts.map(opt=>{
              const sel=dec[cur.id]?.id===opt.id;
              return(<div key={opt.id} onClick={()=>setDec(d=>({...d,[cur.id]:opt}))}
                style={{padding:"8px 10px",border:`1.5px solid ${sel?SH.brand:SH.rule}`,borderRadius:7,cursor:"pointer",background:sel?SH.brand+"0A":"#fff"}}>
                <div style={{fontSize:11,fontWeight:700,color:sel?SH.brand:SH.ink}}>{opt.l}</div>
                <div style={{fontSize:9,color:SH.ink3}}>{opt.feel}</div>
              </div>);
            })}
          </div>
          <div style={{display:"flex",gap:6,marginTop:12}}>
            <button onClick={()=>setStep(s=>Math.max(0,s-1))} style={{flex:1,height:32,border:`1px solid ${SH.rule}`,borderRadius:6,background:"#fff",color:SH.ink2,cursor:"pointer",fontSize:11}}>← Prev</button>
            <button onClick={()=>setStep(s=>Math.min(SIM_STEPS.length-1,s+1))} style={{flex:2,height:32,border:"none",borderRadius:6,background:dec[cur.id]?SH.brand:"#E5E7EB",color:dec[cur.id]?"#fff":SH.ink4,cursor:dec[cur.id]?"pointer":"not-allowed",fontSize:11,fontWeight:600}}>Next →</button>
          </div>
        </div>

        {/* live preview */}
        <div style={{background:"#fff",borderRadius:cardR,boxShadow:el.card||"none",padding:sp.inset*1.3,display:"flex",flexDirection:"column",gap:sp.gap,transition:tr}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:ty.h*0.9,fontWeight:ty.w,color:"#111827"}}>Preview</div>
            <span style={{background:col.bg,color:col.txt,borderRadius:Math.min(rad.rp,999),padding:`2px ${Math.round(sp.inset*0.5)}px`,fontSize:Math.max(ty.lbl-2,9),fontWeight:500}}>Active</span>
          </div>
          <div style={{display:"flex",gap:sp.gap}}>
            <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
              style={{flex:1,height:btnH,background:hov?col.hov:col.hex,color:"#fff",border:"none",borderRadius:btnR,fontSize:ty.lbl,fontWeight:ty.w,cursor:"pointer",boxShadow:el.card||"none",transition:tr,fontFamily:"system-ui"}}>Save</button>
            <button style={{flex:1,height:btnH,background:"transparent",color:col.hex,border:`1.5px solid ${col.hex}`,borderRadius:btnR,fontSize:ty.lbl,cursor:"pointer",transition:tr,fontFamily:"system-ui"}}>Cancel</button>
          </div>
        </div>
      </div>

      {/* right: analysis */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:SH.paper,borderBottom:`1px solid ${SH.rule}`,padding:"0 14px",display:"flex",height:38,alignItems:"center",gap:0,flexShrink:0}}>
          {[["wcag","Accessibility"],["cascade","Cascade"],["rebrand","Rebrand Cost"]].map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{padding:"0 12px",height:"100%",border:"none",borderBottom:`2px solid ${tab===id?SH.brand:"transparent"}`,background:"transparent",color:tab===id?SH.brand:SH.ink3,fontSize:10,fontWeight:tab===id?600:400,cursor:"pointer"}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14}}>
          {tab==="wcag"&&(
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <div style={{fontSize:9,fontWeight:700,color:SH.ink3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>WCAG Contrast Audit</div>
              {wcagPairs.map(p=>{
                const ratio=contR(p.fg,p.bg);
                const level=ratio>=7?"AAA":ratio>=4.5?"AA":ratio>=3?"AA-large":"Fail";
                const lc=level==="AAA"?"#166534":level==="AA"?"#1E40AF":level.includes("large")?"#B45309":"#DC2626";
                const lb=level==="AAA"?"#DCFCE7":level==="AA"?"#DBEAFE":level.includes("large")?"#FEF3C7":"#FEE2E2";
                return(<div key={p.l} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:"#fff",borderRadius:6,border:`1px solid ${SH.rule}`}}>
                  <div style={{width:24,height:16,borderRadius:3,background:p.bg,border:"1px solid #E5E7EB",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:14,height:8,borderRadius:2,background:p.fg}}/>
                  </div>
                  <span style={{flex:1,fontSize:9,color:SH.ink2}}>{p.l}</span>
                  <span style={{fontSize:8.5,fontFamily:"monospace",color:SH.ink3}}>{ratio.toFixed(2)}:1</span>
                  <span style={{fontSize:8.5,fontWeight:700,padding:"1px 6px",borderRadius:4,background:lb,color:lc}}>{level}</span>
                </div>);
              })}
            </div>
          )}
          {tab==="cascade"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{fontSize:9,fontWeight:700,color:SH.ink3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Cascade from {Object.keys(dec).length} decisions</div>
              {[["Primitives",cascadeCounts.primitives,"#C85A1E"],["Semantics",cascadeCounts.semantics,"#1A5FB4"],["Component tokens",cascadeCounts.tokens,"#176E3C"]].map(([l,v,c])=>(
                <div key={l as string} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fff",borderRadius:7,border:`1px solid ${c as string}20`}}>
                  <div style={{fontSize:20,fontWeight:700,color:c as string,fontFamily:"Georgia,serif",width:40}}>{v}</div>
                  <span style={{fontSize:10,color:SH.ink2}}>{l as string} automatically updated</span>
                </div>
              ))}
              <div style={{background:SH.brand+"0D",border:`1px solid ${SH.brand}30`,borderRadius:8,padding:"10px 12px",fontSize:10,color:SH.ink2,lineHeight:1.6,marginTop:4}}>
                Every decision you make creates a ripple through all 3 layers. The token system is the mechanism that makes this propagation automatic instead of manual.
              </div>
            </div>
          )}
          {tab==="rebrand"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontSize:9,fontWeight:700,color:SH.ink3,letterSpacing:"0.1em",textTransform:"uppercase"}}>Change brand color simulation</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:10,padding:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#166534",marginBottom:8}}>✓ With tokens</div>
                  {[["1 edit","Change 1 primitive"],["0 min","Instant cascade"],["Zero risk","System stays consistent"]].map(([v,l])=>(<div key={l} style={{marginBottom:5}}><div style={{fontSize:14,fontWeight:700,color:"#166534",fontFamily:"Georgia,serif"}}>{v}</div><div style={{fontSize:9,color:"#166534",opacity:.7}}>{l}</div></div>))}
                </div>
                <div style={{background:"#FFF5F5",border:"1px solid #FCA5A5",borderRadius:10,padding:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#DC2626",marginBottom:8}}>✕ Without tokens</div>
                  {[["320 edits","Every file manually"],["8 hrs","Find & replace"],["High risk","Guaranteed misses"]].map(([v,l])=>(<div key={l} style={{marginBottom:5}}><div style={{fontSize:14,fontWeight:700,color:"#DC2626",fontFamily:"Georgia,serif"}}>{v}</div><div style={{fontSize:9,color:"#DC2626",opacity:.7}}>{l}</div></div>))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TOOL 4 — TOKEN DEBT LAB
================================================================ */
const DEBT_SCENARIOS=[
  {id:"hardcode",label:"Hardcoded values",icon:"⚡",desc:"Developer skips tokens and hardcodes #2563EB directly in 47 components.",
    before:`/* ❌ Hardcoded everywhere */
.btn-primary { background: #2563EB; }
.link { color: #2563EB; }
.badge-active { background: #EFF6FF; color: #2563EB; }
.focus-ring { box-shadow: 0 0 0 3px #2563EB40; }
.nav-active { border-bottom: 2px solid #2563EB; }
/* ... 42 more places */`,
    after:`/* ✓ Tokenized */
:root { --color-action-primary: #2563EB; }

.btn-primary { background: var(--color-action-primary); }
.link { color: var(--color-action-primary); }
.badge-active { background: var(--color-action-bg); color: var(--color-action-primary); }
.focus-ring { box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-action-primary) 25%, transparent); }
.nav-active { border-bottom: 2px solid var(--color-action-primary); }`,
    change:"Rebrand from blue → teal",
    withTokens:{edits:1,time:"30 sec",risk:"None"},
    withoutTokens:{edits:47,time:"4 hours",risk:"High — missing values create inconsistency"},
  },
  {id:"nolayer",label:"Missing semantic layer",icon:"⧉",desc:"Primitives used directly in components — no semantic tier.",
    before:`/* ❌ Primitives directly in components */
.btn { border-radius: var(--radius-md); } /* 8px primitive */
.card { border-radius: var(--radius-md); } /* also 8px */
.modal { border-radius: var(--radius-md); } /* also 8px */
/* Try to change: modal should be larger than card,
   card larger than button. Now what? */`,
    after:`/* ✓ Semantic tier added */
:root {
  --r-interactive: var(--radius-md);   /* 8px */
  --r-container:   var(--radius-lg);   /* 12px */
  --r-overlay:     var(--radius-xl);   /* 16px */
}
.btn   { border-radius: var(--r-interactive); }
.card  { border-radius: var(--r-container); }
.modal { border-radius: var(--r-overlay); }
/* Now: change interactive radius once, btn + input + select all update */`,
    change:"Make containers rounder than controls",
    withTokens:{edits:1,time:"10 sec",risk:"None"},
    withoutTokens:{edits:23,time:"45 min",risk:"Medium — must find every border-radius manually"},
  },
  {id:"magicz",label:"Magic z-index numbers",icon:"⊞",desc:"z-index values scattered throughout with no system.",
    before:`/* ❌ Magic z-index numbers */
.navbar    { z-index: 100; }
.dropdown  { z-index: 9999; }  /* someone panicked */
.modal     { z-index: 1050; }  /* Bootstrap legacy */
.tooltip   { z-index: 10000; } /* above everything? */
.toast     { z-index: 9998; }
/* Result: dropdowns appear above modals,
   tooltips disappear behind overlays */`,
    after:`/* ✓ Z-index as tokens */
:root {
  --z-sticky:   100;
  --z-dropdown: 200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
}
.navbar   { z-index: var(--z-sticky); }
.dropdown { z-index: var(--z-dropdown); }
.modal    { z-index: var(--z-modal); }
.tooltip  { z-index: var(--z-overlay); }
.toast    { z-index: var(--z-toast); }`,
    change:"Add a new layer type (bottom sheet)",
    withTokens:{edits:1,time:"10 sec",risk:"None — insert between existing layers"},
    withoutTokens:{edits:12,time:"30 min",risk:"High — stacking order bugs guaranteed"},
  },
  {id:"motionraw",label:"Hardcoded animation",icon:"▷",desc:"Duration and easing hardcoded — no motion tokens.",
    before:`/* ❌ Raw animation values */
.btn         { transition: background 0.15s ease; }
.input       { transition: border 0.2s ease-out; }
.dropdown    { transition: opacity 0.3s cubic-bezier(0,0,.2,1); }
.modal       { transition: transform 0.25s ease, opacity 0.25s ease; }
/* Product requirement: "make everything faster" = 12 file edits */
/* Clinical requirement: "remove all animation" = find every transition */`,
    after:`/* ✓ Motion as tokens */
:root {
  --motion-hover:       120ms cubic-bezier(0,0,.2,1);
  --motion-interactive: 200ms cubic-bezier(0,0,.2,1);
  --motion-overlay:     300ms cubic-bezier(0,0,.2,1);
}
.btn      { transition: background var(--motion-hover); }
.input    { transition: border var(--motion-hover); }
.dropdown { transition: opacity var(--motion-interactive); }
.modal    { transition: transform var(--motion-overlay), opacity var(--motion-overlay); }`,
    change:"Clinical mode: disable all animation",
    withTokens:{edits:3,time:"2 min",risk:"None — set all 3 to 0ms"},
    withoutTokens:{edits:38,time:"2 hours",risk:"High — hard to find every transition"},
  },
];

function DebtLab(){
  const[scenario,setScenario]=useState(DEBT_SCENARIOS[0]);
  const[view,setView]=useState("before"); // before | after | cost

  return(
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      {/* left: scenario picker */}
      <div style={{width:220,borderRight:`1px solid ${SH.rule}`,overflowY:"auto",padding:12,background:SH.paper,display:"flex",flexDirection:"column",gap:6}}>
        <div style={{fontSize:8.5,fontWeight:700,color:SH.ink3,letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 0 8px"}}>Debt Scenarios</div>
        {DEBT_SCENARIOS.map(s=>(
          <div key={s.id} onClick={()=>{setScenario(s);setView("before");}}
            style={{padding:"10px 12px",borderRadius:8,border:`1.5px solid ${scenario.id===s.id?SH.brand:SH.rule}`,background:scenario.id===s.id?"#fff":SH.paper,cursor:"pointer",boxShadow:scenario.id===s.id?`0 0 0 3px ${SH.brand}14`:"none"}}>
            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:14,color:SH.brand}}>{s.icon}</span>
              <span style={{fontSize:10,fontWeight:700,color:scenario.id===s.id?SH.brand:SH.ink}}>{s.label}</span>
            </div>
            <div style={{fontSize:9,color:SH.ink3,lineHeight:1.4}}>{s.desc.slice(0,60)}…</div>
          </div>
        ))}

        <div style={{marginTop:8,padding:"10px 12px",background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:8}}>
          <div style={{fontSize:9,fontWeight:700,color:"#92400E",marginBottom:4}}>The Pattern</div>
          <div style={{fontSize:8.5,color:"#78350F",lineHeight:1.5}}>Every debt scenario is the same: skipping a layer feels faster today but multiplies the cost of every future change.</div>
        </div>
      </div>

      {/* right: code + cost */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:SH.paper,borderBottom:`1px solid ${SH.rule}`,padding:"0 16px",display:"flex",height:40,alignItems:"center",gap:0,flexShrink:0}}>
          <span style={{fontSize:12,fontWeight:700,color:SH.ink,marginRight:16,fontFamily:"Georgia,serif"}}>{scenario.label}</span>
          {[["before","❌ Without tokens"],["after","✓ With tokens"],["cost","Cost Analysis"]].map(([id,l])=>(
            <button key={id} onClick={()=>setView(id)}
              style={{padding:"0 12px",height:"100%",border:"none",borderBottom:`2px solid ${view===id?SH.brand:"transparent"}`,background:"transparent",color:view===id?SH.brand:SH.ink3,fontSize:10,fontWeight:view===id?600:400,cursor:"pointer"}}>
              {l}
            </button>
          ))}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:16}}>
          {(view==="before"||view==="after")&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontSize:11,color:SH.ink2,lineHeight:1.6}}>{scenario.desc}</div>
              {view==="before"&&(
                <div style={{background:"#1C1917",borderRadius:10,padding:16}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#EF4444",letterSpacing:"0.08em",marginBottom:10}}>WITHOUT TOKEN SYSTEM</div>
                  <pre style={{fontSize:10,fontFamily:"monospace",color:"#E7E5E4",lineHeight:1.8,margin:0,whiteSpace:"pre-wrap"}}>{scenario.before}</pre>
                </div>
              )}
              {view==="after"&&(
                <div style={{background:"#0A1628",borderRadius:10,padding:16}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#22C55E",letterSpacing:"0.08em",marginBottom:10}}>WITH TOKEN SYSTEM</div>
                  <pre style={{fontSize:10,fontFamily:"monospace",color:"#E7E5E4",lineHeight:1.8,margin:0,whiteSpace:"pre-wrap"}}>{scenario.after}</pre>
                </div>
              )}
              <div style={{padding:"8px 12px",background:"#FFF4EE",border:"1px solid #F4B8A0",borderRadius:8,fontSize:10,color:"#7A2D08"}}>
                <strong>Scenario: </strong>{scenario.change}
              </div>
            </div>
          )}
          {view==="cost"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontSize:11,color:SH.ink2,lineHeight:1.6}}>
                Simulating: <strong>{scenario.change}</strong>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:12,padding:18}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:12}}>✓ With token system</div>
                  {Object.entries(scenario.withTokens).map(([k,v])=>(
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:18,fontWeight:700,color:"#166534",fontFamily:"Georgia,serif",lineHeight:1}}>{v}</div>
                      <div style={{fontSize:9,color:"#166534",opacity:.7,textTransform:"capitalize"}}>{k}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:"#FFF5F5",border:"1px solid #FCA5A5",borderRadius:12,padding:18}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#DC2626",marginBottom:12}}>✕ Without token system</div>
                  {Object.entries(scenario.withoutTokens).map(([k,v])=>(
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:14,fontWeight:700,color:"#DC2626",fontFamily:"Georgia,serif",lineHeight:1.2}}>{v}</div>
                      <div style={{fontSize:9,color:"#DC2626",opacity:.7,textTransform:"capitalize"}}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:SH.bg,borderRadius:8,padding:"12px 14px",fontSize:10,color:SH.ink2,lineHeight:1.7}}>
                <strong>The math is always the same:</strong> Skipping the token layer saves minutes today. Every subsequent design change costs hours. The ROI of tokenization compounds with every future change.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TOOL 5 — NAMING GAME
================================================================ */
const NAMING_CHALLENGES=[
  {id:1,category:"Color",value:"#2563EB",context:"This is your primary CTA color",tier:"primitive",bad:["--blue","--primary","--brand-blue","--btn-color"],good:"--color-blue-600",hint:"Primitive tier: describe WHAT it is (hue + step), not WHAT it does",rule:"Primitive tokens are named by value, not intent"},
  {id:2,category:"Color",value:"#2563EB",context:"The semantic role: 'the main action color'",tier:"semantic",bad:["--blue-600","--color-primary","--button-background","--brand"],good:"--color-action-primary",hint:"Semantic tier: describe the INTENT, not the value",rule:"Semantic tokens are named by role, not value"},
  {id:3,category:"Color",value:"#2563EB",context:"The Button component's background",tier:"component",bad:["--primary","--blue","--color-blue-600","--action-color"],good:"--btn-bg",hint:"Component tier: scoped to the component, references the semantic",rule:"Component tokens are prefixed with the component name"},
  {id:4,category:"Radius",value:"8px",context:"Used on buttons, inputs, selects — interactive controls",tier:"semantic",bad:["--radius-8","--border-radius","--rounded","--r-button"],good:"--r-interactive",hint:"Name by the ROLE (interactive controls), not the value or the component",rule:"Semantic radius names describe the context, not the px value"},
  {id:5,category:"Typography",value:"14px / 500 / 0.04em",context:"Text on a form label next to an input",tier:"semantic",bad:["--font-sm","--text-14","--label-text","--form-font"],good:"--text-label",hint:"The label role signals 'interactive / associated with a control'",rule:"Typography semantics describe the text ROLE, not the size"},
  {id:6,category:"Typography",value:"12px / 400",context:"Small text below a form field — error or hint",tier:"semantic",bad:["--text-xs","--font-12","--small-text","--caption"],good:"--text-helper",hint:"Helper text is distinct from caption — it's assistive, not passive",rule:"'caption' is passive metadata. 'helper' is assistive text. Same size, different role"},
  {id:7,category:"Shadow",value:"0 2px 6px rgba(0,0,0,.08)",context:"The elevation level for a card component",tier:"semantic",bad:["--shadow-sm","--card-shadow","--shadow-2","--elev-card"],good:"--elev-2",hint:"Elevation is a numbered scale, not named after components",rule:"Shadow semantics use elevation levels (elev-1 through elev-5), not component names"},
  {id:8,category:"Motion",value:"120ms cubic-bezier(0,0,.2,1)",context:"Used on hover state transitions (background color changes)",tier:"semantic",bad:["--transition-fast","--motion-120","--hover-duration","--anim-quick"],good:"--motion-hover",hint:"Name by the INTERACTION that triggers it, not the duration",rule:"Motion semantics describe when the animation fires, not how long it takes"},
  {id:9,category:"Spacing",value:"16px",context:"The default padding inside cards, inputs, and buttons",tier:"semantic",bad:["--spacing-16","--padding-md","--sp-4","--space-default"],good:"--inset-md",hint:"'inset' signals internal padding. 'gap' signals space between elements",rule:"inset = internal padding. gap = space between siblings. Both are semantic."},
  {id:10,category:"Z-Index",value:"300",context:"Tooltips and popovers — they float above the page",tier:"semantic",bad:["--z-300","--z-high","--tooltip-z","--z-above-modal"],good:"--z-overlay",hint:"Name by what it represents in the layer stack, not the number",rule:"Z-index tokens describe the layer's purpose, not its numeric value"},
];

function NamingGame(){
  const[idx,setIdx]=useState(0);
  const[selected,setSelected]=useState(null);
  const[revealed,setRevealed]=useState(false);
  const[score,setScore]=useState({correct:0,total:0});

  const ch=NAMING_CHALLENGES[idx];
  const allOpts=useMemo(()=>{
    const opts=[...ch.bad,ch.good].sort(()=>Math.random()-0.5);
    return opts;
  },[ch.id]);

  const tierColor={primitive:"#C85A1E",semantic:"#1A5FB4",component:"#176E3C"};
  const tierBg={primitive:"#FFF4EE",semantic:"#EBF4FF",component:"#EDFAF3"};

  const pick=(opt)=>{
    if(revealed)return;
    setSelected(opt);
    setRevealed(true);
    setScore(s=>({correct:s.correct+(opt===ch.good?1:0),total:s.total+1}));
  };

  const next=()=>{
    setIdx(i=>(i+1)%NAMING_CHALLENGES.length);
    setSelected(null);setRevealed(false);
  };

  return(
    <div style={{flex:1,overflowY:"auto",padding:24,display:"flex",flexDirection:"column",gap:16,maxWidth:680,margin:"0 auto",width:"100%"}}>
      {/* score */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:12,fontWeight:700,color:SH.ink,fontFamily:"Georgia,serif"}}>Token Naming Game</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:10,color:SH.ink3}}>{idx+1} / {NAMING_CHALLENGES.length}</span>
          <div style={{background:"#DCFCE7",border:"1px solid #86EFAC",borderRadius:20,padding:"3px 10px"}}>
            <span style={{fontSize:11,fontWeight:700,color:"#166534"}}>{score.correct}/{score.total} correct</span>
          </div>
        </div>
      </div>

      {/* challenge */}
      <div style={{background:"#fff",borderRadius:12,border:`1px solid ${SH.rule}`,padding:20}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,background:tierBg[ch.tier],color:tierColor[ch.tier],letterSpacing:"0.06em",textTransform:"uppercase"}}>{ch.tier}</span>
          <span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:SH.bg,color:SH.ink3}}>{ch.category}</span>
        </div>
        <div style={{fontSize:14,fontWeight:700,color:SH.ink,marginBottom:6,fontFamily:"Georgia,serif",lineHeight:1.3}}>
          What should this token be named?
        </div>
        <div style={{fontSize:11,color:SH.ink2,lineHeight:1.6,marginBottom:12}}>{ch.context}</div>
        <div style={{background:SH.bg,borderRadius:8,padding:"10px 14px",fontFamily:"monospace",fontSize:12,color:SH.ink2,fontWeight:600}}>{ch.value}</div>
      </div>

      {/* options */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {allOpts.map(opt=>{
          const isCorrect=opt===ch.good;
          const isSel=opt===selected;
          let bg="#fff",border=SH.rule,col=SH.ink;
          if(revealed){
            if(isCorrect){bg="#F0FDF4";border="#86EFAC";col="#166534";}
            else if(isSel){bg="#FFF5F5";border="#FCA5A5";col="#DC2626";}
          } else if(isSel){bg=SH.bg;}
          return(
            <button key={opt} onClick={()=>pick(opt)}
              style={{padding:"10px 14px",border:`1.5px solid ${border}`,borderRadius:8,background:bg,color:col,cursor:revealed?"default":"pointer",textAlign:"left",fontFamily:"monospace",fontSize:10,fontWeight:600,transition:"all 0.15s"}}>
              {revealed&&isCorrect&&<span style={{marginRight:6}}>✓</span>}
              {revealed&&isSel&&!isCorrect&&<span style={{marginRight:6}}>✗</span>}
              {opt}
            </button>
          );
        })}
      </div>

      {/* explanation */}
      {revealed&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{background:selected===ch.good?"#F0FDF4":"#FFF5F5",border:`1px solid ${selected===ch.good?"#86EFAC":"#FCA5A5"}`,borderRadius:10,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:selected===ch.good?"#166534":"#DC2626",marginBottom:6}}>
              {selected===ch.good?"✓ Correct!":"✗ Not quite —"} the answer is <code style={{fontFamily:"monospace"}}>{ch.good}</code>
            </div>
            <div style={{fontSize:11,color:selected===ch.good?"#166534":"#DC2626",lineHeight:1.6}}>{ch.hint}</div>
          </div>
          <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:8,padding:"10px 14px",fontSize:10,color:"#1E40AF",lineHeight:1.5}}>
            <strong>Rule: </strong>{ch.rule}
          </div>
          <button onClick={next}
            style={{height:40,border:"none",borderRadius:8,background:SH.brand,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>
            {idx===NAMING_CHALLENGES.length-1?"Restart Game":"Next Challenge →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   SHELL — App launcher + nav
================================================================ */
const TOOLS=[
  {id:"flow",     label:"Token Flow",    icon:"◈",desc:"Mind map: primitive → semantic → component token → component",tag:"Visual"},
  {id:"matrix",   label:"N-Dim Matrix",  icon:"⊞",desc:"How 7 dimensions compose every token. Sliders update components live",tag:"Interactive"},
  {id:"simulator",label:"Simulator",     icon:"▷",desc:"Build a system from scratch. See every decision cascade live + WCAG audit",tag:"Guided"},
  {id:"debt",     label:"Debt Lab",      icon:"⚡",desc:"The cost of skipping the token layer. Side-by-side code + cost analysis",tag:"Analysis"},
  {id:"naming",   label:"Naming Game",   icon:"T",desc:"Learn naming conventions by playing. 10 challenges across all tiers",tag:"Game"},
];

export default function App(){
  const[tool,setTool]=useState(null);

  if(!tool) return(
    <div style={{minHeight:"100vh",background:SH.bg,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${SH.ink4};border-radius:2px}`}</style>
      <div style={{padding:"40px 40px 0"}}>
        <div style={{fontSize:32,fontWeight:700,color:SH.ink,fontFamily:"Georgia,serif",letterSpacing:"-0.03em",marginBottom:8}}>Mime</div>
        <div style={{fontSize:13,color:SH.ink3,lineHeight:1.7,maxWidth:500}}>
          A design token learning platform. Five interactive tools — from the atomic structure of tokens to the real cost of skipping them.
        </div>
      </div>
      <div style={{flex:1,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16,padding:40,alignContent:"start"}}>
        {TOOLS.map((t,i)=>(
          <div key={t.id} onClick={()=>setTool(t.id)}
            style={{background:SH.paper,borderRadius:14,border:`2px solid ${SH.rule}`,padding:24,cursor:"pointer",transition:"all 0.2s",display:"flex",flexDirection:"column",gap:12}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=SH.brand;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${SH.brand}14`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=SH.rule;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:28,color:SH.brand}}>{t.icon}</span>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:12,background:SH.bg,color:SH.ink3,letterSpacing:"0.05em"}}>{t.tag}</span>
            </div>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:SH.ink,fontFamily:"Georgia,serif",marginBottom:6}}>{t.label}</div>
              <div style={{fontSize:11,color:SH.ink3,lineHeight:1.6}}>{t.desc}</div>
            </div>
            <div style={{marginTop:"auto",fontSize:11,fontWeight:600,color:SH.brand}}>Open →</div>
          </div>
        ))}
      </div>
      <div style={{padding:"20px 40px",borderTop:`1px solid ${SH.rule}`,display:"flex",gap:16}}>
        {["Primitive tokens","Semantic layer","Component tokens","WCAG","Cascade","Naming conventions"].map(t=>(
          <span key={t} style={{fontSize:9.5,color:SH.ink3,padding:"2px 8px",borderRadius:12,border:`1px solid ${SH.rule}`,whiteSpace:"nowrap"}}>{t}</span>
        ))}
      </div>
    </div>
  );

  const active=TOOLS.find(t=>t.id===tool);

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:SH.bg,fontFamily:"system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:${SH.ink4};border-radius:2px}button:focus{outline:none}input[type=range]{-webkit-appearance:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:0;height:0}`}</style>
      {/* nav */}
      <div style={{background:SH.paper,borderBottom:`1px solid ${SH.rule}`,padding:"0 16px",height:46,display:"flex",alignItems:"center",gap:0,flexShrink:0}}>
        <button onClick={()=>setTool(null)}
          style={{fontSize:13,fontWeight:700,color:SH.ink,fontFamily:"Georgia,serif",background:"none",border:"none",cursor:"pointer",paddingRight:20,borderRight:`1px solid ${SH.rule}`,marginRight:4,height:"100%",letterSpacing:"-0.02em"}}>
          Mime
        </button>
        {TOOLS.map(t=>(
          <button key={t.id} onClick={()=>setTool(t.id)}
            style={{padding:"0 12px",height:"100%",border:"none",borderBottom:`2px solid ${tool===t.id?SH.brand:"transparent"}`,background:"transparent",color:tool===t.id?SH.brand:SH.ink3,fontSize:10.5,fontWeight:tool===t.id?600:400,cursor:"pointer",whiteSpace:"nowrap",transition:"color 0.15s"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {/* tool */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {tool==="flow"      && <TokenFlow/>}
        {tool==="matrix"   && <NDMatrix/>}
        {tool==="simulator"&& <Simulator/>}
        {tool==="debt"     && <DebtLab/>}
        {tool==="naming"   && <NamingGame/>}
      </div>
    </div>
  );
}
