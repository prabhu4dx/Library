"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const ARCHITECTURES = [
    {
        id: "neurosymbolic",
        name: "Neuro-Symbolic AI",
        category: "Reasoning",
        icon: "⚛",
        color: "#B85C38",
        year: "1990s–present",
        maturity: 3,
        reasoning: 4.5,
        efficiency: 3,
        learning: 3,
        autonomy: 4,
        tagline: "Logic meets learning",
        keyIdea: "Combines neural pattern recognition (System 1) with symbolic logical reasoning (System 2). Neural nets perceive; symbolic engines reason.",
        mechanism: "Neural networks process raw data into structured representations. Symbolic engines apply logical rules, knowledge graphs, and constraint solvers. Integration varies from loose coupling to tight embedding of logic within neurons.",
        keyPapers: ["NS-VQA (Yi et al. 2018) — 99.8% CLEVR accuracy", "Logical Neural Networks (IBM 2020)", "Scallop (Huang et al. 2021) — differentiable Datalog", "DeepProbLog — probabilistic logic + DL"],
        keyPlayers: ["MIT-IBM Watson AI Lab", "IBM Research", "Gary Marcus", "Amazon (Vulcan/Rufus)"],
        strengths: ["Provably correct inference", "Explainable decisions", "Works with structured knowledge"],
        weaknesses: ["No consensus on integration approach", "Symbolic components need manual engineering", "Scaling logic programs is computationally hard"],
        realWorld: "Amazon's Vulcan robot uses neuro-symbolic AI to handle 75% of ~1M unique items. Rufus shopping assistant combines product knowledge graphs with neural language understanding.",
        vsLLM: "LLMs hallucinate because they lack logical grounding. Neuro-symbolic systems can verify their reasoning against formal rules, but struggle with the open-ended fluency LLMs excel at.",
    },
    {
        id: "ssm",
        name: "State Space Models",
        category: "Efficiency",
        icon: "〰",
        color: "#4A7C59",
        year: "2021–present",
        maturity: 4,
        reasoning: 2,
        efficiency: 5,
        learning: 2,
        autonomy: 3,
        tagline: "Linear time, constant memory",
        keyIdea: "Replace quadratic attention with linear recurrence. Process sequences in O(T) time instead of O(T²), with constant memory regardless of sequence length.",
        mechanism: "Maintain a fixed-size hidden state that evolves via a linear state-space equation. Mamba adds selective gating — making state transitions input-dependent. Can be computed as either recurrence (fast inference) or convolution (parallel training).",
        keyPapers: ["S4 (Gu et al. 2021) — HiPPO initialization", "Mamba (Gu & Dao 2023) — selective state spaces", "Mamba-2 (2024) — SSD framework", "Mamba-3 (ICLR 2026) — complex-valued states"],
        keyPlayers: ["Albert Gu (CMU)", "Tri Dao (Princeton)", "AI21 Labs (Jamba)", "NVIDIA (Nemotron-H)", "TII (Falcon Mamba)"],
        strengths: ["Linear-time inference", "Constant memory usage", "5× throughput over transformers", "Proven at production scale"],
        weaknesses: ["Weak associative recall (38% of transformer)", "Still requires massive pre-training", "Hybrid designs needed for best results"],
        realWorld: "Jamba: 52B params, 12B active, 256K context on single 80GB GPU using only 4GB attention cache. Falcon Mamba 7B outperforms Llama 3.1 8B.",
        vsLLM: "SSMs don't change WHAT the model learns — they change HOW efficiently it processes. Still statistical pattern matching, just with linear instead of quadratic compute.",
    },
    {
        id: "worldmodels",
        name: "World Models & JEPA",
        category: "Understanding",
        icon: "🌍",
        color: "#6B4C9A",
        year: "2022–present",
        maturity: 2.5,
        reasoning: 4.5,
        efficiency: 3.5,
        learning: 4,
        autonomy: 4.5,
        tagline: "Simulate reality, don't predict text",
        keyIdea: "Build internal simulations of how reality works. Predict in abstract representation space, not pixel/token space. Enable planning, counterfactual reasoning, and causal understanding.",
        mechanism: "JEPA: Two encoders map input and target to embeddings. A predictor maps from input embedding to target embedding in latent space. Energy function measures compatibility. Low energy = plausible prediction. No decoder needed — avoids predicting irrelevant details.",
        keyPapers: ["LeCun 2022 — Path to Autonomous Machine Intelligence", "V-JEPA 2 (2025) — 1M hours video, zero-shot robotics", "DreamerV3 (Nature 2025) — 150+ tasks, single config", "Genie 3 (DeepMind 2025) — interactive 3D worlds", "Code World Models (Meta 2025) — 32B params"],
        keyPlayers: ["Yann LeCun / AMI Labs ($1.03B)", "DeepMind (Genie 3)", "Fei-Fei Li / World Labs ($230M)", "NVIDIA (Cosmos)"],
        strengths: ["Causal understanding", "Zero-shot transfer to new environments", "Planning without search", "Efficient — predicts abstractions, not pixels"],
        weaknesses: ["Unproven at scale beyond constrained environments", "Requires video/embodied data", "Abstract domain reasoning unclear"],
        realWorld: "V-JEPA 2: 65-80% success on robotic pick-and-place in completely new environments. Zero training on target robots. Just 62 hours of unlabeled video.",
        vsLLM: "LeCun's core argument: 0.01 per-token error compounds to 0.86 error probability over 200 tokens. LLMs learn text patterns, not that objects fall. World models learn physics, causality, consequences.",
    },
    {
        id: "rwkv",
        name: "RWKV",
        category: "Efficiency",
        icon: "∞",
        color: "#C17817",
        year: "2021–present",
        maturity: 3.5,
        reasoning: 2.5,
        efficiency: 5,
        learning: 2,
        autonomy: 3,
        tagline: "RNN quality, transformer training",
        keyIdea: "An RNN that trains like a transformer. Constant memory, linear time, infinite context length, with quality matching transformers at similar scale.",
        mechanism: "RWKV-7 'Goose' uses a Generalized Delta Rule — the hidden state performs gradient descent at every token, enabling meta-in-context learning. Trains in parallel via convolution-like operations; infers sequentially like an RNN.",
        keyPapers: ["RWKV-4 (Peng et al. 2023)", "RWKV-5 Eagle / RWKV-6 Finch", "RWKV-7 Goose (COLM 2025) — dynamic state evolution"],
        keyPlayers: ["Bo Peng (creator)", "Linux Foundation", "YuanShi Intelligence (commercial)", "Microsoft (Windows/Office integration)"],
        strengths: ["Constant memory at any length", "145+ tok/s at 7.2B on RTX 5090", "Recognizes all regular languages (4 layers)", "Mobile inference ready", "Apache 2.0 license"],
        weaknesses: ["Weaker lookback/review than transformers", "Smaller ecosystem than transformer tooling", "Still requires pre-training at scale"],
        realWorld: "RWKV runtime integrated into Windows and Office. Mobile inference on Android/iOS. 3.1T token multilingual training corpus.",
        vsLLM: "RWKV matches LLM quality with constant memory — you can process a million tokens without the memory growing. But it's still next-token prediction at its core.",
    },
    {
        id: "xlstm",
        name: "xLSTM",
        category: "Efficiency",
        icon: "⟳",
        color: "#8B6914",
        year: "2024–present",
        maturity: 3,
        reasoning: 2.5,
        efficiency: 4.5,
        learning: 2,
        autonomy: 3,
        tagline: "The LSTM strikes back",
        keyIdea: "Sepp Hochreiter (co-inventor of LSTM) modernized LSTMs with exponential gating and matrix memory for billion-parameter language models.",
        mechanism: "Two variants: sLSTM (scalar memory, enhanced gating for state tracking) and mLSTM (fully parallelizable matrix memory with covariance update rule). Exponential gating replaces sigmoid with exponential activation for vastly greater dynamic range.",
        keyPapers: ["xLSTM (Beck, Hochreiter et al. NeurIPS 2024)", "xLSTM-7B (ICML 2025) — fastest 7B inference", "xLSTM Scaling Laws (2025) — Pareto-dominates transformers"],
        keyPlayers: ["Sepp Hochreiter (JKU Linz)", "NXAI GmbH (commercial)", "AMD (MI300X optimization)", "Emmi AI (€15M spinoff)"],
        strengths: ["Fastest 7B model inference", "Pareto-dominates transformers on scaling curves", "3.5× faster training than baseline transformer", "Edge-optimized"],
        weaknesses: ["Early commercial stage", "Limited adoption outside research", "Still requires pre-training"],
        realWorld: "NXAI targeting industrial robotics, time series, and edge computing. 2.16× generation throughput improvement on AMD MI300X vs NVIDIA H100.",
        vsLLM: "xLSTM proves the transformer architecture isn't optimal — you can get better compute-performance tradeoffs. But it doesn't change the fundamental paradigm of statistical prediction.",
    },
    {
        id: "diffusion",
        name: "Diffusion Language Models",
        category: "Generation",
        icon: "◈",
        color: "#2D6A4F",
        year: "2022–present",
        maturity: 2.5,
        reasoning: 2.5,
        efficiency: 4,
        learning: 2,
        autonomy: 3,
        tagline: "Generate all tokens at once",
        keyIdea: "Replace sequential left-to-right generation with iterative parallel refinement. Corrupt text with noise, learn to denoise — generating entire blocks simultaneously.",
        mechanism: "Start with random noise tokens. Over multiple denoising steps, progressively refine all positions in parallel. Uses masked diffusion: randomly mask tokens, learn to predict them. Bidirectional context at every step.",
        keyPapers: ["Diffusion-LM (Li et al. 2022)", "LLaDA (Nie et al. 2025) — 8B competitive with LLaMA3", "Gemini Diffusion (Google 2025) — 1,479 tok/s", "Mercury (Inception Labs) — 5-10× faster"],
        keyPlayers: ["Inception Labs ($50M, Stefano Ermon)", "Google DeepMind (Gemini Diffusion)", "Apple (DiffuCoder)", "Andrew Ng & Andrej Karpathy (investors)"],
        strengths: ["5-10× generation speed", "Bidirectional context (solves reversal curse)", "Natural parallel generation", "5-10× lower cost"],
        weaknesses: ["Quality gap on complex reasoning", "Must pre-define output length", "Ecosystem immature (no vLLM/llama.cpp support)", "Optimal sampling ≈ response length steps"],
        realWorld: "Mercury 2: first diffusion reasoning model, matches Claude Haiku-class quality at 1/5 latency. Deployed on Amazon Bedrock.",
        vsLLM: "dLLMs break the sequential bottleneck — generating 100 tokens doesn't take 100× longer than 1 token. But they trade reasoning depth for speed, scoring 40% vs 57% on hard benchmarks.",
    },
    {
        id: "liquid",
        name: "Liquid Neural Networks",
        category: "Adaptation",
        icon: "💧",
        color: "#1B6B93",
        year: "2020–present",
        maturity: 3,
        reasoning: 3,
        efficiency: 5,
        learning: 4,
        autonomy: 4,
        tagline: "19 neurons can drive a car",
        keyIdea: "Inspired by the 302-neuron C. elegans worm brain. Each neuron governed by ODEs with input-dependent time constants — the network literally rewires itself as data arrives.",
        mechanism: "Neurons are continuous-time dynamical systems. Time constants change based on input, enabling the network to adapt its dynamics on-the-fly. Closed-form Continuous-time (CfC) networks solve a 100-year-old differential equation for 100× speedup.",
        keyPapers: ["Liquid Time-Constant Networks (Hasani et al. 2020)", "CfC Networks (Nature Machine Intelligence 2022)", "LFM 2.5 (2026) — frontier reasoning at 1B scale"],
        keyPlayers: ["Ramin Hasani, Mathias Lechner, Daniela Rus (MIT CSAIL)", "Liquid AI ($297M raised, >$2B valuation)", "AMD ($250M strategic partnership)", "Shopify (sub-20ms search)"],
        strengths: ["19 neurons for autonomous driving", "100× faster than neural ODEs", "Adapts after deployment", "Edge-native design", "Interpretable dynamics"],
        weaknesses: ["Best for sequential/time-series data", "Not designed for open-ended language", "Scaling to very large models unproven", "Immature tooling vs transformers"],
        realWorld: "Hyena Edge: 30% lower latency, 90% smaller cache on Samsung Galaxy S24 Ultra. Shopify: sub-20ms search inference. LFM-7B for local deployment.",
        vsLLM: "Liquid networks are the anti-LLM: tiny, adaptive, efficient, interpretable. They excel where LLMs are weakest (edge, real-time, continuous adaptation) but can't match LLMs at open-ended conversation.",
    },
    {
        id: "neuromorphic",
        name: "Neuromorphic Computing",
        category: "Hardware",
        icon: "🧠",
        color: "#5C374C",
        year: "2011–present",
        maturity: 2,
        reasoning: 2,
        efficiency: 5,
        learning: 4,
        autonomy: 2.5,
        tagline: "Brain chips on milliwatts",
        keyIdea: "Mimic the brain in silicon: co-locate memory and compute, use event-driven spikes instead of clock cycles, achieve massive parallelism at a fraction of conventional power.",
        mechanism: "Spiking Neural Networks (SNNs) communicate via discrete events (spikes). Neurons only fire when a threshold is reached — no computation when idle. On-chip learning via STDP (Spike-Timing Dependent Plasticity). Fundamentally different from GPU-based matrix multiplication.",
        keyPapers: ["Intel Loihi 2 (2021)", "Hala Point (2024) — 1.15B neurons", "IBM NorthPole (2023) — 22× faster than GPU", "BrainChip AKD1500 (2025)"],
        keyPlayers: ["Intel Labs (Loihi 2/Hala Point)", "IBM (NorthPole)", "BrainChip (AKD1500)", "SynSense (BMW)", "University of Manchester (SpiNNaker 2)"],
        strengths: ["1000× energy savings potential", "Event-driven = zero idle power", "On-chip learning from sparse data", "15 TOPS/W (Hala Point)", "Milliwatt operation"],
        weaknesses: ["Software ecosystem far behind PyTorch", "Low-precision weights (1-8 bit)", "Can't run large reasoning models", "Training maturity gap", "Patent surge but few products"],
        realWorld: "Hala Point: 1.15B neurons across 1,152 Loihi 2 chips. 100× less energy, 50× faster than CPU/GPU. AKD1500: 800 GOPS under 300mW.",
        vsLLM: "Neuromorphic chips are the opposite of the GPU farms LLMs need. They can't run GPT — but they can run intelligent inference at milliwatt power levels that GPUs can never achieve.",
    },
    {
        id: "progsyn",
        name: "Program Synthesis",
        category: "Reasoning",
        icon: "λ",
        color: "#D4451A",
        year: "2021–present",
        maturity: 2,
        reasoning: 5,
        efficiency: 5,
        learning: 5,
        autonomy: 5,
        tagline: "Learn rules, not statistics",
        keyIdea: "Learn explicit, verifiable programs from examples rather than statistical patterns. A program that sorts a list works on ALL lists — no hallucination, no uncertainty.",
        mechanism: "DreamCoder: Wake phase solves synthesis problems. Abstraction sleep identifies reusable components. Dream sleep trains neural recognition. Builds a growing library of composable abstractions — like a programmer building utility functions.",
        keyPapers: ["DreamCoder (Ellis et al. PLDI 2021)", "ARC-AGI benchmark (Chollet 2019)", "Tiny Recursive Model (2025) — 7M params, 45% ARC-AGI-1", "Apperception Engine (Evans et al.)"],
        keyPlayers: ["Kevin Ellis (Cornell)", "François Chollet (Ndea, ARC Prize)", "Andrew Cropper (Popper ILP)", "ARC Prize Foundation ($2M prizes)"],
        strengths: ["Provably correct outputs", "7M parameters can solve complex puzzles", "Zero pre-training possible", "Composable, reusable abstractions", "Most human-like learning approach"],
        weaknesses: ["Doesn't scale to complex open-ended domains", "Search space explodes combinatorially", "Can't handle unstructured natural language well"],
        realWorld: "ARC-AGI-3 (March 2026): Humans 100%, frontier AI 0.26%. The starkest evidence that statistical AI can't reason. DreamCoder: Sort program found in <10 min; brute force would take >10^72 years.",
        vsLLM: "Program synthesis is the polar opposite of LLMs. LLMs produce plausible-sounding outputs that might be wrong. Programs produce provably correct outputs for a defined domain. The gap: programs can't handle ambiguity.",
    },
    {
        id: "activeinf",
        name: "Active Inference",
        category: "Understanding",
        icon: "∿",
        color: "#7B2D26",
        year: "2006–present",
        maturity: 2,
        reasoning: 4.5,
        efficiency: 5,
        learning: 5,
        autonomy: 5,
        tagline: "Minimize surprise to maximize intelligence",
        keyIdea: "All intelligence is surprise minimization. Agents build world models and choose actions to both reduce uncertainty (explore) and achieve goals (exploit) — unified in one mathematical framework.",
        mechanism: "Maintain a generative model of the world. Infer hidden states via Bayesian inference. Select policies that minimize Expected Free Energy — combining information gain (epistemic value) and goal achievement (pragmatic value). No separate exploration/exploitation mechanisms needed.",
        keyPapers: ["Free Energy Principle (Friston 2006+)", "Active Inference (Friston et al.)", "AXIOM (VERSES 2025) — beats DreamerV3, 400× smaller", "Chollet endorsement: 'tracks with most important AGI problems'"],
        keyPlayers: ["Karl Friston (UCL / VERSES AI)", "VERSES AI (CBOE: VERS)", "Active Inference Institute", "pymdp (open source)"],
        strengths: ["400× smaller than DreamerV3, 60% better gameplay", "7.6× more sample-efficient", "No neural nets, no backprop, no gradients", "Unified exploration + exploitation", "Biologically grounded"],
        weaknesses: ["Unproven beyond simplified visual environments", "Scaling to high-dimensional spaces", "Unfalsifiability critique", "Small engineering community"],
        realWorld: "AXIOM on Gameworld 10K: 0.95M params vs DreamerV3's 420M. 39× faster training. Robotics: hierarchical multi-agent active inference for mobile manipulation.",
        vsLLM: "Active inference is the most radical departure from LLMs. Instead of learning from trillions of tokens, it learns from thousands of interactions by building a causal world model and actively exploring. But it's currently limited to simple environments.",
    },
    {
        id: "cognitive",
        name: "Cognitive Architectures",
        category: "Understanding",
        icon: "⬡",
        color: "#3D5A80",
        year: "1980s–present",
        maturity: 2.5,
        reasoning: 4.5,
        efficiency: 4,
        learning: 4,
        autonomy: 4,
        tagline: "Model the mind's machinery",
        keyIdea: "Explicitly model human cognitive processes: working memory, long-term memory, attention, learning, and action selection as separate, interacting modules.",
        mechanism: "ACT-R: Production rules + Bayesian activation learning. SOAR: Continuous decision cycles with semantic/episodic/spatial memory. Thousand Brains: 150,000 cortical columns as independent sensorimotor learning machines reaching consensus.",
        keyPapers: ["ACT-R (Anderson, CMU)", "SOAR (Laird, Michigan)", "Thousand Brains Theory (Hawkins 2019)", "Monty framework (2024-2025, open source)"],
        keyPlayers: ["Jeff Hawkins (Thousand Brains Project)", "John Anderson (CMU, ACT-R)", "John Laird (Michigan, SOAR)", "Gates Foundation (funding TBP)"],
        strengths: ["Grounded in neuroscience", "Explicit reasoning modules", "No massive pre-training needed", "Self-contained reasoning", "Continuously learning"],
        weaknesses: ["Struggle with unstructured data", "Scaling challenges", "Small developer community", "Decades old, limited commercial traction"],
        realWorld: "SOAR deployed in military simulations and game AI. Thousand Brains Project's Monty: open-source sensorimotor learning framework under MIT license.",
        vsLLM: "Cognitive architectures try to replicate the structure of human thought. LLMs try to replicate the output. The architectures reason more like humans but can't yet handle the messy, unstructured real world as gracefully.",
    },
    {
        id: "hybrid",
        name: "Hybrid Architectures",
        category: "Production",
        icon: "⊕",
        color: "#457B9D",
        year: "2024–present",
        maturity: 4,
        reasoning: 3,
        efficiency: 4,
        learning: 2,
        autonomy: 3,
        tagline: "Best of all worlds",
        keyIdea: "Combine transformers with SSMs, linear attention, and MoE. The dominant pattern: ~75% efficient layers + ~25% attention layers. Every major 2026 production model uses this.",
        mechanism: "Interleave different layer types: Mamba blocks for efficient sequence processing, attention blocks for precise recall, MoE for capacity without compute cost. Qwen3-Next uses Gated DeltaNets (linear attention with delta rule memory) at 3:1 ratio with softmax attention.",
        keyPapers: ["Jamba (AI21 2024) — first production hybrid", "Qwen3-Next (Alibaba 2025) — 80B/3B active", "OLMo Hybrid (AI2 2026)", "StripedHyena (Together AI)"],
        keyPlayers: ["AI21 Labs", "Alibaba (Qwen)", "NVIDIA (Nemotron-H)", "Together AI", "Zyphra (Zamba)"],
        strengths: ["49% fewer training tokens for same MMLU", "14-point gains on long-context benchmarks", "Production-proven at scale", "Matches frontier transformers at lower cost"],
        weaknesses: ["Tooling still immature (vLLM, llama.cpp)", "Complexity of tuning layer ratios", "Still fundamentally statistical", "No reasoning breakthrough"],
        realWorld: "Qwen3-Next-80B-A3B: 96.25% sparsity, matches Qwen3-32B dense at <10% cost. Jamba 1.5: 398B/94B, 256K context. Nemotron-H: 3× faster inference.",
        vsLLM: "Hybrid architectures are the pragmatic evolution of LLMs — making them faster and cheaper without changing the paradigm. They're the best short-term bet but don't solve the fundamental reasoning gap.",
    },
];

