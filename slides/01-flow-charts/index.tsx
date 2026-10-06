import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#0d1a2b', text: '#eaf2fb', accent: '#ffb547' },
  fonts: {
    display: '"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif',
    body: '"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 160, body: 34 },
  radius: 20,
};

// Each flowchart symbol / structure owns one colour across the whole deck.
const col = {
  amber: '#ffb547', // decision
  green: '#5ee6a0', // start / end
  cyan: '#4fd1e8', // process, sequence
  violet: '#b49bff', // input / output, loop
  coral: '#ff8a7a',
  arrow: '#dfe8f3',
  muted: '#93a7c0',
  dim: '#5d7392',
  line: 'rgba(255, 255, 255, 0.10)',
  panel: 'rgba(255, 255, 255, 0.045)',
  code: '#08121f',
};

const font = {
  display: 'var(--osd-font-display)',
  body: 'var(--osd-font-body)',
  mono: '"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Resting styles are the final state; keyframes only describe where things
// come from. Inactive instances (thumbnails, overview, export) set data-still.
const css = `
  .fc { animation-fill-mode: both; animation-timing-function: ${EASE}; }
  [data-still] .fc { animation: none !important; }
  @media (prefers-reduced-motion: reduce) { .fc { animation: none !important; } }
  .fc-rise { animation-name: fc-rise; animation-duration: .8s; }
  .fc-left { animation-name: fc-left; animation-duration: .7s; }
  .fc-fade { animation-name: fc-fade; animation-duration: 1s; }
  .fc-pop { animation-name: fc-pop; animation-duration: .55s; }
  .fc-slide { animation-name: fc-slide; animation-duration: 1.6s; }
  .fc-tick { stroke-dasharray: 1; animation-name: fc-draw; animation-duration: .6s; }
  .fc-float { animation: fc-float 7s ease-in-out infinite; }
  .fc-dash { animation: fc-dash 1.1s linear infinite; }
  .fc-pulse { animation: fc-pulse 2.6s ease-in-out infinite; }
  .fc-caret { animation: fc-blink 1.05s steps(1) infinite; }
  [data-osd-step="revealed"] > .fc-step { animation: fc-rise .6s ${EASE} both; }
  [data-osd-step="revealed"] .fc-draw { stroke-dasharray: 1; animation: fc-draw 1.1s ${EASE} both; }
  @keyframes fc-rise { from { opacity: 0; transform: translateY(28px); } }
  @keyframes fc-left { from { opacity: 0; transform: translateX(-28px); } }
  @keyframes fc-fade { from { opacity: 0; } }
  @keyframes fc-pop { 0% { opacity: 0; transform: scale(.6); } 70% { transform: scale(1.06); } 100% { transform: scale(1); } }
  @keyframes fc-slide { from { left: 0%; } }
  @keyframes fc-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes fc-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
  @keyframes fc-dash { to { stroke-dashoffset: -20; } }
  @keyframes fc-pulse { 0%, 100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
  @keyframes fc-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
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
    'radial-gradient(1100px 700px at 88% 6%, rgba(79, 209, 232, 0.10), transparent 60%)',
    'radial-gradient(900px 600px at 0% 100%, rgba(180, 155, 255, 0.08), transparent 60%)',
    'linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: 'auto, auto, 64px 64px, 64px 64px',
  WebkitFontSmoothing: 'antialiased',
  fontVariantLigatures: 'none',
  fontFeatureSettings: '"calt" 0, "liga" 0',
};

/* ---------- shared pieces ---------- */

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: font.mono,
        fontSize: 20,
        letterSpacing: '0.14em',
        color: col.dim,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <svg width="18" height="18" viewBox="0 0 20 20">
          <polygon points="10,1 19,10 10,19 1,10" fill="none" stroke={col.amber} strokeWidth="2" />
        </svg>
        FLOWCHARTS · LESSON 01
      </span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
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
  <div style={{ position: 'absolute', inset: '96px 120px 110px' }}>{children}</div>
);

const Header = ({ eyebrow, title, color = col.amber }: { eyebrow: string; title: ReactNode; color?: string }) => (
  <div>
    <div
      className="fc fc-fade"
      style={{ fontFamily: font.mono, fontSize: 24, letterSpacing: '0.2em', color, fontWeight: 600 }}
    >
      {eyebrow}
    </div>
    <h2
      className="fc fc-rise"
      style={{
        ...d(0.08),
        fontFamily: font.display,
        fontSize: 68,
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        margin: '14px 0 0',
      }}
    >
      {title}
    </h2>
  </div>
);

type Kind = 'oval' | 'rect' | 'para' | 'diamond' | 'arrow';

// A single flowchart symbol, used as an illustration (never wired into a chart).
const Sym = ({
  kind,
  color,
  w = 200,
  label,
  labelSize = 22,
  draw = false,
}: {
  kind: Kind;
  color: string;
  w?: number;
  label?: string;
  labelSize?: number;
  draw?: boolean;
}) => {
  const shape = {
    fill: color,
    fillOpacity: 0.13,
    stroke: color,
    strokeWidth: 4,
    strokeLinejoin: 'round' as const,
    pathLength: 1,
    className: draw ? 'fc-draw' : undefined,
  };
  return (
    <svg width={w} height={(w * 110) / 200} viewBox="0 0 200 110" style={{ display: 'block', overflow: 'visible' }}>
      {kind === 'oval' && <rect x="6" y="16" width="188" height="78" rx="39" {...shape} />}
      {kind === 'rect' && <rect x="8" y="16" width="184" height="78" rx="6" {...shape} />}
      {kind === 'para' && <polygon points="38,16 196,16 162,94 4,94" {...shape} />}
      {kind === 'diamond' && <polygon points="100,4 196,55 100,106 4,55" {...shape} />}
      {kind === 'arrow' && (
        <>
          <line x1="10" y1="55" x2="168" y2="55" {...shape} strokeWidth={6} strokeLinecap="round" />
          <polygon points="164,36 196,55 164,74" {...shape} fillOpacity={1} />
        </>
      )}
      {label && (
        <text
          x="100"
          y="56"
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          style={{ fontFamily: font.mono, fontSize: labelSize, fontWeight: 700, letterSpacing: '0.04em' }}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

// Abstract glyphs for the three structures (deliberately not flowcharts).
const Glyph = ({ kind, color, size = 96 }: { kind: 'seq' | 'dec' | 'loop'; color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
    {kind === 'seq' && (
      <>
        <rect x="20" y="16" width="60" height="16" rx="8" fill={color} />
        <rect x="20" y="42" width="60" height="16" rx="8" fill={color} opacity="0.7" />
        <rect x="20" y="68" width="60" height="16" rx="8" fill={color} opacity="0.4" />
      </>
    )}
    {kind === 'dec' && (
      <g fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 88 V56 L22 22 M50 56 L78 22" />
        <circle cx="22" cy="18" r="6" fill={color} />
        <circle cx="78" cy="18" r="6" fill={color} />
      </g>
    )}
    {kind === 'loop' && (
      <>
        <path d="M78 50 A28 28 0 1 1 64 25.8" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <polygon points="74,32 68,14 56,30" fill={color} />
      </>
    )}
  </svg>
);

const Icon = ({ kind, color }: { kind: 'target' | 'bug' | 'globe' | 'chat'; color: string }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
    {kind === 'target' && (
      <>
        <circle cx="32" cy="32" r="24" />
        <circle cx="32" cy="32" r="14" />
        <circle cx="32" cy="32" r="4" fill={color} />
      </>
    )}
    {kind === 'bug' && (
      <>
        <ellipse cx="32" cy="38" rx="13" ry="16" />
        <circle cx="32" cy="16" r="7" />
        <path d="M19 32 H8 M19 44 H10 M45 32 H56 M45 44 H54 M32 24 V54" />
      </>
    )}
    {kind === 'globe' && (
      <>
        <circle cx="32" cy="32" r="24" />
        <ellipse cx="32" cy="32" rx="10" ry="24" />
        <path d="M8 32 H56" />
      </>
    )}
    {kind === 'chat' && (
      <path d="M12 12 H52 A6 6 0 0 1 58 18 V38 A6 6 0 0 1 52 44 H30 L18 54 V44 H12 A6 6 0 0 1 6 38 V18 A6 6 0 0 1 12 12 Z" />
    )}
  </svg>
);

const card: CSSProperties = {
  background: col.panel,
  border: `1px solid ${col.line}`,
  borderRadius: 'var(--osd-radius)',
  boxShadow: '0 20px 50px -24px rgba(0, 0, 0, 0.6)',
};

/* ---------- pseudocode ---------- */

const TOKEN = /("[^"]*"|\b(?:INPUT|OUTPUT|IF|THEN|ELSE|ENDIF|FOR|TO|NEXT|REPEAT|UNTIL|MOD)\b|\b\d+\b)/;

const hl = (src: string) =>
  src.split(TOKEN).map((t, i) => {
    if (!t) return null;
    let color = 'var(--osd-text)';
    if (t.startsWith('"')) color = col.coral;
    else if (/^\d+$/.test(t)) color = col.green;
    else if (i % 2 === 1) color = col.amber;
    return (
      <span key={i} style={{ color, fontWeight: i % 2 === 1 && color === col.amber ? 700 : 400 }}>
        {t}
      </span>
    );
  });

const CodePanel = ({ children, size = 34, width }: { children: ReactNode; size?: number; width?: number }) => (
  <div className="fc fc-rise" style={{ ...card, ...d(0.15), background: col.code, width, overflow: 'visible' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '20px 32px',
        borderBottom: `1px solid ${col.line}`,
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col.coral }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col.amber }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: col.green }} />
      <span style={{ marginLeft: 16, fontFamily: font.mono, fontSize: 20, letterSpacing: '0.18em', color: col.dim }}>
        PSEUDOCODE
      </span>
    </div>
    <div style={{ padding: '28px 32px 32px', fontFamily: font.mono, fontSize: size, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const TAG: Record<Kind, [string, string]> = {
  oval: ['Start / End', col.green],
  rect: ['Process', col.cyan],
  para: ['Input / Output', col.violet],
  diamond: ['Decision', col.amber],
  arrow: ['Flow line', col.arrow],
};

const Ln = ({
  n,
  code,
  indent = 0,
  tag,
  delay = 0,
}: {
  n: number;
  code: string;
  indent?: number;
  tag?: Kind;
  delay?: number;
}) => (
  <div className="fc fc-left" style={{ ...d(0.35 + delay), display: 'flex', alignItems: 'center' }}>
    <span style={{ width: '2.2em', color: col.dim, fontSize: '0.7em' }}>{n}</span>
    <span style={{ paddingLeft: `${indent * 1.6}em`, whiteSpace: 'pre', flex: 1 }}>{hl(code)}</span>
    {tag && (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: font.body,
          fontSize: 22,
          color: TAG[tag][1],
          opacity: 0.9,
        }}
      >
        <Sym kind={tag} color={TAG[tag][1]} w={52} />
        {TAG[tag][0]}
      </span>
    )}
  </div>
);

/* ---------- 01 Cover ---------- */

const Floating = ({
  x,
  y,
  rot,
  delay,
  children,
}: {
  x: number;
  y: number;
  rot: number;
  delay: number;
  children: ReactNode;
}) => (
  <div style={{ position: 'absolute', left: x, top: y }}>
    <div className="fc fc-pop" style={d(delay)}>
      <div className="fc fc-float" style={{ animationDelay: `${-delay * 3}s` }}>
        <div style={{ transform: `rotate(${rot}deg)` }}>{children}</div>
      </div>
    </div>
  </div>
);

const Cover: Page = () => (
  <Frame footer={false}>
    <Floating x={1250} y={150} rot={-6} delay={0.3}>
      <Sym kind="oval" color={col.green} w={330} label="START" labelSize={24} />
    </Floating>
    <Floating x={1500} y={390} rot={5} delay={0.45}>
      <Sym kind="para" color={col.violet} w={320} label="INPUT" labelSize={24} />
    </Floating>
    <Floating x={1190} y={560} rot={-4} delay={0.6}>
      <Sym kind="diamond" color={col.amber} w={300} label="?" labelSize={40} />
    </Floating>
    <Floating x={1480} y={760} rot={4} delay={0.75}>
      <Sym kind="rect" color={col.cyan} w={320} label="PROCESS" labelSize={24} />
    </Floating>

    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 0,
        bottom: 0,
        width: 1020,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        className="fc fc-fade"
        style={{ fontFamily: font.mono, fontSize: 26, letterSpacing: '0.22em', color: col.amber, fontWeight: 600 }}
      >
        COMPUTER SCIENCE · LESSON 01
      </div>
      <h1
        className="fc fc-rise"
        style={{
          ...d(0.1),
          fontFamily: font.display,
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.02,
          margin: '28px 0 32px',
        }}
      >
        Flowcharts
      </h1>
      <p className="fc fc-rise" style={{ ...d(0.25), fontSize: 44, color: col.muted, margin: 0, lineHeight: 1.4 }}>
        Plan the logic first.
        <br />
        <span style={{ color: 'var(--osd-text)' }}>Write the code second.</span>
      </p>
      <div
        className="fc fc-rise"
        style={{ ...d(0.45), display: 'flex', gap: 16, marginTop: 64, fontFamily: font.mono, fontSize: 24 }}
      >
        <span style={{ color: col.green }}>● Symbols</span>
        <span style={{ color: col.cyan }}>● Sequence</span>
        <span style={{ color: col.amber }}>● Decision</span>
        <span style={{ color: col.violet }}>● Loop</span>
      </div>
    </div>
  </Frame>
);

/* ---------- 02 Objectives ---------- */

const Objective = ({ n, verb, text, color }: { n: string; verb: string; text: string; color: string }) => (
  <div className="fc fc-step" style={{ ...card, height: '100%', boxSizing: 'border-box', padding: '36px 40px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: font.mono, fontSize: 26, color, fontWeight: 700 }}>{n}</span>
      <span style={{ width: 34, height: 34, border: `3px solid ${col.dim}`, borderRadius: 8 }} />
    </div>
    <div style={{ fontSize: 46, fontWeight: 800, color, marginTop: 18, letterSpacing: '-0.01em' }}>{verb}</div>
    <div style={{ fontSize: 30, color: col.muted, lineHeight: 1.45, marginTop: 8 }}>{text}</div>
  </div>
);

const Objectives: Page = () => (
  <Frame>
    <Body>
      <Header eyebrow="LESSON OBJECTIVES" title="By the end of this lesson you can…" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 56 }}>
        <Steps>
          <Step>
            <Objective n="01" verb="Define" text="what a flowchart is" color={col.green} />
          </Step>
          <Step>
            <Objective n="02" verb="Explain" text="why we flowchart before we program" color={col.cyan} />
          </Step>
          <Step>
            <Objective n="03" verb="Identify" text="the common flowchart symbols" color={col.violet} />
          </Step>
          <Step>
            <Objective n="04" verb="Understand" text="Sequence, Decision and Loop structures" color={col.amber} />
          </Step>
          <Step>
            <Objective n="05" verb="Create" text="a flowchart for a simple program" color={col.coral} />
          </Step>
          <Step>
            <Objective n="06" verb="Convert" text="between flowcharts and pseudocode" color={col.arrow} />
          </Step>
        </Steps>
      </div>
    </Body>
  </Frame>
);

/* ---------- 03 What is a flowchart ---------- */

const Ingredient = ({
  visual,
  title,
  text,
  color,
  delay,
}: {
  visual: ReactNode;
  title: string;
  text: string;
  color: string;
  delay: number;
}) => (
  <div
    className="fc fc-rise"
    style={{ ...card, ...d(delay), display: 'flex', alignItems: 'center', gap: 36, padding: '28px 40px' }}
  >
    <div style={{ width: 200, display: 'flex', justifyContent: 'center' }}>{visual}</div>
    <div>
      <div style={{ fontSize: 38, fontWeight: 800, color }}>{title}</div>
      <div style={{ fontSize: 28, color: col.muted, marginTop: 4 }}>{text}</div>
    </div>
  </div>
);

const NumDot = ({ n, color }: { n: number; color: string }) => (
  <span
    style={{
      width: 52,
      height: 52,
      borderRadius: 26,
      border: `3px solid ${color}`,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: font.mono,
      fontWeight: 700,
      fontSize: 24,
    }}
  >
    {n}
  </span>
);

const WhatIs: Page = () => (
  <Frame>
    <Body>
      <Header eyebrow="THE BASICS" title="What is a flowchart?" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 760px', gap: 80, marginTop: 64 }}>
        <div>
          <p
            className="fc fc-rise"
            style={{ ...d(0.2), fontSize: 52, lineHeight: 1.35, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}
          >
            A <span style={{ color: col.cyan }}>diagram</span> that shows the{' '}
            <span style={{ color: col.green }}>steps</span> of an algorithm, using{' '}
            <span style={{ color: col.amber }}>standard symbols</span> joined by{' '}
            <span style={{ color: col.violet }}>arrows</span>.
          </p>
          <p className="fc fc-rise" style={{ ...d(0.35), fontSize: 34, lineHeight: 1.5, color: col.muted, marginTop: 48 }}>
            An <b style={{ color: 'var(--osd-text)' }}>algorithm</b> is a step-by-step solution to a problem.
            <br />A flowchart is its <b style={{ color: 'var(--osd-text)' }}>picture</b>.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Ingredient
            delay={0.45}
            color={col.amber}
            title="Symbols"
            text="Each shape has one job"
            visual={
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Sym kind="oval" color={col.green} w={64} />
                <Sym kind="diamond" color={col.amber} w={64} />
                <Sym kind="para" color={col.violet} w={64} />
              </div>
            }
          />
          <Ingredient
            delay={0.6}
            color={col.violet}
            title="Arrows"
            text="Show what happens next"
            visual={<Sym kind="arrow" color={col.arrow} w={150} />}
          />
          <Ingredient
            delay={0.75}
            color={col.green}
            title="Order"
            text="Read from Start to End"
            visual={
              <div style={{ display: 'flex', gap: 10 }}>
                <NumDot n={1} color={col.green} />
                <NumDot n={2} color={col.green} />
                <NumDot n={3} color={col.green} />
              </div>
            }
          />
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- 04 Why ---------- */

const Reason = ({
  icon,
  title,
  text,
  color,
}: {
  icon: 'target' | 'bug' | 'globe' | 'chat';
  title: string;
  text: string;
  color: string;
}) => (
  <div className="fc fc-step" style={{ ...card, height: '100%', boxSizing: 'border-box', padding: '40px 36px' }}>
    <div
      style={{
        width: 104,
        height: 104,
        borderRadius: 52,
        background: `${color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon kind={icon} color={color} />
    </div>
    <div style={{ fontSize: 38, fontWeight: 800, marginTop: 32, color }}>{title}</div>
    <div style={{ fontSize: 29, color: col.muted, lineHeight: 1.5, marginTop: 12 }}>{text}</div>
  </div>
);

const Why: Page = () => (
  <Frame>
    <Body>
      <Header eyebrow="WHY BOTHER?" title="Why flowchart before we program?" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginTop: 64 }}>
        <Steps>
          <Step>
            <Reason icon="target" color={col.cyan} title="Plan the logic" text="Work out every step before worrying about syntax." />
          </Step>
          <Step>
            <Reason icon="bug" color={col.coral} title="Catch mistakes" text="Spot missing steps or wrong decisions on paper, not in code." />
          </Step>
          <Step>
            <Reason icon="globe" color={col.green} title="Any language" text="One flowchart can become Python, Java or pseudocode." />
          </Step>
          <Step>
            <Reason icon="chat" color={col.violet} title="Easy to share" text="Anyone can follow the logic at a glance." />
          </Step>
        </Steps>
      </div>
      <Steps>
        <Step>
          <p className="fc fc-step" style={{ fontSize: 40, fontWeight: 700, color: col.amber, marginTop: 56, marginBottom: 0 }}>
            Think of it as the blueprint — the program is the building.
          </p>
        </Step>
      </Steps>
    </Body>
  </Frame>
);
/* ---------- 05 Symbols ---------- */

