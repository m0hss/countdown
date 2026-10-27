import { Home } from "@/components/home";
import { getDays } from "@/lib/days";
export default async function Page() {
  return <Home days={await getDays()} />;
}
