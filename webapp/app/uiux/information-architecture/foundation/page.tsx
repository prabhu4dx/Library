"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Book, ChevronRight, ChevronLeft, Menu, X, Search, Home, Clock, Layers, Compass, Wrench, BookOpen, Target, AlertTriangle, Sparkles, Map, Hash, Filter, Grid3x3, Rocket, GraduationCap, History, Lightbulb, CheckCircle2, XCircle, ArrowRight, Plus, Trash2, Edit3, Eye, Settings, Folder, FileText, Users, Star, Zap, Award, Brain, MousePointerClick, Shuffle, GitBranch, Network, Workflow, Box, ListTree, ScanSearch, FlaskConical, Trophy, Heart } from 'lucide-react';

// ============= THEME =============
const theme = {
    rose: '#C2185B',
    roseDark: '#880E4F',
    roseLight: '#F8BBD0',
    rosePale: '#FCE4EC',
    rosePaler: '#FFF5F8',
    white: '#FFFFFF',
    bg: '#FFFAFB',
    text: '#1A0E12',
    textMuted: '#6B5560',
    textLight: '#9C8590',
    border: '#F0DCE3',
    borderDark: '#E5C5D0',
    success: '#2E7D32',
    warning: '#E65100',
    danger: '#C62828',
};

// ============= BOOK STRUCTURE =============
const chapters = [
    { id: 'cover', title: 'Cover', icon: Heart, kind: 'cover' },
    { id: 'toc', title: 'Table of Contents', icon: Book, kind: 'toc' },
    { id: 'ch1', title: '1. What is IA?', icon: Lightbulb, kind: 'chapter' },
    { id: 'ch2', title: '2. The History', icon: History, kind: 'chapter' },
    { id: 'ch3', title: '3. Core Principles', icon: Target, kind: 'chapter' },
    { id: 'ch4', title: '4. The 4 Systems', icon: Layers, kind: 'chapter' },
    { id: 'ch5', title: '5. LATCH Framework', icon: Grid3x3, kind: 'chapter' },
    { id: 'sim1', title: 'Lab: LATCH Sorter', icon: FlaskConical, kind: 'lab' },
    { id: 'ch6', title: '6. Strategies & Methods', icon: Compass, kind: 'chapter' },
    { id: 'sim2', title: 'Lab: Card Sorting', icon: FlaskConical, kind: 'lab' },
    { id: 'sim3', title: 'Lab: Tree Testing', icon: FlaskConical, kind: 'lab' },
    { id: 'ch7', title: '7. Navigation Patterns', icon: Network, kind: 'chapter' },
    { id: 'sim4', title: 'Lab: Pattern Explorer', icon: FlaskConical, kind: 'lab' },
    { id: 'ch8', title: '8. IA for SaaS', icon: Rocket, kind: 'chapter' },
    { id: 'sim5', title: 'Lab: Sitemap Builder', icon: FlaskConical, kind: 'lab' },
    { id: 'ch9', title: '9. App Teardowns', icon: ScanSearch, kind: 'chapter' },
    { id: 'ch10', title: '10. Tools 2026', icon: Wrench, kind: 'chapter' },
    { id: 'ch11', title: '11. Books & Resources', icon: BookOpen, kind: 'chapter' },
    { id: 'ch12', title: '12. AI Era IA', icon: Sparkles, kind: 'chapter' },
    { id: 'ch13', title: '13. Anti-Patterns', icon: AlertTriangle, kind: 'chapter' },
    { id: 'ch14', title: '14. The Process', icon: Workflow, kind: 'chapter' },
    { id: 'sim6', title: 'Lab: IA Quiz', icon: Trophy, kind: 'lab' },
    { id: 'final', title: 'Final Word', icon: GraduationCap, kind: 'chapter' },
];

// ============= ROOT APP =============
export default function IABook() {
    const [pageIdx, setPageIdx] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [bookmarks, setBookmarks] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ia-book-bookmarks') || '[]'); } catch { return []; }
    });
    const [progress, setProgress] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ia-book-progress') || '[]'); } catch { return []; }
    });

    const current = chapters[pageIdx];

    useEffect(() => {
        if (!progress.includes(current.id)) {
            const next = [...progress, current.id];
            setProgress(next);
            try { localStorage.setItem('ia-book-progress', JSON.stringify(next)); } catch { }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageIdx]);

    const toggleBookmark = (id: string) => {
        const next = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
        setBookmarks(next);
        try { localStorage.setItem('ia-book-bookmarks', JSON.stringify(next)); } catch { }
    };

    const progressPct = Math.round((progress.length / chapters.length) * 100);

    return (
        <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
            <TopBar
                currentTitle={current.title}
                progressPct={progressPct}
                onMenu={() => setSidebarOpen(s => !s)}
                sidebarOpen={sidebarOpen}
            />
            <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
                {sidebarOpen && (
                    <Sidebar
                        current={current.id}
                        onSelect={(id) => setPageIdx(chapters.findIndex(c => c.id === id))}
                        bookmarks={bookmarks}
                        progress={progress}
                    />
                )}
                <main style={{ flex: 1, padding: '32px 24px 80px', maxWidth: sidebarOpen ? 'calc(100% - 280px)' : '100%', overflow: 'hidden' }}>
                    <div style={{ maxWidth: 880, margin: '0 auto' }}>
                        <PageRouter id={current.id} />
                        <NavFooter
                            prev={pageIdx > 0 ? chapters[pageIdx - 1] : null}
                            next={pageIdx < chapters.length - 1 ? chapters[pageIdx + 1] : null}
                            onPrev={() => setPageIdx(i => Math.max(0, i - 1))}
                            onNext={() => setPageIdx(i => Math.min(chapters.length - 1, i + 1))}
                            bookmarked={bookmarks.includes(current.id)}
                            onToggleBookmark={() => toggleBookmark(current.id)}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

// ============= TOP BAR =============
function TopBar({ currentTitle, progressPct, onMenu, sidebarOpen }: { currentTitle: string, progressPct: number, onMenu: () => void, sidebarOpen: boolean }) {
    return (
        <div style={{ position: 'sticky', top: 0, zIndex: 50, background: theme.white, borderBottom: `1px solid ${theme.border}`, height: 56, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
            <button onClick={onMenu} aria-label="Toggle menu" style={btnIcon}>
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.rose, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Book size={18} color={theme.white} />
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, lineHeight: 1.1 }}>Information Architecture</div>
                    <div style={{ fontSize: 11, color: theme.textMuted }}>{currentTitle}</div>
                </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{progressPct}% read</div>
                <div style={{ width: 100, height: 6, background: theme.rosePale, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${progressPct}%`, height: '100%', background: theme.rose, transition: 'width 0.3s' }} />
                </div>
            </div>
        </div>
    );
}

// ============= SIDEBAR =============
function Sidebar({ current, onSelect, bookmarks, progress }: { current: string, onSelect: (id: string) => void, bookmarks: string[], progress: string[] }) {
    return (
        <aside style={{ width: 280, background: theme.white, borderRight: `1px solid ${theme.border}`, height: 'calc(100vh - 56px)', overflowY: 'auto', padding: '16px 0', position: 'sticky', top: 56 }}>
            <div style={{ padding: '0 16px 12px', fontSize: 11, color: theme.textLight, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Contents</div>
            {chapters.map(ch => {
                const Icon = ch.icon;
                const isActive = ch.id === current;
                const isRead = progress.includes(ch.id);
                const isBookmarked = bookmarks.includes(ch.id);
                const isLab = ch.kind === 'lab';
                return (
                    <button
                        key={ch.id}
                        onClick={() => onSelect(ch.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            padding: '8px 16px', border: 'none', background: isActive ? theme.rosePale : 'transparent',
                            cursor: 'pointer', textAlign: 'left', fontSize: 13,
                            color: isActive ? theme.roseDark : theme.text,
                            fontWeight: isActive ? 600 : 400,
                            borderLeft: isActive ? `3px solid ${theme.rose}` : '3px solid transparent',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = theme.rosePaler; }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <Icon size={15} color={isLab ? theme.rose : (isActive ? theme.roseDark : theme.textMuted)} />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.title}</span>
                        {isBookmarked && <Star size={11} color={theme.rose} fill={theme.rose} />}
                        {isRead && !isActive && <CheckCircle2 size={12} color={theme.success} />}
                    </button>
                );
            })}
        </aside>
    );
}

// ============= NAV FOOTER =============
function NavFooter({ prev, next, onPrev, onNext, bookmarked, onToggleBookmark }: { prev: any, next: any, onPrev: () => void, onNext: () => void, bookmarked: boolean, onToggleBookmark: () => void }) {
    return (
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={onPrev} disabled={!prev} style={{ ...btnSecondary, opacity: prev ? 1 : 0.4, cursor: prev ? 'pointer' : 'not-allowed' }}>
                <ChevronLeft size={16} /> {prev ? prev.title : 'Start'}
            </button>
            <button onClick={onToggleBookmark} style={{ ...btnSecondary, marginLeft: 'auto' }}>
                <Star size={14} color={bookmarked ? theme.rose : theme.textMuted} fill={bookmarked ? theme.rose : 'none'} />
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button onClick={onNext} disabled={!next} style={{ ...btnPrimary, opacity: next ? 1 : 0.4, cursor: next ? 'pointer' : 'not-allowed' }}>
                {next ? next.title : 'End'} <ChevronRight size={16} />
            </button>
        </div>
    );
}

// ============= PAGE ROUTER =============
function PageRouter({ id }: { id: string }) {
    switch (id) {
        case 'cover': return <CoverPage />;
        case 'toc': return <TOCPage />;
        case 'ch1': return <Chapter1 />;
        case 'ch2': return <Chapter2 />;
        case 'ch3': return <Chapter3 />;
        case 'ch4': return <Chapter4 />;
        case 'ch5': return <Chapter5 />;
        case 'sim1': return <LabLATCH />;
        case 'ch6': return <Chapter6 />;
        case 'sim2': return <LabCardSort />;
        case 'sim3': return <LabTreeTest />;
        case 'ch7': return <Chapter7 />;
        case 'sim4': return <LabNavPatterns />;
        case 'ch8': return <Chapter8 />;
        case 'sim5': return <LabSitemap />;
        case 'ch9': return <Chapter9 />;
        case 'ch10': return <Chapter10 />;
        case 'ch11': return <Chapter11 />;
        case 'ch12': return <Chapter12 />;
        case 'ch13': return <Chapter13 />;
        case 'ch14': return <Chapter14 />;
        case 'sim6': return <LabQuiz />;
        case 'final': return <FinalPage />;
        default: return <div>Page not found</div>;
    }
}

// ============= REUSABLE COMPONENTS =============
const btnIcon = { background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text };
const btnPrimary = { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: theme.rose, color: theme.white, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s' };
const btnSecondary = { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: theme.white, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' };
const btnGhost = { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'transparent', color: theme.rose, border: `1px solid ${theme.rose}`, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' };

function ChapterHeader({ tag, title, subtitle }: { tag?: string, title: string, subtitle?: string }) {
    return (
        <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${theme.border}` }}>
            {tag && <div style={{ fontSize: 12, color: theme.rose, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>{tag}</div>}
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.2, color: theme.text, letterSpacing: -0.5 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: 17, color: theme.textMuted, marginTop: 12, lineHeight: 1.5 }}>{subtitle}</p>}
        </div>
    );
}

function H2({ children }: { children: React.ReactNode }) {
    return <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16, color: theme.text, letterSpacing: -0.3 }}>{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
    return <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 28, marginBottom: 12, color: theme.text }}>{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
    return <p style={{ fontSize: 16, lineHeight: 1.75, color: theme.text, marginBottom: 16 }}>{children}</p>;
}
function Lead({ children }: { children: React.ReactNode }) {
    return <p style={{ fontSize: 18, lineHeight: 1.7, color: theme.textMuted, marginBottom: 24, fontStyle: 'italic', borderLeft: `3px solid ${theme.rose}`, paddingLeft: 16 }}>{children}</p>;
}
function Quote({ children, author }: { children: React.ReactNode, author?: string }) {
    return (
        <blockquote style={{ background: theme.rosePaler, borderLeft: `4px solid ${theme.rose}`, padding: '16px 20px', borderRadius: '0 8px 8px 0', margin: '20px 0' }}>
            <div style={{ fontSize: 16, fontStyle: 'italic', color: theme.text, lineHeight: 1.6 }}>"{children}"</div>
            {author && <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 8 }}>— {author}</div>}
        </blockquote>
    );
}
function Card({ children, accent }: { children: React.ReactNode, accent?: boolean }) {
    return <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderTop: accent ? `3px solid ${theme.rose}` : `1px solid ${theme.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>{children}</div>;
}
function Tag({ children, color }: { children: React.ReactNode, color?: string }) {
    const c = color || 'rose';
    const palette = c === 'rose' ? { bg: theme.rosePale, fg: theme.roseDark } : c === 'green' ? { bg: '#E8F5E9', fg: '#1B5E20' } : c === 'amber' ? { bg: '#FFF3E0', fg: '#E65100' } : c === 'gray' ? { bg: '#F5F5F5', fg: '#424242' } : { bg: theme.rosePale, fg: theme.roseDark };
    return <span style={{ display: 'inline-block', padding: '3px 10px', background: palette.bg, color: palette.fg, fontSize: 11, fontWeight: 600, borderRadius: 999, letterSpacing: 0.3 }}>{children}</span>;
}
function Bullet({ items }: { items: React.ReactNode[] }) {
    return (
        <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 16 }}>
            {items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderBottom: i < items.length - 1 ? `1px dashed ${theme.border}` : 'none' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.rose, marginTop: 9, flexShrink: 0 }} />
                    <div style={{ fontSize: 15, lineHeight: 1.6, color: theme.text }}>{item}</div>
                </li>
            ))}
        </ul>
    );
}
function Callout({ icon: Icon, title, children, kind }: { icon?: any, title: string, children?: React.ReactNode, kind?: string }) {
    const colors = kind === 'warning' ? { bg: '#FFF3E0', fg: '#E65100', border: '#FFB74D' } : kind === 'success' ? { bg: '#E8F5E9', fg: '#1B5E20', border: '#81C784' } : { bg: theme.rosePale, fg: theme.roseDark, border: theme.rose };
    return (
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}40`, borderLeft: `4px solid ${colors.border}`, borderRadius: 8, padding: '14px 18px', margin: '18px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {Icon && <Icon size={16} color={colors.fg} />}
                <strong style={{ fontSize: 14, color: colors.fg }}>{title}</strong>
            </div>
            <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.65 }}>{children}</div>
        </div>
    );
}

