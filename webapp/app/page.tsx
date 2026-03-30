"use client";
import { useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { ARTICLES, CATEGORY_META, type Article, type Category } from "@/app/lib/registry";

/* ── Cover Pattern (CSS only, no SVG hydration) ─────────── */
function CoverPattern({ pattern, accent, accentLight }: {
  pattern: Article["coverPattern"];
  accent: string;
  accentLight: string;
}) {
  const shared: React.CSSProperties = {
    position: "absolute", borderRadius: "50%",
    border: `1px solid ${accent}`,
  };

  if (pattern === "circles") {
    return (
      <div style={{ position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 65% 55%, ${accentLight} 0%, ${accent}08 100%)` }}>
        {[180,134,90,56,28].map((d, i) => (
          <div key={i} style={{ ...shared, width: d, height: d,
            opacity: 0.08 + i * 0.07,
            top: "50%", left: "60%",
            transform: "translate(-50%, -50%)" }} />
        ))}
        <div style={{ position: "absolute", width: 12, height: 12,
          borderRadius: "50%", background: accent, opacity: 0.65,
          top: "50%", left: "60%", transform: "translate(-50%, -50%)" }} />
        {/* Axis cross lines */}
        <div style={{ position: "absolute", width: 1, height: "70%",
          background: accent, opacity: 0.07,
          top: "15%", left: "60%", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", height: 1, width: "70%",
          background: accent, opacity: 0.07,
          top: "50%", left: "15%", transform: "translateY(-50%)" }} />
      </div>
    );
  }

  if (pattern === "terminal") {
    const dots = [
      [20,18],[52,18],[84,18],[116,18],[148,18],[180,18],
      [20,42],[52,42],[84,42],[116,42],[148,42],[180,42],
      [20,66],[52,66],[84,66],[116,66],[148,66],[180,66],
    ];
    return (
      <div style={{ position: "absolute", inset: 0,
        background: `linear-gradient(120deg, ${accentLight} 0%, ${accent}18 100%)` }}>
        {dots.map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: `calc(10% + ${x}px)`,
            top: `calc(18% + ${y}px)`, width: 4, height: 4, borderRadius: "50%",
            background: accent, opacity: [0,3,6,9,12,15].includes(i) ? 0.55 : 0.18 }} />
        ))}
        {/* Code-line bars */}
        {[["14%","78%","54%"],["14%","86%","38%"],["14%","94%","68%"]].map(([top, left, w], i) => (
          <div key={i} style={{ position: "absolute", top, left,
            width: w, height: 6, borderRadius: 3,
            background: accent, opacity: 0.15 + i * 0.06 }} />
        ))}
      </div>
    );
  }

  if (pattern === "nodes") {
    const pts = [[75,90],[160,55],[230,100],[200,165],[110,170],[45,135]];
    const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,4]];
    return (
      <div style={{ position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${accentLight} 0%, ${accent}14 100%)` }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 300 240" preserveAspectRatio="xMidYMid meet">
          {edges.map(([a, b], i) => (
            <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
              stroke={accent} strokeWidth="1" strokeOpacity="0.2" />
          ))}
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 0 ? 8 : 5}
              fill={accent} fillOpacity={i === 0 ? 0.6 : 0.25} />
          ))}
        </svg>
      </div>
    );
  }

  if (pattern === "dims") {
    const bars = [
      { w: "72%", x: "8%", opacity: 0.25, dot: "72%" },
      { w: "48%", x: "8%", opacity: 0.18, dot: "48%" },
      { w: "88%", x: "8%", opacity: 0.22, dot: "88%" },
      { w: "36%", x: "8%", opacity: 0.15, dot: "36%" },
      { w: "60%", x: "8%", opacity: 0.20, dot: "60%" },
      { w: "80%", x: "8%", opacity: 0.28, dot: "80%" },
    ];
    return (
      <div style={{ position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${accentLight} 0%, ${accent}18 100%)` }}>
        {bars.map((b, i) => (
          <div key={i} style={{ position: "absolute", top: `${18 + i * 13}%`,
            left: b.x, right: "8%", height: 5, borderRadius: 3,
            background: `var(--paper-warm)`, opacity: 0.6 }}>
            <div style={{ width: b.w, height: "100%", borderRadius: 3,
              background: accent, opacity: b.opacity / 0.6 }} />
            <div style={{ position: "absolute", left: b.dot, top: "50%",
              width: 9, height: 9, borderRadius: "50%",
              background: accent, opacity: 0.7,
              transform: "translate(-50%, -50%)" }} />
          </div>
        ))}
      </div>
    );
  }

  if (pattern === "flow") {
    return (
      <div style={{ position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${accentLight} 0%, ${accent}18 100%)` }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 300 220" preserveAspectRatio="xMidYMid meet">
          <path d="M 20 110 C 80 40, 140 180, 200 80 S 280 40, 300 110"
            stroke={accent} strokeWidth="2" strokeOpacity="0.2" fill="none" />
          <path d="M 20 140 C 60 80, 130 200, 200 110 S 280 70, 300 130"
            stroke={accent} strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
          <path d="M 20 80 C 90 20, 160 160, 230 60 S 290 20, 300 80"
            stroke={accent} strokeWidth="1" strokeOpacity="0.12" fill="none" />
          {[[20,110],[100,70],[180,130],[260,90]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 1 || i === 3 ? 5 : 3.5}
              fill={accent} fillOpacity={0.35 + i * 0.05} />
          ))}
        </svg>
      </div>
    );
  }

  return <div style={{ position: "absolute", inset: 0, background: accentLight }} />;
}

