"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ─── Data ──────────────────────────────────────────────────

const trustBadges = [
  "FIU-IND Registered",
  "PMLA Compliant",
  "Lightning Network",
  "13 Years of Operation",
  "Trusted by Sovereign Entities",
];

const traditionalPain = [
  { label: "Settlement Time", value: "3-5 business days" },
  { label: "Total Cost", value: "5-7% per transfer" },
  { label: "FX Markup", value: "2-4% hidden spread" },
  { label: "Availability", value: "Banking hours only" },
  { label: "Minimum Transfer", value: "₹15,000+" },
  { label: "Failed Transfers", value: "5-8% failure rate" },
];

const lightningAdvantage = [
  { label: "Settlement Time", value: "Milliseconds" },
  { label: "Total Cost", value: "<0.5% per transfer" },
  { label: "FX Markup", value: "Real-time mid-market rate" },
  { label: "Availability", value: "24/7/365" },
  { label: "Minimum Transfer", value: "₹1" },
  { label: "Failed Transfers", value: "<0.01% failure rate" },
];

const flowSteps = [
  {
    step: "01",
    title: "Partner Initiates",
    desc: "Your platform sends a payment request via our REST API. Customer funds are collected in sender's local currency.",
    icon: "📡",
  },
  {
    step: "02",
    title: "Lightning Settlement",
    desc: "Funds traverse the Lightning Network in milliseconds. Voltage-powered infrastructure ensures 99.99% routing success.",
    icon: "⚡",
  },
  {
    step: "03",
    title: "Unocoin Converts",
    desc: "Bitcoin is converted to INR at real-time market rates with zero slippage. FIU-IND compliant transaction logging.",
    icon: "🔄",
  },
  {
    step: "04",
    title: "INR Delivered",
    desc: "Recipient receives INR in their bank account via IMPS/NEFT or directly to their UPI ID. Confirmation webhook sent.",
    icon: "🏦",
  },
];

const useCases = [
  {
    title: "Inward Remittance",
    desc: "Enable diaspora communities to send money home to India instantly. Support USD, GBP, EUR, AED, SGD, CAD, AUD corridors with final-mile INR delivery to any bank account or UPI ID.",
    stat: "India receives $125B+ annually",
    icon: "🇮🇳",
  },
  {
    title: "Outward Remittance",
    desc: "Indian businesses and individuals sending funds abroad under LRS limits. Lightning-powered settlement replaces slow SWIFT transfers with instant, auditable transactions.",
    stat: "Under $250K LRS limit",
    icon: "🌍",
  },
  {
    title: "B2B Cross-Border Settlements",
    desc: "Import/export businesses settling invoices across borders. Eliminate correspondent banking delays. Real-time settlement with full audit trail for compliance teams.",
    stat: "Invoice settlement in <60 seconds",
    icon: "🏢",
  },
  {
    title: "Global Payroll",
    desc: "Companies paying remote workers in India. Batch API processes hundreds of payroll disbursements simultaneously. Each recipient gets INR directly, with TDS handled automatically.",
    stat: "Batch processing for 1000+ payees",
    icon: "💼",
  },
];

const technicalSpecs = [
  { label: "API Protocol", value: "REST + WebSocket" },
  { label: "Authentication", value: "HMAC-SHA256 + API Key" },
  { label: "Settlement Finality", value: "<1 second (Lightning)" },
  { label: "Uptime SLA", value: "99.99%" },
  { label: "Rate Limits", value: "10,000 req/min (Enterprise)" },
  { label: "Webhook Delivery", value: "Real-time, with retry" },
  { label: "Max Single Transfer", value: "₹50,00,000" },
  { label: "Daily Volume Capacity", value: "₹500 Cr+" },
  { label: "Sandbox Environment", value: "Full testnet available" },
  { label: "SDKs Available", value: "Python, Node.js, Go, Java" },
  { label: "Response Time (P99)", value: "<200ms" },
  { label: "Data Encryption", value: "AES-256 at rest, TLS 1.3 in transit" },
];

const compliancePoints = [
  {
    title: "FIU-IND Registered",
    desc: "Registered with the Financial Intelligence Unit of India. All transactions monitored and reported per regulatory requirements.",
  },
  {
    title: "PMLA Compliant",
    desc: "Full adherence to the Prevention of Money Laundering Act. Automated KYC/AML screening on every transaction.",
  },
  {
    title: "FEMA Compliant",
    desc: "Foreign Exchange Management Act compliance for all cross-border transactions. LRS limits enforced automatically.",
  },
  {
    title: "Tax Compliant",
    desc: "Automated 1% TDS deduction where applicable. Complete audit trails and annual tax reporting for all partners.",
  },
];

