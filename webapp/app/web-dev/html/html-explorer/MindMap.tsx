import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { TAGS, CATEGORIES, ATTR_DEFS, GLOBAL_ATTR_NAMES, FAMILIES } from "./data";

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

// ─── RADIAL LAYOUT ENGINE ────────────────────────────────────────────────────────
function buildLayout(w, h) {
    const cx = w / 2, cy = h / 2;
    const R1 = Math.min(w, h) * 0.16; // Category ring
    const R2 = Math.min(w, h) * 0.38; // Tag ring

    const nodes = [];
    const edges = [];

    // Root
    nodes.push({ id: "__root__", label: "HTML5", x: cx, y: cy, kind: "root" });

    let angleOffset = -Math.PI / 2;
    const totalTags = TAGS.length;

    CATEGORIES.forEach((cat) => {
        const catTags = TAGS.filter(t => t.cat === cat.id);
        if (!catTags.length) return;

        const catAngle = angleOffset + (catTags.length / totalTags) * Math.PI;
        const cx2 = cx + Math.cos(catAngle) * R1;
        const cy2 = cy + Math.sin(catAngle) * R1;
        
        nodes.push({ id: cat.id, label: cat.label, x: cx2, y: cy2, kind: "category", cat, icon: cat.icon });
        edges.push({ from: "__root__", to: cat.id, kind: "root-cat" });

        const arcShare = (catTags.length / totalTags) * Math.PI * 2 * 0.9;
        const tagStep = arcShare / Math.max(catTags.length - 1, 1);
        const startAngle = catAngle - arcShare / 2;

        catTags.forEach((tag, ti) => {
            const ta = startAngle + ti * tagStep;
            const tx = cx + Math.cos(ta) * R2;
            const ty = cy + Math.sin(ta) * R2;
            nodes.push({ id: `tag:${tag.t}`, label: tag.t, x: tx, y: ty, kind: "tag", tag, catId: cat.id });

            const parentId = tag.derives && TAGS.find(t => t.t === tag.derives)
                ? `tag:${tag.derives}` : cat.id;
            edges.push({ from: parentId, to: `tag:${tag.t}`, kind: tag.derives ? "derives" : "cat-tag" });
        });

        angleOffset += (catTags.length / totalTags) * Math.PI * 2;
    });

    return { nodes, edges };
}

