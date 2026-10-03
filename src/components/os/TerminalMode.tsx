"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  TerminalMode — Fully functional client-side UNIX shell            ║
 * ║                                                                    ║
 * ║  Commands:                                                         ║
 * ║    help                  — list all commands                       ║
 * ║    cat resume            — print resume summary                    ║
 * ║    skills [--expert]     — list skills                            ║
 * ║    projects [--scale=L]  — list projects with filters             ║
 * ║    project <id>          — deep dive into a specific project       ║
 * ║    system-status         — uptime, metrics, system health           ║
 * ║    whoami                — identity                                ║
 * ║    contact               — contact info                            ║
 * ║    experience            — career history                          ║
 * ║    awards                — achievements                            ║
 * ║    matrix                — toggle matrix rain overlay               ║
 * ║    sudo hire             — recruitment protocol                    ║
 * ║    theme <name>          — switch accent color                     ║
 * ║    clear                 — clear screen                             ║
 * ║    neofetch              — system info banner                       ║
 * ║    history               — command history                          ║
 * ║    exit                  — back to architecture mode                ║
 * ║                                                                    ║
 * ║  Keyboard:                                                         ║
 * ║    Tab       — autocomplete                                       ║
 * ║    ↑/↓       — command history navigation                          ║
 * ║    Ctrl+L    — clear                                              ║
 * ║    Enter     — execute                                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { useOSStore, type TerminalLine } from "@/store/useOSStore";
import {
  identity,
  contactLinks,
  heroMetrics,
  projects,
  skillTree,
  careerCommits,
  awards,
  competencyRadar,
} from "@/data/resume";

const PROMPT = "vedhas@arch-os:~$ ";

const COMMANDS = [
  "help",
  "cat resume",
  "skills",
  "skills --expert",
  "projects",
  "projects --scale=large",
  "projects --scale=medium",
  "project",
  "system-status",
  "whoami",
  "contact",
  "experience",
  "awards",
  "matrix",
  "sudo hire",
  "theme",
  "theme cyan",
  "theme emerald",
  "theme purple",
  "clear",
  "neofetch",
  "history",
  "exit",
];

const ASCII_LOGO = `
██╗   ██╗██████╗  ██████╗ ███████╗██╗██╗   ██╗███████╗
██║   ██║╚════██╗██╔═══██╗██╔════╝██║██║   ██║██╔════╝
██║   ██║ █████╔╝██║   ██║█████╗  ██║██║   ██║███████╗
╚██╗ ██╔╝██╔═══╝ ██║   ██║██╔══╝  ██║╚██╗ ██╔╝╚════██║
 ╚████╔╝ ███████╗╚██████╔╝██║     ██║ ╚████╔╝ ███████║
  ╚═══╝  ╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═══╝  ╚══════╝
`;

function helpLines(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "system", text: "SYSTEM ARCHITECT OS — Available commands:" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "output", text: "  help                    Show this help message" },
    { id: crypto.randomUUID(), type: "output", text: "  cat resume              Print full resume summary" },
    { id: crypto.randomUUID(), type: "output", text: "  skills [--expert]       List technical skills (--expert = deep dive)" },
    { id: crypto.randomUUID(), type: "output", text: "  projects [--scale=L]    List projects (filter: large, medium)" },
    { id: crypto.randomUUID(), type: "output", text: "  project <id>            Deep dive into a specific project" },
    { id: crypto.randomUUID(), type: "output", text: "  system-status           Live system metrics & uptime" },
    { id: crypto.randomUUID(), type: "output", text: "  whoami                  Identity & current role" },
    { id: crypto.randomUUID(), type: "output", text: "  contact                 Contact channels" },
    { id: crypto.randomUUID(), type: "output", text: "  experience              Career timeline" },
    { id: crypto.randomUUID(), type: "output", text: "  awards                  Achievements & recognition" },
    { id: crypto.randomUUID(), type: "output", text: "  matrix                  Toggle Matrix rain overlay" },
    { id: crypto.randomUUID(), type: "output", text: "  theme <name>            Switch accent (cyan|emerald|purple)" },
    { id: crypto.randomUUID(), type: "output", text: "  neofetch                System info banner" },
    { id: crypto.randomUUID(), type: "output", text: "  history                 Show command history" },
    { id: crypto.randomUUID(), type: "output", text: "  clear                   Clear screen (Ctrl+L)" },
    { id: crypto.randomUUID(), type: "output", text: "  sudo hire               Initiate recruitment protocol" },
    { id: crypto.randomUUID(), type: "output", text: "  exit                    Exit terminal mode" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "Tab = autocomplete · ↑/↓ = history · Ctrl+L = clear" },
  ];
}

