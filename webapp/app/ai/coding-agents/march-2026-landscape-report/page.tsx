"use client";
import { useState } from "react";

const AGENTS = [
  {
    name: "Claude Code",
    company: "Anthropic",
    type: "CLI",
    category: "cli",
    open: false,
    models: "Sonnet/Opus 4.6",
    context: "1M tokens",
    price: "$20/mo (Pro)",
    sweBench: 80.8,
    stars: null,
    color: "#B45309",
    accent: "#FEF3C7",
    tagline: "Terminal-native powerhouse with Agent Teams & MCP ecosystem",
    strengths: ["1M-token context understands entire codebases","Agent Teams for parallel multi-instance work","500+ zero-day vulns found via Security scanning","CLAUDE.md project constitution system","Hooks for custom pre/post-tool automation","MCP support (stdio + HTTP + OAuth)"],
    weaknesses: ["Rate limits hit fast under heavy Pro use","Higher API cost ($3/$15 per M tokens)","No built-in GUI — terminal only (+ VS Code ext)","Vendor-locked to Anthropic models"],
    architecture: "Observe → Plan → Act → Reflect loop. Agentic search discovers project structure recursively. Tools: FileWrite, EditTool, Grep, Glob, Bash, subagents. Compaction system summarizes when 1M context fills — enabling infinite conversations."
  },
  {
    name: "OpenAI Codex",
    company: "OpenAI",
    type: "CLI + App",
    category: "cli",
    open: "CLI (Apache 2.0)",
    models: "GPT-5.x family",
    context: "~192K+",
    price: "$20/mo (Plus)",
    sweBench: 74,
    stars: 60200,
    color: "#047857",
    accent: "#D1FAE5",
    tagline: "Cloud-first async delegation with open-source CLI",
    strengths: ["Open-source CLI (Rust) — 60.2K GitHub stars","Cloud async: sandbox VMs clone, edit, PR automatically","3–4× more token-efficient than Claude Code","Automations: scheduled issue triage, CI monitoring","Code review catches logical errors & race conditions","Multi-surface: CLI, desktop, VS Code, ChatGPT"],
    weaknesses: ["SWE-bench scores trail Claude Opus","MCP support limited to stdio only","Desktop app only macOS/Windows (no Linux)","Cloud sandbox cold starts can be slow"],
    architecture: "Responses API loop: user input → prompt → model inference → tool calls → iterate until assistant message. OS-level sandboxing (macOS Seatbelt, Linux Landlock/seccomp). Network disabled by default. GPT-5.3-Codex leads Terminal-Bench 2.0 at 77.3%."
  },
  {
    name: "Cursor",
    company: "Anysphere",
    type: "AI-first IDE",
    category: "ide",
    open: false,
    models: "Multi-model (Claude, GPT, Gemini)",
    context: "Varies by model",
    price: "$20/mo (Pro)",
    sweBench: null,
    stars: null,
    color: "#6D28D9",
    accent: "#EDE9FE",
    tagline: "VS Code fork with Background Agents & $29.3B valuation",
    strengths: ["Background Agents: up to 8 parallel on cloud VMs","30% of Cursor's own PRs come from its agents","Merkle tree codebase indexing + Turbopuffer vectors","Preempt system: priority-based context composition","BugBot automated PR reviewer","$29.3B valuation, 1M+ DAUs, $2B+ ARR"],
    weaknesses: ["Credit system controversy (500 → ~225 effective)","BugBot is $40/user/month add-on","VS Code fork — can lag behind upstream","Heavy resource usage on large codebases"],
    architecture: "Three-layer: modified VS Code core with Monaco patches, codebase indexing via Merkle trees + custom embedding model in Turbopuffer (vector DB), and multi-model AI backend. Preempt system uses JSX-like priority declarations for context — cursor-adjacent lines get highest weight."
  },
  {
    name: "Windsurf",
    company: "Cognition AI",
    type: "AI-first IDE",
    category: "ide",
    open: false,
    models: "SWE-1.5 + Multi-model",
    context: "Varies by model",
    price: "$20/mo (Pro)",
    sweBench: null,
    stars: null,
    color: "#0369A1",
    accent: "#E0F2FE",
    tagline: "950 tok/s via Cerebras with real-time action awareness",
    strengths: ["SWE-1.5 model: 950 tokens/sec (6× Haiku speed)","Cascade dual-agent: planner + executor","Real-time action awareness (file, terminal, clipboard)","Fast Context via SWE-grep: 20× faster retrieval","Arena Mode for blind model comparison","SOC 2 Type II, HIPAA, FedRAMP compliance"],
    weaknesses: ["Writes to disk immediately — no diff review","Turbulent ownership: OpenAI → Google → Cognition","Smaller community than Cursor","Pricing backlash after raise to $20/mo"],
    architecture: "Cascade operates as dual-agent: planning agent for long-term strategy, selected model for short-term execution. Dependency graphs via TypeScript language servers or tree-sitter. M-Query retrieval (proprietary) beats cosine similarity. SWE-grep retrieves at >2,800 tokens/second."
  },
  {
    name: "GitHub Copilot",
    company: "Microsoft/GitHub",
    type: "IDE Plugin + CLI",
    category: "platform",
    open: "Copilot Chat OSS",
    models: "Multi-model picker",
    context: "Up to 1M",
    price: "$10/mo (Pro)",
    sweBench: 56,
    stars: null,
    color: "#4338CA",
    accent: "#E0E7FF",
    tagline: "15M+ users, widest IDE support, model flexibility",
    strengths: ["15M+ users — most widely adopted","Model picker: GPT-5, Claude Opus/Sonnet, Gemini","Coding Agent: GitHub Actions VMs → autonomous PRs","CLI with sub-agents: Explore, Task, Review, Plan","Lowest entry price at $10/mo","Widest IDE support (VS Code, JetBrains, Xcode, Vim...)"],
    weaknesses: ["As a tool, only 56% SWE-bench (vs 80%+ raw model)","Premium requests limited (300/mo on Pro)","GitHub-native focus limits non-GitHub workflows","Agent overhead reduces model performance"],
    architecture: "Copilot Coding Agent runs in GitHub Actions-powered VMs. Takes a GitHub issue, clones repo, makes changes, runs tests, self-reviews with security scanning, and opens a PR. CLI GA Feb 2026 with specialized sub-agents. Model-agnostic: users choose via picker."
  },
  {
    name: "Amazon Q",
    company: "AWS",
    type: "IDE Plugin + CLI",
    category: "platform",
    open: false,
    models: "Multi-FM (Bedrock)",
    context: "~100K chars",
    price: "$19/user/mo",
    sweBench: 66,
    stars: null,
    color: "#B45309",
    accent: "#FEF3C7",
    tagline: "AWS-native with unmatched code transformation capabilities",
    strengths: ["Java 8→21 & .NET transformation — unique capability","Saved AWS 4,500 dev-years & $260M internally","/doc agent generates docs with data flow diagrams","/review agent scans for security anti-patterns","Kiro IDE for spec-driven development","Generous perpetual free tier"],
    weaknesses: ["AWS-centric — less useful outside Amazon cloud","Lower SWE-bench score (66%)","Smaller context window (~100K chars)","Agent mode less mature than competitors"],
    architecture: "Multi-foundation-model architecture via Amazon Bedrock. Transformation agent handles language version upgrades through AST manipulation and semantic analysis. /doc agent generates documentation with data flow diagrams. /review agent scans for security anti-patterns."
  },
  {
    name: "Gemini Code Assist",
    company: "Google",
    type: "IDE Plugin + CLI",
    category: "platform",
    open: "CLI only",
    models: "Gemini 2.5/3.x",
    context: "1M tokens",
    price: "$0 (free tier)",
    sweBench: 78,
    stars: null,
    color: "#BE123C",
    accent: "#FFE4E6",
    tagline: "Largest free tier with 1M context and Jules async agent",
    strengths: ["180,000 free completions/month (90× Copilot free)","1M token context window","Jules async agent for autonomous GitHub PRs","Gemini CLI is fully open-source","Deep GCP/Firebase integration","Agent mode with multi-step planning"],
    weaknesses: ["Agent mode still in preview","Code completion quality trails Copilot/Cursor","Models not user-swappable","Enterprise pricing highest ($45–54/user/mo)"],
    architecture: "Gemini 3.x models with 1M native context. Jules operates asynchronously on GitHub repos — cloning, branching, coding, testing, and creating PRs. Agent mode uses Gemini's native tool use and multi-step planning. CLI is open-source for community extension."
  },
  {
    name: "Devin",
    company: "Cognition Labs",
    type: "Autonomous Agent",
    category: "autonomous",
    open: false,
    models: "Proprietary compound AI",
    context: "Undisclosed",
    price: "$20/mo + ACUs",
    sweBench: 13.86,
    stars: null,
    color: "#A21CAF",
    accent: "#FAE8FF",
    tagline: "Full SDLC autonomy — plans, codes, tests, deploys",
    strengths: ["Full cloud dev environment per session","Compound AI: Planner + Coder + Critic + Browser","Kevin: 32B model beating frontier on CUDA kernels","MCP marketplace + Slack/Linear/Jira integrations","Price dropped from $500 → $20/mo (Jan 2026)","Headless Chrome for documentation scraping"],
    weaknesses: ["~15% success rate on complex tasks (Answer.AI)","12–15 min iteration cycles frustrate developers","Only 13.86% SWE-bench Verified (original)","ACU-based billing can be unpredictable ($2.25/ACU)"],
    architecture: "Compound AI system: Planner LLM for strategy, Coder for implementation, Critic for adversarial review, Browser agent for docs. Each session spins up Docker sandbox with shell, VS Code editor, headless Chrome. Enhanced by RL. Kevin (32B) specialized for CUDA."
  },
  {
    name: "SWE-Agent",
    company: "Princeton/Stanford",
    type: "Research Agent",
    category: "opensource",
    open: "Yes (MIT)",
    models: "Any via LiteLLM",
    context: "Model-dependent",
    price: "Free",
    sweBench: 74,
    stars: null,
    color: "#0F766E",
    accent: "#CCFBF1",
    tagline: "Radical simplicity — >74% SWE-bench in ~100 lines of Python",
    strengths: [">74% SWE-bench Verified (mini-SWE-agent)","~100 lines of Python — radical simplicity","93 seconds average per task","ACI innovation (NeurIPS 2024)","Fully model-agnostic via LiteLLM","Free — only pay API costs"],
    weaknesses: ["Narrowly focused on issue fixing","No browser, no project management integrations","No polished UI — research-grade tooling","Limited to GitHub issue resolution workflows"],
    architecture: "Agent-Computer Interface (ACI): custom tools designed for LM agents, not humans. Without ACI, performance drops from 12.5% to 2.8%. mini-SWE-agent uses only bash as its tool. Published at NeurIPS 2024. Model-agnostic via LiteLLM."
  },
  {
    name: "Aider",
    company: "Paul Gauthier",
    type: "CLI",
    category: "opensource",
    open: "Yes (Apache 2.0)",
    models: "Any via litellm",
    context: "Model-dependent",
    price: "Free",
    sweBench: 26.3,
    stars: 42200,
    color: "#4D7C0F",
    accent: "#ECFCCB",
    tagline: "Pioneered repo map with tree-sitter + PageRank — no RAG needed",
    strengths: ["Repo map: tree-sitter + PageRank (no RAG/vectors)","70.3% accuracy identifying correct file to edit","6 edit formats, auto-selects best per model","Architect/Editor dual-model mode","Writes 70–88% of code in its own releases","Auto-commits to Git with descriptive messages"],
    weaknesses: ["Lower SWE-bench score (26.3% Lite)","CLI-only — no IDE integration","Slower on very large monorepos","Learning curve for edit format configuration"],
    architecture: "Tree-sitter parses all source files, builds NetworkX graph of symbol references, runs PageRank with personalization to rank files by relevance. No embeddings, no vectors, no RAG. Architect/Editor mode separates reasoning from code editing across two models."
  },
  {
    name: "OpenCode",
    company: "Community (anomalyco)",
    type: "CLI + TUI + IDE",
    category: "opensource",
    open: "Yes (MIT)",
    models: "75+ models",
    context: "Model-dependent",
    price: "Free",
    sweBench: null,
    stars: 128000,
    color: "#C2410C",
    accent: "#FFEDD5",
    tagline: "128K GitHub stars — fastest-growing open-source coding agent",
    strengths: ["128,000 GitHub stars (18K in 2 weeks)","75+ model support — most provider-agnostic","Deep LSP integration for type-aware diagnostics","Go + TypeScript TUI architecture","Client/server: desktop, VS Code, WebUI, mobile","Explicit anti-vendor-lock-in philosophy"],
    weaknesses: ["No official SWE-bench score published","Younger project — less battle-tested","Community-maintained — no enterprise SLAs","Documentation still maturing"],
    architecture: "Go backend with TypeScript TUI. Client/server architecture supporting multiple frontends. Deep LSP integration queries language servers after every edit for type-aware diagnostics. Growth exploded after Anthropic restricted Claude Code in third-party tools (Jan 2026)."
  },
  {
    name: "Cline",
    company: "Cline Bot",
    type: "VS Code Extension",
    category: "opensource",
    open: "Yes (Apache 2.0)",
    models: "Any (BYOM)",
    context: "Model-dependent",
    price: "Free",
    sweBench: null,
    stars: 58000,
    color: "#7C3AED",
    accent: "#F3E8FF",
    tagline: "5M+ VS Code installs with human-in-the-loop approval",
    strengths: ["5M+ VS Code marketplace installs","Human-in-the-loop: approve every change","Browser automation via Claude Computer Use","4,704% YoY contributor growth","Fastest-growing AI OSS project (GitHub 2025)","BYOM — bring your own model/API key"],
    weaknesses: ["VS Code only — no JetBrains/Neovim","Approval fatigue on large tasks","API costs can be high with frontier models","No built-in background/async agents"],
    architecture: "VS Code extension with human-in-the-loop approval for every file edit, terminal command, and browser action. Browser automation via Claude Computer Use. Model-agnostic — users provide their own API keys. Built on a tool-use-first paradigm."
  },
  {
    name: "Roo Code",
    company: "Roo Code (fork of Cline)",
    type: "VS Code Extension",
    category: "opensource",
    open: "Yes (Apache 2.0)",
    models: "500+ models",
    context: "Model-dependent",
    price: "Free",
    sweBench: null,
    stars: 22800,
    color: "#0E7490",
    accent: "#CFFAFE",
    tagline: "Custom Modes (Architect, Debug, Orchestrator) + enterprise compliance",
    strengths: ["Custom Modes: Architect, Code, Debug, Orchestrator","Cloud Agents for background execution","500+ model support","SOC 2 compliance for enterprise","Forked from Cline with enterprise features","MCP server support"],
    weaknesses: ["Smaller community than Cline (22.8K vs 58K stars)","VS Code only","Less established track record","Enterprise features may fragment from Cline upstream"],
    architecture: "Forked from Cline with added Custom Modes system — Architect for high-level planning, Code for implementation, Debug for troubleshooting, Orchestrator for multi-agent coordination. Cloud Agents enable background execution. SOC 2 compliance for enterprise use."
  }
];