// ─── TAG DETAIL COMPONENT ───────────────────────────────────────────────────────
function TagDetail({ tag, onClose }) {
    const [openAttr, setOpenAttr] = useState(null);
    if (!tag) return null;

    return (
        <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 440,
            background: ZINC[0], borderLeft: `1px solid ${ZINC[200]}`,
            display: "flex", flexDirection: "column", fontFamily: SANS,
            zIndex: 100, boxShadow: "-8px 0 32px rgba(0,0,0,0.08)",
            animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
            {/* Header */}
            <div style={{ padding: "32px 32px 24px", background: ZINC[950], color: ZINC[0] }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: ZINC[400], fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {CATEGORIES.find(c => c.id === tag.cat)?.label}
                    </div>
                    <button onClick={onClose} style={{
                        background: ZINC[800], border: "none", color: ZINC[300],
                        padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600,
                    }}>Close</button>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>&lt;{tag.t}&gt;</h2>
                    {tag.void && <span style={{ fontSize: 12, color: ZINC[500], fontFamily: MONO }}>void</span>}
                </div>
                <p style={{ fontSize: 15, color: ZINC[300], lineHeight: 1.6, marginTop: 16, marginBottom: 0 }}>
                    {tag.desc}
                </p>
                {tag.derives && (
                    <div style={{ fontSize: 12, color: ZINC[500], marginTop: 20, fontFamily: MONO }}>
                        inherits from <span style={{ color: ZINC[100], borderBottom: `1px dotted ${ZINC[500]}` }}>&lt;{tag.derives}&gt;</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 0 40px" }}>
                <SectionTitle title="Specific Attributes" count={tag.specific.length} />
                {tag.specific.map((a) => (
                    <AttrItem key={a} name={a} def={ATTR_DEFS[a]} 
                        isOpen={openAttr === a} 
                        onToggle={() => setOpenAttr(openAttr === a ? null : a)} 
                    />
                ))}

                <SectionTitle title="Global Attributes" count={GLOBAL_ATTR_NAMES.length} />
                {GLOBAL_ATTR_NAMES.slice(0, 15).map((a) => (
                    <AttrItem key={a} name={a} def={ATTR_DEFS[a]} 
                        isOpen={openAttr === a} 
                        isGlobal
                        onToggle={() => setOpenAttr(openAttr === a ? null : a)} 
                    />
                ))}
                <div style={{ padding: "12px 32px", fontSize: 12, color: ZINC[400], textAlign: "center", fontStyle: "italic" }}>
                    Showing top 15 global attributes...
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ title, count }) {
    return (
        <div style={{ 
            padding: "24px 32px 12px", fontSize: 11, color: ZINC[400], 
            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            position: "sticky", top: 0, background: ZINC[0], zIndex: 10,
        }}>
            <span>{title}</span>
            <span style={{ fontFamily: MONO, fontSize: 13 }}>{count}</span>
        </div>
    );
}

function AttrItem({ name, def, isOpen, onToggle, isGlobal = false }) {
    return (
        <div onClick={onToggle} style={{
            borderBottom: `1px solid ${ZINC[100]}`, padding: "16px 32px",
            cursor: "pointer", background: isOpen ? ZINC[50] : "transparent",
            transition: "all 0.2s ease",
            opacity: isGlobal && !isOpen ? 0.6 : 1,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <code style={{ fontSize: 15, fontWeight: 700, color: ZINC[950] }}>{name}</code>
                {def && <span style={{ fontSize: 10, background: ZINC[100], color: ZINC[500], padding: "2px 8px", borderRadius: 4, fontFamily: MONO }}>{def.t}</span>}
                <span style={{ marginLeft: "auto", fontSize: 14, color: ZINC[300] }}>{isOpen ? "−" : "+"}</span>
            </div>
            {def && <div style={{ fontSize: 13, color: ZINC[500], marginTop: 6, lineHeight: 1.5 }}>{def.d}</div>}
            {isOpen && def && (
                <div style={{ marginTop: 16, padding: "12px 16px", background: ZINC[0], border: `1px solid ${ZINC[200]}`, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: ZINC[400], fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Common Usage</div>
                    <div style={{ fontSize: 13, color: ZINC[700], lineHeight: 1.6, fontStyle: "italic" }}>{def.u}</div>
                    {def.v && (
                        <div style={{ marginTop: 12 }}>
                            <div style={{ fontSize: 11, color: ZINC[400], fontWeight: 700, marginBottom: 4 }}>VALUES</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {def.v.split("|").map(v => <code key={v} style={{ fontSize: 11, background: ZINC[50], padding: "2px 6px", borderRadius: 4 }}>{v.trim()}</code>)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── MAIN MIND MAP COMPONENT ────────────────────────────────────────────────────
export default function MindMapTab() {
    const containerRef = useRef(null);
    const [dims, setDims] = useState({ w: 900, h: 700 });
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.9 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef(null);
    const [selectedTag, setSelectedTag] = useState(null);
    const [focusCat, setFocusCat] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const ro = new ResizeObserver(([e]) => {
            setDims({ w: e.contentRect.width, h: e.contentRect.height });
        });
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const { nodes, edges } = useMemo(() => buildLayout(dims.w, dims.h), [dims.w, dims.h]);
    const nodeMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

    const searchMatchIds = useMemo(() => {
        if (!search.trim()) return null;
        const q = search.toLowerCase();
        const s = new Set();
        nodes.forEach(n => {
            if (n.kind === "tag" && (n.label.includes(q) || n.tag?.desc?.toLowerCase().includes(q))) {
                s.add(n.id); s.add(n.catId);
            }
            if (n.kind === "category" && n.label.toLowerCase().includes(q)) {
                s.add(n.id);
                nodes.filter(x => x.catId === n.id).forEach(x => s.add(x.id));
            }
        });
        return s;
    }, [search, nodes]);

    const isNodeVisible = useCallback((nodeId, catId) => {
        if (search.trim() && searchMatchIds) return searchMatchIds.has(nodeId);
        if (focusCat) return nodeId === "__root__" || nodeId === focusCat || (catId && catId === focusCat);
        return true;
    }, [search, searchMatchIds, focusCat]);

    // Input handlers for pan/zoom
    const onMouseDown = (e) => {
        if (e.button !== 0) return;
        dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
        setDragging(true);
    };
    const onMouseMove = (e) => {
        if (!dragging || !dragStart.current) return;
        setTransform(t => ({ ...t, x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }));
    };
    const onMouseUp = () => { setDragging(false); dragStart.current = null; };

    return (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", background: ZINC[50] }}>
            <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                {/* Search Overlay */}
                <div style={{
                    position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)",
                    zIndex: 20, display: "flex", alignItems: "center",
                    background: ZINC[0], border: `1px solid ${ZINC[200]}`, borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)", padding: "4px 8px",
                }}>
                    <span style={{ padding: "0 12px", color: ZINC[400] }}>⌕</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search elements..."
                        style={{ border: "none", outline: "none", fontFamily: SANS, fontSize: 14, padding: "10px 0", width: 240, color: ZINC[900], background: "transparent" }} />
                    {search && <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "0 12px", color: ZINC[400], fontSize: 18 }}>×</button>}
                </div>

                {/* Filters */}
                <div style={{
                    position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
                    zIndex: 20, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: "80%",
                }}>
                    {CATEGORIES.map(cat => {
                        const active = focusCat === cat.id;
                        return (
                            <button key={cat.id} onClick={() => setFocusCat(active ? null : cat.id)} style={{
                                background: active ? ZINC[950] : ZINC[0],
                                color: active ? ZINC[0] : ZINC[600],
                                border: `1px solid ${active ? ZINC[950] : ZINC[200]}`,
                                borderRadius: 8, padding: "6px 14px",
                                fontFamily: SANS, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                transition: "all 0.2s", boxShadow: active ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                            }}>
                                {cat.icon} {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Navigation Hint */}
                <div style={{ position: "absolute", bottom: 24, left: 24, zIndex: 10, fontSize: 11, color: ZINC[400], fontFamily: MONO, background: ZINC[100], padding: "4px 8px", borderRadius: 4 }}>
                    DRAG TO PAN · SCROLL TO ZOOM
                </div>

                {/* SVG Visualization */}
                <svg width="100%" height="100%"
                    style={{ cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
                    onMouseDown={onMouseDown} onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
                >
                    <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
                        {/* Edges */}
                        {edges.map((e, i) => {
                            const fn = nodeMap[e.from], tn = nodeMap[e.to];
                            if (!fn || !tn) return null;
                            const vis = isNodeVisible(e.from, fn.catId) && isNodeVisible(e.to, tn.catId);
                            return (
                                <path key={i}
                                    d={`M${fn.x},${fn.y} Q${(fn.x + tn.x) / 2 - (tn.y - fn.y) * 0.1},${(fn.y + tn.y) / 2 + (tn.x - fn.x) * 0.1} ${tn.x},${tn.y}`}
                                    fill="none"
                                    stroke={vis ? ZINC[300] : ZINC[100]}
                                    strokeWidth={vis ? 1.5 : 0.5}
                                    strokeDasharray={e.kind === "derives" ? "4 4" : "none"}
                                    opacity={vis ? 0.6 : 0.1}
                                    style={{ transition: "all 0.4s ease" }}
                                />
                            );
                        })}

                        {/* Nodes: Categories */}
                        {nodes.filter(n => n.kind === "category").map(n => {
                            const vis = isNodeVisible(n.id, n.id);
                            const active = focusCat === n.id;
                            return (
                                <g key={n.id} transform={`translate(${n.x},${n.y})`}
                                    style={{ cursor: "pointer", transition: "opacity 0.4s" }}
                                    opacity={vis ? 1 : 0.1}
                                    onClick={() => setFocusCat(active ? null : n.id)}
                                >
                                    <circle r={active ? 40 : 32} fill={active ? ZINC[950] : ZINC[0]} stroke={ZINC[950]} strokeWidth={2} />
                                    <text textAnchor="middle" y={5} fontSize={18} fill={active ? ZINC[0] : ZINC[950]}>{n.icon}</text>
                                    <text textAnchor="middle" y={52} fontSize={11} fontFamily={SANS} fontWeight={700} fill={ZINC[950]}>{n.label.toUpperCase()}</text>
                                </g>
                            );
                        })}

                        {/* Nodes: Tags */}
                        {nodes.filter(n => n.kind === "tag").map(n => {
                            const vis = isNodeVisible(n.id, n.catId);
                            const active = selectedTag?.t === n.tag?.t;
                            return (
                                <g key={n.id} transform={`translate(${n.x},${n.y})`}
                                    style={{ cursor: "pointer", transition: "all 0.3s" }}
                                    opacity={vis ? 1 : 0.05}
                                    onClick={(e) => { e.stopPropagation(); setSelectedTag(active ? null : n.tag); }}
                                >
                                    <circle r={active ? 20 : 14} fill={active ? ZINC[950] : ZINC[0]} stroke={ZINC[950]} strokeWidth={active ? 0 : 1} />
                                    <text textAnchor="middle" y={4} fontSize={active ? 11 : 9} fontFamily={MONO} fontWeight={active ? 700 : 400} fill={active ? ZINC[0] : ZINC[950]}>
                                        {n.label}
                                    </text>
                                    {n.tag?.void && <circle r={3} cx={14} cy={-14} fill={ZINC[300]} />}
                                </g>
                            );
                        })}

                        {/* Root */}
                        {(() => {
                            const root = nodeMap["__root__"];
                            if (!root) return null;
                            return (
                                <g transform={`translate(${root.x},${root.y})`}>
                                    <circle r={56} fill={ZINC[0]} stroke={ZINC[950]} strokeWidth={4} />
                                    <circle r={48} fill="none" stroke={ZINC[200]} strokeWidth={1} strokeDasharray="4 4" />
                                    <text textAnchor="middle" y={8} fontSize={16} fontFamily={SANS} fontWeight={900} fill={ZINC[950]}>HTML5</text>
                                </g>
                            );
                        })()}
                    </g>
                </svg>
            </div>

            {/* Side Panel: Tag Detail */}
            {selectedTag && <TagDetail tag={selectedTag} onClose={() => setSelectedTag(null)} />}
            
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}