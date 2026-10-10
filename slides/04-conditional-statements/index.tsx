import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#f4f6fb', text: '#141a2e', accent: '#ea580c' },
  fonts: {
    display: '"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif',
    body: '"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 112, body: 34 },
  radius: 22,
};

// Each idea owns one colour across the deck:
// orange = a condition / if, green = true path, red = false path,
// indigo = switch, magenta = ternary.
const col = {
  cond: '#ea580c',
  go: '#16a34a',
  stop: '#dc2626',
  logic: '#0284c7',
  sw: '#4f46e5',
  tern: '#c026d3',
  ink: '#141a2e',
  muted: '#5f6b85',
  dim: '#a9b2c6',
  line: 'rgba(20, 26, 46, 0.12)',
  panel: '#ffffff',
  code: '#151a2e',
  codeLine: 'rgba(255, 255, 255, 0.10)',
  road: '#2b3249',
};

const font = {
  display: 'var(--osd-font-display)',
  body: 'var(--osd-font-body)',
  mono: '"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Resting styles are the final state; keyframes only describe where things come
// from. Inactive instances (thumbnails, overview, export) set data-still.
const css = `
  .cs { animation-fill-mode: both; animation-timing-function: ${EASE}; }
  [data-still] .cs, [data-still] .cs-loop { animation: none !important; }
  @media (prefers-reduced-motion: reduce) { .cs, .cs-loop { animation: none !important; } }
  svg .cs-pop { transform-box: fill-box; transform-origin: center; }
  .cs-rise { animation-name: cs-rise; animation-duration: .55s; }
  .cs-left { animation-name: cs-left; animation-duration: .5s; }
  .cs-fade { animation-name: cs-fade; animation-duration: .6s; }
  .cs-pop { animation-name: cs-pop; animation-duration: .5s; }
  .cs-up { animation-name: cs-up; animation-duration: .55s; }
  .cs-cash { animation-name: cs-cash; animation-duration: .9s; }
  .cs-draw { stroke-dasharray: 1; animation-name: cs-draw; animation-duration: .7s; }
  .cs-ladder { animation-name: cs-ladder; animation-duration: 1.6s; animation-timing-function: steps(2, end); }
  .cs-pulse { animation: cs-pulse 2.2s ease-in-out infinite; }
  .cs-drop { animation: cs-drop 1.3s linear infinite; }
  @keyframes cs-rise { from { opacity: 0; transform: translateY(14px); } }
  @keyframes cs-left { from { opacity: 0; transform: translateX(-14px); } }
  @keyframes cs-fade { from { opacity: 0; } }
  @keyframes cs-pop { 0% { opacity: 0; transform: scale(.85); } 70% { transform: scale(1.03); } 100% { transform: scale(1); } }
  @keyframes cs-up { from { opacity: 0; transform: translateY(26px); } }
  @keyframes cs-cash { from { opacity: 0; transform: translateY(-46px); } }
  @keyframes cs-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes cs-ladder { from { transform: translateY(0); } }
  @keyframes cs-pulse { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
  @keyframes cs-drop { 0% { opacity: 0; transform: translateY(-6px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(16px); } }
`;

const Styles = () => <style>{css}</style>;
const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  color: 'var(--osd-text)',
  fontFamily: font.body,
  backgroundColor: 'var(--osd-bg)',
  backgroundImage: [
    'radial-gradient(900px 640px at 94% 0%, rgba(234, 88, 12, 0.08), transparent 62%)',
    'radial-gradient(800px 560px at 0% 100%, rgba(79, 70, 229, 0.07), transparent 60%)',
    'radial-gradient(rgba(20, 26, 46, 0.08) 1.5px, transparent 1.5px)',
  ].join(', '),
  backgroundSize: 'auto, auto, 40px 40px',
  WebkitFontSmoothing: 'antialiased',
  fontVariantLigatures: 'none',
  fontFeatureSettings: '"calt" 0, "liga" 0',
};

/* ---------- shared pieces ---------- */

const pad = (n: number) => String(n).padStart(2, '0');

// A road doubles as the progress bar: the marker drives along it page by page.
const Footer = () => {
  const { current, total } = useSlidePageNumber();
  const at = total > 1 ? ((current - 1) / (total - 1)) * 100 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 34,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        fontSize: 22,
        fontWeight: 700,
        color: col.muted,
      }}
    >
      <span>Conditional statements</span>
      <div style={{ flex: 1, position: 'relative', height: 16, borderRadius: 8, background: col.road }}>
        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            top: 7,
            height: 2,
            opacity: 0.7,
            backgroundImage: 'repeating-linear-gradient(90deg, #f8fafc 0 16px, transparent 16px 32px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${at}%`,
            top: -6,
            width: 28,
            height: 28,
            marginLeft: -14,
            borderRadius: 14,
            boxSizing: 'border-box',
            background: col.cond,
            border: '4px solid #ffffff',
            boxShadow: '0 4px 10px rgba(20, 26, 46, 0.3)',
          }}
        />
      </div>
      <span style={{ fontFamily: font.mono }}>
        {pad(current)} / {pad(total)}
      </span>
    </div>
  );
};

const Frame = ({ children, footer = true }: { children: ReactNode; footer?: boolean }) => {
  const active = useIsActivePage();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Styles />
      {children}
      {footer && <Footer />}
    </div>
  );
};

const Body = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', inset: '92px 120px 116px', display: 'flex', flexDirection: 'column' }}>
    {children}
  </div>
);

const Label = ({ children, color = col.cond }: { children: ReactNode; color?: string }) => (
  <div
    className="cs cs-fade"
    style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 700, color }}
  >
    <span style={{ width: 14, height: 14, borderRadius: 4, transform: 'rotate(45deg)', background: color }} />
    {children}
  </div>
);

const Header = ({ label, title, color = col.cond }: { label: string; title: ReactNode; color?: string }) => (
  <div>
    <Label color={color}>{label}</Label>
    <h2
      className="cs cs-rise"
      style={{
        ...d(0.08),
        fontFamily: font.display,
        fontSize: 64,
        fontWeight: 800,
        lineHeight: 1.12,
        letterSpacing: '-0.01em',
        margin: '12px 0 0',
      }}
    >
      {title}
    </h2>
  </div>
);

const card: CSSProperties = {
  background: col.panel,
  border: `1px solid ${col.line}`,
  borderRadius: 'var(--osd-radius)',
  boxShadow: '0 24px 48px -30px rgba(20, 26, 70, 0.35)',
};

// Inline code on the light background.
const Mono = ({ children, color = col.ink, size }: { children: ReactNode; color?: string; size?: number }) => (
  <span
    style={{
      fontFamily: font.mono,
      fontSize: size ?? '0.9em',
      fontWeight: 700,
      color,
      background: `${col.ink}0d`,
      borderRadius: 8,
      padding: '0 8px',
    }}
  >
    {children}
  </span>
);

/* ---------- C++ code ---------- */

const TOKEN =
  /(\/\/.*$|"[^"]*"|'[^']*'|<[a-z]+>|#include|&&|\|\||!(?!=)|\?|\b(?:if|else|switch|case|default|break)\b|\b(?:int|double|char|bool|string|using|namespace|std|return|cout|cin|endl|main|true|false)\b|\b\d+(?:\.\d+)?\b)/;

const hl = (src: string) =>
  src.split(TOKEN).map((t, i) => {
    if (!t) return null;
    let color = '#e6e9f5';
    let weight = 400;
    if (i % 2 === 1) {
      if (t.startsWith('//')) color = '#7c86a6';
      else if (t.startsWith('"') || t.startsWith("'") || t.startsWith('<')) color = '#86e0b4';
      else if (/^\d/.test(t)) color = '#ff9db0';
      else if (/^(&&|\|\||!|\?)$/.test(t)) {
        color = '#5cc8ff';
        weight = 800;
      } else if (/^(if|else|switch|case|default|break)$/.test(t)) {
        color = '#ffb054';
        weight = 700;
      } else color = '#b4a9ff';
    }
    return (
      <span key={i} style={{ color, fontWeight: weight }}>
        {t}
      </span>
    );
  });

const CodePanel = ({
  children,
  title = 'main.cpp',
  size = 28,
  delay = 0.15,
}: {
  children: ReactNode;
  title?: string;
  size?: number;
  delay?: number;
}) => (
  <div
    className="cs cs-rise"
    style={{ ...d(delay), borderRadius: 'var(--osd-radius)', background: col.code, boxShadow: card.boxShadow }}
  >
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 28px', borderBottom: `1px solid ${col.codeLine}` }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col.stop }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: '#f5a50b' }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col.go }} />
      <span style={{ marginLeft: 14, fontFamily: font.mono, fontSize: 20, color: '#7c86a6' }}>{title}</span>
    </div>
    <div style={{ padding: '18px 28px 22px', fontFamily: font.mono, fontSize: size, lineHeight: 1.6, color: '#e6e9f5' }}>
      {children}
    </div>
  </div>
);

