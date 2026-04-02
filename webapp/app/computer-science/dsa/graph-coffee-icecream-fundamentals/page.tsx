"use client"

import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   GRAPH THEORY — The Complete Visual Book
   Coffee & Ice Cream Theme · Graph-Style Navigation
   ═══════════════════════════════════════════════════════════════ */

const C = {
    coffee: "#2C1810", espresso: "#1A0E08", latte: "#D4A574", cream: "#FFF8F0",
    caramel: "#C4884D", mocha: "#8B6F4E", foam: "#FEFCF8", milk: "#F5EDE3",
    teal: "#1A6B6A", tealDark: "#0E4847", tealLight: "#2A9D8F", tealPale: "#E0F5F3",
    berry: "#A4243B", mint: "#5FB49C", vanilla: "#FCF6E8", chocolate: "#3E2723",
    text: "#2C1810", textM: "#6B5B4F", textL: "#A09080", border: "#E8DDD2",
    white: "#FFFFFF",
};
const F = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Nunito+Sans:opsz,wght@6..12,400;6..12,500;6..12,600;6..12,700;6..12,800&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

// ── SECTIONS ────────────────────────────────────────────────────────────
const SECTIONS = [
    { id: "what", cat: "Foundations", title: "What is a Graph?", icon: "🕸", color: C.teal },
    { id: "why", cat: "Foundations", title: "Graph Vocabulary", icon: "📖", color: C.teal },
    { id: "types", cat: "Foundations", title: "Types of Graphs", icon: "🧊", color: C.teal },
    { id: "store", cat: "Foundations", title: "Storing Graphs", icon: "💾", color: C.teal },
    { id: "bfs", cat: "Traversal", title: "BFS", icon: "🌊", color: C.tealLight },
    { id: "dfs", cat: "Traversal", title: "DFS", icon: "🕳️", color: C.tealLight },
    { id: "dijkstra", cat: "Shortest Path", title: "Dijkstra's", icon: "🗺️", color: C.caramel },
    { id: "bellman", cat: "Shortest Path", title: "Bellman-Ford", icon: "⚖️", color: C.caramel },
    { id: "components", cat: "Structure", title: "Connected Components", icon: "🏝️", color: C.mint },
    { id: "unionfind", cat: "Structure", title: "Union-Find", icon: "🤝", color: C.mint },
    { id: "toposort", cat: "Structure", title: "Topological Sort", icon: "📐", color: C.mint },
    { id: "cycle", cat: "Structure", title: "Cycle Detection", icon: "🔄", color: C.mint },
    { id: "mst", cat: "Advanced", title: "Minimum Spanning Tree", icon: "🌉", color: C.berry },
    { id: "bipartite", cat: "Advanced", title: "Bipartite Graphs", icon: "🎨", color: C.berry },
    { id: "scc", cat: "Advanced", title: "Strongly Connected", icon: "💪", color: C.berry },
    { id: "patterns", cat: "Practice", title: "Problem Patterns", icon: "🎯", color: C.coffee },
];

// ── GRAPH VIS ───────────────────────────────────────────────────────────
const NODES = [
    { id: "A", x: 70, y: 55 }, { id: "B", x: 200, y: 35 }, { id: "C", x: 140, y: 145 },
    { id: "D", x: 310, y: 120 }, { id: "E", x: 240, y: 220 }, { id: "F", x: 400, y: 55 },
];
const EDGES = [["A", "B"], ["A", "C"], ["B", "D"], ["B", "F"], ["C", "D"], ["C", "E"], ["D", "E"], ["D", "F"]];
const ADJ = {}; EDGES.forEach(([u, v]) => { (ADJ[u] = ADJ[u] || []).push(v); (ADJ[v] = ADJ[v] || []).push(u); });
const NM = {}; NODES.forEach(n => NM[n.id] = n);

const GVis = ({ visited = [], current = null, edgeHL = [], labels = {} }) => (
    <svg viewBox="0 0 470 260" style={{ width: "100%", maxWidth: 500, display: "block", margin: "12px auto" }}>
        <defs><filter id="gl"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {EDGES.map(([u, v], i) => {
            const a = NM[u], b = NM[v]; if (!a || !b) return null;
            const hl = edgeHL.some(e => (e[0] === u && e[1] === v) || (e[0] === v && e[1] === u));
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hl ? C.berry : C.border} strokeWidth={hl ? 3 : 1.5} />;
        })}
        {NODES.map(n => {
            const isV = visited.includes(n.id), isC = current === n.id;
            return (
                <g key={n.id}>
                    {isC && <circle cx={n.x} cy={n.y} r={24} fill={C.berry} opacity={0.15} filter="url(#gl)" />}
                    <circle cx={n.x} cy={n.y} r={18} fill={isC ? C.berry : isV ? C.teal : "#FFF"} stroke={isC ? C.berry : isV ? C.tealDark : C.latte} strokeWidth={2} />
                    <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="'Nunito Sans'" fill={isV || isC ? "#FFF" : C.text}>{n.id}</text>
                    {labels[n.id] && <text x={n.x} y={n.y - 24} textAnchor="middle" fontSize={10} fontFamily="'JetBrains Mono'" fill={C.berry} fontWeight={600}>{labels[n.id]}</text>}
                </g>
            );
        })}
    </svg>
);

// ── BFS SIM ─────────────────────────────────────────────────────────────
const useSim = (buildSteps) => {
    const [vis, setVis] = useState([]); const [cur, setCur] = useState(null);
    const [ds, setDs] = useState([]); const [log, setLog] = useState([]); const [step, setStep] = useState(0);
    const [running, setRunning] = useState(false); const steps = useRef([]);
    const init = () => { steps.current = buildSteps(); setStep(0); setVis([]); setCur(null); setDs([]); setLog([]); };
    useEffect(init, []);
    const advance = () => {
        if (step >= steps.current.length) return;
        const s = steps.current[step]; setVis(s.vis); setCur(s.cur); setDs(s.ds); setLog(p => [s.msg, ...p].slice(0, 15)); setStep(p => p + 1);
    };
    const auto = async () => {
        setRunning(true); init();
        for (let i = 0; i < steps.current.length; i++) {
            await new Promise(r => setTimeout(r, 550));
            const s = steps.current[i]; setVis(s.vis); setCur(s.cur); setDs(s.ds); setLog(p => [s.msg, ...p].slice(0, 15)); setStep(i + 1);
        }
        setRunning(false);
    };
    return { vis, cur, ds, log, step, running, init, advance, auto, total: steps.current.length };
};

