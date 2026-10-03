"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AnimatedMetrics — Count-up numbers on scroll-in-view               ║
 * ║                                                                    ║
 * ║  6 hero metrics from resume:                                       ║
 *    500K+ daily requests · 99.99% uptime · 83% ETL reduction           ║
 *    96% deploy reduction · 1M+ MAU · 10M+ peak users                  ║
 * ║                                                                    ║
 * ║  Big editorial typography, gradient accents, scroll-triggered.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { heroMetrics, type Metric } from "@/data/resume";

function CountUp({ metric, index }: { metric: Metric; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: metric.decimals ?? 0,
      maximumFractionDigits: metric.decimals ?? 0,
    }),
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(count, metric.value, {
        duration: 2.2,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [inView, metric.value, count]);

  // Alternating accent colors
  const accents = ["#FF6B6B", "#FF8B5C", "#F59E0B", "#FF6B6B", "#FF8B5C", "#F59E0B"];
  const accent = accents[index % accents.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative">
        {/* Big number */}
        <div className="flex items-baseline gap-1">
          {metric.prefix && (
            <span
              className="display-md text-3xl lg:text-4xl"
              style={{ color: accent }}
            >
              {metric.prefix}
            </span>
          )}
          <motion.span
            className="display-lg text-[clamp(48px,7vw,96px)] tabular-nums"
            style={{ color: accent }}
          >
            {rounded}
          </motion.span>
          <span
            className="display-md text-3xl lg:text-4xl"
            style={{ color: accent }}
          >
            {metric.suffix}
          </span>
        </div>

        {/* Label */}
        <div className="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wider text-[#1A1F3A]">
          {metric.label}
        </div>

        {/* Description */}
        <div className="mt-1 text-xs sm:text-sm text-[#6B5B4F] leading-snug max-w-[260px]">
          {metric.description}
        </div>
      </div>

      {/* Decorative line under number */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: index * 0.08 + 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-px mt-5 origin-left"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </motion.div>
  );
}

export function AnimatedMetrics() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 bg-cream-grain overflow-hidden"
    >
      {/* Subtle floating shapes in background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute top-10 left-[5%] w-32 h-32 rounded-full float-slow"
          style={{
            background: "radial-gradient(circle, rgba(255,107,107,0.3), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-20 right-[10%] w-48 h-48 rounded-full float-medium"
          style={{
            background: "radial-gradient(circle, rgba(255,139,92,0.25), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE8D6] border border-[#FF8B5C]/20 text-xs uppercase tracking-[0.2em] font-medium text-[#FF6B6B] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />
            Quantified Impact
          </div>
          <h2 className="display-lg text-[clamp(36px,5vw,64px)] text-[#1A1F3A] max-w-3xl">
            Numbers that{" "}
            <span className="gradient-text-sunset italic">actually mean</span>{" "}
            something.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#6B5B4F] max-w-2xl">
            Not vanity metrics — these are real production numbers from systems
            I've architected, deployed, and operated. Counted up live as you scroll.
          </p>
        </motion.div>

        {/* Metric grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {heroMetrics.slice(0, 6).map((m, i) => (
            <CountUp key={m.id} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
