"use client";

import { UnocoinBrand } from "./UnocoinLogo";

const footerLinks = {
  Products: [
    { label: "Buy Bitcoin", href: "#products" },
    { label: "Systematic Buying Plan (SBP)", href: "#products" },
    { label: "Asset Basket", href: "#products" },
    { label: "BTC Lending", href: "#products" },
    { label: "USDT Earnings", href: "#products" },
    { label: "Auto Sell", href: "#products" },
    { label: "OTC Desk", href: "#products" },
    { label: "BTC Shop", href: "#products" },
    { label: "Lightning Network", href: "#products" },
    { label: "Remittance", href: "/remittance" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Blog", href: "https://blog.unocoin.com" },
    { label: "Careers", href: "https://unocoin.com/in/about/who-we-are/" },
    { label: "Contact Us", href: "https://unocoin.com/in/support/contact-us/" },
  ],
  Legal: [
    { label: "Terms of Use", href: "https://unocoin.com/in/policy/termsofuse/" },
    { label: "Privacy Policy", href: "https://unocoin.com/in/policy/privacy-policy/" },
    { label: "KYC/AML Policy", href: "https://unocoin.com/in/policy/kyc/" },
    { label: "Risk Warnings", href: "https://unocoin.com/in/policy/riskwarning/" },
    { label: "Cookies Policy", href: "https://unocoin.com/in/policy/cookies/" },
  ],
  Resources: [
    { label: "Help Center", href: "https://support.unocoin.com" },
    { label: "Fee Schedule", href: "https://unocoin.com/in/support/fees/" },
    { label: "Security", href: "https://unocoin.com/in/support/security/" },
    { label: "How It Works", href: "https://unocoin.com/in/support/how-it-works/" },
    { label: "Exchange FAQ", href: "https://unocoin.com/in/support/exchange-faq/" },
    { label: "Lending FAQ", href: "https://unocoin.com/in/support/lending-faq/" },
    { label: "Unoversity (Free Courses)", href: "https://edu.unocoin.com/" },
    { label: "Listed Coins", href: "https://unocoin.com/in/about/coin-list/" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="mb-4">
              <UnocoinBrand logoSize={32} wordmarkSize="text-lg" animated={false} />
            </div>
            <p className="text-sm text-text-tertiary leading-relaxed max-w-xs mb-4">
              India&apos;s pioneer Bitcoin platform. Bringing Bitcoin to billions
              since 2013.
            </p>

            {/* App download buttons */}
            <div className="flex flex-col gap-2 mb-5">
              <a
                href="https://play.google.com/store/apps/details?id=com.unocoin.unocoinwallet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:border-border-medium transition-all w-fit"
              >
                <span>▶</span> Google Play
              </a>
              <a
                href="https://apps.apple.com/in/app/unocoin-indian-crypto-exchange/id1030422972"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:border-border-medium transition-all w-fit"
              >
                <span></span> App Store
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { label: "X", href: "https://twitter.com/Unocoin", icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                { label: "LinkedIn", href: "https://in.linkedin.com/company/unocoin", icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
                { label: "Telegram", href: "https://t.me/Unocoin_Group", icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg> },
                { label: "YouTube", href: "https://www.youtube.com/c/Unocoin/videos", icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
                { label: "Instagram", href: "https://www.instagram.com/unocoin/", icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" /></svg> },
                { label: "Facebook", href: "https://www.facebook.com/unocoin/", icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-bitcoin/30 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div className="mt-5 space-y-1.5">
              <p className="text-xs text-text-tertiary">
                <span className="text-text-secondary">Email:</span>{" "}
                <a href="mailto:support@unocoin.com" className="hover:text-text-primary transition-colors">support@unocoin.com</a>
              </p>
              <p className="text-xs text-text-tertiary">
                <span className="text-text-secondary">Phone:</span>{" "}
                <a href="tel:+917788978910" className="hover:text-text-primary transition-colors">+91 7788978910</a>
              </p>
              <p className="text-xs text-text-tertiary">
                <span className="text-text-secondary">Toll-Free:</span>{" "}
                <a href="tel:18001032646" className="hover:text-text-primary transition-colors">1800-103-2646</a>
              </p>
              <p className="text-xs text-text-tertiary">Mon–Sat, 9:30 AM – 6:30 PM IST</p>
              <p className="text-xs text-text-tertiary mt-2 leading-relaxed">
                Rajajinagar, Dr. Rajkumar Road,<br />
                Bangalore - 560010, India
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-text-primary mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-tertiary hover:text-text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Compliance & Disclaimer */}
        <div className="mb-8 p-4 bg-surface-elevated/30 rounded-xl border border-border-subtle">
          <p className="text-xs text-text-tertiary leading-relaxed mb-2">
            <span className="text-text-secondary font-medium">FIU-IND Registered</span> — Unocoin is registered with the Financial Intelligence Unit of India under the Prevention of Money Laundering Act (PMLA). We follow banking-level KYC/AML compliance including PAN verification, Aadhaar authentication, and ongoing transaction monitoring.
          </p>
          <p className="text-xs text-text-tertiary leading-relaxed mb-2">
            <span className="text-text-secondary font-medium">Tax Notice:</span> Digital asset transactions in India are subject to 30% tax on profits and 1% TDS on trades, as per the Finance Act 2022.
          </p>
          <p className="text-xs text-text-tertiary leading-relaxed">
            <span className="text-text-secondary font-medium">Disclaimer:</span> Digital assets and NFTs are unregulated and can be highly volatile. There may be no regulatory recourse for any loss from such transactions. Please do your own research (DYOR) before investing.
          </p>
        </div>

        {/* Fee summary */}
        <div className="mb-8 flex flex-wrap items-center gap-4 justify-center">
          {[
            { label: "SBP Trades", value: "0%" },
            { label: "Auto Sell", value: "0%" },
            { label: "Maker Fee", value: "0.2%" },
            { label: "Taker Fee", value: "0.3%" },
            { label: "INR Deposit", value: "Free" },
            { label: "Asset Deposit", value: "Free" },
            { label: "Batch BTC Withdrawal", value: "Free" },
          ].map((fee) => (
            <div key={fee.label} className="flex items-center gap-2 bg-surface-elevated/40 rounded-lg px-3 py-1.5 border border-border-subtle">
              <span className="text-xs text-text-tertiary">{fee.label}</span>
              <span className="text-xs font-semibold text-text-secondary">{fee.value}</span>
            </div>
          ))}
          <a href="https://unocoin.com/in/support/fees/" target="_blank" rel="noopener noreferrer" className="text-xs text-bitcoin hover:text-bitcoin-light transition-colors">
            View full fee schedule →
          </a>
        </div>

        <div className="section-divider mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Unocoin Technologies Pvt. Ltd. All
            rights reserved. FIU-IND Registered.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-text-tertiary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full" />
              All Systems Operational
            </span>
            <span className="text-xs text-text-tertiary">
              Made with conviction in Bangalore, India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