function catResume(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "ascii", text: ASCII_LOGO },
    { id: crypto.randomUUID(), type: "output", text: `Name:        ${identity.name}` },
    { id: crypto.randomUUID(), type: "output", text: `Title:       ${identity.title}` },
    { id: crypto.randomUUID(), type: "output", text: `Experience:  ${identity.yearsExperience} years` },
    { id: crypto.randomUUID(), type: "output", text: `Location:    ${identity.location}` },
    { id: crypto.randomUUID(), type: "output", text: `Status:      ${identity.availability}` },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "─── PROFESSIONAL SUMMARY ───" },
    { id: crypto.randomUUID(), type: "output", text: identity.summary },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "─── KEY METRICS ───" },
    ...heroMetrics.flatMap((m) => [
      {
        id: crypto.randomUUID(),
        type: "output" as const,
        text: `  ${m.label.padEnd(35)} ${m.value}${m.suffix}  ${m.description}`,
      },
    ]),
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "─── TYPE 'experience' FOR CAREER · 'skills' FOR TECH STACK ───" },
  ];
}

function skillsLines(expert = false): TerminalLine[] {
  const cats: Record<string, string> = {
    language: "LANGUAGES",
    backend: "BACKEND & FRAMEWORKS",
    data: "DATA ENGINEERING",
    cloud: "CLOUD & DEVOPS",
    database: "DATABASES",
    design: "SYSTEM DESIGN",
  };
  const lines: TerminalLine[] = [];
  if (expert) {
    lines.push({ id: crypto.randomUUID(), type: "system", text: "EXPERT SKILL MATRIX (deep dive):" });
    lines.push({ id: crypto.randomUUID(), type: "output", text: "" });
    for (const s of skillTree) {
      const bar = "█".repeat(Math.round(s.level / 10)) + "░".repeat(10 - Math.round(s.level / 10));
      lines.push({
        id: crypto.randomUUID(),
        type: "output",
        text: `  ${s.label.padEnd(28)} ${bar} ${s.level}%`,
      });
      if (expert) {
        lines.push({
          id: crypto.randomUUID(),
          type: "output",
          text: `    ↳ ${s.description}`,
        });
        lines.push({
          id: crypto.randomUUID(),
          type: "output",
          text: `    ↳ exercised in: ${s.projects.join(", ")}`,
        });
      }
    }
    lines.push({ id: crypto.randomUUID(), type: "output", text: "" });
    lines.push({ id: crypto.randomUUID(), type: "system", text: "─── COMPETENCY RADAR ───" });
    for (const c of competencyRadar) {
      const bar = "▰".repeat(Math.round(c.value / 10)) + "▱".repeat(10 - Math.round(c.value / 10));
      lines.push({
        id: crypto.randomUUID(),
        type: "output",
        text: `  ${c.axis.padEnd(22)} ${bar} ${c.value}  (${c.projects} projects)`,
      });
    }
    return lines;
  }

  lines.push({ id: crypto.randomUUID(), type: "system", text: "TECHNICAL SKILLS:" });
  lines.push({ id: crypto.randomUUID(), type: "output", text: "" });
  for (const [cat, label] of Object.entries(cats)) {
    const skills = skillTree.filter((s) => s.category === cat);
    if (skills.length === 0) continue;
    lines.push({
      id: crypto.randomUUID(),
      type: "system",
      text: `${label}:`,
    });
    lines.push({
      id: crypto.randomUUID(),
      type: "output",
      text: `  ${skills.map((s) => s.label).join(", ")}`,
    });
  }
  lines.push({ id: crypto.randomUUID(), type: "output", text: "" });
  lines.push({
    id: crypto.randomUUID(),
    type: "system",
    text: "Use 'skills --expert' for a deep dive with mastery levels + project linkage.",
  });
  return lines;
}

