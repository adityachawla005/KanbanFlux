import Link from "next/link";

const BARS = [
  16, 26, 14, 38, 20, 50, 16, 34, 24, 46,
  18, 32, 22, 56, 20, 44, 30, 64, 26, 55,
  35, 68, 30, 58, 42, 76, 35, 66, 48, 84,
  42, 74, 55, 88, 50, 80, 65, 94, 60, 100,
  68, 96, 62, 90, 55, 82, 48, 74, 40, 64,
  32, 56, 26, 48, 20, 40, 16, 34, 12, 28,
  20, 38, 14, 30, 18, 40, 12, 26, 16, 34,
  10, 24,
];

function barStyle(i: number, h: number): React.CSSProperties {
  const peak = 39;
  const dist = Math.abs(i - peak);

  if (dist <= 2) {
    const t = 1 - dist * 0.3;
    const g = Math.round(220 + 35 * t);
    return {
      height: `${h}%`,
      background: `rgb(210,${g},215)`,
      boxShadow: [
        `0 0 ${6 + 16 * t}px rgba(180,255,210,${(0.7 * t).toFixed(2)})`,
        `0 0 ${22 + 44 * t}px rgba(0,229,153,${(0.4 * t).toFixed(2)})`,
        `0 0 ${55 + 85 * t}px rgba(0,229,153,${(0.16 * t).toFixed(2)})`,
      ].join(","),
      animation: `coreFloat ${2.2 + dist * 0.3}s ease-in-out infinite`,
      animationDelay: `${dist * 0.12}s`,
      transformOrigin: "bottom",
    };
  }

  if (dist <= 8) {
    const t = 1 - (dist - 2) / 7;
    return {
      height: `${h}%`,
      background: `rgba(0,229,153,${(0.1 + 0.22 * t).toFixed(3)})`,
      boxShadow: `0 0 ${4 + 10 * t}px rgba(0,229,153,${(0.08 * t).toFixed(3)})`,
      animation: `barPulse ${2.6 + (i % 5) * 0.28}s ease-in-out infinite`,
      animationDelay: `${(i * 0.08) % 1.6}s`,
      transformOrigin: "bottom",
    };
  }

  return {
    height: `${h}%`,
    background: `rgba(0,229,153,${(0.03 + Math.abs(Math.sin(i)) * 0.025).toFixed(3)})`,
    animation: `barPulse ${3.0 + (i % 9) * 0.24}s ease-in-out infinite`,
    animationDelay: `${(i * 0.11) % 2.4}s`,
    transformOrigin: "bottom",
  };
}

const FEATURES = [
  {
    icon: (
      <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    label: "AI Extraction",
    body: "Paste meeting notes, Slack threads, or emails. spaCy NLP pulls out every task, owner, and deadline automatically.",
  },
  {
    icon: (
      <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
    label: "Instant Boards",
    body: "Extracted tasks become draggable Kanban cards in one click — sorted by list, assignee, or priority.",
  },
  {
    icon: (
      <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
    label: "Voice & Media",
    body: "Record voice notes or attach files directly to any AI-generated card before it lands on the board.",
  },
];

export default function MarketingPage() {
  return (
    <div className="relative bg-[#080808]">

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="relative min-h-screen overflow-hidden">

        {/* Green radial glow — right side */}
        <div
          className="absolute pointer-events-none"
          aria-hidden
          style={{
            right: "-5%",
            top: "45%",
            transform: "translateY(-50%)",
            width: "72vw",
            height: "85vh",
            background:
              "radial-gradient(ellipse at 58% 50%, rgba(0,229,153,0.11) 0%, rgba(0,229,153,0.04) 38%, transparent 65%)",
          }}
        />

        {/* Bar visualization — right 55% of screen */}
        <div
          className="absolute inset-y-0 right-0 flex items-end pointer-events-none"
          style={{ width: "56%", gap: "2.5px", padding: "0 3px" }}
          aria-hidden
        >
          {BARS.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[1.5px]"
              style={barStyle(i, h)}
            />
          ))}
        </div>

        {/* Scanning beam */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div
            className="absolute inset-y-0"
            style={{
              width: "15%",
              background:
                "linear-gradient(to right, transparent 0%, rgba(0,229,153,0.045) 40%, rgba(0,229,153,0.08) 50%, rgba(0,229,153,0.045) 60%, transparent 100%)",
              animation: "scan 11s cubic-bezier(0.4,0,0.6,1) infinite",
              animationDelay: "1.8s",
            }}
          />
        </div>

        {/* Left content mask — keeps text readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "linear-gradient(92deg, #080808 28%, rgba(8,8,8,0.95) 45%, rgba(8,8,8,0.55) 60%, transparent 76%)",
          }}
        />

        {/* Bottom fog */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          aria-hidden
          style={{
            height: "28%",
            background: "linear-gradient(to top, #080808 15%, transparent)",
          }}
        />

        {/* ── Copy ── */}
        <section className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-16 lg:px-24 pt-16">


          {/* H1 */}
          <h1
            className="font-semibold text-white leading-[1.0]"
            style={{
              fontSize: "clamp(46px, 6.2vw, 80px)",
              letterSpacing: "-0.038em",
              maxWidth: "520px",
              marginBottom: "20px",
            }}
          >
            Turn any text<br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>into a board.</span>
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.36)",
              lineHeight: 1.72,
              maxWidth: "330px",
              marginBottom: "36px",
            }}
          >
            Paste meeting notes, Slack threads, or emails. AI extracts tasks, assignees, and deadlines — cards created in seconds.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-[6px] bg-white text-black font-medium hover:bg-neutral-100 transition-colors"
              style={{ fontSize: "13px", padding: "9px 20px" }}
            >
              Start for free
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 rounded-[6px] font-medium transition-colors hover:border-white/20"
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                padding: "9px 18px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Sign in
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Social proof line */}
          <p
            className="mt-8 font-mono"
            style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}
          >
            Free to start · No credit card required
          </p>
        </section>
      </div>

      {/* ── FEATURES STRIP ───────────────────────────── */}
      <section className="relative z-10 px-6 md:px-16 lg:px-24 pb-28">
        <div
          className="max-w-screen-lg mx-auto"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "64px",
          }}
        >
          {/* Section label */}
          <p
            className="font-mono uppercase tracking-[0.2em] mb-12"
            style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}
          >
            What it does
          </p>

          {/* Cards grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {FEATURES.map((f, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-5 p-8"
                style={{
                  background: "#080808",
                  borderRight: idx < 2 ? "1px solid rgba(255,255,255,0.06)" : undefined,
                  position: "relative",
                }}
              >
                {/* Top accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "32px",
                    width: "32px",
                    height: "1px",
                    background: "rgba(0,229,153,0.45)",
                  }}
                />

                <span style={{ color: "rgba(0,229,153,0.6)", marginTop: "8px" }}>
                  {f.icon}
                </span>
                <div>
                  <p
                    className="font-medium text-white mb-2.5"
                    style={{ fontSize: "13.5px", letterSpacing: "-0.02em" }}
                  >
                    {f.label}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.32)",
                      lineHeight: 1.68,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
