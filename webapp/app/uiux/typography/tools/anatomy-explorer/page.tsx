"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
    // whites & creams
    w0: "#FDFCFA",   // purest surface
    w1: "#F8F5F0",   // warm white
    w2: "#F2EDE5",   // light cream
    w3: "#E8E0D4",   // mid cream
    w4: "#D9CFC0",   // deeper cream
    // chocolates
    c0: "#1E0F06",   // near-black espresso
    c1: "#2C1A0E",   // dark chocolate
    c2: "#3D2410",   // rich brown
    c3: "#5C3520",   // mid chocolate
    c4: "#7A4A2E",   // warm brown
    c5: "#9E6848",   // tan
    c6: "#C49A78",   // light tan
    c7: "#DEC4A8",   // pale tan
    // line accent colors (warm, no violet)
    lAsc: "#7B5EA7",  // soft plum (not violet, more wine)
    lCap: "#2A7A4F",  // forest green
    lX: "#1E5FA8",  // ink blue
    lBas: "#B83232",  // brick red
    lDes: "#B87820",  // amber
};

// ─── FONTS ────────────────────────────────────────────────────────────────────
const FONT_LIBRARY = [
    {
        name: "Playfair Display", cat: "Serif", sub: "Modern/Didone", tags: ["editorial", "luxury", "fashion"],
        personality: "Dramatic and high-contrast. The hairline serifs evoke couture fashion, upscale editorial, and luxury brands. At display sizes it commands attention; never use below 18pt.",
        useCases: ["Fashion editorial", "Luxury brand identity", "Book cover titles", "Magazine headers", "High-end packaging"],
        tone: "Sophisticated · Dramatic · Prestigious",
        avoid: "Body text, healthcare, children's products"
    },

    {
        name: "Cormorant Garamond", cat: "Serif", sub: "Old Style", tags: ["classical", "book", "elegant"],
        personality: "Renaissance calligraphy made digital. The diagonal stress and bracketed serifs carry 500 years of bookmaking tradition. Scholarly, warm, and deeply readable for long-form prose.",
        useCases: ["Literary publishing", "Academic journals", "Luxury stationery", "Fine dining menus", "Poetry collections"],
        tone: "Classical · Warm · Scholarly",
        avoid: "Tech products, sports, urban branding"
    },

    {
        name: "Libre Baskerville", cat: "Serif", sub: "Transitional", tags: ["newspaper", "academic", "readable"],
        personality: "The reliable workhorse of transitional serifs. Higher contrast than Old Style but softer than Didone. Optimised for screen reading while feeling at home in print.",
        useCases: ["News articles", "Academic papers", "Corporate reports", "Legal documents", "Educational content"],
        tone: "Authoritative · Trustworthy · Neutral",
        avoid: "Fashion, entertainment, youth brands"
    },

    {
        name: "Merriweather", cat: "Serif", sub: "Transitional", tags: ["screen", "readable", "news"],
        personality: "Designed specifically for screens. Wide proportions and generous x-height mean it holds legibility at 14px. The go-to for content-heavy digital publishing.",
        useCases: ["Long-form web articles", "Blogging platforms", "E-readers", "News websites", "Documentation"],
        tone: "Readable · Sturdy · Dependable",
        avoid: "Luxury, fashion, minimal branding"
    },

    {
        name: "Lora", cat: "Serif", sub: "Transitional", tags: ["blog", "editorial", "warm"],
        personality: "Calligraphic roots give Lora a warmth that purely geometric serifs lack. Well-suited for personal publishing, lifestyle brands, and anything that benefits from a human touch.",
        useCases: ["Lifestyle blogs", "Wedding websites", "Personal branding", "Recipe books", "Health and wellness"],
        tone: "Warm · Personal · Approachable",
        avoid: "Financial, legal, engineering contexts"
    },

    {
        name: "EB Garamond", cat: "Serif", sub: "Old Style", tags: ["classical", "book", "humanist"],
        personality: "An open-source revival of the 16th-century Garamond. Extremely low contrast and graceful forms make it perfect for dense academic text where the reader must never feel fatigued.",
        useCases: ["Scholarly books", "Classical literature", "Poetry", "Museum catalogues", "Philosophy journals"],
        tone: "Timeless · Refined · Intellectual",
        avoid: "UI, digital products, startup branding"
    },

    {
        name: "Spectral", cat: "Serif", sub: "Transitional", tags: ["screen", "editorial", "refined"],
        personality: "A Google Fonts original designed for screen-first reading. Six weights with optical sizing awareness. Elegant enough for editorial, sturdy enough for dense legal copy.",
        useCases: ["Legal documents", "Long-form editorial", "Digital books", "Policy writing", "Research reports"],
        tone: "Precise · Modern · Composed",
        avoid: "Children's content, casual social media"
    },

    {
        name: "Inter", cat: "Sans Serif", sub: "Neo-Grotesque", tags: ["ui", "screen", "neutral"],
        personality: "Purpose-built for computer interfaces. Every letterform was tuned for legibility at 12–16px. Effectively invisible — it gets out of the way so your content speaks. The default choice for product UI.",
        useCases: ["Product UI", "Dashboards", "Data tables", "Developer tools", "SaaS products"],
        tone: "Neutral · Functional · Modern",
        avoid: "Luxury, fashion, historical brands"
    },

    {
        name: "DM Sans", cat: "Sans Serif", sub: "Humanist", tags: ["product", "ui", "clean"],
        personality: "Humanist sans with just enough personality to feel designed without calling attention to itself. Slightly warmer than Inter. Popular in healthcare, fintech, and consumer apps.",
        useCases: ["Healthcare apps", "Fintech products", "Consumer mobile apps", "Startup landing pages", "Documentation sites"],
        tone: "Clean · Approachable · Professional",
        avoid: "Heavy editorial, fashion, print books"
    },

    {
        name: "Poppins", cat: "Sans Serif", sub: "Geometric", tags: ["geometric", "modern", "ui"],
        personality: "Circular letterforms derived from geometric perfection. Unusually uniform stroke width creates a mechanical regularity that suits tech brands and modern consumer products equally.",
        useCases: ["Tech startup branding", "E-commerce UI", "Mobile apps", "Presentation slides", "Advertising"],
        tone: "Modern · Geometric · Friendly",
        avoid: "Traditional institutions, formal publishing"
    },

    {
        name: "Raleway", cat: "Sans Serif", sub: "Geometric", tags: ["elegant", "thin", "fashion"],
        personality: "Extra-thin weights and clean geometry make Raleway a favourite for minimalist fashion and lifestyle brands. The distinctive 'W' is unmistakable. Best at display sizes.",
        useCases: ["Fashion brands", "Architecture firms", "Minimal landing pages", "Beauty products", "Portfolio sites"],
        tone: "Elegant · Minimal · Aspirational",
        avoid: "Body text, healthcare, financial services"
    },

    {
        name: "Montserrat", cat: "Sans Serif", sub: "Geometric", tags: ["bold", "modern", "branding"],
        personality: "Based on signage from the Montserrat neighbourhood of Buenos Aires. Strong geometry and wide range of weights make it versatile for everything from headlines to buttons.",
        useCases: ["Brand identity", "Marketing materials", "Landing pages", "E-commerce", "Restaurant signage"],
        tone: "Bold · Urban · Versatile",
        avoid: "Academic publishing, formal legal documents"
    },

    {
        name: "Oswald", cat: "Sans Serif", sub: "Grotesque", tags: ["condensed", "headline", "bold"],
        personality: "Condensed proportions borrow from the visual language of public signage and Victorian grotesques. Packs enormous visual impact into a narrow column, ideal for sports, news, and high-energy brands.",
        useCases: ["Sports branding", "News headlines", "Posters", "Editorial call-outs", "Event programs"],
        tone: "Punchy · Energetic · Industrial",
        avoid: "Body text, luxury, healthcare"
    },

    {
        name: "Bebas Neue", cat: "Display", sub: "Condensed Sans", tags: ["poster", "headline", "bold"],
        personality: "All-caps condensed display type that screams urgency and impact. A single weight — but that's the point. Maximum visual weight per column inch. The default of street poster culture.",
        useCases: ["Movie posters", "Sports graphics", "Event banners", "Street fashion", "Music branding"],
        tone: "Aggressive · Industrial · Bold",
        avoid: "Body text, formal institutions, healthcare"
    },

    {
        name: "Abril Fatface", cat: "Display", sub: "Display Serif", tags: ["fat", "italic", "poster"],
        personality: "Ultra-high contrast with ink-trap cuts. Inspired by 19th-century advertising types. Pairs beautifully with thin sans-serif body text for a classic editorial contrast.",
        useCases: ["Magazine covers", "Poster headlines", "Branding with historical feel", "Alcohol labels", "Record covers"],
        tone: "Bold · Vintage · Theatrical",
        avoid: "UI, healthcare, corporate reports"
    },

    {
        name: "Lobster", cat: "Display", sub: "Script", tags: ["script", "retro", "logo"],
        personality: "A connected script that manages to feel casual and designed at the same time. Overused in food branding circa 2012 — but still perfectly placed for retro diners, breweries, and handcrafted goods.",
        useCases: ["Restaurant logos", "Craft food packaging", "Social media headers", "Greeting cards", "Vintage-style signage"],
        tone: "Casual · Retro · Handcrafted",
        avoid: "Financial, healthcare, tech, formal settings"
    },

    {
        name: "IBM Plex Mono", cat: "Monospace", sub: "Humanist Mono", tags: ["code", "tech", "readable"],
        personality: "IBM's corporate monospace with humanist touches. Slightly warmer than pure technical monospaces. The professional choice for developer tools, code documentation, and tech editorial.",
        useCases: ["Code editors", "Technical documentation", "Developer blogs", "Terminal UIs", "Data journalism"],
        tone: "Technical · Precise · Professional",
        avoid: "Consumer brands, lifestyle content, children's"
    },

    {
        name: "Fira Code", cat: "Monospace", sub: "Technical Mono", tags: ["code", "ligatures", "developer"],
        personality: "Built for programming with ligatures for common code patterns. The → and != render as unified shapes. Beloved by developers who see code as a reading experience worth optimising.",
        useCases: ["Code editors", "Developer tools", "Technical presentations", "API documentation", "Coding tutorials"],
        tone: "Developer-native · Modern · Functional",
        avoid: "Non-technical contexts entirely"
    },

    {
        name: "Dancing Script", cat: "Handwriting", sub: "Formal Script", tags: ["script", "elegant", "wedding"],
        personality: "Flowing connected letterforms based on casual handwriting. Bouncy baseline creates energy. The default for wedding invitations, greeting cards, and feminine lifestyle brands.",
        useCases: ["Wedding stationery", "Beauty brands", "Bakery packaging", "Greeting cards", "Floral branding"],
        tone: "Romantic · Feminine · Celebratory",
        avoid: "Corporate, financial, tech, healthcare"
    },

    {
        name: "Caveat", cat: "Handwriting", sub: "Casual", tags: ["handwritten", "notes", "informal"],
        personality: "Genuinely handwritten feel — uneven baselines and variable stroke width give it authenticity that polished scripts lack. Excellent for annotation, teacher notes, and anything meant to feel personal.",
        useCases: ["Annotation layers", "Educational materials", "Hand-drawn illustrations", "Personal blogs", "Sticky note UIs"],
        tone: "Personal · Authentic · Informal",
        avoid: "Formal institutions, financial, legal"
    },

    {
        name: "Nunito", cat: "Sans Serif", sub: "Humanist", tags: ["rounded", "friendly", "app"],
        personality: "Rounded terminals on every stroke create a bubble of approachability. The friendliest sans-serif in common use. Perfectly calibrated for children's education, consumer health, and onboarding flows.",
        useCases: ["Children's education apps", "Consumer health", "Onboarding UIs", "Food delivery apps", "Wellness brands"],
        tone: "Friendly · Rounded · Playful",
        avoid: "Luxury, finance, serious journalism"
    },

    {
        name: "Lato", cat: "Sans Serif", sub: "Humanist", tags: ["neutral", "corporate", "warm"],
        personality: "Slightly warm undertones distinguish Lato from colder neo-grotesques. Designed for a Polish government — which tells you everything about its intended register: formal but not cold, institutional but not hostile.",
        useCases: ["Government websites", "Corporate communications", "HR systems", "Healthcare portals", "Reports"],
        tone: "Professional · Warm · Institutional",
        avoid: "Fashion, luxury, entertainment"
    },

    {
        name: "Space Mono", cat: "Monospace", sub: "Technical Mono", tags: ["retro", "tech", "display"],
        personality: "Wide proportions and retro-futurist aesthetic. Feels like a terminal from a 1970s science fiction film. Perfect for tech brands that want personality, sci-fi editorial, and crypto/web3 projects.",
        useCases: ["Crypto/Web3 brands", "Sci-fi editorial", "Tech art projects", "Hackathon sites", "Developer portfolios"],
        tone: "Retro-futurist · Quirky · Tech",
        avoid: "Healthcare, traditional corporate, children's"
    },

    {
        name: "Bitter", cat: "Serif", sub: "Slab Serif", tags: ["screen", "bold", "news"],
        personality: "Slab serifs optimised for screen reading. The thick, even serifs hold definition at small sizes on low-res displays. A practical workhorse for news and content-dense digital products.",
        useCases: ["News websites", "Blog platforms", "Kindle-style reading apps", "Content management", "Digital magazines"],
        tone: "Sturdy · Editorial · Readable",
        avoid: "Luxury, fashion, minimal design systems"
    },

    {
        name: "Work Sans", cat: "Sans Serif", sub: "Grotesque", tags: ["print", "medium", "clean"],
        personality: "Optimised for medium-sized print use: brochures, presentations, corporate collateral. Slightly condensed proportions allow more characters per line than many grotesques.",
        useCases: ["Presentations", "Brochures", "Annual reports", "Corporate identity", "Professional services"],
        tone: "Corporate · Clean · Efficient",
        avoid: "Consumer entertainment, casual brands"
    },
];

