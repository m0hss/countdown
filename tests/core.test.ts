import { freshState, migrateState, creditsToday } from "../lib/state";
import { calendarContent, eventCalendar } from "../lib/calendar";
import test from "node:test";
import assert from "node:assert/strict";
import { parseEnv } from "../lib/env-schema";
import {
  DAY_MS,
  claimSchema,
  compactTime,
  creditReferral,
  decodeTicket,
  encodeTicket,
  isGold,
  rankRegistrations,
  remaining,
  revealTime,
} from "../lib/demo";
import { registrations } from "../lib/fixtures";
import { launchConfig as c } from "../launch.config";
import type { TicketPayload } from "../lib/types";
const ticket: TicketPayload = {
  v: 1,
  id: "local-example",
  name: "Élan Example",
  number: 120,
  startsAt: c.startsAt,
};
test("missing, invalid, and partial environments never throw", () => {
  assert.deepEqual(parseEnv({}), {
    hasDb: false,
    hasRedis: false,
    hasAI: false,
  });
  assert.deepEqual(
    parseEnv({
      DATABASE_URL: "invalid",
      KV_REST_API_URL: "https://redis.example.com",
    }),
    { hasDb: false, hasRedis: false, hasAI: false },
  );
  assert.equal(parseEnv({ DATABASE_URL: "https://example.com" }).hasDb, false);
  assert.equal(
    parseEnv({
      KV_REST_API_URL: "ftp://example.com",
      KV_REST_API_TOKEN: "token",
    }).hasRedis,
    false,
  );
});
test("aliases work, blanks fall back, canonical values take precedence", () => {
  assert.deepEqual(
    parseEnv({
      DATABASE_URL: " ",
      POSTGRES_URL: "postgres://user:pass@localhost/db",
      UPSTASH_REDIS_REST_URL: "https://redis.example.com",
      UPSTASH_REDIS_REST_TOKEN: "token",
      OPENAI_API_KEY: "demo",
    }),
    { hasDb: true, hasRedis: true, hasAI: true },
  );
  assert.equal(
    parseEnv({ DATABASE_URL: "bad", POSTGRES_URL: "postgres://localhost/db" })
      .hasDb,
    false,
  );
  assert.equal(
    parseEnv({
      KV_REST_API_URL: "https://redis.example.com",
      KV_REST_API_TOKEN: " ",
    }).hasRedis,
    false,
  );
});
test("ticket fragments round-trip Unicode and never retain unknown private fields", () => {
  assert.deepEqual(decodeTicket(encodeTicket(ticket), ticket.id), ticket);
  const extra = { ...ticket, email: "fictional@example.com" };
  assert.equal(encodeTicket(extra).includes("email"), false);
  assert.equal(decodeTicket(encodeTicket(ticket), "local-other"), null);
});
test("malformed, oversized, invalid-version and invalid-date tickets are rejected", () => {
  for (const hash of [
    "#ticket=%",
    "#ticket=null",
    `#ticket=${"x".repeat(3001)}`,
    "#ticket=%7B%7D",
  ])
    assert.equal(decodeTicket(hash, ticket.id), null);
  for (const change of [
    { v: 2 },
    { number: -1 },
    { username: "../bad" },
    { startsAt: "bad" },
  ])
    assert.equal(
      decodeTicket(
        `#ticket=${encodeURIComponent(JSON.stringify({ ...ticket, ...change }))}`,
        ticket.id,
      ),
      null,
    );
});
test("claim validation accepts optional GitHub and rejects invalid input", () => {
  assert.equal(
    claimSchema.safeParse({
      name: "Fictional Example",
      email: "fictional@example.com",
      username: "",
    }).success,
    true,
  );
  assert.equal(
    claimSchema.safeParse({
      name: "Fictional Example",
      email: "fictional@example.com",
      username: "valid-user",
    }).success,
    true,
  );
  for (const username of ["-invalid", "bad--name", "bad_name", "x".repeat(40)])
    assert.equal(
      claimSchema.safeParse({
        name: "Example Person",
        email: "fictional@example.com",
        username,
      }).success,
      false,
    );
  assert.equal(
    claimSchema.safeParse({ name: " ", email: "invalid", username: "" })
      .success,
    false,
  );
});
test("countdowns handle boundaries, clamp negatives and retain multi-day hours", () => {
  assert.deepEqual(remaining(86400000 + 3661000, 0), [1, 1, 1, 1]);
  assert.deepEqual(remaining(100, 101), [0, 0, 0, 0]);
  assert.equal(compactTime(3 * 86400000, 0), "72:00:00");
  assert.equal(
    revealTime(
      {
        number: 2,
        shortTitle: "",
        version: "1.0",
        category: "",
        authorIds: [],
        title: "",
        teaser: "",
        media: "layers",
        revealAt: "2026-11-10T09:00:00Z",
      },
      1000,
    ),
    86401000,
  );
});
test("every hundredth ticket is gold; fixtures contain 20 fictional registrations", () => {
  assert.equal(registrations.length, 20);
  assert.equal(new Set(registrations.map((row) => row.id)).size, 20);
  for (const number of [100, 200, 1000]) assert.equal(isGold(number), true);
  for (const number of [0, 99, 101]) assert.equal(isGold(number), false);
  assert.equal(
    registrations.every((person) => person.fixture),
    true,
  );
});
test("referrals count once, skip self-referrals and sort stably", () => {
  const credited = creditReferral({}, "demo-2", "local-example", false);
  assert.deepEqual(credited, { "demo-2": 1 });
  assert.deepEqual(
    creditReferral(credited, "demo-2", "local-example", true),
    credited,
  );
  assert.deepEqual(
    creditReferral({}, "local-example", "local-example", false),
    {},
  );
  assert.deepEqual(creditReferral({}, "__proto__", "local-example", false), {});
  const rows = rankRegistrations({ "demo-2": 32 });
  assert.equal(rows[0].number, 100);
  assert.equal(rows[1].number, 101);
});

