// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import { gotoAdmin } from "../helpers/admin";

test("Create, edit and delete squad", async ({ page }) => {
  const name = `PW_TEST_Squad_${Date.now()}`;
  const editedName = `${name}_Edited`;
  const waitForSquadAction = () =>
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/admin/squads")
    );

  await gotoAdmin(page, "/admin/squads");
  await page.getByRole("link", { name: "Neues Team erstellen" }).click();

  const createForm = page.locator("form");
  await createForm.locator("input").nth(0).fill(name);
  await createForm.locator("input").nth(1).fill("Created by Playwright");

  await page.getByRole("button", { name: /Datum ausw/ }).click();

  const calendar = page.getByRole("grid");
  await expect(calendar).toBeVisible();

  await calendar
    .getByRole("gridcell")
    .filter({ hasText: /^15$/ })
    .first()
    .click();

  await Promise.all([
    waitForSquadAction(),
    page.getByRole("button", { name: "Team speichern" }).click(),
  ]);

  await expect(page).toHaveURL(/\/admin\/squads\?query=/);
  await expect(page.getByRole("row", { name: new RegExp(name) })).toBeVisible();

  const row = page.getByRole("row", { name: new RegExp(name) });
  await row.getByRole("link", { name: "Team bearbeiten" }).click();

  const editForm = page.locator("form");
  await editForm.locator("input").nth(0).fill(editedName);
  await Promise.all([
    waitForSquadAction(),
    page.getByRole("button", { name: "Team speichern" }).click(),
  ]);

  await expect(page).toHaveURL(/\/admin\/squads\?query=/);
  await expect(
    page.getByRole("row", { name: new RegExp(editedName) })
  ).toBeVisible();

  const editedRow = page.getByRole("row", { name: new RegExp(editedName) });
  await editedRow.getByRole("button", { name: /Team .*schen/ }).click();
  await Promise.all([
    waitForSquadAction(),
    page.getByRole("alertdialog").getByRole("button", { name: /schen/ }).click(),
  ]);

  await gotoAdmin(page, `/admin/squads?query=${encodeURIComponent(editedName)}`);
  await expect(page.getByText("Keine Teams gefunden.")).toBeVisible();
});