const BFSSim = () => {
    const buildSteps = () => {
        const s = [], vi = new Set(), q = ["A"]; vi.add("A");
        s.push({ vis: [...vi], ds: [...q], cur: null, msg: "Start at A. Enqueue A." });
        while (q.length > 0) {
            const nd = q.shift();
            s.push({ vis: [...vi], ds: [...q], cur: nd, msg: `Dequeue ${nd}. Check its neighbors...` });
            for (const nb of (ADJ[nd] || [])) {
                if (!vi.has(nb)) {
                    vi.add(nb); q.push(nb);
                    s.push({ vis: [...vi], ds: [...q], cur: nd, msg: `  ${nb} is new → enqueue. Queue: [${q.join(",")}]` });
                }
            }
        }
        s.push({ vis: [...vi], ds: [], cur: null, msg: "✓ Done! BFS visited all nodes level-by-level." });
        return s;
    };
    const sim = useSim(buildSteps);
    return (
        <div>
            <GVis visited={sim.vis} current={sim.cur} />
            <SimControls sim={sim} dsLabel="Queue" dsColor={C.teal} />
        </div>
    );
};

const DFSSim = () => {
    const buildSteps = () => {
        const s = [], vi = new Set(), st = ["A"];
        s.push({ vis: [...vi], ds: [...st], cur: null, msg: "Start at A. Push A to stack." });
        while (st.length > 0) {
            const nd = st.pop();
            if (vi.has(nd)) { s.push({ vis: [...vi], ds: [...st], cur: null, msg: `Pop ${nd} — already visited, skip.` }); continue; }
            vi.add(nd);
            s.push({ vis: [...vi], ds: [...st], cur: nd, msg: `Pop & visit ${nd}. Push unvisited neighbors...` });
            for (const nb of [...(ADJ[nd] || [])].reverse()) {
                if (!vi.has(nb)) { st.push(nb); s.push({ vis: [...vi], ds: [...st], cur: nd, msg: `  Push ${nb}. Stack: [${st.join(",")}]` }); }
            }
        }
        s.push({ vis: [...vi], ds: [], cur: null, msg: "✓ Done! DFS explored deep-first." });
        return s;
    };
    const sim = useSim(buildSteps);
    return (
        <div>
            <GVis visited={sim.vis} current={sim.cur} />
            <SimControls sim={sim} dsLabel="Stack" dsColor={C.berry} />
        </div>
    );
};

const SimControls = ({ sim, dsLabel, dsColor }) => (
    <div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "12px 0", flexWrap: "wrap" }}>
            <Btn onClick={() => { sim.init(); }} label="Reset" />
            <Btn onClick={sim.advance} label="Step →" primary disabled={sim.step >= sim.total} />
            <Btn onClick={sim.auto} label="▶ Play" primary disabled={sim.running} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "0 0 10px", flexWrap: "wrap" }}>
            <span style={{ padding: "5px 14px", borderRadius: 8, background: `${dsColor}12`, border: `1px solid ${dsColor}30`, fontFamily: "'JetBrains Mono'", fontSize: 12, color: dsColor, fontWeight: 600 }}>{dsLabel}: [{sim.ds.join(", ")}]</span>
            <span style={{ padding: "5px 14px", borderRadius: 8, background: `${C.teal}12`, border: `1px solid ${C.teal}30`, fontFamily: "'JetBrains Mono'", fontSize: 12, color: C.teal, fontWeight: 600 }}>Visited: {"{"}{sim.vis.join(", ")}{"}"}</span>
        </div>
        <div style={{ padding: 12, background: C.cream, borderRadius: 10, maxHeight: 150, overflow: "auto", border: `1px solid ${C.border}` }}>
            {sim.log.length === 0 && <span style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: C.textL }}>Press Step or Play to begin...</span>}
            {sim.log.map((l, i) => <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: i === 0 ? C.coffee : C.textM, padding: "2px 0", opacity: i === 0 ? 1 : 0.5, lineHeight: 1.5 }}>{i === 0 ? "▸ " : "  "}{l}</div>)}
        </div>
    </div>
);

const Btn = ({ label, onClick, primary = false, disabled = false }: any) => (
    <button onClick={onClick} disabled={disabled} style={{
        padding: "8px 20px", border: primary ? "none" : `1.5px solid ${C.teal}`, borderRadius: 8,
        fontFamily: "'Nunito Sans'", fontSize: 13, fontWeight: 700, cursor: disabled ? "default" : "pointer",
        background: primary ? (disabled ? C.textL : C.teal) : "transparent",
        color: primary ? "#FFF" : C.teal, opacity: disabled ? 0.5 : 1, transition: "all 0.15s",
    }}>{label}</button>
);

