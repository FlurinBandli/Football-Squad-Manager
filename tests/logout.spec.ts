import { test, expect, type Page } from "@playwright/test";
import { clickAndExpectVisible, gotoAdmin } from "./helpers/admin";

test.describe("Logout", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  async function login(page: Page) {
    await gotoAdmin(page, "/login");
    await page
      .getByLabel("Benutzername", { exact: true })
      .fill(process.env.AUTH_USERNAME!);
    await page
      .getByLabel("Passwort", { exact: true })
      .fill(process.env.AUTH_PASSWORD!);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      await clickAndExpectVisible(
        page.getByRole("button", { name: "Login" }),
        page.getByRole("heading", { name: "Teams Bereich" })
      );

      if (/\/admin\/squads/.test(page.url())) {
        return;
      }

      await expect(page.getByText(/Ung.*ltige Anmeldedaten/)).toHaveCount(0);
    }

    await expect(page).toHaveURL(/\/admin\/squads/);
  }

  test("Desktop admin can log out from the sidebar", async ({ page }) => {
    await login(page);
    await expect(
      page.getByRole("heading", { name: "Teams Bereich" })
    ).toBeVisible();

    await clickAndExpectVisible(
      page.getByRole("button", { name: "Logout" }),
      page.getByText("Admin Login")
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test("Mobile admin opens the sidebar before logging out", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page);
    await expect(
      page.getByRole("heading", { name: "Teams Bereich" })
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "Logout" })).toHaveCount(0);

    const sidebar = page.getByRole("dialog", { name: "Sidebar" });
    await clickAndExpectVisible(
      page.getByRole("button", { name: "Toggle Sidebar" }),
      sidebar
    );
    await clickAndExpectVisible(
      sidebar.getByRole("button", { name: "Logout" }),
      page.getByText("Admin Login")
    );

    await expect(page).toHaveURL(/\/login/);
  });
});
