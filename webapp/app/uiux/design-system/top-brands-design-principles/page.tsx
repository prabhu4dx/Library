"use client"
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  bg: "#F7F5F1",
  surface: "#FFFFFF",
  surfaceAlt: "#F2F0EC",
  surfaceHover: "#E8E6E2",
  border: "#E0DDD7",
  borderMed: "#C5C1B9",
  text: "#1A1916",
  textSec: "#565249",
  textMuted: "#98948E",
  textLight: "#BFBBB4",
  accent: "#1D4ED8",
  accentLight: "#EFF6FF",
  accentMed: "#BFDBFE",
  shadow: "rgba(26,25,22,0.07)",
  shadowMd: "rgba(26,25,22,0.13)",
};

const AC = {
  invisible:   { p: "#059669", bg: "#ECFDF5", border: "#A7F3D0", text: "#065F46" },
  systematic:  { p: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE", text: "#1E3A8A" },
  pragmatic:   { p: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", text: "#5B21B6" },
  opinionated: { p: "#DC2626", bg: "#FEF2F2", border: "#FECACA", text: "#991B1B" },
};

/* ─── DATA ─── */
const BRANDS = {
  Apple:      { a:"invisible",   yr:1977, e:"🍎", tag:"Invisible craft",       s:{clarity:10,access:9,motion:8,expr:5,consist:10,craft:10,open:3,ent:4}},
  Google:     { a:"systematic",  yr:2014, e:"🟡", tag:"Universe with physics", s:{clarity:9,access:9,motion:10,expr:10,consist:8,craft:9,open:10,ent:7}},
  Microsoft:  { a:"pragmatic",   yr:2017, e:"🪟", tag:"Calm technology",       s:{clarity:9,access:10,motion:7,expr:6,consist:9,craft:8,open:8,ent:10}},
  IBM:        { a:"pragmatic",   yr:2015, e:"🔷", tag:"Modernist heritage",    s:{clarity:8,access:9,motion:7,expr:5,consist:10,craft:9,open:9,ent:10}},
  Salesforce: { a:"pragmatic",   yr:2015, e:"⚡", tag:"Clarity above beauty",  s:{clarity:10,access:9,motion:5,expr:4,consist:9,craft:7,open:6,ent:10}},
  Atlassian:  { a:"pragmatic",   yr:2012, e:"🔺", tag:"Empower teams",         s:{clarity:8,access:8,motion:6,expr:6,consist:7,craft:7,open:8,ent:9}},
  Adobe:      { a:"invisible",   yr:2013, e:"🎨", tag:"Tools that disappear",  s:{clarity:8,access:9,motion:7,expr:8,consist:8,craft:9,open:5,ent:8}},
  Shopify:    { a:"opinionated", yr:2017, e:"🛍️", tag:"Pro tool with soul",   s:{clarity:9,access:8,motion:6,expr:7,consist:8,craft:9,open:7,ent:6}},
  Stripe:     { a:"opinionated", yr:2011, e:"💳", tag:"Infrastructure beauty", s:{clarity:10,access:8,motion:7,expr:8,consist:9,craft:10,open:5,ent:8}},
  Airbnb:     { a:"invisible",   yr:2016, e:"🏠", tag:"Trust by design",       s:{clarity:8,access:7,motion:8,expr:9,consist:8,craft:9,open:6,ent:4}},
  Meta:       { a:"invisible",   yr:2004, e:"🔵", tag:"Blank canvas scale",    s:{clarity:8,access:8,motion:7,expr:7,consist:7,craft:7,open:5,ent:8}},
  Samsung:    { a:"systematic",  yr:2019, e:"📱", tag:"Ergonomics first",      s:{clarity:8,access:7,motion:8,expr:6,consist:9,craft:8,open:4,ent:7}},
  Linear:     { a:"opinionated", yr:2019, e:"🔲", tag:"Quality as strategy",  s:{clarity:10,access:7,motion:8,expr:7,consist:9,craft:10,open:5,ent:6}},
  Vercel:     { a:"opinionated", yr:2023, e:"▲",  tag:"Swiss dev precision",  s:{clarity:10,access:7,motion:3,expr:3,consist:10,craft:9,open:7,ent:6}},
  Notion:     { a:"opinionated", yr:2016, e:"📝", tag:"Tools for thought",    s:{clarity:7,access:7,motion:5,expr:8,consist:7,craft:8,open:7,ent:5}},
  Figma:      { a:"opinionated", yr:2016, e:"🎯", tag:"Collaboration native", s:{clarity:9,access:8,motion:7,expr:8,consist:7,craft:9,open:9,ent:7}},
  Spotify:    { a:"systematic",  yr:2021, e:"🎵", tag:"Family of systems",    s:{clarity:8,access:8,motion:8,expr:9,consist:7,craft:8,open:6,ent:6}},
  Monday:     { a:"systematic",  yr:2020, e:"🟣", tag:"Platform coherence",   s:{clarity:8,access:7,motion:7,expr:8,consist:7,craft:7,open:8,ent:7}},
  AntDesign:  { a:"pragmatic",   yr:2015, e:"🐜", tag:"Gestalt principles",   s:{clarity:8,access:8,motion:6,expr:5,consist:9,craft:8,open:9,ent:9}},
};

const SL = {
  clarity:"Clarity", access:"Accessibility", motion:"Motion", expr:"Expression",
  consist:"Consistency", craft:"Craft", open:"Openness", ent:"Enterprise"
};

const INFLUENCES = [
  ["Apple","Stripe"],["Apple","Linear"],["Apple","Shopify"],["Apple","Airbnb"],
  ["Google","Samsung"],["Google","Atlassian"],["Google","Monday"],["Google","Figma"],
  ["IBM","Microsoft"],["IBM","Salesforce"],["IBM","AntDesign"],
  ["Airbnb","Linear"],["Airbnb","Figma"],
  ["Figma","Notion"],["Figma","Linear"],
  ["Microsoft","Salesforce"],["Adobe","Figma"],["Stripe","Vercel"],["Shopify","Notion"],
];

const TIMELINE = [
  {yr:1977,b:"Apple",ev:"Apple HIG — world's first digital design system"},
  {yr:2004,b:"Meta",ev:"Facebook design principles — blank canvas for human connection at scale"},
  {yr:2010,b:"Microsoft",ev:"Metro — pioneered flat design before Google or Apple"},
  {yr:2012,b:"Atlassian",ev:"Atlassian DS — empowerment over control; teams not individuals"},
  {yr:2013,b:"Adobe",ev:"Spectrum v1 — Dieter Rams-inspired professional brutalism"},
  {yr:2014,b:"Google",ev:"Material Design — 'ontology as interface', digital physics"},
  {yr:2015,b:"IBM",ev:"Carbon — modernist heritage + man/machine motion duality"},
  {yr:2015,b:"Salesforce",ev:"Lightning — beauty ranked last; clarity ranked first"},
  {yr:2015,b:"AntDesign",ev:"Ant Design — Gestalt psychology at Alibaba scale"},
  {yr:2016,b:"Airbnb",ev:"DLS — biological metaphor; designing trust between strangers"},
  {yr:2016,b:"Figma",ev:"Figma — collaboration as native element, not a feature"},
  {yr:2016,b:"Notion",ev:"Notion — Engelbart's vision: users modify their own tools"},
  {yr:2017,b:"Microsoft",ev:"Fluent — 85+ research studies; calm technology philosophy"},
  {yr:2017,b:"Shopify",ev:"Polaris — physical desk inspiration; green replaced by black"},
  {yr:2019,b:"Samsung",ev:"One UI — interactive elements relocated to thumb reach zone"},
  {yr:2019,b:"Linear",ev:"Linear — quality as first principle; taste beats A/B testing"},
  {yr:2020,b:"Monday",ev:"Vibe — open-source platform coherence for third parties"},
  {yr:2021,b:"Google",ev:"Material You — radical personalisation; form follows feeling"},
  {yr:2021,b:"Spotify",ev:"Encore — 22 systems unified under squad-governance model"},
  {yr:2023,b:"Vercel",ev:"Geist — Swiss precision; custom typeface; zero decoration"},
  {yr:2024,b:"Salesforce",ev:"Cosmos — rounded = interactive; square = static (shape semantics)"},
  {yr:2025,b:"Apple",ev:"Liquid Glass — most significant visual shift since iOS 7"},
  {yr:2025,b:"Adobe",ev:"Spectrum 2 — pivot from brutalist to joyful and inclusive"},
];

const DIVERGENCES = [
  { id:"beauty",  label:"Beauty Priority",        lo:"Utility first",           hi:"Beauty = ethics",
    vals:{Apple:9,Stripe:10,Linear:9,Airbnb:8,Shopify:8,Google:7,Figma:8,Spotify:7,Notion:7,Adobe:7,Microsoft:6,Samsung:6,IBM:5,Atlassian:5,Monday:5,AntDesign:5,Meta:5,Vercel:4,Salesforce:2}},
  { id:"expr",    label:"Expression vs Control",  lo:"Enforce consistency",     hi:"Celebrate expression",
    vals:{Google:10,Airbnb:9,Spotify:9,Meta:8,Monday:8,Notion:8,Figma:8,Adobe:8,Shopify:7,Linear:7,Stripe:7,Samsung:6,IBM:5,Microsoft:6,Atlassian:6,AntDesign:5,Salesforce:4,Apple:5,Vercel:3}},
  { id:"open",    label:"Open Source",            lo:"Proprietary/closed",      hi:"Fully open community",
    vals:{Google:10,IBM:9,Figma:9,Monday:8,AntDesign:9,Atlassian:8,Microsoft:8,Adobe:5,Shopify:7,Spotify:6,Samsung:4,Linear:5,Vercel:7,Notion:7,Stripe:5,Airbnb:6,Meta:5,Salesforce:6,Apple:3}},
  { id:"motion",  label:"Motion Philosophy",      lo:"Motion = latency",        hi:"Motion = meaning",
    vals:{Google:10,Apple:8,Airbnb:8,Spotify:8,Samsung:8,Monday:7,Figma:7,Stripe:7,Microsoft:7,Linear:8,Adobe:7,Shopify:6,IBM:7,Atlassian:6,Meta:7,Notion:5,Salesforce:5,AntDesign:6,Vercel:3}},
  { id:"ent",     label:"Enterprise Fit",         lo:"Consumer / personal",     hi:"Enterprise / mission-critical",
    vals:{IBM:10,Microsoft:10,Salesforce:10,AntDesign:9,Atlassian:9,Adobe:8,Meta:8,Google:7,Samsung:7,Figma:7,Stripe:8,Shopify:6,Linear:6,Vercel:6,Monday:7,Spotify:6,Airbnb:4,Notion:5,Apple:4}},
];

const DETAILS = {
  Apple:      { q:"When people use the products you've made, they should feel gratitude to our species.", qa:"Jony Ive", p:"The interface exists to disappear. Clarity, deference, depth — in that order. Liquid Glass in 2025 is the deepest expression of hardware-software philosophy: only possible when you own the chip, OS, and screen simultaneously.", key:["Vertical integration enables unique UI capabilities","Craft as moral imperative — finish the back of the drawer","Deference: content always takes priority over chrome","Continuous hardware and software unity"] },
  Google:     { q:"What if form not only followed function, but also followed feeling?", qa:"Matías Duarte", p:"Material Design is ontology — it defines what digital objects are, not just how they look. Material You's Dynamic Color generates an entirely unique interface for each of a billion users.", key:["Ontology as interface design — defining digital physics","Universe with physics, depth, and material behaviour","Design system for making design systems","Dynamic Color — no two UIs look alike"] },
  Microsoft:  { q:"Fluent isn't a brand. Fluent is a strategic initiative.", qa:"Joseph McLaughlin", p:"85+ user research studies revealed calmness depends on feeling in control. Every principle carries dual dimensions: functional and emotional. 'Built for focus' means less clutter (functional) and centered, calm, confident (emotional).", key:["Calm technology research — 85+ user studies","Dual functional and emotional principles (unique)","80% native platform rule — cross-platform honesty","Acrylic and Mica material effects for depth"] },
  IBM:        { q:"Without aesthetic, the computer is but a mindless speed machine.", qa:"Paul Rand", p:"IBM borrows modernist attitudes from Rand and Eames, not their aesthetics. The 2x Grid and IBM Plex type are mathematical precision. The productive/expressive motion duality is uniquely sophisticated.", key:["Mid-century modernist attitudes, not aesthetics","2x Grid: everything divides or multiplies by 2","Motion duality: productive vs expressive","Enterprise Design Thinking at 10 000+ scale"] },
  Salesforce: { q:"'But what's the priority order?' — it's a standing joke at Salesforce.", qa:"JD Vogt, UX Lead", p:"Stack-ranking is philosophically brave. Most systems claim all principles are equal. Salesforce publicly says they're not. The 2024 Cosmos: rounded corners = interactive, square = static.", key:["Stack-ranked principles — rare industry honesty","Shape semantics: round = interactive","Clarity always wins every design conflict","Preparing for AI agent design layer"] },
  Atlassian:  { q:"A design system is a tool for empowerment, not a weapon to control design.", qa:"Matt Bond", p:"Verb-first principles force the system to serve teams rather than police designers. Anti-consistency-as-default is an explicit documented stance. Born at a hackathon on a Mac Pro under someone's desk.", key:["Verb-first action-oriented principles","Reject consistency-for-its-own-sake","Team as the primary design unit","Co-created through cross-functional workshops"] },
  Adobe:      { q:"Consistency is an idea designers think is universal. It is not.", qa:"Shawn Cheris", p:"Spectrum evolved from brutalist gray to warm and joyful. Firefly and Express research revealed the old approach was 'anything but welcoming' to new users. User-adjustable contrast and density is still unique.", key:["Brutalist to joyful — a decade-long evolution","User-adjustable contrast and density","Attention hierarchy: reserve accent for high action","100+ products unified under one system"] },
  Shopify:    { q:"Approach content like Jenga. What's the most you can take away?", qa:"Shopify Polaris Team", p:"The breakthrough was studying physical objects on merchants' real desks, not digital references. Buttons were designed to feel like plastic, not glass. Replacing green with black was a statement about professional respect.", key:["Physical-world inspiration, not digital trends","Green → Black: professional authority","The cha-ching sound = joy through accomplishment","Merchant livelihood as design constraint"] },
  Stripe:     { q:"Beautiful work indicates care for the world.", qa:"Stripe Operating Principles", p:"Stripe proved B2B infrastructure deserves beauty. The first designer Ludwig Pettersson implemented the dashboard code himself — design-engineering fusion as cultural DNA from day one.", key:["B2B beauty as ethical act — not decoration","Design-engineering fusion from day 1","Animated gradient as signature visual language","Stripe Press: craft extended into physical books"] },
  Airbnb:     { q:"Trust is what Airbnb managed to innovate — trust between strangers at scale.", qa:"Alex Schleifer, VP Design", p:"Founded by RISD designers. The biological-systems metaphor for the DLS rejected atomic design: components are elements of a living organism. Karri Saarinen took this philosophy to Linear.", key:["Trust = the core design output","Biological systems metaphor for components","Design, Eng, Product as co-equal legs","RISD-founder DNA: craft from the very origin"] },
  Meta:       { q:"Our design needs to work for everyone, every culture, every language, every stage of life.", qa:"Meta Design Principles", p:"Meta deliberately maintains 20+ design systems. Federated architecture by conviction. Horizon OS is one of the first native spatial computing systems.", key:["20+ systems federated by design conviction","Spatial computing pioneer with Horizon OS","Universal: every human, every context","Facebook original 7 principles remain active"] },
  Samsung:    { q:"Even if it saves 1 or 2 seconds of a user's time, it's worth the effort.", qa:"Jeonggun Choi, Principal UX", p:"One ergonomic insight — screens grew too tall for thumbs — drove an entire philosophy. Interactive elements moved to the lower half. This reshaped Android ergonomics industry-wide.", key:["Ergonomics as ideology, not just feature","Thumb reach zone as design constraint","Multi-sensory: motion and sound in coherence","Coherence across the most diverse hardware ecosystem"] },
  Linear:     { q:"We started with quality. Then we learned people noticed — because it's rare.", qa:"Karri Saarinen, CEO", p:"$1.25B valuation. $35 000 lifetime marketing spend. Quality as first principle generates word-of-mouth no advertising budget can buy. Polishing seasons as institutional practice prevent quality decay.", key:["Quality = first principle — all else flows from it","Polishing seasons prevent quality drift institutionally","Taste-driven development, anti-A/B testing by design","96% employee retention driven by craft culture"] },
  Vercel:     { q:"Every animation that adds delay is a design failure.", qa:"Vercel Design Team", p:"Swiss International Typographic Style applied to developer tooling. Geist Sans + Geist Mono optimised for 12–14px — the density of code. Dashboard redesign reduced First Meaningful Paint by 1.2 seconds.", key:["Swiss precision applied to developer workflow","Custom typeface for code-density sizes","Motion = latency; avoid it entirely","Dashboard FMP improved 1.2 s through pure design"] },
  Notion:     { q:"We shape our tools, and thereafter our tools shape us.", qa:"Marshall McLuhan (core Notion philosophy)", p:"Douglas Engelbart as patron saint. Alan Kay as intellectual origin. The block-based architecture is an argument: software users deserve to modify their tools. Company rebuilt from scratch in Kyoto.", key:["Engelbart: augmenting human intellect","Alan Kay: user-modifiable software","Rebuilt from scratch in Kyoto — philosophy over commerce","'Sugar-coated broccoli' product strategy"] },
  Figma:      { q:"Design isn't meant to be solitary. Our multiplayer canvas is that argument.", qa:"Dylan Field, CEO", p:"Multiplayer cursors weren't a feature bolted on — they were in the architecture from day one. Seeing collaborators' presence became part of the creative process. The Community marketplace turned a tool into an ecosystem.", key:["Collaboration = native to architecture, not feature","Multiplayer built from architecture level","Community marketplace as product ecosystem","Influenced every design system build workflow"] },
  Spotify:    { q:"Not too much, not too little — lagom guides every decision.", qa:"Spotify Design Team", p:"Consolidating 22 disconnected systems into Encore required genuine governance innovation. Distributed governance mirrors Spotify's squad model. The Swedish lagom principle guides every scale choice.", key:["22 → 1 system consolidation project","Squad-governance mirrors org structure","Lagom: just the right amount","Encore: family of systems, not monolith"] },
  Monday:     { q:"Apps built on monday.com should feel native, not bolted on.", qa:"Monday.com Design Team", p:"Most design systems target internal products. Vibe targets third-party developers building marketplace apps. Open-source with 80+ contributors, treating design consistency as a shared ecosystem responsibility.", key:["Third-party ecosystem orientation (unique)","Open-source with 80+ contributors","Platform coherence as competitive moat","Vibe: the work OS design language"] },
  AntDesign:  { q:"Perfection is when there is nothing left to take away.", qa:"Saint-Exupéry (cited in Ant Design docs)", p:"The most explicit application of Gestalt psychology in any production design system. Natural laws of perception are codified into component behaviour. Scaled to Alibaba Group — the largest APAC user base.", key:["Gestalt psychology systematically applied","Natural laws of perception in UI components","Alibaba scale: largest APAC adoption","Scientific design methodology codified"] },
};

/* ─── VIEWPORT HOOK ─── */
function useViewport(minS = 0.2, maxS = 6) {
  const [tf, setTf] = useState({ x: 0, y: 0, scale: 1, rotate: 0 });
  const containerRef = useRef(null);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const pan    = useCallback((dx, dy) => setTf(t => ({ ...t, x: t.x + dx, y: t.y + dy })), []);
  const zoom   = useCallback((delta, cx, cy) => setTf(t => {
    const ns = Math.min(maxS, Math.max(minS, t.scale * (1 + delta)));
    const f = ns / t.scale;
    return { ...t, scale: ns, x: cx - (cx - t.x) * f, y: cy - (cy - t.y) * f };
  }), [minS, maxS]);
  const rotate = useCallback((deg) => setTf(t => ({ ...t, rotate: t.rotate + deg })), []);
  const reset  = useCallback(() => setTf({ x: 0, y: 0, scale: 1, rotate: 0 }), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoom(-e.deltaY * 0.0012, e.clientX - r.left, e.clientY - r.top);
    };
    const onDown = (e) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        isPanning.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        el.style.cursor = "grabbing";
        e.preventDefault();
      }
    };
    const onMove = (e) => {
      if (!isPanning.current) return;
      pan(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { isPanning.current = false; el.style.cursor = ""; };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [pan, zoom]);

  return { tf, setTf, containerRef, pan, zoom, rotate, reset };
}

/* ─── CONTROLS ─── */
function Controls({ vp }) {
  const [hov, setHov] = useState(null);
  const getCenter = () => {
    const el = vp.containerRef.current;
    return el ? { x: el.offsetWidth / 2, y: el.offsetHeight / 2 } : { x: 400, y: 300 };
  };
  const items = [
    { k:"zi", icon:"＋", label:"Zoom in",      action:() => { const c = getCenter(); vp.zoom(0.22, c.x, c.y); } },
    { k:"zo", icon:"－", label:"Zoom out",     action:() => { const c = getCenter(); vp.zoom(-0.22, c.x, c.y); } },
    { k:"div1", divider:true },
    { k:"rl", icon:"↺", label:"Rotate ‑15°",  action:() => vp.rotate(-15) },
    { k:"rr", icon:"↻", label:"Rotate +15°",  action:() => vp.rotate(15) },
    { k:"div2", divider:true },
    { k:"pu", icon:"↑", label:"Pan up",       action:() => vp.pan(0, -50) },
    { k:"pd", icon:"↓", label:"Pan down",     action:() => vp.pan(0, 50) },
    { k:"pl", icon:"←", label:"Pan left",     action:() => vp.pan(-50, 0) },
    { k:"pr", icon:"→", label:"Pan right",    action:() => vp.pan(50, 0) },
    { k:"div3", divider:true },
    { k:"rs", icon:"⊙", label:"Reset",        action:() => vp.reset() },
  ];

  return (
    <div style={{
      position:"absolute", bottom:16, right:16, zIndex:60,
      background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
      padding:"7px 8px", boxShadow:`0 4px 16px ${T.shadowMd}`,
      display:"flex", flexDirection:"column", gap:2,
    }}>
      {/* Scale readout */}
      <div style={{ textAlign:"center", fontSize:11, fontFamily:"'DM Mono',monospace", color:T.textMuted, padding:"2px 4px 4px", borderBottom:`1px solid ${T.border}`, marginBottom:2 }}>
        {Math.round(vp.tf.scale * 100)}%
        {vp.tf.rotate !== 0 && <span style={{ marginLeft:4 }}>{vp.tf.rotate}°</span>}
      </div>
      {items.map(it => {
        if (it.divider) return <div key={it.k} style={{ height:1, background:T.border, margin:"2px 0" }} />;
        const isH = hov === it.k;
        return (
          <button key={it.k} onClick={it.action}
            onMouseEnter={() => setHov(it.k)} onMouseLeave={() => setHov(null)}
            title={it.label}
            style={{
              width:34, height:28, border:`1px solid ${isH ? T.borderMed : T.border}`,
              borderRadius:6, background:isH ? T.surfaceAlt : T.surface,
              color:isH ? T.text : T.textSec, fontSize:15, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.12s", fontFamily:"system-ui",
            }}>
            {it.icon}
          </button>
        );
      })}
      {/* Hint */}
      <div style={{ fontSize:9, color:T.textLight, textAlign:"center", marginTop:2, lineHeight:1.4, padding:"0 2px" }}>
        Alt+drag<br/>Scroll=zoom
      </div>
    </div>
  );
}

/* ─── CANVAS FORCE GRAPH ─── */
function ForceGraph({ onSelect, selected }) {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);
  const st        = useRef({ nodes:[], drag:null, hovered:null });
  const vp        = useViewport(0.15, 6);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;

    const bNames = Object.keys(BRANDS);
    const aNames = [...new Set(bNames.map(b => BRANDS[b].a))];
    const W = () => canvas.width, H = () => canvas.height;
    const cx = () => W()/2, cy = () => H()/2;

    const archNodes = aNames.map((id,i) => {
      const ang = (i/aNames.length)*Math.PI*2 - Math.PI/2;
      const dist = Math.min(W(),H())*0.20;
      return { id, type:"arch", x:cx()+Math.cos(ang)*dist, y:cy()+Math.sin(ang)*dist, vx:0,vy:0, r:22 };
    });
    const brandNodes = bNames.map((id,i) => {
      const ang = (i/bNames.length)*Math.PI*2;
      const dist = Math.min(W(),H())*0.39;
      return { id, type:"brand", x:cx()+Math.cos(ang)*dist, y:cy()+Math.sin(ang)*dist, vx:0,vy:0, r:14 };
    });
    st.current.nodes = [...archNodes, ...brandNodes];

    const getN = id => st.current.nodes.find(n=>n.id===id);
    const links: { s: string, t: string, k: number, inf?: boolean }[] = [
      ...bNames.map(b=>({ s:b, t:BRANDS[b as keyof typeof BRANDS].a, k:0.09, inf:false })),
      ...INFLUENCES.map(([a,b])=>({ s:a, t:b, k:0.006, inf:true })),
    ];

    const tick = () => {
      const nodes = st.current.nodes;
      for (let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[j].x-nodes[i].x, dy=nodes[j].y-nodes[i].y;
        const d=Math.sqrt(dx*dx+dy*dy)||1, md=(nodes[i].r+nodes[j].r)*2.4;
        if(d<md){const f=(md-d)/d*0.5;nodes[i].vx-=dx*f;nodes[i].vy-=dy*f;nodes[j].vx+=dx*f;nodes[j].vy+=dy*f;}
      }
      links.forEach(l=>{
        const s=getN(l.s),t=getN(l.t);if(!s||!t)return;
        const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1,ideal=l.inf?88:52;
        const f=(d-ideal)/d*l.k;s.vx+=dx*f;s.vy+=dy*f;t.vx-=dx*f;t.vy-=dy*f;
      });
      nodes.forEach(n=>{n.vx+=(cx()-n.x)*0.004;n.vy+=(cy()-n.y)*0.004;});
      nodes.forEach(n=>{
        if(st.current.drag===n.id)return;
        n.vx*=0.80;n.vy*=0.80;n.x+=n.vx;n.y+=n.vy;
        n.x=Math.max(n.r+8,Math.min(W()-n.r-8,n.x));
        n.y=Math.max(n.r+8,Math.min(H()-n.r-8,n.y));
      });
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,W(),H());
      const { x, y, scale } = vp.tf;
      ctx.save();
      ctx.translate(x,y); ctx.scale(scale,scale);

      // White background
      ctx.fillStyle="#F7F5F1";
      ctx.fillRect(-x/scale,-y/scale,W()/scale,H()/scale);
      // Subtle dot grid
      ctx.fillStyle="rgba(0,0,0,0.04)";
      const step=30/scale<5?30:30;
      const startX=Math.floor((-x/scale)/step)*step;
      const startY=Math.floor((-y/scale)/step)*step;
      for(let gx=startX;gx<-x/scale+W()/scale;gx+=step)
        for(let gy=startY;gy<-y/scale+H()/scale;gy+=step)
          ctx.fillRect(gx,gy,1.5,1.5);

      const nodes=st.current.nodes, hov=st.current.hovered;

      // Influence links
      INFLUENCES.forEach(([a,b])=>{
        const sn=getN(a),tn=getN(b);if(!sn||!tn)return;
        ctx.beginPath();ctx.setLineDash([4,8]);
        ctx.strokeStyle="rgba(29,78,216,0.22)";ctx.lineWidth=1.2;
        ctx.moveTo(sn.x,sn.y);ctx.lineTo(tn.x,tn.y);ctx.stroke();ctx.setLineDash([]);
      });
      // Arch links
      bNames.forEach(b=>{
        const sn=getN(b),tn=getN(BRANDS[b].a);if(!sn||!tn)return;
        ctx.beginPath();ctx.strokeStyle=AC[BRANDS[b].a]?.p+"28";ctx.lineWidth=1;
        ctx.moveTo(sn.x,sn.y);ctx.lineTo(tn.x,tn.y);ctx.stroke();
      });
      // Arch hubs
      aNames.forEach(id=>{
        const n=getN(id);if(!n)return;
        const {p:col,bg:bgC,border:brd}=AC[id];
        ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fillStyle=bgC;ctx.fill();
        ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle=col;ctx.font="600 8px 'Lato',sans-serif";
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(id.charAt(0).toUpperCase()+id.slice(1,5),n.x,n.y);
      });
      // Brand nodes
      bNames.forEach(id=>{
        const n=getN(id);if(!n)return;
        const d=BRANDS[id],col=AC[d.a]?.p||"#888";
        const isSel=selected===id,isH=hov===id;
        const rad=isSel?n.r+3:n.r;
        if(isH||isSel){ctx.shadowColor=col+"40";ctx.shadowBlur=10;}
        ctx.beginPath();ctx.arc(n.x,n.y,rad,0,Math.PI*2);
        ctx.fillStyle=isSel?col+"18":isH?col+"10":"#FFFFFF";ctx.fill();
        ctx.strokeStyle=isSel?col:isH?col+"CC":col+"55";
        ctx.lineWidth=isSel?2.5:1.2;ctx.stroke();
        ctx.shadowBlur=0;
        ctx.font=`${isSel?13:11}px sans-serif`;
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(d.e,n.x,n.y-1);
        if(isH||isSel){
          ctx.font=`700 ${isSel?10:9}px 'Lato',sans-serif`;
          ctx.textAlign="center";ctx.textBaseline="top";
          ctx.fillStyle=col;ctx.fillText(id,n.x,n.y+rad+4);
        }
      });
      ctx.restore();
    };

    let dragged=false,dragStart=null;
    const toC=(e)=>{
      const r=canvas.getBoundingClientRect(),{x,y,scale}=vp.tf;
      return {x:(e.clientX-r.left-x)/scale,y:(e.clientY-r.top-y)/scale};
    };
    const nodeAt=(cx,cy)=>st.current.nodes.find(n=>{const dx=cx-n.x,dy=cy-n.y;return Math.sqrt(dx*dx+dy*dy)<n.r+5;});
    const onMove=(e)=>{
      const {x,y}=toC(e),n=nodeAt(x,y);
      st.current.hovered=n?.id||null;
      canvas.style.cursor=n?"pointer":"";
      if(st.current.drag){
        const dn=st.current.nodes.find(nn=>nn.id===st.current.drag);
        if(dn){dn.x=x;dn.y=y;dn.vx=0;dn.vy=0;dragged=true;}
      }
    };
    const onDown=(e)=>{
      if(e.altKey||e.button!==0)return;
      const {x,y}=toC(e),n=nodeAt(x,y);
      if(n){st.current.drag=n.id;dragStart=n.id;dragged=false;e.stopPropagation();}
    };
    const onUp=()=>{
      if(!dragged&&dragStart)onSelect(dragStart);
      st.current.drag=null;dragStart=null;dragged=false;
    };
    canvas.addEventListener("mousemove",onMove);
    canvas.addEventListener("mousedown",onDown);
    canvas.addEventListener("mouseup",onUp);
    const loop=()=>{tick();draw();frameRef.current=requestAnimationFrame(loop);};
    loop();
    return()=>{
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener("mousemove",onMove);
      canvas.removeEventListener("mousedown",onDown);
      canvas.removeEventListener("mouseup",onUp);
      ro.disconnect();
    };
  },[]);

  return (
    <div ref={vp.containerRef} style={{flex:1,position:"relative",overflow:"hidden"}}>
      <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/>
      <div style={{position:"absolute",bottom:16,left:16,fontSize:11,color:T.textMuted,background:T.surface+"F0",borderRadius:7,padding:"5px 11px",border:`1px solid ${T.border}`,boxShadow:`0 1px 6px ${T.shadow}`}}>
        Click node to inspect · Alt+drag or wheel to pan/zoom
      </div>
      <Controls vp={vp}/>
    </div>
  );
}

