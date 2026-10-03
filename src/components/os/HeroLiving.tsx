"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  HeroLiving — The new hero with draggable 3D object + scramble      ║
 * ║  text + cursor-reactive background + particle field                 ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, MousePointer2 } from "lucide-react";
import { ScrambleText } from "./ScrambleText";
import { CursorReactiveBG } from "./CursorReactiveBG";
import { Hero3DObject } from "./Hero3DObject";
import { identity, contactLinks, heroMetrics } from "@/data/resume";

export function HeroLiving() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-void"
    >
      {/* Cursor-reactive gradient background */}
      <CursorReactiveBG intensity="strong" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-neon opacity-40 pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 min-h-screen flex items-center"
      >
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center w-full pt-24 pb-32">
          {/* ─── Left: text content ─── */}
          <div className="text-center lg:text-left">
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-neon mb-8"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#00FFE1] animate-ping opacity-75" />
                <span className="relative rounded-full w-2 h-2 bg-[#00FFE1]" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#00FFE1]">
                {identity.availability}
              </span>
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm font-mono text-[#6B7280] mb-3 uppercase tracking-[0.2em]"
            >
              $ whoami
            </motion.div>

            {/* Name — with scramble effect */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="display-xl text-[clamp(48px,9vw,140px)] text-[#F4F4F5] leading-[0.9]"
            >
              <ScrambleText text={identity.name} duration={1400} delay={400} />
            </motion.h1>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-4 text-xl sm:text-2xl lg:text-3xl"
            >
              <span className="gradient-text-neon font-display font-bold">
                {identity.title}
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-6 max-w-xl text-base sm:text-lg text-[#9CA3AF] leading-relaxed mx-auto lg:mx-0"
            >
              I architect backends that survive at scale.{" "}
              <span className="text-[#00FFE1]">10M+ users</span>.{" "}
              <span className="text-[#FF006E]">5TB/day</span>.{" "}
              <span className="text-[#B6FF00]">99.99% uptime</span>. Six years
              shipping production systems at Abbott, Forcepoint, and Persistent.
            </motion.p>

            {/* Metric chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              {heroMetrics.slice(0, 4).map((m, i) => {
                const colors = ["#00FFE1", "#FF006E", "#B6FF00", "#8B5CF6"];
                return (
                  <div
                    key={m.id}
                    className="px-3 py-1.5 rounded-md glass-neon flex items-center gap-2 text-xs font-mono"
                    style={{ borderColor: `${colors[i]}30` }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors[i], boxShadow: `0 0 8px ${colors[i]}` }}
                    />
                    <span className="text-[#F4F4F5] font-bold tabular-nums">
                      {m.value}{m.suffix}
                    </span>
                    <span className="text-[#6B7280]">{m.label.split(" ").slice(0, 2).join(" ")}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#00FFE1] text-[#050507] text-sm font-bold uppercase tracking-wider hover:bg-[#00FFE1]/90 transition-all glow-cyan"
              >
                See the work
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>
              <a
                href={contactLinks.find((l) => l.id === "email")?.href}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-neon-strong text-[#F4F4F5] text-sm font-bold uppercase tracking-wider hover:border-[#FF006E]/50 transition-all"
              >
                Get in touch
              </a>
            </motion.div>
          </div>

          {/* ─── Right: draggable 3D object ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] lg:h-[560px] w-full"
          >
            <Hero3DObject className="w-full h-full" />

            {/* Drag hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full glass-neon text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF]">
              <MousePointer2 className="w-3 h-3 text-[#00FFE1]" />
              drag to rotate
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B7280] font-mono">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-[#00FFE1] to-transparent"
        />
      </motion.div>
    </section>
  );
}
