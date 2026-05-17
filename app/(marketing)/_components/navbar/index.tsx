"use client";

import Image from "next/image";
import Link from "next/link";

const NAV = ["Product", "Solutions", "Docs", "Pricing"];

export const Navbar = () => (
  <nav
    className="fixed top-0 z-50 w-full flex items-center px-8"
    style={{
      height: "52px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(8,8,8,0.82)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    }}
  >
    <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition">
        <Image src="/logo.svg" alt="KanbanFlux" width={22} height={22} className="shrink-0" />
        <span
          className="font-semibold text-white"
          style={{ fontSize: "14px", letterSpacing: "-0.025em" }}
        >
          Kanban<span style={{ color: "#00e599" }}>Flux</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7">
        {NAV.map((l) => (
          <Link
            key={l}
            href="/"
            className="transition-colors duration-150"
            style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)")
            }
          >
            {l}
          </Link>
        ))}
      </div>

      {/* Auth */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/sign-in"
          className="transition-colors duration-150"
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", padding: "5px 10px" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)")
          }
        >
          Log in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-[5px] font-medium transition-colors duration-150"
          style={{
            fontSize: "13px",
            padding: "6px 14px",
            background: "#00e599",
            color: "#050505",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#00d48a")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#00e599")
          }
        >
          Get started
        </Link>
      </div>
    </div>
  </nav>
);
