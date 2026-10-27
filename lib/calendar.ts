import { launchConfig as c } from "@/launch.config";
import { DAY_MS } from "./demo";
const stamp = (value: number) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
const escape = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
// Fold on UTF-8 octet boundaries, as required by iCalendar.
function fold(line: string) {
  const lines: string[] = [];
  let part = "";
  let bytes = 0;
  for (const char of line) {
    const length = new TextEncoder().encode(char).length;
    if (bytes + length > 74) {
      lines.push(part);
      part = " ";
      bytes = 1;
    }
    part += char;
    bytes += length;
  }
  lines.push(part);
  return lines.join("\r\n");
}
export function calendarContent({
  title,
  start,
  end,
  id,
  description = c.description,
}: {
  title: string;
  start: number;
  end: number;
  id: string;
  description?: string;
}) {
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:${c.downloads.calendarProductId}`,
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${escape(id)}-${start}@${c.downloads.calendarDomain}`,
      `DTSTAMP:${stamp(start)}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${escape(title)}`,
      `DESCRIPTION:${escape(description)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}
export function eventCalendar(anchor: number) {
  return calendarContent({
    title: c.eventName,
    start: anchor,
    end: anchor + c.eventDurationDays * DAY_MS,
    id: "launch-week",
  });
}
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function downloadCalendar(
  content: string,
  filename = "launch-week.ics",
) {
  downloadBlob(
    new Blob([content], { type: "text/calendar;charset=utf-8" }),
    filename,
  );
}
