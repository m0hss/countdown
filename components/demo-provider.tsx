"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { MotionConfig } from "motion/react";
import { registrations } from "@/lib/fixtures";
import { creditReferral, encodeTicket } from "@/lib/demo";
import { freshState, migrateState, type DemoState } from "@/lib/state";
import type { Day, TicketPayload } from "@/lib/types";
const KEY = "countdown-demo-v1";
interface Context extends DemoState {
  days: Day[];
  now: number;
  ready: boolean;
  storageAvailable: boolean;
  claim: (
    name: string,
    username: string,
    referrer: string | null,
  ) => TicketPayload;
  dismiss: () => void;
  reset: () => void;
  rememberInvitation: (ticket: TicketPayload) => void;
  toggleBookmark: (day: number) => void;
  toggleRsvp: (id: string) => void;
  toggleFoil: () => void;
}
const DemoContext = createContext<Context | null>(null);
export function DemoProvider({
  initialNow,
  days,
  children,
}: {
  initialNow: number;
  days: Day[];
  children: React.ReactNode;
}) {
  const [state, setState] = useState<DemoState>(() => freshState(initialNow));
  const [now, setNow] = useState(initialNow);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          try {
            setState(migrateState(JSON.parse(raw), Date.now()));
          } catch {
            setState(freshState(Date.now()));
          }
        }
      } catch {
        setStorageAvailable(false);
      }
      setNow(Date.now());
      setReady(true);
    }, 0);
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(restore);
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      queueMicrotask(() => setStorageAvailable(false));
    }
  }, [state, ready]);
  const claim = (name: string, username: string, referrer: string | null) => {
    if (state.ticket) return state.ticket;
    const ticket: TicketPayload = {
      v: 1,
      id: `local-${crypto.randomUUID()}`,
      name,
      username: username || undefined,
      number: Math.max(...registrations.map((person) => person.number)) + 1,
      startsAt: new Date(state.anchor).toISOString(),
    };
    encodeTicket(ticket);
    setState((previous) => {
      const credits = creditReferral(
        previous.credits,
        referrer,
        ticket.id,
        Boolean(previous.ticket),
      );
      return {
        ...previous,
        ticket,
        credits,
        creditEvents:
          credits !== previous.credits && referrer
            ? [...previous.creditEvents, { referrer, at: Date.now() }]
            : previous.creditEvents,
      };
    });
    return ticket;
  };
  const rememberInvitation = useCallback(
    (invited: TicketPayload) =>
      setState((previous) =>
        previous.invited?.id === invited.id
          ? previous
          : { ...previous, invited },
      ),
    [],
  );
  return (
    <DemoContext.Provider
      value={{
        ...state,
        days,
        now,
        ready,
        storageAvailable,
        claim,
        rememberInvitation,
        dismiss: () =>
          setState((previous) => ({ ...previous, dismissed: true })),
        reset: () => {
          const timestamp = Date.now();
          setNow(timestamp);
          setState(freshState(timestamp));
        },
        toggleBookmark: (day) =>
          setState((previous) => ({
            ...previous,
            bookmarks: previous.bookmarks.includes(day)
              ? previous.bookmarks.filter((value) => value !== day)
              : [...previous.bookmarks, day],
          })),
        toggleRsvp: (id) =>
          setState((previous) => ({
            ...previous,
            rsvps: previous.rsvps.includes(id)
              ? previous.rsvps.filter((value) => value !== id)
              : [...previous.rsvps, id],
          })),
        toggleFoil: () =>
          setState((previous) => ({ ...previous, foil: !previous.foil })),
      }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider missing");
  return context;
}
