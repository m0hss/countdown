export interface Registration {
  id: string;
  name: string;
  username?: string;
  number: number;
  referrals: number;
  fixture?: boolean;
  dailyReferrals?: number;
  lastActiveDays?: number;
  role?: string;
}
export interface Day {
  number: number;
  title: string;
  teaser: string;
  revealAt: string;
  media: string;
  shortTitle: string;
  version: string;
  category: string;
  authorIds: string[];
}
export interface TicketPayload {
  v: 1;
  id: string;
  name: string;
  username?: string;
  number: number;
  startsAt: string;
}
