"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  OSHeader — Top navigation bar with mode toggles + audio            ║
 * ║                                                                    ║
 * ║  • [3D Graph]     → architecture mode                              ║
 * ║  • [CLI Terminal] → terminal mode                                   ║
 * ║  • [Executive UI] → executive mode                                 ║
 * ║  • 🔊 audio toggle (Web Audio API SFX)                            ║
 * ║  • Live status badges (uptime / latency / requests)               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion } from "framer-motion";
import {
  Network,
  TerminalSquare,
  LayoutDashboard,
  Volume2,
  VolumeX,
  Github,
  Mail,
  Cpu,
} from "lucide-react";
import { useOSStore } from "@/store/useOSStore";
import { identity, contactLinks } from "@/data/resume";
import { useState, useEffect } from "react";

const MODES = [
  {
    id: "architecture" as const,
    label: "3D Graph",
    short: "ARC",
    icon: Network,
    color: "cyan",
    description: "Interactive node graph",
  },
  {
    id: "terminal" as const,
    label: "CLI Terminal",
    short: "CLI",
    icon: TerminalSquare,
    color: "emerald",
    description: "Functional UNIX shell",
  },
  {
    id: "executive" as const,
    label: "Executive UI",
    short: "EXEC",
    icon: LayoutDashboard,
    color: "purple",
    description: "Recruiter-optimized",
  },
] as const;

const COLOR_MAP = {
  cyan: { active: "var(--color-cyber-cyan)", glow: "rgba(0,240,255,0.5)" },
  emerald: { active: "var(--color-cyber-emerald)", glow: "rgba(16,185,129,0.5)" },
  purple: { active: "var(--color-cyber-purple)", glow: "rgba(139,92,246,0.5)" },
};

export function OSHeader() {
  const { activeMode, setMode, audioEnabled, toggleAudio, playSfx } = useOSStore();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss} UTC`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-[rgba(0,240,255,0.15)]">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 py-2.5 flex items-center gap-3 sm:gap-4">
        {/* ─── Brand / Logo ─── */}
        <button
          onClick={() => setMode("architecture")}
          className="group flex items-center gap-2.5 shrink-0"
          aria-label="System Architect OS — Home"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center pulse-glow">
              <Cpu className="w-5 h-5 text-[#0A0D12]" strokeWidth={2.5} />
            </div>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-cyber-cyan)]/70">
              System Architect
            </span>
            <span className="font-mono text-sm font-bold text-white tracking-tight">
              OS <span className="text-[var(--color-cyber-cyan)]">v3.14</span>
            </span>
          </div>
        </button>

        {/* ─── Mode switcher ─── */}
        <nav
          role="tablist"
          aria-label="UI mode selector"
          className="flex items-center gap-1 p-1 rounded-md bg-[#0A0D12]/60 border border-[rgba(0,240,255,0.12)]"
        >
          {MODES.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;
            const c = COLOR_MAP[m.color];
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setMode(m.id)}
                onMouseEnter={() => playSfx("hover")}
                className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-mono font-medium transition-all ${
                  isActive
                    ? "text-[#0A0D12]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)]"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: c.active,
                        boxShadow: `0 0 12px ${c.glow}`,
                      }
                    : undefined
                }
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span className="hidden md:inline">{m.label}</span>
                <span className="md:hidden font-bold tracking-wider">{m.short}</span>
                {isActive && (
                  <motion.span
                    layoutId="mode-active-indicator"
                    className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: c.active }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ─── Live status (hidden on mobile) ─── */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-[11px] text-[var(--color-muted-foreground)] ml-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyber-emerald)] animate-pulse" />
            <span>99.99% uptime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--color-cyber-cyan)]">p99</span>
            <span className="text-white">&lt;40ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--color-cyber-purple)]">time</span>
            <span className="text-white tabular-nums">{time}</span>
          </div>
        </div>

        {/* ─── Right actions ─── */}
        <div className="ml-auto flex items-center gap-1.5">
          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            onMouseEnter={() => playSfx("hover")}
            aria-label={audioEnabled ? "Disable audio effects" : "Enable audio effects"}
            title={audioEnabled ? "Audio: ON" : "Audio: OFF"}
            className={`relative w-9 h-9 rounded-md flex items-center justify-center border transition-all ${
              audioEnabled
                ? "border-[var(--color-cyber-cyan)]/50 bg-[var(--color-cyber-cyan)]/10 text-[var(--color-cyber-cyan)]"
                : "border-[rgba(0,240,255,0.12)] text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)]"
            }`}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {audioEnabled && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--color-cyber-emerald)] animate-pulse" />
            )}
          </button>

          {/* GitHub */}
          <a
            href={contactLinks.find((l) => l.id === "github")?.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSfx("hover")}
            aria-label="GitHub"
            className="w-9 h-9 rounded-md flex items-center justify-center border border-[rgba(0,240,255,0.12)] text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)] hover:border-[var(--color-cyber-cyan)]/50 transition-all"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Email */}
          <a
            href={contactLinks.find((l) => l.id === "email")?.href}
            onMouseEnter={() => playSfx("hover")}
            aria-label="Email Vedhas"
            className="hidden sm:flex w-9 h-9 rounded-md items-center justify-center border border-[rgba(0,240,255,0.12)] text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)] hover:border-[var(--color-cyber-cyan)]/50 transition-all"
          >
            <Mail className="w-4 h-4" />
          </a>

          {/* CTA */}
          <a
            href={contactLinks.find((l) => l.id === "email")?.href}
            onMouseEnter={() => playSfx("hover")}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[var(--color-cyber-cyan)] to-[var(--color-cyber-emerald)] text-[#0A0D12] hover:brightness-110 transition-all"
          >
            ▸ Hire Vedhas
          </a>
        </div>
      </div>
    </header>
  );
}
