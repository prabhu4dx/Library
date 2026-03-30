"use client";
import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 0, label: "Reasoning Failures",   icon: "◎", angle: "Angle 1",
    color: "#BA7517", bg: "#FAEEDA", text: "#633806",
    darkColor: "#EF9F27", darkBg: "#412402", darkText: "#FAC775",
    title: "Reasoning & Abstraction Failures",
    desc: "LLMs do not reason — they pattern-match on training data. Performance collapses under trivial modifications to familiar problems, revealing that models are doing sophisticated interpolation, not systematic inference.",
    callout: "<strong>Core finding:</strong> Transformers solve multi-step reasoning by reducing it to \"linearized subgraph matching\" — matching previously seen computation fragments. When a single irrelevant clause is added to grade-school math problems, accuracy drops <strong>up to 65%</strong>. Chain-of-thought explanations are post-hoc rationalization, not genuine reasoning traces.",
  },
  { id: 1, label: "Memory Limits",        icon: "◑", angle: "Angle 2",
    color: "#185FA5", bg: "#E6F1FB", text: "#042C53",
    darkColor: "#85B7EB", darkBg: "#042C53", darkText: "#B5D4F4",
    title: "Memory & Continual Learning Limits",
    desc: "LLMs lack persistent memory, cannot learn continuously, and have no episodic or working memory. Catastrophic forgetting worsens at scale. Knowledge editing fails within hundreds of edits.",
    callout: "<strong>Core finding:</strong> The human brain uses complementary learning systems — fast hippocampal encoding + slow cortical consolidation. LLMs have neither. Fine-tuning overwrites existing knowledge (catastrophic forgetting). Knowledge editing causes model collapse after ~hundreds of edits. Context windows have a U-shaped effectiveness curve — information in the middle is often missed.",
  },
  { id: 2, label: "ARC-AGI",             icon: "⬡", angle: "Angle 3",
    color: "#993C1D", bg: "#FAECE7", text: "#4A1B0C",
    darkColor: "#F0997B", darkBg: "#4A1B0C", darkText: "#F5C4B3",
    title: "ARC-AGI & Novel Problem Solving",
    desc: "Chollet's ARC benchmark measures skill-acquisition efficiency on genuinely novel tasks using only Core Knowledge priors. Pure LLMs score 0% on ARC-AGI-2. Humans average 60%. The gap is not being closed by scaling.",
    callout: "<strong>Core finding:</strong> Chollet redefined intelligence as \"skill-acquisition efficiency over a scope of tasks\" — not raw benchmark performance. LLMs memorize pattern interpolations; ARC-AGI-2 requires genuine few-shot generalization to novel transformation rules. A 7-million-parameter Tiny Recursive Model achieves 8% — competitive with trillion-parameter frontier models — proving raw scale is not the binding constraint.",
  },
  { id: 3, label: "Brain vs LLM",        icon: "◈", angle: "Angle 4",
    color: "#0F6E56", bg: "#E1F5EE", text: "#04342C",
    darkColor: "#5DCAA5", darkBg: "#04342C", darkText: "#9FE1CB",
    title: "Comparison with the Human Brain",
    desc: "LLMs are passive statistical systems without embodiment, causal reasoning, active inference, or Theory of Mind. The brain's complementary learning systems, sparse coding, and active world modeling create fundamentally different computational properties.",
    callout: "<strong>Core finding:</strong> LeCun argues LLMs lack world models, embodiment, and goal-directed planning. Gary Marcus identifies ten systematic limitations from poor causal reasoning to data hunger. Judea Pearl's Ladder of Causation shows LLMs operate only at Rung 1 (association) — missing intervention and counterfactual reasoning entirely.",
  },
  { id: 4, label: "Solutions",            icon: "◌", angle: "Angle 5",
    color: "#3B6D11", bg: "#EAF3DE", text: "#173404",
    darkColor: "#97C459", darkBg: "#173404", darkText: "#C0DD97",
    title: "Proposed Solutions & Future Directions",
    desc: "Five complementary approaches are showing genuine promise: RL-induced reasoning (DeepSeek-R1), formal verification loops (AlphaProof), test-time compute scaling, neurosymbolic hybrids, and world models (JEPA). LLMs as components — not complete systems — is the emerging consensus.",
    callout: "<strong>Core finding:</strong> The ARC Prize 2025 results provide the clearest signal — top performers used LLMs as approximate knowledge sources paired with external verification and iterative refinement loops. The question is no longer \"can LLMs alone achieve AGI?\" (consensus: no) but \"which combination of architectures closes the remaining gaps?\"",
  },
];

