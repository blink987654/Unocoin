"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15 8.5C14.315 7.81501 13.1087 7.33855 12 7.30872M9 15.5C9.64448 16.1224 10.8428 16.6156 12 16.6823M12 7.30872C10.6809 7.27322 9.5 7.86998 9.5 9.50001C9.5 12.5 15 11 15 14C15 15.711 13.5362 16.4462 12 16.6823M12 7.30872V5.5M12 16.6823V18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Bitcoin SBP",
    subtitle: "0% Fee Crypto SIP",
    description:
      "India's first Crypto SIP since 2015. Auto-buy BTC or ETH daily, weekly, or monthly from just ₹10. Zero transaction fees on all SBP trades.",
    accent: "from-bitcoin to-bitcoin-light",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 16H6M14 16H12.5M2 10H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Instant Buy & Sell",
    subtitle: "UPI, IMPS, NEFT",
    description:
      "Buy and sell 120+ cryptos instantly. Direct bank integration with UPI, IMPS, and NEFT. Maker fees from just 0.2%.",
    accent: "from-accent-blue to-accent-purple",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M18 7.5V7C18 5.11438 18 4.17157 17.4142 3.58579C16.8284 3 15.8856 3 14 3H10C8.11438 3 7.17157 3 6.58579 3.58579C6 4.17157 6 5.11438 6 7V7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 13V11M14 13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 12.5C2 10.143 2 8.96447 2.58579 8.17157C2.87868 7.77513 3.27513 7.47868 3.67157 7.28579C4.46447 7 5.643 7 8 7H16C18.357 7 19.5355 7 20.3284 7.28579C20.7249 7.47868 21.1213 7.77513 21.4142 8.17157C22 8.96447 22 10.143 22 12.5V14.5C22 16.857 22 18.0355 21.4142 18.8284C21.1213 19.2249 20.7249 19.5213 20.3284 19.7142C19.5355 20 18.357 20 16 20H8C5.643 20 4.46447 20 3.67157 19.7142C3.27513 19.5213 2.87868 19.2249 2.58579 18.8284C2 18.0355 2 16.857 2 14.5V12.5Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Lightning Network",
    subtitle: "Instant BTC & USDT Settlements",
    description:
      "Powered by Voltage. Send and receive Bitcoin in milliseconds at a fraction of a rupee. USDT on Lightning coming soon.",
    accent: "from-bitcoin to-accent-purple",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14.5 9.5L8.5 9.5M14.5 9.5C14.5 8.56538 12.775 6.79575 12.0714 6.25M14.5 9.5C14.5 10.4346 12.775 12.2042 12.0714 12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 14.5L15.5 14.5M9.5 14.5C9.5 15.4346 11.225 17.2042 11.9286 17.75M9.5 14.5C9.5 13.5654 11.225 11.7958 11.9286 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "USDT Earnings",
    subtitle: "Up to 7% APY",
    description:
      "Put your USDT to work and earn up to 7% annual interest. Passive income on stablecoins, no lock-in period.",
    accent: "from-accent-green to-bitcoin",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Crypto Lending",
    subtitle: "Instant Loans Against BTC",
    description:
      "Borrow 200–70,000 USDT against your Bitcoin at 15% interest. EMI or Flexi repayment plans. Zero processing fee on EMI.",
    accent: "from-accent-purple to-accent-blue",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 10.417C3 7.219 3 5.62 3.378 5.082C3.755 4.545 5.258 4.03 8.264 3.001L8.831 2.805C10.218 2.268 10.912 2 11.65 2C12.388 2 13.082 2.268 14.47 2.805L15.036 3.001C18.043 4.03 19.546 4.545 19.923 5.082C20.3 5.62 20.3 7.22 20.3 10.417V11.991C20.3 17.629 15.769 20.366 13.39 21.527C12.917 21.76 12.681 21.876 11.65 21.876C10.619 21.876 10.383 21.76 9.91 21.527C7.531 20.366 3 17.63 3 11.991V10.417Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 12.5L11 14L14.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Vault Security",
    subtitle: "Institutional-Grade Protection",
    description:
      "95% cold storage. Multi-sig wallets. Biometric authentication. Device management. Regular security audits. Your assets are Fort Knox-level safe.",
    accent: "from-accent-purple to-bitcoin",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Crypto Basket",
    subtitle: "One-Click Diversification",
    description:
      "6-coin baskets allocated by market cap or volume. Choose from 40+ coins or build custom baskets. Auto-rebalanced like an index fund.",
    accent: "from-accent-blue to-accent-green",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Auto Sell",
    subtitle: "0% Fee BTC→INR",
    description:
      "Get a unique BTC deposit address that auto-sells to INR at market rate — zero fees. Perfect for freelancers and remittance recipients.",
    accent: "from-accent-green to-bitcoin",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M20 12V8C20 5.17157 20 3.75736 19.1213 2.87868C18.2426 2 16.8284 2 14 2H10C7.17157 2 5.75736 2 4.87868 2.87868C4 3.75736 4 5.17157 4 8V16C4 18.8284 4 20.2426 4.87868 21.1213C5.75736 22 7.17157 22 10 22H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 7H16M8 11H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 19C16 17.3431 17.3431 16 19 16C20.6569 16 22 17.3431 22 19C22 20.6569 20.6569 22 19 22C17.3431 22 16 20.6569 16 19Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Crypto Controls",
    subtitle: "Full Withdrawal Freedom",
    description:
      "Move crypto to your own wallet anytime. Send to other Unocoin users by mobile number — zero fees. Plus zero-fee BTC batch withdrawals twice weekly.",
    accent: "from-accent-green to-accent-blue",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="6" r="2" fill="currentColor" />
        <circle cx="7" cy="12" r="2" fill="currentColor" />
        <circle cx="14" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
    title: "OTC Desk",
    subtitle: "Large Volume Trades",
    description:
      "Dedicated desk for institutional and high-volume trades. Competitive rates, personal account management, and deep liquidity.",
    accent: "from-bitcoin to-accent-blue",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M4 18V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 8h16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "BTC Shop",
    subtitle: "Spend Crypto on 90+ Brands",
    description:
      "Buy gift vouchers from Dominos, Amazon, Flipkart, Swiggy, and 90+ brands using your Bitcoin. Spend crypto in the real world.",
    accent: "from-bitcoin to-accent-green",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
    title: "Refer & Earn",
    subtitle: "15% Commission",
    description:
      "Invite friends and earn 15% commission on every trade they make. Both you and your referral get free Bitcoin rewards on signup.",
    accent: "from-accent-purple to-bitcoin",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative gradient-border bg-surface-card p-8 rounded-2xl hover:bg-surface-hover transition-all duration-500"
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-500`}
      >
        {feature.icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
      <p className="text-sm text-bitcoin font-medium mb-3">
        {feature.subtitle}
      </p>
      <p className="text-text-secondary leading-relaxed text-[15px]">
        {feature.description}
      </p>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-bitcoin/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="products" className="relative py-32 lg:py-40">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-bitcoin/[0.03] rounded-full blur-[120px] -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div ref={ref} className="max-w-2xl mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-bitcoin font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Why Unocoin
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            Everything you need.
            <br />
            <span className="gradient-text-bitcoin">Nothing you don&apos;t.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed"
          >
            From retail SIPs to institutional OTC. From Lightning-fast settlements to AI-powered wealth management. 13 years of building the infrastructure that India&apos;s most discerning investors depend on.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
