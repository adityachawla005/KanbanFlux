import Image from "next/image";
import Link from "next/link";

export const Footer = () => (
  <footer
    className="relative z-10 px-8 py-5"
    style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#080808" }}
  >
    <div className="max-w-screen-xl mx-auto flex items-center justify-between">

      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <Image src="/logo.svg" alt="KanbanFlux" width={18} height={18} className="shrink-0" />
        <span
          className="font-semibold"
          style={{ fontSize: "13px", letterSpacing: "-0.02em", color: "rgba(255,255,255,0.55)" }}
        >
          Kanban<span style={{ color: "#00e599" }}>Flux</span>
        </span>
      </Link>

      <div
        className="flex items-center gap-6"
        style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)" }}
      >
        <Link href="/" className="hover:text-white/40 transition-colors duration-150">Privacy</Link>
        <Link href="/" className="hover:text-white/40 transition-colors duration-150">Terms</Link>
        <span>© {new Date().getFullYear()} KanbanFlux</span>
      </div>
    </div>
  </footer>
);