const BENCHMARKS = [
  { model: "Claude Opus 4.5", score: 80.9, provider: "Anthropic", color: "#B45309" },
  { model: "Claude Opus 4.6", score: 80.8, provider: "Anthropic", color: "#B45309" },
  { model: "Gemini 3.1 Pro", score: 80.6, provider: "Google", color: "#BE123C" },
  { model: "MiniMax M2.5", score: 80.2, provider: "MiniMax (OSS)", color: "#4D7C0F" },
  { model: "GPT-5.2", score: 80.0, provider: "OpenAI", color: "#047857" },
  { model: "Zhipu GLM-5", score: 77.8, provider: "Zhipu AI", color: "#0F766E" },
  { model: "Gemini 2.5 Pro", score: 76.0, provider: "Google", color: "#BE123C" },
  { model: "SWE-Agent (mini)", score: 74.0, provider: "Princeton (OSS)", color: "#0F766E" },
  { model: "DeepSeek V3.2", score: 73.0, provider: "DeepSeek (OSS)", color: "#C2410C" },
  { model: "Qwen3-Coder-Next", score: 70.6, provider: "Alibaba (OSS)", color: "#7C3AED" },
  { model: "Amazon Q", score: 66.0, provider: "AWS", color: "#B45309" },
  { model: "Copilot (tool)", score: 56.0, provider: "GitHub", color: "#4338CA" },
];

