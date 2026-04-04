"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    title: "OTC Desk",
    description:
      "Large-volume trades with zero slippage. Personal account management. Competitive institutional pricing. Minimum \u20B950 lakh per trade.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M3 6h18M3 12h18M3 18h18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="17" cy="6" r="2" fill="currentColor" />
        <circle cx="7" cy="12" r="2" fill="currentColor" />
        <circle cx="14" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
    accent: "from-bitcoin to-bitcoin-light",
  },
  {
    title: "Institutional Custody",
    description:
      "95% cold storage. Multi-signature wallets. Insurance-backed. Regular third-party security audits. Segregated accounts for institutional clients.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M3 10.417C3 7.219 3 5.62 3.378 5.082C3.755 4.545 5.258 4.03 8.264 3.001L8.831 2.805C10.218 2.268 10.912 2 11.65 2C12.388 2 13.082 2.268 14.47 2.805L15.036 3.001C18.043 4.03 19.546 4.545 19.923 5.082C20.3 5.62 20.3 7.22 20.3 10.417V11.991C20.3 17.629 15.769 20.366 13.39 21.527C12.917 21.76 12.681 21.876 11.65 21.876C10.619 21.876 10.383 21.76 9.91 21.527C7.531 20.366 3 17.63 3 11.991V10.417Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9.5 12.5L11 14L14.5 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: "from-accent-purple to-accent-blue",
  },
  {
    title: "Enterprise API",
    description:
      "99.99% uptime SLA. Dedicated endpoints. Priority rate limits. WebSocket streams. Batch operations. Custom integration support.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M7 8L3 12L7 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 8L21 12L17 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 4L10 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: "from-accent-blue to-accent-green",
  },
  {
    title: "Wealth Advisory",
    description:
      "AI-powered portfolio construction. Tax-optimized strategies. Systematic Buying Plans from \u20B910 to \u20B910 Cr. Dedicated relationship manager.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15 8.5C14.315 7.815 13.109 7.339 12 7.309M9 15.5C9.644 16.122 10.843 16.616 12 16.682M12 7.309C10.681 7.273 9.5 7.87 9.5 9.5C9.5 12.5 15 11 15 14C15 15.711 13.536 16.446 12 16.682M12 7.309V5.5M12 16.682V18.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: "from-bitcoin to-accent-purple",
  },
];

const trustBadges = [
  "FIU-IND Registered",
  "SOC 2 Compliant",
  "$3,000 Cr+ Processed",
  "13 Years Operating",
  "Trusted by Sovereign Entities",
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative rounded-2xl p-10 hover:bg-surface-hover/50 transition-all duration-500"
    >
      {/* Content */}
      <h3 className="text-xl font-semibold mb-3 tracking-tight">
        {service.title}
      </h3>
      <p className="text-text-secondary leading-relaxed">
        {service.description}
      </p>
    </motion.div>
  );
}

export default function InstitutionalSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const badgesRef = useRef(null);
  const badgesInView = useInView(badgesRef, { once: true, margin: "-50px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  return (
    <section className="relative py-40 lg:py-56">
      {/* Background accent */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-bitcoin/[0.02] rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div ref={ref} className="max-w-3xl mx-auto text-center mb-24 lg:mb-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-widest text-bitcoin mb-6"
          >
            Institutional &amp; Private Wealth
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-display-sm tracking-tight mb-8"
          >
            Where serious capital meets
            <br />
            serious infrastructure.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
          >
            IndiaBitcoin&apos;s institutional suite serves family offices, corporate
            treasuries, and sovereign entities with white-glove digital asset services.
            Dedicated relationship managers. Institutional-grade custody.
            Volume-based pricing.
          </motion.p>
        </div>

        {/* 2x2 Service cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-24">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Trust badges row */}
        <motion.div
          ref={badgesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={badgesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-24"
        >
          {trustBadges.map((badge) => (
            <span
              key={badge}
              className="bg-surface-elevated/60 border border-border-subtle rounded-full px-5 py-2.5 text-sm text-text-secondary tracking-wide"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:institutional@indiabitcoin.com"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-bitcoin to-bitcoin-light text-white font-semibold text-base hover:opacity-90 transition-opacity duration-300 tracking-wide"
            >
              Contact Institutional Sales
            </a>
            <a
              href="/api-docs"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-border-subtle text-text-secondary font-semibold text-base hover:border-bitcoin/40 hover:text-text-primary transition-all duration-300 tracking-wide"
            >
              View API Documentation
            </a>
          </div>
        </motion.div>

        {/* Confidentiality note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={ctaInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center text-sm text-text-tertiary italic tracking-wide"
        >
          Some of India&apos;s most trusted institutions choose IndiaBitcoin. For
          confidentiality reasons, we cannot name them.
        </motion.p>
      </div>
    </section>
  );
}