const SymbolCard = ({
  kind,
  color,
  label,
  name,
  purpose,
  example,
}: {
  kind: Kind;
  color: string;
  label?: string;
  name: string;
  purpose: string;
  example: string;
}) => (
  <div
    className="fc fc-step"
    style={{
      ...card,
      height: '100%',
      boxSizing: 'border-box',
      padding: '40px 28px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <div style={{ height: 140, display: 'flex', alignItems: 'center' }}>
      <Sym kind={kind} color={color} w={230} label={label} labelSize={label === '?' ? 40 : 22} draw />
    </div>
    <div style={{ fontSize: 31, fontWeight: 800, color, marginTop: 28, whiteSpace: 'nowrap' }}>{name}</div>
    <div style={{ fontSize: 27, color: col.muted, lineHeight: 1.4, marginTop: 10, flex: 1 }}>{purpose}</div>
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 22,
        color,
        background: `${color}1a`,
        borderRadius: 10,
        padding: '8px 16px',
        marginTop: 20,
      }}
    >
      {example}
    </div>
  </div>
);

const Symbols: Page = () => (
  <Frame>
    <Body>
      <Header eyebrow="THE TOOLKIT" title="Five basic symbols" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28, marginTop: 64 }}>
        <Steps>
          <Step duration={240}>
            <SymbolCard kind="oval" color={col.green} label="START" name="Start / End" purpose="Begin or end the algorithm" example="START · END" />
          </Step>
          <Step duration={240}>
            <SymbolCard kind="rect" color={col.cyan} label="x = a+b" name="Process" purpose="A calculation or action" example="Sum = a + b" />
          </Step>
          <Step duration={240}>
            <SymbolCard kind="para" color={col.violet} label="INPUT" name="Input / Output" purpose="Read data in or display it" example="INPUT · OUTPUT" />
          </Step>
          <Step duration={240}>
            <SymbolCard kind="diamond" color={col.amber} label="?" name="Decision" purpose="A Yes / No question" example="marks >= 80 ?" />
          </Step>
          <Step duration={240}>
            <SymbolCard kind="arrow" color={col.arrow} name="Flow line" purpose="Shows the direction of flow" example="→  next step" />
          </Step>
        </Steps>
      </div>
    </Body>
  </Frame>
);

