import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default async function AppleIcon() {
  // iOS ignores SVG icons, so rasterise the same mark used for the favicon.
  const svg = await readFile(`${process.cwd()}/app/icon.svg`);
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} width={180} height={180} alt="" />,
    size,
  );
}
