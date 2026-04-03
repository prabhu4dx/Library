export type Category = "ai" | "uiux" | "cs";
export type ArticleType = "book" | "tool" | "lab" | "report" | "survey";
export type CoverPattern = "circles" | "terminal" | "nodes" | "dims" | "flow";

export type Article = {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  category: Category;
  subcategory: string;
  type: ArticleType;
  description: string;
  tags: string[];
  date: string;
  readingTime: string;
  accent: string;
  accentLight: string;
  coverPattern: CoverPattern;
  visualTags: string[];
  featured?: boolean;
};

export const ARTICLES: Article[] = [
  {
    id: "why-llm-cannot-reach-agi",
    title: "Why Large Language Models Cannot Reach AGI",
    subtitle: "Technical Research Survey · 80+ Papers",
    path: "/ai/agi/why-llm-cannot-reach-agi-technical-research-survey",
    category: "ai",
    subcategory: "AGI",
    type: "survey",
    description:
      "A deep technical survey spanning five research fronts: reasoning failures, memory limitations, ARC-AGI benchmarks, neuroscience comparisons, and proposed solutions. Evidence converges — LLMs are sophisticated interpolation engines fundamentally bounded by next-token prediction.",
    tags: ["80+ Papers", "Dark Mode", "Research Survey"],
    date: "March 2026",
    readingTime: "25 min",
    accent: "#993C1D",
    accentLight: "#FEF5E4",
    coverPattern: "circles",
    visualTags: ["Animated Bars", "Paper Cards", "ARC-AGI Benchmarks"],
    featured: true,
  },
  {
    id: "coding-agents-march-2026",
    title: "AI Coding Agents — March 2026 Landscape",
    subtitle: "Industry Analysis · 13 Agents Compared",
    path: "/ai/coding-agents/march-2026-landscape-report",
    category: "ai",
    subcategory: "Coding Agents",
    type: "report",
    description:
      "13 agents benchmarked: Claude Code, Cursor, Windsurf, Gemini, GitHub Copilot, Devin, and more. Covers SWE-bench scores, architecture internals, market valuations, and the 5 defining trends for 2026–2027.",
    tags: ["13 Agents", "Benchmarks", "Market Data"],
    date: "March 2026",
    readingTime: "20 min",
    accent: "#0F6E56",
    accentLight: "#E6F7F2",
    coverPattern: "terminal",
    visualTags: ["Expandable Cards", "Comparison Table", "SWE-bench Charts"],
  },
  {
    id: "top-brands-design-principles",
    title: "Top Brands Design Principles",
    subtitle: "Interactive Visual Explorer · 19 Design Systems",
    path: "/uiux/design-system/top-brands-design-principles",
    category: "uiux",
    subcategory: "Design Systems",
    type: "tool",
    description:
      "19 design systems — Apple, Google, Stripe, Linear, IBM, Figma, and more — mapped across 8 dimensions. A physics-based force graph, radar comparisons, bubble matrix, divergence rankings, and a 48-year timeline.",
    tags: ["19 Brands", "Force Graph", "Radar Chart"],
    date: "March 2026",
    readingTime: "30 min",
    accent: "#1D4ED8",
    accentLight: "#EBF0FD",
    coverPattern: "nodes",
    visualTags: ["Canvas Physics", "Zoomable SVG", "Pan & Zoom"],
  },
  {
    id: "n-dimensional-token-matrix",
    title: "N-Dimensional Token Matrix",
    subtitle: "Design Token Explorer · 7 Dimensions · Live",
    path: "/uiux/design-system/3-tier-token-architecture/N-Matrix-Exploration",
    category: "uiux",
    subcategory: "Design Systems",
    type: "lab",
    description:
      "Every design token lives at a point in N-dimensional space. Slide dimensions live — color, radius, shadow, typography, spacing, motion, state — and watch 25 tokens cascade in real-time across a live component preview.",
    tags: ["7 Dimensions", "Live Preview", "Real-time CSS"],
    date: "March 2026",
    readingTime: "15 min",
    accent: "#C85A1E",
    accentLight: "#FEF0E6",
    coverPattern: "dims",
    visualTags: ["Interactive Sliders", "Composition Matrix", "Live Component"],
  },
  {
    id: "mime-app",
    title: "MIME — Design Token Learning Platform",
    subtitle: "Interactive Education · 5 Tools Inside",
    path: "/uiux/design-system/3-tier-token-architecture/mime-app",
    category: "uiux",
    subcategory: "Design Systems",
    type: "tool",
    description:
      "Five interactive tools: Token Flow mind map tracing primitive→semantic→component chains, N-Dim Matrix, Decision Simulator with live WCAG audit, Token Debt Lab with before/after code diffs, and a scored Naming Game.",
    tags: ["5 Tools", "Quiz & Scoring", "WCAG Audit"],
    date: "March 2026",
    readingTime: "35 min",
    accent: "#7B3FA0",
    accentLight: "#F3EEF9",
    coverPattern: "flow",
    visualTags: ["Token Flow Mind Map", "Code Compare", "Naming Game"],
  },
  {
    id: "font-anatomy-explorer",
    title: "Font Anatomy Explorer",
    subtitle: "Interactive Typography Lab · 25 Google Fonts",
    path: "/uiux/typography/tools/anatomy-explorer",
    category: "uiux",
    subcategory: "Typography",
    type: "tool",
    description:
      "A live canvas lab for exploring the geometric anatomy of 25 Google Fonts. " +
      "Drag the five reference lines — ascender, cap height, x-height, baseline, descender — to reshape proportions, " +
      "and an algorithm instantly ranks every other font by anatomical similarity. Includes side-by-side comparison, x-height ratio analysis, and per-font personality intelligence.",
    tags: ["25 Google Fonts", "Drag & Discover", "Anatomy Canvas"],
    date: "March 2026",
    readingTime: "20 min",
    accent: "#5C3520",
    accentLight: "#F5EDE4",
    coverPattern: "dims",
    visualTags: ["Draggable Reference Lines", "Font Match Engine", "25-Font Library"],
  },
  {
    id: "mini-typography-book",
    title: "Mini Typography Book",
    subtitle: "Interactive Reference · 15 Chapters",
    path: "/uiux/typography/mini-typography-book",
    category: "uiux",
    subcategory: "Typography",
    type: "book",
    description:
      "A complete beginner's guide to typography across 15 interactive chapters — from type anatomy and classification to variable fonts, screen rendering, and web best practices. " +
      "Features a spacing lab, modular scale generator, anatomy hover explorer, 20-event history timeline, and a 29-term flip-card glossary.",
    tags: ["15 Chapters", "Interactive Labs", "29-Term Glossary"],
    date: "March 2026",
    readingTime: "20 min",
    accent: "#374151",
    accentLight: "#F3F4F6",
    coverPattern: "flow",
    visualTags: ["Anatomy Explorer", "Modular Scale Lab", "Variable Font Sliders"],
  },
  {
    id: "color-encyclopedia",
    title: "Color Encyclopedia",
    subtitle: "Interactive Color Science Reference · 20 Systems",
    path: "/uiux/color/encyclopedia",
    category: "uiux",
    subcategory: "Color Science",
    type: "book",
    description:
      "A comprehensive interactive reference for 20 color systems — from sRGB and OKLCH to CMYK, ACES, and CAM16/HCT. Eight views: magazine grid, chronological timeline, domain map, hardware layers, use cases, compare table, color lab, and concepts guide.",
    tags: ["20 Systems", "Color Science", "CSS Level 4"],
    date: "March 2026",
    readingTime: "20 min",
    accent: "#B45309",
    accentLight: "#FEF3C7",
    coverPattern: "nodes",
    visualTags: ["8 Interactive Views", "Color Lab", "Timeline 1931–2025"],
  },
  {
    id: "dsa-codex-rose-book",
    title: "The DSA Codex",
    subtitle: "Interactive Algorithm Reference · 8 Data Structures",
    path: "/computer-science/dsa/rose-book",
    category: "cs",
    subcategory: "Data Structures",
    type: "book",
    description:
      "A digital simulation book exploring 8 fundamental data structures — from arrays and hash tables to heaps and graphs. " +
      "Features interactive simulators, a 2300-year algorithmic timeline, and visual deep-dives into complexity and patterns.",
    tags: ["8 Data Structures", "Interactive Simulators", "2300-Year Timeline"],
    date: "April 2026",
    readingTime: "20 min",
    accent: "#9E2B4A",
    accentLight: "#FBF2F5",
    coverPattern: "flow",
    visualTags: ["Live Simulators", "Algorithmic Timeline", "Complexity Explorer"],
  },
  {
    id: "graph-theory-visual-book",
    title: "Graph Theory — The Complete Visual Book",
    subtitle: "Interactive Algorithm Reference · 17 Sections",
    path: "/computer-science/dsa/graph-coffee-icecream-fundamentals",
    category: "cs",
    subcategory: "Algorithms",
    type: "book",
    description:
      "A comprehensive visual journey into graph theory, from foundations to algorithms like Dijkstra's and MST. " +
      "Features interactive BFS/DFS simulators and real-world application maps in a premium coffee-themed aesthetic.",
    tags: ["17 Sections", "BFS/DFS Simulators", "Visual Guide"],
    date: "April 2026",
    readingTime: "15 min",
    accent: "#1A6B6A",
    accentLight: "#E0F5F3",
    coverPattern: "nodes",
    visualTags: ["BFS/DFS Simulators", "Algorithm Decision Table", "Interactive Navigation"],
  },
];

export const CATEGORY_META: Record<
  Category,
  { label: string; description: string }
> = {
  ai: {
    label: "AI",
    description:
      "Research on artificial intelligence — language models, coding agents, benchmarks, and where the field is heading.",
  },
  uiux: {
    label: "Design",
    description:
      "Visual explorations of design systems, token architecture, and the principles behind great digital products.",
  },
  cs: {
    label: "Computer Science",
    description:
      "Technical deep-dives into algorithms, data structures, and the mathematical foundations of computing.",
  },
};

export const TYPE_META: Record<
  ArticleType,
  { label: string; icon: string }
> = {
  book: { label: "Interactive Book", icon: "" },
  tool: { label: "Interactive Tool", icon: "" },
  lab: { label: "Experimental Lab", icon: "" },
  report: { label: "Industry Report", icon: "" },
  survey: { label: "Research Survey", icon: "" },
};
