import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByLabel("Benutzername", { exact: true })
    .fill(process.env.AUTH_USERNAME!);

  await page
    .getByLabel("Passwort", { exact: true })
    .fill(process.env.AUTH_PASSWORD!);

  await Promise.all([
    page.waitForURL(/\/admin\/squads/),
    page.getByRole("button", { name: "Login" }).click(),
  ]);

  await expect(
    page.getByRole("heading", { name: "Teams Bereich" })
  ).toBeVisible();

  await page.context().storageState({ path: "playwright/.auth/admin.json" });
});
