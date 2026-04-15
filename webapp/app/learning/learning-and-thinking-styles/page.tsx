"use client"

import { useState, useEffect, useRef, useCallback } from "react";

const B = "#2563EB", INK = "#0F172A", INK2 = "#334155", INK3 = "#64748B", INK4 = "#94A3B8", BD = "#E2E8F0", BG2 = "#F8FAFC";

interface TierConfig {
    [key: string]: { l: string; c: string; b: string };
}

const tierC: TierConfig = { S: { l: "S-Tier", c: "#2563EB", b: "#EFF6FF" }, A: { l: "A-Tier", c: "#0D9488", b: "#F0FDFA" }, B: { l: "B-Tier", c: "#F59E0B", b: "#FFFBEB" }, F: { l: "Meta", c: "#6366F1", b: "#EEF2FF" } };

// ═══════════════════════════════════════════════════
// SVG ILLUSTRATIONS
// ═══════════════════════════════════════════════════

function BrainMap() {
    const R = [{ x: 200, y: 60, r: 38, c: "#2563EB", l: "Prefrontal Cortex", s: "Planning · Reasoning · Control" }, { x: 100, y: 130, r: 28, c: "#0EA5E9", l: "Default Mode", s: "Creativity · Reflection" }, { x: 300, y: 130, r: 24, c: "#8B5CF6", l: "Ant. Cingulate", s: "Conflict · Error Detection" }, { x: 140, y: 220, r: 30, c: "#10B981", l: "Hippocampus", s: "Memory Formation" }, { x: 270, y: 210, r: 22, c: "#EF4444", l: "Amygdala", s: "Emotion · Threat" }];
    return <svg viewBox="0 0 400 280" style={{ width: "100%" }}>
        <defs>{R.map(r => <radialGradient key={r.l} id={`b${r.l.replace(/\s/g, "")}`}><stop offset="0%" stopColor={r.c} stopOpacity="0.18" /><stop offset="100%" stopColor={r.c} stopOpacity="0.02" /></radialGradient>)}</defs>
        {[[0, 1], [0, 2], [0, 3], [1, 3], [2, 4], [3, 4], [1, 4]].map(([a, b], i) => <line key={i} x1={R[a].x} y1={R[a].y} x2={R[b].x} y2={R[b].y} stroke={INK4} strokeWidth="0.8" strokeDasharray="4,4" strokeOpacity="0.3" />)}
        {R.map((r, i) => <g key={r.l}><circle cx={r.x} cy={r.y} r={r.r} fill={`url(#b${r.l.replace(/\s/g, "")})`} stroke={r.c} strokeWidth="1.2" strokeOpacity="0.5"><animate attributeName="r" values={`${r.r};${r.r + 3};${r.r}`} dur="4s" begin={`${i * 0.6}s`} repeatCount="indefinite" /></circle>
            <text x={r.x} y={r.y - 4} textAnchor="middle" fontSize="8.5" fill={r.c} fontFamily="sans-serif" fontWeight="600">{r.l}</text>
            <text x={r.x} y={r.y + 8} textAnchor="middle" fontSize="6.5" fill={INK4} fontFamily="sans-serif">{r.s}</text></g>)}
    </svg>;
}

function ForgettingCurve() {
    return <svg viewBox="0 0 500 200" style={{ width: "100%" }}>
        <defs><linearGradient id="fcr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF4444" stopOpacity="0.12" /><stop offset="100%" stopColor="#EF4444" stopOpacity="0" /></linearGradient>
            <linearGradient id="fcb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity="0.12" /><stop offset="100%" stopColor="#2563EB" stopOpacity="0" /></linearGradient></defs>
        <line x1="40" y1="170" x2="480" y2="170" stroke={BD} strokeWidth="0.8" /><line x1="40" y1="20" x2="40" y2="170" stroke={BD} strokeWidth="0.8" />
        <text x="20" y="28" fontSize="9" fill={INK4} fontFamily="sans-serif">100%</text><text x="20" y="170" fontSize="9" fill={INK4} fontFamily="sans-serif">0%</text>
        <text x="260" y="192" textAnchor="middle" fontSize="9" fill={INK4} fontFamily="sans-serif">Time →</text>
        <polygon points="40,25 80,65 140,100 220,125 320,140 420,152 480,158 480,170 40,170" fill="url(#fcr)" />
        <polyline points="40,25 80,65 140,100 220,125 320,140 420,152 480,158" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
        <text x="400" y="148" fontSize="10" fill="#EF4444" fontFamily="sans-serif" fontWeight="500">No review — 80% lost</text>
        <polygon points="40,25 100,50 110,30 170,52 180,28 260,48 270,26 380,42 390,24 480,35 480,170 40,170" fill="url(#fcb)" />
        <polyline points="40,25 100,50 110,30 170,52 180,28 260,48 270,26 380,42 390,24 480,35" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <text x="420" y="30" fontSize="10" fill="#2563EB" fontFamily="sans-serif" fontWeight="600">With spaced review</text>
        {[100, 170, 260, 380].map((x, i) => <g key={i}><line x1={x} y1="20" x2={x} y2="170" stroke="#2563EB" strokeWidth="0.6" strokeDasharray="3,5" strokeOpacity="0.25" />
            <circle cx={x} cy={[50, 52, 48, 42][i]} r="3" fill="#2563EB" fillOpacity="0.4" /><text x={x} y="182" textAnchor="middle" fontSize="7" fill="#2563EB" fontFamily="sans-serif">Review {i + 1}</text></g>)}
    </svg>;
}

function DualProcessDiagram() {
    return <svg viewBox="0 0 600 160" style={{ width: "100%" }}>
        <rect x="10" y="10" width="260" height="140" rx="16" fill="#F59E0B" fillOpacity="0.05" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.25" />
        <text x="140" y="38" textAnchor="middle" fontSize="16" fill="#F59E0B" fontFamily="sans-serif" fontWeight="700">System 1</text>
        <text x="140" y="56" textAnchor="middle" fontSize="10" fill={INK3} fontFamily="sans-serif">Fast · Automatic · Effortless</text>
        {["Pattern recognition", "Emotional reactions", "Learned skills (driving)", "First impressions", "Fight-or-flight"].map((t, i) => <text key={i} x="50" y={76 + i * 14} fontSize="9" fill={INK3} fontFamily="sans-serif">• {t}</text>)}
        {[40, 80, 120, 160, 200, 240].map((x, i) => <circle key={i} cx={x} cy="135" r="4" fill="#F59E0B" fillOpacity={0.1 + i * 0.06}>
            <animate attributeName="cx" values={`${x};${x + 15};${x}`} dur={`${1 + i * 0.2}s`} repeatCount="indefinite" /></circle>)}
        <text x="295" y="85" textAnchor="middle" fontSize="12" fill={INK4} fontFamily="sans-serif">⟷</text>
        <rect x="330" y="10" width="260" height="140" rx="16" fill="#2563EB" fillOpacity="0.05" stroke="#2563EB" strokeWidth="1.2" strokeOpacity="0.25" />
        <text x="460" y="38" textAnchor="middle" fontSize="16" fill="#2563EB" fontFamily="sans-serif" fontWeight="700">System 2</text>
        <text x="460" y="56" textAnchor="middle" fontSize="10" fill={INK3} fontFamily="sans-serif">Slow · Deliberate · Effortful</text>
        {["Complex calculations", "Careful evaluation", "Self-control", "Learning new skills", "Logical reasoning"].map((t, i) => <text key={i} x="370" y={76 + i * 14} fontSize="9" fill={INK3} fontFamily="sans-serif">• {t}</text>)}
        {[360, 400, 440, 480, 520, 560].map((x, i) => <rect key={i} x={x - 4} y="131" width="8" height="8" rx="1.5" fill="#2563EB" fillOpacity={0.08 + i * 0.05} />)}
    </svg>;
}

