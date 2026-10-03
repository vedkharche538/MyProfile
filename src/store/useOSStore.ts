/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  useOSStore — The System Architect OS global state                   ║
 * ║  Zustand store. 100% client-side. No persistence to server.          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Owned state:
 *   • activeMode     — 'architecture' | 'terminal' | 'executive'
 *   • audioEnabled   — cyberpunk sound effects on/off
 *   • terminalLines  — history of { type, text } entries
 *   • commandHistory — for ↑/↓ navigation
 *   • selectedProjectId — drives the architecture drawer + executive focus
 *   • hoveredNodeId  — for graph hover state
 *   • activeSkillFilter — filters skill tree by category
 *   • matrixActive   — controls matrix rain overlay in terminal mode
 *
 * The store is intentionally SSR-safe: no window/audio access at module
 * load. All Web Audio lazy-initialised on first user interaction.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Mode } from "@/data/resume";

export type TerminalLineType = "input" | "output" | "error" | "system" | "ascii" | "link";

export interface TerminalLine {
  id: string;
  type: TerminalLineType;
  text: string;
  href?: string;
}

export type SkillCategory =
  | "all"
  | "language"
  | "backend"
  | "data"
  | "cloud"
  | "database"
  | "design";

interface OSState {
  // ─── Mode ──────────────────────────────────────────────────────────
  activeMode: Mode;
  setMode: (mode: Mode) => void;
  cycleMode: () => void;

  // ─── Audio ─────────────────────────────────────────────────────────
  audioEnabled: boolean;
  toggleAudio: () => void;
  /** Fire-and-forget sound effect via Web Audio API. */
  playSfx: (type: "keypress" | "hover" | "mode-switch" | "error" | "success") => void;

  // ─── Terminal ──────────────────────────────────────────────────────
  terminalLines: TerminalLine[];
  commandHistory: string[];
  historyIndex: number;
  matrixActive: boolean;
  appendTerminal: (line: TerminalLine) => void;
  appendTerminalBatch: (lines: TerminalLine[]) => void;
  clearTerminal: () => void;
  pushCommand: (cmd: string) => void;
  setHistoryIndex: (i: number) => void;
  setMatrixActive: (active: boolean) => void;

  // ─── Architecture mode ────────────────────────────────────────────
  selectedProjectId: string | null;
  hoveredNodeId: string | null;
  selectProject: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;

  // ─── Skill tree ───────────────────────────────────────────────────
  activeSkillFilter: SkillCategory;
  setSkillFilter: (cat: SkillCategory) => void;

  // ─── Boot animation ───────────────────────────────────────────────
  booted: boolean;
  markBooted: () => void;
}

// ─── Audio engine (lazy) ─────────────────────────────────────────────
let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtx = new Ctx();
    } catch {
      audioCtx = null;
    }
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "square", gainVal = 0.04) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

const SFX_MAP: Record<
  "keypress" | "hover" | "mode-switch" | "error" | "success",
  () => void
> = {
  keypress: () => playTone(2200 + Math.random() * 200, 0.04, "square", 0.02),
  hover: () => playTone(880, 0.06, "sine", 0.03),
  "mode-switch": () => {
    playTone(440, 0.08, "sawtooth", 0.05);
    setTimeout(() => playTone(660, 0.08, "sawtooth", 0.05), 60);
    setTimeout(() => playTone(880, 0.12, "sawtooth", 0.05), 120);
  },
  error: () => {
    playTone(180, 0.15, "square", 0.06);
    setTimeout(() => playTone(120, 0.2, "square", 0.06), 100);
  },
  success: () => {
    playTone(523, 0.08, "sine", 0.04);
    setTimeout(() => playTone(659, 0.08, "sine", 0.04), 80);
    setTimeout(() => playTone(784, 0.12, "sine", 0.04), 160);
  },
};

