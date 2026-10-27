"use client";
import { launchConfig as c } from "@/launch.config";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="empty-state wrap">
      <h1>{c.error.title}</h1>
      <p className="muted">{c.error.description}</p>
      <Button onClick={reset}>{c.error.retry}</Button>
    </section>
  );
}