// ============= COVER PAGE =============
function CoverPage() {
    return (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ display: 'inline-block', padding: 28, background: theme.rosePale, borderRadius: 28, marginBottom: 32 }}>
                <Heart size={72} color={theme.rose} fill={theme.rose} />
            </div>
            <div style={{ fontSize: 13, color: theme.rose, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Interactive Edition</div>
            <h1 style={{ fontSize: 56, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.05, color: theme.text, letterSpacing: -1.5 }}>
                Information<br />
                <span style={{ color: theme.rose }}>Architecture</span>
            </h1>
            <p style={{ fontSize: 20, color: theme.textMuted, maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.5 }}>
                A complete interactive guide for SaaS founders and UI/UX learners — from history to hands-on labs.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
                <Tag>14 chapters</Tag>
                <Tag color="green">6 interactive labs</Tag>
                <Tag color="amber">SaaS focus</Tag>
                <Tag color="gray">2026 edition</Tag>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, maxWidth: 720, margin: '0 auto' }}>
                {[
                    { icon: Lightbulb, label: 'Theory', desc: 'Core principles' },
                    { icon: FlaskConical, label: 'Labs', desc: 'Hands-on practice' },
                    { icon: ScanSearch, label: 'Teardowns', desc: 'Notion, Linear, Stripe' },
                    { icon: Rocket, label: 'For SaaS', desc: 'Build real products' },
                ].map((f, i) => {
                    const Icon = f.icon;
                    return (
                        <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
                            <Icon size={24} color={theme.rose} style={{ marginBottom: 8 }} />
                            <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{f.label}</div>
                            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{f.desc}</div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: 80, fontSize: 13, color: theme.textLight }}>Tap "Table of Contents" or use the sidebar to navigate.</div>
        </div>
    );
}

// ============= TOC PAGE =============
function TOCPage() {
    return (
        <div>
            <ChapterHeader tag="How to use this book" title="Table of contents" subtitle="14 chapters interlaced with 6 hands-on labs. Read in order, or jump to any chapter via the sidebar." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                {chapters.filter(c => c.kind !== 'cover' && c.kind !== 'toc').map((ch, i) => {
                    const Icon = ch.icon;
                    const isLab = ch.kind === 'lab';
                    return (
                        <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', background: theme.white, border: `1px solid ${theme.border}`, borderLeft: isLab ? `4px solid ${theme.rose}` : `1px solid ${theme.border}`, borderRadius: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: isLab ? theme.rosePale : theme.rosePaler, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={18} color={theme.rose} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{ch.title}</div>
                                {isLab && <div style={{ fontSize: 12, color: theme.rose, marginTop: 2 }}>Interactive simulation</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============= CHAPTER 1 =============
function Chapter1() {
    return (
        <div>
            <ChapterHeader tag="Chapter 1" title="What is Information Architecture?" subtitle="Three definitions from three thinkers, why IA exists, and how it differs from UX, UI, and content strategy." />
            <Lead>"Making the complex clear." — Richard Saul Wurman, who coined the term in 1976.</Lead>
            <H2>Three definitions worth knowing</H2>
            <Card accent>
                <Tag>1976</Tag>
                <H3>Richard Saul Wurman</H3>
                <P>Architect by training. Coined "information architect" at the AIA conference in Philadelphia. Frames IA as the "thoughtful making of artifact, idea, or policy that informs because it is clear."</P>
            </Card>
            <Card accent>
                <Tag>1998</Tag>
                <H3>Rosenfeld &amp; Morville (Polar Bear Book)</H3>
                <P>Library-science lineage. The canonical four-part definition: structural design of shared information environments, organizing &amp; labeling, synthesis of organization/labeling/search/navigation systems, and an emerging community of practice.</P>
            </Card>
            <Card accent>
                <Tag>2009+</Tag>
                <H3>Dan Klyn</H3>
                <Quote>The thoughtful contriving of ontology, taxonomy, and choreography in the service of utility and delight.</Quote>
                <P>The most useful working definition for product designers. Ontology = meaning. Taxonomy = arrangement. Choreography = rules of interaction over time.</P>
            </Card>
            <H2>Why IA exists</H2>
            <P>Wurman coined "information anxiety" in 1989 — the gap between data and understanding. IA solves four related problems:</P>
            <Bullet items={[
                <span><strong>Findability</strong> — if users can't find content, it functionally doesn't exist.</span>,
                <span><strong>Understandability</strong> — can users grasp the whole, not just the parts?</span>,
                <span><strong>Coherence across contexts</strong> — same product on web, mobile, watch should feel like one place.</span>,
                <span><strong>Resilience to growth</strong> — the structure must hold as content scales 10× or 100×.</span>,
            ]} />
            <H2>IA vs adjacent disciplines</H2>
            <DisciplineComparison />
            <Callout icon={Lightbulb} title="Key insight">
                "If it lets users <em>do</em> things — interface design. If it lets them <em>go</em> places — navigation design. If it <em>communicates ideas</em> — information design." — Jesse James Garrett
            </Callout>
        </div>
    );
}

function DisciplineComparison() {
    const items = [
        { name: 'Information Architecture', focus: 'Structure of meaning — how things organize, label, find', deliverable: 'Sitemap, taxonomy, content model' },
        { name: 'UI Design', focus: 'Surface — how it looks and feels', deliverable: 'Visual mockups, components' },
        { name: 'UX Design', focus: 'Umbrella discipline including all of the above', deliverable: 'Personas, journey maps, prototypes' },
        { name: 'Interaction Design', focus: 'Behavior over time — gestures, transitions', deliverable: 'Interaction spec, motion' },
        { name: 'Content Strategy', focus: 'What content exists, voice, lifecycle', deliverable: 'Editorial calendar, voice guide' },
    ];
    return (
        <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            {items.map((item, i) => (
                <div key={i} style={{ padding: 16, borderBottom: i < items.length - 1 ? `1px solid ${theme.border}` : 'none', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, alignItems: 'start' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: i === 0 ? theme.rose : theme.text }}>{item.name}</div>
                    <div>
                        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.6 }}>{item.focus}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{item.deliverable}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============= CHAPTER 2 =============
function Chapter2() {
    const [year, setYear] = useState(1976);
    const events = useMemo(() => [
        { year: 1876, title: 'Dewey Decimal Classification', desc: 'Melvil Dewey publishes the 10-class system. Founds the ALA the same year.' },
        { year: 1933, title: 'Faceted Classification', desc: 'S.R. Ranganathan publishes Colon Classification with PMEST facets.' },
        { year: 1964, title: 'IBM System/360', desc: 'First technical use of "architecture" for information — Amdahl, Blaauw, Brooks.' },
        { year: 1976, title: 'Wurman coins the term', desc: 'Richard Saul Wurman uses "information architect" at the AIA convention.' },
        { year: 1989, title: 'Information Anxiety', desc: 'Wurman publishes the book; introduces LATCH / Five Hat Racks.' },
        { year: 1998, title: 'Polar Bear Book', desc: 'Rosenfeld & Morville publish "Information Architecture for the World Wide Web". Amazon\'s best computer book of the year.' },
        { year: 2002, title: 'Elements of UX', desc: 'Garrett publishes the 5-planes model. Big-IA / Little-IA debate erupts.' },
        { year: 2007, title: 'iPhone launches', desc: 'Mobile context shatters the desktop-only assumption. IA must go cross-channel.' },
        { year: 2011, title: 'Pervasive IA', desc: 'Resmini & Rosati introduce 5 heuristics for cross-channel ecosystems.' },
        { year: 2014, title: 'Make Sense of Any Mess', desc: 'Abby Covert reframes IA as universal sensemaking. Free online.' },
        { year: 2015, title: 'Polar Bear 4th ed.', desc: 'Subtitle changes from "Designing Large-Scale Web Sites" to "For the Web and Beyond".' },
        { year: 2022, title: 'AI-native IA', desc: 'Threads, Projects, Spaces emerge as new IA primitives. Cmd+K dominates SaaS.' },
    ], []);
    const closest = events.reduce((a, b) => Math.abs(b.year - year) < Math.abs(a.year - year) ? b : a);

    return (
        <div>
            <ChapterHeader tag="Chapter 2" title="The history that shaped IA" subtitle="From Dewey's library shelves to AI-native interfaces — a 150-year arc you can drag through." />
            <Card accent>
                <H3>Interactive timeline — drag the slider</H3>
                <div style={{ padding: '16px 0' }}>
                    <input
                        type="range"
                        min={events[0].year}
                        max={events[events.length - 1].year}
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: theme.rose }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textMuted, marginTop: 6 }}>
                        <span>1876</span>
                        <span style={{ color: theme.rose, fontWeight: 600, fontSize: 14 }}>{year}</span>
                        <span>2025</span>
                    </div>
                </div>
                <div style={{ background: theme.rosePaler, padding: 16, borderRadius: 8, marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: theme.rose, fontWeight: 700, letterSpacing: 1 }}>{closest.year}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginTop: 4 }}>{closest.title}</div>
                    <div style={{ fontSize: 14, color: theme.textMuted, marginTop: 6, lineHeight: 1.6 }}>{closest.desc}</div>
                </div>
            </Card>

            <H2>Full timeline</H2>
            <div style={{ position: 'relative', paddingLeft: 28, marginTop: 24 }}>
                <div style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 2, background: theme.rosePale }} />
                {events.map((e, i) => (
                    <div key={i} style={{ position: 'relative', marginBottom: 20 }}>
                        <div style={{ position: 'absolute', left: -25, top: 4, width: 12, height: 12, borderRadius: '50%', background: theme.rose, border: `3px solid ${theme.white}`, boxShadow: `0 0 0 2px ${theme.rose}` }} />
                        <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14 }}>
                            <div style={{ fontSize: 12, color: theme.rose, fontWeight: 700 }}>{e.year}</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginTop: 2 }}>{e.title}</div>
                            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4, lineHeight: 1.55 }}>{e.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            <H2>The key figures</H2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {[
                    { name: 'Richard Saul Wurman', role: 'Coined the term', year: '1976' },
                    { name: 'Lou Rosenfeld', role: 'Polar Bear co-author', year: '1998' },
                    { name: 'Peter Morville', role: 'Coined "findability"', year: '1998' },
                    { name: 'Jesse James Garrett', role: '5-planes model', year: '2002' },
                    { name: 'Dan Brown', role: '8 principles of IA', year: '2010' },
                    { name: 'Dan Klyn', role: 'Ontology/Taxonomy/Choreography', year: '2009' },
                    { name: 'Abby Covert', role: 'IA as sensemaking', year: '2014' },
                    { name: 'Jorge Arango', role: 'Living in Information', year: '2018' },
                ].map((f, i) => (
                    <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: theme.rose, marginTop: 2 }}>{f.role}</div>
                        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{f.year}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============= CHAPTER 3 =============
function Chapter3() {
    const [activeIdx, setActiveIdx] = useState(0);
    const principles = [
        { name: 'Objects', desc: 'Treat content as a living thing with lifecycles, behaviors, and attributes.', example: 'In Stripe: "Customer," "Subscription," "Invoice" each have predictable behaviors (refund, renew, void) and consistent attributes.' },
        { name: 'Choices', desc: 'Offer meaningful choices, focused on a task. Hick\'s Law: too many options paralyze.', example: 'A pricing page with 3 tiers — not a 17-feature comparison row.' },
        { name: 'Disclosure', desc: 'Show only enough to help users decide whether to dig deeper. Progressive disclosure.', example: 'Figma\'s right panel reveals "Prototype" and "Inspect" only when relevant.' },
        { name: 'Exemplars', desc: 'Describe categories by showing examples of their contents. Exemplars beat definitions.', example: 'Netflix\'s "Action" row shows movie thumbnails inside the row, not just the label.' },
        { name: 'Front Doors', desc: 'Assume at least half of visitors arrive on a page other than the home page.', example: 'Breadcrumbs on every doc page; "back to dashboard" links on detail screens.' },
        { name: 'Multiple Classification', desc: 'Offer several classification schemes — different users, different mental models.', example: 'Linear lets you view issues by status, assignee, project, cycle, label — same data, multiple lenses.' },
        { name: 'Focused Navigation', desc: 'Don\'t mix apples and oranges. Each nav system has one purpose.', example: 'Keep utility links (login, settings) out of the topical content nav.' },
        { name: 'Growth', desc: 'Today\'s content is a small fraction of tomorrow\'s. Architect for scale.', example: 'The IA must hold from 10 features to 200. Critical for SaaS.' },
    ];

    return (
        <div>
            <ChapterHeader tag="Chapter 3" title="Core principles & frameworks" subtitle="Dan Brown's 8 Principles, Klyn's Ontology/Taxonomy/Choreography, Garrett's 5 planes — the foundational frameworks." />
            <H2>Dan Brown's 8 Principles (2010)</H2>
            <P>Brown wrote these because "information architecture, a field in relative infancy and constantly rediscovering itself, does not yet have a well-established theory." Click each principle below.</P>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
                {principles.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        style={{
                            padding: '14px 8px',
                            background: activeIdx === i ? theme.rose : theme.white,
                            color: activeIdx === i ? theme.white : theme.text,
                            border: `1px solid ${activeIdx === i ? theme.rose : theme.border}`,
                            borderRadius: 10,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            transition: 'all 0.15s'
                        }}
                    >
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{i + 1}</div>
                        {p.name}
                    </button>
                ))}
            </div>
            <Card accent>
                <H3>{activeIdx + 1}. {principles[activeIdx].name}</H3>
                <P>{principles[activeIdx].desc}</P>
                <Callout icon={Lightbulb} title="Example">
                    {principles[activeIdx].example}
                </Callout>
            </Card>

            <H2>Klyn's framework: Ontology, Taxonomy, Choreography</H2>
            <P>The most useful working framework for product designers. Decide what each concept <em>means</em> before deciding where it goes.</P>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                    { word: 'Ontology', meaning: 'Particular meaning', example: 'Is "Project" a container of issues, a strategic initiative, or both?' },
                    { word: 'Taxonomy', meaning: 'Arrangement', example: 'Grouping like with like + ranking by importance.' },
                    { word: 'Choreography', meaning: 'Rules over time', example: 'How users + information move across states and surfaces.' },
                ].map((k, i) => (
                    <div key={i} style={{ background: theme.rosePaler, border: `1px solid ${theme.rosePale}`, borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 11, color: theme.rose, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{i + 1}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginTop: 4 }}>{k.word}</div>
                        <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>{k.meaning}</div>
                        <div style={{ fontSize: 13, color: theme.text, marginTop: 12, lineHeight: 1.5, fontStyle: 'italic' }}>{k.example}</div>
                    </div>
                ))}
            </div>

            <H2>Garrett's 5 Planes — IA's place in UX</H2>
            <P>Bottom (abstract) to top (concrete). IA explicitly lives at the Structure plane.</P>
            <div style={{ marginTop: 20 }}>
                {[
                    { name: 'Surface', desc: 'Visual design', concrete: 'Most concrete' },
                    { name: 'Skeleton', desc: 'Interface, navigation, information design' },
                    { name: 'Structure', desc: 'Interaction design + Information Architecture', highlight: true },
                    { name: 'Scope', desc: 'Functional specs + content requirements' },
                    { name: 'Strategy', desc: 'User needs + product objectives', concrete: 'Most abstract' },
                ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: p.highlight ? theme.rosePale : theme.white, border: `1px solid ${p.highlight ? theme.rose : theme.border}`, borderRadius: 8, marginBottom: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: p.highlight ? theme.rose : theme.rosePaler, color: p.highlight ? theme.white : theme.rose, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{5 - i}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{p.desc}</div>
                        </div>
                        {p.concrete && <Tag color="gray">{p.concrete}</Tag>}
                        {p.highlight && <Tag>IA lives here</Tag>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============= CHAPTER 4 =============
function Chapter4() {
    return (
        <div>
            <ChapterHeader tag="Chapter 4" title="The 4 systems of IA" subtitle="Rosenfeld & Morville's foundational framework: Organization, Labeling, Navigation, Search." />
            <Lead>The skeleton of the Polar Bear Book — every IA decision falls into one of these four buckets.</Lead>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
                {[
                    { icon: ListTree, num: '01', name: 'Organization', desc: 'How content is categorized — schemes (alphabetical, topic, audience, task) and structures (hierarchy, sequence, matrix, hybrid).' },
                    { icon: Hash, num: '02', name: 'Labeling', desc: 'How content is named — contextual links, headings, navigation labels, icon labels, index terms.' },
                    { icon: Compass, num: '03', name: 'Navigation', desc: 'How users move — global, local, contextual, supplemental (sitemaps, indexes, guides).' },
                    { icon: Search, num: '04', name: 'Search', desc: 'How users query — algorithms, query languages, search interfaces, results, faceted filters.' },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, fontWeight: 800, color: theme.rosePaler, lineHeight: 1 }}>{s.num}</div>
                            <Icon size={28} color={theme.rose} style={{ position: 'relative', zIndex: 1 }} />
                            <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginTop: 12, position: 'relative' }}>{s.name}</div>
                            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 8, lineHeight: 1.6, position: 'relative' }}>{s.desc}</div>
                        </div>
                    );
                })}
            </div>

            <H2>Organization structures</H2>
            <P>Pick the right structure for your content. Most real SaaS uses a hybrid.</P>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {[
                    { name: 'Hierarchical (tree)', use: 'Default for most products', ex: 'Notion sidebar (recursive nested pages)' },
                    { name: 'Sequential', use: 'Onboarding, checkout, KYC, multi-step', ex: 'Stripe Checkout flow' },
                    { name: 'Matrix (multi-dimensional)', use: 'Multiple mental models, same data', ex: 'Linear filters: status × assignee × project' },
                    { name: 'Hybrid', use: 'Almost all real SaaS', ex: 'Figma: hierarchical + matrix + sequential' },
                ].map((s, i, arr) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: 16, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none', alignItems: 'start' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{s.name}</div>
                        <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{s.use}</div>
                        <div style={{ fontSize: 13, color: theme.rose, lineHeight: 1.5, fontStyle: 'italic' }}>{s.ex}</div>
                    </div>
                ))}
            </div>

            <H2>Organization schemes</H2>
            <H3>Exact (mutually exclusive)</H3>
            <Bullet items={[
                'Alphabetical — directories, glossaries',
                'Chronological — activity feeds, version history',
                'Geographical — store locators, regional content',
            ]} />
            <H3>Ambiguous (subjective, often more useful)</H3>
            <Bullet items={[
                'Topic — Notion\'s template gallery (Engineering, Design, HR)',
                'Task — Linear\'s Cmd+K ("Create issue," "Assign to me")',
                'Audience — Stripe.com homepage (Developers / Product / Use cases)',
                'Metaphor — Slack\'s "channels," Notion\'s "blocks," Trello\'s "boards"',
            ]} />

            <Callout icon={Lightbulb} title="Polar Bear Book recommendation">
                Use multiple schemes in parallel so users can find the same content via different mental paths.
            </Callout>
        </div>
    );
}