/* ---------- 06 Three structures ---------- */

const Structure = ({
  glyph,
  color,
  name,
  text,
  pattern,
}: {
  glyph: 'seq' | 'dec' | 'loop';
  color: string;
  name: string;
  text: string;
  pattern: string;
}) => (
  <div className="fc fc-step" style={{ ...card, height: '100%', boxSizing: 'border-box', padding: '48px 44px' }}>
    <div
      style={{
        width: 140,
        height: 140,
        borderRadius: 32,
        background: `${color}1f`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Glyph kind={glyph} color={color} size={92} />
    </div>
    <div style={{ fontSize: 56, fontWeight: 800, color, marginTop: 40, letterSpacing: '-0.02em' }}>{name}</div>
    <div style={{ fontSize: 32, color: col.muted, lineHeight: 1.5, marginTop: 12, minHeight: 96 }}>{text}</div>
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 20,
        whiteSpace: 'nowrap',
        color,
        borderTop: `1px solid ${col.line}`,
        paddingTop: 24,
        marginTop: 32,
      }}
    >
      {pattern}
    </div>
  </div>
);

const Structures: Page = () => (
  <Frame>
    <Body>
      <Header eyebrow="BIG PICTURE" title="Every program uses three structures" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 64 }}>
        <Steps>
          <Step>
            <Structure glyph="seq" color={col.cyan} name="Sequence" text="Steps run one after another, in order." pattern="INPUT → PROCESS → OUTPUT" />
          </Step>
          <Step>
            <Structure glyph="dec" color={col.amber} name="Decision" text="Choose a path with a Yes / No question." pattern="INPUT → CHECK → DECIDE → OUTPUT" />
          </Step>
          <Step>
            <Structure glyph="loop" color={col.violet} name="Loop" text="Repeat steps until a condition is met." pattern="INPUT → CHECK → LOOP → OUTPUT" />
          </Step>
        </Steps>
      </div>
    </Body>
  </Frame>
);

