"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ImpactSpotlight — Big dramatic visualizations of hero impact stats ║
 * ║                                                                    ║
 * ║  Three quantified wins:                                            ║
 *    • $2.5M+ cloud infra savings                                      ║
 *    • 83% ETL speedup (3.5h → 35min countdown animation)              ║
 *    • 96% deployment time reduction (2d → 30min)                      ║
 * ║                                                                    ║
 * ║  Deep navy background section for contrast + drama.                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { DollarSign, Clock, Rocket } from "lucide-react";

function BigStat({
  value,
  suffix,
  prefix,
  label,
  description,
  icon: Icon,
  accent,
  index,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
  icon: typeof DollarSign;
  accent: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [inView, value, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
          boxShadow: `0 20px 40px -15px ${accent}80`,
        }}
      >
        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
      </div>

      {/* Big number */}
      <div className="flex items-baseline gap-1 mb-3">
        {prefix && (
          <span
            className="display-md text-3xl lg:text-4xl"
            style={{ color: accent }}
          >
            {prefix}
          </span>
        )}
        <motion.span
          className="display-lg text-[clamp(56px,9vw,120px)] tabular-nums leading-none"
          style={{ color: accent }}
        >
          {rounded}
        </motion.span>
        {suffix && (
          <span
            className="display-md text-3xl lg:text-4xl"
            style={{ color: accent }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="text-lg font-semibold text-[#FFF5EB] mb-2">
        {label}
      </div>

      {/* Description */}
      <div className="text-sm text-[#FFF5EB]/60 leading-relaxed max-w-xs">
        {description}
      </div>
    </motion.div>
  );
}

function CountdownBar({
  from,
  to,
  fromLabel,
  toLabel,
  reduction,
  accent,
  delay,
  inView,
}: {
  from: number;
  to: number;
  fromLabel: string;
  toLabel: string;
  reduction: string;
  accent: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wider text-[#FFF5EB]/60 font-medium">
          Before
        </span>
        <span className="text-sm text-[#FFF5EB] font-semibold">{fromLabel}</span>
      </div>
      <div className="relative h-3 rounded-full bg-[#FFF5EB]/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: "100%" } : {}}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}40, ${accent})` }}
        />
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wider text-[#FFF5EB]/60 font-medium">
          After
        </span>
        <span className="text-sm font-bold" style={{ color: accent }}>
          {toLabel} · <span className="text-[#FFF5EB]">{reduction}</span>
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-[#FFF5EB]/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${(to / from) * 100}%` } : {}}
          transition={{ duration: 1.2, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}CC)` }}
        />
      </div>
    </div>
  );
}

export function ImpactSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 bg-navy-mesh overflow-hidden"
    >
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div
          className="absolute top-10 right-[5%] w-64 h-64 rounded-full float-slow"
          style={{
            background: "radial-gradient(circle, rgba(255,107,107,0.4), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-20 left-[10%] w-72 h-72 rounded-full float-medium"
          style={{
            background: "radial-gradient(circle, rgba(255,139,92,0.3), transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 lg:mb-24 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF5EB]/10 border border-[#FFF5EB]/20 text-xs uppercase tracking-[0.2em] font-medium text-[#FF8B5C] mb-4">
            <Rocket className="w-3 h-3" />
            The Wins
          </div>
          <h2 className="display-lg text-[clamp(36px,5vw,64px)] text-[#FFF5EB]">
            Three times I made{" "}
            <span className="gradient-text-sunset italic">production dramatically better.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#FFF5EB]/60">
            Every senior engineer has shipped things. Here are three where the
            before/after is so dramatic it's worth visualizing.
          </p>
        </motion.div>

        {/* Three big stats */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-20">
          <BigStat
            index={0}
            value={2.5}
            prefix="$"
            suffix="M+"
            label="Cloud infra savings"
            description="Re-architected AWS services + Databricks migration at Abbott. Real dollar impact on the bottom line."
            icon={DollarSign}
            accent="#FF8B5C"
          />
          <BigStat
            index={1}
            value={83}
            suffix="%"
            label="ETL runtime reduction"
            description="Refactored 15+ AWS Glue PySpark pipelines. Cut execution time from 3.5 hours to 35 minutes."
            icon={Clock}
            accent="#FF6B6B"
          />
          <BigStat
            index={2}
            value={96}
            suffix="%"
            label="Deployment time reduction"
            description="Automated multi-cloud K8s provisioning with Docker + Bash. Deploy time: 2 days → 30 minutes."
            icon={Rocket}
            accent="#F59E0B"
          />
        </div>

        {/* Before / After bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="glass-navy rounded-3xl p-8 lg:p-12"
        >
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF8B5C] mb-8">
            Before / After
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <CountdownBar
              from={210}
              to={35}
              fromLabel="3.5 hours"
              toLabel="35 minutes"
              reduction="83% faster"
              accent="#FF6B6B"
              delay={0.3}
              inView={inView}
            />
            <CountdownBar
              from={2880}
              to={30}
              fromLabel="2 days"
              toLabel="30 minutes"
              reduction="96% faster"
              accent="#F59E0B"
              delay={0.6}
              inView={inView}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
