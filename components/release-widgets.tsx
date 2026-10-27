"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRightLeft, ShieldCheck, Zap, Terminal } from "lucide-react";
import { launchConfig as c } from "@/launch.config";
import { releaseSamples, testimonial, telemetry } from "@/lib/fixtures";
import { Button } from "./ui/button";
import { CopyButton } from "./demo-actions";
import { Avatar } from "./avatar";
import { ScriptedPreview } from "./media-preview";
import { Sparkline } from "./home";
export function CodeSample({ day = 3 }: { day?: number }) {
  const sample = releaseSamples[day];
  return (
    <div className="code-sample">
      <div className="code-toolbar">
        <span>{c.release.file}</span>
        <CopyButton value={sample.code} label={c.release.copyCode} />
      </div>
      <pre tabIndex={0} aria-label={c.release.code}>
        <code>{sample.code}</code>
      </pre>
    </div>
  );
}
export function FeatureCards({ day = 3 }: { day?: number }) {
  const icons = [ArrowRightLeft, ShieldCheck, Zap];
  return (
    <div className="feature-cards">
      {releaseSamples[day].features.map((feature, index) => {
        const Icon = icons[index];
        return (
          <section className="panel feature-card" key={feature.title}>
            <span className="feature-icon">
              <Icon size={21} />
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <span className="eyebrow teal">{feature.detail}</span>
          </section>
        );
      })}
      <div className="panel telemetry">
        <p className="eyebrow">{c.release.telemetry}</p>
        <dl>
          {[
            [c.release.peers, telemetry.peers],
            [c.release.messages, telemetry.messages],
            [c.release.loss, telemetry.loss],
            [c.release.uptime, telemetry.uptime],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
export function Testimonial() {
  return (
    <figure className="panel testimonial">
      <span className="quote-symbol accent" aria-hidden>
        “
      </span>
      <blockquote>{testimonial.quote}</blockquote>
      <figcaption>
        <Avatar name={testimonial.name} fixture small />
        <span>
          <strong>{testimonial.name}</strong>
          <span>{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
export function BenchmarkComparison({ day = 3 }: { day?: number }) {
  const sample = releaseSamples[day];
  return (
    <div className="benchmark-comparison">
      <p className="eyebrow">{c.release.latency}</p>
      {[
        [c.release.mesh, sample.distributed, "teal"],
        [c.release.traditional, sample.baseline, "muted"],
      ].map(([label, value, tone]) => (
        <div className="benchmark-bar" key={label}>
          <div>
            <span>{label}</span>
            <strong>{value} ms</strong>
          </div>
          <div className="bar-track">
            <span
              className={String(tone)}
              style={{ width: `${(Number(value) / sample.baseline) * 100}%` }}
            />
          </div>
        </div>
      ))}
      <p className="benchmark-note">{c.release.metricNote}</p>
      <Sparkline values={sample.throughput} />
    </div>
  );
}
export function ReleaseDemo({ day }: { day: number }) {
  const [tab, setTab] = useState("demo");
  const [status, setStatus] = useState<"idle" | "syncing" | "synced">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sample = releaseSamples[day];
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function dispatch() {
    if (timer.current) clearTimeout(timer.current);
    setStatus("syncing");
    timer.current = setTimeout(() => setStatus("synced"), 700);
  }
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setStatus("idle");
  }
  return (
    <section className="release-demo panel" id="sandbox">
      <div className="demo-tabbar">
        <div
          className="segmented"
          role="tablist"
          aria-label={c.release.previewHeading}
        >
          {[
            ["demo", c.release.demoTab],
            ["benchmark", c.release.benchmarkTab],
            ["stream", c.release.streamTab],
          ].map(([id, label], index, tabs) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              onKeyDown={(event) => {
                const direction =
                  event.key === "ArrowRight"
                    ? 1
                    : event.key === "ArrowLeft"
                      ? -1
                      : 0;
                if (direction) {
                  event.preventDefault();
                  const next =
                    tabs[(index + direction + tabs.length) % tabs.length][0];
                  setTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="eyebrow teal">{c.common.demo}</span>
      </div>
      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
      >
        {tab === "demo" ? (
          <div className="demo-grid">
            <div className="terminal-console">
              <div className="terminal-heading">
                <span className="terminal-lights">
                  <i />
                  <i />
                  <i />
                </span>
                <span>{c.release.console}</span>
                <span className="teal">{c.release.connected}</span>
              </div>
              <pre className="terminal-command">
                <Terminal size={13} /> {sample.command}
              </pre>
              <div className="terminal-logs">
                {sample.logs.map((log, index) => (
                  <p key={log} className={index === 1 ? "accent" : ""}>
                    {log}
                  </p>
                ))}
                {status !== "idle" && (
                  <p className="teal">
                    {status === "syncing"
                      ? c.release.syncing
                      : c.release.synced}
                  </p>
                )}
              </div>
              <div className="drift-row">
                <span className="eyebrow teal">{c.release.drift}</span>
                <strong>
                  {status === "syncing"
                    ? telemetry.driftSyncing
                    : telemetry.driftIdle}{" "}
                  ms
                </strong>
              </div>
              <div className="terminal-actions">
                <Button
                  size="sm"
                  onClick={dispatch}
                  disabled={status === "syncing"}
                >
                  {c.release.trigger}
                </Button>
                <Button size="sm" variant="ghost" onClick={reset}>
                  {c.release.reset}
                </Button>
              </div>
              <p className="terminal-status" role="status">
                {c.release[status]}
              </p>
            </div>
            <BenchmarkComparison day={day} />
          </div>
        ) : tab === "benchmark" ? (
          <div className="benchmark-tab">
            <h3>{c.release.benchmarkTitle}</h3>
            <p className="muted">{c.release.benchmarkDescription}</p>
            <BenchmarkComparison day={day} />
          </div>
        ) : (
          <ScriptedPreview />
        )}
      </div>
    </section>
  );
}
