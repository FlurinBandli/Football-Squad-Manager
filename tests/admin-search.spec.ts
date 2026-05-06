import { test, expect } from "@playwright/test";
import {
  createPlayer,
  createSquad,
  createTrainer,
  deleteVisibleRow,
  findRow,
  uniqueTestName,
} from "./helpers/admin";

test.describe("Admin search", () => {
  test("Search shows empty states when no records match", async ({ page }) => {
    const query = uniqueTestName("NoMatch");

    await page.goto(`/admin/squads?query=${query}`);
    await expect(page.getByText("Keine Teams gefunden.")).toBeVisible();

    await page.goto(`/admin/players?query=${query}`);
    await expect(page.getByText("Keine Spieler gefunden.")).toBeVisible();

    await page.goto(`/admin/trainers?query=${query}`);
    await expect(page.getByText("Keine Trainer gefunden.")).toBeVisible();
  });

  test("Search finds matching squad, player and trainer records", async ({
    page,
  }) => {
    const squadName = uniqueTestName("SearchSquad");
    const playerName = uniqueTestName("SearchPlayer");
    const trainerName = uniqueTestName("SearchTrainer");

    await createSquad(page, squadName);
    await createPlayer(page, playerName);
    await createTrainer(page, trainerName);

    await findRow(page, "/admin/squads", squadName);
    await findRow(page, "/admin/players", playerName);
    await findRow(page, "/admin/trainers", trainerName);

    await deleteVisibleRow(
      page,
      "/admin/squads",
      /Team .*schen/,
      squadName,
      "Keine Teams gefunden."
    );
    await deleteVisibleRow(
      page,
      "/admin/players",
      /Spieler .*schen/,
      playerName,
      "Keine Spieler gefunden."
    );
    await deleteVisibleRow(
      page,
      "/admin/trainers",
      /Trainer .*schen/,
      trainerName,
      "Keine Trainer gefunden."
    );
  });
});