const CATEGORIES = ["All", "Reasoning", "Understanding", "Efficiency", "Adaptation", "Generation", "Hardware", "Production"];

const StarRating = ({ value, max = 5, color }) => (
    <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: max }, (_, i) => (
            <div key={i} style={{
                width: 14, height: 14, borderRadius: 3,
                background: i < value ? color : "rgba(0,0,0,0.08)",
                opacity: i < Math.floor(value) ? 1 : i < value ? 0.5 : 1,
                transition: "all 0.3s ease"
            }} />
        ))}
    </div>
);

const RadarChart = ({ arch, size = 220 }) => {
    const dims = [
        { key: "reasoning", label: "Reasoning" },
        { key: "efficiency", label: "Efficiency" },
        { key: "learning", label: "Learning" },
        { key: "autonomy", label: "Autonomy" },
        { key: "maturity", label: "Maturity" },
    ];
    const cx = size / 2, cy = size / 2, r = size * 0.36;
    const angleStep = (2 * Math.PI) / dims.length;
    const getPoint = (i, val) => ({
        x: cx + r * (val / 5) * Math.sin(i * angleStep),
        y: cy - r * (val / 5) * Math.cos(i * angleStep),
    });
    const points = dims.map((d, i) => getPoint(i, arch[d.key]));
    const polygon = points.map(p => `${p.x},${p.y}`).join(" ");
    const gridLevels = [1, 2, 3, 4, 5];

    return (
        <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
            {gridLevels.map(level => {
                const gp = dims.map((_, i) => getPoint(i, level));
                return <polygon key={level} points={gp.map(p => `${p.x},${p.y}`).join(" ")}
                    fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} />;
            })}
            {dims.map((_, i) => (
                <line key={i} x1={cx} y1={cy} x2={getPoint(i, 5).x} y2={getPoint(i, 5).y}
                    stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
            ))}
            <polygon points={polygon} fill={arch.color + "30"} stroke={arch.color} strokeWidth={2} />
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={4} fill={arch.color} />
            ))}
            {dims.map((d, i) => {
                const lp = getPoint(i, 6.2);
                return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 10, fill: "#6B5E4F", fontFamily: "inherit" }}>{d.label}</text>;
            })}
        </svg>
    );
};