function BloomPyramid() {
    const L = [{ l: "Create", c: "#7C3AED", d: "Generate new ideas, design, construct", w: 140 }, { l: "Evaluate", c: "#6366F1", d: "Judge, critique, assess, justify", w: 180 }, { l: "Analyze", c: "#2563EB", d: "Compare, organize, deconstruct, examine", w: 220 }, { l: "Apply", c: "#0EA5E9", d: "Use knowledge in new situations", w: 280 }, { l: "Understand", c: "#0D9488", d: "Explain, summarize, paraphrase, classify", w: 340 }, { l: "Remember", c: "#64748B", d: "Recall facts, define, list, memorize", w: 420 }];
    return <svg viewBox="0 0 460 250" style={{ width: "100%" }}>
        {L.map((lv, i) => {
            const y = 10 + i * 38, x = 230 - lv.w / 2; return <g key={lv.l}>
                <rect x={x} y={y} width={lv.w} height={30} rx="6" fill={lv.c} fillOpacity="0.1" stroke={lv.c} strokeWidth="1" strokeOpacity="0.35">
                    <animate attributeName="width" from="0" to={lv.w} dur="0.6s" begin={`${i * 0.1}s`} fill="freeze" />
                    <animate attributeName="x" from="230" to={x} dur="0.6s" begin={`${i * 0.1}s`} fill="freeze" />
                </rect>
                <text x="230" y={y + 14} textAnchor="middle" fontSize="10" fill={lv.c} fontFamily="sans-serif" fontWeight="600">{lv.l}</text>
                <text x="230" y={y + 25} textAnchor="middle" fontSize="7.5" fill={INK4} fontFamily="sans-serif">{lv.d}</text>
            </g>;
        })}
        <text x="20" y="30" fontSize="8" fill="#7C3AED" fontFamily="sans-serif" fontWeight="600">Higher Order ↑</text>
        <text x="20" y="234" fontSize="8" fill="#64748B" fontFamily="sans-serif">Lower Order ↓</text>
    </svg>;
}

function DesignThinkingFlow() {
    const S = [{ l: "Empathize", d: "Understand users", c: "#EC4899" }, { l: "Define", d: "Frame the problem", c: "#8B5CF6" }, { l: "Ideate", d: "Generate solutions", c: "#0EA5E9" }, { l: "Prototype", d: "Build to learn", c: "#F59E0B" }, { l: "Test", d: "Validate & iterate", c: "#10B981" }];
    return <svg viewBox="0 0 600 100" style={{ width: "100%" }}>
        {S.map((s, i) => {
            const x = 60 + i * 120; return <g key={s.l}>
                {i < 4 && <line x1={x + 30} y1="35" x2={x + 90} y2="35" stroke={BD} strokeWidth="1.5" strokeDasharray="5,4" />}
                {i < 4 && <polygon points={`${x + 85},35 ${x + 80},31 ${x + 80},39`} fill={BD} />}
                <circle cx={x} cy="35" r="22" fill={s.c} fillOpacity="0.08" stroke={s.c} strokeWidth="1.2" strokeOpacity="0.4">
                    <animate attributeName="r" from="0" to="22" dur="0.5s" begin={`${i * 0.12}s`} fill="freeze" />
                </circle>
                <text x={x} y="39" textAnchor="middle" fontSize="9" fill={s.c} fontFamily="sans-serif" fontWeight="600">{s.l}</text>
                <text x={x} y="68" textAnchor="middle" fontSize="8" fill={INK3} fontFamily="sans-serif">{s.d}</text>
            </g>;
        })}
        <path d="M540,50 C540,85 60,85 60,50" fill="none" stroke={BD} strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.4" />
        <text x="300" y="92" textAnchor="middle" fontSize="7.5" fill={INK4} fontFamily="sans-serif" fontStyle="italic">iterate continuously</text>
    </svg>;
}