function projectsLines(scaleFilter?: string): TerminalLine[] {
  const filtered = scaleFilter
    ? projects.filter((p) => p.scale === scaleFilter)
    : projects;
  const lines: TerminalLine[] = [
    {
      id: crypto.randomUUID(),
      type: "system",
      text: `PROJECTS${scaleFilter ? ` [scale=${scaleFilter}]` : ""}: ${filtered.length} system${filtered.length === 1 ? "" : "s"} found`,
    },
    { id: crypto.randomUUID(), type: "output", text: "" },
  ];
  for (const p of filtered) {
    lines.push({
      id: crypto.randomUUID(),
      type: "system",
      text: `▸ ${p.id}  [${p.scale.toUpperCase()}]  ${p.year}`,
    });
    lines.push({
      id: crypto.randomUUID(),
      type: "output",
      text: `  ${p.title}`,
    });
    lines.push({
      id: crypto.randomUUID(),
      type: "output",
      text: `  ${p.company} · ${p.period}`,
    });
    lines.push({
      id: crypto.randomUUID(),
      type: "output",
      text: `  ${p.tagline}`,
    });
    lines.push({
      id: crypto.randomUUID(),
      type: "output",
      text: `  stack: ${p.stack.join(", ")}`,
    });
    lines.push({ id: crypto.randomUUID(), type: "output", text: "" });
  }
  lines.push({
    id: crypto.randomUUID(),
    type: "system",
    text: "Type 'project <id>' for a deep dive into any system.",
  });
  return lines;
}

function projectDeepDive(id: string): TerminalLine[] {
  const p = projects.find((x) => x.id === id || x.slug === id);
  if (!p) {
    return [
      { id: crypto.randomUUID(), type: "error", text: `project: '${id}' not found.` },
      { id: crypto.randomUUID(), type: "output", text: "Available projects:" },
      ...projects.map((x) => ({
        id: crypto.randomUUID(),
        type: "output" as const,
        text: `  ${x.id.padEnd(28)} ${x.title}`,
      })),
    ];
  }
  const lines: TerminalLine[] = [
    { id: crypto.randomUUID(), type: "system", text: `╔══ ${p.title} ══╗` },
    { id: crypto.randomUUID(), type: "output", text: `${p.company} · ${p.period} · ${p.scale.toUpperCase()} scale` },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "output", text: p.description },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "─── ACHIEVEMENTS ───" },
    ...p.achievements.map((a) => ({
      id: crypto.randomUUID(),
      type: "output" as const,
      text: `  ▸ ${a}`,
    })),
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "─── ARCHITECTURE ───" },
    ...p.graph.nodes.map((n) => ({
      id: crypto.randomUUID(),
      type: "output" as const,
      text: `  [${n.type.padEnd(8)}] ${n.label.padEnd(22)} → ${n.tech.join(", ")}`,
    })),
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "─── DATA FLOWS ───" },
    ...p.graph.edges.map((e) => ({
      id: crypto.randomUUID(),
      type: "output" as const,
      text: `  ${e.from} → ${e.to}  [${e.protocol || "tcp"}]  ${e.label}`,
    })),
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "─── IMPACT ───" },
    ...p.deepDive.impactMetrics.map((m) => ({
      id: crypto.randomUUID(),
      type: "output" as const,
      text: `  ${m.label.padEnd(28)} ${m.value}`,
    })),
  ];
  return lines;
}

