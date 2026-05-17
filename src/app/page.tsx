// Revalidate every 60 seconds (ISR). The vast majority of requests are served
// from cache — the DB is only touched once per minute at most, not on every hit.
// This is the single most important resilience change for high ad traffic.
export const revalidate = 60;
export const maxDuration = 30;

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCtaBar from "@/components/layout/StickyCtaBar";
import HeroSection from "@/components/homepage/HeroSection";
import UspStrip from "@/components/homepage/UspStrip";
import SessionGrid from "@/components/homepage/SessionGrid";
import PhilosophySection from "@/components/homepage/PhilosophySection";
import SkillsSection from "@/components/homepage/SkillsSection";
import ExperienceZones from "@/components/homepage/ExperienceZones";
import OrganizersSection from "@/components/homepage/OrganizersSection";
import NumbersStrip from "@/components/homepage/NumbersStrip";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import GallerySection from "@/components/homepage/GallerySection";
import ParentsDaySection from "@/components/homepage/ParentsDaySection";
import ContactSection from "@/components/homepage/ContactSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <UspStrip />
        <PhilosophySection />
        <SessionGrid />
        <SkillsSection />
        <ExperienceZones />
        <OrganizersSection />
        <NumbersStrip />
        <GallerySection />
        <TestimonialsSection />
        <ParentsDaySection />
        <ContactSection />
      </main>
      <Footer />
      <StickyCtaBar />
    </>
  );
}
