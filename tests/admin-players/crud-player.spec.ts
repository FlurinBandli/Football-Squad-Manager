// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import { clickAndExpectVisible, gotoAdmin } from "../helpers/admin";

test("Create, edit and delete player", async ({ page }) => {
  const firstName = `PW_TEST_Player_${Date.now()}`;
  const lastName = "Original";
  const editedFirstName = `${firstName}_Edited`;
  const editedLastName = "Updated";
  const waitForPlayerAction = () =>
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/admin/players")
    );

  await gotoAdmin(page, "/admin/players");

  await clickAndExpectVisible(
    page.getByRole("button", { name: "Neuen Spieler erstellen" }),
    page.getByRole("heading", { name: "Spieler erstellen" })
  );

  const createForm = page.locator("form");
  await createForm.locator("input").nth(0).fill(firstName);
  await createForm.locator("input").nth(1).fill(lastName);
  await Promise.all([
    waitForPlayerAction(),
    page.getByRole("button", { name: "Spieler speichern" }).click(),
  ]);
  await expect(
    page.getByRole("heading", { name: "Spieler erstellen" })
  ).not.toBeVisible();

  await gotoAdmin(
    page,
    `/admin/players?query=${encodeURIComponent(firstName)}`
  );
  await expect(
    page.getByRole("row", { name: new RegExp(firstName) })
  ).toBeVisible();

  const row = page.getByRole("row", { name: new RegExp(firstName) });
  await clickAndExpectVisible(
    row.getByRole("button", { name: "Spieler bearbeiten" }),
    page.getByRole("heading", { name: "Spieler bearbeiten" })
  );

  const editForm = page.locator("form");
  await editForm.locator("input").nth(0).fill(editedFirstName);
  await editForm.locator("input").nth(1).fill(editedLastName);
  await Promise.all([
    waitForPlayerAction(),
    page.getByRole("button", { name: "Spieler speichern" }).click(),
  ]);
  await expect(
    page.getByRole("heading", { name: "Spieler bearbeiten" })
  ).not.toBeVisible();

  await gotoAdmin(
    page,
    `/admin/players?query=${encodeURIComponent(editedFirstName)}`
  );
  await expect(
    page.getByRole("row", { name: new RegExp(editedFirstName) })
  ).toBeVisible();
  await expect(page.getByText(firstName, { exact: true })).not.toBeVisible();

  const editedRow = page.getByRole("row", {
    name: new RegExp(editedFirstName),
  });
  await editedRow.getByRole("button", { name: /Spieler .*schen/ }).click();
  await Promise.all([
    waitForPlayerAction(),
    page
      .getByRole("alertdialog")
      .getByRole("button", { name: /schen/ })
      .click(),
  ]);

  await gotoAdmin(
    page,
    `/admin/players?query=${encodeURIComponent(editedFirstName)}`
  );
  await expect(page.getByText("Keine Spieler gefunden.")).toBeVisible();
});