function systemStatus(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "system", text: "═══ SYSTEM STATUS ═══" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "output", text: "  OS:           System Architect OS v3.14.159" },
    { id: crypto.randomUUID(), type: "output", text: "  Host:         vedhas-kharche.dev" },
    { id: crypto.randomUUID(), type: "output", text: `  Uptime:        99.99% (production-grade)` },
    { id: crypto.randomUUID(), type: "output", text: `  p99 latency:   <40ms` },
    { id: crypto.randomUUID(), type: "output", text: `  Daily load:    500K+ API requests` },
    { id: crypto.randomUUID(), type: "output", text: `  Data processed: 5TB+/day (peak)` },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "  Services:" },
    { id: crypto.randomUUID(), type: "output", text: "    ✓ fastapi-microservices       ACTIVE   500K req/day" },
    { id: crypto.randomUUID(), type: "output", text: "    ✓ databricks-lakehouse        ACTIVE   15+ ETL pipelines" },
    { id: crypto.randomUUID(), type: "output", text: "    ✓ genai-rag-service           ACTIVE   2K+ users" },
    { id: crypto.randomUUID(), type: "output", text: "    ✓ security-log-pipeline        ACTIVE   5TB/day" },
    { id: crypto.randomUUID(), type: "output", text: "    ✓ oauth2-flask-rest            ACTIVE   1M MAU" },
    { id: crypto.randomUUID(), type: "output", text: "    ✓ swayam-platform              ACTIVE   10M+ peak" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "  All systems nominal." },
  ];
}

function whoami(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "output", text: `${identity.name} (${identity.title})` },
    { id: crypto.randomUUID(), type: "output", text: `${identity.yearsExperience} years experience · ${identity.location}` },
    { id: crypto.randomUUID(), type: "output", text: identity.tagline },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "output", text: "Status: " + identity.availability },
  ];
}

function contactLines(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "system", text: "═══ CONTACT CHANNELS ═══" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    ...contactLinks.map((c) => ({
      id: crypto.randomUUID(),
      type: "link" as const,
      text: `  ${c.label.padEnd(12)} ${c.value}`,
      href: c.href,
    })),
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "▸ Click any channel above to initiate contact." },
  ];
}

function experienceLines(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "system", text: "═══ CAREER TIMELINE ═══" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    ...careerCommits.flatMap((c) => [
      {
        id: crypto.randomUUID(),
        type: "system" as const,
        text: `commit ${c.hash}  (${c.date})`,
      },
      {
        id: crypto.randomUUID(),
        type: "output" as const,
        text: `  Author: ${c.company}`,
      },
      {
        id: crypto.randomUUID(),
        type: "output" as const,
        text: `  ${c.title}`,
      },
      {
        id: crypto.randomUUID(),
        type: "output" as const,
        text: `    ${c.body}`,
      },
      {
        id: crypto.randomUUID(),
        type: "output" as const,
        text: `  +${c.additions} -${c.deletions}  (${c.filesChanged} files)`,
      },
      { id: crypto.randomUUID(), type: "output" as const, text: "" },
    ]),
  ];
}

function awardsLines(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "system", text: "═══ ACHIEVEMENTS & AWARDS ═══" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    ...awards.flatMap((a) => [
      {
        id: crypto.randomUUID(),
        type: "system" as const,
        text: `★ ${a.title}  — ${a.issuer}, ${a.year}`,
      },
      {
        id: crypto.randomUUID(),
        type: "output" as const,
        text: `   ${a.description}`,
      },
      { id: crypto.randomUUID(), type: "output" as const, text: "" },
    ]),
  ];
}

