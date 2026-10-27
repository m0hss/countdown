import "server-only";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { launchConfig as c } from "@/launch.config";

export async function metadataBase() {
  if (c.siteUrl) return new URL(c.siteUrl);
  const request = await headers();
  const host = request.get("host") || "localhost:3000";
  const protocol =
    request.get("x-forwarded-proto") === "https" ? "https" : "http";
  return new URL(`${protocol}://${host}`);
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/opengraph-image",
): Metadata {
  return {
    title: { absolute: title },
    description,
    ...(c.siteUrl
      ? { alternates: { canonical: new URL(path, c.siteUrl).href } }
      : {}),
    openGraph: {
      title,
      description,
      siteName: c.name,
      type: "website",
      ...(c.siteUrl ? { url: new URL(path, c.siteUrl).href } : {}),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: title }],
    },
  };
}