const Ln = ({
  n,
  code = '',
  indent = 0,
  delay = 0,
  mark,
}: {
  n?: number;
  code?: string;
  indent?: number;
  delay?: number;
  mark?: string;
}) => (
  <div
    className="cs cs-left"
    style={{
      ...d(0.3 + delay),
      display: 'flex',
      alignItems: 'center',
      margin: '0 -28px',
      padding: '0 28px',
      background: mark ? `${mark}33` : undefined,
      boxShadow: mark ? `inset 5px 0 0 ${mark}` : undefined,
    }}
  >
    {n !== undefined && <span style={{ width: '2em', flex: 'none', color: '#5d6789', fontSize: '0.7em' }}>{n}</span>}
    <span style={{ paddingLeft: `${indent * 1.6}em`, whiteSpace: 'pre', minHeight: '1.6em' }}>{hl(code)}</span>
  </div>
);

// Console output. `In` lines are what the user typed.
const Terminal = ({
  children,
  title = 'Output',
  delay = 0.6,
  size = 28,
}: {
  children: ReactNode;
  title?: string;
  delay?: number;
  size?: number;
}) => (
  <div
    className="cs cs-rise"
    style={{
      ...d(delay),
      background: col.code,
      borderRadius: 'var(--osd-radius)',
      padding: '16px 26px 18px',
      fontFamily: font.mono,
      fontSize: size,
      lineHeight: 1.5,
      color: '#86e0b4',
      fontWeight: 700,
      boxShadow: card.boxShadow,
    }}
  >
    <div style={{ fontSize: 18, fontWeight: 600, color: '#7c86a6', letterSpacing: '0.14em', marginBottom: 6 }}>
      {title.toUpperCase()}
    </div>
    {children}
  </div>
);

const In = ({ children }: { children: ReactNode }) => (
  <div style={{ color: '#ffcf70', fontWeight: 600 }}>
    <span style={{ color: '#7c86a6' }}>&gt; </span>
    {children}
  </div>
);

// A one-line dark code chip.
const Chip = ({ code, size = 24 }: { code: string; size?: number }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: font.mono,
      fontSize: size,
      background: col.code,
      borderRadius: 12,
      padding: '10px 18px',
      whiteSpace: 'pre',
    }}
  >
    {hl(code)}
  </span>
);

/* ---------- flowchart pieces (SVG, 1 unit = 1 px) ---------- */

const tone = { ink: col.ink, go: col.go, stop: col.stop, dim: col.dim, sw: col.sw, cond: col.cond };
type Tone = keyof typeof tone;

const Head = ({ id }: { id: Tone }) => (
  <marker
    id={`cs-${id}`}
    viewBox="0 0 10 10"
    refX="7"
    refY="5"
    markerWidth="4.5"
    markerHeight="4.5"
    orient="auto-start-reverse"
  >
    <path d="M0 0 L10 5 L0 10 Z" fill={tone[id]} />
  </marker>
);

const Heads = () => (
  <defs>
    <Head id="ink" />
    <Head id="go" />
    <Head id="stop" />
    <Head id="dim" />
    <Head id="sw" />
    <Head id="cond" />
  </defs>
);

const Wire = ({ path, t = 'ink', delay = 0, end = true }: { path: string; t?: Tone; delay?: number; end?: boolean }) => (
  <path
    className="cs cs-fade"
    style={d(delay)}
    d={path}
    fill="none"
    stroke={tone[t]}
    strokeWidth="4"
    strokeLinejoin="round"
    markerEnd={end ? `url(#cs-${t})` : undefined}
  />
);

const FDia = ({ cx, cy, w, h, text, size = 26, delay = 0 }: { cx: number; cy: number; w: number; h: number; text: string; size?: number; delay?: number }) => (
  <g className="cs cs-pop" style={d(delay)}>
    <polygon
      points={`${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`}
      fill="#fff4ec"
      stroke={col.cond}
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <text
      x={cx}
      y={cy + 1}
      textAnchor="middle"
      dominantBaseline="central"
      fill={col.ink}
      style={{ fontFamily: font.mono, fontSize: size, fontWeight: 700 }}
    >
      {text}
    </text>
  </g>
);

const FBox = ({
  cx,
  cy,
  w,
  h,
  text,
  t = 'ink',
  size = 24,
  delay = 0,
  solid,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
  text: string;
  t?: Tone;
  size?: number;
  delay?: number;
  solid?: boolean;
}) => (
  <g className="cs cs-pop" style={d(delay)}>
    <rect
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      rx="16"
      fill={solid ? tone[t] : `${tone[t]}14`}
      stroke={tone[t]}
      strokeWidth="4"
    />
    <text
      x={cx}
      y={cy + 1}
      textAnchor="middle"
      dominantBaseline="central"
      fill={solid ? '#ffffff' : tone[t]}
      style={{ fontFamily: font.body, fontSize: size, fontWeight: 700 }}
    >
      {text}
    </text>
  </g>
);

const FLabel = ({ x, y, text, t, anchor = 'start', delay = 0 }: { x: number; y: number; text: string; t: Tone; anchor?: 'start' | 'end' | 'middle'; delay?: number }) => (
  <text
    className="cs cs-fade"
    x={x}
    y={y}
    textAnchor={anchor}
    fill={tone[t]}
    style={{ ...d(delay), fontFamily: font.mono, fontSize: 22, fontWeight: 800 }}
  >
    {text}
  </text>
);

// A glowing dot that keeps travelling the path the program actually takes.
const Token = ({ path, color = col.cond, dur = 3.2, begin = 0.9 }: { path: string; color?: string; dur?: number; begin?: number }) => (
  <g opacity="0">
    <set attributeName="opacity" to="1" begin={`${begin}s`} />
    <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
    <circle r="20" fill={color} opacity="0.25" />
    <circle r="11" fill={color} stroke="#ffffff" strokeWidth="4" />
  </g>
);

/* ---------- Cover ---------- */

const Fork = () => (
  <svg width="600" height="720" viewBox="0 0 600 720" style={{ display: 'block', overflow: 'visible' }}>
    <Heads />
    <g className="cs cs-pop" style={d(0.3)}>
      <rect x="230" y="10" width="140" height="56" rx="28" fill={col.ink} />
      <text x="300" y="39" textAnchor="middle" dominantBaseline="central" fill="#fff" style={{ fontFamily: font.mono, fontSize: 22, fontWeight: 700 }}>
        START
      </text>
    </g>
    <Wire path="M300 66 V138" delay={0.4} />
    <FDia cx={300} cy={230} w={360} h={170} text="age >= 18 ?" size={30} delay={0.5} />
    <Wire path="M120 230 V436" t="go" delay={0.7} />
    <Wire path="M480 230 V436" t="stop" delay={0.7} />
    <FLabel x={136} y={340} text="true" t="go" delay={0.8} />
    <FLabel x={464} y={340} text="false" t="stop" anchor="end" delay={0.8} />
    <FBox cx={120} cy={490} w={220} h={100} text="Can vote" t="go" delay={0.85} />
    <FBox cx={480} cy={490} w={220} h={100} text="Too young" t="stop" delay={0.85} />
    <Wire path="M120 540 V600 H300" end={false} delay={1} />
    <Wire path="M480 540 V600 H300 V636" delay={1} />
    <g className="cs cs-pop" style={d(1.1)}>
      <rect x="230" y="640" width="140" height="56" rx="28" fill={col.ink} />
      <text x="300" y="669" textAnchor="middle" dominantBaseline="central" fill="#fff" style={{ fontFamily: font.mono, fontSize: 22, fontWeight: 700 }}>
        END
      </text>
    </g>
    <Token path="M300 38 V230 H120 V600 H300 V668" begin={1.3} dur={3.6} />
  </svg>
);