const CompareRadar = ({ archs, size = 280 }) => {
    const dims = [
        { key: "reasoning", label: "Reasoning" },
        { key: "efficiency", label: "Efficiency" },
        { key: "learning", label: "Learning" },
        { key: "autonomy", label: "Autonomy" },
        { key: "maturity", label: "Maturity" },
    ];
    const cx = size / 2, cy = size / 2, r = size * 0.34;
    const angleStep = (2 * Math.PI) / dims.length;
    const getPoint = (i, val) => ({
        x: cx + r * (val / 5) * Math.sin(i * angleStep),
        y: cy - r * (val / 5) * Math.cos(i * angleStep),
    });
    const gridLevels = [1, 2, 3, 4, 5];

    return (
        <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
            {gridLevels.map(level => {
                const gp = dims.map((_, i) => getPoint(i, level));
                return <polygon key={level} points={gp.map(p => `${p.x},${p.y}`).join(" ")}
                    fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} />;
            })}
            {dims.map((_, i) => (
                <line key={i} x1={cx} y1={cy} x2={getPoint(i, 5).x} y2={getPoint(i, 5).y}
                    stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
            ))}
            {archs.map((arch, ai) => {
                const points = dims.map((d, i) => getPoint(i, arch[d.key]));
                return <polygon key={ai} points={points.map(p => `${p.x},${p.y}`).join(" ")}
                    fill={arch.color + "20"} stroke={arch.color} strokeWidth={2} strokeDasharray={ai > 0 ? "6,3" : "none"} />;
            })}
            {dims.map((d, i) => {
                const lp = getPoint(i, 6.2);
                return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 10, fill: "#6B5E4F", fontFamily: "inherit" }}>{d.label}</text>;
            })}
        </svg>
    );
};

