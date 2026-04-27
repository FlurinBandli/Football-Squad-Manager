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

test.describe("Squad Management - Delete", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Delete Squad", async ({ page }) => {
    await page.goto(`${BASE}/admin/squads`);

    const firstRow = page.locator("table tbody tr").first();
    await expect(firstRow).toBeVisible();

    const nameCell = firstRow.locator("td").nth(1);
    const squadName = (await nameCell.innerText()).trim();

    // Click the delete button within the first row by aria-label (IconTooltipButton provides aria-label)
    await firstRow.getByRole("button", { name: "Team löschen" }).click();

    // Confirm the alert dialog appears and click the destructive action
    await expect(page.getByText("Team wirklich löschen?")).toBeVisible();
    await page.getByRole("button", { name: "Löschen" }).click();

    // Verify the squad row is removed
    const removedRow = page.locator("table tbody tr", { hasText: squadName });
    await expect(removedRow).toHaveCount(0);
  });
});
