"use client"

import { useState, useRef, useEffect, useCallback } from "react";

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IBM+Plex+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap";

const S = {
    ink: "#0A0A0A",
    inkMid: "#1C1C1C",
    inkLight: "#2E2E2E",
    grey1: "#888888",
    grey2: "#BBBBBB",
    grey3: "#DEDEDE",
    paper: "#F9F8F6",
    paperDeep: "#F0EEE9",
    white: "#FFFFFF",
};

const globalStyles = `
  @import url('${FONTS_URL}');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${S.paper}; color: ${S.ink}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${S.paper}; }
  ::-webkit-scrollbar-thumb { background: ${S.grey2}; border-radius: 2px; }
  input[type=range] { -webkit-appearance: none; appearance: none; height: 2px; background: ${S.grey2}; border-radius: 1px; outline: none; cursor: pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${S.ink}; cursor: pointer; }
  input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: ${S.ink}; cursor: pointer; border: none; }
  select { font-family: 'DM Sans', sans-serif; font-size: 13px; background: transparent; border: 1px solid ${S.grey3}; padding: 6px 10px; border-radius: 4px; cursor: pointer; color: ${S.ink}; outline: none; }
  select:focus { border-color: ${S.ink}; }
  .lab-btn { font-family: 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; background: ${S.ink}; color: ${S.white}; border: none; padding: 8px 18px; cursor: pointer; border-radius: 2px; transition: opacity 0.15s; }
  .lab-btn:hover { opacity: 0.8; }
  .lab-btn.ghost { background: transparent; color: ${S.ink}; border: 1px solid ${S.grey3}; }
  .lab-btn.ghost:hover { border-color: ${S.ink}; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.4s ease forwards; }
`;

const chapters = [
    { id: "intro", num: "00", title: "What is typography" },
    { id: "anatomy", num: "01", title: "Anatomy of type" },
    { id: "classification", num: "02", title: "Classification" },
    { id: "history", num: "03", title: "History" },
    { id: "mechanics", num: "04", title: "Mechanics" },
    { id: "hierarchy", num: "05", title: "Hierarchy & scale" },
    { id: "screenprint", num: "06", title: "Screen vs print" },
    { id: "pairing", num: "07", title: "Pairing" },
    { id: "variable", num: "08", title: "Variable fonts" },
    { id: "typesetting", num: "09", title: "Type in use" },
    { id: "emotion", num: "10", title: "Emotion" },
    { id: "specimens", num: "11", title: "Specimens" },
    { id: "foundries", num: "12", title: "Foundries" },
    { id: "web", num: "13", title: "Web & UI" },
    { id: "glossary", num: "14", title: "Glossary" },
];

function Nav({ active, onNav }) {
    return (
        <nav style={{
            position: "sticky", top: 0, zIndex: 100, background: S.ink,
            borderBottom: `1px solid ${S.inkLight}`, overflowX: "auto",
        }}>
            <div style={{ display: "flex", alignItems: "center", padding: "0 24px", minWidth: "max-content" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: S.grey2, marginRight: 32, letterSpacing: "0.04em", padding: "14px 0", whiteSpace: "nowrap" }}>
                    TYPE
                </span>
                {chapters.map(c => (
                    <button key={c.id} onClick={() => onNav(c.id)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "14px 14px", fontSize: 11, letterSpacing: "0.06em",
                        color: active === c.id ? S.white : S.grey1,
                        borderBottom: active === c.id ? `2px solid ${S.white}` : "2px solid transparent",
                        transition: "color 0.15s, border-color 0.15s", whiteSpace: "nowrap",
                        fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase",
                    }}>
                        <span style={{ color: active === c.id ? S.grey2 : S.grey1, fontSize: 10, marginRight: 5 }}>{c.num}</span>
                        {c.title}
                    </button>
                ))}
            </div>
        </nav>
    );
}

function Rule({ color = S.grey3 }) {
    return <div style={{ height: 1, background: color, margin: "0" }} />;
}

function ChapterLabel({ num, title, dark = false }) {
    const c = dark ? S.grey1 : S.grey1;
    const tc = dark ? S.white : S.ink;
    return (
        <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", color: c, textTransform: "uppercase", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
                Chapter {num}
            </div>
            <Rule color={dark ? S.inkLight : S.grey3} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, color: tc, lineHeight: 1.05, marginTop: 20, letterSpacing: "-0.02em" }}>
                {title}
            </h2>
        </div>
    );
}

function Prose({ children, dark = false, wide = false }) {
    return (
        <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.75,
            color: dark ? S.grey2 : S.grey1, maxWidth: wide ? "100%" : 680,
            marginBottom: 20,
        }}>{children}</p>
    );
}

function LabCard({ title, dark = false, children, style = {} }) {
    return (
        <div style={{
            background: dark ? S.inkMid : S.paperDeep,
            border: `1px solid ${dark ? S.inkLight : S.grey3}`,
            borderRadius: 8, padding: 28, marginTop: 32,
            ...style
        }}>
            {title && <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: dark ? S.grey1 : S.grey1, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>{title}</div>}
            {children}
        </div>
    );
}

function SliderRow({ label, value, min, max, step = 1, onChange, display = null, dark = false }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: dark ? S.grey2 : S.grey1, width: 100, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</span>
            <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ flex: 1, height: 2 }} />
            <span style={{ fontSize: 12, color: dark ? S.white : S.ink, width: 60, textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{display || value}</span>
        </div>
    );
}

// ─── CHAPTER 00: INTRO ───────────────────────────────────────────────────────
function ChapterIntro() {
    const [showAfter, setShowAfter] = useState(false);
    const before = { fontFamily: "serif", fontSize: 15, lineHeight: 1.3, letterSpacing: "-0.03em", color: "#999", wordSpacing: "-2px" };
    const after = { fontFamily: "'Libre Baskerville', serif", fontSize: 17, lineHeight: 1.75, letterSpacing: "0.01em", color: S.ink, wordSpacing: "0.02em" };
    return (
        <section id="intro" style={{ background: S.paper, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="00" title="What is typography" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
                    <div>
                        <Prose>Typography is the art and technique of arranging type to make written language legible, readable, and visually appealing. The word comes from the Greek <em>typos</em> ("form") and <em>graphein</em> ("to write").</Prose>
                        <Prose>It encompasses every decision about how text looks and behaves: selecting a typeface, choosing sizes, adjusting spacing, setting alignment, and organizing content into visual hierarchy.</Prose>
                        <Prose>Over 90% of online information is text — which makes typographic choices the single largest factor shaping how people experience nearly any designed surface.</Prose>

                        <div style={{ marginTop: 32, padding: "24px 0", borderTop: `1px solid ${S.grey3}`, borderBottom: `1px solid ${S.grey3}` }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>The three terms</div>
                            {[
                                { term: "Typography", def: "The practice of arranging type — spacing, scale, hierarchy, layout." },
                                { term: "Typeface", def: "The overall design system — Garamond, Helvetica, Futura. The composition." },
                                { term: "Font", def: "A specific file: Garamond Bold Italic. The recording of that composition." },
                            ].map(({ term, def }) => (
                                <div key={term} style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: S.ink, minWidth: 110 }}>{term}</span>
                                    <span style={{ fontSize: 14, color: S.grey1, lineHeight: 1.6 }}>{def}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 28, fontSize: 13, color: S.grey1, lineHeight: 1.6 }}>
                            <strong style={{ color: S.ink, fontWeight: 500 }}>What typographers do: </strong>
                            select typefaces appropriate to tone, build visual hierarchy, set kerning and leading for readability, advise brands on typographic consistency across media.
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
                            Readability lab — toggle bad vs good setting
                        </div>
                        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                            <button className="lab-btn ghost" onClick={() => setShowAfter(false)} style={{ borderColor: !showAfter ? S.ink : S.grey3, color: !showAfter ? S.ink : S.grey1 }}>Poor setting</button>
                            <button className="lab-btn" onClick={() => setShowAfter(true)} style={{ background: showAfter ? S.ink : S.grey3, color: showAfter ? S.white : S.grey1 }}>Good setting</button>
                        </div>
                        <div style={{ ...(showAfter ? after : before), background: showAfter ? S.white : "#F5F5F5", border: `1px solid ${showAfter ? S.grey3 : "#DDD"}`, borderRadius: 6, padding: 24, transition: "all 0.35s ease" }}>
                            <p style={{ marginBottom: 14, ...(showAfter ? after : before) }}>
                                Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.
                            </p>
                            <p style={{ ...(showAfter ? after : before) }}>
                                Before digital typesetting, typography was a specialized occupation. Digitization opened up typography to new generations of visual designers. Today anyone with a computer and desktop publishing software can use typographic skills.
                            </p>
                        </div>
                        <div style={{ marginTop: 12, fontSize: 12, color: S.grey1, fontFamily: "'IBM Plex Mono', monospace" }}>
                            {showAfter
                                ? "✓ Libre Baskerville 17px · line-height 1.75 · tracking +0.01em"
                                : "✗ default serif 15px · line-height 1.3 · tracking −0.03em"}
                        </div>

                        <div style={{ marginTop: 32, background: S.ink, color: S.white, padding: 28, borderRadius: 6 }}>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, lineHeight: 1, marginBottom: 12, letterSpacing: "-0.02em" }}>
                                Aa
                            </div>
                            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: S.grey2, marginBottom: 8 }}>Playfair Display · Display</div>
                            <Rule color={S.inkLight} />
                            <div style={{ marginTop: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: S.grey2, lineHeight: 1.6 }}>
                                Typography shapes every piece of information you encounter daily. It operates below conscious awareness — before words are cognitively processed, type is already communicating emotion and trust.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 01: ANATOMY ─────────────────────────────────────────────────────
