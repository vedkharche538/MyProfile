"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  HeroCanvas — Cursor-reactive particle field                       ║
 * ║                                                                    ║
 * ║  • HTML5 Canvas (no Three.js dependency for SSG weight)            ║
 * ║  • 120 particles, O(n²) ≤ 14400 distance checks — runs @ 60fps     ║
 * ║  • Particles repel cursor, draw connection lines when near           ║
 * ║  • DPR-aware, resize-observer-aware, cleanup on unmount             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
}

const PARTICLE_COUNT = 110;
const CONNECT_DIST = 130;
const CURSOR_REPEL_DIST = 140;

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // (Re)seed particles if first time or size changed dramatically
      if (particles.length === 0 || Math.abs(particles[0].x - width / 2) > width) {
        particles = Array.from({ length: PARTICLE_COUNT }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6,
          baseAlpha: Math.random() * 0.5 + 0.25,
        }));
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement as Element);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorRef.current.x = e.clientX - rect.left;
      cursorRef.current.y = e.clientY - rect.top;
      cursorRef.current.active = true;
    };
    const onLeave = () => {
      cursorRef.current.x = -1000;
      cursorRef.current.y = -1000;
      cursorRef.current.active = false;
    };

    canvas.parentElement?.addEventListener("mousemove", onMove);
    canvas.parentElement?.addEventListener("mouseleave", onLeave);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      const cursor = cursorRef.current;

      // ─── Update + draw particles ───
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor repel
        if (cursor.active) {
          const dx = p.x - cursor.x;
          const dy = p.y - cursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_REPEL_DIST && dist > 0.001) {
            const force = (CURSOR_REPEL_DIST - dist) / CURSOR_REPEL_DIST;
            p.vx += (dx / dist) * force * 0.6;
            p.vy += (dy / dist) * force * 0.6;
          }
        }

        // Friction + tiny drift
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw
        const cursorDist = cursor.active
          ? Math.sqrt((p.x - cursor.x) ** 2 + (p.y - cursor.y) ** 2)
          : 9999;
        const cursorBoost = cursorDist < 200 ? (200 - cursorDist) / 200 : 0;
        const alpha = Math.min(1, p.baseAlpha + cursorBoost * 0.7);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + cursorBoost * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.fill();

        // Cursor halo
        if (cursor.active && cursorDist < 50) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.6})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // ─── Connection lines ───
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Cursor-to-particle lines (purple)
        if (cursor.active) {
          const dx = a.x - cursor.x;
          const dy = a.y - cursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(cursor.x, cursor.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
