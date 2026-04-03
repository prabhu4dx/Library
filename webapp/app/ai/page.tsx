"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ARTICLES, CATEGORY_META } from "@/lib/registry";
import ArticleCard, { ViewMode } from "@/components/ArticleCard";

export default function AiPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("pillar");
  const articles = ARTICLES.filter((a) => a.category === "ai");

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* Header */}
      <div
        style={{
          padding: "120px clamp(20px, 5vw, 48px) 64px",
          borderBottom: "1px solid var(--border)",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <nav
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            fontSize: 12,
            color: "var(--text-3)",
            fontFamily: "var(--font-body)",
            marginBottom: 28,
          }}
        >
          <Link href="/" style={{ color: "var(--text-3)" }}>
            Library
          </Link>
          <span>›</span>
          <span style={{ color: "var(--text-1)", fontWeight: 500 }}>AI</span>
        </nav>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 6vw, 72px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-1)",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          Artificial Intelligence
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "var(--text-2)",
            fontFamily: "var(--font-body)",
            maxWidth: 600,
            fontWeight: 450,
          }}
        >
          {CATEGORY_META.ai.description}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 48 }}>
           <div style={{ display: "flex", background: "white", padding: 4, borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", gap: 4 }}>
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
           <div style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600 }}>
             {articles.length} Digital Pillars
           </div>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "64px clamp(20px, 5vw, 48px) 120px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: viewMode === "pillar" ? "repeat(auto-fill, minmax(360px, 1fr))" : "1fr",
          gap: viewMode === "pillar" ? 40 : 20,
        }}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} viewMode={viewMode} />
          ))}
        </div>
      </div>

      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "48px clamp(20px, 5vw, 48px) 80px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24,
            fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.03em", marginBottom: 12 }}>
            Library / AI
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13.5,
            color: "var(--text-2)", lineHeight: 1.6 }}>
            Refined research and analysis in the intersection of intelligence and design. 
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <Link href="/" style={{ color: "var(--text-1)", fontWeight: 700, textDecoration: "none" }}>← Back to Index</Link>
        </div>
      </footer>
    </div>
  );
}