function sudoHire(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "system", text: "[sudo] password for vedhas: **********" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "▸ Initiating recruitment protocol..." },
    { id: crypto.randomUUID(), type: "output", text: "  ✓ Verified candidate credentials" },
    { id: crypto.randomUUID(), type: "output", text: "  ✓ 6 years production experience confirmed" },
    { id: crypto.randomUUID(), type: "output", text: "  ✓ 4 companies shipped (Abbott, Forcepoint, Persistent ×2)" },
    { id: crypto.randomUUID(), type: "output", text: "  ✓ 8+ awards including 6× Bravo Excellence" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "═══ RECOMMENDED ACTION ═══" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    {
      id: crypto.randomUUID(),
      type: "link",
      text: "▸ Send email → contact.vedhaskharche@gmail.com",
      href: "mailto:contact.vedhaskharche@gmail.com?subject=Sudo%20Hire%20Protocol%20Initiated",
    },
    {
      id: crypto.randomUUID(),
      type: "link",
      text: "▸ Schedule intro call → calendly.com/vedhas",
      href: "https://calendly.com",
    },
    {
      id: crypto.randomUUID(),
      type: "link",
      text: "▸ LinkedIn → vedhas-kharche",
      href: "https://www.linkedin.com/in/vedhas-kharche",
    },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "Hire-Vedhas protocol ready. Awaiting handshake." },
  ];
}

function neofetch(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "ascii", text: ASCII_LOGO },
    { id: crypto.randomUUID(), type: "system", text: "vedhas@arch-os" },
    { id: crypto.randomUUID(), type: "output", text: "─────────────────────────────────" },
    { id: crypto.randomUUID(), type: "output", text: `OS:         System Architect OS v3.14.159` },
    { id: crypto.randomUUID(), type: "output", text: `Host:       vedhas-kharche.dev` },
    { id: crypto.randomUUID(), type: "output", text: `Kernel:     distributed-systems-6.0` },
    { id: crypto.randomUUID(), type: "output", text: `Uptime:     ${identity.yearsExperience} years` },
    { id: crypto.randomUUID(), type: "output", text: `Shell:      bash 5.1 + zsh 5.8` },
    { id: crypto.randomUUID(), type: "output", text: `Resolution: 99.99% uptime · <40ms p99` },
    { id: crypto.randomUUID(), type: "output", text: `CPU:        AWS EKS · GCP GKE · Kubernetes` },
    { id: crypto.randomUUID(), type: "output", text: `Memory:     5TB+/day processed` },
    { id: crypto.randomUUID(), type: "output", text: `Languages:  Python · SQL · Bash · JavaScript` },
    { id: crypto.randomUUID(), type: "output", text: `Frameworks: FastAPI · Flask · PySpark · Beam` },
    { id: crypto.randomUUID(), type: "output", text: `Cloud:      AWS · GCP · Databricks · Docker` },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "Color palette:" },
    {
      id: crypto.randomUUID(),
      type: "output",
      text: "  ■ obsidian  ■ cyan  ■ emerald  ■ purple  ■ amber  ■ crimson",
    },
  ];
}

function matrixNotice(): TerminalLine[] {
  return [
    { id: crypto.randomUUID(), type: "system", text: "Wake up, Neo..." },
    { id: crypto.randomUUID(), type: "output", text: "The Matrix has you..." },
    { id: crypto.randomUUID(), type: "output", text: "Follow the white rabbit. 🐇" },
    { id: crypto.randomUUID(), type: "output", text: "" },
    { id: crypto.randomUUID(), type: "system", text: "▸ Matrix rain overlay ACTIVATED. Type 'matrix' again to disable." },
  ];
}

function themeNotice(name: string): TerminalLine[] {
  const valid = ["cyan", "emerald", "purple", "amber", "crimson"];
  if (!valid.includes(name)) {
    return [
      {
        id: crypto.randomUUID(),
        type: "error",
        text: `theme: '${name}' not recognized. Available: ${valid.join(", ")}`,
      },
    ];
  }
  return [
    {
      id: crypto.randomUUID(),
      type: "system",
      text: `▸ Accent theme switched to: ${name}`,
    },
  ];
}