const PAPERS = {
  0: [
    { venue: "NeurIPS 2023", year: "2023", title: "Faith and Fate: Limits of Transformers on Compositionality", auth: "Dziri et al. — Allen Institute for AI", find: "Transformers reduce multi-step reasoning to linearized subgraph matching. GPT-4 achieves only 59% on 3×3 digit multiplication. Performance approaches zero as complexity grows." },
    { venue: "ICLR 2025", year: "2024", title: "GSM-Symbolic: Understanding Limitations of Mathematical Reasoning in LLMs", auth: "Mirzadeh et al. — Apple Research", find: "Performance drops up to 65% when an irrelevant clause is added. Concluded: \"We found no evidence of formal reasoning in language models.\" All frontier models affected." },
    { venue: "ICML 2024", year: "2024", title: "LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks", auth: "Kambhampati et al. — Arizona State University", find: "LLMs function as approximate knowledge sources (System 1) but cannot perform principled planning or self-verification. Even o1 fails to saturate planning benchmarks." },
    { venue: "ICLR 2024", year: "2023", title: "The Reversal Curse: LLMs trained on \"A is B\" fail to learn \"B is A\"", auth: "Berglund et al. — Oxford", find: "GPT-4 answers \"Tom Cruise's mother?\" correctly 79% but \"Mary Lee Pfeiffer's son?\" only 33%. Basic bidirectional inference fails across all model sizes." },
    { venue: "PNAS 2024", year: "2024", title: "Embers of Autoregression: Understanding LLMs Through the Problem They're Trained to Solve", auth: "McCoy et al. — Yale", find: "GPT-4 accuracy on a simple shift cipher drops from 51% to 13% depending purely on whether the output is a high- or low-probability token sequence. Performance is governed by statistics, not logic." },
    { venue: "NeurIPS 2024", year: "2024", title: "Chain of Thoughtlessness? An Analysis of CoT in Planning", auth: "Stechly et al. — Arizona State University", find: "CoT gains on planning tasks are highly sensitive to prompt wording and do not transfer to semantically equivalent but differently phrased prompts. Improvements reflect narrow pattern matching." },
  ],
  1: [
    { venue: "Trends Cogn Sci 1999", year: "1999", title: "Catastrophic Forgetting in Connectionist Networks", auth: "French — University of Liège", find: "Root cause identified: representational overlap in shared distributed weights causes new learning to overwrite old. Humans use biological memory consolidation that neural nets lack entirely." },
    { venue: "arXiv 2023", year: "2023", title: "An Empirical Study of Catastrophic Forgetting in Large Language Models", auth: "Luo et al.", find: "Catastrophic forgetting is pervasive across 1B–7B parameter models during continual instruction tuning. Forgetting paradoxically worsens at larger scales in some domains." },
    { venue: "ICLR 2024", year: "2024", title: "Unveiling the Pitfalls of Knowledge Editing for Large Language Models", auth: "Li et al.", find: "Two failure modes: knowledge conflict (editing magnifies inconsistencies) and knowledge distortion (modifications irreversibly warp surrounding knowledge). Methods like ROME fail within hundreds of edits." },
    { venue: "TACL 2024", year: "2024", title: "Lost in the Middle: How Language Models Use Long Contexts", auth: "Liu et al. — Stanford", find: "Performance follows a U-shaped curve: models effectively use beginning and end of context but significantly miss information in the middle, even with architectures designed for long contexts." },
    { venue: "EMNLP 2022", year: "2022", title: "Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?", auth: "Min et al. — University of Washington", find: "Randomly replacing labels in few-shot examples barely hurts ICL performance. Models are doing task-format recognition using pre-existing knowledge — not learning from provided examples at all." },
    { venue: "COLM 2024", year: "2024", title: "RULER: What's the Real Context Window Size of Language Models?", auth: "Hsieh et al.", find: "Despite near-perfect needle-in-a-haystack performance, only half of models claiming 32K+ context effectively handle 32K tokens on realistic tasks. Advertised ≠ effective context." },
  ],
  2: [
    { venue: "arXiv 2019", year: "2019", title: "On the Measure of Intelligence", auth: "François Chollet — Google DeepMind", find: "Defines intelligence as \"skill-acquisition efficiency over a scope of tasks, with respect to priors, experience, and generalization difficulty.\" Introduces ARC operationalizing this as 800 grid puzzles requiring genuine few-shot abstraction." },
    { venue: "arXiv 2025", year: "2025", title: "ARC Prize 2025: Technical Report", auth: "Chollet et al. — ARC Prize Foundation", find: "1,455 competing teams. Top Kaggle score: 24% on ARC-AGI-1. Best strategy: iterative refinement loops (hypothesis-test-revise), not end-to-end neural. A 7M-param Tiny Recursive Model scored 8%, matching frontier models." },
    { venue: "Apple ML 2025", year: "2025", title: "The Illusion of Thinking: Strengths and Limitations of Reasoning Models", auth: "Shojaee et al. — Apple Research", find: "Three regimes on puzzle environments: low complexity (standard LLMs win), medium complexity (reasoning models excel), high complexity (both collapse to zero regardless of compute budget)." },
    { venue: "NeurIPS 2024", year: "2024", title: "GSM1k: Grade School Math Benchmark Contamination Study", auth: "Zhang et al.", find: "Accuracy drops up to 13% on 1,250 new math problems matching GSM8K style. Positive correlation between ability to reproduce training examples and performance gap = benchmark contamination." },
    { venue: "arXiv 2025", year: "2025", title: "BIG-Bench Extra Hard (BBEH)", auth: "Kazemi et al. — Google DeepMind", find: "Adversarially calibrated to avoid contamination. Best general-purpose model: 9.8% harmonic mean accuracy. Best reasoning-specialized model: 54.2%. Human ceiling: 23.9%. Genuine reasoning remains far from solved." },
    { venue: "EACL 2024", year: "2024", title: "Leak, Cheat, Repeat: Data Contamination and Evaluation Malpractices", auth: "Balloccu et al.", find: "Systematic review of 255 papers using GPT-4 found widespread data leakage. Inference-time decontamination reduces inflated scores by 22.9% on GSM8K and 19.0% on MMLU." },
  ],
  3: [
    { venue: "OpenReview 2022", year: "2022", title: "A Path Towards Autonomous Machine Intelligence", auth: "Yann LeCun — Meta AI", find: "Proposes 6-module architecture (Perception, World Model, Actor, Cost, Short-term Memory, Configurator) missing from LLMs. Introduces JEPA — predicting in abstract representation space, not token space." },
    { venue: "arXiv 2018", year: "2018", title: "Deep Learning: A Critical Appraisal", auth: "Gary Marcus — NYU", find: "Ten systematic limitations: data hungriness, inability to handle hierarchical structure, failure to distinguish causation from correlation, no innate knowledge, poor transfer learning, and brittleness." },
    { venue: "TMLR 2023", year: "2023", title: "Causal Parrots: Large Language Models May Talk Causality But Are Not Causal", auth: "Zečević et al.", find: "LLMs recite causal knowledge from training data but cannot perform genuine causal reasoning. They operate at Rung 1 (association) of Pearl's Ladder of Causation — missing intervention and counterfactual reasoning." },
    { venue: "Behav Brain Sci 2017", year: "2017", title: "Building Machines That Learn and Think Like People", auth: "Lake, Ullman, Tenenbaum, Gershman — MIT", find: "Human-like AI must build causal models, ground learning in intuitive physics/psychology, and harness compositionality. Bayesian program learning achieves human-level one-shot character recognition — LLMs need billions of examples." },
    { venue: "Nature Hum Behav 2025", year: "2025", title: "LLMs without grounding recover non-sensorimotor but not sensorimotor features", auth: "Xu et al.", find: "Comparing ~4,442 concepts: LLM-human similarity decreases from non-sensorimotor to sensory domains, minimal in motor domains. LLMs miss embodied, sensorimotor understanding entirely." },
    { venue: "Trends Cogn Sci 2024", year: "2024", title: "Generating Meaning: Active Inference and the Scope and Limits of Passive AI", auth: "Pezzulo et al.", find: "Organisms learn through purposive interaction (active inference). LLMs learn passively from static data. The key missing component is goal-directed sensorimotor engagement with a physical environment." },
  ],
};

