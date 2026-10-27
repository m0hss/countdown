import Link from "next/link";
import { launchConfig as c } from "@/launch.config";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <section className="empty-state wrap">
      <p className="eyebrow accent">{c.notFound.code}</p>
      <h1>{c.notFound.title}</h1>
      <p className="muted">{c.notFound.description}</p>
      <Button asChild>
        <Link href="/">{c.notFound.back}</Link>
      </Button>
    </section>
  );
}
