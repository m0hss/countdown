"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, RotateCcw, X, ArrowUpRight } from "lucide-react";
import { launchConfig as c } from "@/launch.config";
import { revealTime, ticketPath } from "@/lib/demo";
import { useDemo } from "./demo-provider";
import { ClaimDialog } from "./claim-dialog";
import { Brand } from "./brand";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { DestinationButton } from "./demo-actions";
export function Header() {
  const pathname = usePathname();
  const { ticket, days, now, anchor } = useDemo();
  const [open, setOpen] = useState(false);
  const today =
    days.filter((day) => revealTime(day, anchor) <= now).at(-1)?.number || 1;
  const links = [
    { label: c.nav.schedule, href: "/", active: pathname === "/" },
    {
      label: c.common.ticket,
      href: ticket ? ticketPath(ticket) : "/t/demo-2",
      active: pathname.startsWith("/t/"),
    },
    {
      label: c.common.todayLink,
      href: `/day/${today}`,
      active: pathname.startsWith("/day/"),
    },
    {
      label: c.nav.leaderboard,
      href: "/leaderboard",
      active: pathname === "/leaderboard",
    },
  ];
  const navigation = (mobile = false) => (
    <nav
      className={mobile ? "mobile-nav" : "desktop-nav"}
      aria-label={c.nav.label}
    >
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          aria-current={link.active ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
  return (
    <header className="header-shell">
      <div className="site-header wrap">
        <div className="header-brand">
          <Link href="/" aria-label={c.nav.home}>
            <Brand />
          </Link>
        </div>
        {navigation()}
        <div className="header-actions">
          {ticket ? (
            <Button asChild size="sm">
              <Link href={ticketPath(ticket)}>
                {c.common.viewTicket}
                <ArrowUpRight size={14} aria-hidden />
              </Link>
            </Button>
          ) : (
            <ClaimDialog compact label={c.nav.claim} />
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="icon-button mobile-menu-button"
                aria-label={c.accessibility.menu}
              >
                <Menu size={21} />
              </button>
            </DialogTrigger>
            <DialogContent closeLabel={c.common.closeMenu}>
              <DialogTitle className="dialog-title">
                {c.common.menuTitle}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {c.nav.label}
              </DialogDescription>
              {navigation(true)}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
export function DemoBanner() {
  const { dismissed, dismiss } = useDemo();
  return dismissed ? null : (
    <aside className="demo-banner">
      <div className="wrap banner-inner">
        <span className="eyebrow demo-label">
          <span className="status-dot" />
          {c.banner.label}
        </span>
        <p>{c.banner.text}</p>
        <button
          className="icon-button"
          aria-label={c.banner.dismiss}
          onClick={dismiss}
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
export function Footer() {
  const { reset } = useDemo();
  return (
    <footer className="footer-shell">
      <div className="site-footer wrap">
        <div>
          <Link href="/" aria-label={c.nav.home}>
            <Brand />
          </Link>
          <p>© {c.footer.copyright}</p>
        </div>
        <div className="footer-links">
          <DestinationButton kind="docs" compact />
          <DestinationButton kind="community" compact />
          <DestinationButton kind="github" compact />
          <button className="text-button" onClick={reset}>
            <RotateCcw size={13} aria-hidden />
            {c.footer.reset}
          </button>
        </div>
      </div>
    </footer>
  );
}
