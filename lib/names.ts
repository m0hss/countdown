import { launchConfig as c } from "@/launch.config";

/** Truncate presentation only, without splitting emoji or combining marks. */
export function truncateName(name: string) {
  const graphemes = Array.from(
    new Intl.Segmenter(c.locale, { granularity: "grapheme" }).segment(name),
    ({ segment }) => segment,
  );
  return graphemes.length > c.metadata.ticketNameLimit
    ? `${graphemes.slice(0, c.metadata.ticketNameLimit).join("")}…`
    : name;
}
