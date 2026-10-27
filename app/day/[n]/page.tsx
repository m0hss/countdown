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