// ── REUSABLE UI ─────────────────────────────────────────────────────────
const P = ({ children }) => <div style={{ fontFamily: "'Nunito Sans'", fontSize: 16, lineHeight: 1.9, color: "#3A2E26" }}>{children}</div>;
const H3 = ({ children, color = C.tealDark }) => <h3 style={{ fontFamily: "'Lora'", fontSize: 21, fontWeight: 700, color, margin: "28px 0 12px" }}>{children}</h3>;
const Callout = ({ children, color = C.teal }) => <div style={{ padding: "16px 20px", background: `${color}08`, borderRadius: 12, borderLeft: `4px solid ${color}`, margin: "14px 0", fontFamily: "'Nunito Sans'", fontSize: 15, lineHeight: 1.7, color: "#3A2E26" }}>{children}</div>;
const Code = ({ children }) => <pre style={{ background: C.espresso, color: "#D4C4A8", padding: 18, borderRadius: 12, fontFamily: "'JetBrains Mono'", fontSize: 13, lineHeight: 1.7, overflowX: "auto", margin: "14px 0" }}>{children}</pre>;
const Grid = ({ children, cols = "repeat(auto-fill,minmax(220px,1fr))" }) => <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12, margin: "14px 0" }}>{children}</div>;
const Card = ({ title, children, color = C.teal, icon }) => (
    <div style={{ padding: 18, background: "#FFF", borderRadius: 14, border: `1px solid ${C.border}` }}>
        {icon && <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>}
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 14, fontWeight: 800, color, marginBottom: 6 }}>{title}</div>
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, lineHeight: 1.7, color: C.textM }}>{children}</div>
    </div>
);
const Prob = ({ items }) => <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0" }}>{items.map((p, i) => <span key={i} style={{ padding: "5px 14px", borderRadius: 20, background: C.milk, fontFamily: "'JetBrains Mono'", fontSize: 12, color: C.coffee, fontWeight: 600, border: `1px solid ${C.border}` }}>{p}</span>)}</div>;
const Table = ({ rows }) => (
    <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, margin: "14px 0" }}>
        {rows.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${row.length},1fr)`, background: i === 0 ? C.coffee : i % 2 === 0 ? "#FFF" : C.cream }}>
                {row.map((cell, j) => <div key={j} style={{ padding: "10px 14px", fontFamily: i === 0 ? "'Nunito Sans'" : "'Nunito Sans'", fontSize: 13, fontWeight: i === 0 || j === 0 ? 700 : 500, color: i === 0 ? "#FFF" : j === 0 ? C.tealDark : C.text, borderLeft: j > 0 ? `1px solid ${i === 0 ? "rgba(255,255,255,0.15)" : C.border}` : "none" }}>{cell}</div>)}
            </div>
        ))}
    </div>
);
const RW = ({ icon, title, desc }) => (
    <div style={{ display: "flex", gap: 14, padding: 16, background: "#FFF", borderRadius: 12, border: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
        <div><div style={{ fontFamily: "'Nunito Sans'", fontSize: 14, fontWeight: 700, color: C.coffee, marginBottom: 3 }}>{title}</div><div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, lineHeight: 1.65, color: C.textM }}>{desc}</div></div>
    </div>
);

// ── CONTENT ─────────────────────────────────────────────────────────────
const CONTENT = {
    what: () => (
        <div>
            <P><p>Take a sheet of paper. Draw some dots. Draw some lines connecting the dots. Congratulations — you just made a graph.</p>
                <p>A <strong>graph</strong> is a collection of <strong>nodes</strong> (the dots — also called vertices) and <strong>edges</strong> (the lines — the connections between dots). That's the entire definition. Two ingredients. Nothing else.</p>
                <p>But this incredibly simple idea turns out to be one of the most powerful tools in all of computer science. Why? Because <em>connections are everywhere</em>.</p></P>
            <GVis />
            <H3>Why Graphs Matter</H3>
            <P><p>Almost every interesting real-world system is a network of connected things. Graphs give us a universal language to describe, store, and analyze these networks:</p></P>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "14px 0" }}>
                <RW icon="🗺️" title="Road Networks" desc="Every intersection is a node. Every road is an edge. Google Maps uses graph algorithms (Dijkstra's, A*) to find the fastest route between two locations — this happens billions of times per day." />
                <RW icon="👥" title="Social Networks" desc="On Instagram, every user is a node. Every follow is a directed edge (I follow you, but you may not follow me). 'People you may know' uses graph algorithms to find users who are 2-3 connections away from you." />
                <RW icon="🌐" title="The Internet" desc="Every web page is a node. Every hyperlink is a directed edge. Google's original PageRank algorithm — the one that made Google a trillion-dollar company — is a graph algorithm that ranks pages by how many other pages link to them." />
                <RW icon="📦" title="Package Managers" desc="When you run 'npm install', each package is a node and each dependency is an edge. npm builds a dependency graph and uses topological sort to install packages in the right order — dependencies first." />
                <RW icon="🧬" title="Biology" desc="Proteins are nodes, interactions are edges (protein interaction networks). Neurons are nodes, synapses are edges (neural networks). Species are nodes, predator-prey relationships are edges (food webs)." />
                <RW icon="✈️" title="Airlines" desc="Every airport is a node. Every flight route is a weighted edge (weight = distance or cost). Airlines use graph algorithms to find optimal routing, minimize fuel, and handle scheduling." />
            </div>
            <Callout>Every time you use Google Maps, search Google, scroll Instagram, install a package, or book a flight — graph algorithms are running behind the scenes.</Callout>
            <H3>What Data Structures and Algorithms are Based on Graphs?</H3>
            <P><p>Graphs are the parent structure that many other concepts are built on:</p></P>
            <Grid>
                <Card title="Trees" color={C.teal} icon="🌲">A tree is just a graph with no cycles and a single root. Binary trees, BSTs, heaps, tries — all special cases of graphs.</Card>
                <Card title="Linked Lists" color={C.teal} icon="⛓">A linked list is a graph where each node has exactly one outgoing edge (to the next node). It's the simplest possible graph.</Card>
                <Card title="BFS / DFS" color={C.tealLight} icon="🔍">The two fundamental traversal algorithms. BFS uses a queue for level-by-level. DFS uses a stack for deep-first.</Card>
                <Card title="Dijkstra's / A*" color={C.caramel} icon="🗺️">Shortest path algorithms for weighted graphs. GPS navigation, network routing, game pathfinding.</Card>
                <Card title="Topological Sort" color={C.mint} icon="📐">Ordering nodes by dependencies. Build systems, package managers, course prerequisites.</Card>
                <Card title="Union-Find" color={C.mint} icon="🤝">Tracking connected groups. Social network clusters, Kruskal's MST algorithm.</Card>
                <Card title="MST (Prim's / Kruskal's)" color={C.berry} icon="🌉">Connecting all nodes at minimum cost. Network design, clustering.</Card>
                <Card title="SCC (Tarjan's / Kosaraju's)" color={C.berry} icon="💪">Finding strongly connected components in directed graphs. Web analysis, circuit verification.</Card>
            </Grid>
        </div>
    ),
    why: () => (
        <div>
            <P><p>Before diving into algorithms, you need to speak the language. Here's every graph term you'll encounter, explained in plain English with why it matters:</p></P>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                    { term: "Node (Vertex)", why: "The 'thing' in your network — a person, city, web page, variable.", real: "On LinkedIn, every user profile is a node.", icon: "●" },
                    { term: "Edge", why: "A connection between two nodes. The relationship.", real: "On LinkedIn, a 'connection' between two people is an edge.", icon: "—" },
                    { term: "Directed Edge", why: "A one-way connection. A→B doesn't mean B→A.", real: "On Twitter, following someone is directed — I follow you, but you don't necessarily follow me.", icon: "→" },
                    { term: "Undirected Edge", why: "A two-way connection. If A connects to B, then B connects to A.", real: "On Facebook, friendship is mutual — if I'm your friend, you're mine.", icon: "↔" },
                    { term: "Weight", why: "A cost, distance, or value on an edge. Not all connections are equal.", real: "Road from Delhi to Mumbai: 1,400 km (weight). Road from Delhi to Agra: 230 km (different weight).", icon: "⚖" },
                    { term: "Degree", why: "How many edges connect to a node. Popular nodes have high degree.", real: "A celebrity with 10 million followers has degree 10 million (in-degree on a directed graph).", icon: "#" },
                    { term: "Path", why: "A sequence of nodes connected by edges. 'Can I get from A to B?'", real: "The route Google Maps shows you is a path through the road graph.", icon: "∿" },
                    { term: "Cycle", why: "A path that starts and ends at the same node. A→B→C→A is a cycle.", real: "Circular dependencies in npm — package A needs B, B needs C, C needs A. This is a cycle, and it breaks the build.", icon: "↻" },
                    { term: "Connected", why: "Every node can reach every other node. No 'islands'.", real: "The road network of a continent is connected (you can drive between any two cities). Islands are disconnected.", icon: "◉" },
                    { term: "Component", why: "A maximal connected subgraph. Each 'island' in a disconnected graph is a component.", real: "In a classroom, friend groups are components — kids within a group are connected, but groups may not connect to each other.", icon: "◎" },
                    { term: "DAG", why: "Directed Acyclic Graph — directed edges, no cycles. Essential for ordering.", real: "A recipe: chop onions → sauté onions → add tomatoes → simmer. Steps have an order, no step depends on a later step.", icon: "▽" },
                    { term: "Sparse vs Dense", why: "Sparse: few edges relative to nodes. Dense: many edges (close to complete).", real: "A highway map is sparse (each city connects to ~4 others). A complete social graph of 5 friends is dense (everyone knows everyone).", icon: "◇" },
                ].map((t, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 160px 1fr", background: i % 2 === 0 ? "#FFF" : C.cream, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: `${C.teal}08`, fontFamily: "'JetBrains Mono'", fontSize: 18, color: C.teal }}>{t.icon}</div>
                        <div style={{ padding: "12px 14px" }}><div style={{ fontFamily: "'Nunito Sans'", fontSize: 14, fontWeight: 800, color: C.coffee }}>{t.term}</div><div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: C.textM, marginTop: 2 }}>{t.why}</div></div>
                        <div style={{ padding: "12px 14px", borderLeft: `1px solid ${C.border}` }}>
                            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 2 }}>Real example</div>
                            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: C.textM, lineHeight: 1.5 }}>{t.real}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ),
    types: () => (
        <div>
            <P><p>Not all graphs are the same. Each type exists because a different kind of relationship needs to be modeled. Here's every type, why it exists, and where you'll see it:</p></P>
            <Grid cols="1fr 1fr">
                {[
                    { t: "Undirected Graph", w: "Friendships, roads, chemical bonds", why: "When the relationship is mutual — if A connects to B, then B connects to A. Facebook friendships, two-way roads, molecular bonds.", ex: "Facebook friend graph — 2.9 billion nodes, ~200 billion edges", icon: "↔", color: C.teal },
                    { t: "Directed Graph (Digraph)", w: "Follows, web links, dependencies", why: "When direction matters — A→B doesn't mean B→A. Twitter follows, web hyperlinks (page A links to page B), function call graphs.", ex: "Google's web graph — 130+ trillion pages, directed links", icon: "→", color: C.caramel },
                    { t: "Weighted Graph", w: "Maps, networks, costs", why: "When connections have different costs. Road A→B is 15 km, road B→C is 30 km. Essential for 'shortest path' and 'cheapest route' problems.", ex: "Google Maps — every road has a distance and estimated travel time as weights", icon: "⚖", color: C.berry },
                    { t: "Unweighted Graph", w: "Social connections, reachability", why: "When you only care about 'is there a connection?' not 'how strong?' Finding if two people are connected in a social network.", ex: "LinkedIn connection graph — you're either connected or you're not", icon: "○", color: C.mint },
                    { t: "Directed Acyclic Graph (DAG)", w: "Dependencies, schedules, git", why: "When there's an order but no circular dependencies. Tasks where A must happen before B, B before C, but C never requires A. Crucial for topological sort.", ex: "Git commit history — each commit points to its parent(s), never forward", icon: "▽", color: C.coffee },
                    { t: "Cyclic Graph", w: "Circuits, state machines, loops", why: "Contains loops — you can follow edges and return to where you started. Modeling repeating processes, electronic circuits, game state transitions.", ex: "A washing machine's cycle: fill → wash → rinse → spin → fill...", icon: "↻", color: C.chocolate },
                    { t: "Bipartite Graph", w: "Matching, scheduling, assignments", why: "Nodes split into two groups where edges only connect across groups, never within. Used for matching problems: students to courses, workers to tasks.", ex: "Tinder — two groups (users seeking matches), edges are 'likes', only across groups", icon: "◐", color: C.teal },
                    { t: "Complete Graph", w: "Tournament brackets, full networks", why: "Every node connects to every other node. Represents scenarios where everyone interacts with everyone. Useful as worst-case analysis.", ex: "A round-robin tournament — every team plays every other team exactly once", icon: "✦", color: C.caramel },
                ].map((g, i) => (
                    <div key={i} style={{ background: "#FFF", borderRadius: 14, border: `1px solid ${C.border}`, padding: 20, borderTop: `3px solid ${g.color}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <span style={{ fontSize: 24 }}>{g.icon}</span>
                            <div style={{ fontFamily: "'Lora'", fontSize: 17, fontWeight: 700, color: g.color }}>{g.t}</div>
                        </div>
                        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, lineHeight: 1.7, color: C.textM, marginBottom: 10 }}>{g.why}</div>
                        <div style={{ padding: "10px 14px", background: C.cream, borderRadius: 8, fontFamily: "'Nunito Sans'", fontSize: 12, color: C.coffee }}>
                            <strong>Example:</strong> {g.ex}
                        </div>
                    </div>
                ))}
            </Grid>
        </div>
    ),
    store: () => (
        <div>
            <P><p>A graph is an abstract concept — dots and lines. But to use it in code, you need to store it in a concrete data structure. There are two main approaches, and choosing the right one matters:</p></P>
            <H3 color={C.teal}>Adjacency List (use 95% of the time)</H3>
            <P><p>A dictionary where each node maps to a list of its neighbors. Like a contact list — each person has their own list of friends.</p></P>
            <Callout color={C.teal}><strong>Why it exists:</strong> Most real-world graphs are <em>sparse</em> — each node connects to only a small fraction of all other nodes. A city connects to maybe 4-6 neighboring cities, not to all 10,000 cities in the country. An adjacency list only stores the connections that exist, using O(V + E) memory.</Callout>
            <Code>{`# Undirected graph
graph = {
    "Delhi":     ["Agra", "Jaipur", "Chandigarh"],
    "Agra":      ["Delhi", "Jaipur", "Lucknow"],
    "Jaipur":    ["Delhi", "Agra"],
    "Chandigarh":["Delhi"],
    "Lucknow":   ["Agra"],
}

# Weighted graph — store (neighbor, weight) tuples
roads = {
    "Delhi":  [("Agra", 230), ("Jaipur", 280)],
    "Agra":   [("Delhi", 230), ("Lucknow", 340)],
    "Jaipur": [("Delhi", 280)],
}

# Build from edge list (common in LeetCode)
from collections import defaultdict
def build_graph(edges, directed=False):
    g = defaultdict(list)
    for u, v in edges:
        g[u].append(v)
        if not directed:
            g[v].append(u)
    return g`}</Code>
            <H3 color={C.caramel}>Adjacency Matrix (use for dense graphs)</H3>
            <P><p>A 2D grid where matrix[i][j] = 1 if there's an edge from i to j. Like a spreadsheet with every possible connection marked.</p></P>
            <Callout color={C.caramel}><strong>Why it exists:</strong> When you need to check "is there an edge between A and B?" in O(1). An adjacency list requires scanning A's neighbor list (O(degree)). The matrix gives an instant answer. But it uses O(V²) memory, which is wasteful for sparse graphs.</Callout>
            <Table rows={[
                ["Aspect", "Adjacency List", "Adjacency Matrix"],
                ["Space", "O(V + E) — efficient", "O(V²) — wasteful if sparse"],
                ["Check edge exists", "O(degree) — scan neighbors", "O(1) — instant lookup"],
                ["Get all neighbors", "O(degree) — just iterate list", "O(V) — scan entire row"],
                ["Add edge", "O(1)", "O(1)"],
                ["Best for", "Sparse graphs (most real)", "Dense graphs, weighted"],
                ["Python", "dict of lists", "2D list or numpy array"],
            ]} />
        </div>
    ),
    bfs: () => (
        <div>
            <P><p><strong>Imagine you drop a stone into a still pond.</strong> Ripples expand outward in perfect concentric circles. Every point at distance 1 from the splash is reached before any point at distance 2. Then distance 2 before distance 3. BFS explores a graph exactly like this — level by level, layer by layer.</p></P>
            <Callout color={C.teal}><strong>The guarantee:</strong> BFS finds the shortest path in an unweighted graph. Because it visits all nodes at distance K before any at distance K+1, the first time it reaches a node is always via the shortest route.</Callout>
            <P><p><strong>Why it was invented:</strong> You need to find the minimum number of moves/steps/hops to get from A to B. DFS might find a path, but could wander deep into a wrong branch — taking 100 steps when 3 would do. BFS, by exploring outward uniformly, guarantees the shortest route.</p>
                <p><strong>The mechanism:</strong> BFS uses a <strong>queue</strong> (FIFO — first in, first out). Start at source, add it to the queue. While the queue isn't empty: remove the front node, visit all its unvisited neighbors, add them to the back of the queue. Because a queue processes in the order items were added, closer nodes are always processed first.</p></P>
            <Code>{`from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()    # take from FRONT
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)  # add to BACK
    return order`}</Code>
            <H3>🧪 Interactive BFS Simulator</H3>
            <BFSSim />
            <H3>Real-World BFS</H3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
                <RW icon="🧩" title="Shortest Path in a Maze" desc="Each cell is a node, adjacent cells are edges. BFS from the entrance finds the exit in minimum steps. Every puzzle game's pathfinding starts here." />
                <RW icon="👥" title="LinkedIn '2nd Connections'" desc="BFS from your profile: 1st connections are at distance 1, 2nd connections at distance 2. BFS naturally computes these 'degrees of separation'." />
                <RW icon="🍊" title="Rotting Oranges (LeetCode #994)" desc="Multiple rotten oranges spread simultaneously. This is multi-source BFS — start from ALL rotten oranges at once and expand outward." />
                <RW icon="📡" title="Network Broadcasting" desc="When a router sends a packet to 'everyone,' it floods the network using BFS — each router forwards to its neighbors, layer by layer." />
            </div>
            <Prob items={["Tree Level Order #102", "Rotting Oranges #994", "Word Ladder #127", "01 Matrix #542", "Shortest Path Binary Matrix #1091", "Open the Lock #752"]} />
        </div>
    ),
    dfs: () => (
        <div>
            <P><p><strong>Imagine exploring a cave system.</strong> You pick one tunnel and follow it as deep as it goes. Dead end? Walk back to the last fork and try the next tunnel. You mark each tunnel so you don't go in circles. DFS goes as deep as possible before backtracking — the opposite of BFS's wide exploration.</p></P>
            <Callout color={C.berry}><strong>Warning:</strong> DFS does NOT guarantee shortest paths. It might find a valid path, but not the shortest one. Its strength is exhaustive exploration — finding ALL paths, detecting cycles, topological ordering, and connected components.</Callout>
            <P><p><strong>The mechanism:</strong> DFS uses a <strong>stack</strong> (LIFO — last in, first out), or simply recursion (which uses the call stack). Start at a node, mark visited, then recursively visit each unvisited neighbor. When all neighbors are done, backtrack.</p></P>
            <Code>{`# Recursive DFS (clean, Pythonic)
def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited

# Iterative DFS (avoids stack overflow)
def dfs_iter(graph, start):
    visited, stack = set(), [start]
    while stack:
        node = stack.pop()         # LIFO — take from TOP
        if node not in visited:
            visited.add(node)
            for nb in graph[node]:
                if nb not in visited:
                    stack.append(nb)
    return visited`}</Code>
            <H3>🧪 Interactive DFS Simulator</H3>
            <DFSSim />
            <H3>BFS vs DFS — The Complete Comparison</H3>
            <Table rows={[
                ["", "BFS 🌊", "DFS 🕳️"],
                ["Data Structure", "Queue (FIFO)", "Stack (LIFO) / Recursion"],
                ["Exploration", "Level by level (wide first)", "Deep first, then backtrack"],
                ["Shortest path?", "✅ Yes (unweighted)", "❌ No guarantee"],
                ["Memory", "O(width of graph)", "O(depth of graph)"],
                ["Finds all paths?", "Not designed for it", "✅ Natural (backtracking)"],
                ["Cycle detection", "Possible but less natural", "✅ Natural (gray/black coloring)"],
                ["Topological sort", "✅ Kahn's algorithm", "✅ Post-order based"],
                ["Connected components", "✅ Yes", "✅ Yes"],
                ["When to use", "Shortest path, level-order", "All paths, cycles, topo sort, components"],
                ["Analogy", "Pond ripples", "Cave exploration"],
            ]} />
            <Prob items={["Number of Islands #200", "Clone Graph #133", "Path Sum #112", "Course Schedule #207", "Pacific Atlantic Water Flow #417", "Surrounded Regions #130"]} />
        </div>
    ),
    dijkstra: () => (
        <div>
            <P><p><strong>Imagine you're a delivery driver</strong> and you need to find the cheapest route from your warehouse to every customer. Roads have different costs (distance, tolls, traffic). BFS won't work because it treats all edges as equal. You need an algorithm that accounts for weights.</p></P>
            <Callout><strong>Dijkstra's Algorithm</strong> finds the shortest path from one source node to ALL other nodes in a graph with non-negative edge weights. It's the algorithm behind every GPS navigation system.</Callout>
            <GVis />
            <P><p><strong>How it works:</strong> Like BFS, but instead of a regular queue, use a <strong>min-heap (priority queue)</strong>. Always process the node with the smallest known distance next. When you process a node, check if going through it offers a shorter path to any of its neighbors. If yes, update their distances.</p>
                <p><strong>Why it works:</strong> Because all edge weights are non-negative, once you've found the cheapest way to reach a node, no future path through heavier edges can beat it. This "greedy" property is what makes Dijkstra's correct.</p></P>
            <Code>{`import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    heap = [(0, start)]
    
    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]: continue   # outdated entry
        
        for neighbor, weight in graph[node]:
            new_d = d + weight
            if new_d < dist[neighbor]:
                dist[neighbor] = new_d
                heapq.heappush(heap, (new_d, neighbor))
    
    return dist`}</Code>
            <H3>All Shortest Path Algorithms Compared</H3>
            <Table rows={[
                ["Algorithm", "Graph Type", "Complexity", "Use Case"],
                ["BFS", "Unweighted", "O(V + E)", "Minimum hops/steps"],
                ["Dijkstra's", "Weighted (≥ 0)", "O((V+E) log V)", "GPS, network routing"],
                ["Bellman-Ford", "Any weights", "O(V × E)", "Currency exchange, negative cycles"],
                ["Floyd-Warshall", "All pairs", "O(V³)", "Small graphs, every-to-every"],
                ["A* Search", "Weighted + heuristic", "O(E)", "Game pathfinding, robotics"],
            ]} />
            <Prob items={["Network Delay Time #743", "Cheapest Flights K Stops #787", "Path with Min Effort #1631", "Shortest Path in Grid with Obstacles #1293"]} />
        </div>
    ),
    bellman: () => (
        <div>
            <P><p><strong>What if some roads have negative costs?</strong> Maybe a road gives you money (a toll rebate), or a currency exchange gives you more than you started with. Dijkstra's breaks with negative weights — it assumes "once cheapest, always cheapest," which isn't true with negative edges. Bellman-Ford handles this.</p></P>
            <Callout color={C.caramel}><strong>Bellman-Ford</strong> relaxes all edges V-1 times. It's slower than Dijkstra's (O(VE) vs O((V+E)log V)), but it works with negative weights AND detects negative cycles (infinite money loops in currency exchange!).</Callout>
            <Code>{`def bellman_ford(n, edges, start):
    dist = [float('inf')] * n
    dist[start] = 0
    
    for _ in range(n - 1):         # relax V-1 times
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycles (V-th relaxation)
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            return "NEGATIVE CYCLE DETECTED"
    
    return dist`}</Code>
            <RW icon="💱" title="Currency Arbitrage" desc="Exchange rates form a weighted directed graph. A negative cycle means you can start with $100, exchange through several currencies, and end up with more than $100 — free money! Bellman-Ford detects these cycles." />
        </div>
    ),
    components: () => (
        <div>
            <P><p><strong>Imagine looking at a map of islands.</strong> Each island is a group of connected land cells. Two cells belong to the same island if you can walk between them without swimming. Each island is a "connected component" — a maximal group of nodes where everyone can reach everyone else.</p></P>
            <Callout><strong>Connected Component</strong> = a maximal subgraph where every node can reach every other node. A graph with 3 separate groups has 3 connected components.</Callout>
            <P><p><strong>How to find them:</strong> Start a BFS or DFS from any unvisited node — every node it reaches belongs to the same component. Then find the next unvisited node and repeat. Each BFS/DFS discovers one component.</p></P>
            <Code>{`def count_components(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    count = 0
    
    for node in range(n):
        if node not in visited:
            # BFS/DFS from this node — finds one component
            stack = [node]
            while stack:
                curr = stack.pop()
                if curr not in visited:
                    visited.add(curr)
                    for nb in graph[curr]:
                        stack.append(nb)
            count += 1
    
    return count`}</Code>
            <RW icon="🏝️" title="Number of Islands (LeetCode #200)" desc="A grid of land ('1') and water ('0'). Each connected group of land cells is an island. DFS/BFS from each unvisited '1' finds one island. Count the total — that's your answer." />
            <Prob items={["Number of Islands #200", "Connected Components #323", "Accounts Merge #721", "Friend Circles #547"]} />
        </div>
    ),
    unionfind: () => (
        <div>
            <P><p><strong>Imagine a classroom on the first day of school.</strong> Everyone is their own group. When Alice befriends Bob, their groups merge into one. When Bob befriends Charlie, Charlie's group merges with Alice and Bob's group (since Bob is already with Alice). Union-Find tracks these merging groups with near-instant speed.</p></P>
            <Callout color={C.mint}><strong>Two operations:</strong> find(x) — "which group is x in?" and union(x, y) — "merge x's group with y's group." With path compression + union by rank, both run in nearly O(1) time.</Callout>
            <Code>{`class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # number of groups
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]: px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]: self.rank[px] += 1
        self.count -= 1
        return True`}</Code>
            <Prob items={["Number of Components #323", "Redundant Connection #684", "Accounts Merge #721", "Graph Valid Tree #261", "Earliest Moment Everyone Friends #1101"]} />
        </div>
    ),
    toposort: () => (
        <div>
            <P><p><strong>You're cooking a complex meal.</strong> You can't serve the dish before cooking it. You can't cook it before prepping ingredients. You can't prep without buying groceries. Topological sort gives you a valid order for tasks with dependencies — ensuring every prerequisite is completed before the task that needs it.</p></P>
            <Callout><strong>Only works on DAGs</strong> (Directed Acyclic Graphs). If there's a cycle — task A needs B, B needs C, C needs A — no valid ordering exists, and the algorithm detects this.</Callout>
            <Code>{`from collections import deque, defaultdict

def topo_sort(n, edges):  # Kahn's Algorithm
    graph = defaultdict(list)
    in_deg = [0] * n
    for u, v in edges:
        graph[u].append(v)
        in_deg[v] += 1
    
    queue = deque(i for i in range(n) if in_deg[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nb in graph[node]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                queue.append(nb)
    
    return order if len(order) == n else []  # empty = cycle`}</Code>
            <H3>Real-World Uses</H3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <RW icon="🔨" title="Build Systems (Make, Webpack, Gradle)" desc="Source files depend on each other. The build system creates a dependency graph and uses topological sort to compile files in the right order." />
                <RW icon="📦" title="Package Managers (npm, pip)" desc="'npm install' builds a dependency graph of all packages. Topological sort determines install order — dependencies before dependents." />
                <RW icon="📊" title="Spreadsheet Evaluation" desc="When cell B1 = A1 + A2, and C1 = B1 * 2, the spreadsheet evaluates in topological order: A1, A2, B1, then C1." />
            </div>
            <Prob items={["Course Schedule #207", "Course Schedule II #210", "Alien Dictionary #269", "Min Height Trees #310", "Parallel Courses #1136"]} />
        </div>
    ),
    cycle: () => (
        <div>
            <P><p><strong>You're following a chain of web links.</strong> Page A links to B, B links to C, C links back to A. You're stuck in a loop. Cycle detection finds these loops — and it's essential because cycles cause infinite loops, deadlocks, and impossible dependency chains.</p></P>
            <H3 color={C.teal}>In Undirected Graphs</H3>
            <P><p>During DFS, if you encounter a neighbor that's already visited AND it's not your direct parent, there's a cycle. Or use Union-Find: if union(A, B) returns False (already connected), adding that edge would create a cycle.</p></P>
            <H3 color={C.berry}>In Directed Graphs (3-Color DFS)</H3>
            <P><p>Track three states: <strong>White</strong> (unvisited), <strong>Gray</strong> (in progress — currently in DFS stack), <strong>Black</strong> (fully processed). If you encounter a <strong>gray</strong> node during DFS, that's a back edge — a cycle.</p></P>
            <Code>{`def has_cycle_directed(graph, n):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n
    
    def dfs(node):
        color[node] = GRAY
        for nb in graph[node]:
            if color[nb] == GRAY: return True   # cycle!
            if color[nb] == WHITE and dfs(nb): return True
        color[node] = BLACK
        return False
    
    return any(dfs(i) for i in range(n) if color[i] == WHITE)`}</Code>
            <Prob items={["Course Schedule #207", "Redundant Connection #684", "Find Eventual Safe States #802", "Detect Cycles in 2D Grid #1559"]} />
        </div>
    ),
    mst: () => (
        <div>
            <P><p><strong>You're laying internet cable between 10 office buildings.</strong> Each possible cable has a different cost. You need to connect ALL buildings spending the least money, with no redundant cables (no loops). The result: a tree that spans all nodes with minimum total weight.</p></P>
            <Callout color={C.berry}><strong>Kruskal's:</strong> Sort all edges by weight. Add the cheapest edge that doesn't create a cycle (checked with Union-Find). Repeat until all nodes are connected.<br /><strong>Prim's:</strong> Start from any node. Always add the cheapest edge that connects a new node to the existing tree (using a min-heap).</Callout>
            <Code>{`def kruskal(n, edges):
    edges.sort(key=lambda e: e[2])  # sort by weight
    uf = UnionFind(n)
    mst, total = [], 0
    for u, v, w in edges:
        if uf.union(u, v):
            mst.append((u, v, w))
            total += w
    return mst, total`}</Code>
            <RW icon="🌐" title="Network Infrastructure" desc="Internet service providers use MST algorithms to determine the cheapest way to lay fiber optic cables connecting all cities in a region." />
            <Prob items={["Min Cost Connect All Points #1584", "Connecting Cities Min Cost #1135", "Min Cost to Make All Points Connected"]} />
        </div>
    ),
    bipartite: () => (
        <div>
            <P><p><strong>Can you color every node in a graph with exactly 2 colors</strong> such that no two adjacent nodes share a color? If yes, the graph is bipartite. The nodes naturally divide into two groups where all edges go between groups, never within a group.</p></P>
            <Callout><strong>Why it matters:</strong> Many matching problems are bipartite: students to courses, workers to tasks, job applicants to positions. A bipartite graph means you're matching across two distinct groups.</Callout>
            <P><p><strong>How to check:</strong> BFS/DFS with 2-coloring. Start with any node as color 0. Color all neighbors as color 1. Color their neighbors as color 0. If you ever need to color a node that's already the wrong color — it's not bipartite.</p></P>
            <Code>{`def is_bipartite(graph, n):
    color = [-1] * n
    for start in range(n):
        if color[start] != -1: continue
        queue = deque([start])
        color[start] = 0
        while queue:
            node = queue.popleft()
            for nb in graph[node]:
                if color[nb] == -1:
                    color[nb] = 1 - color[node]
                    queue.append(nb)
                elif color[nb] == color[node]:
                    return False  # same color = not bipartite
    return True`}</Code>
            <Prob items={["Is Graph Bipartite? #785", "Possible Bipartition #886"]} />
        </div>
    ),
    scc: () => (
        <div>
            <P><p><strong>In a directed graph, a Strongly Connected Component (SCC)</strong> is a maximal group of nodes where every node can reach every other node following edge directions. It's like a group of cities where you can drive from any city to any other city (one-way roads only).</p></P>
            <Callout color={C.berry}><strong>Why it matters:</strong> The web can be decomposed into SCCs — within an SCC, every page can reach every other page via links. Compiler optimization, circuit verification, and 2-SAT solving all use SCCs.</Callout>
            <P><p><strong>Algorithms:</strong> Tarjan's (single DFS pass) and Kosaraju's (two DFS passes). Both run in O(V + E).</p></P>
            <Code>{`# Kosaraju's Algorithm (simpler to understand)
def kosaraju(graph, n):
    # Step 1: DFS and record finish order
    visited, order = set(), []
    def dfs1(node):
        visited.add(node)
        for nb in graph[node]:
            if nb not in visited: dfs1(nb)
        order.append(node)  # post-order
    for i in range(n):
        if i not in visited: dfs1(i)
    
    # Step 2: Build reverse graph
    rev = defaultdict(list)
    for u in graph:
        for v in graph[u]: rev[v].append(u)
    
    # Step 3: DFS on reverse graph in reverse finish order
    visited.clear()
    sccs = []
    def dfs2(node, comp):
        visited.add(node)
        comp.append(node)
        for nb in rev[node]:
            if nb not in visited: dfs2(nb, comp)
    for node in reversed(order):
        if node not in visited:
            comp = []
            dfs2(node, comp)
            sccs.append(comp)
    return sccs`}</Code>
        </div>
    ),
    patterns: () => (
        <div>
            <P><p>When you see a graph problem on LeetCode, use this decision table to pick your algorithm:</p></P>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0" }}>
                {[
                    { signal: "'Shortest path' + unweighted", algo: "BFS", ex: "Word Ladder, Shortest Path in Grid" },
                    { signal: "'Shortest path' + weighted", algo: "Dijkstra's", ex: "Network Delay Time, Cheapest Flights" },
                    { signal: "'Number of islands' / groups", algo: "DFS or Union-Find", ex: "Number of Islands, Accounts Merge" },
                    { signal: "'Can I finish all courses?'", algo: "Topological Sort", ex: "Course Schedule I & II" },
                    { signal: "'Is there a cycle?'", algo: "DFS (3-color) or UF", ex: "Course Schedule, Redundant Connection" },
                    { signal: "'Minimum cost to connect all'", algo: "MST (Kruskal/Prim)", ex: "Min Cost to Connect Points" },
                    { signal: "'All paths from A to B'", algo: "DFS + Backtracking", ex: "All Paths From Source to Target" },
                    { signal: "Grid of 0s and 1s", algo: "BFS/DFS (grid as graph)", ex: "Number of Islands, 01 Matrix" },
                    { signal: "'Clone / copy the graph'", algo: "BFS/DFS + HashMap", ex: "Clone Graph #133" },
                    { signal: "'Can I 2-color it?'", algo: "BFS/DFS 2-coloring", ex: "Is Graph Bipartite? #785" },
                    { signal: "'Negative edge weights'", algo: "Bellman-Ford", ex: "Cheapest Flights Within K Stops" },
                    { signal: "'All pairs shortest path'", algo: "Floyd-Warshall", ex: "Small graph, every-to-every distances" },
                ].map((r, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 150px 1fr", background: "#FFF", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                        <div style={{ padding: "12px 16px", fontFamily: "'Nunito Sans'", fontSize: 13, fontWeight: 600, color: C.text }}>{r.signal}</div>
                        <div style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 700, color: C.teal, background: C.tealPale, textAlign: "center" }}>{r.algo}</div>
                        <div style={{ padding: "12px 16px", fontFamily: "'Nunito Sans'", fontSize: 13, color: C.textM }}>{r.ex}</div>
                    </div>
                ))}
            </div>
            <Callout color={C.coffee}><strong>The #1 rule:</strong> If the graph is unweighted, try BFS first. If weighted with non-negative edges, use Dijkstra's. If you need to detect cycles or do topological sort, use DFS. If you need connected components, use DFS or Union-Find.</Callout>
        </div>
    ),
};