const Cover: Page = () => (
  <Frame footer={false}>
    <div
      style={{
        position: 'absolute',
        left: 140,
        top: 0,
        bottom: 0,
        width: 960,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Label>Fundamentals of Programming</Label>
      <h1
        className="cs cs-rise"
        style={{
          ...d(0.1),
          fontFamily: font.display,
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.02,
          margin: '30px 0 36px',
        }}
      >
        Conditional
        <br />
        statements
        <br />
        <span style={{ color: col.cond }}>in C++</span>
      </h1>
      <p className="cs cs-rise" style={{ ...d(0.25), fontSize: 42, color: col.muted, margin: 0, lineHeight: 1.4 }}>
        Teaching a program to make decisions
      </p>
      <div className="cs cs-rise" style={{ ...d(0.4), display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 44, maxWidth: 820 }}>
        <Chip code="if" />
        <Chip code="else if" />
        <Chip code="else" />
        <Chip code="switch" />
        <Chip code="? :" />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 180 }}>
      <Fork />
    </div>
  </Frame>
);

/* ---------- What is a conditional ---------- */

const RainIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <g fill="#94a3b8">
      <circle cx="40" cy="50" r="18" />
      <circle cx="62" cy="38" r="24" />
      <circle cx="86" cy="52" r="16" />
      <rect x="40" y="44" width="46" height="24" />
    </g>
    <g stroke={col.logic} strokeWidth="5" strokeLinecap="round">
      <path className="cs-loop cs-drop" d="M44 82 L40 94" />
      <path className="cs-loop cs-drop" style={d(0.4)} d="M62 82 L58 94" />
      <path className="cs-loop cs-drop" style={d(0.8)} d="M80 82 L76 94" />
    </g>
  </svg>
);

const KeypadIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <rect x="24" y="8" width="70" height="104" rx="14" fill="#ffffff" stroke={col.ink} strokeWidth="4" />
    <rect x="34" y="18" width="50" height="22" rx="5" fill={col.ink} />
    <text x="59" y="31" textAnchor="middle" dominantBaseline="central" fill="#86e0b4" style={{ fontFamily: font.mono, fontSize: 16, fontWeight: 700 }}>
      ****
    </text>
    <g fill={col.dim}>
      <circle cx="42" cy="58" r="6" />
      <circle cx="59" cy="58" r="6" />
      <circle cx="76" cy="58" r="6" />
      <circle cx="42" cy="76" r="6" />
      <circle cx="59" cy="76" r="6" />
      <circle cx="76" cy="76" r="6" />
      <circle cx="42" cy="94" r="6" />
      <circle cx="59" cy="94" r="6" />
      <circle cx="76" cy="94" r="6" />
    </g>
    <circle cx="94" cy="94" r="18" fill={col.go} />
    <path className="cs cs-draw" style={d(0.9)} pathLength={1} d="M85 94 L92 101 L104 87" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SignalIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <rect x="38" y="4" width="44" height="112" rx="16" fill={col.road} />
    <circle className="cs-loop cs-pulse" cx="60" cy="28" r="20" fill={col.stop} opacity="0.4" />
    <circle cx="60" cy="28" r="12" fill="#ef4444" />
    <circle cx="60" cy="60" r="12" fill="#5b4a1f" />
    <circle cx="60" cy="92" r="12" fill="#1f4d33" />
  </svg>
);

const Example = ({
  icon,
  cond,
  then,
  code,
  delay,
}: {
  icon: ReactNode;
  cond: string;
  then: string;
  code: string;
  delay: number;
}) => (
  <div className="cs cs-up" style={{ ...d(delay), ...card, padding: '30px 34px', display: 'flex', flexDirection: 'column', gap: 20 }}>
    {icon}
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontSize: 32, fontWeight: 600 }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: col.cond, width: 72, flex: 'none' }}>IF</span>
      {cond}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontSize: 32, fontWeight: 600 }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: col.go, width: 72, flex: 'none' }}>THEN</span>
      {then}
    </div>
    <div style={{ marginTop: 6 }}>
      <Chip code={code} />
    </div>
  </div>
);

const WhatIs: Page = () => (
  <Frame>
    <Body>
      <Header label="The big idea" title="What is a conditional statement?" />
      <p className="cs cs-rise" style={{ ...d(0.2), fontSize: 38, lineHeight: 1.45, margin: '30px 0 0', maxWidth: 1600 }}>
        A conditional runs a block of code <b style={{ color: col.go }}>only when a condition is true</b>, so the program
        can choose what to do while it runs.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 44 }}>
        <Example icon={<RainIcon />} cond="it is raining" then="take an umbrella" code="if (raining) takeUmbrella();" delay={0.35} />
        <Example icon={<KeypadIcon />} cond="the PIN is correct" then="open the account" code="if (pinOk) openAccount();" delay={0.5} />
        <Example icon={<SignalIcon />} cond="the light is red" then="stop the car" code="if (light == 'R') stop();" delay={0.65} />
      </div>
    </Body>
  </Frame>
);

/* ---------- if ---------- */

const IfFlow = () => (
  <svg width="560" height="640" viewBox="0 0 560 640" style={{ display: 'block' }}>
    <Heads />
    <FBox cx={280} cy={45} w={260} h={70} text="temp = 38" delay={0.3} />
    <Wire path="M280 80 V128" delay={0.4} />
    <FDia cx={280} cy={210} w={320} h={150} text="temp > 35 ?" delay={0.5} />
    <Wire path="M280 285 V351" t="go" delay={0.7} />
    <FLabel x={296} y={326} text="true" t="go" delay={0.8} />
    <FBox cx={280} cy={400} w={300} h={90} text="Print warning" t="go" delay={0.8} />
    <Wire path="M440 210 H510 V485 H292" t="stop" delay={0.9} />
    <FLabel x={500} y={192} text="false" t="stop" anchor="end" delay={1} />
    <Wire path="M280 445 V531" delay={1} />
    <FBox cx={280} cy={575} w={300} h={80} text="Print nice day" delay={1.1} />
    <Token path="M280 12 V575" begin={1.3} dur={3} />
  </svg>
);

const IfPage: Page = () => (
  <Frame>
    <Body>
      <Header label="The if statement" title="Run code only when it’s true" />
      <div className="cs cs-rise" style={{ ...d(0.2), display: 'flex', alignItems: 'center', gap: 28, marginTop: 26 }}>
        <Chip code="if (condition) { statements; }" size={28} />
        <span style={{ fontSize: 28, color: col.muted }}>True: the block runs. False: it is skipped.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 560px', gap: 64, marginTop: 32, flex: 1 }}>
        <div>
          <CodePanel title="weather.cpp" size={28} delay={0.3}>
            <Ln n={1} code="int temp = 38;" />
            <Ln n={2} delay={0.05} />
            <Ln n={3} code="if (temp > 35) {" delay={0.1} mark={col.cond} />
            <Ln n={4} code={'cout << "Heatwave! Drink water.\\n";'} indent={1} delay={0.15} />
            <Ln n={5} code="}" delay={0.2} />
            <Ln n={6} code={'cout << "Have a nice day.";'} delay={0.25} />
          </CodePanel>
          <div style={{ marginTop: 24 }}>
            <Terminal delay={0.8}>
              <div>Heatwave! Drink water.</div>
              <div>Have a nice day.</div>
            </Terminal>
          </div>
        </div>
        <div style={{ marginTop: -60 }}>
          <IfFlow />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- if-else: ATM ---------- */

const Atm = () => (
  <svg width="420" height="560" viewBox="0 0 420 560" style={{ display: 'block' }}>
    <rect x="20" y="10" width="380" height="510" rx="30" fill={col.road} />
    <text x="210" y="50" textAnchor="middle" fill="#cbd5e1" style={{ fontFamily: font.body, fontSize: 24, fontWeight: 800, letterSpacing: '0.2em' }}>
      ATM
    </text>
    <rect x="56" y="74" width="308" height="160" rx="14" fill="#e0f2fe" />
    <text className="cs cs-fade" x="210" y="130" textAnchor="middle" fill={col.go} style={{ ...d(0.9), fontFamily: font.mono, fontSize: 26, fontWeight: 800 }}>
      Please take
    </text>
    <text className="cs cs-fade" x="210" y="166" textAnchor="middle" fill={col.go} style={{ ...d(0.9), fontFamily: font.mono, fontSize: 26, fontWeight: 800 }}>
      your cash
    </text>
    <text x="210" y="210" textAnchor="middle" fill={col.muted} style={{ fontFamily: font.mono, fontSize: 18, fontWeight: 600 }}>
      Balance: Rs. 3000
    </text>
    <g fill="#3b4462">
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={86 + (i % 3) * 58} y={262 + Math.floor(i / 3) * 44} width="46" height="32" rx="8" />
      ))}
    </g>
    <rect x="290" y="270" width="80" height="12" rx="6" fill="#0f1322" />
    <rect x="290" y="300" width="80" height="60" rx="10" fill="#3b4462" />
    <rect x="100" y="452" width="220" height="16" rx="8" fill="#0f1322" />
    <g className="cs cs-cash" style={d(1.1)}>
      <rect x="128" y="462" width="164" height="76" rx="6" fill="#86efac" stroke={col.go} strokeWidth="3" />
      <rect x="140" y="470" width="164" height="76" rx="6" fill="#bbf7d0" stroke={col.go} strokeWidth="3" />
      <circle cx="222" cy="508" r="16" fill="none" stroke={col.go} strokeWidth="3" />
      <text x="222" y="509" textAnchor="middle" dominantBaseline="central" fill={col.go} style={{ fontFamily: font.mono, fontSize: 16, fontWeight: 800 }}>
        Rs
      </text>
    </g>
  </svg>
);

