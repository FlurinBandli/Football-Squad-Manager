// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const USER = process.env.AUTH_USERNAME ?? "";
const PASS = process.env.AUTH_PASSWORD ?? "";

async function login(page: Page) {
  await page.goto(`${BASE}/login`);

  // Use group filters to locate form fields for cross-browser compatibility
  await page
    .locator("group")
    .filter({ hasText: "Benutzername" })
    .locator("input")
    .fill(USER);
  await page
    .locator("group")
    .filter({ hasText: "Passwort" })
    .locator("input")
    .first()
    .fill(PASS);

  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("heading", { name: "Teams Bereich" })
  ).toBeVisible();
}

test.describe("Squad Management - Create", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Create New Squad", async ({ page }) => {
    await page.goto(`${BASE}/admin/squads`);

    // Open new squad form
    await page.getByRole("link", { name: "Neues Team erstellen" }).click();
    await expect(page.getByText("Team Infos")).toBeVisible();

    const name = `E2E Test Squad ${Date.now()}`;

    // Fill form fields - locate textboxes by position
    const teamnameField = page.locator("input").first();
    await expect(teamnameField).toBeVisible();
    await teamnameField.fill(name);

    const beschreibungField = page.locator("input").nth(1);
    await expect(beschreibungField).toBeVisible();
    await beschreibungField.fill("Test squad created by Playwright");

    // Pick a date: open the calendar and choose a valid day
    await page.getByRole("button", { name: "Datum auswählen" }).click();

    // Wait for the dialog to be visible
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Find and click the first day button (button with just numbers)
    const dayButtons = page.locator('div[role="dialog"] button');
    let clicked = false;
    const count = await dayButtons.count();
    for (let i = 0; i < count && !clicked; i++) {
      const btn = dayButtons.nth(i);
      const text = await btn.textContent();
      if (text && /^\d+$/.test(text.trim())) {
        await btn.click();
        clicked = true;
      }
    }

    // Submit the form via aria-label
    await page.getByRole("button", { name: "Team speichern" }).click();

    // Wait for redirect back to squads list and verify new squad appears
    await expect(
      page.getByRole("heading", { name: "Teams Bereich" })
    ).toBeVisible();
    await expect(page.getByText(name)).toBeVisible();
  });
});
