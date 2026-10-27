import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Day } from "./types";
const frontmatter = z.object({
  title: z.string(),
  shortTitle: z.string(),
  version: z.string(),
  category: z.string(),
  authorIds: z.array(z.string()),
  teaser: z.string(),
  revealAt: z.string().datetime(),
  media: z.enum(["orbit", "layers", "terminal", "network", "spark"]),
});
export async function getDay(number: number) {
  const source = await fs.readFile(
    path.join(process.cwd(), "content", "days", `${number}.mdx`),
    "utf8",
  );
  const { data, content } = matter(source);
  return {
    meta: { ...frontmatter.parse(data), number } satisfies Day,
    content,
  };
}
export async function getDays() {
  return Promise.all([1, 2, 3, 4, 5].map(async (n) => (await getDay(n)).meta));
}
