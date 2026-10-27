"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDemo } from "./demo-provider";
import { remaining } from "@/lib/demo";
import { launchConfig as c } from "@/launch.config";
function Digit({ value }: { value: string }) {
  const reduced = useReducedMotion();
  return (
    <span className="digit">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={reduced ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
export function Countdown({ target, now }: { target: number; now: number }) {
  const { ready } = useDemo();
  const values = remaining(target, now).map((value) =>
    String(value).padStart(2, "0"),
  );
  return (
    <div
      className="countdown"
      role="timer"
      aria-busy={!ready}
      aria-live="off"
      aria-label={
        ready
          ? `${c.accessibility.countdown}: ${values.map((value, i) => `${value} ${c.units[i].toLowerCase()}`).join(", ")}`
          : c.common.loading
      }
    >
      <div className="countdown-inner" aria-hidden>
        {values.map((value, index) => (
          <div className="countdown-group" key={c.units[index]}>
            <div className="countdown-value">
              {ready ? (
                [...value].map((digit, i) => <Digit key={i} value={digit} />)
              ) : (
                <span className="countdown-skeleton" />
              )}
            </div>
            <span className="countdown-label">{c.units[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
