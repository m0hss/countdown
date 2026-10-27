import { launchConfig as c } from "@/launch.config";
import { registrations } from "@/lib/fixtures";
import { socialImage } from "@/lib/og";
export const alt = c.metadata.ticketTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return socialImage(
    "ticket",
    registrations.find((person) => person.id === id),
  );
}
