import { pageMetadata } from "@/lib/metadata";
import { launchConfig as c } from "@/launch.config";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getDay } from "@/lib/days";
import {
  CodeSample,
  Testimonial,
  FeatureCards,
  BenchmarkComparison,
} from "@/components/release-widgets";
import { Reveal } from "@/components/reveal";
export default async function Page({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  if (!/^[1-5]$/.test(n)) notFound();
  const { meta, content } = await getDay(Number(n));
  return (
    <Reveal day={meta}>
      <MDXRemote
        source={content}
        components={{
          CodeSample,
          Testimonial,
          FeatureCards,
          BenchmarkComparison,
        }}
      />
    </Reveal>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  if (!/^[1-5]$/.test(n)) notFound();
  const { meta } = await getDay(Number(n));
  return pageMetadata(`${meta.title} · ${c.name}`, meta.teaser, `/day/${n}`);
}
