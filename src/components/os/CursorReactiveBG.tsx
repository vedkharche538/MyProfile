"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CursorReactiveBG — Background gradient morphs based on cursor      ║
 * ║  position. Two large soft orbs (cyan + magenta) follow the cursor  ║
 * ║  on opposite axes, creating a "lava lamp you control" effect.       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

export function CursorReactiveBG({ className = "", intensity = "medium" }: Props) {
  const orb1Ref = useRef<HTMLDivElement | null>(null);
  const orb2Ref = useRef<HTMLDivElement | null>(null);

  const sizeMap = {
    subtle: { size: 500, opacity: 0.15 },
    medium: { size: 700, opacity: 0.25 },
    strong: { size: 900, opacity: 0.4 },
  };
  const { size, opacity } = sizeMap[intensity];

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let orb1X = mouseX;
    let orb1Y = mouseY;
    let orb2X = mouseX;
    let orb2Y = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      // Orb 1 (cyan) follows directly with lerp
      orb1X += (mouseX - orb1X) * 0.06;
      orb1Y += (mouseY - orb1Y) * 0.06;

      // Orb 2 (magenta) follows on inverted axis (mirror)
      const w = window.innerWidth;
      const h = window.innerHeight;
      const targetX2 = w - mouseX;
      const targetY2 = h - mouseY;
      orb2X += (targetX2 - orb2X) * 0.04;
      orb2Y += (targetY2 - orb2Y) * 0.04;

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate3d(${orb1X - size / 2}px, ${orb1Y - size / 2}px, 0)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(${orb2X - size / 2}px, ${orb2Y - size / 2}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [size]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        ref={orb1Ref}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, rgba(0,255,225,${opacity}) 0%, rgba(0,255,225,0) 70%)`,
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, rgba(255,0,110,${opacity}) 0%, rgba(255,0,110,0) 70%)`,
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
