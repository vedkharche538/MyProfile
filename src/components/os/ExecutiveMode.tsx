"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ExecutiveMode — High-density recruiter-optimized UI                  ║
 * ║                                                                    ║
 * ║  Goal: A senior engineering leader should be able to skim this       ║
 * ║  in 60 seconds and decide whether to call.                          ║
 * ║                                                                    ║
 * ║  Layout:                                                           ║
 * ║    • Header band — name, title, contact chip, "Hire" CTA             ║
 * ║    • Impact strip — 6 quantified metrics                            ║
 * ║    • Two columns:                                                   ║
 ║        – Left: Career timeline (compact)                              ║
 *        – Right: Project cards w/ metrics + stack                      ║
 * ║    • Skill matrix grid                                              ║
 * ║    • Recruiter Action Panel (download resume / email / schedule)      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Code2,
  Download,
  Calendar,
  Trophy,
  Award,
  Star,
  Building2,
  ChevronRight,
  Zap,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import {
  identity,
  contactLinks,
  heroMetrics,
  projects,
  careerCommits,
  awards,
  competencyRadar,
  skillTree,
  education,
} from "@/data/resume";
import { useOSStore } from "@/store/useOSStore";

const CONTACT_ICON: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  codewithved: Code2,
};

const CATEGORY_ACCENT: Record<string, string> = {
  language: "var(--color-cyber-cyan)",
  backend: "var(--color-cyber-emerald)",
  data: "var(--color-cyber-purple)",
  cloud: "var(--color-cyber-amber)",
  database: "var(--color-cyber-crimson)",
  design: "var(--color-cyber-cyan)",
};

