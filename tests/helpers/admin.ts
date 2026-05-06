import { expect, type Locator, type Page } from "@playwright/test";

export function uniqueTestName(prefix: string) {
  return `PW_TEST_${prefix}_${Date.now()}`;
}

export function waitForAdminAction(page: Page, path: string) {
  return page.waitForResponse(
    (response) =>
      response.request().method() === "POST" && response.url().includes(path)
  );
}

export async function gotoAdmin(page: Page, url: string) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("NS_BINDING_ABORTED") ||
        error.message.includes("Timeout"))
    ) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      return;
    }

    throw error;
  }
}

export async function clickAndExpectVisible(trigger: Locator, target: Locator) {
  await expect(trigger).toBeVisible();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await trigger.click();

    try {
      await expect(target).toBeVisible({ timeout: 2000 });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
}

export async function createPlayer(page: Page, firstName: string) {
  await gotoAdmin(page, "/admin/players");
  await clickAndExpectVisible(
    page.getByRole("button", { name: "Neuen Spieler erstellen" }),
    page.getByRole("heading", { name: "Spieler erstellen" })
  );

  const form = page.locator("form");
  await form.locator("input").nth(0).fill(firstName);
  await form.locator("input").nth(1).fill("Original");

  await Promise.all([
    waitForAdminAction(page, "/admin/players"),
    page.getByRole("button", { name: "Spieler speichern" }).click(),
  ]);
  await expect(
    page.getByRole("heading", { name: "Spieler erstellen" })
  ).not.toBeVisible();
}

export async function createTrainer(page: Page, firstName: string) {
  await gotoAdmin(page, "/admin/trainers");
  await clickAndExpectVisible(
    page.getByRole("button", { name: "Neuen Trainer erstellen" }),
    page.getByRole("heading", { name: "Trainer erstellen" })
  );

  const form = page.locator("form");
  await form.locator("input").nth(0).fill(firstName);
  await form.locator("input").nth(1).fill("Original");

  await Promise.all([
    waitForAdminAction(page, "/admin/trainers"),
    page.getByRole("button", { name: "Trainer speichern" }).click(),
  ]);
  await expect(
    page.getByRole("heading", { name: "Trainer erstellen" })
  ).not.toBeVisible();
}

export async function createSquad(page: Page, name: string) {
  await gotoAdmin(page, "/admin/squads");
  await page.getByRole("link", { name: "Neues Team erstellen" }).click();

  const form = page.locator("form");
  await form.locator("input").nth(0).fill(name);
  await form.locator("input").nth(1).fill("Created by Playwright");

  await page.getByRole("button", { name: /Datum ausw/ }).click();
  await page
    .getByRole("grid")
    .getByRole("gridcell")
    .filter({ hasText: /^15$/ })
    .first()
    .click();

  await Promise.all([
    waitForAdminAction(page, "/admin/squads"),
    page.getByRole("button", { name: "Team speichern" }).click(),
  ]);
  await expect(page).toHaveURL(/\/admin\/squads\?query=/);
}

export async function findRow(page: Page, path: string, name: string) {
  await gotoAdmin(page, `${path}?query=${encodeURIComponent(name)}`);
  const row = page.getByRole("row", { name: new RegExp(name) });
  await expect(row).toBeVisible();
  return row;
}

export async function deleteVisibleRow(
  page: Page,
  path: string,
  deleteButtonName: RegExp,
  name: string,
  emptyText: string
) {
  const row = await findRow(page, path, name);
  await row.getByRole("button", { name: deleteButtonName }).click();
  await Promise.all([
    waitForAdminAction(page, path),
    page.getByRole("alertdialog").getByRole("button", { name: /schen/ }).click(),
  ]);

  await gotoAdmin(page, `${path}?query=${encodeURIComponent(name)}`);
  await expect(page.getByText(emptyText)).toBeVisible();
}
