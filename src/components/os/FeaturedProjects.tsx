"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  FeaturedProjects — 3D tilt cards with click-to-expand deep dive   ║
 * ║                                                                    ║
 * ║  3 flagship projects:                                              ║
 *    • Abbott FastAPI Microservices (500K req/day)                    ║
 *    • Abbott GenAI RAG (2K+ field users, replaced AWS Lex)            ║
 *    • Abbott Redshift → Databricks migration (83% runtime cut)        ║
 * ║                                                                    ║
 * ║  Each card: 3D tilt on hover, click opens modal with full deep dive.║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowUpRight,
  X,
  Zap,
  TrendingUp,
  Layers,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { TiltCard } from "./TiltCard";
import { projects, type Project } from "@/data/resume";

// Pick the 3 most impressive projects
const FEATURED_IDS = ["abbott-fastapi", "abbott-ai", "abbott-etl"];

const ICON_MAP: Record<string, typeof Zap> = {
  "abbott-fastapi": Zap,
  "abbott-ai": Cpu,
  "abbott-etl": TrendingUp,
};

export function FeaturedProjects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const featuredProjects = FEATURED_IDS
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p));

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 lg:py-32 bg-sunset-radial overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 lg:mb-20 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE8D6] border border-[#FF8B5C]/20 text-xs uppercase tracking-[0.2em] font-medium text-[#FF6B6B] mb-4">
            <Layers className="w-3 h-3" />
            Selected Work
          </div>
          <h2 className="display-lg text-[clamp(36px,5vw,64px)] text-[#1A1F3A]">
            Three systems that{" "}
            <span className="gradient-text-sunset italic">shipped at scale.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#6B5B4F]">
            Each one started as a real production problem. Each one ended with
            measurable impact. Hover to feel the depth — click to see the deep dive.
          </p>
        </motion.div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProjects.map((project, i) => {
            const Icon = ICON_MAP[project.id] || Zap;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="perspective-1000"
              >
                <TiltCard
                  maxTilt={10}
                  scale={1.03}
                  className="cursor-pointer group h-full"
                >
                  <button
                    onClick={() => setSelected(project)}
                    className="w-full h-full text-left p-7 rounded-3xl glass-warm-strong hover-lift"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Top: icon + company chip */}
                    <div
                      className="flex items-start justify-between mb-6"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}CC)`,
                          boxShadow: `0 10px 30px -10px ${project.accentColor}80`,
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1A1F3A] text-[#FFF5EB]">
                        {project.scale}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="display-md text-2xl lg:text-[28px] text-[#1A1F3A] leading-tight mb-3"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {project.title}
                    </h3>

                    {/* Tagline */}
                    <p
                      className="text-sm text-[#6B5B4F] leading-relaxed mb-6"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {project.tagline}
                    </p>

                    {/* Impact metrics mini-grid */}
                    <div
                      className="grid grid-cols-2 gap-2 mb-6"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      {project.deepDive.impactMetrics.slice(0, 4).map((m) => (
                        <div
                          key={m.label}
                          className="px-3 py-2 rounded-xl bg-[#FFF5EB] border border-[#FFE8D6]"
                        >
                          <div className="text-[9px] uppercase tracking-wider text-[#6B5B4F] font-medium">
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

                    {/* Stack chips */}
                    <div
                      className="flex flex-wrap gap-1.5 mb-6"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      {project.stack.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#FFE8D6] text-[#1A1F3A]/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#FF6B6B] group-hover:gap-2.5 transition-all"
                      style={{ transform: "translateZ(25px)" }}
                    >
                      Deep dive
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </button>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Other projects teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-[#6B5B4F]">
            Plus 4 more production systems across Forcepoint & Persistent —
            <a
              href="#timeline"
              className="text-[#FF6B6B] font-semibold hover:underline ml-1"
            >
              see the full timeline ↓
            </a>
          </p>
        </motion.div>
      </div>

      {/* Deep dive modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0F1428]/60 backdrop-blur-md" />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl bg-[#FFF5EB] shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header band */}
        <div
          className="p-8 lg:p-10"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}15, ${project.accentColor}05)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FFF5EB]/80 hover:bg-white flex items-center justify-center text-[#1A1F3A] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: project.accentColor }}
            >
              {project.scale} scale
            </span>
            <span className="text-xs text-[#6B5B4F]">
              {project.company} · {project.period}
            </span>
          </div>

          <h3 className="display-lg text-[clamp(28px,4vw,44px)] text-[#1A1F3A] leading-tight mb-3">
            {project.title}
          </h3>
          <p className="text-base text-[#6B5B4F] leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Body */}
        <div className="p-8 lg:p-10 space-y-8">
          {/* Impact metrics */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6B6B] mb-3">
              Impact
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {project.deepDive.impactMetrics.map((m) => (
                <div
                  key={m.label}
                  className="p-4 rounded-2xl bg-white border border-[#FFE8D6] shadow-warm"
                >
                  <div className="text-[10px] uppercase tracking-wider text-[#6B5B4F] font-medium mb-1">
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
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#FFE8D6]/50 border border-[#FF8B5C]/20">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6B6B] mb-2">
                Problem
              </div>
              <p className="text-sm text-[#1A1F3A] leading-relaxed">
                {project.deepDive.problem}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FECDD3]/30 border border-[#FF6B6B]/20">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6B6B] mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Solution
              </div>
              <p className="text-sm text-[#1A1F3A] leading-relaxed">
                {project.deepDive.solution}
              </p>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6B6B] mb-3">
              Key Achievements
            </div>
            <ul className="space-y-2">
              {project.achievements.map((a, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[#1A1F3A]">
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
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6B6B] mb-3">
              Trade-offs Considered
            </div>
            <ul className="space-y-2">
              {project.deepDive.tradeoffs.map((t, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[#1A1F3A]/80">
                  <ArrowUpRight className="w-4 h-4 mt-0.5 shrink-0 text-[#FF8B5C] rotate-0" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6B6B] mb-3">
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {project.deepDive.techStack.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1A1F3A] text-[#FFF5EB]"
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
