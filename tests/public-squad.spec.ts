import { test, expect } from "@playwright/test";
import {
  createSquad,
  deleteVisibleRow,
  findRow,
  uniqueTestName,
} from "./helpers/admin";

test("Public squad view opens without an admin session", async ({
  page,
  browser,
}) => {
  const squadName = uniqueTestName("PublicSquad");

  await createSquad(page, squadName);

  const row = await findRow(page, "/admin/squads", squadName);
  const publicPath = await row
    .getByRole("link", { name: "Team ansehen" })
    .getAttribute("href");

  expect(publicPath).toBeTruthy();

  const publicContext = await browser.newContext();
  const publicPage = await publicContext.newPage();
  await publicPage.goto(publicPath!);

  await expect(
    publicPage.getByRole("heading", { name: squadName })
  ).toBeVisible();
  await expect(publicPage.getByText("Trainer")).toBeVisible();
  await expect(publicPage.getByText("Ersatz")).toBeVisible();
  await expect(publicPage.getByRole("button", { name: "Logout" })).toHaveCount(
    0
  );

  await publicContext.close();

  await deleteVisibleRow(
    page,
    "/admin/squads",
    /Team .*schen/,
    squadName,
    "Keine Teams gefunden."
  );
});
