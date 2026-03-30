"use client";
import { useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { ARTICLES, CATEGORY_META, type Article } from "@/app/lib/registry";

function ArticleRow({ article }: { article: Article }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={article.path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        background: "white",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "box-shadow 0.25s ease, transform 0.25s var(--ease-spring)",
        textDecoration: "none",
      }}
    >
      {/* Left accent strip */}
      <div
        style={{
          background: `linear-gradient(160deg, ${article.accentLight} 0%, ${article.accent}22 100%)`,
          position: "relative",
          overflow: "hidden",
          minHeight: 120,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: article.accent,
            fontFamily: "var(--font-body)",
          }}
        >
          {article.subcategory}
        </div>
      </div>

      {/* Right text */}
      <div style={{ padding: "24px 28px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            color: "var(--text-1)",
            marginBottom: 8,
          }}
        >
          {article.title}
        </h2>
        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.65,
            color: "var(--text-2)",
            fontFamily: "var(--font-body)",
            marginBottom: 16,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.description}
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {article.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 4,
                background: "var(--paper)",
                border: "1px solid var(--border)",
                color: "var(--text-3)",
                fontFamily: "var(--font-body)",
              }}
            >
              {t}
            </span>
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              color: "var(--text-3)",
              fontFamily: "var(--font-body)",
              alignSelf: "center",
            }}
          >
            {article.readingTime} read
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function UiuxPage() {
  const articles = ARTICLES.filter((a) => a.category === "uiux");
  const subcategories = [...new Set(articles.map((a) => a.subcategory))];

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav />

      {/* Header */}
      <div
        style={{
          padding: "56px clamp(20px, 5vw, 48px) 48px",
          borderBottom: "1px solid var(--border)",
          maxWidth: 1200,
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
          <span style={{ color: "var(--text-1)", fontWeight: 500 }}>Design</span>
        </nav>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-1)",
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          Design Systems
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--text-2)",
            fontFamily: "var(--font-body)",
            maxWidth: 560,
          }}
        >
          {CATEGORY_META.uiux.description}
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
          {subcategories.map((sub) => (
            <span
              key={sub}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 6,
                background: "white",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
                fontFamily: "var(--font-body)",
              }}
            >
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px clamp(20px, 5vw, 48px) 80px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {articles.map((article) => (
          <ArticleRow key={article.id} article={article} />
        ))}
      </div>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px clamp(20px, 5vw, 48px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-1)",
          }}
        >
          ← Library
        </Link>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--text-3)",
          }}
        >
          {articles.length} articles in Design
        </span>
      </footer>
    </div>
  );
}