const IfElse: Page = () => (
  <Frame>
    <Body>
      <Header label="if – else" title="Two paths: an ATM withdrawal" color={col.go} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 64, marginTop: 32 }}>
        <div>
          <CodePanel title="atm.cpp" size={26} delay={0.25}>
            <Ln n={1} code="double balance = 5000, amount;" />
            <Ln n={2} code="cin >> amount;" delay={0.04} />
            <Ln n={3} code="if (amount <= balance) {" delay={0.08} mark={col.go} />
            <Ln n={4} code="balance = balance - amount;" indent={1} delay={0.12} />
            <Ln n={5} code={'cout << "Please take your cash";'} indent={1} delay={0.16} />
            <Ln n={6} code="} else {" delay={0.2} mark={col.stop} />
            <Ln n={7} code={'cout << "Insufficient balance";'} indent={1} delay={0.24} />
            <Ln n={8} code="}" delay={0.28} />
          </CodePanel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
            <Terminal title="Run 1" delay={0.7} size={26}>
              <In>2000</In>
              <div>Please take your cash</div>
            </Terminal>
            <Terminal title="Run 2" delay={0.85} size={26}>
              <In>8000</In>
              <div style={{ color: '#ff9db0' }}>Insufficient balance</div>
            </Terminal>
          </div>
        </div>
        <div className="cs cs-pop" style={{ ...d(0.4), display: 'flex', justifyContent: 'center' }}>
          <Atm />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- else-if ladder ---------- */

const Rung = ({ kw, cond, state, grade, delay }: { kw: string; cond: string; state: 'false' | 'true' | 'skip'; grade: string; delay: number }) => {
  const c = state === 'true' ? col.go : state === 'false' ? col.stop : col.dim;
  return (
    <div
      className="cs cs-left"
      style={{
        ...d(delay),
        height: 96,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '140px 1fr 240px',
        alignItems: 'center',
        padding: '0 28px',
        borderRadius: 18,
        background: state === 'true' ? `${col.go}14` : col.panel,
        border: state === 'skip' ? `2px dashed ${col.dim}` : `2px solid ${state === 'true' ? col.go : col.line}`,
        opacity: state === 'skip' ? 0.7 : 1,
      }}
    >
      <span style={{ fontFamily: font.mono, fontSize: 22, fontWeight: 800, color: col.cond }}>{kw}</span>
      <span style={{ fontFamily: font.mono, fontSize: 30, fontWeight: 700 }}>{cond}</span>
      <span style={{ justifySelf: 'end', fontSize: 26, fontWeight: 800, color: c }}>
        {state === 'true' ? `true → ${grade}` : state === 'false' ? '✗ false' : 'skipped'}
      </span>
    </div>
  );
};

const ElseIf: Page = () => (
  <Frame>
    <Body>
      <Header label="else if ladder" title="Many ranges: a grade calculator" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 860px', gap: 56, marginTop: 32 }}>
        <div>
          <CodePanel title="grade.cpp" size={26} delay={0.25}>
            <Ln n={1} code="int marks = 72;" />
            <Ln n={2} code={'if (marks >= 90)       cout << "A";'} delay={0.04} />
            <Ln n={3} code={'else if (marks >= 80)  cout << "B";'} delay={0.08} />
            <Ln n={4} code={'else if (marks >= 70)  cout << "C";'} delay={0.12} mark={col.go} />
            <Ln n={5} code={'else if (marks >= 60)  cout << "D";'} delay={0.16} />
            <Ln n={6} code={'else                   cout << "F";'} delay={0.2} />
          </CodePanel>
          <div style={{ marginTop: 24 }}>
            <Terminal delay={1.6}>C</Terminal>
          </div>
          <p className="cs cs-rise" style={{ ...d(1.8), fontSize: 28, color: col.muted, lineHeight: 1.45, marginTop: 24 }}>
            Checked <b style={{ color: col.ink }}>top to bottom</b>. The first true condition wins, the rest are skipped.
          </p>
        </div>
        <div>
          <div className="cs cs-fade" style={{ ...d(0.3), display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: col.muted }}>Input</span>
            <Chip code="marks = 72" size={26} />
          </div>
          <div style={{ position: 'relative', paddingLeft: 56 }}>
            <div
              className="cs cs-ladder"
              style={{ ...d(0.5), position: 'absolute', left: 0, top: 30, transform: 'translateY(220px)' }}
            >
              <svg width="40" height="36" viewBox="0 0 40 36">
                <path d="M4 4 L36 18 L4 32 Z" fill={col.cond} />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Rung kw="if" cond="marks >= 90" state="false" grade="A" delay={0.5} />
              <Rung kw="else if" cond="marks >= 80" state="false" grade="B" delay={0.9} />
              <Rung kw="else if" cond="marks >= 70" state="true" grade="C" delay={1.3} />
              <Rung kw="else if" cond="marks >= 60" state="skip" grade="D" delay={1.5} />
              <Rung kw="else" cond="(everything else)" state="skip" grade="F" delay={1.6} />
            </div>
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- nested if ---------- */

const LoginTree = () => (
  <svg width="720" height="560" viewBox="0 0 720 560" style={{ display: 'block' }}>
    <Heads />
    <FDia cx={360} cy={70} w={300} h={110} text={'user == "admin"'} size={22} delay={0.4} />
    <Wire path="M210 70 H190 V196" t="go" delay={0.6} />
    <FLabel x={178} y={150} text="true" t="go" anchor="end" delay={0.7} />
    <Wire path="M510 70 H600 V426" t="stop" delay={0.6} />
    <FLabel x={612} y={150} text="false" t="stop" delay={0.7} />
    <FDia cx={190} cy={255} w={300} h={110} text={'pass == "1234"'} size={22} delay={0.8} />
    <Wire path="M190 310 V426" t="go" delay={1} />
    <FLabel x={178} y={380} text="true" t="go" anchor="end" delay={1.1} />
    <Wire path="M340 255 H400 V426" t="stop" delay={1} />
    <FLabel x={412} y={380} text="false" t="stop" delay={1.1} />
    <FBox cx={190} cy={475} w={200} h={90} text="Welcome back!" t="go" size={22} delay={1.2} solid />
    <FBox cx={400} cy={475} w={180} h={90} text="Wrong password" t="stop" size={20} delay={1.2} />
    <FBox cx={600} cy={475} w={200} h={90} text="User not found" t="stop" size={22} delay={1.2} />
    <Token path="M360 4 V70 H190 V475" begin={1.4} dur={3} />
  </svg>
);

const Nested: Page = () => (
  <Frame>
    <Body>
      <Header label="Nested if – else" title="A decision inside a decision: logging in" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 720px', gap: 56, marginTop: 36 }}>
        <div>
          <CodePanel title="login.cpp" size={26} delay={0.25}>
            <Ln n={1} code={'if (user == "admin") {'} mark={col.cond} />
            <Ln n={2} code={'if (pass == "1234") {'} indent={1} delay={0.04} mark={col.cond} />
            <Ln n={3} code={'cout << "Welcome back!";'} indent={2} delay={0.08} />
            <Ln n={4} code="} else {" indent={1} delay={0.12} />
            <Ln n={5} code={'cout << "Wrong password";'} indent={2} delay={0.16} />
            <Ln n={6} code="}" indent={1} delay={0.2} />
            <Ln n={7} code="} else {" delay={0.24} />
            <Ln n={8} code={'cout << "User not found";'} indent={1} delay={0.28} />
            <Ln n={9} code="}" delay={0.32} />
          </CodePanel>
          <p className="cs cs-rise" style={{ ...d(0.9), fontSize: 28, color: col.muted, lineHeight: 1.45, marginTop: 28 }}>
            The inner <Mono>if</Mono> is only reached when the outer condition is true, so each level can give its own
            message.
          </p>
        </div>
        <LoginTree />
      </div>
    </Body>
  </Frame>
);

/* ---------- pitfalls ---------- */

const Snippet = ({ lines, ok, note }: { lines: string[]; ok: boolean; note?: string }) => {
  const c = ok ? col.go : col.stop;
  return (
    <div>
      <div style={{ position: 'relative', background: col.code, borderRadius: 16, padding: '16px 22px', boxShadow: `inset 0 0 0 3px ${c}` }}>
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
            width: 34,
            height: 34,
            borderRadius: 17,
            background: c,
            color: '#fff',
            fontSize: 22,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {ok ? '✓' : '✗'}
        </span>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: font.mono, fontSize: 26, lineHeight: 1.6, whiteSpace: 'pre', color: '#e6e9f5' }}>
            {hl(l)}
          </div>
        ))}
      </div>
      {note && <div style={{ fontSize: 26, fontWeight: 600, color: c, marginTop: 10 }}>{note}</div>}
    </div>
  );
};

