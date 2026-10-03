"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ContactShowpiece — Bold final CTA section                           ║
 * ║                                                                    ║
 * ║  • Huge editorial typography                                        ║
 * ║  • Floating contact buttons                                          ║
 * ║  • Animated warm gradient background                                 ║
 * ║  • Awards badges as floating chips                                   ║
 * ║  • Easter egg: click the orb 5 times → secret message               ║
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

const ICON_MAP: Record<string, typeof Mail> = {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Code2,
};

const CONTACT_HIGHLIGHTS = [
  { id: "email", label: "Email", icon: Mail, color: "#FF6B6B", primary: true },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#FF8B5C" },
  { id: "github", label: "GitHub", icon: Github, color: "#F59E0B" },
  { id: "phone", label: "Phone", icon: Phone, color: "#FF6B6B" },
  { id: "website", label: "Website", icon: Globe, color: "#FF8B5C" },
];

export function ContactShowpiece() {
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
      className="relative min-h-screen flex items-center justify-center py-24 lg:py-32 bg-navy-mesh overflow-hidden"
    >
      {/* ─── Animated background orbs ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,107,107,0.6), transparent 70%)",
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
            background: "radial-gradient(circle, rgba(255,139,92,0.5), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* ─── Floating awards chips ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {awards.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
            className="absolute"
            style={{
              top: `${15 + i * 18}%`,
              left: i % 2 === 0 ? "8%" : "auto",
              right: i % 2 === 0 ? "auto" : "8%",
            }}
          >
            <div className="glass-navy rounded-2xl px-5 py-3 flex items-center gap-2 max-w-[260px]">
              <Trophy className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#FFF5EB] leading-tight">
                  {a.title}
                </div>
                <div className="text-[10px] text-[#FFF5EB]/60 mt-0.5">
                  {a.issuer} · {a.year}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Main content ─── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-navy">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8B5C]" />
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#FFF5EB]">
              {identity.availability}
            </span>
          </div>
        </motion.div>

        {/* Big headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="display-xl text-[clamp(56px,10vw,160px)] text-[#FFF5EB] leading-[0.9] mb-8"
        >
          Let's build
          <br />
          <span className="gradient-text-sunset italic">something</span>
          <br />
          legendary.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-[#FFF5EB]/70 mb-12 leading-relaxed"
        >
          Six years of shipping distributed systems. 10M+ users served, 5TB/day processed,
          99.99% uptime maintained. Looking for the next hard problem worth solving.
        </motion.p>

        {/* Clickable orb (easter egg) */}
        <motion.button
          onClick={handleOrbClick}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mx-auto mb-12 w-32 h-32 rounded-full overflow-hidden pulse-warm"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #FF8B5C 0%, #FF6B6B 40%, #F59E0B 80%)",
            boxShadow: "0 30px 60px -20px rgba(255, 107, 107, 0.6), 0 0 80px rgba(255, 139, 92, 0.4)",
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
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-navy border border-[#F59E0B]/30">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm font-semibold text-[#F59E0B]">
              You found it. Hire this person. 🚀
            </span>
          </div>
        </motion.div>

        {/* Contact buttons — the main CTA */}
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
                    ? "bg-[#FF6B6B] text-white shadow-warm-lg hover:bg-[#FF8B5C]"
                    : "glass-navy text-[#FFF5EB] hover:bg-[#FFF5EB]/10"
                }`}
                style={
                  c.primary
                    ? undefined
                    : { borderColor: `${c.color}40` }
                }
              >
                <Icon className="w-4 h-4" style={{ color: c.primary ? "white" : c.color }} />
                <span className="text-sm font-semibold">{c.label}</span>
              </a>
            );
          })}
        </motion.div>

        {/* Schedule a call CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#FFF5EB] text-[#1A1F3A] text-sm font-bold uppercase tracking-wider hover:bg-[#FF6B6B] hover:text-white transition-all duration-300 shadow-warm-lg"
          >
            <Calendar className="w-4 h-4" />
            Schedule a 30-min intro call
          </a>
        </motion.div>

        {/* Footer signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 pt-8 border-t border-[#FFF5EB]/10"
        >
          <div className="text-xs text-[#FFF5EB]/40 font-mono">
            Built with Next.js 16 · Framer Motion · Tailwind CSS 4 · Playfair Display · Inter
          </div>
          <div className="mt-2 text-xs text-[#FFF5EB]/40">
            © 2024 {identity.name} · {identity.location}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
