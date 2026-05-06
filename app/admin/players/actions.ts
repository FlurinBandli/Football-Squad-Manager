"use server";

/** Action functions for managing players in the admin panel.
 * These functions handle creating, updating, and deleting players by communicating with the NestJS backend API.
 * Each function checks for user authentication, performs the necessary API calls, and handles success or error responses accordingly.
 * The deletePlayerAction function also triggers a revalidation of the players page to reflect changes immediately.
 */

import { NestFetch } from "@/lib/nest-api";
import { PlayerPayload } from "@/types";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-helpers";

/**
 * Action function to delete a player.
 * @param id The ID of the player to delete.
 * @returns A promise resolving to the result of the deletion operation.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function deletePlayerAction(id: number) {
  /**
   * Check whether the user is authenticated.
   * Unauthorized users are redirected to the login page.
   */
  await requireAuth();

  try {
    await NestFetch(`/api/player/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/admin/players");
    return { success: true, message: "Player successfully deleted" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while deleting the player",
    };
  }
}

/**
 *  Action function to create a new player.
 * @param payload The data for the new player to be created.
 * @returns A promise resolving to the result of the creation operation, including any data returned from the backend.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function createPlayerAction(payload: PlayerPayload) {
  try {
    /**
     * Check whether the user is authenticated.
     * Unauthorized users are redirected to the login page.
     */
    await requireAuth();

    /**
     * Forward the player creation request to the NestJS backend.
     */
    const data = await NestFetch("/api/player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: true, message: "Player successfully created", data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while creating the player",
    };
  }
}

/**
 *  Action function to update an existing player.
 * @param id The ID of the player to update.
 * @param payload The updated data for the player.
 * @returns A promise resolving to the result of the update operation, including any data returned from the backend.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function updatePlayerAction(id: number, payload: PlayerPayload) {
  try {
    /**
     * Check whether the user is authenticated.
     * Unauthorized users are redirected to the login page.
     */
    await requireAuth();

    /**
     * Forward the player update request to the NestJS backend.
     */
    const data = await NestFetch(`/api/player/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: true, message: "Player successfully updated", data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while updating the player",
    };
  }
}
