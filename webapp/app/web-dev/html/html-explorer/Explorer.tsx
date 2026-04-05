import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { TAGS, CATEGORIES, ATTR_DEFS, ATTR_TO_TAGS, GLOBAL_ATTR_NAMES, ALL_ATTR_NAMES, FAMILIES } from "./data";

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Inter', system-ui, sans-serif";

const ZINC = {
    950: "#09090b",
    900: "#18181b",
    800: "#27272a",
    700: "#3f3f46",
    600: "#52525b",
    500: "#71717a",
    400: "#a1a1aa",
    300: "#d4d4d8",
    200: "#e4e4e7",
    100: "#f4f4f5",
    50: "#fafafa",
    0: "#ffffff",
};

export default function ExplorerTab() {
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedAttr, setSelectedAttr] = useState(null);
    const [tagSearch, setTagSearch] = useState("");
    const [tagCatFilter, setTagCatFilter] = useState("all");
    const [attrSearch, setAttrSearch] = useState("");
    const [attrFilter, setAttrFilter] = useState("all"); // all | specific | global
    const [attrFamFilter, setAttrFamFilter] = useState("all");
    const [eventLog, setEventLog] = useState([]);
    
    // Panel Resizing
    const [tagWidth, setTagWidth] = useState(300);
    const [infoWidth, setInfoWidth] = useState(240); // Slightly wider for sandbox
    const resizingTag = useRef(false);
    const resizingInfo = useRef(false);

    const onMouseDownTag = useCallback(() => { resizingTag.current = true; document.body.style.cursor = "col-resize"; }, []);
    const onMouseDownInfo = useCallback(() => { resizingInfo.current = true; document.body.style.cursor = "col-resize"; }, []);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (resizingTag.current) setTagWidth(Math.max(200, Math.min(600, e.clientX)));
            if (resizingInfo.current) setInfoWidth(Math.max(180, Math.min(500, e.clientX - tagWidth)));
        };
        const onMouseUp = () => { resizingTag.current = false; resizingInfo.current = false; document.body.style.cursor = ""; };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
    }, [tagWidth]);

    const containerRef = useRef(null);
    const [lineData, setLineData] = useState([]);

    // Filtered tags
    const filteredTags = useMemo(() => {
        const q = tagSearch.toLowerCase();
        return TAGS.filter(t => {
            const matchesSearch = !q || t.t.includes(q) || t.desc.toLowerCase().includes(q);
            const matchesCat = tagCatFilter === "all" || t.cat === tagCatFilter;
            return matchesSearch && matchesCat;
        });
    }, [tagSearch, tagCatFilter]);

    // Attributes to show in right panel
    const rightAttrs = useMemo(() => {
        let attrs = ALL_ATTR_NAMES;
        if (attrFilter === "specific") attrs = attrs.filter(a => !GLOBAL_ATTR_NAMES.includes(a));
        if (attrFilter === "global") attrs = attrs.filter(a => GLOBAL_ATTR_NAMES.includes(a));
        const q = attrSearch.toLowerCase();
        return attrs.filter(a => {
            const def = ATTR_DEFS[a];
            const matchesSearch = !q || a.includes(q) || def?.d?.toLowerCase().includes(q);
            const matchesFam = attrFamFilter === "all" || def?.f === attrFamFilter;
            return matchesSearch && matchesFam;
        });
    }, [attrFilter, attrSearch, attrFamFilter]);

    const highlightedTags = useMemo(() => {
        if (!selectedAttr) return null;
        return new Set(ATTR_TO_TAGS[selectedAttr] || []);
    }, [selectedAttr]);

    const highlightedAttrs = useMemo(() => {
        if (!selectedTag) return null;
        const tag = TAGS.find(t => t.t === selectedTag);
        if (!tag) return null;
        return new Set([...tag.specific, ...GLOBAL_ATTR_NAMES]);
    }, [selectedTag]);

    const updateLines = useCallback(() => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const lines = [];
        if (selectedTag && highlightedAttrs) {
            const leftEl = containerRef.current.querySelector(`[data-tag="${selectedTag}"]`);
            if (leftEl) {
                const lr = leftEl.getBoundingClientRect();
                const lx = lr.right - containerRect.left;
                const ly = lr.top - containerRect.top + lr.height / 2;
                highlightedAttrs.forEach(a => {
                    const rightEl = containerRef.current.querySelector(`[data-attr="${a}"]`);
                    if (rightEl) {
                        const rr = rightEl.getBoundingClientRect();
                        const rx = rr.left - containerRect.left;
                        const ry = rr.top - containerRect.top + rr.height / 2;
                        if (Math.abs(ly - ry) < 1200) {
                            lines.push({ x1: lx, y1: ly, x2: rx, y2: ry, isGlobal: GLOBAL_ATTR_NAMES.includes(a) });
                        }
                    }
                });
            }
        }
        if (selectedAttr && highlightedTags) {
            const rightEl = containerRef.current.querySelector(`[data-attr="${selectedAttr}"]`);
            if (rightEl) {
                const rr = rightEl.getBoundingClientRect();
                const rx = rr.left - containerRect.left;
                const ry = rr.top - containerRect.top + rr.height / 2;
                highlightedTags.forEach(t => {
                    const leftEl = containerRef.current.querySelector(`[data-tag="${t}"]`);
                    if (leftEl) {
                        const lr = leftEl.getBoundingClientRect();
                        const lx = lr.right - containerRect.left;
                        const ly = lr.top - containerRect.top + lr.height / 2;
                        if (Math.abs(ry - ly) < 1200) {
                            lines.push({ x1: lx, y1: ly, x2: rx, y2: ry, isGlobal: false });
                        }
                    }
                });
            }
        }
        setLineData(lines);
    }, [selectedTag, selectedAttr, highlightedAttrs, highlightedTags]);

    useEffect(() => {
        const timer = setTimeout(updateLines, 50);
        return () => clearTimeout(timer);
    }, [updateLines, filteredTags, rightAttrs, tagWidth, infoWidth]);

    const clearBoth = () => { setSelectedTag(null); setSelectedAttr(null); setLineData([]); setEventLog([]); };

    const activeTagData = useMemo(() => TAGS.find(t => t.t === selectedTag), [selectedTag]);

    return (
        <div ref={containerRef} style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", background: ZINC[50] }}>
            {/* Connection Layer */}
            <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5, width: "100%", height: "100%" }}>
                <defs>
                    <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
                        <circle cx="5" cy="5" r="4" fill={ZINC[950]} />
                    </marker>
                </defs>
                {lineData.map((l, i) => (
                    <path key={i}
                        d={`M${l.x1},${l.y1} C${(l.x1 + l.x2) / 2},${l.y1} ${(l.x1 + l.x2) / 2},${l.y2} ${l.x2},${l.y2}`}
                        fill="none"
                        stroke={l.isGlobal ? ZINC[300] : ZINC[950]}
                        strokeWidth={l.isGlobal ? 1 : 1.5}
                        strokeDasharray={l.isGlobal ? "4 4" : "none"}
                        opacity={0.4}
                        markerEnd="url(#dot)"
                    />
                ))}
            </svg>

            {/* PANEL 1: TAGS */}
            <div style={{
                width: tagWidth, borderRight: `1px solid ${ZINC[100]}`, display: "flex",
                flexDirection: "column", flexShrink: 0, background: ZINC[0], position: "relative",
            }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${ZINC[100]}`, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: ZINC[400], fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Elements</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input value={tagSearch} onChange={e => setTagSearch(e.target.value)}
                            placeholder="Filter tag..."
                            style={{
                                width: "100%", background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                                borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 13,
                                color: ZINC[900], outline: "none",
                            }} />
                        <select value={tagCatFilter} onChange={e => setTagCatFilter(e.target.value)} style={{
                            width: "100%", background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                            borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 11,
                            color: ZINC[600], outline: "none", cursor: "pointer",
                        }}>
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {groupedSearch(filteredTags).map(({ cat, tags }) => (
                        <div key={cat.id}>
                            <div style={{
                                padding: "8px 24px", fontSize: 10, color: ZINC[400],
                                fontWeight: 700, letterSpacing: "0.05em", background: ZINC[50],
                                borderBottom: `1px solid ${ZINC[100]}`, textTransform: "uppercase",
                            }}>
                                {cat.icon} {cat.label}
                            </div>
                            {tags.map(tag => {
                                const isSel = selectedTag === tag.t;
                                const isHighlit = highlightedTags && highlightedTags.has(tag.t);
                                return (
                                    <div key={tag.t} data-tag={tag.t}
                                        onClick={() => { setSelectedTag(isSel ? null : tag.t); setSelectedAttr(null); setEventLog([]); }}
                                        style={{
                                            padding: "14px 24px", cursor: "pointer",
                                            background: isSel ? ZINC[950] : isHighlit ? ZINC[50] : "transparent",
                                            borderBottom: `1px solid ${ZINC[50]}`,
                                            borderLeft: isHighlit && !isSel ? `4px solid ${ZINC[950]}` : "4px solid transparent",
                                            transition: "all 0.15s",
                                        }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <code style={{ fontSize: 16, fontWeight: 700, color: isSel ? ZINC[0] : ZINC[900] }}>
                                                &lt;{tag.t}&gt;
                                            </code>
                                            <span style={{ marginLeft: "auto", fontSize: 11, color: isSel ? ZINC[400] : ZINC[300], fontFamily: MONO }}>
                                                {tag.specific.length} Sp.
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 13, color: isSel ? ZINC[400] : ZINC[500], marginTop: 4, lineHeight: 1.4 }}>
                                            {tag.desc}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div onMouseDown={onMouseDownTag} style={{ position: "absolute", right: -4, top: 0, bottom: 0, width: 8, cursor: "col-resize", zIndex: 10 }} />
            </div>

            {/* PANEL 2: CONNECTION CENTER & INSPECTOR */}
            <div style={{
                width: infoWidth, borderRight: `1px solid ${ZINC[100]}`, display: "flex",
                flexDirection: "column", background: ZINC[50], overflowY: "auto", flexShrink: 0, position: "relative",
            }}>
                {(selectedTag || selectedAttr) ? (
                    <div style={{ padding: 20 }}>
                        {selectedTag && activeTagData && (
                            <div style={{ animation: "fadeIn 0.2s ease-out" }}>
                                <div style={{ fontSize: 10, color: ZINC[400], fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Quick Inspector</div>
                                <code style={{ fontSize: 20, fontWeight: 800, color: ZINC[950], display: "block", marginBottom: 16 }}>
                                    &lt;{selectedTag}&gt;
                                </code>
                                
                                {/* Technical Metadata */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                                    <div style={{ fontSize: 10, background: ZINC[950], color: "#fff", padding: "2px 8px", borderRadius: 4, fontFamily: MONO }}>{activeTagData.dom}</div>
                                    <div style={{ fontSize: 10, background: ZINC[200], color: ZINC[700], padding: "2px 8px", borderRadius: 4, fontFamily: MONO }}>{activeTagData.era}</div>
                                    {activeTagData.a11y?.implicit && (
                                        <div style={{ fontSize: 10, background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 4, fontFamily: MONO, border: "1px solid #c7d2fe" }}>role: {activeTagData.a11y.implicit}</div>
                                    )}
                                </div>

                                {/* Live Sandbox */}
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ fontSize: 10, color: ZINC[400], fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>Live Preview</div>
                                    <div style={{ 
                                        minHeight: 100, background: "#fff", border: `1px solid ${ZINC[200]}`, borderRadius: 8, 
                                        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
                                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)", position: "relative"
                                    }}>
                                        <Sandbox tag={selectedTag} events={activeTagData.events} onEvent={(e) => setEventLog(prev => [{ e, t: new Date().toLocaleTimeString() }, ...prev].slice(0, 5))} />
                                    </div>
                                </div>

                                {/* Event Log */}
                                {activeTagData.events.length > 0 && (
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ fontSize: 10, color: ZINC[400], fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>Activity Log</div>
                                        <div style={{ fontSize: 11, fontFamily: MONO, color: ZINC[600], background: ZINC[100], borderRadius: 6, padding: "8px 12px", minHeight: 60, display: "flex", flexDirection: "column", gap: 4 }}>
                                            {eventLog.length === 0 ? (
                                                <div style={{ color: ZINC[300], fontStyle: "italic" }}>Interact with element...</div>
                                            ) : (
                                                eventLog.map((log, i) => (
                                                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span style={{ color: ZINC[900] }}>• {log.e}</span>
                                                        <span style={{ color: ZINC[400], fontSize: 9 }}>{log.t}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {selectedAttr && (
                            <div style={{ animation: "fadeIn 0.2s ease-out" }}>
                                <div style={{ fontSize: 10, color: ZINC[400], fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Global Inspector</div>
                                <code style={{ fontSize: 18, fontWeight: 800, color: ZINC[950], display: "block", marginBottom: 8 }}>
                                    {selectedAttr}
                                </code>
                                <div style={{ fontSize: 12, color: ZINC[500], fontFamily: MONO }}>
                                    Present in {(ATTR_TO_TAGS[selectedAttr] || []).length} Elements
                                </div>
                            </div>
                        )}
                        <button onClick={clearBoth} style={{
                            marginTop: 12, width: "100%", background: ZINC[950], color: ZINC[0], border: "none",
                            borderRadius: 6, padding: "10px 16px", cursor: "pointer",
                            fontFamily: SANS, fontSize: 12, fontWeight: 600,
                        }}>Clear Inspector</button>
                    </div>
                ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                        <div style={{ textAlign: "center", color: ZINC[400], fontSize: 13, fontFamily: SANS, lineHeight: 1.6 }}>
                            Select a node to inspect architecture
                        </div>
                    </div>
                )}
                
                <div onMouseDown={onMouseDownInfo} style={{ position: "absolute", right: -4, top: 0, bottom: 0, width: 8, cursor: "col-resize", zIndex: 10 }} />
            </div>

            {/* PANEL 3: ATTRIBUTES */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: ZINC[0], borderLeft: `1px solid ${ZINC[100]}` }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${ZINC[100]}`, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: ZINC[400], fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Attributes</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        <select value={attrFilter} onChange={e => setAttrFilter(e.target.value)} style={{
                            background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                            borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 11,
                            color: ZINC[600], outline: "none", cursor: "pointer",
                        }}>
                            <option value="all">All Lifecycles</option>
                            <option value="specific">Specific Only</option>
                            <option value="global">Global Only</option>
                        </select>
                        
                        <select value={attrFamFilter} onChange={e => setAttrFamFilter(e.target.value)} style={{
                            background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                            borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 11,
                            color: ZINC[600], outline: "none", cursor: "pointer",
                        }}>
                            <option value="all">All Families</option>
                            {Object.entries(FAMILIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>

                        <input value={attrSearch} onChange={e => setAttrSearch(e.target.value)}
                            placeholder="Search attribute..."
                            style={{
                                flex: 1, minWidth: 200, background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                                borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 13,
                                color: ZINC[900], outline: "none",
                            }} />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {groupedAttrs(rightAttrs).map(({ fam, attrs }) => (
                        <div key={fam.id}>
                            <div style={{
                                padding: "8px 24px", fontSize: 10, color: ZINC[400],
                                fontWeight: 700, letterSpacing: "0.05em", background: ZINC[50],
                                borderBottom: `1px solid ${ZINC[100]}`, textTransform: "uppercase",
                                display: "flex", alignItems: "center", gap: 6,
                            }}>
                                <span style={{ width: 10, height: 10, background: fam.bg, borderRadius: 2 }} />
                                {fam.label}
                            </div>
                            {attrs.map(attrName => {
                                const def = ATTR_DEFS[attrName];
                                const isSel = selectedAttr === attrName;
                                const isHighlit = highlightedAttrs && highlightedAttrs.has(attrName);
                                const isRequired = activeTagData?.a11y?.requires?.includes(attrName);

                                return (
                                    <div key={attrName} data-attr={attrName}
                                        onClick={() => { setSelectedAttr(isSel ? null : attrName); setSelectedTag(null); }}
                                        style={{
                                            padding: "14px 24px", cursor: "pointer",
                                            background: isSel ? ZINC[950] : isHighlit ? ZINC[50] : "transparent",
                                            borderBottom: `1px solid ${ZINC[50]}`,
                                            borderLeft: isHighlit && !isSel ? `4px solid ${ZINC[950]}` : "4px solid transparent",
                                            transition: "all 0.15s",
                                            position: "relative"
                                        }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <code style={{ fontSize: 16, fontWeight: 700, color: isSel ? ZINC[0] : ZINC[900] }}>
                                                {attrName}
                                            </code>
                                            {def && <span style={{ fontSize: 10, color: isSel ? ZINC[400] : ZINC[500], background: isSel ? ZINC[800] : ZINC[100], padding: "1px 6px", borderRadius: 4, fontFamily: MONO }}>{def.t}</span>}
                                            {isRequired && <span style={{ fontSize: 10, color: "#fff", background: "#ef4444", padding: "1px 6px", borderRadius: 4, fontFamily: MONO, fontWeight: 700 }}>REQUIRED</span>}
                                            {GLOBAL_ATTR_NAMES.includes(attrName) && <span style={{ fontSize: 9, color: isSel ? ZINC[500] : ZINC[300], letterSpacing: "0.05em" }}>GLOBAL</span>}
                                        </div>
                                        {def && <div style={{ fontSize: 13, color: isSel ? ZINC[400] : ZINC[500], marginTop: 4, lineHeight: 1.4 }}>{def.d}</div>}
                                        {isSel && def && (
                                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${ZINC[800]}`, animation: "fadeIn 0.2s ease-out" }}>
                                                <div style={{ fontSize: 11, color: ZINC[500], fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Example Usage</div>
                                                <div style={{ fontSize: 13, color: ZINC[300], lineHeight: 1.5, fontStyle: "italic" }}>{def.u}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Sandbox({ tag, events, onEvent }) {
    const elRef = useRef(null);
    
    // Default variations for common elements
    const getProps = (t) => {
        const base = {
            style: { fontFamily: SANS, outline: "none" }
        };
        if (t === "input") return { ...base, placeholder: "Type something...", style: { ...base.style, border: "1px solid #ccc", padding: "4px 8px", borderRadius: 4 } };
        if (t === "textarea") return { ...base, placeholder: "Multi-line input...", style: { ...base.style, border: "1px solid #ccc", padding: "8px", borderRadius: 4, width: "100%", height: 60 } };
        if (t === "button") return { ...base, children: "Click Me", style: { ...base.style, background: ZINC[950], color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" } };
        if (t === "a") return { ...base, children: "Hyperlink", href: "#", style: { ...base.style, color: "#2563eb", textDecoration: "underline" } };
        if (t === "select") return { ...base, children: <><option>Option 1</option><option>Option 2</option></>, style: { ...base.style, border: "1px solid #ccc", padding: 4, borderRadius: 4 } };
        if (t === "p") return { ...base, children: "Lorem ipsum dolor sit amet." };
        if (t === "div") return { ...base, children: "Block Container", style: { ...base.style, border: "1px dashed #ccc", padding: 10 } };
        if (t === "details") return { ...base, children: [<summary key="s">Click to Expand</summary>, "Hidden content revealed!"] };
        if (t === "dialog") return { ...base, children: <div style={{ padding: 10 }}>Dialog Content<br/><button style={{ marginTop: 8 }} onClick={(e: any) => (e.target as HTMLElement).closest('dialog')?.close()}>Close</button></div>, open: true, style: { ...base.style, border: "1px solid #ccc", borderRadius: 8, position: "static", margin: 0 } };
        if (t === "progress") return { ...base, value: 70, max: 100 };
        if (t === "meter") return { ...base, value: 0.6, min: 0, max: 1, low: 0.3, high: 0.8, optimum: 0.5 };
        return { ...base, children: `<${t}>` };
    };

    useEffect(() => {
        const node = elRef.current;
        if (!node) return;
        
        const handlers = (events || []).map(evt => {
            const cb = () => onEvent(evt);
            node.addEventListener(evt, cb);
            return { evt, cb };
        });

        // Always log base interactions
        const baseEvts = ["click", "focus", "blur", "input"];
        const baseHandlers = baseEvts.map(evt => {
            const cb = () => onEvent(evt);
            node.addEventListener(evt, cb);
            return { evt, cb };
        });

        return () => {
            handlers.forEach(h => node.removeEventListener(h.evt, h.cb));
            baseHandlers.forEach(h => node.removeEventListener(h.evt, h.cb));
        };
    }, [tag, events, onEvent]);

    try {
        const { children, ...props }: any = getProps(tag);
        const Forbidden = ["script", "html", "head", "body", "meta", "link", "style"];
        if (Forbidden.includes(tag)) return <div style={{ fontSize: 11, color: ZINC[400] }}>N/A in sandbox</div>;
        
        return (
            <div ref={elRef}>
                {require("react").createElement(tag, props, children)}
            </div>
        );
    } catch (e) {
        return <div style={{ fontSize: 11, color: "#f87171" }}>Render Error</div>;
    }
}

function groupedSearch(filteredTags) {
    return CATEGORIES.map(cat => ({
        cat, tags: filteredTags.filter(t => t.cat === cat.id),
    })).filter(g => g.tags.length);
}

function groupedAttrs(attrs) {
    return Object.entries(FAMILIES).map(([id, fam]) => ({
        fam: { id, ...fam },
        attrs: attrs.filter(a => ATTR_DEFS[a]?.f === id),
    })).filter(g => g.attrs.length);
}