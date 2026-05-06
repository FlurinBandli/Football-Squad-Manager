// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Squad Management - View", () => {
  test("View Squads List", async ({ page }) => {
    await page.goto("/admin/squads");

    const table = page.locator("table");

    // Verify table headers
    await expect(table).toBeVisible();
    await expect(table).toContainText("Name");
    await expect(table).toContainText("Datum");

    // Verify at least one squad row is present
    await expect(page.locator("table tbody tr").first()).toBeVisible();
  });
});