const SOLUTIONS = [
  { abbr: "RL", label: "Reinforcement Learning for Reasoning", paper: "DeepSeek-AI — Nature 2025", desc: "DeepSeek-R1 uses GRPO to incentivize reasoning without human-labeled traces. Emergent self-reflection and verification appeared spontaneously. AIME 2024 pass@1: 15.6% → 71.0%.", status: "Live", statusBg: "#EAF3DE", statusColor: "#173404", iconBg: "#EAF3DE", iconColor: "#3B6D11" },
  { abbr: "FV", label: "Formal Verification Loops", paper: "Google DeepMind — AlphaProof, Nature 2025", desc: "AlphaZero-style RL with Lean proof verification. Solved 4 of 6 IMO 2024 problems including P6 (solved by only 5/609 human contestants). Eliminates hallucinations via formal verification.", status: "Live", statusBg: "#E1F5EE", statusColor: "#04342C", iconBg: "#E1F5EE", iconColor: "#0F6E56" },
  { abbr: "TTC", label: "Test-Time Compute Scaling", paper: "Snell et al. — Google DeepMind, arXiv 2024", desc: "Optimally scaling inference-time compute via process reward models can be more effective than using a 14× larger model. Llemma-7B with tree search consistently outperforms Llemma-34B.", status: "Active research", statusBg: "#FAEEDA", statusColor: "#633806", iconBg: "#E6F1FB", iconColor: "#185FA5" },
  { abbr: "NS", label: "Neurosymbolic AI", paper: "Garcez & Lamb 2023; Colelough et al. arXiv 2025", desc: "Combines neural pattern recognition with symbolic logical reasoning and compositionality. 2025 systematic review (167 papers) finds gap in Meta-Cognition (5% of research) — precisely what AGI needs most.", status: "Active research", statusBg: "#FAEEDA", statusColor: "#633806", iconBg: "#EAF3DE", iconColor: "#3B6D11" },
  { abbr: "WM", label: "World Models (JEPA)", paper: "LeCun OpenReview 2022; Maes et al. arXiv 2026", desc: "Joint Embedding Predictive Architecture predicts in abstract representation space. LeWorldModel (2026) trains stably end-to-end from pixels, planning 48× faster than foundation-model alternatives with ~15M params.", status: "Active research", statusBg: "#FAEEDA", statusColor: "#633806", iconBg: "#FAECE7", iconColor: "#993C1D" },
  { abbr: "MA", label: "Memory-Augmented Transformers", paper: "Wu et al. ICLR 2022; systematic review arXiv 2025", desc: "Memorizing Transformers with 8K-token memory match vanilla Transformers with 5× more parameters. MemReasoner achieves +18% on multi-hop QA. ARMT scales to 50M tokens via Hopfield-inspired caching.", status: "Active research", statusBg: "#FAEEDA", statusColor: "#633806", iconBg: "#E6F1FB", iconColor: "#185FA5" },
];

