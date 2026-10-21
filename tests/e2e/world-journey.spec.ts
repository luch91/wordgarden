import { expect, test } from "@playwright/test";

test("verified word journey and botanical discoveries work", async ({
  page,
}) => {
  test.skip(
    !process.env.E2E_LIVE_RECORDS,
    "requires the deployed authoritative registry",
  );
  await page.goto("/");
  const specimen = page
    .locator(".record-specimen")
    .filter({ hasText: "ubuntu" });
  await expect(specimen).toBeVisible({ timeout: 30000 });
  const scene = page.locator(".garden-object-plane");
  const before = await scene.getAttribute("style");
  await specimen.click();
  await expect(page.getByRole("heading", { name: "ubuntu" })).toBeVisible();
  await expect(page.getByText(/documentation · ACCEPTED/i)).toBeVisible();
  expect(await scene.getAttribute("style")).toBe(before);
  await page.getByRole("link", { name: /Open field journal/i }).click();
  await expect(page).toHaveURL(/\/plant\//);
  await expect(page.getByRole("heading", { name: "ubuntu" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Context carried with it/i }),
  ).toBeVisible();
  await page.goto("/");
  await page
    .getByRole("button", { name: /Origins.*Decorative collection/i })
    .click();
  await expect(page.getByRole("heading", { name: "Origins" })).toBeVisible();
  await expect(page.getByText(/Words travel between places/i)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "Origins" }),
  ).not.toBeVisible();
});