// ============= CHAPTER 5 =============
function Chapter5() {
    return (
        <div>
            <ChapterHeader tag="Chapter 5" title="LATCH: the only 5 ways to organize anything" subtitle="Wurman's claim is bold: information may be infinite, but organization is finite. There are exactly 5 ways." />
            <Quote author="Richard Saul Wurman">There are five and only five ways to organize information.</Quote>
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {[
                    { letter: 'L', name: 'Location', desc: 'Maps, floor plans, store locators', icon: Map },
                    { letter: 'A', name: 'Alphabet', desc: 'Dictionaries, contact lists', icon: Hash },
                    { letter: 'T', name: 'Time', desc: 'Activity feeds, version history', icon: Clock },
                    { letter: 'C', name: 'Category', desc: 'E-commerce departments, genres', icon: Folder },
                    { letter: 'H', name: 'Hierarchy', desc: 'Top 100, ranked results, leaderboards', icon: Layers },
                ].map((l, i) => {
                    const Icon = l.icon;
                    return (
                        <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18, textAlign: 'center' }}>
                            <div style={{ width: 56, height: 56, borderRadius: 14, background: theme.rose, color: theme.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, margin: '0 auto 12px' }}>{l.letter}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{l.name}</div>
                            <Icon size={16} color={theme.textMuted} style={{ margin: '8px auto 4px' }} />
                            <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>{l.desc}</div>
                        </div>
                    );
                })}
            </div>

            <H2>How to choose your LATCH method</H2>
            <P>Most real products combine 2–3 methods. Spotify mixes Category (genres) + Continuum (Top 50) + Time (Recently Played). Pick your primary based on user intent.</P>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: 'hidden', marginTop: 20 }}>
                {[
                    { intent: 'User asks "where?"', method: 'Location', why: 'Spatial orientation matters most' },
                    { intent: 'User asks "find the name"', method: 'Alphabet', why: 'Known-item search by exact label' },
                    { intent: 'User asks "what happened?"', method: 'Time', why: 'Sequence and recency drive meaning' },
                    { intent: 'User asks "which kind?"', method: 'Category', why: 'Group similar items together' },
                    { intent: 'User asks "which is best?"', method: 'Hierarchy', why: 'Compare on a dimension (size, price, rank)' },
                ].map((row, i, arr) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 16, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none', alignItems: 'center' }}>
                        <div style={{ fontSize: 13, color: theme.textMuted }}>{row.intent}</div>
                        <div><Tag>{row.method}</Tag></div>
                        <div style={{ fontSize: 13, color: theme.text }}>{row.why}</div>
                    </div>
                ))}
            </div>
            <Callout icon={Lightbulb} title="Practice in the next lab">
                The LATCH Sorter lab lets you organize the same data 5 ways and see how the user experience changes.
            </Callout>
        </div>
    );
}

// ============= LAB 1: LATCH SORTER =============
function LabLATCH() {
    const [method, setMethod] = useState('C');
    const items = useMemo(() => [
        { name: 'Notion', cat: 'Productivity', founded: 2016, country: 'USA', arr: 400 },
        { name: 'Figma', cat: 'Design', founded: 2012, country: 'USA', arr: 600 },
        { name: 'Linear', cat: 'Productivity', founded: 2019, country: 'USA', arr: 100 },
        { name: 'Slack', cat: 'Communication', founded: 2013, country: 'USA', arr: 1500 },
        { name: 'Zoho', cat: 'Suite', founded: 1996, country: 'India', arr: 1200 },
        { name: 'Razorpay', cat: 'Fintech', founded: 2014, country: 'India', arr: 250 },
        { name: 'Freshworks', cat: 'CRM', founded: 2010, country: 'India', arr: 600 },
        { name: 'Stripe', cat: 'Fintech', founded: 2010, country: 'USA', arr: 14000 },
        { name: 'Canva', cat: 'Design', founded: 2013, country: 'Australia', arr: 2200 },
        { name: 'Atlassian', cat: 'Productivity', founded: 2002, country: 'Australia', arr: 4400 },
        { name: 'Airtable', cat: 'Productivity', founded: 2012, country: 'USA', arr: 250 },
        { name: 'Miro', cat: 'Design', founded: 2011, country: 'Netherlands', arr: 350 },
    ], []);

    const sorted = useMemo(() => {
        const a = [...items];
        switch (method) {
            case 'L': return a.sort((x, y) => x.country.localeCompare(y.country));
            case 'A': return a.sort((x, y) => x.name.localeCompare(y.name));
            case 'T': return a.sort((x, y) => x.founded - y.founded);
            case 'C': return a.sort((x, y) => x.cat.localeCompare(y.cat));
            case 'H': return a.sort((x, y) => y.arr - x.arr);
            default: return a;
        }
    }, [method, items]);

    const groupBy = (method === 'L' ? 'country' : method === 'C' ? 'cat' : null) as 'country' | 'cat' | null;
    const grouped = groupBy ? sorted.reduce((acc: Record<string, any[]>, item) => { (acc[item[groupBy]] = acc[item[groupBy]] || []).push(item); return acc; }, {} as Record<string, any[]>) : null;

    const insights = {
        L: 'Location works when geography matters. Notice India, USA, and Australia each form natural clusters.',
        A: 'Alphabetical is the most familiar — but it answers no question. Useful only when users know the exact name.',
        T: 'Time reveals trends — Zoho is a 30-year veteran while Linear is a 5-year challenger.',
        C: 'Category groups similar tools. The most common SaaS pattern. Notice "Productivity" dominates.',
        H: 'Hierarchy by ARR shows scale — Stripe dwarfs everyone. Best for "which is biggest/best/most?"',
    };

    return (
        <div>
            <ChapterHeader tag="Lab 1" title="LATCH Sorter" subtitle="The same 12 SaaS companies, organized 5 ways. Click each method to see how meaning changes." />
            <Card accent>
                <H3>Pick a method</H3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {[
                        { k: 'L', n: 'Location', sub: 'Country' },
                        { k: 'A', n: 'Alphabet', sub: 'Name' },
                        { k: 'T', n: 'Time', sub: 'Founded' },
                        { k: 'C', n: 'Category', sub: 'Type' },
                        { k: 'H', n: 'Hierarchy', sub: 'ARR' },
                    ].map(opt => (
                        <button
                            key={opt.k}
                            onClick={() => setMethod(opt.k)}
                            style={{
                                padding: 10,
                                background: method === opt.k ? theme.rose : theme.white,
                                color: method === opt.k ? theme.white : theme.text,
                                border: `1px solid ${method === opt.k ? theme.rose : theme.border}`,
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontSize: 12,
                                fontWeight: 600
                            }}
                        >
                            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{opt.k}</div>
                            <div>{opt.n}</div>
                            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{opt.sub}</div>
                        </button>
                    ))}
                </div>
            </Card>

            <Callout icon={Lightbulb} title="Insight">{insights[method]}</Callout>

            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, marginTop: 16 }}>
                {grouped ? (
                    Object.entries(grouped).map(([k, arr]) => (
                        <div key={k} style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: theme.rose, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{k}</div>
                            {arr.map(item => <ItemRow key={item.name} item={item} method={method} />)}
                        </div>
                    ))
                ) : (
                    sorted.map(item => <ItemRow key={item.name} item={item} method={method} />)
                )}
            </div>

            <Callout icon={Award} title="Try this">
                For your own SaaS: write down what your user wants to know first. That question maps to one of these 5 methods. That's your primary IA scheme.
            </Callout>
        </div>
    );
}

