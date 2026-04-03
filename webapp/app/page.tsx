"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ARTICLES, Category, ArticleType, CATEGORY_META, TYPE_META } from "./lib/registry";
import ArticleCard, { ViewMode } from "./components/ArticleCard";

/* ── Components ─────────────────────────────────────────── */

/**
 * Luminous Sanctuary Background (Software Grade CSS Gradients)
 * Implements a deep, perspective-driven cathedral of light using exclusively CSS GSS gradients.
 * Drives a real-time 'scroll-to-blur' physics engine using requestAnimationFrame.
 */
function FixedSanctuaryBackground() {
  const bgRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastScrollY = -1; // Force first frame trigger

    const updateBlur = () => {
      const scrollY = window.scrollY;
      if (scrollY === lastScrollY) {
        animationFrameId = requestAnimationFrame(updateBlur);
        return;
      }
      lastScrollY = scrollY;

      // Blur increases up to 32px over the first 800px of scrolling
      if (bgRef.current) {
        const blurValue = Math.min(32, (scrollY / 800) * 32);
        // Slowly reduce opacity/brightness to draw absolute focus to reading material
        const opacity = Math.max(0.3, 1 - (scrollY / 1000) * 0.7);
        // Slightly zoom inward for depth
        const scale = 1 + (scrollY / 1000) * 0.05;

        bgRef.current.style.filter = `blur(${blurValue.toFixed(1)}px)`;
        bgRef.current.style.opacity = opacity.toFixed(2);
        bgRef.current.style.transform = `scale(${scale.toFixed(3)})`;
      }
      animationFrameId = requestAnimationFrame(updateBlur);
    };

    animationFrameId = requestAnimationFrame(updateBlur);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const pillars = [
    // LEFT SIDE (Foreground to Background Perspective Depth)
    { side: "left", pos: "-5%", width: "18%", height: "115%", z: 20, blur: "0px", bottom: "-10%" }, // Immersive Front
    { side: "left", pos: "9%", width: "12%", height: "95%", z: 19, blur: "0px", bottom: "0%" },     // Planted on screen bottom
    { side: "left", pos: "18%", width: "8.5%", height: "78%", z: 18, blur: "0.5px", bottom: "8%" }, // Receding
    { side: "left", pos: "24.5%", width: "6%", height: "64%", z: 17, blur: "1px", bottom: "15%" },
    { side: "left", pos: "29%", width: "4%", height: "52%", z: 16, blur: "1.5px", bottom: "21%" },
    { side: "left", pos: "32%", width: "2.5%", height: "44%", z: 15, blur: "2px", bottom: "26%" },
    { side: "left", pos: "34%", width: "1.5%", height: "38%", z: 14, blur: "3px", bottom: "30%" },
    
    // RIGHT SIDE (Mirroring geometry)
    { side: "right", pos: "-5%", width: "18%", height: "115%", z: 20, blur: "0px", bottom: "-10%" },
    { side: "right", pos: "9%", width: "12%", height: "95%", z: 19, blur: "0px", bottom: "0%" },
    { side: "right", pos: "18%", width: "8.5%", height: "78%", z: 18, blur: "0.5px", bottom: "8%" },
    { side: "right", pos: "24.5%", width: "6%", height: "64%", z: 17, blur: "1px", bottom: "15%" },
    { side: "right", pos: "29%", width: "4%", height: "52%", z: 16, blur: "1.5px", bottom: "21%" },
    { side: "right", pos: "32%", width: "2.5%", height: "44%", z: 15, blur: "2px", bottom: "26%" },
    { side: "right", pos: "34%", width: "1.5%", height: "38%", z: 14, blur: "3px", bottom: "30%" },
  ];

  const getPillarGradient = (side: string) => {
    // Generates a 3D cylindrical shader wrap. 
    // Light is blasting from the center aisle onto the inner-facing curves of the columns.
    if (side === "left") {
      return "linear-gradient(to right, #DBCAC0 0%, #ECE0D8 30%, #F8F0EC 70%, #FFFFFF 100%)";
    } else {
      return "linear-gradient(to left, #DBCAC0 0%, #ECE0D8 30%, #F8F0EC 70%, #FFFFFF 100%)";
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "#FDFCF7", overflow: "hidden" }}>
      
      {/* The Dynamic Scroll-to-Blur Engine */}
      <div ref={bgRef} style={{ 
        position: "absolute", inset: 0, 
        willChange: "filter, opacity, transform", 
        // We scale from the bottom so the floor horizon never moves during the parallax zoom
        transformOrigin: "center 85%" 
      }}>
        
        {/* Foundation Atmospheric Sky (Warm Beige to White) */}
        <div style={{ 
          position: "absolute", inset: 0, 
          background: "linear-gradient(to bottom, #F0E6DD 0%, #F8F0EC 30%, #FFFFFF 70%)" 
        }} />

        {/* 3D Volumetric Cylinders Array */}
        {pillars.map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: p.bottom, // Dynamic physics bottom planting the pillar squarely onto the perspective floor
            [p.side]: p.pos,
            width: p.width,
            height: p.height,
            background: getPillarGradient(p.side),
            borderRadius: "1000px 1000px 0 0", // Absolute rounded cylinder tops
            filter: `blur(${p.blur})`, // Gently soften distant edges
            zIndex: p.z,
            // Only gracefully soften the very last 5% of the base so it merges physically into the floor reflection, but stands solid
            maskImage: "linear-gradient(to bottom, black 0%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 95%, transparent 100%)",
          }}>
            {/* Extremely bright localized rim light glowing around the inner edge curve */}
            <div style={{
              position: "absolute", top: 0, bottom: 0,
              [p.side === "left" ? "right" : "left"]: "-4%", 
              width: "25%",
              background: `linear-gradient(to ${p.side === "left" ? "right" : "left"}, transparent 0%, rgba(255,255,255,1) 100%)`,
              filter: "blur(6px)",
            }} />
          </div>
        ))}

        {/* The Mirrored High-Gloss Reflection Perspective Floor */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
          // Draws from deep warm floor shadows bleeding upwards into pure transparency behind the pillars
          background: "linear-gradient(to top, #EDDCD1 0%, rgba(250, 239, 236, 0.4) 40%, transparent 100%)",
          zIndex: 1, // Sweeps underneath the pillars, rooting them into the ground
        }} />

        {/* Deep Horizon Glow / Holy Light Core pushing out from the vanished aisle */}
        <div style={{
          position: "absolute", top: "25%", bottom: "20%", left: "30%", right: "30%",
          background: "radial-gradient(ellipse at 50% 100%, #FFFFFF 0%, rgba(255,255,255,0.9) 30%, transparent 70%)",
          filter: "blur(30px)", zIndex: 5,
        }} />

        {/* Optical Alignment Vignette pushing depth */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at center, transparent 35%, rgba(210, 195, 185, 0.2) 80%, rgba(180, 160, 145, 0.3) 100%)",
          pointerEvents: "none", zIndex: 40
        }} />
      </div>
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
 * Hub Info Section (Hero with Hardware-Accelerated Parallax)
 */
