"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  BootSequence — Initial boot animation                              ║
 * ║  Plays once per session, then calls markBooted().                   ║
 * ║  Defensive: no .startsWith / .replace on potentially-undefined vals  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";
import { useOSStore } from "@/store/useOSStore";

interface BootLine {
  text: string;
  delay: number;
}

const BOOT_LINES: BootLine[] = [
  { text: "Loading kernel: distributed-systems.ko", delay: 100 },
  { text: "Loading kernel: cloud-architecture.ko", delay: 100 },
  { text: "Loading kernel: microservices-runtime.ko", delay: 100 },
  { text: "Loading kernel: generative-ai.ko", delay: 100 },
  { text: "Mounting /dev/career", delay: 120 },
  { text: "Initializing Zustand state store", delay: 110 },
  { text: "Spawning Web Audio API daemon", delay: 110 },
  { text: "Calibrating particle canvas (60fps)", delay: 110 },
  { text: "Loading 7 architecture graphs", delay: 110 },
  { text: "Loading 29 skill nodes", delay: 110 },
  { text: "Loading 8 career commits", delay: 110 },
  { text: "System Architect OS v3.14.159 ready.", delay: 200 },
];

export function BootSequence() {
  const { booted, markBooted } = useOSStore();
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (booted) return;
    let mounted = true;
    let total = 0;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, idx) => {
      total += line.delay;
      const t = setTimeout(() => {
        if (mounted) setVisibleCount(idx + 1);
      }, total);
      timeouts.push(t);
    });

    // After all lines visible, fade out
    const fadeT = setTimeout(() => {
      if (mounted) setDone(true);
    }, total + 400);
    timeouts.push(fadeT);

    const bootT = setTimeout(() => {
      if (mounted) markBooted();
    }, total + 1100);
    timeouts.push(bootT);

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, [booted, markBooted]);

  if (booted) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-[#0A0D12] flex items-center justify-center"
        >
          <div className="w-full max-w-xl px-6">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-md bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center pulse-glow"
              >
                <Cpu className="w-7 h-7 text-[#0A0D12]" strokeWidth={2.5} />
              </motion.div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-cyber-cyan)]/70">
                  System Architect OS
                </div>
                <div className="font-mono text-2xl font-bold text-white">
                  v3.14.159 <span className="text-[var(--color-cyber-cyan)] text-glow-cyan">[BOOT]</span>
                </div>
              </div>
            </div>
            <div className="font-mono text-xs space-y-1 max-h-64 overflow-hidden">
              {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[var(--color-cyber-emerald)] font-bold shrink-0">[ OK ]</span>
                  <span className="text-[#CBD5E1]">{line.text}</span>
                </motion.div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[var(--color-cyber-cyan)] blink-cursor">▊</span>
                <span className="text-[var(--color-muted-foreground)]">loading system...</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
