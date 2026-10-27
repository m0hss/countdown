"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  Image as ImageIcon,
  Wallet,
  Sparkles,
  ShieldCheck,
  QrCode as QrIcon,
} from "lucide-react";
import { launchConfig as c } from "@/launch.config";
import {
  decodeTicket,
  eventDates,
  isGold,
  ticketNumber,
  ticketPath,
  rankRegistrations,
} from "@/lib/demo";
import { truncateName } from "@/lib/names";
import { registrations } from "@/lib/fixtures";
import { downloadBlob } from "@/lib/calendar";
import type { Registration, TicketPayload } from "@/lib/types";
import { Avatar } from "./avatar";
import { useDemo } from "./demo-provider";
import { ClaimDialog } from "./claim-dialog";
import { Brand } from "./brand";
import { QrCode } from "./qr-code";
import { Button } from "./ui/button";
import { CopyButton, CalendarButton } from "./demo-actions";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
export function TicketCard({
  person,
  anchor,
  url = "",
  exportMode = false,
}: {
  person: Registration;
  anchor: number;
  url?: string;
  exportMode?: boolean;
}) {
  const reduced = useReducedMotion();
  const { foil } = useDemo();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 30 });
  const card = useRef<HTMLDivElement>(null);
  const gold = isGold(person.number);
  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (
      exportMode ||
      reduced ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width),
    );
    const y = Math.max(
      0,
      Math.min(1, (event.clientY - bounds.top) / bounds.height),
    );
    rotateX.set((0.5 - y) * 20);
    rotateY.set((x - 0.5) * 20);
    card.current?.style.setProperty("--pointer-x", `${x * 100}%`);
    card.current?.style.setProperty("--pointer-y", `${y * 100}%`);
  }
  const contents = (
    <>
      <div className={`ticket-foil ${foil ? "" : "foil-off"}`} />
      <div className="ticket-main">
        <span className="ticket-watermark" aria-hidden>
          {c.name}
        </span>
        <div className="ticket-top">
          <Brand />
          <span className="ticket-access mono">
            {gold ? c.ticket.gold : c.pass.allAccess}
          </span>
        </div>
        <span className="ticket-edition eyebrow">
          {c.edition} / {c.pass.public}
        </span>
        <div className="ticket-person">
          <Avatar {...person} fixture={exportMode || person.fixture} />
          <div>
            <h2 aria-label={person.name} title={person.name}>
              {truncateName(person.name)}
            </h2>
            <p className="mono">
              {person.username ? `@${person.username}` : c.ticket.noHandle}
            </p>
            <span className="ticket-verification">
              <ShieldCheck size={13} aria-hidden />
              {c.pass.verified}
            </span>
          </div>
        </div>
        <div className="ticket-bottom">
          <div>
            <span className="eyebrow">{c.ticket.number}</span>
            <strong className="ticket-number">
              {ticketNumber(person.number)}
            </strong>
          </div>
          <div className="ticket-dates">
            <strong>{eventDates(anchor)}</strong>
            <span className="eyebrow">{c.pass.broadcast}</span>
            <span className="mono">{c.timezone}</span>
          </div>
        </div>
      </div>
      <div className="ticket-stub">
        <div className="stub-heading eyebrow">
          {c.ticket.stub}
          <span className="status-dot teal-dot" />
        </div>
        <QrCode value={url} />
        <span className="stub-admit mono">{c.pass.scan}</span>
        <div className="stub-serial">
          <span>{c.pass.serial}</span>
          <strong>{ticketNumber(person.number)}</strong>
        </div>
        <div className="barcode" aria-hidden />
        <span className="stub-edition mono">
          {gold ? c.ticket.gold : c.ticket.standard}
        </span>
      </div>
    </>
  );
  return (
    <div className="ticket-perspective">
      {exportMode ? (
        <div className={`ticket-card export-card ${gold ? "ticket-gold" : ""}`}>
          {contents}
        </div>
      ) : (
        <motion.div
          ref={card}
          className={`ticket-card ${gold ? "ticket-gold" : ""}`}
          style={{
            rotateX: reduced ? 0 : springX,
            rotateY: reduced ? 0 : springY,
          }}
          onPointerMove={move}
          onPointerLeave={() => {
            rotateX.set(0);
            rotateY.set(0);
          }}
        >
          {contents}
        </motion.div>
      )}
    </div>
  );
}
export function TicketPage({ id }: { id: string }) {
  const {
    ready,
    anchor,
    ticket: own,
    credits,
    invited,
    rememberInvitation,
    foil,
    toggleFoil,
  } = useDemo();
  const [portable, setPortable] = useState<TicketPayload | null>(null);
  const [resolved, setResolved] = useState(false);
  const [url, setUrl] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);
  const fixture = registrations.find((row) => row.id === id);
  useEffect(() => {
    const read = () => {
      setPortable(decodeTicket(window.location.hash, id));
      setResolved(true);
    };
    const timeout = setTimeout(read, 0);
    window.addEventListener("hashchange", read);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("hashchange", read);
    };
  }, [id]);
  const payload = portable || (own?.id === id ? own : null);
  const person: Registration | undefined =
    fixture || (payload ? { ...payload, referrals: 0 } : undefined);
  const date = payload ? Date.parse(payload.startsAt) : anchor;
  useEffect(() => {
    if (!resolved || !ready) return;
    const timeout = setTimeout(() => {
      setUrl(
        `${window.location.origin}${payload ? ticketPath(payload) : `/t/${id}`}`,
      );
      if (payload && payload.id !== own?.id) rememberInvitation(payload);
    }, 0);
    return () => clearTimeout(timeout);
  }, [payload, resolved, ready, id, own?.id, rememberInvitation]);
  async function exportPass(format: "png" | "svg") {
    if (!exportRef.current) return;
    setExporting(true);
    setExportStatus("");
    try {
      await document.fonts.ready;
      const { toBlob, toSvg, getFontEmbedCSS } = await import("html-to-image");
      const node = exportRef.current;
      // The clone must sit inside its SVG viewport, not at the staging offset.
      const options = {
        style: {
          position: "static",
          inset: "auto",
          insetInline: "auto",
          insetBlock: "auto",
        },
        width: 1200,
        height: 630,
        pixelRatio: 1,
        fontEmbedCSS: await getFontEmbedCSS(node),
      };
      let blob: Blob | null;
      if (format === "svg") {
        const data = await toSvg(node, options);
        blob = new Blob(
          [decodeURIComponent(data.slice(data.indexOf(",") + 1))],
          { type: "image/svg+xml" },
        );
      } else blob = await toBlob(node, options);
      if (!blob) throw new Error("Export returned no image");
      downloadBlob(
        blob,
        `${c.downloads.ticketPrefix}-${person?.number}.${format}`,
      );
      setExportStatus(c.pass.exported);
    } catch {
      setExportStatus(c.pass.exportError);
    } finally {
      setExporting(false);
    }
  }
  if (!person)
    return (
      <section className="empty-state wrap">
        <p className="eyebrow accent">{c.edition}</p>
        <h1>{!ready || !resolved ? c.ticket.loading : c.ticket.missing}</h1>
        <p className="muted">{c.ticket.missingDescription}</p>
        <ClaimDialog />
        <Link className="text-link" href="/t/demo-2">
          {c.ticket.example}
          <ArrowUpRight size={16} />
        </Link>
      </section>
    );
  const rows = rankRegistrations(
    credits,
    own ? { ...own, referrals: 0 } : null,
    invited ? { ...invited, referrals: 0 } : null,
  );
  const count = person.referrals + (credits[id] || 0);
  const rank = rows.findIndex((row) => row.id === id) + 1;
  const nextMilestone = c.milestones.find((item) => item.threshold > count);
  const links = [
    [
      c.ticket.x,
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(c.shareText)}&url=${encodeURIComponent(url)}`,
    ],
    [
      c.ticket.bluesky,
      `https://bsky.app/intent/compose?text=${encodeURIComponent(`${c.shareText} ${url}`)}`,
    ],
    [
      c.ticket.linkedin,
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    ],
  ];
  return (
    <section className="ticket-page wrap">
      <div className="pass-toolbar panel">
        <div>
          <Link href="/#lineup" className="text-link mono">
            <ArrowLeft size={13} />
            {c.pass.breadcrumb}
          </Link>
          <h1>
            {c.ticket.title}
            <span className="code-badge accent">
              {fixture ? c.pass.sampleNotice : c.pass.confirmed}
            </span>
          </h1>
        </div>
        <div className="pass-controls">
          <div className="segmented">
            <Link
              href="/t/demo-2"
              aria-current={id === "demo-2" ? "page" : undefined}
            >
              {c.pass.standard}
            </Link>
            <Link
              href="/t/demo-1"
              aria-current={id === "demo-1" ? "page" : undefined}
            >
              {c.pass.gold}
            </Link>
          </div>
          <Button
            size="sm"
            variant="ghost"
            aria-pressed={foil}
            onClick={toggleFoil}
          >
            <Sparkles size={15} />
            {c.pass.foil}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportPass("png")}
            disabled={exporting || !url}
          >
            <Download size={15} />
            {exporting ? c.common.loading : c.pass.save}
          </Button>
        </div>
      </div>
      <div className="pass-stage">
        <TicketCard person={person} anchor={date} url={url} />
        <p className="ticket-hint mono">
          <Sparkles size={15} aria-hidden />
          {c.ticket.pointer}
        </p>
        {isGold(person.number) && (
          <p className="gold-note eyebrow">{c.pass.goldNote}</p>
        )}
      </div>
      <div className="ticket-panels">
        <section className="panel referral-panel">
          <p className="eyebrow accent">{c.pass.referralEyebrow}</p>
          <h2>{c.pass.referralTitle}</h2>
          <p className="muted">{c.pass.referralDescription}</p>
          <dl className="referral-stats">
            <div>
              <dt>{c.pass.invites}</dt>
              <dd>{count}</dd>
            </div>
            <div>
              <dt>{c.pass.nextReward}</dt>
              <dd className="accent">
                {nextMilestone ? nextMilestone.threshold - count : "✓"}
                <span>
                  {nextMilestone ? c.pass.remaining : c.pass.complete}
                </span>
              </dd>
            </div>
            <div>
              <dt>{c.pass.rank}</dt>
              <dd>{rank ? `#${rank}` : "—"}</dd>
            </div>
          </dl>
          <div className="referral-link">
            <input
              readOnly
              aria-label={c.rankings.referralLink}
              value={url}
              onFocus={(event) => event.target.select()}
            />
            <CopyButton value={url} label={c.ticket.copy} />
          </div>
          <div className="share-buttons" aria-label={c.ticket.shareLabel}>
            {links.map(([label, href]) => (
              <Button asChild variant="outline" size="sm" key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                  <ArrowUpRight size={13} aria-hidden />
                </a>
              </Button>
            ))}
          </div>
        </section>
        <section className="panel export-panel">
          <p className="eyebrow teal">{c.pass.exportEyebrow}</p>
          <h2>{c.pass.exportTitle}</h2>
          <p className="muted">{c.pass.exportDescription}</p>
          <div className="export-actions">
            <Dialog>
              <DialogTrigger asChild>
                <button className="export-action">
                  <Wallet size={24} />
                  <span>
                    <strong>{c.pass.wallet}</strong>
                    <span>{c.pass.walletDetail}</span>
                  </span>
                  <ArrowUpRight size={19} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="dialog-title">
                  {c.pass.wallet}
                </DialogTitle>
                <DialogDescription>
                  {c.pass.walletDescription}
                </DialogDescription>
                <div className="wallet-preview">
                  <Brand />
                  <strong>{person.name}</strong>
                  <span className="mono accent">
                    {ticketNumber(person.number)}
                  </span>
                  <QrCode value={url} />
                  <span>{eventDates(date)}</span>
                </div>
                <div className="inline-actions">
                  <Button
                    onClick={() => exportPass("png")}
                    disabled={exporting}
                  >
                    <Download size={15} />
                    {c.pass.png}
                  </Button>
                  <CalendarButton anchor={date} compact />
                </div>
              </DialogContent>
            </Dialog>
            <button
              className="export-action"
              disabled={exporting || !url}
              onClick={() => exportPass("png")}
            >
              <ImageIcon size={24} />
              <span>
                <strong>{c.pass.png}</strong>
                <span>{c.pass.pngDetail}</span>
              </span>
              <Download size={19} />
            </button>
            <button
              className="export-action"
              disabled={exporting || !url}
              onClick={() => exportPass("svg")}
            >
              <Download size={24} />
              <span>
                <strong>{c.pass.svg}</strong>
                <span>{c.pass.public}</span>
              </span>
              <ArrowUpRight size={19} />
            </button>
          </div>
          <div className="export-bottom">
            <CalendarButton anchor={date} compact />
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={!url}>
                  <QrIcon size={16} />
                  {c.pass.qr}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="dialog-title">
                  {c.pass.qrTitle}
                </DialogTitle>
                <DialogDescription>{c.pass.qrDescription}</DialogDescription>
                <div className="enlarged-qr">
                  <QrCode value={url} />
                </div>
                <CopyButton value={url} label={c.ticket.copy} />
              </DialogContent>
            </Dialog>
          </div>
          <p className="export-status" role="status">
            {exportStatus}
          </p>
        </section>
      </div>
      <div className="invite-cta">
        <ClaimDialog label={c.ticket.claim} referrer={id} />
        <span className="eyebrow muted">{c.ticket.local}</span>
      </div>
      <div className="export-stage" ref={exportRef} aria-hidden>
        <TicketCard person={person} anchor={date} url={url} exportMode />
        <span className="eyebrow export-caption">
          {c.pass.public} / {c.edition}
        </span>
      </div>
    </section>
  );
}
