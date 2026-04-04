import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const NAKSHATRA_IDS = [
  "dhruv", "vajra", "agni", "samudra", "surya", "chandra",
  "vayu", "prithvi", "akasha", "indra", "ratna", "kala",
] as const;

const SYSTEM_PROMPT = `You are IndiaBitcoin.com's Bitcoin Kundali astrologer. Based on the user's investment behavior and preferences, assign them a Bitcoin Nakshatra (archetype).

The 12 Nakshatras are:
- dhruv: Steadfast HODLer, never sells
- vajra: Diamond hands, held through crashes
- agni: Active trader, loves volatility
- samudra: Systematic accumulator, SBP lover
- surya: Bitcoin maximalist, strong conviction
- chandra: Cycle trader, buys bear/sells bull
- vayu: Early adopter, spreads awareness
- prithvi: Fundamentals-focused, slow builder
- akasha: Visionary, sees hyperbitcoinization
- indra: Bold lump-sum buyer during dips
- ratna: Values scarcity, treats BTC as digital gold
- kala: Time-in-market believer, started early

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "nakshatra": "<one of the 12 IDs above>",
  "strength": "<one sentence about their biggest investing strength>",
  "blindSpot": "<one sentence about a potential blind spot>",
  "auspiciousTime": "<a fun, specific 'auspicious time' for their next buy, like 'Tuesday morning before chai'>",
  "cosmicMatch": "<another nakshatra ID that complements them>",
  "prediction2026": "<a fun, optimistic one-sentence prediction for their 2026 Bitcoin journey>"
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers } = body as { answers: Record<string, string> };

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const userPrompt = Object.entries(answers)
      .map(([q, a]) => `${q}: ${a}`)
      .join("\n");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const result = JSON.parse(text);

    // Validate nakshatra ID
    if (!NAKSHATRA_IDS.includes(result.nakshatra)) {
      result.nakshatra = NAKSHATRA_IDS[Math.floor(Math.random() * NAKSHATRA_IDS.length)];
    }
    if (!NAKSHATRA_IDS.includes(result.cosmicMatch)) {
      result.cosmicMatch = NAKSHATRA_IDS[Math.floor(Math.random() * NAKSHATRA_IDS.length)];
    }

    return NextResponse.json({
      ...result,
      generatedAt: Date.now(),
    });
  } catch (e) {
    console.error("Kundali API error:", e);
    // Fallback result
    const fallbackIdx = Math.floor(Math.random() * NAKSHATRA_IDS.length);
    return NextResponse.json({
      nakshatra: NAKSHATRA_IDS[fallbackIdx],
      strength: "Your patience and conviction set you apart from the crowd.",
      blindSpot: "Sometimes you hold on too long when rebalancing could help.",
      auspiciousTime: "Wednesday evening, right after sunset.",
      cosmicMatch: NAKSHATRA_IDS[(fallbackIdx + 3) % NAKSHATRA_IDS.length],
      prediction2026: "2026 will bring unexpected gains — stay the course and trust your instincts.",
      generatedAt: Date.now(),
    });
  }
}
