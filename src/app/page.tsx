"use client";

import Navigation from "@/components/Navigation";
import MarqueeTicker from "@/components/MarqueeTicker";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SocialProofSection from "@/components/SocialProofSection";
import InstitutionalSection from "@/components/InstitutionalSection";
import CTASection from "@/components/CTASection";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import AskSatoshi from "@/components/AskSatoshi";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import DipAlert from "@/components/DipAlert";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <MarqueeTicker />
      <AskSatoshi />

      {/* Hero — full viewport, globe + headline + CTA */}
      <HeroSection />

      {/* What India is Buying — live activity feed */}
      <LiveActivityFeed />

      {/* Features — 4 cinematic showcases + compact secondary grid */}
      <section className="bg-surface-elevated/50">
        <FeaturesSection />
      </section>

      {/* Social Proof + Trust — combined "Why Unocoin" section */}
      <SocialProofSection />

      {/* Institutional — OTC, custody, enterprise */}
      <section id="institutional" className="bg-surface-elevated/50">
        <InstitutionalSection />
      </section>

      {/* CTA — final, dramatic */}
      <CTASection />

      {/* Price Drop Alert */}
      <DipAlert />

      {/* Floating CTA — persistent bottom bar */}
      <FloatingCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
