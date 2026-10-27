import type { Metadata } from "next";
import { metadataBase } from "@/lib/metadata";
import { GeistSans } from "geist/font/sans";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import { getDays } from "@/lib/days";
import { launchConfig as c } from "@/launch.config";
import { DemoProvider } from "@/components/demo-provider";
import { DemoBanner, Footer, Header } from "@/components/shell";
import "@/lib/env";
import "./theme.css";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: await metadataBase(),
    title: { default: c.metadata.title, template: `%s · ${c.name}` },
    description: c.metadata.description,
    robots: { index: true, follow: true },
  };
}
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // One request-time snapshot is serialized to the client for hydration parity.
  // eslint-disable-next-line react-hooks/purity
  const initialNow = Date.now();
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body>
        <a href="#main" className="skip-link">
          {c.accessibility.skip}
        </a>
        <DemoProvider initialNow={initialNow} days={await getDays()}>
          <DemoBanner />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </DemoProvider>
      </body>
    </html>
  );
}
