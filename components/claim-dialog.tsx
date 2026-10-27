"use client";
import { OrbitalMark } from "./brand";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { launchConfig as c } from "@/launch.config";
import { claimSchema, ticketPath } from "@/lib/demo";
import { useDemo } from "./demo-provider";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
export function ClaimDialog({
  label = c.hero.claim,
  compact = false,
  referrer,
}: {
  label?: string;
  compact?: boolean;
  referrer?: string;
}) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { claim, ready, storageAvailable } = useDemo();
  const router = useRouter();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = claimSchema.safeParse({
      name: String(data.get("name") || ""),
      email: String(data.get("email") || "").trim(),
      username: String(data.get("username") || "")
        .trim()
        .replace(/^@/, ""),
    });
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues)
        next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      document.getElementById(`claim-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const from =
      referrer || new URLSearchParams(window.location.search).get("ref");
    const ticket = claim(result.data.name, result.data.username, from);
    setOpen(false);
    setErrors({});
    const path = ticketPath(ticket);
    if (`${window.location.pathname}${window.location.hash}` !== path)
      router.push(path);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={compact ? "sm" : "default"} disabled={!ready}>
          {label}
          <ArrowUpRight size={compact ? 15 : 18} aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={c.form.close}>
        <OrbitalMark className="form-mark" />
        <p className="eyebrow">{c.ticket.edition}</p>
        <DialogTitle className="dialog-title">{c.form.title}</DialogTitle>
        <DialogDescription className="muted">
          {c.form.description}
        </DialogDescription>
        <form noValidate onSubmit={submit} className="claim-form">
          {(
            [
              ["name", c.form.name, c.form.namePlaceholder, "text", "name"],
              [
                "email",
                c.form.email,
                c.form.emailPlaceholder,
                "email",
                "email",
              ],
              [
                "username",
                c.form.github,
                c.form.githubPlaceholder,
                "text",
                "off",
              ],
            ] as const
          ).map(([field, label, placeholder, type, autoComplete]) => (
            <div className="field" key={field}>
              <label htmlFor={`claim-${field}`}>
                {label}
                {field === "username" && (
                  <span className="muted"> ({c.form.optional})</span>
                )}
              </label>
              <input
                id={`claim-${field}`}
                name={field}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required={field !== "username"}
                aria-invalid={Boolean(errors[field])}
                aria-describedby={errors[field] ? `${field}-error` : undefined}
                maxLength={
                  field === "name" ? 60 : field === "username" ? 40 : 254
                }
              />
              {errors[field] && (
                <p id={`${field}-error`} className="field-error" role="alert">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
          <Button type="submit" className="w-full">
            {c.form.submit}
            <ArrowRight size={18} aria-hidden />
          </Button>
          <p className="form-privacy">{c.form.privacy}</p>
          {!storageAvailable && (
            <p className="form-privacy" role="status">
              {c.form.storageError}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
