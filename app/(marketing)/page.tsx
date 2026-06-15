import Link from "next/link";
import { Features } from "./_components/features";
import { Marquee } from "./_components/marquee";

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

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    body: "For trying things out and solo boards.",
    features: ["1 workspace", "Up to 3 boards", "AI extraction — 20 runs/mo", "Community support"],
    cta: "Start for free",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    body: "For teams that live in their boards.",
    features: ["Unlimited boards", "Unlimited AI extraction", "Voice notes & attachments", "Priority support"],
    cta: "Get started",
    href: "/sign-up",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    body: "For organizations with scale & security needs.",
    features: ["SSO & SAML", "Advanced permissions", "Audit logs", "Dedicated success manager"],
    cta: "Contact sales",
    href: "/sign-up",
    highlight: false,
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
      <section id="features" className="relative z-10 px-6 md:px-16 lg:px-24 pb-10 scroll-mt-[52px]">
        {/* Sliding separator strip */}
        <div className="-mx-6 md:-mx-16 lg:-mx-24" style={{ marginTop: "32px", marginBottom: "56px" }}>
          <Marquee
            variant="strip"
            items={[
              "Turn talk into action",
              "Notes in, boards out",
              "AI-powered Kanban",
              "Built for teams",
            ]}
            duration={52}
          />
        </div>
        <div className="max-w-screen-lg mx-auto">
          <h2
            className="font-semibold text-white mb-12"
            style={{ fontSize: "clamp(26px, 3vw, 34px)", letterSpacing: "-0.03em", maxWidth: "520px" }}
          >
            Everything you need to turn talk into action.
          </h2>

          {/* Interactive feature grid — hover lights the tile, fills a green bar, slides in an arrow */}
          <Features />
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section id="pricing" className="relative z-10 px-6 md:px-16 lg:px-24 pb-32 scroll-mt-[52px]">
        {/* Sliding separator (ghost ticker) — tilted on an incline */}
        <div
          className="-mx-6 md:-mx-16 lg:-mx-24 overflow-hidden"
          style={{ marginTop: "12px", marginBottom: "56px", paddingTop: "30px", paddingBottom: "30px" }}
        >
          <div style={{ transform: "rotate(-3deg)", width: "112%", marginLeft: "-6%" }}>
            <Marquee
              items={[
                "Free to start",
                "No credit card",
                "Cancel anytime",
                "Upgrade when ready",
              ]}
              duration={58}
            />
          </div>
        </div>
        <div className="max-w-screen-lg mx-auto">
          <h2
            className="font-semibold text-white mb-12"
            style={{ fontSize: "clamp(26px, 3vw, 34px)", letterSpacing: "-0.03em" }}
          >
            Simple, transparent pricing.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className="flex flex-col p-7 rounded-[10px]"
                style={{
                  background: "#080808",
                  border: p.highlight
                    ? "1px solid rgba(0,229,153,0.35)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: p.highlight ? "0 0 60px rgba(0,229,153,0.06)" : undefined,
                }}
              >
                <p className="font-medium text-white mb-1" style={{ fontSize: "14px", letterSpacing: "-0.02em" }}>
                  {p.name}
                </p>
                <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.32)", lineHeight: 1.6, marginBottom: "20px" }}>
                  {p.body}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-semibold text-white" style={{ fontSize: "30px", letterSpacing: "-0.04em" }}>
                    {p.price}
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>{p.period}</span>
                </div>

                <ul className="flex flex-col gap-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5" style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)" }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#00e599" strokeWidth={2.4} className="shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className="mt-auto inline-flex items-center justify-center rounded-[6px] font-medium transition-colors"
                  style={
                    p.highlight
                      ? { fontSize: "13px", padding: "9px 16px", background: "#00e599", color: "#050505" }
                      : { fontSize: "13px", padding: "9px 16px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }
                  }
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
