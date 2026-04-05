import { useState, useRef, useEffect, useCallback } from "react";

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Inter', 'Epilogue', system-ui, sans-serif";

const ZINC = {
    950: "#09090b",
    900: "#18181b",
    800: "#27272a",
    700: "#3f3f46",
    500: "#71717a",
    400: "#a1a1aa",
    300: "#d4d4d8",
    200: "#e4e4e7",
    100: "#f4f4f5",
    50: "#fafafa",
    0: "#ffffff",
};
// ─── TAG DATA ────────────────────────────────────────────────────────────────
const TAGS = [
    // Metadata
    {
        t: "html", cat: "Document", display: "block", box: "block", replaced: false, void: false,
        ua: "margin:0; padding:0", aria: "none", desc: "Root element. Contains head + body.",
        geometry: { w: 800, h: 600, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["document-root"],
        note: "Establishes the initial containing block for all layout."
    },
    {
        t: "head", cat: "Document", display: "none", box: "none", replaced: false, void: false,
        ua: "display:none", aria: "none", desc: "Metadata container. Invisible. No box generated.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["none"],
        note: "Generates no box whatsoever in the render tree."
    },
    {
        t: "body", cat: "Document", display: "block", box: "block", replaced: false, void: false,
        ua: "margin:8px", aria: "generic", desc: "Document body. The painting canvas.",
        geometry: { w: 800, h: 580, px: 0, py: 0, mx: 8, my: 8, bw: 0 }, layers: ["stacking-context"],
        note: "The 8px default margin is the source of the classic 'white gap' around pages."
    },
    {
        t: "title", cat: "Document", display: "none", box: "none", replaced: false, void: false,
        ua: "display:none", aria: "none", desc: "Browser tab text. No visual box.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["none"],
        note: "Exists only in the accessibility tree and browser UI chrome."
    },
    {
        t: "meta", cat: "Document", display: "none", box: "none", replaced: false, void: true,
        ua: "display:none", aria: "none", desc: "Machine metadata. No box.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["none"],
        note: "void element — no closing tag, no children, no box."
    },
    {
        t: "link", cat: "Document", display: "none", box: "none", replaced: false, void: true,
        ua: "display:none", aria: "none", desc: "External resource. No visual presence.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["none"],
        note: "Loads CSS, fonts, favicons — all invisible to layout."
    },
    {
        t: "script", cat: "Document", display: "none", box: "none", replaced: false, void: false,
        ua: "display:none", aria: "none", desc: "JavaScript. Invisible. Blocks parsing if no defer.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["none"],
        note: "Without defer/async, blocks HTML parser until script finishes executing."
    },

    // Sectioning
    {
        t: "header", cat: "Sectioning", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "banner", desc: "Page or section header. Full-width block.",
        geometry: { w: 760, h: 80, px: 16, py: 16, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "ARIA role switches: banner at page level → generic inside article/section."
    },
    {
        t: "nav", cat: "Sectioning", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "navigation", desc: "Navigation landmark block.",
        geometry: { w: 760, h: 48, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Screen readers expose a 'Navigation' landmark jump shortcut."
    },
    {
        t: "main", cat: "Sectioning", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "main", desc: "Primary content. Single per page.",
        geometry: { w: 760, h: 400, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Only one visible <main> per document. Browser reader modes focus on it."
    },
    {
        t: "article", cat: "Sectioning", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "article", desc: "Self-contained content unit.",
        geometry: { w: 680, h: 240, px: 16, py: 16, mx: 0, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "Content should make sense if syndicated (RSS, copy-paste) without surrounding context."
    },
    {
        t: "section", cat: "Sectioning", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "region", desc: "Thematic content group.",
        geometry: { w: 680, h: 180, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Gets 'region' ARIA only when it has an accessible name (aria-label / aria-labelledby)."
    },
    {
        t: "aside", cat: "Sectioning", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "complementary", desc: "Tangential sidebar content.",
        geometry: { w: 220, h: 300, px: 16, py: 16, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Does not visually float — needs CSS float/flex/grid to position as a sidebar."
    },
    {
        t: "footer", cat: "Sectioning", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "contentinfo", desc: "Page/section footer.",
        geometry: { w: 760, h: 80, px: 16, py: 24, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Same role-switching as header: contentinfo at page level, generic inside sections."
    },
    {
        t: "address", cat: "Sectioning", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; font-style:italic", aria: "group", desc: "Contact info for nearest article/body.",
        geometry: { w: 400, h: 60, px: 0, py: 0, mx: 0, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "Italicised by UA stylesheet. NOT for physical addresses — for author contact info."
    },

    // Headings
    {
        t: "h1", cat: "Headings", display: "block", box: "block", replaced: false, void: false,
        ua: "font-size:2em; font-weight:bold; margin:.67em 0", aria: "heading lv1", desc: "Top-level page heading.",
        geometry: { w: 760, h: 48, px: 0, py: 0, mx: 0, my: 10, bw: 0 }, layers: ["block-flow"],
        note: "Only ONE per page. Browsers are removing the nested-h1-shrinking UA rules in 2025–26."
    },
    {
        t: "h2", cat: "Headings", display: "block", box: "block", replaced: false, void: false,
        ua: "font-size:1.5em; font-weight:bold; margin:.83em 0", aria: "heading lv2", desc: "Major section heading.",
        geometry: { w: 760, h: 36, px: 0, py: 0, mx: 0, my: 12, bw: 0 }, layers: ["block-flow"],
        note: "Use in sequence — never skip from h1 to h3."
    },
    {
        t: "h3", cat: "Headings", display: "block", box: "block", replaced: false, void: false,
        ua: "font-size:1.17em; font-weight:bold; margin:1em 0", aria: "heading lv3", desc: "Sub-section heading.",
        geometry: { w: 760, h: 28, px: 0, py: 0, mx: 0, my: 14, bw: 0 }, layers: ["block-flow"],
        note: "Margin collapses with adjacent block siblings in normal flow."
    },
    {
        t: "h4", cat: "Headings", display: "block", box: "block", replaced: false, void: false,
        ua: "font-size:1em; font-weight:bold; margin:1.33em 0", aria: "heading lv4", desc: "Deep sub-section.",
        geometry: { w: 760, h: 24, px: 0, py: 0, mx: 0, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "Rarely needed. If you reach h4, consider restructuring content."
    },
    {
        t: "h5", cat: "Headings", display: "block", box: "block", replaced: false, void: false,
        ua: "font-size:.83em; font-weight:bold; margin:1.67em 0", aria: "heading lv5", desc: "Rare deep heading.",
        geometry: { w: 760, h: 20, px: 0, py: 0, mx: 0, my: 20, bw: 0 }, layers: ["block-flow"],
        note: "Almost never used in practice. Very small by UA default."
    },
    {
        t: "h6", cat: "Headings", display: "block", box: "block", replaced: false, void: false,
        ua: "font-size:.67em; font-weight:bold; margin:2.33em 0", aria: "heading lv6", desc: "Lowest heading level.",
        geometry: { w: 760, h: 16, px: 0, py: 0, mx: 0, my: 28, bw: 0 }, layers: ["block-flow"],
        note: "Smallest UA font-size of all headings. Structuring problem if you need it."
    },

    // Block Flow
    {
        t: "div", cat: "Block", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "none", desc: "Generic block container. No semantic meaning.",
        geometry: { w: 760, h: 100, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Use only when no semantic element fits. div = 'this is just a layout box'."
    },
    {
        t: "p", cat: "Block", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; margin:1em 0", aria: "paragraph", desc: "Paragraph. Auto-closes on block descendants.",
        geometry: { w: 760, h: 72, px: 0, py: 0, mx: 0, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "Parser auto-closes <p> when it sees div, ul, table, h1–h6 and other blocks inside."
    },
    {
        t: "pre", cat: "Block", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; font-family:monospace; white-space:pre; margin:1em 0", aria: "none", desc: "Preformatted. Preserves whitespace.",
        geometry: { w: 760, h: 96, px: 16, py: 12, mx: 0, my: 16, bw: 1 }, layers: ["block-flow"],
        note: "Leading newline after <pre> is stripped by parser. white-space:pre breaks text-wrapping."
    },
    {
        t: "blockquote", cat: "Block", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; margin-inline:40px; margin-block:1em", aria: "blockquote", desc: "Block quotation. 40px side margins.",
        geometry: { w: 680, h: 80, px: 0, py: 0, mx: 40, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "The 40px inline margin is pure UA style — not padding. Attribution goes OUTSIDE the element."
    },
    {
        t: "figure", cat: "Block", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; margin-inline:40px; margin-block:1em", aria: "figure", desc: "Self-contained figure with optional caption.",
        geometry: { w: 680, h: 200, px: 0, py: 0, mx: 40, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "Also has 40px side margins like blockquote. figcaption must be first or last child."
    },
    {
        t: "hr", cat: "Block", display: "block", box: "block", replaced: false, void: true,
        ua: "display:block; border:1px inset; margin:.5em auto", aria: "separator", desc: "Thematic break. Horizontal rule.",
        geometry: { w: 760, h: 4, px: 0, py: 0, mx: 0, my: 8, bw: 1 }, layers: ["block-flow"],
        note: "void element. Semantic meaning: topic change, not decoration. Style with CSS instead of border."
    },

    // Inline
    {
        t: "span", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline", aria: "none", desc: "Generic inline container. No semantic meaning.",
        geometry: { w: 80, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Inline boxes participate in the line box, not block flow. Multiple per line."
    },
    {
        t: "a", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline; color:blue; text-decoration:underline", aria: "link", desc: "Hyperlink. Transparent content model.",
        geometry: { w: 120, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Transparent model: permitted content comes from parent. Cannot nest interactive descendants."
    },
    {
        t: "em", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline; font-style:italic", aria: "emphasis", desc: "Stress emphasis. Changes semantic meaning.",
        geometry: { w: 60, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Spoken stress: 'I never said SHE did it' vs 'I NEVER said she did it'."
    },
    {
        t: "strong", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline; font-weight:bold", aria: "strong", desc: "Strong importance. Serious or urgent.",
        geometry: { w: 70, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Not 'important for styling' — for genuinely critical content like warnings."
    },
    {
        t: "code", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline; font-family:monospace", aria: "none", desc: "Inline code fragment.",
        geometry: { w: 90, h: 20, px: 2, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Monospace fonts render ~13px vs 16px body — use font-size:1em and font-family:monospace,monospace fix."
    },
    {
        t: "mark", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline; background:yellow; color:black", aria: "mark", desc: "Highlighted for relevance.",
        geometry: { w: 80, h: 20, px: 2, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Like a physical highlighter pen. Screen readers may not announce it — add aria-label if critical."
    },
    {
        t: "small", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline; font-size:smaller", aria: "none", desc: "Fine print, side comments.",
        geometry: { w: 100, h: 16, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Semantically 'side comment' (copyright, legal). Not 'visually small text'."
    },
    {
        t: "br", cat: "Inline", display: "inline", box: "void", replaced: false, void: true,
        ua: "(forces line break)", aria: "none", desc: "Line break. Forces new line in inline context.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "void element. No box — inserts a forced break into the line box. Don't use for spacing."
    },
    {
        t: "sub", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "vertical-align:sub; font-size:smaller", aria: "subscript", desc: "Subscript (H₂O).",
        geometry: { w: 20, h: 14, px: 0, py: 0, mx: 0, my: 4, bw: 0 }, layers: ["inline-flow"],
        note: "Lowers baseline. Increases line-height of the line it sits in."
    },
    {
        t: "sup", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "vertical-align:super; font-size:smaller", aria: "superscript", desc: "Superscript (x²).",
        geometry: { w: 16, h: 14, px: 0, py: 0, mx: 0, my: -6, bw: 0 }, layers: ["inline-flow"],
        note: "Raises baseline. Same line-height impact as sub."
    },
    {
        t: "del", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "text-decoration:line-through", aria: "deletion", desc: "Deleted text. Tracked edit.",
        geometry: { w: 80, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Transparent model. Has cite + datetime attrs. Different from <s> which means 'no longer accurate'."
    },
    {
        t: "ins", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "text-decoration:underline", aria: "insertion", desc: "Inserted text. Tracked edit.",
        geometry: { w: 80, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Also transparent model. Use cite + datetime for proper document versioning."
    },
    {
        t: "abbr", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "text-decoration:underline dotted", aria: "none", desc: "Abbreviation. title= shows expansion.",
        geometry: { w: 50, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Dotted underline is UA default. Tooltip via title attr — but invisible to mobile users."
    },
    {
        t: "time", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline", aria: "time", desc: "Machine-readable date/time.",
        geometry: { w: 100, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "datetime attr must be valid ISO 8601. Enables parsers, search engines, calendar apps."
    },
    {
        t: "q", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline; (::before+::after add quotes)", aria: "none", desc: "Inline quotation. Browser adds quotes.",
        geometry: { w: 100, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Quotes come from CSS content property in UA stylesheet. Nested <q> alternates quote style."
    },
    {
        t: "b", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "font-weight:bold", aria: "none", desc: "Bold. No importance. Stylistic only.",
        geometry: { w: 60, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "vs <strong>: b = 'draw attention' (keywords, leads). strong = 'this is actually important'."
    },
    {
        t: "i", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "font-style:italic", aria: "none", desc: "Italic. Alternate voice. No stress.",
        geometry: { w: 60, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "vs <em>: i = alternate mood (Latin terms, ship names). em = spoken stress that changes meaning."
    },
    {
        t: "s", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "text-decoration:line-through", aria: "none", desc: "No longer accurate/relevant.",
        geometry: { w: 80, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "vs <del>: s = outdated prices, old info. del = tracked document change."
    },
    {
        t: "u", cat: "Inline", display: "inline", box: "inline", replaced: false, void: false,
        ua: "text-decoration:underline", aria: "none", desc: "Unarticulated annotation.",
        geometry: { w: 80, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Looks like a link! Only use with clear styling distinction. Proper noun annotation in Chinese."
    },
    {
        t: "wbr", cat: "Inline", display: "inline", box: "void", replaced: false, void: true,
        ua: "(optional line break opportunity)", aria: "none", desc: "Word break opportunity.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "void. Breaks only when line overflows. No hyphen added. Different from &shy; (soft hyphen)."
    },

    // Lists
    {
        t: "ul", cat: "Lists", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; list-style:disc; padding-inline-start:40px; margin:1em 0", aria: "list", desc: "Unordered list. Bullet points.",
        geometry: { w: 720, h: 96, px: 40, py: 8, mx: 0, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "40px left padding creates the bullet indent. Nested lists lose block margin (margin:0)."
    },
    {
        t: "ol", cat: "Lists", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; list-style:decimal; padding-inline-start:40px; margin:1em 0", aria: "list", desc: "Ordered list. Numbered sequence.",
        geometry: { w: 720, h: 96, px: 40, py: 8, mx: 0, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "reversed, start, type attributes available. Counters are CSS-generated content."
    },
    {
        t: "li", cat: "Lists", display: "list-item", box: "block", replaced: false, void: false,
        ua: "display:list-item", aria: "listitem", desc: "List item. display:list-item generates marker box.",
        geometry: { w: 680, h: 24, px: 0, py: 4, mx: 0, my: 0, bw: 0 }, layers: ["block-flow", "marker"],
        note: "display:list-item creates TWO boxes: a principal box + a marker box (bullet/number)."
    },
    {
        t: "dl", cat: "Lists", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; margin:1em 0", aria: "none", desc: "Description list. Name/value pairs.",
        geometry: { w: 760, h: 80, px: 0, py: 0, mx: 0, my: 16, bw: 0 }, layers: ["block-flow"],
        note: "Can wrap dt+dd pairs in div for styling/microdata. Multiple dd per dt is valid."
    },
    {
        t: "dt", cat: "Lists", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; font-weight:bold", aria: "term", desc: "Definition term.",
        geometry: { w: 760, h: 24, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Bold by UA default. Multiple dt before one dd is valid."
    },
    {
        t: "dd", cat: "Lists", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; margin-inline-start:40px", aria: "definition", desc: "Definition detail. 40px indent.",
        geometry: { w: 720, h: 24, px: 0, py: 0, mx: 40, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "40px left margin is the UA default indent."
    },

    // Embedded / Replaced
    {
        t: "img", cat: "Embedded", display: "inline", box: "replaced", replaced: true, void: true,
        ua: "display:inline; (intrinsic dimensions from src)", aria: "img / presentation", desc: "Image. Replaced element. Void.",
        geometry: { w: 300, h: 200, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["replaced", "stacking"],
        note: "Replaced: content is external, not CSS-controllable. Set both width+height to prevent layout shift."
    },
    {
        t: "picture", cat: "Embedded", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline", aria: "none", desc: "Responsive image container. Wraps source + img.",
        geometry: { w: 300, h: 200, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Generates no visual box itself. The img child is the replaced element."
    },
    {
        t: "video", cat: "Embedded", display: "inline", box: "replaced", replaced: true, void: false,
        ua: "display:inline; default 300×150", aria: "none", desc: "Video player. Replaced. Default 300×150.",
        geometry: { w: 300, h: 150, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["replaced", "stacking"],
        note: "Default object size: 300×150 CSS pixels. Autoplay requires muted or browser blocks it."
    },
    {
        t: "audio", cat: "Embedded", display: "inline", box: "replaced", replaced: true, void: false,
        ua: "display:none (no controls) / inline (controls)", aria: "none", desc: "Audio player. Invisible without controls.",
        geometry: { w: 300, h: 32, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["replaced"],
        note: "Without controls attr: display:none. With controls: browser-rendered replaced element."
    },
    {
        t: "iframe", cat: "Embedded", display: "inline", box: "replaced", replaced: true, void: false,
        ua: "display:inline; border:2px inset; default 300×150", aria: "none", desc: "Inline frame. Separate browsing context.",
        geometry: { w: 300, h: 150, px: 0, py: 0, mx: 0, my: 0, bw: 2 }, layers: ["replaced", "stacking-context", "top-layer"],
        note: "Creates a separate Document. Default 2px inset border. Needs title attr for accessibility."
    },
    {
        t: "canvas", cat: "Embedded", display: "inline", box: "replaced", replaced: true, void: false,
        ua: "display:inline; default 300×150", aria: "none", desc: "Bitmap drawing surface for JS.",
        geometry: { w: 300, h: 150, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["replaced", "stacking"],
        note: "CSS dimensions ≠ bitmap dimensions. Use width/height attrs for actual pixel buffer size."
    },
    {
        t: "source", cat: "Embedded", display: "none", box: "none", replaced: false, void: true,
        ua: "display:none", aria: "none", desc: "Media source alternative. No visual box.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["none"],
        note: "void. Different attrs in picture (srcset) vs video/audio (src). Browser picks first supported."
    },
    {
        t: "track", cat: "Embedded", display: "none", box: "none", replaced: false, void: true,
        ua: "display:none", aria: "none", desc: "Subtitle/caption track for media.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["none"],
        note: "void. WebVTT format. kind attr: subtitles/captions/chapters/metadata/descriptions."
    },
    {
        t: "svg", cat: "Embedded", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline-block; overflow:hidden", aria: "img / (from role)", desc: "Inline SVG. Part of DOM. Not replaced.",
        geometry: { w: 100, h: 100, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow", "stacking-context"],
        note: "NOT a replaced element — SVG is in the DOM and can be styled via CSS. overflow:hidden by default."
    },

    // Tables
    {
        t: "table", cat: "Tables", display: "table", box: "table", replaced: false, void: false,
        ua: "display:table; border-spacing:2px; border-collapse:separate; border-color:gray", aria: "table", desc: "Table. Own layout algorithm.",
        geometry: { w: 600, h: 200, px: 0, py: 0, mx: 0, my: 16, bw: 1 }, layers: ["table"],
        note: "Two layout modes: auto (content-dependent) and fixed (column-width-based). NEVER for page layout."
    },
    {
        t: "thead", cat: "Tables", display: "table-header-group", box: "table", replaced: false, void: false,
        ua: "display:table-header-group; vertical-align:middle", aria: "rowgroup", desc: "Table header group.",
        geometry: { w: 600, h: 40, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["table"],
        note: "Repeats at top of each printed page. Browsers may render it at the top even if placed mid-markup."
    },
    {
        t: "tbody", cat: "Tables", display: "table-row-group", box: "table", replaced: false, void: false,
        ua: "display:table-row-group; vertical-align:middle", aria: "rowgroup", desc: "Table body. Auto-inserted by browser.",
        geometry: { w: 600, h: 120, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["table"],
        note: "Browser silently inserts <tbody> between <table> and <tr>. CSS table>tr selectors break because of this."
    },
    {
        t: "tfoot", cat: "Tables", display: "table-footer-group", box: "table", replaced: false, void: false,
        ua: "display:table-footer-group; vertical-align:middle", aria: "rowgroup", desc: "Table footer. Renders at bottom.",
        geometry: { w: 600, h: 40, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["table"],
        note: "Always renders at table bottom regardless of DOM position. Repeats on print."
    },
    {
        t: "tr", cat: "Tables", display: "table-row", box: "table", replaced: false, void: false,
        ua: "display:table-row; vertical-align:inherit", aria: "row", desc: "Table row.",
        geometry: { w: 600, h: 40, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["table"],
        note: "Height is determined by tallest cell in the row. colspan/rowspan cells affect layout."
    },
    {
        t: "th", cat: "Tables", display: "table-cell", box: "table", replaced: false, void: false,
        ua: "display:table-cell; font-weight:bold; text-align:center; padding:1px", aria: "columnheader/rowheader", desc: "Header cell. Bold + centered.",
        geometry: { w: 120, h: 40, px: 1, py: 1, mx: 0, my: 0, bw: 1 }, layers: ["table"],
        note: "scope attr (col/row/colgroup/rowgroup) tells screen readers which direction the header applies."
    },
    {
        t: "td", cat: "Tables", display: "table-cell", box: "table", replaced: false, void: false,
        ua: "display:table-cell; padding:1px", aria: "cell", desc: "Data cell.",
        geometry: { w: 120, h: 40, px: 1, py: 1, mx: 0, my: 0, bw: 1 }, layers: ["table"],
        note: "colspan max: 1000. rowspan max: 65534. rowspan=0 spans to end of section."
    },
    {
        t: "caption", cat: "Tables", display: "table-caption", box: "table", replaced: false, void: false,
        ua: "display:table-caption; text-align:center", aria: "(names table)", desc: "Table caption/title.",
        geometry: { w: 600, h: 28, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["table"],
        note: "Must be first child of <table>. Acts as accessible name for the whole table."
    },
    {
        t: "colgroup", cat: "Tables", display: "table-column-group", box: "table", replaced: false, void: false,
        ua: "display:table-column-group", aria: "none", desc: "Column group for styling columns.",
        geometry: { w: 600, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["table"],
        note: "Only 4 CSS properties work on col/colgroup: background, border, visibility, width."
    },
    {
        t: "col", cat: "Tables", display: "table-column", box: "table", replaced: false, void: true,
        ua: "display:table-column", aria: "none", desc: "Single column spec. void.",
        geometry: { w: 120, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["table"],
        note: "void. span attr covers multiple columns. Only background/border/visibility/width work."
    },

    // Forms
    {
        t: "form", cat: "Forms", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; margin-top:0", aria: "form / generic", desc: "Form container. Handles data submission.",
        geometry: { w: 760, h: 200, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Cannot nest forms. Implicit submit on Enter in single-text-field forms."
    },
    {
        t: "input", cat: "Forms", display: "inline-block", box: "replaced", replaced: true, void: true,
        ua: "display:inline-block; (varies per type)", aria: "varies by type", desc: "Input. 22 types. void. Usually replaced.",
        geometry: { w: 200, h: 28, px: 2, py: 2, mx: 0, my: 0, bw: 1 }, layers: ["replaced"],
        note: "void. type attr changes everything: layout, events, ARIA role, validation, keyboard."
    },
    {
        t: "button", cat: "Forms", display: "inline-block", box: "block", replaced: false, void: false,
        ua: "display:inline-block; cursor:default", aria: "button", desc: "Clickable button. Default type=submit!",
        geometry: { w: 80, h: 28, px: 6, py: 4, mx: 0, my: 0, bw: 1 }, layers: ["block-flow"],
        note: "DEFAULT TYPE IS SUBMIT. Always add type='button' for non-submit buttons or risk form accidents."
    },
    {
        t: "label", cat: "Forms", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline; cursor:default", aria: "(labels its control)", desc: "Associates with a form control.",
        geometry: { w: 80, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Clicking label activates the associated input. for= must match input's id."
    },
    {
        t: "textarea", cat: "Forms", display: "inline-block", box: "replaced", replaced: true, void: false,
        ua: "display:inline-block; font-family:monospace; resize:both", aria: "textbox", desc: "Multi-line text. Not void. Resizable.",
        geometry: { w: 320, h: 80, px: 2, py: 2, mx: 0, my: 0, bw: 1 }, layers: ["replaced"],
        note: "NOT void — initial value is text content between tags, not value attr. Resizable via resize:."
    },
    {
        t: "select", cat: "Forms", display: "inline-block", box: "replaced", replaced: true, void: false,
        ua: "display:inline-block", aria: "combobox / listbox", desc: "Dropdown. ARIA: combobox or listbox.",
        geometry: { w: 180, h: 28, px: 2, py: 2, mx: 0, my: 0, bw: 1 }, layers: ["replaced", "top-layer"],
        note: "Native dropdown opens in top-layer (above everything). appearance:base-select enables CSS customization."
    },
    {
        t: "option", cat: "Forms", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "option", desc: "A choice in select or datalist.",
        geometry: { w: 178, h: 24, px: 4, py: 2, mx: 0, my: 0, bw: 0 }, layers: ["top-layer"],
        note: "Renders inside the native dropdown popup (top layer). Limited CSS styling possible."
    },
    {
        t: "fieldset", cat: "Forms", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; border:2px groove; padding:8px; min-inline-size:min-content", aria: "group", desc: "Groups related inputs. groove border.",
        geometry: { w: 400, h: 160, px: 8, py: 8, mx: 0, my: 0, bw: 2 }, layers: ["block-flow"],
        note: "min-inline-size:min-content means it WON'T shrink to 0 — reset it if you need narrower layout."
    },
    {
        t: "legend", cat: "Forms", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block; padding:0 2px", aria: "(names fieldset)", desc: "Fieldset label. Renders over border.",
        geometry: { w: 120, h: 24, px: 2, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "Must be first child of fieldset. Painted over the block-start border edge."
    },
    {
        t: "datalist", cat: "Forms", display: "none", box: "none", replaced: false, void: false,
        ua: "display:none", aria: "listbox", desc: "Autocomplete suggestions for input.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["top-layer"],
        note: "display:none itself. Suggestions pop up above page (top layer) when input is focused."
    },
    {
        t: "output", cat: "Forms", display: "inline", box: "inline", replaced: false, void: false,
        ua: "display:inline", aria: "status", desc: "Calculation result. aria-live=polite.",
        geometry: { w: 100, h: 20, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["inline-flow"],
        note: "Implicit aria-live='polite' — screen readers announce changes to output's content."
    },
    {
        t: "progress", cat: "Forms", display: "inline-block", box: "replaced", replaced: true, void: false,
        ua: "display:inline-block; width:10em; height:1em", aria: "progressbar", desc: "Progress bar. Replaced element.",
        geometry: { w: 160, h: 16, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["replaced"],
        note: "Without value: indeterminate (animated). With value: determinate bar. max defaults to 1."
    },
    {
        t: "meter", cat: "Forms", display: "inline-block", box: "replaced", replaced: true, void: false,
        ua: "display:inline-block", aria: "meter", desc: "Scalar gauge. low/high/optimum thresholds.",
        geometry: { w: 80, h: 16, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["replaced"],
        note: "Colour zones: green/yellow/red based on low/high/optimum relationship. Different from progress."
    },

    // Interactive
    {
        t: "details", cat: "Interactive", display: "block", box: "block", replaced: false, void: false,
        ua: "display:block", aria: "group", desc: "Disclosure widget. Toggle without JS.",
        geometry: { w: 760, h: 48, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow"],
        note: "name attr creates exclusive accordion (open one closes others). open attr = initially expanded."
    },
    {
        t: "summary", cat: "Interactive", display: "list-item", box: "block", replaced: false, void: false,
        ua: "display:list-item; cursor:default; marker:disclosure-closed/open", aria: "button", desc: "Toggle label for <details>.",
        geometry: { w: 760, h: 24, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["block-flow", "marker"],
        note: "Must be first child of details. Triangle via ::marker — CSS list-style can replace it."
    },
    {
        t: "dialog", cat: "Interactive", display: "none", box: "block", replaced: false, void: false,
        ua: "display:none; (modal: position:fixed; max-width:calc(100%-6px-2em))", aria: "dialog", desc: "Native modal/dialog. Top layer.",
        geometry: { w: 400, h: 200, px: 16, py: 16, mx: 0, my: 0, bw: 1 }, layers: ["top-layer", "stacking-context"],
        note: "showModal() → top layer (above everything, ::backdrop, focus trap). show() → normal stacking context."
    },

    // Templates
    {
        t: "template", cat: "Template", display: "none", box: "none", replaced: false, void: false,
        ua: "display:none", aria: "none", desc: "Inert HTML fragment. Not rendered.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["none"],
        note: "Content stored in .content DocumentFragment. Scripts don't run, images don't load. cloneNode to use."
    },
    {
        t: "slot", cat: "Template", display: "contents", box: "none", replaced: false, void: false,
        ua: "display:contents", aria: "none", desc: "Shadow DOM placeholder. display:contents.",
        geometry: { w: 0, h: 0, px: 0, py: 0, mx: 0, my: 0, bw: 0 }, layers: ["shadow-dom"],
        note: "display:contents = no box generated, but children participate in parent layout. Shadow DOM only."
    },
];

const CATEGORIES = [...new Set(TAGS.map(t => t.cat))];

// ─── COLORS ─────────────────────────────────────────────────────────────────
const C = {
    bg: ZINC[50],
    paper: ZINC[0],
    ink: ZINC[950],
    ink2: ZINC[800],
    ink3: ZINC[700],
    ink4: ZINC[500],
    ink5: ZINC[400],
    border: ZINC[200],
    border2: ZINC[300],
    accent: ZINC[950],
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    marker: ZINC[100],
};

// ─── BOX MODEL LABELS ─────────────────────────────────────────────────────
const BOX_LABELS = {
    "block": "Block Formatting Context",
    "inline": "Inline Formatting Context",
    "replaced": "Replaced Element",
    "table": "Table Formatting Context",
    "none": "No Box Generated",
    "void": "void — no children",
};

// ─── 3D ISOMETRIC BOX RENDERER ────────────────────────────────────────────
function IsoBox({ x, y, z, w, h, d, fill, stroke, label, opacity = 1, dash = false }) {
    // ISO: x=right, y=down, z=towards viewer
    const ISO_X = 0.707; const ISO_Y = 0.354;
    function pt(rx, ry, rz) {
        return [x + rx * ISO_X - rz * ISO_X, y + rx * ISO_Y + ry * 1 + rz * ISO_Y];
    }
    const TL = pt(0, 0, d), TR = pt(w, 0, d), BR = pt(w, h, d), BL = pt(0, h, d);
    const TL0 = pt(0, 0, 0), TR0 = pt(w, 0, 0);
    const TRd = pt(w, 0, d), TRb = pt(w, h, 0);
    const ds = dash ? "4 3" : "none";

    const toStr = ([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`;
    const face = [TL, TR, BR, BL].map(toStr).join(" ");
    const sideR = [TR, TR0, TRb, TRd].map(toStr).join(" ");
    const top = [TL0, TR0, TR, TL].map(toStr).join(" ");

    const mx = (TL[0] + TR[0] + BR[0] + BL[0]) / 4;
    const my = (TL[1] + TR[1] + BR[1] + BL[1]) / 4;

    return (
        <g opacity={opacity}>
            <polygon points={top} fill={fill} stroke={stroke} strokeWidth="0.8" strokeDasharray={ds} fillOpacity={0.5} />
            <polygon points={sideR} fill={fill} stroke={stroke} strokeWidth="0.8" strokeDasharray={ds} fillOpacity={0.35} />
            <polygon points={face} fill={fill} stroke={stroke} strokeWidth="1" strokeDasharray={ds} fillOpacity={0.7} />
            {label && <text x={mx} y={my + 3} textAnchor="middle" fontSize="8" fontFamily={MONO} fill={stroke} opacity={0.9}>{label}</text>}
        </g>
    );
}

// ─── CANVAS VISUALIZER ───────────────────────────────────────────────────
function BrowserCanvas({ tag }) {
    const [mode, setMode] = useState("box"); // box | layers | flow | dom
    const [angle, setAngle] = useState(0);

    if (!tag) return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
            <div style={{ width: 64, height: 64, border: `1.5px solid ${C.border2}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="4" width="20" height="20" stroke={C.ink4} strokeWidth="1.5" />
                    <line x1="4" y1="14" x2="24" y2="14" stroke={C.ink4} strokeWidth="1" />
                    <line x1="14" y1="4" x2="14" y2="24" stroke={C.ink4} strokeWidth="1" />
                </svg>
            </div>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: 12, color: C.ink4, letterSpacing: "0.1em" }}>SELECT AN ELEMENT</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: C.ink5, marginTop: 4 }}>from the list to visualize its render geometry</div>
            </div>
        </div>
    );

    const g = tag.geometry;
    const isNoBox = tag.box === "none";

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Toolbar */}
            <div style={{
                display: "flex", alignItems: "center", gap: 0,
                borderBottom: `1px solid ${C.border}`,
                padding: "0 20px",
                height: 40,
                flexShrink: 0,
            }}>
                {["box", "layers", "flow", "dom"].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        background: "none", border: "none",
                        borderBottom: mode === m ? `2px solid ${C.ink}` : "2px solid transparent",
                        color: mode === m ? C.ink : C.ink4,
                        fontFamily: MONO,
                        fontSize: 11, letterSpacing: "0.08em",
                        padding: "0 14px", height: 40, cursor: "pointer",
                        textTransform: "uppercase",
                    }}>{m}</button>
                ))}
                <div style={{ flex: 1 }} />
                <code style={{ fontFamily: MONO, fontSize: 13, color: C.ink2, background: C.marker, padding: "3px 10px", borderRadius: 3 }}>
                    &lt;{tag.t}&gt;
                </code>
            </div>

            {/* Main render area */}
            <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
                {mode === "box" && <BoxModelView tag={tag} />}
                {mode === "layers" && <LayersView tag={tag} />}
                {mode === "flow" && <FlowView tag={tag} />}
                {mode === "dom" && <DomView tag={tag} />}
            </div>

            {/* Footer note */}
            <div style={{
                borderTop: `1px solid ${C.border}`,
                padding: "10px 20px",
                background: C.bg,
                flexShrink: 0,
            }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: C.ink3, lineHeight: 1.6 }}>
                    <span style={{ color: C.ink4 }}>engine note — </span>{tag.note}
                </div>
            </div>
        </div>
    );
}

// ─── BOX MODEL VIEW ──────────────────────────────────────────────────────
function BoxModelView({ tag }) {
    const g = tag.geometry;
    const isNoBox = tag.box === "none";

    // SVG dimensions
    const SVG_W = 580, SVG_H = 400;
    const CX = SVG_W / 2, CY = SVG_H / 2;

    // Box model sizes (visual, scaled)
    const mw = Math.max(50, Math.min(g.mx, 60));
    const my = Math.max(20, Math.min(g.my, 40));
    const pw = Math.max(0, Math.min(g.px, 40));
    const ph = Math.max(0, Math.min(g.py, 30));
    const bw = Math.min(g.bw * 4, 12);

    const totalW = 280, totalH = 180;
    const contentW = totalW - mw * 2 - bw * 2 - pw * 2;
    const contentH = totalH - my * 2 - bw * 2 - ph * 2;

    const mx0 = CX - totalW / 2;
    const my0 = CY - totalH / 2;

    // Colours
    const mColor = "rgba(0,0,0,0.04)";
    const bColor = "rgba(0,0,0,0.12)";
    const pColor = "rgba(0,0,0,0.07)";
    const cColor = "rgba(0,0,0,0.03)";

    return (
        <div>
            <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink4, letterSpacing: "0.12em" }}>CSS BOX MODEL</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink3 }}>— {BOX_LABELS[tag.box]}</span>
            </div>

            {isNoBox ? (
                <div style={{ border: `1px dashed ${C.border2}`, borderRadius: 4, padding: "40px 32px", textAlign: "center" }}>
                    <div style={{ fontFamily: MONO, fontSize: 28, color: C.ink5, marginBottom: 12 }}>∅</div>
                    <div style={{ fontFamily: MONO, fontSize: 13, color: C.ink3 }}>display: none — no box generated</div>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: C.ink4, marginTop: 8 }}>
                        {tag.t === "head" || tag.t === "title" || tag.t === "meta" || tag.t === "link" || tag.t === "script" || tag.t === "style"
                            ? "Metadata elements exist only in the accessibility + machine layer"
                            : "This element generates no box in the layout tree"}
                    </div>
                </div>
            ) : (
                <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ maxHeight: 420, display: "block" }}>
                    {/* Margin zone */}
                    {mw > 0 || my > 0 ? <>
                        <rect x={mx0} y={my0} width={totalW} height={totalH} fill={mColor} stroke="#ccc" strokeWidth="0.5" strokeDasharray="4 3" />
                        <text x={mx0 + 4} y={my0 - 4} fontSize="9" fontFamily={MONO} fill={C.ink4}>margin</text>
                        {mw > 0 && <text x={mx0 + mw / 2} y={CY + 3} textAnchor="middle" fontSize="8" fontFamily={MONO} fill={C.ink4}>{g.mx}px</text>}
                        {my > 0 && <text x={CX} y={my0 + my / 2 + 3} textAnchor="middle" fontSize="8" fontFamily={MONO} fill={C.ink4}>{g.my}px</text>}
                    </> : null}

                    {/* Border zone */}
                    {bw > 0 && <>
                        <rect x={mx0 + mw} y={my0 + my} width={totalW - mw * 2} height={totalH - my * 2} fill={bColor} stroke="#999" strokeWidth="1" />
                        <text x={mx0 + mw + 4} y={my0 + my - 3} fontSize="9" fontFamily={MONO} fill={C.ink4}>border</text>
                    </>}

                    {/* Padding zone */}
                    {(pw > 0 || ph > 0) && <>
                        <rect x={mx0 + mw + bw} y={my0 + my + bw} width={totalW - mw * 2 - bw * 2} height={totalH - my * 2 - bw * 2} fill={pColor} stroke="#bbb" strokeWidth="0.5" strokeDasharray="2 2" />
                        <text x={mx0 + mw + bw + 4} y={my0 + my + bw - 3} fontSize="9" fontFamily={MONO} fill={C.ink4}>padding</text>
                    </>}

                    {/* Content zone */}
                    <rect
                        x={mx0 + mw + bw + pw} y={my0 + my + bw + ph}
                        width={Math.max(30, contentW)} height={Math.max(20, contentH)}
                        fill={cColor} stroke={C.ink2} strokeWidth="1.5"
                    />
                    <text x={mx0 + mw + bw + pw + Math.max(30, contentW) / 2} y={my0 + my + bw + ph + Math.max(20, contentH) / 2 + 4}
                        textAnchor="middle" fontSize="11" fontFamily={MONO} fill={C.ink2} fontWeight="600">
                        content
                    </text>

                    {/* Dimension labels */}
                    <Bracket x1={mx0} x2={mx0 + totalW} y={my0 + totalH + 20} label={`${g.w}px`} />
                    <BracketV y1={my0} y2={my0 + totalH} x={mx0 + totalW + 20} label={`${g.h}px`} />

                    {/* display type badge */}
                    <rect x={SVG_W - 120} y={8} width={112} height={22} fill={C.ink} rx="3" />
                    <text x={SVG_W - 64} y={22} textAnchor="middle" fontSize="9" fontFamily={MONO} fill="white" letterSpacing="0.08em">
                        display: {tag.display}
                    </text>

                    {/* Replaced badge */}
                    {tag.replaced && (
                        <g>
                            <rect x={SVG_W - 120} y={36} width={112} height={18} fill="none" stroke={C.ink} strokeWidth="1" rx="3" />
                            <text x={SVG_W - 64} y={48} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={C.ink} letterSpacing="0.06em">replaced element</text>
                        </g>
                    )}

                    {/* void badge */}
                    {tag.void && (
                        <g>
                            <rect x={SVG_W - 120} y={60} width={112} height={18} fill="none" stroke={C.border2} strokeWidth="1" rx="3" strokeDasharray="3 2" />
                            <text x={SVG_W - 64} y={72} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={C.ink4} letterSpacing="0.06em">void element</text>
                        </g>
                    )}

                    {/* UA default */}
                    <text x={8} y={SVG_H - 12} fontSize="9" fontFamily={MONO} fill={C.ink4}>UA: {tag.ua}</text>
                </svg>
            )}

            {/* Stats row */}
            <div style={{ display: "flex", gap: 1, marginTop: 16 }}>
                {[
                    ["Display", tag.display],
                    ["Box Type", tag.box],
                    ["Replaced", tag.replaced ? "yes" : "no"],
                    ["Void", tag.void ? "yes" : "no"],
                    ["ARIA", tag.aria],
                ].map(([k, v]) => (
                    <div key={k} style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, padding: "8px 10px" }}>
                        <div style={{ fontFamily: MONO, fontSize: 9, color: C.ink4, letterSpacing: "0.12em", marginBottom: 4 }}>{k.toUpperCase()}</div>
                        <div style={{ fontFamily: MONO, fontSize: 11, color: C.ink2 }}>{v}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Bracket({ x1, x2, y, label }) {
    return (
        <g>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.ink4} strokeWidth="0.8" />
            <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={C.ink4} strokeWidth="0.8" />
            <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={C.ink4} strokeWidth="0.8" />
            <text x={(x1 + x2) / 2} y={y + 12} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={C.ink4}>{label}</text>
        </g>
    );
}
function BracketV({ y1, y2, x, label }) {
    return (
        <g>
            <line x1={x} y1={y1} x2={x} y2={y2} stroke={C.ink4} strokeWidth="0.8" />
            <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke={C.ink4} strokeWidth="0.8" />
            <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke={C.ink4} strokeWidth="0.8" />
            <text x={x + 12} y={(y1 + y2) / 2 + 3} fontSize="9" fontFamily={MONO} fill={C.ink4}>{label}</text>
        </g>
    );
}

// ─── LAYERS VIEW ─────────────────────────────────────────────────────────
const LAYER_DEFS = {
    "none": { z: 0, fill: "#f0f0f0", label: "No Layer", desc: "Element has no box or layer" },
    "block-flow": { z: 1, fill: "#FFFFFF", label: "Block Flow", desc: "Normal block formatting context" },
    "inline-flow": { z: 1, fill: "#FAFAFA", label: "Inline Flow", desc: "Inline formatting context (line boxes)" },
    "marker": { z: 2, fill: "#F5F5F5", label: "Marker Box", desc: "list-item generates a separate marker box" },
    "table": { z: 1, fill: "#F8F8F8", label: "Table Layer", desc: "Table formatting context (rows, cols, cells)" },
    "replaced": { z: 2, fill: "#F0F0F0", label: "Replaced Content", desc: "External content, not CSS-painted" },
    "stacking": { z: 3, fill: "#EBEBEB", label: "Stacking Context", desc: "Promotes to own stacking context" },
    "stacking-context": { z: 3, fill: "#EBEBEB", label: "Stacking Context", desc: "Creates new stacking context" },
    "shadow-dom": { z: 4, fill: "#E8E8E8", label: "Shadow DOM", desc: "Inside shadow tree — separate DOM" },
    "top-layer": { z: 5, fill: "#E0E0E0", label: "Top Layer", desc: "Above all stacking contexts — dialogs, popovers" },
    "document-root": { z: 0, fill: "#F8F8F8", label: "Document Root", desc: "Initial containing block" },
};

function LayersView({ tag }) {
    const layers = tag.layers.filter(l => l !== "none");
    const hasLayers = layers.length > 0 && tag.box !== "none";
    const SVG_W = 580, SVG_H = 360;

    if (!hasLayers) {
        return (
            <div style={{ border: `1px dashed ${C.border2}`, borderRadius: 4, padding: 40, textAlign: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: 13, color: C.ink3 }}>
                    No render layer — element generates no box
                </div>
            </div>
        );
    }

    const layerData = layers.map(l => ({ id: l, ...(LAYER_DEFS[l] || { z: 1, fill: "#FFF", label: l, desc: "" }) }))
        .sort((a, b) => a.z - b.z);

    return (
        <div>
            <div style={{ marginBottom: 16, fontFamily: MONO, fontSize: 11, color: C.ink4, letterSpacing: "0.12em" }}>RENDER LAYERS — ISOMETRIC VIEW</div>
            <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ maxHeight: 380 }}>
                {layerData.map((layer, i) => {
                    const depth = i * 48;
                    const lx = 100 + i * 8, ly = 80 + i * 8;
                    const lw = 340, lh = 120;
                    return (
                        <g key={layer.id}>
                            <IsoBox
                                x={lx} y={ly} z={0}
                                w={lw} h={lh} d={36}
                                fill={layer.fill}
                                stroke={i === layerData.length - 1 ? C.ink : "#AAA"}
                                label={null}
                                opacity={1}
                            />
                            <text x={lx + 6} y={ly - 4}
                                fontSize="9" fontFamily={MONO}
                                fill={C.ink3} letterSpacing="0.05em">
                                z={layer.z} — {layer.label}
                            </text>
                        </g>
                    );
                })}
                {/* Element tag in front face of last box */}
                {(() => {
                    const last = layerData[layerData.length - 1];
                    const i = layerData.length - 1;
                    const lx = 100 + i * 8, ly = 80 + i * 8;
                    const lw = 340, lh = 120;
                    const ISO_X = 0.707, ISO_Y = 0.354;
                    const fx = lx + (lw / 2) * ISO_X - 36 * ISO_X;
                    const fy = ly + (lw / 2) * ISO_Y + lh / 2 + 36 * ISO_Y;
                    return (
                        <text x={fx} y={fy + 4} textAnchor="middle" fontSize="13"
                            fontFamily={MONO} fill={C.ink} fontWeight="600">
                            &lt;{tag.t}&gt;
                        </text>
                    );
                })()}
            </svg>

            {/* Layer details */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 8, marginTop: 12 }}>
                {layerData.map(layer => (
                    <div key={layer.id} style={{ border: `1px solid ${C.border}`, padding: "10px 12px", background: C.bg }}>
                        <div style={{ fontFamily: MONO, fontSize: 10, color: C.ink4, marginBottom: 4, letterSpacing: "0.1em" }}>
                            Z-LEVEL {layer.z}
                        </div>
                        <div style={{ fontFamily: MONO, fontSize: 12, color: C.ink2, marginBottom: 4 }}>{layer.label}</div>
                        <div style={{ fontFamily: MONO, fontSize: 10, color: C.ink3, lineHeight: 1.5 }}>{layer.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── FLOW VIEW ──────────────────────────────────────────────────────────
function FlowView({ tag }) {
    const isBlock = tag.display === "block" || tag.display === "table" || tag.display === "list-item";
    const isInline = tag.display === "inline" || tag.display === "inline-block";
    const isNone = tag.display === "none" || tag.box === "none";
    const isTable = tag.display.startsWith("table");

    const SVG_W = 580, SVG_H = 340;

    return (
        <div>
            <div style={{ marginBottom: 16, fontFamily: MONO, fontSize: 11, color: C.ink4, letterSpacing: "0.12em" }}>
                FORMATTING CONTEXT — {isBlock ? "BLOCK FLOW" : isInline ? "INLINE FLOW" : isTable ? "TABLE LAYOUT" : isNone ? "NO FLOW" : "SPECIAL"}
            </div>

            {isNone ? (
                <div style={{ border: `1px dashed ${C.border2}`, borderRadius: 4, padding: 40, textAlign: "center" }}>
                    <div style={{ fontFamily: MONO, fontSize: 13, color: C.ink3 }}>
                        Not in normal flow — display: none
                    </div>
                </div>
            ) : (
                <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ maxHeight: 360 }}>
                    {/* Containing block */}
                    <rect x={40} y={20} width={500} height={300} fill="none" stroke={C.border2} strokeWidth="1" strokeDasharray="4 3" />
                    <text x={44} y={14} fontSize="9" fontFamily={MONO} fill={C.ink4}>containing block</text>

                    {isBlock && <BlockFlowDiagram tag={tag} />}
                    {isInline && <InlineFlowDiagram tag={tag} />}
                    {isTable && <TableFlowDiagram tag={tag} />}
                </svg>
            )}
        </div>
    );
}

function BlockFlowDiagram({ tag }) {
    const boxes = [
        { x: 40, y: 20, w: 500, h: 40, label: "previous sibling", opacity: 0.3 },
        { x: 40, y: 68, w: 500, h: 80, label: `<${tag.t}> — full width block`, opacity: 1, active: true },
        { x: 40, y: 156, w: 500, h: 40, label: "next sibling", opacity: 0.3 },
    ];
    // margin collapse indicators
    const g = tag.geometry;
    return (
        <g transform="translate(0,0)">
            {boxes.map((b, i) => (
                <g key={i} opacity={b.opacity}>
                    <rect x={b.x} y={b.y + 20} width={b.w} height={b.h} fill={b.active ? "rgba(0,0,0,0.04)" : "none"} stroke={b.active ? C.ink : C.border2} strokeWidth={b.active ? 1.5 : 0.8} />
                    <text x={b.x + b.w / 2} y={b.y + 20 + b.h / 2 + 4} textAnchor="middle" fontSize={b.active ? 11 : 9} fontFamily={MONO} fill={b.active ? C.ink : C.ink4}>{b.label}</text>
                </g>
            ))}
            {/* Width arrows */}
            <line x1={40} y1={220} x2={540} y2={220} stroke={C.ink4} strokeWidth="0.8" />
            <line x1={40} y1={215} x2={40} y2={225} stroke={C.ink4} strokeWidth="0.8" />
            <line x1={540} y1={215} x2={540} y2={225} stroke={C.ink4} strokeWidth="0.8" />
            <text x={290} y={232} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={C.ink4}>100% of containing block width</text>

            {/* Margin collapse annotation */}
            {tag.geometry.my > 0 && (
                <g>
                    <line x1={555} y1={88} x2={555} y2={148} stroke={C.red} strokeWidth="0.8" strokeDasharray="2 2" />
                    <text x={560} y={122} fontSize="8" fontFamily={MONO} fill={C.red}>margin collapses</text>
                </g>
            )}

            {/* display tag */}
            <rect x={44} y={24} width={120} height={16} fill={C.ink} />
            <text x={48} y={35} fontSize="8" fontFamily={MONO} fill="white">display: {tag.display}</text>
        </g>
    );
}

function InlineFlowDiagram({ tag }) {
    // Show line boxes with inline elements
    return (
        <g transform="translate(0,0)">
            {/* Line boxes */}
            {[0, 1, 2].map(i => (
                <g key={i}>
                    <rect x={40} y={40 + i * 64} width={500} height={48} fill="none" stroke={C.border2} strokeWidth="0.5" strokeDasharray="3 2" />
                    <text x={44} y={38 + i * 64} fontSize="8" fontFamily={MONO} fill={C.ink4}>line box {i + 1}</text>
                    {/* inline elements in line */}
                    {i === 0 && <>
                        <rect x={44} y={44 + i * 64} width={60} height={38} fill="rgba(0,0,0,0.03)" stroke={C.border2} strokeWidth="0.8" />
                        <text x={74} y={66 + i * 64} textAnchor="middle" fontSize="8" fontFamily={MONO} fill={C.ink4}>text</text>
                        <rect x={110} y={44 + i * 64} width={80} height={38} fill="rgba(0,0,0,0.06)" stroke={C.ink} strokeWidth="1.5" />
                        <text x={150} y={60 + i * 64} textAnchor="middle" fontSize="10" fontFamily={MONO} fill={C.ink}>&lt;{tag.t}&gt;</text>
                        <text x={150} y={74 + i * 64} textAnchor="middle" fontSize="8" fontFamily={MONO} fill={C.ink3}>{tag.geometry.w}×{tag.geometry.h}px</text>
                        <rect x={196} y={44 + i * 64} width={50} height={38} fill="rgba(0,0,0,0.03)" stroke={C.border2} strokeWidth="0.8" />
                        <text x={221} y={66 + i * 64} textAnchor="middle" fontSize="8" fontFamily={MONO} fill={C.ink4}>text</text>
                    </>}
                    {i > 0 && <>
                        <rect x={44} y={44 + i * 64} width={40 + i * 30} height={38} fill="rgba(0,0,0,0.03)" stroke={C.border2} strokeWidth="0.5" />
                        <text x={64 + i * 15} y={66 + i * 64} textAnchor="middle" fontSize="8" fontFamily={MONO} fill={C.ink5}>other content</text>
                    </>}
                </g>
            ))}
            {/* inline note */}
            <text x={290} y={240} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={C.ink4}>
                inline elements flow horizontally inside line boxes
            </text>
            <rect x={44} y={24} width={120} height={16} fill={C.ink} />
            <text x={48} y={35} fontSize="8" fontFamily={MONO} fill="white">display: {tag.display}</text>
        </g>
    );
}

function TableFlowDiagram({ tag }) {
    return (
        <g transform="translate(0,0)">
            <rect x={60} y={30} width={460} height={240} fill="none" stroke={C.border2} strokeWidth="0.8" strokeDasharray="3 2" />
            <text x={64} y={26} fontSize="8" fontFamily={MONO} fill={C.ink4}>table wrapper block</text>
            {/* rows */}
            {[0, 1, 2].map(r => (
                <g key={r}>
                    {[0, 1, 2, 3].map(c => (
                        <rect key={c}
                            x={64 + c * 113} y={38 + r * 72}
                            width={110} height={68}
                            fill={r === 0 ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.02)"}
                            stroke={C.border2} strokeWidth={r === 0 ? 1 : 0.5}
                        />
                    ))}
                    <text x={60} y={78 + r * 72} textAnchor="end" fontSize="8" fontFamily={MONO} fill={C.ink4}>{r === 0 ? "thead" : "tbody"}</text>
                </g>
            ))}
            <rect x={44} y={24} width={140} height={16} fill={C.ink} />
            <text x={48} y={35} fontSize="8" fontFamily={MONO} fill="white">display: {tag.display}</text>
            {/* current element highlight */}
            <rect x={64} y={38} width={110} height={68} fill="none" stroke={C.ink} strokeWidth="2" />
            <text x={119} y={76} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={C.ink}>&lt;{tag.t}&gt;</text>
        </g>
    );
}

// ─── DOM VIEW ───────────────────────────────────────────────────────────
function DomView({ tag }) {
    const SVG_W = 580, SVG_H = 340;

    // Build a simple DOM tree showing where this element sits
    const treeNodes: any[] = [
        { id: "html", label: "html", x: 290, y: 30, parent: null, active: false, text: false },
        { id: "head", label: "head", x: 160, y: 90, parent: "html", active: false, text: false },
        { id: "body", label: "body", x: 420, y: 90, parent: "html", active: false, text: false },
    ];

    // Add current tag in appropriate position
    const cat = tag.cat;
    const isMetadata = ["Document"].includes(cat) && !["html", "body"].includes(tag.t);
    const parentId = isMetadata ? "head" : "body";

    if (!["html", "head", "body"].includes(tag.t)) {
        treeNodes.push({ id: tag.t, label: tag.t, x: parentId === "head" ? 160 : 420, y: 160, parent: parentId, active: true });
        if (!["void", "none"].includes(tag.box) && !tag.void) {
            treeNodes.push({ id: "text", label: "#text", x: parentId === "head" ? 160 : 420, y: 230, parent: tag.t, text: true });
        }
    }

    const nodeMap = {};
    treeNodes.forEach(n => nodeMap[n.id] = n);

    return (
        <div>
            <div style={{ marginBottom: 16, fontFamily: MONO, fontSize: 11, color: C.ink4, letterSpacing: "0.12em" }}>DOM TREE POSITION</div>
            <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ maxHeight: 360 }}>
                {/* Edges */}
                {treeNodes.filter(n => n.parent).map(n => {
                    const p = nodeMap[n.parent];
                    if (!p) return null;
                    return <line key={n.id + "e"} x1={p.x} y1={p.y + 16} x2={n.x} y2={n.y - 16} stroke={C.border2} strokeWidth="1" />;
                })}

                {/* Nodes */}
                {treeNodes.map(n => (
                    <g key={n.id}>
                        <rect x={n.x - 36} y={n.y - 14} width={72} height={28}
                            fill={n.active ? "#0A0A0A" : n.text ? "#F8F8F8" : "white"}
                            stroke={n.active ? "#0A0A0A" : n.text ? C.border2 : C.border2}
                            strokeWidth={n.active ? 1.5 : 1}
                            rx="3"
                        />
                        <text x={n.x} y={n.y + 4} textAnchor="middle"
                            fontSize={10} fontFamily={MONO}
                            fill={n.active ? "white" : n.text ? C.ink4 : C.ink2}>
                            {n.active ? `<${n.label}>` : n.text ? n.label : `<${n.label}>`}
                        </text>
                    </g>
                ))}

                {/* DOM Interface label */}
                {(() => {
                    const active = treeNodes.find(n => n.active);
                    if (!active) return null;
                    return (
                        <g>
                            <line x1={active.x + 36} y1={active.y} x2={active.x + 80} y2={active.y} stroke={C.ink4} strokeWidth="0.8" strokeDasharray="3 2" />
                            <rect x={active.x + 80} y={active.y - 12} width={160} height={24} fill={C.bg} stroke={C.border} strokeWidth="1" rx="2" />
                            <text x={active.x + 160} y={active.y + 4} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={C.ink3}>
                                {tag.dom || "HTMLElement"}
                            </text>
                        </g>
                    );
                })()}

                {/* Annotations */}
                <text x={290} y={SVG_H - 10} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={C.ink4}>
                    DOM Interface: {tag.dom}
                </text>
            </svg>

            {/* Properties */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                {[
                    ["DOM Interface", tag.dom],
                    ["ARIA Role", tag.aria],
                    ["Category", tag.cat],
                    ["Void", tag.void ? "Yes — no children allowed" : "No — can have children"],
                    ["UA Stylesheet", tag.ua],
                    ["Render Layers", tag.layers.join(", ")],
                ].map(([k, v]) => (
                    <div key={k} style={{ border: `1px solid ${C.border}`, padding: "10px 12px", background: C.bg }}>
                        <div style={{ fontFamily: MONO, fontSize: 9, color: C.ink4, marginBottom: 4, letterSpacing: "0.1em" }}>{k.toUpperCase()}</div>
                        <div style={{ fontFamily: MONO, fontSize: 11, color: C.ink2, lineHeight: 1.5 }}>{v}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── LEFT PANEL ─────────────────────────────────────────────────────────
function TagList({ selected, onSelect }) {
    const [search, setSearch] = useState("");
    const [openCats, setOpenCats] = useState(new Set(CATEGORIES));

    const filtered = search.trim()
        ? TAGS.filter(t => t.t.includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
        : null;

    const toggleCat = (cat) => {
        setOpenCats(prev => {
            const next = new Set(prev);
            next.has(cat) ? next.delete(cat) : next.add(cat);
            return next;
        });
    };

    return (
        <div style={{
            width: "100%", height: "100%", display: "flex", flexDirection: "column", background: ZINC[50], overflow: "hidden"
        }}>
            {/* Search */}
            <div style={{ padding: "12px 12px 8px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="search tags..."
                    style={{
                        width: "100%", boxSizing: "border-box",
                        background: "white", border: `1px solid ${C.border2}`,
                        borderRadius: 3, padding: "6px 10px",
                        fontSize: 11, fontFamily: MONO,
                        color: C.ink, outline: "none",
                    }}
                />
            </div>

            {/* Tag list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
                {filtered ? (
                    filtered.map(tag => (
                        <TagItem key={tag.t} tag={tag} selected={selected?.t === tag.t} onSelect={onSelect} />
                    ))
                ) : (
                    CATEGORIES.map(cat => (
                        <div key={cat}>
                            <button onClick={() => toggleCat(cat)} style={{
                                width: "100%", background: "none", border: "none",
                                borderBottom: `1px solid ${C.border}`,
                                padding: "7px 12px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                cursor: "pointer",
                                fontFamily: MONO, fontSize: 9,
                                color: C.ink4, letterSpacing: "0.12em",
                                textAlign: "left",
                            }}>
                                <span>{cat.toUpperCase()}</span>
                                <span style={{ color: C.ink5 }}>
                                    {openCats.has(cat) ? "−" : "+"}
                                </span>
                            </button>
                            {openCats.has(cat) && TAGS.filter(t => t.cat === cat).map(tag => (
                                <TagItem key={tag.t} tag={tag} selected={selected?.t === tag.t} onSelect={onSelect} />
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div style={{ padding: "8px 12px", borderTop: `1px solid ${C.border}`, flexShrink: 0, background: ZINC[50] }}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.ink5 }}>
                    {TAGS.length} elements · {CATEGORIES.length} categories
                </div>
            </div>
        </div>
    );
}

function TagItem({ tag, selected, onSelect }) {
    const displayColor = {
        "block": C.ink2,
        "inline": C.ink3,
        "inline-block": C.ink3,
        "none": C.ink5,
        "table": C.ink3,
        "list-item": C.ink2,
    }[tag.display] || C.ink4;

    return (
        <button onClick={() => onSelect(tag)} style={{
            width: "100%", background: selected ? ZINC[950] : "transparent",
            border: "none",
            borderBottom: `1px solid ${selected ? "transparent" : ZINC[200]}`,
            borderLeft: selected ? `4px solid ${ZINC[50]}` : "4px solid transparent",
            padding: "10px 16px",
            display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", textAlign: "left",
            transition: "all 0.15s",
        }}>
            <code style={{
                fontFamily: MONO, fontSize: 13,
                color: selected ? ZINC[0] : ZINC[900],
                fontWeight: selected ? 600 : 400,
                minWidth: 80,
            }}>
                &lt;{tag.t}&gt;{tag.void ? "/" : ""}
            </code>
            <span style={{
                fontFamily: SANS, fontSize: 11,
                color: selected ? ZINC[400] : displayColor,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
                {tag.display}
            </span>
        </button>
    );
}

// ─── MAIN TAB COMPONENT ────────────────────────────────────────────────────────
export default function GeometryVisualizerTab() {
    const [selected, setSelected] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(240);

    const onMouseDownSidebar = useCallback((e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarWidth;
        const onMouseMove = (moveEvent) => setSidebarWidth(Math.max(200, Math.min(startWidth + moveEvent.clientX - startX, 600)));
        const onMouseUp = () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }, [sidebarWidth]);

    return (
        <div style={{ flex: 1, display: "flex", overflow: "hidden", background: ZINC[0] }}>
            <div style={{ width: sidebarWidth, flexShrink: 0, position: "relative", display: "flex", borderRight: `1px solid ${ZINC[200]}` }}>
                <TagList selected={selected} onSelect={setSelected} />
                <div onMouseDown={onMouseDownSidebar} style={{ position: "absolute", right: -4, top: 0, bottom: 0, width: 8, cursor: "col-resize", zIndex: 10 }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <BrowserCanvas tag={selected} />
            </div>
        </div>
    );
}