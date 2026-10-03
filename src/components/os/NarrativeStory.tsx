"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  NarrativeStory — Story-driven intro section with text scramble      ║
 * ║                                                                    ║
 * ║  Walks the visitor through the journey: started at Swayam with     ║
 *  10M users → learned distributed systems the hard way → now          ║
 *  architecting GenAI at Abbott.                                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ScrambleText } from "./ScrambleText";

const STORY_BEATS = [
  {
    year: "2020",
    headline: "It started with 10 million students.",
    body: "Fresh out of college, I joined Persistent Systems to work on Swayam — India's national education platform. The challenge: maintain <100ms response times while 10 million users tried to register at the same time during admission season.",
    accent: "#00FFE1",
    metric: "10M+ users",
    metricLabel: "peak concurrent",
  },
  {
    year: "2022",
    headline: "I learned that scale breaks everything.",
    body: "Promoted to Senior Engineer. Led a team of 4 building OAuth2-secured Flask APIs for 1M+ monthly active users. Automated multi-cloud provisioning with Kubernetes — cut deployment times from 2 days to 30 minutes. That's when I fell in love with distributed systems.",
    accent: "#FF006E",
    metric: "96%",
    metricLabel: "deploy time cut",
  },
  {
    year: "2023",
    headline: "Then came 5 terabytes of daily logs.",
    body: "Forcepoint recruited me to build real-time security pipelines. Apache Spark + Apache Beam processing 5TB of security logs per day across AWS + GCP. 60% p95 latency reduction via multi-column indexing. 15+ engineering hours saved every week through CI/CD automation.",
    accent: "#B6FF00",
    metric: "5TB/day",
    metricLabel: "real-time processing",
  },
  {
    year: "2025",
    headline: "Now I architect systems that don't break.",
    body: "Senior Software Engineer at Abbott. Migrated 15+ AWS Glue ETL pipelines from Redshift to Databricks — 83% runtime reduction (3.5h → 35min). Built FastAPI microservices serving 500K+ daily requests at 99.99% uptime with sub-40ms p99. Shipped a production-grade GenAI RAG microservice replacing legacy AWS Lex for 2,000+ field users.",
    accent: "#8B5CF6",
    metric: "99.99%",
    metricLabel: "production uptime",
  },
];

function StoryBeat({
  beat,
  index,
  inView,
}: {
  beat: (typeof STORY_BEATS)[number];
  index: number;
  inView: boolean;
}) {
  const isEven = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative grid md:grid-cols-[1fr_2fr] gap-6 md:gap-12 items-start ${
        isEven ? "" : "md:[direction:rtl]"
      }`}
    >
      {/* Year + metric */}
      <div className="md:[direction:ltr]">
        <div
          className="inline-block px-3 py-1.5 rounded-md font-mono text-sm font-bold"
          style={{
            backgroundColor: `${beat.accent}15`,
            color: beat.accent,
            border: `1px solid ${beat.accent}40`,
          }}
        >
          {beat.year}
        </div>
        <div className="mt-5 display-md text-5xl text-[#F4F4F5] tabular-nums">
          {beat.metric}
        </div>
        <div className="text-xs font-mono uppercase tracking-wider text-[#6B7280] mt-1">
          {beat.metricLabel}
        </div>
      </div>

      {/* Body */}
      <div className="md:[direction:ltr]">
        <h3 className="display-md text-2xl md:text-3xl text-[#F4F4F5] leading-tight mb-4">
          <ScrambleText
            text={beat.headline}
            duration={900}
            delay={index * 100}
          />
        </h3>
        <p className="text-base text-[#9CA3AF] leading-relaxed">
          {beat.body}
        </p>
      </div>
    </motion.div>
  );
}

export function NarrativeStory() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      id="story"
      ref={ref}
      className="relative py-24 lg:py-32 bg-void overflow-hidden"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-neon opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 lg:mb-24 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-neon text-xs font-mono uppercase tracking-[0.2em] text-[#00FFE1] mb-4">
            The Journey
          </div>
          <h2 className="display-lg text-[clamp(36px,5vw,64px)] text-[#F4F4F5]">
            Six years of{" "}
            <span className="gradient-text-cyan-magenta">hard problems</span>
            <br />
            one trajectory.
          </h2>
        </motion.div>

        {/* Story beats with progress line */}
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-0 md:left-1/3 top-0 bottom-0 w-px bg-[#14141C]">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-[#00FFE1] via-[#8B5CF6] to-[#FF006E]"
            />
          </div>

          <div className="space-y-20 lg:space-y-24">
            {STORY_BEATS.map((beat, i) => (
              <div key={beat.year} className="relative pl-8 md:pl-0">
                {/* Dot on the line */}
                <div
                  className="absolute left-0 md:left-1/3 top-2 w-3 h-3 rounded-full -translate-x-1/2 pulse-neon"
                  style={{
                    backgroundColor: beat.accent,
                    boxShadow: `0 0 12px ${beat.accent}`,
                  }}
                />
                <StoryBeat beat={beat} index={i} inView={inView} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
