"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Vedhas Kharche — Living Particle Field portfolio                  ║
 * ║                                                                    ║
 * ║  Single immersive scroll experience:                               ║
 *    1. NeonHeader      — sticky magnetic nav                           ║
 *    2. HeroLiving      — draggable 3D + scramble text + cursor BG      ║
 *    3. NarrativeStory  — story-driven intro with year beats            ║
 *    4. ProjectsCoverflow — 3D rotating carousel of projects           ║
 *    5. SkillNodes      — radar + hover-to-link skill grid              ║
 *    6. ContactFinale   — bold final CTA with easter egg                ║
 * ║                                                                    ║
 * ║  Plus: ParticleField (full-page neon network) + CustomCursor       ║
 * ║  100% client-side. SSG-ready for GitHub Pages.                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { NeonHeader } from "@/components/os/NeonHeader";
import { ParticleField } from "@/components/os/ParticleField";
import { CustomCursor } from "@/components/os/CustomCursor";
import { HeroLiving } from "@/components/os/HeroLiving";
import { NarrativeStory } from "@/components/os/NarrativeStory";
import { ProjectsCoverflow } from "@/components/os/ProjectsCoverflow";
import { SkillNodes } from "@/components/os/SkillNodes";
import { ContactFinale } from "@/components/os/ContactFinale";

export default function Page() {
  return (
    <main id="top" className="relative min-h-screen bg-void text-[#F4F4F5] overflow-x-hidden">
      {/* Global particle field background */}
      <ParticleField />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Page content */}
      <div className="relative z-10">
        <NeonHeader />
        <HeroLiving />
        <NarrativeStory />
        <ProjectsCoverflow />
        <SkillNodes />
        <ContactFinale />
      </div>
    </main>
  );
}