test("day-three initialization and one-time migration preserve tickets and credits", () => {
  const now = Date.parse("2026-10-27T12:00:00Z");
  const fresh = freshState(now);
  assert.equal(fresh.anchor, now - 2 * DAY_MS);
  const legacy = {
    anchor: now - 999,
    ticket,
    invited: null,
    credits: { "demo-1": 1 },
    dismissed: true,
  };
  const migrated = migrateState(legacy, now);
  assert.equal(migrated.anchor, fresh.anchor);
  assert.deepEqual(migrated.ticket, ticket);
  assert.equal(migrated.ticket?.startsAt, c.startsAt);
  assert.deepEqual(migrated.credits, legacy.credits);
  assert.deepEqual(migrated.bookmarks, []);
  assert.deepEqual(migrated.rsvps, []);
  assert.deepEqual(migrateState(migrated, now + DAY_MS), migrated);
  assert.deepEqual(migrateState({ anchor: "bad" }, now), fresh);
});
test("daily credits use the configured event date", () => {
  const now = Date.parse("2026-10-27T12:00:00Z");
  assert.deepEqual(
    creditsToday(
      [
        { referrer: "demo-1", at: now },
        { referrer: "demo-1", at: now - 1000 },
        { referrer: "demo-2", at: now - DAY_MS },
      ],
      now,
    ),
    { "demo-1": 2 },
  );
});
test("calendar uses effective timestamps and escapes and folds Unicode content", () => {
  const start = Date.parse("2026-10-27T12:00:00Z");
  const content = calendarContent({
    title: "Élan, Example;\n".repeat(12),
    start,
    end: start + 3600000,
    id: "test",
  });
  assert.ok(content.includes("DTSTART:20261027T120000Z\r\n"));
  assert.ok(content.includes("DTEND:20261027T130000Z\r\n"));
  assert.ok(content.replace(/\r\n /g, "").includes("Élan\\, Example\\;\\n"));
  assert.ok(
    content.split("\r\n").every((line) => Buffer.byteLength(line) <= 75),
  );
  assert.ok(eventCalendar(start).includes("DTEND:20261101T120000Z"));
});

test("ticket name truncation counts graphemes and leaves public data intact", async () => {
  const { truncateName } = await import("../lib/names");
  const limit = c.metadata.ticketNameLimit;
  assert.equal(truncateName("A".repeat(limit)), "A".repeat(limit));
  assert.equal(truncateName("A".repeat(limit + 1)), `${"A".repeat(limit)}…`);
  const combined = "e\u0301";
  assert.equal(
    truncateName(combined.repeat(limit + 1)),
    `${combined.repeat(limit)}…`,
  );
  const family = "👩‍👩‍👧‍👦";
  assert.equal(
    truncateName(`${"A".repeat(limit - 1)}${family}B`),
    `${"A".repeat(limit - 1)}${family}…`,
  );
  const long = { ...ticket, name: "Alexandria Fictional Example" };
  assert.equal(decodeTicket(encodeTicket(long), long.id)?.name, long.name);
});
