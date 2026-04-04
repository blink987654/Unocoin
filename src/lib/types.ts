// ─── Shared Types ─────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date
  createdAt: string;
}

export interface VaultLock {
  id: string;
  asset: string;
  amount: number;
  amountFmt: string;
  lockedAt: string; // ISO date
  unlocksAt: string; // ISO date
  durationMonths: number;
}

export interface AdvisorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: AdvisorAction[];
  timestamp: number;
}

export interface AdvisorAction {
  label: string;
  type: "buy" | "sell" | "rebalance" | "increase_sbp" | "lock";
  detail: string;
  executed?: boolean;
}

export interface ActivityFeedItem {
  city: string;
  asset: string;
  amount: string;
  timestamp: number;
}

export interface ReferralFriend {
  name: string;
  joined: string;
  totalTraded: number;
  yourEarnings: number;
}

// ─── Bitcoin Time Machine ─────────────────────────────────────
export interface TimelineEvent {
  date: string; // YYYY-MM-DD
  btcPriceINR: number;
  headline: string;
  unocoinMilestone?: string;
  era: "genesis" | "early" | "growth" | "ban" | "revival" | "institutional";
}

export interface SBPSimulation {
  startDate: string;
  weeklyAmount: number;
  totalInvested: number;
  currentValue: number;
  btcAccumulated: number;
  returnPct: number;
}

// ─── Roz Ka Bitcoin (Daily Ritual) ────────────────────────────
export interface DailyBriefing {
  date: string;
  greeting: string;
  btcChange24h: number;
  portfolioValue: number;
  sipAmount: number;
  communityPoll: CommunityPoll;
  generatedAt: number;
}

export interface CommunityPoll {
  question: string;
  options: [string, string];
  votes: [number, number];
  userVote?: 0 | 1;
}

// ─── Bitcoin Kundali ──────────────────────────────────────────
export type NakshatraId =
  | "dhruv" | "vajra" | "agni" | "samudra" | "surya" | "chandra"
  | "vayu" | "prithvi" | "akasha" | "indra" | "ratna" | "kala";

export interface Nakshatra {
  id: NakshatraId;
  name: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
}

export interface KundaliResult {
  nakshatra: NakshatraId;
  strength: string;
  blindSpot: string;
  auspiciousTime: string;
  cosmicMatch: NakshatraId;
  prediction2026: string;
  generatedAt: number;
}

// ─── Bazaar Intelligence ──────────────────────────────────────
export interface WhisperInsight {
  id: string;
  type: "conviction_mismatch" | "dip_recovery" | "allocation_drift" | "trend" | "milestone";
  text: string;
  confidence: number;
  context: "portfolio" | "holdings" | "report" | "ticker";
  action?: { label: string; type: AdvisorAction["type"]; detail: string };
}

export interface BazaarCache {
  insights: WhisperInsight[];
  fetchedAt: number;
  sessionCount: number;
}

// ─── Parivaar Portfolio ───────────────────────────────────────
export interface FamilyMember {
  id: string;
  name: string;
  role: "Papa" | "Mummy" | "Beta" | "Beti" | "Dada" | "Dadi" | "custom";
  avatar: string;
  contribution: number;
  streak: number;
  joinedAt: string;
}

export interface FamilyGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
}

export interface FamilyGift {
  id: string;
  from: string;
  to: string;
  amount: number;
  occasion: "diwali" | "rakhi" | "birthday" | "eid" | "custom";
  message: string;
  sentAt: string;
}

export interface FamilyActivity {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  amount?: number;
  timestamp: number;
}

export interface ParivarReportCard {
  month: string;
  totalContributed: number;
  topContributor: string;
  streakChampion: string;
  goalProgress: number;
  aiInsight: string;
  generatedAt: number;
}