function ItemRow({ item, method }: { item: any, method: string }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 16, padding: 10, borderBottom: `1px dashed ${theme.border}`, alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{item.name}</div>
            <div style={{ fontSize: 12, color: method === 'C' ? theme.rose : theme.textMuted, fontWeight: method === 'C' ? 600 : 400 }}>{item.cat}</div>
            <div style={{ fontSize: 12, color: method === 'T' ? theme.rose : theme.textMuted, fontWeight: method === 'T' ? 600 : 400 }}>{item.founded}</div>
            <div style={{ fontSize: 12, color: method === 'H' ? theme.rose : theme.textMuted, fontWeight: method === 'H' ? 600 : 400, minWidth: 60, textAlign: 'right' }}>${item.arr}M</div>
        </div>
    );
}

// ============= CHAPTER 6 =============
function Chapter6() {
    return (
        <div>
            <ChapterHeader tag="Chapter 6" title="Strategies & methods" subtitle="The IA toolkit: card sorting, tree testing, content audits, mental models, and more — when to use each." />

            <H2>Card sorting</H2>
            <P>Users group cards how <em>they</em> think makes sense. Reveals their mental model, not yours.</P>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                    { type: 'Open', desc: 'Users create their own categories', when: 'Discovery — when you don\'t know how users think' },
                    { type: 'Closed', desc: 'Users sort into pre-defined categories', when: 'Validating an existing structure' },
                    { type: 'Hybrid', desc: 'Mix of both — some predefined + some user-created', when: 'When you have a partial structure' },
                ].map((c, i) => (
                    <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16 }}>
                        <Tag>{c.type}</Tag>
                        <div style={{ fontSize: 14, color: theme.text, marginTop: 10, lineHeight: 1.5 }}>{c.desc}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 8, lineHeight: 1.5 }}>{c.when}</div>
                    </div>
                ))}
            </div>
            <Callout icon={Target} title="Sample size">NN/g recommends 15 participants. Tullis & Wood (2004) found r=0.95 between n=30 and full dataset. 20+ for higher stakes.</Callout>

            <H2>Tree testing — the validation method</H2>
            <P>Strip your IA to a text-only tree. Give users tasks. Measure success rate, directness, first-click. The most reliable way to validate IA before investing in UI.</P>
            <Bullet items={[
                'Sample: 50+ for quantitative confidence',
                'NN/g insight: first click is the strongest predictor of task success (87% vs 46% if first click is wrong)',
                'Tools: Treejack, UXtweak (free), Lyssna, Maze',
                'Run tree tests before any high-fidelity design work',
            ]} />

            <H2>Other key methods</H2>
            <Card>
                <H3>Content audit & inventory</H3>
                <P>Quantitative catalog (URL, title, type, owner, date) + qualitative judgment (ROT: Redundant/Outdated/Trivial). You can't organize what you haven't catalogued.</P>
            </Card>
            <Card>
                <H3>Mental models mapping (Indi Young)</H3>
                <P>Diagram users' tasks/feelings as vertical "towers." Align your features below the line. Gaps = opportunities.</P>
            </Card>
            <Card>
                <H3>Faceted classification (Ranganathan-derived)</H3>
                <P>Items classified along multiple independent dimensions. Powers e-commerce filters, Linear's filter chips, Slack's search modifiers.</P>
            </Card>
            <Card>
                <H3>Progressive disclosure</H3>
                <P>Don't show everything at once. Reveal complexity as users need it. Hierarchical (Figma's right panel) or sequential (multi-step wizard).</P>
            </Card>
            <Card>
                <H3>First-click testing</H3>
                <P>Show a screen, ask "where would you click to do X?" — Bailey & Wolfson: first-click correct doubles task success.</P>
            </Card>
        </div>
    );
}

