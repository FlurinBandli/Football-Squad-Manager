import { test, expect } from "@playwright/test";

test.describe("Authentication protection", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Admin pages redirect unauthenticated users to login", async ({
    page,
  }) => {
    for (const path of ["/admin/squads", "/admin/players", "/admin/trainers"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByText("Admin Login")).toBeVisible();
    }
  });

  test("Invalid login shows an error and stays on login page", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Benutzername", { exact: true }).fill("wrong-user");
    await page.getByLabel("Passwort", { exact: true }).fill("wrong-password");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/Ung.*ltige Anmeldedaten/)).toBeVisible();
  });
});