function SystemsLoopDiagram() {
    const N = [{ x: 250, y: 40, l: "Action", c: "#2563EB" }, { x: 420, y: 130, l: "Result", c: "#0EA5E9" }, { x: 250, y: 220, l: "Feedback", c: "#0D9488" }, { x: 80, y: 130, l: "Adjustment", c: "#6366F1" }];
    return <svg viewBox="0 0 500 260" style={{ width: "100%" }}>
        <defs><marker id="aS" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#0D9488" fillOpacity="0.6" /></marker></defs>
        <ellipse cx="250" cy="130" rx="150" ry="80" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="6,4" strokeOpacity="0.2" />
        {[[280, 55, 390, 110], [410, 155, 280, 210], [220, 210, 110, 155], [90, 110, 220, 55]].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0D9488" strokeWidth="1.2" markerEnd="url(#aS)" strokeOpacity="0.5" />)}
        {N.map(n => <g key={n.l}><circle cx={n.x} cy={n.y} r="28" fill="white" stroke={n.c} strokeWidth="1.2" strokeOpacity="0.4" /><circle cx={n.x} cy={n.y} r="28" fill={n.c} fillOpacity="0.06" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9.5" fill={INK2} fontFamily="sans-serif" fontWeight="500">{n.l}</text></g>)}
        <text x="250" y="135" textAnchor="middle" fontSize="8" fill="#0D9488" fontFamily="sans-serif" fontStyle="italic" fillOpacity="0.6">Reinforcing Loop</text>
    </svg>;
}

function KolbCycle() {
    const N = [{ x: 200, y: 25, l: "Concrete Experience", c: "#DC2626", d: "Do something" }, { x: 375, y: 110, l: "Reflective Observation", c: "#F59E0B", d: "Think about it" }, { x: 200, y: 195, l: "Abstract Conceptualization", c: "#2563EB", d: "Form a theory" }, { x: 25, y: 110, l: "Active Experimentation", c: "#10B981", d: "Test the theory" }];
    return <svg viewBox="0 0 400 230" style={{ width: "100%" }}>
        <defs><marker id="aK" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={INK4} /></marker></defs>
        <ellipse cx="200" cy="110" rx="140" ry="72" fill="none" stroke={BD} strokeWidth="1.2" strokeDasharray="5,4" />
        {[[240, 38, 350, 88], [362, 138, 240, 185], [160, 185, 50, 138], [38, 88, 160, 38]].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK4} strokeWidth="1" markerEnd="url(#aK)" strokeOpacity="0.35" />)}
        {N.map(n => <g key={n.l}><circle cx={n.x} cy={n.y} r="30" fill="white" stroke={n.c} strokeWidth="1.2" strokeOpacity="0.4" /><circle cx={n.x} cy={n.y} r="30" fill={n.c} fillOpacity="0.06" />
            <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize="7.5" fill={INK2} fontFamily="sans-serif" fontWeight="600">{n.l}</text>
            <text x={n.x} y={n.y + 10} textAnchor="middle" fontSize="6.5" fill={INK4} fontFamily="sans-serif">{n.d}</text></g>)}
    </svg>;
}

function DivConSpectrum() {
    return <svg viewBox="0 0 500 120" style={{ width: "100%" }}>
        {[-35, -20, -8, 8, 20, 35].map((a, i) => <line key={`d${i}`} x1="100" y1="55" x2={100 + 90 * Math.cos((a - 90) * Math.PI / 180)} y2={55 + 90 * Math.sin((a - 90) * Math.PI / 180)} stroke="#0EA5E9" strokeWidth="2" strokeOpacity={0.25 + i * 0.08} strokeLinecap="round">
            <animate attributeName="x2" from="100" to={100 + 90 * Math.cos((a - 90) * Math.PI / 180)} dur="0.7s" begin={`${i * 0.08}s`} fill="freeze" />
        </line>)}
        <circle cx="100" cy="55" r="8" fill="#0EA5E9" fillOpacity="0.15" stroke="#0EA5E9" strokeWidth="1.5" />
        <text x="100" y="108" textAnchor="middle" fontSize="10" fill="#0EA5E9" fontFamily="sans-serif" fontWeight="600">Diverge</text>
        <text x="100" y="118" textAnchor="middle" fontSize="7" fill={INK4} fontFamily="sans-serif">Generate many</text>
        <line x1="210" y1="55" x2="290" y2="55" stroke={BD} strokeWidth="1.5" strokeDasharray="5,4" />
        <text x="250" y="45" textAnchor="middle" fontSize="8" fill={INK4} fontFamily="sans-serif">then</text>
        {[-35, -20, -8, 8, 20, 35].map((a, i) => <line key={`c${i}`} x1={400 - 90 * Math.cos((a - 90) * Math.PI / 180)} y1={55 + 90 * Math.sin((a - 90) * Math.PI / 180)} x2="400" y2="55" stroke="#2563EB" strokeWidth="2" strokeOpacity={0.25 + i * 0.08} strokeLinecap="round">
            <animate attributeName="x1" from="400" to={400 - 90 * Math.cos((a - 90) * Math.PI / 180)} dur="0.7s" begin={`${i * 0.08 + 0.5}s`} fill="freeze" />
        </line>)}
        <circle cx="400" cy="55" r="8" fill="#2563EB" fillOpacity="0.15" stroke="#2563EB" strokeWidth="1.5" />
        <text x="400" y="108" textAnchor="middle" fontSize="10" fill="#2563EB" fontFamily="sans-serif" fontWeight="600">Converge</text>
        <text x="400" y="118" textAnchor="middle" fontSize="7" fill={INK4} fontFamily="sans-serif">Select the best</text>
    </svg>;
}

function EvidenceBars() {
    const data = [{ l: "Spaced Repetition", v: 95, c: "#2563EB" }, { l: "Retrieval Practice", v: 92, c: "#2563EB" }, { l: "Active Learning", v: 90, c: "#2563EB" }, { l: "Interleaving", v: 85, c: "#0D9488" }, { l: "Elaboration", v: 78, c: "#0D9488" }, { l: "Dual Coding", v: 75, c: "#0D9488" }, { l: "VARK Matching", v: 8, c: "#EF4444" }, { l: "Mindset Interventions", v: 12, c: "#F59E0B" }];
    return <svg viewBox="0 0 500 220" style={{ width: "100%" }}>
        {data.map((d, i) => {
            const y = 10 + i * 26; return <g key={d.l}>
                <text x="130" y={y + 14} textAnchor="end" fontSize="9" fill={INK3} fontFamily="sans-serif">{d.l}</text>
                <rect x="140" y={y + 2} width="320" height="16" rx="3" fill={BD} fillOpacity="0.5" />
                <rect x="140" y={y + 2} width={320 * d.v / 100} height="16" rx="3" fill={d.c} fillOpacity="0.65">
                    <animate attributeName="width" from="0" to={320 * d.v / 100} dur="0.8s" begin={`${i * 0.08}s`} fill="freeze" />
                </rect>
                <text x={145 + 320 * d.v / 100} y={y + 14} fontSize="8" fill={d.c} fontFamily="monospace" fontWeight="600">{d.v}%</text>
            </g>;
        })}
    </svg>;
}

function SixHatsVisual() {
    const H = [{ l: "White", d: "Facts & Data", c: "#E5E7EB", s: "#6B7280" }, { l: "Red", d: "Emotions", c: "#FECACA", s: "#DC2626" }, { l: "Black", d: "Caution", c: "#374151", s: "#111827", tc: "#fff" }, { l: "Yellow", d: "Benefits", c: "#FDE68A", s: "#D97706" }, { l: "Green", d: "Creative", c: "#A7F3D0", s: "#059669" }, { l: "Blue", d: "Process", c: "#BFDBFE", s: "#2563EB" }];
    return <svg viewBox="0 0 540 100" style={{ width: "100%" }}>
        {H.map((h, i) => {
            const x = 45 + i * 82; return <g key={h.l}>
                <ellipse cx={x} cy="40" rx="28" ry="16" fill={h.c} stroke={h.s} strokeWidth="1" strokeOpacity="0.5" />
                <rect x={x - 18} y="22" width="36" height="20" rx="5" fill={h.c} stroke={h.s} strokeWidth="1" strokeOpacity="0.5" />
                <text x={x} y="36" textAnchor="middle" fontSize="7" fill={h.tc || h.s} fontFamily="sans-serif" fontWeight="600">{h.l}</text>
                <text x={x} y="72" textAnchor="middle" fontSize="8" fill={INK2} fontFamily="sans-serif" fontWeight="500">{h.d}</text>
                <text x={x} y="84" textAnchor="middle" fontSize="6.5" fill={INK4} fontFamily="sans-serif">{["What do we know?", "How do I feel?", "What could fail?", "What's the upside?", "What else?", "What's the plan?"][i]}</text>
            </g>;
        })}
    </svg>;
}

// ═══════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════

interface Chapter {
    id: "neuro" | "thinking" | "learning" | "frameworks" | "myths" | "toolkit";
    label: string;
    num: string;
    desc: string;
    g: string;
    span: "wide" | "tall" | "normal";
}

const CHAPTERS: Chapter[] = [
    { id: "neuro", label: "The Brain", num: "01", desc: "Neural hardware behind all thinking", g: "linear-gradient(135deg,#DBEAFE,#EFF6FF,#F0F9FF)", span: "wide" },
    { id: "thinking", label: "26 Thinking Types", num: "02", desc: "Complete taxonomy of human cognition", g: "linear-gradient(135deg,#E0F2FE,#DBEAFE,#EDE9FE)", span: "tall" },
    { id: "learning", label: "30 Learning Strategies", num: "03", desc: "Evidence-ranked, practice-ready", g: "linear-gradient(135deg,#D1FAE5,#DBEAFE,#E0F2FE)", span: "tall" },
    { id: "frameworks", label: "Frameworks", num: "04", desc: "Meta-models of learning science", g: "linear-gradient(135deg,#EDE9FE,#DBEAFE,#E0F2FE)", span: "normal" },
    { id: "myths", label: "Myths vs Science", num: "05", desc: "What's debunked, what's overhyped", g: "linear-gradient(135deg,#FEF3C7,#FEE2E2,#DBEAFE)", span: "normal" },
    { id: "toolkit", label: "Practice Toolkit", num: "06", desc: "Beginner → Advanced", g: "linear-gradient(135deg,#DBEAFE,#D1FAE5,#E0F2FE)", span: "wide" },
];

const NEURO_DATA = [
    { name: "Prefrontal Cortex", role: "The command center. Drives working memory, planning, logical reasoning, and self-control. When you carefully evaluate an argument or solve a math problem, your PFC works hard and consumes significant glucose. It's the engine behind analytical, strategic, and computational thinking.", c: "#2563EB" },
    { name: "Default Mode Network", role: "Active when you're NOT focused on external tasks — daydreaming, self-reflection, future planning, creative ideation. fMRI shows highly creative individuals have stronger functional connectivity between DMN and executive networks. This is not the brain 'doing nothing' — it's making novel connections.", c: "#0EA5E9" },
    { name: "Amygdala", role: "Rapid emotional tagging — processes threat/reward before conscious awareness. This is the neural basis of System 1: fast automatic responses that evolved for survival but often produce cognitive biases in modern contexts. Essential for emotional and intuitive thinking.", c: "#EF4444" },
    { name: "Hippocampus", role: "Essential for memory formation, converting short-term experiences into long-term memories through consolidation. Each spaced retrieval strengthens hippocampal-cortical connections. London taxi drivers show measurably larger hippocampi from years of spatial navigation.", c: "#10B981" },
    { name: "Anterior Cingulate Cortex", role: "The conflict monitor. Detects when things don't add up — essential for error detection, critical thinking, and managing the cognitive dissonance between competing ideas. Active during dialectical and metacognitive thinking.", c: "#8B5CF6" },
];

const THINKING_FAMILIES = [
    {
        fam: "Logic & Reasoning", c: "#2563EB", types: [
            { name: "Analytical", tag: "Decompose complexity into clarity", body: "Breaking complex information into component parts — identifying structure, patterns, relationships. Root: Aristotle's logic. The dorsolateral PFC drives working memory and pattern decomposition.", drill: "Take any news article. Identify: claim, evidence, assumptions, logical structure. Daily for 2 weeks." },
            { name: "Deductive", tag: "General rules → guaranteed conclusions", body: "Reasoning from general premises to specific guaranteed conclusions. 'All mammals breathe air; whales are mammals; therefore whales breathe air.' Foundation of math, logic, CS, law. Valid conclusions are certain — but only if premises are true.", drill: "Construct syllogisms about everyday topics. Then critically check: are your premises actually true?" },
            { name: "Inductive", tag: "Specific observations → general patterns", body: "From observations to generalizations. Francis Bacon's empirical science. Essential for pattern recognition and hypothesis generation. The inherent weakness: conclusions are probable, never certain. Black swans exist.", drill: "Pattern journal: record observations in any domain for a week, then formulate three generalizable rules." },
            { name: "Abductive", tag: "Best explanation from incomplete evidence", body: "Inference to the most plausible explanation from limited data. Peirce coined it. A doctor sees fever, cough, opacity → abduces pneumonia. Not guessing — disciplined inference guided by evidence and parsimony.", drill: "When something unexpected happens, generate three explanations ranked by plausibility. Check evidence for each." },
            { name: "Critical", tag: "Evaluate claims through evidence", body: "Systematic evaluation of arguments and evidence. Asks: Is this true? How do we know? What are the hidden assumptions? Not negative — careful evaluation that can confirm as well as refute.", drill: "Every claim today: What's the evidence? Who benefits? What's the strongest counter-argument?" },
        ]
    },
    {
        fam: "Creative & Generative", c: "#0EA5E9", types: [
            { name: "Divergent", tag: "Generate many novel possibilities", body: "Multiple ideas radiating outward from a prompt. Guilford (1950s). Measured by fluency, flexibility, originality, elaboration. The DMN and executive control network couple dynamically during divergent thinking.", drill: "'30 circles' — draw 30 circles, turn each into a different object in 3 minutes. Quantity over quality." },
            { name: "Convergent", tag: "Narrow to the single best", body: "The complement to divergent. Not 'uncreative' — choosing the best from many options requires sophisticated evaluation. Alpha-band oscillations increase during convergent tasks.", drill: "After any brainstorm, force-rank top 10 using explicit criteria: feasibility, impact, novelty." },
            { name: "Lateral", tag: "Dig the hole somewhere else", body: "De Bono (1967): indirect, unexpected approaches. The brain follows established patterns — lateral thinking deliberately disrupts them via provocation, random entry, reversal, challenge.", drill: "Any object: 'What if it did the exact opposite of its purpose?' Follow implications for 5 minutes." },
            { name: "Associative", tag: "Connect the unconnected", body: "Engine of metaphor, analogy, creativity. Spreading activation through semantic networks — one concept primes distant ones. Mednick's Remote Associates Test measures it.", drill: "Forced connection: two random words → find five meaningful connections between them." },
        ]
    },
    {
        fam: "Holistic & Systems", c: "#0D9488", types: [
            { name: "Systems", tag: "Feedback loops and emergent wholes", body: "How components interrelate — feedback loops, emergence, unintended consequences. Key thinkers: Bertalanffy, Forrester, Senge (Fifth Discipline), Meadows (Thinking in Systems). Not vague — ecology and complexity science are rigorous.", drill: "Draw a causal loop diagram of any daily system. Find one reinforcing loop and one balancing loop." },
            { name: "Holistic", tag: "See the forest, not just trees", body: "Interconnected wholes rather than isolated parts. Gestalt psychology + Eastern philosophy. Nisbett: East Asian cognition tends holistic, Western tends analytical. Both modes needed.", drill: "Before breaking any situation into parts, describe the whole: pattern, feeling, gestalt." },
        ]
    },
    {
        fam: "Meta & Reflective", c: "#7C3AED", types: [
            { name: "Metacognitive", tag: "The multiplier — thinking about thinking", body: "Awareness + regulation of your own cognition. Flavell (1979). Knowledge (what strategies work) + Regulation (plan, monitor, evaluate). Arguably the single most valuable thinking skill — it amplifies everything else.", drill: "Before any task: 'What strategy? How will I know if it's working? What if it's not?'" },
            { name: "Reflective", tag: "Transform experience into wisdom", body: "Examining experiences and decisions to extract lessons. Dewey (1933). Reflective practitioners (Schön) improve faster because they learn from experience deliberately, not just accumulate it.", drill: "End each day: 'I did X. It worked/didn't because Y. Next time I'll try Z.' Three sentences." },
        ]
    },
    {
        fam: "Planning & Design", c: "#DC2626", types: [
            { name: "Strategic", tag: "Align actions with long-term goals", body: "Long-term planning across scenarios. Sun Tzu, Clausewitz, Porter. Not predicting the future — preparing for multiple futures simultaneously. Requires holding multiple time horizons.", drill: "Any goal → three scenarios (best/worst/likely). Find one action that helps in all three." },
            { name: "Design Thinking", tag: "Human-centered iterative solving", body: "Empathize → Define → Ideate → Prototype → Test. IDEO, Stanford d.school. Integrates creative + analytical + empathy. Not just for designers — general-purpose problem-solving.", drill: "Daily frustration → interview 2 people → define in 1 sentence → 10 solutions → prototype → test." },
            { name: "Computational", tag: "Decompose, abstract, algorithmize", body: "Four pillars: decomposition, pattern recognition, abstraction, algorithm design. Wing (2006). Not just programmers — chefs, logistics managers, project planners all use it.", drill: "Regular task → write the algorithm. Find parallel steps, dependencies, bottlenecks." },
        ]
    },
    {
        fam: "Integrative", c: "#EC4899", types: [
            { name: "Emotional", tag: "Emotions as essential cognitive input", body: "Damasio's somatic marker hypothesis: patients with emotion damage make worse decisions. Pure rationality without emotion leads to worse outcomes. Emotions register values, motivations, social info that logic misses.", drill: "Body scan before decisions: Where is tension? Excitement? Dread? These carry information." },
            { name: "Dialectical", tag: "Hold contradictions, synthesize", body: "Hegel: thesis → antithesis → synthesis. Not fence-sitting — demanding cognitive work of holding complexity. 'This job = security' AND 'it crushes creativity' → synthesis.", drill: "Strong opinion → 10 min writing strongest opposite case → 'What synthesis honors both?'" },
            { name: "Counterfactual", tag: "What if things had gone differently?", body: "Imagining alternatives. Upward counterfactuals ('could've been better') → improvement. Downward ('could've been worse') → comfort. Excessive use fuels rumination — use deliberately then stop.", drill: "After outcomes: one upward + one downward counterfactual. Extract one lesson. Stop." },
        ]
    },
];

const LEARNING_DATA = [
    { name: "Spaced Repetition", tier: "S", body: "Review at expanding intervals — 24h, 3d, 7d, 14d, 30d. Exploits the forgetting curve discovered by Ebbinghaus in 1885. A meta-analysis of 317 experiments confirmed this as one of the most robust findings in all of psychology. Can improve long-term retention by up to 200% compared to cramming.", how: "Use Anki or any spaced repetition app. Or simply spread 3 hours of study across 6 days at 30 min each instead of one marathon session." },
    { name: "Retrieval Practice", tier: "S", body: "Actively recalling information strengthens memory far more than re-reading. Each retrieval reconstructs and reinforces neural pathways. Roediger & Karpicke showed students who took practice tests retained 50% more after one week. Counter-intuitively, it also reduces test anxiety.", how: "After reading anything, close it and write everything you remember. The struggle to recall IS the learning. Use flashcards, blank-page recall, or practice tests." },
    { name: "Interleaving", tier: "S", body: "Mixing different topics during practice rather than blocking. Feels harder — a 'desirable difficulty' that strengthens discrimination and produces better transfer. Rohrer & Taylor: interleaved math produced 43% better performance.", how: "Alternate subjects every 25-30 minutes. Mix problem types within practice sets rather than grouping similar problems." },
    { name: "Active Learning", tier: "S", body: "Discussing, practicing, teaching, solving problems vastly outperforms passive listening. Freeman et al. (2014, 225 studies) in PNAS: students in lecture-only courses were 1.5× more likely to fail. One of the most robust findings in education research.", how: "Transform any passive situation: take practice tests, explain to others, solve problems, debate ideas. The protégé effect: teaching produces deeper learning than studying." },
    { name: "Elaborative Interrogation", tier: "A", body: "Asking 'why' and 'how' about everything generates connections to existing knowledge, creating richer memory traces. Instead of noting 'the heart has four chambers,' ask 'Why four? How does this relate to being warm-blooded?'", how: "For every key fact: 'Why is this true?' and 'How does this connect to something I already know?'" },
    { name: "Dual Coding", tier: "A", body: "Combining verbal and visual creates two complementary memory traces (Paivio, 1971). Roughly doubles your retrieval routes to the same information. Reading about cell division AND studying a diagram encodes through both pathways.", how: "For any concept, create both a written explanation AND a visual representation — diagram, sketch, flowchart, timeline, mind map." },
    { name: "Feynman Technique", tier: "A", body: "Choose a concept → explain it as if teaching a child → identify where your explanation breaks → go back and fill gaps → simplify further. Named after Richard Feynman. Exposes the illusion of understanding.", how: "Pick anything you learned. Explain it aloud to an imaginary 12-year-old. Where you stumble = knowledge gaps that need filling." },
    { name: "Memory Palace", tier: "A", body: "Ancient technique dating to Simonides (~500 BCE). Visualize a familiar physical space and place vivid, exaggerated images at specific locations. Exploits the brain's powerful spatial memory system. Used by virtually all memory athletes.", how: "Choose a familiar route. Assign one item per location. Make images bizarre, exaggerated, multisensory. Walk through mentally to recall." },
    { name: "Scaffolded Learning", tier: "B", body: "Temporary support structures gradually removed as competence grows (Bruner). Operationalizes Vygotsky's Zone of Proximal Development. The scaffold makes difficult tasks achievable while building independence.", how: "Use templates, worked examples, checklists when starting. Gradually remove them as skill grows." },
    { name: "Mastery Learning", tier: "B", body: "Bloom & Keller: demonstrate mastery before progressing. Under mastery conditions, 90% of students can achieve what only the top 20% achieve conventionally. Modern: Khan Academy, competency-based education.", how: "Set clear mastery criteria for each topic. Don't advance until error-free performance. Self-test to verify." },
];

const MYTHS = [
    { m: "VARK Learning Styles", v: "Debunked", d: "Over 80% of teachers believe matching instruction to visual/auditory/kinesthetic styles improves outcomes. Pashler's 2008 landmark review and a 2024 meta-analysis of 1,700+ students found zero benefit. People have preferences, but multimodal encoding benefits everyone — not because it matches a 'style' but because multiple channels create richer traces." },
    { m: "Right-Brain / Left-Brain", v: "Debunked", d: "fMRI consistently shows both hemispheres are active in virtually all cognitive tasks. There are no 'right-brained' or 'left-brained' people. Creative thinking uses distributed networks across both hemispheres." },
    { m: "We Only Use 10% of Our Brain", v: "Debunked", d: "PET and fMRI show virtually all brain regions are active at various times. Even during sleep, the brain is highly active performing memory consolidation and neural maintenance." },
    { m: "Growth Mindset Interventions", v: "Overhyped", d: "The concept has some validity — believing you can improve is probably better than believing you can't. But a 2023 meta-analysis found 98% overlap between control and treatment groups. Studies supporting the interventions almost all involve Dweck or close collaborators. Independent replications largely fail." },
    { m: "Unguided Discovery for Novices", v: "Ineffective", d: "Minimally guided discovery overwhelms working memory (Cognitive Load Theory). The sweet spot is guided discovery: structured environments where learners explore within constraints with support available." },
    { m: "Multiple Intelligences for Instruction", v: "Unvalidated", d: "Gardner's intelligences correlate with each other (suggesting a common general factor). The theory expanded conceptions of intelligence but lacks rigorous empirical testing as an instructional framework." },
];

const FRAMEWORKS_DATA = [
    { name: "Cognitive Load Theory", by: "Sweller 1988", d: "Working memory holds roughly 4 items simultaneously. Three types compete: intrinsic (material complexity), extraneous (poor instruction design), germane (productive organizing effort). Effective instruction minimizes extraneous, manages intrinsic, maximizes germane." },
    { name: "Zone of Proximal Development", by: "Vygotsky", d: "The gap between what you can do alone and with guidance. Learning is most effective in this zone — challenging enough to require stretch but achievable with support. Below = boredom. Above = overwhelm." },
    { name: "Flow State", by: "Csikszentmihalyi", d: "Challenge closely matches skill. Clear goals + immediate feedback. Transient hypofrontality silences the inner critic. To access: tasks at edge of ability, eliminate distractions, 15-20 min uninterrupted minimum." },
    { name: "Desirable Difficulties", by: "Bjork", d: "Strategies that feel harder in the moment produce dramatically better long-term results. Retrieval feels worse than re-reading. Interleaving feels worse than blocking. Spacing feels worse than cramming. The struggle IS the learning." },
    { name: "Transfer of Learning", by: "Barnett & Ceci", d: "Near transfer (similar contexts) is easy. Far transfer (across domains) is genuinely difficult and rarely spontaneous. Requires explicit principles, practice in varied contexts, and deliberate bridging." },
    { name: "Threshold Concepts", by: "Meyer & Land 2003", d: "Transformative, irreversible ideas that permanently change how you see a discipline. Often troublesome — counterintuitive, requiring integration. In economics: opportunity cost. Once grasped, you can't un-see it." },
];

// ═══════════════════════════════════════════════════
// LAYOUT COMPONENTS
// ═══════════════════════════════════════════════════

interface ReactProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    [key: string]: any;
}

const Glass = ({ children, style, ...p }: ReactProps) => <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)", ...style }} {...p}>{children}</div>;

