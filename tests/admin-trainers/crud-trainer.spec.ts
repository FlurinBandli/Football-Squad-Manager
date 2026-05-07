// spec: test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import { clickAndExpectVisible, gotoAdmin } from "../helpers/admin";

test("Create, edit and delete trainer", async ({ page }) => {
  const firstName = `PW_TEST_Trainer_${Date.now()}`;
  const lastName = "Original";
  const editedFirstName = `${firstName}_Edited`;
  const editedLastName = "Updated";
  const waitForTrainerAction = () =>
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/admin/trainers")
    );

  await gotoAdmin(page, "/admin/trainers");

  await clickAndExpectVisible(
    page.getByRole("button", { name: "Neuen Trainer erstellen" }),
    page.getByRole("heading", { name: "Trainer erstellen" })
  );

  const createForm = page.locator("form");
  await createForm.locator("input").nth(0).fill(firstName);
  await createForm.locator("input").nth(1).fill(lastName);
  await Promise.all([
    waitForTrainerAction(),
    page.getByRole("button", { name: "Trainer speichern" }).click(),
  ]);
  await expect(
    page.getByRole("heading", { name: "Trainer erstellen" })
  ).not.toBeVisible();

  await gotoAdmin(
    page,
    `/admin/trainers?query=${encodeURIComponent(firstName)}`
  );
  await expect(
    page.getByRole("row", { name: new RegExp(firstName) })
  ).toBeVisible();

  const row = page.getByRole("row", { name: new RegExp(firstName) });
  await clickAndExpectVisible(
    row.getByRole("button", { name: "Trainer bearbeiten" }),
    page.getByRole("heading", { name: "Trainer bearbeiten" })
  );

  const editForm = page.locator("form");
  await editForm.locator("input").nth(0).fill(editedFirstName);
  await editForm.locator("input").nth(1).fill(editedLastName);
  await Promise.all([
    waitForTrainerAction(),
    page.getByRole("button", { name: "Trainer speichern" }).click(),
  ]);
  await expect(
    page.getByRole("heading", { name: "Trainer bearbeiten" })
  ).not.toBeVisible();

  await gotoAdmin(
    page,
    `/admin/trainers?query=${encodeURIComponent(editedFirstName)}`
  );
  await expect(
    page.getByRole("row", { name: new RegExp(editedFirstName) })
  ).toBeVisible();
  await expect(page.getByText(firstName, { exact: true })).not.toBeVisible();

  const editedRow = page.getByRole("row", {
    name: new RegExp(editedFirstName),
  });
  await editedRow.getByRole("button", { name: /Trainer .*schen/ }).click();
  await Promise.all([
    waitForTrainerAction(),
    page
      .getByRole("alertdialog")
      .getByRole("button", { name: /schen/ })
      .click(),
  ]);

  await gotoAdmin(
    page,
    `/admin/trainers?query=${encodeURIComponent(editedFirstName)}`
  );
  await expect(page.getByText("Keine Trainer gefunden.")).toBeVisible();
});