/* ─── RADAR ─── */
function RadarChart({ brands: sel }) {
  const vp = useViewport(0.25, 6);
  const axes = Object.keys(SL), n = axes.length;
  const size = 500, cx = size/2, cy = size/2, r = size*0.36;
  const pt = (i,v) => { const a=(i/n)*Math.PI*2-Math.PI/2,d=(v/10)*r; return {x:cx+Math.cos(a)*d,y:cy+Math.sin(a)*d}; };

  return (
    <div ref={vp.containerRef} style={{flex:1,position:"relative",overflow:"hidden",background:T.bg}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{
          transformOrigin:"center",
          transform:`translate(${vp.tf.x}px,${vp.tf.y}px) scale(${vp.tf.scale}) rotate(${vp.tf.rotate}deg)`,
        }}>
          <svg width={size} height={size} style={{overflow:"visible"}}>
            {[2,4,6,8,10].map(v=>{
              const pts=axes.map((_,i)=>{const p=pt(i,v);return `${p.x},${p.y}`;}).join(" ");
              return (
                <g key={v}>
                  <polygon points={pts} fill={v%4===0?"#F0EEED":"none"} stroke={T.border} strokeWidth="1"/>
                  <text x={cx+5} y={pt(0,v).y+1} fontSize="9" fill={T.textMuted} fontFamily="'DM Mono',monospace">{v}</text>
                </g>
              );
            })}
            {axes.map((_,i)=>{const p=pt(i,10);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={T.border} strokeWidth="1"/>;})}
            {axes.map((ax,i)=>{
              const p=pt(i,13.2);
              return <text key={ax} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="700" fill={T.textSec} fontFamily="'Lato',sans-serif">{SL[ax as keyof typeof SL]}</text>;
            })}
            {sel.map(nm=>{
              const d=BRANDS[nm as keyof typeof BRANDS];if(!d)return null;
              const pts=axes.map((ax,i)=>{const p=pt(i,d.s[ax as keyof typeof SL]);return `${p.x},${p.y}`;}).join(" ");
              const col=AC[d.a]?.p;
              return (
                <g key={nm}>
                  <polygon points={pts} fill={col} fillOpacity="0.1" stroke={col} strokeWidth="2.5" strokeLinejoin="round"/>
                  {axes.map((ax,i)=>{const p=pt(i,d.s[ax as keyof typeof SL]);return <circle key={ax} cx={p.x} cy={p.y} r="5" fill={T.surface} stroke={col} strokeWidth="2"/>;  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <Controls vp={vp}/>
    </div>
  );
}

/* ─── BUBBLE MATRIX ─── */
function BubbleMatrix({ xa, ya }) {
  const vp = useViewport(0.25, 6);
  const W=660,H=500,pL=76,pB=56,pT=36,pR=32;
  const pW=W-pL-pR,pH=H-pB-pT;
  const tX=v=>pL+((v-1)/9)*pW, tY=v=>pT+((10-v)/9)*pH;
  const [hov,setHov]=useState(null);

  return (
    <div ref={vp.containerRef} style={{flex:1,position:"relative",overflow:"hidden",background:T.bg}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{
          transformOrigin:"center",
          transform:`translate(${vp.tf.x}px,${vp.tf.y}px) scale(${vp.tf.scale}) rotate(${vp.tf.rotate}deg)`,
        }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
            style={{fontFamily:"'Lato',sans-serif",background:T.surface,borderRadius:14,boxShadow:`0 3px 24px ${T.shadowMd}`}}>
            {[2,4,6,8,10].map(v=>(
              <g key={v}>
                <line x1={pL} y1={tY(v)} x2={W-pR} y2={tY(v)} stroke={T.border} strokeWidth="1"/>
                <line x1={tX(v)} y1={pT} x2={tX(v)} y2={H-pB} stroke={T.border} strokeWidth="1"/>
                <text x={pL-8} y={tY(v)} textAnchor="end" dominantBaseline="central" fontSize="10" fill={T.textMuted}>{v}</text>
                <text x={tX(v)} y={H-pB+18} textAnchor="middle" fontSize="10" fill={T.textMuted}>{v}</text>
              </g>
            ))}
            <text x={W/2} y={H-6} textAnchor="middle" fontSize="13" fontWeight="700" fill={T.textSec}>{SL[xa]}</text>
            <text x={14} y={H/2} textAnchor="middle" fontSize="13" fontWeight="700" fill={T.textSec} transform={`rotate(-90 14 ${H/2})`}>{SL[ya]}</text>
            {/* High-high quadrant */}
            <rect x={tX(5)} y={pT} width={pW/2} height={pH/2} fill={T.accentLight} fillOpacity="0.4"/>
            <text x={tX(7.5)} y={pT+16} textAnchor="middle" fontSize="10" fill={T.accent} fillOpacity="0.7" fontWeight="700">High on both</text>
            {Object.entries(BRANDS).map(([nm,d])=>{
              const col=AC[d.a]?.p||"#888",isH=hov===nm;
              const sx=tX(d.s[xa]),sy=tY(d.s[ya]);
              return (
                <g key={nm} onMouseEnter={()=>setHov(nm)} onMouseLeave={()=>setHov(null)} style={{cursor:"pointer"}}>
                  <circle cx={sx} cy={sy} r={isH?17:12} fill={T.surface} stroke={col} strokeWidth={isH?2.5:1.5}/>
                  <circle cx={sx} cy={sy} r={isH?17:12} fill={col} fillOpacity={isH?0.15:0.07}/>
                  <text x={sx} y={sy+1} textAnchor="middle" dominantBaseline="central" fontSize={isH?13:10}>{d.e}</text>
                  {isH&&(
                    <g>
                      <rect x={sx+20} y={sy-30} width={nm.length*8+20} height={42} rx="7" fill={T.surface} stroke={T.borderMed} strokeWidth="1" style={{filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.1))"}}/>
                      <text x={sx+30} y={sy-13} fontSize="13" fontWeight="700" fill={T.text}>{nm}</text>
                      <text x={sx+30} y={sy+4} fontSize="11" fill={T.textSec}>{SL[xa]}: {d.s[xa]}  ·  {SL[ya]}: {d.s[ya]}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <Controls vp={vp}/>
    </div>
  );
}

/* ─── DIVERGENCE VIEW ─── */
function DivergenceView({ dimIdx }) {
  const vp = useViewport(0.25, 5);
  const dim = DIVERGENCES[dimIdx];
  const sorted = Object.entries(dim.vals).sort((a,b)=>b[1]-a[1]);
  const W=700,barH=30,gap=7,labelW=130,rightPad=56,topPad=62;
  const maxBarW=W-labelW-rightPad-20;
  const totalH=topPad+sorted.length*(barH+gap)+30;

  return (
    <div ref={vp.containerRef} style={{flex:1,position:"relative",overflow:"hidden",background:T.bg}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{
          transformOrigin:"center",
          transform:`translate(${vp.tf.x}px,${vp.tf.y}px) scale(${vp.tf.scale}) rotate(${vp.tf.rotate}deg)`,
        }}>
          <svg width={W} height={totalH} viewBox={`0 0 ${W} ${totalH}`}
            style={{fontFamily:"'Lato',sans-serif",background:T.surface,borderRadius:14,boxShadow:`0 3px 24px ${T.shadowMd}`}}>
            <text x={labelW} y={24} fontSize="16" fontWeight="900" fill={T.text}>{dim.label}</text>
            <text x={labelW} y={44} fontSize="11" fill={T.textMuted} fontWeight="600">← {dim.lo}</text>
            <text x={W-rightPad} y={44} fontSize="11" fill={T.textMuted} fontWeight="600" textAnchor="end">{dim.hi} →</text>
            {/* Background track line */}
            <line x1={labelW} y1={topPad-8} x2={labelW+maxBarW} y2={topPad-8} stroke={T.border} strokeWidth="1"/>
            {[0,2,4,6,8,10].map(v=>(
              <g key={v}>
                <line x1={labelW+(v/10)*maxBarW} y1={topPad-12} x2={labelW+(v/10)*maxBarW} y2={topPad-4} stroke={T.borderMed} strokeWidth="1"/>
                <text x={labelW+(v/10)*maxBarW} y={topPad-14} textAnchor="middle" fontSize="9" fill={T.textMuted}>{v}</text>
              </g>
            ))}
            {sorted.map(([nm,v],i)=>{
              const d=BRANDS[nm];if(!d)return null;
              const col=AC[d.a]?.p||"#888";
              const by=topPad+i*(barH+gap);
              const bw=(v/10)*maxBarW;
              return (
                <g key={nm}>
                  <text x={labelW-10} y={by+barH/2+1} textAnchor="end" dominantBaseline="central" fontSize="12" fill={T.text} fontWeight="700">
                    {d.e} {nm}
                  </text>
                  {/* Track */}
                  <rect x={labelW} y={by+4} width={maxBarW} height={barH-8} rx="4" fill={T.surfaceAlt}/>
                  {/* Fill */}
                  <rect x={labelW} y={by+4} width={bw} height={barH-8} rx="4" fill={col} fillOpacity="0.18"/>
                  {/* Leading edge */}
                  <rect x={labelW+bw-4} y={by+4} width={4} height={barH-8} rx="2" fill={col}/>
                  {/* Value */}
                  <text x={labelW+bw+9} y={by+barH/2+1} dominantBaseline="central" fontSize="12" fontWeight="700" fill={col} fontFamily="'DM Mono',monospace">{v}</text>
                  {/* Archetype indicator */}
                  <circle cx={W-20} cy={by+barH/2} r="5" fill={col} fillOpacity="0.25" stroke={col} strokeWidth="1.5"/>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <Controls vp={vp}/>
    </div>
  );
}

/* ─── TIMELINE ─── */
function TimelineView() {
  const vp = useViewport(0.15, 5);
  const byYear={};
  TIMELINE.forEach(t=>{if(!byYear[t.yr])byYear[t.yr]=[];byYear[t.yr].push(t);});
  const years=Object.keys(byYear).map(Number).sort();
  const itemH=52,yearH=28,groupPad=12,W=760;
  let totalH=56;
  const layout=years.map(yr=>{
    const items=byYear[yr];
    const h=yearH+items.length*itemH+groupPad;
    const y=totalH;totalH+=h;
    return {yr,items,y,h};
  });
  totalH+=28;
  const spineX=104;

  return (
    <div ref={vp.containerRef} style={{flex:1,position:"relative",overflow:"hidden",background:T.bg}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:16}}>
        <div style={{
          transformOrigin:"top center",
          transform:`translate(${vp.tf.x}px,${vp.tf.y}px) scale(${vp.tf.scale}) rotate(${vp.tf.rotate}deg)`,
        }}>
          <svg width={W} height={totalH} viewBox={`0 0 ${W} ${totalH}`}
            style={{fontFamily:"'Lato',sans-serif",background:T.surface,borderRadius:14,boxShadow:`0 3px 24px ${T.shadowMd}`}}>
            <text x={spineX+18} y={26} fontSize="16" fontWeight="900" fill={T.text}>Design Systems Timeline</text>
            <text x={spineX+18} y={44} fontSize="11" fill={T.textMuted}>1977 → 2025 · 48 years of philosophy evolution</text>
            {/* Spine */}
            <line x1={spineX} y1={50} x2={spineX} y2={totalH-14} stroke={T.border} strokeWidth="2"/>
            {layout.map(({yr,items,y})=>(
              <g key={yr}>
                <text x={spineX-12} y={y+yearH/2+1} textAnchor="end" dominantBaseline="central"
                  fontSize="13" fontWeight="900" fill={T.accent} fontFamily="'DM Mono',monospace">{yr}</text>
                <circle cx={spineX} cy={y+yearH/2} r="6" fill={T.accent}/>
                <circle cx={spineX} cy={y+yearH/2} r="10" fill={T.accent} fillOpacity="0.15"/>
                {items.map((ev,i)=>{
                  const d=BRANDS[ev.b],col=d?AC[d.a]?.p:T.textMuted;
                  const iy=y+yearH+i*itemH;
                  return (
                    <g key={i}>
                      <line x1={spineX} y1={iy+itemH/2} x2={spineX+16} y2={iy+itemH/2} stroke={col} strokeWidth="1.5"/>
                      <circle cx={spineX+16} cy={iy+itemH/2} r="3.5" fill={col}/>
                      <rect x={spineX+24} y={iy+6} width={W-spineX-40} height={itemH-14} rx="7"
                        fill={AC[d?.a]?.bg||T.surfaceAlt} stroke={col} strokeWidth="0.8" strokeOpacity="0.4"/>
                      <text x={spineX+36} y={iy+20} fontSize="13" fontWeight="700" fill={col}>{d?.e} {ev.b}</text>
                      <text x={spineX+36} y={iy+35} fontSize="11" fill={T.textSec}>{ev.ev}</text>
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        </div>
      </div>
      <Controls vp={vp}/>
    </div>
  );
}

/* ─── DETAIL PANEL ─── */
function DetailPanel({ name, radarB, toggleRadar, onClose }) {
  const d=BRANDS[name],det=DETAILS[name];
  if(!d)return null;
  const {p:col,bg,border:brd,text:colTxt}=AC[d.a];
  return (
    <div style={{width:340,height:"100%",overflowY:"auto",padding:"20px 18px",boxSizing:"border-box",fontFamily:"'Lato',sans-serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:30,marginBottom:4}}>{d.e}</div>
          <div style={{fontSize:20,fontWeight:900,color:T.text,lineHeight:1.15}}>{name}</div>
          <div style={{fontSize:12,color:col,marginTop:4,fontWeight:700}}>{d.tag}</div>
        </div>
        <button onClick={onClose} style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,color:T.textMuted,borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:600}}>✕</button>
      </div>

      <div style={{padding:"8px 12px",borderRadius:8,background:bg,border:`1px solid ${brd}`,marginBottom:16,fontSize:12,color:colTxt,fontWeight:700}}>
        {d.a.charAt(0).toUpperCase()+d.a.slice(1)} archetype · Est. {d.yr}
      </div>

      {det&&(
        <div style={{background:bg,border:`1px solid ${brd}`,borderRadius:10,padding:"13px 15px",marginBottom:16}}>
          <div style={{fontSize:13,fontStyle:"italic",color:T.text,lineHeight:1.65,marginBottom:7}}>"{det.q}"</div>
          <div style={{fontSize:11,color:T.textMuted,fontWeight:700}}>— {det.qa}</div>
        </div>
      )}

      {det&&<p style={{fontSize:13,lineHeight:1.8,color:T.textSec,marginBottom:16}}>{det.p}</p>}

      {det&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:10,fontWeight:800}}>Key Facts</div>
          {det.key.map((k,i)=>(
            <div key={i} style={{display:"flex",gap:9,padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12,color:T.text,alignItems:"flex-start",lineHeight:1.55}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:col,marginTop:5,flexShrink:0}}/>
              {k}
            </div>
          ))}
        </div>
      )}

      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:10,fontWeight:800}}>Score Profile</div>
        {Object.entries(d.s).map(([k,vVal])=>{
          const v = vVal as number;
          return (
          <div key={k} style={{marginBottom:7}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
              <span style={{color:T.textSec,fontWeight:700}}>{SL[k as keyof typeof SL]}</span>
              <span style={{color:col,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{v}/10</span>
            </div>
            <div style={{height:5,background:T.border,borderRadius:3}}>
              <div style={{width:`${v*10}%`,height:"100%",background:col,borderRadius:3,opacity:0.7}}/>
            </div>
          </div>
        );})}
      </div>

      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:10,fontWeight:800}}>Influence Connections</div>
        {INFLUENCES.filter(([a,b])=>a===name||b===name).map(([a,b],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
            <span style={{color:a===name?T.accent:T.textSec,fontWeight:a===name?700:400}}>{BRANDS[a]?.e} {a}</span>
            <span style={{color:T.accent,fontSize:15,lineHeight:1}}>→</span>
            <span style={{color:b===name?T.accent:T.textSec,fontWeight:b===name?700:400}}>{BRANDS[b]?.e} {b}</span>
          </div>
        ))}
      </div>

      <button onClick={()=>toggleRadar(name)} style={{
        width:"100%",padding:"10px 0",
        background:radarB.includes(name)?T.accentLight:T.surfaceAlt,
        border:`1.5px solid ${radarB.includes(name)?T.accentMed:T.border}`,
        color:radarB.includes(name)?T.accent:T.textSec,
        borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,
        transition:"all 0.14s",
      }}>
        {radarB.includes(name)?"✓ Added to radar comparison":"+ Add to radar comparison"}
      </button>
    </div>
  );
}

/* ─── VIEWS CONFIG ─── */
const VIEWS=[
  {id:"mindmap",  label:"Mind Map",    icon:"◎"},
  {id:"radar",    label:"Radar",       icon:"⬡"},
  {id:"matrix",   label:"Matrix",      icon:"⊞"},
  {id:"diverge",  label:"Divergence",  icon:"⇌"},
  {id:"timeline", label:"Timeline",    icon:"⟶"},
];

/* ─── APP ─── */
export default function App() {
  const [view,setView]=useState("mindmap");
  const [sel,setSel]=useState(null);
  const [radarB,setRadarB]=useState(["Apple","Google","IBM","Linear","Stripe"]);
  const [xa,setXa]=useState("clarity");
  const [ya,setYa]=useState("expr");
  const [divIdx,setDivIdx]=useState(0);

  const toggleRadar=nm=>setRadarB(p=>p.includes(nm)?p.length>1?p.filter(b=>b!==nm):p:p.length<5?[...p,nm]:p);

  return (
    <div style={{height:"100vh",background:T.bg,color:T.text,fontFamily:"'Lato',sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* ── TOP BAR ── */}
      <div style={{height:54,background:T.surface,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 20px",gap:16,flexShrink:0,boxShadow:`0 1px 5px ${T.shadow}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${T.accent}44`}}>
            <span style={{fontSize:15,color:"#fff"}}>◎</span>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:900,color:T.text,letterSpacing:"0.01em"}}>DS Cosmos</div>
            <div style={{fontSize:10,color:T.textMuted,fontWeight:400}}>Design Systems Visual Explorer</div>
          </div>
        </div>
        <div style={{width:1,height:24,background:T.border}}/>
        <div style={{display:"flex",gap:3}}>
          {VIEWS.map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)} style={{
              background:view===v.id?T.accentLight:"none",
              border:view===v.id?`1.5px solid ${T.accentMed}`:"1px solid transparent",
              color:view===v.id?T.accent:T.textSec,
              borderRadius:7,padding:"5px 14px",fontSize:13,fontWeight:view===v.id?700:400,
              cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.12s",
            }}>
              <span style={{fontSize:11}}>{v.icon}</span>{v.label}
            </button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          {Object.entries(AC).map(([k,c])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.textSec}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c.p}}/>
              <span style={{fontWeight:700}}>{k.charAt(0).toUpperCase()+k.slice(1)}</span>
            </div>
          ))}
          <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.textMuted}}>
            <svg width="22" height="8" style={{verticalAlign:"middle"}}>
              <line x1="0" y1="4" x2="22" y2="4" stroke={T.accent} strokeWidth="1.5" strokeDasharray="3 4"/>
            </svg>
            <span>Influence</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

        {view==="mindmap"&&(
          <>
            <ForceGraph onSelect={setSel} selected={sel}/>
            <div style={{width:sel?340:0,overflow:"hidden",transition:"width 0.28s ease",background:T.surface,borderLeft:`1px solid ${T.border}`,flexShrink:0,boxShadow:sel?`-3px 0 16px ${T.shadow}`:"none"}}>
              {sel&&<DetailPanel name={sel} radarB={radarB} toggleRadar={toggleRadar} onClose={()=>setSel(null)}/>}
            </div>
          </>
        )}

        {view==="radar"&&(
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>
            <div style={{width:215,background:T.surface,borderRight:`1px solid ${T.border}`,overflowY:"auto",padding:"16px 12px",flexShrink:0}}>
              <div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:12,fontWeight:800}}>Select brands (max 5)</div>
              {Object.entries(BRANDS).map(([nm,d])=>{
                const isSel=radarB.includes(nm),col=AC[d.a]?.p;
                return (
                  <div key={nm} onClick={()=>toggleRadar(nm)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,cursor:"pointer",background:isSel?AC[d.a]?.bg:"none",border:`1px solid ${isSel?AC[d.a]?.border:"transparent"}`,marginBottom:3,transition:"all 0.12s"}}>
                    <span style={{fontSize:14}}>{d.e}</span>
                    <span style={{fontSize:12,color:isSel?col:T.textSec,fontWeight:isSel?700:400}}>{nm}</span>
                    {isSel&&<div style={{width:6,height:6,borderRadius:"50%",background:col,marginLeft:"auto"}}/>}
                  </div>
                );
              })}
              <div style={{marginTop:16,padding:"12px",background:T.surfaceAlt,borderRadius:9,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:10,fontWeight:800,color:T.textSec,marginBottom:9,textTransform:"uppercase",letterSpacing:"0.06em"}}>Legend</div>
                {radarB.map(nm=>{const d=BRANDS[nm],col=AC[d?.a]?.p;return(
                  <div key={nm} style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
                    <div style={{width:11,height:11,borderRadius:"50%",border:`2.5px solid ${col}`,background:col+"20"}}/>
                    <span style={{fontSize:12,color:T.textSec,fontWeight:700}}>{d?.e} {nm}</span>
                  </div>
                );})}
                <div style={{fontSize:10,color:T.textMuted,marginTop:8,lineHeight:1.5}}>Each axis 1–10. Research-based scoring.</div>
              </div>
            </div>
            <RadarChart brands={radarB}/>
          </div>
        )}

        {view==="matrix"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"10px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:16,alignItems:"center",flexShrink:0,background:T.surface}}>
              {[["X-axis",xa,setXa],["Y-axis",ya,setYa]].map(([l,v,s])=>{
                const set = s as (val: string) => void;
                return (
                <div key={l as string} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,color:T.textMuted,fontWeight:800}}>{l as string}:</span>
                  <select value={v as string} onChange={e=>set(e.target.value)} style={{background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,padding:"5px 12px",borderRadius:7,fontSize:12,cursor:"pointer",fontFamily:"'Lato',sans-serif",fontWeight:700}}>
                    {Object.entries(SL).map(([k,lbl])=><option key={k} value={k}>{lbl}</option>)}
                  </select>
                </div>
              );})}
              <span style={{fontSize:11,color:T.textMuted}}>Hover bubbles for details · Blue area = high on both axes</span>
            </div>
            <BubbleMatrix xa={xa} ya={ya}/>
          </div>
        )}

        {view==="diverge"&&(
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>
            <div style={{width:205,background:T.surface,borderRight:`1px solid ${T.border}`,padding:"16px 12px",flexShrink:0,display:"flex",flexDirection:"column"}}>
              <div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:12,fontWeight:800}}>Dimensions</div>
              {DIVERGENCES.map((d,i)=>(
                <div key={d.id} onClick={()=>setDivIdx(i)} style={{padding:"10px 12px",borderRadius:7,cursor:"pointer",marginBottom:3,fontSize:13,fontWeight:divIdx===i?700:400,background:divIdx===i?T.accentLight:"none",color:divIdx===i?T.accent:T.textSec,border:`1.5px solid ${divIdx===i?T.accentMed:"transparent"}`,transition:"all 0.12s"}}>
                  {d.label}
                </div>
              ))}
              <div style={{marginTop:16,padding:"12px",background:T.surfaceAlt,borderRadius:9,border:`1px solid ${T.border}`,fontSize:12}}>
                <div style={{fontWeight:800,color:T.textSec,marginBottom:10}}>Archetype averages</div>
                {Object.entries(AC).map(([k,c])=>{
                  const brands=Object.entries(BRANDS).filter(([,d])=>d.a===k);
                  const vals=brands.map(([nm])=>DIVERGENCES[divIdx].vals[nm]||5);
                  const avg=(vals.reduce((a,v)=>a+v,0)/vals.length).toFixed(1);
                  return(
                    <div key={k} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:c.p}}/>
                      <span style={{color:T.textSec,flex:1,fontWeight:700}}>{k.slice(0,5)}</span>
                      <span style={{color:c.p,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{avg}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <DivergenceView dimIdx={divIdx}/>
          </div>
        )}

        {view==="timeline"&&<TimelineView/>}
      </div>
    </div>
  );
}
