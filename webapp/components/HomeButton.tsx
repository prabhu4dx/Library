"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Pages where the home button should NOT appear
const NAV_PAGES = ["/", "/ai", "/uiux"];

export default function HomeButton() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  // Only show on article pages
  if (NAV_PAGES.includes(pathname)) return null;

  return (
    <Link
      href="/"
      aria-label="Back to Library homepage"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        top: 14,
        left: 14,
        zIndex: 9999,
        width: 34,
        height: 34,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hovered
          ? "rgba(255, 255, 255, 0.98)"
          : "rgba(255, 255, 255, 0.80)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${hovered ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.09)"}`,
        boxShadow: hovered
          ? "0 4px 16px rgba(0,0,0,0.14)"
          : "0 2px 8px rgba(0,0,0,0.08)",
        transform: hovered ? "scale(1.06)" : "scale(1)",
        transition: "all 0.18s ease",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 7L8 1.5L14.5 7V14.5H10.5V10H5.5V14.5H1.5V7Z"
          stroke={hovered ? "#111111" : "#555555"}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </Link>
  );
}
