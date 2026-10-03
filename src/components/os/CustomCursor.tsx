"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CustomCursor — Animated cursor with trailing particle field       ║
 * ║                                                                    ║
 * ║  • Inner dot (8px, mix-blend-difference, snaps to cursor)          ║
 * ║  • Outer ring (40px, lags behind via spring)                       ║
 * ║  • Trail of glowing particles (up to 12, fading out)              ║
 * ║  • Grows + changes color when hovering interactive elements         ║
 * ║  • Becomes viewfinder when hovering project cards                  ║
 * ║  • Disabled on touch devices                                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef, useState } from "react";

interface TrailParticle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  color: string;
}

const TRAIL_COLORS = ["#00FFE1", "#FF006E", "#8B5CF6", "#B6FF00"];

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setHidden(true);
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const trail: TrailParticle[] = [];
    let lastTrailTime = 0;
    let trailColorIdx = 0;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const target = e.target as HTMLElement;

      // Check what we're hovering
      const isInteractive = target.closest("a, button, [role='button'], input, [data-cursor='hover']");
      const isProject = target.closest("[data-cursor='project']");
      const isDrag = target.closest("[data-cursor='drag']");

      if (isProject) {
        document.body.classList.add("cursor-project");
        document.body.classList.remove("cursor-hover", "cursor-drag");
      } else if (isDrag) {
        document.body.classList.add("cursor-drag");
        document.body.classList.remove("cursor-hover", "cursor-project");
      } else if (isInteractive) {
        document.body.classList.add("cursor-hover");
        document.body.classList.remove("cursor-project", "cursor-drag");
      } else {
        document.body.classList.remove("cursor-hover", "cursor-project", "cursor-drag");
      }

      // Spawn trail particle every ~30ms
      const now = performance.now();
      if (now - lastTrailTime > 28) {
        lastTrailTime = now;
        trail.push({
          x: mouseX,
          y: mouseY,
          age: 0,
          maxAge: 40,
          color: TRAIL_COLORS[trailColorIdx % TRAIL_COLORS.length],
        });
        trailColorIdx++;
        if (trail.length > 14) trail.shift();
      }
    };

    const onDown = () => document.body.classList.add("cursor-down");
    const onUp = () => document.body.classList.remove("cursor-down");
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const tick = () => {
      // Lerp ring toward mouse (springy)
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
      }

      // Draw trail particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.age++;
        if (p.age > p.maxAge) {
          trail.splice(i, 1);
          continue;
        }
        const t = 1 - p.age / p.maxAge;
        const size = 6 * t;
        const alpha = t * 0.7;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
        grad.addColorStop(0, `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`);
        grad.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9997]"
        aria-hidden="true"
      />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