const ARC_MODELS = [
  { name: "Human average", arc1: 85, arc2: "~60%", arc1color: "#0F6E56" },
  { name: "o3-preview (high compute)", arc1: 87.5, arc2: "~3%", arc1color: "#BA7517" },
  { name: "o3 (public, released)", arc1: 53, arc2: "~3%", arc1color: "#BA7517" },
  { name: "ARC Prize 2025 top team", arc1: 24, arc2: "—", arc1color: "#185FA5" },
  { name: "Claude 3.5 Sonnet", arc1: 14, arc2: "~0%", arc1color: "#185FA5" },
  { name: "GPT-4o", arc1: 5, arc2: "~0%", arc1color: "#185FA5" },
  { name: "GPT-3", arc1: 0.5, arc2: "~0%", arc1color: "#993C1D" },
];

const CAPABILITIES = [
  { label: "Persistent memory & continual learning", human: "✓ Full", llm: "✗ None", humanOk: true },
  { label: "Causal & counterfactual reasoning (Rung 2–3)", human: "✓ Full", llm: "✗ None", humanOk: true },
  { label: "World model — dynamic internal simulation", human: "✓ Full", llm: "✗ None", humanOk: true },
  { label: "Compositional generalization to novel problems", human: "✓ Full", llm: "~ Partial", humanOk: true, partial: true },
  { label: "Grounded sensorimotor understanding", human: "✓ Full", llm: "✗ None", humanOk: true },
  { label: "Meta-cognition — monitoring own reasoning", human: "✓ Full", llm: "✗ None", humanOk: true },
  { label: "Data-efficient one/few-shot learning", human: "✓ Full", llm: "✗ Needs billions", humanOk: true },
];

const MEMORY_COMPARE = {
  human: [
    "Working memory: 4±1 items, actively manipulated, rapidly updated",
    "Episodic memory: specific events with spatial/temporal context",
    "Continual learning: hippocampus + neocortex consolidation during sleep",
    "Knowledge update: individual facts surgically updated without affecting others",
    "Long-term memory: effectively unlimited, hierarchically organized",
  ],
  llm: [
    "Context window only: 128K–1M tokens, no true \"working memory\"",
    "No episodic memory: no persistent record of past interactions",
    "No continual learning: weights frozen post-training, catastrophic forgetting on fine-tune",
    "Knowledge editing: causes model collapse within ~hundreds of edits",
    "Knowledge: compressed into static weights, prone to hallucination",
  ],
};

