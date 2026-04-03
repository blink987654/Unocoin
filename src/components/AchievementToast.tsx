"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENT_DEFS } from "@/lib/hooks";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AchievementToastProps {
  achievementId: string | null;
  onDismiss: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AchievementToast({ achievementId, onDismiss }: AchievementToastProps) {
  const def = achievementId
    ? ACHIEVEMENT_DEFS.find((d) => d.id === achievementId) ?? null
    : null;

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!achievementId) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [achievementId, onDismiss]);

  return (
    <AnimatePresence>
      {def && (
        <motion.div
          key={def.id}
          className="fixed top-6 right-6 z-[60] w-80 rounded-2xl border border-bitcoin/40 bg-surface-elevated p-5 shadow-2xl shadow-bitcoin/10"
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          style={{
            boxShadow:
              "0 0 24px rgba(247,147,26,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <span className="animate-badge-unlock text-4xl flex-shrink-0">{def.icon}</span>

            {/* Text */}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-bitcoin mb-1">
                Achievement Unlocked!
              </p>
              <p className="text-base font-bold text-primary leading-tight">{def.title}</p>
              <p className="text-sm text-text-secondary mt-0.5 leading-snug">
                {def.description}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={onDismiss}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/5 transition-colors text-text-secondary hover:text-primary"
              aria-label="Dismiss achievement toast"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="3" x2="11" y2="11" />
                <line x1="11" y1="3" x2="3" y2="11" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