// ── GRAPH NAVIGATION ────────────────────────────────────────────────────
const NavGraph = ({ active, setActive }) => {
    const cats = [...new Set(SECTIONS.map(s => s.cat))];
    return (
        <nav style={{ width: 270, minHeight: "100vh", background: C.espresso, padding: "24px 12px", position: "sticky", top: 0, overflowY: "auto", flexShrink: 0 }}>
            <div style={{ padding: "0 8px", marginBottom: 24 }}>
                <div style={{ fontFamily: "'Lora'", fontSize: 22, fontWeight: 700, color: C.latte }}>Graph Theory</div>
                <div style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>The Complete Visual Book ☕</div>
            </div>
            {cats.map(cat => (
                <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Nunito Sans'", fontSize: 10, fontWeight: 800, color: C.latte, letterSpacing: 2, textTransform: "uppercase", padding: "0 10px", marginBottom: 6, opacity: 0.7 }}>{cat}</div>
                    {SECTIONS.filter(s => s.cat === cat).map(s => (
                        <button key={s.id} onClick={() => setActive(s.id)} style={{
                            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 1,
                            background: active === s.id ? `${s.color}30` : "transparent", borderLeft: active === s.id ? `3px solid ${s.color}` : "3px solid transparent",
                            transition: "all 0.12s",
                        }}>
                            <span style={{ fontSize: 15 }}>{s.icon}</span>
                            <span style={{ fontFamily: "'Nunito Sans'", fontSize: 13, fontWeight: active === s.id ? 700 : 500, color: active === s.id ? "#FFF" : "rgba(255,255,255,0.55)" }}>{s.title}</span>
                        </button>
                    ))}
                </div>
            ))}
        </nav>
    );
};