const TRENDS = [
  { icon: "⚡", title: "Background Agents Become Default", detail: "Cursor runs 10–20 parallel agents per developer on cloud VMs. Claude Code Agent Teams coordinate on git worktrees. The developer's role shifts from writing code to reviewing agent output." },
  { icon: "🔌", title: "MCP as Universal Integration Layer", detail: "10,000+ public MCP servers connect agents to Slack, Jira, Figma, databases. Adopted by OpenAI, Google, Microsoft. Donated to Linux Foundation's Agentic AI Foundation (Dec 2025)." },
  { icon: "🔀", title: "CLI vs IDE Distinction Dissolving", detail: "Claude Code ships VS Code ext + desktop app. Cursor launched a CLI. Copilot CLI went GA Feb 2026. Universal SKILL.md format (1,234+ skills) works across all tools." },
  { icon: "🔍", title: "Code Review Is the New Bottleneck", detail: "AI-coauthored PRs contain ~1.7× more issues. Cursor acquired Graphite ($290M). Every platform now has AI-powered review. Expected to be solved by late 2026." },
  { icon: "📊", title: "Open Source Reaches Parity", detail: "MiniMax M2.5 (OSS) scores 80.2% SWE-bench — within 0.7 points of the leader. Qwen3-Coder-Next: 70.6% with only 3B active params on a single RTX 4090." },
];

