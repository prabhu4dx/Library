"use client";
import { useState, useCallback, useRef, useEffect } from "react";

/* ============================================================
   N-DIMENSIONAL TOKEN MATRIX
   
   Each token lives at a point in N-dimensional space.
   Every dimension (color, radius, shadow, typography,
   spacing, motion, state) is an axis you can slide.
   
   Moving along an axis evolves all tokens that share
   that dimension — simultaneously, live.
   
   The matrix shows the composition: which dimensions
   contribute to which tokens, and how they combine.
============================================================ */

/* ── Design ──────────────────────────────────────────────── */
const F = {
  bg:      "#F4F1EC",
  paper:   "#FEFCF9",
  ink:     "#1E1B18",
  ink2:    "#504A44",
  ink3:    "#9A9188",
  ink4:    "#CFC8BF",
  rule:    "#E6E0D8",
  accent:  "#C85A1E",
};

/* ── N Dimensions ────────────────────────────────────────── */
// Each dimension has a name, steps, and what it controls.
// Value 0–1 is normalised position along the axis.

const DIMS = [
  {
    id: "color",
    label: "Color",
    icon: "◉",
    desc: "Hue, lightness, chroma of the brand palette",
    color: "#C85A1E",
    steps: [
      { label: "Slate",     hue: 215, chroma: 0.06, l50: "oklch(50% 0.06 215)", l60: "oklch(60% 0.06 215)", l30: "oklch(30% 0.06 215)" },
      { label: "Blue",      hue: 250, chroma: 0.16, l50: "oklch(50% 0.16 250)", l60: "oklch(60% 0.16 250)", l30: "oklch(30% 0.14 250)" },
      { label: "Teal",      hue: 185, chroma: 0.14, l50: "oklch(50% 0.14 185)", l60: "oklch(60% 0.14 185)", l30: "oklch(30% 0.12 185)" },
      { label: "Indigo",    hue: 280, chroma: 0.18, l50: "oklch(50% 0.18 280)", l60: "oklch(60% 0.18 280)", l30: "oklch(30% 0.16 280)" },
      { label: "Crimson",   hue: 20,  chroma: 0.20, l50: "oklch(50% 0.20 20)",  l60: "oklch(60% 0.20 20)",  l30: "oklch(30% 0.18 20)"  },
      { label: "Forest",    hue: 145, chroma: 0.15, l50: "oklch(50% 0.15 145)", l60: "oklch(60% 0.15 145)", l30: "oklch(30% 0.13 145)" },
    ],
  },
  {
    id: "radius",
    label: "Radius",
    icon: "⌒",
    desc: "Corner personality: clinical sharp → friendly rounded",
    color: "#276749",
    steps: [
      { label: "None",     interactive: 0,    container: 0,    overlay: 0,    pill: 2,    feel: "Clinical" },
      { label: "Minimal",  interactive: 2,    container: 4,    overlay: 6,    pill: 6,    feel: "Precise" },
      { label: "Subtle",   interactive: 4,    container: 6,    overlay: 8,    pill: 20,   feel: "Structured" },
      { label: "Default",  interactive: 8,    container: 12,   overlay: 16,   pill: 9999, feel: "Balanced" },
      { label: "Rounded",  interactive: 12,   container: 16,   overlay: 20,   pill: 9999, feel: "Friendly" },
      { label: "Pill",     interactive: 9999, container: 20,   overlay: 24,   pill: 9999, feel: "Playful" },
    ],
  },
  {
    id: "shadow",
    label: "Shadow",
    icon: "◫",
    desc: "Elevation depth: flat surface → floating modal",
    color: "#B45309",
    steps: [
      { label: "Flat",     card: "none",                                   dropdown: "0 1px 3px rgba(0,0,0,.08)",  modal: "0 2px 8px rgba(0,0,0,.10)",  feel: "Flat" },
      { label: "Soft",     card: "0 1px 2px rgba(0,0,0,.05)",             dropdown: "0 2px 6px rgba(0,0,0,.08)",  modal: "0 4px 16px rgba(0,0,0,.10)", feel: "Subtle" },
      { label: "Default",  card: "0 2px 6px rgba(0,0,0,.07)",             dropdown: "0 6px 16px rgba(0,0,0,.10)", modal: "0 12px 32px rgba(0,0,0,.12)", feel: "Grounded" },
      { label: "Medium",   card: "0 4px 10px rgba(0,0,0,.09)",            dropdown: "0 8px 24px rgba(0,0,0,.12)", modal: "0 20px 48px rgba(0,0,0,.14)", feel: "Layered" },
      { label: "Deep",     card: "0 8px 20px rgba(0,0,0,.12)",            dropdown: "0 16px 40px rgba(0,0,0,.16)",modal: "0 32px 64px rgba(0,0,0,.18)", feel: "Dramatic" },
      { label: "Floating", card: "0 16px 40px rgba(0,0,0,.16)",           dropdown: "0 24px 60px rgba(0,0,0,.20)",modal: "0 48px 96px rgba(0,0,0,.22)", feel: "Floating" },
    ],
  },
  {
    id: "typography",
    label: "Typography",
    icon: "T",
    desc: "Type scale density and weight expression",
    color: "#7B3FA0",
    steps: [
      { label: "Compact",   body: 13, sizeLabel: 11, heading: 16, weight: 400, tracking: 0,      feel: "Dense" },
      { label: "Tight",     body: 14, sizeLabel: 12, heading: 18, weight: 400, tracking: 0,      feel: "Compact" },
      { label: "Default",   body: 16, sizeLabel: 14, heading: 20, weight: 500, tracking: "0.01em", feel: "Readable" },
      { label: "Generous",  body: 17, sizeLabel: 14, heading: 22, weight: 500, tracking: "0.01em", feel: "Comfortable" },
      { label: "Open",      body: 18, sizeLabel: 15, heading: 24, weight: 600, tracking: "0.02em", feel: "Spacious" },
      { label: "Display",   body: 20, sizeLabel: 16, heading: 28, weight: 600, tracking: "0.03em", feel: "Editorial" },
    ],
  },
  {
    id: "spacing",
    label: "Spacing",
    icon: "↔",
    desc: "Layout density: compact data → generous breathing room",
    color: "#1A5FB4",
    steps: [
      { label: "Ultra-compact", base: 3,  inset: 6,  gap: 4,  section: 16, feel: "Data-dense" },
      { label: "Compact",       base: 4,  inset: 8,  gap: 6,  section: 20, feel: "Tight" },
      { label: "Default",       base: 4,  inset: 12, gap: 8,  section: 24, feel: "Balanced" },
      { label: "Comfortable",   base: 4,  inset: 16, gap: 12, section: 32, feel: "Comfortable" },
      { label: "Generous",      base: 4,  inset: 20, gap: 16, section: 40, feel: "Airy" },
      { label: "Spacious",      base: 4,  inset: 24, gap: 20, section: 56, feel: "Editorial" },
    ],
  },
  {
    id: "motion",
    label: "Motion",
    icon: "▷",
    desc: "Animation speed and character",
    color: "#B91C1C",
    steps: [
      { label: "None",      hover: 0,   interact: 0,   overlay: 0,   ease: "linear",              feel: "Static" },
      { label: "Instant",   hover: 60,  interact: 80,  overlay: 100, ease: "ease-out",            feel: "Snappy" },
      { label: "Fast",      hover: 100, interact: 150, overlay: 200, ease: "ease-out",            feel: "Responsive" },
      { label: "Default",   hover: 120, interact: 200, overlay: 280, ease: "cubic-bezier(0,0,.2,1)", feel: "Smooth" },
      { label: "Deliberate",hover: 180, interact: 280, overlay: 400, ease: "cubic-bezier(0,0,.2,1)", feel: "Considered" },
      { label: "Cinematic", hover: 300, interact: 400, overlay: 600, ease: "cubic-bezier(.16,1,.3,1)", feel: "Cinematic" },
    ],
  },
  {
    id: "state",
    label: "State",
    icon: "◈",
    desc: "Interaction state: default → hover → focus → active",
    color: "#0E7490",
    steps: [
      { label: "Default",  op: 1.0, scale: 1,    brightness: 1,    ring: false, ringColor: "transparent", feel: "Resting" },
      { label: "Hover",    op: 1.0, scale: 1,    brightness: 0.95, ring: false, ringColor: "transparent", feel: "Aware" },
      { label: "Focus",    op: 1.0, scale: 1,    brightness: 1,    ring: true,  ringColor: "currentColor", feel: "Focused" },
      { label: "Active",   op: 1.0, scale: 0.98, brightness: 0.90, ring: false, ringColor: "transparent", feel: "Pressed" },
      { label: "Loading",  op: 0.8, scale: 1,    brightness: 1,    ring: false, ringColor: "transparent", feel: "Pending" },
      { label: "Disabled", op: 0.4, scale: 1,    brightness: 1,    ring: false, ringColor: "transparent", feel: "Inactive" },
    ],
  },
];

