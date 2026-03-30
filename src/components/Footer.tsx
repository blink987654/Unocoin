"use client";

const footerLinks = {
  Products: [
    { label: "Buy Bitcoin", href: "#" },
    { label: "Bitcoin SIP", href: "#" },
    { label: "Instant Buy/Sell", href: "#" },
    { label: "OTC Desk", href: "#" },
    { label: "Remittance", href: "#remittance" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "AML Policy", href: "#" },
    { label: "Grievance Redressal", href: "#" },
  ],
  Resources: [
    { label: "Help Center", href: "#" },
    { label: "API Documentation", href: "#" },
    { label: "Fee Schedule", href: "#" },
    { label: "Security", href: "#" },
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
            <p className="text-sm text-text-tertiary leading-relaxed max-w-xs mb-6">
              India&apos;s pioneer Bitcoin platform. Bringing Bitcoin to billions
              since 2013.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              {["X", "LI", "TG", "YT"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center text-xs text-text-tertiary hover:text-text-primary hover:border-border-medium transition-all"
                >
                  {social}
                </a>
              ))}
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

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Unocoin Technologies Pvt. Ltd. All
            rights reserved. FIU Registered.
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
