import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { launchConfig as c } from "../launch.config";
import { DAY_MS } from "../lib/demo";
async function waitReady(page: import("@playwright/test").Page) {
  await expect(
    page
      .locator(".site-header")
      .getByRole("button", { name: c.nav.claim, exact: true })
      .or(
        page
          .locator(".site-header")
          .getByRole("link", { name: c.common.viewTicket, exact: true }),
      ),
  ).toBeEnabled();
}
async function claim(
  page: import("@playwright/test").Page,
  name = "Aster Example",
) {
  await page
    .getByRole("textbox", { name: c.form.name, exact: true })
    .fill(name);
  await page
    .getByRole("textbox", { name: c.form.email, exact: true })
    .fill("aster@example.com");
  await page.getByRole("button", { name: c.form.submit }).click();
  await expect(page.locator(".pass-stage .ticket-card")).toBeVisible();
}
test("home is accessible, responsive, and free of hydration errors", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await waitReady(page);
  await expect(page.locator(".day-live")).toHaveCount(3);
  await expect(page.locator(".day-locked")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: `/tmp/countdown-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: c.faq[0].question }).click();
  await expect(page.getByText(c.faq[0].answer)).toBeVisible();
  await page.getByRole("button", { name: c.banner.dismiss }).click();
  await page.reload();
  await waitReady(page);
  await expect(page.getByText(c.banner.text)).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("claim, repeat claim, reload and portable sharing in a clean browser", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  await waitReady(page);
  await page.getByRole("button", { name: c.hero.claim, exact: true }).click();
  await page.getByRole("button", { name: c.form.submit }).click();
  await expect(page.getByText(c.form.nameError)).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await claim(page);
  await expect(page.locator(".pass-stage .ticket-person h2")).toHaveText(
    "Aster Example",
  );
  await expect(
    page.getByRole("link", { name: c.ticket.x, exact: true }),
  ).toHaveAttribute("href", /local-/);
  const url = page.url();
  expect(decodeURIComponent(url)).not.toContain("aster@example.com");
  expect(
    await page.evaluate(() => localStorage.getItem("countdown-demo-v1")),
  ).not.toContain("aster@example.com");
  await page.reload();
  await expect(page.locator(".pass-stage .ticket-person h2")).toHaveText(
    "Aster Example",
  );
  await page.getByRole("button", { name: c.ticket.claim, exact: true }).click();
  await claim(page, "Another Example");
  expect(page.url()).toBe(url);
  await expect(page.locator(".pass-stage .ticket-person h2")).toHaveText(
    "Aster Example",
  );
  const context = await browser.newContext();
  const recipient = await context.newPage();
  await recipient.goto(url);
  await expect(recipient.locator(".pass-stage .ticket-person h2")).toHaveText(
    "Aster Example",
  );
  await recipient
    .getByRole("button", { name: c.ticket.claim, exact: true })
    .click();
  await claim(recipient, "Nova Example");
  await recipient.goto(new URL("/leaderboard", url).href);
  await waitReady(recipient);
  await expect(
    recipient.getByRole("row").filter({ hasText: "Aster Example" }),
  ).toContainText("1");
  await context.close();
});
test("fixture referral, gold ticket, leaderboard and route failures", async ({
  page,
}) => {
  await page.goto("/t/demo-1");
  await waitReady(page);
  await expect(page.locator(".pass-stage .ticket-gold")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: c.ticket.claim, exact: true }).click();
  await claim(page);
  await page.goto("/leaderboard");
  await waitReady(page);
  await expect(page.locator(".podium-1")).toContainText("129");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/t/not-a-ticket");
  await expect(
    page.getByRole("heading", { name: c.ticket.missing }),
  ).toBeVisible();
  const response = await page.goto("/day/6");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(c.notFound.title)).toBeVisible();
});
test("reveal timing, reset, all-complete and reduced motion", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await waitReady(page);
  await page.goto("/day/1");
  await waitReady(page);
  await expect(page.locator(".prose")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto("/day/4");
  await expect(page.locator(".reveal-locked")).toBeVisible();
  await expect(page.locator(".prose")).toHaveCount(0);
  await page.evaluate((day) => {
    const state = JSON.parse(localStorage.getItem("countdown-demo-v1")!);
    state.anchor = Date.now() - 5 * day;
    localStorage.setItem("countdown-demo-v1", JSON.stringify(state));
  }, DAY_MS);
  await page.reload();
  await expect(page.locator(".prose")).toBeVisible();
  await page.goto("/");
  await expect(page.getByText(c.hero.complete)).toBeVisible();
  await expect(page.locator(".day-live")).toHaveCount(5);
  await page.getByRole("button", { name: c.footer.reset }).click();
  await expect(page.locator(".day-live")).toHaveCount(3);
  await page.goto("/t/demo-2");
  await page.locator(".pass-stage .ticket-card").hover();
  expect(
    await page
      .locator(".pass-stage .ticket-card")
      .evaluate((node) => getComputedStyle(node).transform),
  ).toBe("none");
  expect(errors).toEqual([]);
});
test("storage denial, avatar failure, malformed links and clipboard fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("blocked")) },
    });
  });
  await page.route("https://github.com/**", (route) => route.abort());
  await page.goto("/");
  await waitReady(page);
  await page.getByRole("button", { name: c.hero.claim, exact: true }).click();
  await expect(page.getByText(c.form.storageError)).toBeVisible();
  await page
    .getByRole("textbox", { name: /GitHub username/ })
    .fill("fictional-example");
  await claim(page);
  await expect(
    page.locator(".pass-stage .ticket-person .avatar img"),
  ).toHaveCount(0);
  await page.getByRole("button", { name: c.ticket.copy, exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: c.common.copyText }),
  ).toBeVisible();
  await page.goto("/t/local-invalid#ticket=%broken");
  await expect(
    page.getByRole("heading", { name: c.ticket.missing }),
  ).toBeVisible();
});

test("keyboard focus, pointer tilt and touch keep the ticket usable", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto("/");
  await waitReady(page);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: c.accessibility.skip }),
  ).toBeFocused();
  const trigger = page.getByRole("button", { name: c.hero.claim, exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("textbox", { name: c.form.name, exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: c.form.close })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.goto("/t/demo-2");
  const card = page.locator(".pass-stage .ticket-card");
  await expect(card).toBeVisible();
  const dimensions = (await card.boundingBox())!;
  expect(dimensions.width).toBeGreaterThan(dimensions.height);
  if (isMobile) {
    await card.tap();
    expect(
      await card.evaluate((node) => getComputedStyle(node).transform),
    ).toBe("none");
  } else {
    const bounds = (await card.boundingBox())!;
    await page.mouse.move(
      bounds.x + bounds.width * 0.8,
      bounds.y + bounds.height * 0.25,
    );
    await expect
      .poll(() =>
        card.evaluate((node) =>
          (node as HTMLElement).style.getPropertyValue("--pointer-x"),
        ),
      )
      .not.toBe("");
    await expect
      .poll(() => card.evaluate((node) => getComputedStyle(node).transform))
      .toContain("matrix3d");
    const angles = await card.evaluate((node) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return [
        Math.atan2(matrix.m23, matrix.m22),
        Math.atan2(-matrix.m13, matrix.m11),
      ].map((value) => Math.abs((value * 180) / Math.PI));
    });
    expect(angles.every((value) => value <= 10)).toBe(true);
    await page.mouse.move(0, 0);
  }
  await page.screenshot({
    path: `/tmp/countdown-ticket-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/leaderboard");
  await waitReady(page);
  await page.screenshot({
    path: `/tmp/countdown-leaderboard-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/day/1");
  await waitReady(page);
  await page.screenshot({
    path: `/tmp/countdown-reveal-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
