"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ProjectsCoverflow — 3D rotating carousel of projects              ║
 * ║                                                                    ║
 * ║  Projects as 3D cards arranged in a coverflow layout.             ║
 * ║  • Drag horizontally (or use arrow buttons / scroll wheel)         ║
 * ║  • Center card is highlighted; side cards are rotated + faded      ║
 * ║  • Click center card → opens deep-dive modal                       ║
 * ║  • Auto-advances every 5s if user isn't interacting                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ArrowUpRight, Layers } from "lucide-react";
import { projects, type Project } from "@/data/resume";
import { CursorReactiveBG } from "./CursorReactiveBG";

const ROTATION = 35; // degrees side cards are rotated
const OFFSET = 280; // px side cards are offset horizontally
const DEPTH = -200; // px side cards recede into z

function ProjectCard({
  project,
  index,
  activeIndex,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  activeIndex: number;
  total: number;
  onOpen: () => void;
}) {
  // Calculate relative position (-2, -1, 0, 1, 2)
  let rel = index - activeIndex;
  // Wrap around for infinite feel
  if (rel > total / 2) rel -= total;
  if (rel < -total / 2) rel += total;

  const isActive = rel === 0;
  const isAdjacent = Math.abs(rel) === 1;
  const isVisible = Math.abs(rel) <= 2;

  if (!isVisible) return null;

  const rotateY = rel * -ROTATION;
  const x = rel * OFFSET;
  const z = -Math.abs(rel) * Math.abs(DEPTH);
  const opacity = Math.abs(rel) > 1 ? 0.3 : 1 - Math.abs(rel) * 0.3;
  const scale = isActive ? 1 : 0.85 - Math.abs(rel) * 0.05;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      animate={{
        x,
        z,
        rotateY,
        opacity,
        scale,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 30,
      }}
    >
      <div
        data-cursor="project"
        onClick={isActive ? onOpen : undefined}
        className={`relative w-[340px] sm:w-[400px] h-[440px] sm:h-[480px] rounded-3xl p-7 cursor-pointer transition-all ${
          isActive
            ? "glass-neon-strong"
            : "glass-neon"
        }`}
        style={{
          transformStyle: "preserve-3d",
          border: isActive
            ? `1px solid ${project.accentColor}80`
            : "1px solid rgba(244, 244, 245, 0.08)",
          boxShadow: isActive
            ? `0 30px 60px -20px ${project.accentColor}40, 0 0 80px -20px ${project.accentColor}60`
            : "0 20px 40px -20px rgba(0,0,0,0.6)",
        }}
      >
        {/* Glow background */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${project.accentColor}, transparent 70%)`,
            }}
          />
        )}

        {/* Top row: number + scale */}
        <div className="relative flex items-start justify-between mb-6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${project.accentColor}20`,
              color: project.accentColor,
              border: `1px solid ${project.accentColor}40`,
            }}
          >
            {project.scale}
          </span>
        </div>

        {/* Title */}
        <h3
          className="relative display-md text-2xl lg:text-3xl text-[#F4F4F5] leading-tight mb-3"
          style={{ transform: "translateZ(40px)" }}
        >
          {project.title}
        </h3>

        {/* Company + period */}
        <div className="relative text-xs font-mono text-[#9CA3AF] mb-4">
          {project.company} · {project.period}
        </div>

        {/* Tagline */}
        <p
          className="relative text-sm text-[#9CA3AF] leading-relaxed mb-6"
          style={{ transform: "translateZ(20px)" }}
        >
          {project.tagline}
        </p>

        {/* Impact metrics grid */}
        <div className="relative grid grid-cols-2 gap-2 mb-6">
          {project.deepDive.impactMetrics.slice(0, 4).map((m) => (
            <div
              key={m.label}
              className="px-3 py-2 rounded-lg"
              style={{
                background: "rgba(5, 5, 7, 0.6)",
                border: "1px solid rgba(244, 244, 245, 0.06)",
              }}
            >
              <div className="text-[9px] uppercase tracking-wider text-[#6B7280] font-mono">
                {m.label}
              </div>
              <div
                className="text-base font-bold tabular-nums"
                style={{ color: project.accentColor }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="relative flex flex-wrap gap-1.5 mb-6">
          {project.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-full text-[10px] font-mono"
              style={{
                background: "rgba(5, 5, 7, 0.6)",
                color: "#9CA3AF",
                border: "1px solid rgba(244, 244, 245, 0.08)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* CTA */}
        {isActive && (
          <div className="absolute bottom-6 left-7 right-7 flex items-center justify-between">
            <span
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: project.accentColor }}
            >
              Deep dive
            </span>
            <ArrowUpRight className="w-5 h-5" style={{ color: project.accentColor }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#050507]/80 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl glass-neon-strong"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: `${project.accentColor}40` }}
      >
        {/* Header */}
        <div
          className="p-8 lg:p-10 border-b"
          style={{ borderColor: "rgba(244, 244, 245, 0.08)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full glass-neon flex items-center justify-center text-[#F4F4F5] hover:border-[#FF006E]/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${project.accentColor}20`,
                color: project.accentColor,
                border: `1px solid ${project.accentColor}40`,
              }}
            >
              {project.scale} scale
            </span>
            <span className="text-xs font-mono text-[#9CA3AF]">
              {project.company} · {project.period}
            </span>
          </div>

          <h3 className="display-lg text-3xl lg:text-4xl text-[#F4F4F5] leading-tight mb-3">
            {project.title}
          </h3>
          <p className="text-base text-[#9CA3AF] leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Body */}
        <div className="p-8 lg:p-10 space-y-8">
          {/* Impact */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#00FFE1] mb-3">
              ▸ Impact
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {project.deepDive.impactMetrics.map((m) => (
                <div
                  key={m.label}
                  className="p-4 rounded-xl glass-neon"
                >
                  <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono mb-1">
                    {m.label}
                  </div>
                  <div
                    className="text-xl font-bold tabular-nums"
                    style={{ color: project.accentColor }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem / Solution */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl glass-neon">
              <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#FF006E] mb-2">
                ▸ Problem
              </div>
              <p className="text-sm text-[#F4F4F5] leading-relaxed">
                {project.deepDive.problem}
              </p>
            </div>
            <div className="p-5 rounded-2xl glass-neon">
              <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#B6FF00] mb-2">
                ▸ Solution
              </div>
              <p className="text-sm text-[#F4F4F5] leading-relaxed">
                {project.deepDive.solution}
              </p>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#00FFE1] mb-3">
              ▸ Key Achievements
            </div>
            <ul className="space-y-2">
              {project.achievements.map((a, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[#F4F4F5]">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: project.accentColor }}
                  />
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade-offs */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#8B5CF6] mb-3">
              ▸ Trade-offs
            </div>
            <ul className="space-y-2">
              {project.deepDive.tradeoffs.map((t, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[#9CA3AF]">
                  <ArrowUpRight className="w-4 h-4 mt-0.5 shrink-0 text-[#8B5CF6] rotate-0" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#00FFE1] mb-3">
              ▸ Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {project.deepDive.techStack.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-xs font-mono"
                  style={{
                    background: "rgba(5, 5, 7, 0.6)",
                    color: "#F4F4F5",
                    border: "1px solid rgba(0, 255, 225, 0.2)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsCoverflow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [userInteracting, setUserInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const lastInteractRef = useRef(Date.now());

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % projects.length);
    lastInteractRef.current = Date.now();
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + projects.length) % projects.length);
    lastInteractRef.current = Date.now();
  }, []);

  // Auto-advance every 5s if user hasn't interacted recently
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteractRef.current > 5000) {
        setActiveIndex((i) => (i + 1) % projects.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Drag handling
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setUserInteracting(false);
    if (Math.abs(info.offset.x) > 80) {
      if (info.offset.x < 0) next();
      else prev();
    }
    lastInteractRef.current = Date.now();
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-24 lg:py-32 bg-void overflow-hidden"
    >
      {/* Cursor reactive BG */}
      <CursorReactiveBG intensity="medium" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 lg:mb-16 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-neon text-xs font-mono uppercase tracking-[0.2em] text-[#00FFE1] mb-4">
            <Layers className="w-3 h-3" />
            Selected Work
          </div>
          <h2 className="display-lg text-[clamp(36px,5vw,64px)] text-[#F4F4F5]">
            Systems I've{" "}
            <span className="gradient-text-cyan-magenta">shipped at scale.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#9CA3AF]">
            Drag the carousel. Each card is a real production architecture.
            Click the center one to dive deep.
          </p>
        </motion.div>

        {/* Coverflow */}
        <div className="relative">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setUserInteracting(true)}
            onDragEnd={handleDragEnd}
            className="relative h-[480px] sm:h-[540px] flex items-center justify-center"
          >
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                activeIndex={activeIndex}
                total={projects.length}
                onOpen={() => setSelected(p)}
              />
            ))}
          </motion.div>

          {/* Nav buttons */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full glass-neon-strong flex items-center justify-center text-[#00FFE1] hover:border-[#00FFE1]/50 transition-all"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    lastInteractRef.current = Date.now();
                  }}
                  className="transition-all rounded-full"
                  style={{
                    width: i === activeIndex ? 24 : 8,
                    height: 8,
                    background:
                      i === activeIndex ? "#00FFE1" : "rgba(244, 244, 245, 0.2)",
                    boxShadow:
                      i === activeIndex ? "0 0 12px rgba(0, 255, 225, 0.6)" : "none",
                  }}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full glass-neon-strong flex items-center justify-center text-[#00FFE1] hover:border-[#00FFE1]/50 transition-all"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
