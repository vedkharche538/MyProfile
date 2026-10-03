"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ArchitectureMode — Interactive 2.5D node graph                      ║
 * ║                                                                    ║
 * ║  Pure HTML5 Canvas implementation — no Three.js dependency for      ║
 * ║  SSG weight.                                                       ║
 * ║                                                                    ║
 * ║  Features:                                                         ║
 * ║   • Project selector rail (left)                                   ║
 * ║   • Animated graph with nodes, edges, data-flow particles            ║
 * ║   • Hover tooltips with tech stack                                  ║
 * ║   • Click node → opens side drawer with deep dive                   ║
 * ║   • Auto-rotating camera (subtle parallax via pointer position)      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  Cpu,
  Database,
  Zap,
  Radio,
  Server,
  Globe,
  Brain,
  GitBranch,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useOSStore } from "@/store/useOSStore";
import { projects, type Project, type ArchitectureNode } from "@/data/resume";

// Node type → color + icon
const NODE_STYLE: Record<
  ArchitectureNode["type"],
  { color: string; icon: typeof Cpu; label: string }
> = {
  service: { color: "#00F0FF", icon: Server, label: "Service" },
  database: { color: "#10B981", icon: Database, label: "Database" },
  cache: { color: "#F59E0B", icon: Zap, label: "Cache" },
  stream: { color: "#8B5CF6", icon: Radio, label: "Stream" },
  gateway: { color: "#06B6D4", icon: GitBranch, label: "Gateway" },
  client: { color: "#E2E8F0", icon: Globe, label: "Client" },
  ai: { color: "#EC4899", icon: Brain, label: "AI / ML" },
};

interface RenderedNode {
  id: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  label: string;
  type: ArchitectureNode["type"];
  color: string;
  tech: string[];
  description: string;
  vx: number;
  vy: number;
}

interface FlowParticle {
  edgeIdx: number;
  t: number; // 0..1 progress along edge
  speed: number;
}

interface ArchitectureGraphProps {
  project: Project;
}

