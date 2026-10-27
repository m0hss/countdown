import { pageMetadata } from "@/lib/metadata";
import { registrations } from "@/lib/fixtures";
import { truncateName } from "@/lib/names";
import { launchConfig as c } from "@/launch.config";
import { TicketPage } from "@/components/ticket";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TicketPage key={id} id={id} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = registrations.find((entry) => entry.id === id);
  const title = person
    ? `${truncateName(person.name)} · ${c.metadata.ticketTitle}`
    : c.metadata.ticketTitle;
  const path = `/t/${encodeURIComponent(id)}`;
  return {
    ...pageMetadata(
      title,
      c.metadata.ticketDescription,
      path,
      `${path}/opengraph-image`,
    ),
    robots: { index: Boolean(person), follow: true },
  };
}
