"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SkillNodes — Skills as neon particle nodes you can hover            ║
 * ║                                                                    ║
 * ║  Two-part visualization:                                           ║
 *  1. Animated radar chart (6 axes, draws on scroll)                   ║
 *  2. Floating skill nodes — hover any to highlight connections        ║
 *     to projects that exercised it                                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { competencyRadar, skillTree, projects } from "@/data/resume";

const ACCENTS = ["#00FFE1", "#FF006E", "#B6FF00", "#8B5CF6", "#00FFE1", "#FF006E"];

function RadarChart() {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const size = 320;
  const center = size / 2;
  const maxRadius = 110;
  const axes = competencyRadar;

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
        <radialGradient id="radar-neon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FFE1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF006E" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* Grid polygons */}
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
            stroke="#F4F4F5"
            strokeWidth="0.5"
            opacity="0.1"
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
            stroke="#F4F4F5"
            strokeWidth="0.5"
            opacity="0.1"
          />
        );
      })}

      {/* Animated radar polygon */}
      <motion.polygon
        points={polygonPoints}
        fill="url(#radar-neon)"
        stroke="#00FFE1"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Vertex points */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="5"
          fill={ACCENTS[i % ACCENTS.length]}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 1 + i * 0.08 }}
          style={{ filter: `drop-shadow(0 0 6px ${ACCENTS[i % ACCENTS.length]})` }}
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
            className="text-[10px] font-mono font-semibold"
            fill="#F4F4F5"
          >
            {p.label}
          </text>
          <text
            x={p.labelX}
            y={p.labelY + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] font-mono font-bold"
            fill={ACCENTS[i % ACCENTS.length]}
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
  language: "#00FFE1",
  backend: "#FF006E",
  data: "#B6FF00",
  cloud: "#8B5CF6",
  database: "#00FFE1",
  design: "#FF006E",
};

export function SkillNodes() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState<string | null>(null);

  const hoveredSkill = hovered ? skillTree.find((s) => s.id === hovered) : null;
  const linkedProjects = hoveredSkill
    ? projects.filter((p) => hoveredSkill.projects.includes(p.id))
    : [];

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 lg:py-32 bg-void overflow-hidden"
    >
      {/* Cursor-reactive bg */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(at 20% 30%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(0, 255, 225, 0.12) 0px, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 lg:mb-20 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-neon text-xs font-mono uppercase tracking-[0.2em] text-[#00FFE1] mb-4">
            Capabilities
          </div>
          <h2 className="display-lg text-[clamp(36px,5vw,64px)] text-[#F4F4F5]">
            The stack behind{" "}
            <span className="gradient-text-cyan-magenta">the systems.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#9CA3AF]">
            Every skill backed by real shipped work. Hover any node to see
            which production systems exercised it.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-10 lg:gap-16">
          {/* Radar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-start"
          >
            <div className="glass-neon rounded-3xl p-8 w-full flex items-center justify-center">
              <RadarChart />
            </div>
          </motion.div>

          {/* Skill node grid */}
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
                      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                    />
                    <span className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#F4F4F5]">
                      {label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        onMouseEnter={() => setHovered(s.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="group relative px-4 py-2 rounded-full border cursor-pointer transition-all"
                        style={{
                          borderColor:
                            hovered === s.id ? color : "rgba(244, 244, 245, 0.1)",
                          backgroundColor:
                            hovered === s.id ? `${color}15` : "rgba(5, 5, 7, 0.4)",
                          boxShadow:
                            hovered === s.id ? `0 0 20px ${color}40` : "none",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#F4F4F5]">
                            {s.label}
                          </span>
                          <span
                            className="text-[10px] font-mono font-bold tabular-nums"
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

            {/* Hover linkage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-5 rounded-2xl glass-neon"
            >
              {hoveredSkill && (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#00FFE1] mb-2">
                    ▸ Exercised in
                  </div>
                  <p className="text-sm text-[#F4F4F5] mb-3 leading-relaxed">
                    {hoveredSkill.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedProjects.map((p) => (
                      <span
                        key={p.id}
                        className="px-2.5 py-1 rounded-full text-[10px] font-mono"
                        style={{
                          backgroundColor: `${p.accentColor}20`,
                          color: p.accentColor,
                          border: `1px solid ${p.accentColor}40`,
                        }}
                      >
                        {p.title.length > 38 ? p.title.slice(0, 38) + "…" : p.title}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {!hovered && (
                <div className="text-sm text-[#6B7280] font-mono">
                  ↑ Hover any node to see project linkages
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
