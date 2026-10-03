"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  FloatingShapes — Editorial 3D hero shapes                          ║
 * ║                                                                    ║
 * ║  Pure CSS 3D transforms (no Three.js = tiny bundle, smooth on mobile) ║
 * ║                                                                    ║
 * ║  • Icosahedron (rotating wireframe)                                ║
 * ║  • Gradient orb (large, soft)                                     ║
 * ║  • Floating ring (torus)                                           ║
 * ║  • Tilt cards with key info                                        ║
 * ║                                                                    ║
 * ║  All shapes parallax-track the mouse for depth.                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface FloatingShapeProps {
  children?: ReactNode;
  className?: string;
  depth?: number; // 0..1, higher = moves more with mouse
  floatSpeed?: "slow" | "medium" | "fast";
  floatDelay?: number;
}

export function FloatingShape({
  children,
  className = "",
  depth = 0.3,
  floatSpeed = "medium",
  floatDelay = 0,
}: FloatingShapeProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const transformX = useTransform(springX, [-0.5, 0.5], [-depth * 60, depth * 60]);
  const transformY = useTransform(springY, [-0.5, 0.5], [-depth * 60, depth * 60]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [depth * 20, -depth * 20]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-depth * 20, depth * 20]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseX.set(e.clientX / w - 0.5);
      mouseY.set(e.clientY / h - 0.5);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      style={{
        x: transformX,
        y: transformY,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`absolute pointer-events-none ${floatSpeed === "slow" ? "float-slow" : floatSpeed === "fast" ? "float-fast" : "float-medium"} ${className}`}
      // Stagger float via delay
      transition={floatDelay ? { delay: floatDelay } : undefined}
    >
      {children}
    </motion.div>
  );
}

/** Large soft gradient orb — the hero centerpiece */
export function GradientOrb({ size = 480 }: { size?: number }) {
  return (
    <FloatingShape depth={0.4} floatSpeed="slow" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,139,92,0.85) 0%, rgba(255,107,107,0.7) 40%, rgba(245,158,11,0.3) 70%, transparent 100%)",
          filter: "blur(40px)",
        }}
      />
    </FloatingShape>
  );
}

/** Rotating wireframe icosahedron — gives a "tech" feel without being nerdy */
export function IcosahedronShape({ size = 140 }: { size?: number }) {
  return (
    <FloatingShape depth={0.7} floatSpeed="medium" className="top-[18%] right-[10%]">
      <div
        className="spin-3d-medium"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Use SVG for a clean wireframe look */}
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          style={{ filter: "drop-shadow(0 20px 40px rgba(255,107,107,0.3))" }}
        >
          <defs>
            <linearGradient id="ico-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Outer ring */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="url(#ico-grad)" strokeWidth="1" opacity="0.6" />
          {/* Inner geometric pattern */}
          <polygon points="50,8 88,30 88,70 50,92 12,70 12,30" fill="none" stroke="url(#ico-grad)" strokeWidth="1.5" />
          <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" fill="none" stroke="url(#ico-grad)" strokeWidth="1" opacity="0.7" />
          <line x1="50" y1="8" x2="50" y2="92" stroke="url(#ico-grad)" strokeWidth="0.5" opacity="0.4" />
          <line x1="12" y1="30" x2="88" y2="70" stroke="url(#ico-grad)" strokeWidth="0.5" opacity="0.4" />
          <line x1="88" y1="30" x2="12" y2="70" stroke="url(#ico-grad)" strokeWidth="0.5" opacity="0.4" />
          {/* Center dot */}
          <circle cx="50" cy="50" r="3" fill="url(#ico-grad)" />
        </svg>
      </div>
    </FloatingShape>
  );
}

/** Floating ring / torus */
export function FloatingRing({ size = 90 }: { size?: number }) {
  return (
    <FloatingShape depth={0.5} floatSpeed="fast" className="bottom-[20%] left-[8%]">
      <div
        className="spin-3d-slow"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "3px solid transparent",
          background:
            "linear-gradient(135deg, #FF6B6B, #FF8B5C, #F59E0B) border-box",
          WebkitMask:
            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          filter: "drop-shadow(0 15px 30px rgba(255,107,107,0.4))",
        }}
      />
    </FloatingShape>
  );
}

/** Small floating chip / pill with text */
export function FloatingChip({
  children,
  className = "",
  depth = 0.6,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  return (
    <FloatingShape depth={depth} floatSpeed="medium" className={className}>
      <div className="glass-warm-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-[#1A1F3A]">
        {children}
      </div>
    </FloatingShape>
  );
}

/** Big floating stat card */
export function FloatingStatCard({
  value,
  label,
  className = "",
  depth = 0.5,
  accent = "coral",
}: {
  value: string;
  label: string;
  className?: string;
  depth?: number;
  accent?: "coral" | "amber" | "navy";
}) {
  const accentColor =
    accent === "amber" ? "#F59E0B" : accent === "navy" ? "#1A1F3A" : "#FF6B6B";

  return (
    <FloatingShape depth={depth} floatSpeed="slow" className={className}>
      <div className="glass-warm-strong rounded-2xl px-6 py-4 min-w-[160px]">
        <div className="text-3xl font-bold tabular-nums" style={{ color: accentColor }}>
          {value}
        </div>
        <div className="text-xs uppercase tracking-wider text-[#6B5B4F] mt-1 font-medium">
          {label}
        </div>
      </div>
    </FloatingShape>
  );
}

/** Decorative floating dots scattered around */
export function FloatingDots() {
  const dots = [
    { top: "12%", left: "8%", size: 8, color: "#FF6B6B", delay: 0 },
    { top: "22%", left: "82%", size: 12, color: "#FF8B5C", delay: 0.5 },
    { top: "65%", left: "15%", size: 10, color: "#F59E0B", delay: 1 },
    { top: "75%", left: "88%", size: 14, color: "#FF6B6B", delay: 1.5 },
    { top: "40%", left: "92%", size: 6, color: "#FECDD3", delay: 2 },
    { top: "55%", left: "5%", size: 8, color: "#FF8B5C", delay: 0.8 },
  ];

  return (
    <>
      {dots.map((d, i) => (
        <FloatingShape
          key={i}
          depth={0.3 + (i % 3) * 0.15}
          floatSpeed={i % 2 === 0 ? "slow" : "medium"}
          floatDelay={d.delay}
          className="pointer-events-none"
        >
          <div
            style={{
              position: "absolute",
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              backgroundColor: d.color,
              opacity: 0.6,
              filter: "blur(1px)",
              boxShadow: `0 0 20px ${d.color}80`,
            }}
          />
        </FloatingShape>
      ))}
    </>
  );
}
