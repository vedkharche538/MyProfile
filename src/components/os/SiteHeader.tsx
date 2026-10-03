"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SiteHeader — Simplified sticky navigation                          ║
 * ║                                                                    ║
 * ║  Drops the 3-mode toggle. Just:                                    ║
 *    • Brand                                                            ║
 *    • Smooth-scroll anchor nav (Work / Impact / Skills / Timeline / Contact) ║
 *    • Hire CTA                                                         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Mail } from "lucide-react";
import { identity, contactLinks } from "@/data/resume";

const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "Impact", href: "#impact" },
  { label: "Skills", href: "#skills" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 60);
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-2 bg-[#FFF5EB]/80 backdrop-blur-xl border-b border-[#FF8B5C]/15"
          : "py-4 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label={`${identity.name} — Home`}
        >
          <motion.div
            whileHover={{ rotate: 90, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #FF8B5C, #F59E0B)",
              boxShadow: "0 8px 20px -8px rgba(255,107,107,0.5)",
            }}
          >
            <span className="font-display font-black text-white text-lg leading-none">V</span>
          </motion.div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-display font-bold text-base text-[#1A1F3A]">
              {identity.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B5B4F] font-medium mt-0.5">
              {identity.title.split("&")[0].trim()}
            </span>
          </div>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-[#1A1F3A]/70 hover:text-[#FF6B6B] hover:bg-[#FFE8D6]/50 transition-all"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={contactLinks.find((l) => l.id === "email")?.href}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1F3A] text-[#FFF5EB] text-sm font-semibold hover:bg-[#FF6B6B] transition-all duration-300 shadow-warm"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hire me</span>
          <span className="sm:hidden">Hire</span>
        </a>
      </div>
    </header>
  );
}
