import { test, expect } from "@playwright/test";
import {
  createPlayer,
  createSquad,
  createTrainer,
  deleteVisibleRow,
  findRow,
  uniqueTestName,
} from "./helpers/admin";

test.describe("Delete confirmation", () => {
  test("Cancel delete keeps the squad, player and trainer", async ({ page }) => {
    const squadName = uniqueTestName("CancelSquad");
    const playerName = uniqueTestName("CancelPlayer");
    const trainerName = uniqueTestName("CancelTrainer");

    await createSquad(page, squadName);
    await createPlayer(page, playerName);
    await createTrainer(page, trainerName);

    const squadRow = await findRow(page, "/admin/squads", squadName);
    await squadRow.getByRole("button", { name: /Team .*schen/ }).click();
    await page.getByRole("button", { name: "Abbrechen" }).click();
    await expect(squadRow).toBeVisible();

    const playerRow = await findRow(page, "/admin/players", playerName);
    await playerRow.getByRole("button", { name: /Spieler .*schen/ }).click();
    await page.getByRole("button", { name: "Abbrechen" }).click();
    await expect(playerRow).toBeVisible();

    const trainerRow = await findRow(page, "/admin/trainers", trainerName);
    await trainerRow.getByRole("button", { name: /Trainer .*schen/ }).click();
    await page.getByRole("button", { name: "Abbrechen" }).click();
    await expect(trainerRow).toBeVisible();

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