// ============= LAB 2: CARD SORT =============
function LabCardSort() {
    const initialCards = [
        'Login', 'Sign up', 'Forgot password', 'Profile', 'Settings', 'Notifications',
        'Billing', 'Plans', 'Invoices', 'Team members', 'Roles', 'API keys',
        'Dashboard', 'Reports', 'Analytics', 'Export data', 'Help center', 'Contact support'
    ];

    const [unsorted, setUnsorted] = useState(initialCards);
    const [groups, setGroups] = useState([
        { name: 'Account', cards: [] },
        { name: 'Workspace', cards: [] },
        { name: 'Help', cards: [] },
    ]);
    const [draggedCard, setDraggedCard] = useState(null);
    const [draggedFrom, setDraggedFrom] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');

    const moveCard = (card: string, fromIdx: any, toIdx: any) => {
        const fromArr = fromIdx === 'unsorted' ? unsorted : groups[fromIdx].cards;
        if (!fromArr.includes(card)) return;

        if (fromIdx === 'unsorted') {
            setUnsorted(unsorted.filter(c => c !== card));
        } else {
            setGroups(groups.map((g, i) => i === fromIdx ? { ...g, cards: g.cards.filter(c => c !== card) } : g));
        }

        if (toIdx === 'unsorted') {
            setUnsorted(prev => [...prev, card]);
        } else {
            setGroups(prev => prev.map((g, i) => i === toIdx ? { ...g, cards: [...g.cards, card] } : g));
        }
    };

    const handleDrop = (toIdx: any) => {
        if (draggedCard !== null && draggedFrom !== null) {
            moveCard(draggedCard, draggedFrom, toIdx);
            setDraggedCard(null);
            setDraggedFrom(null);
        }
    };

    const addGroup = () => {
        if (newGroupName.trim()) {
            setGroups([...groups, { name: newGroupName.trim(), cards: [] }]);
            setNewGroupName('');
        }
    };

    const reset = () => {
        setUnsorted(initialCards);
        setGroups([
            { name: 'Account', cards: [] },
            { name: 'Workspace', cards: [] },
            { name: 'Help', cards: [] },
        ]);
    };

    const sortedCount = groups.reduce((sum, g) => sum + g.cards.length, 0);
    const totalCount = initialCards.length;

    return (
        <div>
            <ChapterHeader tag="Lab 2" title="Card Sorting Simulator" subtitle="Drag features into groups that make sense. Try to put yourself in a user's shoes — there's no single right answer." />
            <Callout icon={Lightbulb} title="How to play">
                Drag cards from "Unsorted" into the groups. Add new groups if needed. Compare your result with the suggested grouping below when you're done.
            </Callout>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 8, background: theme.rosePale, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(sortedCount / totalCount) * 100}%`, height: '100%', background: theme.rose, transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{sortedCount} / {totalCount} sorted</div>
                <button onClick={reset} style={btnSecondary}><Shuffle size={14} />Reset</button>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop('unsorted')}
                style={{ background: theme.white, border: `2px dashed ${theme.borderDark}`, borderRadius: 12, padding: 16, marginBottom: 16, minHeight: 80 }}
            >
                <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Unsorted ({unsorted.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {unsorted.map(card => (
                        <div
                            key={card}
                            draggable
                            onDragStart={() => { setDraggedCard(card); setDraggedFrom('unsorted'); }}
                            style={{
                                padding: '8px 14px', background: theme.rosePale, color: theme.roseDark,
                                borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'grab',
                                border: `1px solid ${theme.rose}40`,
                                userSelect: 'none'
                            }}
                        >
                            {card}
                        </div>
                    ))}
                    {unsorted.length === 0 && <div style={{ fontSize: 13, color: theme.textLight, fontStyle: 'italic' }}>All sorted! Compare with suggested grouping below.</div>}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {groups.map((g, idx) => (
                    <div
                        key={idx}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(idx)}
                        style={{
                            background: theme.white, border: `1px solid ${theme.border}`,
                            borderTop: `3px solid ${theme.rose}`,
                            borderRadius: 10, padding: 14, minHeight: 140
                        }}
                    >
                        <div style={{ fontSize: 13, fontWeight: 700, color: theme.rose, marginBottom: 10 }}>{g.name} ({g.cards.length})</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {g.cards.map(card => (
                                <div
                                    key={card}
                                    draggable
                                    onDragStart={() => { setDraggedCard(card); setDraggedFrom(idx); }}
                                    style={{ padding: '6px 12px', background: theme.rosePaler, color: theme.text, borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'grab', border: `1px solid ${theme.border}` }}
                                >
                                    {card}
                                </div>
                            ))}
                            {g.cards.length === 0 && <div style={{ fontSize: 12, color: theme.textLight, fontStyle: 'italic', padding: '4px 0' }}>Drop cards here</div>}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <input
                    type="text"
                    placeholder="New group name…"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                    style={{ flex: 1, padding: '10px 14px', border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                />
                <button onClick={addGroup} style={btnPrimary}><Plus size={14} />Add group</button>
            </div>

            {sortedCount === totalCount && (
                <Callout icon={Award} title="Done! Here's a typical grouping" kind="success">
                    <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                        <strong>Account</strong>: Login, Sign up, Forgot password, Profile, Notifications<br />
                        <strong>Workspace</strong>: Dashboard, Reports, Analytics, Export data, Team members, Roles<br />
                        <strong>Billing</strong>: Plans, Invoices<br />
                        <strong>Developer</strong>: API keys, Settings<br />
                        <strong>Help</strong>: Help center, Contact support
                        <div style={{ marginTop: 10, fontSize: 12, fontStyle: 'italic' }}>There's no single right answer — different products and audiences will sort differently. That's why card sorting matters.</div>
                    </div>
                </Callout>
            )}
        </div>
    );
}

// ============= LAB 3: TREE TEST =============
function LabTreeTest() {
    const tree = {
        name: 'Home',
        children: [
            { name: 'Dashboard', children: [{ name: 'Overview' }, { name: 'Analytics' }, { name: 'Reports' }] },
            {
                name: 'Workspace', children: [
                    { name: 'Projects' }, { name: 'Documents' },
                    { name: 'Team', children: [{ name: 'Members' }, { name: 'Roles & permissions' }, { name: 'Invitations' }] },
                ]
            },
            {
                name: 'Settings', children: [
                    { name: 'Profile' }, { name: 'Notifications' },
                    { name: 'Billing', children: [{ name: 'Plan' }, { name: 'Invoices' }, { name: 'Payment methods' }] },
                    { name: 'API & integrations', children: [{ name: 'API keys' }, { name: 'Webhooks' }] },
                ]
            },
            { name: 'Help', children: [{ name: 'Help center' }, { name: 'Contact us' }] },
        ]
    };

    const tasks = [
        { q: 'You want to invite a new teammate to your workspace.', correct: ['Workspace', 'Team', 'Invitations'] },
        { q: 'You need to download an invoice from last month.', correct: ['Settings', 'Billing', 'Invoices'] },
        { q: 'You want to generate a new API key for your integration.', correct: ['Settings', 'API & integrations', 'API keys'] },
        { q: 'You want to see how your team performed this week.', correct: ['Dashboard', 'Reports'] },
    ];

    const [taskIdx, setTaskIdx] = useState(0);
    const [path, setPath] = useState([]);
    const [results, setResults] = useState([]);
    const [done, setDone] = useState(false);

    const findNode = (path: string[]) => {
        let node: any = tree;
        for (const name of path) {
            node = node.children?.find(c => c.name === name);
            if (!node) return null;
        }
        return node;
    };

    const currentNode = findNode(path) || tree;
    const task = tasks[taskIdx];

    const submit = () => {
        const correct = JSON.stringify(path) === JSON.stringify(task.correct);
        const newResults = [...results, { task: task.q, path: [...path], correct, correctPath: task.correct }];
        setResults(newResults);
        if (taskIdx + 1 >= tasks.length) {
            setDone(true);
        } else {
            setTaskIdx(taskIdx + 1);
            setPath([]);
        }
    };

    const reset = () => {
        setTaskIdx(0);
        setPath([]);
        setResults([]);
        setDone(false);
    };

    const successRate = results.length > 0 ? Math.round((results.filter(r => r.correct).length / results.length) * 100) : 0;

    if (done) {
        return (
            <div>
                <ChapterHeader tag="Lab 3" title="Tree Test Results" subtitle="See how you navigated this IA — and where you got lost." />
                <Card accent>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: theme.rose }}>{successRate}%</div>
                            <div style={{ fontSize: 12, color: theme.textMuted }}>Success rate</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: theme.rose }}>{results.filter(r => r.correct).length}/{results.length}</div>
                            <div style={{ fontSize: 12, color: theme.textMuted }}>Correct paths</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: theme.rose }}>{tasks.length}</div>
                            <div style={{ fontSize: 12, color: theme.textMuted }}>Tasks completed</div>
                        </div>
                    </div>
                </Card>
                {results.map((r, i) => (
                    <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 16, marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            {r.correct ? <CheckCircle2 size={18} color={theme.success} /> : <XCircle size={18} color={theme.danger} />}
                            <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Task {i + 1}</div>
                        </div>
                        <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 8 }}>{r.task}</div>
                        <div style={{ fontSize: 12, color: theme.text }}><strong>Your path:</strong> {r.path.join(' → ') || '(none)'}</div>
                        {!r.correct && <div style={{ fontSize: 12, color: theme.success, marginTop: 4 }}><strong>Expected:</strong> {r.correctPath.join(' → ')}</div>}
                    </div>
                ))}
                <Callout icon={Lightbulb} title="What this means">
                    In a real tree test you'd run this with 50+ users. Tasks below 60% success indicate IA problems. NN/g recommends ≥70% directness on critical flows before launching.
                </Callout>
                <button onClick={reset} style={{ ...btnPrimary, marginTop: 16 }}><Shuffle size={14} />Run again</button>
            </div>
        );
    }

    return (
        <div>
            <ChapterHeader tag="Lab 3" title="Tree Test Simulator" subtitle="A real tree test gives users a tree (no UI) and asks them to find things. Try 4 tasks below." />
            <Card accent>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Tag>Task {taskIdx + 1} of {tasks.length}</Tag>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: theme.text, lineHeight: 1.5 }}>{task.q}</div>
            </Card>

            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, marginTop: 16 }}>
                <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Path: {path.length === 0 ? <span style={{ color: theme.textLight }}>(at root)</span> : path.join(' → ')}
                </div>
                {path.length > 0 && (
                    <button onClick={() => setPath(path.slice(0, -1))} style={{ ...btnSecondary, marginBottom: 12 }}>
                        <ChevronLeft size={14} /> Back
                    </button>
                )}
                <div style={{ display: 'grid', gap: 6 }}>
                    {(currentNode.children || []).map((child, i) => {
                        const hasChildren = child.children && child.children.length > 0;
                        return (
                            <button
                                key={i}
                                onClick={() => hasChildren ? setPath([...path, child.name]) : setPath([...path, child.name])}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 16px', background: theme.rosePaler, border: `1px solid ${theme.border}`,
                                    borderRadius: 8, cursor: 'pointer', fontSize: 14, color: theme.text, fontWeight: 500,
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = theme.rosePale}
                                onMouseLeave={(e) => e.currentTarget.style.background = theme.rosePaler}
                            >
                                <span>{child.name}</span>
                                {hasChildren ? <ChevronRight size={16} color={theme.textMuted} /> : <Tag color="green">Leaf</Tag>}
                            </button>
                        );
                    })}
                </div>
                {!currentNode.children && (
                    <div style={{ marginTop: 16, padding: 16, background: theme.rosePale, borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 14, color: theme.text, marginBottom: 12 }}>You've reached a leaf. Submit if this is your answer.</div>
                        <button onClick={submit} style={btnPrimary}>Submit answer <ArrowRight size={14} /></button>
                    </div>
                )}
                {currentNode.children && path.length > 0 && (
                    <button onClick={submit} style={{ ...btnPrimary, marginTop: 16, width: '100%', justifyContent: 'center' }}>
                        I'd stop here — submit this path
                    </button>
                )}
            </div>
        </div>
    );
}

// ============= CHAPTER 7 =============
function Chapter7() {
    return (
        <div>
            <ChapterHeader tag="Chapter 7" title="Navigation patterns" subtitle="The 10 patterns every SaaS designer should know — when to use each, when to avoid them." />
            <H2>The 10 patterns</H2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {[
                    { name: 'Hub & spoke', desc: 'Central screen launches into independent silos. iPhone home screen is the archetype.', good: 'Task-focused mobile apps' },
                    { name: 'Tabbed', desc: 'Switch between alternate views of the same object. Stripe customer page.', good: 'Different facets of same data' },
                    { name: 'Nested doll', desc: 'Progressively reveal deeper levels via tap. iOS Settings.', good: 'Strong sense of place' },
                    { name: 'Bento box', desc: 'Multiple panels showing related content. Stripe Dashboard home.', good: 'At-a-glance overviews' },
                    { name: 'Filtered/faceted', desc: 'Same content, narrowed by user-selected filters. Linear filter chips.', good: 'Large content sets' },
                    { name: 'Hierarchical/tree', desc: 'Classic file-manager. Notion sidebar. Slack channel sections.', good: 'User-generated content' },
                    { name: 'Hamburger menu', desc: 'Hidden nav behind icon. Use sparingly — cuts discoverability ~50% (NN/g).', good: 'Mobile only, last resort' },
                    { name: 'Bottom navigation', desc: '3–5 tabs at the bottom on mobile. Material Design standard.', good: 'Mobile primary nav' },
                    { name: 'Sidebar (persistent)', desc: 'Always-visible vertical nav. The B2B SaaS standard.', good: 'Desktop SaaS' },
                    { name: 'Command palette (Cmd+K)', desc: 'Single text box, navigation + action. Linear, Figma, Stripe.', good: 'Power users + scaling features' },
                ].map((p, i) => (
                    <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 6 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</div>
                        <Tag color="green">Best for: {p.good}</Tag>
                    </div>
                ))}
            </div>

            <H2>Why Cmd+K won SaaS in 2020+</H2>
            <P>The pattern crossed from code editors (Sublime Text → VS Code) into SaaS via Superhuman, Linear, Notion, Slack, Stripe, Figma. Five reasons it dominated:</P>
            <Bullet items={[
                'Flexibility — single entry point for any feature',
                'Speed — keyboard-only, no mouse',
                'Discoverability — searching surfaces features users wouldn\'t find via menus',
                'Scales infinitely — features that don\'t deserve a button can still exist',
                'AI-friendly — natural language pairs with intent routing',
            ]} />

            <H2>Breadcrumbs: the cheapest IA win</H2>
            <P>NN/g has recommended breadcrumbs since 1995. Best cost/benefit in IA — they don't hurt users who ignore them and meaningfully help users who use them. Always show location-based breadcrumbs (not path-based).</P>
        </div>
    );
}

// ============= LAB 4: NAV PATTERNS =============
function LabNavPatterns() {
    const [pattern, setPattern] = useState('sidebar');

    const renderMockup = () => {
        switch (pattern) {
            case 'sidebar': return <SidebarMockup />;
            case 'tabs': return <TabsMockup />;
            case 'hub': return <HubMockup />;
            case 'bento': return <BentoMockup />;
            case 'cmdk': return <CmdKMockup />;
            case 'bottom': return <BottomNavMockup />;
            default: return null;
        }
    };

    const info = {
        sidebar: { title: 'Persistent sidebar', desc: 'The B2B SaaS standard. Workspace switcher top, sections middle, system actions bottom.', examples: 'Notion, Linear, Slack, Stripe' },
        tabs: { title: 'Tabbed navigation', desc: 'Switch between facets of the same object. Don\'t exceed ~7 tabs.', examples: 'Stripe customer page, Linear issue page' },
        hub: { title: 'Hub & spoke', desc: 'Central screen → silos. Strong for mobile task apps.', examples: 'iPhone home screen, Zoho One launcher' },
        bento: { title: 'Bento box dashboard', desc: 'Multiple panels showing related data at a glance. Cap at 12–15 visible tiles.', examples: 'Stripe Dashboard home, Notion Home' },
        cmdk: { title: 'Command palette (Cmd+K)', desc: 'Single text box for navigation + actions. The 2020+ SaaS standard.', examples: 'Linear, Figma, Notion, Raycast' },
        bottom: { title: 'Bottom navigation (mobile)', desc: '3–5 destinations. Top-level only — never actions. Tap active tab = scroll to top.', examples: 'Instagram, Twitter/X, banking apps' },
    };

    return (
        <div>
            <ChapterHeader tag="Lab 4" title="Pattern Explorer" subtitle="Click each navigation pattern to see a live mockup and learn when to use it." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6, marginBottom: 16 }}>
                {[
                    { k: 'sidebar', n: 'Sidebar' },
                    { k: 'tabs', n: 'Tabs' },
                    { k: 'bento', n: 'Bento' },
                    { k: 'cmdk', n: 'Cmd+K' },
                    { k: 'hub', n: 'Hub' },
                    { k: 'bottom', n: 'Bottom nav' },
                ].map(p => (
                    <button
                        key={p.k}
                        onClick={() => setPattern(p.k)}
                        style={{
                            padding: '10px 8px',
                            background: pattern === p.k ? theme.rose : theme.white,
                            color: pattern === p.k ? theme.white : theme.text,
                            border: `1px solid ${pattern === p.k ? theme.rose : theme.border}`,
                            borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600
                        }}
                    >
                        {p.n}
                    </button>
                ))}
            </div>
            <Card accent>
                <H3>{info[pattern].title}</H3>
                <P>{info[pattern].desc}</P>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}><strong>Examples:</strong> {info[pattern].examples}</div>
                <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 10, overflow: 'hidden' }}>
                    {renderMockup()}
                </div>
            </Card>
        </div>
    );
}

function SidebarMockup() {
    const [active, setActive] = useState('Inbox');
    const items = ['Inbox', 'My Issues', 'Active', 'Backlog', 'Projects', 'Cycles'];
    return (
        <div style={{ display: 'flex', height: 280, fontSize: 12 }}>
            <div style={{ width: 160, background: theme.white, borderRight: `1px solid ${theme.border}`, padding: '12px 8px' }}>
                <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase' }}>Workspace</div>
                <div style={{ padding: '6px 8px', background: theme.rosePaler, borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Acme Corp ⌄</div>
                <div style={{ height: 8 }} />
                {items.map(i => (
                    <button key={i} onClick={() => setActive(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '5px 8px', background: active === i ? theme.rosePale : 'transparent', border: 'none', borderRadius: 6, fontSize: 11, color: active === i ? theme.roseDark : theme.text, fontWeight: active === i ? 600 : 400, cursor: 'pointer', marginBottom: 1 }}>{i}</button>
                ))}
            </div>
            <div style={{ flex: 1, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{active}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Persistent left rail. Click items.</div>
            </div>
        </div>
    );
}
function TabsMockup() {
    const [tab, setTab] = useState('Overview');
    const tabs = ['Overview', 'Payments', 'Subscriptions', 'Invoices'];
    return (
        <div style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Customer · maya@acme.com</div>
            <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${theme.border}`, marginTop: 12 }}>
                {tabs.map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 14px', background: 'transparent', border: 'none', borderBottom: tab === t ? `2px solid ${theme.rose}` : '2px solid transparent', fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? theme.rose : theme.textMuted, cursor: 'pointer' }}>{t}</button>
                ))}
            </div>
            <div style={{ padding: 20, fontSize: 12, color: theme.textMuted }}>Content for "{tab}" — same object, different facet.</div>
        </div>
    );
}
function HubMockup() {
    const apps = ['Mail', 'Calendar', 'Tasks', 'Files', 'Chat', 'Reports', 'Analytics', 'Admin', 'Help'];
    return (
        <div style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>One launcher → 9 silo apps</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 280, margin: '0 auto' }}>
                {apps.map(a => (
                    <div key={a} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, padding: '16px 8px', cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, background: theme.rosePale, borderRadius: 8, margin: '0 auto 8px' }} />
                        <div style={{ fontSize: 11, fontWeight: 600 }}>{a}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
function BentoMockup() {
    return (
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto auto', gap: 8 }}>
            <div style={{ background: theme.rosePale, borderRadius: 8, padding: 12, gridColumn: 'span 2' }}>
                <div style={{ fontSize: 10, color: theme.roseDark, fontWeight: 700 }}>REVENUE</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>$48.2k</div>
                <div style={{ height: 30, background: 'linear-gradient(90deg, transparent 0%, transparent 70%, #C2185B 100%)', marginTop: 6, borderRadius: 4 }} />
            </div>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 700 }}>USERS</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>1,284</div>
            </div>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 700 }}>MRR</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>+12%</div>
            </div>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 700 }}>CHURN</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>2.1%</div>
            </div>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 700 }}>NPS</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>62</div>
            </div>
        </div>
    );
}
function CmdKMockup() {
    const [q, setQ] = useState('');
    const all = [
        { name: 'Create new issue', kind: 'Action', shortcut: 'C' },
        { name: 'Create new project', kind: 'Action', shortcut: 'P' },
        { name: 'Go to Inbox', kind: 'Navigate', shortcut: 'G→I' },
        { name: 'Go to My Issues', kind: 'Navigate', shortcut: 'G→M' },
        { name: 'Assign to me', kind: 'Action', shortcut: 'I' },
        { name: 'Set priority', kind: 'Action', shortcut: 'P' },
        { name: 'Search docs', kind: 'Search', shortcut: '' },
        { name: 'Switch workspace', kind: 'Action', shortcut: '' },
    ];
    const filtered = all.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
    return (
        <div style={{ padding: 20, minHeight: 280 }}>
            <div style={{ background: theme.white, border: `1px solid ${theme.borderDark}`, borderRadius: 12, overflow: 'hidden', maxWidth: 480, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                    <Search size={16} color={theme.textMuted} />
                    <input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Type a command or search…"
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14 }}
                        autoFocus
                    />
                    <Tag color="gray">⌘K</Tag>
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {filtered.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', fontSize: 13, borderBottom: i < filtered.length - 1 ? `1px solid ${theme.border}` : 'none', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Tag color={item.kind === 'Action' ? 'rose' : item.kind === 'Navigate' ? 'green' : 'gray'}>{item.kind}</Tag>
                                <span>{item.name}</span>
                            </div>
                            {item.shortcut && <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: 'monospace' }}>{item.shortcut}</span>}
                        </div>
                    ))}
                    {filtered.length === 0 && <div style={{ padding: 16, fontSize: 12, color: theme.textMuted, textAlign: 'center' }}>No results</div>}
                </div>
            </div>
        </div>
    );
}
function BottomNavMockup() {
    const [tab, setTab] = useState('Home');
    const tabs = [
        { name: 'Home', icon: Home }, { name: 'Search', icon: Search }, { name: 'Inbox', icon: Box }, { name: 'Profile', icon: Users }
    ];
    return (
        <div style={{ padding: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 200, height: 280, background: theme.white, border: `1px solid ${theme.borderDark}`, borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, padding: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{tab}</div>
                    <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Mobile bottom nav — tap icons.</div>
                </div>
                <div style={{ display: 'flex', borderTop: `1px solid ${theme.border}` }}>
                    {tabs.map(t => {
                        const Ic = t.icon;
                        return (
                            <button key={t.name} onClick={() => setTab(t.name)} style={{ flex: 1, padding: 10, background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
                                <Ic size={16} color={tab === t.name ? theme.rose : theme.textMuted} />
                                <span style={{ fontSize: 9, color: tab === t.name ? theme.rose : theme.textMuted, fontWeight: tab === t.name ? 600 : 400 }}>{t.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ============= CHAPTER 8 =============
function Chapter8() {
    return (
        <div>
            <ChapterHeader tag="Chapter 8" title="IA for SaaS / dashboards" subtitle="What makes SaaS IA different — and the patterns every founder should know." />
            <H2>Why SaaS IA is different</H2>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {[
                    ['Primary unit', 'Page or product', 'Object the user creates'],
                    ['Nav source', 'CMS taxonomy', 'User content + system nav'],
                    ['Search', 'Keywords over corpus', 'Multi-entity (objects + commands)'],
                    ['State', 'Mostly stateless', 'Stateful: workspace, mode, role'],
                    ['Primary metric', 'Findability', 'Time-to-action / keyboard speed'],
                    ['Empty state', 'Rare', 'Core IA surface — teaches structure'],
                ].map(([label, content, saas], i, arr) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 16, padding: 12, borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none', alignItems: 'center' }}>
                        <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 13, color: theme.textMuted }}>{content}</div>
                        <div style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{saas}</div>
                    </div>
                ))}
            </div>

            <H2>Settings: Stripe's three-bucket pattern</H2>
            <P>The cleanest pattern in SaaS. Don't mix billing into the same screen as notification preferences.</P>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                    { name: 'Personal', desc: 'Profile, notifications, 2FA, communication preferences', who: 'Per-human, follows you across accounts' },
                    { name: 'Account', desc: 'Business details, branding, team & roles, payouts', who: 'Per-workspace' },
                    { name: 'Product', desc: 'Per-feature config (Billing, Tax, Radar, Connect)', who: 'Per-product module' },
                ].map((b, i) => (
                    <Card key={i} accent>
                        <Tag>{i + 1}</Tag>
                        <H3>{b.name}</H3>
                        <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{b.desc}</div>
                        <div style={{ fontSize: 11, color: theme.rose, marginTop: 8, fontWeight: 600 }}>{b.who}</div>
                    </Card>
                ))}
            </div>

            <H2>Pick your primitive first</H2>
            <P>Everything cascades from this single decision.</P>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {[
                    { product: 'Notion', primitive: 'Page', impl: 'Pages contain blocks; pages contain pages infinitely' },
                    { product: 'Linear', primitive: 'Issue', impl: 'Flat list, organized by team. Cycles/Projects = filters' },
                    { product: 'Figma', primitive: 'File', impl: 'Files in Projects in Teams; spatial canvas inside file' },
                    { product: 'Slack', primitive: 'Message', impl: 'Channel = persistent container; thread = sub-conversation' },
                    { product: 'Stripe', primitive: 'Resource', impl: 'Payment, Customer, Subscription — multi-product CRUD' },
                ].map((p, i, arr) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', gap: 16, padding: 12, borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none', alignItems: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{p.product}</div>
                        <Tag>{p.primitive}</Tag>
                        <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>{p.impl}</div>
                    </div>
                ))}
            </div>

            <H2>10 SaaS IA takeaways</H2>
            <Bullet items={[
                'Pick your primitive first (page / issue / file / record / message)',
                'Three-bucket settings: Personal / Account / Product',
                'Workspace switcher always top-left with chevron',
                'Build a command palette early (cmdk, kbar, ninja-keys libraries)',
                'Empty state = first IA touchpoint. Replace blank screens with templates',
                'Limit visible hierarchy to 4 levels',
                'Role-based nav: hide rather than gray-out',
                'Sidebar grouping: Quick links → Personal → Shared → Private',
                'Test/sandbox: prefer isolated tenants over global toggles',
                'Search modifiers (in:, from:, has:) reveal your entity model',
            ]} />
        </div>
    );
}

// ============= LAB 5: SITEMAP BUILDER =============
function LabSitemap() {
    const [nodes, setNodes] = useState([
        { id: 1, parent: null, label: 'Home', level: 0 },
        { id: 2, parent: 1, label: 'Dashboard', level: 1 },
        { id: 3, parent: 1, label: 'Workspace', level: 1 },
        { id: 4, parent: 1, label: 'Settings', level: 1 },
        { id: 5, parent: 3, label: 'Projects', level: 2 },
        { id: 6, parent: 3, label: 'Documents', level: 2 },
        { id: 7, parent: 4, label: 'Profile', level: 2 },
        { id: 8, parent: 4, label: 'Billing', level: 2 },
    ]);
    const [nextId, setNextId] = useState(9);
    const [selected, setSelected] = useState(null);
    const [newLabel, setNewLabel] = useState('');

    const addNode = (parentId) => {
        if (!newLabel.trim()) return;
        const parent = nodes.find(n => n.id === parentId);
        setNodes([...nodes, { id: nextId, parent: parentId, label: newLabel.trim(), level: parent ? parent.level + 1 : 0 }]);
        setNextId(nextId + 1);
        setNewLabel('');
    };

    const deleteNode = (id) => {
        const toDelete = new Set();
        const walk = (nid) => {
            toDelete.add(nid);
            nodes.filter(n => n.parent === nid).forEach(c => walk(c.id));
        };
        walk(id);
        setNodes(nodes.filter(n => !toDelete.has(n.id)));
        if (selected === id) setSelected(null);
    };

    const renderTree = (parentId: number | null = null): React.ReactNode[] => {
        const children = nodes.filter(n => n.parent === parentId);
        return children.map(node => (
            <div key={node.id} style={{ paddingLeft: node.level * 20 }}>
                <div
                    onClick={() => setSelected(node.id)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', margin: '3px 0',
                        background: selected === node.id ? theme.rosePale : theme.white,
                        border: `1px solid ${selected === node.id ? theme.rose : theme.border}`,
                        borderRadius: 8, cursor: 'pointer'
                    }}
                >
                    <Tag color="gray">L{node.level}</Tag>
                    <div style={{ fontSize: 13, fontWeight: 500, color: theme.text, flex: 1 }}>{node.label}</div>
                    {nodes.filter(n => n.parent === node.id).length > 0 && <span style={{ fontSize: 10, color: theme.textMuted }}>{nodes.filter(n => n.parent === node.id).length} children</span>}
                    {node.parent !== null && (
                        <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} style={{ ...btnIcon, padding: 4 }}><Trash2 size={12} color={theme.danger} /></button>
                    )}
                </div>
                {renderTree(node.id)}
            </div>
        ));
    };

    const maxDepth = Math.max(...nodes.map(n => n.level));
    const totalNodes = nodes.length;
    const topLevel = nodes.filter(n => n.level === 1).length;

    return (
        <div>
            <ChapterHeader tag="Lab 5" title="Sitemap Builder" subtitle="Build a sitemap for your SaaS. Click a node, add children. Watch the depth and breadth metrics." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                <Card>
                    <div style={{ fontSize: 11, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Total nodes</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: theme.rose, marginTop: 4 }}>{totalNodes}</div>
                </Card>
                <Card>
                    <div style={{ fontSize: 11, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Top-level items</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: theme.rose, marginTop: 4 }}>{topLevel}</div>
                    <div style={{ fontSize: 11, color: topLevel > 9 ? theme.danger : theme.textMuted, marginTop: 4 }}>{topLevel > 9 ? 'Too many — Miller\'s 7±2' : 'Within Miller\'s law'}</div>
                </Card>
                <Card>
                    <div style={{ fontSize: 11, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Max depth</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: theme.rose, marginTop: 4 }}>{maxDepth}</div>
                    <div style={{ fontSize: 11, color: maxDepth > 4 ? theme.danger : theme.success, marginTop: 4 }}>{maxDepth > 4 ? 'Too deep — flatten!' : 'Healthy'}</div>
                </Card>
            </div>

            {selected !== null && (
                <Card accent>
                    <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>
                        Add child to: <strong>{nodes.find(n => n.id === selected)?.label}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            type="text"
                            placeholder="Page name (e.g., Reports)"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addNode(selected)}
                            style={{ flex: 1, padding: '10px 14px', border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                        />
                        <button onClick={() => addNode(selected)} style={btnPrimary}><Plus size={14} />Add child</button>
                    </div>
                </Card>
            )}
            {selected === null && <Callout icon={MousePointerClick} title="Click any node to add a child" />}

            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, marginTop: 16, maxHeight: 500, overflowY: 'auto' }}>
                {renderTree(null)}
            </div>

            <Callout icon={Lightbulb} title="IA health rules">
                <Bullet items={[
                    'Top-level: 5–9 items (Miller\'s 7±2)',
                    'Max depth: 3–4 levels for everyday navigation',
                    'Each node has a clear purpose and label',
                    'Watch for orphan branches (single child going deep)',
                ]} />
            </Callout>
        </div>
    );
}

// ============= CHAPTER 9 =============
function Chapter9() {
    const [app, setApp] = useState('notion');
    const teardowns = {
        notion: {
            name: 'Notion',
            tagline: 'Hierarchical, infinitely nested',
            primitive: 'Page',
            hierarchy: 'Org → Workspace → Teamspace → Page → Sub-page → Block',
            nav: ['Workspace switcher (top-left)', 'Search (Cmd+K)', 'Notion AI', 'Home', 'Inbox', 'Settings', 'Favorites', 'Teamspaces', 'Shared', 'Private', 'Templates', 'Trash'],
            keyDecisions: [
                'Page = primitive: every container has the same affordances',
                'Three sidebar buckets (Teamspaces / Shared / Private) make scope obvious',
                'Empty page = template chooser. Empty state IS onboarding.',
            ]
        },
        linear: {
            name: 'Linear',
            tagline: 'Flat, task-oriented, keyboard-first',
            primitive: 'Issue',
            hierarchy: 'Workspace → Team → Issues + (Projects, Cycles, Initiatives) as filters',
            nav: ['Inbox (G+I)', 'My Issues (G+M)', 'Pulse', 'Views', 'Initiatives', 'Projects (G+P)', 'Reviews', 'Favorites', 'Teams (Triage, Active, Backlog, Cycles)'],
            keyDecisions: [
                'Issue-as-primitive + flat lists = no folder paralysis',
                'Cmd+K is the universal entry — sidebar stays sparse',
                'Two-key sequences (G+I, G+M, G+T) make power users 3x faster',
            ]
        },
        figma: {
            name: 'Figma',
            tagline: 'Workspace-based, spatial canvas',
            primitive: 'File',
            hierarchy: 'Org → Workspace → Team → Project → File → Page → Frame → Layer',
            nav: ['File browser sidebar (Recents / Drafts / Teams)', 'Editor: top toolbar + left sidebar (Pages, Layers) + right sidebar (Design/Prototype/Dev) + canvas'],
            keyDecisions: [
                'File-as-primitive + spatial canvas feels like Photoshop, not Jira',
                'Team/Project shell is text-list; file interior is fully spatial',
                'Drafts isolation prevents accidental team sharing',
            ]
        },
        stripe: {
            name: 'Stripe Dashboard',
            tagline: 'Product-grouped, API-mirrored',
            primitive: 'Resource',
            hierarchy: 'Org → Account (live + sandboxes) → Resource (Customer, Product, Subscription)',
            nav: ['Account picker top-left', 'Sidebar: Home, Balances, Transactions, Customers, Catalog, Payments, Billing, Reports', 'Product modules (Connect, Tax, Issuing…)', 'More overflow', 'Developers', 'Settings'],
            keyDecisions: [
                'Sidebar mirrors API namespaces — engineers + operators share mental model',
                'Three-bucket settings: Personal / Account / Product',
                'Sandboxes-as-tenants (not toggle) prevents "I changed live" accidents',
            ]
        },
        slack: {
            name: 'Slack',
            tagline: 'Channel-based, message-primary',
            primitive: 'Message',
            hierarchy: 'Org → Workspace → Channel (public/private/shared) → Thread; DMs flat parallel',
            nav: ['Workspace rail (far left)', 'Nav bar: Home / DMs / Activity / Files', 'Sidebar: Unreads, Threads, Mentions, Channels, DMs, Apps'],
            keyDecisions: [
                'Two-level nav (tabs + sidebar) reduces cognitive load',
                'DMs as flat parallel space avoids "should this be in #channel or DM?" fatigue',
                'Search modifiers (in:, from:, has:) teach you the entity model',
            ]
        }
    };
    const t = teardowns[app];

    return (
        <div>
            <ChapterHeader tag="Chapter 9" title="App teardowns" subtitle="Reverse-engineered IA from 5 SaaS products. Click each to study its decisions." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 20 }}>
                {Object.keys(teardowns).map(key => (
                    <button
                        key={key}
                        onClick={() => setApp(key)}
                        style={{
                            padding: 12,
                            background: app === key ? theme.rose : theme.white,
                            color: app === key ? theme.white : theme.text,
                            border: `1px solid ${app === key ? theme.rose : theme.border}`,
                            borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600
                        }}
                    >
                        {teardowns[key].name}
                    </button>
                ))}
            </div>
            <Card accent>
                <div style={{ fontSize: 11, color: theme.rose, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.tagline}</div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: theme.text, margin: '6px 0 4px' }}>{t.name}</h2>
                <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 12 }}>Primitive: <strong style={{ color: theme.rose }}>{t.primitive}</strong></div>
                <div style={{ background: theme.rosePaler, padding: 12, borderRadius: 8, fontSize: 12, fontFamily: 'monospace', color: theme.text, lineHeight: 1.6 }}>
                    {t.hierarchy}
                </div>
            </Card>
            <H3>Primary navigation</H3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {t.nav.map((item, i) => (
                    <span key={i} style={{ padding: '6px 12px', background: theme.rosePaler, border: `1px solid ${theme.border}`, borderRadius: 999, fontSize: 12, color: theme.text }}>{item}</span>
                ))}
            </div>
            <H3>Key IA decisions that work</H3>
            <Bullet items={t.keyDecisions} />
            <Callout icon={Lightbulb} title="Apply this">
                For your SaaS: which of these 5 primitives is closest to your product? That answers the most important architecture question.
            </Callout>
        </div>
    );
}

