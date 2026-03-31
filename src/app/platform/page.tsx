"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Section wrapper ───────────────────────────────────────
function Section({
  children,
  className = "",
  elevated = false,
}: {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <section
      className={`${elevated ? "bg-surface-elevated/50" : ""} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </section>
  );
}

// ─── Animated heading ──────────────────────────────────────
function AnimatedBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}

// ─── AI capabilities ───────────────────────────────────────
const capabilities = [
  {
    title: "Autopilot",
    subtitle: "AI-designed investment strategies",
    description:
      "Answer six questions about your goals, income, and risk tolerance. Our AI analyzes your profile and designs a personalized Bitcoin investment strategy — then executes it automatically via SBP.",
    details: [
      "Personalized asset allocation across BTC, ETH, and stablecoins",
      "Projection models across conservative, moderate, and aggressive scenarios",
      "Auto-executing via Unocoin's SBP infrastructure",
      "Adjust or cancel anytime with zero lock-in",
    ],
  },
  {
    title: "Ask Satoshi",
    subtitle: "Conversational AI assistant",
    description:
      "Get instant answers about Bitcoin, market conditions, Unocoin products, and investment strategies. Powered by Claude, built specifically for the Indian market context.",
    details: [
      "Real-time market data and price analysis",
      "Product explanations tailored to your portfolio",
      "Tax and regulatory guidance for Indian investors",
      "Available 24/7 in the bottom-right corner of every page",
    ],
  },
  {
    title: "Smart Onboarding",
    subtitle: "From zero to investing in 60 seconds",
    description:
      "New to Bitcoin? The platform guides you through setup with contextual explanations at every step. No jargon, no confusion — just clear guidance personalized to your experience level.",
    details: [
      "Adaptive interface based on user experience level",
      "Contextual tooltips and explanations",
      "One-tap SBP setup with AI-recommended amounts",
      "Risk assessment built into the flow",
    ],
  },
];

const techStack = [
  {
    label: "AI Engine",
    value: "Claude by Anthropic",
  },
  {
    label: "Real-time Data",
    value: "CoinMarketCap API",
  },
  {
    label: "Lightning",
    value: "Voltage Infrastructure",
  },
  {
    label: "Settlement",
    value: "Instant via UPI / IMPS / NEFT",
  },
  {
    label: "Security",
    value: "95% Cold Storage, Multi-sig",
  },
  {
    label: "Compliance",
    value: "FIU-IND, PMLA, KYC/AML",
  },
];

const timeline = [
  {
    year: "2013",
    event: "Founded as India's first Bitcoin platform",
  },
  {
    year: "2016",
    event: "Launched India's first Bitcoin SBP (Systematic Buying Plan)",
  },
  {
    year: "2020",
    event: "Won Supreme Court case against RBI ban",
  },
  {
    year: "2024",
    event: "Integrated Lightning Network for instant settlements",
  },
  {
    year: "2025",
    event: "Launched AI-powered Autopilot and Ask Satoshi",
  },
  {
    year: "Now",
    event: "Building the next generation of intelligent investing tools",
  },
];

export default function PlatformPage() {
  return (
    <main className="bg-surface text-text-primary min-h-screen">
      <Navigation />

      {/* Hero */}
      <Section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <AnimatedBlock>
          <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
            Platform
          </p>
          <h1
            className="font-bold tracking-tight text-text-primary mb-6"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Investing, redesigned
            <br />
            <span className="gradient-text-bitcoin">with intelligence</span>
          </h1>
        </AnimatedBlock>
        <AnimatedBlock delay={0.15}>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-10">
            Unocoin combines 13 years of Bitcoin infrastructure with AI to make
            investing effortless. No dashboards to decipher. No charts to study.
            Tell us your goals — we handle the rest.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl">
            {[
              { stat: "60s", label: "From zero to a personalized strategy" },
              { stat: "24/7", label: "AI assistant answers any question" },
              { stat: "₹10", label: "Start investing with any budget" },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-3xl font-bold gradient-text-bitcoin block mb-1">
                  {item.stat}
                </span>
                <span className="text-sm text-text-tertiary">{item.label}</span>
              </div>
            ))}
          </div>
        </AnimatedBlock>
      </Section>

      {/* AI Capabilities */}
      <Section elevated className="py-24 lg:py-32">
        {capabilities.map((cap, i) => (
          <div
            key={cap.title}
            className={`py-16 lg:py-24 ${i < capabilities.length - 1 ? "border-b border-border-subtle" : ""}`}
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <AnimatedBlock>
                <p className="text-sm uppercase tracking-widest text-bitcoin mb-4">
                  {cap.subtitle}
                </p>
                <h2 className="text-display-sm font-bold tracking-tight mb-4">
                  {cap.title}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {cap.description}
                </p>
              </AnimatedBlock>
              <AnimatedBlock delay={0.1}>
                <ul className="space-y-4 mt-2">
                  {cap.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-3 text-text-secondary"
                    >
                      <span className="w-1.5 h-1.5 bg-bitcoin rounded-full mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                {cap.title === "Autopilot" && (
                  <Link
                    href="/autopilot"
                    className="inline-block mt-8 btn-primary !py-3 !px-8 !rounded-lg text-sm"
                  >
                    Try Autopilot Now
                  </Link>
                )}
              </AnimatedBlock>
            </div>
          </div>
        ))}
      </Section>

      {/* How it works — simple flow */}
      <Section className="py-24 lg:py-32">
        <AnimatedBlock>
          <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
            How it works
          </p>
          <h2 className="text-display-sm font-bold tracking-tight mb-16">
            Three steps. That&apos;s it.
          </h2>
        </AnimatedBlock>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {[
            {
              step: "01",
              title: "Tell us your goals",
              desc: "Age, income, budget, risk tolerance. Six quick questions — no signup needed to explore.",
            },
            {
              step: "02",
              title: "AI builds your plan",
              desc: "Our engine analyzes your profile and designs an optimal allocation across Bitcoin, stablecoins, and yields.",
            },
            {
              step: "03",
              title: "It runs on autopilot",
              desc: "Your SBP executes automatically. Daily, weekly, or monthly. Adjust anytime. Cancel with one tap.",
            },
          ].map((item, i) => (
            <AnimatedBlock key={item.step} delay={i * 0.1}>
              <span className="text-5xl font-bold gradient-text-bitcoin block mb-4">
                {item.step}
              </span>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {item.desc}
              </p>
            </AnimatedBlock>
          ))}
        </div>
      </Section>

      {/* Tech Stack */}
      <Section elevated className="py-24 lg:py-32">
        <AnimatedBlock>
          <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
            Under the hood
          </p>
          <h2 className="text-display-sm font-bold tracking-tight mb-16">
            Built on proven infrastructure
          </h2>
        </AnimatedBlock>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {techStack.map((item, i) => (
            <AnimatedBlock key={item.label} delay={i * 0.05}>
              <div className="group">
                <p className="text-xs uppercase tracking-widest text-text-tertiary mb-1">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-text-primary group-hover:text-bitcoin transition-colors">
                  {item.value}
                </p>
              </div>
            </AnimatedBlock>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section className="py-24 lg:py-32">
        <AnimatedBlock>
          <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
            Our journey
          </p>
          <h2 className="text-display-sm font-bold tracking-tight mb-16">
            13 years of building trust
          </h2>
        </AnimatedBlock>

        <div className="space-y-0">
          {timeline.map((item, i) => (
            <AnimatedBlock key={item.year} delay={i * 0.08}>
              <div className="flex items-baseline gap-8 py-5 border-b border-border-subtle">
                <span className="text-2xl font-bold gradient-text-bitcoin w-20 shrink-0">
                  {item.year}
                </span>
                <span className="text-text-secondary">{item.event}</span>
              </div>
            </AnimatedBlock>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-32 lg:py-48 text-center">
        <AnimatedBlock>
          <h2
            className="font-bold tracking-tight mb-6"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Ready to let AI
            <br />
            <span className="gradient-text-bitcoin">manage your wealth?</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-10">
            Join 2.26 million Indians who trust Unocoin. Start with as little as
            ₹10. No lock-in. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/autopilot"
              className="btn-primary !py-4 !px-10 !rounded-xl text-lg"
            >
              Try Autopilot
            </Link>
            <Link
              href="/"
              className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
            >
              Back to home
            </Link>
          </div>
        </AnimatedBlock>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-text-tertiary">
          Unocoin Technologies Pvt. Ltd. · FIU-IND Registered · PMLA Compliant
        </div>
      </footer>
    </main>
  );
}
