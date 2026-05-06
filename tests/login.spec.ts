// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Successful Admin Login", async ({ page }) => {
    // 1. Navigate to http://localhost:3000/login
    await page.goto("/login");

    // 2. Enter AUTH_USERNAME in the username field
    await page
      .getByLabel("Benutzername", { exact: true })
      .fill(process.env.AUTH_USERNAME!);

    // 3. Enter AUTH_PASSWORD in the password field
    await page
      .getByLabel("Passwort", { exact: true })
      .fill(process.env.AUTH_PASSWORD!);

    // 4. Click the Login button
    await Promise.all([
      page.waitForURL(/\/admin\/squads/),
      page.getByRole("button", { name: "Login" }).click(),
    ]);
    // expect: Redirected to /admin/squads with squads list displayed
    await expect(
      page.getByRole("heading", { name: "Teams Bereich" })
    ).toBeVisible();
  });
});
