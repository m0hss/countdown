import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { launchConfig as c } from "../launch.config";
import { releaseSamples, registrations } from "../lib/fixtures";

async function ready(page: Page) {
  await expect(
    page.locator(".site-header").getByRole("button", { name: c.nav.claim }),
  ).toBeEnabled();
}
async function state(page: Page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("countdown-demo-v1")!),
  );
}

test("timeline filters, effective calendars, RSVP and optional destinations", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  await page
    .getByRole("button", { name: `${c.common.liveOnly} (3)`, exact: true })
    .click();
  await expect(page.locator(".day-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: `${c.common.lockedOnly} (2)`, exact: true })
    .click();
  await expect(page.locator(".day-card")).toHaveCount(2);
  await page
    .getByRole("button", { name: `${c.common.all} (5)`, exact: true })
    .click();
  const calendar = page.waitForEvent("download");
  await page
    .getByRole("button", { name: c.actions.calendar, exact: true })
    .click();
  const content = await readFile((await (await calendar).path())!, "utf8");
  const anchor = (await state(page)).anchor;
  expect(content).toContain(
    new Date(anchor)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z"),
  );
  await page
    .getByRole("button", { name: c.community.rsvp, exact: true })
    .first()
    .click();
  expect((await state(page)).rsvps).toEqual(["edge-ama"]);
  const sessionDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: c.community.calendar, exact: true })
    .click();
  expect((await sessionDownload).suggestedFilename()).toBe("edge-ama.ics");
  await page.reload();
  await ready(page);
  await expect(
    page.getByRole("button", { name: c.community.attending, exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator(".hero").getByRole("link", { name: c.actions.github }),
  ).toHaveAttribute("href", c.destinations.github!);
  await page
    .locator(".footer-links")
    .getByRole("button", { name: c.actions.docs })
    .click();
  await expect(page.getByRole("dialog")).toContainText(c.actions.configure);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: c.actions.explore }).click();
  await expect(page).toHaveURL(/\/day\/3$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("bookmarks, keyboard demo tabs, simulation, copy code and scripted playback", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (value: string) => {
          (window as unknown as { copied: string }).copied = value;
          return Promise.resolve();
        },
      },
    }),
  );
  await page.goto("/day/3");
  await ready(page);
  await page.getByRole("button", { name: c.release.save, exact: true }).click();
  await page.reload();
  await ready(page);
  await expect(
    page.getByRole("button", { name: c.release.saved }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: c.release.trigger }).click();
  await expect(page.locator(".terminal-status")).toHaveText(c.release.synced);
  await page.getByRole("button", { name: c.release.reset }).click();
  await expect(page.locator(".terminal-status")).toHaveText(c.release.idle);
  await page.getByRole("button", { name: c.release.copyCode }).click();
  expect(
    await page.evaluate(() => (window as unknown as { copied: string }).copied),
  ).toBe(releaseSamples[3].code);
  await page.getByRole("tab", { name: c.release.demoTab }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: c.release.benchmarkTab }),
  ).toBeFocused();
  await expect(page.locator(".benchmark-tab")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("button", { name: c.common.play }).click();
  await expect(
    page.getByRole("button", { name: c.common.pause }),
  ).toBeVisible();
  await page.getByRole("button", { name: c.common.pause }).click();
  await page.getByRole("button", { name: c.media.nextScene }).click();
  await page.getByRole("button", { name: c.media.restart }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: c.footer.reset }).click();
  await expect(
    page.getByRole("button", { name: c.release.save, exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  expect((await state(page)).rsvps).toEqual([]);
});

test("leaderboard search preserves rank, movers, personal position and mobile details", async ({
  page,
  isMobile,
}) => {
  await page.goto("/leaderboard");
  await ready(page);
  const search = page.getByRole("searchbox", { name: c.rankings.search });
  await search.fill("Sage");
  await expect(page.locator("tbody tr").first()).toContainText("#4");
  await search.fill("mika-ellery");
  await expect(page.locator("tbody tr").first()).toContainText("#1");
  await search.fill("");
  await page.getByRole("button", { name: c.rankings.movers }).click();
  await expect(page.locator("tbody .referral-count").first()).toHaveText(
    String(registrations[0].dailyReferrals),
  );
  if (isMobile) {
    await page
      .getByRole("button", { name: `${c.rankings.detail}: Mika Ellery` })
      .click();
    await expect(page.locator("#detail-demo-1")).toContainText(
      c.rankings.goldPass,
    );
  }
  await page
    .getByRole("button", { name: c.rankings.mine, exact: true })
    .click();
  await page
    .getByRole("textbox", { name: c.form.name, exact: true })
    .fill("Élan Example");
  await page
    .getByRole("textbox", { name: c.form.email, exact: true })
    .fill("elan@example.com");
  await page.getByRole("button", { name: c.form.submit }).click();
  await expect(page.locator(".pass-stage .ticket-card")).toBeVisible();
  await page.goto("/leaderboard");
  await page.getByRole("button", { name: `${c.rankings.mine} (#21)` }).click();
  await expect(page.locator(".own-rank")).toBeFocused();
  await expect(page.locator(".own-rank")).toContainText("Élan Example");
  await expect(page.locator(".personal-rank")).toContainText("#21");
});

test("portable QR decodes and Unicode pass exports contain fonts and local avatars", async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  await page.route("https://github.com/**", (route) => route.abort());
  await page.goto("/");
  await ready(page);
  await page
    .locator(".hero")
    .getByRole("button", { name: c.hero.claim })
    .click();
  await page
    .getByRole("textbox", { name: c.form.name, exact: true })
    .fill("Élan Example");
  await page
    .getByRole("textbox", { name: c.form.email, exact: true })
    .fill("elan@example.com");
  await page
    .getByRole("textbox", { name: /GitHub username/ })
    .fill("fictional-example");
  await page.getByRole("button", { name: c.form.submit }).click();
  await expect(page.locator(".pass-stage .ticket-card")).toBeVisible();
  const url = page.url();
  await page.getByRole("button", { name: c.pass.qr, exact: true }).click();
  const qr = page.locator(".enlarged-qr .ticket-qr");
  await expect(qr).toBeVisible();
  const png = PNG.sync.read(await qr.screenshot());
  expect(
    jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data,
  ).toBe(url);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: c.common.close, exact: true }).click();
  for (const format of ["svg", "png"] as const) {
    const downloaded = page.waitForEvent("download");
    await page
      .getByRole("button", { name: format === "png" ? c.pass.png : c.pass.svg })
      .click();
    const download = await downloaded;
    const output = `/tmp/countdown-export-${testInfo.project.name}.${format}`;
    await download.saveAs(output);
    const bytes = await readFile(output);
    if (format === "png") {
      const rendered = PNG.sync.read(bytes);
      expect([rendered.width, rendered.height]).toEqual([1200, 630]);
      expect(new Set(rendered.data).size).toBeGreaterThan(100);
      expect(
        jsQR(
          new Uint8ClampedArray(rendered.data),
          rendered.width,
          rendered.height,
        )?.data,
      ).toBe(url);
    } else {
      const svg = bytes.toString();
      expect(svg).toContain("Élan Example");
      expect(/data:(?:application\/font-|font\/)/.test(svg)).toBe(true);
      expect(svg).not.toContain("https://github.com/");
    }
  }
  await page.getByRole("button", { name: new RegExp(c.pass.wallet) }).click();
  await expect(page.getByRole("dialog")).toContainText(
    c.pass.walletDescription,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("all routes fit intermediate breakpoints and header menu navigates", async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [route, label] of [
      ["/", "home"],
      ["/t/demo-2", "ticket"],
      ["/day/3", "reveal"],
      ["/leaderboard", "leaderboard"],
    ]) {
      await page.goto(route);
      await ready(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
      expect((await page.locator(".site-header").boundingBox())?.height).toBe(
        64,
      );
      if (testInfo.project.name === "desktop")
        await page.screenshot({
          path: `/tmp/countdown-${label}-${width}.png`,
          fullPage: true,
        });
    }
  }
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.getByRole("button", { name: c.accessibility.menu }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .getByRole("dialog")
    .getByRole("link", { name: c.common.todayLink })
    .click();
  await expect(page).toHaveURL(/\/day\/3$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