const MARKET = [
  { company: "Cursor (Anysphere)", valuation: "$29.3B", arr: "$2B+", funding: "$2.3B Series D" },
  { company: "Anthropic", valuation: "$380B", arr: "$19B", funding: "Feb 2026 round" },
  { company: "Cognition (Devin)", valuation: "$10.2B", arr: "N/A", funding: "$400M (Sep 2025)" },
];

const CATEGORY_META = {
  cli: { label: "CLI-Native", icon: "▶" },
  ide: { label: "AI-First IDEs", icon: "◼" },
  platform: { label: "Platforms", icon: "◆" },
  autonomous: { label: "Autonomous", icon: "●" },
  opensource: { label: "Open Source", icon: "◇" },
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "compare", label: "Compare" },
  { id: "benchmarks", label: "Benchmarks" },
  { id: "architecture", label: "Architecture" },
  { id: "market", label: "Market & Trends" },
];

const T = {
  bg: "#F7F5F0",
  card: "#FFFFFF",
  cardAlt: "#FDFCFA",
  border: "#E5E1D8",
  text: "#1A1816",
  sub: "#5C5650",
  muted: "#A39E95",
  code: "#F3F1EB",
  stripe: "#FAFAF7",
  green: "#166534", greenBg: "#F0FDF4", greenBd: "#BBF7D0",
  red: "#991B1B", redBg: "#FEF2F2", redBd: "#FECACA",
  warn: "#92400E", warnBg: "#FFFBEB", warnBd: "#FDE68A",
  info: "#1E40AF", infoBg: "#EFF6FF", infoBd: "#BFDBFE",
};