const Mistake = ({ n, title, children, delay }: { n: number; title: string; children: ReactNode; delay: number }) => (
  <div className="cs cs-up" style={{ ...d(delay), ...card, padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: `${col.cond}1f`,
          color: col.cond,
          fontSize: 26,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {n}
      </span>
      <span style={{ fontSize: 32, fontWeight: 800 }}>{title}</span>
    </div>
    {children}
  </div>
);

const Pitfalls: Page = () => (
  <Frame>
    <Body>
      <Header label="Watch out" title="Three classic if mistakes" color={col.stop} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 40 }}>
        <Mistake n={1} title="= instead of ==" delay={0.3}>
          <Snippet ok={false} lines={['if (x = 5)', '    cout << "Five";']} note="Assigns 5, so it is always true" />
          <Snippet ok lines={['if (x == 5)', '    cout << "Five";']} />
        </Mistake>
        <Mistake n={2} title="A stray semicolon" delay={0.45}>
          <Snippet ok={false} lines={['if (x > 5);', '    cout << "Big";']} note="The ; ends the if. cout always runs" />
          <Snippet ok lines={['if (x > 5)', '    cout << "Big";']} />
        </Mistake>
        <Mistake n={3} title="Missing braces" delay={0.6}>
          <Snippet
            ok={false}
            lines={['if (score > 50)', '    cout << "Pass ";', '    cout << "Prize";']}
            note="Only the first cout belongs to the if"
          />
          <Snippet ok lines={['if (score > 50) {', '    cout << "Pass ";', '    cout << "Prize";', '}']} />
        </Mistake>
      </div>
    </Body>
  </Frame>
);

/* ---------- switch ---------- */

const CaseBox = ({ y, label, value, hit, delay }: { y: number; label: string; value: string; hit?: boolean; delay: number }) => (
  <g className="cs cs-pop" style={d(delay)}>
    <rect
      x="380"
      y={y - 35}
      width="370"
      height="70"
      rx="16"
      fill={hit ? `${col.go}1a` : '#ffffff'}
      stroke={hit ? col.go : col.dim}
      strokeWidth={hit ? 4 : 2.5}
      strokeDasharray={label === 'default:' ? '10 8' : undefined}
    />
    <text x="404" y={y + 1} dominantBaseline="central" fill={col.sw} style={{ fontFamily: font.mono, fontSize: 26, fontWeight: 800 }}>
      {label}
    </text>
    <text x="572" y={y + 1} dominantBaseline="central" fill={hit ? col.go : col.ink} style={{ fontFamily: font.body, fontSize: 26, fontWeight: 700 }}>
      {value}
    </text>
  </g>
);

const Switchboard = () => (
  <svg width="760" height="470" viewBox="0 0 760 470" style={{ display: 'block' }}>
    <Heads />
    <g className="cs cs-pop" style={d(0.3)}>
      <rect x="0" y="200" width="200" height="70" rx="16" fill={col.code} />
      <text x="100" y="236" textAnchor="middle" dominantBaseline="central" fill="#ffcf70" style={{ fontFamily: font.mono, fontSize: 28, fontWeight: 700 }}>
        day = 2
      </text>
    </g>
    <Wire path="M200 235 H260" t="sw" end={false} delay={0.4} />
    <Wire path="M260 50 V410" t="sw" end={false} delay={0.4} />
    <Wire path="M260 50 H372" t="dim" delay={0.5} />
    <Wire path="M260 140 H372" t="go" delay={0.5} />
    <Wire path="M260 230 H372" t="dim" delay={0.5} />
    <Wire path="M260 320 H372" t="dim" delay={0.5} />
    <Wire path="M260 410 H372" t="dim" delay={0.5} />
    <CaseBox y={50} label="case 1:" value="Monday" delay={0.6} />
    <CaseBox y={140} label="case 2:" value="Tuesday" hit delay={0.7} />
    <CaseBox y={230} label="case 3:" value="Wednesday" delay={0.8} />
    <CaseBox y={320} label="case 4:" value="Thursday" delay={0.9} />
    <CaseBox y={410} label="default:" value="Invalid day" delay={1} />
    <Token path="M200 235 H260 V140 H380" color={col.sw} begin={1.2} dur={2.2} />
  </svg>
);

const Note = ({ k, children, delay }: { k: string; children: ReactNode; delay: number }) => (
  <div className="cs cs-left" style={{ ...d(delay), display: 'flex', alignItems: 'baseline', gap: 18, fontSize: 28, lineHeight: 1.4 }}>
    <span style={{ fontFamily: font.mono, fontWeight: 800, color: col.sw, width: 120, flex: 'none' }}>{k}</span>
    <span>{children}</span>
  </div>
);

const SwitchPage: Page = () => (
  <Frame>
    <Body>
      <Header label="The switch statement" title="One value, many fixed choices" color={col.sw} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 760px', gap: 64, marginTop: 36, alignItems: 'start' }}>
        <CodePanel title="syntax" size={26} delay={0.25}>
          <Ln code="switch (expression) {" mark={col.sw} />
          <Ln code="case value1:" indent={1} delay={0.04} />
          <Ln code="// runs when expression == value1" indent={2} delay={0.08} />
          <Ln code="break;" indent={2} delay={0.12} />
          <Ln code="case value2:" indent={1} delay={0.16} />
          <Ln code="// runs when expression == value2" indent={2} delay={0.2} />
          <Ln code="break;" indent={2} delay={0.24} />
          <Ln code="default:" indent={1} delay={0.28} />
          <Ln code="// runs when no case matches" indent={2} delay={0.32} />
          <Ln code="}" delay={0.36} />
        </CodePanel>
        <div>
          <Switchboard />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
            <Note k="case" delay={1.2}>compares the value with each label</Note>
            <Note k="break" delay={1.3}>jumps out of the switch</Note>
            <Note k="default" delay={1.4}>runs when nothing matches</Note>
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- switch example: traffic light ---------- */

const TrafficLight = () => (
  <svg width="260" height="620" viewBox="0 0 260 620" style={{ display: 'block' }}>
    <rect x="114" y="440" width="32" height="180" rx="6" fill="#64748b" />
    <rect x="40" y="10" width="180" height="440" rx="40" fill={col.road} />
    <circle cx="130" cy="100" r="54" fill="#5a1f22" />
    <circle className="cs-loop cs-pulse" cx="130" cy="230" r="86" fill="#fde047" opacity="0.5" />
    <circle cx="130" cy="230" r="54" fill="#facc15" />
    <circle cx="130" cy="360" r="54" fill="#1d4a31" />
  </svg>
);

const Signal = ({ k, text, color, hit }: { k: string; text: string; color: string; hit?: boolean }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '14px 22px',
      borderRadius: 16,
      border: `3px solid ${hit ? color : col.line}`,
      background: hit ? `${color}1f` : col.panel,
    }}
  >
    <span style={{ width: 28, height: 28, borderRadius: 14, background: color }} />
    <span style={{ fontFamily: font.mono, fontSize: 28, fontWeight: 800 }}>'{k}'</span>
    <span style={{ fontSize: 28, fontWeight: 700 }}>{text}</span>
  </div>
);