/* ---------- pattern pills (section dividers + top-right of structure pages) ---------- */

const Pill = ({
  children,
  color,
  delay,
  big = false,
}: {
  children: ReactNode;
  color: string;
  delay: number;
  big?: boolean;
}) => (
  <span
    className="fc fc-pop"
    style={{
      ...d(delay),
      fontFamily: font.mono,
      fontSize: big ? 32 : 20,
      fontWeight: 700,
      letterSpacing: big ? '0.04em' : '0.06em',
      color,
      border: `2px solid ${color}`,
      background: `${color}1a`,
      borderRadius: 999,
      padding: big ? '18px 34px' : '8px 18px',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

const FlowArrow = ({ delay, big = false }: { delay: number; big?: boolean }) => (
  <svg
    className="fc fc-fade"
    style={d(delay)}
    width={big ? 64 : 40}
    height={big ? 28 : 20}
    viewBox={big ? '0 0 64 28' : '0 0 40 20'}
  >
    {big ? (
      <>
        <line className="fc-dash" x1="2" y1="14" x2="48" y2="14" stroke={col.arrow} strokeWidth="4" strokeDasharray="10 10" />
        <polygon points="46,4 62,14 46,24" fill={col.arrow} />
      </>
    ) : (
      <>
        <line className="fc-dash" x1="2" y1="10" x2="28" y2="10" stroke={col.arrow} strokeWidth="3" strokeDasharray="6 4" />
        <polygon points="26,3 38,10 26,17" fill={col.arrow} />
      </>
    )}
  </svg>
);

const Pattern = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', top: -6, right: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
    {children}
  </div>
);

/* ---------- section dividers ---------- */

const Meta = ({ label, text, color }: { label: string; text: string; color: string }) => (
  <div>
    <div style={{ fontFamily: font.mono, fontSize: 22, letterSpacing: '0.18em', color }}>{label}</div>
    <div style={{ fontSize: 34, marginTop: 10 }}>{text}</div>
  </div>
);

const Divider = ({
  n,
  name,
  color,
  glyph,
  tagline,
  everyday,
  next,
  children,
}: {
  n: string;
  name: string;
  color: string;
  glyph: 'seq' | 'dec' | 'loop';
  tagline: string;
  everyday: string;
  next: string;
  children: ReactNode;
}) => (
  <Frame>
    <div style={{ position: 'absolute', right: 40, top: 60, opacity: 0.07 }}>
      <div className="fc fc-float">
        <Glyph kind={glyph} color={color} size={760} />
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        inset: '0 120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        className="fc fc-fade"
        style={{ fontFamily: font.mono, fontSize: 28, letterSpacing: '0.24em', color, fontWeight: 700 }}
      >
        STRUCTURE {n} / 03
      </div>
      <h2
        className="fc fc-rise"
        style={{
          ...d(0.1),
          fontFamily: font.display,
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.05,
          margin: '20px 0 24px',
          color,
        }}
      >
        {name}
      </h2>
      <p className="fc fc-rise" style={{ ...d(0.2), fontSize: 42, color: col.muted, margin: 0 }}>
        {tagline}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 72 }}>{children}</div>
      <div className="fc fc-rise" style={{ ...d(1.4), display: 'flex', gap: 96, marginTop: 72 }}>
        <Meta label="EVERYDAY EXAMPLE" text={everyday} color={color} />
        <Meta label="UP NEXT" text={next} color={col.muted} />
      </div>
    </div>
  </Frame>
);

