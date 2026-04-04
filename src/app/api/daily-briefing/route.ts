import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are Roz Ka Bitcoin, IndiaBitcoin.com's daily morning briefing assistant. Generate a warm, concise daily briefing for an Indian Bitcoin investor. Be encouraging but realistic. Use simple Hindi-English mix naturally (like 'Namaste', 'aaj ka din', 'achha hai'). Keep it under 100 words.`;

const COMMUNITY_POLL_QUESTIONS: {
  question: string;
  options: [string, string];
}[] = [
  {
    question: "Will BTC cross $100K this year?",
    options: ["Yes, definitely!", "Not this year"],
  },
  {
    question: "What's your preferred SIP frequency?",
    options: ["Daily", "Weekly"],
  },
  {
    question: "Are you HODLing or trading today?",
    options: ["HODLing strong 💎", "Trading actively"],
  },
  {
    question: "Bitcoin ka future India mein kaisa hoga?",
    options: ["Bahut achha!", "Abhi wait karo"],
  },
  {
    question: "Do you talk about Bitcoin with family?",
    options: ["Yes, they're curious!", "No, they don't get it"],
  },
  {
    question: "Lightning Network use kiya hai?",
    options: ["Haan, it's fast!", "Not yet"],
  },
  {
    question: "What matters more to you?",
    options: ["Low fees", "Fast transactions"],
  },
  {
    question: "How long have you been investing in BTC?",
    options: ["Less than 1 year", "More than 1 year"],
  },
];

interface DailyBriefing {
  date: string;
  greeting: string;
  btcChange24h: number;
  portfolioValue: number;
  sipAmount: number;
  communityPoll: {
    question: string;
    options: [string, string];
    votes: [number, number];
    userVote?: 0 | 1;
  };
  generatedAt: number;
}

export async function POST(request: NextRequest) {
  try {
    const { portfolioValue, btcChange24h } = await request.json();

    if (typeof portfolioValue !== "number" || typeof btcChange24h !== "number") {
      return Response.json(
        { error: "portfolioValue and btcChange24h are required and must be numbers" },
        { status: 400 }
      );
    }

    let greeting: string;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `BTC 24h change: ${btcChange24h >= 0 ? "+" : ""}${btcChange24h.toFixed(2)}%. My portfolio value: ₹${portfolioValue.toLocaleString("en-IN")}. Give me today's morning briefing.`,
          },
        ],
      });
      greeting = message.content[0].type === "text" ? message.content[0].text : "";
    } else {
      const greetings = [
        `Namaste! Aaj ka din achha hai. Bitcoin ${btcChange24h >= 0 ? "upar" : "thoda neeche"} hai, ${btcChange24h >= 0 ? "+" : ""}${btcChange24h.toFixed(1)}% change. Aapka portfolio Rs.${portfolioValue.toLocaleString("en-IN")} pe chal raha hai. SBP chalu rakho, consistency hi key hai. Aaj bhi sats stack karo!`,
        `Good morning! Chai piyo, Bitcoin kharido. Market mein ${btcChange24h >= 0 ? "green candles" : "thodi correction"} dikh rahi hai. Aapka Rs.${portfolioValue.toLocaleString("en-IN")} ka portfolio steady hai. Remember, time in the market beats timing the market. Aaj ka goal: apna SBP chalu rakho.`,
        `Suprabhat! Bitcoin ne aaj ${btcChange24h >= 0 ? "achha perform kiya" : "thoda dip liya"}, lekin long term mein yeh sab normal hai. Aapke Rs.${portfolioValue.toLocaleString("en-IN")} ke portfolio ko dekh ke khush ho jao. You're building generational wealth, one satoshi at a time.`,
      ];
      greeting = greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (!greeting) greeting = "Namaste! Aaj ka din achha hai. Keep stacking sats!";

    // Pick a random community poll
    const pollIndex = Math.floor(Math.random() * COMMUNITY_POLL_QUESTIONS.length);
    const poll = COMMUNITY_POLL_QUESTIONS[pollIndex];

    // Generate fake vote counts with a 40-60% split
    const totalVotes = Math.floor(Math.random() * 500) + 200;
    const splitPercent = 0.4 + Math.random() * 0.2; // between 0.4 and 0.6
    const votesA = Math.round(totalVotes * splitPercent);
    const votesB = totalVotes - votesA;

    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    const briefing: DailyBriefing = {
      date: dateStr,
      greeting,
      btcChange24h,
      portfolioValue,
      sipAmount: 500,
      communityPoll: {
        question: poll.question,
        options: poll.options,
        votes: [votesA, votesB],
      },
      generatedAt: Date.now(),
    };

    return Response.json(briefing);
  } catch (error) {
    console.error("Daily briefing error:", error);
    return Response.json(
      { error: "Failed to generate daily briefing" },
      { status: 500 }
    );
  }
}
