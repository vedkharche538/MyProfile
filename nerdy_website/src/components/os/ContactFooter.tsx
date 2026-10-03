"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ContactFooter — bottom band with contact links + boot signature   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, Globe, Code2, Cpu } from "lucide-react";
import { contactLinks, identity } from "@/data/resume";
import { useOSStore } from "@/store/useOSStore";

const ICON_MAP: Record<string, typeof Mail> = {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Code2,
};

export function ContactFooter() {
  const { playSfx, setMode } = useOSStore();
  return (
    <footer className="mt-auto border-t border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
          {/* Brand */}
          <div>
            <button
              onClick={() => setMode("architecture")}
              onMouseEnter={() => playSfx("hover")}
              className="flex items-center gap-2 mb-3"
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#0A0D12]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-cyber-cyan)]/70">
                  System Architect
                </div>
                <div className="font-mono text-base font-bold text-white">
                  OS v3.14.159
                </div>
              </div>
            </button>
            <p className="text-xs text-[var(--color-muted-foreground)] max-w-xs leading-relaxed">
              {identity.name} — {identity.title}. Built with Next.js 16, fully
              static-exported for GitHub Pages. 100% client-side state via
              Zustand. No server, no tracking, no compromises.
            </p>
          </div>

          {/* Contact links */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-cyan)]/70 mb-3">
              ▸ channels
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {contactLinks.map((c) => {
                const Icon = ICON_MAP[c.icon] || Mail;
                return (
                  <motion.a
                    key={c.id}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onMouseEnter={() => playSfx("hover")}
                    whileHover={{ x: 2 }}
                    className="group flex items-center gap-2 px-3 py-2 rounded-md border border-[rgba(0,240,255,0.12)] bg-[#0A0D12]/60 hover:border-[var(--color-cyber-cyan)]/40 hover:bg-[#0A0D12] transition-all"
                  >
                    <Icon className="w-4 h-4 text-[var(--color-cyber-cyan)] shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
                        {c.label}
                      </div>
                      <div className="font-mono text-xs text-white truncate group-hover:text-[var(--color-cyber-cyan)] transition-colors">
                        {c.value}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-6 pt-4 border-t border-[rgba(0,240,255,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[10px] text-[var(--color-muted-foreground)]">
          <div>
            <span className="text-[var(--color-cyber-emerald)]">●</span>{" "}
            Last commit: <span className="text-white">a1b2c3d</span> · feat(ai): ship GenAI RAG microservice
          </div>
          <div className="flex items-center gap-3">
            <span>© 2024 {identity.name}</span>
            <span className="text-[var(--color-cyber-cyan)]/40">·</span>
            <span>Built with Next.js 16 + Zustand + Tailwind CSS 4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
