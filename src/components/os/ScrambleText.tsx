"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ScrambleText — Text scrambles through random characters then       ║
 * ║  resolves to its final value. Triggers on scroll-into-view.        ║
 * ║                                                                    ║
 * ║  Like a decryption effect — gives a "tech reveal" feel without      ║
 * ║  being a cliché matrix gag.                                        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>?/\\|+=";

interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number; // ms
  delay?: number; // ms
  as?: "h1" | "h2" | "h3" | "span" | "div" | "p";
}

export function ScrambleText({
  text,
  className = "",
  duration = 1200,
  delay = 0,
  as = "span",
}: ScrambleTextProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    let raf = 0;
    const startTime = performance.now() + delay;

    const scramble = () => {
      const now = performance.now();
      if (now < startTime) {
        raf = requestAnimationFrame(scramble);
        return;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Number of characters that should be "resolved" by now
      const resolvedCount = Math.floor(progress * text.length);

      let result = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === " ") {
          result += " ";
          continue;
        }
        if (i < resolvedCount) {
          result += char;
        } else {
          // Scramble this character
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setDisplay(result);

      if (progress < 1) {
        raf = requestAnimationFrame(scramble);
      } else {
        setDisplay(text);
      }
      frame++;
    };
    raf = requestAnimationFrame(scramble);

    return () => cancelAnimationFrame(raf);
  }, [inView, text, duration, delay]);

  const Tag = as as keyof JSX.IntrinsicElements;
  return (
    <Tag ref={ref as any} className={className}>
      {display || text}
    </Tag>
  );
}
