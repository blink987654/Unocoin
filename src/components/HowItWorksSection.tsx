"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Sign Up in 2 Minutes",
    description:
      "Register with your mobile number, complete KYC with Aadhaar — and you're in. No paperwork, no branch visits.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path
          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Add Funds Instantly",
    description:
      "Connect your bank account. Fund via UPI, IMPS, or NEFT — your money arrives in seconds, not days.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path
          d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10 16H6M14 16H12.5M2 10H22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Buy Bitcoin & Build Wealth",
    description:
      "Buy instantly or set up a Systematic Buying Plan starting at just ₹10. Stack sats on autopilot.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path
          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15 8.5C14.315 7.81501 13.1087 7.33855 12 7.30872M9 15.5C9.64448 16.1224 10.8428 16.6156 12 16.6823M12 7.30872C10.6809 7.27322 9.5 7.86998 9.5 9.50001C9.5 12.5 15 11 15 14C15 15.711 13.5362 16.4462 12 16.6823M12 7.30872V5.5M12 16.6823V18.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bitcoin/[0.02] to-transparent" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-bitcoin font-semibold text-sm tracking-widest uppercase mb-4"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Three steps.{" "}
            <span className="gradient-text-bitcoin">That&apos;s it.</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] right-[-40%] h-px bg-gradient-to-r from-border-medium to-transparent" />
              )}

              <div className="relative bg-surface-card border border-border-subtle rounded-2xl p-8 hover:border-bitcoin/20 transition-all duration-500 group">
                {/* Step number */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-bitcoin/20 group-hover:text-bitcoin/40 transition-colors font-mono">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-bitcoin/10 flex items-center justify-center text-bitcoin group-hover:bg-bitcoin/20 transition-colors">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed text-[15px]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a href="#" className="btn-primary text-base">
            Create Your Free Account
          </a>
          <p className="text-sm text-text-tertiary mt-3">
            No minimum balance. Start your SBP from ₹10.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
