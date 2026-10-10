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
  palette: { bg: '#10201c', text: '#eef4ee', accent: '#ffc65c' },
  fonts: {
    display: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
    body: '"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 112, body: 34 },
  radius: 22,
};

// Each Pólya step owns one colour across the deck:
// sky = understand, sun = devise a plan, mint = carry out, rose = review.
const col = {
  sky: '#6fc3ff',
  sun: '#ffc65c',
  mint: '#5ee0a6',
  rose: '#ff8fa8',
  muted: '#a3b8b0',
  dim: '#5d7a71',
  line: 'rgba(238, 244, 238, 0.12)',
  panel: 'rgba(255, 255, 255, 0.05)',
  deep: '#0b1714',
};

const STEPS = [
  { name: 'Understand', short: 'UNDERSTAND', color: col.sky },
  { name: 'Devise a plan', short: 'PLAN', color: col.sun },
  { name: 'Carry out', short: 'SOLVE', color: col.mint },
  { name: 'Review', short: 'CHECK', color: col.rose },
];

const font = {
  display: 'var(--osd-font-display)',
  body: 'var(--osd-font-body)',
  mono: '"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Resting styles are the final state; keyframes only describe where things come
// from. Inactive instances (thumbnails, overview, export) set data-still.
const css = `
  .pm { animation-fill-mode: both; animation-timing-function: ${EASE}; }
  [data-still] .pm, [data-still] .pm-loop { animation: none !important; }
  @media (prefers-reduced-motion: reduce) { .pm, .pm-loop { animation: none !important; } }
  .pm-rise { animation-name: pm-rise; animation-duration: .6s; }
  .pm-left { animation-name: pm-left; animation-duration: .55s; }
  .pm-fade { animation-name: pm-fade; animation-duration: .6s; }
  .pm-pop { animation-name: pm-pop; animation-duration: .5s; }
  .pm-up { animation-name: pm-up; animation-duration: .55s; }
  .pm-grow { animation-name: pm-grow; animation-duration: .9s; transform-origin: left center; }
  .pm-tilt { animation-name: pm-tilt; animation-duration: 1.4s; }
  .pm-draw { stroke-dasharray: 1; animation-name: pm-draw; animation-duration: .8s; }
  .pm-float { animation: pm-float 6s ease-in-out infinite; }
  .pm-spin { animation: pm-spin 9s linear infinite; }
  .pm-spin-r { animation: pm-spin 6s linear infinite reverse; }
  .pm-dash { animation: pm-dash 1.2s linear infinite; }
  @keyframes pm-rise { from { opacity: 0; transform: translateY(16px); } }
  @keyframes pm-left { from { opacity: 0; transform: translateX(-16px); } }
  @keyframes pm-fade { from { opacity: 0; } }
  @keyframes pm-pop { 0% { opacity: 0; transform: scale(.8); } 70% { transform: scale(1.04); } 100% { transform: scale(1); } }
  @keyframes pm-up { from { opacity: 0; transform: translateY(28px); } }
  @keyframes pm-grow { from { transform: scaleX(0); } }
  @keyframes pm-tilt { 0% { transform: rotate(-9deg); } 55% { transform: rotate(3deg); } 80% { transform: rotate(-1deg); } }
  @keyframes pm-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes pm-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes pm-spin { to { transform: rotate(360deg); } }
  @keyframes pm-dash { to { stroke-dashoffset: -24; } }
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
    'radial-gradient(1000px 680px at 90% 4%, rgba(111, 195, 255, 0.10), transparent 62%)',
    'radial-gradient(900px 620px at 0% 100%, rgba(255, 198, 92, 0.08), transparent 60%)',
    'linear-gradient(rgba(238, 244, 238, 0.035) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(238, 244, 238, 0.035) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: 'auto, auto, 56px 56px, 56px 56px',
  WebkitFontSmoothing: 'antialiased',
};

/* ---------- shared pieces ---------- */

const pad = (n: number) => String(n).padStart(2, '0');

// The footer doubles as a step tracker: the current Pólya step lights up.
const Pip = ({ n, step }: { n: number; step?: number }) => {
  const s = STEPS[n - 1];
  const on = step === n;
  return (
    <span
      style={{
        padding: '6px 16px',
        borderRadius: 999,
        fontSize: 16,
        border: `2px solid ${on ? s.color : col.line}`,
        background: on ? `${s.color}26` : 'transparent',
        color: on ? s.color : col.dim,
      }}
    >
      {s.short}
    </span>
  );
};

const Footer = ({ step }: { step?: number }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 36,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: font.mono,
        fontSize: 20,
        letterSpacing: '0.14em',
        color: col.dim,
      }}
    >
      <span>PÓLYA’S METHOD</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Pip n={1} step={step} />
        <span>›</span>
        <Pip n={2} step={step} />
        <span>›</span>
        <Pip n={3} step={step} />
        <span>›</span>
        <Pip n={4} step={step} />
      </div>
      <span>
        {pad(current)} / {pad(total)}
      </span>
    </div>
  );
};

const Frame = ({ children, footer = true, step }: { children: ReactNode; footer?: boolean; step?: number }) => {
  const active = useIsActivePage();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Styles />
      {children}
      {footer && <Footer step={step} />}
    </div>
  );
};

const Body = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', inset: '92px 120px 120px', display: 'flex', flexDirection: 'column' }}>
    {children}
  </div>
);

const Label = ({ children, color = col.sun }: { children: ReactNode; color?: string }) => (
  <div
    className="pm pm-fade"
    style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 700, color }}
  >
    <span style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
    {children}
  </div>
);

const Header = ({ label, title, color = col.sun }: { label: string; title: ReactNode; color?: string }) => (
  <div>
    <Label color={color}>{label}</Label>
    <h2
      className="pm pm-rise"
      style={{
        ...d(0.08),
        fontFamily: font.display,
        fontSize: 68,
        fontWeight: 700,
        lineHeight: 1.12,
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
  boxShadow: '0 30px 60px -36px rgba(0, 0, 0, 0.7)',
};

// Highlighted words inside a problem statement.
const Mark = ({ children, color }: { children: ReactNode; color: string }) => (
  <span
    style={{
      background: `${color}2e`,
      borderBottom: `3px solid ${color}`,
      borderRadius: 6,
      padding: '0 8px',
      whiteSpace: 'nowrap',
      color,
      fontWeight: 700,
    }}
  >
    {children}
  </span>
);

// Maths set in the display serif, with x in italics.
const X = () => <i style={{ fontFamily: font.display }}>x</i>;

/* ---------- the Pólya wheel: the deck's signature visual ---------- */

const pt = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [200 + r * Math.cos(a), 200 + r * Math.sin(a)];
};

const R = 120;

// One quarter of the cycle: an arc that draws itself, ending in an arrowhead.
const WheelArc = ({ i, delay }: { i: number; delay: number }) => {
  const { name, color } = STEPS[i];
  const a1 = i * 90 + 7;
  const a2 = i * 90 + 79;
  const [x1, y1] = pt(R, a1);
  const [x2, y2] = pt(R, a2);
  const [bx, by] = pt(R, i * 90 + 43);
  const [lx, ly] = pt(R + 54, i * 90 + 45);
  return (
    <g>
      <path
        className="pm pm-draw"
        style={d(delay)}
        pathLength={1}
        d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="24"
      />
      <polygon
        className="pm pm-fade"
        style={d(delay + 0.6)}
        points={`200,${200 - R - 22} 220,${200 - R} 200,${200 - R + 22}`}
        fill={color}
        transform={`rotate(${a2} 200 200)`}
      />
      <g className="pm pm-pop" style={{ ...d(delay + 0.3), transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={bx} cy={by} r="22" fill={col.deep} stroke={color} strokeWidth="4" />
        <text
          x={bx}
          y={by + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          style={{ fontFamily: font.display, fontSize: 24, fontWeight: 700 }}
        >
          {i + 1}
        </text>
      </g>
      <text
        className="pm pm-fade"
        x={lx}
        y={ly}
        textAnchor={i < 2 ? 'start' : 'end'}
        dominantBaseline="central"
        fill={color}
        style={{ ...d(delay + 0.4), fontFamily: font.body, fontSize: 24, fontWeight: 700 }}
      >
        {name}
      </text>
    </g>
  );
};

const Wheel = ({ width, center, delay = 0.2 }: { width: number; center: ReactNode; delay?: number }) => (
  <svg width={width} height={(width * 360) / 640} viewBox="-120 20 640 360" style={{ display: 'block', overflow: 'visible' }}>
    <circle cx="200" cy="200" r={R} fill="none" stroke={col.line} strokeWidth="24" />
    <WheelArc i={0} delay={delay} />
    <WheelArc i={1} delay={delay + 0.35} />
    <WheelArc i={2} delay={delay + 0.7} />
    <WheelArc i={3} delay={delay + 1.05} />
    <circle cx="200" cy="200" r="72" fill={col.deep} stroke={col.line} strokeWidth="2" />
    <g className="pm-loop pm-float">{center}</g>
  </svg>
);

const WheelText = ({ children, color = 'currentColor', size = 96 }: { children: ReactNode; color?: string; size?: number }) => (
  <text
    x="200"
    y="204"
    textAnchor="middle"
    dominantBaseline="central"
    fill={color}
    style={{ fontFamily: font.display, fontSize: size, fontWeight: 700 }}
  >
    {children}
  </text>
);

/* ---------- small line icons (48 × 48) ---------- */

const Icon = ({ children, color, size = 48 }: { children: ReactNode; color: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const GlyphIcon = ({ text, color, size = 48 }: { text: string; color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <text
      x="24"
      y="26"
      textAnchor="middle"
      dominantBaseline="central"
      fill={color}
      style={{ fontFamily: font.display, fontSize: text.length > 2 ? 22 : 30, fontWeight: 700 }}
    >
      {text}
    </text>
  </svg>
);

/* ---------- step illustrations (200 × 200) ---------- */

const Magnifier = ({ color }: { color: string }) => (
  <svg width="420" height="420" viewBox="0 0 200 200" fill="none" strokeLinecap="round">
    <rect x="34" y="26" width="104" height="138" rx="12" fill={col.deep} stroke={col.muted} strokeWidth="3" />
    <path d="M52 52 H120 M52 72 H108 M52 92 H120 M52 112 H96 M52 132 H112" stroke={col.dim} strokeWidth="6" />
    <rect className="pm pm-grow" style={d(0.6)} x="48" y="64" width="50" height="16" rx="5" fill={`${color}55`} />
    <rect className="pm pm-grow" style={d(0.8)} x="48" y="104" width="40" height="16" rx="5" fill={`${color}55`} />
    <g className="pm-loop pm-float">
      <circle cx="128" cy="118" r="32" fill={`${color}26`} stroke={color} strokeWidth="7" />
      <path d="M151 141 L176 166" stroke={color} strokeWidth="13" />
      <text
        x="128"
        y="120"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        stroke="none"
        style={{ fontFamily: font.display, fontSize: 40, fontWeight: 700 }}
      >
        ?
      </text>
    </g>
  </svg>
);

const gear = (cx: number, cy: number, r: number, teeth: number) =>
  Array.from({ length: teeth * 4 }, (_, i) => {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const rr = i % 4 < 2 ? r : r * 0.8;
    return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

const Gears = ({ color }: { color: string }) => (
  <svg width="420" height="420" viewBox="0 0 200 200">
    <g className="pm-loop pm-spin" style={{ transformOrigin: '84px 92px' }}>
      <polygon points={gear(84, 92, 56, 12)} fill={`${color}33`} stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="84" cy="92" r="18" fill={col.deep} stroke={color} strokeWidth="4" />
    </g>
    <g className="pm-loop pm-spin-r" style={{ transformOrigin: '148px 146px' }}>
      <polygon points={gear(148, 146, 36, 8)} fill={`${col.sun}33`} stroke={col.sun} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="148" cy="146" r="11" fill={col.deep} stroke={col.sun} strokeWidth="4" />
    </g>
  </svg>
);

const ReviewArt = ({ color }: { color: string }) => (
  <svg width="420" height="420" viewBox="0 0 200 200" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g className="pm-loop pm-spin" style={{ transformOrigin: '100px 100px', animationDuration: '14s' }}>
      <path d="M100 30 A70 70 0 0 1 166 122" stroke={color} strokeWidth="9" />
      <polygon points="152,118 176,114 168,138" fill={color} />
      <path d="M100 170 A70 70 0 0 1 34 78" stroke={color} strokeWidth="9" />
      <polygon points="48,82 24,86 32,62" fill={color} />
    </g>
    <circle cx="100" cy="100" r="44" fill={`${col.mint}26`} stroke={col.mint} strokeWidth="5" />
    <path
      className="pm pm-draw"
      style={d(0.6)}
      pathLength={1}
      d="M80 101 L95 116 L122 86"
      stroke={col.mint}
      strokeWidth="10"
    />
  </svg>
);

const Bulb = ({ color, size = 200 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path
      d="M100 30 C66 30 46 56 46 84 C46 106 60 118 70 132 C76 140 76 148 76 154 H124 C124 148 124 140 130 132 C140 118 154 106 154 84 C154 56 134 30 100 30 Z"
      fill={`${color}2b`}
      stroke={color}
      strokeWidth="7"
    />
    <path d="M80 168 H120 M86 184 H114" stroke={color} strokeWidth="7" />
    <path d="M86 110 L100 88 L114 110" stroke={color} strokeWidth="6" />
    <path className="pm-loop pm-dash" d="M100 6 V16 M162 28 L154 36 M38 28 L46 36 M186 84 H176 M14 84 H24" stroke={color} strokeWidth="6" strokeDasharray="6 6" />
  </svg>
);

// Big round stage for a step illustration, with the step numeral behind it.
const Art = ({ n, children }: { n: number; children: ReactNode }) => {
  const { color } = STEPS[n - 1];
  return (
    <div
      className="pm pm-pop"
      style={{
        ...d(0.2),
        position: 'relative',
        width: 560,
        height: 560,
        borderRadius: '50%',
        border: `2px dashed ${color}66`,
        background: `radial-gradient(circle at 50% 40%, ${color}24, transparent 70%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          position: 'absolute',
          right: 24,
          top: -40,
          fontFamily: font.display,
          fontSize: 260,
          fontWeight: 700,
          lineHeight: 1,
          color,
          opacity: 0.16,
        }}
      >
        {n}
      </span>
      {children}
    </div>
  );
};

