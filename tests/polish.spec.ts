import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PNG } from "pngjs";
import { writeFile } from "node:fs/promises";
import { launchConfig as c } from "../launch.config";
import { truncateName } from "../lib/names";

test("server countdown is a matched skeleton before hydration", async ({
  page,
  browser,
  baseURL,
}) => {
  const server = await browser.newContext({
    javaScriptEnabled: false,
    viewport: page.viewportSize()!,
  });
  const unhydrated = await server.newPage();
  await unhydrated.goto(baseURL!);
  await expect(unhydrated.locator(".countdown-skeleton")).toHaveCount(4);
  await expect(unhydrated.locator(".digit")).toHaveCount(0);
  await expect(unhydrated.getByRole("timer")).toHaveAttribute(
    "aria-busy",
    "true",
  );
  const before = await unhydrated.locator(".countdown").boundingBox();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("timer")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator(".digit")).toHaveCount(8);
  await expect(page.locator(".countdown-skeleton")).toHaveCount(0);
  const after = await page.locator(".countdown").boundingBox();
  expect(Math.abs(after!.height - before!.height)).toBeLessThan(1);
  expect(Math.abs(after!.width - before!.width)).toBeLessThan(1);
  await expect(page.locator(".edition-badge")).toHaveCount(0);
  const alignment = await page.locator(".site-header").evaluate((header) => {
    const center = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.y + r.height / 2;
    };
    return [
      center(header),
      center(header.querySelector(".orbital-mark")!),
      center(header.querySelector(".brand > span")!),
    ];
  });
  expect(Math.abs(alignment[0] - alignment[1])).toBeLessThan(1);
  expect(Math.abs(alignment[0] - alignment[2])).toBeLessThan(1);
  expect(errors).toEqual([]);
  await server.close();
});

test("registration count and long-name tickets stay demo-local", async ({
  page,
}) => {
  const name = "Alexandria Fictional Example";
  await page.goto("/");
  const count = page.locator(".social-proof [role=status]");
  await expect(count).toHaveText(`20 ${c.hero.registered}`);
  await page.getByRole("button", { name: c.hero.claim, exact: true }).click();
  await page
    .getByRole("textbox", { name: c.form.name, exact: true })
    .fill(name);
  await page
    .getByRole("textbox", { name: c.form.email, exact: true })
    .fill("fictional@example.com");
  await page.getByRole("button", { name: c.form.submit }).click();
  const heading = page.locator(".pass-stage .ticket-person h2");
  await expect(heading).toHaveText(truncateName(name));
  await expect(heading).toHaveAccessibleName(name);
  expect(decodeURIComponent(page.url())).toContain(name);
  await expect(page.locator(".export-stage .ticket-person h2")).toHaveText(
    truncateName(name),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto("/");
  await expect(count).toHaveText(`21 ${c.hero.registered}`);
  await page.reload();
  await expect(count).toHaveText(`21 ${c.hero.registered}`);
  await page.getByRole("button", { name: c.footer.reset }).click();
  await expect(count).toHaveText(`20 ${c.hero.registered}`);
});

test("each route exposes metadata and local social images", async ({
  page,
  request,
}, info) => {
  for (const [path, title] of [
    ["/", c.metadata.title],
    ["/leaderboard", c.metadata.leaderboardTitle],
    ["/day/3", c.name],
    ["/t/demo-1", "Mika Ellery"],
    ["/t/local-preview", c.metadata.ticketTitle],
  ]) {
    await page.goto(path);
    await expect(page).toHaveTitle(new RegExp(title));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(
      page.locator('meta[property="og:image"]').first(),
    ).toHaveAttribute("content", /^http:\/\/127\.0\.0\.1:3100\//);
  }
  const images: Buffer[] = [];
  for (const [label, path] of [
    ["home", "/opengraph-image"],
    ["gold", "/t/demo-1/opengraph-image"],
    ["standard", "/t/demo-2/opengraph-image"],
    ["generic", "/t/local-preview/opengraph-image"],
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const buffer = await response.body();
    const png = PNG.sync.read(buffer);
    expect([png.width, png.height]).toEqual([1200, 630]);
    const colors = new Set<number>();
    let opaque = true;
    for (let i = 0; i < png.data.length; i += 4) {
      if (png.data[i + 3] !== 255) opaque = false;
      colors.add(png.data.readUInt32BE(i));
    }
    expect(opaque).toBe(true);
    expect(colors.size).toBeGreaterThan(100);
    images.push(buffer);
    await writeFile(
      `/tmp/countdown-og-${label}-${info.project.name}.png`,
      buffer,
    );
  }
  expect(images[1].equals(images[2])).toBe(false);
  expect(images[2].equals(images[3])).toBe(false);
});

test("keyboard focus uses a two-pixel accent ring on controls", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("timer")).toHaveAttribute("aria-busy", "false");
  const assertRing = async () => {
    const ring = await page.evaluate(() => {
      const el = document.activeElement!;
      const style = getComputedStyle(el);
      const probe = document.createElement("span");
      probe.style.color = "var(--accent)";
      document.body.append(probe);
      const accent = getComputedStyle(probe).color;
      probe.remove();
      return {
        width: style.outlineWidth,
        style: style.outlineStyle,
        color: style.outlineColor,
        accent,
      };
    });
    expect(ring.width).toBe("2px");
    expect(ring.style).toBe("solid");
    expect(ring.color).toBe(ring.accent);
  };
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    await assertRing();
  }
  await page.getByRole("button", { name: c.hero.claim, exact: true }).click();
  await page.keyboard.press("Tab");
  for (let i = 0; i < 6; i++) {
    await assertRing();
    await page.keyboard.press("Tab");
  }
});
