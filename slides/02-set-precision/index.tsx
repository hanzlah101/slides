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
  palette: { bg: '#f4f2fb', text: '#1d1838', accent: '#5b3df5' },
  fonts: {
    display: 'Futura, "Century Gothic", "Trebuchet MS", system-ui, sans-serif',
    body: '"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 168, body: 34 },
  radius: 22,
};

// Each idea owns one colour across the deck:
// violet = significant digits (no fixed), teal = fixed / digits after the point,
// coral = rounding and gotchas, sun = money and highlights.
const col = {
  violet: '#5b3df5',
  teal: '#0e9f8e',
  coral: '#ef4d5a',
  sun: '#f5a50b',
  ink: '#1d1838',
  muted: '#6e6a8a',
  dim: '#a8a4c2',
  line: 'rgba(29, 24, 56, 0.12)',
  panel: '#ffffff',
  code: '#1d1838',
  codeLine: 'rgba(255, 255, 255, 0.10)',
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
  .sp { animation-fill-mode: both; animation-timing-function: ${EASE}; }
  [data-still] .sp { animation: none !important; }
  @media (prefers-reduced-motion: reduce) { .sp { animation: none !important; } }
  .sp-rise { animation-name: sp-rise; animation-duration: .5s; }
  .sp-left { animation-name: sp-left; animation-duration: .45s; }
  .sp-fade { animation-name: sp-fade; animation-duration: .5s; }
  .sp-pop { animation-name: sp-pop; animation-duration: .4s; }
  .sp-dim { animation-name: sp-dim; animation-duration: .5s; }
  .sp-turn { animation-name: sp-turn; animation-duration: .9s; }
  .sp-up { animation-name: sp-up; animation-duration: .5s; }
  .sp-draw { stroke-dasharray: 1; animation-name: sp-draw; animation-duration: .7s; }
  @keyframes sp-rise { from { opacity: 0; transform: translateY(10px); } }
  @keyframes sp-left { from { opacity: 0; transform: translateX(-10px); } }
  @keyframes sp-fade { from { opacity: 0; } }
  @keyframes sp-pop { from { opacity: 0; transform: scale(.96); } }
  @keyframes sp-dim { from { opacity: 1; transform: translateY(0); } }
  @keyframes sp-turn { from { transform: rotate(-135deg); } }
  @keyframes sp-up { from { opacity: 0; transform: translateY(28px); } }
  @keyframes sp-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
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
    'radial-gradient(900px 640px at 92% 0%, rgba(91, 61, 245, 0.10), transparent 62%)',
    'radial-gradient(800px 560px at 0% 100%, rgba(14, 159, 142, 0.08), transparent 60%)',
    'radial-gradient(rgba(29, 24, 56, 0.09) 1.5px, transparent 1.5px)',
  ].join(', '),
  backgroundSize: 'auto, auto, 40px 40px',
  WebkitFontSmoothing: 'antialiased',
  fontVariantLigatures: 'none',
  fontFeatureSettings: '"calt" 0, "liga" 0',
};

/* ---------- shared pieces ---------- */

const pad = (n: number) => String(n).padStart(2, '0');