/* ---------- Cover ---------- */

const Cover: Page = () => (
  <Frame footer={false}>
    <div
      style={{
        position: 'absolute',
        left: 140,
        top: 0,
        bottom: 0,
        width: 900,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Label>Mathematical problem solving</Label>
      <h1
        className="pm pm-rise"
        style={{
          ...d(0.1),
          fontFamily: font.display,
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 700,
          lineHeight: 1.02,
          whiteSpace: 'nowrap',
          margin: '30px 0 36px',
        }}
      >
        Pólya’s
        <br />
        Problem-Solving
        <br />
        <span style={{ color: col.sun }}>Method</span>
      </h1>
      <p className="pm pm-rise" style={{ ...d(0.25), fontSize: 40, color: col.muted, margin: 0, lineHeight: 1.4 }}>
        A systematic approach to solving mathematical problems
      </p>
    </div>
    <div style={{ position: 'absolute', left: 1020, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
      <Wheel width={840} delay={0.4} center={<WheelText color={col.sun}>?</WheelText>} />
    </div>
  </Frame>
);

/* ---------- What is problem solving ---------- */

const PathNode = ({
  n,
  icon,
  label,
  color,
  delay,
}: {
  n: number;
  icon: ReactNode;
  label: string;
  color: string;
  delay: number;
}) => (
  <div
    className="pm pm-up"
    style={{ ...d(delay), display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
  >
    <div
      style={{
        position: 'relative',
        width: 132,
        height: 132,
        borderRadius: 66,
        background: col.deep,
        border: `4px solid ${color}`,
        boxShadow: `0 0 0 10px ${color}1a`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
      <span
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 42,
          height: 42,
          borderRadius: 21,
          background: color,
          color: col.deep,
          fontSize: 22,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {n}
      </span>
    </div>
    <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.3, marginTop: 28, maxWidth: 280 }}>{label}</div>
  </div>
);

const WhatIs: Page = () => (
  <Frame>
    <Body>
      <Header label="The basics" title="What is problem solving?" />
      <p className="pm pm-rise" style={{ ...d(0.2), fontSize: 44, fontWeight: 600, lineHeight: 1.35, margin: '36px 0 0' }}>
        Finding a <span style={{ color: col.sun }}>logical solution</span> to a problem or difficulty by using the{' '}
        <span style={{ color: col.sky }}>available information</span>.
      </p>
      <div
        className="pm pm-rise"
        style={{ ...d(0.35), ...card, padding: '26px 36px', marginTop: 36, display: 'flex', alignItems: 'center', gap: 28 }}
      >
        <GlyphIcon text="∑" color={col.sun} size={64} />
        <div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>In mathematics, it is not only about getting the answer.</div>
          <div style={{ fontSize: 28, color: col.muted, marginTop: 6 }}>It is the whole journey from question to checked answer:</div>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 56 }}>
        <svg width="1680" height="140" viewBox="0 0 1680 140" style={{ position: 'absolute', top: 0, left: 0 }}>
          <line
            className="pm-loop pm-dash"
            x1="168"
            y1="66"
            x2="1512"
            y2="66"
            stroke={col.dim}
            strokeWidth="4"
            strokeDasharray="12 12"
          />
        </svg>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <PathNode
            n={1}
            delay={0.5}
            color={col.sky}
            label="Understanding the problem"
            icon={
              <Icon color={col.sky} size={60}>
                <circle cx="21" cy="21" r="12" />
                <path d="M30 30 L41 41" strokeWidth="5" />
              </Icon>
            }
          />
          <PathNode
            n={2}
            delay={0.65}
            color={col.sky}
            label="Identifying the given information"
            icon={
              <Icon color={col.sky} size={60}>
                <rect x="10" y="6" width="28" height="36" rx="4" />
                <path d="M17 17 H31 M17 25 H31 M17 33 H25" />
              </Icon>
            }
          />
          <PathNode
            n={3}
            delay={0.8}
            color={col.sun}
            label="Selecting the correct method"
            icon={
              <Icon color={col.sun} size={60}>
                <path d="M24 42 V26 M24 26 L12 12 M24 26 L36 12 M8 14 L12 10 L16 14 M32 14 L36 10 L40 14" />
              </Icon>
            }
          />
          <PathNode
            n={4}
            delay={0.95}
            color={col.mint}
            label="Performing calculations"
            icon={<GlyphIcon text="+−" color={col.mint} size={64} />}
          />
          <PathNode
            n={5}
            delay={1.1}
            color={col.rose}
            label="Checking the answer"
            icon={
              <Icon color={col.rose} size={60}>
                <path d="M10 25 L20 35 L38 13" strokeWidth="5" />
              </Icon>
            }
          />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Who was Pólya ---------- */

const StepRow = ({ n, text, delay }: { n: number; text: string; delay: number }) => {
  const { color } = STEPS[n - 1];
  return (
    <div
      className="pm pm-left"
      style={{ ...d(delay), ...card, display: 'flex', alignItems: 'center', gap: 28, padding: '18px 30px' }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          flex: 'none',
          background: `${color}26`,
          border: `3px solid ${color}`,
          color,
          fontFamily: font.display,
          fontSize: 30,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {n}
      </span>
      <span style={{ fontSize: 36, fontWeight: 700 }}>{text}</span>
    </div>
  );
};

const Orbit = ({ glyph, x, y, color, delay }: { glyph: string; x: number; y: number; color: string; delay: number }) => (
  <span
    className="pm pm-pop"
    style={{
      ...d(delay),
      position: 'absolute',
      left: x,
      top: y,
      fontFamily: font.display,
      fontSize: 52,
      fontWeight: 700,
      color,
    }}
  >
    {glyph}
  </span>
);

const Polya: Page = () => (
  <Frame>
    <Body>
      <Header label="The person behind it" title="Who was George Pólya?" />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '560px 1fr', gap: 96, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 480, height: 400 }}>
            <div
              className="pm pm-pop"
              style={{
                ...d(0.2),
                position: 'absolute',
                left: 90,
                top: 50,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle at 40% 35%, ${col.sun}33, ${col.deep} 70%)`,
                border: `4px solid ${col.sun}`,
                boxShadow: `0 0 0 16px ${col.sun}14`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: font.display,
                fontSize: 120,
                fontWeight: 700,
                color: col.sun,
              }}
            >
              GP
            </div>
            <div className="pm-loop pm-float" style={{ position: 'absolute', inset: 0 }}>
              <Orbit glyph="π" x={30} y={30} color={col.sky} delay={0.5} />
              <Orbit glyph="√" x={410} y={50} color={col.mint} delay={0.6} />
              <Orbit glyph="Δ" x={20} y={300} color={col.rose} delay={0.7} />
              <Orbit glyph="?" x={420} y={300} color={col.sun} delay={0.8} />
            </div>
          </div>
          <div className="pm pm-rise" style={{ ...d(0.4), textAlign: 'center', marginTop: 20 }}>
            <div style={{ fontFamily: font.display, fontSize: 44, fontWeight: 700 }}>George Pólya</div>
            <div style={{ fontSize: 28, color: col.muted, marginTop: 6 }}>Mathematician and educator</div>
          </div>
        </div>
        <div>
          <p className="pm pm-rise" style={{ ...d(0.25), fontSize: 36, lineHeight: 1.45, margin: 0 }}>
            He developed one of the <span style={{ color: col.sun, fontWeight: 700 }}>most influential</span> approaches
            to mathematical problem solving, built on four main steps:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 40 }}>
            <StepRow n={1} text="Understand the problem" delay={0.5} />
            <StepRow n={2} text="Devise a plan" delay={0.65} />
            <StepRow n={3} text="Carry out the plan" delay={0.8} />
            <StepRow n={4} text="Review the solution" delay={0.95} />
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- step pages ---------- */

const Point = ({ children, color, glyph, delay }: { children: ReactNode; color: string; glyph: string; delay: number }) => (
  <div className="pm pm-left" style={{ ...d(delay), display: 'flex', alignItems: 'center', gap: 24 }}>
    <span
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        flex: 'none',
        background: `${color}26`,
        color,
        fontSize: 28,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {glyph}
    </span>
    <span style={{ fontSize: 34, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const StepPage = ({
  n,
  title,
  intro,
  art,
  children,
}: {
  n: number;
  title: string;
  intro: string;
  art: ReactNode;
  children: ReactNode;
}) => {
  const { color } = STEPS[n - 1];
  return (
    <Frame step={n}>
      <Body>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 560px', gap: 80, alignItems: 'center' }}>
          <div>
            <Header label={`Step ${n} of 4`} title={title} color={color} />
            <p className="pm pm-rise" style={{ ...d(0.2), fontSize: 34, color: col.muted, lineHeight: 1.45, margin: '20px 0 0' }}>
              {intro}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 44 }}>{children}</div>
          </div>
          <Art n={n}>{art}</Art>
        </div>
      </Body>
    </Frame>
  );
};

const Understand: Page = () => (
  <StepPage
    n={1}
    title="Understand the problem"
    intro="Before solving anything, first understand what is being asked."
    art={<Magnifier color={col.sky} />}
  >
    <Point glyph="?" color={col.sky} delay={0.4}>Can you restate the problem in your own words?</Point>
    <Point glyph="?" color={col.sky} delay={0.5}>What information is given?</Point>
    <Point glyph="?" color={col.sky} delay={0.6}>What information is missing?</Point>
    <Point glyph="?" color={col.sky} delay={0.7}>Is any information unnecessary?</Point>
    <Point glyph="?" color={col.sky} delay={0.8}>What is the goal of the problem?</Point>
  </StepPage>
);

/* ---------- Example: understand ---------- */

const Wallet = ({ color }: { color: string }) => (
  <Icon color={color} size={64}>
    <rect x="6" y="12" width="36" height="28" rx="5" />
    <path d="M6 18 H36 M30 26 H42 V34 H30 Z" />
  </Icon>
);

const Book = ({ color }: { color: string }) => (
  <Icon color={color} size={64}>
    <path d="M24 12 C18 8 10 8 6 10 V38 C10 36 18 36 24 40 C30 36 38 36 42 38 V10 C38 8 30 8 24 12 Z M24 12 V40" />
  </Icon>
);

const Bus = ({ color }: { color: string }) => (
  <Icon color={color} size={64}>
    <rect x="8" y="8" width="32" height="28" rx="6" />
    <path d="M8 22 H40 M14 14 H34" />
    <circle cx="16" cy="40" r="3" />
    <circle cx="32" cy="40" r="3" />
  </Icon>
);

const Notebook = ({ color }: { color: string }) => (
  <Icon color={color} size={64}>
    <rect x="12" y="6" width="26" height="36" rx="4" />
    <path d="M8 14 H16 M8 24 H16 M8 34 H16 M22 16 H32" />
  </Icon>
);

const Given = ({ icon, label, value, delay }: { icon: ReactNode; label: string; value: string; delay: number }) => (
  <div
    className="pm pm-up"
    style={{ ...d(delay), ...card, padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}
  >
    {icon}
    <div style={{ fontSize: 28, color: col.muted }}>{label}</div>
    <div style={{ fontFamily: font.display, fontSize: 52, fontWeight: 700, color: col.sky }}>{value}</div>
  </div>
);

const UnderstandExample: Page = () => (
  <Frame step={1}>
    <Body>
      <Header label="Example · Step 1" title="Understanding the problem" color={col.sky} />
      <div className="pm pm-rise" style={{ ...d(0.2), ...card, padding: '30px 40px', marginTop: 40 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: col.muted, letterSpacing: '0.08em' }}>PROBLEM</div>
        <p style={{ fontSize: 38, lineHeight: 1.6, margin: '8px 0 0' }}>
          A student has <Mark color={col.sky}>Rs. 5000</Mark>. She spends <Mark color={col.sky}>Rs. 1500</Mark> on books
          and <Mark color={col.sky}>Rs. 1000</Mark> on transport. <Mark color={col.sun}>How much money remains?</Mark>
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 460px', gap: 28, marginTop: 40 }}>
        <Given icon={<Wallet color={col.sky} />} label="Given · total" value="Rs. 5000" delay={0.5} />
        <Given icon={<Book color={col.sky} />} label="Given · books" value="Rs. 1500" delay={0.62} />
        <Given icon={<Bus color={col.sky} />} label="Given · transport" value="Rs. 1000" delay={0.74} />
        <div
          className="pm pm-pop"
          style={{
            ...d(1),
            borderRadius: 'var(--osd-radius)',
            border: `3px dashed ${col.sun}`,
            background: `${col.sun}14`,
            padding: '28px 30px',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          <span style={{ fontFamily: font.display, fontSize: 130, fontWeight: 700, lineHeight: 1, color: col.sun }}>?</span>
          <div>
            <div style={{ fontSize: 28, color: col.muted }}>Required</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: col.sun, lineHeight: 1.25 }}>Money remaining</div>
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Step 2: devise a plan ---------- */

const Strategy = ({ icon, text, delay, hot }: { icon: ReactNode; text: string; delay: number; hot?: boolean }) => (
  <div
    className="pm pm-up"
    style={{
      ...d(delay),
      ...card,
      border: hot ? `3px solid ${col.sun}` : card.border,
      background: hot ? `${col.sun}17` : col.panel,
      padding: '24px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: 76,
        height: 76,
        borderRadius: 38,
        background: `${col.sun}1f`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </div>
    <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>{text}</div>
  </div>
);

const Plan: Page = () => (
  <Frame step={2}>
    <Body>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Header label="Step 2 of 4" title="Devise a plan" color={col.sun} />
          <p className="pm pm-rise" style={{ ...d(0.2), fontSize: 34, color: col.muted, lineHeight: 1.45, margin: '16px 0 0' }}>
            Decide <i>how</i> you are going to solve it. Pick a strategy from the toolbox:
          </p>
        </div>
        <div className="pm pm-pop" style={{ ...d(0.3), marginBottom: -10 }}>
          <Bulb color={col.sun} size={190} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridAutoRows: 222, gap: 24, marginTop: 36 }}>
        <Strategy
          delay={0.35}
          text="List what is known and required"
          icon={
            <Icon color={col.sun}>
              <path d="M18 12 H40 M18 24 H40 M18 36 H40" />
              <circle cx="9" cy="12" r="2" />
              <circle cx="9" cy="24" r="2" />
              <circle cx="9" cy="36" r="2" />
            </Icon>
          }
        />
        <Strategy
          delay={0.42}
          text="Draw a diagram"
          icon={
            <Icon color={col.sun}>
              <path d="M8 40 L22 10 L36 40 Z" />
              <circle cx="36" cy="16" r="8" />
            </Icon>
          }
        />
        <Strategy
          delay={0.49}
          text="Make a table or chart"
          icon={
            <Icon color={col.sun}>
              <rect x="6" y="8" width="36" height="32" rx="4" />
              <path d="M6 19 H42 M6 30 H42 M20 8 V40" />
            </Icon>
          }
        />
        <Strategy
          delay={0.56}
          text="Look for a pattern"
          icon={
            <Icon color={col.sun}>
              <path d="M8 40 V32 M18 40 V26 M28 40 V18 M38 40 V8" strokeWidth="6" />
            </Icon>
          }
        />
        <Strategy
          delay={0.63}
          text="Work backward"
          icon={
            <Icon color={col.sun}>
              <path d="M40 34 V22 C40 16 36 14 30 14 H10 M18 6 L10 14 L18 22" />
            </Icon>
          }
        />
        <Strategy
          delay={0.7}
          text="Find a similar but simpler problem"
          icon={
            <Icon color={col.sun}>
              <rect x="6" y="6" width="36" height="36" rx="5" />
              <rect x="14" y="20" width="14" height="14" rx="3" />
            </Icon>
          }
        />
        <Strategy delay={0.77} hot text="Write an equation" icon={<GlyphIcon text="x=" color={col.sun} />} />
        <Strategy delay={0.84} text="Guess and check" icon={<GlyphIcon text="?✓" color={col.sun} />} />
        <Strategy
          delay={0.91}
          text="Use indirect reasoning"
          icon={
            <Icon color={col.sun}>
              <circle cx="24" cy="24" r="16" />
              <path d="M13 35 L35 13" />
            </Icon>
          }
        />
        <Strategy
          delay={0.98}
          text="Perform an experiment"
          icon={
            <Icon color={col.sun}>
              <path d="M18 6 H30 M20 6 V20 L8 40 H40 L28 20 V6" />
              <path d="M14 31 H34" />
            </Icon>
          }
        />
      </div>
    </Body>
  </Frame>
);

/* ---------- Example: equation ---------- */

const Balance = () => (
  <svg width="580" height="406" viewBox="0 0 600 420" style={{ display: 'block' }}>
    <path d="M300 120 V370" stroke={col.muted} strokeWidth="10" strokeLinecap="round" />
    <path d="M210 386 H390" stroke={col.muted} strokeWidth="14" strokeLinecap="round" />
    <g className="pm pm-tilt" style={{ ...d(0.5), transformOrigin: '300px 110px' }}>
      <path d="M70 110 H530" stroke={col.sun} strokeWidth="10" strokeLinecap="round" />
      <path d="M120 110 L60 250 M120 110 L180 250 M480 110 L420 250 M480 110 L540 250" stroke={col.dim} strokeWidth="3" />
      <path d="M40 250 H200 Q190 290 120 290 Q50 290 40 250 Z" fill={`${col.sun}33`} stroke={col.sun} strokeWidth="4" />
      <path d="M400 250 H560 Q550 290 480 290 Q410 290 400 250 Z" fill={`${col.mint}33`} stroke={col.mint} strokeWidth="4" />
      <rect x="58" y="192" width="56" height="56" rx="10" fill={col.sun} />
      <text x="86" y="222" textAnchor="middle" dominantBaseline="central" fill={col.deep} style={{ fontFamily: font.display, fontSize: 40, fontWeight: 700, fontStyle: 'italic' }}>
        x
      </text>
      <circle cx="152" cy="220" r="28" fill={col.deep} stroke={col.sun} strokeWidth="4" />
      <text x="152" y="222" textAnchor="middle" dominantBaseline="central" fill={col.sun} style={{ fontFamily: font.display, fontSize: 32, fontWeight: 700 }}>
        8
      </text>
      <rect x="436" y="192" width="88" height="56" rx="10" fill={col.deep} stroke={col.mint} strokeWidth="4" />
      <text x="480" y="222" textAnchor="middle" dominantBaseline="central" fill={col.mint} style={{ fontFamily: font.display, fontSize: 36, fontWeight: 700 }}>
        20
      </text>
    </g>
    <polygon points="300,96 282,128 318,128" fill={col.muted} />
  </svg>
);

const EqLine = ({ children, note, delay, hot }: { children: ReactNode; note?: string; delay: number; hot?: boolean }) => (
  <div className="pm pm-left" style={{ ...d(delay), display: 'flex', alignItems: 'baseline', gap: 28 }}>
    <span
      style={{
        fontFamily: font.display,
        fontSize: 60,
        fontWeight: 700,
        lineHeight: 1.3,
        padding: hot ? '0 20px' : undefined,
        borderRadius: 14,
        background: hot ? `${col.mint}26` : undefined,
        color: hot ? col.mint : undefined,
      }}
    >
      {children}
    </span>
    {note && <span style={{ fontSize: 26, color: col.muted }}>{note}</span>}
  </div>
);

const EquationExample: Page = () => (
  <Frame step={2}>
    <Body>
      <Header label="Example · Step 2" title="Using an equation" color={col.sun} />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 580px', gap: 48, alignItems: 'center' }}>
        <div>
          <p className="pm pm-rise" style={{ ...d(0.2), fontSize: 36, lineHeight: 1.45, margin: 0 }}>
            <b>Problem:</b> A number increased by <Mark color={col.sun}>8</Mark> is <Mark color={col.mint}>20</Mark>. Find
            the number.
          </p>
          <p className="pm pm-rise" style={{ ...d(0.35), fontSize: 32, color: col.muted, margin: '32px 0 12px' }}>
            Let the number be <X />.
          </p>
          <EqLine delay={0.6}>
            <X /> + 8 = 20
          </EqLine>
          <EqLine delay={0.9} note="take 8 from both sides">
            <X /> = 20 − 8
          </EqLine>
          <EqLine delay={1.2} hot>
            <X /> = 12
          </EqLine>
          <div
            className="pm pm-rise"
            style={{ ...d(1.5), ...card, display: 'inline-block', marginTop: 32, padding: '18px 32px', fontSize: 32 }}
          >
            <b style={{ color: col.mint }}>Answer:</b> the number is 12.
          </div>
        </div>
        <div className="pm pm-pop" style={d(0.3)}>
          <Balance />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Step 3: carry out ---------- */

const CarryOut: Page = () => (
  <StepPage
    n={3}
    title="Carry out the plan"
    intro="Now follow the plan carefully, one step at a time."
    art={<Gears color={col.mint} />}
  >
    <Point glyph="✓" color={col.mint} delay={0.4}>Work accurately</Point>
    <Point glyph="✓" color={col.mint} delay={0.5}>Keep calculations organized</Point>
    <Point glyph="✓" color={col.mint} delay={0.6}>Check your calculations</Point>
    <Point glyph="✓" color={col.mint} delay={0.7}>Follow the method step by step</Point>
    <Point glyph="↻" color={col.sun} delay={0.8}>If the method does not work, modify your plan</Point>
  </StepPage>
);

/* ---------- Example: carry out ---------- */

const Calc = ({ label, expr, result, delay }: { label: string; expr: string; result: string; delay: number }) => (
  <div
    className="pm pm-left"
    style={{
      ...d(delay),
      ...card,
      display: 'grid',
      gridTemplateColumns: '340px 1fr auto',
      alignItems: 'center',
      gap: 32,
      padding: '22px 40px',
    }}
  >
    <span style={{ fontSize: 32, color: col.muted }}>{label}</span>
    <span style={{ fontFamily: font.display, fontSize: 48, fontWeight: 700 }}>{expr}</span>
    <span style={{ fontFamily: font.display, fontSize: 52, fontWeight: 700, color: col.mint }}>= {result}</span>
  </div>
);

// One slice of a money bar; 1 rupee = 0.33 px, so Rs. 5000 spans 1650 px.
const Seg = ({ amount, label, color, solid, delay }: { amount: number; label: string; color: string; solid?: boolean; delay: number }) => (
  <div
    className="pm pm-grow"
    style={{
      ...d(delay),
      width: amount * 0.33,
      height: 116,
      boxSizing: 'border-box',
      borderRadius: 16,
      background: solid ? color : `${color}33`,
      border: `3px solid ${color}`,
      color: solid ? col.deep : color,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 22px',
    }}
  >
    <span style={{ fontSize: 22, fontWeight: 700, opacity: 0.85 }}>{label}</span>
    <span style={{ fontFamily: font.display, fontSize: 34, fontWeight: 700 }}>Rs. {amount}</span>
  </div>
);

const CarryOutExample: Page = () => (
  <Frame step={3}>
    <Body>
      <Header label="Example · Step 3" title="Carrying out the plan" color={col.mint} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 44 }}>
        <Calc label="Money spent" expr="1500 + 1000" result="Rs. 2500" delay={0.3} />
        <Calc label="Money remaining" expr="5000 − 2500" result="Rs. 2500" delay={0.5} />
      </div>
      <div style={{ marginTop: 72 }}>
        <div className="pm pm-fade" style={{ ...d(0.7), fontSize: 26, fontWeight: 700, color: col.muted, marginBottom: 16 }}>
          Where the Rs. 5000 goes
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Seg amount={1500} label="Books" color={col.sun} delay={0.8} />
          <Seg amount={1000} label="Transport" color={col.rose} delay={1} />
          <Seg amount={2500} label="Remaining" color={col.mint} solid delay={1.2} />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- Step 4: review ---------- */

const Review: Page = () => (
  <StepPage
    n={4}
    title="Review the solution"
    intro="After finding an answer, look back to make sure it is correct."
    art={<ReviewArt color={col.rose} />}
  >
    <Point glyph="?" color={col.rose} delay={0.4}>Does the answer make sense?</Point>
    <Point glyph="?" color={col.rose} delay={0.5}>Is it consistent with the information given?</Point>
    <Point glyph="?" color={col.rose} delay={0.6}>Did I make a calculation mistake?</Point>
    <Point glyph="?" color={col.rose} delay={0.7}>Can I solve it using another method?</Point>
    <Point glyph="?" color={col.rose} delay={0.8}>Did I answer what the question actually asked?</Point>
  </StepPage>
);

/* ---------- Example: review ---------- */

const ReviewExample: Page = () => (
  <Frame step={4}>
    <Body>
      <Header label="Example · Step 4" title="Reviewing the solution" color={col.rose} />
      <p className="pm pm-rise" style={{ ...d(0.2), fontSize: 36, lineHeight: 1.45, margin: '32px 0 0' }}>
        The student started with <Mark color={col.sky}>Rs. 5000</Mark> and spent <Mark color={col.sun}>Rs. 2500</Mark>.
        Add them back together:
      </p>
      <div className="pm pm-pop" style={{ ...d(0.45), display: 'flex', alignItems: 'center', gap: 36, marginTop: 36 }}>
        <span style={{ fontFamily: font.display, fontSize: 96, fontWeight: 700 }}>
          <span style={{ color: col.sun }}>2500</span> + <span style={{ color: col.mint }}>2500</span> ={' '}
          <span style={{ color: col.sky }}>5000</span>
        </span>
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="48" cy="48" r="42" fill={`${col.mint}26`} stroke={col.mint} strokeWidth="5" />
          <path className="pm pm-draw" style={d(1)} pathLength={1} d="M28 49 L42 63 L68 34" stroke={col.mint} strokeWidth="9" />
        </svg>
      </div>
      <div style={{ position: 'relative', width: 1658, marginTop: 64 }}>
        <div
          className="pm pm-fade"
          style={{
            ...d(0.6),
            position: 'absolute',
            inset: -12,
            borderRadius: 26,
            border: `3px dashed ${col.sky}`,
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <Seg amount={2500} label="Spent" color={col.sun} delay={0.7} />
          <Seg amount={2500} label="Remaining" color={col.mint} solid delay={0.9} />
        </div>
        <div
          className="pm pm-fade"
          style={{ ...d(1), position: 'absolute', right: -12, top: -54, fontSize: 24, fontWeight: 700, color: col.sky }}
        >
          Started with Rs. 5000
        </div>
      </div>
      <div
        className="pm pm-rise"
        style={{ ...d(1.2), ...card, alignSelf: 'flex-start', marginTop: 52, padding: '22px 36px', fontSize: 34 }}
      >
        Therefore, the answer <b style={{ color: col.mint }}>Rs. 2500</b> is reasonable.
      </div>
    </Body>
  </Frame>
);

/* ---------- At a glance ---------- */

const GlanceCard = ({ n, title, text, icon, delay }: { n: number; title: string; text: string; icon: ReactNode; delay: number }) => {
  const { color } = STEPS[n - 1];
  return (
    <div
      className="pm pm-up"
      style={{
        ...d(delay),
        ...card,
        borderTop: `8px solid ${color}`,
        padding: '36px 34px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            background: `${color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <span style={{ fontFamily: font.display, fontSize: 96, fontWeight: 700, color, opacity: 0.35, lineHeight: 1 }}>
          {n}
        </span>
      </div>
      <div style={{ fontFamily: font.display, fontSize: 42, fontWeight: 700, color }}>{title}</div>
      <div style={{ fontSize: 32, color: col.muted, lineHeight: 1.45 }}>{text}</div>
    </div>
  );
};

const Arrow = ({ delay }: { delay: number }) => (
  <svg className="pm pm-fade" style={{ ...d(delay), alignSelf: 'center' }} width="40" height="40" viewBox="0 0 40 40">
    <path d="M6 20 H32 M22 10 L32 20 L22 30" fill="none" stroke={col.dim} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Glance: Page = () => (
  <Frame>
    <Body>
      <Header label="Summary" title="The four steps at a glance" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 40px 1fr 40px 1fr 40px 1fr',
          gridAutoRows: 520,
          gap: 14,
          marginTop: 64,
        }}
      >
        <GlanceCard
          n={1}
          delay={0.3}
          title="Understand"
          text="Identify what is given and what is required"
          icon={
            <Icon color={col.sky} size={52}>
              <circle cx="21" cy="21" r="12" />
              <path d="M30 30 L41 41" strokeWidth="5" />
            </Icon>
          }
        />
        <Arrow delay={0.5} />
        <GlanceCard n={2} delay={0.6} title="Devise a plan" text="Choose a suitable strategy" icon={<Bulb color={col.sun} size={64} />} />
        <Arrow delay={0.8} />
        <GlanceCard
          n={3}
          delay={0.9}
          title="Carry out"
          text="Apply the plan and perform the calculations"
          icon={<GlyphIcon text="+−" color={col.mint} size={60} />}
        />
        <Arrow delay={1.1} />
        <GlanceCard
          n={4}
          delay={1.2}
          title="Review"
          text="Check and interpret the answer"
          icon={
            <Icon color={col.rose} size={52}>
              <path d="M10 25 L20 35 L38 13" strokeWidth="5" />
            </Icon>
          }
        />
      </div>
    </Body>
  </Frame>
);

/* ---------- Why useful ---------- */

const Benefit = ({ icon, title, color, delay }: { icon: ReactNode; title: string; color: string; delay: number }) => (
  <div
    className="pm pm-up"
    style={{ ...d(delay), ...card, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 26 }}
  >
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: 42,
        flex: 'none',
        background: `${color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </div>
    <span style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3 }}>{title}</span>
  </div>
);

const Field = ({ icon, label, delay }: { icon: ReactNode; label: string; delay: number }) => (
  <div className="pm pm-pop" style={{ ...d(delay), display: 'flex', alignItems: 'center', gap: 14 }}>
    <span
      style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: col.deep,
        border: `2px solid ${col.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </span>
    <span style={{ fontSize: 30, fontWeight: 600 }}>{label}</span>
  </div>
);

const Why: Page = () => (
  <Frame>
    <Body>
      <Header label="Why it matters" title="Why is Pólya’s method useful?" />
      <p className="pm pm-rise" style={{ ...d(0.2), fontSize: 34, color: col.muted, lineHeight: 1.45, margin: '20px 0 0' }}>
        It replaces random guessing with a system: it organizes our thinking and helps us catch our own mistakes.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 170, gap: 24, marginTop: 48 }}>
        <Benefit
          delay={0.35}
          color={col.sky}
          title="Solve problems systematically"
          icon={
            <Icon color={col.sky} size={46}>
              <path d="M6 40 H16 V30 H26 V20 H36 V10 H42" />
            </Icon>
          }
        />
        <Benefit
          delay={0.45}
          color={col.sun}
          title="Organize your thinking"
          icon={
            <Icon color={col.sun} size={46}>
              <rect x="8" y="8" width="32" height="9" rx="3" />
              <rect x="8" y="21" width="32" height="9" rx="3" />
              <rect x="8" y="34" width="32" height="9" rx="3" />
            </Icon>
          }
        />
        <Benefit
          delay={0.55}
          color={col.sun}
          title="Choose suitable strategies"
          icon={
            <Icon color={col.sun} size={46}>
              <path d="M24 42 V26 M24 26 L12 12 M24 26 L36 12 M8 14 L12 10 L16 14 M32 14 L36 10 L40 14" />
            </Icon>
          }
        />
        <Benefit
          delay={0.65}
          color={col.rose}
          title="Find and correct mistakes"
          icon={
            <Icon color={col.rose} size={46}>
              <circle cx="21" cy="21" r="12" />
              <path d="M30 30 L41 41 M16 16 L26 26 M26 16 L16 26" />
            </Icon>
          }
        />
        <Benefit
          delay={0.75}
          color={col.mint}
          title="Develop logical reasoning"
          icon={
            <Icon color={col.mint} size={46}>
              <circle cx="10" cy="24" r="5" />
              <circle cx="38" cy="10" r="5" />
              <circle cx="38" cy="38" r="5" />
              <path d="M15 22 L33 12 M15 26 L33 36" />
            </Icon>
          }
        />
        <Benefit
          delay={0.85}
          color={col.mint}
          title="Apply skills everywhere"
          icon={
            <Icon color={col.mint} size={46}>
              <circle cx="24" cy="24" r="17" />
              <path d="M7 24 H41 M24 7 C16 16 16 32 24 41 C32 32 32 16 24 7" />
            </Icon>
          }
        />
      </div>
      <div
        className="pm pm-rise"
        style={{ ...d(0.95), ...card, marginTop: 48, padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Field icon={<GlyphIcon text="π" color={col.sun} size={40} />} label="Mathematics" delay={1.05} />
        <Field
          icon={
            <Icon color={col.sun} size={34}>
              <path d="M16 12 L6 24 L16 36 M32 12 L42 24 L32 36 M27 8 L21 40" />
            </Icon>
          }
          label="Programming"
          delay={1.12}
        />
        <Field
          icon={
            <Icon color={col.sun} size={34}>
              <path d="M18 6 H30 M20 6 V20 L8 40 H40 L28 20 V6" />
            </Icon>
          }
          label="Science"
          delay={1.19}
        />
        <Field
          icon={
            <svg width="34" height="34" viewBox="0 0 48 48">
              <polygon points={gear(24, 24, 20, 8)} fill="none" stroke={col.sun} strokeWidth="3.5" strokeLinejoin="round" />
              <circle cx="24" cy="24" r="6" fill="none" stroke={col.sun} strokeWidth="3.5" />
            </svg>
          }
          label="Engineering"
          delay={1.26}
        />
        <Field
          icon={
            <Icon color={col.sun} size={34}>
              <path d="M6 22 L24 8 L42 22 M12 18 V40 H36 V18 M20 40 V28 H28 V40" />
            </Icon>
          }
          label="Everyday life"
          delay={1.33}
        />
      </div>
    </Body>
  </Frame>
);

/* ---------- Real-life example ---------- */

const Phase = ({ n, children, delay }: { n: number; children: ReactNode; delay: number }) => {
  const { name, color } = STEPS[n - 1];
  return (
    <div
      className="pm pm-up"
      style={{ ...d(delay), ...card, borderTop: `8px solid ${color}`, padding: '26px 30px', boxSizing: 'border-box' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 700, color }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: `${color}26`,
            fontFamily: font.display,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {n}
        </span>
        {name}
      </div>
      <div style={{ fontSize: 28, lineHeight: 1.5, marginTop: 18 }}>{children}</div>
    </div>
  );
};

const Price = ({ icon, label, value, delay }: { icon: ReactNode; label: string; value: string; delay: number }) => (
  <div className="pm pm-pop" style={{ ...d(delay), display: 'flex', alignItems: 'center', gap: 16 }}>
    {icon}
    <div>
      <div style={{ fontSize: 22, color: col.muted }}>{label}</div>
      <div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 700 }}>{value}</div>
    </div>
  </div>
);

const RealLife: Page = () => (
  <Frame>
    <Body>
      <Header label="Real life" title="All four steps on one problem" />
      <div
        className="pm pm-rise"
        style={{ ...d(0.2), ...card, marginTop: 36, padding: '26px 40px', display: 'flex', alignItems: 'center', gap: 48 }}
      >
        <p style={{ flex: 1, fontSize: 34, lineHeight: 1.45, margin: 0 }}>
          You have Rs. 2000 and want to buy a book and a notebook. <b>How much money is left?</b>
        </p>
        <Price icon={<Wallet color={col.sky} />} label="You have" value="Rs. 2000" delay={0.35} />
        <Price icon={<Book color={col.sun} />} label="Book" value="Rs. 1200" delay={0.45} />
        <Price icon={<Notebook color={col.rose} />} label="Notebook" value="Rs. 300" delay={0.55} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 320, gap: 24, marginTop: 36 }}>
        <Phase n={1} delay={0.6}>
          Total = 2000
          <br />
          Book = 1200
          <br />
          Notebook = 300
          <br />
          <span style={{ color: col.sky }}>Find: money remaining</span>
        </Phase>
        <Phase n={2} delay={0.75}>
          Subtract the total spending from the total money.
        </Phase>
        <Phase n={3} delay={0.9}>
          1200 + 300 = 1500
          <br />
          2000 − 1500 = <b style={{ color: col.mint }}>500</b>
        </Phase>
        <Phase n={4} delay={1.05}>
          1500 + 500 = 2000 <b style={{ color: col.mint }}>✓</b>
          <br />
          The answer fits the information given.
        </Phase>
      </div>
      <div
        className="pm pm-pop"
        style={{
          ...d(1.3),
          alignSelf: 'flex-start',
          marginTop: 28,
          padding: '16px 32px',
          borderRadius: 999,
          background: col.mint,
          color: col.deep,
          fontSize: 32,
          fontWeight: 800,
        }}
      >
        Answer: Rs. 500 remains
      </div>
    </Body>
  </Frame>
);

/* ---------- Conclusion ---------- */

const Mnemonic = ({ n, word, delay }: { n: number; word: string; delay: number }) => {
  const { color } = STEPS[n - 1];
  return (
    <span
      className="pm pm-pop"
      style={{
        ...d(delay),
        padding: '12px 26px',
        borderRadius: 999,
        border: `3px solid ${color}`,
        background: `${color}1f`,
        color,
        fontSize: 32,
        fontWeight: 800,
      }}
    >
      {word}
    </span>
  );
};

const Arr = () => <span style={{ fontSize: 32, color: col.dim }}>→</span>;

const Conclusion: Page = () => (
  <Frame footer={false}>
    <div
      style={{
        position: 'absolute',
        inset: '0 120px 0 140px',
        display: 'grid',
        gridTemplateColumns: '1fr 700px',
        gap: 40,
        alignItems: 'center',
      }}
    >
      <div>
        <Label>Conclusion</Label>
        <h2
          className="pm pm-rise"
          style={{ ...d(0.1), fontFamily: font.display, fontSize: 92, fontWeight: 700, lineHeight: 1.08, margin: '24px 0 32px' }}
        >
          Solving is a <span style={{ color: col.sun }}>process</span>, not just an answer
        </h2>
        <p className="pm pm-rise" style={{ ...d(0.25), fontSize: 34, color: col.muted, lineHeight: 1.5, margin: 0 }}>
          Easy way to remember:
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 22 }}>
          <Mnemonic n={1} word="Understand" delay={0.5} />
          <Arr />
          <Mnemonic n={2} word="Plan" delay={0.7} />
          <Arr />
          <Mnemonic n={3} word="Solve" delay={0.9} />
          <Arr />
          <Mnemonic n={4} word="Check" delay={1.1} />
        </div>
      </div>
      <Wheel width={700} delay={0.3} center={<WheelText color={col.mint}>✓</WheelText>} />
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
Conclusion.transition = settle;

export const meta: SlideMeta = {
  title: 'Pólya’s Problem-Solving Method',
  createdAt: '2026-10-10T11:37:46.470Z',
};

export default [
  Cover,
  WhatIs,
  Polya,
  Understand,
  UnderstandExample,
  Plan,
  EquationExample,
  CarryOut,
  CarryOutExample,
  Review,
  ReviewExample,
  Glance,
  Why,
  RealLife,
  Conclusion,
] satisfies Page[];
