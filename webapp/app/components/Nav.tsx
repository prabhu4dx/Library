"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ARTICLES } from "@/app/lib/registry";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "All" },
    { href: "/ai", label: "AI" },
    { href: "/uiux", label: "Design" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: "0 clamp(20px, 5vw, 48px)",
        background: scrolled ? "rgba(248,248,248,0.92)" : "rgba(248,248,248,0.0)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Wordmark */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          color: "#111111",
          marginRight: 36,
          flexShrink: 0,
          textDecoration: "none",
        }}
      >
        Library
      </Link>

      {/* Category links */}
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? "#111111" : "#888888",
                padding: "5px 13px",
                borderRadius: 6,
                background: active ? "rgba(0,0,0,0.06)" : "transparent",
                border: "1px solid transparent",
                transition: "all 0.15s ease",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Article count */}
      <div
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 11,
          fontWeight: 500,
          color: "#888888",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {ARTICLES.length} Articles
      </div>
    </nav>
  );
}