function HubInfoSection() {
  const sectionRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastScrollY = window.scrollY;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      if (scrollY === lastScrollY) {
        animationFrameId = requestAnimationFrame(updateParallax);
        return;
      }
      lastScrollY = scrollY;

      // Only do deep DOM writes if we are actually near the top of the page
      if (scrollY < 1200 && sectionRef.current) {
        // Parallax calculates opacity fade (0 to 600px) and upward slide (35% speed)
        const opacity = Math.max(0, 1 - scrollY / 600);
        const parallaxY = scrollY * 0.35;
        
        sectionRef.current.style.opacity = opacity.toFixed(3);
        // Using translate3d forces the browser to dedicate a GPU layer, eliminating main-thread jank
        sectionRef.current.style.transform = `translate3d(0, -${parallaxY.toFixed(1)}px, 0)`;
        sectionRef.current.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
      }
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    // We start the loop on mount instead of tying directly to scroll events.
    // This entirely decouples the math from the browser's scroll event dispatch throttle!
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: "relative",
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "160px clamp(20px, 8vw, 100px) 140px",
      textAlign: "center",
      transformOrigin: "center top",
      willChange: "transform, opacity", // Pre-warns compositor
    }}>
      <div style={{ maxWidth: 1000, position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.25em", color: "#2D241E", opacity: 0.6, marginBottom: 32 }}>
          Personal Project / AI Collaboration <div style={{ width: 40, height: 1, background: "#2D241E", opacity: 0.2 }} />
        </div>
        
        <h1 style={{ 
          fontFamily: "var(--font-display)", fontSize: "clamp(48px, 8vw, 92px)", 
          fontWeight: 900, lineHeight: 0.9, color: "#2D241E", letterSpacing: "-0.04em", marginBottom: 40,
          fontVariationSettings: '"SOFT" 100, "WONK" 1'
        }}>
          <span style={{
            background: "linear-gradient(135deg, #D2691E, #CD5C5C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block", 
            fontStyle: "italic",
            paddingRight: "0.1em",
            paddingBottom: "0.2em", // Expands clipping box to recover the 'g' and 'y' tails
            marginBottom: "-0.2em" // Prevents the padding from pushing the second line downward
          }}>Magazine Style</span> <br /> 
          <span style={{ fontSize: "clamp(32px, 6vw, 68px)", fontWeight: 800 }}>Interactive Mini Books</span>
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
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, textAlign: "center" }}>
              {["Interactive books", "Magazine style books", "Useful tools", "Research reports"].map(t => (
                <div key={t} style={{ 
                  fontSize: 13, fontWeight: 700, color: "#2D241E",
                  background: "rgba(255,255,255,0.4)",
                  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                  padding: "10px 24px", borderRadius: 30,
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.9)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.9)";
                }}
                >
                  {t}
                </div>
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
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      
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
        
        {/* Hub Narrative (Parallax Fades on Scroll) */}
        <HubInfoSection />

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