export default function PostLLMExplorer() {
    const [view, setView] = useState("grid");
    const [selectedArch, setSelectedArch] = useState(null);
    const [category, setCategory] = useState("All");
    const [compareList, setCompareList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const detailRef = useRef(null);

    const filtered = useMemo(() => {
        let list = ARCHITECTURES;
        if (category !== "All") list = list.filter(a => a.category === category);
        if (searchTerm) list = list.filter(a =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.tagline.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (sortBy === "reasoning") list = [...list].sort((a, b) => b.reasoning - a.reasoning);
        else if (sortBy === "efficiency") list = [...list].sort((a, b) => b.efficiency - a.efficiency);
        else if (sortBy === "maturity") list = [...list].sort((a, b) => b.maturity - a.maturity);
        else if (sortBy === "learning") list = [...list].sort((a, b) => b.learning - a.learning);
        return list;
    }, [category, searchTerm, sortBy]);

    const toggleCompare = useCallback((arch) => {
        setCompareList(prev =>
            prev.find(a => a.id === arch.id)
                ? prev.filter(a => a.id !== arch.id)
                : prev.length < 3 ? [...prev, arch] : prev
        );
    }, []);

    useEffect(() => {
        if (selectedArch && detailRef.current) {
            detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [selectedArch]);

    const archDetail = selectedArch ? ARCHITECTURES.find(a => a.id === selectedArch) : null;

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(165deg, #FAF5EE 0%, #F5EDE0 50%, #EFE6D5 100%)",
            fontFamily: "'Newsreader', 'Georgia', serif",
            color: "#3D3529",
            padding: 0,
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .arch-card { transition: all 0.25s ease; cursor: pointer; }
        .arch-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
        .pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'DM Sans', sans-serif; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .compare-btn { border: none; padding: 4px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all 0.2s ease; }
        .tab-btn { border: none; padding: 6px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.2s ease; background: transparent; color: #6B5E4F; }
        .tab-btn.active { background: #3D3529; color: #FAF5EE; }
        .tab-btn:hover:not(.active) { background: rgba(0,0,0,0.06); }
        .detail-section { margin-bottom: 28px; }
        .detail-section h4 { font-family: 'DM Sans', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8B7E6F; margin: 0 0 10px 0; font-weight: 700; }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-family: 'DM Sans', sans-serif; margin: 2px 4px 2px 0; background: rgba(0,0,0,0.04); color: #5C4F3D; }
      `}</style>

            {/* Header */}
            <div style={{ padding: "40px 24px 24px", maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                    <h1 style={{
                        fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300, margin: 0,
                        letterSpacing: "-0.02em", lineHeight: 1.1,
                        background: "linear-gradient(135deg, #3D3529, #7B2D26, #4A7C59)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>
                        Post-LLM Architecture Explorer
                    </h1>
                </div>
                <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#8B7E6F",
                    margin: "8px 0 0 0", maxWidth: 700, lineHeight: 1.6,
                }}>
                    17 paradigms beyond token prediction — from state space models to neuromorphic chips.
                    Explore, compare, and understand what comes after the transformer.
                </p>
            </div>

            {/* Controls */}
            <div style={{ padding: "0 24px 20px", maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                    <input
                        type="text" placeholder="Search architectures..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.1)",
                            background: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13, width: 200, outline: "none", color: "#3D3529",
                        }}
                    />
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                        padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.1)",
                        background: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13, outline: "none", color: "#3D3529", cursor: "pointer",
                    }}>
                        <option value="name">Sort: Name</option>
                        <option value="reasoning">Sort: Reasoning</option>
                        <option value="efficiency">Sort: Efficiency</option>
                        <option value="maturity">Sort: Maturity</option>
                        <option value="learning">Sort: Learning</option>
                    </select>
                    <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,0.04)", borderRadius: 10, padding: 3 }}>
                        <button className="tab-btn" onClick={() => setView("grid")} style={view === "grid" ? { background: "#3D3529", color: "#FAF5EE" } : {}}>Grid</button>
                        <button className="tab-btn" onClick={() => setView("table")} style={view === "table" ? { background: "#3D3529", color: "#FAF5EE" } : {}}>Table</button>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {CATEGORIES.map(cat => (
                        <button key={cat} className="tab-btn"
                            onClick={() => setCategory(cat)}
                            style={category === cat ? { background: "#3D3529", color: "#FAF5EE" } : {}}
                        >{cat}</button>
                    ))}
                </div>
            </div>

            {/* Compare Bar */}
            {compareList.length > 0 && (
                <div style={{
                    position: "sticky", top: 0, zIndex: 100,
                    background: "rgba(61,53,41,0.95)", backdropFilter: "blur(12px)",
                    padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#C4B9A8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                            Comparing:
                        </span>
                        {compareList.map(a => (
                            <span key={a.id} style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "4px 12px", borderRadius: 8,
                                background: a.color + "30", color: "#FAF5EE",
                                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                            }}>
                                {a.icon} {a.name}
                                <button onClick={() => toggleCompare(a)} style={{
                                    background: "none", border: "none", color: "#FAF5EE", cursor: "pointer",
                                    fontSize: 14, padding: 0, lineHeight: 1,
                                }}>×</button>
                            </span>
                        ))}
                        {compareList.length >= 2 && (
                            <button onClick={() => { setSelectedArch(null); setView("compare"); }}
                                style={{
                                    padding: "6px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)",
                                    background: "transparent", color: "#FAF5EE", cursor: "pointer",
                                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                                }}>
                                View Comparison →
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div style={{ padding: "0 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
                {/* Grid View */}
                {view === "grid" && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 16,
                    }}>
                        {filtered.map((arch, i) => (
                            <div key={arch.id} className="arch-card"
                                onClick={() => { setSelectedArch(arch.id); setView("detail"); }}
                                style={{
                                    background: "rgba(255,255,255,0.55)",
                                    borderRadius: 16, padding: 20,
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                                    animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                                    position: "relative",
                                }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 12,
                                        background: arch.color + "18",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 22,
                                    }}>{arch.icon}</div>
                                    <button className="compare-btn"
                                        onClick={(e) => { e.stopPropagation(); toggleCompare(arch); }}
                                        style={{
                                            background: compareList.find(a => a.id === arch.id) ? arch.color : "rgba(0,0,0,0.05)",
                                            color: compareList.find(a => a.id === arch.id) ? "#fff" : "#6B5E4F",
                                        }}>
                                        {compareList.find(a => a.id === arch.id) ? "✓" : "Compare"}
                                    </button>
                                </div>
                                <h3 style={{
                                    fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700,
                                    margin: "0 0 4px 0", color: "#3D3529",
                                }}>{arch.name}</h3>
                                <p style={{
                                    fontStyle: "italic", fontSize: 14, color: arch.color,
                                    margin: "0 0 10px 0", fontWeight: 400,
                                }}>{arch.tagline}</p>
                                <span className="pill" style={{ background: arch.color + "15", color: arch.color }}>
                                    {arch.category}
                                </span>
                                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                    {[["Reasoning", arch.reasoning], ["Efficiency", arch.efficiency], ["Learning", arch.learning], ["Maturity", arch.maturity]].map(([label, val]) => (
                                        <div key={label}>
                                            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#8B7E6F", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                                            <StarRating value={val} color={arch.color} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {view === "table" && (
                    <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.55)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.08)" }}>
                                    {["Architecture", "Category", "Reasoning", "Efficiency", "Learning", "Autonomy", "Maturity"].map(h => (
                                        <th key={h} style={{ padding: "14px 12px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#8B7E6F" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(arch => (
                                    <tr key={arch.id}
                                        onClick={() => { setSelectedArch(arch.id); setView("detail"); }}
                                        style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", cursor: "pointer", transition: "background 0.2s" }}
                                        onMouseOver={e => e.currentTarget.style.background = "rgba(0,0,0,0.02)"}
                                        onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                                        <td style={{ padding: "12px", fontWeight: 600 }}>
                                            <span style={{ marginRight: 8 }}>{arch.icon}</span>{arch.name}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                            <span className="pill" style={{ background: arch.color + "15", color: arch.color }}>{arch.category}</span>
                                        </td>
                                        {[arch.reasoning, arch.efficiency, arch.learning, arch.autonomy, arch.maturity].map((v, i) => (
                                            <td key={i} style={{ padding: "12px" }}><StarRating value={v} color={arch.color} /></td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Detail View */}
                {view === "detail" && archDetail && (
                    <div ref={detailRef} style={{ animation: "fadeUp 0.4s ease" }}>
                        <button onClick={() => { setSelectedArch(null); setView("grid"); }}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "'DM Sans'", fontSize: 13, color: "#8B7E6F",
                                padding: "8px 0", marginBottom: 16, display: "flex", alignItems: "center", gap: 6,
                            }}>← Back to all architectures</button>

                        <div style={{
                            background: "rgba(255,255,255,0.6)", borderRadius: 20,
                            border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden",
                        }}>
                            {/* Header Band */}
                            <div style={{
                                background: `linear-gradient(135deg, ${archDetail.color}15, ${archDetail.color}08)`,
                                padding: "32px 28px 24px",
                                borderBottom: "1px solid rgba(0,0,0,0.04)",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                                    <div style={{
                                        width: 60, height: 60, borderRadius: 16,
                                        background: archDetail.color + "20",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 32,
                                    }}>{archDetail.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{ fontFamily: "'DM Sans'", fontSize: 28, fontWeight: 700, margin: 0, color: "#3D3529" }}>
                                            {archDetail.name}
                                        </h2>
                                        <p style={{ fontSize: 18, color: archDetail.color, margin: "4px 0 0", fontStyle: "italic" }}>
                                            {archDetail.tagline}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <span className="pill" style={{ background: archDetail.color + "18", color: archDetail.color }}>{archDetail.category}</span>
                                        <span className="pill" style={{ background: "rgba(0,0,0,0.06)", color: "#6B5E4F" }}>{archDetail.year}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: "28px", display: "grid", gridTemplateColumns: "1fr 240px", gap: 32 }}>
                                <div>
                                    <div className="detail-section">
                                        <h4>Core Idea</h4>
                                        <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>{archDetail.keyIdea}</p>
                                    </div>
                                    <div className="detail-section">
                                        <h4>How It Works</h4>
                                        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "#5C4F3D" }}>{archDetail.mechanism}</p>
                                    </div>
                                    <div className="detail-section">
                                        <h4>vs LLMs</h4>
                                        <div style={{
                                            padding: 16, borderRadius: 12,
                                            background: `linear-gradient(135deg, ${archDetail.color}08, transparent)`,
                                            borderLeft: `3px solid ${archDetail.color}`,
                                        }}>
                                            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "#5C4F3D" }}>{archDetail.vsLLM}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                        <div className="detail-section">
                                            <h4>Strengths</h4>
                                            {archDetail.strengths.map((s, i) => (
                                                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, lineHeight: 1.5 }}>
                                                    <span style={{ color: "#4A7C59", flexShrink: 0 }}>+</span>
                                                    <span style={{ color: "#5C4F3D" }}>{s}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="detail-section">
                                            <h4>Weaknesses</h4>
                                            {archDetail.weaknesses.map((w, i) => (
                                                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, lineHeight: 1.5 }}>
                                                    <span style={{ color: "#B85C38", flexShrink: 0 }}>−</span>
                                                    <span style={{ color: "#5C4F3D" }}>{w}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="detail-section">
                                        <h4>Real-World Impact</h4>
                                        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "#5C4F3D" }}>{archDetail.realWorld}</p>
                                    </div>
                                    <div className="detail-section">
                                        <h4>Key Papers & Models</h4>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                            {archDetail.keyPapers.map((p, i) => <span key={i} className="tag">{p}</span>)}
                                        </div>
                                    </div>
                                    <div className="detail-section">
                                        <h4>Key Players</h4>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                            {archDetail.keyPlayers.map((p, i) => (
                                                <span key={i} className="tag" style={{ background: archDetail.color + "10", color: archDetail.color }}>{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{
                                        position: "sticky", top: 80,
                                        background: "rgba(255,255,255,0.5)", borderRadius: 16,
                                        padding: 16, border: "1px solid rgba(0,0,0,0.04)",
                                    }}>
                                        <h4 style={{ fontFamily: "'DM Sans'", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#8B7E6F", margin: "0 0 12px", fontWeight: 700 }}>
                                            Capability Radar
                                        </h4>
                                        <RadarChart arch={archDetail} size={220} />
                                        <div style={{ marginTop: 16 }}>
                                            {[["Reasoning", archDetail.reasoning], ["Efficiency", archDetail.efficiency], ["Learning", archDetail.learning], ["Autonomy", archDetail.autonomy], ["Maturity", archDetail.maturity]].map(([label, val]) => (
                                                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                                    <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#6B5E4F" }}>{label}</span>
                                                    <StarRating value={val} color={archDetail.color} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigate */}
                        <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {ARCHITECTURES.filter(a => a.id !== archDetail.id).map(a => (
                                <button key={a.id} onClick={() => setSelectedArch(a.id)}
                                    style={{
                                        background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.06)",
                                        borderRadius: 10, padding: "8px 14px", cursor: "pointer",
                                        fontFamily: "'DM Sans'", fontSize: 12, color: "#5C4F3D",
                                        display: "flex", alignItems: "center", gap: 6,
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = a.color + "10"}
                                    onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.5)"}>
                                    {a.icon} {a.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Compare View */}
                {view === "compare" && compareList.length >= 2 && (
                    <div style={{ animation: "fadeUp 0.4s ease" }}>
                        <button onClick={() => setView("grid")}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "'DM Sans'", fontSize: 13, color: "#8B7E6F",
                                padding: "8px 0", marginBottom: 16,
                            }}>← Back to grid</button>

                        <div style={{
                            background: "rgba(255,255,255,0.6)", borderRadius: 20,
                            border: "1px solid rgba(0,0,0,0.06)", padding: 28,
                        }}>
                            <h3 style={{ fontFamily: "'DM Sans'", fontSize: 20, fontWeight: 700, margin: "0 0 24px" }}>
                                Architecture Comparison
                            </h3>

                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                                <div style={{ maxWidth: 320 }}>
                                    <CompareRadar archs={compareList} />
                                    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
                                        {compareList.map((a, i) => (
                                            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "'DM Sans'" }}>
                                                <div style={{ width: 12, height: 3, background: a.color, borderRadius: 2 }} />
                                                <span style={{ color: "#5C4F3D" }}>{a.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans'", fontSize: 13 }}>
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.08)" }}>
                                            <th style={{ padding: 12, textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#8B7E6F" }}>Dimension</th>
                                            {compareList.map(a => (
                                                <th key={a.id} style={{ padding: 12, textAlign: "center", color: a.color, fontWeight: 700, fontSize: 13 }}>
                                                    {a.icon} {a.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["Category", (a: any) => a.category],
                                            ["Tagline", (a: any) => a.tagline],
                                            ["Reasoning", (a: any) => <StarRating value={a.reasoning} color={a.color} />],
                                            ["Efficiency", (a: any) => <StarRating value={a.efficiency} color={a.color} />],
                                            ["Learning w/o Pre-training", (a: any) => <StarRating value={a.learning} color={a.color} />],
                                            ["Autonomy", (a: any) => <StarRating value={a.autonomy} color={a.color} />],
                                            ["Maturity", (a: any) => <StarRating value={a.maturity} color={a.color} />],
                                            ["Key Limitation", (a: any) => a.weaknesses[0]],
                                            ["Top Strength", (a: any) => a.strengths[0]],
                                        ].map(([label, fn]: [string, any]) => (
                                            <tr key={label} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                                <td style={{ padding: 12, fontWeight: 600, color: "#6B5E4F", fontSize: 12 }}>{label}</td>
                                                {compareList.map(a => (
                                                    <td key={a.id} style={{ padding: 12, textAlign: "center", fontSize: 12, color: "#5C4F3D" }}>
                                                        {typeof fn(a) === "string" ? fn(a) : <div style={{ display: "flex", justifyContent: "center" }}>{fn(a)}</div>}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: "20px 24px", textAlign: "center",
                fontFamily: "'DM Sans'", fontSize: 11, color: "#B0A491",
                borderTop: "1px solid rgba(0,0,0,0.04)",
            }}>
                Post-LLM Architecture Explorer · Research as of April 2026 · 17 paradigms mapped
            </div>
        </div>
    );
}