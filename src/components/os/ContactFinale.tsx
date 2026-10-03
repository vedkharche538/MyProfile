"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ContactFinale — Final CTA section with cursor-reactive finale       ║
 * ║                                                                    ║
 * ║  • Huge headline with scramble text                                ║
 * ║  • Cursor-reactive orbs in background                             ║
 * ║  • Floating contact buttons                                        ║
 * ║  • Awards as floating chips                                        ║
 * ║  • Easter egg: click the giant orb 5 times                          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Code2,
  Calendar,
  Trophy,
  Sparkles,
} from "lucide-react";
import { contactLinks, awards, identity } from "@/data/resume";
import { ScrambleText } from "./ScrambleText";
import { CursorReactiveBG } from "./CursorReactiveBG";

const ICON_MAP: Record<string, typeof Mail> = {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Code2,
};

const CONTACT_HIGHLIGHTS = [
  { id: "email", label: "Email", icon: Mail, color: "#00FFE1", primary: true },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#FF006E" },
  { id: "github", label: "GitHub", icon: Github, color: "#B6FF00" },
  { id: "phone", label: "Phone", icon: Phone, color: "#8B5CF6" },
  { id: "website", label: "Website", icon: Globe, color: "#00FFE1" },
];

export function ContactFinale() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [orbClicks, setOrbClicks] = useState(0);
  const [showEgg, setShowEgg] = useState(false);

  const handleOrbClick = () => {
    const next = orbClicks + 1;
    setOrbClicks(next);
    if (next >= 5) {
      setShowEgg(true);
      setTimeout(() => setShowEgg(false), 5000);
      setOrbClicks(0);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-24 lg:py-32 bg-void overflow-hidden"
    >
      {/* Cursor-reactive orbs */}
      <CursorReactiveBG intensity="strong" />

      {/* Animated floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,255,225,0.4), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,0,110,0.4), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Floating awards chips */}
      <div className="absolute inset-0 pointer-events-none">
        {awards.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
            className="absolute float-gentle"
            style={{
              top: `${15 + i * 22}%`,
              left: i % 2 === 0 ? "6%" : "auto",
              right: i % 2 === 0 ? "auto" : "6%",
            }}
          >
            <div className="glass-neon rounded-2xl px-5 py-3 flex items-center gap-2 max-w-[260px]">
              <Trophy className="w-4 h-4 text-[#B6FF00] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#F4F4F5] leading-tight">
                  {a.title}
                </div>
                <div className="text-[10px] text-[#9CA3AF] mt-0.5 font-mono">
                  {a.issuer} · {a.year}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-neon">
            <Sparkles className="w-3.5 h-3.5 text-[#00FFE1]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00FFE1]">
              {identity.availability}
            </span>
          </div>
        </motion.div>

        {/* Big headline with scramble */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="display-xl text-[clamp(48px,9vw,140px)] text-[#F4F4F5] leading-[0.9] mb-8"
        >
          <ScrambleText text="Let's build" duration={900} delay={200} />
          <br />
          <span className="gradient-text-cyan-magenta">
            <ScrambleText text="something legendary." duration={900} delay={600} />
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-[#9CA3AF] mb-12 leading-relaxed"
        >
          Six years of shipping distributed systems. 10M+ users served, 5TB/day
          processed, 99.99% uptime maintained. Looking for the next hard problem
          worth solving.
        </motion.p>

        {/* Clickable orb (easter egg) */}
        <motion.button
          onClick={handleOrbClick}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mx-auto mb-12 w-32 h-32 rounded-full overflow-hidden pulse-neon"
          style={{
            background: "radial-gradient(circle at 30% 30%, #00FFE1 0%, #FF006E 50%, #8B5CF6 100%)",
            boxShadow: "0 30px 60px -20px rgba(0, 255, 225, 0.6), 0 0 80px rgba(255, 0, 110, 0.4)",
          }}
          aria-label="Magic orb — click for surprise"
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
          />
        </motion.button>

        {/* Easter egg message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showEgg ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-neon-strong" style={{ borderColor: "#B6FF0040" }}>
            <Sparkles className="w-4 h-4 text-[#B6FF00]" />
            <span className="text-sm font-bold text-[#B6FF00] font-mono">
              You found it. Hire this person. →
            </span>
          </div>
        </motion.div>

        {/* Contact buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {CONTACT_HIGHLIGHTS.map((c) => {
            const link = contactLinks.find((l) => l.id === c.id);
            if (!link) return null;
            const Icon = c.icon;
            return (
              <a
                key={c.id}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                  c.primary
                    ? "bg-[#00FFE1] text-[#050507] glow-cyan"
                    : "glass-neon text-[#F4F4F5]"
                }`}
                style={c.primary ? undefined : { borderColor: `${c.color}40` }}
              >
                <Icon className="w-4 h-4" style={{ color: c.primary ? "#050507" : c.color }} />
                <span className="text-sm font-bold font-mono uppercase tracking-wider">{c.label}</span>
              </a>
            );
          })}
        </motion.div>

        {/* Schedule call */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full glass-neon-strong text-[#F4F4F5] text-sm font-bold uppercase tracking-wider hover:border-[#00FFE1]/50 transition-all"
          >
            <Calendar className="w-4 h-4 text-[#00FFE1]" />
            Schedule a 30-min intro call
          </a>
        </motion.div>

        {/* Footer signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 pt-8 border-t border-[#F4F4F5]/10"
        >
          <div className="text-xs text-[#6B7280] font-mono">
            © 2026 {identity.name} · {identity.location}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