const Wide = ({ children, bg, style }: { children: React.ReactNode; bg?: string; style?: React.CSSProperties }) => <div style={{ width: "100%", padding: "40px 32px", background: bg || "transparent", ...style }}><div style={{ maxWidth: 960, margin: "0 auto" }}>{children}</div></div>;

const FullBleed = ({ children, bg, style }: { children: React.ReactNode; bg?: string; style?: React.CSSProperties }) => <div style={{ width: "100%", padding: "48px 32px", background: bg || "linear-gradient(135deg,#F8FAFC,#EFF6FF)", ...style }}><div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div></div>;

const PullQuote = ({ text, attr }: { text: string; attr?: string }) => <div style={{ padding: "32px 40px", margin: "32px 0", borderLeft: `4px solid ${B}`, background: "linear-gradient(90deg,#EFF6FF,transparent)" }}>
    <p style={{ fontFamily: "'Newsreader',serif", fontSize: "clamp(18px,2.5vw,24px)", color: INK, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>{text}</p>
    {attr && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: INK4, marginTop: 12 }}>— {attr}</p>}
</div>;

const SectionLabel = ({ children }: { children: React.ReactNode }) => <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: B, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>{children}</div>;

const Prose = ({ children }: { children: React.ReactNode }) => <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: INK2, lineHeight: 1.85, marginBottom: 20, maxWidth: 680 }}>{children}</p>;

