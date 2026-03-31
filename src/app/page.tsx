"use client";

import Navigation from "@/components/Navigation";
import MarqueeTicker from "@/components/MarqueeTicker";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import WealthCalculator from "@/components/WealthCalculator";
import FeeCalculator from "@/components/FeeCalculator";
import RemittanceSection from "@/components/RemittanceSection";
import SocialProofSection from "@/components/SocialProofSection";
import InstitutionalSection from "@/components/InstitutionalSection";
import ComparisonSection from "@/components/ComparisonSection";
import TrustSection from "@/components/TrustSection";
import BitcoinMissionSection from "@/components/BitcoinMissionSection";
import CTASection from "@/components/CTASection";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import AskSatoshi from "@/components/AskSatoshi";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <MarqueeTicker />
      <AskSatoshi />

      {/* Hero */}
      <HeroSection />

      <div className="section-divider" />

      {/* 3-Step Plan */}
      <HowItWorksSection />

      <div className="section-divider" />

      {/* Features — 12 products */}
      <FeaturesSection />

      <div className="section-divider" />

      {/* Wealth Calculator — interactive SIP backtester */}
      <WealthCalculator />

      <div className="section-divider" />

      {/* Fee Calculator — transparency builds trust */}
      <FeeCalculator />

      <div className="section-divider" />

      {/* Remittance */}
      <RemittanceSection />

      <div className="section-divider" />

      {/* Social Proof — numbers, testimonials, media */}
      <SocialProofSection />

      <div className="section-divider" />

      {/* Institutional — OTC, custody, enterprise */}
      <InstitutionalSection />

      <div className="section-divider" />

      {/* Comparison — vs competitors */}
      <ComparisonSection />

      <div className="section-divider" />

      {/* Trust — timeline, investors, Supreme Court */}
      <TrustSection />

      <div className="section-divider" />

      {/* Bitcoin Mission */}
      <BitcoinMissionSection />

      <div className="section-divider" />

      {/* CTA */}
      <CTASection />

      {/* Floating CTA — persistent bottom bar */}
      <FloatingCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
