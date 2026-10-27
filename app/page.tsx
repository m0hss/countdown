import { pageMetadata } from "@/lib/metadata";
import { launchConfig as c } from "@/launch.config";
import { Home } from "@/components/home";
import { getDays } from "@/lib/days";
export default async function Page() {
  return <Home days={await getDays()} />;
}

export function generateMetadata() {
  return pageMetadata(c.metadata.title, c.metadata.description, "/");
}
