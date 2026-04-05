import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { TAGS, CATEGORIES, ATTR_DEFS, GLOBAL_ATTR_NAMES, ALL_ATTR_NAMES, FAMILIES } from "./data";

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

const MAX_COMPARE = 6;

const PRESET_GROUPS = [
    { label: "Text", tags: ["p", "div", "span", "em", "strong", "b"] },
    { label: "Form", tags: ["input", "button", "textarea", "select", "label", "output"] },
    { label: "Media", tags: ["img", "video", "audio", "iframe", "canvas", "svg"] },
    { label: "List", tags: ["ul", "ol", "li", "dl", "dt", "dd"] },
    { label: "Table", tags: ["table", "thead", "tbody", "tr", "th", "td"] },
];

function CellContent({ tag, attrName, isGlobal }) {
    const [open, setOpen] = useState(false);
    const def = ATTR_DEFS[attrName];
    const hasIt = isGlobal || (tag && tag.specific.includes(attrName));

    if (!hasIt) {
        return (
            <td style={{
                padding: "12px 14px", textAlign: "center",
                borderRight: `1px solid ${ZINC[100]}`,
                borderBottom: `1px solid ${ZINC[100]}`,
                background: ZINC[50],
                color: ZINC[300], fontSize: 13, fontFamily: MONO,
            }}>—</td>
        );
    }

    return (
        <td style={{
            padding: "12px 14px", borderRight: `1px solid ${ZINC[100]}`,
            borderBottom: `1px solid ${ZINC[100]}`,
            background: open ? ZINC[50] : isGlobal ? "#fdfdfd" : ZINC[0],
            verticalAlign: "top",
            cursor: def ? "pointer" : "default",
            transition: "background 0.1s",
        }} onClick={() => def && setOpen(o => !o)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                    width: 16, height: 16, borderRadius: "2px",
                    background: isGlobal ? ZINC[200] : ZINC[950],
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <span style={{ color: isGlobal ? ZINC[600] : ZINC[0], fontSize: 10 }}>✓</span>
                </span>
                {def && (
                    <span style={{ fontSize: 10, color: ZINC[500], background: ZINC[100], padding: "1px 6px", borderRadius: 4, fontFamily: MONO }}>
                        {def.t}
                    </span>
                )}
                {def && <span style={{ marginLeft: "auto", fontSize: 11, color: ZINC[300] }}>{open ? "▴" : "▾"}</span>}
            </div>
            {open && def && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${ZINC[200]}`, animation: "fadeIn 0.2s ease-out" }}>
                    <div style={{ fontSize: 13, color: ZINC[700], lineHeight: 1.6, marginBottom: 6 }}>{def.d}</div>
                    <div style={{ fontSize: 12, color: ZINC[500], lineHeight: 1.5, fontStyle: "italic" }}>{def.u}</div>
                </div>
            )}
        </td>
    );
}

export default function CompareTab() {
    const [selectedTags, setSelectedTags] = useState(["p", "div", "span"]);
    const [tagSearch, setTagSearch] = useState("");
    const [tagCatFilter, setTagCatFilter] = useState("all");
    const [tagEraFilter, setTagEraFilter] = useState("all");
    const [tagRoleFilter, setTagRoleFilter] = useState("all");
    const [showGlobal, setShowGlobal] = useState(false);
    const [attrSearch, setAttrSearch] = useState("");
    const [attrFamFilter, setAttrFamFilter] = useState("all");
    const [highlightRow, setHighlightRow] = useState(null);
    const [highlightCol, setHighlightCol] = useState(null);

    // Sidebar resize
    const [sidebarWidth, setSidebarWidth] = useState(260);
    const isResizing = useRef(false);

    const onMouseDown = useCallback(() => { isResizing.current = true; document.body.style.cursor = "col-resize"; }, []);
    useEffect(() => {
        const onMouseMove = (e) => {
            if (!isResizing.current) return;
            setSidebarWidth(Math.max(200, Math.min(500, e.clientX)));
        };
        const onMouseUp = () => { isResizing.current = false; document.body.style.cursor = ""; };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
    }, []);

    const tagObjects = useMemo(() => selectedTags.map(t => TAGS.find(x => x.t === t)).filter(Boolean), [selectedTags]);

    const addTag = (t: string) => {
        if (selectedTags.length >= MAX_COMPARE) return;
        if (!selectedTags.includes(t)) setSelectedTags(s => [...s, t]);
    };
    const removeTag = (t: string) => setSelectedTags(s => s.filter(x => x !== t));

    const specAttrs = useMemo(() => {
        const s = new Set<string>();
        tagObjects.forEach(tag => tag.specific.forEach(a => s.add(a)));
        return Array.from(s).filter(a => {
            const def = ATTR_DEFS[a];
            const matchesSearch = !attrSearch.trim() || a.includes(attrSearch.toLowerCase()) || def?.d?.toLowerCase().includes(attrSearch.toLowerCase());
            const matchesFam = attrFamFilter === "all" || def?.f === attrFamFilter;
            return matchesSearch && matchesFam;
        });
    }, [tagObjects, attrSearch, attrFamFilter]);

    const globalAttrs = useMemo(() => {
        if (!showGlobal) return [];
        return GLOBAL_ATTR_NAMES.filter(a => {
            const def = ATTR_DEFS[a];
            const matchesSearch = !attrSearch.trim() || a.includes(attrSearch.toLowerCase()) || def?.d?.toLowerCase().includes(attrSearch.toLowerCase());
            const matchesFam = attrFamFilter === "all" || def?.f === attrFamFilter;
            return matchesSearch && matchesFam;
        });
    }, [showGlobal, attrSearch, attrFamFilter]);

    const allRoles = useMemo(() => {
        const roles = new Set<string>();
        TAGS.forEach(t => { if (t.a11y?.implicit) roles.add(t.a11y.implicit); });
        return Array.from(roles).sort();
    }, []);

    const filteredTags = useMemo(() => {
        const q = tagSearch.toLowerCase();
        return TAGS.filter(t => {
            const matchesSearch = !q || t.t.includes(q) || t.desc.toLowerCase().includes(q);
            const matchesCat = tagCatFilter === "all" || t.cat === tagCatFilter;
            const matchesEra = tagEraFilter === "all" || t.era === tagEraFilter;
            const matchesRole = tagRoleFilter === "all" || t.a11y?.implicit === tagRoleFilter;
            return matchesSearch && matchesCat && matchesEra && matchesRole;
        });
    }, [tagSearch, tagCatFilter, tagEraFilter, tagRoleFilter]);

    const groupedSearch = useMemo(() => {
        return CATEGORIES.map(cat => ({
            cat, tags: filteredTags.filter(t => t.cat === cat.id),
        })).filter(g => g.tags.length);
    }, [filteredTags]);

    return (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", background: ZINC[0] }}>
            {/* LEFT: tag picker */}
            <div style={{
                width: sidebarWidth, borderRight: `1px solid ${ZINC[100]}`,
                display: "flex", flexDirection: "column", background: ZINC[0], flexShrink: 0,
                position: "relative",
            }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${ZINC[100]}`, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: ZINC[400], fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>
                        Select Elements ({selectedTags.length}/{MAX_COMPARE})
                    </div>
                    
                    {/* Presets */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {PRESET_GROUPS.map(p => (
                                <button key={p.label} onClick={() => setSelectedTags(p.tags)} style={{
                                    background: ZINC[50], border: `1px solid ${ZINC[200]}`, borderRadius: 4,
                                    padding: "4px 8px", cursor: "pointer", fontFamily: MONO, fontSize: 11,
                                    color: ZINC[700], transition: "all 0.1s",
                                }}>{p.label}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input value={tagSearch} onChange={e => setTagSearch(e.target.value)}
                            placeholder="Search tag..."
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

                        <div style={{ display: "flex", gap: 6 }}>
                            <select value={tagEraFilter} onChange={e => setTagEraFilter(e.target.value)} style={{
                                flex: 1, background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                                borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 10,
                                color: ZINC[600], outline: "none", cursor: "pointer",
                            }}>
                                <option value="all">Any Era</option>
                                <option value="HTML4">HTML 4.x</option>
                                <option value="HTML5">HTML 5.x</option>
                                <option value="Web Components">Web Comp.</option>
                            </select>

                            <select value={tagRoleFilter} onChange={e => setTagRoleFilter(e.target.value)} style={{
                                flex: 1, background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                                borderRadius: 6, padding: "8px 12px", fontFamily: MONO, fontSize: 10,
                                color: ZINC[600], outline: "none", cursor: "pointer",
                            }}>
                                <option value="all">Any Role</option>
                                {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Selected chips */}
                {selectedTags.length > 0 && (
                    <div style={{ padding: "12px 24px", borderBottom: `1px solid ${ZINC[100]}`, flexShrink: 0, background: ZINC[50] }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {selectedTags.map(t => (
                                <span key={t} style={{
                                    background: ZINC[950], color: ZINC[0], borderRadius: 4,
                                    padding: "4px 10px", fontSize: 12, fontFamily: MONO,
                                    display: "flex", alignItems: "center", gap: 6,
                                }}>
                                    &lt;{t}&gt;
                                    <span style={{ cursor: "pointer", opacity: 0.5, fontSize: 11 }}
                                        onClick={() => removeTag(t)}>✕</span>
                                </span>
                            ))}
                        </div>
                        <button onClick={() => setSelectedTags([])} style={{
                            marginTop: 10, background: "none", border: `1px solid ${ZINC[200]}`,
                            borderRadius: 4, padding: "4px 10px", cursor: "pointer",
                            fontFamily: MONO, fontSize: 11, color: ZINC[500],
                        }}>Clear selection</button>
                    </div>
                )}

                {/* Tag list */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {groupedSearch.map(({ cat, tags }) => (
                        <div key={cat.id}>
                            <div style={{
                                padding: "8px 24px", fontSize: 10, color: ZINC[400],
                                fontWeight: 700, letterSpacing: "0.05em", background: ZINC[50],
                                borderBottom: `1px solid ${ZINC[100]}`, textTransform: "uppercase",
                            }}>
                                {cat.icon} {cat.label}
                            </div>
                            {tags.map(tag => {
                                const isSel = selectedTags.includes(tag.t);
                                const isFull = selectedTags.length >= MAX_COMPARE && !isSel;
                                return (
                                    <div key={tag.t} onClick={() => !isFull && (isSel ? removeTag(tag.t) : addTag(tag.t))}
                                        style={{
                                            padding: "12px 24px", cursor: isFull ? "not-allowed" : "pointer",
                                            background: isSel ? ZINC[100] : "transparent",
                                            borderBottom: `1px solid ${ZINC[50]}`,
                                            borderLeft: isSel ? `4px solid ${ZINC[950]}` : "4px solid transparent",
                                            opacity: isFull ? 0.3 : 1,
                                            transition: "all 0.15s",
                                        }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <code style={{ fontSize: 14, fontWeight: isSel ? 700 : 500, color: ZINC[900] }}>
                                                &lt;{tag.t}&gt;
                                            </code>
                                            {isSel && <span style={{ marginLeft: "auto", fontSize: 12, color: ZINC[950] }}>✓</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Resize handle */}
                <div onMouseDown={onMouseDown} style={{
                    position: "absolute", right: -4, top: 0, bottom: 0, width: 8,
                    cursor: "col-resize", zIndex: 10,
                }} />
            </div>

            {/* RIGHT: Comparison matrix */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Controls */}
                <div style={{
                    padding: "16px 24px", borderBottom: `1px solid ${ZINC[100]}`,
                    display: "flex", alignItems: "center", gap: 16, flexShrink: 0, background: ZINC[0],
                }}>
                    <input value={attrSearch} onChange={e => setAttrSearch(e.target.value)}
                        placeholder="Filter attributes..."
                        style={{
                            background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                            borderRadius: 6, padding: "8px 14px", fontFamily: MONO, fontSize: 13,
                            color: ZINC[900], outline: "none", width: 240,
                        }} />
                    
                    <select value={attrFamFilter} onChange={e => setAttrFamFilter(e.target.value)} style={{
                        background: ZINC[50], border: `1px solid ${ZINC[200]}`,
                        borderRadius: 6, padding: "8px 14px", fontFamily: MONO, fontSize: 11,
                        color: ZINC[600], outline: "none", cursor: "pointer",
                    }}>
                        <option value="all">All Families</option>
                        {Object.entries(FAMILIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>

                    <button onClick={() => setShowGlobal(s => !s)} style={{
                        background: showGlobal ? ZINC[950] : ZINC[50],
                        color: showGlobal ? ZINC[0] : ZINC[600],
                        border: `1px solid ${showGlobal ? ZINC[950] : ZINC[200]}`,
                        borderRadius: 6, padding: "8px 16px", cursor: "pointer",
                        fontFamily: MONO, fontSize: 11, fontWeight: 600,
                        transition: "all 0.15s",
                    }}>
                        {showGlobal ? "■" : "□"} Show Global ({GLOBAL_ATTR_NAMES.length})
                    </button>
                    
                    <div style={{ marginLeft: "auto", fontSize: 11, color: ZINC[400], fontFamily: MONO, textAlign: "right", lineHeight: 1.4 }}>
                        {tagObjects.length > 0 && (
                            <>
                                <div>{specAttrs.length} Specific Rows</div>
                                {showGlobal && <div>+ {globalAttrs.length} Global Rows</div>}
                            </>
                        )}
                    </div>
                </div>

                {tagObjects.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: ZINC[50] }}>
                        <div style={{ textAlign: "center", color: ZINC[300], fontFamily: SANS }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>⊕</div>
                            <div style={{ fontSize: 16, fontWeight: 500, color: ZINC[400] }}>Compare Elements</div>
                            <div style={{ fontSize: 13, marginTop: 8 }}>Select up to {MAX_COMPARE} tags from the sidebar to begin.</div>
                        </div>
                    </div>
                ) : (
                    <div style={{ flex: 1, overflow: "auto" }}>
                        <table style={{
                            borderCollapse: "separate", borderSpacing: 0, width: "100%",
                            fontFamily: SANS, fontSize: 13,
                            tableLayout: "fixed",
                        }}>
                            {/* Header */}
                            <thead style={{ position: "sticky", top: 0, zIndex: 20 }}>
                                <tr style={{ background: ZINC[0] }}>
                                    <th style={{
                                        width: 220, padding: "16px 20px", textAlign: "left",
                                        borderRight: `1px solid ${ZINC[100]}`, borderBottom: `2px solid ${ZINC[950]}`,
                                        fontSize: 11, color: ZINC[400], letterSpacing: "0.1em", fontWeight: 700,
                                        position: "sticky", left: 0, background: ZINC[0], zIndex: 22,
                                        textTransform: "uppercase",
                                    }}>Attribute</th>
                                    {tagObjects.map((tag, ci) => (
                                        <th key={tag.t} style={{
                                            padding: "16px 20px", textAlign: "left",
                                            borderRight: `1px solid ${ZINC[100]}`, borderBottom: `2px solid ${ZINC[950]}`,
                                            background: highlightCol === ci ? ZINC[50] : ZINC[0],
                                            cursor: "pointer", transition: "background 0.1s",
                                            minWidth: 200,
                                        }}
                                            onClick={() => setHighlightCol(highlightCol === ci ? null : ci)}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <code style={{ fontSize: 16, color: ZINC[950], fontWeight: 700 }}>&lt;{tag.t}&gt;</code>
                                                {tag.void && <span style={{ fontSize: 9, color: ZINC[400], border: `1px solid ${ZINC[200]}`, padding: "1px 5px", borderRadius: 4 }}>void</span>}
                                            </div>
                                            <div style={{ fontSize: 11, color: ZINC[500], marginTop: 4, fontWeight: 400, fontFamily: MONO }}>
                                                {tag.specific.length} Specific
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Specific attrs section */}
                                {specAttrs.length > 0 && (
                                    <tr>
                                        <td colSpan={tagObjects.length + 1} style={{
                                            padding: "8px 20px", fontSize: 10, color: ZINC[400],
                                            fontWeight: 700, letterSpacing: "0.08em", background: ZINC[50],
                                            borderBottom: `1px solid ${ZINC[100]}`, textTransform: "uppercase",
                                        }}>Specific Attributes</td>
                                    </tr>
                                )}
                                {specAttrs.map((attrName, ri) => {
                                    const def = ATTR_DEFS[attrName];
                                    const isHR = highlightRow === attrName;
                                    return (
                                        <tr key={attrName}
                                            style={{ background: isHR ? ZINC[50] : ZINC[0] }}
                                        >
                                            <td style={{
                                                padding: "12px 20px", borderRight: `1px solid ${ZINC[100]}`,
                                                borderBottom: ri === specAttrs.length - 1 ? "none" : `1px solid ${ZINC[50]}`,
                                                position: "sticky", left: 0,
                                                background: isHR ? ZINC[50] : ZINC[0],
                                                cursor: "pointer", zIndex: 10,
                                            }}
                                                onClick={() => setHighlightRow(isHR ? null : attrName)}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <code style={{ fontSize: 14, fontWeight: 700, color: ZINC[900] }}>{attrName}</code>
                                                    {def && <span style={{ fontSize: 9, color: ZINC[500], background: ZINC[100], padding: "1px 6px", borderRadius: 4 }}>{def.f}</span>}
                                                </div>
                                                {def && <div style={{ fontSize: 12, color: ZINC[500], marginTop: 4, lineHeight: 1.4 }}>{def.d}</div>}
                                            </td>
                                            {tagObjects.map((tag) => (
                                                <CellContent key={tag.t} tag={tag} attrName={attrName} isGlobal={false} />
                                            ))}
                                        </tr>
                                    );
                                })}

                                {/* Global attrs section */}
                                {showGlobal && globalAttrs.length > 0 && (
                                    <>
                                        <tr>
                                            <td colSpan={tagObjects.length + 1} style={{
                                                padding: "8px 20px", fontSize: 10, color: ZINC[400],
                                                fontWeight: 700, letterSpacing: "0.08em", background: ZINC[100],
                                                borderBottom: `1px solid ${ZINC[200]}`, borderTop: `1px solid ${ZINC[950]}`,
                                                textTransform: "uppercase", marginTop: 20,
                                            }}>Global Attributes</td>
                                        </tr>
                                        {globalAttrs.map((attrName, ri) => {
                                            const def = ATTR_DEFS[attrName];
                                            const isHR = highlightRow === attrName;
                                            return (
                                                <tr key={attrName}
                                                    style={{ background: isHR ? ZINC[50] : ZINC[0], opacity: 0.85 }}
                                                >
                                                    <td style={{
                                                        padding: "12px 20px", borderRight: `1px solid ${ZINC[100]}`,
                                                        borderBottom: `1px solid ${ZINC[50]}`,
                                                        position: "sticky", left: 0,
                                                        background: isHR ? ZINC[50] : ZINC[0],
                                                        cursor: "pointer", zIndex: 10,
                                                    }}
                                                        onClick={() => setHighlightRow(isHR ? null : attrName)}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <code style={{ fontSize: 13, color: ZINC[600] }}>{attrName}</code>
                                                            <span style={{ fontSize: 9, color: ZINC[400], background: ZINC[100], padding: "1px 6px", borderRadius: 4 }}>global</span>
                                                        </div>
                                                        {def && <div style={{ fontSize: 12, color: ZINC[500], marginTop: 4, lineHeight: 1.4 }}>{def.d}</div>}
                                                    </td>
                                                    {tagObjects.map((tag) => (
                                                        <CellContent key={tag.t} tag={tag} attrName={attrName} isGlobal={true} />
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}