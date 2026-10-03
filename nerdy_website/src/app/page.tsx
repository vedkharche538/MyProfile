"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  The System Architect OS — Main page                                ║
 * ║                                                                    ║
 * ║  3-mode toggle portfolio for Vedhas Kharche                         ║
 * ║    • Architecture Mode (3D node graph)                              ║
 * ║    • Terminal Mode (CLI shell)                                      ║
 * ║    • Executive Mode (recruiter UI)                                  ║
 * ║                                                                    ║
 * ║  100% client-side. SSG-ready for GitHub Pages.                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/store/useOSStore";
import { BootSequence } from "@/components/os/BootSequence";
import { OSHeader } from "@/components/os/OSHeader";
import { HeroSection } from "@/components/os/HeroSection";
import { ArchitectureMode } from "@/components/os/ArchitectureMode";
import { TerminalMode } from "@/components/os/TerminalMode";
import { ExecutiveMode } from "@/components/os/ExecutiveMode";
import { ContactFooter } from "@/components/os/ContactFooter";

export default function Page() {
  const { activeMode, booted } = useOSStore();

  // Body class hook for mode-based effects
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.style.backgroundColor = "#0A0D12";
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0D12] text-[#E2E8F0]">
      <BootSequence />
      <OSHeader />
      <HeroSection />

      {/* Mode switcher view */}
      <section className="relative flex-1 border-t border-[rgba(0,240,255,0.12)]">
        {/* Mode indicator strip */}
        <div className="border-b border-[rgba(0,240,255,0.08)] bg-[#0A0D12]/80 backdrop-blur-sm">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between font-mono text-[10px] text-[var(--color-muted-foreground)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyber-emerald)] animate-pulse" />
                ACTIVE MODE:
              </span>
              <span className="text-[var(--color-cyber-cyan)] font-bold uppercase tracking-wider">
                {activeMode}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span>Tab: autocomplete</span>
              <span>↑↓: history</span>
              <span>Ctrl+L: clear</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeMode === "architecture" && <ArchitectureMode />}
            {activeMode === "terminal" && <TerminalMode />}
            {activeMode === "executive" && <ExecutiveMode />}
          </motion.div>
        </AnimatePresence>
      </section>

      <ContactFooter />
    </main>
  );
}
