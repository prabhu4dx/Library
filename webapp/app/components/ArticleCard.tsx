"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Article } from "../lib/registry";

export type ViewMode = "pillar" | "horizontal";

function CoverPattern({ pattern, accent, accentLight }: { 
  pattern: string; 
  accent: string; 
  accentLight: string;
}) {
  switch (pattern) {
    case "circuit":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke={accent} strokeWidth="0.1" strokeOpacity="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          <circle cx="20" cy="20" r="1" fill={accent} opacity="0.3" />
          <circle cx="80" cy="80" r="1.5" fill={accent} opacity="0.4" />
          <path d="M 20 20 L 40 20 L 40 40" stroke={accent} strokeWidth="0.5" fill="none" opacity="0.2" />
          <path d="M 80 80 L 60 80 L 60 60" stroke={accent} strokeWidth="0.5" fill="none" opacity="0.2" />
        </svg>
      );
    case "waves":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 20 Q 25 40 50 20 T 100 20" stroke={accent} fill="none" strokeWidth="0.8" opacity="0.15" />
          <path d="M0 50 Q 25 70 50 50 T 100 50" stroke={accent} fill="none" strokeWidth="0.8" opacity="0.1" />
          <path d="M0 80 Q 25 100 50 80 T 100 80" stroke={accent} fill="none" strokeWidth="0.8" opacity="0.15" />
        </svg>
      );
    default:
      return (
        <div style={{ 
          width: "100%", height: "100%", 
          background: `linear-gradient(135deg, ${accentLight} 0%, transparent 100%)`,
          opacity: 0.3 
        }} />
      );
  }
}

