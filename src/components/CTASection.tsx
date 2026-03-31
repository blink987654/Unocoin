"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-48 lg:py-64 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-bitcoin/[0.06] rounded-full blur-[200px]" />
      </div>

      <div
        ref={ref}
        className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-display mb-8"
        >
          The best time was 2013.
          <br />
          <span className="gradient-text-bitcoin">
            The next best time is now.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          From individuals investing ₹10 to institutions moving crores — 2.26 million Indians trust Unocoin to build their financial future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://unocoin.com/in/register"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg !py-4 !px-10 rounded-xl"
            >
              Start Investing
            </a>
            <a
              href="mailto:institutional@unocoin.com"
              className="btn-secondary text-lg !py-4 !px-10 rounded-xl"
            >
              Institutional Inquiries
            </a>
          </div>

          {/* App store links */}
          <div className="flex flex-row gap-6 justify-center text-sm text-text-tertiary">
            <a
              href="https://play.google.com/store/apps/details?id=com.unocoin.unocoinwallet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              Google Play
            </a>
            <a
              href="https://apps.apple.com/in/app/unocoin-indian-crypto-exchange/id1030422972"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              App Store
            </a>
          </div>
        </motion.div>

        {/* Trust — minimal text only */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-sm text-text-tertiary"
        >
          FIU-IND Registered · PMLA Compliant · 95% Cold Storage · Trusted by Sovereign Entities
        </motion.p>
      </div>
    </section>
  );
}
