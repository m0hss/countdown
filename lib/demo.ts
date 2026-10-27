import { z } from "zod";
import { launchConfig as c } from "@/launch.config";
import { registrations } from "./fixtures";
import type { Day, Registration, TicketPayload } from "./types";
export const DAY_MS = 86_400_000;
export const githubSchema = z
  .string()
  .max(39, c.form.githubError)
  .regex(/^(?:[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})?$/i, c.form.githubError);
export const claimSchema = z.object({
  name: z.string().trim().min(2, c.form.nameError).max(60, c.form.nameError),
  email: z.email(c.form.emailError).max(254, c.form.emailError),
  username: githubSchema,
});
const payloadSchema = z.object({
  v: z.literal(1),
  id: z.string().regex(/^local-[a-zA-Z0-9-]{1,80}$/),
  name: z.string().trim().min(2).max(60),
  username: githubSchema.optional(),
  number: z.number().int().min(1).max(999999),
  startsAt: z.iso
    .datetime()
    .refine((value) => Number.isFinite(Date.parse(value))),
});
export function encodeTicket(ticket: TicketPayload) {
  return `#ticket=${encodeURIComponent(JSON.stringify(payloadSchema.parse(ticket)))}`;
}
export function decodeTicket(hash: string, id: string): TicketPayload | null {
  try {
    if (hash.length > 3000 || !hash.startsWith("#ticket=")) return null;
    const result = payloadSchema.safeParse(
      JSON.parse(decodeURIComponent(hash.slice(8))),
    );
    return result.success && result.data.id === id ? result.data : null;
  } catch {
    return null;
  }
}
export function ticketPath(ticket: TicketPayload) {
  return `/t/${ticket.id}${encodeTicket(ticket)}`;
}
export function isGold(number: number) {
  return number > 0 && number % 100 === 0;
}
export function ticketNumber(number: number) {
  return `#${String(number).padStart(6, "0")}`;
}
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
export function remaining(target: number, now: number) {
  const seconds = Math.max(0, Math.ceil((target - now) / 1000));
  return [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
}
export function compactTime(target: number, now: number) {
  const [days, hours, minutes, seconds] = remaining(target, now);
  return [days * 24 + hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}
export function revealTime(day: Day, anchor: number) {
  return c.timing === "fixed"
    ? Date.parse(day.revealAt)
    : anchor + Date.parse(day.revealAt) - Date.parse(c.startsAt);
}
export function eventDates(anchor: number) {
  const format = new Intl.DateTimeFormat(c.locale, {
    month: "short",
    day: "numeric",
    timeZone: c.timezone,
  });
  return `${format.format(anchor)} — ${format.format(anchor + (c.eventDurationDays - 1) * DAY_MS)}`;
}
export function creditReferral(
  credits: Record<string, number>,
  referrer: string | null,
  ownId: string,
  alreadyClaimed: boolean,
) {
  if (
    !referrer ||
    referrer === ownId ||
    alreadyClaimed ||
    !/^(demo-\d+|local-[a-zA-Z0-9-]{1,80})$/.test(referrer)
  )
    return credits;
  return { ...credits, [referrer]: (credits[referrer] || 0) + 1 };
}
export function rankRegistrations(
  credits: Record<string, number>,
  own?: Registration | null,
  invited?: Registration | null,
) {
  const all = [...registrations];
  for (const person of [own, invited])
    if (person && !all.some((row) => row.id === person.id)) all.push(person);
  return all
    .map((row) => ({
      ...row,
      referrals: row.referrals + (credits[row.id] || 0),
    }))
    .sort((a, b) => b.referrals - a.referrals || a.number - b.number);
}
