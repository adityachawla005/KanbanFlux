import Image from "next/image";
import Link from "next/link";

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#080808" }}
    >
      <style>{`
        @keyframes aurora1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(60px, -40px) scale(1.08); }
          66%       { transform: translate(-30px, 50px) scale(0.94); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%       { transform: translate(-50px, -30px) scale(1.06); }
          80%       { transform: translate(40px, 60px) scale(0.96); }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(35px, -55px) scale(1.04); }
        }
        @keyframes authFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* grain texture */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.055" />
      </svg>

      {/* aurora — green, top-left */}
      <div style={{
        position: "absolute", top: "-5%", left: "-5%",
        width: "55vw", height: "55vw", maxWidth: "700px", maxHeight: "700px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, rgba(0,229,153,0.13) 0%, transparent 65%)",
        filter: "blur(72px)",
        animation: "aurora1 20s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* aurora — teal/blue, bottom-right */}
      <div style={{
        position: "absolute", bottom: "-10%", right: "-8%",
        width: "50vw", height: "50vw", maxWidth: "640px", maxHeight: "640px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 60% 60%, rgba(0,180,200,0.09) 0%, transparent 65%)",
        filter: "blur(80px)",
        animation: "aurora2 26s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* aurora — green, center accent */}
      <div style={{
        position: "absolute", top: "55%", left: "38%",
        width: "30vw", height: "30vw", maxWidth: "380px", maxHeight: "380px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,229,153,0.06) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "aurora3 16s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* edge vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(8,8,8,0.85) 100%)",
      }} />

      {/* content */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ animation: "authFadeIn 0.55s ease both" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 mb-8 hover:opacity-75 transition-opacity"
        >
          <Image src="/logo.svg" alt="KanbanFlux" width={26} height={26} />
          <span
            className="font-semibold text-white"
            style={{ fontSize: "16px", letterSpacing: "-0.025em" }}
          >
            Kanban<span style={{ color: "#00e599" }}>Flux</span>
          </span>
        </Link>

        {children}

        <p
          className="mt-8 font-mono"
          style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}
        >
          © {new Date().getFullYear()} KanbanFlux
        </p>
      </div>
    </div>
  );
};

export default ClerkLayout;
