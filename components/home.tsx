"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  LockKeyhole,
  Clock,
  Check,
  MessageSquare,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { launchConfig as c } from "@/launch.config";
import {
  registrations,
  releaseSamples,
  sessions,
  telemetry,
} from "@/lib/fixtures";
import { compactTime, eventDates, revealTime, ticketNumber } from "@/lib/demo";
import { calendarContent, downloadCalendar } from "@/lib/calendar";
import type { Day } from "@/lib/types";
import { useDemo } from "./demo-provider";
import { Countdown } from "./countdown";
import { ClaimDialog } from "./claim-dialog";
import { Avatar } from "./avatar";
import { CalendarButton, DestinationButton } from "./demo-actions";
import { MediaPreview } from "./media-preview";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
export function Sparkline({ values }: { values: number[] }) {
  return (
    <svg className="sparkline" viewBox="0 0 200 60" fill="none" aria-hidden>
      <path
        d={`M${values.map((value, index) => `${index * (200 / (values.length - 1))},${58 - value / 2}`).join(" L")}`}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Home({ days }: { days: Day[] }) {
  const { now, anchor, ticket, rsvps, toggleRsvp } = useDemo();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState("all");
  const liveDays = days.filter((day) => revealTime(day, anchor) <= now);
  const today = liveDays.at(-1)?.number;
  const next = days.find((day) => revealTime(day, anchor) > now);
  const shown = days.filter(
    (day) =>
      filter === "all" ||
      (filter === "live"
        ? revealTime(day, anchor) <= now
        : revealTime(day, anchor) > now),
  );
  const recent = ticket || registrations[0];
  return (
    <>
      <section className="hero wrap">
        <div className="event-pill">
          <span className="status-dot" />
          <span>{c.hero.eyebrow}</span>
          <span className="pill-divider" />
          <span>{eventDates(anchor)}</span>
          <span className="hero-preview-label">{c.hero.preview}</span>
        </div>
        <h1>
          {c.hero.title}
          <br />
          <span>{c.hero.titleAccent}</span>
        </h1>
        <p className="hero-description">{c.hero.description}</p>
        <div className="timer-panel">
          <Countdown target={next ? revealTime(next, anchor) : now} now={now} />
          <div className="clock-metadata">
            <span>
              <span className="status-dot teal-dot" />
              {next ? c.hero.countdown : c.hero.complete}
            </span>
            <span>{c.timezone}</span>
          </div>
        </div>
        <div className="hero-cta">
          <ClaimDialog />
          <CalendarButton />
          <DestinationButton kind="github" />
        </div>
        <div className="social-proof">
          <div className="social-people">
            <div className="avatar-stack">
              {registrations.slice(0, 3).map((person) => (
                <Avatar key={person.id} {...person} small />
              ))}
              <span className="avatar avatar-small avatar-count">
                +{registrations.length - 3}
              </span>
            </div>
            <div>
              <strong role="status" aria-live="polite" aria-atomic="true">
                {registrations.length + (ticket ? 1 : 0)} {c.hero.registered}
              </strong>
              <p>{c.hero.social}</p>
            </div>
          </div>
          <div className="activity-strip">
            <span className="status-dot teal-dot" />
            <strong className="teal mono">{ticketNumber(recent.number)}</strong>
            <span>{recent.name}</span>
            <span className="eyebrow muted">
              {ticket ? c.pass.confirmed : c.common.sample}
            </span>
          </div>
        </div>
      </section>
      <section className="lineup-section wrap" id="lineup">
        <div className="section-heading">
          <div>
            <p className="eyebrow accent">
              <Clock size={13} aria-hidden />
              {c.timeline.eyebrow}
            </p>
            <h2>{c.timeline.title}</h2>
            <p className="muted">{c.timeline.description}</p>
          </div>
          <div className="segmented" role="group" aria-label={c.nav.schedule}>
            {[
              ["all", c.common.all, days.length],
              ["live", c.common.liveOnly, liveDays.length],
              ["locked", c.common.lockedOnly, days.length - liveDays.length],
            ].map(([value, label, count]) => (
              <button
                key={value}
                aria-pressed={filter === value}
                onClick={() => setFilter(String(value))}
              >
                {label} <span>({count})</span>
              </button>
            ))}
          </div>
        </div>
        <div className={`timeline filter-${filter}`}>
          {shown.map((day) => {
            const unlock = revealTime(day, anchor);
            const live = now >= unlock;
            const current = today === day.number;
            const sample = releaseSamples[day.number];
            return (
              <motion.article
                key={`${day.number}-${live}`}
                className={`day-card ${live ? "day-live" : "day-locked"} ${current ? "day-current" : ""} ${day.number === 5 ? "day-finale" : ""}`}
                initial={false}
                animate={{ rotateX: 0 }}
                whileHover={reduced ? undefined : { y: -3 }}
                transition={{ duration: 0.2 }}
              >
                {current && (
                  <span className="today-ribbon">{c.common.today}</span>
                )}
                <div className="day-card-content">
                  <div className="day-card-top">
                    <span className="mono">
                      {c.timeline.day} {String(day.number).padStart(2, "0")}
                    </span>
                    <span className={`day-status ${current ? "accent" : ""}`}>
                      {live ? (
                        current ? (
                          <>
                            <span className="status-dot" />
                            {c.common.active}
                          </>
                        ) : (
                          <>
                            <Check size={11} />
                            {c.common.revealed}
                          </>
                        )
                      ) : (
                        <>
                          <LockKeyhole size={11} />
                          {day.number === 5
                            ? c.common.finale
                            : c.timeline.locked}
                        </>
                      )}
                    </span>
                  </div>
                  <h3>{day.shortTitle}</h3>
                  <p>{day.teaser}</p>
                  {live ? (
                    <div
                      className={`release-mini ${day.number === 2 ? "mini-chart" : ""}`}
                    >
                      {day.number === 2 ? (
                        <>
                          <div>
                            <span className="eyebrow">
                              {c.release.benchmarkTab}
                            </span>
                            <strong className="teal">
                              {sample.distributed}
                              <small> ms</small>
                            </strong>
                          </div>
                          <Sparkline values={sample.throughput} />
                        </>
                      ) : (
                        <>
                          <div className="mini-terminal-head">
                            <span className="terminal-lights">
                              <i />
                              <i />
                              <i />
                            </span>
                            <span>{day.version}</span>
                          </div>
                          <code>
                            {day.number === 3
                              ? sample.code.split("\n").slice(0, 5).join("\n")
                              : sample.command}
                          </code>
                        </>
                      )}
                    </div>
                  ) : day.number === 5 ? (
                    <div className="release-tags">
                      <span>{day.category}</span>
                      <span>{day.version}</span>
                    </div>
                  ) : null}
                  <div className="day-card-bottom">
                    <Link
                      href={`/day/${day.number}`}
                      className={
                        current ? "button button-primary button-sm" : "day-link"
                      }
                    >
                      {live ? c.timeline.open : c.timeline.locked}
                      <ArrowUpRight size={14} aria-hidden />
                    </Link>
                    <span className="mono muted">
                      {new Intl.DateTimeFormat(c.locale, {
                        month: "short",
                        day: "numeric",
                        timeZone: c.timezone,
                      }).format(unlock)}
                    </span>
                  </div>
                </div>
                {!live && (
                  <div className="lock-panel">
                    <LockKeyhole size={22} aria-hidden />
                    <span className="eyebrow">{c.timeline.unlocks}</span>
                    <time>{compactTime(unlock, now)}</time>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </section>
      <section className="community-section wrap">
        <div className="keynote-section">
          <p className="eyebrow">
            <span className="status-dot" />
            {c.media.eyebrow}
          </p>
          <MediaPreview />
        </div>
        <div className="community-side">
          <div className="panel sessions-panel">
            <h3>
              <MessageSquare size={18} className="accent" aria-hidden />
              {c.community.title}
            </h3>
            <p className="muted">{c.community.description}</p>
            {sessions.map((session) => {
              const start = anchor + session.offsetHours * 3600000;
              const going = rsvps.includes(session.id);
              return (
                <div className="session-row" key={session.id}>
                  <div>
                    <strong>{session.title}</strong>
                    <span>
                      {new Intl.DateTimeFormat(c.locale, {
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: c.timezone,
                      }).format(start)}{" "}
                      · {session.host}
                    </span>
                  </div>
                  <div className="session-actions">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-pressed={going}
                      onClick={() => toggleRsvp(session.id)}
                    >
                      {going ? c.community.attending : c.community.rsvp}
                    </Button>
                    {going && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          downloadCalendar(
                            calendarContent({
                              title: session.title,
                              start,
                              end: start + session.durationMinutes * 60000,
                              id: session.id,
                            }),
                            `${session.id}.ics`,
                          )
                        }
                      >
                        {c.community.calendar}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="panel benchmark-highlight">
            <div>
              <p className="eyebrow muted">{c.community.benchmark}</p>
              <h3>{c.community.benchmarkTitle}</h3>
              <p>{c.community.benchmarkDetail}</p>
            </div>
            <div className="benchmark-number">
              <Zap size={15} aria-hidden />
              <strong>{telemetry.coldStart}</strong>
              <span className="mono">ms</span>
            </div>
          </div>
        </div>
      </section>
      <section className="faq-section wrap">
        <div className="centered section-heading">
          <p className="eyebrow accent">{c.faqEyebrow}</p>
          <h2>{c.faqTitle}</h2>
          <p className="muted">{c.community.faqDescription}</p>
        </div>
        <Accordion type="single" collapsible className="faq-list">
          {c.faq.map((item, index) => (
            <AccordionItem
              value={String(index)}
              key={item.question}
              className="accordion-item"
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="support-panel">
          <MessageSquare className="accent" size={22} aria-hidden />
          <div>
            <strong>{c.community.supportTitle}</strong>
            <p>{c.community.supportDescription}</p>
          </div>
          <DestinationButton kind="community" compact />
        </div>
      </section>
    </>
  );
}
