import { useState, useRef, useEffect, useMemo, useCallback } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
    bg: "#ffffff",
    surface: "#fafafa",
    surfaceHover: "#f4f4f4",
    border: "#e8e8e8",
    borderStrong: "#d0d0d0",
    ink: "#0a0a0a",
    ink2: "#2a2a2a",
    ink3: "#555",
    ink4: "#888",
    ink5: "#bbb",
    accent: "#0a0a0a",
    accentFg: "#ffffff",
    highlight: "#f0f0f0",
    active: "#0a0a0a",
    activeFg: "#fff",
    tag: "#f5f5f5",
    tagBorder: "#e0e0e0",
};

const MONO = "'JetBrains Mono', 'Courier New', monospace";
const SANS = "'Epilogue', system-ui, sans-serif";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FAMILIES = {
    global: { label: "Global", bg: "#0a0a0a", fg: "#fff" },
    form: { label: "Form", bg: "#1a1a1a", fg: "#fff" },
    media: { label: "Media", bg: "#2d2d2d", fg: "#fff" },
    link: { label: "Link", bg: "#404040", fg: "#fff" },
    security: { label: "Security", bg: "#555", fg: "#fff" },
    table: { label: "Table", bg: "#666", fg: "#fff" },
    embedded: { label: "Embedded", bg: "#777", fg: "#fff" },
    text: { label: "Text", bg: "#888", fg: "#fff" },
    list: { label: "List", bg: "#999", fg: "#fff" },
    interactive: { label: "Interactive", bg: "#aaa", fg: "#000" },
};

