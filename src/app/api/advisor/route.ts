import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are "Advisor" — a personal AI wealth advisor for Indian Bitcoin investors on IndiaBitcoin, India's first and most trusted crypto platform (est. 2013).

## Your Personality
You are warm but direct — like a smart friend who happens to be a financial expert. You give specific, actionable suggestions with INR amounts. You frame Bitcoin as digital gold and long-term wealth building. You're confident, concise, and always end with a clear action the user can take.

## Portfolio Context
You know the user's portfolio details — they are passed to you in each conversation. Reference specific numbers, allocations, and trends. Make your advice personal, not generic.

## Unocoin Products You Can Recommend
- **SBP (Systematic Buying Plan)**: Auto-invest BTC daily, weekly, or monthly starting at Rs.10. **0% transaction fees**. India's original Crypto SIP since 2015.
- **USDT Earnings**: Up to 7% APY on stablecoin holdings. No lock-in period. Passive income on idle USDT.
- **Vault Lock**: Lock crypto for a fixed period for enhanced security and discipline.
- **Lightning Network**: Instant BTC transfers with near-zero fees. Integrated via Voltage partnership.
- **Crypto Basket**: Diversified 6-coin portfolios auto-rebalanced like index funds.
- **Auto Sell**: Receive BTC and auto-convert to INR. 0% fee. Great for freelancers.

## Response Rules
- Keep responses under 150 words. Be punchy and specific.
- Use INR (use the Rs. symbol) for all amounts. Use lakhs/crores for large amounts (e.g., Rs.4.82L).
- Always frame Bitcoin positively as long-term wealth building.
- End every response with a clear, specific action the user can take right now.
- Add a "NOT_FINANCIAL_ADVICE" disclaimer only on the first message of a conversation.
- NEVER use markdown formatting. No asterisks, no bold (**), no italic (*), no em dashes, no horizontal rules (---). Plain text only.

## Suggested Actions Format
When you recommend actions, include them in your response naturally. After your response text, on a new line, add action tags in this exact format:
[ACTION: label | type | detail]

Valid types: buy, sell, rebalance, increase_sbp, lock

Examples:
[ACTION: Earn 7% on USDT | rebalance | Move Rs.42,000 USDT to Earnings]
[ACTION: Boost SBP to Rs.7,500/mo | increase_sbp | Increase monthly SBP from Rs.5,000 to Rs.7,500]
[ACTION: Lock 0.02 BTC in Vault | lock | Lock 0.02 BTC for 6 months in Vault]`;

interface Portfolio {
  holdings: Array<{
    asset: string;
    qty: string;
    value: number;
    allocation: number;
  }>;
  totalValue: number;
  sbpActive: boolean;
  sbpMonthly: number;
  streakDays: number;
}

interface SuggestedAction {
  label: string;
  type: "buy" | "sell" | "rebalance" | "increase_sbp" | "lock";
  detail: string;
}

function parseActions(text: string): {
  cleanText: string;
  actions: SuggestedAction[];
} {
  const actionRegex = /\[ACTION:\s*([^|]+)\|\s*([^|]+)\|\s*([^\]]+)\]/g;
  const actions: SuggestedAction[] = [];
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    const type = match[2].trim();
    if (["buy", "sell", "rebalance", "increase_sbp", "lock"].includes(type)) {
      actions.push({
        label: match[1].trim(),
        type: type as SuggestedAction["type"],
        detail: match[3].trim(),
      });
    }
  }

  const cleanText = text.replace(/\n?\[ACTION:[^\]]+\]/g, "").trim();

  return { cleanText, actions };
}

function buildPortfolioContext(portfolio: Portfolio): string {
  const holdingsSummary = portfolio.holdings
    .map(
      (h) =>
        `${h.asset}: ${h.qty} units, worth Rs.${h.value.toLocaleString("en-IN")}, ${h.allocation}% allocation`
    )
    .join("\n");

  return `
## Current Portfolio Snapshot
Total Value: Rs.${portfolio.totalValue.toLocaleString("en-IN")}
${holdingsSummary}

SBP Status: ${portfolio.sbpActive ? `Active at Rs.${portfolio.sbpMonthly.toLocaleString("en-IN")}/month` : "Inactive"}
${portfolio.sbpActive ? `SBP Streak: ${portfolio.streakDays} consecutive days` : ""}
`.trim();
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const { messages, portfolio } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided." }, { status: 400 });
    }

    // Demo mode when no API key
    if (!apiKey) {
      const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
      let reply = "Good morning! Your portfolio is at Rs.3,40,138 with a strong 87.6% BTC allocation. Your SBP streak is 47 days strong, putting you in the top 6% of IndiaBitcoin investors. Your USDT (Rs.42,000) is sitting idle at 0% yield. Consider activating USDT Earnings for up to 7% APY, that's roughly Rs.245/month in passive income with zero lock-in.\n\nNOT_FINANCIAL_ADVICE: This is educational guidance based on your portfolio. Crypto markets are volatile. Past performance does not equal future results.";
      if (lastMsg.includes("rebalance") || lastMsg.includes("allocation")) {
        reply = "Your current split is 87.6% BTC / 12.4% USDT. For a long-term accumulator, this is a strong conviction allocation. If you want to derisk slightly, moving to 80/20 would give you a Rs.25,600 additional USDT buffer. But honestly, with your 47-day SBP streak, your discipline is doing the rebalancing for you through consistent accumulation.";
      } else if (lastMsg.includes("sbp") || lastMsg.includes("increase")) {
        reply = "Your current SBP is Rs.5,000/month. Based on your portfolio growth, bumping it to Rs.7,500/month could help you cross Rs.5L by the end of this year. Even a small increase compounds significantly over time. Rs.2,500 extra monthly is the price of eating out twice, but it could mean Rs.1L+ in additional BTC over 2 years.";
      }
      return Response.json({
        response: reply,
        suggestedActions: [
          { label: "Earn 7% on idle USDT", type: "rebalance", detail: "Move Rs.42,000 USDT to Earnings" },
          { label: "Boost SBP to Rs.7,500/mo", type: "increase_sbp", detail: "Increase monthly SBP from Rs.5,000 to Rs.7,500" },
        ],
      });
    }

    const trimmedMessages = messages.slice(-20);

    const portfolioContext = portfolio
      ? buildPortfolioContext(portfolio)
      : "Portfolio data not available.";

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n${portfolioContext}`;

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: fullSystemPrompt,
      messages: trimmedMessages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const { cleanText, actions } = parseActions(rawText);

    return Response.json({
      response: cleanText,
      suggestedActions: actions.length > 0 ? actions : undefined,
    });
  } catch (err) {
    console.error("Advisor error:", err);
    return Response.json(
      { error: "Advisor encountered an issue. Please try again." },
      { status: 500 }
    );
  }
}