const REASONING_BARS = [
  { label: "GSM-Symbolic: add irrelevant clause", val: 65, display: "-65%", color: "#993C1D" },
  { label: "3×3 Digit Multiplication (GPT-4)", val: 41, display: "-41%", color: "#BA7517" },
  { label: "Reversal Curse: \"Who is B?\" vs \"Who is A?\"", val: 46, display: "-46%", color: "#BA7517" },
  { label: "Shift cipher: low vs high token probability", val: 38, display: "-38%", color: "#BA7517" },
  { label: "Alice-in-Wonderland trivial reasoning task", val: 50, display: "<50%", color: "#993C1D" },
];

const SOLUTION_BARS = [
  { label: "RL-induced reasoning (o3, DeepSeek-R1)", val: 40, display: "~40% there", color: "#3B6D11" },
  { label: "Formal verification & grounding (AlphaProof)", val: 35, display: "~35% there", color: "#0F6E56" },
  { label: "World modeling & physical grounding", val: 15, display: "~15% there", color: "#BA7517" },
  { label: "Persistent memory & continual learning", val: 10, display: "~10% there", color: "#BA7517" },
  { label: "Sensorimotor embodied grounding", val: 5, display: "~5% there", color: "#993C1D" },
];

// ─── ANIMATED BAR ─────────────────────────────────────────────────────────────

function AnimatedBar({ val, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setWidth(val), delay); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [val, delay]);

  return (
    <div ref={ref} style={{ height: 9, background: "rgba(128,128,128,0.12)", borderRadius: 5, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 5, background: color, width: `${width}%`, transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)" }} />
    </div>
  );
}

// ─── PAPER CARD ───────────────────────────────────────────────────────────────

