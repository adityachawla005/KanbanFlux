import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const headingFont = localFont({ src: "../../public/fonts/font.woff2" });

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-2 hover:opacity-80 transition">
        <Image
          src="/logo.svg"
          alt="KanbanFlux"
          width={22}
          height={22}
          className="shrink-0"
        />
        <span
          className={cn("font-semibold text-white", headingFont.className)}
          style={{ fontSize: "15px", letterSpacing: "-0.02em" }}
        >
          Kanban<span style={{ color: "#00e599" }}>Flux</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
