"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ARTICLES, Category, ArticleType, CATEGORY_META, TYPE_META } from "./lib/registry";
import ArticleCard, { ViewMode } from "./components/ArticleCard";

/* ── Components ─────────────────────────────────────────── */

/**
 * Luminous Sanctuary Background
 * 24 Symmetrical Pillars (12 per side) tapering steeply inward.
 * Warm palette: Orange, Yellow, Rose, White.
 * Rhythmic 'Pulse' light flashing from bottom up.
 */
function FixedSanctuaryBackground() {
  const pillarCount = 12; // Per side
  const colors = ["#FFEFD5", "#FFFACD", "#FFE4E1", "#FFF5EE"]; // Papaya, Lemon, Rose, White

  const generatePillars = (side: "left" | "right") => {
    return Array.from({ length: pillarCount }).map((_, i) => {
      const ratio = i / (pillarCount - 1); // 0 (outer) to 1 (inner)
      const invRatio = 1 - ratio;
      
      return {
        side,
        // Non-linear spacing for deeper perspective
        position: `${(Math.pow(i, 1.4) * 1.8)}%`,
        // Steep height/width tapering: Outer is tall/wide, Inner is short/narrow
        width: `${14 * Math.pow(invRatio, 1.5) + 1.2}vw`,
        height: `${65 * Math.pow(invRatio, 1.8) + 35}vh`,
        opacity: 0.35 * invRatio + 0.05,
        color: colors[i % colors.length],
        blur: `${10 * ratio + 40}px`,
        zIndex: pillarCount - i,
        delay: `${i * 0.5}s`, // Staggered flashing
      };
    });
  };

  const leftPillars = useMemo(() => generatePillars("left"), []);
  const rightPillars = useMemo(() => generatePillars("right"), []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "#FFFFFF", overflow: "hidden" }}>
      {/* Ambient Mesh Glow (Warm Sunset) */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(circle at 5% 10%, #FFEFD590 0%, transparent 40%),
          radial-gradient(circle at 95% 15%, #FFE4E170 0%, transparent 45%),
          radial-gradient(circle at 50% 90%, #FFFACD40 0%, transparent 60%),
          #FFFFFF
        `,
        filter: "blur(120px)"
      }} />

      {/* Luminous Architecture Array */}
      {[...leftPillars, ...rightPillars].map((p, idx) => (
        <div key={idx} className="pillar-luminous" style={{
          position: "absolute",
          [p.side]: p.position,
          bottom: 0,
          width: p.width,
          height: p.height,
          background: `linear-gradient(to top, ${p.color}EE 0%, ${p.color}40 40%, transparent 95%)`,
          backdropFilter: `blur(${p.blur})`,
          WebkitBackdropFilter: `blur(${p.blur})`,
          borderRadius: "500px 500px 0 0",
          opacity: p.opacity,
          zIndex: p.zIndex,
          animationDelay: p.delay,
        }} />
      ))}

      {/* Vignette Shadow for Depth */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at center, transparent 45%, rgba(255,255,255,0.4) 100%)",
        pointerEvents: "none"
      }} />

      <style jsx global>{`
        .pillar-luminous {
          animation: pillar-flash 8s infinite alternate ease-in-out;
          will-change: opacity, transform;
        }
        @keyframes pillar-flash {
          0% { transform: scaleY(0.98); opacity: 0.1; filter: brightness(0.9) saturate(0.8); }
          50% { opacity: 0.4; filter: brightness(1.3) saturate(1.2); }
          100% { transform: scaleY(1.02); opacity: 0.1; filter: brightness(0.9) saturate(0.8); }
        }
      `}</style>
    </div>
  );
}

/**
 * Capsule Sort Component: [ Key | Arrow ]
 */
function CapsuleSort({ 
  sortKey, 
  onKeyClick, 
  sortDir, 
  onDirClick 
}: { 
  sortKey: string; 
  onKeyClick: () => void;
  sortDir: "asc" | "desc";
  onDirClick: () => void;
}) {
  const [hovKey, setHovKey] = React.useState(false);
  const [hovDir, setHovDir] = React.useState(false);

  return (
    <div style={{ 
      display: "inline-flex", alignItems: "center", 
      background: "rgba(0,0,0,0.03)", borderRadius: 30, 
      border: "1px solid rgba(0,0,0,0.06)",
      padding: 4, gap: 2, height: 36,
    }}>
      <button
        onClick={onKeyClick}
        onMouseEnter={() => setHovKey(true)}
        onMouseLeave={() => setHovKey(false)}
        style={{
          padding: "0 16px", borderRadius: 26, border: "none",
          background: hovKey ? "#fff" : "transparent",
          color: "#2D241E", fontSize: 11, fontWeight: 800, fontFamily: "var(--font-body)",
          cursor: "pointer", transition: "all 0.4s ease",
          boxShadow: hovKey ? "0 4px 12px rgba(0,0,0,0.04)" : "none",
          height: "100%", whiteSpace: "nowrap"
        }}>
        {sortKey.toUpperCase()}
      </button>
      <div style={{ width: 1, height: 16, background: "rgba(0,0,0,0.08)" }} />
      <button
        onClick={onDirClick}
        onMouseEnter={() => setHovDir(true)}
        onMouseLeave={() => setHovDir(false)}
        style={{
          width: 28, height: 28, borderRadius: "50%", border: "none",
          background: hovDir ? "#fff" : "transparent",
          color: "#2D241E", fontSize: 12, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.4s ease",
          transform: sortDir === "asc" ? "rotate(180deg)" : "rotate(0deg)",
          boxShadow: hovDir ? "0 4px 12px rgba(0,0,0,0.04)" : "none",
        }}>
        ↓
      </button>
    </div>
  );
}

/**
 * Expandable Floating App Bar
 */
function ExpandableAppBar({
  search, setSearch,
  category, setCategory,
  type, setType,
  topic, setTopic,
  topicsList,
  viewMode, setViewMode,
  sortKey, cycleSortKey,
  sortDir, toggleSortDir,
}: {
  search: string; setSearch: (s: string) => void;
  category: Category | "all"; setCategory: (c: Category | "all") => void;
  type: ArticleType | "all"; setType: (t: ArticleType | "all") => void;
  topic: string | "all"; setTopic: (t: string | "all") => void;
  topicsList: string[];
  viewMode: ViewMode; setViewMode: (v: ViewMode) => void;
  sortKey: string; cycleSortKey: () => void;
  sortDir: "asc" | "desc"; toggleSortDir: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      style={{
        position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 1000, width: "min(95vw, 1000px)",
        pointerEvents: "auto",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(true)}
    >
      <div style={{
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(60px) saturate(200%)",
        WebkitBackdropFilter: "blur(60px) saturate(200%)",
        borderRadius: 40, border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: isExpanded ? "0 50px 100px rgba(0,0,0,0.15), 0 15px 40px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,1)" : "0 20px 40px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04), inset 0 1px 1px rgba(255,255,255,1)",
        padding: "10px 24px", display: "flex", flexDirection: "column",
        transition: "box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
      }}>
        {/* White noise layer for glassy feel */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0.25, pointerEvents: "none", zIndex: 0, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        {/* Top Row: App Bar Default View */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0, height: 36, position: "relative", zIndex: 2 }}>
          <div style={{ 
            width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", 
            background: "rgba(0,0,0,0.03)", color: "#2D241E", fontSize: 16, cursor: "pointer", transition: "all 0.3s ease" 
          }} onClick={(e) => { e.stopPropagation(); window.scrollTo({ top: 0, behavior: "smooth" }); }} title="Home" className="nav-icon">⌂</div>
          
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isExpanded ? "#D2691E" : "rgba(0,0,0,0.4)", cursor: "pointer",
            transition: "all 0.3s ease",
          }} className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </div>

          <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.08)" }} />
          
          <div style={{ flex: 1, position: "relative" }}>
            <input type="text" placeholder="Search Sanctuary..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", padding: "8px 0", border: "none", background: "transparent", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "#111", outline: "none" }} />
          </div>
          
          <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.08)" }} />
          
          {/* View Mode Toggle */}
          <button 
            onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === "pillar" ? "horizontal" : "pillar"); }}
            title="Toggle View Mode"
            style={{
              padding: "0 12px", height: 36, borderRadius: 20, border: "none", background: "transparent",
              color: "#2D241E", fontSize: 11, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {viewMode === "pillar" ? "PILLAR" : "LIST"}
          </button>
          
          <CapsuleSort sortKey={sortKey} onKeyClick={cycleSortKey} sortDir={sortDir} onDirClick={toggleSortDir} />
        </div>

        {/* Expanded Filters Section (Grid Transition Wrapper) */}
        <div style={{
          display: "grid",
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          transition: "grid-template-rows 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          width: "100%",
        }}>
          <div style={{ 
            overflow: "hidden", 
            opacity: isExpanded ? 1 : 0, 
            transition: "opacity 0.4s ease",
            transitionDelay: isExpanded ? "0.15s" : "0s",
          }}>
            <div style={{
              display: "flex", flexDirection: "column", gap: 24, position: "relative", zIndex: 2,
              paddingTop: 28, paddingBottom: 24, borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: 16,
            }}>
          {/* Categories Grid (1st) */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(0,0,0,0.4)", width: 80, flexShrink: 0, textTransform: "uppercase" }}>Category</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button onClick={(e) => { e.stopPropagation(); setCategory("all"); }} style={{ fontSize: 13, fontWeight: 500, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", background: category === "all" ? "#D2691E" : "rgba(255,255,255,0.6)", color: category === "all" ? "#fff" : "#222", transition: "all 0.2s", boxShadow: category === "all" ? "0 4px 12px rgba(210,105,30,0.3)" : "0 2px 4px rgba(0,0,0,0.02)" }}>All</button>
              {(Object.keys(CATEGORY_META) as Category[]).map(cat => (
                <button key={cat} onClick={(e) => { e.stopPropagation(); setCategory(cat); }} style={{ fontSize: 13, fontWeight: 500, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", background: category === cat ? "#D2691E" : "rgba(255,255,255,0.6)", color: category === cat ? "#fff" : "#222", transition: "all 0.2s", boxShadow: category === cat ? "0 4px 12px rgba(210,105,30,0.3)" : "0 2px 4px rgba(0,0,0,0.02)" }}>{CATEGORY_META[cat].label}</button>
              ))}
            </div>
          </div>

          {/* Topics Grid (2nd) */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
             <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(0,0,0,0.4)", width: 80, flexShrink: 0, marginTop: 4, textTransform: "uppercase" }}>Topics</span>
             <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 180, overflowY: "auto", paddingRight: 8 }}>
               <button onClick={(e) => { e.stopPropagation(); setTopic("all"); }} style={{ fontSize: 13, fontWeight: 500, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", background: topic === "all" ? "#2D5A27" : "rgba(255,255,255,0.6)", color: topic === "all" ? "#fff" : "#222", transition: "all 0.2s", boxShadow: topic === "all" ? "0 4px 12px rgba(45,90,39,0.3)" : "0 2px 4px rgba(0,0,0,0.02)" }}>All</button>
               {topicsList.map(t => (
                 <button key={t} onClick={(e) => { e.stopPropagation(); setTopic(t); }} style={{ fontSize: 13, fontWeight: 500, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", background: topic === t ? "#2D5A27" : "rgba(255,255,255,0.6)", color: topic === t ? "#fff" : "#222", transition: "all 0.2s", boxShadow: topic === t ? "0 4px 12px rgba(45,90,39,0.3)" : "0 2px 4px rgba(0,0,0,0.02)" }}>{t}</button>
               ))}
             </div>
          </div>

          {/* Types Grid (3rd) */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(0,0,0,0.4)", width: 80, flexShrink: 0, textTransform: "uppercase" }}>Type</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button onClick={(e) => { e.stopPropagation(); setType("all"); }} style={{ fontSize: 13, fontWeight: 500, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", background: type === "all" ? "#CD5C5C" : "rgba(255,255,255,0.6)", color: type === "all" ? "#fff" : "#222", transition: "all 0.2s", boxShadow: type === "all" ? "0 4px 12px rgba(205,92,92,0.3)" : "0 2px 4px rgba(0,0,0,0.02)" }}>All</button>
              {(Object.keys(TYPE_META) as ArticleType[]).map(t => (
                <button key={t} onClick={(e) => { e.stopPropagation(); setType(t); }} style={{ fontSize: 13, fontWeight: 500, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", background: type === t ? "#CD5C5C" : "rgba(255,255,255,0.6)", color: type === t ? "#fff" : "#222", transition: "all 0.2s", boxShadow: type === t ? "0 4px 12px rgba(205,92,92,0.3)" : "0 2px 4px rgba(0,0,0,0.02)" }}>{TYPE_META[t].label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

/**
 * Hub Info Section (Hero with Scroll Opacity)
 */
function HubInfoSection({ opacity }: { opacity: number }) {
  return (
    <section style={{
      position: "relative",
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "160px clamp(20px, 8vw, 100px) 140px",
      textAlign: "center",
      opacity: opacity,
      transition: "opacity 0.2s linear",
      pointerEvents: opacity < 0.1 ? "none" : "auto",
    }}>
      <div style={{ maxWidth: 1000, position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.25em", color: "#2D241E", opacity: 0.6, marginBottom: 32 }}>
          Personal Project / AI Collaboration <div style={{ width: 40, height: 1, background: "#2D241E", opacity: 0.2 }} />
        </div>
        
        <h1 style={{ 
          fontFamily: "var(--font-display)", fontSize: "clamp(32px, 7vw, 76px)", 
          fontWeight: 900, lineHeight: 0.95, color: "#2D241E", letterSpacing: "-0.04em", marginBottom: 40 
        }}>
          Magazine Style <br /> Interactive Mini Books
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center", maxWidth: 840, margin: "0 auto" }}>
          <div style={{ borderBottom: "1px solid rgba(45,36,30,0.06)", paddingBottom: 40, width: "100%" }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: "rgba(0,0,0,0.3)", textTransform: "uppercase", letterSpacing: "0.2em", display: "block", marginBottom: 16 }}>The Vision</span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.8vw, 20px)", lineHeight: 1.6, color: "#111", fontWeight: 500, letterSpacing: "-0.01em" }}>
              I'm really into the whole <b>"learning at ease"</b> thing. That’s why I started this—it’s just a chill spot where I share research reports that come from a back-and-forth between my own thoughts and different AI outputs.
            </p>
          </div>

          <div style={{ paddingTop: 8, width: "100%" }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: "rgba(0,0,0,0.3)", textTransform: "uppercase", letterSpacing: "0.2em", display: "block", marginBottom: 20 }}>The Archive</span>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px 40px", textAlign: "center" }}>
              {["Interactive books", "Magazine style books", "Useful tools", "Research reports"].map(t => (
                <div key={t} style={{ fontSize: 14, fontWeight: 700, color: "#2D241E" }}>~ {t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Library Page ───────────────────────────────────── */

export default function Home() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [type, setType] = useState<ArticleType | "all">("all");
  const [topic, setTopic] = useState<string | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("pillar");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"time" | "name" | "tags" | "type" | "category">("time");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [scrollY, setScrollY] = useState(0);

  const topicsList = useMemo(() => {
    const subs = new Set<string>();
    ARTICLES.forEach(a => {
      if (category === "all" || a.category === category) {
        if (a.subcategory) subs.add(a.subcategory);
      }
    });
    return Array.from(subs).sort();
  }, [category]);

  useEffect(() => {
    if (topic !== "all" && !topicsList.includes(topic)) {
      setTopic("all");
    }
  }, [topicsList, topic]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 600);

  const filteredArticles = useMemo(() => {
    let pool = [...ARTICLES];
    if (category !== "all") pool = pool.filter(a => a.category === category);
    if (type !== "all") pool = pool.filter(a => a.type === type);
    if (topic !== "all") pool = pool.filter(a => a.subcategory === topic);
    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    pool.sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case "name": comparison = a.title.localeCompare(b.title); break;
        case "time": comparison = (parseInt(a.readingTime) || 0) - (parseInt(b.readingTime) || 0); break;
        case "type": comparison = a.type.localeCompare(b.type); break;
        case "category": comparison = a.category.localeCompare(b.category); break;
        case "tags": comparison = a.tags.length - b.tags.length; break;
      }
      return sortDir === "asc" ? comparison : -comparison;
    });
    return pool;
  }, [category, type, search, sortKey, sortDir]);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      
      {/* Luminous Perspective Pillars Backdrop */}
      <FixedSanctuaryBackground />

      {/* Sanctuary Floating Nav */}
      <ExpandableAppBar 
        search={search} setSearch={setSearch} 
        category={category} setCategory={setCategory} 
        type={type} setType={setType}
        topic={topic} setTopic={setTopic}
        topicsList={topicsList}
        viewMode={viewMode} setViewMode={setViewMode}
        sortKey={sortKey} cycleSortKey={() => {
          const keys = ["time", "name", "tags", "type", "category"] as const;
          const idx = keys.indexOf(sortKey as any);
          setSortKey(keys[(idx + 1) % keys.length]);
        }}
        sortDir={sortDir} toggleSortDir={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        
        {/* Hub Narrative (Fades on Scroll) */}
        <HubInfoSection opacity={heroOpacity} />

        {/* Article Grid Layer */}
        <div style={{ 
          maxWidth: 1600, margin: "0 auto", 
          padding: "0 clamp(20px, 5vw, 84px) 140px",
          position: "relative",
          zIndex: 3,
        }}>
          
          <div style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "flex-end", 
            marginBottom: 60, borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 24 
          }}>
            <div style={{ 
              fontSize: 13, fontWeight: 900, color: "rgba(0,0,0,0.2)", 
              letterSpacing: "0.2em", textTransform: "uppercase" 
            }}>The Sanctuary Archive</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.4)" }}>
               Found {filteredArticles.length} Learning modules
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: viewMode === "pillar" ? "repeat(auto-fill, minmax(360px, 1fr))" : "1fr",
            gap: viewMode === "pillar" ? 64 : 32,
          }}>
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} viewMode={viewMode} />
            ))}
          </div>
        </div>
      </div>

      <footer style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: "120px clamp(20px, 10vw, 100px) 160px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        position: "relative", zIndex: 10
      }}>
        <div style={{ maxWidth: 450 }}>
          <div style={{ 
            fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, 
            color: "#2D241E", letterSpacing: "-0.04em", marginBottom: 20 
          }}>
            Zen Sanctuary
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(0,0,0,0.5)", lineHeight: 1.7, fontWeight: 450 }}>
            A space dedicated to learning at ease. A personal project by Prabhu4DX + AI agents.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.2)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            2026 / Architecture v5.9
          </span>
        </div>
      </footer>
    </div>
  );
}
