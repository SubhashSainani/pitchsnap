"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/actions/auth";

const NAV_LINKS = [
  { href: "/generate", label: "Generate" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="h-16 w-full backdrop-blur-md bg-white/80 border-b border-border px-6">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between">
        <Link href="/generate" className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(45deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)",
            }}
          >
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-text-primary">PitchSnap</span>
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-accent font-medium text-sm transition-colors duration-150"
                    : "text-text-secondary font-medium text-sm transition-colors duration-150"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut}>
          <button
            type="submit"
            className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg px-3 py-1.5 text-sm transition-colors duration-150"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