const ANATOMY_PARTS = [
    { id: "baseline", label: "Baseline", color: "#E53E3E", desc: "The invisible line on which most letters sit. Curved letters like 'o' dip fractionally below — called overshoot — for optical compensation." },
    { id: "xheight", label: "X-height", color: "#3182CE", desc: "The height from baseline to the top of lowercase letters like 'x'. A large x-height (Verdana) aids legibility; a small one (Garamond) adds elegance at display sizes." },
    { id: "capheight", label: "Cap height", color: "#38A169", desc: "The height from baseline to the top of flat capital letters like 'H'. Always slightly shorter than ascenders for optical balance." },
    { id: "ascender", label: "Ascender", color: "#805AD5", desc: "The part of lowercase letters (b, d, h, k, l) that extends above the x-height. Long ascenders add elegance; short ones allow tighter line-spacing." },
    { id: "descender", label: "Descender", color: "#D69E2E", desc: "The portion of letters (g, j, p, q, y) dropping below the baseline. Deep descenders demand generous leading." },
    { id: "bowl", label: "Bowl", color: "#E53E3E", desc: "The curved, closed part of letters like b, d, o, p. Geometric typefaces use near-perfect circles; humanist ones have organic ovals." },
    { id: "counter", label: "Counter", color: "#3182CE", desc: "The white space enclosed within or partially enclosed by a letterform. Larger counters improve legibility at small sizes." },
    { id: "stem", label: "Stem", color: "#38A169", desc: "The primary vertical stroke giving a letter its backbone. Contrast between thick stems and thin strokes defines the typeface's character." },
    { id: "serif", label: "Serif", color: "#805AD5", desc: "A small projecting stroke at the end of a main stroke. Bracketed serifs curve into the stem (Old Style); unbracketed serifs are flat (Modern)." },
    { id: "aperture", label: "Aperture", color: "#D69E2E", desc: "The opening of a partially enclosed counter in letters like c, e, s. Wide apertures help readers scan text quickly." },
    { id: "terminal", label: "Terminal", color: "#E53E3E", desc: "The ending of a stroke that does not culminate in a serif. May be flat, ball-shaped, tapered, or beak-like depending on the typeface." },
    { id: "crossbar", label: "Crossbar", color: "#3182CE", desc: "A horizontal stroke connecting two sides — in 'H', 'A', 'e'. Its height and weight contribute significantly to the typeface's personality." },
    { id: "tittle", label: "Tittle", color: "#38A169", desc: "The dot above 'i' and 'j'. Round dots feel warm; square ones feel rational. Even this tiny element carries expressive weight." },
    { id: "shoulder", label: "Shoulder", color: "#805AD5", desc: "The curved stroke arching from a stem in 'n', 'h', 'm'. The shoulder's curve affects whether a typeface feels rigid or calligraphic." },
    { id: "spine", label: "Spine", color: "#D69E2E", desc: "The sinuous main curve of the letter 'S'. The elegance of an 'S' is largely determined by its spine." },
    { id: "ligature", label: "Ligature", color: "#E53E3E", desc: "Two or more letters joined into a single glyph (fi, fl, ffi) to prevent collisions between strokes. Standard in quality body text." },
];