const SequenceDivider: Page = () => (
  <Divider n="01" name="Sequence" color={col.cyan} glyph="seq" tagline="Do this, then this, then this."
    everyday="A recipe — follow each step in order"
    next="Add two numbers"
  >
    <Pill big color={col.violet} delay={0.4}>INPUT</Pill>
    <FlowArrow big delay={0.55} />
    <Pill big color={col.cyan} delay={0.7}>PROCESS</Pill>
    <FlowArrow big delay={0.85} />
    <Pill big color={col.violet} delay={1.0}>OUTPUT</Pill>
  </Divider>
);

const DecisionDivider: Page = () => (
  <Divider n="02" name="Decision" color={col.amber} glyph="dec" tagline="Ask a question — the answer picks the path."
    everyday="Raining? Yes → umbrella, No → sunglasses"
    next="Even or odd · Grades"
  >
    <Pill big color={col.violet} delay={0.4}>INPUT</Pill>
    <FlowArrow big delay={0.55} />
    <Pill big color={col.amber} delay={0.7}>CHECK</Pill>
    <FlowArrow big delay={0.85} />
    <Pill big color={col.amber} delay={1.0}>DECIDE</Pill>
    <FlowArrow big delay={1.15} />
    <Pill big color={col.violet} delay={1.3}>OUTPUT</Pill>
  </Divider>
);

const LoopDivider: Page = () => (
  <Divider n="03" name="Loop" color={col.violet} glyph="loop" tagline="Repeat the steps until the check is complete."
    everyday="Running laps until you reach 5"
    next="Print 1 to 5 · Read until 0"
  >
    <Pill big color={col.violet} delay={0.4}>INPUT</Pill>
    <FlowArrow big delay={0.55} />
    <Pill big color={col.amber} delay={0.7}>CHECK</Pill>
    <FlowArrow big delay={0.85} />
    <Pill big color={col.cyan} delay={1.0}>LOOP</Pill>
    <FlowArrow big delay={1.15} />
    <Pill big color={col.amber} delay={1.3}>UNTIL DONE</Pill>
    <FlowArrow big delay={1.45} />
    <Pill big color={col.violet} delay={1.6}>OUTPUT</Pill>
  </Divider>
);
/* ---------- 08 Sequence example ---------- */

const PanelTitle = ({ children, color = col.muted }: { children: ReactNode; color?: string }) => (
  <div
    className="fc fc-fade"
    style={{ ...d(0.4), fontFamily: font.mono, fontSize: 22, letterSpacing: '0.18em', color, marginBottom: 28 }}
  >
    {children}
  </div>
);

const VarBox = ({ name, value, color }: { name: string; value: string; color: string }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: font.mono, fontSize: 24, color: col.muted, marginBottom: 10 }}>{name}</div>
    <div
      style={{
        width: 200,
        height: 116,
        borderRadius: 18,
        border: `3px solid ${color}`,
        background: `${color}14`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: font.mono,
        fontSize: 60,
        fontWeight: 700,
        color,
      }}
    >
      {value}
    </div>
  </div>
);

const Screen = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      background: '#03080f',
      border: `1px solid ${col.line}`,
      borderRadius: 18,
      padding: '28px 36px',
      fontFamily: font.mono,
      fontSize: 40,
      color: col.green,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
    }}
  >
    <span style={{ fontSize: 22, color: col.dim, letterSpacing: '0.16em' }}>SCREEN</span>
    <span>&gt; {children}</span>
    <span className="fc fc-caret" style={{ width: 20, height: 44, background: col.green }} />
  </div>
);

const SequenceExample: Page = () => (
  <Frame>
    <Body>
      <Pattern>
        <Pill color={col.violet} delay={0.3}>INPUT</Pill>
        <FlowArrow delay={0.4} />
        <Pill color={col.cyan} delay={0.5}>PROCESS</Pill>
        <FlowArrow delay={0.6} />
        <Pill color={col.violet} delay={0.7}>OUTPUT</Pill>
      </Pattern>
      <Header eyebrow="SEQUENCE · EXAMPLE" title="Add two numbers and output the sum" color={col.cyan} />
      <div style={{ display: 'grid', gridTemplateColumns: '900px 1fr', gap: 80, marginTop: 64, alignItems: 'start' }}>
        <CodePanel>
          <Ln n={1} code="INPUT num1, num2" tag="para" />
          <Ln n={2} code="Sum = num1 + num2" tag="rect" delay={0.12} />
          <Ln n={3} code="OUTPUT Sum" tag="para" delay={0.24} />
        </CodePanel>
        <div>
          <PanelTitle>DRY RUN · num1 = 4, num2 = 7</PanelTitle>
          <Steps>
            <Step>
              <div className="fc fc-step" style={{ display: 'flex', gap: 28 }}>
                <VarBox name="num1" value="4" color={col.violet} />
                <VarBox name="num2" value="7" color={col.violet} />
              </div>
            </Step>
            <Step>
              <div className="fc fc-step" style={{ display: 'flex', gap: 28, alignItems: 'flex-end', marginTop: 32 }}>
                <VarBox name="Sum" value="11" color={col.cyan} />
                <span style={{ fontFamily: font.mono, fontSize: 30, color: col.muted, paddingBottom: 40 }}>← 4 + 7</span>
              </div>
            </Step>
            <Step>
              <div className="fc fc-step" style={{ marginTop: 40 }}>
                <Screen>11</Screen>
              </div>
            </Step>
          </Steps>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- 10 Decision example ---------- */

const Case = ({ input, check, verdict, result, color }: { input: string; check: string; verdict: string; result: string; color: string }) => (
  <div
    className="fc fc-step"
    style={{ ...card, display: 'flex', alignItems: 'center', gap: 28, padding: '28px 36px', marginTop: 28 }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 30, color: col.violet, width: 150 }}>{input}</span>
    <span style={{ fontFamily: font.mono, fontSize: 28, flex: 1, whiteSpace: 'nowrap' }}>
      {check} <span style={{ color: col.amber, fontWeight: 700 }}>{verdict}</span>
    </span>
    <span
      style={{
        fontFamily: font.mono,
        fontSize: 32,
        fontWeight: 700,
        color,
        border: `2px solid ${color}`,
        background: `${color}1a`,
        borderRadius: 999,
        padding: '8px 26px',
      }}
    >
      {result}
    </span>
  </div>
);

