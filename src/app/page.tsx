"use client";

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import RemittanceSection from "@/components/RemittanceSection";
import TrustSection from "@/components/TrustSection";
import BitcoinMissionSection from "@/components/BitcoinMissionSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />

      {/* Hero - The user is the hero. "Your future runs on Bitcoin." */}
      <HeroSection />

      <div className="section-divider" />

      {/* Features - We are the guide. Here are our tools. */}
      <FeaturesSection />

      <div className="section-divider" />

      {/* Remittance - The new frontier */}
      <RemittanceSection />

      <div className="section-divider" />

      {/* Trust - Our story, our proof, our backers */}
      <TrustSection />

      <div className="section-divider" />

      {/* Bitcoin Mission - The why behind everything */}
      <BitcoinMissionSection />

      <div className="section-divider" />

      {/* CTA - The call to action */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
