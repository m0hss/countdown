import { pageMetadata } from "@/lib/metadata";
import { launchConfig as c } from "@/launch.config";
import { Leaderboard } from "@/components/leaderboard";
export default function Page() {
  return <Leaderboard />;
}

export function generateMetadata() {
  return pageMetadata(
    `${c.metadata.leaderboardTitle} · ${c.name}`,
    c.metadata.leaderboardDescription,
    "/leaderboard",
  );
}
