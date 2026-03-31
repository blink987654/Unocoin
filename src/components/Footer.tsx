"use client";

const footerLinks = {
  Products: [
    { label: "Buy Bitcoin", href: "#products" },
    { label: "Systematic Buying Plan (SBP)", href: "#products" },
    { label: "Crypto Basket", href: "#products" },
    { label: "Crypto Lending", href: "#products" },
    { label: "USDT Earnings", href: "#products" },
    { label: "Auto Sell", href: "#products" },
    { label: "OTC Desk", href: "#products" },
    { label: "BTC Shop", href: "#products" },
    { label: "Lightning Network", href: "#products" },
    { label: "Remittance", href: "#remittance" },
    { label: "Autopilot AI", href: "/autopilot" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Blog", href: "https://blog.unocoin.com" },
    { label: "Careers", href: "https://unocoin.com/in/about/who-we-are/" },
    { label: "Contact Us", href: "https://unocoin.com/in/support/contact-us/" },
  ],
  Legal: [
    { label: "Terms of Service", href: "https://unocoin.com/in/support/terms-of-service/" },
    { label: "Privacy Policy", href: "https://unocoin.com/in/support/privacy-policy/" },
    { label: "AML Policy", href: "https://unocoin.com/in/support/aml-policy/" },
    { label: "Grievance Redressal", href: "https://unocoin.com/in/support/grievance/" },
  ],
  Resources: [
    { label: "Help Center", href: "https://support.unocoin.com" },
    { label: "Fee Schedule", href: "https://unocoin.com/in/support/fees/" },
    { label: "Crypto Basket FAQ", href: "https://unocoin.com/in/support/crypto-basket-faq/" },
    { label: "Lending FAQ", href: "https://unocoin.com/in/support/lending-faq/" },
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
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-bitcoin rounded-lg rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-base">
                  U
                </span>
              </div>
              <span className="text-lg font-bold tracking-tight">Unocoin</span>
            </a>
            <p className="text-sm text-text-tertiary leading-relaxed max-w-xs mb-4">
              India&apos;s pioneer crypto platform. Bringing Bitcoin to billions
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
                { label: "X", href: "https://twitter.com/Unocoin" },
                { label: "LI", href: "https://in.linkedin.com/company/unocoin" },
                { label: "TG", href: "https://t.me/Unocoin_Group" },
                { label: "YT", href: "https://www.youtube.com/c/Unocoin/videos" },
                { label: "IG", href: "https://www.instagram.com/unocoin/" },
                { label: "FB", href: "https://www.facebook.com/unocoin/" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center text-xs text-text-tertiary hover:text-text-primary hover:border-border-medium transition-all"
                >
                  {social.label}
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
              <p className="text-xs text-text-tertiary">Mon–Sat, 9:30 AM – 6:30 PM IST</p>
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
            <span className="text-text-secondary font-medium">Tax Notice:</span> Crypto transactions in India are subject to 30% tax on profits and 1% TDS on trades, as per the Finance Act 2022.
          </p>
          <p className="text-xs text-text-tertiary leading-relaxed">
            <span className="text-text-secondary font-medium">Disclaimer:</span> Crypto products and NFTs are unregulated and can be highly volatile. There may be no regulatory recourse for any loss from such transactions. Please do your own research (DYOR) before investing.
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
            { label: "Crypto Deposit", value: "Free" },
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
