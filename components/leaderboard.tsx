"use client";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  Crown,
  Search,
  Users,
  Ticket,
  Hourglass,
  ChevronDown,
} from "lucide-react";
import { launchConfig as c } from "@/launch.config";
import {
  rankRegistrations,
  ticketPath,
  isGold,
  DAY_MS,
  remaining,
} from "@/lib/demo";
import { creditsToday } from "@/lib/state";
import { useDemo } from "./demo-provider";
import { Avatar } from "./avatar";
import { ClaimDialog } from "./claim-dialog";
import { CopyButton } from "./demo-actions";
export function Leaderboard() {
  const { credits, ticket, invited, creditEvents, anchor, now } = useDemo();
  const [mode, setMode] = useState("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setUrl(ticket ? `${window.location.origin}${ticketPath(ticket)}` : ""),
      0,
    );
    return () => clearTimeout(timer);
  }, [ticket]);
  const rows = rankRegistrations(
    credits,
    ticket ? { ...ticket, referrals: 0 } : null,
    invited ? { ...invited, referrals: 0 } : null,
  );
  const daily = creditsToday(creditEvents, now);
  const todayCount = (id: string, base = 0) => base + (daily[id] || 0);
  const ranked =
    mode === "movers"
      ? [...rows].sort(
          (a, b) =>
            todayCount(b.id, b.dailyReferrals) -
              todayCount(a.id, a.dailyReferrals) || a.number - b.number,
        )
      : rows;
  const filtered = ranked
    .map((person, index) => ({ ...person, rank: index + 1 }))
    .filter((person) =>
      `${person.name} ${person.username || ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    );
  const tableRows = query || mode !== "all" ? filtered : filtered.slice(3);
  const ownIndex = rows.findIndex((row) => row.id === ticket?.id);
  const own = rows[ownIndex];
  const nextMilestone = c.milestones.find(
    (item) => item.threshold > (own?.referrals || 0),
  );
  const time = remaining(anchor + c.eventDurationDays * DAY_MS, now);
  const href = (id: string) =>
    ticket?.id === id
      ? ticketPath(ticket)
      : invited?.id === id
        ? ticketPath(invited)
        : `/t/${id}`;
  function mine() {
    setMode("mine");
    setQuery("");
    setTimeout(() => {
      const row = document.getElementById(`rank-${ticket?.id}`);
      row?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
      row?.focus({ preventScroll: true });
    }, 0);
  }
  const tier = (count: number) =>
    [...c.milestones].reverse().find((item) => count >= item.threshold)?.name ||
    c.rankings.tierBase;
  return (
    <section className="leaderboard-page wrap">
      <div className="leaderboard-intro">
        <div>
          <p className="eyebrow accent">{c.leaderboard.eyebrow}</p>
          <h1>{c.leaderboard.title}</h1>
          <p className="muted">{c.leaderboard.description}</p>
        </div>
        {ticket ? (
          <div className="referral-link">
            <input
              aria-label={c.rankings.referralLink}
              readOnly
              value={url}
              onFocus={(event) => event.target.select()}
            />
            <CopyButton value={url} label={c.ticket.copy} />
          </div>
        ) : (
          <ClaimDialog />
        )}
      </div>
      <div className="stat-grid">
        {[
          [c.rankings.registrations, rows.length, c.rankings.seeded, Users],
          [
            c.rankings.referrals,
            rows.reduce((sum, person) => sum + person.referrals, 0),
            c.rankings.referralDetail,
            Users,
          ],
          [
            c.rankings.gold,
            rows.filter((person) => isGold(person.number)).length,
            c.rankings.goldDetail,
            Ticket,
          ],
        ].map(([label, value, detail, Icon], index) => {
          const MetricIcon = Icon as typeof Users;
          return (
            <div
              className={`panel stat-card stat-${index}`}
              key={String(label)}
            >
              <div className="stat-label">
                <span>{String(label)}</span>
                <MetricIcon size={15} aria-hidden />
              </div>
              <strong>{Number(value).toLocaleString(c.locale)}</strong>
              <span className="eyebrow">{String(detail)}</span>
            </div>
          );
        })}
        <div className="panel stat-card">
          <div className="stat-label">
            <span>{c.rankings.remaining}</span>
            <Hourglass size={14} />
          </div>
          <strong className="teal stat-time">
            {time[0]}d {time[1]}h<br />
            {time[2]}m {time[3]}s
          </strong>
          <span className="eyebrow">{c.rankings.end}</span>
        </div>
      </div>
      <div className="podium-heading">
        <h2>
          <Award size={21} className="accent" />
          {c.leaderboard.top}
        </h2>
        <span className="eyebrow muted">{c.rankings.podiumNote}</span>
      </div>
      <div className="podium">
        {rows.slice(0, 3).map((person, index) => (
          <Link
            href={href(person.id)}
            key={person.id}
            className={`panel podium-card podium-${index + 1}`}
          >
            <span className="podium-rank">
              {index === 0 && <Crown size={14} />}
              {index === 0 ? c.rankings.champion : c.leaderboard.rank} #
              {index + 1}
            </span>
            <Avatar {...person} />
            <strong>
              {person.username ? `@${person.username}` : person.name}
            </strong>
            <span className="eyebrow muted">
              {person.role || c.rankings.seeded}
            </span>
            <span className="podium-count mono">
              {person.referrals} {c.rankings.invites}
            </span>
            <div className="podium-reward">
              <Award size={15} />
              {tier(person.referrals)}
            </div>
          </Link>
        ))}
      </div>
      <section className="panel ranking-panel">
        <div className="ranking-toolbar">
          <div
            className="segmented"
            role="group"
            aria-label={c.rankings.rankingTabs}
          >
            <button
              aria-pressed={mode === "all"}
              onClick={() => setMode("all")}
            >
              {c.rankings.all}
            </button>
            <button
              aria-pressed={mode === "movers"}
              onClick={() => setMode("movers")}
            >
              {c.rankings.movers}
            </button>
            {ticket ? (
              <button aria-pressed={mode === "mine"} onClick={mine}>
                {c.rankings.mine} (#{ownIndex + 1})
              </button>
            ) : (
              <ClaimDialog label={c.rankings.mine} compact />
            )}
          </div>
          <label className="search-field">
            <Search size={15} aria-hidden />
            <input
              type="search"
              placeholder={c.rankings.search}
              aria-label={c.rankings.search}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th scope="col">{c.leaderboard.rank}</th>
                <th scope="col">{c.leaderboard.person}</th>
                <th scope="col" className="detail-column">
                  {c.rankings.handle}
                </th>
                <th scope="col">{c.leaderboard.referrals}</th>
                <th scope="col" className="detail-column">
                  {c.rankings.goldColumn}
                </th>
                <th scope="col" className="detail-column">
                  {c.rankings.lastActive}
                </th>
                <th scope="col" className="detail-column">
                  {c.rankings.tier}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((person) => (
                <Fragment key={person.id}>
                  <tr
                    id={`rank-${person.id}`}
                    tabIndex={-1}
                    className={person.id === ticket?.id ? "own-rank" : ""}
                  >
                    <td className="rank">#{person.rank}</td>
                    <td>
                      <div className="leader-person">
                        <Link href={href(person.id)}>
                          <Avatar {...person} small />
                          <strong>{person.name}</strong>
                        </Link>
                        <button
                          className="icon-button row-toggle"
                          aria-label={`${c.rankings.detail}: ${person.name}`}
                          aria-expanded={expanded.includes(person.id)}
                          aria-controls={`detail-${person.id}`}
                          onClick={() =>
                            setExpanded((previous) =>
                              previous.includes(person.id)
                                ? previous.filter((id) => id !== person.id)
                                : [...previous, person.id],
                            )
                          }
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="mono muted detail-column">
                      {person.username ? `@${person.username}` : "—"}
                    </td>
                    <td className="referral-count">
                      {mode === "movers"
                        ? todayCount(person.id, person.dailyReferrals)
                        : person.referrals}
                    </td>
                    <td className="detail-column">
                      <span
                        className={`code-badge ${isGold(person.number) ? "gold-text" : "muted"}`}
                      >
                        {isGold(person.number)
                          ? c.rankings.goldPass
                          : c.rankings.standard}
                      </span>
                    </td>
                    <td className="detail-column muted">
                      {!person.lastActiveDays
                        ? c.rankings.today
                        : person.lastActiveDays === 1
                          ? c.rankings.yesterday
                          : `${person.lastActiveDays} ${c.rankings.daysAgo}`}
                    </td>
                    <td className="detail-column">
                      <span className="eyebrow teal">
                        {tier(person.referrals)}
                      </span>
                    </td>
                  </tr>
                  {expanded.includes(person.id) && (
                    <tr id={`detail-${person.id}`} className="rank-details">
                      <td colSpan={7}>
                        <dl>
                          <div>
                            <dt>{c.rankings.handle}</dt>
                            <dd>
                              {person.username ? `@${person.username}` : "—"}
                            </dd>
                          </div>
                          <div>
                            <dt>{c.rankings.goldColumn}</dt>
                            <dd>
                              {isGold(person.number)
                                ? c.rankings.goldPass
                                : c.rankings.standard}
                            </dd>
                          </div>
                          <div>
                            <dt>{c.rankings.tier}</dt>
                            <dd>{tier(person.referrals)}</dd>
                          </div>
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          {tableRows.length === 0 && (
            <p className="empty-search" role="status">
              {c.common.empty}
            </p>
          )}
        </div>
        <div className="personal-rank">
          {own ? (
            <>
              <Avatar {...own} small />
              <div>
                <strong>
                  {c.rankings.position}: #{ownIndex + 1} · {own.name}
                </strong>
                <p>
                  {own.referrals} {c.rankings.progress}
                </p>
              </div>
              <progress
                value={own.referrals}
                max={nextMilestone?.threshold || Math.max(own.referrals, 1)}
                aria-label={c.rankings.progress}
              />
              <CopyButton value={url} label={c.ticket.copy} />
            </>
          ) : (
            <>
              <Users size={20} className="accent" />
              <p>{c.rankings.notRanked}</p>
              <ClaimDialog compact />
            </>
          )}
        </div>
      </section>
      <p className="leaderboard-note">{c.leaderboard.note}</p>
      <section className="milestone-section">
        <h2>{c.rankings.milestones}</h2>
        <p className="muted">{c.rankings.milestonesDescription}</p>
        <div className="milestone-grid">
          {c.milestones.map((milestone, index) => (
            <article
              key={milestone.threshold}
              className={`panel milestone-card tone-${milestone.accent}`}
            >
              <div className="milestone-top">
                <span className="code-badge">
                  {milestone.label} ·{" "}
                  {(own?.referrals || 0) >= milestone.threshold
                    ? c.rankings.unlocked
                    : index ===
                        c.milestones.findIndex(
                          (item) => item.threshold > (own?.referrals || 0),
                        )
                      ? c.rankings.inProgress
                      : c.rankings.locked}
                </span>
                <span className="mono">
                  {milestone.threshold} {c.rankings.invites}
                </span>
              </div>
              <h3>{milestone.name}</h3>
              <p>{milestone.description}</p>
              <span className="eyebrow">
                <Award size={13} />
                {c.rankings.preview}
              </span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