/* ── Token definitions — which dims compose each token ─── */
const TOKENS = [
  // Each token: which dimensions contribute to it, and how
  {
    id: "btn-bg",         label: "--btn-bg",          group: "Button",
    dims: ["color","state"],
    derive: (d) => d.color.l50,
    desc: "Brand CTA background. Color × State = visual identity + interaction"
  },
  {
    id: "btn-radius",     label: "--btn-radius",      group: "Button",
    dims: ["radius"],
    derive: (d) => `${Math.min(d.radius.interactive, 999)}px`,
    desc: "Corner personality. Radius alone defines 'clinical vs friendly'"
  },
  {
    id: "btn-shadow",     label: "--btn-shadow",      group: "Button",
    dims: ["shadow","state"],
    derive: (d) => d.shadow.card,
    desc: "Micro-elevation. Shadow × State changes on interaction"
  },
  {
    id: "btn-font-size",  label: "--btn-font-size",   group: "Button",
    dims: ["typography"],
    derive: (d) => `${d.typography.sizeLabel}px`,
    desc: "Label size comes from the typography label role"
  },
  {
    id: "btn-px",         label: "--btn-px",          group: "Button",
    dims: ["spacing"],
    derive: (d) => `${d.spacing.inset}px`,
    desc: "Horizontal padding — spacing inset semantic"
  },
  {
    id: "btn-transition",  label: "--btn-transition",  group: "Button",
    dims: ["motion"],
    derive: (d) => d.motion.hover === 0 ? "none" : `all ${d.motion.hover}ms ${d.motion.ease}`,
    desc: "Hover animation = motion-hover semantic"
  },
  {
    id: "input-border",   label: "--input-border",    group: "Input",
    dims: ["color","state"],
    derive: (d) => d.state.label === "Focus" ? d.color.l50 : "#E2DDD6",
    desc: "Default border is neutral. Focus state injects brand color"
  },
  {
    id: "input-radius",   label: "--input-radius",    group: "Input",
    dims: ["radius"],
    derive: (d) => `${Math.min(d.radius.interactive, 16)}px`,
    desc: "Shares r-interactive with Button — same radius family"
  },
  {
    id: "input-height",   label: "--input-height",    group: "Input",
    dims: ["spacing","typography"],
    derive: (d) => `${d.spacing.inset * 2 + d.typography.body}px`,
    desc: "Height = vertical pad × 2 + font size. Both dims combine"
  },
  {
    id: "input-font",     label: "--input-font-size", group: "Input",
    dims: ["typography"],
    derive: (d) => `${d.typography.body}px`,
    desc: "Body text role — 16px WCAG recommended minimum"
  },
  {
    id: "card-shadow",    label: "--card-shadow",     group: "Card",
    dims: ["shadow"],
    derive: (d) => d.shadow.card,
    desc: "Card elevation lives at elev-2. Pure shadow dimension"
  },
  {
    id: "card-radius",    label: "--card-radius",     group: "Card",
    dims: ["radius"],
    derive: (d) => `${Math.min(d.radius.container, 32)}px`,
    desc: "Container radius — always larger than interactive"
  },
  {
    id: "card-padding",   label: "--card-padding",    group: "Card",
    dims: ["spacing"],
    derive: (d) => `${d.spacing.inset * 1.5}px`,
    desc: "inset-md semantic — same base as btn-px but 1.5×"
  },
  {
    id: "badge-radius",   label: "--badge-radius",    group: "Badge",
    dims: ["radius"],
    derive: (d) => `${d.radius.pill}px`,
    desc: "Always pill — but pill value itself is part of the radius dim"
  },
  {
    id: "badge-font",     label: "--badge-font-size", group: "Badge",
    dims: ["typography"],
    derive: (d) => `${Math.max(d.typography.sizeLabel - 2, 10)}px`,
    desc: "text-badge role = label-size minus 2. Inherits scale"
  },
  {
    id: "badge-bg",       label: "--badge-bg",        group: "Badge",
    dims: ["color"],
    derive: (d) => d.color.l60.replace("60%", "95%").replace("0.16","0.04").replace("0.14","0.03").replace("0.18","0.05").replace("0.20","0.05").replace("0.15","0.04").replace("0.06","0.02"),
    desc: "Success/status background = brand hue at 95% lightness, low chroma"
  },
  {
    id: "modal-shadow",   label: "--modal-shadow",    group: "Modal",
    dims: ["shadow"],
    derive: (d) => d.shadow.modal,
    desc: "Highest elevation. Modal shadow is always 2–3 levels above card"
  },
  {
    id: "modal-radius",   label: "--modal-radius",    group: "Modal",
    dims: ["radius"],
    derive: (d) => `${Math.min(d.radius.overlay, 32)}px`,
    desc: "Overlay radius — always larger than container"
  },
  {
    id: "modal-transition",label: "--modal-transition",group: "Modal",
    dims: ["motion"],
    derive: (d) => d.motion.overlay === 0 ? "none" : `transform ${d.motion.overlay}ms ${d.motion.ease}, opacity ${d.motion.overlay}ms ${d.motion.ease}`,
    desc: "Context shift needs slowest motion — motion-overlay semantic"
  },
  {
    id: "dropdown-shadow",label: "--dropdown-shadow", group: "Overlay",
    dims: ["shadow"],
    derive: (d) => d.shadow.dropdown,
    desc: "Sits between card and modal elevation"
  },
  {
    id: "focus-ring",     label: "--focus-ring",      group: "System",
    dims: ["color","state"],
    derive: (d) => `0 0 0 2px white, 0 0 0 4px ${d.color.l50}`,
    desc: "Universal focus ring = brand color. Both Color and State dims"
  },
  {
    id: "text-label",     label: "--text-label",      group: "System",
    dims: ["typography"],
    derive: (d) => `${d.typography.sizeLabel}px / ${d.typography.weight} / tracking ${d.typography.tracking || "0"}`,
    desc: "Label role bundles size + weight + tracking from typography dim"
  },
  {
    id: "text-body",      label: "--text-body",       group: "System",
    dims: ["typography"],
    derive: (d) => `${d.typography.body}px / 400 / normal`,
    desc: "Body role is always weight 400 — size shifts with the dim"
  },
  {
    id: "space-inset",    label: "--inset-md",        group: "System",
    dims: ["spacing"],
    derive: (d) => `${d.spacing.inset}px`,
    desc: "Default inset semantic. Used by button, input, card padding"
  },
  {
    id: "space-gap",      label: "--gap-sm",          group: "System",
    dims: ["spacing"],
    derive: (d) => `${d.spacing.gap}px`,
    desc: "Small gap between elements — icon↔label, list items"
  },
];

