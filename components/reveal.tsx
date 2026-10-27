"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bookmark, LockKeyhole } from "lucide-react";
import { launchConfig as c } from "@/launch.config";
import { compactTime, revealTime } from "@/lib/demo";
import { authors } from "@/lib/fixtures";
import type { Day } from "@/lib/types";
import { useDemo } from "./demo-provider";
import { DropArt } from "./drop-art";
import { ClaimDialog } from "./claim-dialog";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import { CopyButton, DestinationButton } from "./demo-actions";
import { ReleaseDemo, FeatureCards } from "./release-widgets";
export function Reveal({
  day,
  children,
}: {
  day: Day;
  children: React.ReactNode;
}) {
  const { now, anchor, days, bookmarks, toggleBookmark } = useDemo();
  const [url, setUrl] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setUrl(window.location.href), 0);
    return () => clearTimeout(id);
  }, [day.number]);
  const time = revealTime(day, anchor);
  const live = now >= time;
  const next = days.find((item) => item.number === day.number + 1);
  const people = authors.filter((person) => day.authorIds.includes(person.id));
  return (
    <article className="reveal-page wrap">
      <div className="release-navigation">
        <Link href="/#lineup" className="text-link">
          <ArrowLeft size={13} />
          {c.timeline.all}
        </Link>
        <nav className="day-pagination" aria-label={c.release.daysLabel}>
          {days.map((item) => (
            <Link
              key={item.number}
              href={`/day/${item.number}`}
              aria-current={item.number === day.number ? "page" : undefined}
            >
              <span className="mono">
                {String(item.number).padStart(2, "0")}
              </span>
              <span>{item.shortTitle}</span>
              {revealTime(item, anchor) > now && <LockKeyhole size={10} />}
            </Link>
          ))}
        </nav>
      </div>
      <div className="page-heading">
        <div className="release-badges">
          <span className="event-pill">
            <span className="status-dot" />
            {c.timeline.day} {String(day.number).padStart(2, "0")} ·{" "}
            {live ? c.timeline.live : c.timeline.locked}
          </span>
          <span className="code-badge">{day.version}</span>
          <span className="code-badge teal">{day.category}</span>
        </div>
        <h1>{day.title}</h1>
        <p className="muted">{day.teaser}</p>
        <div className="release-byline">
          <div className="author-row">
            <div className="avatar-stack">
              {people.map((person) => (
                <Avatar key={person.id} name={person.name} fixture small />
              ))}
            </div>
            <div>
              <strong>
                {c.release.shipped}{" "}
                {people.map((person) => person.name).join(" & ")}
              </strong>
              <span>{c.release.team}</span>
            </div>
          </div>
          <div className="inline-actions">
            <Button
              size="sm"
              variant="outline"
              aria-pressed={bookmarks.includes(day.number)}
              onClick={() => toggleBookmark(day.number)}
            >
              <Bookmark size={13} aria-hidden />
              {bookmarks.includes(day.number)
                ? c.release.saved
                : c.release.save}
            </Button>
            <CopyButton value={url} label={c.release.share} />
          </div>
        </div>
      </div>
      {live ? (
        <>
          <ReleaseDemo day={day.number} />
          <div className="release-columns">
            <div className="prose">
              <p className="eyebrow teal">{c.release.spec}</p>
              {children}
            </div>
            <aside>
              <FeatureCards day={day.number} />
            </aside>
          </div>
          <section className="panel integration-cta">
            <div>
              <p className="eyebrow accent">{c.release.ready}</p>
              <h2>{c.release.ctaTitle}</h2>
              <p>{c.release.ctaDescription}</p>
            </div>
            <div className="inline-actions">
              <Button asChild>
                <a href="#sandbox">
                  {c.release.sandbox}
                  <ArrowUpRight size={14} />
                </a>
              </Button>
              <DestinationButton kind="docs" compact />
              <DestinationButton kind="github" compact />
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="reveal-art reveal-locked">
            <DropArt kind={day.media} large />
            <div className="lock-overlay">
              <LockKeyhole size={28} />
              <span>{c.timeline.unlocks}</span>
              <time>{compactTime(time, now)}</time>
            </div>
          </div>
          <div className="locked-cta">
            <p className="muted">{c.timeline.secretDescription}</p>
            <ClaimDialog />
          </div>
        </>
      )}
      {next ? (
        <Link href={`/day/${next.number}`} className="next-release">
          <span className="feature-icon">
            <LockKeyhole size={20} />
          </span>
          <span>
            <span className="eyebrow">
              {c.release.next} / {c.timeline.day}{" "}
              {String(next.number).padStart(2, "0")}
            </span>
            <strong>{next.shortTitle}</strong>
          </span>
          <span className="mono accent">
            {revealTime(next, anchor) > now
              ? compactTime(revealTime(next, anchor), now)
              : c.timeline.live}
          </span>
        </Link>
      ) : (
        <Link className="next-release" href="/#lineup">
          <strong>{c.release.noNext}</strong>
          <span className="accent">
            {c.release.allReleases}
            <ArrowUpRight size={14} />
          </span>
        </Link>
      )}
    </article>
  );
}