const BOOT_SEQUENCE: TerminalLine[] = [
  { id: "boot-0", type: "system", text: "SYSTEM ARCHITECT OS v3.14.159" },
  { id: "boot-1", type: "system", text: "Copyright (c) 2024 Vedhas Kharche. All rights reserved." },
  { id: "boot-2", type: "output", text: "" },
  { id: "boot-3", type: "output", text: "Initializing kernel modules..." },
  { id: "boot-4", type: "output", text: "  ✓ distributed-systems.ko" },
  { id: "boot-5", type: "output", text: "  ✓ cloud-architecture.ko" },
  { id: "boot-6", type: "output", text: "  ✓ microservices-runtime.ko" },
  { id: "boot-7", type: "output", text: "  ✓ generative-ai.ko" },
  { id: "boot-8", type: "output", text: "" },
  { id: "boot-9", type: "output", text: "Mounting /dev/career ..." },
  { id: "boot-10", type: "output", text: "  6 years experience, 4 companies, 7+ shipped platforms" },
  { id: "boot-11", type: "output", text: "" },
  { id: "boot-12", type: "system", text: "Type 'help' to list available commands." },
  { id: "boot-13", type: "system", text: "Type 'sudo hire' to initiate recruitment protocol." },
  { id: "boot-14", type: "output", text: "" },
];

let lineIdCounter = 100;
const nextLineId = () => `line-${lineIdCounter++}`;

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      // ── Mode ─────────────────────────────────────────────────────
      activeMode: "architecture",
      setMode: (mode) => {
        if (get().audioEnabled) SFX_MAP["mode-switch"]();
        set({ activeMode: mode });
      },
      cycleMode: () => {
        const order: Mode[] = ["architecture", "terminal", "executive"];
        const i = order.indexOf(get().activeMode);
        const next = order[(i + 1) % order.length];
        if (get().audioEnabled) SFX_MAP["mode-switch"]();
        set({ activeMode: next });
      },

      // ── Audio ────────────────────────────────────────────────────
      audioEnabled: false,
      toggleAudio: () => {
        const next = !get().audioEnabled;
        if (next) {
          // Resume audio context (browser autoplay policy)
          const ctx = getAudioCtx();
          if (ctx && ctx.state === "suspended") void ctx.resume();
          SFX_MAP["success"]();
        }
        set({ audioEnabled: next });
      },
      playSfx: (type) => {
        if (!get().audioEnabled) return;
        SFX_MAP[type]();
      },

      // ── Terminal ────────────────────────────────────────────────
      terminalLines: BOOT_SEQUENCE.map((l) => ({ ...l })),
      commandHistory: [],
      historyIndex: -1,
      matrixActive: false,
      appendTerminal: (line) =>
        set((s) => ({
          terminalLines: [...s.terminalLines, { ...line, id: line.id || nextLineId() }],
        })),
      appendTerminalBatch: (lines) =>
        set((s) => ({
          terminalLines: [
            ...s.terminalLines,
            ...lines.map((l) => ({ ...l, id: l.id || nextLineId() })),
          ],
        })),
      clearTerminal: () => set({ terminalLines: [] }),
      pushCommand: (cmd) =>
        set((s) => ({
          commandHistory: [...s.commandHistory, cmd],
          historyIndex: -1,
        })),
      setHistoryIndex: (i) => set({ historyIndex: i }),
      setMatrixActive: (active) => set({ matrixActive: active }),

      // ── Architecture mode ────────────────────────────────────────
      selectedProjectId: null,
      hoveredNodeId: null,
      selectProject: (id) => {
        if (get().audioEnabled && id) SFX_MAP["success"]();
        set({ selectedProjectId: id });
      },
      setHoveredNode: (id) => {
        if (get().audioEnabled && id) SFX_MAP["hover"]();
        set({ hoveredNodeId: id });
      },

      // ── Skill tree ──────────────────────────────────────────────
      activeSkillFilter: "all",
      setSkillFilter: (cat) => set({ activeSkillFilter: cat }),

      // ── Boot ─────────────────────────────────────────────────────
      booted: false,
      markBooted: () => set({ booted: true }),
    }),
    {
      name: "system-architect-os",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          // SSR-safe fallback
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      // Persist only user-preferences; terminal state resets on each load.
      partialize: (s) => ({
        activeMode: s.activeMode,
        audioEnabled: s.audioEnabled,
        activeSkillFilter: s.activeSkillFilter,
      }),
    }
  )
);
