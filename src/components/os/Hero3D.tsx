"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Hero3D — Editorial 3D hero with floating shapes                    ║
 * ║                                                                    ║
 * ║  • Huge Playfair Display headline                                  ║
 * ║  • Floating icosahedron + ring + gradient orb                      ║
 * ║  • Floating stat cards (3 of them)                                  ║
 * ║  • Parallax depth on mouse move                                     ║
 * ║  • Scroll-down indicator                                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import {
  FloatingShape,
  GradientOrb,
  IcosahedronShape,
  FloatingRing,
  FloatingStatCard,
  FloatingChip,
  FloatingDots,
} from "./FloatingShapes";
import { identity, contactLinks } from "@/data/resume";

export function Hero3D() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-coral-mesh"
    >
      {/* ─── Background floating shapes ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <GradientOrb size={600} />
        <IcosahedronShape size={120} />
        <FloatingRing size={80} />
        <FloatingDots />
      </div>

      {/* ─── Floating stat cards ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingStatCard
          value="500K+"
          label="Daily API requests"
          depth={0.4}
          accent="coral"
          className="top-[18%] right-[8%] hidden lg:block"
        />
        <FloatingStatCard
          value="99.99%"
          label="Production uptime"
          depth={0.6}
          accent="amber"
          className="bottom-[28%] left-[6%] hidden lg:block"
        />
        <FloatingStatCard
          value="6 yrs"
          label="Shipping production"
          depth={0.5}
          accent="navy"
          className="top-[60%] right-[12%] hidden md:block"
        />
      </div>

      {/* ─── Floating chips ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingChip
          depth={0.7}
          className="top-[12%] left-[10%] hidden md:flex"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B6B]" />
          <span>Open to Senior / Staff roles</span>
        </FloatingChip>
      </div>

      {/* ─── Main content ─── */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-32 lg:pt-40 pb-20 flex flex-col items-center min-h-screen justify-center text-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-warm">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-[#FF6B6B] animate-ping opacity-75" />
              <span className="relative rounded-full w-2 h-2 bg-[#FF6B6B]" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#1A1F3A]">
              {identity.title}
            </span>
          </div>
        </motion.div>

        {/* Name — huge editorial */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="display-xl text-[clamp(64px,12vw,200px)] text-[#1A1F3A]"
        >
          Vedhas
          <br />
          <span className="gradient-text-sunset italic">Kharche</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 max-w-2xl text-lg sm:text-xl lg:text-2xl text-[#1A1F3A]/80 leading-relaxed font-normal"
        >
          I build{" "}
          <span className="font-semibold text-[#FF6B6B]">distributed systems</span>{" "}
          that survive at scale — 10M users, 5TB/day, 99.99% uptime.
          <br className="hidden sm:block" />
          Six years shipping backend infrastructure at{" "}
          <span className="font-semibold">Abbott</span>,{" "}
          <span className="font-semibold">Forcepoint</span>, and{" "}
          <span className="font-semibold">Persistent</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#1A1F3A] text-[#FFF5EB] text-sm font-semibold uppercase tracking-wider hover:bg-[#FF6B6B] transition-all duration-300 shadow-warm-lg hover:scale-105"
          >
            See the work
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            href={contactLinks.find((l) => l.id === "email")?.href}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-warm-strong text-[#1A1F3A] text-sm font-semibold uppercase tracking-wider hover:bg-white transition-all duration-300 hover:scale-105"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1F3A]/60 font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-[#FF6B6B] to-transparent"
        />
      </motion.div>
    </section>
  );
}