function historyLines(history: string[]): TerminalLine[] {
  if (history.length === 0) {
    return [{ id: crypto.randomUUID(), type: "output", text: "(no command history yet)" }];
  }
  return [
    { id: crypto.randomUUID(), type: "system", text: "Command history:" },
    ...history.map((cmd, i) => ({
      id: crypto.randomUUID(),
      type: "output" as const,
      text: `  ${(i + 1).toString().padStart(3, " ")}  ${cmd}`,
    })),
  ];
}

function errorUnknown(cmd: string): TerminalLine[] {
  const base = cmd.split(" ")[0];
  const suggest = COMMANDS.find((c) => c.startsWith(base) || c.includes(base));
  return [
    { id: crypto.randomUUID(), type: "error", text: `command not found: ${cmd}` },
    {
      id: crypto.randomUUID(),
      type: "output",
      text: suggest ? `Did you mean: '${suggest}'?` : "Type 'help' for available commands.",
    },
  ];
}

function executeCommand(rawCmd: string): TerminalLine[] {
  const cmd = rawCmd.trim();
  if (!cmd) return [];
  const lower = cmd.toLowerCase();

  if (lower === "help" || lower === "?") return helpLines();
  if (lower === "cat resume" || lower === "cat resume.txt" || lower === "resume") return catResume();
  if (lower === "skills --expert" || lower === "skills -e") return skillsLines(true);
  if (lower === "skills" || lower === "skills list") return skillsLines(false);
  if (lower.startsWith("projects")) {
    const m = lower.match(/--scale=(\w+)/);
    return projectsLines(m ? m[1] : undefined);
  }
  if (lower.startsWith("project ")) {
    const id = cmd.split(" ").slice(1).join(" ").trim();
    return projectDeepDive(id);
  }
  if (lower === "system-status" || lower === "status" || lower === "uptime") return systemStatus();
  if (lower === "whoami") return whoami();
  if (lower === "contact" || lower === "contacts") return contactLines();
  if (lower === "experience" || lower === "exp") return experienceLines();
  if (lower === "awards" || lower === "awards list") return awardsLines();
  if (lower === "neofetch") return neofetch();
  if (lower === "history") return historyLines(useOSStore.getState().commandHistory);
  if (lower === "matrix") return matrixNotice();
  if (lower.startsWith("theme")) {
    const parts = cmd.split(" ");
    const name = parts[1] || "";
    if (!name) {
      return [
        {
          id: crypto.randomUUID(),
          type: "output",
          text: "Usage: theme <name> (cyan, emerald, purple, amber, crimson)",
        },
      ];
    }
    return themeNotice(name);
  }
  if (lower === "sudo hire" || lower === "hire") return sudoHire();
  if (lower === "ls") {
    return [
      { id: crypto.randomUUID(), type: "output", text: "resume.txt  skills.yaml  projects/  experience.log  awards.md  contact.vcf" },
    ];
  }
  if (lower === "pwd") {
    return [{ id: crypto.randomUUID(), type: "output", text: "/home/vedhas" }];
  }
  if (lower === "echo $SHELL") {
    return [{ id: crypto.randomUUID(), type: "output", text: "/bin/bash" }];
  }
  if (lower.startsWith("echo ")) {
    return [{ id: crypto.randomUUID(), type: "output", text: cmd.slice(5) }];
  }
  if (lower === "exit" || lower === "quit") {
    setTimeout(() => useOSStore.getState().setMode("architecture"), 600);
    return [{ id: crypto.randomUUID(), type: "system", text: "Returning to Architecture mode..." }];
  }
  return errorUnknown(cmd);
}