function ChapterAnatomy() {
    const [active, setActive] = useState(null);
    const part = ANATOMY_PARTS.find(p => p.id === active);
    return (
        <section id="anatomy" style={{ background: S.ink, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="01" title="Anatomy of type" dark />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60 }}>
                    <div>
                        <Prose dark>Every letter is an engineered structure with a precise vocabulary. Understanding type anatomy transforms font selection from guesswork into informed design decisions.</Prose>
                        <Prose dark>Hover any term to learn its definition and significance.</Prose>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                            {ANATOMY_PARTS.map(p => (
                                <button key={p.id} onMouseEnter={() => setActive(p.id)} onMouseLeave={() => setActive(null)}
                                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, padding: "6px 14px", borderRadius: 2, cursor: "pointer", transition: "all 0.15s", border: `1px solid ${active === p.id ? p.color : S.inkLight}`, background: active === p.id ? p.color + "22" : "transparent", color: active === p.id ? p.color : S.grey2, letterSpacing: "0.04em" }}>
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: 28, minHeight: 120, background: S.inkMid, border: `1px solid ${S.inkLight}`, borderRadius: 6, padding: 20 }}>
                            {part ? (
                                <div className="fade-in">
                                    <div style={{ fontSize: 13, fontWeight: 500, color: part.color, marginBottom: 8, letterSpacing: "0.04em" }}>{part.label}</div>
                                    <div style={{ fontSize: 14, color: S.grey2, lineHeight: 1.7 }}>{part.desc}</div>
                                </div>
                            ) : (
                                <div style={{ fontSize: 13, color: S.grey1, fontStyle: "italic" }}>Hover a term above to see its definition…</div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ background: S.inkMid, borderRadius: 6, padding: 28, border: `1px solid ${S.inkLight}` }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>Reference lines</div>
                            <div style={{ position: "relative", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ position: "relative", fontSize: 120, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: S.white, lineHeight: 1, userSelect: "none" }}>
                                    Hgpf
                                </div>
                                {[
                                    { top: "12%", label: "Ascender line", color: "#805AD5" },
                                    { top: "37%", label: "Cap height", color: "#38A169" },
                                    { top: "63%", label: "X-height", color: "#3182CE" },
                                    { top: "80%", label: "Baseline", color: "#E53E3E" },
                                    { top: "94%", label: "Descender line", color: "#D69E2E" },
                                ].map(({ top, label, color }) => (
                                    <div key={label} style={{ position: "absolute", top, left: 0, right: 0, display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ height: 1, flex: 1, background: color, opacity: 0.6 }} />
                                        <span style={{ fontSize: 10, color, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {[
                                { face: "Garamond", sample: "ag", note: "Diagonal stress, bracketed serifs, calligraphic origin" },
                                { face: "Bodoni", sample: "ag", note: "Vertical stress, hairline serifs, mechanical precision" },
                                { face: "Futura", sample: "ag", note: "Geometric forms, near-zero stroke contrast" },
                                { face: "Gill Sans", sample: "ag", note: "Humanist with calligraphic stroke modulation" },
                            ].map(({ face, sample, note }) => (
                                <div key={face} style={{ background: S.inkMid, border: `1px solid ${S.inkLight}`, borderRadius: 4, padding: 16 }}>
                                    <div style={{ fontFamily: face === "Garamond" ? "'Cormorant Garamond', serif" : face === "Bodoni" ? "'Playfair Display', serif" : face === "Futura" ? "'Bebas Neue', sans-serif" : "'DM Sans', sans-serif", fontSize: 36, color: S.white, lineHeight: 1, marginBottom: 8, letterSpacing: face === "Futura" ? "0.04em" : "-0.01em" }}>
                                        {sample}
                                    </div>
                                    <div style={{ fontSize: 11, color: S.grey1, fontFamily: "'IBM Plex Mono', monospace" }}>{face}</div>
                                    <div style={{ fontSize: 11, color: S.grey1, marginTop: 4, lineHeight: 1.5 }}>{note}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 02: CLASSIFICATION ──────────────────────────────────────────────
const TYPE_CLASSES = [
    { name: "Old Style Serif", period: "1470–1700s", examples: "Garamond · Caslon · Palatino", traits: "Diagonal stress · bracketed serifs · low contrast", use: "Books, long-form editorial, classical publishing", sample: "Garamond", font: "'Cormorant Garamond', serif", css: { fontWeight: 400, fontStyle: "italic" } },
    { name: "Transitional Serif", period: "1750s–1800s", examples: "Baskerville · Times New Roman", traits: "Moderate contrast · straighter serifs · shifting axis", use: "Newspapers, academic papers, general publishing", font: "'Libre Baskerville', serif", css: {} },
    { name: "Modern / Didone", period: "1790s–present", examples: "Bodoni · Didot", traits: "Extreme contrast · hairline serifs · vertical stress", use: "Fashion branding, luxury editorial, display only", font: "'Playfair Display', serif", css: { fontWeight: 900 } },
    { name: "Slab Serif", period: "1815–present", examples: "Rockwell · Clarendon · Courier", traits: "Heavy rectangular serifs · low contrast · bold impact", use: "Headlines, branding, signage, typewriters", font: "'Libre Baskerville', serif", css: { fontWeight: 700, letterSpacing: "-0.02em" } },
    { name: "Grotesque Sans", period: "1898–1930s", examples: "Akzidenz-Grotesk · Franklin Gothic", traits: "Some stroke variation · slightly squared curves · raw", use: "Editorial headlines, vintage branding", font: "'DM Sans', sans-serif", css: { fontWeight: 300, letterSpacing: "0.02em" } },
    { name: "Neo-Grotesque Sans", period: "1957–present", examples: "Helvetica · Arial · Univers", traits: "Near-zero contrast · narrow apertures · neutral", use: "Corporate identity, wayfinding, UI", font: "'DM Sans', sans-serif", css: { fontWeight: 400, letterSpacing: "-0.01em" } },
    { name: "Geometric Sans", period: "1927–present", examples: "Futura · Avenir · Gill Sans", traits: "Circular bowls · uniform stroke · mathematical", use: "Modernist branding, posters, fashion", font: "'Bebas Neue', sans-serif", css: { letterSpacing: "0.08em" } },
    { name: "Humanist Sans", period: "1976–present", examples: "Frutiger · Myriad · Calibri", traits: "Calligraphic influence · open apertures · warm", use: "Wayfinding, UI, body text with high legibility", font: "'DM Sans', sans-serif", css: { fontWeight: 400 } },
    { name: "Script — Formal", period: "17th c–present", examples: "Bickham · Snell Roundhand", traits: "Cursive · connecting strokes · upright or slanted", use: "Weddings, luxury packaging, certificates", font: "'Cormorant Garamond', serif", css: { fontStyle: "italic", fontWeight: 300, fontSize: "0.9em" } },
    { name: "Blackletter", period: "Medieval–present", examples: "Fraktur · Old English", traits: "Dense · angular · medieval calligraphic origin", use: "Newspaper mastheads, beer labels, metal bands", font: "'Playfair Display', serif", css: { fontWeight: 700 } },
    { name: "Display / Novelty", period: "1800s–present", examples: "Cooper Black · Impact · Lobster", traits: "Maximum impact · designed for large sizes only", use: "Posters, headlines, packaging", font: "'Bebas Neue', sans-serif", css: { letterSpacing: "0.12em", fontWeight: 400 } },
    { name: "Monospace", period: "1870s–present", examples: "Courier · Fira Code · JetBrains Mono", traits: "Equal character width · mechanical rhythm", use: "Code editors, tabular data, typewriter aesthetic", font: "'IBM Plex Mono', monospace", css: { fontWeight: 400 } },
];

function ChapterClassification() {
    const [selected, setSelected] = useState(0);
    const cls = TYPE_CLASSES[selected];
    return (
        <section id="classification" style={{ background: S.paper, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="02" title="Type classification" />
                <Prose>Every typeface carries the visual DNA of its era and tools. Classification gives you a framework for understanding why a typeface looks the way it does — and when to use it.</Prose>
                <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32, marginTop: 32 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {TYPE_CLASSES.map((c, i) => (
                            <button key={c.name} onClick={() => setSelected(i)} style={{
                                fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "10px 14px", textAlign: "left", cursor: "pointer", border: "none", borderRadius: 4, transition: "background 0.15s",
                                background: selected === i ? S.ink : "transparent", color: selected === i ? S.white : S.inkLight,
                            }}>
                                {c.name}
                            </button>
                        ))}
                    </div>

                    <div className="fade-in" key={selected}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <div>
                                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 8 }}>{cls.period}</div>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>{cls.name}</h3>
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: S.grey1, marginBottom: 6 }}>Key typefaces</div>
                                    <div style={{ fontSize: 14, color: S.inkLight }}>{cls.examples}</div>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: S.grey1, marginBottom: 6 }}>Defining traits</div>
                                    <div style={{ fontSize: 14, color: S.inkLight, lineHeight: 1.6 }}>{cls.traits}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: S.grey1, marginBottom: 6 }}>Best for</div>
                                    <div style={{ fontSize: 14, color: S.inkLight, lineHeight: 1.6 }}>{cls.use}</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 12 }}>Live specimen</div>
                                <div style={{ background: S.ink, borderRadius: 6, padding: "32px 24px" }}>
                                    <div style={{ fontFamily: cls.font, fontSize: 64, color: S.white, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.02em", ...cls.css }}>
                                        Aa Rg
                                    </div>
                                    <div style={{ fontFamily: cls.font, fontSize: 22, color: S.grey2, lineHeight: 1.4, ...cls.css }}>
                                        ABCDEFGHIJKLM
                                    </div>
                                    <div style={{ fontFamily: cls.font, fontSize: 22, color: S.grey2, lineHeight: 1.4, ...cls.css }}>
                                        abcdefghijklm
                                    </div>
                                    <div style={{ fontFamily: cls.font, fontSize: 22, color: S.grey2, lineHeight: 1.4, ...cls.css }}>
                                        0123456789 &!?
                                    </div>
                                    <div style={{ marginTop: 20, borderTop: `1px solid ${S.inkLight}`, paddingTop: 16, fontFamily: cls.font, fontSize: 15, color: S.grey1, lineHeight: 1.7, ...cls.css }}>
                                        The quick brown fox jumps over the lazy dog — a sentence containing every letter of the English alphabet.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 03: HISTORY ─────────────────────────────────────────────────────
const HISTORY_EVENTS = [
    { year: "~3500 BC", event: "Cuneiform & hieroglyphs", note: "Writing systems emerge — Sumerian wedge marks and Egyptian pictographs." },
    { year: "100 AD", event: "Trajan's Column", note: "Roman square capitals establish letterform proportions still echoed today." },
    { year: "800s", event: "Carolingian minuscule", note: "Standardized lowercase letters across the Holy Roman Empire — ancestor of modern type." },
    { year: "1040 AD", event: "Bi Sheng — ceramic movable type", note: "China invents the first movable type system — over 400 years before Gutenberg." },
    { year: "1450s", event: "Gutenberg's press", note: "Metal movable type, oil-based ink, and screw press. The 42-Line Bible launches the print era." },
    { year: "1470s", event: "Jenson in Venice", note: "Nicolas Jenson creates the archetype of Old Style Roman — still a legibility benchmark." },
    { year: "1501", event: "Aldus Manutius — italic", note: "Aldus introduces italic type and the portable octavo book format." },
    { year: "1530s", event: "Claude Garamond", note: "French Old Style refined to such elegance it remained the European standard for two centuries." },
    { year: "1722", event: "William Caslon", note: "Warm English Old Style — used to set the American Declaration of Independence." },
    { year: "1757", event: "Baskerville", note: "Transitional masterpiece — higher contrast, innovations in paper and ink quality." },
    { year: "1790s", event: "Bodoni & Didot", note: "Modern/Didone — extreme contrast, hairline serifs, the visual language of high fashion." },
    { year: "1815", event: "Slab serifs appear", note: "Industrial Revolution demands bold display type. Egyptian and Clarendon styles emerge." },
    { year: "1927", event: "Paul Renner — Futura", note: "Geometric sans built from pure circles and triangles. Lands on the Moon in 1969." },
    { year: "1928", event: "Eric Gill — Gill Sans", note: "Humanist sans with Roman proportions. Becomes the 'British Helvetica.'" },
    { year: "1957", event: "Helvetica & Univers", note: "Swiss modernism peaks. Two revolutionary sans-serifs released in the same year." },
    { year: "1984", event: "Macintosh + PostScript", note: "Desktop publishing democratizes type. PostScript enables scalable outlines." },
    { year: "1996", event: "OpenType announced", note: "Cross-platform format unifying Mac and Windows fonts with advanced features." },
    { year: "2010", event: "Google Fonts launches", note: "Open-source web fonts for everyone. Over 1,700 families by 2024." },
    { year: "2016", event: "Variable fonts (OT 1.8)", note: "Apple, Google, Microsoft, Adobe jointly announce OpenType Font Variations." },
    { year: "Today", event: "AI-assisted type design", note: "Machine learning automates spacing, weight interpolation, and character set expansion." },
];

function ChapterHistory() {
    const [active, setActive] = useState(0);
    return (
        <section id="history" style={{ background: S.inkMid, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="03" title="Five centuries of type" dark />
                <Prose dark>Typography's story is inseparable from the history of communication, commerce, religion, and culture. Every major typographic innovation emerged in response to a real-world need.</Prose>
                <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 0, marginTop: 32, border: `1px solid ${S.inkLight}`, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ background: S.ink, overflowY: "auto", maxHeight: 520 }}>
                        {HISTORY_EVENTS.map((e, i) => (
                            <button key={i} onClick={() => setActive(i)} style={{
                                display: "block", width: "100%", textAlign: "left", padding: "12px 16px", background: active === i ? S.inkMid : "transparent",
                                border: "none", borderBottom: `1px solid ${S.inkLight}`, cursor: "pointer", transition: "background 0.15s",
                            }}>
                                <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: active === i ? S.grey2 : S.grey1 }}>{e.year}</div>
                                <div style={{ fontSize: 12, color: active === i ? S.white : S.grey2, marginTop: 2, lineHeight: 1.4 }}>{e.event}</div>
                            </button>
                        ))}
                    </div>
                    <div key={active} className="fade-in" style={{ padding: 36, background: S.inkMid }}>
                        <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: S.grey1, marginBottom: 12, letterSpacing: "0.08em" }}>{HISTORY_EVENTS[active].year}</div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: S.white, marginBottom: 16, letterSpacing: "-0.01em" }}>
                            {HISTORY_EVENTS[active].event}
                        </h3>
                        <p style={{ fontSize: 16, color: S.grey2, lineHeight: 1.75, maxWidth: 540 }}>{HISTORY_EVENTS[active].note}</p>
                        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
                            <button className="lab-btn ghost" style={{ color: S.grey2, borderColor: S.inkLight }} onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}>&#8592; Prev</button>
                            <span style={{ fontSize: 12, color: S.grey1, fontFamily: "'IBM Plex Mono', monospace" }}>{active + 1} / {HISTORY_EVENTS.length}</span>
                            <button className="lab-btn ghost" style={{ color: S.grey2, borderColor: S.inkLight }} onClick={() => setActive(Math.min(HISTORY_EVENTS.length - 1, active + 1))} disabled={active === HISTORY_EVENTS.length - 1}>Next &#8594;</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 04: MECHANICS ───────────────────────────────────────────────────
function ChapterMechanics() {
    const [fontSize, setFontSize] = useState(17);
    const [lineHeight, setLineHeight] = useState(175);
    const [tracking, setTracking] = useState(0);
    const [wordSpacing, setWordSpacing] = useState(0);
    const [kerning, setKerning] = useState(true);
    const sampleText = "Typography is the art and technique of arranging type to make written language legible, readable, and visually appealing. The arrangement of type involves selecting typefaces, point sizes, line spacing, and letter spacing.";
    const samplePair = "WAVE  TAW  AV  Ty  We";
    return (
        <section id="mechanics" style={{ background: S.paper, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="04" title="Mechanics & metrics" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
                    <div>
                        <Prose>Every digital glyph lives in an abstract coordinate space called the em square. Typically 1,000 or 2,048 units per em — the drawing grid for all letterforms.</Prose>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
                            {[
                                { term: "Kerning", def: "Pair-specific spacing adjustments (AV, To, LY) built into the font file." },
                                { term: "Tracking", def: "Uniform letter-spacing applied across an entire text block." },
                                { term: "Leading", def: "Vertical distance between baselines. CSS: line-height. Ideal: 1.4–1.6× for body." },
                                { term: "Word spacing", def: "Horizontal space between words. ~20–25% of the em. Critical in justified text." },
                                { term: "Em square", def: "The abstract coordinate space containing every glyph. 1,000 or 2,048 units." },
                                { term: "UPM", def: "Units Per Em — the drawing grid resolution. Higher UPM = finer curves." },
                            ].map(({ term, def }) => (
                                <div key={term} style={{ padding: "14px 16px", background: S.paperDeep, border: `1px solid ${S.grey3}`, borderRadius: 4 }}>
                                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{term}</div>
                                    <div style={{ fontSize: 12, color: S.grey1, lineHeight: 1.55 }}>{def}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <LabCard title="Spacing laboratory">
                            <SliderRow label="Font size" value={fontSize} min={12} max={28} onChange={setFontSize} display={`${fontSize}px`} />
                            <SliderRow label="Line height" value={lineHeight} min={100} max={250} onChange={setLineHeight} display={`${(lineHeight / 100).toFixed(2)}`} />
                            <SliderRow label="Tracking" value={tracking} min={-50} max={200} onChange={setTracking} display={`${tracking > 0 ? '+' : ''}${tracking}`} />
                            <SliderRow label="Word spacing" value={wordSpacing} min={-5} max={20} onChange={setWordSpacing} display={`${wordSpacing > 0 ? '+' : ''}${wordSpacing}%`} />
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <span style={{ fontSize: 12, color: S.grey1, width: 100, fontFamily: "'IBM Plex Mono', monospace" }}>Kerning</span>
                                <button className="lab-btn ghost" onClick={() => setKerning(!kerning)} style={{ fontSize: 11 }}>
                                    {kerning ? "On (optical)" : "Off (metric)"}
                                </button>
                            </div>
                            <div style={{ background: S.white, border: `1px solid ${S.grey3}`, borderRadius: 4, padding: 20, minHeight: 120, fontFamily: "'Libre Baskerville', serif", fontSize: fontSize, lineHeight: lineHeight / 100, letterSpacing: `${tracking / 1000}em`, wordSpacing: `${wordSpacing}%`, fontKerning: kerning ? "normal" : "none" }}>
                                {sampleText}
                            </div>
                            <div style={{ marginTop: 12, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: S.grey1 }}>
                                Kerning pairs preview: <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 14, letterSpacing: kerning ? "normal" : "0.02em", fontKerning: kerning ? "normal" : "none", color: S.ink }}>{samplePair}</span>
                            </div>
                        </LabCard>

                        <LabCard title="Font formats" style={{ marginTop: 16 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {[
                                    { fmt: "WOFF2", note: "Best for web. Brotli compression: ~60–70% smaller. 97%+ browser support.", best: true },
                                    { fmt: "WOFF", note: "Web format. gzip compression: ~40–50% smaller. Legacy fallback.", best: false },
                                    { fmt: "OTF", note: "OpenType. Advanced features (ligatures, small caps). Desktop use.", best: false },
                                    { fmt: "TTF", note: "TrueType. Universal but uncompressed. Desktop / mobile apps.", best: false },
                                ].map(({ fmt, note, best }) => (
                                    <div key={fmt} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${S.grey3}` }}>
                                        <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, background: best ? S.ink : S.paperDeep, color: best ? S.white : S.ink, padding: "2px 8px", borderRadius: 3, minWidth: 58, textAlign: "center" }}>{fmt}</code>
                                        <span style={{ fontSize: 13, color: S.grey1, lineHeight: 1.5 }}>{note}</span>
                                    </div>
                                ))}
                            </div>
                        </LabCard>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 05: HIERARCHY ───────────────────────────────────────────────────
const SCALE_RATIOS = [
    { name: "Minor Third", ratio: 1.2, alias: "Dense UI" },
    { name: "Major Third", ratio: 1.25, alias: "Workhorse" },
    { name: "Perfect Fourth", ratio: 1.333, alias: "Web standard" },
    { name: "Augmented Fourth", ratio: 1.414, alias: "Editorial" },
    { name: "Golden Ratio", ratio: 1.618, alias: "Max drama" },
];

function ChapterHierarchy() {
    const [baseSize, setBaseSize] = useState(16);
    const [ratioIdx, setRatioIdx] = useState(2);
    const [darkPreview, setDarkPreview] = useState(false);
    const ratio = SCALE_RATIOS[ratioIdx].ratio;
    const steps = [5, 4, 3, 2, 1, 0, -1, -2];
    const roles = ["Display", "H1", "H2", "H3", "Body", "Small", "Caption", "Label"];
    const sizes = steps.map(s => Math.round(baseSize * Math.pow(ratio, s)));
    return (
        <section id="hierarchy" style={{ background: S.ink, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="05" title="Hierarchy & scale" dark />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
                    <div>
                        <Prose dark>A type scale generates sizes through a consistent mathematical ratio from a base size. This creates harmonious, proportional relationships across all text levels in a design system.</Prose>
                        <Prose dark>The modular scale is the foundation of any professional type system — it replaces ad hoc sizing with mathematical coherence.</Prose>

                        <LabCard dark title="Scale generator">
                            <SliderRow label="Base size" value={baseSize} min={12} max={22} step={1} onChange={setBaseSize} display={`${baseSize}px`} dark />
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: 12, color: S.grey1, marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>Scale ratio</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {SCALE_RATIOS.map((r, i) => (
                                        <button key={r.name} onClick={() => setRatioIdx(i)} className="lab-btn ghost" style={{ fontSize: 11, padding: "5px 10px", borderColor: ratioIdx === i ? S.grey2 : S.inkLight, color: ratioIdx === i ? S.white : S.grey1, background: ratioIdx === i ? S.inkLight : "transparent" }}>
                                            {r.name} ({r.ratio})
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ borderTop: `1px solid ${S.inkLight}`, paddingTop: 16 }}>
                                {steps.map((s, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
                                        <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: S.grey1, minWidth: 60 }}>{roles[i]}</span>
                                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: sizes[i], color: S.white, lineHeight: 1.2, letterSpacing: "-0.01em" }}>Aa</span>
                                        <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: S.grey1 }}>{sizes[i]}px</span>
                                    </div>
                                ))}
                            </div>
                        </LabCard>
                    </div>

                    <div>
                        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 12 }}>Preview — weight vs size as hierarchy</div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            <button className="lab-btn ghost" onClick={() => setDarkPreview(false)} style={{ color: !darkPreview ? S.white : S.grey1, borderColor: !darkPreview ? S.grey2 : S.inkLight }}>Light</button>
                            <button className="lab-btn ghost" onClick={() => setDarkPreview(true)} style={{ color: darkPreview ? S.white : S.grey1, borderColor: darkPreview ? S.grey2 : S.inkLight }}>Dark</button>
                        </div>
                        <div style={{ background: darkPreview ? S.ink : S.white, border: `1px solid ${darkPreview ? S.inkLight : S.grey3}`, borderRadius: 6, padding: "28px 28px" }}>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: sizes[0], fontWeight: 900, color: darkPreview ? S.white : S.ink, lineHeight: 1, marginBottom: 4, letterSpacing: "-0.02em" }}>Display</div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: sizes[1], fontWeight: 700, color: darkPreview ? S.white : S.ink, lineHeight: 1.1, marginBottom: 6, letterSpacing: "-0.015em" }}>The art of arrangement</div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: sizes[2], fontWeight: 500, color: darkPreview ? S.grey2 : S.inkLight, marginBottom: 16 }}>Why typography matters in design</div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: sizes[4], lineHeight: 1.7, color: darkPreview ? S.grey2 : S.grey1, marginBottom: 12 }}>
                                Typography is the art and technique of arranging type to make written language legible, readable, and visually appealing. The arrangement of type involves selecting typefaces, point sizes, line spacing, and letter spacing.
                            </div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: sizes[6], color: darkPreview ? S.grey1 : S.grey2 }}>Caption — Published March 2025 · 8 min read</div>
                        </div>

                        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {["Weight contrast", "Size contrast", "Color contrast", "Whitespace"].map(tool => (
                                <div key={tool} style={{ padding: "12px 14px", background: S.inkMid, border: `1px solid ${S.inkLight}`, borderRadius: 4 }}>
                                    <div style={{ fontSize: 12, color: S.grey2, fontWeight: 500 }}>{tool}</div>
                                    <div style={{ fontSize: 11, color: S.grey1, marginTop: 4 }}>Hierarchy tool</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 06: SCREEN VS PRINT ─────────────────────────────────────────────
function ChapterScreenPrint() {
    const [dpi, setDpi] = useState(96);
    const [antialias, setAntialias] = useState("subpixel");
    const [showFOUT, setShowFOUT] = useState("loaded");
    const sample = "Typography on screen";
    const aaStyle = (antialias === "none" ? { imageRendering: "pixelated", WebkitFontSmoothing: "none" } : antialias === "gray" ? { WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" } : { WebkitFontSmoothing: "subpixel-antialiased" }) as any;
    return (
        <section id="screenprint" style={{ background: S.paperDeep, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="06" title="Screen vs print" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
                    <div>
                        <Prose>Print operates at 300+ DPI. Traditional screens ran at 72–96 PPI. Retina displays exceed 220 PPI. This resolution difference fundamentally changes how type is designed for each medium.</Prose>

                        <LabCard title="Rendering simulator">
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: 12, color: S.grey1, marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>Simulated DPI: {dpi}</div>
                                <input type="range" min={72} max={300} step={1} value={dpi} onChange={e => setDpi(Number(e.target.value))} style={{ width: "100%" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: S.grey1, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                                    <span>72 (old screen)</span><span>150 (HiDPI)</span><span>300 (print)</span>
                                </div>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: 12, color: S.grey1, marginBottom: 8 }}>Antialiasing mode</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {["none", "gray", "subpixel"].map(m => (
                                        <button key={m} className="lab-btn ghost" onClick={() => setAntialias(m)} style={{ borderColor: antialias === m ? S.ink : S.grey3, color: antialias === m ? S.ink : S.grey1, fontSize: 11 }}>
                                            {m === "none" ? "None" : m === "gray" ? "Grayscale" : "Subpixel"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: S.ink, borderRadius: 4, padding: "20px 24px", transform: `scale(${72 / dpi})`, transformOrigin: "top left", width: `${(dpi / 72) * 100}%` }}>
                                <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 28, color: S.white, ...aaStyle, lineHeight: 1.3 }}>
                                    {sample}
                                </div>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: S.grey2, marginTop: 12, ...aaStyle, lineHeight: 1.6 }}>
                                    AaBbCcDd 0123456789 — fi fl ffi
                                </div>
                            </div>
                        </LabCard>
                    </div>

                    <div>
                        <LabCard title="Font loading — FOIT vs FOUT vs FOFT">
                            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                                {["foit", "fout", "loaded"].map(s => (
                                    <button key={s} className="lab-btn ghost" onClick={() => setShowFOUT(s)} style={{ fontSize: 11, borderColor: showFOUT === s ? S.ink : S.grey3 }}>
                                        {s === "foit" ? "FOIT" : s === "fout" ? "FOUT" : "Loaded"}
                                    </button>
                                ))}
                            </div>
                            <div style={{ background: S.white, border: `1px solid ${S.grey3}`, borderRadius: 4, padding: 20, minHeight: 100 }}>
                                {showFOUT === "foit" ? (
                                    <div style={{ fontFamily: "sans-serif", fontSize: 18, color: "transparent", background: S.grey3, borderRadius: 2, lineHeight: 1.6, padding: "2px 0" }}>
                                        Text invisible — custom font loading
                                    </div>
                                ) : showFOUT === "fout" ? (
                                    <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: S.grey1, lineHeight: 1.6 }}>
                                        Text in fallback font — custom font loading
                                    </div>
                                ) : (
                                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: S.ink, lineHeight: 1.6 }}>
                                        Text in Playfair Display — fully loaded
                                    </div>
                                )}
                            </div>
                            <div style={{ marginTop: 12, fontSize: 12, color: S.grey1, lineHeight: 1.6 }}>
                                {showFOUT === "foit" ? "FOIT: Flash of Invisible Text. Text hidden until font loads. Bad for UX." : showFOUT === "fout" ? "FOUT: Flash of Unstyled Text. Fallback shown immediately, then swaps. Preferred." : "Fully loaded: font-display: swap ensures text is always visible."}
                            </div>
                        </LabCard>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
                            {[
                                { title: "Line length rule", body: "45–75 characters per line. 66 is ideal. CSS: max-width in ch units." },
                                { title: "Optimal DPI", body: "Retina screens (220+ PPI) essentially match print quality for most type." },
                                { title: "Print units", body: "Points (1/72 inch), picas (12pt), bleed (3mm beyond trim edge)." },
                                { title: "System font stack", body: "Zero download, no FOIT: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto." },
                            ].map(({ title, body }) => (
                                <div key={title} style={{ padding: 16, background: S.paper, border: `1px solid ${S.grey3}`, borderRadius: 4 }}>
                                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{title}</div>
                                    <div style={{ fontSize: 12, color: S.grey1, lineHeight: 1.55 }}>{body}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 07: PAIRING ─────────────────────────────────────────────────────
const PAIRS = [
    { display: "Playfair Display", body: "'DM Sans', sans-serif", displayFont: "'Playfair Display', serif", desc: "Modern elegance — Didone drama meets geometric clarity.", class: "Display + Humanist Sans" },
    { display: "Cormorant Garamond", body: "'IBM Plex Mono', monospace", displayFont: "'Cormorant Garamond', serif", desc: "Editorial refinement — Old Style serenity with monospace precision.", class: "Old Style Serif + Monospace" },
    { display: "Bebas Neue", body: "'Libre Baskerville', serif", displayFont: "'Bebas Neue', sans-serif", desc: "Maximum contrast — condensed display with warm text serif.", class: "Display Sans + Transitional Serif" },
    { display: "DM Sans", body: "'Cormorant Garamond', serif", displayFont: "'DM Sans', sans-serif", desc: "Quiet hierarchy — neutral sans leads, classical serif reads.", class: "Humanist Sans + Old Style Serif" },
];

function ChapterPairing() {
    const [pairIdx, setPairIdx] = useState(0);
    const p = PAIRS[pairIdx];
    return (
        <section id="pairing" style={{ background: S.ink, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="07" title="Typeface pairing" dark />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 60 }}>
                    <div>
                        <Prose dark>Every successful pairing negotiates contrast and harmony. Too much similarity and faces blur; too much difference and design fractures.</Prose>
                        <Prose dark>The five strategies: classification contrast, historical period, same designer, shared x-height, clear role separation.</Prose>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
                            {PAIRS.map((pair, i) => (
                                <button key={i} onClick={() => setPairIdx(i)} style={{
                                    background: pairIdx === i ? S.inkMid : "transparent", border: `1px solid ${pairIdx === i ? S.grey1 : S.inkLight}`,
                                    borderRadius: 4, padding: "12px 16px", cursor: "pointer", textAlign: "left",
                                }}>
                                    <div style={{ fontFamily: pair.displayFont, fontSize: 20, color: S.white, lineHeight: 1.1 }}>{pair.display}</div>
                                    <div style={{ fontSize: 11, color: S.grey1, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{pair.class}</div>
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: 24, padding: "16px 0", borderTop: `1px solid ${S.inkLight}` }}>
                            <div style={{ fontSize: 12, color: S.grey1, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                                <strong style={{ color: S.white, fontWeight: 500 }}>The rule of 2–3:</strong> limit yourself to two typefaces per project, stretching to three only when a distinct role (like monospaced code) demands it.
                            </div>
                        </div>
                    </div>

                    <div className="fade-in" key={pairIdx}>
                        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 12 }}>Pairing preview</div>
                        <div style={{ background: S.white, borderRadius: 6, padding: "32px 28px" }}>
                            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
                                {p.class}
                            </div>
                            <div style={{ fontFamily: p.displayFont, fontSize: 40, fontWeight: 700, color: S.ink, lineHeight: 1.1, marginBottom: 8, letterSpacing: "-0.02em" }}>
                                The anatomy of a typeface
                            </div>
                            <div style={{ fontFamily: p.displayFont, fontSize: 21, color: "#666", marginBottom: 20, lineHeight: 1.3 }}>
                                From Gutenberg to variable fonts
                            </div>
                            <Rule color="#E0E0E0" />
                            <div style={{ fontFamily: p.body, fontSize: 16, lineHeight: 1.75, color: "#444", marginTop: 20 }}>
                                Typography is the art and technique of arranging type. The discipline encompasses selecting typefaces, point sizes, line lengths, line-spacing (leading), and letter-spacing (tracking). Its origins trace back to the first movable type systems of the 15th century.
                            </div>
                            <div style={{ fontFamily: p.body, fontSize: 13, color: "#888", marginTop: 16 }}>
                                Published in Type Quarterly — March 2025
                            </div>
                        </div>
                        <div style={{ marginTop: 12, fontSize: 13, color: S.grey2, fontFamily: "'DM Sans', sans-serif" }}>{p.desc}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 08: VARIABLE FONTS ──────────────────────────────────────────────
function ChapterVariable() {
    const [wght, setWght] = useState(400);
    const [wdth, setWdth] = useState(100);
    const [slnt, setSlnt] = useState(0);
    const [animate, setAnimate] = useState(false);
    const animRef = useRef(null);
    const dirRef = useRef(1);

    useEffect(() => {
        if (animate) {
            animRef.current = setInterval(() => {
                setWght(prev => {
                    const next = prev + dirRef.current * 10;
                    if (next >= 900) dirRef.current = -1;
                    if (next <= 100) dirRef.current = 1;
                    return Math.max(100, Math.min(900, next));
                });
            }, 50);
        } else {
            clearInterval(animRef.current);
        }
        return () => clearInterval(animRef.current);
    }, [animate]);

    const axes = [
        { name: "wght", label: "Weight axis", min: 100, max: 900, step: 1, value: wght, onChange: setWght, note: "100 = Thin, 400 = Regular, 700 = Bold, 900 = Black" },
        { name: "wdth", label: "Width axis", min: 75, max: 125, step: 1, value: wdth, onChange: setWdth, note: "75% = Condensed, 100% = Normal, 125% = Extended" },
        { name: "slnt", label: "Slant axis", min: -12, max: 0, step: 1, value: slnt, onChange: setSlnt, note: "0° = upright, -12° = maximum slant (not italic)" },
    ];

    return (
        <section id="variable" style={{ background: S.paperDeep, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="08" title="Variable fonts" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
                    <div>
                        <Prose>A variable font collapses an entire type family — and everything in between — into a single file. You don't just get Regular and Bold. You get every value from 100 to 900 and everything in between.</Prose>
                        <Prose>Specified as OpenType Font Variations (1.8), jointly announced by Apple, Google, Microsoft, and Adobe in September 2016.</Prose>

                        <LabCard title="Axis explorer — drag the sliders">
                            {axes.map(a => (
                                <div key={a.name}>
                                    <SliderRow label={a.name} value={a.value} min={a.min} max={a.max} step={a.step} onChange={a.onChange} display={`${a.value}`} />
                                    <div style={{ fontSize: 11, color: S.grey1, marginBottom: 14, marginLeft: 112, fontFamily: "'IBM Plex Mono', monospace" }}>{a.note}</div>
                                </div>
                            ))}
                            <button className="lab-btn" onClick={() => setAnimate(!animate)} style={{ marginTop: 8, fontSize: 11 }}>
                                {animate ? "Stop animation" : "Animate weight"}
                            </button>
                        </LabCard>
                    </div>

                    <div>
                        <div style={{ background: S.ink, borderRadius: 6, padding: "32px 28px", marginBottom: 20 }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 20 }}>Live preview</div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 72, fontWeight: wght, fontStretch: `${wdth}%`, fontStyle: `oblique ${Math.abs(slnt)}deg`, color: S.white, lineHeight: 1, marginBottom: 16, transition: animate ? "none" : "all 0.1s", letterSpacing: "-0.02em" }}>
                                Aa
                            </div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: wght, fontStretch: `${wdth}%`, fontStyle: `oblique ${Math.abs(slnt)}deg`, color: S.grey2, lineHeight: 1.3, marginBottom: 12, transition: animate ? "none" : "all 0.1s" }}>
                                Typography in motion
                            </div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: wght, fontStretch: `${wdth}%`, fontStyle: `oblique ${Math.abs(slnt)}deg`, color: S.grey1, lineHeight: 1.65, transition: animate ? "none" : "all 0.1s" }}>
                                The quick brown fox jumps over the lazy dog. One file, infinite styles.
                            </div>
                            <div style={{ marginTop: 20, borderTop: `1px solid ${S.inkLight}`, paddingTop: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: S.grey1 }}>
                                font-variation-settings: 'wght' {wght}<br />
                                font-stretch: {wdth}%<br />
                                font-style: oblique {Math.abs(slnt)}deg
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                            {[
                                { axis: "wght", full: "Weight", note: "100–900" },
                                { axis: "wdth", full: "Width", note: "75–125%" },
                                { axis: "ital", full: "Italic", note: "0 or 1" },
                                { axis: "slnt", full: "Slant", note: "−12 to 0°" },
                                { axis: "opsz", full: "Optical size", note: "6–144pt" },
                                { axis: "GRAD", full: "Grade", note: "−200 to 150" },
                            ].map(({ axis, full, note }) => (
                                <div key={axis} style={{ padding: 12, background: S.paper, border: `1px solid ${S.grey3}`, borderRadius: 4 }}>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: S.ink }}>{axis}</div>
                                    <div style={{ fontSize: 12, color: S.inkLight, marginTop: 2 }}>{full}</div>
                                    <div style={{ fontSize: 11, color: S.grey1, marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>{note}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 09: TYPE IN USE ──────────────────────────────────────────────────
function ChapterTypesetting() {
    const [ligatures, setLigatures] = useState(true);
    const [smartQuotes, setSmartQuotes] = useState(true);
    const [hanging, setHanging] = useState(false);
    const [justify, setJustify] = useState(false);

    const rawText = smartQuotes
        ? `"Typography is the craft of endowing human language with a durable visual form," wrote Robert Bringhurst in The Elements of Typographic Style. It's an art that's been refined over five centuries — from Gutenberg's press to today's variable fonts.`
        : `"Typography is the craft of endowing human language with a durable visual form," wrote Robert Bringhurst in The Elements of Typographic Style. It's an art that's been refined over five centuries -- from Gutenberg's press to today's variable fonts.`;

    return (
        <section id="typesetting" style={{ background: S.ink, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="09" title="Type in use" dark />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
                    <div>
                        <Prose dark>Readability is distinct from legibility. Legibility is a property of the typeface — can you distinguish characters? Readability depends on setting — can you comfortably read extended text?</Prose>
                        <Prose dark>Professional typesetting involves dozens of micro-decisions that collectively determine whether text is a pleasure or a struggle to read.</Prose>

                        <LabCard dark title="Typesetting controls">
                            {[
                                { label: "Standard ligatures (fi, fl)", val: ligatures, set: setLigatures, desc: "Joins colliding letter pairs into single glyphs" },
                                { label: "Smart quotes", val: smartQuotes, set: setSmartQuotes, desc: "Curly quotes vs straight typewriter marks" },
                                { label: "Hanging punctuation", val: hanging, set: setHanging, desc: "Shifts quotes outside the text margin" },
                                { label: "Justified alignment", val: justify, set: setJustify, desc: "Flush both margins via word-space adjustment" },
                            ].map(({ label, val, set, desc }) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${S.inkLight}` }}>
                                    <div>
                                        <div style={{ fontSize: 13, color: S.grey2, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                                        <div style={{ fontSize: 11, color: S.grey1, marginTop: 3 }}>{desc}</div>
                                    </div>
                                    <button className="lab-btn" onClick={() => set(!val)} style={{ background: val ? "#E2E8F0" : S.inkLight, color: val ? S.ink : S.grey2, fontSize: 11, minWidth: 44 }}>
                                        {val ? "On" : "Off"}
                                    </button>
                                </div>
                            ))}
                        </LabCard>
                    </div>

                    <div>
                        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 12 }}>Live text preview</div>
                        <div style={{ background: S.white, borderRadius: 6, padding: "28px 28px", fontFamily: "'Libre Baskerville', serif", fontSize: 17, lineHeight: 1.8, color: S.ink, textAlign: justify ? "justify" : "left", textIndent: hanging ? "-0.5em" : "0", paddingLeft: hanging ? "calc(28px + 0.5em)" : "28px", fontFeatureSettings: ligatures ? "'liga' 1, 'clig' 1" : "'liga' 0, 'clig' 0" }}>
                            {rawText}
                        </div>
                        <div style={{ marginTop: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: S.grey1 }}>
                            font-feature-settings: {ligatures ? "'liga' 1, 'clig' 1" : "'liga' 0"};<br />
                            text-align: {justify ? "justify" : "left"};<br />
                            text-indent: {hanging ? "-0.5em (hanging)" : "0"};
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                            {[
                                { title: "Em dash —", bad: "--", good: "—", note: "Parenthetical break" },
                                { title: "En dash –", bad: "-", good: "–", note: "Ranges: pages 10–15" },
                                { title: "Ellipsis …", bad: "...", good: "…", note: "Single Unicode character" },
                                { title: "Smart quotes", bad: '\"', good: "\u201c\u201d", note: "Curly, not straight" },
                            ].map(({ title, bad, good, note }) => (
                                <div key={title} style={{ padding: "12px 14px", background: S.inkMid, border: `1px solid ${S.inkLight}`, borderRadius: 4 }}>
                                    <div style={{ fontSize: 12, color: S.grey2, marginBottom: 6, fontWeight: 500 }}>{title}</div>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>
                                        <span style={{ color: "#E53E3E" }}>{bad}</span>
                                        <span style={{ color: "#38A169" }}>{good}</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: S.grey1, marginTop: 4 }}>{note}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 10: EMOTION ─────────────────────────────────────────────────────
const MOODS = [
    { mood: "Trust & Authority", fonts: ["'Libre Baskerville', serif", "'Cormorant Garamond', serif"], names: ["Libre Baskerville", "Cormorant Garamond"], why: "Serif typefaces — centuries of use in books and legal documents. Stability, credibility, tradition." },
    { mood: "Modern & Clean", fonts: ["'DM Sans', sans-serif", "'DM Sans', sans-serif"], names: ["Helvetica", "Futura"], why: "Neo-grotesque and geometric sans-serifs. Efficiency, objectivity, contemporary neutrality." },
    { mood: "Luxury & Fashion", fonts: ["'Playfair Display', serif", "'Cormorant Garamond', serif"], names: ["Didot-style", "Cormorant"], why: "High-contrast serifs. The hairline-thick contrast of Bodoni and Didot has defined haute couture for 70 years." },
    { mood: "Warmth & Human", fonts: ["'DM Sans', sans-serif", "'Libre Baskerville', serif"], names: ["Gill Sans-inspired", "Baskerville"], why: "Humanist type with calligraphic origins. Visible handmade quality creates empathy and approachability." },
    { mood: "Bold & Industrial", fonts: ["'Bebas Neue', sans-serif", "'DM Sans', sans-serif"], names: ["Bebas Neue", "DIN-style"], why: "Slab serifs and condensed sans. Born in the 19th century for posters and billboards. Commands attention." },
];

function ChapterEmotion() {
    const [moodIdx, setMoodIdx] = useState(0);
    const m = MOODS[moodIdx];
    return (
        <section id="emotion" style={{ background: S.paper, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="10" title="Emotion & psychology" />
                <Prose>Research confirms people consistently assign personality traits to typefaces. In a striking 2008 experiment, the same satirical text in Times New Roman was perceived as funnier and angrier than in Arial. The typeface alone altered emotional reception — before a word was cognitively processed.</Prose>
                <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 40, marginTop: 32 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {MOODS.map((mood, i) => (
                            <button key={i} onClick={() => setMoodIdx(i)} style={{
                                fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "10px 14px", textAlign: "left", border: "none", borderRadius: 4, cursor: "pointer", transition: "background 0.15s",
                                background: moodIdx === i ? S.ink : S.paperDeep, color: moodIdx === i ? S.white : S.inkLight,
                            }}>
                                {mood.mood}
                            </button>
                        ))}
                    </div>

                    <div className="fade-in" key={moodIdx}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            {m.fonts.map((font, i) => (
                                <div key={i} style={{ background: i === 0 ? S.ink : S.paperDeep, border: `1px solid ${i === 0 ? S.inkLight : S.grey3}`, borderRadius: 6, padding: 24 }}>
                                    <div style={{ fontFamily: font, fontSize: 36, color: i === 0 ? S.white : S.ink, lineHeight: 1.1, marginBottom: 8, fontWeight: i === 0 ? 700 : 400 }}>
                                        Typography
                                    </div>
                                    <div style={{ fontFamily: font, fontSize: 16, color: i === 0 ? S.grey2 : S.grey1, lineHeight: 1.65 }}>
                                        The craft of language made visible, enduring, and expressive.
                                    </div>
                                    <div style={{ marginTop: 12, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: i === 0 ? S.grey1 : S.grey2 }}>{m.names[i]}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: S.paperDeep, border: `1px solid ${S.grey3}`, borderRadius: 6, padding: 20 }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 8 }}>Why it works</div>
                            <div style={{ fontSize: 15, color: S.inkLight, lineHeight: 1.7 }}>{m.why}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 11: SPECIMENS ───────────────────────────────────────────────────
const SPECIMENS = [
    { name: "Garamond", year: "1530s", designer: "Claude Garamond", class: "Old Style Serif", note: "The standard for European printing for two centuries. Warm, elegant, immutable.", font: "'Cormorant Garamond', serif", weight: 300 },
    { name: "Baskerville", year: "1757", designer: "John Baskerville", class: "Transitional Serif", note: "Refined contrast and crisp serifs. Used for the Penguin classics series.", font: "'Libre Baskerville', serif", weight: 400 },
    { name: "Bodoni", year: "1798", designer: "G. Bodoni", class: "Modern / Didone", note: "Hairline-thick contrast defines fashion editorial. Vogue's typographic DNA.", font: "'Playfair Display', serif", weight: 900 },
    { name: "Futura", year: "1927", designer: "Paul Renner", class: "Geometric Sans", note: "Built from circles and lines. The font that landed on the Moon.", font: "'Bebas Neue', sans-serif", weight: 400 },
    { name: "Gill Sans", year: "1928", designer: "Eric Gill", class: "Humanist Sans", note: "Roman proportions without serifs. The BBC, Penguin Books, British Rail.", font: "'DM Sans', sans-serif", weight: 300 },
    { name: "Helvetica", year: "1957", designer: "M. Miedinger", class: "Neo-Grotesque Sans", note: "The world's most famous typeface. BMW, Lufthansa, the NYC subway.", font: "'DM Sans', sans-serif", weight: 400 },
    { name: "Frutiger", year: "1976", designer: "Adrian Frutiger", class: "Humanist Sans", note: "Designed for Charles de Gaulle Airport. Praised as the best general typeface.", font: "'DM Sans', sans-serif", weight: 400 },
    { name: "Georgia", year: "1993", designer: "Matthew Carter", class: "Transitional Serif", note: "First serif designed for screen. Large x-height, robust at 12px.", font: "'Libre Baskerville', serif", weight: 400 },
];

function ChapterSpecimens() {
    const [sel, setSel] = useState(null);
    return (
        <section id="specimens" style={{ background: S.inkMid, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="11" title="Landmark typefaces" dark />
                <Prose dark>Every typeface in this gallery shaped the visual culture of its era and continues to influence design decisions today. Hover to preview.</Prose>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 32 }}>
                    {SPECIMENS.map((s, i) => (
                        <div key={i} onMouseEnter={() => setSel(i)} onMouseLeave={() => setSel(null)} style={{ background: sel === i ? S.ink : S.inkLight, border: `1px solid ${sel === i ? S.grey1 : S.inkLight}`, borderRadius: 6, padding: 20, cursor: "default", transition: "all 0.15s" }}>
                            <div style={{ fontFamily: s.font, fontSize: sel === i ? 52 : 40, fontWeight: s.weight, color: S.white, lineHeight: 1, marginBottom: 10, letterSpacing: "-0.01em", transition: "font-size 0.15s" }}>
                                Ag
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: S.white, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: S.grey1, marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>{s.year} · {s.designer}</div>
                            <div style={{ fontSize: 11, color: S.grey2, padding: "3px 8px", background: S.inkMid, borderRadius: 2, display: "inline-block", marginBottom: sel === i ? 10 : 0 }}>{s.class}</div>
                            {sel === i && <div style={{ fontSize: 12, color: S.grey2, lineHeight: 1.55, marginTop: 8, borderTop: `1px solid ${S.inkLight}`, paddingTop: 8 }}>{s.note}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 12: FOUNDRIES ───────────────────────────────────────────────────
function ChapterFoundries() {
    const foundries = [
        { name: "Monotype", type: "Conglomerate", note: "250,000+ fonts from 4,500+ designers. Owns Linotype, FontShop, Hoefler&Co.", url: "https://www.monotype.com" },
        { name: "Adobe Fonts", type: "Subscription", note: "30,000+ fonts bundled with Creative Cloud. No extra cost for subscribers.", url: "https://fonts.adobe.com" },
        { name: "Google Fonts", type: "Open source", note: "1,700+ open-source families. Free for all use. Powers billions of web pages.", url: "https://fonts.google.com" },
        { name: "Grilli Type", type: "Independent", note: "Swiss precision. GT Walsheim, GT America, GT Eesti. Award-winning modern type.", url: "https://www.grillitype.com" },
        { name: "Klim Type", type: "Independent", note: "Kris Sowersby, New Zealand. Calibre, Tiempos, National. Deeply considered craft.", url: "https://klim.co.nz" },
        { name: "Commercial Type", type: "Independent", note: "Paul Barnes and Christian Schwartz. Atlas, Lyon, Publico. Editorial excellence.", url: "https://commercialtype.com" },
        { name: "Hoefler&Co", type: "Premium", note: "Jonathan Hoefler. Gotham, Mercury, Whitney, Archer. Now part of Monotype.", url: "https://www.typography.com" },
        { name: "Dalton Maag", type: "Corporate", note: "Custom corporate typefaces. Ubuntu, Nokia Pure, Effra.", url: "https://www.daltonmaag.com" },
    ];
    return (
        <section id="foundries" style={{ background: S.paper, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="12" title="The type industry" />
                <Prose>A type foundry designs, produces, and distributes typefaces. The term dates to when foundries literally cast metal type from hot lead alloys. Today, a foundry is typically a studio creating digital font files.</Prose>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 32 }}>
                    {foundries.map(f => (
                        <div key={f.name} style={{ background: S.paperDeep, border: `1px solid ${S.grey3}`, borderRadius: 6, padding: "18px 16px" }}>
                            <div style={{ fontSize: 15, fontWeight: 500, color: S.ink, marginBottom: 4 }}>{f.name}</div>
                            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: S.grey1, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>{f.type}</div>
                            <div style={{ fontSize: 12, color: S.grey1, lineHeight: 1.6, marginBottom: 12 }}>{f.note}</div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 36, padding: 24, background: S.paperDeep, border: `1px solid ${S.grey3}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Font licensing — what you need to know</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                        {[
                            { type: "Desktop", note: "Per-seat. Install on N computers. Covers print and static images." },
                            { type: "Web", note: "Per-pageview or domain. Embedding via @font-face in CSS." },
                            { type: "App", note: "Covers distribution in mobile or desktop apps." },
                            { type: "Server", note: "Dynamic document generation. PDF creation, email rendering." },
                        ].map(({ type, note }) => (
                            <div key={type}>
                                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{type}</div>
                                <div style={{ fontSize: 12, color: S.grey1, lineHeight: 1.55 }}>{note}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 13: WEB & UI ─────────────────────────────────────────────────────
function ChapterWeb() {
    const [fsize, setFsize] = useState(16);
    const [lh, setLh] = useState(1.7);
    const [ls, setLs] = useState(0);
    const [fw, setFw] = useState(400);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <section id="web" style={{ background: S.ink, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="13" title="Web & UI typography" dark />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
                    <div>
                        <Prose dark>Typography for the web demands performance, accessibility, and responsiveness on top of aesthetic excellence. Every CSS property has implications for readability and rendering.</Prose>
                        <LabCard dark title="CSS typography playground">
                            <SliderRow label="font-size" value={fsize} min={12} max={28} onChange={setFsize} display={`${fsize}px`} dark />
                            <SliderRow label="line-height" value={lh} min={1.0} max={2.5} step={0.05} onChange={setLh} display={lh.toFixed(2)} dark />
                            <SliderRow label="letter-spacing" value={ls} min={-50} max={200} onChange={setLs} display={`${ls > 0 ? "+" : ""}${ls / 1000}em`} dark />
                            <SliderRow label="font-weight" value={fw} min={100} max={900} step={100} onChange={setFw} display={String(fw)} dark />
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                                <span style={{ fontSize: 12, color: S.grey1, width: 100, fontFamily: "'IBM Plex Mono', monospace" }}>dark mode</span>
                                <button className="lab-btn ghost" onClick={() => setDarkMode(!darkMode)} style={{ color: S.grey2, borderColor: S.inkLight, fontSize: 11 }}>
                                    {darkMode ? "On" : "Off"}
                                </button>
                            </div>
                        </LabCard>

                        <div style={{ marginTop: 20 }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 12 }}>Generated CSS</div>
                            <pre style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: S.grey2, background: S.inkMid, padding: 16, borderRadius: 4, lineHeight: 1.65, overflow: "auto" }}>
                                {`.body-text {
  font-size: ${fsize}px;
  line-height: ${lh.toFixed(2)};
  letter-spacing: ${(ls / 1000).toFixed(3)}em;
  font-weight: ${fw};
  color: ${darkMode ? "#E5E5E5" : "#1A1A1A"};
  background: ${darkMode ? "#0D0D0D" : "#FFFFFF"};
}`}
                            </pre>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: S.grey1, marginBottom: 12 }}>Live preview</div>
                        <div key={`${fsize}-${lh}-${ls}-${fw}-${darkMode}`} style={{ background: darkMode ? S.ink : S.white, border: `1px solid ${darkMode ? S.inkLight : S.grey3}`, borderRadius: 6, padding: 28 }}>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: fsize * 1.8, fontWeight: Math.min(fw + 200, 900), color: darkMode ? S.white : S.ink, lineHeight: 1.15, marginBottom: 8, letterSpacing: "-0.01em" }}>
                                Web typography best practices
                            </div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: fsize, lineHeight: lh, letterSpacing: `${ls / 1000}em`, fontWeight: fw, color: darkMode ? S.grey2 : S.grey1 }}>
                                Typography for the web demands performance, accessibility, and responsiveness on top of aesthetic excellence. Use WOFF2, set font-display: swap, and preload critical fonts to minimize layout shift. For body text, 16px with a line-height of 1.5–1.7 provides optimal readability across devices.
                            </div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: fsize * 0.75, color: darkMode ? S.grey1 : S.grey2, marginTop: 16, fontWeight: fw }}>
                                Published: March 2025 · 8 min read
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                            {[
                                { rule: "WOFF2 only for web", note: "~30% smaller than WOFF. 97%+ browser support." },
                                { rule: "font-display: swap", note: "Ensures text always visible. Prevents FOIT." },
                                { rule: "16px minimum", note: "WCAG requires 16px body text. Never override root font-size." },
                                { rule: "4.5:1 contrast", note: "WCAG AA minimum. Check with browser devtools." },
                                { rule: "Fluid type with clamp()", note: "clamp(1rem, 0.9rem + 0.5vw, 1.125rem) scales without breakpoints." },
                                { rule: "Variable fonts", note: "One WOFF2 replaces 12 static files. 88% size reduction." },
                            ].map(({ rule, note }) => (
                                <div key={rule} style={{ padding: 12, background: S.inkMid, border: `1px solid ${S.inkLight}`, borderRadius: 4 }}>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: S.white, marginBottom: 4 }}>{rule}</div>
                                    <div style={{ fontSize: 11, color: S.grey1, lineHeight: 1.5 }}>{note}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CHAPTER 14: GLOSSARY ────────────────────────────────────────────────────
const GLOSSARY = [
    { term: "Aperture", def: "The partially enclosed opening in characters like c, e, s. Wider = better legibility." },
    { term: "Ascender", def: "The part of b, d, h, k, l extending above x-height." },
    { term: "Baseline", def: "The invisible line on which letters rest." },
    { term: "Bowl", def: "The fully enclosed rounded part of b, d, o, p." },
    { term: "Cap height", def: "Height from baseline to top of flat capitals like H." },
    { term: "Counter", def: "Enclosed or partially enclosed white space within a letterform." },
    { term: "Crossbar", def: "Horizontal stroke connecting two sides — H, A, e." },
    { term: "Descender", def: "The part of g, j, p, q, y dropping below the baseline." },
    { term: "Em", def: "Unit equal to the current point size. 1em = font-size in CSS." },
    { term: "Font", def: "A specific file: Garamond Bold Italic. One instance of a typeface." },
    { term: "Glyph", def: "The specific visual form of a character in a font." },
    { term: "Hinting", def: "Instructions in a font that optimize rendering at small sizes by snapping to pixel grids." },
    { term: "Kerning", def: "Pair-specific spacing adjustments (AV, To) built into the font." },
    { term: "Leading", def: "Vertical distance between baselines. CSS: line-height. Ideal: 1.4–1.6×." },
    { term: "Legibility", def: "Can you distinguish individual characters? A property of the typeface." },
    { term: "Ligature", def: "Two letters joined into one glyph (fi, fl). Prevents collisions." },
    { term: "Measure", def: "Line length in characters. Ideal: 45–75. 66 is optimal." },
    { term: "Optical sizing", def: "Design adjustments for different size: sturdy for small, refined for display." },
    { term: "Readability", def: "Can you read extended text comfortably? Depends on setting, not just typeface." },
    { term: "Serif", def: "Small projecting stroke at end of a letterform's main stroke." },
    { term: "Stem", def: "Primary vertical stroke — the backbone of I, l, H." },
    { term: "Stress / Axis", def: "Angle through thinnest parts of curved letters. Diagonal (Old Style) or vertical (Modern)." },
    { term: "Tittle", def: "The dot above i and j." },
    { term: "Tracking", def: "Uniform letter-spacing applied across an entire text block." },
    { term: "Typeface", def: "The overall design — Garamond, Helvetica. A family of related fonts." },
    { term: "Typography", def: "The art and technique of arranging type for legibility and visual appeal." },
    { term: "Variable font", def: "A single file containing continuous adjustable style ranges along design axes." },
    { term: "WOFF2", def: "Web font format using Brotli compression. ~60–70% smaller. The web standard." },
    { term: "X-height", def: "Height of lowercase x. Large = better legibility at small sizes." },
];

function ChapterGlossary() {
    const [query, setQuery] = useState("");
    const [flip, setFlip] = useState({});
    const filtered = query ? GLOSSARY.filter(g => g.term.toLowerCase().includes(query.toLowerCase()) || g.def.toLowerCase().includes(query.toLowerCase())) : GLOSSARY;

    return (
        <section id="glossary" style={{ background: S.paperDeep, padding: "80px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <ChapterLabel num="14" title="Glossary" />
                <Prose>Every term a designer needs to know. Click any card to flip it.</Prose>
                <div style={{ marginBottom: 28 }}>
                    <input type="text" placeholder="Search terms…" value={query} onChange={e => setQuery(e.target.value)} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, padding: "12px 16px", border: `1px solid ${S.grey3}`, borderRadius: 4, width: 320, outline: "none", background: S.white, color: S.ink }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                    {filtered.map((g, i) => (
                        <div key={g.term} onClick={() => setFlip(f => ({ ...f, [g.term]: !f[g.term] }))} style={{ background: flip[g.term] ? S.ink : S.white, border: `1px solid ${S.grey3}`, borderRadius: 6, padding: 16, cursor: "pointer", minHeight: 80, transition: "background 0.2s", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            {flip[g.term] ? (
                                <div style={{ fontSize: 12, color: S.grey2, lineHeight: 1.6 }}>{g.def}</div>
                            ) : (
                                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: S.ink, letterSpacing: "-0.01em" }}>{g.term}</div>
                            )}
                        </div>
                    ))}
                </div>
                {filtered.length === 0 && <div style={{ fontSize: 14, color: S.grey1, marginTop: 20 }}>No terms match your search.</div>}
            </div>
        </section>
    );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
    const [activeChapter, setActiveChapter] = useState("intro");
    const sectionRefs = useRef({});

    const handleNav = useCallback((id) => {
        setActiveChapter(id);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => { if (e.isIntersecting) setActiveChapter(e.target.id); });
            },
            { threshold: 0.3 }
        );
        chapters.forEach(c => {
            const el = document.getElementById(c.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style>{globalStyles}</style>
            <div style={{ minHeight: "100vh" }}>
                <header style={{ background: S.ink, padding: "40px 40px 32px" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: S.grey1, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                                    An interactive reference — complete beginners guide
                                </div>
                                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 900, color: S.white, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                                    Typography
                                </h1>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: S.grey1, lineHeight: 1.6, maxWidth: 260 }}>
                                    15 chapters covering anatomy, classification, history, mechanics, and interactive experimentation tools
                                </div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: S.grey1, marginTop: 8 }}>
                                    2025 edition
                                </div>
                            </div>
                        </div>
                        <div style={{ height: 1, background: S.inkLight, marginTop: 28 }} />
                        <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
                            {["Anatomy", "Classification", "History", "Mechanics", "Hierarchy", "Screen vs Print", "Pairing", "Variable fonts"].map(t => (
                                <span key={t} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: S.grey1 }}>{t}</span>
                            ))}
                        </div>
                    </div>
                </header>

                <Nav active={activeChapter} onNav={handleNav} />

                <main>
                    <ChapterIntro />
                    <ChapterAnatomy />
                    <ChapterClassification />
                    <ChapterHistory />
                    <ChapterMechanics />
                    <ChapterHierarchy />
                    <ChapterScreenPrint />
                    <ChapterPairing />
                    <ChapterVariable />
                    <ChapterTypesetting />
                    <ChapterEmotion />
                    <ChapterSpecimens />
                    <ChapterFoundries />
                    <ChapterWeb />
                    <ChapterGlossary />
                </main>

                <footer style={{ background: S.ink, padding: "48px 40px", borderTop: `1px solid ${S.inkLight}` }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: S.white, letterSpacing: "-0.01em" }}>Typography</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: S.grey1 }}>
                            A complete beginner's guide · 15 chapters · interactive laboratories
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}