"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ─── Data ──────────────────────────────────────────────────

const trustBadges = [
  "FIU-IND Registered",
  "Lightning Network",
  "24/7 Settlement",
  "99.99% Uptime SLA",
  "Trusted by Sovereign Entities",
];

const corridors = [
  { from: "USA", flag: "🇺🇸", fee: "0.5%", time: "<1 min" },
  { from: "UK", flag: "🇬🇧", fee: "0.6%", time: "<1 min" },
  { from: "UAE", flag: "🇦🇪", fee: "0.5%", time: "<1 min" },
  { from: "Singapore", flag: "🇸🇬", fee: "0.6%", time: "<1 min" },
  { from: "Canada", flag: "🇨🇦", fee: "0.7%", time: "<1 min" },
  { from: "Australia", flag: "🇦🇺", fee: "0.7%", time: "<1 min" },
  { from: "Europe", flag: "🇪🇺", fee: "0.6%", time: "<1 min" },
];

const integrationSteps = [
  {
    step: "01",
    title: "Sign Partnership Agreement",
    desc: "Complete our streamlined onboarding with KYB verification, compliance review, and partnership terms. Typically done in one business day.",
  },
  {
    step: "02",
    title: "Get API Keys",
    desc: "Receive your sandbox and production API credentials. Access our comprehensive developer documentation and SDKs.",
  },
  {
    step: "03",
    title: "Integrate SDK",
    desc: "Use our REST API or drop-in SDKs for Python, Node.js, Go, and more. Our solutions team is available to assist with architecture.",
  },
  {
    step: "04",
    title: "Go Live",
    desc: "After testing in sandbox, pass our compliance checklist and launch. Your first remittance settles in under 60 seconds.",
  },
];

const partnerBenefits = [
  {
    icon: "💰",
    title: "Revenue Sharing",
    desc: "Earn competitive commissions on every transaction your platform processes through our network.",
  },
  {
    icon: "🏷️",
    title: "White-Label Option",
    desc: "Offer remittance services under your own brand. Fully customizable UI components and email templates.",
  },
  {
    icon: "🤝",
    title: "Dedicated Support",
    desc: "Get a dedicated partner manager, priority Slack channel, and direct engineering support for integrations.",
  },
  {
    icon: "⚡",
    title: "Real-Time Settlement",
    desc: "Funds settle to Indian bank accounts in under 60 seconds via Lightning Network and UPI rails.",
  },
  {
    icon: "🛡️",
    title: "Compliance Handled",
    desc: "We manage KYC/AML, FEMA regulations, and FIU-IND reporting. You focus on growing your business.",
  },
  {
    icon: "🌐",
    title: "Multi-Currency Support",
    desc: "Accept USD, GBP, EUR, AED, SGD, CAD, AUD and more. Auto-conversion to INR at competitive FX rates.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    volume: "<$100K/month",
    fee: "1%",
    highlight: false,
    features: [
      "Standard REST API access",
      "Email support (24h response)",
      "Sandbox environment",
      "Basic analytics dashboard",
      "Up to 500 transactions/day",
    ],
  },
  {
    name: "Growth",
    volume: "$100K-$1M/month",
    fee: "0.7%",
    highlight: true,
    features: [
      "Priority API access",
      "Priority support (4h response)",
      "Dedicated partner manager",
      "White-label option",
      "Advanced analytics & reporting",
      "Up to 5,000 transactions/day",
    ],
  },
  {
    name: "Enterprise",
    volume: "$1M+/month",
    fee: "Custom",
    highlight: false,
    features: [
      "Custom integration support",
      "24/7 phone & Slack support",
      "SLA guarantee (99.99% uptime)",
      "Custom pricing & terms",
      "Unlimited transactions",
      "On-premise deployment option",
    ],
  },
];

const timelineSteps = [
  {
    week: "Week 1",
    title: "Onboarding",
    desc: "Partnership agreement, KYB verification, compliance review, and account setup.",
  },
  {
    week: "Week 2",
    title: "Technical Integration",
    desc: "API key provisioning, SDK setup, webhook configuration, and architecture review.",
  },
  {
    week: "Week 3",
    title: "Testing & Compliance",
    desc: "End-to-end testing in sandbox, compliance checklist, and UAT sign-off.",
  },
  {
    week: "Week 4",
    title: "Go Live",
    desc: "Production deployment, monitoring setup, and first live transaction.",
  },
];

