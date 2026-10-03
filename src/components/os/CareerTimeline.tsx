"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CareerTimeline — Horizontal scroll-driven career journey            ║
 * ║                                                                    ║
 * ║  4 career stops:                                                   ║
 *    • Abbott (Oct 2023 – Present) — Senior Software Engineer          ║
 *    • Forcepoint (Jan – Oct 2023) — SDE II                            ║
 *    • Persistent (Jan 2022 – Jan 2023) — Senior Software Engineer     ║
 *    • Persistent (Aug 2020 – Jan 2022) — Software Engineer           ║
 * ║                                                                    ║
 * ║  Horizontal scroll with year markers, color-coded by company.      ║
 * ║  Drag horizontally or scroll-wheel to navigate.                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { careerCommits, type TimelineCommit } from "@/data/resume";

const COMMIT_TYPE_STYLE: Record<
  TimelineCommit["type"],
  { color: string; label: string }
> = {
  feat: { color: "#FF6B6B", label: "Feature" },
  refactor: { color: "#FF8B5C", label: "Refactor" },
  perf: { color: "#F59E0B", label: "Performance" },
  infra: { color: "#FF6B6B", label: "Infrastructure" },
  fix: { color: "#FF8B5C", label: "Fix" },
  chore: { color: "#6B5B4F", label: "Chore" },
  milestone: { color: "#F59E0B", label: "Milestone" },
};

interface TimelineCardProps {
  commit: TimelineCommit;
  index: number;
  total: number;
  inView: boolean;
}

function TimelineCard({ commit, index, total, inView }: TimelineCardProps) {
  const style = COMMIT_TYPE_STYLE[commit.type];
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative shrink-0 w-[320px] sm:w-[380px] snap-start"
    >
      {/* Year marker */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: style.color }}
        >
          {commit.date}
        </div>
        <div className="text-xs text-[#6B5B4F] font-mono">{commit.hash}</div>
      </div>

      {/* Card */}
      <div className="glass-warm-strong rounded-3xl p-7 hover-lift">
        {/* Type tag */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${style.color}15`,
              color: style.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: style.color }}
            />
            {style.label}
          </span>
          <span className="text-[10px] text-[#6B5B4F] font-mono">
            +{commit.additions} −{commit.deletions}
          </span>
        </div>

        {/* Title */}
        <h3 className="display-md text-xl text-[#1A1F3A] leading-tight mb-2 font-bold">
          {commit.title}
        </h3>

        {/* Company */}
        <div className="text-sm font-medium text-[#FF6B6B] mb-4">
          {commit.company}
        </div>

        {/* Body */}
        <p className="text-sm text-[#6B5B4F] leading-relaxed mb-5">
          {commit.body}
        </p>

        {/* Files changed */}
        <div className="flex items-center gap-3 text-xs text-[#6B5B4F]">
          <span>{commit.filesChanged} files</span>
          <span>·</span>
          <span className="font-mono text-[#FF6B6B]">+{commit.additions}</span>
          <span className="font-mono text-[#FF8B5C]">−{commit.deletions}</span>
        </div>
      </div>

      {/* Connector line to next card */}
      {!isLast && (
        <div className="absolute top-[30px] -right-2 w-12 h-px bg-gradient-to-r from-[#FF6B6B]/40 to-transparent pointer-events-none hidden lg:block" />
      )}
    </motion.div>
  );
}

export function CareerTimeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section
      id="timeline"
      className="relative py-24 lg:py-32 bg-sunset-radial overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 mb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE8D6] border border-[#FF8B5C]/20 text-xs uppercase tracking-[0.2em] font-medium text-[#FF6B6B] mb-4">
            Career Journey
          </div>
          <h2 className="display-lg text-[clamp(36px,5vw,64px)] text-[#1A1F3A]">
            Six years, four roles,{" "}
            <span className="gradient-text-sunset italic">one trajectory.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#6B5B4F]">
            From building a national education platform for 10M users to architecting
            compliance-critical microservices at Abbott — each stop compounded.
            Scroll horizontally to follow the journey.
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={ref}
        className="relative overflow-x-auto pb-8"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#FF6B6B #FFE8D6",
        }}
      >
        {/* Progress line */}
        <motion.div
          style={{ scaleX: lineScale }}
          className="absolute top-[34px] left-0 right-0 h-px bg-gradient-to-r from-[#FF6B6B] via-[#FF8B5C] to-[#F59E0B] origin-left mx-6 lg:mx-8"
        />

        <div className="flex gap-6 px-6 lg:px-8 snap-x snap-mandatory">
          {careerCommits.map((c, i) => (
            <TimelineCard
              key={c.id}
              commit={c}
              index={i}
              total={careerCommits.length}
              inView={inView}
            />
          ))}

          {/* End card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: careerCommits.length * 0.1 }}
            className="shrink-0 w-[280px] flex items-center justify-center"
          >
            <div className="text-center p-7">
              <div className="display-md text-3xl gradient-text-sunset italic mb-3">
                Next?
              </div>
              <p className="text-sm text-[#6B5B4F] leading-relaxed mb-4">
                Looking for the right team to build the next decade with.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B6B] hover:gap-2.5 transition-all"
              >
                Let's talk →
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="mt-6 text-center text-xs text-[#6B5B4F] uppercase tracking-[0.2em]">
        ← Scroll horizontally →
      </div>
    </section>
  );
}
