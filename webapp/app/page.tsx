"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ARTICLES, Article, Category } from "./lib/registry";
import ArticleCard, { ViewMode } from "./components/ArticleCard";

/* ── Components ─────────────────────────────────────────── */

/**
 * Editorial Hero Section
 */
function Hero({ article }: { article: Article }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      position: "relative",
      padding: "140px clamp(20px, 5vw, 84px) 120px",
      borderBottom: "1px solid var(--border)",
      display: "grid",
      gridTemplateColumns: "1fr min(500px, 45%)",
      gap: 80,
      alignItems: "center",
      overflow: "hidden",
    }}>
      {/* Immersive mesh background for Hero */}
      <div style={{
        position: "absolute",
        inset: -250,
        zIndex: 0,
        background: `
          radial-gradient(circle at 80% 15%, ${article.accentLight} 0%, transparent 45%),
          radial-gradient(circle at 15% 85%, ${article.accent}25 0%, transparent 55%),
          radial-gradient(circle at 45% 45%, rgba(255,255,255,0.9) 0%, transparent 65%),
          #fff
        `,
        filter: "blur(120px)",
        animation: "wave-mesh 40s infinite alternate-reverse ease-in-out",
      }} />

      {/* Grid Pattern overlay for Hero */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        opacity: 0.12,
        backgroundImage: `radial-gradient(${article.accent} 1.2px, transparent 1.2px)`,
        backgroundSize: "32px 32px",
      }} />

      {/* Organic Surface Texture (Noise) for Hero */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none", zIndex: 1, mixBlendMode: "overlay" }}>
        <filter id="hero-surface-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-surface-noise)" />
      </svg>

      {/* Vertical 'Library Marker' for Hero */}
      <div style={{
        position: "absolute",
        left: "5vw",
        top: "10%",
        bottom: "10%",
        width: 1,
        background: `linear-gradient(to bottom, transparent, ${article.accent}40, transparent)`,
        zIndex: 1,
      }} />

      {/* Left: Enhanced Pillar-style content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: article.accent,
          marginBottom: 20
        }}>
          Featured Article
          <div style={{ width: 40, height: 1, background: article.accent, opacity: 0.3 }} />
        </div>
        
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 6vw, 72px)",
          fontWeight: 900, lineHeight: 0.95, color: "var(--text-1)",
          letterSpacing: "-0.04em", marginBottom: 28,
        }}>
          {article.title}
        </h1>
        
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 18, lineHeight: 1.6, color: "var(--text-2)",
          marginBottom: 40, maxWidth: 600, fontWeight: 450,
        }}>
          {article.description}
        </p>

        <Link href={article.path}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "16px 36px", borderRadius: 14,
            background: hov ? article.accent : "#111111",
            color: "#fff",
            fontSize: 15, fontWeight: 700, fontFamily: "var(--font-body)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: hov ? "translateY(-4px)" : "translateY(0)",
            boxShadow: hov ? `0 20px 40px ${article.accent}60` : "0 4px 12px rgba(0,0,0,0.1)",
          }}>
          <span style={{ position: "relative", zIndex: 1 }}>Explore Chapter</span>
          <span style={{ position: "relative", zIndex: 1, fontSize: 18, transition: "transform 0.3s ease",
            transform: hov ? "translateX(6px)" : "translateX(0)" }}>→</span>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            transform: hov ? "translateX(100%)" : "translateX(-100%)",
            transition: hov ? "transform 0.8s ease" : "none",
          }} />
        </Link>
      </div>

      {/* Right: Decorative Visual */}
      <div style={{ position: "relative", zIndex: 2, aspectRatio: "1/1" }}>
        <div style={{
          position: "absolute", inset: 0, 
          borderRadius: 40, 
          background: article.accentLight,
          boxShadow: `0 40px 100px ${article.accentLight}60`,
          overflow: "hidden"
        }}>
          <div style={{ padding: 40, height: "100%", width: "100%", opacity: 0.1, background: `linear-gradient(135deg, ${article.accent}, transparent)` }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Filter Pill Component
 */
function FilterPill({ label, active, onClick, count }: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  count: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "8px 20px",
        borderRadius: 20,
        background: active ? "#111" : hov ? "rgba(0,0,0,0.05)" : "white",
        color: active ? "#fff" : "#666",
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        fontFamily: "var(--font-body)",
        border: active ? "1px solid #111" : "1px solid rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
      {label}
      <span style={{ 
        opacity: 0.5, 
        fontSize: 11, 
        fontWeight: active ? 700 : 600,
        color: active ? "#fff" : "inherit"
      }}>
        {count}
      </span>
    </button>
  );
}

/* ── Main Library Page ───────────────────────────────────── */

export default function Home() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("pillar");

  const sortedArticles = useMemo(() => {
    return [...ARTICLES];
  }, []);

  const featured = sortedArticles[0];

  const gridArticles = useMemo(() => {
    const pool = sortedArticles.slice(1);
    if (filter === "all") return pool;
    return pool.filter((a) => a.category === filter);
  }, [filter, sortedArticles]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* Immersive Featured Section */}
      {featured && <Hero article={featured} />}

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "80px clamp(20px, 5vw, 48px)" }}>
        
        {/* Navigation / Filters / View Switcher */}
        <div style={{ 
          display: "flex", justifyContent: "space-between", alignItems: "center", 
          marginBottom: 64, gap: 24, flexWrap: "wrap" 
        }}>
          <div style={{ display: "flex", gap: 12 }}>
            <FilterPill label="All Library" 
              active={filter === "all"} 
              onClick={() => setFilter("all")} 
              count={ARTICLES.length - 1} />
            <FilterPill label="Artificial Intelligence" 
              active={filter === "ai"} 
              onClick={() => setFilter("ai")} 
              count={ARTICLES.filter(a => a.category === "ai").length} />
            <FilterPill label="UI/UX & Design" 
              active={filter === "uiux"} 
              onClick={() => setFilter("uiux")} 
              count={ARTICLES.filter(a => a.category === "uiux").length} />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
             {/* View Mode Toggle */}
             <div style={{ 
               display: "flex", background: "white", padding: 4, borderRadius: 12, 
               border: "1px solid rgba(0,0,0,0.08)", gap: 4 
             }}>
               <button 
                onClick={() => setViewMode("pillar")}
                style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: viewMode === "pillar" ? "#111" : "transparent",
                  color: viewMode === "pillar" ? "#fff" : "#666",
                  border: "none", cursor: "pointer", transition: "all 0.2s ease",
                }}>Pillar</button>
               <button 
                onClick={() => setViewMode("horizontal")}
                style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: viewMode === "horizontal" ? "#111" : "transparent",
                  color: viewMode === "horizontal" ? "#fff" : "#666",
                  border: "none", cursor: "pointer", transition: "all 0.2s ease",
                }}>Bar</button>
             </div>

            <div style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500, fontFamily: "var(--font-body)" }}>
              Showing {gridArticles.length} {viewMode}s
            </div>
          </div>
        </div>

        {/* Content Grid (Adaptive) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: viewMode === "pillar" 
            ? "repeat(auto-fill, minmax(360px, 1fr))" 
            : "1fr",
          gap: viewMode === "pillar" ? 40 : 20,
        }}>
          {gridArticles.map((article) => (
            <ArticleCard key={article.id} article={article} viewMode={viewMode} />
          ))}
        </div>

        {gridArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0",
            color: "var(--text-3)", fontFamily: "var(--font-body)", fontSize: 15 }}>
            No content in this category yet.
          </div>
        )}
      </div>

      {/* Global Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "48px clamp(20px, 5vw, 48px) 80px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24,
            fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.03em", marginBottom: 12 }}>
            Library
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13.5,
            color: "var(--text-2)", lineHeight: 1.6 }}>
            A meticulously curated digital library exploring the frontiers of artificial intelligence, 
            interactive design, and data visualization. 
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12,
            fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Version 2.0 / 2026 Edition
          </span>
        </div>
      </footer>
    </div>
  );
}
