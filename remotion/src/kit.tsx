import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "./theme";

/* ---------------- Background ---------------- */
export const Bg: React.FC<{ children?: React.ReactNode; tint?: string }> = ({
  children,
  tint,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: tint ?? theme.bg,
      backgroundImage: `radial-gradient(1100px 600px at 80% -10%, ${theme.softPink}, transparent 60%)`,
      fontFamily: theme.sans,
      color: theme.ink,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ---------------- Spring pop helper ---------------- */
export const Pop: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, y = 24, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [y, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------------- Title / outro card ---------------- */
export const TitleCard: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  step?: string;
}> = ({ eyebrow, title, subtitle, step }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
    {step && (
      <Pop>
        <div
          style={{
            fontFamily: theme.sans,
            fontSize: 18,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: theme.pink,
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          {step}
        </div>
      </Pop>
    )}
    {eyebrow && (
      <Pop delay={4}>
        <div
          style={{
            fontFamily: theme.sans,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: theme.muted,
            marginBottom: 20,
          }}
        >
          {eyebrow}
        </div>
      </Pop>
    )}
    <Pop delay={8}>
      <div
        style={{
          fontFamily: theme.serif,
          fontSize: 78,
          lineHeight: 1.05,
          textAlign: "center",
          color: theme.ink,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
    </Pop>
    {subtitle && (
      <Pop delay={14}>
        <div
          style={{
            fontFamily: theme.sans,
            fontSize: 28,
            color: theme.muted,
            textAlign: "center",
            marginTop: 26,
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </Pop>
    )}
  </AbsoluteFill>
);

/* ---------------- Mock browser window ---------------- */
export const BrowserFrame: React.FC<{
  url?: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ url = "lecombatdalya.fr/studio", children, delay = 0 }) => (
  <Pop delay={delay} y={36} style={{ width: 1080, margin: "0 auto" }}>
    <div
      style={{
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 40px 90px -30px rgba(120,10,55,0.45)",
        border: `1px solid ${theme.line}`,
        background: theme.white,
      }}
    >
      <div
        style={{
          height: 52,
          background: "#fff",
          borderBottom: `1px solid ${theme.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 8,
        }}
      >
        {["#ff6058", "#ffbd2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 16,
            flex: 1,
            height: 30,
            borderRadius: 99,
            background: theme.bg,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            color: theme.muted,
            fontSize: 16,
            fontFamily: theme.sans,
          }}
        >
          🔒 {url}
        </div>
      </div>
      <div style={{ height: 560, position: "relative", background: "#fff" }}>{children}</div>
    </div>
  </Pop>
);

/* ---------------- Mock Sanity Studio shell ---------------- */
const NAV = ["Accueil", "Notre histoire", "Missions", "Comment aider", "Contact", "Articles", "Campagnes"];
export const StudioShell: React.FC<{
  active?: string;
  title?: string;
  children?: React.ReactNode;
}> = ({ active = "Accueil", title, children }) => (
  <div style={{ display: "flex", height: "100%", fontFamily: theme.sans }}>
    <div style={{ width: 250, borderRight: `1px solid ${theme.line}`, padding: "18px 0", background: "#fff" }}>
      <div style={{ padding: "0 20px 14px", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: theme.muted, fontWeight: 700 }}>
        Le Combat d&apos;Alya
      </div>
      {NAV.map((item) => {
        const on = item === active;
        return (
          <div
            key={item}
            style={{
              padding: "11px 20px",
              fontSize: 17,
              color: on ? theme.pink : theme.ink,
              background: on ? theme.softPink : "transparent",
              fontWeight: on ? 700 : 500,
              borderLeft: on ? `3px solid ${theme.pink}` : "3px solid transparent",
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
    <div style={{ flex: 1, padding: 30, position: "relative", overflow: "hidden" }}>
      {title && (
        <div style={{ fontFamily: theme.serif, fontSize: 30, marginBottom: 22, color: theme.ink }}>{title}</div>
      )}
      {children}
    </div>
  </div>
);

/* ---------------- Editable field mock ---------------- */
export const Field: React.FC<{
  label: string;
  value?: string;
  typed?: number; // 0..1 reveal
  highlight?: boolean;
  area?: boolean;
  caret?: boolean;
}> = ({ label, value = "", typed = 1, highlight, area, caret }) => {
  const shown = value.slice(0, Math.max(0, Math.floor(value.length * typed)));
  const frame = useCurrentFrame();
  const blink = caret && Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 15, color: theme.muted, marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div
        style={{
          minHeight: area ? 96 : 50,
          border: `2px solid ${highlight ? theme.pink : theme.line}`,
          borderRadius: 12,
          padding: "13px 16px",
          fontSize: 19,
          color: theme.ink,
          background: highlight ? "#fff" : "#fdfafb",
          boxShadow: highlight ? `0 0 0 4px ${theme.softPink}` : "none",
        }}
      >
        {shown}
        {blink && <span style={{ color: theme.pink }}>|</span>}
      </div>
    </div>
  );
};

/* ---------------- Self-animating typing field ---------------- */
export const TypingField: React.FC<{
  label: string;
  value: string;
  start?: number;
  dur?: number;
  highlight?: boolean;
  area?: boolean;
}> = ({ label, value, start = 0, dur = 40, highlight, area }) => {
  const frame = useCurrentFrame();
  const typed = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const caret = frame >= start && frame <= start + dur + 12;
  return <Field label={label} value={value} typed={typed} highlight={highlight} area={area} caret={caret} />;
};

/* ---------------- Publish button ---------------- */
export const PublishButton: React.FC<{ state?: "idle" | "publishing" | "done"; pulse?: boolean }> = ({
  state = "idle",
  pulse,
}) => {
  const frame = useCurrentFrame();
  const p = pulse ? 1 + 0.04 * Math.sin(frame / 4) : 1;
  const label = state === "done" ? "✓ Publié" : state === "publishing" ? "Publication…" : "Publier";
  const bg = state === "done" ? theme.ok : theme.pink;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: bg,
        color: "#fff",
        fontSize: 19,
        fontWeight: 700,
        padding: "13px 26px",
        borderRadius: 99,
        transform: `scale(${p})`,
        boxShadow: `0 14px 30px -10px ${bg}`,
      }}
    >
      {label}
    </div>
  );
};

/* ---------------- Timed publish button (top-right of pane) ---------------- */
export const TimedPublish: React.FC<{ publishAt: number; doneAt: number }> = ({ publishAt, doneAt }) => {
  const frame = useCurrentFrame();
  const state = frame >= doneAt ? "done" : frame >= publishAt ? "publishing" : "idle";
  return (
    <div style={{ position: "absolute", top: 26, right: 26 }}>
      <PublishButton state={state} pulse={state === "idle"} />
    </div>
  );
};

/* ---------------- Animated cursor ---------------- */
export const Cursor: React.FC<{
  from: [number, number];
  to: [number, number];
  moveStart?: number;
  moveDur?: number;
  clickAt?: number;
}> = ({ from, to, moveStart = 0, moveDur = 20, clickAt }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [moveStart, moveStart + moveDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ease = t * t * (3 - 2 * t);
  const x = interpolate(ease, [0, 1], [from[0], to[0]]);
  const y = interpolate(ease, [0, 1], [from[1], to[1]]);
  const click = clickAt != null && frame >= clickAt && frame < clickAt + 12;
  const ring = click ? interpolate(frame, [clickAt!, clickAt! + 12], [0, 1]) : 0;
  return (
    <>
      {click && (
        <div
          style={{
            position: "absolute",
            left: x - 26,
            top: y - 26,
            width: 52,
            height: 52,
            borderRadius: 99,
            border: `3px solid ${theme.pink}`,
            opacity: 1 - ring,
            transform: `scale(${0.4 + ring})`,
          }}
        />
      )}
      <div style={{ position: "absolute", left: x, top: y, zIndex: 50 }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M4 2l6 16 2.5-6.5L19 9 4 2z" fill="#fff" stroke={theme.ink} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
};

/* ---------------- Pulsing highlight box ---------------- */
export const Highlight: React.FC<{ x: number; y: number; w: number; h: number; delay?: number }> = ({
  x,
  y,
  w,
  h,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(Math.sin((frame - delay) / 6), [-1, 1], [0.35, 0.9]);
  if (frame < delay) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 12,
        border: `3px solid ${theme.pink}`,
        boxShadow: `0 0 0 4px rgba(194,10,82,${p * 0.25})`,
        opacity: p,
      }}
    />
  );
};

/* ---------------- Bottom step caption ---------------- */
export const StepChip: React.FC<{ n?: number; total?: number; text: string; delay?: number }> = ({
  n,
  total,
  text,
  delay = 0,
}) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center" }}>
    <Pop delay={delay} y={20}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: theme.ink,
          color: "#fff",
          borderRadius: 99,
          padding: "16px 28px",
          fontFamily: theme.sans,
          fontSize: 26,
          maxWidth: 1040,
          boxShadow: "0 20px 50px -20px rgba(0,0,0,0.5)",
        }}
      >
        {n != null && (
          <span
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: 99,
              background: theme.pink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            {n}
          </span>
        )}
        <span>
          {text}
          {total != null && n != null && (
            <span style={{ color: theme.softPink, marginLeft: 10, fontSize: 18 }}>
              {n}/{total}
            </span>
          )}
        </span>
      </div>
    </Pop>
  </div>
);