function ArchitectureGraph({ project }: ArchitectureGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { hoveredNodeId, setHoveredNode, selectProject, selectedProjectId } = useOSStore();
  const hoveredRef = useRef<string | null>(null);

  // Derive rendered nodes + flow particles from project.graph via useMemo
  // (no setState-in-effect, no ref mutation during render)
  const [nodes, particles] = useMemo(() => {
    const ns: RenderedNode[] = project.graph.nodes.map((n) => ({
      id: n.id,
      baseX: n.x,
      baseY: n.y,
      x: n.x,
      y: n.y,
      vx: 0,
      vy: 0,
      label: n.label,
      type: n.type,
      color: NODE_STYLE[n.type].color,
      tech: n.tech,
      description: n.description,
    }));
    const ps: FlowParticle[] = project.graph.edges.map((_, i) => ({
      edgeIdx: i,
      t: Math.random(),
      speed: 0.0015 + Math.random() * 0.002,
    }));
    return [ns, ps] as const;
  }, [project.id]);

  // Mutable refs for canvas animation loop (avoid re-renders on each frame)
  const nodesRef = useRef<RenderedNode[]>(nodes);
  const particlesRef = useRef<FlowParticle[]>(particles);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  // Sync derived arrays into refs whenever project changes
  useEffect(() => {
    nodesRef.current = nodes;
    particlesRef.current = particles;
  }, [nodes, particles]);

  // Sync hovered ref to latest value (avoids stale closure in canvas loop)
  useEffect(() => {
    hoveredRef.current = hoveredNodeId;
  }, [hoveredNodeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let time = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = Math.max(420, rect.height);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    const nodeRadius = 26;

    const nodeAt = (mx: number, my: number): RenderedNode | null => {
      for (const n of nodesRef.current) {
        const px = (n.x / 100) * width;
        const py = (n.y / 100) * height;
        const dx = mx - px;
        const dy = my - py;
        if (dx * dx + dy * dy < (nodeRadius + 6) ** 2) return n;
      }
      return null;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hit = nodeAt(mx, my);
      if (hit) selectProject(project.id);
    };

    const onMoveHover = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hit = nodeAt(mx, my);
      const current = hoveredRef.current;
      if ((hit?.id || null) !== current) {
        setHoveredNode(hit?.id || null);
      }
    };
    container.addEventListener("click", onClick);
    container.addEventListener("mousemove", onMoveHover);

    const tick = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // ─── Background grid (faint) ───
      ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ─── Compute parallax offset from pointer ───
      const px = pointerRef.current.active ? (pointerRef.current.x / width - 0.5) * 16 : 0;
      const py = pointerRef.current.active ? (pointerRef.current.y / height - 0.5) * 16 : 0;

      // ─── Update node positions (gentle bobbing + parallax) ───
      for (const n of nodesRef.current) {
        const bobX = Math.sin(time + n.baseX * 0.1) * 1.5;
        const bobY = Math.cos(time * 0.8 + n.baseY * 0.1) * 1.5;
        n.x = n.baseX + (bobX / width) * 100 + (px / width) * 100;
        n.y = n.baseY + (bobY / height) * 100 + (py / height) * 100;
      }

      // ─── Draw edges ───
      project.graph.edges.forEach((edge, i) => {
        const from = nodesRef.current.find((n) => n.id === edge.from);
        const to = nodesRef.current.find((n) => n.id === edge.to);
        if (!from || !to) return;
        const fx = (from.x / 100) * width;
        const fy = (from.y / 100) * height;
        const tx = (to.x / 100) * width;
        const ty = (to.y / 100) * height;
        const isHovered =
          hoveredRef.current === edge.from || hoveredRef.current === edge.to;

        // Edge line
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = isHovered
          ? "rgba(0, 240, 255, 0.55)"
          : "rgba(0, 240, 255, 0.18)";
        ctx.lineWidth = isHovered ? 1.6 : 1;
        ctx.stroke();

        // Edge label
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2;
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillStyle = isHovered
          ? "rgba(0, 240, 255, 0.9)"
          : "rgba(107, 124, 147, 0.7)";
        ctx.textAlign = "center";
        ctx.fillText(edge.label, mx, my - 4);

        // Protocol chip
        if (edge.protocol) {
          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillStyle = "rgba(139, 92, 246, 0.5)";
          ctx.fillText(`[${edge.protocol}]`, mx, my + 8);
        }
      });

      // ─── Draw flow particles ───
      for (const p of particlesRef.current) {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const edge = project.graph.edges[p.edgeIdx];
        if (!edge) continue;
        const from = nodesRef.current.find((n) => n.id === edge.from);
        const to = nodesRef.current.find((n) => n.id === edge.to);
        if (!from || !to) continue;
        const fx = (from.x / 100) * width;
        const fy = (from.y / 100) * height;
        const tx = (to.x / 100) * width;
        const ty = (to.y / 100) * height;
        const px2 = fx + (tx - fx) * p.t;
        const py2 = fy + (ty - fy) * p.t;

        // Glow
        const grad = ctx.createRadialGradient(px2, py2, 0, px2, py2, 8);
        grad.addColorStop(0, "rgba(0, 240, 255, 0.9)");
        grad.addColorStop(1, "rgba(0, 240, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px2, py2, 8, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px2, py2, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // ─── Draw nodes ───
      for (const n of nodesRef.current) {
        const nx = (n.x / 100) * width;
        const ny = (n.y / 100) * height;
        const isHovered = hoveredRef.current === n.id;
        const r = nodeRadius + (isHovered ? 4 : 0);

        // Glow halo
        if (isHovered) {
          const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 2.4);
          glow.addColorStop(0, n.color + "80");
          glow.addColorStop(1, n.color + "00");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(nx, ny, r * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Outer ring
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.strokeStyle = n.color;
        ctx.lineWidth = isHovered ? 2.5 : 1.6;
        ctx.stroke();

        // Inner fill
        ctx.beginPath();
        ctx.arc(nx, ny, r - 4, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? n.color + "30" : "#0A0D12";
        ctx.fill();

        // Pulsing inner dot
        const pulse = (Math.sin(time * 2 + n.baseX) + 1) / 2;
        ctx.beginPath();
        ctx.arc(nx, ny, 2 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        // Label below
        ctx.font = `${isHovered ? "bold " : ""}11px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isHovered ? "#FFFFFF" : "rgba(226, 232, 240, 0.85)";
        ctx.textAlign = "center";
        ctx.fillText(n.label, nx, ny + r + 16);

        // Tech stack on hover
        if (isHovered && n.tech.length > 0) {
          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillStyle = "rgba(0, 240, 255, 0.7)";
          ctx.fillText(n.tech.join(" · "), nx, ny + r + 28);
        }
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("mousemove", onMoveHover);
      container.removeEventListener("click", onClick);
    };
  }, [project.id, setHoveredNode, selectProject]);

  const hoveredNode = useMemo(
    () => project.graph.nodes.find((n) => n.id === hoveredNodeId) || null,
    [hoveredNodeId, project]
  );

  return (
    <div className="relative grid lg:grid-cols-[1fr_360px] gap-4 h-full">
      {/* Graph canvas */}
      <div
        ref={containerRef}
        className="relative rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 overflow-hidden scanlines"
        style={{ minHeight: "560px", height: "calc(100vh - 280px)" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
        {/* Hover tooltip */}
        {hoveredNode && (
          <div
            className="pointer-events-none absolute z-20 px-3 py-2 rounded-md glass-strong text-xs font-mono max-w-xs"
            style={{
              left: `${hoveredNode.x}%`,
              top: `${hoveredNode.y}%`,
              transform: "translate(-50%, calc(-100% - 40px))",
            }}
          >
            <div className="flex items-center gap-1.5 text-white font-bold">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: NODE_STYLE[hoveredNode.type].color }}
              />
              {hoveredNode.label}
            </div>
            <div className="mt-1 text-[var(--color-muted-foreground)]">
              {hoveredNode.description}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {hoveredNode.tech.map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-[#0A0D12] border border-[rgba(0,240,255,0.2)] text-[var(--color-cyber-cyan)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2 px-3 py-2 rounded-md glass">
          {Object.entries(NODE_STYLE).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1 text-[10px] font-mono text-[var(--color-muted-foreground)]">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: v.color }}
              />
              {v.label}
            </div>
          ))}
        </div>

        {/* Hint */}
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1.5 rounded-md glass text-[10px] font-mono text-[var(--color-muted-foreground)]">
          ▸ hover nodes · click to open deep dive
        </div>
      </div>

      {/* Side panel — project selector + node info */}
      <div className="flex flex-col gap-3 overflow-hidden">
        {/* Project selector */}
        <div className="rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mb-2">
            ▸ select project
          </div>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto os-scrollbar pr-1">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProject(p.id)}
                className={`text-left px-2.5 py-2 rounded-md font-mono text-xs transition-all border ${
                  p.id === project.id
                    ? "bg-[#0A0D12] border-[var(--color-cyber-cyan)]/40 text-white"
                    : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-cyber-cyan)] hover:bg-[#0A0D12]/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: p.accentColor }}
                  />
                  <span className="font-bold truncate">{p.title}</span>
                </div>
                <div className="text-[10px] mt-0.5 text-[var(--color-muted-foreground)]/70">
                  {p.company} · {p.period}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected node info / project deep dive */}
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id + (hoveredNode?.id || "-overview")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0A0D12]/60 p-3 overflow-y-auto os-scrollbar"
          >
            {hoveredNode ? (
              <NodeDeepDive node={hoveredNode} project={project} />
            ) : (
              <ProjectDeepDive project={project} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function NodeDeepDive({
  node,
  project,
}: {
  node: ArchitectureNode;
  project: Project;
}) {
  const Icon = NODE_STYLE[node.type].icon;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: NODE_STYLE[node.type].color + "20" }}
        >
          <Icon className="w-4 h-4" style={{ color: NODE_STYLE[node.type].color }} />
        </div>
        <div>
          <div className="font-mono text-sm font-bold text-white">{node.label}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {NODE_STYLE[node.type].label} · {project.company}
          </div>
        </div>
      </div>
      <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
        {node.description}
      </p>
      <div className="mt-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-cyber-cyan)]/70 mb-1.5">
          tech stack
        </div>
        <div className="flex flex-wrap gap-1">
          {node.tech.map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#0A0D12] border border-[rgba(0,240,255,0.15)] text-white"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectDeepDive({ project }: { project: Project }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: project.accentColor + "20" }}
        >
          <Cpu className="w-4 h-4" style={{ color: project.accentColor }} />
        </div>
        <div>
          <div className="font-mono text-sm font-bold text-white">{project.title}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {project.company} · {project.period}
          </div>
        </div>
      </div>

      <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-3">
        {project.tagline}
      </p>

      {/* Impact metrics */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {project.deepDive.impactMetrics.map((m) => (
          <div
            key={m.label}
            className="px-2 py-1.5 rounded bg-[#0A0D12]/60 border border-[rgba(0,240,255,0.1)]"
          >
            <div className="font-mono text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider">
              {m.label}
            </div>
            <div className="font-mono text-sm font-bold text-[var(--color-cyber-cyan)]">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Problem */}
      <div className="mb-2">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-cyber-amber)] mb-1 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          problem
        </div>
        <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
          {project.deepDive.problem}
        </p>
      </div>

      {/* Solution */}
      <div className="mb-2">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-cyber-emerald)] mb-1 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          solution
        </div>
        <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
          {project.deepDive.solution}
        </p>
      </div>

      {/* Trade-offs */}
      <div className="mb-2">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-cyber-purple)] mb-1 flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          trade-offs
        </div>
        <ul className="text-xs text-[var(--color-muted-foreground)] leading-relaxed space-y-1">
          {project.deepDive.tradeoffs.map((t, i) => (
            <li key={i} className="flex gap-1.5">
              <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-[var(--color-cyber-purple)]/60" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tech stack */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-cyber-cyan)]/70 mb-1.5">
          tech stack
        </div>
        <div className="flex flex-wrap gap-1">
          {project.deepDive.techStack.map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#0A0D12] border border-[rgba(0,240,255,0.15)] text-white"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArchitectureMode() {
  const { selectedProjectId, selectProject } = useOSStore();
  const activeProject = useMemo(
    () =>
      projects.find((p) => p.id === selectedProjectId) || projects[0],
    [selectedProjectId]
  );

  return (
    <div className="mode-flash mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
      {/* Section header */}
      <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyber-cyan)]/70 mb-1">
            ▸ mode: architecture
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            System Architecture Maps
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1 max-w-2xl">
            Interactive node graphs mapping real production architectures across Vedhas's career.
            Click any node to open the technical deep dive.
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-muted-foreground)]">
          <TrendingUp className="w-3 h-3" />
          {projects.length} systems mapped
        </div>
      </div>

      <ArchitectureGraph project={activeProject} />
    </div>
  );
}