function PaperCard({ paper, color, bg, textColor, isDark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isDark ? "#2a2a28" : "#fff",
        border: `0.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 12,
        padding: "1rem",
        borderTop: `3px solid ${color}`,
        transition: "transform 0.18s, box-shadow 0.18s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${color}22` : "none",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 5, background: bg, color: textColor }}>
          {paper.venue}
        </span>
        <span style={{ fontSize: 11, color: isDark ? "#606058" : "#9a9a94" }}>{paper.year}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#e8e6e0" : "#1a1a18", lineHeight: 1.4, marginBottom: 4 }}>{paper.title}</div>
      <div style={{ fontSize: 11, color: isDark ? "#606058" : "#9a9a94", marginBottom: 8 }}>{paper.auth}</div>
      <div style={{ fontSize: 12, color: isDark ? "#a0a09a" : "#5a5a56", lineHeight: 1.5, paddingTop: 8, borderTop: `0.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
        {paper.find}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const tab = TABS[active];
  const c = isDark ? tab.darkColor : tab.color;
  const cbg = isDark ? tab.darkBg : tab.bg;
  const ct = isDark ? tab.darkText : tab.text;

  const txt = isDark ? "#e8e6e0" : "#1a1a18";
  const txt2 = isDark ? "#a0a09a" : "#5a5a56";
  const txt3 = isDark ? "#606058" : "#9a9a94";
  const surface = isDark ? "#222220" : "#ffffff";
  const bgPage = isDark ? "#1a1a18" : "#f8f6f1";
  const border = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const card = isDark ? "#2a2a28" : "#ffffff";

  const heroStats = [
    { n: "80+", l: "Papers surveyed across NeurIPS, ICML, arXiv, Nature", color: isDark ? "#F0997B" : "#993C1D" },
    { n: "~3%",  l: "o3's score on ARC-AGI-2 (humans avg 60%)",           color: isDark ? "#EF9F27" : "#BA7517" },
    { n: "7",   l: "Core capabilities humans have that LLMs lack",        color: isDark ? "#85B7EB" : "#185FA5" },
    { n: "5",   l: "Hybrid approaches showing genuine promise",           color: isDark ? "#97C459" : "#3B6D11" },
  ];

  // Per-section content
  const renderSection = () => {
    switch (active) {
      case 0: return <ReasoningSection isDark={isDark} c={c} cbg={cbg} ct={ct} txt={txt} txt2={txt2} txt3={txt3} surface={surface} bgPage={bgPage} border={border} card={card} />;
      case 1: return <MemorySection    isDark={isDark} c={c} cbg={cbg} ct={ct} txt={txt} txt2={txt2} txt3={txt3} surface={surface} bgPage={bgPage} border={border} card={card} />;
      case 2: return <ArcSection       isDark={isDark} c={c} cbg={cbg} ct={ct} txt={txt} txt2={txt2} txt3={txt3} surface={surface} bgPage={bgPage} border={border} card={card} />;
      case 3: return <BrainSection     isDark={isDark} c={c} cbg={cbg} ct={ct} txt={txt} txt2={txt2} txt3={txt3} surface={surface} bgPage={bgPage} border={border} card={card} />;
      case 4: return <SolutionsSection isDark={isDark} c={c} cbg={cbg} ct={ct} txt={txt} txt2={txt2} txt3={txt3} surface={surface} bgPage={bgPage} border={border} card={card} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: bgPage, color: txt, fontFamily: "'Georgia', 'Times New Roman', serif", padding: "0 0 3rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Hero */}
        <div style={{ background: surface, border: `0.5px solid ${border}`, borderRadius: 16, padding: "2rem", marginBottom: "1.5rem", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s, transform 0.5s" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: txt3, textTransform: "uppercase", marginBottom: "0.6rem", fontFamily: "system-ui, sans-serif" }}>
            Technical Research Survey — 80+ Papers
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: txt, lineHeight: 1.25, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Why Large Language Models<br />
            Cannot Reach <span style={{ color: isDark ? "#F0997B" : "#993C1D" }}>Artificial General Intelligence</span>
          </h1>
          <p style={{ fontSize: 14, color: txt2, lineHeight: 1.75, marginBottom: "1.5rem", maxWidth: 680, fontFamily: "system-ui, sans-serif" }}>
            A deep technical survey across five research fronts: reasoning failures, memory limitations, ARC-AGI benchmarks, neuroscience comparisons, and proposed solutions. The evidence converges on a clear conclusion — LLMs are sophisticated interpolation engines whose capabilities are fundamentally bounded by the autoregressive next-token prediction objective.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
            {heroStats.map((s, i) => (
              <div key={i} style={{ background: bgPage, borderRadius: 10, padding: "0.9rem 1rem", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)", transition: `opacity 0.5s ${0.1 + i * 0.07}s, transform 0.5s ${0.1 + i * 0.07}s` }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.n}</div>
                <div style={{ fontSize: 11, color: txt2, marginTop: 4, lineHeight: 1.4, fontFamily: "system-ui, sans-serif" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `0.5px solid ${border}`, marginBottom: "1.5rem", overflowX: "auto" }}>
          {TABS.map((t, i) => {
            const isOn = active === i;
            const tc = isDark ? t.darkColor : t.color;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  background: "none", border: "none",
                  borderBottom: `2px solid ${isOn ? tc : "transparent"}`,
                  padding: "0.6rem 1.1rem",
                  fontSize: 13, fontWeight: isOn ? 600 : 400,
                  cursor: "pointer",
                  color: isOn ? txt : txt2,
                  whiteSpace: "nowrap",
                  marginBottom: -1,
                  transition: "color 0.15s, border-bottom-color 0.15s",
                  fontFamily: "system-ui, sans-serif",
                  letterSpacing: isOn ? "-0.01em" : 0,
                }}
              >
                <span style={{ marginRight: 6, opacity: 0.7 }}>{t.icon}</span>{t.label}
              </button>
            );
          })}
        </div>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "1.25rem", border: `0.5px solid ${border}`, borderRadius: 14, marginBottom: "1rem", background: surface }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 6, background: cbg, color: ct, whiteSpace: "nowrap", marginTop: 2, fontFamily: "system-ui, sans-serif" }}>
            {tab.angle}
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: txt, marginBottom: 4 }}>{tab.title}</div>
            <div style={{ fontSize: 13, color: txt2, lineHeight: 1.6, fontFamily: "system-ui, sans-serif" }}>{tab.desc}</div>
          </div>
        </div>

        {/* Callout */}
        <div style={{ padding: "0.9rem 1rem", borderRadius: "0 10px 10px 0", marginBottom: "1rem", background: surface, border: `0.5px solid ${border}`, borderLeft: `3px solid ${c}` }}>
          <p style={{ fontSize: 13, color: txt2, lineHeight: 1.7, fontFamily: "system-ui, sans-serif" }} dangerouslySetInnerHTML={{ __html: tab.callout.replace(/<strong>/g, `<strong style="color:${txt};font-weight:600">`).replace(/\*\*/g, "") }} />
        </div>

        {/* Dynamic content */}
        {renderSection()}

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: 11, color: txt3, paddingTop: "1.5rem", borderTop: `0.5px solid ${border}`, marginTop: "0.5rem", fontFamily: "system-ui, sans-serif" }}>
          Survey covers 80+ papers · NeurIPS · ICML · ICLR · Nature · arXiv · 2018–2026 · Last updated March 2026
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: REASONING ───────────────────────────────────────────────────────

function ReasoningSection({ isDark, c, cbg, ct, txt, txt2, txt3, surface, bgPage, border, card }) {
  const tab = TABS[0];
  return (
    <>
      <PaperGrid papers={PAPERS[0]} color={c} bg={cbg} textColor={ct} isDark={isDark} />
      <VisualBox title="Accuracy degradation on modified benchmarks" surface={surface} border={border} txt={txt}>
        {REASONING_BARS.map((b, i) => (
          <div key={i} style={{ marginBottom: i < REASONING_BARS.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: txt2, marginBottom: 4, fontFamily: "system-ui, sans-serif" }}>
              <span>{b.label}</span>
              <span style={{ fontWeight: 600, color: txt }}>{b.display}</span>
            </div>
            <AnimatedBar val={b.val} color={b.color} delay={i * 80} />
          </div>
        ))}
      </VisualBox>
    </>
  );
}

// ─── SECTION: MEMORY ──────────────────────────────────────────────────────────

function MemorySection({ isDark, c, cbg, ct, txt, txt2, txt3, surface, bgPage, border, card }) {
  return (
    <>
      <PaperGrid papers={PAPERS[1]} color={c} bg={cbg} textColor={ct} isDark={isDark} />
      <VisualBox title="LLM memory vs human brain memory systems" surface={surface} border={border} txt={txt}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Human Brain", items: MEMORY_COMPARE.human, dot: "#0F6E56", headColor: isDark ? "#5DCAA5" : "#0F6E56" },
            { label: "Large Language Model", items: MEMORY_COMPARE.llm, dot: "#993C1D", headColor: isDark ? "#F0997B" : "#993C1D" },
          ].map((col, ci) => (
            <div key={ci} style={{ background: isDark ? "#1a1a18" : "#f8f6f1", borderRadius: 10, padding: "1rem" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: col.headColor, marginBottom: "0.75rem", paddingBottom: 6, borderBottom: `0.5px solid ${border}`, fontFamily: "system-ui, sans-serif" }}>
                {col.label}
              </div>
              {col.items.map((item, ii) => (
                <div key={ii} style={{ fontSize: 12, color: txt2, padding: "4px 0", borderBottom: ii < col.items.length - 1 ? `0.5px solid ${border}` : "none", lineHeight: 1.4, display: "flex", gap: 6, alignItems: "flex-start", fontFamily: "system-ui, sans-serif" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: col.dot, marginTop: 4, flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </VisualBox>
    </>
  );
}

// ─── SECTION: ARC-AGI ─────────────────────────────────────────────────────────

function ArcSection({ isDark, c, cbg, ct, txt, txt2, txt3, surface, bgPage, border, card }) {
  return (
    <>
      <PaperGrid papers={PAPERS[2]} color={c} bg={cbg} textColor={ct} isDark={isDark} />
      <VisualBox title="Model performance on ARC-AGI benchmarks (2024–2025)" surface={surface} border={border} txt={txt}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: "4px 16px", alignItems: "center", marginBottom: 8, borderBottom: `0.5px solid ${border}`, paddingBottom: 6 }}>
          {["Model", "ARC-AGI-1 score", "ARC-AGI-2"].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: txt3, fontFamily: "system-ui, sans-serif", textAlign: i > 0 ? "center" : "left" }}>{h}</div>
          ))}
        </div>
        {ARC_MODELS.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: "4px 16px", alignItems: "center", padding: "7px 0", borderBottom: i < ARC_MODELS.length - 1 ? `0.5px solid ${border}` : "none" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: txt, fontFamily: "system-ui, sans-serif" }}>{m.name}</div>
            <div style={{ minWidth: 180 }}>
              <AnimatedBar val={m.arc1} color={m.arc1color} delay={i * 60} />
            </div>
            <div style={{ fontSize: 11, color: m.arc2 === "—" ? txt3 : (m.arc2.includes("60") ? (isDark ? "#5DCAA5" : "#0F6E56") : (isDark ? "#F0997B" : "#993C1D")), fontWeight: 600, textAlign: "center", minWidth: 48, fontFamily: "system-ui, sans-serif" }}>
              {m.arc2}
            </div>
          </div>
        ))}
      </VisualBox>
    </>
  );
}

// ─── SECTION: BRAIN VS LLM ────────────────────────────────────────────────────

function BrainSection({ isDark, c, cbg, ct, txt, txt2, txt3, surface, bgPage, border, card }) {
  const greenBg = isDark ? "#04342C" : "#E1F5EE";
  const greenTxt = isDark ? "#9FE1CB" : "#04342C";
  const redBg = isDark ? "#4A1B0C" : "#FAECE7";
  const redTxt = isDark ? "#F5C4B3" : "#4A1B0C";
  const amberBg = isDark ? "#412402" : "#FAEEDA";
  const amberTxt = isDark ? "#FAC775" : "#633806";

  return (
    <>
      <PaperGrid papers={PAPERS[3]} color={c} bg={cbg} textColor={ct} isDark={isDark} />
      <VisualBox title="Seven capabilities humans have that LLMs fundamentally lack" surface={surface} border={border} txt={txt}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "4px 12px", alignItems: "center", marginBottom: 8, borderBottom: `0.5px solid ${border}`, paddingBottom: 6 }}>
          {["Capability", "Human", "LLM"].map((h, i) => (
            <div key={i} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: i === 1 ? (isDark ? "#5DCAA5" : "#0F6E56") : i === 2 ? (isDark ? "#F0997B" : "#993C1D") : txt3, textAlign: i > 0 ? "center" : "left", fontFamily: "system-ui, sans-serif" }}>{h}</div>
          ))}
        </div>
        {CAPABILITIES.map((cap, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "4px 12px", alignItems: "center", padding: "9px 11px", background: isDark ? "#1a1a18" : "#f8f6f1", borderRadius: 9, marginBottom: i < CAPABILITIES.length - 1 ? 6 : 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: txt, fontFamily: "system-ui, sans-serif" }}>{cap.label}</div>
            <div style={{ fontSize: 11, textAlign: "center", minWidth: 80, padding: "3px 8px", borderRadius: 6, fontWeight: 600, background: greenBg, color: greenTxt, fontFamily: "system-ui, sans-serif" }}>{cap.human}</div>
            <div style={{ fontSize: 11, textAlign: "center", minWidth: 90, padding: "3px 8px", borderRadius: 6, fontWeight: 600, background: cap.partial ? amberBg : redBg, color: cap.partial ? amberTxt : redTxt, fontFamily: "system-ui, sans-serif" }}>{cap.llm}</div>
          </div>
        ))}
      </VisualBox>
    </>
  );
}

// ─── SECTION: SOLUTIONS ───────────────────────────────────────────────────────

function SolutionsSection({ isDark, c, cbg, ct, txt, txt2, txt3, surface, bgPage, border, card }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10, marginBottom: "1rem" }}>
        {SOLUTIONS.map((s, i) => (
          <SolutionCard key={i} sol={s} isDark={isDark} txt={txt} txt2={txt2} txt3={txt3} border={border} card={card} />
        ))}
      </div>
      <VisualBox title="What genuine AGI requires beyond current LLMs" surface={surface} border={border} txt={txt}>
        {SOLUTION_BARS.map((b, i) => (
          <div key={i} style={{ marginBottom: i < SOLUTION_BARS.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: txt2, marginBottom: 4, fontFamily: "system-ui, sans-serif" }}>
              <span>{b.label}</span>
              <span style={{ fontWeight: 600, color: b.color }}>{b.display}</span>
            </div>
            <AnimatedBar val={b.val} color={b.color} delay={i * 80} />
          </div>
        ))}
      </VisualBox>
    </>
  );
}

function SolutionCard({ sol, isDark, txt, txt2, txt3, border, card }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: card, border: `0.5px solid ${border}`, borderRadius: 12, padding: "1rem", transition: "transform 0.18s, box-shadow 0.18s", transform: hovered ? "translateY(-2px)" : "translateY(0)", boxShadow: hovered ? "0 6px 20px rgba(0,0,0,0.1)" : "none" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, background: sol.iconBg, color: sol.iconColor, fontFamily: "system-ui, sans-serif", letterSpacing: "-0.02em" }}>
          {sol.abbr}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: txt, lineHeight: 1.3 }}>{sol.label}</div>
      </div>
      <div style={{ fontSize: 11, color: txt3, marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>{sol.paper}</div>
      <div style={{ fontSize: 12, color: txt2, lineHeight: 1.5, fontFamily: "system-ui, sans-serif" }}>{sol.desc}</div>
      <div style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, display: "inline-block", marginTop: 8, background: sol.statusBg, color: sol.statusColor, fontFamily: "system-ui, sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {sol.status}
      </div>
    </div>
  );
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function PaperGrid({ papers, color, bg, textColor, isDark }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 10, marginBottom: "1rem" }}>
      {papers.map((p, i) => (
        <PaperCard key={i} paper={p} color={color} bg={bg} textColor={textColor} isDark={isDark} />
      ))}
    </div>
  );
}

function VisualBox({ title, surface, border, txt, children }) {
  return (
    <div style={{ background: surface, border: `0.5px solid ${border}`, borderRadius: 14, padding: "1.25rem", marginBottom: "1rem" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: txt, marginBottom: "1rem", fontFamily: "system-ui, sans-serif" }}>{title}</div>
      {children}
    </div>
  );
}