// ─── Animated Section Wrapper ──────────────────────────────

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Component ─────────────────────────────────────────────

export default function PartnersPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <main className="relative">
      <Navigation />

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-bitcoin/[0.04] rounded-full blur-[200px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-bitcoin/10 border border-bitcoin/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-bitcoin font-medium">
                Institutional Partner Program
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Instant Settlement.{" "}
              <span className="gradient-text-bitcoin">97% Cheaper.</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-4">
              India receives over $100B in remittances every year. Your customers
              deserve instant, transparent, near-zero-cost transfers — not 3-5 day
              bank delays with hidden 5-8% fees.
            </p>
            <p className="text-text-tertiary max-w-2xl mx-auto mb-10 leading-relaxed">
              Unocoin has been India&apos;s most trusted digital asset infrastructure since 2013.
              FIU-IND registered. PMLA compliant. Trusted by sovereign entities.
              Our Voltage-powered Lightning Network settles in seconds, not days.
              Partner with the platform that institutions choose when they can&apos;t afford to be wrong.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="#contact"
                className="btn-primary !py-3 !px-8 rounded-xl text-lg"
              >
                Become a Partner
              </a>
              <Link
                href="/api-docs"
                className="btn-secondary !py-3 !px-8 rounded-xl text-lg"
              >
                View API Docs &rarr;
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="bg-surface-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-tertiary"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Traditional vs Lightning ─────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Traditional vs{" "}
              <span className="gradient-text-bitcoin">Lightning</span>
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              See why remittance companies are switching to Lightning-powered
              settlement through Unocoin.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Traditional */}
              <div className="bg-surface-card border border-border-subtle rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-lg">
                    🏦
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    Traditional Remittance
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Settlement Time", value: "3-5 business days" },
                    { label: "Total Fees", value: "5-8% per transfer" },
                    { label: "Availability", value: "Limited banking hours" },
                    { label: "Compliance", value: "Manual KYC/AML checks" },
                    { label: "Minimum Transfer", value: "$200-$500" },
                    { label: "Transparency", value: "Hidden markups on FX" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-2 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-text-tertiary text-sm">
                        {item.label}
                      </span>
                      <span className="text-red-400 text-sm font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lightning */}
              <div className="gradient-border bg-surface-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-bitcoin/10 flex items-center justify-center text-bitcoin text-lg">
                    ⚡
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    Unocoin Lightning
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Settlement Time", value: "<1 minute" },
                    { label: "Total Fees", value: "0.5-1% per transfer" },
                    { label: "Availability", value: "24/7/365" },
                    { label: "Compliance", value: "Automated KYC/AML" },
                    { label: "Minimum Transfer", value: "No minimum" },
                    { label: "Transparency", value: "Real-time FX rates" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-2 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-text-tertiary text-sm">
                        {item.label}
                      </span>
                      <span className="text-accent-green text-sm font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Supported Corridors ──────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Supported Corridors
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              Send to India from all major remittance corridors. Instant
              settlement via Lightning, final mile delivery to any Indian bank
              account or UPI ID.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {corridors.map((c) => (
                <div
                  key={c.from}
                  className="bg-surface-card border border-border-subtle rounded-xl p-5 hover:border-bitcoin/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{c.flag}</span>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {c.from} &rarr; India
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {c.from} &rarr; 🇮🇳
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-text-tertiary">Est. Fee</p>
                      <p className="text-accent-green font-medium">{c.fee}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-tertiary">Settlement</p>
                      <p className="text-bitcoin font-medium">{c.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── How Integration Works ────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              How Integration Works
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              Go from partnership agreement to live transactions in as little as
              four weeks.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrationSteps.map((s, i) => (
                <div key={s.step} className="relative">
                  {/* Connector line */}
                  {i < integrationSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border-subtle -translate-x-3" />
                  )}
                  <div className="bg-surface-card border border-border-subtle rounded-xl p-6 h-full">
                    <div className="w-12 h-12 rounded-xl bg-bitcoin/10 flex items-center justify-center text-bitcoin font-bold text-lg mb-4">
                      {s.step}
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      {s.title}
                    </h3>
                    <p className="text-sm text-text-tertiary leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Partner Benefits ─────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Partner Benefits
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              Everything you need to build a world-class remittance product,
              without the infrastructure headaches.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerBenefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-surface-card border border-border-subtle rounded-xl p-6 hover:border-bitcoin/20 transition-colors"
                >
                  <span className="text-3xl mb-4 block">{b.icon}</span>
                  <h3 className="font-semibold text-text-primary text-lg mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-text-tertiary leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Pricing Tiers ────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Pricing Tiers
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              Transparent, volume-based pricing. No setup fees, no hidden
              charges. Pay only for what you use.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl p-8 h-full flex flex-col ${
                    tier.highlight
                      ? "gradient-border bg-surface-card"
                      : "bg-surface-card border border-border-subtle"
                  }`}
                >
                  {tier.highlight && (
                    <div className="inline-flex self-start items-center gap-1 bg-bitcoin/10 border border-bitcoin/20 rounded-full px-3 py-1 mb-4">
                      <span className="text-xs text-bitcoin font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-text-tertiary mb-4">
                    {tier.volume}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-text-primary">
                      {tier.fee}
                    </span>
                    {tier.fee !== "Custom" && (
                      <span className="text-text-tertiary ml-1">per txn</span>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <svg
                          className="w-4 h-4 text-accent-green mt-0.5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`text-center py-3 px-6 rounded-xl font-medium transition-colors ${
                      tier.highlight
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                  >
                    {tier.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </a>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Integration Timeline ─────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Integration Timeline
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              From first conversation to live transactions in just four weeks.
            </p>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border-subtle" />

              <div className="space-y-12">
                {timelineSteps.map((t, i) => (
                  <div
                    key={t.week}
                    className={`relative flex items-start gap-6 md:gap-12 ${
                      i % 2 === 0
                        ? "md:flex-row"
                        : "md:flex-row-reverse md:text-right"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-bitcoin border-4 border-surface z-10 mt-1" />

                    {/* Content */}
                    <div className="md:w-1/2" />
                    <div className="ml-12 md:ml-0 md:w-1/2">
                      <div className="bg-surface-card border border-border-subtle rounded-xl p-6">
                        <span className="text-xs text-bitcoin font-semibold uppercase tracking-wider">
                          {t.week}
                        </span>
                        <h3 className="font-semibold text-text-primary text-lg mt-1 mb-2">
                          {t.title}
                        </h3>
                        <p className="text-sm text-text-tertiary leading-relaxed">
                          {t.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Contact / CTA ────────────────────────────────── */}
      <section id="contact" className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform{" "}
                <span className="gradient-text-bitcoin">Remittance</span>?
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                Join leading fintech companies already using Unocoin&apos;s
                Lightning infrastructure to power instant remittances to India.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-surface-card border border-border-subtle rounded-2xl p-8 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Remittance Inc."
                    className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-bitcoin/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="partner@company.com"
                    className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-bitcoin/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Estimated Monthly Volume
                </label>
                <select className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-bitcoin/50 transition-colors appearance-none">
                  <option value="">Select volume range</option>
                  <option value="<100k">Less than $100K</option>
                  <option value="100k-500k">$100K - $500K</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="1m-5m">$1M - $5M</option>
                  <option value="5m+">$5M+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your remittance business and how you'd like to integrate with Unocoin..."
                  className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-bitcoin/50 transition-colors resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full !py-3 rounded-xl text-lg">
                Submit Partnership Inquiry
              </button>

              <p className="text-xs text-text-tertiary text-center">
                Our partnerships team typically responds within one business day.
                For urgent inquiries, email{" "}
                <a
                  href="mailto:partnerships@unocoin.com"
                  className="text-bitcoin hover:underline"
                >
                  partnerships@unocoin.com
                </a>
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
