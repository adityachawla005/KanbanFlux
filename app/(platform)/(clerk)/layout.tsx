import Image from "next/image";
import Link from "next/link";

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="min-h-full flex flex-col items-center justify-center"
      style={{ background: "#080808" }}
    >
      {/* Logo above auth card */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 hover:opacity-80 transition">
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
  );
};

export default ClerkLayout;