export default function ArticleCard({ article, viewMode }: {
  article: Article;
  viewMode: ViewMode;
}) {
  const [hovered, setHovered] = useState(false);

  if (viewMode === "horizontal") {
    return (
      <Link href={article.path}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: hovered 
            ? `0 40px 80px ${article.accentLight}60, 0 8px 32px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.8)` 
            : "0 16px 40px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.4)",
          transform: hovered ? "translateY(-12px) scale(1.01)" : "translateY(0) scale(1)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          border: "1px solid rgba(0,0,0,0.04)",
          cursor: "pointer",
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: 240,
          padding: "0 48px",
        }}>
        
        {/* Animated Wavy Mesh Gradient */}
        <div style={{
          position: "absolute",
          inset: -150,
          zIndex: 0,
          opacity: 0.9,
          background: `
            radial-gradient(circle at 10% 20%, ${article.accentLight} 0%, transparent 40%),
            radial-gradient(circle at 90% 10%, ${article.accent}30 0%, transparent 40%),
            radial-gradient(circle at 30% 90%, ${article.accentLight}20 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${article.accent} 0%, transparent 40%),
            #fff
          `,
          filter: "blur(100px)",
          animation: "wave-mesh 25s infinite alternate ease-in-out",
        }} />

        {/* Organic Metallic Glass Surface Texture (Noise) */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: hovered ? 0.35 : 0.2, transition: "opacity 0.8s ease", pointerEvents: "none", zIndex: 1, mixBlendMode: "overlay" }}>
          <filter id={`h-surface-noise-${article.id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#h-surface-noise-${article.id})`} />
        </svg>

        {/* Glossy Sheen Overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: hovered 
            ? "linear-gradient(105deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.2) 60%, transparent 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
          transition: "all 1s ease",
          opacity: 0.6,
          pointerEvents: "none",
        }} />

        {/* Content Container */}
        <div style={{ position: "relative", zIndex: 3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "6px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.9)", color: article.accent,
              fontFamily: "var(--font-body)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}>
              {article.subcategory}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {article.visualTags.slice(0, 2).map((t) => (
                <div key={t} style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                  padding: "4px 12px", borderRadius: 8,
                  background: "rgba(255,255,255,0.3)", color: "var(--text-1)",
                  fontFamily: "var(--font-body)",
                }}>{t}</div>
              ))}
            </div>
          </div>
          
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 30, fontWeight: 900, lineHeight: 1.05,
            color: "var(--text-1)", marginBottom: 12, letterSpacing: "-0.04em",
          }}>
            {article.title}
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 15, lineHeight: 1.7, color: "var(--text-2)",
            display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical",
            overflow: "hidden", maxWidth: 900, fontWeight: 450,
          }}>
            {article.description}
          </p>

          <footer style={{ 
            marginTop: 20, display: "flex", alignItems: "center", gap: 16,
            fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-body)", fontWeight: 600
          }}>
            <span>{article.date.split(",")[1] || article.date}</span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", opacity: 0.3 }} />
            <span>{article.readingTime} read</span>
            <div style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: article.accent }}>READ ARTICLE →</div>
          </footer>
        </div>
      </Link>
    );
  }

  // Default Pillar (Vertical - Full View)
  return (
    <Link href={article.path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: hovered 
          ? `0 40px 80px ${article.accentLight}60, 0 8px 32px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.8)` 
          : "0 16px 40px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.4)",
        transform: hovered ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        border: "1px solid rgba(0,0,0,0.04)",
        cursor: "pointer",
        textDecoration: "none",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "48px",
        minHeight: 680,
      }}>
      
      {/* Animated Wavy Mesh Gradient */}
      <div style={{
        position: "absolute",
        inset: -150,
        zIndex: 0,
        opacity: 0.9,
        background: `
          radial-gradient(circle at 10% 20%, ${article.accentLight} 0%, transparent 40%),
          radial-gradient(circle at 90% 10%, ${article.accent}30 0%, transparent 40%),
          radial-gradient(circle at 30% 90%, ${article.accentLight}20 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${article.accent} 0%, transparent 40%),
          #fff
        `,
        filter: "blur(100px)",
        animation: "wave-mesh 25s infinite alternate ease-in-out",
      }} />

      {/* Organic Metallic Glass Surface Texture (Noise) */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: hovered ? 0.35 : 0.2, transition: "opacity 0.8s ease", pointerEvents: "none", zIndex: 1, mixBlendMode: "overlay" }}>
        <filter id={`surface-noise-${article.id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#surface-noise-${article.id})`} />
      </svg>

      {/* Glossy Sheen Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        background: hovered 
          ? "linear-gradient(105deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.2) 60%, transparent 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
        transition: "all 1s ease",
        opacity: 0.6,
        pointerEvents: "none",
      }} />

      {/* Content Container */}
      <div style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* Editorial Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "auto" }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "6px 14px", borderRadius: 10,
            background: "rgba(255,255,255,0.9)", color: article.accent,
            fontFamily: "var(--font-body)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}>
            {article.subcategory}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "60%" }}>
            {article.visualTags.slice(0, 2).map((t) => (
              <div key={t} style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                padding: "4px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.3)", color: "var(--text-1)",
                fontFamily: "var(--font-body)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Dynamic Pillar Text Body */}
        <div style={{ marginTop: 100 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 34, fontWeight: 900, lineHeight: 1.05,
            color: "var(--text-1)", marginBottom: 20, letterSpacing: "-0.04em",
          }}>
            {article.title}
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 15, lineHeight: 1.8, color: "var(--text-2)",
            marginBottom: 40,
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontWeight: 450,
          }}>
            {article.description}
          </p>

          <footer style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.08)",
          }}>
            <div style={{
              fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-body)", fontWeight: 600
            }}>
              {article.date.split(",")[1] || article.date} · {article.readingTime}
            </div>
            <div style={{
              fontSize: 11, fontWeight: 800, color: "white",
              fontFamily: "var(--font-body)",
              background: article.accent,
              padding: "6px 14px",
              borderRadius: 20,
              opacity: hovered ? 1 : 0.8,
              transform: hovered ? "translateY(0)" : "translateY(2px)",
              transition: "all 0.3s ease",
              boxShadow: hovered ? `0 4px 12px ${article.accent}40` : "none",
            }}>
              READ
            </div>
          </footer>
        </div>
      </div>
    </Link>
  );
}