const DecisionExample: Page = () => (
  <Frame>
    <Body>
      <Pattern>
        <Pill color={col.violet} delay={0.3}>INPUT</Pill>
        <FlowArrow delay={0.4} />
        <Pill color={col.amber} delay={0.5}>CHECK</Pill>
        <FlowArrow delay={0.6} />
        <Pill color={col.amber} delay={0.7}>DECIDE</Pill>
        <FlowArrow delay={0.8} />
        <Pill color={col.violet} delay={0.9}>OUTPUT</Pill>
      </Pattern>
      <Header eyebrow="DECISION · EXAMPLE" title="Is the number even or odd?" />
      <div style={{ display: 'grid', gridTemplateColumns: '820px 1fr', gap: 72, marginTop: 64, alignItems: 'start' }}>
        <CodePanel>
          <Ln n={1} code="INPUT num" tag="para" />
          <Ln n={2} code="IF num MOD 2 = 0 THEN" tag="diamond" delay={0.1} />
          <Ln n={3} code={'OUTPUT "even"'} indent={1} tag="para" delay={0.2} />
          <Ln n={4} code="ELSE" delay={0.3} />
          <Ln n={5} code={'OUTPUT "odd"'} indent={1} tag="para" delay={0.4} />
          <Ln n={6} code="ENDIF" delay={0.5} />
        </CodePanel>
        <div>
          <PanelTitle color={col.amber}>MOD = REMAINDER AFTER DIVIDING</PanelTitle>
          <div
            className="fc fc-rise"
            style={{ ...d(0.5), fontFamily: font.mono, fontSize: 34, color: col.muted, lineHeight: 1.6 }}
          >
            7 ÷ 2 = 3 <span style={{ color: col.dim }}>remainder</span>{' '}
            <span style={{ color: col.green, fontWeight: 700 }}>1</span>
            <br />
            so <span style={{ color: 'var(--osd-text)' }}>7 MOD 2 = 1</span>
          </div>
          <Steps>
            <Step>
              <Case input="num = 8" check="8 MOD 2 = 0 →" verdict="Yes" result='"even"' color={col.green} />
            </Step>
            <Step>
              <Case input="num = 7" check="7 MOD 2 = 1 →" verdict="No" result='"odd"' color={col.coral} />
            </Step>
          </Steps>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- 11 Nested decisions ---------- */

const Band = ({ grade, range, flex, color }: { grade: string; range: string; flex: number; color: string }) => (
  <div style={{ flex, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={{
        width: '100%',
        height: 88,
        background: `${color}2e`,
        borderTop: `4px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 44,
        fontWeight: 800,
        color,
      }}
    >
      {grade}
    </div>
    <div style={{ fontFamily: font.mono, fontSize: 20, color: col.muted, marginTop: 12 }}>{range}</div>
  </div>
);

const Trace = ({ marks, path, grade, color }: { marks: string; path: string; grade: string; color: string }) => (
  <div className="fc fc-step" style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 22 }}>
    <span style={{ fontFamily: font.mono, fontSize: 28, color: col.violet, width: 110 }}>{marks}</span>
    <span style={{ fontFamily: font.mono, fontSize: 26, color: col.muted, flex: 1 }}>{path}</span>
    <span
      style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: `${color}26`,
        border: `2px solid ${color}`,
        color,
        fontSize: 34,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {grade}
    </span>
  </div>
);

const NestedDecision: Page = () => (
  <Frame>
    <Body>
      <Pattern>
        <Pill color={col.violet} delay={0.3}>INPUT</Pill>
        <FlowArrow delay={0.4} />
        <Pill color={col.amber} delay={0.5}>CHECK</Pill>
        <FlowArrow delay={0.6} />
        <Pill color={col.amber} delay={0.7}>DECIDE</Pill>
        <FlowArrow delay={0.8} />
        <Pill color={col.violet} delay={0.9}>OUTPUT</Pill>
      </Pattern>
      <Header eyebrow="DECISION · NESTED" title="Many decisions in one program: grades" />
      <div style={{ display: 'grid', gridTemplateColumns: '760px 1fr', gap: 72, marginTop: 48, alignItems: 'start' }}>
        <CodePanel size={29}>
          <Ln n={1} code="INPUT marks" />
          <Ln n={2} code="IF marks >= 80 THEN" delay={0.06} />
          <Ln n={3} code={'OUTPUT "A"'} indent={1} delay={0.12} />
          <Ln n={4} code="ELSE IF marks >= 70 THEN" delay={0.18} />
          <Ln n={5} code={'OUTPUT "B"'} indent={1} delay={0.24} />
          <Ln n={6} code="ELSE IF marks >= 60 THEN" delay={0.3} />
          <Ln n={7} code={'OUTPUT "C"'} indent={1} delay={0.36} />
          <Ln n={8} code="ELSE" delay={0.42} />
          <Ln n={9} code={'OUTPUT "F"'} indent={1} delay={0.48} />
          <Ln n={10} code="ENDIF" delay={0.54} />
        </CodePanel>
        <div>
          <PanelTitle>MARK BANDS</PanelTitle>
          <div className="fc fc-rise" style={{ ...d(0.5), position: 'relative' }}>
            <div style={{ display: 'flex', borderRadius: 14, overflow: 'hidden' }}>
              <Band grade="F" range="0–59" flex={59} color={col.coral} />
              <Band grade="C" range="60+" flex={10} color={col.violet} />
              <Band grade="B" range="70+" flex={10} color={col.cyan} />
              <Band grade="A" range="80+" flex={21} color={col.green} />
            </div>
            <div
              className="fc fc-slide"
              style={{ ...d(0.9), position: 'absolute', left: '74%', top: -46, transform: 'translateX(-50%)' }}
            >
              <div style={{ fontFamily: font.mono, fontSize: 22, color: 'var(--osd-text)', textAlign: 'center' }}>74</div>
              <svg width="28" height="18" viewBox="0 0 28 18" style={{ display: 'block' }}>
                <polygon points="0,0 28,0 14,18" fill="var(--osd-text)" />
              </svg>
            </div>
          </div>
          <div style={{ marginTop: 36 }}>
            <Steps>
              <Step>
                <Trace marks="85" path=">= 80? Yes" grade="A" color={col.green} />
              </Step>
              <Step>
                <Trace marks="74" path=">= 80? No → >= 70? Yes" grade="B" color={col.cyan} />
              </Step>
              <Step>
                <Trace marks="42" path="No → No → No" grade="F" color={col.coral} />
              </Step>
              <Step>
                <div
                  className="fc fc-step"
                  style={{
                    marginTop: 32,
                    fontSize: 30,
                    fontWeight: 700,
                    color: col.amber,
                    background: `${col.amber}14`,
                    borderRadius: 16,
                    padding: '18px 28px',
                  }}
                >
                  Order matters — check the highest band first.
                </div>
              </Step>
            </Steps>
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);

/* ---------- loops ---------- */

const Tile = ({
  v,
  color,
  delay,
  sub,
}: {
  v: string;
  color: string;
  delay: number;
  sub?: string;
}) => (
  <div style={{ textAlign: 'center' }}>
    <div
      className="fc fc-pop"
      style={{
        ...d(delay),
        width: 112,
        height: 112,
        borderRadius: 22,
        border: `3px solid ${color}`,
        background: `${color}1c`,
        color,
        fontFamily: font.mono,
        fontSize: 52,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {v}
    </div>
    {sub && (
      <div className="fc fc-fade" style={{ ...d(delay + 0.15), fontFamily: font.mono, fontSize: 20, color, marginTop: 12 }}>
        {sub}
      </div>
    )}
  </div>
);

const Fact = ({ children, color }: { children: ReactNode; color: string }) => (
  <div className="fc fc-step" style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 32, marginTop: 20 }}>
    <span style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
    {children}
  </div>
);

const LoopPattern = () => (
  <Pattern>
    <Pill color={col.violet} delay={0.3}>INPUT</Pill>
    <FlowArrow delay={0.4} />
    <Pill color={col.amber} delay={0.5}>CHECK</Pill>
    <FlowArrow delay={0.6} />
    <Pill color={col.cyan} delay={0.7}>LOOP</Pill>
    <FlowArrow delay={0.8} />
    <Pill color={col.amber} delay={0.9}>UNTIL DONE</Pill>
    <FlowArrow delay={1.0} />
    <Pill color={col.violet} delay={1.1}>OUTPUT</Pill>
  </Pattern>
);

const ForLoop: Page = () => (
  <Frame>
    <Body>
      <LoopPattern />
      <Header eyebrow="LOOP · COUNT-CONTROLLED" title="Print the numbers 1 to 5" color={col.violet} />
      <div style={{ display: 'grid', gridTemplateColumns: '820px 1fr', gap: 72, marginTop: 64, alignItems: 'start' }}>
        <div>
          <CodePanel>
            <Ln n={1} code="FOR count = 1 TO 5" tag="diamond" />
            <Ln n={2} code="OUTPUT count" indent={1} tag="para" delay={0.12} />
            <Ln n={3} code="NEXT count" tag="arrow" delay={0.24} />
          </CodePanel>
          <div style={{ marginTop: 28 }}>
            <Steps>
              <Step>
                <Fact color={col.green}>count starts at 1</Fact>
              </Step>
              <Step>
                <Fact color={col.cyan}>
                  <span>
                    <b style={{ fontFamily: font.mono, color: col.amber }}>NEXT</b> adds 1 and jumps back
                  </span>
                </Fact>
              </Step>
              <Step>
                <Fact color={col.coral}>stops after 5 — we know how many times</Fact>
              </Step>
            </Steps>
          </div>
        </div>
        <div>
          <PanelTitle>OUTPUT</PanelTitle>
          <div style={{ display: 'flex', gap: 22 }}>
            <Tile v="1" color={col.cyan} delay={0.7} sub="pass 1" />
            <Tile v="2" color={col.cyan} delay={1.0} sub="pass 2" />
            <Tile v="3" color={col.cyan} delay={1.3} sub="pass 3" />
            <Tile v="4" color={col.cyan} delay={1.6} sub="pass 4" />
            <Tile v="5" color={col.cyan} delay={1.9} sub="pass 5" />
          </div>
          <div
            className="fc fc-rise"
            style={{ ...d(2.3), ...card, marginTop: 56, padding: '28px 36px', fontSize: 30, lineHeight: 1.5, color: col.muted }}
          >
            The loop body runs <b style={{ color: 'var(--osd-text)' }}>5 times</b>. When count would become 6, the
            loop ends.
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);

const RepeatLoop: Page = () => (
  <Frame>
    <Body>
      <LoopPattern />
      <Header eyebrow="LOOP · CONDITION-CONTROLLED" title="Keep taking entries until 0 is entered" color={col.violet} />
      <div style={{ display: 'grid', gridTemplateColumns: '820px 1fr', gap: 72, marginTop: 64, alignItems: 'start' }}>
        <div>
          <CodePanel>
            <Ln n={1} code="REPEAT" />
            <Ln n={2} code="INPUT num" indent={1} tag="para" delay={0.12} />
            <Ln n={3} code="UNTIL num = 0" tag="diamond" delay={0.24} />
          </CodePanel>
          <div style={{ marginTop: 28 }}>
            <Steps>
              <Step>
                <Fact color={col.green}>the body always runs at least once</Fact>
              </Step>
              <Step>
                <Fact color={col.amber}>the check happens at the end</Fact>
              </Step>
              <Step>
                <Fact color={col.coral}>we don't know how many times in advance</Fact>
              </Step>
            </Steps>
          </div>
        </div>
        <div>
          <PanelTitle>USER TYPES…</PanelTitle>
          <div style={{ display: 'flex', gap: 22 }}>
            <Tile v="12" color={col.violet} delay={0.7} sub="repeat" />
            <Tile v="5" color={col.violet} delay={1.0} sub="repeat" />
            <Tile v="9" color={col.violet} delay={1.3} sub="repeat" />
            <Tile v="3" color={col.violet} delay={1.6} sub="repeat" />
            <Tile v="0" color={col.coral} delay={1.9} sub="STOP" />
          </div>
          <div
            className="fc fc-rise"
            style={{ ...d(2.3), ...card, marginTop: 56, padding: '28px 36px', fontSize: 30, lineHeight: 1.5, color: col.muted }}
          >
            <b style={{ color: 'var(--osd-text)', fontFamily: font.mono }}>FOR</b> = fixed number of times.
            <br />
            <b style={{ color: 'var(--osd-text)', fontFamily: font.mono }}>REPEAT … UNTIL</b> = until a condition is true.
          </div>
        </div>
      </div>
    </Body>
  </Frame>
);
/* ---------- 15 Flowchart ⇄ Pseudocode ---------- */

const MapRow = ({ kind, color, name, code, note }: { kind: Kind; color: string; name: string; code: string; note: string }) => (
  <div
    className="fc fc-step"
    style={{
      ...card,
      display: 'grid',
      gridTemplateColumns: '220px 380px 1fr',
      alignItems: 'center',
      padding: '14px 40px',
      marginTop: 16,
    }}
  >
    <Sym kind={kind} color={color} w={140} />
    <span style={{ fontSize: 34, fontWeight: 800, color }}>{name}</span>
    <span style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
      <span style={{ fontFamily: font.mono, fontSize: 30 }}>{hl(code)}</span>
      <span style={{ fontSize: 24, color: col.muted }}>{note}</span>
    </span>
  </div>
);

const Translate: Page = () => (
  <Frame>
    <Body>
      <Header eyebrow="CONVERTING" title="Flowchart ⇄ pseudocode: same logic, two forms" />
      <div
        className="fc fc-fade"
        style={{
          ...d(0.3),
          display: 'grid',
          gridTemplateColumns: '220px 380px 1fr',
          padding: '0 40px',
          marginTop: 40,
          fontFamily: font.mono,
          fontSize: 20,
          letterSpacing: '0.18em',
          color: col.dim,
        }}
      >
        <span>SYMBOL</span>
        <span>MEANING</span>
        <span>PSEUDOCODE</span>
      </div>
      <Steps>
        <Step>
          <MapRow kind="oval" color={col.green} name="Start / End" code="START … END" note="first and last step" />
        </Step>
        <Step>
          <MapRow kind="para" color={col.violet} name="Input / Output" code="INPUT x · OUTPUT x" note="data in / out" />
        </Step>
        <Step>
          <MapRow kind="rect" color={col.cyan} name="Process" code="Sum = a + b" note="calculations" />
        </Step>
        <Step>
          <MapRow kind="diamond" color={col.amber} name="Decision" code="IF … THEN · UNTIL …" note="Yes / No checks" />
        </Step>
        <Step>
          <MapRow kind="arrow" color={col.arrow} name="Flow line" code="line order" note="loops jump back up" />
        </Step>
      </Steps>
    </Body>
  </Frame>
);

/* ---------- 16 Ending ---------- */

const Done = ({ text, delay }: { text: string; delay: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 30, marginTop: 18 }}>
    <svg width="36" height="36" viewBox="0 0 36 36">
      <rect x="2" y="2" width="32" height="32" rx="8" fill={`${col.green}22`} stroke={col.green} strokeWidth="3" />
      <path
        className="fc fc-tick"
        style={d(delay)}
        d="M9 19 L15 25 L27 11"
        pathLength={1}
        fill="none"
        stroke={col.green}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {text}
  </div>
);

const Ending: Page = () => (
  <Frame footer={false}>
    <Floating x={1440} y={70} rot={-5} delay={0.2}>
      <Sym kind="oval" color={col.green} w={260} label="END" labelSize={26} />
    </Floating>
    <div
      style={{
        position: 'absolute',
        inset: '0 120px',
        display: 'grid',
        gridTemplateColumns: '1fr 700px',
        gap: 80,
        alignItems: 'center',
      }}
    >
      <div>
        <div
          className="fc fc-fade"
          style={{ fontFamily: font.mono, fontSize: 26, letterSpacing: '0.22em', color: col.amber, fontWeight: 600 }}
        >
          THAT'S A WRAP
        </div>
        <h2
          className="fc fc-rise"
          style={{
            ...d(0.1),
            fontFamily: font.display,
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            margin: '24px 0 36px',
          }}
        >
          Thank you
        </h2>
        <div className="fc fc-rise" style={{ ...d(0.25), display: 'flex', gap: 28, alignItems: 'center' }}>
          <Glyph kind="seq" color={col.cyan} size={72} />
          <Glyph kind="dec" color={col.amber} size={72} />
          <Glyph kind="loop" color={col.violet} size={72} />
        </div>
        <p className="fc fc-rise" style={{ ...d(0.35), fontSize: 38, color: col.muted, lineHeight: 1.5, marginTop: 36 }}>
          Plan the logic first.
          <br />
          <span style={{ color: 'var(--osd-text)' }}>Write the code second.</span>
        </p>
      </div>
      <div className="fc fc-rise" style={{ ...d(0.3), ...card, padding: '40px 48px 48px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, letterSpacing: '0.18em', color: col.muted }}>
          TODAY YOU LEARNED TO
        </div>
        <Done delay={0.7} text="Define a flowchart" />
        <Done delay={0.9} text="Explain why we plan first" />
        <Done delay={1.1} text="Identify the five symbols" />
        <Done delay={1.3} text="Use Sequence, Decision, Loop" />
        <Done delay={1.5} text="Create a simple flowchart" />
        <Done delay={1.7} text="Convert to and from pseudocode" />
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

const bloom: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'scale(0.975)' },
      { opacity: 1, transform: 'scale(1)' },
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
Ending.transition = settle;
SequenceDivider.transition = bloom;
DecisionDivider.transition = bloom;
LoopDivider.transition = bloom;

export const meta: SlideMeta = {
  title: 'Flowcharts',
  createdAt: '2026-10-06T10:31:40.283Z',
};

export default [
  Cover,
  Objectives,
  WhatIs,
  Why,
  Symbols,
  Structures,
  SequenceDivider,
  SequenceExample,
  DecisionDivider,
  DecisionExample,
  NestedDecision,
  LoopDivider,
  ForLoop,
  RepeatLoop,
  Translate,
  Ending,
] satisfies Page[];

export const notes: (string | undefined)[] = [
  `Welcome. Today: how programmers plan a program before writing any code.`,
  `Six objectives — press → to reveal each one.
We'll tick them off together on the last slide.`,
  `Definition first. Stress the four words: diagram, steps, symbols, arrows.
An algorithm is the solution; the flowchart is its picture.`,
  `Reveal each reason in turn, then the blueprint line.`,
  `Reveal one symbol at a time. For each: its name, its job, and the example underneath.`,
  `The three structures. Every program — however big — is built from just these.
Reveal one at a time; we'll take each in turn next.`,
  `Section 1: Sequence. Steps run in order, no choices, no repeats.`,
  `Draw this flowchart on the board: Start → Input num1, num2 → Sum = num1 + num2 → Output Sum → End.
Point out the symbol tag next to each pseudocode line, then step through the dry run.`,
  `Section 2: Decision. A Yes/No question decides which path runs.`,
  `Explain MOD first. Draw the flowchart with a diamond "num MOD 2 = 0?" — Yes → Output "even", No → Output "odd".
Then reveal the two test cases.`,
  `Decisions can be nested. Draw the chain of diamonds on the board (>= 80, >= 70, >= 60, else F).
Trace 85, 74 and 42, then reveal why the order of the checks matters.`,
  `Section 3: Loop. Repeat steps until the check is complete.`,
  `FOR loop — count-controlled. Draw the flowchart with the loop arrow going back up to the check.
Note: FOR sets count itself, so a separate count = 0 line isn't needed.`,
  `REPEAT … UNTIL — condition-controlled. Draw it: Input num → diamond "num = 0?" — No loops back, Yes → End.
Contrast with FOR: fixed count vs. stop on a condition.`,
  `Converting both ways: each symbol maps to a pseudocode keyword. Reveal one row at a time.`,
  `Close: recap the three structures and the six objectives as the ticks animate in.`,
];