const TwoCol = ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start", margin: "24px 0" }}><div>{left}</div><div>{right}</div></div>;

const FamilySection = ({ fam, c, children, visual }: { fam: string; c: string; children: React.ReactNode; visual?: React.ReactNode }) => <div style={{ marginBottom: 48 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 4, height: 28, borderRadius: 2, background: c }} />
        <h3 style={{ fontFamily: "'Newsreader',serif", fontSize: 24, color: INK, fontWeight: 400 }}>{fam}</h3>
    </div>
    {visual && <div style={{ background: "linear-gradient(135deg,#F8FAFC,#EFF6FF)", border: `1px solid ${BD}`, borderRadius: 16, padding: 24, marginBottom: 20, display: "flex", justifyContent: "center" }}>{visual}</div>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>{children}</div>
</div>;

function TypeCard({ item, c }: { item: any; c: string }) {
    const [open, setOpen] = useState(false);
    return <div onClick={() => setOpen(!open)} style={{ background: "#fff", border: `1px solid ${open ? c + "35" : BD}`, borderRadius: 12, padding: open ? 22 : 16, cursor: "pointer", transition: "all 0.3s", boxShadow: open ? `0 8px 32px ${c}12` : "0 1px 3px rgba(0,0,0,0.03)", borderLeft: `3px solid ${c}`, gridColumn: open ? "1/-1" : "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: INK }}>{item.name}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: INK4 }}>{item.tag}</div></div>
            <span style={{ fontSize: 10, color: INK4, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▾</span>
        </div>
        {open && <div style={{ marginTop: 16 }/* animation slideUp moved to CSS */}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK2, lineHeight: 1.8, marginBottom: 16 }}>{item.body}</p>
            <div style={{ background: `${c}08`, borderRadius: 10, padding: 16, borderLeft: `3px solid ${c}` }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 600, color: c, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Practice Exercise</div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: INK2, lineHeight: 1.7, margin: 0 }}>{item.drill}</p>
            </div>
        </div>}
    </div>;
}

function LearningRow({ item }: { item: any }) {
    const tc = tierC[item.tier];
    const [open, setOpen] = useState(false);
    return <div onClick={() => setOpen(!open)} style={{ background: "#fff", border: `1px solid ${open ? tc.c + "35" : BD}`, borderRadius: 12, padding: open ? 24 : 18, cursor: "pointer", transition: "all 0.3s", boxShadow: open ? `0 8px 32px ${tc.c}12` : "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, color: tc.c, background: tc.b, padding: "4px 10px", borderRadius: 5, letterSpacing: 1 }}>{tc.l}</span>
            <div style={{ flex: 1 }}><div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: INK }}>{item.name}</div></div>
            <div style={{ display: "flex", gap: 3 }}>{Array.from({ length: 5 }, (_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < (item.tier === "S" ? 5 : item.tier === "A" ? 4 : 3) ? tc.c : `${tc.c}20` }} />)}</div>
            <span style={{ fontSize: 10, color: INK4, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▾</span>
        </div>
        {open && <div style={{ marginTop: 16 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK2, lineHeight: 1.8, marginBottom: 16 }}>{item.body}</p>
            <div style={{ background: `${tc.c}08`, borderRadius: 10, padding: 16, borderLeft: `3px solid ${tc.c}` }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 600, color: tc.c, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>How to Practice</div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: INK2, lineHeight: 1.7, margin: 0 }}>{item.how}</p>
            </div>
        </div>}
    </div>;
}

// ═══════════════════════════════════════════════════
// CHAPTER PAGES — Full Width Magazine Layout
// ═══════════════════════════════════════════════════

function NeuroChapter() {
    return <>
        <FullBleed><SectionLabel>The Neural Hardware</SectionLabel>
            <h2 style={{ fontFamily: "'Newsreader',serif", fontSize: "clamp(28px,4vw,44px)", color: INK, fontWeight: 400, lineHeight: 1.2, marginBottom: 16 }}>Five brain regions power<br />all 26 types of thinking</h2>
            <Prose>Your brain doesn't have a single "thinking center." Instead, large-scale networks activate, deactivate, and couple with each other depending on the cognitive task. Understanding the hardware makes every thinking strategy more intuitive.</Prose>
        </FullBleed>
        <FullBleed bg="linear-gradient(180deg,#EFF6FF,#F8FAFC)"><BrainMap /></FullBleed>
        <Wide>{NEURO_DATA.map((a, i) => <div key={a.name} style={{ display: "grid", gridTemplateColumns: "4px 1fr", gap: 16, padding: "20px 0", borderBottom: i < 4 ? `1px solid ${BD}` : "none" }}>
            <div style={{ background: a.c, borderRadius: 2 }} />
            <div><div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: INK, marginBottom: 6 }}>{a.name}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, lineHeight: 1.75 }}>{a.role}</div></div>
        </div>)}</Wide>
        <PullQuote text="Every time you practice a thinking skill, you are literally reshaping your neural architecture. Thinking and learning are skills, not fixed traits." attr="Neuroscience of learning" />
        <Wide><Glass style={{ borderRadius: 14, padding: 28 }}>
            <SectionLabel>Neural Plasticity — The Key Principle</SectionLabel>
            <Prose>The brain physically rewires itself through experience. London taxi drivers show measurably larger hippocampi. Musicians develop enlarged motor cortex regions. This process depends on <strong>sleep</strong> (consolidation during slow-wave sleep), <strong>exercise</strong> (increases BDNF, promoting neuronal growth), and <strong>dopamine</strong> (the motivation signal that drives continued learning).</Prose>
        </Glass></Wide>
    </>;
}