const CATEGORIES = ["All", "Serif", "Sans Serif", "Display", "Monospace", "Handwriting"];

const LC = {
    ascender: "#6B3FA0",
    capHeight: "#1F6B40",
    xHeight: "#1A4FA0",
    baseline: "#A03030",
    descender: "#A07020",
};

const LINE_META = [
    {
        key: "ascender", short: "Ascender", label: "Ascender line",
        tip: "Top of tall lowercase letters (b, d, h, k, l, f). Long ascenders create elegant, airy text; short ones allow tighter line-spacing."
    },
    {
        key: "capHeight", short: "Cap height", label: "Cap height",
        tip: "Top of flat capital letters like H and I. Always slightly shorter than ascenders for optical balance. Determines how heavy a full-caps setting will feel."
    },
    {
        key: "xHeight", short: "X-height", label: "X-height",
        tip: "Height of the lowercase x — the most critical readability metric. Fonts with x-height above 72% of cap height are significantly more legible at small sizes."
    },
    {
        key: "baseline", short: "Baseline", label: "Baseline",
        tip: "The invisible line all characters sit on. Every other metric is measured relative to this anchor. Curved glyphs dip slightly below (overshoot) for optical alignment."
    },
    {
        key: "descender", short: "Descender", label: "Descender line",
        tip: "Bottom of lowercase letters with tails (g, j, p, q, y). Deep descenders add elegance but require more line-height. Minimal descenders allow tight leading."
    },
];

// ─── FONT MEASURE ─────────────────────────────────────────────────────────────
function measureFont(name, size, canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `400 ${size}px "${name}"`;
    return {
        capHeight: ctx.measureText("H").actualBoundingBoxAscent,
        xHeight: ctx.measureText("x").actualBoundingBoxAscent,
        ascender: ctx.measureText("hbdfkl").actualBoundingBoxAscent,
        descender: ctx.measureText("pqgjy").actualBoundingBoxDescent,
        size,
    };
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=IBM+Plex+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,600;0,900;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;overflow:hidden;}

body{
  background:#F5F0E8;
  color:${C.c1};
  font-family:'DM Sans',sans-serif;
}

body::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(ellipse 60% 50% at 10% 5%,  rgba(180,140,100,0.10) 0%,transparent 60%),
    radial-gradient(ellipse 50% 40% at 90% 90%,  rgba(150,110,70,0.08)  0%,transparent 55%),
    radial-gradient(ellipse 80% 60% at 50% 50%,  rgba(240,230,210,0.20) 0%,transparent 70%);
}