// ============= CHAPTER 10 =============
function Chapter10() {
    return (
        <div>
            <ChapterHeader tag="Chapter 10" title="Tools for IA work in 2026" subtitle="What to use, what to skip, and a $0 stack for solo founders." />
            <H2>Card sorting</H2>
            <ToolTable rows={[
                ['OptimalSort', 'Pro ~$208/mo', 'Industry standard'],
                ['UXtweak', 'Free / $59+', 'Best free tier; modern UI'],
                ['Lyssna', 'Free / $75+', 'Easy all-in-one; 690K panel'],
                ['Maze', 'Free / $99+', 'AI-powered analysis'],
            ]} />
            <H2>Tree testing</H2>
            <ToolTable rows={[
                ['Treejack (Optimal)', '$208–249/mo', 'Benchmark tool'],
                ['UXtweak', 'Free', 'Best free alternative'],
                ['Lyssna', 'Free / $75+', 'Bundles with prototype tests'],
            ]} />
            <H2>Sitemaps & diagramming</H2>
            <ToolTable rows={[
                ['FigJam', 'Free / $3-5/seat', 'Workshop sitemaps'],
                ['Miro', 'Free / $8/seat', 'Big workshop boards'],
                ['Whimsical', 'Free / $10/editor', 'Fast flowcharts'],
                ['Octopus.do', 'Free / $7+/mo', 'Purpose-built for sitemaps'],
                ['Draw.io', '100% Free', 'Best zero-budget option'],
            ]} />
            <H2>Wireframing</H2>
            <ToolTable rows={[
                ['Figma', 'Free / $16/seat', 'Hi-fi'],
                ['Balsamiq Cloud', '$12+/mo', 'Lo-fi sketch wireframes'],
                ['Whimsical Wireframes', 'Free / $10', 'Quick lo-fi'],
            ]} />

            <H2>The $0/month stack for a solo founder</H2>
            <Card accent>
                <Bullet items={[
                    <span><strong>Sitemaps:</strong> Octopus.do Free or Draw.io</span>,
                    <span><strong>Card sort + tree test:</strong> UXtweak Free + ChatGPT/Claude for analysis</span>,
                    <span><strong>Diagramming:</strong> FigJam Free + Miro Free</span>,
                    <span><strong>Wireframes:</strong> Figma Free Starter + Whimsical Free</span>,
                    <span><strong>Content audit:</strong> Google Sheets + Screaming Frog Free (≤500 URLs)</span>,
                    <span><strong>Total cash outlay: ₹0/month.</strong> First paid upgrade: Figma Pro ($16) once you outgrow 3 files.</span>,
                ]} />
            </Card>
        </div>
    );
}