export function ExecutiveMode() {
  const { playSfx } = useOSStore();
  const emailHref = contactLinks.find((l) => l.id === "email")?.href;
  const linkedinHref = contactLinks.find((l) => l.id === "linkedin")?.href;
  const githubHref = contactLinks.find((l) => l.id === "github")?.href;

  return (
    <div className="mode-flash mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
      {/* Header band */}
      <div className="mb-6 rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-5 sm:p-6 glass">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-cyan)]/70 mb-1">
              ▸ executive summary · recruiter view
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {identity.name}
            </h2>
            <div className="mt-1 text-base text-[var(--color-cyber-cyan)] font-mono">
              {identity.title}
            </div>
            <div className="mt-2 text-sm text-[var(--color-muted-foreground)] max-w-3xl">
              {identity.summary}
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {contactLinks.slice(0, 4).map((c) => {
                const Icon = CONTACT_ICON[c.icon] || Mail;
                return (
                  <a
                    key={c.id}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onMouseEnter={() => playSfx("hover")}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 text-xs font-mono text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)] hover:border-[var(--color-cyber-cyan)]/40 transition-all"
                    title={c.value}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{c.label}</span>
                  </a>
                );
              })}
            </div>
            <a
              href={emailHref}
              onMouseEnter={() => playSfx("hover")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-mono text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[var(--color-cyber-cyan)] to-[var(--color-cyber-emerald)] text-[#0A0D12] hover:brightness-110 transition-all neon-cyan"
            >
              <Mail className="w-4 h-4" />
              Initiate Contact
            </a>
          </div>
        </div>
      </div>

      {/* Impact strip */}
      <div className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-cyan)]/70 mb-2 flex items-center gap-1.5">
          <Zap className="w-3 h-3" /> quantified engineering impact
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {heroMetrics.slice(0, 6).map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-md border border-[rgba(0,240,255,0.12)] bg-[#0A0D12]/60 hover-glow"
            >
              <div className="font-mono text-xl font-bold text-white tabular-nums">
                {m.value.toLocaleString("en-US", { maximumFractionDigits: m.decimals ?? 0 })}
                <span className="text-sm text-[var(--color-cyber-cyan)] ml-0.5">{m.suffix}</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] font-mono">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Two-column layout: timeline + projects */}
      <div className="grid lg:grid-cols-[380px_1fr] gap-4 mb-6">
        {/* Career timeline (compact) */}
        <div className="rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-cyan)]/70 mb-3 flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> career timeline
          </div>
          <div className="relative pl-4 border-l border-[rgba(0,240,255,0.15)] space-y-3">
            {careerCommits.slice(0, 8).map((c) => (
              <div key={c.id} className="relative group">
                <span
                  className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[var(--color-cyber-cyan)] bg-[#0A0D12] group-hover:bg-[var(--color-cyber-cyan)] transition-all"
                />
                <div className="font-mono text-[10px] text-[var(--color-muted-foreground)]">{c.date}</div>
                <div className="font-mono text-xs font-bold text-white leading-snug">
                  {c.title}
                </div>
                <div className="font-mono text-[11px] text-[var(--color-cyber-cyan)]/80">
                  {c.company} · +{c.additions} -{c.deletions}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project cards */}
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-cyan)]/70 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" /> flagship projects
            </span>
            <span className="text-[var(--color-muted-foreground)]">{projects.length} systems</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-4 hover-glow"
                style={{ borderColor: `${p.accentColor}25` }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-mono text-sm font-bold text-white leading-snug">
                    {p.title}
                  </h3>
                  <span
                    className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${p.accentColor}15`,
                      color: p.accentColor,
                      border: `1px solid ${p.accentColor}40`,
                    }}
                  >
                    {p.scale}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[var(--color-muted-foreground)] mb-2">
                  {p.company} · {p.period}
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-snug mb-3">
                  {p.tagline}
                </p>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {p.deepDive.impactMetrics.slice(0, 4).map((m) => (
                    <div
                      key={m.label}
                      className="px-1.5 py-1 rounded bg-[#0A0D12]/60 border border-[rgba(0,240,255,0.08)]"
                    >
                      <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
                        {m.label}
                      </div>
                      <div className="font-mono text-xs font-bold" style={{ color: p.accentColor }}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.stack.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#0A0D12] border border-[rgba(0,240,255,0.15)] text-[var(--color-muted-foreground)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Competency radar + skill matrix */}
      <div className="grid lg:grid-cols-[1fr_2fr] gap-4 mb-6">
        {/* Competency radar (CSS-only bar chart) */}
        <div className="rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-cyan)]/70 mb-3">
            ▸ competency matrix
          </div>
          <div className="space-y-2.5">
            {competencyRadar.map((c) => (
              <div key={c.axis}>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-white">{c.axis}</span>
                  <span className="text-[var(--color-cyber-cyan)]">{c.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#0A0D12] border border-[rgba(0,240,255,0.1)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, var(--color-cyber-cyan), var(--color-cyber-emerald))",
                    }}
                  />
                </div>
                <div className="mt-0.5 text-[10px] text-[var(--color-muted-foreground)] font-mono">
                  {c.projects} project{c.projects === 1 ? "" : "s"} · {c.value >= 90 ? "expert" : c.value >= 80 ? "advanced" : "proficient"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill matrix grid */}
        <div className="rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-cyan)]/70 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> technical skill matrix
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {skillTree.map((s) => (
              <div
                key={s.id}
                className="px-2 py-1.5 rounded border border-[rgba(0,240,255,0.08)] bg-[#0A0D12]/40 group hover:border-[rgba(0,240,255,0.3)] transition-all"
                title={s.description}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs text-white truncate">{s.label}</span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: CATEGORY_ACCENT[s.category] }}
                  >
                    {s.level}%
                  </span>
                </div>
                <div className="mt-1 h-0.5 rounded-full bg-[#0A0D12] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.level}%`,
                      backgroundColor: CATEGORY_ACCENT[s.category],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Awards + Education */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4 mb-6">
        <div className="rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-amber)]/80 mb-3 flex items-center gap-1.5">
            <Trophy className="w-3 h-3" /> awards & recognition
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {awards.map((a) => {
              const Icon = a.icon === "Trophy" ? Trophy : a.icon === "Star" ? Star : Award;
              return (
                <div
                  key={a.id}
                  className="p-3 rounded-md border border-[rgba(245,158,11,0.2)] bg-[#0A0D12]/60"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-[var(--color-cyber-amber)]" />
                    <span className="font-mono text-[10px] text-[var(--color-muted-foreground)]">
                      {a.year}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-white leading-snug">
                    {a.title}
                  </div>
                  <div className="mt-0.5 text-[10px] text-[var(--color-cyber-amber)]/80 font-mono">
                    {a.issuer}
                  </div>
                  <div className="mt-1.5 text-[11px] text-[var(--color-muted-foreground)] leading-snug">
                    {a.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-purple)]/80 mb-3">
            ▸ education
          </div>
          <div className="font-mono text-sm font-bold text-white leading-snug">
            {education.degree}
          </div>
          <div className="mt-1 font-mono text-xs text-[var(--color-muted-foreground)]">
            {education.institution}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[var(--color-cyber-purple)]">
            {education.period} · GPA {education.gpa}
          </div>
        </div>
      </div>

      {/* Recruiter action panel */}
      <RecruiterActionPanel
        emailHref={emailHref}
        linkedinHref={linkedinHref}
        githubHref={githubHref}
      />
    </div>
  );
}

function RecruiterActionPanel({
  emailHref,
  linkedinHref,
  githubHref,
}: {
  emailHref?: string;
  linkedinHref?: string;
  githubHref?: string;
}) {
  const { playSfx } = useOSStore();
  return (
    <div className="rounded-lg border border-[rgba(0,240,255,0.3)] bg-gradient-to-br from-[#0A0D12]/80 to-[#11161F]/80 p-5 glass-strong">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-emerald)]/80 mb-1">
            ▸ recruiter action panel
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            Ready to initiate recruitment protocol?
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Senior / Staff Engineer roles · Remote or hybrid · Available immediately
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
          <a
            href={emailHref}
            onMouseEnter={() => playSfx("hover")}
            className="inline-flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-md border border-[var(--color-cyber-cyan)]/40 bg-[var(--color-cyber-cyan)]/10 text-[var(--color-cyber-cyan)] hover:bg-[var(--color-cyber-cyan)]/20 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Email</span>
          </a>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSfx("hover")}
            className="inline-flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-md border border-[var(--color-cyber-emerald)]/40 bg-[var(--color-cyber-emerald)]/10 text-[var(--color-cyber-emerald)] hover:bg-[var(--color-cyber-emerald)]/20 transition-all"
          >
            <Linkedin className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-wider">LinkedIn</span>
          </a>
          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSfx("hover")}
            className="inline-flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-md border border-[var(--color-cyber-purple)]/40 bg-[var(--color-cyber-purple)]/10 text-[var(--color-cyber-purple)] hover:bg-[var(--color-cyber-purple)]/20 transition-all"
          >
            <Github className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-wider">GitHub</span>
          </a>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSfx("hover")}
            className="inline-flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-md bg-gradient-to-br from-[var(--color-cyber-cyan)] to-[var(--color-cyber-emerald)] text-[#0A0D12] hover:brightness-110 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Schedule</span>
          </a>
        </div>
      </div>
    </div>
  );
}