function ThinkingChapter() {
    return <>
        <FullBleed><SectionLabel>Part II — Complete Taxonomy</SectionLabel>
            <h2 style={{ fontFamily: "'Newsreader',serif", fontSize: "clamp(28px,4vw,44px)", color: INK, fontWeight: 400, lineHeight: 1.2, marginBottom: 16 }}>26 types of thinking,<br />organized by cognitive family</h2>
            <Prose>Most people habitually use only 2-3 thinking modes. Expert thinkers develop fluency across types and — critically — develop metacognitive awareness of which type they're using and when to switch. The families below cluster naturally complementary types.</Prose>
        </FullBleed>

        <FullBleed bg="linear-gradient(180deg,#EFF6FF,#fff)">
            <SectionLabel>The Dual Process Model</SectionLabel>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, marginBottom: 16 }}>Daniel Kahneman's framework underpins all thinking types — every cognitive act involves the interplay of fast intuition and slow deliberation.</p>
            <DualProcessDiagram />
        </FullBleed>

        <FullBleed bg="linear-gradient(180deg,#fff,#F0F9FF)">
            <SectionLabel>The Divergent–Convergent Spectrum</SectionLabel>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, marginBottom: 16 }}>Effective problem-solving oscillates: generate widely (diverge), then evaluate and select (converge). Design thinking and the double diamond model formalize this oscillation.</p>
            <DivConSpectrum />
        </FullBleed>

        <PullQuote text="The most effective thinkers don't specialize — they develop fluency across types and metacognitive awareness of which type they're using and when to switch." />

        <Wide>{THINKING_FAMILIES.map(f =>
            <FamilySection key={f.fam} fam={f.fam} c={f.c}
                visual={f.fam === "Holistic & Systems" ? <SystemsLoopDiagram /> : f.fam === "Planning & Design" ? <DesignThinkingFlow /> : null}>
                {f.types.map(t => <TypeCard key={t.name} item={t} c={f.c} />)}
            </FamilySection>
        )}</Wide>

        <FullBleed bg="linear-gradient(180deg,#F8FAFC,#EFF6FF)">
            <SectionLabel>De Bono's Six Thinking Hats</SectionLabel>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, marginBottom: 20 }}>Everyone focuses on one mode at a time — eliminating adversarial thinking. Used by IBM, DuPont, Prudential to reduce meeting times by up to 75%.</p>
            <SixHatsVisual />
        </FullBleed>
    </>;
}

