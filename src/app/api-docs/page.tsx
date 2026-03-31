"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ─── Code Examples ──────────────────────────────────────────
const codeExamples: Record<string, string> = {
  cURL: `curl -X GET "https://api.unocoin.com/api/v2/ticker/btcinr" \\
  -H "X-API-KEY: your_api_key" \\
  -H "X-API-SIGNATURE: hmac_sha256_signature" \\
  -H "X-API-TIMESTAMP: 1711843200"

# Response:
# {
#   "pair": "btcinr",
#   "last_price": 7015000,
#   "bid": 7014500,
#   "ask": 7015500,
#   "volume_24h": 142.5,
#   "change_24h": 2.4
# }`,
  Python: `import unocoin

client = unocoin.Client(
    api_key="your_api_key",
    api_secret="your_api_secret"
)

# Get live BTC/INR price
ticker = client.get_ticker("btcinr")
print(f"BTC Price: ₹{ticker['last_price']:,}")

# Place a buy order
order = client.create_order(
    pair="btcinr",
    side="buy",
    type="limit",
    price=7000000,
    quantity=0.001
)
print(f"Order placed: {order['id']}")`,
  "Node.js": `const Unocoin = require('@unocoin/sdk');

const client = new Unocoin({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret'
});

// Get live BTC/INR price
const ticker = await client.getTicker('btcinr');
console.log(\`BTC Price: ₹\${ticker.lastPrice.toLocaleString('en-IN')}\`);

// Create a weekly BTC SBP
const sbp = await client.createSBP({
  asset: 'BTC',
  amount: 2000,      // ₹2,000
  frequency: 'weekly',
  day: 'monday'
});
console.log(\`SBP created: \${sbp.id}\`);`,
  Go: `package main

import (
    "fmt"
    unocoin "github.com/unocoin/go-sdk"
)

func main() {
    client := unocoin.NewClient(
        "your_api_key",
        "your_api_secret",
    )

    // Get live BTC/INR price
    ticker, _ := client.GetTicker("btcinr")
    fmt.Printf("BTC Price: ₹%d\\n", ticker.LastPrice)

    // Get wallet balances
    balances, _ := client.GetBalances()
    for _, b := range balances {
        fmt.Printf("%s: %f\\n", b.Asset, b.Available)
    }
}`,
};

// ─── API Endpoint Categories ────────────────────────────────
interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  desc: string;
  params?: string[];
  response: string;
}

interface Category {
  name: string;
  icon: string;
  endpoints: Endpoint[];
}

