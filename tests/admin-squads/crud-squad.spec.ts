// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test("Create, edit and delete squad", async ({ page }) => {
  const name = `PW_TEST_Squad_${Date.now()}`;
  const editedName = `${name}_Edited`;

  // 1. Create squad
  await page.goto("/admin/squads");
  await page.getByRole("link", { name: "Neues Team erstellen" }).click();

  await page.getByLabel("Teamname", { exact: true }).fill(name);
  await page
    .getByLabel("Beschreibung", { exact: true })
    .fill("Created by Playwright");

  await page.getByRole("button", { name: "Datum auswählen" }).click();

  const calendar = page.getByRole("grid");
  await expect(calendar).toBeVisible();

  await calendar
    .getByRole("gridcell")
    .filter({ hasText: /^15$/ })
    .first()
    .click();

  await page.getByRole("button", { name: "Team speichern" }).click();

  await expect(page).toHaveURL(/\/admin\/squads(\?.*)?$/);
  await expect(page.getByText(name)).toBeVisible();

  // 2. Edit squad
  const row = page.getByRole("row", { name: new RegExp(name) });
  await row.getByRole("link", { name: "Team bearbeiten" }).click();

  await page.getByLabel("Teamname", { exact: true }).fill(editedName);
  await page.getByRole("button", { name: "Team speichern" }).click();

  await expect(page.getByText(editedName)).toBeVisible();

  // 3. Delete squad
  const editedRow = page.getByRole("row", { name: new RegExp(editedName) });
  await editedRow.getByRole("button", { name: "Team löschen" }).click();

  await page.getByRole("button", { name: "Löschen" }).click();

  await expect(page.getByText(editedName)).not.toBeVisible();
});