function LearningChapter() {
    return <>
        <FullBleed><SectionLabel>Part III — Evidence-Ranked Strategies</SectionLabel>
            <h2 style={{ fontFamily: "'Newsreader',serif", fontSize: "clamp(28px,4vw,44px)", color: INK, fontWeight: 400, lineHeight: 1.2, marginBottom: 16 }}>30 learning strategies,<br />separated by what actually works</h2>
            <Prose>The science is clear: spaced repetition and retrieval practice have decades of robust evidence. The popular idea that people are 'visual learners' or 'auditory learners' does not survive rigorous testing. This chapter separates proven strategies from persistent myths.</Prose>
        </FullBleed>

        <FullBleed bg="linear-gradient(180deg,#EFF6FF,#fff)">
            <SectionLabel>Evidence Comparison — What works vs What's debunked</SectionLabel>
            <EvidenceBars />
        </FullBleed>

        <FullBleed bg="linear-gradient(180deg,#fff,#F0F9FF)">
            <SectionLabel>The Forgetting Curve & Spaced Repetition</SectionLabel>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, marginBottom: 20 }}>Ebbinghaus (1885) discovered that memory decays exponentially without reinforcement. Each review at the point of near-forgetting strengthens the trace, progressively extending the interval.</p>
            <ForgettingCurve />
        </FullBleed>

        <PullQuote text="Strategies that feel harder in the moment produce dramatically better long-term results. Retrieval feels worse than re-reading. Interleaving feels worse than blocking. The struggle IS the learning." attr="Bjork — Desirable Difficulties" />

        <Wide>
            <SectionLabel>S-Tier — Strongest Evidence</SectionLabel>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, marginBottom: 20 }}>These strategies have the strongest scientific support, confirmed across hundreds of studies and multiple meta-analyses.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
                {LEARNING_DATA.filter(l => l.tier === "S").map(l => <LearningRow key={l.name} item={l} />)}
            </div>
            <SectionLabel>A-Tier — Strong Evidence</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
                {LEARNING_DATA.filter(l => l.tier === "A").map(l => <LearningRow key={l.name} item={l} />)}
            </div>
            <SectionLabel>B-Tier — Moderate Evidence</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {LEARNING_DATA.filter(l => l.tier === "B").map(l => <LearningRow key={l.name} item={l} />)}
            </div>
        </Wide>

        <FullBleed bg="linear-gradient(180deg,#F8FAFC,#EFF6FF)">
            <SectionLabel>Bloom's Taxonomy — The Cognitive Skill Hierarchy</SectionLabel>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, marginBottom: 20 }}>Most classroom learning stays at lower levels (remember, understand). Higher-order thinking produces deeper learning and dramatically better transfer to new situations.</p>
            <BloomPyramid />
        </FullBleed>

        <FullBleed bg="linear-gradient(180deg,#EFF6FF,#fff)">
            <SectionLabel>Kolb's Experiential Learning Cycle</SectionLabel>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, marginBottom: 20 }}>Four stages cycling continuously — the 'learning styles' aspect lacks evidence, but the cycle itself is a powerful model for structuring any experiential learning.</p>
            <KolbCycle />
        </FullBleed>
    </>;
}

function FrameworksChapter() {
    return <>
        <FullBleed><SectionLabel>Part IV — Cognitive Frameworks</SectionLabel>
            <h2 style={{ fontFamily: "'Newsreader',serif", fontSize: "clamp(28px,4vw,44px)", color: INK, fontWeight: 400, lineHeight: 1.2, marginBottom: 16 }}>The meta-models that shape<br />how we understand learning</h2>
        </FullBleed>
        <Wide><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
            {FRAMEWORKS_DATA.map(f => <Glass key={f.name} style={{ borderRadius: 14, padding: 22 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: INK, marginBottom: 2 }}>{f.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: INK4, marginBottom: 12 }}>{f.by}</div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: INK3, lineHeight: 1.7, margin: 0 }}>{f.d}</p>
            </Glass>)}
        </div></Wide>
        <PullQuote text="The evidence strongly favors strategies that feel harder in the moment. Cognitive scientists call these 'desirable difficulties' — they slow short-term performance while dramatically accelerating long-term retention." attr="Robert Bjork" />
    </>;
}

function MythsChapter() {
    const vc = { Debunked: "#DC2626", Overhyped: "#F59E0B", Ineffective: "#DC2626", Unvalidated: "#F59E0B" };
    const vb = { Debunked: "#FEF2F2", Overhyped: "#FFFBEB", Ineffective: "#FEF2F2", Unvalidated: "#FFFBEB" };
    return <>
        <FullBleed><SectionLabel>Part V — Myths vs Science</SectionLabel>
            <h2 style={{ fontFamily: "'Newsreader',serif", fontSize: "clamp(28px,4vw,44px)", color: INK, fontWeight: 400, lineHeight: 1.2, marginBottom: 16 }}>Popular theories that<br />don't survive rigorous testing</h2>
            <Prose>The evidence hierarchy is clear. Some theories are enormously popular — surveys show over 80% of teachers believe in learning styles — but the science is devastatingly conclusive against them.</Prose>
        </FullBleed>
        <Wide>{MYTHS.map((m, i) => <div key={m.m} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 20, padding: "24px 0", borderBottom: i < MYTHS.length - 1 ? `1px solid ${BD}` : "none" }}>
            <div><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: vc[m.v], background: vb[m.v], padding: "5px 12px", borderRadius: 6, textTransform: "uppercase" }}>{m.v}</span></div>
            <div><div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 600, color: INK, marginBottom: 8 }}>{m.m}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, lineHeight: 1.75 }}>{m.d}</div></div>
        </div>)}</Wide>
    </>;
}