// ── MAIN ────────────────────────────────────────────────────────────────
export default function GraphBook2() {
    const [active, setActive] = useState("what");
    const sec = SECTIONS.find(s => s.id === active);
    const Content = CONTENT[active];
    const idx = SECTIONS.findIndex(s => s.id === active);

    return (
        <div style={{ minHeight: "100vh", background: C.foam, display: "flex" }}>
            <style>{F}</style>
            <style>{`*{box-sizing:border-box;margin:0}::selection{background:${C.tealPale};color:${C.tealDark}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.latte};border-radius:3px}button:focus-visible{outline:2px solid ${C.teal};outline-offset:2px}`}</style>
            <NavGraph active={active} setActive={setActive} />
            <main style={{ flex: 1, padding: "36px 48px 80px", maxWidth: 820 }} key={active}>
                <div style={{ marginBottom: 28 }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: sec.color, fontWeight: 600, letterSpacing: 2, marginBottom: 6 }}>{sec.cat.toUpperCase()}</div>
                    <h1 style={{ fontFamily: "'Lora'", fontSize: 36, fontWeight: 700, color: C.text, margin: "0 0 6px", lineHeight: 1.15 }}>{sec.icon} {sec.title}</h1>
                    <div style={{ height: 3, width: 50, background: sec.color, borderRadius: 2 }} />
                </div>
                {Content && <Content />}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 44, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                    {idx > 0 ? <button onClick={() => setActive(SECTIONS[idx - 1].id)} style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "8px 18px", fontFamily: "'Nunito Sans'", fontSize: 13, fontWeight: 600, color: C.textM, cursor: "pointer" }}>← {SECTIONS[idx - 1].title}</button> : <div />}
                    {idx < SECTIONS.length - 1 ? <button onClick={() => setActive(SECTIONS[idx + 1].id)} style={{ background: C.teal, border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: "'Nunito Sans'", fontSize: 13, fontWeight: 700, color: "#FFF", cursor: "pointer" }}>{SECTIONS[idx + 1].title} →</button> : <div />}
                </div>
            </main>
        </div>
    );
}