/* ── Article Card ────────────────────────────────────────── */
function ArticleCard({ article, hovered, onHover }: {
  article: Article;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  return (
    <Link href={article.path}
      onMouseEnter={() => onHover(article.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        display: "block",
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.28s var(--ease-spring), box-shadow 0.28s ease",
        border: "1px solid var(--border)",
        cursor: "pointer",
        textDecoration: "none",
      }}>
      {/* Cover */}
      <div style={{ position: "relative", height: 220, overflow: "hidden",
        background: article.accentLight }}>
        <CoverPattern pattern={article.coverPattern} accent={article.accent}
          accentLight={article.accentLight} />
        {/* Bottom badges */}
        <div style={{ position: "absolute", bottom: 14, left: 14, right: 14,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", padding: "4px 10px", borderRadius: 6,
            background: "rgba(255,255,255,0.88)", color: article.accent,
            fontFamily: "var(--font-body)",
          }}>
            {article.subcategory}
          </span>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {article.visualTags.slice(0, 2).map((t) => (
              <span key={t} style={{
                fontSize: 9, fontWeight: 600, letterSpacing: "0.05em",
                padding: "3px 8px", borderRadius: 4,
                background: "rgba(255,255,255,0.75)", color: "var(--text-2)",
                fontFamily: "var(--font-body)",
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "22px 24px 20px" }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: 20, fontWeight: 700, lineHeight: 1.3,
          color: "var(--text-1)", marginBottom: 10, letterSpacing: "-0.01em",
        }}>
          {article.title}
        </h2>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 13.5, lineHeight: 1.65, color: "var(--text-2)",
          marginBottom: 14,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {article.description}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {article.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 500, padding: "3px 9px",
              borderRadius: 5, background: "var(--paper)",
              color: "var(--text-3)", fontFamily: "var(--font-body)",
              border: "1px solid var(--border)",
            }}>{tag}</span>
          ))}
        </div>

        {/* Meta row */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 12, borderTop: "1px solid var(--border)",
        }}>
          <span style={{
            fontSize: 11.5, color: "var(--text-3)", fontFamily: "var(--font-body)",
          }}>
            {article.date} · {article.readingTime} read
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600, color: "var(--text-1)",
            fontFamily: "var(--font-body)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-4px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}>
            Open Chapter →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero({ article }: { article: Article }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      padding: "64px clamp(20px, 5vw, 48px) 72px",
      borderBottom: "1px solid var(--border)",
      display: "grid",
      gridTemplateColumns: "1fr min(400px, 42%)",
      gap: 48,
      alignItems: "center",
    }}>
      {/* Left: text */}
      <div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: article.accent,
          fontFamily: "var(--font-body)", marginBottom: 20,
        }}>
          <div style={{ width: 18, height: 1, background: article.accent, opacity: 0.6 }} />
          Featured Research
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 50px)",
          fontWeight: 800, lineHeight: 1.18,
          letterSpacing: "-0.025em", color: "var(--text-1)",
          marginBottom: 20,
        }}>
          {article.title}
        </h1>
        <p style={{
          fontSize: 16, lineHeight: 1.7, color: "var(--text-2)",
          fontFamily: "var(--font-body)", marginBottom: 24,
          maxWidth: 560,
        }}>
          {article.description}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 32 }}>
          {article.visualTags.map((t) => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 5,
              background: "white", color: "var(--text-2)",
              border: "1px solid var(--border)", fontFamily: "var(--font-body)",
            }}>{t}</span>
          ))}
        </div>

        {/* CTA */}
        <Link href={article.path}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "13px 26px", borderRadius: 9,
            background: hov ? article.accent : "#111111",
            color: "#fff",
            fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)",
            transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
            transform: hov ? "translateY(-1px)" : "translateY(0)",
            boxShadow: hov ? `0 8px 24px ${article.accent}50` : "var(--shadow-md)",
          }}>
          Open Chapter
          <span style={{ fontSize: 16, transition: "transform 0.2s ease",
            transform: hov ? "translateX(3px)" : "translateX(0)" }}>→</span>
        </Link>

        <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-3)",
          fontFamily: "var(--font-body)" }}>
          {article.date} · {article.readingTime} read
        </div>
      </div>

      {/* Right: large cover preview */}
      <div style={{
        position: "relative", height: 340, borderRadius: 16,
        overflow: "hidden", border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
      }}>
        <CoverPattern pattern={article.coverPattern} accent={article.accent}
          accentLight={article.accentLight} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to top, ${article.accentLight}90 0%, transparent 60%)`,
        }} />
        <div style={{
          position: "absolute", bottom: 18, left: 20,
          fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700,
          color: article.accent, letterSpacing: "-0.01em", lineHeight: 1.3,
          maxWidth: "80%",
        }}>
          {article.subtitle}
        </div>
      </div>
    </div>
  );
}

/* ── Filter pill ─────────────────────────────────────────── */
function FilterPill({ label, active, onClick, count }: {
  label: string; active: boolean; onClick: () => void; count?: number;
}) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "7px 16px", borderRadius: 20,
      background: active ? "#111111" : "white",
      color: active ? "white" : "var(--text-2)",
      border: `1px solid ${active ? "#111111" : "var(--border)"}`,
      fontSize: 12.5, fontWeight: active ? 600 : 400,
      fontFamily: "var(--font-body)",
      cursor: "pointer",
      transition: "all 0.18s ease",
    }}>
      {label}
      {count !== undefined && (
        <span style={{
          fontSize: 10, padding: "1px 5px", borderRadius: 8,
          background: active ? "rgba(255,255,255,0.2)" : "var(--paper)",
          color: active ? "white" : "var(--text-3)",
          fontWeight: 500,
        }}>{count}</span>
      )}
    </button>
  );
}

/* ── Homepage ────────────────────────────────────────────── */
export default function Home() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
  // Grid: always show all articles (featured also appears in hero above)
  const gridArticles = filter === "all"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === filter);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav />

      {/* Hero — always visible, shows featured article */}
      <Hero article={featured} />

      {/* Library section */}
      <div style={{ maxWidth: 1200, margin: "0 auto",
        padding: "56px clamp(20px, 5vw, 48px) 80px" }}>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "baseline",
          justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em",
            color: "var(--text-1)",
          }}>
            {filter === "all" ? "The Library" : CATEGORY_META[filter].label}
          </h2>
          {filter !== "all" && (
            <p style={{ fontSize: 14, color: "var(--text-3)", fontFamily: "var(--font-body)",
              maxWidth: 400, textAlign: "right", lineHeight: 1.5 }}>
              {CATEGORY_META[filter].description}
            </p>
          )}
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
          <FilterPill label="All" active={filter === "all"}
            onClick={() => setFilter("all")} count={ARTICLES.length} />
          <FilterPill label="AI" active={filter === "ai"}
            onClick={() => setFilter("ai")}
            count={ARTICLES.filter((a) => a.category === "ai").length} />
          <FilterPill label="Design" active={filter === "uiux"}
            onClick={() => setFilter("uiux")}
            count={ARTICLES.filter((a) => a.category === "uiux").length} />
        </div>

        {/* Article grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 24,
        }}>
          {gridArticles.map((article) => (
            <ArticleCard key={article.id} article={article}
              hovered={hovered === article.id}
              onHover={setHovered} />
          ))}
        </div>

        {gridArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0",
            color: "var(--text-3)", fontFamily: "var(--font-body)", fontSize: 15 }}>
            No articles in this category yet.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "28px clamp(20px, 5vw, 48px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 15,
          fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
          Library
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12,
          color: "var(--text-3)" }}>
          A living library of research &amp; interactive visualizations
        </span>
      </footer>
    </div>
  );
}