function Bar({ value, max, color, label, sublabel }: { value: number; max: number; color: string; label: string; sublabel?: string }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
        <span style={{ color: T.sub, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{label}</span>
        <span style={{ color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{value}%</span>
      </div>
      <div style={{ background: T.code, borderRadius: 6, height: 24, overflow: "hidden", position: "relative", border: `1px solid ${T.border}` }}>
        <div style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}BB, ${color})`, height: "100%", borderRadius: 5, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }} />
        {sublabel && <span style={{ position: "absolute", right: 8, top: 4, fontSize: 10, color: T.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{sublabel}</span>}
      </div>
    </div>
  );
}

function AgentCard({ agent, expanded, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      background: T.card,
      border: `1.5px solid ${expanded ? agent.color + "44" : T.border}`,
      borderRadius: 14,
      padding: "18px 20px",
      cursor: "pointer",
      transition: "all 0.25s ease",
      boxShadow: expanded ? `0 6px 28px ${agent.color}0F, 0 1px 4px rgba(0,0,0,0.06)` : "0 1px 3px rgba(0,0,0,0.03)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: agent.color, fontFamily: "'IBM Plex Mono', monospace" }}>{agent.name}</span>
            <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, background: agent.accent, color: agent.color, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{agent.type}</span>
            {agent.open && <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, background: T.greenBg, color: T.green, fontWeight: 700 }}>{typeof agent.open === "string" ? agent.open : "OPEN SOURCE"}</span>}
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 5 }}>{agent.company}</div>
          <div style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.6, maxWidth: 600 }}>{agent.tagline}</div>
        </div>
        <div style={{ textAlign: "right", minWidth: 100, flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: T.muted, marginBottom: 2, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>SWE-bench</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: agent.sweBench ? agent.color : T.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{agent.sweBench ? `${agent.sweBench}%` : "N/A"}</div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{agent.price}</div>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: 18, borderTop: `1px solid ${T.border}`, paddingTop: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
            <div><div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5, fontWeight: 700 }}>Models</div><div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{agent.models}</div></div>
            <div><div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5, fontWeight: 700 }}>Context</div><div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{agent.context}</div></div>
            {agent.stars && <div><div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5, fontWeight: 700 }}>GitHub Stars</div><div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{agent.stars.toLocaleString()}</div></div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div style={{ background: T.greenBg, borderRadius: 10, padding: 14, border: `1px solid ${T.greenBd}` }}>
              <div style={{ fontSize: 10, color: T.green, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>Strengths</div>
              {agent.strengths.map((s, i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", marginBottom: 5, paddingLeft: 14, position: "relative", lineHeight: 1.6 }}><span style={{ position: "absolute", left: 0, color: T.green, fontWeight: 700 }}>+</span> {s}</div>)}
            </div>
            <div style={{ background: T.redBg, borderRadius: 10, padding: 14, border: `1px solid ${T.redBd}` }}>
              <div style={{ fontSize: 10, color: T.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>Weaknesses</div>
              {agent.weaknesses.map((w, i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", marginBottom: 5, paddingLeft: 14, position: "relative", lineHeight: 1.6 }}><span style={{ position: "absolute", left: 0, color: T.red, fontWeight: 700 }}>−</span> {w}</div>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, fontWeight: 700 }}>Architecture</div>
            <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.9, background: T.code, padding: 16, borderRadius: 10, border: `1px solid ${T.border}`, fontFamily: "'IBM Plex Mono', monospace" }}>{agent.architecture}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [exp, setExp] = useState(null);
  const [cat, setCat] = useState("all");
  const filtered = cat === "all" ? AGENTS : AGENTS.filter(a => a.category === cat);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter', -apple-system, sans-serif", padding: "28px 22px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${T.bg}}::-webkit-scrollbar-thumb{background:#D4CFC6;border-radius:3px}`}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: T.muted, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>March 2026 Landscape Report</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", color: T.text, lineHeight: 1.2, marginBottom: 8 }}>AI Coding Agents</h1>
        <p style={{ fontSize: 13, color: T.sub, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>13 agents compared across features, architecture, benchmarks & developer experience. Click any card to expand full details.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Market Size", value: "$7–13B", color: "#B45309", bg: "#FEF3C7" },
          { label: "Top SWE-bench", value: "80.9%", color: "#166534", bg: "#DCFCE7" },
          { label: "Cursor Valuation", value: "$29.3B", color: "#6D28D9", bg: "#EDE9FE" },
          { label: "Devs Using AI", value: "95%", color: "#0369A1", bg: "#E0F2FE" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "'IBM Plex Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 9, color: s.color + "BB", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 22, background: T.card, padding: 4, borderRadius: 12, border: `1px solid ${T.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "10px 6px",
            background: tab === t.id ? T.bg : "transparent",
            border: tab === t.id ? `1px solid ${T.border}` : "1px solid transparent",
            borderRadius: 9, color: tab === t.id ? T.text : T.muted,
            fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Inter', sans-serif",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && <div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {[{ id: "all", label: "All (13)" }, ...Object.entries(CATEGORY_META).map(([id, m]) => ({ id, label: `${m.icon} ${m.label}` }))].map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              padding: "7px 16px", borderRadius: 20,
              border: `1.5px solid ${cat === c.id ? "#B45309" : T.border}`,
              background: cat === c.id ? "#FEF3C7" : T.card,
              color: cat === c.id ? "#B45309" : T.sub,
              fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}>{c.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(a => <AgentCard key={a.name} agent={a} expanded={exp === a.name} onToggle={() => setExp(exp === a.name ? null : a.name)} />)}
        </div>
      </div>}

      {/* Compare */}
      {tab === "compare" && <div style={{ overflowX: "auto", background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 11.5 }}>
          <thead><tr>
            {["Agent", "Type", "Open Source", "Models", "Context", "Price", "SWE-bench"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", borderBottom: `2px solid ${T.border}`, color: T.muted, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, background: T.stripe, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {AGENTS.map((a, i) => (
              <tr key={a.name} style={{ background: i % 2 === 0 ? T.stripe : T.card }}>
                <td style={{ padding: "11px 14px", fontWeight: 700, color: a.color, whiteSpace: "nowrap", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{a.name}</td>
                <td style={{ padding: "11px 14px", color: T.sub }}>{a.type}</td>
                <td style={{ padding: "11px 14px" }}>
                  {a.open ? <span style={{ color: T.green, fontWeight: 600, background: T.greenBg, padding: "2px 8px", borderRadius: 10, fontSize: 10 }}>{typeof a.open === "string" ? a.open : "Yes"}</span>
                    : <span style={{ color: T.red, fontWeight: 600, background: T.redBg, padding: "2px 8px", borderRadius: 10, fontSize: 10 }}>No</span>}
                </td>
                <td style={{ padding: "11px 14px", color: T.sub, maxWidth: 160, fontSize: 11 }}>{a.models}</td>
                <td style={{ padding: "11px 14px", color: T.sub, whiteSpace: "nowrap" }}>{a.context}</td>
                <td style={{ padding: "11px 14px", color: T.text, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>{a.price}</td>
                <td style={{ padding: "11px 14px", fontWeight: 800, color: a.sweBench ? a.color : T.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{a.sweBench ? `${a.sweBench}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* Benchmarks */}
      {tab === "benchmarks" && <div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", color: T.text, marginBottom: 4 }}>SWE-bench Verified Leaderboard</h3>
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 18, lineHeight: 1.6 }}>500 human-validated Python tasks. Scores plateaued near 80%. Open-source models now compete directly.</p>
          {BENCHMARKS.map((b, i) => <Bar key={i} value={b.score} max={100} color={b.color} label={b.model} sublabel={b.provider} />)}
        </div>
        <div style={{ background: T.warnBg, border: `1px solid ${T.warnBd}`, borderRadius: 14, padding: 22, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", color: T.warn, marginBottom: 12 }}>⚠ Why Benchmarks Are Unreliable Now</h3>
          <div style={{ fontSize: 12, color: "#78716C", lineHeight: 1.9 }}>
            <p style={{ marginBottom: 8 }}>OpenAI stopped reporting Verified scores — every frontier model shows <strong style={{ color: T.red }}>training data contamination</strong>.</p>
            <p style={{ marginBottom: 8 }}>Three different frameworks running identical models scored <strong style={{ color: T.red }}>17 issues apart</strong> on the same test — scaffold matters as much as model.</p>
            <p style={{ marginBottom: 8 }}><strong style={{ color: T.warn }}>SWE-bench Pro</strong> (1,865 multi-language tasks): Claude Opus 4.5 drops to <strong>45.9%</strong>. Gap from Verified (80.9%) reveals inflated scores.</p>
            <p>Top failures: <strong>context overflow (35.6%)</strong>, <strong>semantic understanding (35.9%)</strong>, <strong>tool-use inefficiency (42%)</strong>.</p>
          </div>
        </div>
        <div style={{ background: T.infoBg, border: `1px solid ${T.infoBd}`, borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", color: T.info, marginBottom: 12 }}>Terminal-Bench 2.0 — DevOps & Terminal</h3>
          {[{ name: "Gemini 3.1 Pro", score: 78.4, color: "#BE123C" },{ name: "GPT-5.3-Codex", score: 77.3, color: "#047857" },{ name: "Claude Opus 4.6", score: 74.7, color: "#B45309" },{ name: "Claude Code (tool)", score: 58.0, color: "#B45309" }].map((b, i) => <Bar key={i} value={b.score} max={100} color={b.color} label={b.name} />)}
        </div>
      </div>}

      {/* Architecture */}
      {tab === "architecture" && <div>
        <p style={{ fontSize: 12, color: T.sub, marginBottom: 20, lineHeight: 1.7 }}>How each agent handles context retrieval, code editing, sandboxing, and multi-step execution.</p>
        {AGENTS.map(a => (
          <div key={a.name} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: a.color, fontFamily: "'IBM Plex Mono', monospace" }}>{a.name}</span>
              <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, background: a.accent, color: a.color, fontWeight: 700, textTransform: "uppercase" }}>{a.type}</span>
            </div>
            <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.9, fontFamily: "'IBM Plex Mono', monospace", background: T.code, padding: 16, borderRadius: 10, border: `1px solid ${T.border}` }}>{a.architecture}</div>
          </div>
        ))}
      </div>}

      {/* Market */}
      {tab === "market" && <div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", color: "#B45309", marginBottom: 18 }}>Funding & Valuations</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {MARKET.map((m, i) => (
              <div key={i} style={{ background: "#FEF3C7", borderRadius: 12, padding: 18, border: "1px solid #FDE68A", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: T.sub, fontWeight: 700, marginBottom: 8 }}>{m.company}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#B45309", fontFamily: "'IBM Plex Mono', monospace" }}>{m.valuation}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>ARR: {m.arr}</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{m.funding}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, fontSize: 12, color: T.sub, lineHeight: 1.7 }}>Top AI coding startups raised <strong style={{ color: T.text }}>$5.2B in equity funding</strong> in 2025 at 30–33× revenue multiples. Market estimated at $7–13B in 2026.</div>
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", color: T.green, marginBottom: 18 }}>Adoption & Impact</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { stat: "95%", label: "Devs use AI coding tools weekly+", src: "Anthropic 2026", bg: "#DCFCE7" },
              { stat: "60%", label: "More PRs merged by daily AI users", src: "Industry avg", bg: "#E0F2FE" },
              { stat: "3.6 hrs", label: "Saved per developer per week", src: "Multiple studies", bg: "#EDE9FE" },
              { stat: "25%", label: "Google's new code is AI-generated", src: "Google report", bg: "#FFE4E6" },
              { stat: "340%", label: "Surge in AI tool job requirements", src: "Jan 2025–2026", bg: "#FEF3C7" },
              { stat: "15M+", label: "GitHub Copilot active users", src: "GitHub", bg: "#CFFAFE" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.text, fontFamily: "'IBM Plex Mono', monospace" }}>{s.stat}</div>
                <div style={{ fontSize: 11, color: T.sub, marginTop: 4, lineHeight: 1.5 }}>{s.label}</div>
                <div style={{ fontSize: 9, color: T.muted, marginTop: 3 }}>{s.src}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", color: "#6D28D9", marginBottom: 18 }}>5 Defining Trends for 2026–2027</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TRENDS.map((t, i) => (
              <div key={i} style={{ background: T.stripe, borderRadius: 12, padding: 18, border: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{t.title}</span>
                </div>
                <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.8, paddingLeft: 32 }}>{t.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>}

      <div style={{ textAlign: "center", marginTop: 36, padding: "18px 0", borderTop: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 10, color: T.muted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1 }}>AI CODING AGENTS LANDSCAPE · MARCH 2026 · DATA FROM 100+ SOURCES</div>
      </div>
    </div>
  );
}
