"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ─── Data ──────────────────────────────────────────────────

const securityStats = [
  { value: "95%", label: "Assets in Cold Storage" },
  { value: "0", label: "Security Breaches Since 2013" },
  { value: "24/7", label: "Real-time Monitoring" },
  { value: "Multi-Sig", label: "Wallet Architecture" },
];

const securityLayers = [
  {
    layer: 1,
    title: "DDoS Protection & WAF",
    desc: "Enterprise-grade web application firewall and DDoS mitigation. Every request filtered before reaching our infrastructure.",
    icon: "🛡️",
  },
  {
    layer: 2,
    title: "API Security",
    desc: "HMAC-SHA256 signed requests. Rate limiting. IP whitelisting for institutional accounts. OAuth 2.0 authentication.",
    icon: "🔐",
  },
  {
    layer: 3,
    title: "Identity Verification",
    desc: "Aadhaar-based biometric KYC. PAN verification. Device fingerprinting. Suspicious login detection with automatic lockout.",
    icon: "🪪",
  },
  {
    layer: 4,
    title: "Transaction Monitoring",
    desc: "Real-time AML screening on every transaction. AI-powered anomaly detection. FIU-IND compliant reporting. PMLA adherence.",
    icon: "📊",
  },
  {
    layer: 5,
    title: "Hot Wallet (5%)",
    desc: "Only 5% of assets in hot wallets for immediate withdrawals. Multi-signature approval. Automatic replenishment from cold storage.",
    icon: "⚡",
  },
  {
    layer: 6,
    title: "Cold Storage Vault (95%)",
    desc: "Air-gapped, geographically distributed cold storage. Hardware Security Modules (HSM). Multi-signature with key ceremony. Insurance-backed.",
    icon: "🏦",
  },
];

const complianceItems = [
  {
    title: "FIU-IND Registered",
    desc: "Registered with Financial Intelligence Unit of India under PMLA",
  },
  {
    title: "KYC/AML Compliant",
    desc: "Banking-level identity verification with PAN and Aadhaar",
  },
  {
    title: "Tax Compliant",
    desc: "Automated 1% TDS deduction. Annual tax statements. 30% digital asset tax handling.",
  },
  {
    title: "PMLA Adherent",
    desc: "Full compliance with Prevention of Money Laundering Act",
  },
  {
    title: "Device Security",
    desc: "Biometric authentication. Device management. Session controls.",
  },
  {
    title: "Audit Trail",
    desc: "Complete transaction history. Exportable audit logs. Regulatory reporting ready.",
  },
];

const weDo = [
  "Regular penetration testing",
  "Bug bounty program",
  "Employee background verification",
  "Principle of least privilege access",
  "Encrypted data at rest and in transit",
  "Geographic distribution of backups",
];

const youDo = [
  "Enable two-factor authentication",
  "Use unique, strong passwords",
  "Verify withdrawal addresses carefully",
  "Monitor login notifications",
  "Keep your devices updated",
  "Report suspicious activity immediately",
];

// ─── Animated Section Wrapper ──────────────────────────────

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Component ─────────────────────────────────────────────

export default function SecurityPage() {
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
                Security &amp; Infrastructure
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your assets.{" "}
              <span className="gradient-text-bitcoin">Fort Knox-level</span>{" "}
              protection.
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-4">
              Institutional-grade security infrastructure trusted by sovereign
              entities, family offices, and 2.26 million Indians. 13 years.
              Zero breaches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Security Stats ────────────────────────────────── */}
      <section className="py-16 border-y border-border-subtle bg-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {securityStats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-bitcoin mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Multi-Layer Security Architecture ─────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Multi-Layer Security Architecture
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Six concentric layers of protection stand between threat actors
              and your assets. Every layer independently audited.
            </p>
          </AnimatedSection>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical connecting line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-bitcoin/60 via-bitcoin/30 to-bitcoin/10 hidden sm:block" />

            <div className="space-y-4">
              {securityLayers.map((layer, i) => (
                <AnimatedSection key={layer.layer} delay={i * 0.1}>
                  <div
                    className={`relative rounded-2xl border border-border-subtle p-6 transition-colors hover:border-bitcoin/20 ${
                      i % 2 === 0 ? "bg-surface-card" : "bg-surface-elevated"
                    }`}
                    style={{ marginLeft: `${i * 16}px` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center relative z-10">
                        <span className="text-2xl">{layer.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-bitcoin bg-bitcoin/10 rounded-full px-2.5 py-0.5">
                            Layer {layer.layer}
                          </span>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {layer.title}
                          </h3>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {layer.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Compliance & Regulatory ───────────────────────── */}
      <section className="py-24 bg-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Compliance &amp; Regulatory
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Chosen by institutions that can&apos;t afford to be wrong. Every
              compliance requirement met before it becomes mandatory.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceItems.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.08}>
                <div className="gradient-border h-full">
                  <div className="bg-surface-card rounded-2xl p-6 h-full relative z-10">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Operational Security ──────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Operational Security
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Security is a shared responsibility. Here is what we each bring to
              the table.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 h-full">
                <h3 className="text-xl font-semibold text-bitcoin mb-6">
                  What We Do
                </h3>
                <ul className="space-y-4">
                  {weDo.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-text-secondary"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bitcoin flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 h-full">
                <h3 className="text-xl font-semibold text-bitcoin mb-6">
                  What You Can Do
                </h3>
                <ul className="space-y-4">
                  {youDo.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-text-secondary"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-surface-elevated border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Security questions? Our team is here.
            </h2>
            <p className="text-text-tertiary max-w-2xl mx-auto mb-10 leading-relaxed">
              13 years of operation. Zero security breaches. Trusted at the
              highest levels of Indian governance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:security@unocoin.com"
                className="inline-flex items-center gap-2 bg-bitcoin hover:bg-bitcoin-dark text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
              >
                Contact Security Team
              </a>
              <Link
                href="/api-docs"
                className="inline-flex items-center gap-2 border border-border-subtle hover:border-bitcoin/30 text-text-secondary hover:text-text-primary font-semibold px-8 py-3.5 rounded-full transition-colors"
              >
                View API Documentation
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
