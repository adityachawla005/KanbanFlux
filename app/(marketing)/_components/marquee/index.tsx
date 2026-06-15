// Sliding-text separator between sections. Pure CSS (keyframe `marqueeSlide` in
// globals.css); duplicated track loops seamlessly.
//   variant="ghost" — dim green text on black, bounded by hairlines (default).
//   variant="strip" — solid green band with black text.

export const Marquee = ({
  items,
  duration = 48,
  variant = "ghost",
}: {
  items: string[];
  duration?: number;
  variant?: "ghost" | "strip";
}) => {
  const strip = variant === "strip";

  const wordStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: strip ? 700 : 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    color: strip ? "rgba(5,5,5,0.85)" : "rgba(0,229,153,0.32)",
  };

  const bulletStyle: React.CSSProperties = {
    margin: "0 26px",
    fontSize: "9px",
    color: strip ? "rgba(5,5,5,0.5)" : "rgba(0,229,153,0.6)",
  };

  const containerStyle: React.CSSProperties = strip
    ? {
        paddingTop: "14px",
        paddingBottom: "14px",
        background: "#0c8f5f",
      }
    : {
        paddingTop: "16px",
        paddingBottom: "16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        maskImage:
          "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
      };

  // Repeat the phrase list so a single half always overflows the widest viewport —
  // that's what keeps the -50% loop seamless with no blank gap.
  const REPEATS = 4;
  const Half = () => (
    <div className="flex items-center">
      {Array.from({ length: REPEATS }).flatMap((_, r) =>
        items.map((t, i) => (
          <span key={`${r}-${i}`} className="flex items-center">
            <span style={wordStyle}>{t}</span>
            <span style={bulletStyle}>✦</span>
          </span>
        )),
      )}
    </div>
  );

  return (
    <div
      className="relative w-full select-none overflow-hidden"
      aria-hidden
      style={containerStyle}
    >
      <div
        className="flex w-max items-center"
        style={{ animation: `marqueeSlide ${duration}s linear infinite` }}
      >
        <Half />
        <Half />
      </div>
    </div>
  );
};
