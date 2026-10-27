import { z } from "zod";
import { launchConfig as c } from "@/launch.config";
import { DAY_MS, decodeTicket } from "./demo";
import type { TicketPayload } from "./types";
export interface CreditEvent {
  referrer: string;
  at: number;
}
export interface DemoState {
  version: 2;
  anchor: number;
  ticket: TicketPayload | null;
  credits: Record<string, number>;
  invited: TicketPayload | null;
  dismissed: boolean;
  bookmarks: number[];
  rsvps: string[];
  creditEvents: CreditEvent[];
  foil: boolean;
}
export function previewAnchor(now: number) {
  return c.timing === "fixed"
    ? Date.parse(c.startsAt)
    : now - (c.previewDay - 1) * DAY_MS;
}
export function freshState(now: number): DemoState {
  return {
    version: 2,
    anchor: previewAnchor(now),
    ticket: null,
    credits: {},
    invited: null,
    dismissed: false,
    bookmarks: [],
    rsvps: [],
    creditEvents: [],
    foil: true,
  };
}
const storedSchema = z.object({
  version: z.literal(2).optional(),
  anchor: z.number().min(0).max(4_102_444_800_000),
  ticket: z.unknown(),
  invited: z.unknown(),
  credits: z.record(z.string(), z.number().int().nonnegative().max(999999)),
  dismissed: z.boolean(),
  bookmarks: z.array(z.number().int().min(1).max(5)).default([]),
  rsvps: z.array(z.string().max(80)).default([]),
  creditEvents: z
    .array(z.object({ referrer: z.string(), at: z.number().nonnegative() }))
    .default([]),
  foil: z.boolean().default(true),
});
function readTicket(value: unknown) {
  if (
    !value ||
    typeof value !== "object" ||
    !("id" in value) ||
    typeof value.id !== "string"
  )
    return null;
  return decodeTicket(
    `#ticket=${encodeURIComponent(JSON.stringify(value))}`,
    value.id,
  );
}
export function migrateState(value: unknown, now: number): DemoState {
  const parsed = storedSchema.safeParse(value);
  if (!parsed.success) return freshState(now);
  const data = parsed.data;
  return {
    ...data,
    version: 2,
    anchor:
      c.timing === "fixed" || data.version !== 2
        ? previewAnchor(now)
        : data.anchor,
    ticket: readTicket(data.ticket),
    invited: readTicket(data.invited),
  };
}
export function sameEventDate(a: number, b: number) {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: c.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return date.format(a) === date.format(b);
}
export function creditsToday(events: CreditEvent[], now: number) {
  const result: Record<string, number> = {};
  for (const event of events)
    if (sameEventDate(event.at, now))
      result[event.referrer] = (result[event.referrer] || 0) + 1;
  return result;
}
