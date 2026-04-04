import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Bazaar Intelligence, IndiaBitcoin.com's ambient market insight engine. Generate 2-3 contextual insights for an Indian Bitcoin investor based on their current page and portfolio.

Each insight should be:
- Concise (under 30 words)
- Actionable or informative
- Relevant to the page context they're viewing
- Mix of Hindi-English naturally (like "yeh achha signal hai")

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "insights": [
    {
      "id": "<unique short id>",
      "type": "<one of: conviction_mismatch | dip_recovery | allocation_drift | trend | milestone>",
      "text": "<the insight text>",
      "confidence": <0.6 to 0.95>,
      "context": "<one of: portfolio | holdings | report | ticker>",
      "action": null
    }
  ]
}

For type meanings:
- conviction_mismatch: user says they believe in BTC but allocation is low
- dip_recovery: BTC recovered from a recent dip
- allocation_drift: portfolio balance has shifted
- trend: market trend observation
- milestone: user achievement or market milestone`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { page, portfolio } = body as {
      page: string;
      portfolio: Record<string, unknown>;
    };

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `User is viewing: ${page}\nPortfolio: ${JSON.stringify(portfolio)}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const result = JSON.parse(text);

    return NextResponse.json(result);
  } catch (e) {
    console.error("Bazaar API error:", e);
    // Fallback insights
    return NextResponse.json({
      insights: [
        {
          id: "fb_1",
          type: "trend",
          text: "Bitcoin ka momentum strong hai — weekly close above key support levels.",
          confidence: 0.75,
          context: "ticker",
        },
        {
          id: "fb_2",
          type: "milestone",
          text: "Aapka portfolio ₹3L cross kar gaya! Consistent SBP ka kamaal.",
          confidence: 0.85,
          context: "portfolio",
        },
      ],
    });
  }
}