// A measuring ruler doubles as the progress bar: the marker sits at this page.
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
        alignItems: 'flex-end',
        gap: 32,
        fontSize: 22,
        fontWeight: 600,
        color: col.muted,
      }}
    >
      <span>Set precision</span>
      <div
        style={{
          flex: 1,
          position: 'relative',
          height: 22,
          marginBottom: 4,
          borderBottom: `2px solid ${col.dim}`,
          backgroundImage: [
            `repeating-linear-gradient(90deg, ${col.dim} 0 2px, transparent 2px 120px)`,
            `repeating-linear-gradient(90deg, ${col.dim} 0 1px, transparent 1px 24px)`,
          ].join(', '),
          backgroundSize: '100% 22px, 100% 10px',
          backgroundPosition: 'left bottom, left bottom',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${at}%`,
            bottom: -2,
            width: 4,
            height: 34,
            marginLeft: -2,
            borderRadius: 2,
            background: col.violet,
          }}
        />
      </div>
      <span style={{ fontFamily: font.mono, fontSize: 22 }}>
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
  <div style={{ position: 'absolute', inset: '92px 120px 116px' }}>{children}</div>
);

const Label = ({ children, color = col.violet }: { children: ReactNode; color?: string }) => (
  <div
    className="sp sp-fade"
    style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 700, color }}
  >
    <span style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
    {children}
  </div>
);

const Header = ({ label, title, color = col.violet }: { label: string; title: ReactNode; color?: string }) => (
  <div>
    <Label color={color}>{label}</Label>
    <h2
      className="sp sp-rise"
      style={{
        ...d(0.08),
        fontFamily: font.display,
        fontSize: 66,
        fontWeight: 700,
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
  boxShadow: '0 26px 50px -30px rgba(45, 30, 120, 0.35)',
};

const Mono = ({ children, color, size }: { children: ReactNode; color?: string; size?: number }) => (
  <span style={{ fontFamily: font.mono, color, fontSize: size, fontWeight: 600 }}>{children}</span>
);

/* ---------- digit readout: the deck's signature visual ---------- */

// Draws a number as digit tiles. The first `keep` characters are what cout
// prints; the rest fall away. `count` numbers the digits setprecision counts:
// 'sig' counts every digit, 'fixed' only those after the point.
const Readout = ({
  text,
  keep = text.length,
  count,
  color = col.violet,
  size = 64,
  delay = 0,
  round,
  extra,
}: {
  text: string;
  keep?: number;
  count?: 'sig' | 'fixed';
  color?: string;
  size?: number;
  delay?: number;
  round?: number;
  extra?: number;
}) => {
  let n = 0;
  let after = false;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: size * 0.1, fontFamily: font.mono }}>
      {text.split('').map((ch, i) => {
        const dot = ch === '.';
        if (dot) after = true;
        const kept = i < keep;
        const counted = kept && !dot && (count === 'sig' || (count === 'fixed' && after));
        if (counted) n += 1;
        const hot = i === round;
        const added = extra !== undefined && i >= extra;
        const tone = hot ? col.coral : added ? col.sun : color;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              className={kept ? 'sp sp-pop' : 'sp sp-dim'}
              style={{
                ...d(kept ? delay : delay + 0.4),
                width: dot ? size * 0.36 : size * 0.8,
                height: size * 1.24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: size,
                fontWeight: 700,
                borderRadius: size * 0.18,
                boxSizing: 'border-box',
                background: kept && !dot ? (hot || added ? `${tone}1f` : col.panel) : 'transparent',
                border: dot ? 'none' : kept ? `3px solid ${tone}` : `3px dashed ${col.dim}`,
                color: hot || added ? tone : kept ? 'var(--osd-text)' : col.muted,
                opacity: kept ? 1 : 0.3,
                transform: kept ? undefined : 'translateY(12px)',
              }}
            >
              {ch}
            </div>
            {count && (
              <div style={{ height: 30, marginTop: 8, fontSize: 20, fontWeight: 700, color }}>{counted ? n : ''}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- the precision knob ---------- */

const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
};

// A rotary dial from 0 to 10; the pointer turns to `value` on entry.
const Knob = ({ value, size = 420, color = col.violet }: { value: number; size?: number; color?: string }) => {
  const angle = -135 + value * 27;
  const [sx, sy] = polar(80, -135);
  const [ex, ey] = polar(80, angle);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="sp-knob" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e4e0f5" />
        </radialGradient>
      </defs>
      <path
        d={`M ${sx} ${sy} A 80 80 0 1 1 ${polar(80, 135)[0]} ${polar(80, 135)[1]}`}
        fill="none"
        stroke={col.line}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        className="sp sp-draw"
        style={d(0.3)}
        pathLength={1}
        d={`M ${sx} ${sy} A 80 80 0 ${value * 27 > 180 ? 1 : 0} 1 ${ex} ${ey}`}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {Array.from({ length: 11 }, (_, i) => {
        const [x1, y1] = polar(68, -135 + i * 27);
        const [x2, y2] = polar(73, -135 + i * 27);
        const [tx, ty] = polar(94, -135 + i * 27);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col.dim} strokeWidth="2" strokeLinecap="round" />
            <text
              x={tx}
              y={ty}
              textAnchor="middle"
              dominantBaseline="central"
              fill={i === value ? color : col.muted}
              style={{ fontFamily: font.mono, fontSize: 10, fontWeight: i === value ? 800 : 500 }}
            >
              {i}
            </text>
          </g>
        );
      })}
      <circle cx="100" cy="104" r="58" fill="rgba(45, 30, 120, 0.12)" />
      <circle cx="100" cy="100" r="58" fill="url(#sp-knob)" stroke={col.line} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="44" fill="none" stroke={col.line} strokeWidth="1.5" />
      <g className="sp sp-turn" style={{ ...d(0.3), transform: `rotate(${angle}deg)`, transformOrigin: '100px 100px' }}>
        <line x1="100" y1="94" x2="100" y2="52" stroke={color} strokeWidth="7" strokeLinecap="round" />
        <circle cx="100" cy="100" r="8" fill={color} />
      </g>
    </svg>
  );
};

/* ---------- C++ code ---------- */

const TOKEN =
  /(\/\/.*$|"[^"]*"|<[a-z]+>|#include|\b(?:setprecision|fixed|scientific|setw|showpoint)\b|\b(?:int|double|float|using|namespace|std|return|cout|cin|endl|main)\b|\b\d+(?:\.\d+)?\b)/;

const hl = (src: string) =>
  src.split(TOKEN).map((t, i) => {
    if (!t) return null;
    let color = '#ece9ff';
    let weight = 400;
    if (i % 2 === 1) {
      if (t.startsWith('//')) color = '#8e89b3';
      else if (t.startsWith('"') || t.startsWith('<')) color = '#7fe0c9';
      else if (/^\d/.test(t)) color = '#ff9aa2';
      else if (/^(setprecision|fixed|scientific|setw|showpoint)$/.test(t)) {
        color = '#ffc24d';
        weight = 700;
      } else color = '#b6a6ff';
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
  size = 30,
  width,
  delay = 0.15,
}: {
  children: ReactNode;
  title?: string;
  size?: number;
  width?: number | string;
  delay?: number;
}) => (
  <div
    className="sp sp-rise"
    style={{ ...d(delay), borderRadius: 'var(--osd-radius)', background: col.code, width, boxShadow: card.boxShadow }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '18px 30px',
        borderBottom: `1px solid ${col.codeLine}`,
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col.coral }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col.sun }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col.teal }} />
      <span style={{ marginLeft: 14, fontFamily: font.mono, fontSize: 20, color: '#8e89b3' }}>{title}</span>
    </div>
    <div style={{ padding: '22px 30px 26px', fontFamily: font.mono, fontSize: size, lineHeight: 1.6, color: '#ece9ff' }}>
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
    className="sp sp-left"
    style={{
      ...d(0.3 + delay),
      display: 'flex',
      alignItems: 'center',
      margin: '0 -30px',
      padding: '0 30px',
      background: mark ? `${mark}2e` : undefined,
      boxShadow: mark ? `inset 5px 0 0 ${mark}` : undefined,
    }}
  >
    {n !== undefined && <span style={{ width: '2em', color: '#6c6791', fontSize: '0.7em' }}>{n}</span>}
    <span style={{ paddingLeft: `${indent * 1.6}em`, whiteSpace: 'pre', minHeight: '1.6em' }}>{hl(code)}</span>
  </div>
);

/* ---------- Cover ---------- */

const Cover: Page = () => (
  <Frame footer={false}>
    <div
      style={{
        position: 'absolute',
        left: 140,
        top: 0,
        bottom: 0,
        width: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Label>Fundamentals of Programming</Label>
      <h1
        className="sp sp-rise"
        style={{
          ...d(0.1),
          fontFamily: font.display,
          fontSize: 124,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.02,
          whiteSpace: 'nowrap',
          margin: '30px 0 36px',
        }}
      >
        Set precision
        <br />
        in C++
      </h1>
      <p
        className="sp sp-rise"
        style={{ ...d(0.25), fontSize: 42, color: col.muted, margin: 0, lineHeight: 1.4, maxWidth: 860 }}
      >
        Making decimal output look the way we actually want
      </p>
    </div>

    <div
      style={{
        position: 'absolute',
        left: 1180,
        top: 0,
        bottom: 0,
        width: 620,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <div className="sp sp-pop" style={d(0.2)}>
        <Knob value={2} size={440} color={col.teal} />
      </div>
      <Readout text="3.14159" keep={4} color={col.teal} size={60} delay={0.9} />
    </div>
  </Frame>
);

/* ---------- Objectives ---------- */

const Objective = ({ verb, text, color }: { verb: string; text: ReactNode; color: string }) => (
  <div
    className="sp sp-rise"
    style={{ ...card, height: '100%', boxSizing: 'border-box', padding: '34px 38px', borderTop: `8px solid ${color}` }}
  >
    <div style={{ fontFamily: font.display, fontSize: 48, fontWeight: 700, color }}>{verb}</div>
    <div style={{ fontSize: 30, color: col.muted, lineHeight: 1.45, marginTop: 10 }}>{text}</div>
  </div>
);

const Objectives: Page = () => (
  <Frame>
    <Body>
      <Header label="Our goals" title="By the end of today you'll be able to…" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: 270,
          gap: 32,
          marginTop: 56,
        }}
      >
        <Objective verb="Define" text="precision, and why formatting decimal output matters" color={col.violet} />
        <Objective verb="Use" text={<>setprecision() from the &lt;iomanip&gt; library</>} color={col.teal} />
        <Objective verb="Explain" text="the difference between default and fixed output" color={col.sun} />
        <Objective verb="Identify" text="common output-formatting manipulators" color={col.coral} />
        <Objective verb="Predict" text="the output of code that uses setprecision()" color={col.violet} />
        <Objective verb="Write" text="a simple program that displays money and averages correctly" color={col.teal} />
      </div>
    </Body>
  </Frame>
);

/* ---------- What is precision ---------- */

const Chip = () => (
  <svg width="720" height="176" viewBox="0 0 720 176" style={{ position: 'absolute', inset: 0 }}>
    {Array.from({ length: 12 }, (_, i) => (
      <g key={i}>
        <rect x={60 + i * 52} y="0" width="16" height="22" rx="4" fill={col.dim} />
        <rect x={60 + i * 52} y="154" width="16" height="22" rx="4" fill={col.dim} />
      </g>
    ))}
    <rect x="10" y="16" width="700" height="144" rx="20" fill={col.code} />
  </svg>
);

const Monitor = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'relative', width: 560, height: 330, margin: '0 auto' }}>
    <svg width="560" height="330" viewBox="0 0 560 330" style={{ position: 'absolute', inset: 0 }}>
      <rect x="4" y="4" width="552" height="262" rx="22" fill={col.panel} stroke={col.ink} strokeWidth="6" />
      <rect x="26" y="26" width="508" height="218" rx="10" fill="#efeafe" />
      <path d="M240 268 L224 314 H336 L320 268 Z" fill={col.ink} />
      <rect x="180" y="310" width="200" height="14" rx="7" fill={col.ink} />
    </svg>
    <div
      style={{
        position: 'absolute',
        left: 26,
        top: 26,
        width: 508,
        height: 218,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  </div>
);

const WhatIs: Page = () => (
  <Frame>
    <Body>
      <Header label="The basics" title="What is precision?" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 720px', gap: 80, marginTop: 40 }}>
        <div>
          <p
            className="sp sp-rise"
            style={{ ...d(0.2), fontSize: 46, lineHeight: 1.38, fontWeight: 600, margin: '20px 0 0' }}
          >
            Precision is the number of digits a program displays when it prints a decimal number.
          </p>
          <div
            className="sp sp-rise"
            style={{ ...d(0.4), ...card, padding: '30px 36px', marginTop: 52, borderLeft: `8px solid ${col.teal}` }}
          >
            <div style={{ fontSize: 34, fontWeight: 700 }}>The variable keeps its full value in memory.</div>
            <div style={{ fontSize: 30, color: col.muted, marginTop: 8, lineHeight: 1.45 }}>
              Precision only affects the output shown on screen.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="sp sp-rise" style={{ ...d(0.3), position: 'relative', width: 720, height: 176 }}>
            <Chip />
            <div
              style={{
                position: 'absolute',
                inset: '16px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 22, color: '#8e89b3' }}>double pi, in memory</span>
              <span style={{ fontFamily: font.mono, fontSize: 44, fontWeight: 700, color: '#7fe0c9' }}>
                3.14159265358979
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 100 }}>
            <svg width="40" height="100" viewBox="0 0 40 100">
              <line
                x1="20"
                y1="4"
                x2="20"
                y2="78"
                stroke={col.violet}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="8 8"
              />
              <polygon points="6,74 20,96 34,74" fill={col.violet} />
            </svg>
            <span
              className="sp sp-fade"
              style={{ ...d(0.6), fontFamily: font.mono, fontSize: 28, fontWeight: 600, color: col.violet }}
            >
              cout &lt;&lt; pi;
            </span>
          </div>
          <div className="sp sp-rise" style={d(0.5)}>
            <Monitor>
              <Readout text="3.14159" count="sig" size={56} delay={0.9} />
            </Monitor>
          </div>
          <div
            className="sp sp-fade"
            style={{ ...d(1.1), fontSize: 26, fontWeight: 700, color: col.violet, marginTop: 14 }}
          >
            Default C++ output: 6 significant digits
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Why ---------- */

const ReceiptIcon = ({ color, size = 84 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round">
    <path d="M14 6 H50 V58 L44 53 L38 58 L32 53 L26 58 L20 53 L14 58 Z" fill={`${color}1a`} />
    <path d="M22 18 H42 M22 28 H42 M22 38 H34" strokeLinecap="round" />
  </svg>
);

const ReportIcon = ({ color, size = 84 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
    <rect x="10" y="6" width="44" height="52" rx="6" fill={`${color}1a`} />
    <path d="M20 46 V36 M32 46 V24 M44 46 V30" strokeWidth="6" />
  </svg>
);

const Reason = ({
  icon,
  title,
  before,
  after,
}: {
  icon: ReactNode;
  title: string;
  before: string;
  after: string;
}) => (
  <div className="sp sp-rise" style={{ ...card, padding: '30px 40px', height: '100%', boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {icon}
      <div style={{ fontFamily: font.display, fontSize: 40, fontWeight: 700 }}>{title}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30 }}>
      <svg width="34" height="34" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r="15" fill={`${col.coral}22`} />
        <path d="M11 11 L23 23 M23 11 L11 23" stroke={col.coral} strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 36,
          color: col.muted,
          textDecoration: `line-through ${col.coral} 3px`,
        }}
      >
        {before}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
      <svg width="34" height="34" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r="15" fill={`${col.teal}22`} />
        <path d="M10 17 L15 22 L24 12" fill="none" stroke={col.teal} strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: font.mono, fontSize: 52, fontWeight: 700, color: col.teal }}>{after}</span>
    </div>
  </div>
);

const Why: Page = () => (
  <Frame>
    <Body>
      <Header label="Why it matters" title="Why does precision matter?" />
      <p className="sp sp-rise" style={{ ...d(0.2), fontSize: 34, lineHeight: 1.5, margin: '32px 0 0', maxWidth: 1500 }}>
        Programs often display prices, averages, percentages and measurements. Raw floating-point output can contain
        more digits than we need.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: 300, gap: 32, marginTop: 36 }}>
        <Reason icon={<ReceiptIcon color={col.sun} size={64} />} title="Prices" before="3.14159265358979" after="3.14" />
        <Reason icon={<ReportIcon color={col.violet} size={64} />} title="Averages" before="59.9" after="59.90" />
      </div>
      <div
        className="sp sp-rise"
        style={{ ...card, marginTop: 32, padding: '26px 36px', borderLeft: `8px solid ${col.violet}` }}
      >
        <div style={{ fontSize: 32, fontWeight: 700 }}>
          <Mono color={col.violet}>setprecision()</Mono> lets us control how a decimal value is displayed.
        </div>
        <div style={{ fontSize: 28, color: col.muted, marginTop: 8 }}>
          Important: the stored value does not change. Only its display changes.
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Syntax ---------- */

const Part = ({ w, label, color, delay }: { w: number; label: string; color: string; delay: number }) => (
  <div className="sp sp-rise" style={{ ...d(delay), width: w, flex: 'none' }}>
    <div
      style={{
        height: 22,
        border: `4px solid ${color}`,
        borderTop: 'none',
        borderRadius: '0 0 14px 14px',
        margin: '0 6px',
      }}
    />
    <div style={{ textAlign: 'center', fontSize: 26, fontWeight: 600, color, marginTop: 12, lineHeight: 1.3 }}>
      {label}
    </div>
  </div>
);

const Syntax: Page = () => (
  <Frame>
    <Body>
      <Header label="Writing it in C++" title="The basic syntax" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 48, marginTop: 44 }}>
        <CodePanel size={30}>
          <Ln n={1} code="#include <iostream>" />
          <Ln n={2} code="#include <iomanip>     // needed for setprecision" delay={0.08} mark={col.sun} />
          <Ln n={3} code="using namespace std;" delay={0.16} />
          <Ln n={4} delay={0.24} />
          <Ln n={5} code="cout << setprecision(n) << value;" delay={0.32} />
        </CodePanel>
        <div className="sp sp-rise" style={{ ...d(0.5), ...card, padding: '34px 38px' }}>
          <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.4 }}>
            <Mono color={col.sun}>&lt;iomanip&gt;</Mono> provides <Mono color={col.violet}>setprecision()</Mono>.
          </div>
          <div style={{ height: 1, background: col.line, margin: '26px 0' }} />
          <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.4 }}>
            Replace <Mono color={col.violet}>n</Mono> with the number of digits you want to display.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 64 }}>
        <div
          className="sp sp-fade"
          style={{ ...d(0.6), fontFamily: font.mono, fontSize: 56, fontWeight: 700, whiteSpace: 'pre' }}
        >
          <span style={{ color: col.ink }}>cout</span>
          <span style={{ color: col.dim }}> &lt;&lt; </span>
          <span style={{ color: col.violet }}>setprecision(n)</span>
          <span style={{ color: col.dim }}> &lt;&lt; </span>
          <span style={{ color: col.teal }}>value</span>
          <span style={{ color: col.dim }}>;</span>
        </div>
        <div style={{ display: 'flex', marginTop: 6 }}>
          <Part w={134} label="the screen" color={col.ink} delay={0.9} />
          <div style={{ width: 134, flex: 'none' }} />
          <Part w={504} label="digits to display" color={col.violet} delay={1.1} />
          <div style={{ width: 134, flex: 'none' }} />
          <Part w={168} label="the number" color={col.teal} delay={1.3} />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Toolbox ---------- */

const Tool = ({ name, lib, purpose, color }: { name: string; lib: string; purpose: string; color: string }) => (
  <div
    className="sp sp-up"
    style={{
      ...card,
      display: 'grid',
      gridTemplateColumns: '360px 190px 1fr',
      alignItems: 'center',
      gap: 32,
      padding: '24px 36px',
      borderLeft: `8px solid ${color}`,
    }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 36, fontWeight: 700, color }}>{name}</span>
    <span
      style={{
        justifySelf: 'start',
        fontFamily: font.mono,
        fontSize: 22,
        padding: '6px 14px',
        borderRadius: 10,
        background: `${col.ink}0d`,
        color: col.ink,
      }}
    >
      {lib}
    </span>
    <span style={{ fontSize: 30, color: col.ink }}>{purpose}</span>
  </div>
);

const Toolbox: Page = () => (
  <Frame>
    <Body>
      <Header label="Formatting toolbox" title="Other useful output manipulators" color={col.teal} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 44 }}>
        <Tool name="setprecision(n)" lib="<iomanip>" purpose="Controls how many digits are shown" color={col.violet} />
        <Tool
          name="fixed"
          lib="<iostream>"
          purpose="Normal decimal form; makes n mean digits after the point"
          color={col.teal}
        />
        <Tool name="scientific" lib="<iostream>" purpose="Displays numbers like 1.23e+03" color={col.coral} />
        <Tool name="setw(n)" lib="<iomanip>" purpose="Sets the width of the next output field" color={col.sun} />
        <Tool
          name="showpoint"
          lib="<iostream>"
          purpose="Always shows the decimal point and trailing zeros"
          color={col.ink}
        />
      </div>
    </Body>
  </Frame>
);

/* ---------- The problem, and fixed ---------- */

const ResultRow = ({ value, out, note, color }: { value: string; out: string; note?: string; color: string }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      alignItems: 'baseline',
      padding: '14px 0',
      borderTop: `1px solid ${col.line}`,
    }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 28, color: col.muted }}>{value}</span>
    <span style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
      <span style={{ fontFamily: font.mono, fontSize: 40, fontWeight: 700, color }}>{out}</span>
      {note && <span style={{ fontSize: 24, color: col.muted }}>{note}</span>}
    </span>
  </div>
);

const ResultCard = ({
  code,
  color,
  children,
}: {
  code: string;
  color: string;
  children: ReactNode;
}) => (
  <div className="sp sp-rise" style={{ ...card, padding: '26px 36px 14px', borderTop: `10px solid ${color}` }}>
    <div
      style={{
        display: 'inline-block',
        background: col.code,
        borderRadius: 12,
        padding: '10px 18px',
        fontFamily: font.mono,
        fontSize: 26,
        marginBottom: 12,
      }}
    >
      {hl(code)}
    </div>
    {children}
  </div>
);

const Problem: Page = () => (
  <Frame>
    <Body>
      <Header label="The key idea" title="setprecision(2) alone isn't enough" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 40 }}>
        <ResultCard code="cout << setprecision(2) << value;" color={col.coral}>
          <ResultRow value="3.14159" out="3.1" note="only 2 digits in total" color={col.coral} />
          <ResultRow value="9.5" out="9.5" note="no trailing zero" color={col.coral} />
          <ResultRow value="59.9" out="60" note="the average changed!" color={col.coral} />
          <ResultRow value="1250.75" out="1.3e+03" note="scientific" color={col.coral} />
        </ResultCard>
        <ResultCard code="cout << fixed << setprecision(2) << value;" color={col.teal}>
          <ResultRow value="3.14159" out="3.14" color={col.teal} />
          <ResultRow value="9.5" out="9.50" color={col.teal} />
          <ResultRow value="59.9" out="59.90" color={col.teal} />
          <ResultRow value="1250.75" out="1250.75" color={col.teal} />
        </ResultCard>
      </div>
      <div
        className="sp sp-rise"
        style={{
          ...card,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr 1fr',
          alignItems: 'center',
          gap: 40,
          marginTop: 28,
          padding: '22px 36px',
        }}
      >
        <span style={{ fontFamily: font.mono, fontSize: 36, fontWeight: 700, color: col.teal }}>fixed</span>
        <span style={{ fontSize: 28 }}>
          Without it, n = <b style={{ color: col.coral }}>total significant digits</b>
        </span>
        <span style={{ fontSize: 28 }}>
          With it, n = <b style={{ color: col.teal }}>digits after the decimal point</b>
        </span>
      </div>
    </Body>
  </Frame>
);

// Output shown on the right of a code line.
const OutTag = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      marginLeft: 'auto',
      padding: '0 16px',
      borderRadius: 10,
      background: 'rgba(127, 224, 201, 0.16)',
      color: '#7fe0c9',
      fontWeight: 700,
    }}
  >
    {children}
  </span>
);

/* ---------- setprecision in action ---------- */

const CodeRow = ({ code, out }: { code: string; out?: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Ln code={code} />
    {out !== undefined && <OutTag>{out}</OutTag>}
  </div>
);

const InAction: Page = () => (
  <Frame>
    <Body>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Header label="setprecision in action" title="Same pi, two modes" />
        <div
          className="sp sp-rise"
          style={{
            ...d(0.2),
            padding: '14px 28px',
            borderRadius: 16,
            background: col.code,
            fontFamily: font.mono,
            fontSize: 30,
          }}
        >
          {hl('double pi = 3.14159265358979;')}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 40, alignItems: 'center', marginTop: 40 }}>
        <CodePanel title="without fixed" size={30}>
          <CodeRow code="cout << pi;" out="3.14159" />
          <CodeRow code="cout << setprecision(4) << pi;" out="3.142" />
          <CodeRow code="cout << setprecision(10) << pi;" out="3.141592654" />
        </CodePanel>
        <p className="sp sp-rise" style={{ ...d(0.4), fontSize: 34, lineHeight: 1.45, margin: 0 }}>
          n = <b style={{ color: col.violet }}>significant digits</b>, on both sides of the point.
        </p>
        <CodePanel title="with fixed" size={30} delay={0.25}>
          <CodeRow code="cout << fixed << setprecision(2) << pi;" out="3.14" />
          <CodeRow code="cout << fixed << setprecision(4) << pi;" out="3.1416" />
          <CodeRow code="cout << fixed << setprecision(3) << 2.5;" out="2.500" />
        </CodePanel>
        <p className="sp sp-rise" style={{ ...d(0.5), fontSize: 34, lineHeight: 1.45, margin: 0 }}>
          n = <b style={{ color: col.teal }}>digits after the point</b>. fixed adds trailing zeros when needed.
        </p>
      </div>
    </Body>
  </Frame>
);

/* ---------- Watch out ---------- */

const WatchIcon = ({ kind, color }: { kind: 'sticky' | 'round' | 'memory' | 'sci'; color: string }) => (
  <div
    style={{
      width: 64,
      height: 64,
      borderRadius: 32,
      flex: 'none',
      background: `${color}1f`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg
      width="36"
      height="36"
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === 'sticky' && (
        <>
          <path d="M12 10 H52 V40 L40 54 H12 Z" />
          <path d="M52 40 H40 V54" />
        </>
      )}
      {kind === 'round' && (
        <>
          <path d="M10 48 Q26 10 52 22" />
          <path d="M40 14 L53 22 L44 34" />
        </>
      )}
      {kind === 'memory' && (
        <>
          <rect x="14" y="14" width="36" height="36" rx="6" />
          <path d="M24 6 V14 M40 6 V14 M24 50 V58 M40 50 V58 M6 24 H14 M6 40 H14 M50 24 H58 M50 40 H58" />
        </>
      )}
      {kind === 'sci' && (
        <text
          x="32"
          y="34"
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          stroke="none"
          style={{ fontFamily: font.mono, fontSize: 24, fontWeight: 800 }}
        >
          e+3
        </text>
      )}
    </svg>
  </div>
);

const WatchCard = ({
  icon,
  title,
  text,
  children,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  children: ReactNode;
}) => (
  <div
    className="sp sp-up"
    style={{ ...card, height: '100%', boxSizing: 'border-box', padding: '26px 32px', display: 'flex', flexDirection: 'column' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      {icon}
      <div>
        <div style={{ fontSize: 32, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 24, color: col.muted, marginTop: 2 }}>{text}</div>
      </div>
    </div>
    <div
      style={{
        marginTop: 'auto',
        background: col.code,
        borderRadius: 14,
        padding: '14px 20px',
        fontFamily: font.mono,
        fontSize: 21,
        lineHeight: 1.6,
        color: '#ece9ff',
      }}
    >
      {children}
    </div>
  </div>
);

// A code line with its output pinned to the right (always visible).
const MiniRow = ({ code, out }: { code: string; out?: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <span style={{ whiteSpace: 'pre' }}>{hl(code)}</span>
    {out !== undefined && <OutTag>{out}</OutTag>}
  </div>
);

const WatchOut: Page = () => (
  <Frame>
    <Body>
      <Header label="Remember" title="Four things to watch out for" color={col.coral} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: 300, gap: 24, marginTop: 36 }}>
        <WatchCard
          icon={<WatchIcon kind="sticky" color={col.sun} />}
          title="It's sticky"
          text="Set once, it stays until you change it."
        >
          <MiniRow code="cout << fixed << setprecision(2);" />
          <MiniRow code="cout << 9.5;" out="9.50" />
          <MiniRow code="cout << 1.0 / 3;" out="0.33" />
        </WatchCard>
        <WatchCard
          icon={<WatchIcon kind="round" color={col.teal} />}
          title="It rounds"
          text="It never simply cuts digits off."
        >
          <MiniRow code="cout << setprecision(4) << 3.14159;" out="3.142" />
          <MiniRow code="// not 3.141" />
        </WatchCard>
        <WatchCard
          icon={<WatchIcon kind="memory" color={col.violet} />}
          title="Only the output changes"
          text="The variable keeps its full value."
        >
          <MiniRow code="double price = 19.987;" />
          <MiniRow code="cout << fixed << setprecision(2) << price;" out="19.99" />
          <MiniRow code="cout << price * 100;" out="1998.70" />
        </WatchCard>
        <WatchCard
          icon={<WatchIcon kind="sci" color={col.coral} />}
          title="Big numbers can go scientific"
          text="Without fixed, 1234 doesn't fit in 3 digits."
        >
          <MiniRow code="cout << setprecision(3) << 1234.5678;" out="1.23e+03" />
          <MiniRow code="cout << fixed << setprecision(3) << 1234.5678;" out="1234.568" />
        </WatchCard>
      </div>
      <p className="sp sp-fade" style={{ ...d(0.4), fontSize: 26, color: col.muted, marginTop: 24 }}>
        Also: only <Mono color={col.ink}>float</Mono> and <Mono color={col.ink}>double</Mono> are affected. An int like 42
        always prints as 42.
      </p>
    </Body>
  </Frame>
);

/* ---------- fixed vs showpoint ---------- */

const CountCard = ({ name, rule, code, out, color }: { name: string; rule: string; code: string; out: string; color: string }) => (
  <div className="sp sp-rise" style={{ ...card, padding: '26px 32px', borderLeft: `8px solid ${color}` }}>
    <div style={{ fontFamily: font.mono, fontSize: 32, fontWeight: 700, color }}>{name}</div>
    <div style={{ fontSize: 28, marginTop: 6 }}>{rule}</div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginTop: 18,
        background: col.code,
        borderRadius: 12,
        padding: '10px 18px',
        fontFamily: font.mono,
        fontSize: 22,
      }}
    >
      <span style={{ whiteSpace: 'pre' }}>{hl(code)}</span>
      <OutTag>{out}</OutTag>
    </div>
  </div>
);

const Zeros: Page = () => (
  <Frame>
    <Body>
      <Header label="fixed and showpoint" title="Two ways to keep the zeros" color={col.teal} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 820px', gap: 48, marginTop: 48 }}>
        <div>
          <CodePanel title="three separate programs" size={28}>
            <CodeRow code="cout << 2.0;" out="2" />
            <CodeRow code="cout << fixed << 2.0;" out="2.000000" />
            <CodeRow code="cout << showpoint << 2.0;" out="2.00000" />
          </CodePanel>
          <p className="sp sp-rise" style={{ ...d(0.5), fontSize: 30, color: col.muted, lineHeight: 1.5, marginTop: 32 }}>
            Plain <Mono color={col.ink}>cout</Mono> drops the point completely. Both tools bring it back, with the
            default precision of 6.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <CountCard
            name="fixed"
            rule="n counts digits after the point"
            code="cout << fixed << setprecision(2) << 2.0;"
            out="2.00"
            color={col.teal}
          />
          <CountCard
            name="showpoint"
            rule="n counts all significant digits"
            code="cout << showpoint << setprecision(3) << 2.0;"
            out="2.00"
            color={col.ink}
          />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- scientific and setw ---------- */

const ToolPanel = ({
  name,
  purpose,
  color,
  children,
  caveat,
}: {
  name: string;
  purpose: string;
  color: string;
  children: ReactNode;
  caveat: ReactNode;
}) => (
  <div className="sp sp-rise" style={{ ...card, padding: '30px 34px', borderTop: `10px solid ${color}` }}>
    <div style={{ fontFamily: font.mono, fontSize: 40, fontWeight: 700, color }}>{name}</div>
    <div style={{ fontSize: 28, marginTop: 6 }}>{purpose}</div>
    <div
      style={{
        marginTop: 24,
        background: col.code,
        borderRadius: 14,
        padding: '16px 22px',
        fontFamily: font.mono,
        fontSize: 22,
        lineHeight: 1.7,
        color: '#ece9ff',
      }}
    >
      {children}
    </div>
    <div style={{ fontSize: 26, color: col.muted, lineHeight: 1.45, marginTop: 22 }}>{caveat}</div>
  </div>
);

const Pad = ({ n }: { n: number }) => <span style={{ color: '#8e89b3' }}>{'·'.repeat(n)}</span>;

const SciSetw: Page = () => (
  <Frame>
    <Body>
      <Header label="scientific and setw" title="Two more tools, two more catches" color={col.coral} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 44 }}>
        <ToolPanel
          name="scientific"
          purpose="Shows a number as a × 10 to a power"
          color={col.coral}
          caveat={
            <>
              Catch: here n counts the digits after the point in <Mono color={col.ink}>1.23</Mono>. Read{' '}
              <Mono color={col.ink}>e+03</Mono> as × 10³.
            </>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ whiteSpace: 'pre' }}>{hl('scientific << setprecision(2) << 1234.5')}</span>
            <OutTag>1.23e+03</OutTag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ whiteSpace: 'pre' }}>{hl('scientific << 0.000123')}</span>
            <OutTag>1.230000e-04</OutTag>
          </div>
        </ToolPanel>
        <ToolPanel
          name="setw(n)"
          purpose="Pads the next value to n characters, on the left"
          color={col.sun}
          caveat="Catch: it applies to the next value only, then resets. And it never cuts a value that is too wide."
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ whiteSpace: 'pre' }}>{hl('"[" << setw(8) << 3.14 << "]"')}</span>
            <OutTag>
              [<Pad n={4} />
              3.14]
            </OutTag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ whiteSpace: 'pre' }}>{hl('"[" << setw(3) << 3.14159 << "]"')}</span>
            <OutTag>[3.14159]</OutTag>
          </div>
        </ToolPanel>
      </div>
    </Body>
  </Frame>
);

/* ---------- Flow ---------- */

const FlowShape = ({
  kind,
  label,
  color,
  delay,
}: {
  kind: 'oval' | 'para' | 'rect';
  label: string;
  color: string;
  delay: number;
}) => (
  <div className="sp sp-pop" style={{ ...d(delay), position: 'relative', width: 560, height: 86 }}>
    <svg width="560" height="86" viewBox="0 0 560 86" style={{ position: 'absolute', inset: 0 }}>
      {kind === 'oval' && (
        <rect x="150" y="3" width="260" height="80" rx="40" fill={`${color}1f`} stroke={color} strokeWidth="4" />
      )}
      {kind === 'para' && (
        <polygon points="60,3 556,3 500,83 4,83" fill={`${color}1f`} stroke={color} strokeWidth="4" strokeLinejoin="round" />
      )}
      {kind === 'rect' && (
        <rect x="30" y="3" width="500" height="80" rx="8" fill={`${color}1f`} stroke={color} strokeWidth="4" />
      )}
    </svg>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        fontWeight: 700,
        color: col.ink,
      }}
    >
      {label}
    </div>
  </div>
);

const Down = ({ delay }: { delay: number }) => (
  <svg width="30" height="40" viewBox="0 0 30 40" className="sp sp-fade" style={{ ...d(delay), display: 'block' }}>
    <line x1="15" y1="2" x2="15" y2="28" stroke={col.ink} strokeWidth="4" strokeLinecap="round" />
    <polygon points="5,24 15,38 25,24" fill={col.ink} />
  </svg>
);

const Pseudo = ({ k, rest, delay }: { k: string; rest: string; delay: number }) => (
  <div className="sp sp-left" style={d(delay)}>
    <span style={{ color: '#ffc24d', fontWeight: 700 }}>{k}</span> {rest}
  </div>
);

const Flow: Page = () => (
  <Frame>
    <Body>
      <Header label="Putting it together" title="Input, process, output" color={col.teal} />
      <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 96, marginTop: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FlowShape kind="oval" label="START" color={col.teal} delay={0.3} />
          <Down delay={0.45} />
          <FlowShape kind="para" label="Input price, quantity" color={col.violet} delay={0.55} />
          <Down delay={0.7} />
          <FlowShape kind="rect" label="total = price × quantity" color={col.sun} delay={0.8} />
          <Down delay={0.95} />
          <FlowShape kind="para" label="Output total (2 decimal places)" color={col.violet} delay={1.05} />
          <Down delay={1.2} />
          <FlowShape kind="oval" label="END" color={col.teal} delay={1.3} />
        </div>
        <div>
          <p className="sp sp-rise" style={{ ...d(0.2), fontSize: 38, lineHeight: 1.45, margin: '8px 0 0', fontWeight: 600 }}>
            Calculate the total cost of items and show it to{' '}
            <span style={{ color: col.teal }}>2 decimal places</span>.
          </p>
          <div style={{ marginTop: 44 }}>
            <CodePanel title="pseudocode" size={32} delay={0.4}>
              <Pseudo k="INPUT" rest="price, quantity" delay={0.8} />
              <Pseudo k="" rest="total = price * quantity" delay={1} />
              <Pseudo k="OUTPUT" rest="total TO 2 DECIMAL PLACES" delay={1.2} />
            </CodePanel>
          </div>
          <p className="sp sp-rise" style={{ ...d(1.4), fontSize: 30, color: col.muted, lineHeight: 1.5, marginTop: 40 }}>
            "2 decimal places" in the plan becomes <Mono color={col.ink}>fixed &lt;&lt; setprecision(2)</Mono> in code.
          </p>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Program ---------- */

const Program: Page = () => (
  <Frame>
    <Body>
      <Header label="Total cost" title="Real example: calculating a total" color={col.teal} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 600px', gap: 48, marginTop: 36 }}>
        <CodePanel size={26}>
          <Ln n={1} code="#include <iostream>" />
          <Ln n={2} code="#include <iomanip>" delay={0.04} />
          <Ln n={3} code="using namespace std;" delay={0.08} />
          <Ln n={4} delay={0.12} />
          <Ln n={5} code="int main() {" delay={0.16} />
          <Ln n={6} code="double price, total;" indent={1} delay={0.2} />
          <Ln n={7} code="int quantity;" indent={1} delay={0.24} />
          <Ln n={8} code="cin >> price >> quantity;" indent={1} delay={0.28} />
          <Ln n={9} code="total = price * quantity;" indent={1} delay={0.32} />
          <Ln n={10} code="cout << fixed << setprecision(2);" indent={1} delay={0.36} mark={col.sun} />
          <Ln n={11} code='cout << "Total: " << total << endl;' indent={1} delay={0.4} />
          <Ln n={12} code="return 0;" indent={1} delay={0.44} />
          <Ln n={13} code="}" delay={0.48} />
        </CodePanel>
        <div>
          <div className="sp sp-fade" style={{ ...d(0.4), fontSize: 32, fontWeight: 700 }}>
            What would the program show?
          </div>
          <div
            className="sp sp-rise"
            style={{
              ...d(0.5),
              marginTop: 20,
              background: col.code,
              borderRadius: 'var(--osd-radius)',
              padding: '26px 32px',
              fontFamily: font.mono,
              fontSize: 32,
              lineHeight: 1.6,
              color: '#ece9ff',
              boxShadow: card.boxShadow,
            }}
          >
            <div>
              <span style={{ color: '#8e89b3' }}>Input: </span>
              <span style={{ color: '#ffc24d' }}>19.99 3</span>
            </div>
            <div style={{ color: '#7fe0c9', fontWeight: 700 }}>Total: 59.97</div>
          </div>
          <p className="sp sp-rise" style={{ fontSize: 30, color: col.muted, lineHeight: 1.5, marginTop: 32 }}>
            Because 19.99 × 3 = 59.97, and <Mono color={col.ink}>fixed</Mono> +{' '}
            <Mono color={col.ink}>setprecision(2)</Mono> keeps two decimal places.
          </p>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Real-world examples ---------- */

const zigzag = `0,0 ${Array.from({ length: 18 }, (_, i) => `${i * 20 + 10},14 ${i * 20 + 20},0`).join(' ')}`;

const Receipt = ({ label, color, children }: { label: string; color: string; children: ReactNode }) => (
  <div className="sp sp-rise" style={{ width: 360 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, fontWeight: 700, color, marginBottom: 16 }}>
      <span style={{ width: 12, height: 12, borderRadius: 6, background: color }} />
      {label}
    </div>
    <div
      style={{
        background: col.panel,
        borderRadius: '14px 14px 0 0',
        padding: '28px 34px 16px',
        fontFamily: font.mono,
        fontSize: 30,
        lineHeight: 1.6,
        whiteSpace: 'pre',
        boxShadow: '0 -6px 30px -20px rgba(45, 30, 120, 0.4)',
      }}
    >
      <div style={{ fontFamily: font.body, fontSize: 22, fontWeight: 700, color: col.muted, textAlign: 'center', marginBottom: 10 }}>
        Corner Store
      </div>
      {children}
    </div>
    <svg width="360" height="14" viewBox="0 0 360 14" style={{ display: 'block' }}>
      <polygon points={zigzag} fill={col.panel} />
    </svg>
  </div>
);

const Rule = () => <div style={{ borderTop: `3px dashed ${col.dim}`, margin: '8px 0' }} />;

const ShopReceipt: Page = () => (
  <Frame>
    <Body>
      <Header label="Real world: shop receipt" title="Lining up the prices" color={col.sun} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 760px', gap: 48, marginTop: 44 }}>
        <div>
          <CodePanel size={25}>
            <Ln n={1} code="double bread = 2.5, milk = 1.99 * 2, eggs = 3.2;" />
            <Ln n={2} code="double total = bread + milk + eggs;" delay={0.04} />
            <Ln n={3} delay={0.08} />
            <Ln n={4} code="cout << fixed << setprecision(2);" delay={0.12} mark={col.sun} />
            <Ln n={5} code='cout << "Bread " << setw(8) << bread << endl;' delay={0.16} />
            <Ln n={6} code='cout << "Milk  " << setw(8) << milk << endl;' delay={0.2} />
            <Ln n={7} code='cout << "Eggs  " << setw(8) << eggs << endl;' delay={0.24} />
            <Ln n={8} code='cout << "Total " << setw(8) << total << endl;' delay={0.28} />
          </CodePanel>
          <p className="sp sp-rise" style={{ ...d(0.4), fontSize: 30, color: col.muted, lineHeight: 1.5, marginTop: 36 }}>
            <Mono color={col.ink}>setw(8)</Mono> gives every price the same 8-character column, so the points line up.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          <Receipt label="Default output" color={col.coral}>
            <div>Bread 2.5</div>
            <div>Milk  3.98</div>
            <div>Eggs  3.2</div>
            <Rule />
            <div style={{ fontWeight: 800 }}>Total 9.68</div>
          </Receipt>
          <Receipt label="Formatted" color={col.teal}>
            <div>Bread     2.50</div>
            <div>Milk      3.98</div>
            <div>Eggs      3.20</div>
            <Rule />
            <div style={{ fontWeight: 800 }}>Total     9.68</div>
          </Receipt>
        </div>
      </div>
    </Body>
  </Frame>
);

const Download: Page = () => (
  <Frame>
    <Body>
      <Header label="Real world: download progress" title="A whole-number percentage" color={col.sun} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 560px', gap: 64, marginTop: 44 }}>
        <div>
          <CodePanel size={26}>
            <Ln n={1} code="double done = 437, size = 550;" />
            <Ln n={2} code="double percent = done / size * 100;" delay={0.04} />
            <Ln n={3} delay={0.08} />
            <div className="sp sp-left" style={{ ...d(0.45), display: 'flex' }}>
              <Ln n={4} code='cout << percent << "%";' delay={0.12} />
              <OutTag>79.4545%</OutTag>
            </div>
            <div className="sp sp-left" style={{ ...d(0.55), display: 'flex' }}>
              <Ln n={5} code='cout << fixed << setprecision(0) << percent << "%";' delay={0.16} />
              <OutTag>79%</OutTag>
            </div>
          </CodePanel>
          <p className="sp sp-rise" style={{ ...d(0.6), fontSize: 32, color: col.muted, lineHeight: 1.5, marginTop: 40 }}>
            With <Mono color={col.ink}>fixed</Mono>, n can even be 0: no digits after the point, rounded to the nearest
            whole number.
          </p>
        </div>
        <div className="sp sp-rise" style={{ ...d(0.3), ...card, borderRadius: 36, padding: '40px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke={col.violet} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 6 H40 L52 18 V58 H16 Z" fill={`${col.violet}1a`} />
              <path d="M40 6 V18 H52 M34 28 V46 M26 38 L34 46 L42 38" />
            </svg>
            <div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>set-precision.mp4</div>
              <div style={{ fontSize: 24, color: col.muted }}>Downloading…</div>
            </div>
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 120, fontWeight: 700, marginTop: 28 }}>79%</div>
          <div style={{ height: 22, borderRadius: 11, background: col.line, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ width: '79%', height: '100%', borderRadius: 11, background: col.violet }} />
          </div>
          <div style={{ fontSize: 26, color: col.muted, marginTop: 16 }}>437 MB of 550 MB</div>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Quick check ---------- */

const Quiz = ({ code, out, why, color }: { code: string; out: string; why: string; color: string }) => (
  <div
    className="sp sp-left"
    style={{
      ...card,
      display: 'grid',
      gridTemplateColumns: '760px 1fr',
      alignItems: 'center',
      gap: 40,
      padding: '20px 36px',
      minHeight: 120,
      boxSizing: 'border-box',
    }}
  >
    <span
      style={{
        fontFamily: font.mono,
        fontSize: 26,
        background: col.code,
        borderRadius: 12,
        padding: '12px 20px',
        whiteSpace: 'pre',
      }}
    >
      {hl(code)}
    </span>
    <div className="sp sp-pop" style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
      <span style={{ fontFamily: font.mono, fontSize: 48, fontWeight: 700, color }}>{out}</span>
      <span style={{ fontSize: 26, color: col.muted }}>{why}</span>
    </div>
  </div>
);

const Check: Page = () => (
  <Frame>
    <Body>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Header label="Quick check" title="What is the output?" />
        <div
          className="sp sp-rise"
          style={{ ...d(0.2), padding: '14px 28px', borderRadius: 16, background: col.code, fontFamily: font.mono, fontSize: 34 }}
        >
          {hl('double x = 123.456;')}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 44 }}>
        <Quiz code="cout << setprecision(4) << x;" out="123.5" why="4 digits in total" color={col.violet} />
        <Quiz code="cout << fixed << setprecision(1) << x;" out="123.5" why="1 after the point" color={col.teal} />
        <Quiz code="cout << fixed << setprecision(5) << x;" out="123.45600" why="zeros fill the gap" color={col.teal} />
        <Quiz code="cout << setprecision(2) << x;" out="1.2e+02" why="too few digits: scientific" color={col.coral} />
      </div>
      <p className="sp sp-fade" style={{ ...d(0.6), fontSize: 26, color: col.muted, marginTop: 28 }}>
        Treat each line as its own program. Run one after another, fixed would stick.
      </p>
    </Body>
  </Frame>
);

/* ---------- Takeaway ---------- */

const Done = ({ text, delay }: { text: string; delay: number }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, fontSize: 30, lineHeight: 1.4, marginTop: 20 }}>
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ flex: 'none', marginTop: 4 }}>
      <rect x="2" y="2" width="32" height="32" rx="9" fill={`${col.teal}22`} stroke={col.teal} strokeWidth="3" />
      <path
        className="sp sp-draw"
        style={d(delay)}
        d="M9 19 L15 25 L27 11"
        pathLength={1}
        fill="none"
        stroke={col.teal}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {text}
  </div>
);

const Takeaway: Page = () => (
  <Frame footer={false}>
    <div
      style={{
        position: 'absolute',
        inset: '0 140px',
        display: 'grid',
        gridTemplateColumns: '1fr 820px',
        gap: 80,
        alignItems: 'center',
      }}
    >
      <div>
        <Label>That's a wrap</Label>
        <h2
          className="sp sp-rise"
          style={{
            ...d(0.1),
            fontFamily: font.display,
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.02,
            margin: '24px 0 32px',
          }}
        >
          Takeaway
        </h2>
        <p className="sp sp-rise" style={{ ...d(0.25), fontSize: 38, color: col.muted, lineHeight: 1.5, margin: 0 }}>
          Remember:
          <br />
          <span style={{ color: 'var(--osd-text)' }}>setprecision controls the output, not the actual number stored.</span>
        </p>
        <div className="sp sp-rise" style={{ ...d(0.4), marginTop: 44 }}>
          <Readout text="59.97" color={col.teal} size={64} delay={0.6} />
        </div>
      </div>
      <div className="sp sp-rise" style={{ ...d(0.3), ...card, padding: '36px 44px 44px' }}>
        <Done delay={0.7} text="setprecision() controls how decimal values are displayed." />
        <Done delay={0.9} text="Without fixed, n means significant digits." />
        <Done delay={1.1} text="With fixed, n means digits after the decimal point." />
        <Done delay={1.3} text="Precision changes the display, not the stored value." />
        <Done delay={1.5} text="For money and averages, fixed << setprecision(2) is often useful." />
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
  title: 'Set Precision',
  createdAt: '2026-10-07T12:14:44.982Z',
};

export default [
  Cover,
  Objectives,
  Why,
  WhatIs,
  Syntax,
  Problem,
  InAction,
  WatchOut,
  Toolbox,
  Zeros,
  SciSetw,
  Flow,
  Program,
  ShopReceipt,
  Download,
  Check,
  Takeaway,
] satisfies Page[];

// Read-aloud script, one entry per page. Every page shows in full on arrival: press → to move on.
// (Round brackets) = stage directions, not read aloud.
export const notes: (string | undefined)[] = [
  `(Walk up, completely serious.) Good morning everyone. This presentation will take exactly 14.8333333 minutes.
(Pause.) The chai at the canteen today costs 49.99999999 rupees. And I am 99.9999999 percent sure you're going to enjoy this topic.
(Pick a student.) Did any of that sound normal to you?
(They'll laugh or say no.) Why not? What was wrong with it?
(Let them answer: too many decimals, nobody talks like that.)
Exactly. Every number I said was technically correct. 14.8333 minutes is 14 minutes and 50 seconds. But a normal person says "about 15 minutes" and "50 rupees."
The problem is, computers do talk like that, unless we tell them not to. And that chai price isn't even a made-up joke: in C++, 0.1 + 0.2 printed with enough digits is 0.30000000000000004.
So today we're going to learn how to make a program talk like a normal person: set precision in C++.`,

  `Here's what we'll cover. By the end, you should be able to:
Define precision, and explain why formatting decimal output matters.
Use setprecision from the iomanip library.
Explain the difference between default output and fixed output. This is the core of the whole topic.
Identify the other common output manipulators.
Predict the output of code that uses setprecision. We'll test that with a quick check near the end.
And write a simple program that displays money and averages correctly.`,

  `So where does this actually matter? (Ask a student.) Name any app on your phone that shows a decimal number.
(Take one or two answers: shopping app, weather, fitness, banking.)
Right. Prices, averages, percentages, measurements. The calculation behind them almost never comes out clean, so raw output has more digits than we need.
A price calculated as 3.14159265358979. No shop prints that. It shows 3.14.
An average of 59.9. On a result sheet next to 61.25 and 72.50, it looks inconsistent. It should be 59.90.
setprecision lets us control how a decimal value is displayed. And the stored value is not touched. Only the display changes.`,

  `Formal definition: precision is the number of digits a program displays when it prints a decimal number.
On the right, pi is stored in a double with all its digits: 3.14159265358979.
(Ask a student.) If I write cout << pi with no formatting at all, what do you think it prints? All the digits?
It prints 3.14159. Count with me: 1, 2, 3, 4, 5, 6. Six significant digits. That's the C++ default.
And the variable still holds the full value. Precision only affects what appears on screen.`,

  `The syntax. Two headers: iostream gives us cout, and iomanip gives us setprecision. Always include iomanip when you use setprecision. Don't rely on another header pulling it in for you.
Then: cout << setprecision(n) << value.
setprecision is a manipulator. It doesn't print anything itself. It changes how cout prints whatever comes after it.
n is the number of digits we want. But here's the catch: "digits" can mean two different things. Which one depends on a single keyword.`,

  `So far, setprecision(n) means "show n digits". Let's test that on numbers we'd actually print with two decimals. (Ask the class before each value: what should this show?)
3.14159 gives 3.1. Only two digits in total, not two after the point.
9.5 gives 9.5. No trailing zero, so it doesn't look like money.
59.9 gives 60. (Pause.) Your average just changed from 59.9 to 60 on screen!
And 1250.75 gives 1.3e+03, because 1250 needs four digits and we only allowed two, so C++ switches to scientific.
The problem: on its own, n counts all significant digits, on both sides of the point.
Now the fix: one word, fixed. Same setprecision(2): 3.14, 9.50, 59.90, 1250.75. Exactly two decimals every time.
fixed switches cout to normal decimal form and changes what n means. Without fixed, n is total significant digits. With fixed, n is digits after the decimal point. This is the most important idea of today.`,

  `Now the standard examples, both modes on the same pi. (Point at each line, ask a student to call out the output, then point to the answer on screen.)
Top panel, no fixed, so n is total digits. Plain cout << pi gives 3.14159, the default six. setprecision(4) gives 3.142, rounded. setprecision(10) gives 3.141592654. Count them: ten digits. So precision can also show more digits than the default.
Bottom panel, fixed is on, so n is digits after the point. Precision 2 gives 3.14. Precision 4 gives 3.1416: the next digit is a 9, so it rounds up.
(Ask a student.) Last one: 2.5 with fixed and precision 3. What do you expect? 2.500. fixed pads with zeros. Without fixed, you'd get just 2.5.`,

  `Before we open the rest of the toolbox, four things that catch everyone out. (Go through the cards left to right, top to bottom.)
One: it's sticky. setprecision changes a setting on cout itself, not on one number. Set it once, and 9.5 prints as 9.50 and one third prints as 0.33, until you change it.
Two: it rounds, it doesn't chop. 3.14159 to four digits is 3.142, not 3.141. Same rule as my opening line: 14.8333 minutes rounds to 15, not 14.
Three: only the output changes. (Ask a student.) price is 19.987 and we print 19.99. What's price times 100? It's 1998.70, not 1999.00, so the variable still holds 19.987. Same with the canteen chai: memory can hold 49.99999999 while the screen shows 50.00.
Four: big numbers can go scientific. setprecision(3) allows three digits, but 1234 needs four, so C++ prints 1.23e+03. Add fixed and you get 1234.568.
And at the bottom: only float and double are affected. An int like 42 always prints as 42.`,

  `So far we've used setprecision and fixed. Here's the full toolbox.
setprecision(n), from iomanip: how many digits are shown.
fixed, from iostream: normal decimal form, and n means digits after the point.
scientific: numbers like 1.23e+03.
setw(n), from iomanip: the width of the next output.
showpoint: always shows the decimal point and trailing zeros.
We already know the first two. Let's look at the other three, and the catch that comes with each.`,

  `fixed and showpoint both keep zeros, but they count differently. (These are three separate programs.)
(Ask a student.) What does plain cout << 2.0 print? Just 2. The point disappears completely.
With fixed: 2.000000. Six digits after the point, because the default precision is 6.
With showpoint: 2.00000. Six significant digits in total, so only five after the point.
That's the catch: fixed counts digits after the point, showpoint counts all significant digits. So to print 2.00 you write fixed << setprecision(2), or showpoint << setprecision(3).`,

  `Two more tools.
scientific. 1234.5 with setprecision(2): 1.23e+03, which is 1.23 × 10³. A tiny number, 0.000123: 1.230000e-04, which is 1.23 × 10⁻⁴. The catch: in scientific mode, n counts the digits after the point in 1.23, not all the digits.
setw. setw(8) on 3.14: four spaces, then 3.14. Eight characters in total, padded on the left.
(Ask a student.) What if the number is wider than the width, like setw(3) on 3.14159? It prints all of 3.14159. setw never cuts a value. And it only applies to the very next value, then resets. Keep that in mind, because we'll use it on a shop receipt in a few minutes.`,

  `Let's apply this to a full problem: calculate the total cost of some items and show it to two decimal places.
(Ask the class.) What are the inputs? (Price and quantity.) What's the process? (Total equals price times quantity.) And the output? (The total, to two decimal places.)
That's exactly the flowchart: start, input, process, output, end.
The pseudocode is three lines. Notice the phrase "to 2 decimal places". In C++ that's fixed << setprecision(2), and fixed, not plain setprecision, because we want digits after the point, not significant digits.`,

  `The full program. Lines 8 and 9 read the input and compute the total. Line 10 sets the format once, before any output. Because it's sticky, every number printed after it uses two decimals.
(Ask a student.) Input is 19.99 and 3. What exactly does it print?
Total: 59.97.
Because 19.99 × 3 = 59.97, and fixed with setprecision(2) keeps exactly two decimal places.
(Follow-up question.) What if the input is 20 and 3? With line 10: Total: 60.00. Without line 10: just 60.`,

  `First real-world example: a shop receipt.
(Ask the class.) Look at the default output on the left. What's wrong with it?
(2.5 next to 3.98 looks odd, and the prices don't line up.)
The formatted receipt fixes both. Line 4 sets fixed << setprecision(2), so every price gets exactly two decimals: 2.50, 3.98, 3.20.
And setw(8) puts each price in an 8-character column, padded on the left, so the decimal points line up.
Notice setw(8) is written on every line, 5 to 8. That's because setw resets after each output, unlike setprecision.`,

  `Second example: a download screen. 437 MB out of 550.
Line 4 prints the raw percentage: 79.4545. Far too precise for a progress bar.
(Ask the class.) What does a progress bar usually show? A whole number.
With fixed, n can even be 0: fixed << setprecision(0) shows no digits after the point and rounds to the nearest whole number, so line 5 prints 79%.
And that's how my 14.8333333-minute presentation becomes a normal 15-minute one.`,

  `Quick check. x = 123.456. (The answers are on screen, so ask a student to explain each one.)
Line 1, setprecision(4) gives 123.5: four significant digits.
Line 2, fixed, setprecision(1) gives 123.5: one digit after the point. Same output, different reason.
Line 3, fixed, setprecision(5) gives 123.45600: fixed pads with zeros to five places.
Line 4, setprecision(2) gives 1.2e+02: two significant digits, but 123 needs three before the point, so it goes scientific.
One condition: treat each line as a separate program. In one program, fixed from line 2 would stick, and line 4 would print 123.46.`,

  `To sum up:
setprecision controls how decimal values are displayed.
Without fixed, n means significant digits. With fixed, n means digits after the decimal point.
It changes the display, not the stored value.
For money and averages, fixed << setprecision(2) is usually what you want.
So the next time someone tells you a talk will take 14.8333333 minutes, you'll know exactly which line of code they forgot.
setprecision controls the output, not the actual number stored. Thank you. Any questions?`,
];
