// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Trainer Management - View", () => {
  test("View Trainers List", async ({ page }) => {
    await page.goto("/admin/trainers");

    const table = page.locator("table");

    await expect(table).toBeVisible();
    await expect(table).toContainText("Vorname");
    await expect(table).toContainText("Nachname");
    await expect(table).toContainText("Geschlecht");
    await expect(table).toContainText("Aktionen");

    await expect(page.locator("table tbody tr").first()).toBeVisible();
  });
});
