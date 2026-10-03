"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  NeonHeader — Minimal sticky navigation with magnetic links         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { identity, contactLinks } from "@/data/resume";

const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

function MagneticLink({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 60) {
        const force = (1 - dist / 60) * 0.4;
        setOffset({ x: dx * force, y: dy * force });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className="relative px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wider text-[#9CA3AF] hover:text-[#00FFE1] transition-colors"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {label}
    </a>
  );
}

export function NeonHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 60);
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-2 bg-[#050507]/80 backdrop-blur-xl border-b border-[#00FFE1]/10"
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
              background: "linear-gradient(135deg, #00FFE1, #8B5CF6, #FF006E)",
              boxShadow: "0 8px 20px -8px rgba(0, 255, 225, 0.5)",
            }}
          >
            <span className="font-display font-bold text-[#050507] text-lg leading-none">V</span>
          </motion.div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-display font-bold text-base text-[#F4F4F5]">
              {identity.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF] font-mono mt-0.5">
              {identity.title.split("&")[0].trim()}
            </span>
          </div>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <MagneticLink key={l.href} href={l.href} label={l.label} />
          ))}
        </nav>

        {/* CTA */}
        <a
          href={contactLinks.find((l) => l.id === "email")?.href}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00FFE1] text-[#050507] text-sm font-bold font-mono uppercase tracking-wider hover:bg-[#F4F4F5] transition-all duration-300 glow-cyan"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hire me</span>
          <span className="sm:hidden">Hire</span>
        </a>
      </div>
    </header>
  );
}
