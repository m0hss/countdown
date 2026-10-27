"use client";
import { useEffect, useState, useId } from "react";
import { Play, Pause, ArrowRight, RotateCcw } from "lucide-react";
import { launchConfig as c } from "@/launch.config";
import { keynoteScenes } from "@/lib/fixtures";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
export function StageArt({ compact = false }: { compact?: boolean }) {
  const gradientId = useId();
  return (
    <div className={`stage-art ${compact ? "stage-compact" : ""}`} aria-hidden>
      <svg viewBox="0 0 800 400" fill="none">
        <defs>
          <radialGradient id={gradientId}>
            <stop stopColor="var(--secondary)" stopOpacity=".5" />
            <stop offset="1" stopColor="var(--bg)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="400" fill={`url(#${gradientId})`} />
        <g stroke="var(--secondary)" opacity=".25">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M400 130 ${i * 80 - 40} 400`} />
          ))}
          {[210, 240, 280, 330, 390].map((y) => (
            <path key={y} d={`M0 ${y}H800`} />
          ))}
        </g>
        <path
          d="M150 270 400 190 650 270 400 360Z"
          fill="var(--surface-high)"
          stroke="var(--border-bright)"
        />
        <path
          d="M150 270V288L400 380V360M650 270V288L400 380"
          stroke="var(--secondary)"
          opacity=".6"
        />
        <g stroke="var(--accent)" strokeWidth="2">
          <path d="M260 70H540V230H260Z" fill="var(--surface-lowest)" />
          <ellipse
            cx="400"
            cy="150"
            rx="68"
            ry="28"
            transform="rotate(-35 400 150)"
          />
          <ellipse
            cx="400"
            cy="150"
            rx="68"
            ry="28"
            transform="rotate(35 400 150)"
          />
          <circle cx="400" cy="150" r="12" fill="var(--accent)" />
        </g>
        <g stroke="var(--foil-violet)" opacity=".35">
          <path d="M100 0 360 240M700 0 440 240M40 180 300 280M760 180 500 280" />
        </g>
      </svg>
    </div>
  );
}
export function ScriptedPreview({ inDialog = false }: { inDialog?: boolean }) {
  const Heading = inDialog ? "h3" : "h2";
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (scene === keynoteScenes.length - 1) setPlaying(false);
      else setScene(scene + 1);
    }, 4000);
    return () => clearTimeout(timer);
  }, [playing, scene]);
  const current = keynoteScenes[scene];
  return (
    <div className="scripted-preview">
      <StageArt compact />
      <div className="preview-caption">
        <span className="eyebrow teal">
          {c.media.scene} {String(scene + 1).padStart(2, "0")} /{" "}
          {String(keynoteScenes.length).padStart(2, "0")}
        </span>
        <Heading>{current.title}</Heading>
        <p>{current.text}</p>
      </div>
      <div className="preview-controls">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (scene === keynoteScenes.length - 1 && !playing) setScene(0);
            setPlaying(!playing);
          }}
        >
          {playing ? (
            <Pause size={14} aria-hidden />
          ) : (
            <Play size={14} aria-hidden />
          )}
          {playing ? c.common.pause : c.common.play}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setScene((scene + 1) % keynoteScenes.length);
            setPlaying(false);
          }}
        >
          <ArrowRight size={14} aria-hidden />
          {c.media.nextScene}
        </Button>
        <button
          className="icon-button"
          onClick={() => {
            setScene(0);
            setPlaying(false);
          }}
          aria-label={c.media.restart}
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}
export function MediaPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="keynote-card">
          <StageArt />
          <span className="keynote-top eyebrow">
            <span className="status-dot" />
            {c.media.badge}
          </span>
          <span className="keynote-center">
            <span className="play-button">
              <Play size={26} aria-hidden />
            </span>
            <strong>{c.media.title}</strong>
            <span>{c.media.host}</span>
          </span>
          <span className="keynote-bottom eyebrow">
            {c.media.duration} / {c.media.description}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="dialog-title">
          {c.media.dialogTitle}
        </DialogTitle>
        <DialogDescription>{c.media.dialogDescription}</DialogDescription>
        <ScriptedPreview inDialog />
      </DialogContent>
    </Dialog>
  );
}