::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(90,50,20,0.18);border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:rgba(90,50,20,0.30);}

input[type=range]{
  -webkit-appearance:none;appearance:none;
  height:2px;background:${C.w3};border-radius:2px;outline:none;cursor:pointer;width:100%;border:none;
}
input[type=range]::-webkit-slider-thumb{
  -webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;
  background:${C.c2};cursor:pointer;
  box-shadow:0 1px 5px rgba(44,26,14,0.25),0 0 0 3px rgba(255,255,255,0.8);
  transition:box-shadow 0.15s;
}
input[type=range]::-webkit-slider-thumb:hover{
  box-shadow:0 2px 10px rgba(44,26,14,0.35),0 0 0 3px rgba(255,255,255,0.9);
}
input[type=range]::-moz-range-thumb{
  width:14px;height:14px;border-radius:50%;background:${C.c2};border:none;
  box-shadow:0 1px 5px rgba(44,26,14,0.25);
}

input[type=text],input[type=search]{
  background:rgba(255,252,248,0.85);
  border:1px solid ${C.w3};
  color:${C.c1};font-family:'DM Sans',sans-serif;
  font-size:13px;padding:7px 11px;border-radius:8px;outline:none;width:100%;
  transition:border-color 0.15s,box-shadow 0.15s;
}
input[type=text]:focus,input[type=search]:focus{
  border-color:${C.c4};
  box-shadow:0 0 0 3px rgba(90,53,32,0.10);
}
input::placeholder{color:${C.c6};}

.panel{
  background:rgba(255,252,248,0.78);
  backdrop-filter:saturate(180%) blur(18px);
  -webkit-backdrop-filter:saturate(180%) blur(18px);
  border:1px solid rgba(200,185,165,0.55);
}
.panel-solid{
  background:rgba(255,252,248,0.92);
  border:1px solid rgba(200,185,165,0.50);
}

.font-row{
  padding:9px 14px;cursor:pointer;
  border-bottom:1px solid rgba(200,185,165,0.25);
  border-left:3px solid transparent;
  transition:background 0.1s,border-color 0.12s;
}
.font-row:hover{background:rgba(255,252,248,0.70);}
.font-row.active{
  background:rgba(255,252,248,0.92);
  border-left-color:${C.c3};
}

.pill{
  font-family:'DM Sans',sans-serif;font-size:11px;
  padding:4px 11px;border-radius:20px;cursor:pointer;
  border:1px solid ${C.w3};background:transparent;color:${C.c4};
  transition:all 0.13s;letter-spacing:0.02em;
}
.pill:hover{background:rgba(255,252,248,0.8);color:${C.c2};}
.pill.on{
  background:${C.c2};border-color:${C.c2};color:${C.w0};
  box-shadow:0 2px 8px rgba(61,36,16,0.22);
}

.ctrl-btn{
  font-family:'DM Sans',sans-serif;font-size:11.5px;
  padding:5px 11px;border-radius:6px;cursor:pointer;
  border:1px solid ${C.w3};background:rgba(255,252,248,0.7);color:${C.c4};
  transition:all 0.13s;
}
.ctrl-btn:hover{background:rgba(255,252,248,0.95);color:${C.c2};border-color:${C.w4};}
.ctrl-btn.on{
  background:rgba(61,36,16,0.08);
  border-color:rgba(61,36,16,0.30);
  color:${C.c2};
}

.line-chip{
  display:flex;align-items:center;gap:6px;
  padding:5px 11px;border-radius:6px;cursor:pointer;
  border:1px solid rgba(200,185,165,0.4);
  background:rgba(255,252,248,0.65);
  transition:all 0.14s;user-select:none;
  position:relative;
}
.line-chip:hover{background:rgba(255,252,248,0.92);border-color:rgba(150,120,90,0.4);}
.line-chip.active{background:rgba(255,252,248,0.95);border-color:rgba(150,120,90,0.55);}

.tooltip{
  position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);
  background:${C.c1};color:${C.w1};font-size:11.5px;line-height:1.55;
  padding:9px 12px;border-radius:8px;width:240px;pointer-events:none;z-index:999;
  box-shadow:0 4px 20px rgba(0,0,0,0.25);
  font-family:'DM Sans',sans-serif;
}
.tooltip::after{
  content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);
  border:5px solid transparent;border-top-color:${C.c1};
}

@keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseOp{0%,100%{opacity:0.5}50%{opacity:1}}
.fade-up{animation:fadeUp 0.28s cubic-bezier(0.16,1,0.3,1) forwards;}
.reco-panel{animation:slideUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards;}
.pulse{animation:pulseOp 1.5s ease infinite;}
`;

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Mono = ({ children, color = C.c5, size = 11 }) => (
    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: size, color: color }}>
        {children}
    </span>
);

const SecLabel = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
        <div style={{ width: 12, height: 1.5, background: C.w4, borderRadius: 1 }} />
        <span style={{
            fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c5,
            letterSpacing: "0.15em", textTransform: "uppercase"
        }}>{children}</span>
    </div>
);

function MetricCard({ label, value, sub, color }) {
    return (
        <div style={{
            background: "rgba(255,252,248,0.85)",
            border: `1px solid rgba(200,185,165,0.45)`,
            borderLeft: `3px solid ${color}`,
            borderRadius: 9, padding: "8px 12px",
        }}>
            <div style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.c6,
                letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: 3
            }}>{label}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 19, fontWeight: 500, color: C.c1, lineHeight: 1 }}>{value}</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.c5 }}>{sub}</span>
            </div>
        </div>
    );
}

function RatioBar({ label, pct, fillColor, displayVal, note }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <Mono>{label}</Mono>
                <Mono color={C.c2} size={12}>{displayVal}</Mono>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: C.w3, overflow: "hidden" }}>
                <div style={{
                    height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 2,
                    background: `linear-gradient(90deg,${fillColor}66,${fillColor})`,
                    transition: "width 0.45s cubic-bezier(0.16,1,0.3,1)"
                }} />
            </div>
            {note && <div style={{ fontSize: 10.5, color: C.c5, marginTop: 3.5, lineHeight: 1.5 }}>{note}</div>}
        </div>
    );
}

// ─── LINE CHIP WITH TOOLTIP ───────────────────────────────────────────────────
function LineChip({ meta, active, onEnter, onLeave }) {
    const [tip, setTip] = useState(false);
    return (
        <div
            className={`line-chip${active ? " active" : ""}`}
            onMouseEnter={() => { setTip(true); onEnter && onEnter(); }}
            onMouseLeave={() => { setTip(false); onLeave && onLeave(); }}
        >
            <div style={{
                width: 16, height: meta.key === "baseline" ? 2 : 1.5, background: LC[meta.key],
                borderRadius: 1, opacity: active ? 1 : 0.65,
                boxShadow: active ? `0 0 5px ${LC[meta.key]}66` : "none"
            }} />
            <span style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                color: active ? C.c1 : C.c4, fontWeight: active ? 500 : 400
            }}>{meta.short}</span>
            {tip && (
                <div className="tooltip">
                    <div style={{ fontWeight: 500, marginBottom: 4, color: C.w1 }}>{meta.label}</div>
                    {meta.tip}
                </div>
            )}
        </div>
    );
}

// ─── USE CASE PANEL ───────────────────────────────────────────────────────────
function UseCasePanel({ font }) {
    if (!font) return null;
    const data = FONT_LIBRARY.find(f => f.name === font.name);
    if (!data?.personality) return null;
    return (
        <div className="fade-up">
            <div style={{
                marginBottom: 10, padding: "10px 13px", borderRadius: 9,
                background: "rgba(255,252,248,0.9)", border: `1px solid rgba(200,185,165,0.45)`
            }}>
                <div style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c5,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7
                }}>Personality</div>
                <p style={{ fontSize: 12.5, color: C.c3, lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif" }}>
                    {data.personality}
                </p>
            </div>

            <div style={{
                marginBottom: 10, padding: "10px 13px", borderRadius: 9,
                background: "rgba(255,252,248,0.9)", border: `1px solid rgba(200,185,165,0.45)`
            }}>
                <div style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c5,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7
                }}>Tone</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.c2 }}>
                    {data.tone}
                </div>
            </div>

            <div style={{
                marginBottom: 10, padding: "10px 13px", borderRadius: 9,
                background: "rgba(255,252,248,0.9)", border: `1px solid rgba(200,185,165,0.45)`
            }}>
                <div style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c5,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8
                }}>Use cases</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {data.useCases.map(u => (
                        <span key={u} style={{
                            fontSize: 11, padding: "3px 9px", borderRadius: 20,
                            background: `rgba(61,36,16,0.07)`, border: `1px solid rgba(61,36,16,0.14)`,
                            color: C.c3, fontFamily: "'DM Sans',sans-serif"
                        }}>{u}</span>
                    ))}
                </div>
            </div>

            <div style={{
                padding: "9px 13px", borderRadius: 9,
                background: "rgba(200,185,165,0.12)", border: `1px solid rgba(200,185,165,0.35)`
            }}>
                <div style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c5,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5
                }}>Avoid using for</div>
                <div style={{ fontSize: 11.5, color: C.c4, fontFamily: "'DM Sans',sans-serif", fontStyle: "italic" }}>
                    {data.avoid}
                </div>
            </div>
        </div>
    );
}

// ─── CANVAS with DRAGGABLE LINES ──────────────────────────────────────────────
function AnatomyCanvas({
    font, fontSize, bgDark, specimen, showLines, showGrid,
    metrics, activeKey, onLineDrag, draggedPositions, compare, cmpFont, cmpMetrics,
}) {
    const ref = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(820);
    const dragging = useRef(null);
    const height = metrics ? Math.max(280, metrics.ascender + metrics.descender + 120) : 280;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                setCanvasWidth(Math.floor(entry.contentRect.width));
            }
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Compute line Y positions from metrics + user overrides
    const getLineY = useCallback((m, H) => {
        if (!m) return {};
        const baseY = (H - m.ascender - m.descender) / 2 + m.ascender;
        return {
            ascender: draggedPositions.ascender ?? (baseY - m.ascender),
            capHeight: draggedPositions.capHeight ?? (baseY - m.capHeight),
            xHeight: draggedPositions.xHeight ?? (baseY - m.xHeight),
            baseline: draggedPositions.baseline ?? baseY,
            descender: draggedPositions.descender ?? (baseY + m.descender),
        };
    }, [draggedPositions]);

    // Draw
    useEffect(() => {
        const cv = ref.current;
        if (!cv || !metrics || canvasWidth === 0) return;
        const ctx = cv.getContext("2d");
        const W = canvasWidth, H = cv.height;
        ctx.clearRect(0, 0, W, H);

        // bg
        ctx.fillStyle = bgDark ? "#1A1008" : "#FDFAF5";
        ctx.fillRect(0, 0, W, H);
        if (!bgDark) {
            // warm paper vignette
            const vg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.65);
            vg.addColorStop(0, "rgba(255,248,230,0.3)"); vg.addColorStop(1, "rgba(220,200,170,0.05)");
            ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
        }

        // dot grid
        if (showGrid) {
            ctx.fillStyle = bgDark ? "rgba(255,230,180,0.25)" : "rgba(90,50,20,0.18)";
            for (let x = 22; x < W; x += 26) for (let y = 22; y < H; y += 26) {
                ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
            }
        }

        const ly = getLineY(metrics, H);

        // zone fills
        if (showLines) {
            const zones = [
                ["ascender", "capHeight", bgDark ? "rgba(107,63,160,0.20)" : "rgba(107,63,160,0.12)"],
                ["capHeight", "xHeight", bgDark ? "rgba(31,107,64,0.20)" : "rgba(31,107,64,0.12)"],
                ["xHeight", "baseline", bgDark ? "rgba(26,79,160,0.25)" : "rgba(26,79,160,0.15)"],
                ["baseline", "descender", bgDark ? "rgba(160,112,32,0.20)" : "rgba(160,112,32,0.12)"],
            ];
            zones.forEach(([a, b, col]) => {
                const y1 = ly[a], y2 = ly[b];
                if (y1 < y2) { ctx.fillStyle = col; ctx.fillRect(0, y1, W, y2 - y1); }
            });
        }

        // glyph
        const baseY = ly.baseline;
        ctx.font = `400 ${fontSize}px "${font.name}"`;
        ctx.textBaseline = "alphabetic";
        const tmW = ctx.measureText(specimen).width;
        const textX = compare ? 36 : (W - tmW) / 2;

        if (bgDark) {
            ctx.shadowColor = "rgba(255,200,100,0.5)";
            ctx.shadowBlur = 30;
        }
        ctx.fillStyle = bgDark ? "#F8F5F0" : "#1E0F06";
        ctx.fillText(specimen, textX, baseY);
        ctx.shadowBlur = 0;

        if (compare && cmpFont && cmpMetrics) {
            const baseY2 = (H - cmpMetrics.ascender - cmpMetrics.descender) / 2 + cmpMetrics.ascender;
            ctx.font = `400 ${fontSize}px "${cmpFont.name}"`;
            ctx.fillStyle = bgDark ? "rgba(255,248,240,0.9)" : C.c4;
            ctx.fillText(specimen, textX + tmW + 48, baseY2);
        }

        // reference lines
        if (showLines) {
            LINE_META.forEach(({ key }) => {
                const y = ly[key], col = LC[key], isBase = key === "baseline", isAct = activeKey === key;
                const lineColor = bgDark ? "#F8F5F0" : col;  // Warm white in dark mode
                const glowColor = bgDark ? "rgba(255,248,240,0.8)" : col;
                ctx.save();
                ctx.setLineDash(isBase ? [] : [7, 5]);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = isAct ? 2.8 : (isBase ? 2.2 : 1.5);
                ctx.globalAlpha = isAct ? 1 : (isBase ? 0.9 : 0.8);
                if (isAct || bgDark) { ctx.shadowColor = glowColor; ctx.shadowBlur = isAct ? 12 : 6; }
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
                ctx.shadowBlur = 0; ctx.restore();

                // tick marks
                ctx.save();
                ctx.strokeStyle = lineColor; ctx.lineWidth = isAct ? 2.5 : 1.8; ctx.globalAlpha = isAct ? 1 : 0.8;
                if (bgDark) ctx.shadowColor = glowColor, ctx.shadowBlur = 4;
                [10, W - 10].forEach(tx => { ctx.beginPath(); ctx.moveTo(tx, y - 7); ctx.lineTo(tx, y + 7); ctx.stroke(); });
                ctx.shadowBlur = 0; ctx.restore();

                // drag handle — circle on left side
                ctx.save();
                ctx.fillStyle = bgDark ? "rgba(255,252,248,0.95)" : "rgba(255,252,248,0.98)";
                ctx.strokeStyle = lineColor; ctx.lineWidth = isAct ? 3 : 2.2; ctx.globalAlpha = 1;
                if (bgDark) ctx.shadowColor = glowColor, ctx.shadowBlur = 6;
                ctx.beginPath(); ctx.arc(24, y, isAct ? 8 : 7, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                ctx.shadowBlur = 0; ctx.restore();

                // line label
                ctx.save();
                ctx.font = `${isAct ? "500" : "400"} 11px "IBM Plex Mono",monospace`;
                ctx.fillStyle = lineColor; ctx.globalAlpha = isAct ? 1 : 0.85;
                if (bgDark) ctx.shadowColor = "rgba(0,0,0,0.5)", ctx.shadowBlur = 4;
                ctx.textBaseline = "bottom"; ctx.textAlign = "right";
                ctx.fillText(LINE_META.find(l => l.key === key)?.short, W - 14, y - 6);
                ctx.shadowBlur = 0; ctx.restore();
            });
        }
    }, [font, fontSize, bgDark, specimen, showLines, showGrid, metrics, activeKey, draggedPositions, compare, cmpFont, cmpMetrics, getLineY, canvasWidth]);

    // Drag interaction
    const getHitLine = useCallback((y, H) => {
        if (!metrics) return null;
        const ly = getLineY(metrics, H);
        for (const k of Object.keys(ly)) {
            if (Math.abs(y - ly[k]) < 12) return k;
        }
        return null;
    }, [metrics, getLineY]);

    const onMouseDown = useCallback(e => {
        const cv = ref.current;
        if (!cv || !metrics) return;
        const rect = cv.getBoundingClientRect();
        const scaleY = cv.height / rect.height;
        const y = (e.clientY - rect.top) * scaleY;
        const hit = getHitLine(y, cv.height);
        if (hit) { dragging.current = hit; e.preventDefault(); }
    }, [metrics, getHitLine]);

    const onMouseMove = useCallback(e => {
        if (!dragging.current || !ref.current) return;
        const cv = ref.current;
        const rect = cv.getBoundingClientRect();
        const scaleY = cv.height / rect.height;
        const y = (e.clientY - rect.top) * scaleY;
        onLineDrag(dragging.current, Math.max(10, Math.min(cv.height - 10, y)));
    }, [onLineDrag]);

    const onMouseUp = useCallback(() => { dragging.current = null; }, []);

    // cursor based on proximity
    const [cursor, setCursor] = useState("default");
    const onMouseMoveForCursor = useCallback(e => {
        if (!ref.current || !metrics) return;
        const cv = ref.current;
        const rect = cv.getBoundingClientRect();
        const scaleY = cv.height / rect.height;
        const y = (e.clientY - rect.top) * scaleY;
        const hit = getHitLine(y, cv.height);
        setCursor(hit ? "ns-resize" : "default");
        if (dragging.current) onMouseMove(e);
    }, [metrics, getHitLine, onMouseMove]);

    return (
        <div ref={containerRef} style={{ width: "100%" }}>
            <canvas ref={ref} width={canvasWidth} height={height}
                style={{ width: "100%", height, display: "block", cursor }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMoveForCursor}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            />
        </div>
    );
}

// ─── FONT ROW ─────────────────────────────────────────────────────────────────
function FontRow({ font, active, isCmp, onSelect, onCompare, loaded }) {
    return (
        <div className={`font-row${active ? " active" : ""}`} onClick={() => onSelect(font)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                <span style={{
                    fontFamily: loaded ? `"${font.name}",sans-serif` : "'DM Sans',sans-serif",
                    fontSize: 14, color: active ? C.c1 : C.c2, letterSpacing: "-0.01em", lineHeight: 1.25, flex: 1,
                }}>{font.name}</span>
                <button
                    onClick={e => { e.stopPropagation(); onCompare(font); }}
                    style={{
                        fontSize: 9.5, padding: "2px 7px", cursor: "pointer", flexShrink: 0, borderRadius: 4,
                        fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.03em", transition: "all 0.12s",
                        border: `1px solid ${isCmp ? "rgba(61,36,16,0.40)" : "rgba(200,185,165,0.5)"}`,
                        background: isCmp ? "rgba(61,36,16,0.08)" : "transparent",
                        color: isCmp ? C.c2 : C.c6,
                    }}
                >{isCmp ? "✓ vs" : "vs"}</button>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c6, marginTop: 3 }}>
                {font.sub}
            </div>
        </div>
    );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
    const [cat, setCat] = useState("All");
    const [search, setSearch] = useState("");
    const [sel, setSel] = useState<any>(FONT_LIBRARY[0]);
    const [cmp, setCmp] = useState<any>(null);
    const [fontSize, setFontSize] = useState(110);
    const [bgDark, setBgDark] = useState(false);
    const [specimen, setSpecimen] = useState("Hxpg");
    const [showLines, setShowLines] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [rightTab, setRightTab] = useState("metrics"); // "metrics" | "usecase"
    const [loaded, setLoaded] = useState<Set<string>>(new Set());
    const [metrics, setMetrics] = useState<any>(null);
    const [cmpM, setCmpM] = useState<any>(null);
    const [measuring, setMeasuring] = useState(false);
    // user-dragged line overrides { ascender: y, capHeight: y, ... }
    const [dragPos, setDragPos] = useState<Record<string, number>>({});
    const mcv = useRef<HTMLCanvasElement>(null);

    const loadFont = useCallback((name) => {
        if (loaded.has(name)) return Promise.resolve();
        const id = `gf-${name.replace(/\s+/g, "-")}`;
        if (document.getElementById(id)) return Promise.resolve();
        return new Promise<void>(res => {
            const lk = document.createElement("link");
            lk.id = id; lk.rel = "stylesheet";
            lk.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;700&display=swap`;
            lk.onload = () => {
                document.fonts.load(`400 48px "${name}"`).then(() => {
                    setLoaded(p => new Set([...p, name])); res();
                }).catch(() => res());
            };
            document.head.appendChild(lk);
        });
    }, [loaded]);

    const doMeasure = useCallback(async (font, size) => {
        await loadFont(font.name);
        await new Promise(r => setTimeout(r, 180));
        return mcv.current ? measureFont(font.name, size, mcv.current) : null;
    }, [loadFont]);

    useEffect(() => {
        setMeasuring(true);
        setDragPos({});
        doMeasure(sel, fontSize).then(m => { setMetrics(m); setMeasuring(false); });
    }, [sel, fontSize, doMeasure]);

    useEffect(() => {
        if (!cmp) { setCmpM(null); return; }
        doMeasure(cmp, fontSize).then(setCmpM);
    }, [cmp, fontSize, doMeasure]);

    const handleLineDrag = useCallback((key, y) => {
        setDragPos(p => ({ ...p, [key]: y }));
    }, []);

    const resetDrag = () => setDragPos({});

    // ── FONT METRICS CACHE — pre-measure all fonts in background ──────────────
    const fontMetricsCache = useRef<Record<string, any>>({});
    const [cacheReady, setCacheReady] = useState(false);
    const [cacheProgress, setCacheProgress] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const MSIZES = 120;
        async function runQueue() {
            for (let i = 0; i < FONT_LIBRARY.length; i++) {
                if (cancelled) return;
                const f = FONT_LIBRARY[i];
                if (fontMetricsCache.current[f.name]) continue;
                try {
                    const m = await doMeasure(f, MSIZES);
                    if (m && m.capHeight > 0) {
                        fontMetricsCache.current[f.name] = {
                            xRatio: m.xHeight / m.capHeight,
                            ascRatio: m.ascender / m.capHeight,
                            desRatio: m.descender / m.capHeight,
                            raw: m,
                        };
                    }
                } catch (_) { }
                setCacheProgress(Math.round(((i + 1) / FONT_LIBRARY.length) * 100));
            }
            if (!cancelled) setCacheReady(true);
        }
        runQueue();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── RECOMMENDATIONS — score every cached font against dragged ratios ──────
    const recommendations = useMemo(() => {
        if (!metrics || Object.keys(dragPos).length === 0) return [];

        // Reconstruct the natural baseline Y from metrics (canvas height formula)
        const H = Math.max(280, metrics.ascender + metrics.descender + 120);
        const naturalBase = (H - metrics.ascender - metrics.descender) / 2 + metrics.ascender;

        const baselineY = dragPos["baseline"] ?? naturalBase;
        const xHeightY = dragPos["xHeight"] ?? (naturalBase - metrics.xHeight);
        const capY = dragPos["capHeight"] ?? (naturalBase - metrics.capHeight);
        const ascY = dragPos["ascender"] ?? (naturalBase - metrics.ascender);
        const desY = dragPos["descender"] ?? (naturalBase + metrics.descender);

        const targetCapH = Math.max(baselineY - capY, 1);
        const targetXR = (baselineY - xHeightY) / targetCapH;
        const targetAscR = (baselineY - ascY) / targetCapH;
        const targetDesR = (desY - baselineY) / targetCapH;

        const cache = fontMetricsCache.current;
        return FONT_LIBRARY
            .filter(f => cache[f.name] && f.name !== sel.name)
            .map(f => {
                const c = cache[f.name];
                // x-height ratio is the most perceptually important metric — weight it 2x
                const dX = Math.abs(c.xRatio - targetXR);
                const dAsc = Math.abs(c.ascRatio - targetAscR);
                const dDes = Math.abs(c.desRatio - targetDesR);
                const score = dX * 2 + dAsc * 0.8 + dDes * 0.6;
                const matchPct = Math.max(0, Math.round((1 - Math.min(score / 0.8, 1)) * 100));
                return {
                    font: f,
                    score,
                    matchPct,
                    xRatio: c.xRatio,
                    ascRatio: c.ascRatio,
                    desRatio: c.desRatio,
                    dX, dAsc, dDes,
                    targetXR, targetAscR, targetDesR,
                };
            })
            .sort((a, b) => a.score - b.score)
            .slice(0, 6);
    }, [dragPos, metrics, sel.name]);

    const handlePickRecommendation = useCallback((font) => {
        setSel(font);
        loadFont(font.name);
        setDragPos({});
    }, [loadFont]);

    const filtered = useMemo(() => FONT_LIBRARY.filter(f => {
        const mc = cat === "All" || f.cat === cat;
        const q = search.toLowerCase();
        return mc && (!q || f.name.toLowerCase().includes(q) || f.sub.toLowerCase().includes(q) || f.tags.some(t => t.includes(q)));
    }), [cat, search]);

    const xRatio = metrics ? metrics.xHeight / metrics.capHeight : null;
    const emCov = metrics ? (metrics.ascender + metrics.descender) / fontSize : null;
    const extR = metrics ? (metrics.ascender - metrics.capHeight) / metrics.capHeight : null;
    const xLabel = xRatio ? (xRatio > 0.72 ? "High — very legible at small sizes" : xRatio > 0.62 ? "Medium — balanced classical" : "Low — elegant, for display") : "—";

    const PRESETS = [["Hxpg", "Anatomy"], ["Aa", "A/a"], ["0123", "Digits"], ["fi fl", "Ligatures"], ["Sphinx", "Word"], ["ABCDE", "Caps"]];

    const hasDragOverride = Object.keys(dragPos).length > 0;

    return (
        <>
            <style>{CSS}</style>
            <canvas ref={mcv} width={1400} height={700}
                style={{ position: "absolute", left: "-9999px", top: "-9999px", visibility: "hidden" }} />

            <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "relative", zIndex: 1 }}>

                {/* HEADER */}
                <header className="panel" style={{
                    borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none",
                    padding: "10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexShrink: 0, zIndex: 20,
                    boxShadow: "0 1px 14px rgba(44,26,14,0.07), 0 1px 0 rgba(200,185,165,0.45)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg,rgba(92,53,32,0.12),rgba(122,74,46,0.08))",
                            border: `1px solid rgba(92,53,32,0.18)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: C.c3,
                        }}>Aa</div>
                        <div>
                            <div style={{
                                fontFamily: "'Playfair Display',serif", fontSize: 15.5, fontWeight: 700,
                                color: C.c1, letterSpacing: "-0.02em", lineHeight: 1
                            }}>
                                Font Anatomy Explorer
                            </div>
                            <Mono size={9} color={C.c6}>TYPOGRAPHY LAB · {FONT_LIBRARY.length} GOOGLE FONTS · DRAG LINES TO EXPLORE</Mono>
                        </div>
                    </div>

                    {/* live metric chips */}
                    <div style={{ display: "flex", gap: 7 }}>
                        {metrics && [
                            { l: "x-height", v: `${Math.round(metrics.xHeight)}px`, c: LC.xHeight },
                            { l: "cap", v: `${Math.round(metrics.capHeight)}px`, c: LC.capHeight },
                            { l: "ascender", v: `${Math.round(metrics.ascender)}px`, c: LC.ascender },
                            { l: "descender", v: `${Math.round(metrics.descender)}px`, c: LC.descender },
                        ].map(({ l, v, c }) => (
                            <div key={l} style={{
                                padding: "3px 11px", borderRadius: 20,
                                background: "rgba(255,252,248,0.85)",
                                border: `1px solid ${c}44`,
                            }}>
                                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: c, marginRight: 5 }}>{l}</span>
                                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, fontWeight: 500, color: C.c1 }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {measuring && (
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <div className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: C.c4 }} />
                                <Mono color={C.c6}>measuring…</Mono>
                            </div>
                        )}
                        <div style={{
                            padding: "5px 13px", borderRadius: 8,
                            background: "rgba(255,252,248,0.85)",
                            border: `1px solid rgba(92,53,32,0.18)`,
                        }}>
                            <span style={{ fontFamily: `"${sel.name}",sans-serif`, fontSize: 14, color: C.c1, letterSpacing: "-0.01em" }}>
                                {sel.name}
                            </span>
                            <Mono color={C.c6} size={10}> · {sel.sub}</Mono>
                        </div>
                    </div>
                </header>

                {/* 3-COL */}
                <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                    {/* LEFT: font list */}
                    <aside className="panel-solid" style={{
                        width: 238, borderRadius: 0, borderTop: "none", borderBottom: "none", borderLeft: "none",
                        display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", zIndex: 10,
                        boxShadow: "1px 0 14px rgba(44,26,14,0.06)",
                    }}>
                        <div style={{ padding: "12px 11px 9px", borderBottom: `1px solid rgba(200,185,165,0.3)`, flexShrink: 0 }}>
                            <input type="search" placeholder="Name, style, or tag…" value={search} onChange={e => setSearch(e.target.value)} />
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                                {CATEGORIES.map(c => (
                                    <button key={c} className={`pill${cat === c ? " on" : ""}`} onClick={() => setCat(c)}>{c}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ overflowY: "auto", flex: 1 }}>
                            {filtered.length === 0 && <div style={{ padding: 18, fontSize: 12, color: C.c6, fontStyle: "italic" }}>No fonts match.</div>}
                            {filtered.map(f => (
                                <FontRow key={f.name} font={f} active={sel.name === f.name} isCmp={cmp?.name === f.name}
                                    onSelect={f => { setSel(f); loadFont(f.name); }} onCompare={f => setCmp(p => p?.name === f.name ? null : f)}
                                    loaded={loaded.has(f.name)} />
                            ))}
                        </div>
                        <div style={{ padding: "6px 13px", borderTop: `1px solid rgba(200,185,165,0.25)`, flexShrink: 0 }}>
                            <Mono color={C.c6}>{filtered.length} / {FONT_LIBRARY.length}</Mono>
                        </div>
                    </aside>

                    {/* CENTER: canvas stage */}
                    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0, background: "transparent" }}>
                        {/* toolbar */}
                        <div className="panel" style={{
                            borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none",
                            padding: "8px 18px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                            flexShrink: 0, zIndex: 8, boxShadow: "0 1px 10px rgba(44,26,14,0.05)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <Mono color={C.c6}>text</Mono>
                                <input type="text" value={specimen} onChange={e => setSpecimen(e.target.value.slice(0, 10))}
                                    style={{ width: 68, padding: "4px 8px", fontSize: 13 }} />
                            </div>
                            <div style={{ width: 1, height: 18, background: C.w3 }} />
                            <div style={{ display: "flex", gap: 3 }}>
                                {PRESETS.map(([v, l]) => (
                                    <button key={v} className={`ctrl-btn${specimen === v ? " on" : ""}`} onClick={() => setSpecimen(v)}
                                        style={{ padding: "3px 9px", fontSize: 11 }}>{l}</button>
                                ))}
                            </div>
                            <div style={{ width: 1, height: 18, background: C.w3 }} />
                            <button className={`ctrl-btn${bgDark ? " on" : ""}`} onClick={() => setBgDark(!bgDark)}>
                                {bgDark ? "◑ Dark bg" : "◐ Light bg"}
                            </button>
                            <button className={`ctrl-btn${showLines ? " on" : ""}`} onClick={() => setShowLines(!showLines)}>
                                {showLines ? "Lines on" : "Lines off"}
                            </button>
                            <button className={`ctrl-btn${showGrid ? " on" : ""}`} onClick={() => setShowGrid(!showGrid)}>Grid</button>
                            {cmp && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 7, padding: "4px 10px",
                                    background: "rgba(92,53,32,0.07)", border: "1px solid rgba(92,53,32,0.20)", borderRadius: 7
                                }}>
                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.c4 }} />
                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.c3 }}>vs {cmp.name}</span>
                                    <button onClick={() => setCmp(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.c6, fontSize: 15, padding: 0, lineHeight: 1 }}>×</button>
                                </div>
                            )}
                        </div>

                        {/* font name bar */}
                        <div style={{ padding: "12px 20px 6px", flexShrink: 0, display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ fontFamily: `"${sel.name}",serif`, fontSize: 24, fontWeight: 700, color: C.c1, letterSpacing: "-0.02em", lineHeight: 1 }}>{sel.name}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <div style={{ display: "flex", gap: 4 }}>
                                    {sel.tags.map(t => (
                                        <span key={t} style={{
                                            fontSize: 10, padding: "2px 8px", borderRadius: 20,
                                            background: "rgba(92,53,32,0.07)", border: "1px solid rgba(92,53,32,0.15)",
                                            color: C.c4, fontFamily: "'IBM Plex Mono',monospace"
                                        }}>{t}</span>
                                    ))}
                                </div>
                                <Mono color={C.c6}>{sel.cat} · {sel.sub}</Mono>
                            </div>
                            {cmp && <>
                                <span style={{ color: C.w4, fontSize: 14 }}>vs</span>
                                <div style={{ fontFamily: `"${cmp.name}",serif`, fontSize: 24, fontWeight: 700, color: C.c4, letterSpacing: "-0.02em" }}>{cmp.name}</div>
                            </>}
                        </div>

                        {/* canvas */}
                        <div style={{ padding: "4px 18px", flex: 1, minHeight: 0 }}>
                            <div style={{
                                borderRadius: 14, overflow: "hidden",
                                border: `1px solid rgba(200,185,165,0.55)`,
                                boxShadow: "0 6px 32px rgba(44,26,14,0.08), 0 1px 4px rgba(44,26,14,0.04), inset 0 1px 0 rgba(255,252,248,0.7)",
                            }}>
                                {metrics ? (
                                    <AnatomyCanvas
                                        font={sel} fontSize={fontSize} bgDark={bgDark} specimen={specimen}
                                        showLines={showLines} showGrid={showGrid} metrics={metrics}
                                        activeKey={activeKey} onLineDrag={handleLineDrag} draggedPositions={dragPos}
                                        compare={!!cmp} cmpFont={cmp} cmpMetrics={cmpM}
                                    />
                                ) : (
                                    <div style={{
                                        height: 280, display: "flex", alignItems: "center", justifyContent: "center",
                                        background: bgDark ? "#1A1008" : "#FDFAF5"
                                    }}>
                                        <div className="pulse" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.c6 }}>
                                            Loading {sel.name}…
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── RECOMMENDATIONS OVERLAY ───────────────────────────────── */}
                        {hasDragOverride && (
                            <div className="reco-panel fade-up" style={{
                                margin: "6px 18px 0", flexShrink: 0,
                                borderRadius: 12,
                                background: "rgba(255,252,248,0.96)",
                                border: `1px solid rgba(200,185,165,0.60)`,
                                boxShadow: "0 4px 24px rgba(44,26,14,0.10), 0 1px 4px rgba(44,26,14,0.06)",
                                overflow: "hidden",
                            }}>
                                {/* panel header */}
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "9px 14px 7px",
                                    borderBottom: `1px solid rgba(200,185,165,0.35)`,
                                    background: "rgba(240,232,218,0.55)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.c3 }} />
                                        <span style={{
                                            fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.c3,
                                            letterSpacing: "0.14em", textTransform: "uppercase"
                                        }}>
                                            Matching fonts for your anatomy
                                        </span>
                                        {!cacheReady && (
                                            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c6 }}>
                                                · measuring library {cacheProgress}%
                                            </span>
                                        )}
                                        {cacheReady && recommendations.length > 0 && (
                                            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c6 }}>
                                                · {recommendations.length} ranked matches
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.c5 }}>
                                            Click a card to apply
                                        </span>
                                        <button onClick={resetDrag} style={{
                                            fontFamily: "'DM Sans',sans-serif", fontSize: 11, padding: "3px 10px",
                                            background: "transparent", border: `1px solid rgba(160,48,48,0.28)`,
                                            color: "#A03030", borderRadius: 5, cursor: "pointer",
                                        }}>Reset lines</button>
                                    </div>
                                </div>

                                {/* target ratios row */}
                                {recommendations.length > 0 && (() => {
                                    const r0 = recommendations[0];
                                    return (
                                        <div style={{
                                            padding: "6px 14px",
                                            borderBottom: `1px solid rgba(200,185,165,0.25)`,
                                            display: "flex", gap: 20, background: "rgba(248,244,236,0.6)",
                                        }}>
                                            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c6, letterSpacing: "0.08em" }}>TARGET PROFILE:</span>
                                            {[
                                                { label: "x/cap", val: r0.targetXR.toFixed(3), color: LC.xHeight },
                                                { label: "asc/cap", val: r0.targetAscR.toFixed(3), color: LC.ascender },
                                                { label: "des/cap", val: r0.targetDesR.toFixed(3), color: LC.descender },
                                            ].map(({ label, val, color }) => (
                                                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                                    <div style={{ width: 8, height: 2, background: color, borderRadius: 1 }} />
                                                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c5 }}>{label}</span>
                                                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.c2, fontWeight: 500 }}>{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* font cards */}
                                {recommendations.length === 0 ? (
                                    <div style={{ padding: "16px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.c6, fontStyle: "italic" }}>
                                        {cacheReady ? "No matches yet — drag more lines to refine." : "Measuring font library in background…"}
                                    </div>
                                ) : (
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(6,1fr)",
                                        gap: 0,
                                    }}>
                                        {recommendations.map((r, i) => {
                                            const isTop = i === 0;
                                            return (
                                                <div
                                                    key={r.font.name}
                                                    onClick={() => handlePickRecommendation(r.font)}
                                                    style={{
                                                        padding: "12px 12px 10px",
                                                        cursor: "pointer",
                                                        borderRight: i < 5 ? `1px solid rgba(200,185,165,0.28)` : "none",
                                                        background: isTop ? "rgba(92,53,32,0.05)" : "transparent",
                                                        transition: "background 0.13s",
                                                        position: "relative",
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(92,53,32,0.08)"}
                                                    onMouseLeave={e => e.currentTarget.style.background = isTop ? "rgba(92,53,32,0.05)" : "transparent"}
                                                >
                                                    {/* rank badge */}
                                                    <div style={{
                                                        position: "absolute", top: 8, right: 8,
                                                        fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: isTop ? C.c3 : C.c6,
                                                        background: isTop ? "rgba(92,53,32,0.10)" : "transparent",
                                                        padding: isTop ? "1px 5px" : "0", borderRadius: 3,
                                                    }}>#{i + 1}</div>

                                                    {/* specimen preview */}
                                                    <div style={{
                                                        fontFamily: loaded.has(r.font.name) ? `"${r.font.name}",sans-serif` : "'DM Sans',sans-serif",
                                                        fontSize: 32, color: C.c1, lineHeight: 1, marginBottom: 8,
                                                        letterSpacing: "-0.02em", fontWeight: 400,
                                                    }}>Hx</div>

                                                    {/* font name */}
                                                    <div style={{
                                                        fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500,
                                                        color: C.c1, marginBottom: 2, lineHeight: 1.25
                                                    }}>
                                                        {r.font.name}
                                                    </div>
                                                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c6, marginBottom: 8 }}>
                                                        {r.font.sub}
                                                    </div>

                                                    {/* match bar */}
                                                    <div style={{ marginBottom: 5 }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                                            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.c6 }}>match</span>
                                                            <span style={{
                                                                fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5,
                                                                fontWeight: 500, color: r.matchPct >= 80 ? C.c3 : r.matchPct >= 60 ? C.c4 : C.c5
                                                            }}>
                                                                {r.matchPct}%
                                                            </span>
                                                        </div>
                                                        <div style={{ height: 3, borderRadius: 2, background: C.w3, overflow: "hidden" }}>
                                                            <div style={{
                                                                height: "100%", width: `${r.matchPct}%`, borderRadius: 2,
                                                                background: r.matchPct >= 80
                                                                    ? `linear-gradient(90deg,${C.c4},${C.c3})`
                                                                    : r.matchPct >= 60
                                                                        ? `linear-gradient(90deg,${C.c5},${C.c4})`
                                                                        : `linear-gradient(90deg,${C.c6},${C.c5})`,
                                                            }} />
                                                        </div>
                                                    </div>

                                                    {/* per-metric deltas */}
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                        {[
                                                            { label: "x/cap", val: r.xRatio.toFixed(3), d: r.dX, target: r.targetXR, color: LC.xHeight },
                                                            { label: "asc/cap", val: r.ascRatio.toFixed(3), d: r.dAsc, target: r.targetAscR, color: LC.ascender },
                                                            { label: "des/cap", val: r.desRatio.toFixed(3), d: r.dDes, target: r.targetDesR, color: LC.descender },
                                                        ].map(({ label, val, d, color }) => (
                                                            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                                    <div style={{ width: 5, height: 1.5, background: color, borderRadius: 1, opacity: 0.7 }} />
                                                                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.5, color: C.c6 }}>{label}</span>
                                                                </div>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: C.c3 }}>{val}</span>
                                                                    <span style={{
                                                                        fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.5,
                                                                        color: d < 0.03 ? "#1F6B40" : d < 0.08 ? C.c5 : "#A03030"
                                                                    }}>
                                                                        {d < 0.005 ? "≈" : `Δ${d.toFixed(2)}`}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* size slider */}
                        <div style={{ padding: "8px 22px 6px", display: "flex", alignItems: "center", gap: 13, flexShrink: 0 }}>
                            <Mono color={C.c6}>size</Mono>
                            <input type="range" min={40} max={200} step={2} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
                            <div style={{ padding: "2px 11px", borderRadius: 20, background: "rgba(92,53,32,0.07)", border: `1px solid rgba(92,53,32,0.16)` }}>
                                <Mono color={C.c3} size={13}>{fontSize}px</Mono>
                            </div>
                        </div>

                        {/* line chips */}
                        {showLines && (
                            <div style={{ padding: "0 18px 11px", flexShrink: 0 }}>
                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                    {LINE_META.map(m => (
                                        <LineChip key={m.key} meta={m} active={activeKey === m.key}
                                            onEnter={() => setActiveKey(m.key)} onLeave={() => setActiveKey(null)} />
                                    ))}
                                </div>
                                {!hasDragOverride && (
                                    <div style={{ marginTop: 6, fontSize: 11, color: C.c6, fontFamily: "'DM Sans',sans-serif" }}>
                                        Drag any line on the canvas to find matching fonts
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* RIGHT: metrics + use case */}
                    <aside className="panel-solid" style={{
                        width: 264, borderRadius: 0, borderTop: "none", borderBottom: "none", borderRight: "none",
                        display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0, zIndex: 10,
                        boxShadow: "-1px 0 14px rgba(44,26,14,0.06)",
                    }}>
                        {/* tab switcher */}
                        <div style={{ display: "flex", borderBottom: `1px solid rgba(200,185,165,0.35)`, flexShrink: 0 }}>
                            {[["metrics", "Metrics"], ["usecase", "Use case"]].map(([id, label]) => (
                                <button key={id} onClick={() => setRightTab(id)} style={{
                                    flex: 1, padding: "10px 0", fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                                    border: "none", background: "transparent", cursor: "pointer",
                                    color: rightTab === id ? C.c1 : C.c5,
                                    fontWeight: rightTab === id ? 500 : 400,
                                    borderBottom: rightTab === id ? `2px solid ${C.c3}` : "2px solid transparent",
                                    transition: "color 0.15s", marginBottom: -1,
                                }}>{label}</button>
                            ))}
                        </div>

                        <div style={{ overflowY: "auto", flex: 1, padding: 13 }}>
                            {rightTab === "metrics" ? (
                                <>
                                    <SecLabel>Measured · {fontSize}px</SecLabel>
                                    {metrics ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }} key={`${sel.name}-${fontSize}`}>
                                            <MetricCard label="X-height" value={`${Math.round(metrics.xHeight)}px`} sub={`${Math.round((metrics.xHeight / fontSize) * 100)}% of em`} color={LC.xHeight} />
                                            <MetricCard label="Cap height" value={`${Math.round(metrics.capHeight)}px`} sub={`${Math.round((metrics.capHeight / fontSize) * 100)}% of em`} color={LC.capHeight} />
                                            <MetricCard label="Ascender" value={`${Math.round(metrics.ascender)}px`} sub={`+${Math.round(metrics.ascender - metrics.capHeight)}px above cap`} color={LC.ascender} />
                                            <MetricCard label="Descender" value={`${Math.round(metrics.descender)}px`} sub="below baseline" color={LC.descender} />
                                        </div>
                                    ) : <div className="pulse" style={{ fontSize: 12, color: C.c6, padding: "10px 0" }}>Loading…</div>}

                                    <SecLabel>Design ratios</SecLabel>
                                    {metrics && <>
                                        <RatioBar label="x / cap ratio" pct={(xRatio || 0) * 100} fillColor={LC.xHeight} displayVal={xRatio?.toFixed(3)} note={xLabel} />
                                        <RatioBar label="em coverage" pct={Math.min((emCov || 0) * 83, 100)} fillColor={C.c4} displayVal={`${Math.round((emCov || 0) * 100)}%`} note="Total glyph height vs font size" />
                                        {extR !== null && <RatioBar label="extender reach" pct={Math.min(extR * 400, 100)} fillColor={LC.ascender} displayVal={`${(extR * 100).toFixed(0)}%`} note="Ascender height beyond cap" />}
                                    </>}

                                    {cmp && cmpM && metrics && (
                                        <>
                                            <div style={{ height: 1, background: `rgba(200,185,165,0.35)`, margin: "14px 0" }} />
                                            <SecLabel>Comparison vs {cmp.name}</SecLabel>
                                            <div style={{
                                                padding: "9px 11px", borderRadius: 9, marginBottom: 8,
                                                background: "rgba(255,252,248,0.9)", border: `1px solid rgba(200,185,165,0.4)`
                                            }}>
                                                {[{ lbl: "x-height Δ", v: Math.round(metrics.xHeight - cmpM.xHeight) },
                                                { lbl: "cap Δ", v: Math.round(metrics.capHeight - cmpM.capHeight) },
                                                { lbl: "descender Δ", v: Math.round(metrics.descender - cmpM.descender) }
                                                ].map(({ lbl, v }) => (
                                                    <div key={lbl} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                        <Mono>{lbl}</Mono>
                                                        <Mono color={v === 0 ? C.c5 : v > 0 ? "#1F6B40" : "#A03030"} size={12}>{v > 0 ? "+" : ""}{v}px</Mono>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{
                                                padding: "8px 10px", borderRadius: 7, fontSize: 11, lineHeight: 1.6,
                                                background: Math.abs(metrics.xHeight - cmpM.xHeight) > 8 ? "rgba(160,48,48,0.06)" : "rgba(31,107,64,0.07)",
                                                border: `1px solid ${Math.abs(metrics.xHeight - cmpM.xHeight) > 8 ? "rgba(160,48,48,0.22)" : "rgba(31,107,64,0.22)"}`,
                                                color: Math.abs(metrics.xHeight - cmpM.xHeight) > 8 ? "#A03030" : "#1F6B40",
                                            }}>
                                                {Math.abs(metrics.xHeight - cmpM.xHeight) > 8
                                                    ? "⚠ Significant x-height difference. Adjust sizes before pairing."
                                                    : "✓ Similar x-heights — safe to pair at equal sizes."}
                                            </div>
                                        </>
                                    )}

                                    <div style={{ height: 1, background: `rgba(200,185,165,0.35)`, margin: "16px 0" }} />
                                    <SecLabel>CSS usage</SecLabel>
                                    <div style={{
                                        background: "rgba(255,252,248,0.90)", border: `1px solid rgba(200,185,165,0.40)`,
                                        borderRadius: 9, padding: "10px 12px"
                                    }}>
                                        <pre style={{
                                            fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: C.c4,
                                            lineHeight: 1.85, overflow: "auto", whiteSpace: "pre-wrap"
                                        }}>
                                            {`@import url(
  'fonts.googleapis.com
  /css2?family=
  ${encodeURIComponent(sel.name)}
  :wght@400;700
  &display=swap'
);

.text {
  font-family:
    '${sel.name}',
    ${sel.cat === "Serif" ? "serif" : sel.cat === "Monospace" ? "monospace" : "sans-serif"};
  font-size: 16px;
  line-height: 1.6;
}`}
                                        </pre>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <SecLabel>Font intelligence · {sel.name}</SecLabel>
                                    <UseCasePanel font={sel} />
                                </>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}