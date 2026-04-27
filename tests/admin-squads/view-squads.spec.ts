// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const USER = process.env.AUTH_USERNAME ?? "";
const PASS = process.env.AUTH_PASSWORD ?? "";

async function login(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.getByLabel("Benutzername").fill(USER);
  await page.getByRole("textbox", { name: "Passwort" }).fill(PASS);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("heading", { name: "Teams Bereich" })
  ).toBeVisible();
}

test.describe("Squad Management - View", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("View Squads List", async ({ page }) => {
    await page.goto(`${BASE}/admin/squads`);

    // Verify table headers
    await expect(
      page.getByRole("columnheader", { name: "Name" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Datum" })
    ).toBeVisible();

    // Verify at least one squad row is present
    const firstRow = page.locator("table tbody tr").first();
    await expect(firstRow).toBeVisible();
  });
});
