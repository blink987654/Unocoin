import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are IndiaBitcoin.com's Parivaar (Family) Portfolio advisor. Generate a monthly report card for an Indian family's joint Bitcoin savings.

Be warm, encouraging, and use natural Hindi-English mix. Reference family roles (Papa, Mummy, Beta, Beti, Dada) naturally.

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "month": "<current month name>",
  "totalContributed": <number in INR>,
  "topContributor": "<family member name>",
  "streakChampion": "<family member with highest streak>",
  "goalProgress": <0-100 percentage>,
  "aiInsight": "<2-3 sentence family-specific insight and encouragement, max 80 words>"
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { members, goals } = body as {
      members: Array<{ name: string; role: string; contribution: number; streak: number }>;
      goals: Array<{ name: string; targetAmount: number; currentAmount: number }>;
    };

    const totalContributed = members.reduce((s, m) => s + m.contribution, 0);
    const topContributor = [...members].sort((a, b) => b.contribution - a.contribution)[0];
    const streakChampion = [...members].sort((a, b) => b.streak - a.streak)[0];
    const goalProgress = goals.length > 0
      ? Math.round((goals[0].currentAmount / goals[0].targetAmount) * 100)
      : 0;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        month: new Date().toLocaleDateString("en-IN", { month: "long" }),
        totalContributed,
        topContributor: topContributor?.name || "Papa",
        streakChampion: streakChampion?.name || "Papa",
        goalProgress,
        aiInsight: `Parivaar ka portfolio steady grow ho raha hai! ${topContributor?.name || "Papa"} leading from the front with the highest contribution. ${streakChampion?.name || "Papa"} ka streak bhi impressive hai. Next milestone Rs.5L tak pahunchna hai. Saath mein sanchay, saath mein safar!`,
        generatedAt: Date.now(),
      });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 250,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Family members: ${JSON.stringify(members)}\nGoals: ${JSON.stringify(goals)}\nTotal contributed: ₹${totalContributed.toLocaleString("en-IN")}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const aiResult = JSON.parse(text);

    return NextResponse.json({
      month: aiResult.month || new Date().toLocaleDateString("en-IN", { month: "long" }),
      totalContributed,
      topContributor: topContributor?.name || "Papa",
      streakChampion: streakChampion?.name || "Papa",
      goalProgress,
      aiInsight: aiResult.aiInsight || "Your family is building wealth together — keep the SBPs running!",
      generatedAt: Date.now(),
    });
  } catch (e) {
    console.error("Parivaar API error:", e);
    return NextResponse.json({
      month: new Date().toLocaleDateString("en-IN", { month: "long" }),
      totalContributed: 325000,
      topContributor: "Papa",
      streakChampion: "Papa",
      goalProgress: 42,
      aiInsight:
        "Parivaar ka portfolio steady grow ho raha hai! Papa leading from the front. Beti ka streak bhi impressive hai — next milestone ₹5L tak pahunchna hai!",
      generatedAt: Date.now(),
    });
  }
}
