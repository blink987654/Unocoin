"use client";

import { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("floatingCtaDismissed") === "1") {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      setVisible(window.scrollY >= 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("floatingCtaDismissed", "1");
  };

  const show = visible && !dismissed;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ transform: show ? "translateY(0)" : "translateY(100%)" }}
      aria-hidden={!show}
    >
      <div className="bg-surface-elevated/90 backdrop-blur-xl border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <p className="text-text-primary text-sm font-medium whitespace-nowrap">
            <span className="hidden sm:inline">Start investing from ₹100</span>
            <span className="sm:hidden">Start with ₹100</span>
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://unocoin.com/in/register"
              className="btn-primary text-sm !py-2 !px-5 rounded-lg whitespace-nowrap"
            >
              Get Started
            </a>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="text-text-tertiary hover:text-text-primary transition-colors p-1"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