const categories: Category[] = [
  {
    name: "Market Data",
    icon: "📊",
    endpoints: [
      { method: "GET", path: "/api/v2/ticker", desc: "Get live prices for all trading pairs", response: '[\n  {\n    "pair": "btcinr",\n    "last_price": 7015000,\n    "bid": 7014500,\n    "ask": 7015500,\n    "volume_24h": 142.5,\n    "change_24h": 2.4,\n    "high_24h": 7050000,\n    "low_24h": 6920000\n  }\n]' },
      { method: "GET", path: "/api/v2/ticker/{pair}", desc: "Get price for a specific trading pair", params: ["pair — Trading pair (e.g., btcinr, ethinr, usdtinr)"], response: '{\n  "pair": "btcinr",\n  "last_price": 7015000,\n  "bid": 7014500,\n  "ask": 7015500,\n  "volume_24h": 142.5\n}' },
      { method: "GET", path: "/api/v2/orderbook/{pair}", desc: "Get order book with bids and asks", params: ["pair — Trading pair", "limit — Number of levels (default 20)"], response: '{\n  "bids": [[7014500, 0.5], [7014000, 1.2]],\n  "asks": [[7015500, 0.3], [7016000, 0.8]]\n}' },
    ],
  },
  {
    name: "Trading",
    icon: "⚡",
    endpoints: [
      { method: "POST", path: "/api/v2/orders", desc: "Place a buy or sell order", params: ["pair — Trading pair", "side — buy or sell", "type — limit or market", "price — Order price (for limit)", "quantity — Amount to trade"], response: '{\n  "id": "ord_a1b2c3",\n  "pair": "btcinr",\n  "side": "buy",\n  "type": "limit",\n  "price": 7000000,\n  "quantity": 0.001,\n  "status": "open"\n}' },
      { method: "GET", path: "/api/v2/orders", desc: "List your open and completed orders", params: ["status — open, completed, cancelled", "pair — Filter by trading pair"], response: '[\n  {\n    "id": "ord_a1b2c3",\n    "pair": "btcinr",\n    "side": "buy",\n    "status": "completed",\n    "filled_quantity": 0.001\n  }\n]' },
      { method: "DELETE", path: "/api/v2/orders/{id}", desc: "Cancel an open order", params: ["id — Order ID"], response: '{\n  "id": "ord_a1b2c3",\n  "status": "cancelled"\n}' },
    ],
  },
  {
    name: "Account",
    icon: "👤",
    endpoints: [
      { method: "GET", path: "/api/v2/balance", desc: "Get wallet balances for all assets", response: '[\n  { "asset": "BTC", "available": 0.0425, "locked": 0.001 },\n  { "asset": "ETH", "available": 0.85, "locked": 0 },\n  { "asset": "INR", "available": 25000, "locked": 7015 }\n]' },
      { method: "GET", path: "/api/v2/profile", desc: "Get account profile and KYC status", response: '{\n  "id": "usr_x1y2z3",\n  "email": "user@example.com",\n  "kyc_status": "verified",\n  "tier": "standard"\n}' },
      { method: "GET", path: "/api/v2/transactions", desc: "Transaction history with filters", params: ["type — trade, deposit, withdrawal", "from — Start date (ISO 8601)", "to — End date", "limit — Results per page"], response: '[\n  {\n    "id": "txn_abc",\n    "type": "trade",\n    "asset": "BTC",\n    "amount": 0.001,\n    "timestamp": "2026-03-30T10:15:00Z"\n  }\n]' },
    ],
  },
  {
    name: "SBP (Systematic Buying Plan)",
    icon: "📈",
    endpoints: [
      { method: "POST", path: "/api/v2/sbp", desc: "Create a new Systematic Buying Plan", params: ["asset — BTC or ETH", "amount — Amount in INR per interval", "frequency — daily, weekly, or monthly", "day — Day of week (for weekly) or date (for monthly)"], response: '{\n  "id": "sbp_m1n2o3",\n  "asset": "BTC",\n  "amount": 2000,\n  "frequency": "weekly",\n  "day": "monday",\n  "status": "active",\n  "fee": "0%"\n}' },
      { method: "GET", path: "/api/v2/sbp", desc: "List all active SBPs", response: '[\n  {\n    "id": "sbp_m1n2o3",\n    "asset": "BTC",\n    "amount": 2000,\n    "frequency": "weekly",\n    "total_invested": 208000,\n    "total_bought": 0.035\n  }\n]' },
      { method: "PUT", path: "/api/v2/sbp/{id}", desc: "Update an existing SBP", params: ["id — SBP ID", "amount — New amount (optional)", "frequency — New frequency (optional)", "status — active or paused"], response: '{\n  "id": "sbp_m1n2o3",\n  "amount": 3000,\n  "status": "active"\n}' },
      { method: "DELETE", path: "/api/v2/sbp/{id}", desc: "Cancel an SBP", params: ["id — SBP ID"], response: '{\n  "id": "sbp_m1n2o3",\n  "status": "cancelled"\n}' },
    ],
  },
  {
    name: "Lightning Network",
    icon: "⚡",
    endpoints: [
      { method: "POST", path: "/api/v2/lightning/invoice", desc: "Create a Lightning invoice to receive BTC", params: ["amount_sats — Amount in satoshis", "memo — Invoice description"], response: '{\n  "invoice": "lnbc10u1p...",\n  "amount_sats": 10000,\n  "expires_at": "2026-03-31T02:00:00Z"\n}' },
      { method: "POST", path: "/api/v2/lightning/pay", desc: "Pay a Lightning invoice", params: ["invoice — Lightning invoice string", "max_fee_sats — Maximum fee in sats (optional)"], response: '{\n  "payment_hash": "abc123...",\n  "amount_sats": 10000,\n  "fee_sats": 2,\n  "status": "settled"\n}' },
      { method: "GET", path: "/api/v2/lightning/balance", desc: "Get Lightning wallet balance", response: '{\n  "balance_sats": 500000,\n  "balance_btc": 0.005\n}' },
    ],
  },
  {
    name: "Withdrawals & Deposits",
    icon: "🏦",
    endpoints: [
      { method: "POST", path: "/api/v2/withdraw/asset", desc: "Withdraw digital assets to an external wallet", params: ["asset — Asset symbol (BTC, ETH, USDT, etc.)", "amount — Amount to withdraw", "address — Destination wallet address", "network — Network (optional, e.g., lightning, erc20)"], response: '{\n  "id": "wd_p1q2r3",\n  "asset": "BTC",\n  "amount": 0.01,\n  "status": "processing",\n  "fee": 0.0005\n}' },
      { method: "POST", path: "/api/v2/withdraw/inr", desc: "Withdraw INR to your bank account", params: ["amount — Amount in INR", "method — neft, imps, or upi"], response: '{\n  "id": "wd_s1t2u3",\n  "amount": 25000,\n  "method": "imps",\n  "status": "processing",\n  "fee": 0\n}' },
      { method: "GET", path: "/api/v2/deposits", desc: "List all deposits", params: ["asset — Filter by asset (optional)", "from — Start date"], response: '[\n  {\n    "id": "dep_v1w2x3",\n    "asset": "INR",\n    "amount": 50000,\n    "method": "upi",\n    "status": "completed"\n  }\n]' },
    ],
  },
  {
    name: "Remittance & Settlement",
    icon: "🌍",
    endpoints: [
      { method: "POST", path: "/api/v2/remittance/quote", desc: "Get a real-time quote for a cross-border remittance", params: ["source_currency — Sender currency (USD, GBP, EUR, AED, etc.)", "amount — Amount in source currency", "destination — INR (default)", "method — lightning or standard"], response: '{\n  "quote_id": "qt_r1s2t3",\n  "source_amount": 1000,\n  "source_currency": "USD",\n  "destination_amount": 83450,\n  "destination_currency": "INR",\n  "exchange_rate": 83.45,\n  "fee": 5.00,\n  "fee_percentage": "0.5%",\n  "settlement_time": "< 60 seconds",\n  "expires_at": "2026-03-31T02:05:00Z"\n}' },
      { method: "POST", path: "/api/v2/remittance/send", desc: "Execute a remittance transfer using a quote", params: ["quote_id — Quote ID from /remittance/quote", "recipient_name — Full name of recipient", "recipient_bank_account — Indian bank account number", "recipient_ifsc — IFSC code", "recipient_upi — UPI ID (alternative to bank)"], response: '{\n  "id": "rem_u1v2w3",\n  "status": "processing",\n  "source_amount": 1000,\n  "destination_amount": 83450,\n  "settlement_method": "lightning",\n  "estimated_arrival": "< 60 seconds"\n}' },
      { method: "GET", path: "/api/v2/remittance/{id}", desc: "Track remittance status in real-time", params: ["id — Remittance transaction ID"], response: '{\n  "id": "rem_u1v2w3",\n  "status": "completed",\n  "source_amount": 1000,\n  "destination_amount": 83450,\n  "completed_at": "2026-03-31T02:01:23Z",\n  "settlement_time_ms": 1230\n}' },
      { method: "GET", path: "/api/v2/remittance/corridors", desc: "List supported remittance corridors with live rates", response: '[\n  {\n    "source": "USD",\n    "destination": "INR",\n    "rate": 83.45,\n    "fee_percentage": "0.5%",\n    "min_amount": 10,\n    "max_amount": 50000,\n    "settlement": "< 60 seconds"\n  }\n]' },
      { method: "POST", path: "/api/v2/remittance/webhook", desc: "Register a webhook for remittance status updates", params: ["url — Your webhook endpoint URL", "events — Array of events: payment.completed, payment.failed, payment.refunded"], response: '{\n  "id": "wh_x1y2z3",\n  "url": "https://your-app.com/webhooks/unocoin",\n  "events": ["payment.completed", "payment.failed"],\n  "status": "active"\n}' },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-accent-green/20 text-accent-green",
  POST: "bg-accent-blue/20 text-accent-blue",
  PUT: "bg-yellow-500/20 text-yellow-400",
  DELETE: "bg-red-500/20 text-red-400",
};

// ─── Use Cases ──────────────────────────────────────────────
const useCases = [
  { icon: "🌍", title: "Remittance Companies", desc: "Integrate Lightning-powered cross-border payments. Send money to India in seconds at near-zero cost. Auto-convert to INR via our settlement API." },
  { icon: "🤖", title: "Trading Bots", desc: "Build algorithmic trading strategies with real-time WebSocket feeds, instant order execution, and 120+ trading pairs across INR, BTC, and USDT markets." },
  { icon: "💳", title: "Payment Gateways", desc: "Accept Bitcoin and stablecoin payments in your app or website. Auto Sell API converts received BTC to INR instantly at 0% fee." },
  { icon: "📱", title: "Portfolio Trackers", desc: "Access real-time balances, transaction history, SBP performance data, and Lightning wallet stats for your users." },
];

// ─── Component ──────────────────────────────────────────────
export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState("cURL");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openEndpoint, setOpenEndpoint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const heroRef = useRef(null);
  const codeRef = useRef(null);
  const endpointsRef = useRef(null);
  const useCasesRef = useRef(null);
  const sdkRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const codeInView = useInView(codeRef, { once: true, margin: "-80px" });
  const endpointsInView = useInView(endpointsRef, { once: true, margin: "-80px" });
  const useCasesInView = useInView(useCasesRef, { once: true, margin: "-80px" });
  const sdkInView = useInView(sdkRef, { once: true, margin: "-80px" });

  function copyCode() {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="relative">
      <Navigation />

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-accent-blue/[0.04] rounded-full blur-[200px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-accent-blue font-medium">Enterprise-Grade Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Unocoin <span className="gradient-text-bitcoin">API</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-4">
              India&apos;s most trusted digital asset infrastructure for institutions and developers
            </p>
            <p className="text-text-tertiary max-w-2xl mx-auto mb-10 leading-relaxed">
              Powering remittance companies, trading algorithms, fintech platforms, and enterprise applications.
              From Lightning settlement to SBP automation — everything you can do in the
              Unocoin app, you can do via API. Trusted by entities that demand institutional-grade reliability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a href="mailto:api@unocoin.com" className="btn-primary !py-3 !px-8 rounded-xl text-lg">
                Get API Key
              </a>
              <a href="#endpoints" className="btn-secondary !py-3 !px-8 rounded-xl text-lg">
                View Endpoints
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {["REST API", "WebSocket Streams", "99.99% Uptime SLA", "FIU-IND Compliant", "HMAC-SHA256 Auth", "Dedicated Support"].map((badge) => (
                <span key={badge} className="bg-surface-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-tertiary">
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Quick Start Code ──────────────────────────────── */}
      <section ref={codeRef} className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={codeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2">Quick Start</h2>
            <p className="text-text-secondary mb-8">Production-ready in 48 hours with dedicated technical support.</p>

            <div className="gradient-border bg-surface-card rounded-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-border-subtle px-4">
                <div className="flex">
                  {Object.keys(codeExamples).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                        activeTab === tab
                          ? "text-bitcoin border-bitcoin"
                          : "text-text-tertiary border-transparent hover:text-text-secondary"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  onClick={copyCode}
                  className="text-xs text-text-tertiary hover:text-text-primary transition-colors px-3 py-1 rounded-md bg-surface-elevated"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Code block */}
              <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-text-primary">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── API Endpoints ─────────────────────────────────── */}
      <section id="endpoints" ref={endpointsRef} className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={endpointsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2">API Reference</h2>
            <p className="text-text-secondary mb-10">Complete endpoint documentation for the Unocoin API v2.</p>

            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.name} className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden">
                  {/* Category header */}
                  <button
                    onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
                    className="w-full flex items-center justify-between p-5 hover:bg-surface-elevated/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-semibold text-lg">{cat.name}</span>
                      <span className="text-xs text-text-tertiary bg-surface-elevated rounded-full px-2 py-0.5">
                        {cat.endpoints.length} endpoints
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-text-tertiary transition-transform duration-300 ${
                        openCategory === cat.name ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Endpoints list */}
                  <AnimatePresence>
                    {openCategory === cat.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border-subtle">
                          {cat.endpoints.map((ep) => {
                            const epKey = `${ep.method}-${ep.path}`;
                            return (
                              <div key={epKey} className="border-b border-border-subtle last:border-b-0">
                                <button
                                  onClick={() => setOpenEndpoint(openEndpoint === epKey ? null : epKey)}
                                  className="w-full flex items-center gap-4 p-4 hover:bg-surface-elevated/30 transition-colors text-left"
                                >
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${methodColors[ep.method]}`}>
                                    {ep.method}
                                  </span>
                                  <span className="font-mono text-sm text-text-primary">{ep.path}</span>
                                  <span className="text-sm text-text-tertiary ml-auto hidden sm:block">{ep.desc}</span>
                                </button>

                                <AnimatePresence>
                                  {openEndpoint === epKey && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-4 pb-4 space-y-3">
                                        <p className="text-sm text-text-secondary sm:hidden">{ep.desc}</p>

                                        {ep.params && (
                                          <div>
                                            <p className="text-xs text-text-tertiary uppercase tracking-wider mb-2">Parameters</p>
                                            <div className="space-y-1">
                                              {ep.params.map((p) => (
                                                <div key={p} className="flex items-start gap-2 text-sm">
                                                  <span className="text-bitcoin font-mono">{p.split(" — ")[0]}</span>
                                                  <span className="text-text-tertiary">—</span>
                                                  <span className="text-text-secondary">{p.split(" — ")[1]}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        <div>
                                          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-2">Example Response</p>
                                          <pre className="bg-surface-elevated rounded-lg p-4 text-xs font-mono text-text-secondary overflow-x-auto">
                                            {ep.response}
                                          </pre>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Use Cases ─────────────────────────────────────── */}
      <section ref={useCasesRef} className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2">Built for Every Use Case</h2>
            <p className="text-text-secondary mb-10">From trading bots to remittance platforms, our API powers it all.</p>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((uc, i) => (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="gradient-border bg-surface-card p-8 rounded-2xl hover:bg-surface-hover transition-all duration-500 group"
                >
                  <span className="text-3xl mb-4 block">{uc.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">{uc.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{uc.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SDKs ──────────────────────────────────────────── */}
      <section ref={sdkRef} className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={sdkInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2">Official SDKs</h2>
            <p className="text-text-secondary mb-10">Get started in your language of choice.</p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { lang: "Python", install: "pip install unocoin", init: "client = unocoin.Client(api_key, api_secret)", color: "text-accent-blue" },
                { lang: "Node.js", install: "npm install @unocoin/sdk", init: "const client = new Unocoin({ apiKey, apiSecret })", color: "text-accent-green" },
                { lang: "Go", install: "go get github.com/unocoin/go-sdk", init: "client := unocoin.NewClient(key, secret)", color: "text-accent-purple" },
              ].map((sdk) => (
                <div key={sdk.lang} className="bg-surface-card border border-border-subtle rounded-xl p-6">
                  <h3 className={`font-semibold text-lg mb-4 ${sdk.color}`}>{sdk.lang}</h3>
                  <div className="bg-surface-elevated rounded-lg p-3 mb-3">
                    <code className="text-xs font-mono text-text-secondary">$ {sdk.install}</code>
                  </div>
                  <div className="bg-surface-elevated rounded-lg p-3">
                    <code className="text-xs font-mono text-text-tertiary">{sdk.init}</code>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Auth & Rate Limits ────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10">Authentication & Rate Limits</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface-card border border-border-subtle rounded-xl p-8">
              <h3 className="font-semibold text-lg mb-4">Authentication</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                All requests require three headers:
              </p>
              <div className="space-y-2">
                {[
                  { header: "X-API-KEY", desc: "Your API key" },
                  { header: "X-API-SIGNATURE", desc: "HMAC-SHA256 signature of the request" },
                  { header: "X-API-TIMESTAMP", desc: "Unix timestamp (within 30s)" },
                ].map((h) => (
                  <div key={h.header} className="flex items-start gap-3">
                    <code className="text-xs font-mono text-bitcoin bg-bitcoin/10 px-2 py-1 rounded">{h.header}</code>
                    <span className="text-sm text-text-tertiary">{h.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-card border border-border-subtle rounded-xl p-8">
              <h3 className="font-semibold text-lg mb-4">Rate Limits</h3>
              <div className="space-y-4">
                {[
                  { tier: "Market Data", limit: "10 req/sec", color: "text-accent-green" },
                  { tier: "Trading", limit: "5 req/sec", color: "text-accent-blue" },
                  { tier: "Account", limit: "5 req/sec", color: "text-accent-purple" },
                  { tier: "WebSocket", limit: "Unlimited streams", color: "text-bitcoin" },
                ].map((r) => (
                  <div key={r.tier} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{r.tier}</span>
                    <span className={`text-sm font-mono font-semibold ${r.color}`}>{r.limit}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-tertiary mt-4">
                Need higher limits? Contact us for enterprise plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to <span className="gradient-text-bitcoin">build</span>?
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Get your API key and start integrating in minutes. Enterprise plans available for high-volume partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:api@unocoin.com" className="btn-primary !py-3 !px-8 rounded-xl text-lg">
              Get API Key
            </a>
            <a href="mailto:partnerships@unocoin.com" className="btn-secondary !py-3 !px-8 rounded-xl text-lg">
              Enterprise Plans
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