function ToolTable({ rows }: { rows: any[][] }) {
    return (
        <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            {rows.map(([name, price, note], i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 140px 1fr', gap: 16, padding: 12, borderBottom: i < rows.length - 1 ? `1px solid ${theme.border}` : 'none', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{name}</div>
                    <div style={{ fontSize: 12, color: theme.rose, fontWeight: 600 }}>{price}</div>
                    <div style={{ fontSize: 13, color: theme.textMuted }}>{note}</div>
                </div>
            ))}
        </div>
    );
}

// ============= CHAPTER 11 =============
function Chapter11() {
    return (
        <div>
            <ChapterHeader tag="Chapter 11" title="Books & resources" subtitle="The single best book, top 3 by use case, and curated resources to keep learning." />
            <H2>The single best book</H2>
            <Card accent>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 100, height: 140, background: theme.rose, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Book size={48} color={theme.white} />
                    </div>
                    <div>
                        <Tag>Polar Bear Book</Tag>
                        <H3>Information Architecture: For the Web and Beyond (4th ed.)</H3>
                        <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 12 }}>Rosenfeld, Morville &amp; Arango · O'Reilly · 2015 · 488 pages</div>
                        <P>The foundational text. Battle-tested across four editions and 20 years. Covers all four systems, taxonomies, controlled vocabularies, metadata, IA strategy, governance, content modeling, and cross-channel design.</P>
                    </div>
                </div>
            </Card>

            <H2>Top 3 by use case</H2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                    { tag: 'Beginner', title: 'How to Make Sense of Any Mess', author: 'Abby Covert (2014)', why: '7-step process. ~160 pages. Free online at howtomakesenseofanymess.com.' },
                    { tag: 'Practitioner', title: 'Information Architecture for the Web and Beyond', author: 'Rosenfeld/Morville/Arango', why: 'The complete reference — your desk book.' },
                    { tag: 'Theory', title: 'Pervasive Information Architecture', author: 'Resmini & Rosati (2011)', why: 'Reframes IA for cross-channel ecosystems.' },
                ].map((b, i) => (
                    <Card key={i}>
                        <Tag>{b.tag}</Tag>
                        <H3>{b.title}</H3>
                        <div style={{ fontSize: 12, color: theme.textMuted }}>{b.author}</div>
                        <div style={{ fontSize: 13, color: theme.text, marginTop: 8, lineHeight: 1.5 }}>{b.why}</div>
                    </Card>
                ))}
            </div>

            <H2>Other recommended books</H2>
            <Bullet items={[
                'Designing Connected Content — Atherton & Hane (2017)',
                'The Elements of User Experience — Jesse James Garrett (2nd ed., 2010)',
                'Communicating Design — Dan Brown (2nd ed., 2010)',
                'Living in Information — Jorge Arango (2018)',
                'Don\'t Make Me Think — Steve Krug',
                'Mental Models — Indi Young (2008)',
                'Ambient Findability — Peter Morville (2005)',
                'Understanding Context — Andrew Hinton (2014)',
            ]} />

            <H2>Online courses</H2>
            <ToolTable rows={[
                ['NN/g IA Course', '~$1,000+', 'Counts toward UX Certification'],
                ['Interaction Design Foundation', '~$16/mo', 'Most affordable full curriculum'],
                ['Coursera Google UX', '₹4,000/mo', 'Includes IA module'],
                ['IA Conference recordings', 'Free', 'YouTube + theiaconference.com'],
            ]} />

            <H2>Communities & podcasts</H2>
            <Bullet items={[
                'IA Conference (April 2026, Philadelphia) — workshops by Dan Brown, Abby Covert',
                'World IA Day (March 2026) — free local events in 60+ cities',
                'The Informed Life — Jorge Arango podcast',
                'NN/g Slack (with course) and Designer Hangout (apply)',
                'ADPList — free 1:1 mentoring with senior IAs',
            ]} />
        </div>
    );
}

// ============= CHAPTER 12 =============
function Chapter12() {
    return (
        <div>
            <ChapterHeader tag="Chapter 12" title="IA in the AI era" subtitle="What changes when the interface is a chatbox — and why traditional IA matters more, not less." />
            <Lead>The defining 2024–2026 shift is the collapse of hierarchical browsing in favor of query-first interfaces. But ontologies and taxonomies become more important, not less.</Lead>

            <H2>Old → New IA primitives</H2>
            <div style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {[
                    ['Pages / sections', 'Threads (stateful conversations)'],
                    ['Hierarchical menus', 'Single text box'],
                    ['Folders / categories', 'Projects / Spaces (Claude Projects, ChatGPT Projects)'],
                    ['Site search', 'Conversational retrieval with citations'],
                    ['Settings panels', 'Custom GPTs / Custom Instructions (config as natural language)'],
                ].map(([old, neww], i, arr) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 30px 1fr', gap: 12, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none', alignItems: 'center' }}>
                        <div style={{ fontSize: 13, color: theme.textMuted, textDecoration: 'line-through' }}>{old}</div>
                        <ArrowRight size={16} color={theme.rose} />
                        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{neww}</div>
                    </div>
                ))}
            </div>

            <H2>Three-layer memory architecture</H2>
            <P>Designing AI products: structure memory in three scopes. Make boundaries visible. The #1 trust issue today is users not knowing what the system knows about them.</P>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                    { name: 'Global user', desc: 'Persistent facts across all conversations', ex: 'Saved Memories, Custom Instructions' },
                    { name: 'Project / workspace', desc: 'Scoped to one container', ex: 'Project files, project-only memory' },
                    { name: 'Single thread', desc: 'Ephemeral context for one task', ex: 'Current conversation only' },
                ].map((s, i) => (
                    <Card key={i}>
                        <Tag>Scope {i + 1}</Tag>
                        <H3>{s.name}</H3>
                        <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{s.desc}</div>
                        <div style={{ fontSize: 12, color: theme.rose, marginTop: 8, fontStyle: 'italic' }}>{s.ex}</div>
                    </Card>
                ))}
            </div>

            <H2>The designer's question</H2>
            <Callout icon={Brain} title="Critical decision">
                Is your product "an app with AI sidebar" or "AI-native with app surfaces"? This decision drives your entire IA. There's no right answer — but you must choose explicitly.
            </Callout>

            <H2>Using AI to do IA work</H2>
            <Bullet items={[
                'Auto-categorization with embeddings — convert content to vectors, cluster, candidates emerge',
                'LLM-assisted card sort analysis — paste anonymized CSV into Claude/ChatGPT for clusters',
                'Automated taxonomy generation — feed corpus to LLM, get hierarchical labels',
                'Vector search replacing synonym rings — embeddings handle "pants" matching "trousers" natively',
                'Recipe: AI generates first-draft taxonomies; real users validate the navigation that ships',
            ]} />
        </div>
    );
}