/* ── Derive all token values from current dim positions ── */
function resolveTokens(positions: Record<string, number>) {
  const d: Record<string, any> = {};
  DIMS.forEach(dim => {
    const idx = Math.round(positions[dim.id] * (dim.steps.length - 1));
    d[dim.id] = dim.steps[Math.max(0, Math.min(idx, dim.steps.length - 1))];
  });
  return TOKENS.map(t => ({
    ...t,
    value: t.derive(d),
    dimValues: t.dims.map(dimId => ({
      dimId,
      stepLabel: d[dimId].label,
      stepFeel: d[dimId].feel,
    })),
  }));
}

/* ── Character tags derived from dim combination ──────── */
function deriveCharacter(positions: Record<string, number>) {
  const d: Record<string, any> = {};
  DIMS.forEach(dim => {
    const idx = Math.round(positions[dim.id] * (dim.steps.length - 1));
    d[dim.id] = dim.steps[Math.max(0, Math.min(idx, dim.steps.length - 1))];
  });
  return [
    d.radius.feel,
    d.color.label,
    d.shadow.feel,
    d.typography.feel,
    d.spacing.feel,
    d.motion.feel,
    d.state.feel,
  ];
}

/* ── Groups ───────────────────────────────────────────── */
const GROUPS = ["Button","Input","Card","Badge","Modal","Overlay","System"];
const GROUP_COLOR = {
  Button:"#1A5FB4", Input:"#176E3C", Card:"#C0531F",
  Badge:"#7B3FA0",  Modal:"#553C9A", Overlay:"#B45309", System:"#374151",
};