const SwitchTraffic: Page = () => (
  <Frame>
    <Body>
      <Header label="switch in real life" title="A traffic light controller" color={col.sw} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px 380px', gap: 56, marginTop: 36, alignItems: 'start' }}>
        <div>
          <CodePanel title="traffic.cpp" size={26} delay={0.25}>
            <Ln n={1} code="char light = 'Y';" />
            <Ln n={2} delay={0.04} />
            <Ln n={3} code="switch (light) {" delay={0.08} mark={col.sw} />
            <Ln n={4} code={"case 'R': cout << \"Stop\";        break;"} indent={1} delay={0.12} />
            <Ln n={5} code={"case 'Y': cout << \"Get ready\";   break;"} indent={1} delay={0.16} mark={col.go} />
            <Ln n={6} code={"case 'G': cout << \"Go\";          break;"} indent={1} delay={0.2} />
            <Ln n={7} code={'default:  cout << "Invalid signal";'} indent={1} delay={0.24} />
            <Ln n={8} code="}" delay={0.28} />
          </CodePanel>
          <div style={{ marginTop: 24 }}>
            <Terminal delay={0.8}>Get ready</Terminal>
          </div>
        </div>
        <div className="cs cs-pop" style={d(0.4)}>
          <TrafficLight />
        </div>
        <div className="cs cs-rise" style={{ ...d(0.6), display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
          <Signal k="R" text="Stop" color="#ef4444" />
          <Signal k="Y" text="Get ready" color="#eab308" hit />
          <Signal k="G" text="Go" color={col.go} />
          <p style={{ fontSize: 26, color: col.muted, lineHeight: 1.45, margin: '12px 0 0' }}>
            One <Mono>char</Mono>, one case.
          </p>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- fall-through ---------- */

const Step = ({ x, y, label, text, tag, c, delay }: { x: number; y: number; label: string; text: string; tag: string; c: string; delay: number }) => (
  <g className="cs cs-pop" style={d(delay)}>
    <rect x={x} y={y} width="330" height="110" rx="18" fill={c === col.dim ? '#ffffff' : `${c}17`} stroke={c} strokeWidth="4" strokeDasharray={c === col.dim ? '10 8' : undefined} />
    <text x={x + 26} y={y + 40} fill={col.sw} style={{ fontFamily: font.mono, fontSize: 24, fontWeight: 800 }}>
      {label}
    </text>
    <text x={x + 26} y={y + 82} fill={c === col.dim ? col.muted : col.ink} style={{ fontFamily: font.body, fontSize: 30, fontWeight: 800 }}>
      {text}
    </text>
    <text x={x + 306} y={y + 40} textAnchor="end" fill={c} style={{ fontFamily: font.body, fontSize: 20, fontWeight: 800 }}>
      {tag}
    </text>
  </g>
);

const Cascade = () => (
  <svg width="640" height="560" viewBox="0 0 640 560" style={{ display: 'block', overflow: 'visible' }}>
    <Heads />
    <Step x={20} y={30} label="case 1:" text="Bronze" tag="skipped" c={col.dim} delay={0.4} />
    <Step x={150} y={220} label="case 2:" text="Silver" tag="match" c={col.go} delay={0.6} />
    <Step x={280} y={410} label="case 3:" text="Gold" tag="runs too!" c={col.cond} delay={0.8} />
    <Wire path="M-20 275 H140" t="go" delay={0.6} />
    <FLabel x={-20} y={258} text="level = 2" t="go" delay={0.7} />
    <Wire path="M400 330 V402" t="cond" delay={1} />
    <FLabel x={386} y={376} text="no break → falls through" t="cond" anchor="end" delay={1.1} />
    <Token path="M-20 275 H310 Q400 275 400 330 V470" color={col.cond} begin={1.3} dur={2.6} />
  </svg>
);

const FallThrough: Page = () => (
  <Frame>
    <Body>
      <Header label="switch gotcha" title="Forget break and it falls through" color={col.sw} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 680px', gap: 64, marginTop: 36 }}>
        <div>
          <CodePanel title="medal.cpp" size={28} delay={0.25}>
            <Ln n={1} code="int level = 2;" />
            <Ln n={2} code="switch (level) {" delay={0.04} />
            <Ln n={3} code={'case 1: cout << "Bronze ";'} indent={1} delay={0.08} />
            <Ln n={4} code={'case 2: cout << "Silver ";'} indent={1} delay={0.12} mark={col.go} />
            <Ln n={5} code={'case 3: cout << "Gold ";'} indent={1} delay={0.16} mark={col.cond} />
            <Ln n={6} code="}" delay={0.2} />
          </CodePanel>
          <div style={{ marginTop: 24 }}>
            <Terminal delay={1.2}>Silver Gold</Terminal>
          </div>
          <div className="cs cs-rise" style={{ ...d(1.4), ...card, marginTop: 24, padding: '22px 30px', fontSize: 28, lineHeight: 1.45 }}>
            Without <Mono color={col.sw}>break;</Mono> execution runs into every case below the match. Add{' '}
            <Mono color={col.sw}>break;</Mono> and it prints only <b style={{ color: col.go }}>Silver</b>.
          </div>
        </div>
        <div style={{ paddingLeft: 30 }}>
          <Cascade />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- grouping and rules ---------- */

const Rule = ({ ok, children, delay }: { ok: boolean; children: ReactNode; delay: number }) => (
  <div className="cs cs-left" style={{ ...d(delay), display: 'flex', alignItems: 'center', gap: 20, fontSize: 28, lineHeight: 1.35 }}>
    <span
      style={{
        width: 40,
        height: 40,
        flex: 'none',
        borderRadius: 20,
        background: ok ? `${col.go}1f` : `${col.stop}1f`,
        color: ok ? col.go : col.stop,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {ok ? '✓' : '✗'}
    </span>
    <span>{children}</span>
  </div>
);

const Grouping: Page = () => (
  <Frame>
    <Body>
      <Header label="switch tricks and rules" title="Several cases can share one block" color={col.sw} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginTop: 36 }}>
        <div>
          <CodePanel title="vowel.cpp" size={26} delay={0.25}>
            <Ln n={1} code="char ch = 'e';" />
            <Ln n={2} code="switch (ch) {" delay={0.04} />
            <Ln n={3} code="case 'a': case 'e': case 'i':" indent={1} delay={0.08} mark={col.go} />
            <Ln n={4} code="case 'o': case 'u':" indent={1} delay={0.12} mark={col.go} />
            <Ln n={5} code={'cout << "Vowel";'} indent={2} delay={0.16} />
            <Ln n={6} code="break;" indent={2} delay={0.2} />
            <Ln n={7} code="default:" indent={1} delay={0.24} />
            <Ln n={8} code={'cout << "Consonant";'} indent={2} delay={0.28} />
            <Ln n={9} code="}" delay={0.32} />
          </CodePanel>
          <div style={{ marginTop: 24 }}>
            <Terminal delay={0.8}>Vowel</Terminal>
          </div>
        </div>
        <div className="cs cs-rise" style={{ ...d(0.4), ...card, alignSelf: 'start', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: col.sw }}>switch rules</div>
          <Rule ok delay={0.6}>
            Works on <Mono>int</Mono>, <Mono>char</Mono> and <Mono>enum</Mono> values
          </Rule>
          <Rule ok={false} delay={0.7}>
            No <Mono>double</Mono> or <Mono>string</Mono>
          </Rule>
          <Rule ok delay={0.8}>
            Case labels are constants: <Mono>case 5:</Mono>
          </Rule>
          <Rule ok={false} delay={0.9}>
            No ranges: <Mono>case marks &gt;= 80:</Mono>
          </Rule>
          <Rule ok delay={1}>
            Stacked labels share one block
          </Rule>
          <Rule ok delay={1.1}>
            <Mono>default</Mono> is optional
          </Rule>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- nested switch ---------- */

const MenuItem = ({ n, name, price, hit }: { n: number; name: string; price: string; hit?: boolean }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '48px 1fr auto',
      alignItems: 'center',
      padding: '6px 16px',
      borderRadius: 12,
      background: hit ? `${col.go}1f` : 'transparent',
      boxShadow: hit ? `inset 0 0 0 3px ${col.go}` : undefined,
      fontSize: 28,
      fontWeight: 600,
    }}
  >
    <span style={{ fontFamily: font.mono, color: col.muted }}>{n}</span>
    <span style={{ color: hit ? col.go : undefined, fontWeight: hit ? 800 : 600 }}>{name}</span>
    <span style={{ fontFamily: font.mono, fontSize: 24, color: col.muted }}>{price}</span>
  </div>
);

const MenuSection = ({ n, title, hit, children }: { n: number; title: string; hit?: boolean; children: ReactNode }) => (
  <div
    style={{
      borderRadius: 18,
      padding: '12px 16px',
      border: `3px ${hit ? 'solid' : 'dashed'} ${hit ? col.sw : col.dim}`,
      background: hit ? `${col.sw}0d` : 'transparent',
      opacity: hit ? 1 : 0.7,
    }}
  >
    <div style={{ fontSize: 26, fontWeight: 800, color: hit ? col.sw : col.muted, marginBottom: 6 }}>
      <span style={{ fontFamily: font.mono }}>{n}</span> · {title}
    </div>
    {children}
  </div>
);

const NestedSwitch: Page = () => (
  <Frame>
    <Body>
      <Header label="Nested switch" title="A switch inside a switch: café orders" color={col.sw} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 560px', gap: 56, marginTop: 30, alignItems: 'start' }}>
        <CodePanel title="cafe.cpp" size={24} delay={0.25}>
          <Ln n={1} code="int category = 1, item = 2;" />
          <Ln n={2} code="switch (category) {" delay={0.03} mark={col.sw} />
          <Ln n={3} code="case 1:                          // Drinks" indent={1} delay={0.06} />
          <Ln n={4} code="switch (item) {" indent={2} delay={0.09} mark={col.go} />
          <Ln n={5} code={'case 1: cout << "Tea";     break;'} indent={3} delay={0.12} />
          <Ln n={6} code={'case 2: cout << "Coffee";  break;'} indent={3} delay={0.15} />
          <Ln n={7} code="}" indent={2} delay={0.18} />
          <Ln n={8} code="break;" indent={2} delay={0.21} />
          <Ln n={9} code="case 2:                          // Food" indent={1} delay={0.24} />
          <Ln n={10} code="switch (item) {" indent={2} delay={0.27} />
          <Ln n={11} code={'case 1: cout << "Burger";  break;'} indent={3} delay={0.3} />
          <Ln n={12} code={'case 2: cout << "Pizza";   break;'} indent={3} delay={0.33} />
          <Ln n={13} code="}" indent={2} delay={0.36} />
          <Ln n={14} code="break;" indent={2} delay={0.39} />
          <Ln n={15} code="}" delay={0.42} />
        </CodePanel>
        <div>
          <div className="cs cs-pop" style={{ ...d(0.5), ...card, padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 34, fontWeight: 800 }}>Café menu</span>
              <span style={{ fontSize: 22, fontWeight: 800 }}>
                <span style={{ color: col.sw }}>outer</span> → <span style={{ color: col.go }}>inner</span>
              </span>
            </div>
            <MenuSection n={1} title="Drinks" hit>
              <MenuItem n={1} name="Tea" price="Rs. 80" />
              <MenuItem n={2} name="Coffee" price="Rs. 150" hit />
            </MenuSection>
            <MenuSection n={2} title="Food">
              <MenuItem n={1} name="Burger" price="Rs. 450" />
              <MenuItem n={2} name="Pizza" price="Rs. 900" />
            </MenuSection>
          </div>
          <div className="cs cs-rise" style={{ ...d(0.8), fontSize: 26, fontWeight: 700, lineHeight: 1.45, marginTop: 20 }}>
            <span style={{ color: col.sw }}>Outer switch</span> picks the section,{' '}
            <span style={{ color: col.go }}>inner switch</span> picks the item.
          </div>
          <div style={{ marginTop: 20 }}>
            <Terminal delay={1}>Coffee</Terminal>
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- switch vs if-else ---------- */

const Cell = ({ children, ok }: { children: ReactNode; ok?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, fontWeight: 600 }}>
    {ok !== undefined && (
      <span style={{ fontSize: 28, fontWeight: 800, color: ok ? col.go : col.stop, width: 28 }}>{ok ? '✓' : '✗'}</span>
    )}
    <span>{children}</span>
  </div>
);

const VsRow = ({ aspect, a, b, delay }: { aspect: string; a: ReactNode; b: ReactNode; delay: number }) => (
  <div
    className="cs cs-left"
    style={{
      ...d(delay),
      display: 'grid',
      gridTemplateColumns: '400px 1fr 1fr',
      alignItems: 'center',
      gap: 32,
      padding: '0 36px',
      height: 100,
      borderTop: `1px solid ${col.line}`,
    }}
  >
    <span style={{ fontSize: 28, fontWeight: 800, color: col.muted }}>{aspect}</span>
    {a}
    {b}
  </div>
);

const Versus: Page = () => (
  <Frame>
    <Body>
      <Header label="Choosing" title="switch or if – else?" />
      <div className="cs cs-rise" style={{ ...d(0.2), ...card, marginTop: 40, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '400px 1fr 1fr',
            gap: 32,
            padding: '0 36px',
            height: 84,
            alignItems: 'center',
            background: `${col.ink}08`,
          }}
        >
          <span />
          <span style={{ fontFamily: font.mono, fontSize: 34, fontWeight: 800, color: col.cond }}>if – else</span>
          <span style={{ fontFamily: font.mono, fontSize: 34, fontWeight: 800, color: col.sw }}>switch</span>
        </div>
        <VsRow aspect="What it checks" a={<Cell>Any true / false condition</Cell>} b={<Cell>One value against fixed cases</Cell>} delay={0.35} />
        <VsRow aspect="Ranges (marks >= 80)" a={<Cell ok>Yes</Cell>} b={<Cell ok={false}>No</Cell>} delay={0.45} />
        <VsRow aspect="Types" a={<Cell ok>Any: int, double, string…</Cell>} b={<Cell ok={false}>int, char, enum only</Cell>} delay={0.55} />
        <VsRow aspect="Many fixed options" a={<Cell ok={false}>Long else-if chains</Cell>} b={<Cell ok>Clean and readable</Cell>} delay={0.65} />
        <VsRow aspect="Best for" a={<Cell>Ranges, complex logic</Cell>} b={<Cell>Menus, commands, codes</Cell>} delay={0.75} />
      </div>
    </Body>
  </Frame>
);

/* ---------- ternary ---------- */

const Part = ({ code, label, color, delay }: { code: string; label: string; color: string; delay: number }) => (
  <span className="cs cs-rise" style={{ ...d(delay), display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch' }}>
    <span style={{ fontFamily: font.mono, fontSize: 52, fontWeight: 800, color, whiteSpace: 'pre' }}>{code}</span>
    <span style={{ height: 18, border: `4px solid ${color}`, borderTop: 'none', borderRadius: '0 0 12px 12px', margin: '6px 4px 0' }} />
    <span style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, color, marginTop: 10 }}>{label}</span>
  </span>
);

const Sym = ({ s }: { s: string }) => (
  <span style={{ fontFamily: font.mono, fontSize: 52, fontWeight: 800, color: col.ink, whiteSpace: 'pre' }}>{s}</span>
);

const Ternary: Page = () => (
  <Frame>
    <Body>
      <Header label="A shortcut" title="The ternary operator ? :" color={col.tern} />
      <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 40 }}>
        <Part code="condition" label="ask" color={col.cond} delay={0.3} />
        <Sym s=" ? " />
        <Part code="valueIfTrue" label="when true" color={col.go} delay={0.45} />
        <Sym s=" : " />
        <Part code="valueIfFalse" label="when false" color={col.stop} delay={0.6} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', gap: 16, marginTop: 44 }}>
        <CodePanel title="if – else: 5 lines" size={26} delay={0.7}>
          <Ln code="string status;" />
          <Ln code="if (age >= 18)" delay={0.04} />
          <Ln code={'status = "Adult";'} indent={1} delay={0.08} />
          <Ln code="else" delay={0.12} />
          <Ln code={'status = "Minor";'} indent={1} delay={0.16} />
        </CodePanel>
        <svg className="cs cs-fade" style={d(1)} width="80" height="60" viewBox="0 0 80 60">
          <path d="M8 30 H64 M48 14 L66 30 L48 46" fill="none" stroke={col.tern} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <CodePanel title="ternary: 1 line" size={24} delay={1}>
            <Ln code={'string status = (age >= 18) ? "Adult" : "Minor";'} mark={col.tern} />
          </CodePanel>
          <div className="cs cs-rise" style={{ ...d(1.2), fontSize: 26, color: col.muted, lineHeight: 1.45, marginTop: 18 }}>
            Use it to <b style={{ color: col.ink }}>pick a value</b>. Nesting many <Mono>?:</Mono> gets hard to read.
          </div>
        </div>
      </div>
      <div className="cs cs-rise" style={{ ...d(1.3), display: 'flex', gap: 24, marginTop: 36 }}>
        <div style={{ ...card, flex: 1, padding: '20px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Chip code={'cout << (n % 2 == 0 ? "Even" : "Odd");'} />
          <span style={{ fontFamily: font.mono, fontSize: 26, fontWeight: 800, color: col.go }}>n = 7 → Odd</span>
        </div>
        <div style={{ ...card, flex: 1, padding: '20px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Chip code="int fee = isMember ? 500 : 800;" />
          <span style={{ fontFamily: font.mono, fontSize: 26, fontWeight: 800, color: col.go }}>member → 500</span>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- real-world program: cinema ---------- */

const RunRow = ({ input, out, delay }: { input: string; out: string; delay: number }) => (
  <div
    className="cs cs-left"
    style={{
      ...d(delay),
      ...card,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'center',
      padding: '16px 24px',
    }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 24, fontWeight: 700, color: col.muted }}>
      <span style={{ color: '#b45309' }}>&gt; </span>
      {input}
    </span>
    <span style={{ fontFamily: font.mono, fontSize: 26, fontWeight: 800, color: col.go }}>{out}</span>
  </div>
);

const Ticket = () => (
  <div
    className="cs cs-pop"
    style={{
      ...d(0.5),
      position: 'relative',
      height: 190,
      borderRadius: 22,
      background: `linear-gradient(135deg, ${col.cond}, #f59e0b)`,
      color: '#fff',
      display: 'grid',
      gridTemplateColumns: '1fr 170px',
      overflow: 'hidden',
      boxShadow: '0 24px 40px -24px rgba(234, 88, 12, 0.7)',
    }}
  >
    <div style={{ padding: '26px 32px' }}>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.2em', opacity: 0.85 }}>CINEMA · ADMIT ONE</div>
      <div style={{ fontSize: 56, fontWeight: 800, marginTop: 14 }}>Rs. 200</div>
      <div style={{ fontSize: 24, fontWeight: 700, opacity: 0.9 }}>Student · Tuesday deal</div>
    </div>
    <div
      style={{
        borderLeft: '4px dashed rgba(255, 255, 255, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: font.mono,
        fontSize: 40,
        fontWeight: 800,
      }}
    >
      A12
    </div>
    <span style={{ position: 'absolute', left: 'calc(100% - 192px)', top: -20, width: 40, height: 40, borderRadius: 20, background: 'var(--osd-bg)' }} />
    <span style={{ position: 'absolute', left: 'calc(100% - 192px)', bottom: -20, width: 40, height: 40, borderRadius: 20, background: 'var(--osd-bg)' }} />
  </div>
);

const Cinema: Page = () => (
  <Frame>
    <Body>
      <Header label="Putting it together" title="Real program: cinema ticket price" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 560px', gap: 56, marginTop: 30 }}>
        <CodePanel title="cinema.cpp" size={24} delay={0.25}>
          <Ln n={1} code="int age, price;" />
          <Ln n={2} code="bool student;" delay={0.03} />
          <Ln n={3} code="char day;" delay={0.06} />
          <Ln n={4} code="cin >> age >> student >> day;" delay={0.09} />
          <Ln n={5} delay={0.12} />
          <Ln n={6} code="if (age < 5)          price = 0;" delay={0.15} mark={col.cond} />
          <Ln n={7} code="else if (age >= 60)   price = 300;" delay={0.18} mark={col.cond} />
          <Ln n={8} code="else if (student)     price = 300;" delay={0.21} mark={col.cond} />
          <Ln n={9} code="else                  price = 500;" delay={0.24} mark={col.cond} />
          <Ln n={10} delay={0.27} />
          <Ln n={11} code="if (day == 'T') {                // Tuesday deal" delay={0.3} mark={col.sw} />
          <Ln n={12} code="if (price > 0) price = price - 100;" indent={1} delay={0.33} mark={col.sw} />
          <Ln n={13} code="}" delay={0.36} />
          <Ln n={14} code={'if (price == 0) cout << "Free entry";'} delay={0.39} />
          <Ln n={15} code={'else            cout << "Ticket: Rs. " << price;'} delay={0.42} />
        </CodePanel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Ticket />
          <div className="cs cs-fade" style={{ ...d(0.7), fontSize: 24, fontWeight: 700, color: col.muted, marginTop: 10 }}>
            Input: age, student (1 / 0), day
          </div>
          <RunRow input="30 0 M" out="Ticket: Rs. 500" delay={0.8} />
          <RunRow input="20 1 T" out="Ticket: Rs. 200" delay={0.95} />
          <RunRow input="65 0 W" out="Ticket: Rs. 300" delay={1.1} />
          <RunRow input="3 0 S" out="Free entry" delay={1.25} />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- quick check ---------- */

const Quiz = ({ code, out, why, color, delay }: { code: string; out: string; why: string; color: string; delay: number }) => (
  <div
    className="cs cs-up"
    style={{
      ...d(delay),
      ...card,
      display: 'grid',
      gridTemplateColumns: '1040px 1fr',
      alignItems: 'center',
      gap: 36,
      padding: '20px 32px',
      minHeight: 116,
      boxSizing: 'border-box',
    }}
  >
    <Chip code={code} size={22} />
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
      <span style={{ fontFamily: font.mono, fontSize: 44, fontWeight: 800, color, whiteSpace: 'nowrap' }}>{out}</span>
      <span style={{ fontSize: 24, color: col.muted }}>{why}</span>
    </div>
  </div>
);

const Check: Page = () => (
  <Frame>
    <Body>
      <Header label="Quick check" title="What is the output?" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 40 }}>
        <Quiz code={'int x = 7;  if (x % 2 == 0) cout << "Even"; else cout << "Odd";'} out="Odd" why="7 % 2 is 1" color={col.cond} delay={0.3} />
        <Quiz code={'int t = 25;  if (t > 30) cout << "Hot"; else if (t > 20) cout << "Warm";'} out="Warm" why="second test is true" color={col.go} delay={0.45} />
        <Quiz code={'int m = 85;  cout << (m >= 90 ? "A" : m >= 80 ? "B" : "C");'} out="B" why="first true test wins" color={col.tern} delay={0.6} />
        <Quiz code={'int n = 1;  switch (n) { case 1: cout << "One "; case 2: cout << "Two"; }'} out="One Two" why="no break" color={col.sw} delay={0.75} />
      </div>
    </Body>
  </Frame>
);

/* ---------- takeaway ---------- */

const Tool = ({ code, color, text, delay }: { code: string; color: string; text: string; delay: number }) => (
  <div
    className="cs cs-left"
    style={{ ...d(delay), display: 'grid', gridTemplateColumns: '250px 1fr', alignItems: 'center', gap: 24, padding: '14px 0', borderTop: `1px solid ${col.line}` }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 28, fontWeight: 800, color }}>{code}</span>
    <span style={{ fontSize: 28, fontWeight: 600 }}>{text}</span>
  </div>
);

const Takeaway: Page = () => (
  <Frame footer={false}>
    <div style={{ position: 'absolute', inset: '0 120px 0 140px', display: 'grid', gridTemplateColumns: '1fr 940px', gap: 72, alignItems: 'center' }}>
      <div>
        <Label>That's a wrap</Label>
        <h2
          className="cs cs-rise"
          style={{ ...d(0.1), fontFamily: font.display, fontSize: 104, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.04, margin: '24px 0 32px' }}
        >
          Pick the
          <br />
          right <span style={{ color: col.cond }}>tool</span>
        </h2>
        <p className="cs cs-rise" style={{ ...d(0.25), fontSize: 36, color: col.muted, lineHeight: 1.5, margin: 0 }}>
          Every decision is a condition that is either <b style={{ color: col.go }}>true</b> or{' '}
          <b style={{ color: col.stop }}>false</b>.
        </p>
      </div>
      <div className="cs cs-rise" style={{ ...d(0.3), ...card, padding: '22px 40px 26px' }}>
        <Tool code="if" color={col.cond} text="Run code only when it is true" delay={0.5} />
        <Tool code="if … else" color={col.go} text="Choose between two paths" delay={0.6} />
        <Tool code="else if" color={col.cond} text="Test ranges, top to bottom" delay={0.7} />
        <Tool code="nested" color={col.cond} text="A decision inside a decision" delay={0.8} />
        <Tool code="switch" color={col.sw} text="One value against fixed cases" delay={0.9} />
        <Tool code="? :" color={col.tern} text="Pick one of two values in one line" delay={1} />
      </div>
    </div>
  </Frame>
);

/* ---------- transitions ---------- */

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const settle: SlideTransition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};
Cover.transition = settle;
Takeaway.transition = settle;

export const meta: SlideMeta = {
  title: 'Conditional Statements in C++',
  createdAt: '2026-10-10T12:08:56.287Z',
};

export default [
  Cover,
  WhatIs,
  IfPage,
  IfElse,
  ElseIf,
  Nested,
  Pitfalls,
  SwitchPage,
  SwitchTraffic,
  FallThrough,
  Grouping,
  NestedSwitch,
  Versus,
  Ternary,
  Cinema,
  Check,
  Takeaway,
] satisfies Page[];
