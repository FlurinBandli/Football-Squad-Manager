import { test, expect } from "@playwright/test";

test.describe("Admin form validation", () => {
  test("Player form requires first and last name", async ({ page }) => {
    await page.goto("/admin/players");
    await page.getByRole("button", { name: "Neuen Spieler erstellen" }).click();
    await page.getByRole("button", { name: "Spieler speichern" }).click();

    await expect(page.getByText("Vorname ist erforderlich")).toBeVisible();
    await expect(page.getByText("Nachname ist erforderlich")).toBeVisible();
  });

  test("Trainer form requires first and last name", async ({ page }) => {
    await page.goto("/admin/trainers");
    await page.getByRole("button", { name: "Neuen Trainer erstellen" }).click();
    await page.getByRole("button", { name: "Trainer speichern" }).click();

    await expect(page.getByText("Vorname ist erforderlich")).toBeVisible();
    await expect(page.getByText("Nachname ist erforderlich")).toBeVisible();
  });

  test("Squad form requires name, description and date", async ({ page }) => {
    await page.goto("/admin/squads/new");
    await page.getByRole("button", { name: "Team speichern" }).click();

    await expect(page.getByText("Teamname ist erforderlich")).toBeVisible();
    await expect(page.getByText("Beschreibung ist erforderlich")).toBeVisible();
    await expect(page.getByText("Datum ist erforderlich")).toBeVisible();
  });
});