const trustStats = [
  { value: "13+", label: "Years of Operation" },
  { value: "₹3,000 Cr+", label: "Volume Processed" },
  { value: "0", label: "Security Breaches" },
  { value: "99.99%", label: "Uptime SLA" },
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

export default function RemittancePage() {
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
                Remittance Partners
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Instant Settlement.{" "}
              <span className="gradient-text-bitcoin">97% Cheaper.</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-4">
              India&apos;s $125B+ remittance market still runs on SWIFT and
              correspondent banking — 3-5 day delays, 5-7% fees, and opaque FX
              markups. Your customers deserve better.
            </p>
            <p className="text-text-tertiary max-w-2xl mx-auto mb-10 leading-relaxed">
              Unocoin&apos;s Lightning Network infrastructure settles
              cross-border payments in milliseconds, not days. API-first.
              FIU-IND registered. PMLA compliant. Trusted by sovereign entities.
              Thirteen years of operation. ₹3,000 Cr+ processed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="#contact"
                className="btn-primary !py-3 !px-8 rounded-xl text-lg"
              >
                Become a Remittance Partner
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

      {/* ─── Problem / Solution ───────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Traditional Remittance vs{" "}
              <span className="gradient-text-bitcoin">Lightning Network</span>
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              SWIFT and Western Union were built for a different era. Lightning
              Network is purpose-built for instant, global value transfer.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Traditional */}
              <div className="bg-surface-card border border-border-subtle rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-lg">
                    🏦
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      Traditional Rails
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      SWIFT, Western Union, MoneyGram
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {traditionalPain.map((item) => (
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
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      Unocoin + Lightning
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      Powered by Voltage infrastructure
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {lightningAdvantage.map((item) => (
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

      {/* ─── How It Works (4-Step Flow) ───────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              How It Works
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              Four steps. Milliseconds of settlement. Full regulatory
              compliance at every stage.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flowSteps.map((s, i) => (
                <div key={s.step} className="relative">
                  {/* Connector line */}
                  {i < flowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border-subtle -translate-x-3" />
                  )}
                  <div className="bg-surface-card border border-border-subtle rounded-xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-bitcoin/10 flex items-center justify-center text-bitcoin font-bold text-lg">
                        {s.step}
                      </div>
                      <span className="text-2xl">{s.icon}</span>
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

            {/* Flow summary */}
            <div className="mt-10 bg-surface-card border border-border-subtle rounded-xl p-6 text-center">
              <p className="text-text-secondary text-sm">
                <span className="text-text-primary font-medium">
                  End-to-end settlement:
                </span>{" "}
                Partner sends USD/GBP/EUR &rarr; Lightning Network (milliseconds)
                &rarr; Unocoin converts to INR &rarr; Recipient receives INR via
                IMPS/UPI
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Use Cases ────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Use Cases
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              Lightning-powered settlement infrastructure for every cross-border
              payment scenario.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  className="bg-surface-card border border-border-subtle rounded-xl p-8 hover:border-bitcoin/20 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl">{uc.icon}</span>
                    <div>
                      <h3 className="font-semibold text-text-primary text-lg">
                        {uc.title}
                      </h3>
                      <span className="text-xs text-bitcoin font-medium">
                        {uc.stat}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-text-tertiary leading-relaxed">
                    {uc.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── USDT on Lightning (Coming Soon) ──────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="gradient-border bg-surface-card rounded-2xl p-10 lg:p-14">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-bitcoin/10 border border-bitcoin/20 rounded-full px-4 py-1.5 mb-6">
                  <span className="text-sm text-bitcoin font-medium">
                    Coming Soon
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Stablecoins on{" "}
                  <span className="gradient-text-bitcoin">Lightning</span>
                </h2>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  USDT on Lightning Network eliminates Bitcoin volatility risk
                  entirely. Your partners send USDT, it arrives as USDT, and
                  Unocoin converts to INR at the exact moment of delivery.
                  Zero currency risk. Zero slippage. The perfect rail for
                  remittance.
                </p>

                <div className="grid sm:grid-cols-3 gap-6 mt-10">
                  <div className="bg-surface-elevated border border-border-subtle rounded-xl p-5">
                    <p className="text-2xl font-bold text-text-primary mb-1">
                      0%
                    </p>
                    <p className="text-sm text-text-tertiary">
                      Volatility Risk
                    </p>
                    <p className="text-xs text-text-tertiary mt-2">
                      Stablecoins maintain 1:1 USD peg throughout the transfer
                    </p>
                  </div>
                  <div className="bg-surface-elevated border border-border-subtle rounded-xl p-5">
                    <p className="text-2xl font-bold text-text-primary mb-1">
                      &lt;₹5
                    </p>
                    <p className="text-sm text-text-tertiary">
                      Per Transaction Fee
                    </p>
                    <p className="text-xs text-text-tertiary mt-2">
                      Lightning routing fees are near-zero regardless of amount
                    </p>
                  </div>
                  <div className="bg-surface-elevated border border-border-subtle rounded-xl p-5">
                    <p className="text-2xl font-bold text-text-primary mb-1">
                      &lt;1s
                    </p>
                    <p className="text-sm text-text-tertiary">
                      Settlement Time
                    </p>
                    <p className="text-xs text-text-tertiary mt-2">
                      Same Lightning speed, with dollar-denominated stability
                    </p>
                  </div>
                </div>

                <p className="text-sm text-text-tertiary mt-8">
                  Register as a remittance partner today to get early access
                  when USDT on Lightning goes live.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Technical Specifications ─────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Technical Specifications
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              Built for engineering teams. Production-ready API infrastructure
              with enterprise-grade reliability.
            </p>

            <div className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden">
              <div className="grid sm:grid-cols-2">
                {technicalSpecs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex justify-between items-center px-6 py-4 ${
                      i < technicalSpecs.length - (technicalSpecs.length % 2 === 0 ? 2 : 1)
                        ? "border-b border-border-subtle"
                        : ""
                    } ${i % 2 === 0 ? "sm:border-r sm:border-border-subtle" : ""}`}
                  >
                    <span className="text-sm text-text-tertiary">
                      {spec.label}
                    </span>
                    <span className="text-sm text-text-primary font-medium">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* API Example */}
            <div className="mt-8 bg-surface-card border border-border-subtle rounded-2xl p-8">
              <h3 className="font-semibold text-text-primary mb-4">
                Sample API Request
              </h3>
              <div className="bg-surface-elevated rounded-xl p-6 overflow-x-auto">
                <pre className="text-sm text-text-secondary font-mono leading-relaxed">
{`POST /v1/remittance/transfer
Content-Type: application/json
X-API-Key: your_api_key
X-Signature: hmac_sha256_signature

{
  "amount": 50000,
  "currency": "INR",
  "source_currency": "USD",
  "recipient": {
    "bank_account": "XXXXXXXXXXXX",
    "ifsc": "SBIN0001234",
    "name": "Recipient Name"
  },
  "webhook_url": "https://your-app.com/webhook",
  "reference_id": "TXN-2026-001"
}`}
                </pre>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/api-docs"
                  className="text-bitcoin text-sm font-medium hover:underline"
                >
                  Full API Documentation &rarr;
                </Link>
                <span className="text-text-tertiary text-sm">
                  Sandbox available immediately upon partner onboarding
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Trust & Compliance ───────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">
              Trust &{" "}
              <span className="gradient-text-bitcoin">Compliance</span>
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              India&apos;s oldest Bitcoin platform. Regulatory clarity is not an
              afterthought — it&apos;s foundational to how we operate.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {trustStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface-card border border-border-subtle rounded-xl p-6 text-center"
                >
                  <p className="text-3xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-tertiary">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Compliance Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {compliancePoints.map((cp) => (
                <div
                  key={cp.title}
                  className="bg-surface-card border border-border-subtle rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <svg
                      className="w-5 h-5 text-accent-green shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <h3 className="font-semibold text-text-primary">
                      {cp.title}
                    </h3>
                  </div>
                  <p className="text-sm text-text-tertiary leading-relaxed">
                    {cp.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Sovereign trust note */}
            <div className="mt-8 bg-surface-card border border-bitcoin/20 rounded-xl p-6 text-center">
              <p className="text-text-secondary text-sm leading-relaxed">
                <span className="text-text-primary font-medium">
                  Trusted by sovereign entities.
                </span>{" "}
                Unocoin has been operating since 2013 — through every regulatory
                shift, every market cycle, and every compliance evolution. When
                institutions need a partner in India they can trust with
                cross-border settlement, they choose Unocoin.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CTA / Contact ────────────────────────────────── */}
      <section id="contact" className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Become a{" "}
                <span className="gradient-text-bitcoin">
                  Remittance Partner
                </span>
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                Join the next generation of remittance infrastructure. Instant
                settlement. Near-zero fees. Full regulatory compliance. Your
                integration can be live in weeks, not months.
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
                    placeholder="cto@company.com"
                    className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-bitcoin/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Estimated Monthly Volume
                  </label>
                  <select className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-bitcoin/50 transition-colors appearance-none">
                    <option value="">Select volume range</option>
                    <option value="<50cr">Less than ₹50 Cr</option>
                    <option value="50cr-200cr">₹50 Cr - ₹200 Cr</option>
                    <option value="200cr-500cr">₹200 Cr - ₹500 Cr</option>
                    <option value="500cr+">₹500 Cr+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Primary Use Case
                  </label>
                  <select className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-bitcoin/50 transition-colors appearance-none">
                    <option value="">Select use case</option>
                    <option value="inward">Inward Remittance</option>
                    <option value="outward">Outward Remittance</option>
                    <option value="b2b">B2B Settlements</option>
                    <option value="payroll">Global Payroll</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your remittance corridors, current volumes, and integration requirements..."
                  className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-bitcoin/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full !py-3 rounded-xl text-lg"
              >
                Submit Partnership Inquiry
              </button>

              <div className="text-center space-y-2">
                <p className="text-xs text-text-tertiary">
                  Our partnerships team typically responds within one business
                  day. For urgent inquiries, email{" "}
                  <a
                    href="mailto:partners@unocoin.com"
                    className="text-bitcoin hover:underline"
                  >
                    partners@unocoin.com
                  </a>
                </p>
                <p className="text-xs text-text-tertiary">
                  Ready to explore the API?{" "}
                  <Link
                    href="/api-docs"
                    className="text-bitcoin hover:underline"
                  >
                    View API Documentation &rarr;
                  </Link>
                </p>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
