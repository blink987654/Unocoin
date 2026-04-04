"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const heroFeatures = [
  {
    stat: "₹0 SBP Fees",
    headline: "India's first Bitcoin SIP",
    description:
      "Auto-invest in Bitcoin daily, weekly, or monthly from just ₹10. Zero transaction fees on every trade.",
  },
  {
    stat: "<1s",
    headline: "Bitcoin at lightning speed",
    description:
      "Send and receive Bitcoin instantly on the Lightning Network. Settlements in milliseconds at a fraction of a rupee.",
  },
  {
    stat: "7% APY",
    headline: "Your stablecoins, always working",
    description:
      "Put your USDT to work and earn up to 7% annual yield. No lock-in period, no complexity.",
  },
  {
    stat: "95%",
    headline: "Cold storage. Fort Knox-level",
    description:
      "95% of assets secured in cold storage with multi-sig wallets, biometric auth, and regular security audits.",
  },
];

const moreProducts = [
  {
    title: "Instant Buy & Sell",
    description: "Buy and sell Bitcoin and USDT instantly via UPI, IMPS, or NEFT.",
  },
  {
    title: "BTC Lending",
    description: "Borrow up to 70,000 USDT against your Bitcoin at 15% interest.",
  },
  {
    title: "Asset Basket",
    description: "One-click diversified crypto baskets, auto-rebalanced like an index fund.",
  },
  {
    title: "Auto Sell",
    description: "Unique BTC address that auto-converts to INR at zero fees.",
  },
  {
    title: "Asset Controls",
    description: "Move assets to your own wallet anytime with zero-fee transfers.",
  },
  {
    title: "OTC Desk",
    description: "Dedicated desk for institutional and high-volume trades.",
  },
  {
    title: "BTC Shop",
    description: "Spend Bitcoin on gift vouchers from 90+ brands.",
  },
  {
    title: "Refer & Earn",
    description: "Earn 15% commission on every trade your referrals make.",
  },
];

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

function HeroFeatureRow({
  feature,
  index,
}: {
  feature: (typeof heroFeatures)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reversed = index % 2 === 1;

  return (
    <div ref={ref} className="py-24 lg:py-32">
      <div
        className={`max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center ${
          reversed ? "direction-rtl" : ""
        }`}
        style={reversed ? { direction: "rtl" } : undefined}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: easing }}
          style={{ direction: "ltr" }}
        >
          <h3 className="text-display-sm font-bold tracking-tight text-text-primary mb-4">
            {feature.headline}
          </h3>
          <p className="text-lg text-text-secondary max-w-lg">
            {feature.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: easing }}
          style={{ direction: "ltr" }}
          className={reversed ? "lg:text-left" : "lg:text-right"}
        >
          <span
            className="gradient-text-bitcoin font-bold block"
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 1 }}
          >
            {feature.stat}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const moreRef = useRef(null);
  const moreInView = useInView(moreRef, { once: true, margin: "-50px" });

  return (
    <section id="products" className="relative bg-surface">
      <div className="relative z-10">
        {/* Section header */}
        <div
          ref={headerRef}
          className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 lg:pt-40 mb-24 lg:mb-32"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: easing }}
            className="text-sm uppercase tracking-widest text-bitcoin mb-6"
          >
            Products
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: easing }}
            className="text-display-sm font-bold tracking-tight text-text-primary"
          >
            Everything you need. Nothing you don&apos;t.
          </motion.h2>
        </div>

        {/* Hero feature rows */}
        {heroFeatures.map((feature, index) => (
          <HeroFeatureRow key={feature.headline} feature={feature} index={index} />
        ))}

        {/* More Products grid */}
        <div
          ref={moreRef}
          className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={moreInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: easing }}
            className="text-sm uppercase tracking-widest text-bitcoin mb-12"
          >
            More Products
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
            {moreProducts.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                animate={moreInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.06,
                  ease: easing,
                }}
                className="group cursor-default"
              >
                <h4 className="text-lg font-semibold text-text-primary group-hover:text-bitcoin transition-colors duration-300">
                  {product.title}
                </h4>
                <p className="text-sm text-text-tertiary mt-1">
                  {product.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
