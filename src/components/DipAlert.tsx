"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DipScenario {
  dropPercent: number;
  hours: number;
  biggestDipDays: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function generateScenario(): DipScenario {
  return {
    dropPercent: Math.round(randomBetween(3, 8) * 10) / 10,
    hours: Math.floor(randomBetween(1, 7)),
    biggestDipDays: Math.floor(randomBetween(7, 31)),
  };
}

/** Initial delay before first appearance (ms). */
const INITIAL_DELAY = 45_000;

/** Cooldown between reappearances after dismiss (ms): 4-5 minutes. */
function reappearDelay(): number {
  return randomBetween(4 * 60_000, 5 * 60_000);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DipAlert() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [scenario, setScenario] = useState<DipScenario>(generateScenario);
  const [ordered, setOrdered] = useState(false);
  const reappearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Schedule showing the alert
  const scheduleShow = useCallback((delay: number) => {
    reappearTimer.current = setTimeout(() => {
      setScenario(generateScenario());
      setOrdered(false);
      setVisible(true);
    }, delay);
  }, []);

  // Initial appearance after 45s
  useEffect(() => {
    scheduleShow(INITIAL_DELAY);
    return () => {
      if (reappearTimer.current) clearTimeout(reappearTimer.current);
    };
  }, [scheduleShow]);

  // Dismiss handler — hides card, schedules reappearance
  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(false);
    scheduleShow(reappearDelay());
  }, [scheduleShow]);

  // Session dismiss — no more alerts this session
  const handleSessionDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    if (reappearTimer.current) clearTimeout(reappearTimer.current);
  }, []);

  // Buy click
  const handleBuy = useCallback(() => {
    setOrdered(true);
    setTimeout(() => {
      setVisible(false);
      if (!dismissed) {
        scheduleShow(reappearDelay());
      }
    }, 2_000);
  }, [dismissed, scheduleShow]);

  // If permanently dismissed for session, render nothing
  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -80, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -80, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 z-50 bg-surface-card border border-bitcoin/20 rounded-2xl p-5 shadow-2xl max-w-sm w-[calc(100vw-3rem)] sm:w-auto"
        >
          {/* Close button */}
          <button
            onClick={handleSessionDismiss}
            className="absolute top-3 right-3 text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Dismiss alert permanently"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bitcoin opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-bitcoin" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-bitcoin">
              Price Alert
            </span>
          </div>

          {/* Body */}
          <p className="text-text-primary text-sm font-medium leading-relaxed mb-1">
            BTC dropped {scenario.dropPercent}% in the last{" "}
            {scenario.hours === 1 ? "hour" : `${scenario.hours} hours`}
          </p>
          <p className="text-text-tertiary text-xs mb-4">
            This is the biggest dip in {scenario.biggestDipDays} days
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {ordered ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-green/10 text-accent-green text-sm font-semibold"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.75 9.75L7.25 13.25L14.25 5.25"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Order placed!
              </motion.div>
            ) : (
              <button
                onClick={handleBuy}
                className="btn-primary text-sm !py-3 !px-6 w-full text-center"
              >
                Buy ₹1,000 of BTC
              </button>
            )}

            {!ordered && (
              <button
                onClick={handleDismiss}
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors py-1"
              >
                Dismiss
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
