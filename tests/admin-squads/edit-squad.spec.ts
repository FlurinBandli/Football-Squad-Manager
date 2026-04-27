// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const USER = process.env.AUTH_USERNAME ?? "";
const PASS = process.env.AUTH_PASSWORD ?? "";

async function login(page: Page) {
  await page.goto(`${BASE}/login`);

  // Fill login form using input/textbox locators for cross-browser compatibility
  const inputs = page.locator("input");
  const usernameField = inputs.first();
  const passwordField = inputs.nth(1);

  await usernameField.fill(USER);
  await passwordField.fill(PASS);

  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("heading", { name: "Teams Bereich" })
  ).toBeVisible();
}

test.describe("Squad Management - Edit", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Edit Squad", async ({ page }) => {
    await page.goto(`${BASE}/admin/squads`);

    // Read first squad id and name from the table
    const firstRow = page.locator("table tbody tr").first();
    await expect(firstRow).toBeVisible();

    const idCell = firstRow.locator("td").nth(0);
    const nameCell = firstRow.locator("td").nth(1);

    const idText = (await idCell.innerText()).trim();
    const origName = (await nameCell.innerText()).trim();

    // Navigate to edit page directly (avoid icon-only actions without aria-label)
    await page.goto(`${BASE}/admin/squads/${idText}/edit`, {
      waitUntil: "load",
    });

    // Wait for the form to be interactive
    const teamnameField = page.locator("input").first();
    await expect(teamnameField).toBeVisible();

    // Update the team name and save
    const editedName = origName + " (edited)";
    await teamnameField.fill(editedName);
    await page.getByRole("button", { name: "Team speichern" }).click();

    // Wait for redirect back to squads list and assert the new name is visible
    await expect(
      page.getByRole("heading", { name: "Teams Bereich" })
    ).toBeVisible();
    await expect(page.getByText(editedName)).toBeVisible();
  });
});
