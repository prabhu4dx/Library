"use client"

import { useState } from "react";
import MindMapTab from "./MindMap";
import ExplorerTab from "./Explorer";
import CompareTab from "./Compare";
import GeometryVisualizerTab from "./Geometry-Visualizer";
import { TAGS, ALL_ATTR_NAMES, CATEGORIES } from "./data";

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

const TABS = [
    { id: "mindmap", label: "Mind Map", icon: "◎", desc: "Radial tag hierarchy" },
    { id: "explorer", label: "Explorer", icon: "⊞", desc: "Tag ↔ Attr Graph" },
    { id: "compare", label: "Compare", icon: "⊟", desc: "Tag Matrix" },
    { id: "geometry", label: "Geometry", icon: "📐", desc: "Box Model & Flow" },
];

export default function App() {
    const [activeTab, setActiveTab] = useState("mindmap");

    return (
        <div style={{
            width: "100vw", height: "100vh",
            display: "flex", flexDirection: "column",
            background: ZINC[0], color: ZINC[950],
            fontFamily: SANS, overflow: "hidden",
        }}>
            <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; background: ${ZINC[0]}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${ZINC[100]}; }
        ::-webkit-scrollbar-thumb { background: ${ZINC[300]}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${ZINC[400]}; }
        input::placeholder { color: ${ZINC[400]}; }
        button { font-family: inherit; }
        code, kbd, pre { font-family: ${MONO}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

            {/* Header */}
            <header style={{
                height: 56, background: ZINC[0],
                borderBottom: `1px solid ${ZINC[950]}`,
                display: "flex", alignItems: "stretch",
                flexShrink: 0, userSelect: "none",
                position: "relative", zIndex: 100,
            }}>
                {/* Brand */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "0 24px", borderRight: `1px solid ${ZINC[200]}`,
                    flexShrink: 0,
                }}>
                    <svg width={20} height={20} viewBox="0 0 18 18" fill="none">
                        <rect x="1" y="1" width="16" height="16" stroke={ZINC[950]} strokeWidth="1.5" />
                        <circle cx="9" cy="9" r="2.5" fill={ZINC[950]} />
                        <line x1="9" y1="1.5" x2="9" y2="6.5" stroke={ZINC[950]} strokeWidth="1" />
                        <line x1="9" y1="11.5" x2="9" y2="16.5" stroke={ZINC[950]} strokeWidth="1" />
                        <line x1="1.5" y1="9" x2="6.5" y2="9" stroke={ZINC[950]} strokeWidth="1" />
                        <line x1="11.5" y1="9" x2="16.5" y2="9" stroke={ZINC[950]} strokeWidth="1" />
                    </svg>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", lineHeight: 1, textTransform: "uppercase" }}>HTML Explorer</div>
                        <div style={{ fontSize: 10, color: ZINC[500], letterSpacing: "0.04em", lineHeight: 1, marginTop: 4, fontFamily: MONO }}>
                            {TAGS.length} TAGS · {ALL_ATTR_NAMES.length} ATTRS
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <nav style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
                    {TABS.map(tab => {
                        const active = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "0 24px", background: "none", border: "none",
                                borderBottom: active ? `3px solid ${ZINC[950]}` : "3px solid transparent",
                                borderRight: `1px solid ${ZINC[100]}`,
                                cursor: "pointer", color: active ? ZINC[950] : ZINC[400],
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}>
                                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontSize: 13, fontWeight: active ? 600 : 500, letterSpacing: "-0.01em" }}>
                                        {tab.label}
                                    </div>
                                    <div style={{ fontSize: 10, color: ZINC[400], letterSpacing: "0.02em", marginTop: 2 }}>{tab.desc}</div>
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* Right info */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 24,
                    padding: "0 24px", borderLeft: `1px solid ${ZINC[200]}`,
                    flexShrink: 0,
                }}>
                    <div style={{ fontSize: 11, color: ZINC[500], lineHeight: 1.6, textAlign: "right" }}>
                        <div style={{ fontWeight: 600, color: ZINC[300], fontSize: 9, letterSpacing: "0.1em", marginBottom: 2 }}>VERSION 2.0</div>
                        <div style={{ fontFamily: MONO }}>Technical Reference</div>
                    </div>
                </div>
            </header>

            {/* Tab content */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
                {activeTab === "mindmap" && <MindMapTab />}
                {activeTab === "explorer" && <ExplorerTab />}
                {activeTab === "compare" && <CompareTab />}
                {activeTab === "geometry" && <GeometryVisualizerTab />}
            </div>
        </div>
    );
}