const ATTR_DEFS = {
    // GLOBAL
    id: { f: "global", t: "string", d: "Unique element ID", u: "CSS #id, getElementById, anchor links" },
    class: { f: "global", t: "string", d: "Space-separated class names", u: "CSS .class, classList API, styling hooks" },
    style: { f: "global", t: "CSS", d: "Inline CSS declarations", u: "Dynamic styles, JS animation, overrides" },
    title: { f: "global", t: "string", d: "Advisory tooltip text", u: "Hover tooltips, abbr expansion" },
    lang: { f: "global", t: "BCP47", d: "Language code", u: "Screen readers, spell-check, :lang() CSS" },
    dir: { f: "global", t: "ltr|rtl|auto", d: "Text direction", u: "RTL languages: Arabic, Hebrew" },
    tabindex: { f: "global", t: "integer", d: "Tab order: 0=natural, -1=none", u: "Custom focus order, make div focusable" },
    hidden: { f: "global", t: "boolean", d: "Hides element (display:none)", u: "Conditional visibility, JS toggle" },
    contenteditable: { f: "global", t: "true|false", d: "Makes element user-editable", u: "Rich text editors, inline CMS" },
    draggable: { f: "global", t: "boolean", d: "Enables Drag & Drop API", u: "Kanban, sortable lists, file reorder" },
    spellcheck: { f: "global", t: "boolean", d: "Spell-checking on/off", u: "Off for code editors, on for textareas" },
    translate: { f: "global", t: "yes|no", d: "Allow translation", u: "Protect brand names, code snippets" },
    accesskey: { f: "global", t: "char", d: "Keyboard shortcut", u: "Power-user keyboard navigation" },
    autofocus: { f: "global", t: "boolean", d: "Auto-focus on page load", u: "Search bars, first form field, dialogs" },
    inert: { f: "global", t: "boolean", d: "Non-interactive + hidden from AT", u: "Off-screen modals, inactive panels" },
    inputmode: { f: "global", t: "enum", d: "Virtual keyboard hint", u: "numeric/tel/email/url for mobile UX" },
    enterkeyhint: { f: "global", t: "enum", d: "Enter key label on mobile", u: "done/go/next/search/send for forms" },
    popover: { f: "global", t: "auto|manual", d: "Marks element as popover", u: "Tooltips, dropdowns, non-modal overlays" },
    nonce: { f: "global", t: "string", d: "CSP nonce", u: "Inline script/style CSP whitelisting" },
    slot: { f: "global", t: "string", d: "Shadow DOM slot assignment", u: "Web component content projection" },
    part: { f: "global", t: "string", d: "Expose for ::part() CSS", u: "Web component external styling" },
    "data-*": { f: "global", t: "string", d: "Custom data attribute", u: "Store state/config via dataset API" },
    "aria-*": { f: "global", t: "various", d: "WAI-ARIA accessibility attrs", u: "Roles, states, props for screen readers" },
    // FORM
    name: { f: "form", t: "string", d: "Field name in form submission", u: "Key in name=value pair sent to server" },
    value: { f: "form", t: "string", d: "Current field value", u: "Default value, button label, pre-fill" },
    type: { f: "form", t: "enum", d: "Input type (22 variants)", u: "text|email|password|number|checkbox|..." },
    disabled: { f: "form", t: "boolean", d: "Inactive, not submitted", u: "Loading states, conditional fields" },
    required: { f: "form", t: "boolean", d: "Must have value to submit", u: "Built-in HTML validation, no JS needed" },
    readonly: { f: "form", t: "boolean", d: "Not editable, IS submitted", u: "Display current value user can't change" },
    placeholder: { f: "form", t: "string", d: "Hint text when empty", u: "Example input — NOT a label replacement" },
    autocomplete: { f: "form", t: "keyword", d: "Autofill field hint", u: "name/email/address-line1/cc-number/..." },
    pattern: { f: "form", t: "regex", d: "Regex validation pattern", u: "Postal codes, phone formats, custom rules" },
    min: { f: "form", t: "number|date", d: "Minimum value", u: "Date pickers, quantity minimums" },
    max: { f: "form", t: "number|date", d: "Maximum value", u: "Quantity limits, date ceilings" },
    step: { f: "form", t: "number|any", d: "Value increment interval", u: "0.01 for currency, 1 for integers" },
    maxlength: { f: "form", t: "integer", d: "Maximum character count", u: "Enforce char limits, tweet-style counters" },
    minlength: { f: "form", t: "integer", d: "Minimum character count", u: "Password length, minimum content" },
    multiple: { f: "form", t: "boolean", d: "Allow multiple values", u: "Multi-file upload, comma emails" },
    accept: { f: "form", t: "MIME list", d: "Accepted file types", u: "image/*, .pdf, video/mp4 filter" },
    capture: { f: "form", t: "user|env", d: "Camera source on mobile", u: "user=front cam, environment=rear cam" },
    checked: { f: "form", t: "boolean", d: "Default checked state", u: "Pre-check agreement boxes, default radio" },
    list: { f: "form", t: "ID", d: "Datalist ID for autocomplete", u: "Autocomplete with free-text fallback" },
    size: { f: "form", t: "integer", d: "Visible character width", u: "Visual width hint — prefer CSS instead" },
    form: { f: "form", t: "ID", d: "Associate with external form", u: "Input/button outside its form element" },
    formaction: { f: "form", t: "URL", d: "Override form action URL", u: "Multiple submit paths from one form" },
    formmethod: { f: "form", t: "get|post", d: "Override form method", u: "Different HTTP method per button" },
    formnovalidate: { f: "form", t: "boolean", d: "Skip validation for this submit", u: "Save draft bypassing required fields" },
    formtarget: { f: "form", t: "target", d: "Override form target", u: "Open response in new tab for one button" },
    rows: { f: "form", t: "integer", d: "Visible rows (textarea)", u: "Initial height — prefer CSS for precision" },
    cols: { f: "form", t: "integer", d: "Visible columns (textarea)", u: "Width hint — prefer CSS width" },
    wrap: { f: "form", t: "soft|hard", d: "Line break submission mode", u: "hard includes actual newlines in value" },
    for: { f: "form", t: "ID", d: "Associated control ID", u: "Click label → focus/activate its input" },
    action: { f: "form", t: "URL", d: "Form submission URL", u: "Server endpoint. Empty = current URL." },
    method: { f: "form", t: "get|post|dialog", d: "HTTP method", u: "get=URL params, post=body, dialog=close" },
    enctype: { f: "form", t: "MIME", d: "POST encoding type", u: "multipart/form-data for file uploads" },
    novalidate: { f: "form", t: "boolean", d: "Disable browser validation", u: "Use custom validation instead" },
    "popovertarget": { f: "form", t: "ID", d: "Popover element to control", u: "Toggle popover without JavaScript" },
    "popovertargetaction": { f: "form", t: "toggle|show|hide", d: "What to do with popover", u: "Explicit show/hide vs default toggle" },
    span: { f: "table", t: "integer", d: "Columns spanned", u: "Style multiple contiguous columns" },
    scope: { f: "table", t: "col|row|...", d: "Header direction", u: "col/row — key for screen reader tables" },
    colspan: { f: "table", t: "integer", d: "Span multiple columns", u: "Merged cells. Max: 1000." },
    rowspan: { f: "table", t: "integer", d: "Span multiple rows", u: "Merged cells. Max: 65534. 0=to end." },
    headers: { f: "table", t: "ID list", d: "Associated header cell IDs", u: "Complex tables with multiple headers" },
    abbr: { f: "table", t: "string", d: "Abbreviated header label", u: "Screen readers use abbr when reading cells" },
    // MEDIA
    src: { f: "media", t: "URL", d: "Resource URL", u: "Image, video, audio, script, iframe source" },
    controls: { f: "media", t: "boolean", d: "Show browser playback controls", u: "Always add for accessibility" },
    autoplay: { f: "media", t: "boolean", d: "Auto-play on load", u: "Must combine with muted or browsers block" },
    muted: { f: "media", t: "boolean", d: "Start with audio muted", u: "Required for autoplay in most browsers" },
    loop: { f: "media", t: "boolean", d: "Loop media continuously", u: "Background videos, ambient sounds" },
    poster: { f: "media", t: "URL", d: "Thumbnail shown before play", u: "Preview image for video element" },
    preload: { f: "media", t: "none|meta|auto", d: "Preload strategy", u: "none=mobile data save, auto=fast play" },
    playsinline: { f: "media", t: "boolean", d: "Play inline on iOS", u: "Mobile web apps needing inline video" },
    kind: { f: "media", t: "enum", d: "Track type", u: "subtitles|captions|chapters|metadata" },
    srclang: { f: "media", t: "BCP47", d: "Track language", u: "Required when kind=subtitles" },
    label: { f: "media", t: "string", d: "User-facing track label", u: "'English', 'French' in subtitle menu" },
    default: { f: "media", t: "boolean", d: "Enable track by default", u: "Auto-enable captions for accessibility" },
    // LINK
    href: { f: "link", t: "URL", d: "Destination URL or fragment", u: "Page links, anchors, mailto:, tel:" },
    target: { f: "link", t: "target", d: "Where to open the link", u: "_blank for external (add rel=noopener!)" },
    rel: { f: "link", t: "keyword list", d: "Relationship + security", u: "noopener/noreferrer/nofollow/stylesheet/..." },
    download: { f: "link", t: "string|bool", d: "Download file instead of navigate", u: "Optional value = suggested filename" },
    hreflang: { f: "link", t: "BCP47", d: "Language of linked document", u: "Cross-language link annotation for SEO" },
    ping: { f: "link", t: "URL list", d: "Notify URLs on click", u: "Analytics click tracking (transparent)" },
    referrerpolicy: { f: "security", t: "enum", d: "Referrer header control", u: "no-referrer for privacy, origin for analytics" },
    // SECURITY
    crossorigin: { f: "security", t: "anon|creds", d: "CORS policy for resource", u: "Required for canvas use of cross-origin img" },
    integrity: { f: "security", t: "hash", d: "Subresource Integrity hash", u: "Verify CDN files haven't been tampered" },
    sandbox: { f: "security", t: "token list", d: "iframe security restrictions", u: "allow-scripts, allow-forms, allow-same-origin" },
    allow: { f: "security", t: "feature list", d: "Permissions Policy features", u: "camera; microphone; fullscreen; payment" },
    allowfullscreen: { f: "security", t: "boolean", d: "Allow fullscreen API", u: "YouTube/Vimeo embeds needing fullscreen" },
    // EMBEDDED
    alt: { f: "embedded", t: "string", d: "Alternative text for image", u: "Describe content. Empty for decorative." },
    width: { f: "embedded", t: "integer", d: "Element display width", u: "Set both width+height to prevent CLS" },
    height: { f: "embedded", t: "integer", d: "Element display height", u: "Browser reserves space before load" },
    loading: { f: "embedded", t: "eager|lazy", d: "Load timing strategy", u: "lazy for below-fold images/iframes" },
    srcset: { f: "embedded", t: "URL+desc", d: "Responsive image candidates", u: "Different sizes for different resolutions" },
    sizes: { f: "embedded", t: "media+length", d: "Image display size at breakpoints", u: "Paired with srcset to pick best candidate" },
    decoding: { f: "embedded", t: "sync|async", d: "Image decode timing", u: "async prevents blocking main thread" },
    fetchpriority: { f: "embedded", t: "high|low|auto", d: "Fetch priority hint", u: "high for LCP hero images" },
    usemap: { f: "embedded", t: "#name", d: "Client-side image map ref", u: "Clickable regions on image via <map>" },
    ismap: { f: "embedded", t: "boolean", d: "Server-side image map", u: "Sends click coordinates to server" },
    srcdoc: { f: "embedded", t: "HTML", d: "Inline HTML for iframe", u: "Sandboxed preview, isolated rendering" },
    // TEXT
    cite: { f: "text", t: "URL", d: "Source URL for quote/edit", u: "Link to original source — semantic only" },
    datetime: { f: "text", t: "ISO8601", d: "Machine-readable date/time", u: "Published dates, event times, durations" },
    // LIST
    reversed: { f: "list", t: "boolean", d: "Count down instead of up", u: "Top-10 countdowns, reversed chronology" },
    start: { f: "list", t: "integer", d: "Starting ordinal number", u: "Continue numbering from prev list" },
    // INTERACTIVE
    open: { f: "interactive", t: "boolean", d: "Initially expanded/visible", u: "Pre-open details, dialog visibility" },
    "name-group": { f: "interactive", t: "string", d: "Accordion group name", u: "Exclusive open — same name = accordion" },
    shadowrootmode: { f: "interactive", t: "open|closed", d: "Declarative shadow DOM", u: "Attach shadow root without JS" },
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const CATEGORIES = [
    { id: "document", label: "Document", icon: "◈" },
    { id: "metadata", label: "Metadata", icon: "◆" },
    { id: "sectioning", label: "Sectioning", icon: "▣" },
    { id: "headings", label: "Headings", icon: "≡" },
    { id: "block", label: "Block", icon: "▪" },
    { id: "inline", label: "Inline", icon: "—" },
    { id: "lists", label: "Lists", icon: "≔" },
    { id: "embedded", label: "Embedded", icon: "⊞" },
    { id: "tables", label: "Tables", icon: "⊟" },
    { id: "forms", label: "Forms", icon: "◎" },
    { id: "interactive", label: "Interactive", icon: "◉" },
    { id: "template", label: "Template", icon: "◇" },
];

// ─── TAGS ─────────────────────────────────────────────────────────────────────
export const TAGS = [
    // DOCUMENT
    {
        t: "html", cat: "document", desc: "Root element of every webpage", void: false, replaced: false,
        specific: ["lang", "dir"],
        inherit: [],
        derives: null
    },
    {
        t: "head", cat: "document", desc: "Metadata container — invisible", void: false, replaced: false,
        specific: [],
        derives: "html"
    },
    {
        t: "body", cat: "document", desc: "All visible page content", void: false, replaced: false,
        specific: [],
        derives: "html"
    },
    {
        t: "title", cat: "document", desc: "Browser tab text and SEO title", void: false, replaced: false,
        specific: [],
        derives: "head"
    },
    {
        t: "base", cat: "document", desc: "Base URL for all relative links", void: true, replaced: false,
        specific: ["href", "target"],
        derives: "head"
    },

    // METADATA
    {
        t: "meta", cat: "metadata", desc: "Machine-readable page metadata", void: true, replaced: false,
        specific: ["charset", "name", "content", "http-equiv", "media", "property"],
        derives: "head"
    },
    {
        t: "link", cat: "metadata", desc: "External resource relationship", void: true, replaced: false,
        specific: ["rel", "href", "type", "media", "as", "crossorigin", "integrity", "sizes", "disabled", "fetchpriority"],
        derives: "head"
    },
    {
        t: "style", cat: "metadata", desc: "Embedded CSS styles", void: false, replaced: false,
        specific: ["media", "blocking", "nonce"],
        derives: "head"
    },
    {
        t: "script", cat: "metadata", desc: "JavaScript — inline or external", void: false, replaced: false,
        specific: ["src", "type", "defer", "async", "nomodule", "crossorigin", "integrity", "nonce", "blocking", "fetchpriority"],
        derives: "head"
    },
    {
        t: "noscript", cat: "metadata", desc: "Fallback when JS is disabled", void: false, replaced: false,
        specific: [],
        derives: "head"
    },

    // SECTIONING
    {
        t: "header", cat: "sectioning", desc: "Page or section header", void: false, replaced: false,
        specific: ["aria-*"],
        derives: "body"
    },
    {
        t: "nav", cat: "sectioning", desc: "Navigation landmark", void: false, replaced: false,
        specific: ["aria-*"],
        derives: "body"
    },
    {
        t: "main", cat: "sectioning", desc: "Primary page content — one per page", void: false, replaced: false,
        specific: ["aria-*"],
        derives: "body"
    },
    {
        t: "article", cat: "sectioning", desc: "Self-contained syndicatable content", void: false, replaced: false,
        specific: ["aria-*"],
        derives: "body"
    },
    {
        t: "section", cat: "sectioning", desc: "Thematic content group", void: false, replaced: false,
        specific: ["aria-*"],
        derives: "body"
    },
    {
        t: "aside", cat: "sectioning", desc: "Tangentially related sidebar", void: false, replaced: false,
        specific: ["aria-*"],
        derives: "body"
    },
    {
        t: "footer", cat: "sectioning", desc: "Page or section footer", void: false, replaced: false,
        specific: ["aria-*"],
        derives: "body"
    },
    {
        t: "address", cat: "sectioning", desc: "Contact info for author", void: false, replaced: false,
        specific: [],
        derives: "article"
    },

    // HEADINGS
    {
        t: "h1", cat: "headings", desc: "Top-level heading — one per page", void: false, replaced: false,
        specific: [],
        derives: "body"
    },
    {
        t: "h2", cat: "headings", desc: "Major section heading", void: false, replaced: false,
        specific: [],
        derives: "h1"
    },
    {
        t: "h3", cat: "headings", desc: "Sub-section heading", void: false, replaced: false,
        specific: [],
        derives: "h2"
    },
    {
        t: "h4", cat: "headings", desc: "Deep sub-heading", void: false, replaced: false,
        specific: [],
        derives: "h3"
    },
    {
        t: "h5", cat: "headings", desc: "Very deep sub-heading", void: false, replaced: false,
        specific: [],
        derives: "h4"
    },
    {
        t: "h6", cat: "headings", desc: "Deepest heading level", void: false, replaced: false,
        specific: [],
        derives: "h5"
    },
    {
        t: "hgroup", cat: "headings", desc: "Heading + subtitle group", void: false, replaced: false,
        specific: [],
        derives: "h1"
    },

    // BLOCK
    {
        t: "div", cat: "block", desc: "Generic block container", void: false, replaced: false,
        specific: [],
        derives: "body"
    },
    {
        t: "p", cat: "block", desc: "Paragraph of text", void: false, replaced: false,
        specific: [],
        derives: "div"
    },
    {
        t: "pre", cat: "block", desc: "Preformatted text — preserves whitespace", void: false, replaced: false,
        specific: [],
        derives: "div"
    },
    {
        t: "blockquote", cat: "block", desc: "Extended block quotation", void: false, replaced: false,
        specific: ["cite"],
        derives: "div"
    },
    {
        t: "figure", cat: "block", desc: "Self-contained illustration", void: false, replaced: false,
        specific: [],
        derives: "div"
    },
    {
        t: "figcaption", cat: "block", desc: "Caption for figure element", void: false, replaced: false,
        specific: [],
        derives: "figure"
    },
    {
        t: "hr", cat: "block", desc: "Thematic break", void: true, replaced: false,
        specific: [],
        derives: "div"
    },

    // INLINE
    {
        t: "span", cat: "inline", desc: "Generic inline container", void: false, replaced: false,
        specific: [],
        derives: "p"
    },
    {
        t: "a", cat: "inline", desc: "Hyperlink", void: false, replaced: false,
        specific: ["href", "target", "rel", "download", "hreflang", "ping", "referrerpolicy", "type"],
        derives: "span"
    },
    {
        t: "em", cat: "inline", desc: "Stress emphasis", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "strong", cat: "inline", desc: "Strong importance / urgency", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "code", cat: "inline", desc: "Inline code fragment", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "mark", cat: "inline", desc: "Highlighted text", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "time", cat: "inline", desc: "Machine-readable date/time", void: false, replaced: false,
        specific: ["datetime"],
        derives: "span"
    },
    {
        t: "abbr", cat: "inline", desc: "Abbreviation with expansion", void: false, replaced: false,
        specific: ["title"],
        derives: "span"
    },
    {
        t: "q", cat: "inline", desc: "Inline quotation", void: false, replaced: false,
        specific: ["cite"],
        derives: "span"
    },
    {
        t: "cite", cat: "inline", desc: "Title of a creative work", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "dfn", cat: "inline", desc: "Defining instance of a term", void: false, replaced: false,
        specific: ["title"],
        derives: "span"
    },
    {
        t: "del", cat: "inline", desc: "Deleted text — tracked edit", void: false, replaced: false,
        specific: ["cite", "datetime"],
        derives: "span"
    },
    {
        t: "ins", cat: "inline", desc: "Inserted text — tracked edit", void: false, replaced: false,
        specific: ["cite", "datetime"],
        derives: "span"
    },
    {
        t: "small", cat: "inline", desc: "Fine print, copyright, legal", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "sub", cat: "inline", desc: "Subscript text", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "sup", cat: "inline", desc: "Superscript text", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "b", cat: "inline", desc: "Bold without importance", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "i", cat: "inline", desc: "Italic — alternate voice", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "s", cat: "inline", desc: "Strikethrough — no longer relevant", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "u", cat: "inline", desc: "Unarticulated annotation", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "kbd", cat: "inline", desc: "Keyboard input representation", void: false, replaced: false,
        specific: [],
        derives: "code"
    },
    {
        t: "samp", cat: "inline", desc: "Sample program output", void: false, replaced: false,
        specific: [],
        derives: "code"
    },
    {
        t: "var", cat: "inline", desc: "Math / programming variable", void: false, replaced: false,
        specific: [],
        derives: "code"
    },
    {
        t: "data", cat: "inline", desc: "Machine-readable value", void: false, replaced: false,
        specific: ["value"],
        derives: "span"
    },
    {
        t: "bdi", cat: "inline", desc: "Bidirectional text isolate", void: false, replaced: false,
        specific: ["dir"],
        derives: "span"
    },
    {
        t: "bdo", cat: "inline", desc: "Bidirectional text override", void: false, replaced: false,
        specific: ["dir"],
        derives: "span"
    },
    {
        t: "ruby", cat: "inline", desc: "Ruby annotation container", void: false, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "rt", cat: "inline", desc: "Ruby text — pronunciation", void: false, replaced: false,
        specific: [],
        derives: "ruby"
    },
    {
        t: "rp", cat: "inline", desc: "Ruby parenthesis fallback", void: false, replaced: false,
        specific: [],
        derives: "ruby"
    },
    {
        t: "br", cat: "inline", desc: "Forced line break", void: true, replaced: false,
        specific: [],
        derives: "span"
    },
    {
        t: "wbr", cat: "inline", desc: "Word break opportunity", void: true, replaced: false,
        specific: [],
        derives: "span"
    },

    // LISTS
    {
        t: "ul", cat: "lists", desc: "Unordered list — bullet points", void: false, replaced: false,
        specific: [],
        derives: "div"
    },
    {
        t: "ol", cat: "lists", desc: "Ordered list — numbered", void: false, replaced: false,
        specific: ["reversed", "start", "type"],
        derives: "div"
    },
    {
        t: "li", cat: "lists", desc: "List item", void: false, replaced: false,
        specific: ["value"],
        derives: "ul"
    },
    {
        t: "dl", cat: "lists", desc: "Description list — name/value pairs", void: false, replaced: false,
        specific: [],
        derives: "div"
    },
    {
        t: "dt", cat: "lists", desc: "Description term", void: false, replaced: false,
        specific: [],
        derives: "dl"
    },
    {
        t: "dd", cat: "lists", desc: "Description detail", void: false, replaced: false,
        specific: [],
        derives: "dl"
    },

    // EMBEDDED
    {
        t: "img", cat: "embedded", desc: "Image — replaced, void", void: true, replaced: true,
        specific: ["src", "alt", "width", "height", "loading", "srcset", "sizes", "decoding", "fetchpriority", "crossorigin", "usemap", "ismap"],
        derives: "div"
    },
    {
        t: "picture", cat: "embedded", desc: "Responsive image container", void: false, replaced: false,
        specific: [],
        derives: "div"
    },
    {
        t: "source", cat: "embedded", desc: "Media source alternative — void", void: true, replaced: false,
        specific: ["src", "srcset", "type", "media", "sizes", "width", "height"],
        derives: "picture"
    },
    {
        t: "video", cat: "embedded", desc: "Video player — replaced", void: false, replaced: true,
        specific: ["src", "controls", "autoplay", "muted", "loop", "poster", "preload", "width", "height", "playsinline", "crossorigin"],
        derives: "div"
    },
    {
        t: "audio", cat: "embedded", desc: "Audio player — replaced", void: false, replaced: true,
        specific: ["src", "controls", "autoplay", "muted", "loop", "preload", "crossorigin"],
        derives: "div"
    },
    {
        t: "track", cat: "embedded", desc: "Subtitle/caption track — void", void: true, replaced: false,
        specific: ["src", "kind", "srclang", "label", "default"],
        derives: "video"
    },
    {
        t: "iframe", cat: "embedded", desc: "Inline frame — embedded browsing context", void: false, replaced: true,
        specific: ["src", "srcdoc", "title", "width", "height", "sandbox", "allow", "allowfullscreen", "loading", "referrerpolicy"],
        derives: "div"
    },
    {
        t: "canvas", cat: "embedded", desc: "Bitmap drawing surface for JS", void: false, replaced: true,
        specific: ["width", "height"],
        derives: "div"
    },
    {
        t: "svg", cat: "embedded", desc: "Inline vector graphics", void: false, replaced: false,
        specific: ["width", "height"],
        derives: "div"
    },
    {
        t: "embed", cat: "embedded", desc: "Generic plugin embed — legacy", void: true, replaced: true,
        specific: ["src", "type", "width", "height"],
        derives: "div"
    },
    {
        t: "object", cat: "embedded", desc: "Embedded object — legacy", void: false, replaced: true,
        specific: ["data", "type", "width", "height", "name"],
        derives: "div"
    },
    {
        t: "map", cat: "embedded", desc: "Image map definition", void: false, replaced: false,
        specific: ["name"],
        derives: "div"
    },
    {
        t: "area", cat: "embedded", desc: "Clickable area in image map — void", void: true, replaced: false,
        specific: ["href", "target", "rel", "alt", "shape", "coords"],
        derives: "map"
    },

    // TABLES
    {
        t: "table", cat: "tables", desc: "Tabular data — NOT for layout", void: false, replaced: false,
        specific: [],
        derives: "div"
    },
    {
        t: "caption", cat: "tables", desc: "Table title — first child", void: false, replaced: false,
        specific: [],
        derives: "table"
    },
    {
        t: "colgroup", cat: "tables", desc: "Column group for styling", void: false, replaced: false,
        specific: ["span"],
        derives: "table"
    },
    {
        t: "col", cat: "tables", desc: "Column specification — void", void: true, replaced: false,
        specific: ["span"],
        derives: "colgroup"
    },
    {
        t: "thead", cat: "tables", desc: "Table header row group", void: false, replaced: false,
        specific: [],
        derives: "table"
    },
    {
        t: "tbody", cat: "tables", desc: "Table body — auto-inserted by browser", void: false, replaced: false,
        specific: [],
        derives: "table"
    },
    {
        t: "tfoot", cat: "tables", desc: "Table footer — always renders at bottom", void: false, replaced: false,
        specific: [],
        derives: "table"
    },
    {
        t: "tr", cat: "tables", desc: "Table row", void: false, replaced: false,
        specific: [],
        derives: "tbody"
    },
    {
        t: "th", cat: "tables", desc: "Header cell — bold and centered", void: false, replaced: false,
        specific: ["scope", "colspan", "rowspan", "headers", "abbr"],
        derives: "tr"
    },
    {
        t: "td", cat: "tables", desc: "Data cell", void: false, replaced: false,
        specific: ["colspan", "rowspan", "headers"],
        derives: "tr"
    },

    // FORMS
    {
        t: "form", cat: "forms", desc: "Form container — submission handler", void: false, replaced: false,
        specific: ["action", "method", "enctype", "novalidate", "autocomplete", "target", "rel"],
        derives: "div"
    },
    {
        t: "input", cat: "forms", desc: "Input field — 22 types, void", void: true, replaced: true,
        specific: ["type", "name", "value", "placeholder", "required", "disabled", "readonly", "min", "max", "step", "maxlength", "minlength", "pattern", "autocomplete", "autofocus", "multiple", "accept", "capture", "checked", "list", "size", "form", "formaction", "formmethod", "formnovalidate", "formtarget", "inputmode", "popovertarget", "popovertargetaction"],
        derives: "form"
    },
    {
        t: "label", cat: "forms", desc: "Associates with a form control", void: false, replaced: false,
        specific: ["for"],
        derives: "form"
    },
    {
        t: "button", cat: "forms", desc: "Clickable button — default type=submit", void: false, replaced: false,
        specific: ["type", "disabled", "name", "value", "form", "formaction", "formmethod", "formnovalidate", "formtarget", "popovertarget", "popovertargetaction"],
        derives: "form"
    },
    {
        t: "textarea", cat: "forms", desc: "Multi-line text input — NOT void", void: false, replaced: true,
        specific: ["name", "rows", "cols", "placeholder", "maxlength", "minlength", "required", "readonly", "disabled", "wrap", "autocomplete", "spellcheck", "form"],
        derives: "form"
    },
    {
        t: "select", cat: "forms", desc: "Dropdown or listbox", void: false, replaced: true,
        specific: ["name", "multiple", "size", "required", "disabled", "autocomplete", "form"],
        derives: "form"
    },
    {
        t: "option", cat: "forms", desc: "A choice in select or datalist", void: false, replaced: false,
        specific: ["value", "selected", "disabled", "label"],
        derives: "select"
    },
    {
        t: "optgroup", cat: "forms", desc: "Groups options in select", void: false, replaced: false,
        specific: ["label", "disabled"],
        derives: "select"
    },
    {
        t: "fieldset", cat: "forms", desc: "Groups related form controls", void: false, replaced: false,
        specific: ["disabled", "name", "form"],
        derives: "form"
    },
    {
        t: "legend", cat: "forms", desc: "Label for a fieldset group", void: false, replaced: false,
        specific: [],
        derives: "fieldset"
    },
    {
        t: "datalist", cat: "forms", desc: "Autocomplete suggestions for input", void: false, replaced: false,
        specific: [],
        derives: "form"
    },
    {
        t: "output", cat: "forms", desc: "Calculation result display", void: false, replaced: false,
        specific: ["for", "name", "form"],
        derives: "form"
    },
    {
        t: "progress", cat: "forms", desc: "Task completion progress bar", void: false, replaced: true,
        specific: ["value", "max"],
        derives: "form"
    },
    {
        t: "meter", cat: "forms", desc: "Scalar measurement gauge", void: false, replaced: true,
        specific: ["value", "min", "max", "low", "high", "optimum"],
        derives: "form"
    },

    // INTERACTIVE
    {
        t: "details", cat: "interactive", desc: "Disclosure widget — no JS needed", void: false, replaced: false,
        specific: ["open", "name-group"],
        derives: "div"
    },
    {
        t: "summary", cat: "interactive", desc: "Toggle label for details", void: false, replaced: false,
        specific: [],
        derives: "details"
    },
    {
        t: "dialog", cat: "interactive", desc: "Native modal or non-modal dialog", void: false, replaced: false,
        specific: ["open"],
        derives: "div"
    },
    {
        t: "menu", cat: "interactive", desc: "Toolbar or context menu", void: false, replaced: false,
        specific: [],
        derives: "ul"
    },

    // TEMPLATE
    {
        t: "template", cat: "template", desc: "Inert HTML fragment — not rendered", void: false, replaced: false,
        specific: ["shadowrootmode"],
        derives: "div"
    },
    {
        t: "slot", cat: "template", desc: "Shadow DOM content placeholder", void: false, replaced: false,
        specific: ["name"],
        derives: "template"
    },
];

// ─── BUILD INVERTED INDEX: attr → tags ────────────────────────────────────────
export const ATTR_TO_TAGS = {};
// Global attrs apply to all tags
const globalAttrNames = Object.keys(ATTR_DEFS).filter(k => ATTR_DEFS[k].f === "global");
TAGS.forEach(tag => {
    // specific
    tag.specific.forEach(a => {
        if (!ATTR_TO_TAGS[a]) ATTR_TO_TAGS[a] = [];
        ATTR_TO_TAGS[a].push(tag.t);
    });
    // globals apply to every tag
    globalAttrNames.forEach(a => {
        if (!ATTR_TO_TAGS[a]) ATTR_TO_TAGS[a] = [];
        if (!ATTR_TO_TAGS[a].includes(tag.t)) ATTR_TO_TAGS[a].push(tag.t);
    });
});

// ─── GLOBAL ATTR NAMES LIST ───────────────────────────────────────────────────
export const GLOBAL_ATTR_NAMES = globalAttrNames;

// ─── ALL UNIQUE ATTR NAMES ────────────────────────────────────────────────────
export const ALL_ATTR_NAMES = Object.keys(ATTR_DEFS);

export { ATTR_DEFS, FAMILIES };