// ============= CHAPTER 13 =============
function Chapter13() {
    return (
        <div>
            <ChapterHeader tag="Chapter 13" title="Common IA anti-patterns" subtitle="The 8 mistakes that wreck IA. Spot them, fix them." />
            {[
                { num: 1, name: 'Org-chart navigation', bad: 'Mirroring company structure (departments, BUs) instead of user mental models', fix: 'Organize around user intents and tasks. Use task-based card sorting.' },
                { num: 2, name: 'Too-deep hierarchy (>4 levels)', bad: 'Each click loses ~50% of users. Hick\'s Law', fix: 'Aim for ≤3–4 levels. Prefer breadth at top (humans scan 7–15 items easily).' },
                { num: 3, name: 'Mystery meat navigation', bad: 'Unlabeled icons, "click here," decorative-but-unlabeled buttons', fix: 'Always pair icons with labels. Descriptive link text. Avoid hamburger on desktop.' },
                { num: 4, name: 'Inconsistent labeling', bad: 'Same concept, different names ("Settings" vs "Preferences" vs "Options")', fix: 'Maintain a labels glossary. Match menu labels to page titles exactly.' },
                { num: 5, name: 'Mixing classification schemes', bad: 'Top nav mixes audience-based + topic-based + task-based items', fix: 'Pick ONE primary scheme per nav level. Separate visually if you must mix.' },
                { num: 6, name: 'Power-user-only design', bad: 'Assumes shortcuts, jargon, dense layouts on day 1', fix: 'Layer your IA. Visible nav as default; expose power-user paths as accelerators.' },
                { num: 7, name: 'No content growth plan', bad: 'IA works at 50 items, breaks at 1,000', fix: 'Design at 3 scales: Day 1, Year 1, Year 5. Plan filtering, faceting, search early.' },
                { num: 8, name: 'Jargon labels', bad: 'Internal terms ("ECRM Tier 2") instead of user language ("Customer Support")', fix: 'Extract user vocabulary from card sorts. Use plain language.' },
            ].map((p, i) => (
                <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderLeft: `4px solid ${theme.rose}`, borderRadius: '0 12px 12px 0', padding: 18, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: theme.rose, color: theme.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{p.num}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{p.name}</div>
                    </div>
                    <div style={{ marginLeft: 38 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                            <XCircle size={14} color={theme.danger} style={{ flexShrink: 0, marginTop: 3 }} />
                            <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{p.bad}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <CheckCircle2 size={14} color={theme.success} style={{ flexShrink: 0, marginTop: 3 }} />
                            <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{p.fix}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============= CHAPTER 14 =============
function Chapter14() {
    const phases = [
        { num: 1, name: 'Discovery', dur: '1–3 weeks', steps: ['Stakeholder interviews', 'Business goals analysis', 'User research (5-8 interviews)', 'Competitive IA audit', 'Content/feature inventory', 'Open card sort'] },
        { num: 2, name: 'Strategy', dur: '1–2 weeks', steps: ['Define information ecosystem', 'Object model (8-15 primary objects)', 'Organization schemes', 'Vocabulary / labels glossary', 'Content model per object'] },
        { num: 3, name: 'Design', dur: '2–4 weeks', steps: ['Sitemap / app map', 'Taxonomy / metadata schema', 'Navigation design', 'Search design', 'Wireframe key flows', 'Closed card sort validation'] },
        { num: 4, name: 'Validation', dur: '1–2 weeks', steps: ['Tree testing (≥70% direct success)', 'First-click testing', '5-second test', 'Moderated usability testing'] },
        { num: 5, name: 'Documentation & handoff', dur: '3–5 days', steps: ['Sitemap, taxonomy doc, nav spec', 'Content model + labels glossary', 'Engineering walkthrough', 'URL structure aligned to IA'] },
        { num: 6, name: 'Iteration', dur: 'Continuous', steps: ['Monthly: nav analytics review', 'Quarterly: tree test on critical flows', 'After launches: update taxonomy', 'Annual: full IA audit'] },
    ];

    return (
        <div>
            <ChapterHeader tag="Chapter 14" title="The full IA process" subtitle="A 6-phase repeatable process you can run for your SaaS startup." />
            <Lead>From discovery to iteration. Anchored in Polar Bear methodology and Covert's 7 steps.</Lead>
            {phases.map((p, i) => (
                <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.rose, color: theme.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>{p.num}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: theme.rose, fontWeight: 600 }}>{p.dur}</div>
                        </div>
                    </div>
                    <div style={{ marginLeft: 48, display: 'grid', gap: 6 }}>
                        {p.steps.map((s, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: theme.rose }} />
                                <div style={{ fontSize: 13, color: theme.text }}>{s}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <H2>5-week launch checklist</H2>
            <Callout icon={Trophy} title="Sprint plan for your SaaS">
                <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                    <strong>Week 1 — Discovery</strong>: stakeholder interviews, intent statement, 5-8 user interviews, audit 5 competitors, master inventory, open card sort with 15+ participants.<br /><br />
                    <strong>Week 2 — Strategy</strong>: object model, top-level scheme, labels glossary, content model.<br /><br />
                    <strong>Week 3 — Design</strong>: sitemap, navigation spec, command palette spec, search spec, wireframe 5 critical flows.<br /><br />
                    <strong>Week 4 — Validation</strong>: tree test (15-20 users, 8 tasks; ≥70% success), first-click test, 5-second test, iterate.<br /><br />
                    <strong>Week 5 — Handoff</strong>: finalize all deliverables, engineering walkthrough, train content team, set up analytics.
                </div>
            </Callout>
        </div>
    );
}

// ============= LAB 6: QUIZ =============
function LabQuiz() {
    const questions = [
        { q: 'Who coined the term "information architecture"?', options: ['Jesse James Garrett', 'Richard Saul Wurman', 'Lou Rosenfeld', 'Abby Covert'], correct: 1 },
        { q: 'In Klyn\'s framework, what does "Choreography" mean?', options: ['What things mean', 'Where things go', 'Rules of movement over time', 'Visual hierarchy'], correct: 2 },
        { q: 'What does the "L" in LATCH stand for?', options: ['Label', 'Logic', 'Location', 'Layout'], correct: 2 },
        { q: 'Which is a SaaS-specific IA challenge?', options: ['Page hierarchy', 'Settings architecture (Personal/Account/Product)', 'Image alt text', 'Footer links'], correct: 1 },
        { q: 'What\'s the recommended max depth for everyday navigation?', options: ['1-2 levels', '3-4 levels', '5-6 levels', 'No limit'], correct: 1 },
        { q: 'What is Linear\'s primary "primitive"?', options: ['Page', 'File', 'Issue', 'Channel'], correct: 2 },
        { q: 'Which book is called the "Polar Bear Book"?', options: ['How to Make Sense of Any Mess', 'Information Architecture for the Web and Beyond', 'Living in Information', 'Don\'t Make Me Think'], correct: 1 },
        { q: 'What does NN/g recommend for tree-test success rate on critical tasks?', options: ['≥30%', '≥50%', '≥70%', '≥95%'], correct: 2 },
        { q: 'Which navigation pattern dominated SaaS in 2020+?', options: ['Hamburger menu', 'Mega menu', 'Command palette (Cmd+K)', 'Carousel'], correct: 2 },
        { q: 'What\'s the best first step before any IA work?', options: ['Pick colors', 'Build wireframes', 'Audit existing content + interview users', 'Write code'], correct: 2 },
    ];

    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const submit = () => {
        if (selected === null) return;
        const newAnswers = [...answers, { q: currentQ, selected, correct: questions[currentQ].correct }];
        setAnswers(newAnswers);
        if (currentQ + 1 >= questions.length) {
            setShowResult(true);
        } else {
            setCurrentQ(currentQ + 1);
            setSelected(null);
        }
    };

    const reset = () => {
        setCurrentQ(0); setAnswers([]); setSelected(null); setShowResult(false);
    };

    if (showResult) {
        const correct = answers.filter(a => a.selected === a.correct).length;
        const pct = Math.round((correct / questions.length) * 100);
        const msg = pct === 100 ? 'Perfect! You\'re an IA master.' : pct >= 80 ? 'Excellent! Strong foundation.' : pct >= 60 ? 'Good start. Review the chapters.' : 'Time to revisit the basics. Start at Chapter 1.';
        return (
            <div>
                <ChapterHeader tag="Lab 6" title="Quiz Results" />
                <Card accent>
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Trophy size={64} color={theme.rose} style={{ margin: '0 auto 16px' }} />
                        <div style={{ fontSize: 56, fontWeight: 800, color: theme.rose, lineHeight: 1 }}>{pct}%</div>
                        <div style={{ fontSize: 16, color: theme.textMuted, marginTop: 8 }}>{correct} of {questions.length} correct</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: theme.text, marginTop: 16 }}>{msg}</div>
                    </div>
                </Card>
                <H3>Review your answers</H3>
                {questions.map((q, i) => {
                    const a = answers[i];
                    const wasCorrect = a.selected === a.correct;
                    return (
                        <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14, marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                {wasCorrect ? <CheckCircle2 size={16} color={theme.success} style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={16} color={theme.danger} style={{ flexShrink: 0, marginTop: 2 }} />}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{q.q}</div>
                                    <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Your answer: <span style={{ color: wasCorrect ? theme.success : theme.danger }}>{q.options[a.selected]}</span></div>
                                    {!wasCorrect && <div style={{ fontSize: 12, color: theme.success, marginTop: 2 }}>Correct: {q.options[q.correct]}</div>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <button onClick={reset} style={{ ...btnPrimary, marginTop: 16 }}><Shuffle size={14} />Retake quiz</button>
            </div>
        );
    }

    return (
        <div>
            <ChapterHeader tag="Lab 6" title="Final IA Quiz" subtitle="10 questions covering the whole book. Test your understanding." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 8, background: theme.rosePale, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${((currentQ) / questions.length) * 100}%`, height: '100%', background: theme.rose, transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>Question {currentQ + 1} of {questions.length}</div>
            </div>
            <Card accent>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, lineHeight: 1.5, marginBottom: 20 }}>{questions[currentQ].q}</div>
                <div style={{ display: 'grid', gap: 8 }}>
                    {questions[currentQ].options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(i)}
                            style={{
                                padding: '14px 18px', textAlign: 'left',
                                background: selected === i ? theme.rosePale : theme.white,
                                border: `2px solid ${selected === i ? theme.rose : theme.border}`,
                                borderRadius: 10, cursor: 'pointer', fontSize: 14, color: theme.text,
                                fontWeight: selected === i ? 600 : 400, transition: 'all 0.15s'
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                <button onClick={submit} disabled={selected === null} style={{ ...btnPrimary, marginTop: 20, width: '100%', justifyContent: 'center', opacity: selected === null ? 0.4 : 1, cursor: selected === null ? 'not-allowed' : 'pointer' }}>
                    {currentQ + 1 === questions.length ? 'Finish quiz' : 'Next question'} <ArrowRight size={14} />
                </button>
            </Card>
        </div>
    );
}

// ============= FINAL PAGE =============
function FinalPage() {
    return (
        <div>
            <ChapterHeader tag="The end" title="Final word" subtitle="What to do next, in order." />
            <Quote author="Richard Saul Wurman, 1976">Making the complex clear.</Quote>
            <P>Information architecture is the invisible scaffolding that determines whether your product feels obvious or overwhelming.</P>
            <H2>The 4-step learning loop</H2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {[
                    { num: 1, name: 'Read', desc: 'Abby Covert\'s book this weekend (free online).' },
                    { num: 2, name: 'Reverse-engineer', desc: 'Linear or Stripe Dashboard next week.' },
                    { num: 3, name: 'Build', desc: 'Your own SaaS sitemap the week after.' },
                    { num: 4, name: 'Test', desc: 'Tree-test it with 5+ users the week after that.' },
                ].map((s, i) => (
                    <div key={i} style={{ background: theme.white, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: theme.rose, color: theme.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, margin: '0 auto 10px' }}>{s.num}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 6, lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                ))}
            </div>
            <Callout icon={Award} title="Within a month" kind="success">
                You'll move from "I don't know what IA is" to "I have a defensible v1 IA for my SaaS, validated with real users, ready for engineering handoff."
            </Callout>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Heart size={48} color={theme.rose} fill={theme.rose} style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>Now go build something clear.</div>
                <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 8 }}>The Polar Bear Book sits on your desk for the next decade.<br />Everything else is in service of the same goal.</div>
            </div>
        </div>
    );
}