"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarPlus,
  Check,
  Copy,
  Github,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { launchConfig as c } from "@/launch.config";
import { eventCalendar, downloadCalendar } from "@/lib/calendar";
import { useDemo } from "./demo-provider";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
export function CopyButton({
  value,
  label = c.common.copy,
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setManual(false);
    } catch {
      setManual(true);
    }
  }
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={copy}
        disabled={!value}
      >
        {copied ? (
          <Check size={14} aria-hidden />
        ) : (
          <Copy size={14} aria-hidden />
        )}
        {copied ? c.common.copied : label}
      </Button>
      <span className="sr-only" role="status">
        {copied ? c.common.copied : ""}
      </span>
      <Dialog open={manual} onOpenChange={setManual}>
        <DialogContent>
          <DialogTitle className="dialog-title">{c.common.copy}</DialogTitle>
          <DialogDescription>{c.common.copyFailure}</DialogDescription>
          <label className="manual-copy">
            {c.common.copyText}
            <textarea
              autoFocus
              readOnly
              value={value}
              onFocus={(event) => event.target.select()}
            />
          </label>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function CalendarButton({
  anchor,
  compact = false,
}: {
  anchor?: number;
  compact?: boolean;
}) {
  const demo = useDemo();
  return (
    <Button
      variant="outline"
      size={compact ? "sm" : "default"}
      onClick={() => downloadCalendar(eventCalendar(anchor ?? demo.anchor))}
    >
      <CalendarPlus size={16} aria-hidden />
      {c.actions.calendar}
    </Button>
  );
}
export function DestinationButton({
  kind,
  label,
  compact = false,
}: {
  kind: keyof typeof c.destinations;
  label?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const Icon =
    kind === "github"
      ? Github
      : kind === "community"
        ? MessageSquare
        : BookOpen;
  const text = label || c.actions[kind];
  const url = c.destinations[kind];
  if (url)
    return (
      <Button variant="outline" size={compact ? "sm" : "default"} asChild>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Icon size={16} aria-hidden />
          {text}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      </Button>
    );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={compact ? "sm" : "default"}>
          <Icon size={16} aria-hidden />
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <p className="eyebrow accent">{c.common.demo}</p>
        <DialogTitle className="dialog-title">
          {c.actions[`${kind}Title`]}
        </DialogTitle>
        <DialogDescription>{c.actions[`${kind}Description`]}</DialogDescription>
        <p className="muted dialog-note">{c.actions.configure}</p>
        <Button asChild>
          <Link
            onClick={() => setOpen(false)}
            href={kind === "community" ? "/leaderboard" : "/day/3"}
          >
            {kind === "community" ? c.actions.rankings : c.actions.explore}
            <ArrowUpRight size={16} aria-hidden />
          </Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