/* ── Live Component Preview ───────────────────────────── */
function LivePreview({ positions }: { positions: Record<string, number> }) {
  const d: Record<string, any> = {};
  DIMS.forEach(dim => {
    const idx = Math.round(positions[dim.id] * (dim.steps.length - 1));
    d[dim.id] = dim.steps[Math.max(0, Math.min(idx, dim.steps.length - 1))];
  });

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  // Derive live CSS values
  const brandColor  = hovered ? d.color.l30 : d.state.label === "Hover" ? d.color.l30 : d.color.l50;
  const btnRadius   = Math.min(d.radius.interactive, 999);
  const btnShadow   = d.shadow.card;
  const btnPx       = d.spacing.inset;
  const btnPy       = Math.round(d.spacing.inset * 0.55);
  const btnFont     = d.typography.sizeLabel;
  const btnWeight   = d.typography.weight;
  const btnLetter   = d.typography.tracking || 0;
  const btnTrans    = d.motion.hover === 0 ? "none" : `all ${d.motion.hover}ms ${d.motion.ease}`;
  const btnOpacity  = d.state.label === "Disabled" ? 0.4 : 1;
  const btnScale    = d.state.label === "Active" ? 0.98 : 1;
  const focusRing   = focused || d.state.label === "Focus"
    ? `0 0 0 2px white, 0 0 0 4px ${d.color.l50}` : "none";

  const cardRadius  = Math.min(d.radius.container, 32);
  const cardShadow  = d.shadow.card;
  const cardPad     = Math.round(d.spacing.inset * 1.5);
  const cardGap     = d.spacing.gap;
  const bodyFont    = d.typography.body;

  const inputRadius = Math.min(d.radius.interactive, 16);
  const inputHeight = d.spacing.inset * 2 + d.typography.body;
  const inputBorder = d.state.label === "Focus" || focused ? d.color.l50 : "#D4CEC8";

  const badgeRadius = Math.min(d.radius.pill, 999);
  const badgeFont   = Math.max(d.typography.sizeLabel - 2, 10);

  const gapStyle    = { gap: cardGap };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

      {/* CARD wrapping everything */}
      <div style={{
        background: "#fff",
        borderRadius: cardRadius,
        boxShadow: cardShadow,
        padding: cardPad,
        display: "flex",
        flexDirection: "column",
        gap: cardGap,
        transition: `box-shadow ${d.motion.hover}ms ${d.motion.ease}, border-radius ${d.motion.hover}ms ${d.motion.ease}`,
      }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize: d.typography.heading, fontWeight: d.typography.weight, color: F.ink, lineHeight:1.2 }}>
              Patient Summary
            </div>
            <div style={{ fontSize: d.typography.sizeLabel, color: F.ink3, marginTop: 4, letterSpacing: d.typography.tracking }}>
              Last updated 2m ago
            </div>
          </div>
          {/* Badge */}
          <span style={{
            background: d.color.l60.replace("60%","94%").replace(/0\.\d+\s/,v => `${parseFloat(v)*0.18} `),
            color: d.color.l30,
            borderRadius: badgeRadius,
            padding: `3px ${Math.round(btnPx * 0.7)}px`,
            fontSize: badgeFont,
            fontWeight: 500,
            letterSpacing: "0.06em",
            transition: btnTrans,
          }}>Stable</span>
        </div>

        {/* Input */}
        <div>
          <div style={{ fontSize: d.typography.sizeLabel, fontWeight: 500, color: F.ink2, marginBottom: 5, letterSpacing: d.typography.tracking }}>
            Patient ID
          </div>
          <input
            readOnly
            defaultValue="PT-2024-0847"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              height: inputHeight,
              padding: `0 ${btnPx}px`,
              border: `1.5px solid ${inputBorder}`,
              borderRadius: inputRadius,
              fontSize: bodyFont,
              color: F.ink,
              background: "#FEFCF9",
              outline: "none",
              boxShadow: focusRing,
              transition: btnTrans,
              boxSizing: "border-box",
              fontFamily: "system-ui",
            }}
          />
        </div>

        {/* Vitals row */}
        <div style={{ display:"flex", gap: cardGap }}>
          {[["74 bpm","Heart Rate"],["120/80","Blood Pressure"],["98%","SpO₂"]].map(([v, l]) => (
            <div key={l} style={{
              flex:1,
              background: F.bg,
              borderRadius: Math.min(cardRadius * 0.7, 16),
              padding: `${Math.round(btnPy * 1.4)}px ${Math.round(btnPx * 0.8)}px`,
            }}>
              <div style={{ fontSize: d.typography.heading - 2, fontWeight: d.typography.weight, color: d.color.l30 }}>{v}</div>
              <div style={{ fontSize: d.typography.sizeLabel - 1, color: F.ink3, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", gap: cardGap, marginTop: 4 }}>
          {/* Primary */}
          <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              flex: 1,
              height: d.spacing.inset * 2 + d.typography.sizeLabel,
              background: hovered ? d.color.l30 : d.color.l50,
              color: "#fff",
              border: "none",
              borderRadius: btnRadius,
              fontSize: btnFont,
              fontWeight: btnWeight,
              letterSpacing: btnLetter,
              cursor: "pointer",
              boxShadow: btnShadow,
              opacity: btnOpacity,
              transform: `scale(${btnScale})`,
              transition: btnTrans,
              outline: "none",
              fontFamily: "system-ui",
            }}
          >
            Save Record
          </button>
          {/* Secondary */}
          <button style={{
            flex: 1,
            height: d.spacing.inset * 2 + d.typography.sizeLabel,
            background: "transparent",
            color: d.color.l50,
            border: `1.5px solid ${d.color.l50}`,
            borderRadius: btnRadius,
            fontSize: btnFont,
            fontWeight: btnWeight,
            cursor: "pointer",
            opacity: btnOpacity,
            transition: btnTrans,
            outline: "none",
            fontFamily: "system-ui",
          }}>
            Cancel
          </button>
        </div>
      </div>

      {/* Character tags */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {deriveCharacter(positions).map((tag, i) => (
          <span key={i} style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 4,
            background: F.rule,
            color: F.ink2,
            letterSpacing: "0.05em",
            fontFamily: "system-ui",
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Dimension Slider ─────────────────────────────────── */
function DimSlider({ dim, value, onChange, isActive, onActivate }: { dim: any, value: number, onChange: (val: number) => void, isActive: boolean, onActivate: () => void }) {
  const idx = Math.round(value * (dim.steps.length - 1));
  const step = dim.steps[idx];

  return (
    <div
      onClick={onActivate}
      style={{
        background: isActive ? "#fff" : F.paper,
        border: `1.5px solid ${isActive ? dim.color : F.rule}`,
        borderRadius: 10,
        padding: "10px 14px",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxShadow: isActive ? `0 0 0 3px ${dim.color}22` : "none",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:12, color: isActive ? dim.color : F.ink3 }}>{dim.icon}</span>
          <span style={{ fontSize:11, fontWeight:700, color: isActive ? dim.color : F.ink2, letterSpacing:"0.04em", textTransform:"uppercase" }}>{dim.label}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{
            fontSize:10, fontWeight:600,
            padding: "2px 8px",
            borderRadius: 4,
            background: isActive ? dim.color : F.rule,
            color: isActive ? "#fff" : F.ink2,
            fontFamily: "monospace",
          }}>{step.label}</span>
          {step.feel && (
            <span style={{ fontSize:9, color: F.ink3, fontStyle:"italic" }}>{step.feel}</span>
          )}
        </div>
      </div>

      {/* Track */}
      <div style={{ position:"relative", height:6, background: F.rule, borderRadius:3 }}
           onClick={e => e.stopPropagation()}>
        <div style={{
          position:"absolute", left:0, top:0,
          height:"100%",
          width:`${value * 100}%`,
          background: dim.color,
          borderRadius:3,
          transition:"width 0.1s",
        }}/>
        <input
          type="range" min={0} max={1} step={0.001}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            position:"absolute", inset:0,
            width:"100%", height:"100%",
            opacity:0, cursor:"ew-resize", margin:0, padding:0,
          }}
        />
        {/* Step markers */}
        {dim.steps.map((_, i) => (
          <div key={i} style={{
            position:"absolute",
            left:`${(i / (dim.steps.length - 1)) * 100}%`,
            top:"50%",
            transform:"translate(-50%,-50%)",
            width: i === idx ? 10 : 6,
            height: i === idx ? 10 : 6,
            borderRadius:"50%",
            background: i <= idx ? dim.color : F.ink4,
            border: i === idx ? `2px solid white` : "none",
            pointerEvents:"none",
            transition:"all 0.15s",
          }}/>
        ))}
      </div>

      {/* Step labels */}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        {dim.steps.map((s, i) => (
          <span key={i} style={{
            fontSize:8,
            color: i === idx ? dim.color : F.ink4,
            fontWeight: i === idx ? 700 : 400,
            fontFamily:"system-ui",
            transition:"color 0.15s",
          }}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Token Matrix Cell ────────────────────────────────── */
function MatrixCell({ token, positions, activeDim }: { token: any, positions: Record<string, number>, activeDim: string | null }) {
  const d: Record<string, any> = {};
  DIMS.forEach(dim => {
    const idx = Math.round(positions[dim.id] * (dim.steps.length - 1));
    d[dim.id] = dim.steps[Math.max(0, Math.min(idx, dim.steps.length - 1))];
  });

  const value = token.derive(d);
  const gc = GROUP_COLOR[token.group] || "#374151";
  const touchesDim = activeDim && token.dims.includes(activeDim);

  return (
    <div style={{
      background: touchesDim ? gc + "10" : "#fff",
      border: `1px solid ${touchesDim ? gc : F.rule}`,
      borderRadius: 7,
      padding: "8px 10px",
      transition: "border-color 0.15s, background 0.15s",
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <code style={{ fontSize:8.5, fontFamily:"monospace", color: touchesDim ? gc : F.ink3, fontWeight: touchesDim ? 700 : 400 }}>
          {token.label}
        </code>
        <div style={{ display:"flex", gap:3 }}>
          {token.dims.map(dimId => {
            const dim = DIMS.find(d => d.id === dimId);
            return (
              <span key={dimId} title={dim.label} style={{
                fontSize:8, width:14, height:14, borderRadius:3,
                background: activeDim === dimId ? dim.color : dim.color + "30",
                color: activeDim === dimId ? "#fff" : dim.color,
                display:"inline-flex", alignItems:"center", justifyContent:"center",
                fontWeight:700, transition:"background 0.15s",
              }}>
                {dim.icon}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ fontSize:9.5, fontFamily:"monospace", color: F.ink2, wordBreak:"break-all", lineHeight:1.4 }}>
        {value.length > 44 ? value.slice(0, 41) + "…" : value}
      </div>
      <div style={{ fontSize:8, color: F.ink3, marginTop:4, lineHeight:1.4 }}>
        {token.desc}
      </div>
    </div>
  );
}

/* ── N-Dimensional Composition View ─────────────────── */
// Shows each dim as a column, each token as a row.
// Cell fills when that dim contributes to that token.
function CompositionMatrix({ positions, activeDim, onDimClick }: { positions: Record<string, number>, activeDim: string | null, onDimClick: (id: string) => void }) {
  const resolved = resolveTokens(positions);

  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ borderCollapse:"separate", borderSpacing:"3px", minWidth:600 }}>
        <thead>
          <tr>
            <th style={{ fontSize:8, color:F.ink3, textAlign:"left", padding:"0 6px 6px 0", fontWeight:400, width:100 }}>TOKEN</th>
            {DIMS.map(dim => (
              <th key={dim.id}
                onClick={() => onDimClick(dim.id)}
                style={{
                  fontSize:8, fontWeight:700, color: activeDim===dim.id ? dim.color : F.ink3,
                  padding:"0 0 6px", textAlign:"center", cursor:"pointer",
                  letterSpacing:"0.06em", width:52,
                  transition:"color 0.15s",
                }}>
                <div>{dim.icon}</div>
                <div style={{fontSize:7}}>{dim.label.slice(0,4).toUpperCase()}</div>
              </th>
            ))}
            <th style={{ fontSize:8, color:F.ink3, padding:"0 0 6px 8px", fontWeight:400, minWidth:90 }}>VALUE NOW</th>
          </tr>
        </thead>
        <tbody>
          {resolved.map(token => (
            <tr key={token.id}>
              <td style={{ fontSize:8.5, fontFamily:"monospace", color:F.ink2, padding:"1px 6px 1px 0", whiteSpace:"nowrap" }}>
                <span style={{ color: GROUP_COLOR[token.group], fontSize:7, fontWeight:700, marginRight:4 }}>{token.group.slice(0,3).toUpperCase()}</span>
                {token.label.replace("--","")}
              </td>
              {DIMS.map(dim => {
                const active = token.dims.includes(dim.id);
                const isHighlit = activeDim === dim.id && active;
                return (
                  <td key={dim.id} style={{ padding:"1px 0", textAlign:"center" }}>
                    <div style={{
                      width:40, height:22, borderRadius:4, margin:"0 auto",
                      background: isHighlit ? dim.color : active ? dim.color+"30" : F.rule,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"background 0.15s",
                    }}>
                      {active && (
                        <span style={{ fontSize:9, color: isHighlit?"#fff" : dim.color }}>●</span>
                      )}
                    </div>
                  </td>
                );
              })}
              <td style={{ padding:"1px 0 1px 8px", fontSize:8.5, fontFamily:"monospace", color:F.ink2, maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {token.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main App ─────────────────────────────────────────── */
export default function App() {
  const [positions, setPositions] = useState(() => {
    const p = {};
    DIMS.forEach(d => { p[d.id] = 0.5; });
    return p;
  });
  const [activeDim, setActiveDim] = useState("color");
  const [tab, setTab] = useState("sliders"); // sliders | matrix | composition

  const setDimPos = useCallback((dimId, val) => {
    setPositions(p => ({ ...p, [dimId]: val }));
    setActiveDim(dimId);
  }, []);

  const resolved = resolveTokens(positions);
  const groups = GROUPS.filter(g => resolved.some(t => t.group === g));

  // How many tokens each dim contributes to
  const dimContributions = {};
  DIMS.forEach(dim => {
    dimContributions[dim.id] = TOKENS.filter(t => t.dims.includes(dim.id)).length;
  });

  const character = deriveCharacter(positions);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:F.bg, fontFamily:"system-ui,sans-serif", overflow:"hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:${F.ink4};border-radius:2px}
        input[type=range]{-webkit-appearance:none;appearance:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:0;height:0}
      `}</style>

      {/* HEADER */}
      <div style={{ background:F.paper, borderBottom:`1px solid ${F.rule}`, padding:"0 20px", height:52, display:"flex", alignItems:"center", gap:0, flexShrink:0 }}>
        <div style={{ paddingRight:20, borderRight:`1px solid ${F.rule}` }}>
          <div style={{ fontSize:14, fontWeight:700, color:F.ink, fontFamily:"Georgia,serif", letterSpacing:"-0.02em" }}>N-Dimensional Token Matrix</div>
          <div style={{ fontSize:9, color:F.ink3, letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {DIMS.length} dimensions · {TOKENS.length} tokens · every axis is live
          </div>
        </div>

        {/* character strip */}
        <div style={{ display:"flex", gap:6, paddingLeft:20, flex:1 }}>
          {character.map((tag, i) => (
            <span key={i} style={{
              fontSize:9.5, fontWeight:600,
              padding:"3px 8px", borderRadius:4,
              background: F.rule, color:F.ink2,
              letterSpacing:"0.04em",
            }}>{tag}</span>
          ))}
        </div>

        {/* tab switcher */}
        <div style={{ display:"flex", gap:3, background:F.bg, borderRadius:8, padding:3 }}>
          {[["sliders","Sliders"],["matrix","Token Grid"],["composition","Composition"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding:"5px 12px", borderRadius:6, border:"none", cursor:"pointer", fontSize:11,
                background: tab===id ? F.paper : "transparent",
                color: tab===id ? F.ink : F.ink3,
                fontWeight: tab===id ? 600 : 400,
                boxShadow: tab===id ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                transition:"all 0.15s",
              }}>{label}</button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* LEFT: dimension sliders — always visible */}
        <div style={{ width:290, borderRight:`1px solid ${F.rule}`, overflowY:"auto", padding:12, background:F.paper, display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
          <div style={{ fontSize:9, fontWeight:700, color:F.ink3, letterSpacing:"0.1em", textTransform:"uppercase", padding:"4px 0" }}>
            N Dimensions
          </div>
          {DIMS.map(dim => (
            <DimSlider
              key={dim.id}
              dim={dim}
              value={positions[dim.id]}
              onChange={val => setDimPos(dim.id, val)}
              isActive={activeDim === dim.id}
              onActivate={() => setActiveDim(dim.id)}
            />
          ))}

          {/* Dimension contribution summary */}
          <div style={{ marginTop:8, padding:"10px 12px", background:F.bg, borderRadius:8, border:`1px solid ${F.rule}` }}>
            <div style={{ fontSize:9, fontWeight:700, color:F.ink3, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Tokens per dimension</div>
            {DIMS.map(dim => (
              <div key={dim.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <span style={{ fontSize:10, width:60, color: activeDim===dim.id ? dim.color : F.ink2, fontWeight: activeDim===dim.id ? 700:400 }}>{dim.label}</span>
                <div style={{ flex:1, height:6, background:F.rule, borderRadius:3 }}>
                  <div style={{ height:"100%", width:`${(dimContributions[dim.id]/TOKENS.length)*100}%`, background: dim.color, borderRadius:3, opacity: activeDim===dim.id?1:0.5 }}/>
                </div>
                <span style={{ fontSize:9, fontFamily:"monospace", color:F.ink3, width:16, textAlign:"right" }}>{dimContributions[dim.id]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: content area */}
        <div style={{ flex:1, overflow:"hidden", display:"flex" }}>

          {tab === "sliders" && (
            <>
              {/* Token grid */}
              <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:16 }}>
                {groups.map(group => (
                  <div key={group}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background: GROUP_COLOR[group] }}/>
                      <span style={{ fontSize:10, fontWeight:700, color: GROUP_COLOR[group], letterSpacing:"0.08em", textTransform:"uppercase" }}>{group}</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {resolved.filter(t => t.group===group).map(token => (
                        <MatrixCell key={token.id} token={token} positions={positions} activeDim={activeDim}/>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live preview */}
              <div style={{ width:300, borderLeft:`1px solid ${F.rule}`, overflowY:"auto", padding:16, background:F.paper, flexShrink:0 }}>
                <div style={{ fontSize:9, fontWeight:700, color:F.ink3, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Live Component</div>
                <LivePreview positions={positions}/>
              </div>
            </>
          )}

          {tab === "matrix" && (
            <div style={{ flex:1, overflowY:"auto", padding:20 }}>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:F.ink, marginBottom:4 }}>Token Grid</div>
                <div style={{ fontSize:11, color:F.ink3, lineHeight:1.6 }}>
                  Every token as a card. The colored dimension tags show which axes compose each token.
                  Active dimension (<strong>{DIMS.find(d=>d.id===activeDim)?.label}</strong>) highlights affected tokens.
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:8 }}>
                {resolved.map(token => (
                  <MatrixCell key={token.id} token={token} positions={positions} activeDim={activeDim}/>
                ))}
              </div>
            </div>
          )}

          {tab === "composition" && (
            <div style={{ flex:1, overflowY:"auto", padding:20 }}>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:700, color:F.ink, marginBottom:4 }}>Composition Matrix</div>
                <div style={{ fontSize:11, color:F.ink3, lineHeight:1.6 }}>
                  Rows = tokens. Columns = dimensions. A filled cell means that dimension contributes to that token.
                  Click a column header to activate it. The N-dimensional nature of tokens becomes visible here —
                  some tokens sit at the intersection of 3+ dimensions simultaneously.
                </div>
              </div>

              {/* N-dim explanation */}
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                {DIMS.map(dim => {
                  const affected = TOKENS.filter(t => t.dims.includes(dim.id));
                  return (
                    <div key={dim.id}
                      onClick={() => setActiveDim(dim.id)}
                      style={{
                        padding:"6px 12px", borderRadius:8, cursor:"pointer",
                        background: activeDim===dim.id ? dim.color+"18" : F.paper,
                        border:`1.5px solid ${activeDim===dim.id ? dim.color : F.rule}`,
                        transition:"all 0.15s",
                      }}>
                      <div style={{ fontSize:10, fontWeight:700, color: activeDim===dim.id ? dim.color : F.ink2 }}>
                        {dim.icon} {dim.label}
                      </div>
                      <div style={{ fontSize:8.5, color:F.ink3 }}>
                        affects {affected.length} tokens
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background:F.paper, borderRadius:10, border:`1px solid ${F.rule}`, padding:16 }}>
                <CompositionMatrix positions={positions} activeDim={activeDim} onDimClick={setActiveDim}/>
              </div>

              {/* Insight: multi-dim tokens */}
              <div style={{ marginTop:16, background:F.paper, borderRadius:10, border:`1px solid ${F.rule}`, padding:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:F.ink3, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>
                  Multi-dimensional tokens — highest complexity
                </div>
                {TOKENS.filter(t => t.dims.length >= 2).sort((a,b) => b.dims.length - a.dims.length).map(token => (
                  <div key={token.id} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8, paddingBottom:8, borderBottom:`1px solid ${F.rule}` }}>
                    <div style={{ flex:1 }}>
                      <code style={{ fontSize:9.5, fontFamily:"monospace", color:F.ink2 }}>{token.label}</code>
                      <div style={{ fontSize:8.5, color:F.ink3, marginTop:2 }}>{token.desc}</div>
                    </div>
                    <div style={{ display:"flex", gap:3 }}>
                      {token.dims.map(dimId => {
                        const dim = DIMS.find(d => d.id === dimId);
                        return (
                          <span key={dimId} style={{
                            fontSize:9, padding:"2px 6px", borderRadius:4,
                            background: dim.color + "20", color:dim.color,
                            fontWeight:600,
                          }}>{dim.icon} {dim.label}</span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
