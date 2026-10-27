import "server-only";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { launchConfig as c } from "@/launch.config";
import { initials, isGold, ticketNumber } from "./demo";
import { truncateName } from "./names";
import type { Registration } from "./types";

async function assets() {
  const [theme, geist, mono] = await Promise.all([
    readFile(`${process.cwd()}/app/theme.css`, "utf8"),
    readFile(
      `${process.cwd()}/node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf`,
    ),
    readFile(
      `${process.cwd()}/node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff`,
    ),
  ]);
  const tokens = Object.fromEntries(
    Array.from(theme.matchAll(/--([a-z-]+):\s*(#[\da-fA-F]{6});/g), (match) => [
      match[1],
      match[2],
    ]),
  );
  const color = (name: string) => {
    if (!tokens[name]) throw new Error(`Missing OG theme token: ${name}`);
    return tokens[name];
  };
  return {
    color,
    fonts: [
      {
        name: "Geist",
        data: Uint8Array.from(geist).buffer,
        weight: 700 as const,
        style: "normal" as const,
      },
      {
        name: "Space Mono",
        data: Uint8Array.from(mono).buffer,
        weight: 400 as const,
        style: "normal" as const,
      },
    ],
  };
}

export async function socialImage(
  kind: "home" | "ticket",
  person?: Registration,
) {
  const { color, fonts } = await assets();
  const gold = person && isGold(person.number);
  const accent = color(gold ? "gold" : "accent");
  const name = person?.name || c.metadata.genericName;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 56,
        background: color("bg"),
        color: color("fg"),
        fontFamily: "Geist",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32 }}
      >
        <svg width="44" height="44" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="6" fill={accent} />
          <ellipse
            cx="20"
            cy="20"
            rx="18"
            ry="8"
            transform="rotate(-42 20 20)"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
          <ellipse
            cx="20"
            cy="20"
            rx="18"
            ry="8"
            transform="rotate(42 20 20)"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
        </svg>
        {c.name}
        <span
          style={{
            marginLeft: "auto",
            color: accent,
            fontSize: 18,
            fontFamily: "Space Mono",
          }}
        >
          {c.edition}
        </span>
      </div>
      {kind === "home" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 68, letterSpacing: -3 }}>{c.hero.title}</div>
          <div style={{ fontSize: 88, letterSpacing: -4, color: accent }}>
            {c.hero.titleAccent}
          </div>
          <div style={{ fontSize: 25, color: color("muted"), marginTop: 26 }}>
            {c.description}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontFamily: "Space Mono",
              fontSize: 16,
              gap: 14,
            }}
          >
            {Array.from({ length: c.eventDurationDays }, (_, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  padding: "12px 22px",
                  border: `1px solid ${color("border")}`,
                  background: color("surface"),
                }}
              >
                {c.timeline.day} {String(index + 1).padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            marginTop: 36,
            flex: 1,
            border: `1px solid ${accent}`,
            borderRadius: 20,
            background: `linear-gradient(120deg, ${color("surface-lowest")}, ${color("surface-high")})`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 36,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{ fontFamily: "Space Mono", fontSize: 16, color: accent }}
            >
              {`${gold ? c.ticket.gold : c.ticket.standard} / ${c.pass.allAccess}`}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginTop: 40,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 72,
                  height: 72,
                  alignItems: "center",
                  justifyContent: "center",
                  background: accent,
                  color: color("on-accent"),
                  borderRadius: 16,
                  fontSize: 28,
                }}
              >
                {person ? initials(name) : c.name.slice(0, 1)}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <div
                  style={{
                    fontSize: 35,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {truncateName(name)}
                </div>
                <div
                  style={{ fontSize: 18, color: color("muted"), marginTop: 8 }}
                >
                  {person?.username ? `@${person.username}` : c.ticket.noHandle}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: "auto",
                color: accent,
                fontSize: 44,
                fontFamily: "Space Mono",
              }}
            >
              {person ? ticketNumber(person.number) : c.hero.claim}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: 240,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderLeft: `2px dashed ${color("muted")}`,
              padding: 24,
              gap: 24,
              fontFamily: "Space Mono",
              color: accent,
              fontSize: 20,
            }}
          >
            <div>{c.ticket.stub}</div>
            <div style={{ fontSize: 64 }}>
              {String(c.eventDurationDays).padStart(2, "0")}
            </div>
            <div>{c.units[0]}</div>
            <div style={{ fontSize: 14, color: color("muted") }}>
              {c.timezone}
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          marginTop: 20,
          fontFamily: "Space Mono",
          color: color("muted"),
          fontSize: 14,
        }}
      >
        {c.hero.note}
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  );
}
