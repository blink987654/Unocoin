"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENT_DEFS } from "@/lib/hooks";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedMap: Record<string, boolean>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AchievementPanel({ isOpen, onClose, unlockedMap }: AchievementPanelProps) {
  const totalUnlocked = Object.values(unlockedMap).filter(Boolean).length;
  const total = ACHIEVEMENT_DEFS.length;
  const pct = Math.round((totalUnlocked / total) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-96 z-50 bg-surface-elevated border-l border-border-subtle flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-xl font-bold">Achievements</h2>
                <p className="text-text-secondary text-sm mt-0.5">
                  {totalUnlocked}/{total} Unlocked
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-text-secondary hover:text-primary"
                aria-label="Close achievements panel"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pb-5">
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-bitcoin to-yellow-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <p className="text-text-secondary text-xs mt-1.5">
                {pct}% complete
              </p>
            </div>

            {/* Badge Grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              <div className="grid grid-cols-3 gap-4">
                {ACHIEVEMENT_DEFS.map((def) => {
                  const unlocked = !!unlockedMap[def.id];
                  return (
                    <div key={def.id} className="flex flex-col items-center text-center">
                      <div
                        className={`relative w-16 h-16 flex items-center justify-center rounded-xl text-2xl transition-all ${
                          unlocked
                            ? "bg-bitcoin/10 border-2 border-bitcoin/50 shadow-[0_0_16px_rgba(247,147,26,0.25)]"
                            : "bg-white/[0.03] border border-border-subtle"
                        }`}
                      >
                        <span className={unlocked ? "" : "blur-[3px] grayscale opacity-40"}>
                          {def.icon}
                        </span>
                        {!unlocked && (
                          <span className="absolute inset-0 flex items-center justify-center text-base text-text-secondary">
                            🔒
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-2 text-xs font-medium leading-tight ${
                          unlocked ? "text-primary" : "text-text-secondary"
                        }`}
                      >
                        {unlocked ? def.title : "???"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
