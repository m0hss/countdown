import { TicketPage } from "@/components/ticket";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TicketPage key={id} id={id} />;
}
