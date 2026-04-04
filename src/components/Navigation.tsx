"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndiaBitcoinBrand } from "./UnocoinLogo";
import AchievementPanel from "./AchievementPanel";
import { useAchievements } from "@/lib/hooks";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const { totalUnlocked, unlocked } = useAchievements();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [moreOpen, setMoreOpen] = useState(false);

  const navLinks = [
    { label: "Products", href: "#products" },
    { label: "Platform", href: "/platform", badge: "AI" },
    { label: "Advisor", href: "/advisor", badge: "AI" },
    { label: "Partners", href: "/remittance" },
    { label: "Security", href: "/security" },
  ];

  const moreLinks = [
    { label: "Time Machine", href: "/time-machine" },
    { label: "Daily Ritual", href: "/daily" },
    { label: "Kundali", href: "/kundali" },
    { label: "Parivaar", href: "/parivaar" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface/80 backdrop-blur-2xl border-b border-border-subtle"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <IndiaBitcoinBrand logoSize={36} />

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors duration-300 text-text-secondary hover:text-text-primary flex items-center gap-1.5"
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] bg-bitcoin/15 text-bitcoin font-bold px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
              {/* More dropdown */}
              <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
                <button
                  onMouseEnter={() => setMoreOpen(true)}
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="text-sm transition-colors duration-300 text-text-secondary hover:text-text-primary flex items-center gap-1"
                >
                  More
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-44 bg-surface-elevated border border-border-subtle rounded-xl shadow-2xl overflow-hidden py-1"
                    >
                      {moreLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowAchievements(true)}
                className="relative w-9 h-9 rounded-lg hover:bg-surface-hover flex items-center justify-center transition-colors"
                title="Achievements"
              >
                <span className="text-lg">🏆</span>
                {totalUnlocked > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-bitcoin rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {totalUnlocked}
                  </span>
                )}
              </button>
              <a
                href="/autopilot"
                className="text-sm text-bitcoin hover:text-bitcoin-light transition-colors px-4 py-2 font-medium"
              >
                Try Autopilot
              </a>
              <a
                href="/autopilot"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2"
              >
                Sign In
              </a>
              <a
                href="/autopilot"
                className="btn-primary text-sm !py-2.5 !px-6 rounded-lg"
              >
                Get Started
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            >
              <span
                className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            {moreLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + i) * 0.1 }}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-medium text-bitcoin hover:text-bitcoin-light transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="/autopilot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-medium text-bitcoin hover:text-bitcoin-light transition-colors"
            >
              Try Autopilot
            </motion.a>
            <motion.a
              href="/autopilot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="btn-primary mt-4"
            >
              Get Started
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Panel */}
      <AchievementPanel
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        unlockedMap={unlocked}
      />
    </>
  );
}