const LINE_COLOR: Record<TerminalLine["type"], string> = {
  input: "text-white",
  output: "text-[#CBD5E1]",
  error: "text-[var(--color-cyber-crimson)]",
  system: "text-[var(--color-cyber-cyan)] font-bold",
  ascii: "text-[var(--color-cyber-cyan)] text-glow-cyan text-[8px] sm:text-[10px] leading-tight",
  link: "text-[var(--color-cyber-purple)] underline decoration-dotted hover:text-[var(--color-cyber-cyan)] cursor-pointer",
};

export function TerminalMode() {
  const {
    terminalLines,
    appendTerminalBatch,
    clearTerminal,
    pushCommand,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    matrixActive,
    setMatrixActive,
    setMode,
    playSfx,
  } = useOSStore();
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new lines
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [terminalLines]);

  // Focus input on mount + click anywhere in terminal
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const cmd = input;
    if (cmd.trim() === "clear" || cmd.trim() === "cls") {
      clearTerminal();
      setInput("");
      playSfx("success");
      return;
    }
    if (cmd.trim() === "matrix") {
      setMatrixActive(!matrixActive);
    }
    const inputLine: TerminalLine = {
      id: crypto.randomUUID(),
      type: "input",
      text: `${PROMPT}${cmd}`,
    };
    const result = executeCommand(cmd);
    pushCommand(cmd);
    appendTerminalBatch([inputLine, ...result]);
    setInput("");
    setSuggestion("");
    if (result.some((l) => l.type === "error")) playSfx("error");
    else playSfx("success");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    // Enter — submit
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }
    // Tab — autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setSuggestion("");
        playSfx("keypress");
      }
      return;
    }
    // Up / Down — history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIdx =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIdx);
      setInput(commandHistory[newIdx] || "");
      playSfx("keypress");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIdx = historyIndex + 1;
      if (newIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIdx);
        setInput(commandHistory[newIdx] || "");
      }
      playSfx("keypress");
      return;
    }
    // Ctrl+L — clear
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      clearTerminal();
      playSfx("keypress");
      return;
    }
    // Ctrl+C — cancel current line
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      e.preventDefault();
      const inputLine: TerminalLine = {
        id: crypto.randomUUID(),
        type: "input",
        text: `${PROMPT}${input}^C`,
      };
      appendTerminalBatch([inputLine]);
      setInput("");
      playSfx("error");
      return;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInput(v);
    playSfx("keypress");
    // Autocomplete suggestion
    if (v.trim()) {
      const match = COMMANDS.find((c) => c.startsWith(v.trim()) && c !== v.trim());
      setSuggestion(match || "");
    } else {
      setSuggestion("");
    }
  };

  return (
    <div className="mode-flash relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-emerald)]/70 mb-1">
            ▸ mode: cli terminal
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            vedhas@arch-os: ~
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              clearTerminal();
              playSfx("success");
            }}
            className="px-3 py-1.5 rounded-md font-mono text-xs border border-[rgba(0,240,255,0.15)] text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)] hover:border-[var(--color-cyber-cyan)]/40 transition-all"
          >
            clear
          </button>
          <button
            onClick={() => setMatrixActive(!matrixActive)}
            className={`px-3 py-1.5 rounded-md font-mono text-xs border transition-all ${
              matrixActive
                ? "border-[var(--color-cyber-emerald)]/40 text-[var(--color-cyber-emerald)] bg-[var(--color-cyber-emerald)]/10"
                : "border-[rgba(0,240,255,0.15)] text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)]"
            }`}
          >
            matrix: {matrixActive ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setMode("architecture")}
            className="px-3 py-1.5 rounded-md font-mono text-xs border border-[rgba(0,240,255,0.15)] text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)] hover:border-[var(--color-cyber-cyan)]/40 transition-all"
          >
            exit
          </button>
        </div>
      </div>

      {/* Terminal window */}
      <div
        className="relative rounded-lg border border-[rgba(0,240,255,0.2)] bg-[#0A0D12] overflow-hidden scanlines"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[rgba(0,240,255,0.12)] bg-[#11161F]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--color-cyber-crimson)]/80" />
            <span className="w-3 h-3 rounded-full bg-[var(--color-cyber-amber)]/80" />
            <span className="w-3 h-3 rounded-full bg-[var(--color-cyber-emerald)]/80" />
          </div>
          <div className="ml-2 font-mono text-xs text-[var(--color-muted-foreground)]">
            vedhas@arch-os: ~/portfolio
          </div>
          <div className="ml-auto font-mono text-[10px] text-[var(--color-muted-foreground)]">
            bash 5.1 · 132 cols
          </div>
        </div>

        {/* Scrollable output + input */}
        <div
          ref={scrollRef}
          className="relative h-[calc(100vh-280px)] min-h-[480px] overflow-y-auto os-scrollbar p-4 font-mono text-sm leading-relaxed"
        >
          {/* Matrix rain overlay */}
          {matrixActive && <MatrixRain />}

          <div className="relative z-10">
            {terminalLines.map((line) => (
              <LineRenderer key={line.id} line={line} />
            ))}

            {/* Input line */}
            <div className="flex items-center mt-1">
              <span className="text-[var(--color-cyber-emerald)] font-bold whitespace-nowrap">
                {PROMPT}
              </span>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleChange}
                  onKeyDown={handleKey}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="bg-transparent border-none outline-none text-white font-mono text-sm w-full caret-[var(--color-cyber-cyan)]"
                  aria-label="Terminal input"
                />
                {/* Suggestion overlay */}
                {suggestion && input && (
                  <span className="absolute left-0 top-0 text-[var(--color-muted-foreground)]/40 pointer-events-none font-mono text-sm whitespace-nowrap">
                    {suggestion.slice(input.length)}
                  </span>
                )}
              </div>
              <span className="blink-cursor text-[var(--color-cyber-cyan)] -ml-1">▊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick command palette */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["help", "cat resume", "skills --expert", "projects", "system-status", "sudo hire", "neofetch", "matrix"].map(
          (cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInput(cmd);
                inputRef.current?.focus();
                playSfx("keypress");
              }}
              className="px-2 py-1 rounded font-mono text-[11px] border border-[rgba(0,240,255,0.12)] text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)] hover:border-[var(--color-cyber-cyan)]/30 transition-all"
            >
              {cmd}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function LineRenderer({ line }: { line: TerminalLine }) {
  // ASCII art — render with <pre>
  if (line.type === "ascii") {
    return (
      <pre className="font-mono text-[var(--color-cyber-cyan)] text-glow-cyan text-[8px] sm:text-[10px] leading-tight whitespace-pre mb-2">
        {line.text}
      </pre>
    );
  }
  if (line.type === "link" && line.href) {
    return (
      <a
        href={line.href}
        target={line.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block hover:underline text-[var(--color-cyber-purple)] hover:text-[var(--color-cyber-cyan)]"
      >
        {line.text}
      </a>
    );
  }
  if (line.type === "input") {
    return <div className="text-white whitespace-pre-wrap break-all">{line.text}</div>;
  }
  return (
    <div className={`${LINE_COLOR[line.type]} whitespace-pre-wrap break-words`}>
      {line.text || "\u00A0"}
    </div>
  );
}

// ─── Matrix Rain Effect ────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let cols = 0;
    let drops: number[] = [];
    const fontSize = 14;
    const chars = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF$#&%@!?*+=";

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      cols = Math.floor(rect.width / fontSize);
      drops = Array(cols).fill(0).map(() => Math.random() * -100);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement as Element);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 13, 18, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = drops[i] === 0 ? "#FFFFFF" : "rgba(0, 240, 255, 0.5)";
        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-30 pointer-events-none"
      aria-hidden="true"
    />
  );
}
