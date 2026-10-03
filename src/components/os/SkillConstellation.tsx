"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SkillConstellation — Animated radar + skill grid with hover linkage ║
 * ║                                                                    ║
 * ║  Two parts:                                                        ║
 *  1. Animated competency radar (6 axes, draws on scroll)              ║
 *  2. Skill grid — hover any skill to see which projects exercised it   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { competencyRadar, skillTree, projects } from "@/data/resume";

const ACCENTS = ["#FF6B6B", "#FF8B5C", "#F59E0B", "#FECDD3", "#FF8B5C", "#FF6B6B"];

function RadarChart() {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const size = 320;
  const center = size / 2;
  const maxRadius = 110;
  const axes = competencyRadar;

  // Compute polygon points for the radar shape
  const points = axes.map((a, i) => {
    const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    const r = (a.value / 100) * maxRadius;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
      labelX: center + Math.cos(angle) * (maxRadius + 30),
      labelY: center + Math.sin(angle) * (maxRadius + 30),
      label: a.axis,
      value: a.value,
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <motion.svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-full h-auto"
    >
      <defs>
        <radialGradient id="radar-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF8B5C" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* Concentric polygons (grid) */}
      {gridLevels.map((level) => {
        const gridPoints = axes
          .map((_, i) => {
            const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
            const r = level * maxRadius;
            return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
          })
          .join(" ");
        return (
          <polygon
            key={level}
            points={gridPoints}
            fill="none"
            stroke="#1A1F3A"
            strokeWidth="0.5"
            opacity="0.15"
          />
        );
      })}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * maxRadius}
            y2={center + Math.sin(angle) * maxRadius}
            stroke="#1A1F3A"
            strokeWidth="0.5"
            opacity="0.15"
          />
        );
      })}

      {/* Animated radar polygon */}
      <motion.polygon
        points={polygonPoints}
        fill="url(#radar-grad)"
        stroke="#FF6B6B"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Points at each vertex */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={ACCENTS[i % ACCENTS.length]}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 1 + i * 0.08 }}
        />
      ))}

      {/* Labels */}
      {points.map((p, i) => (
        <motion.g
          key={`label-${i}`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2 + i * 0.08 }}
        >
          <text
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] font-semibold"
            fill="#1A1F3A"
          >
            {p.label}
          </text>
          <text
            x={p.labelX}
            y={p.labelY + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px]"
            fill={ACCENTS[i % ACCENTS.length]}
            fontWeight="bold"
          >
            {p.value}%
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  language: "Languages",
  backend: "Backend & Frameworks",
  data: "Data Engineering",
  cloud: "Cloud & DevOps",
  database: "Databases",
  design: "System Design",
};

const CATEGORY_COLORS: Record<string, string> = {
  language: "#FF6B6B",
  backend: "#FF8B5C",
  data: "#F59E0B",
  cloud: "#FF6B6B",
  database: "#FF8B5C",
  design: "#F59E0B",
};

export function SkillConstellation() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState<string | null>(null);

  const hoveredSkill = hovered ? skillTree.find((s) => s.id === hovered) : null;
  const linkedProjects = hoveredSkill
    ? projects.filter((p) => hoveredSkill.projects.includes(p.id))
    : [];

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 bg-cream-grain overflow-hidden"
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
            Capabilities
          </div>
          <h2 className="display-lg text-[clamp(36px,5vw,64px)] text-[#1A1F3A]">
            What I'm{" "}
            <span className="gradient-text-sunset italic">genuinely good at.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#6B5B4F]">
            Not a buzzword soup. Each skill is backed by real shipped systems.
            Hover any to see where it was exercised.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-10 lg:gap-16">
          {/* Radar chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-start"
          >
            <div className="glass-warm rounded-3xl p-8 w-full flex items-center justify-center">
              <RadarChart />
            </div>
            <p className="mt-4 text-xs text-[#6B5B4F] text-center max-w-xs">
              Competency radar — animated on scroll. Each axis backed by multiple shipped projects.
            </p>
          </motion.div>

          {/* Skill grid */}
          <div>
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
              const skills = skillTree.filter((s) => s.category === cat);
              if (skills.length === 0) return null;
              const color = CATEGORY_COLORS[cat];
              return (
                <div key={cat} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#1A1F3A]">
                      {label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        onMouseEnter={() => setHovered(s.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="group relative px-4 py-2 rounded-full border cursor-pointer transition-all"
                        style={{
                          borderColor: hovered === s.id ? color : "rgba(26, 31, 58, 0.1)",
                          backgroundColor: hovered === s.id ? `${color}15` : "rgba(255, 255, 255, 0.6)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#1A1F3A]">
                            {s.label}
                          </span>
                          <span
                            className="text-[10px] font-bold tabular-nums"
                            style={{ color }}
                          >
                            {s.level}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Hovered skill project linkage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 rounded-2xl glass-warm"
            >
              {hoveredSkill && (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6B6B] mb-2">
                    Exercised in
                  </div>
                  <p className="text-sm text-[#1A1F3A] mb-2">{hoveredSkill.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedProjects.map((p) => (
                      <span
                        key={p.id}
                        className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                        style={{
                          backgroundColor: `${p.accentColor}20`,
                          color: p.accentColor,
                        }}
                      >
                        {p.title.length > 40 ? p.title.slice(0, 40) + "…" : p.title}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {!hovered && (
                <div className="text-sm text-[#6B5B4F]">
                  ↑ Hover any skill chip to see which production systems exercised it.
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