function ToolkitChapter() {
    const plans = [
        { p: "Beginner · Weeks 1–4", c: B, items: ["Daily retrieval practice — 5 min each evening, write everything from memory", "Metacognitive check-ins — before tasks plan strategy, during monitor, after evaluate", "Three-sentence reflection journal — 'I did X. It worked/didn't because Y. Next time Z.'"] },
        { p: "Intermediate · Weeks 5–12", c: "#0D9488", items: ["Monday: Analytical (decompose articles) · Tuesday: Divergent (30 circles)", "Wednesday: Systems (causal loop diagrams) · Thursday: Socratic (5 levels of why)", "Friday: Dialectical (steel-man opposing views)", "Set up spaced repetition, use interleaving, apply Feynman technique weekly"] },
        { p: "Advanced · Months 3–6+", c: "#7C3AED", items: ["Multi-type cycling per problem: facts → systems map → brainstorm → evaluate → counterfactual → strategy → prototype → reflect", "Practice far transfer: apply principles across unrelated domains deliberately", "Maintain cross-domain connection journal for unexpected links"] },
    ];
    return <>
        <FullBleed><SectionLabel>Part VI — Your Practice Toolkit</SectionLabel>
            <h2 style={{ fontFamily: "'Newsreader',serif", fontSize: "clamp(28px,4vw,44px)", color: INK, fontWeight: 400, lineHeight: 1.2, marginBottom: 16 }}>A structured progression<br />from beginner to advanced</h2>
            <Prose>Start with one strategy from each level. The goal is not to master all 26 thinking types and 30 strategies simultaneously — it's to gradually expand your cognitive toolkit so you can select the right tool with deliberate awareness.</Prose>
        </FullBleed>
        <Wide>{plans.map((p, i) => <div key={p.p} style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 14, padding: 28, borderLeft: `4px solid ${p.c}`, marginBottom: 16 }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700, color: INK, marginBottom: 18 }}>{p.p}</div>
            {p.items.map((item, j) => <div key={j} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.c, marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: INK3, lineHeight: 1.7 }}>{item}</span>
            </div>)}
        </div>)}</Wide>
        <FullBleed bg="linear-gradient(180deg,#F8FAFC,#EFF6FF)">
            <SectionLabel>Daily Habits — Evidence-Backed</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
                {[["😴", "Sleep 7–9h", "Memory consolidation during slow-wave sleep. Cutting sleep to study more is actively counterproductive."], ["🏃", "Exercise regularly", "Increases BDNF, promotes hippocampal neurogenesis. A single bout improves attention for hours."], ["🧘", "10 min mindfulness", "Reduces DMN hyperactivity (less rumination), strengthens attention, improves working memory."], ["📚", "Read across domains", "Associative thinking requires diverse knowledge. Read outside your field deliberately."], ["👩‍🏫", "Teach others", "The protégé effect: preparing to teach produces deeper learning than studying for a test."]].map(([e, h, d]) =>
                    <Glass key={h} style={{ borderRadius: 12, padding: 20 }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{e}</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: INK, marginBottom: 6 }}>{h}</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: INK3, lineHeight: 1.6 }}>{d}</div>
                    </Glass>
                )}
            </div>
        </FullBleed>
        <PullQuote text="Metacognition — thinking about your own thinking — is the multiplier that makes everything else work better. Without it, you might use spaced repetition but space the wrong material." />
    </>;
}

// ═══════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════

function Dock2({ chapters, onSelect, current }: { chapters: Chapter[]; onSelect: (id: string | null) => void; current: string | null }) {
    return <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200 }}>
        <Glass style={{ borderRadius: 16, padding: "6px 8px", display: "flex", gap: 4 }}>
            <button onClick={() => onSelect(null)} style={{ width: 38, height: 38, borderRadius: 10, border: "none", cursor: "pointer", background: current === null ? INK : "transparent", color: current === null ? "#fff" : INK4, fontFamily: "'Newsreader',serif", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>⌂</button>
            {chapters.map(c => <button key={c.id} onClick={() => onSelect(c.id)} style={{ width: 38, height: 38, borderRadius: 10, border: "none", cursor: "pointer", background: current === c.id ? B : "transparent", color: current === c.id ? "#fff" : INK4, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>{c.num}</button>)}
        </Glass>
    </div>;
}

function Home({ onSelect }: { onSelect: (id: string | null) => void }) {
    return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px 100px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto 48px", textAlign: "center", animation: "slideUp 0.5s ease" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: B, textTransform: "uppercase", letterSpacing: 4, marginBottom: 16 }}>The Complete Documentary</div>
            <h1 style={{ fontFamily: "'Newsreader',serif", fontSize: "clamp(44px,9vw,88px)", fontWeight: 400, color: INK, lineHeight: 1, letterSpacing: -2.5, marginBottom: 20 }}>Mind <span style={{ fontStyle: "italic", color: B }}>Atlas</span></h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: INK3, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>26 thinking types · 30 learning strategies · 10 frameworks<br />An interactive guide to human cognition</p>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: 140, gap: 12 }}>
            {CHAPTERS.map((ch, i) => {
                const cs = ch.span === "wide" ? 2 : 1, rs = ch.span === "tall" ? 2 : 1;
                return <div key={ch.id} onClick={() => onSelect(ch.id)} style={{ gridColumn: `span ${cs}`, gridRow: `span ${rs}`, background: ch.g, borderRadius: 16, padding: 24, cursor: "pointer", transition: "all 0.35s", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between", animation: `scaleIn 0.5s ${i * 0.08}s ease both` }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,99,235,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.4)", filter: "blur(30px)" }} />
                    <div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: INK4, letterSpacing: 2, marginBottom: 6 }}>{ch.num}</div>
                        <div style={{ fontFamily: "'Newsreader',serif", fontSize: rs > 1 ? 24 : 18, color: INK, lineHeight: 1.2 }}>{ch.label}</div></div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: INK3, position: "relative", zIndex: 1 }}>{ch.desc}</div>
                </div>;
            })}
        </div>
    </div>;
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════

const PAGES = { neuro: NeuroChapter, thinking: ThinkingChapter, learning: LearningChapter, frameworks: FrameworksChapter, myths: MythsChapter, toolkit: ToolkitChapter };

export default function MindAtlas() {
    const [cur, setCur] = useState<string | null>(null);
    const nav = useCallback((id: string | null) => { setCur(id); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
    const ch = CHAPTERS.find(c => c.id === cur);
    const Page = cur ? PAGES[cur] : null;
    return <div style={{ minHeight: "100vh", background: "#fff", color: INK }}>
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
      ::selection{background:#2563EB22}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
    `}</style>
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 15% 15%,rgba(37,99,235,0.03) 0%,transparent 50%),radial-gradient(ellipse at 85% 85%,rgba(14,165,233,0.02) 0%,transparent 50%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
            {!cur && <Home onSelect={nav} />}
            {cur && ch && <div style={{ animation: "fadeIn 0.3s ease" }}>
                {/* Back bar */}
                <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${BD}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => nav(null)} style={{ background: "none", border: `1px solid ${BD}`, borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: INK2, fontWeight: 500 }}>← Atlas</button>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: INK4, letterSpacing: 2 }}>CH. {ch.num}</span>
                    <span style={{ fontFamily: "'Newsreader',serif", fontSize: 14, color: INK, fontStyle: "italic" }}>{ch.label}</span>
                </div>
                <Page />
                <div style={{ textAlign: "center", padding: "48px 24px 100px", borderTop: `1px solid ${BD}` }}>
                    <div style={{ fontFamily: "'Newsreader',serif", fontSize: 16, color: INK4, fontStyle: "italic" }}>Mind Atlas</div>
                </div>
            </div>}
        </div>
        <Dock2 chapters={CHAPTERS} onSelect={nav} current={cur} />
    </div>;
}