"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  HeroSection — Identity, headline, metric ticker                     ║
 * ║                                                                    ║
 * ║  • Particle canvas background (cursor-reactive)                     ║
 * ║  • Animated count-up metrics from resume                            ║
 * ║  • Marquee ticker with quantified engineering impact                ║
 * ║  • CTA buttons: View Architecture / Open Terminal / Download Resume ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { ChevronRight, Download, Terminal as TerminalIcon, Network } from "lucide-react";
import { HeroCanvas } from "./HeroCanvas";
import { useOSStore } from "@/store/useOSStore";
import { identity, heroMetrics, contactLinks, type Metric } from "@/data/resume";

function AnimatedCounter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => {
    const decimals = metric.decimals ?? 0;
    return v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });

  useEffect(() => {
    if (inView) {
      const target = metric.value;
      const start = performance.now();
      const dur = 1800;
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        mv.set(target * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [inView, metric.value, mv]);

  return (
    <div className="group relative px-4 py-3 rounded-md border border-[rgba(0,240,255,0.1)] bg-[#0A0D12]/40 backdrop-blur-sm hover:border-[var(--color-cyber-cyan)]/40 transition-all hover-glow">
      <div className="flex items-baseline gap-0.5">
        {metric.prefix && (
          <span className="font-mono text-xs text-[var(--color-cyber-cyan)]">{metric.prefix}</span>
        )}
        <span
          ref={ref}
          className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums"
        >
          <motion.span>{display}</motion.span>
        </span>
        <span className="font-mono text-sm font-bold text-[var(--color-cyber-cyan)] text-glow-cyan">
          {metric.suffix}
        </span>
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {metric.label}
      </div>
      <div className="mt-1 font-sans text-[11px] text-[var(--color-muted-foreground)]/80 leading-snug">
        {metric.description}
      </div>
    </div>
  );
}

const CATEGORY_COLOR: Record<Metric["category"], string> = {
  scale: "var(--color-cyber-cyan)",
  performance: "var(--color-cyber-emerald)",
  cost: "var(--color-cyber-amber)",
  reliability: "var(--color-cyber-purple)",
};

export function HeroSection() {
  const { setMode, playSfx } = useOSStore();

  // Build ticker string ×2 for seamless marquee
  const tickerItems = [
    ...heroMetrics,
    { id: "x1", label: "Years Experience", value: identity.yearsExperience, suffix: "+", description: "Production-grade engineering", category: "scale" as const },
    { id: "x2", label: "Companies Shipped", value: 4, suffix: "", description: "Abbott, Forcepoint, Persistent ×2", category: "scale" as const },
    { id: "x3", label: "Awards", value: 8, suffix: "+", description: "Including 6× Bravo Excellence", category: "reliability" as const },
  ];
  const tickerDoubled = [...tickerItems, ...tickerItems];

  return (
    <section className="relative overflow-hidden">
      {/* Particle canvas */}
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      {/* Grid + vignette overlays */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-8">
        {/* Identity badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(0,240,255,0.3)] bg-[#0A0D12]/60 backdrop-blur-sm mb-6"
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-[var(--color-cyber-emerald)] animate-ping opacity-75" />
            <span className="relative rounded-full w-2 h-2 bg-[var(--color-cyber-emerald)]" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            {identity.availability}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white max-w-4xl"
        >
          <span className="block text-[var(--color-muted-foreground)] text-base sm:text-xl font-mono font-normal mb-2">
            $ whoami
          </span>
          {identity.name}
          <span className="block mt-3 text-[var(--color-cyber-cyan)] text-glow-cyan">
            {identity.title}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-[var(--color-muted-foreground)] leading-relaxed"
        >
          {identity.summary}
        </motion.p>

        {/* Tagline chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {identity.tagline.split("•").map((t, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-md font-mono text-xs border border-[rgba(0,240,255,0.2)] text-[var(--color-cyber-cyan)]/90 bg-[#0A0D12]/60"
            >
              {t.trim()}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <button
            onClick={() => setMode("architecture")}
            onMouseEnter={() => playSfx("hover")}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-sm font-bold uppercase tracking-wider bg-[var(--color-cyber-cyan)] text-[#0A0D12] hover:brightness-110 transition-all neon-cyan"
          >
            <Network className="w-4 h-4" />
            View Architecture
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => setMode("terminal")}
            onMouseEnter={() => playSfx("hover")}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-sm font-bold uppercase tracking-wider border border-[var(--color-cyber-emerald)]/40 text-[var(--color-cyber-emerald)] hover:bg-[var(--color-cyber-emerald)]/10 hover:border-[var(--color-cyber-emerald)] transition-all"
          >
            <TerminalIcon className="w-4 h-4" />
            Open Terminal
          </button>
          <a
            href={contactLinks.find((l) => l.id === "email")?.href}
            onMouseEnter={() => playSfx("hover")}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-sm font-bold uppercase tracking-wider border border-[rgba(0,240,255,0.15)] text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-purple)] hover:border-[var(--color-cyber-purple)]/40 transition-all"
          >
            <Download className="w-4 h-4" />
            Resume PDF
          </a>
        </motion.div>

        {/* Metrics grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {heroMetrics.slice(0, 8).map((m) => (
            <AnimatedCounter key={m.id} metric={m} />
          ))}
        </motion.div>
      </div>

      {/* ─── Metric ticker (marquee) ─── */}
      <div className="relative z-10 border-y border-[rgba(0,240,255,0.12)] bg-[#0A0D12]/80 backdrop-blur-sm py-2 overflow-hidden">
        <div className="flex marquee whitespace-nowrap">
          {tickerDoubled.map((m, i) => (
            <div
              key={`${m.id}-${i}`}
              className="flex items-center gap-2 px-6 font-mono text-xs"
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLOR[m.category] }}
              />
              <span className="text-white font-bold tabular-nums">
                {m.value.toLocaleString("en-US")}
                {m.suffix}
              </span>
              <span className="text-[var(--color-muted-foreground)] uppercase tracking-wider">
                {m.label}
              </span>
              <span className="text-[var(--color-cyber-cyan)]/40 ml-4">▸</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
