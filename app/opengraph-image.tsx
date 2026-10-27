import { launchConfig as c } from "@/launch.config";
import { socialImage } from "@/lib/og";
export const alt = c.metadata.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return socialImage("home");
}
