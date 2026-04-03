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
