"use server";

/**
 * Action functions for managing squads in the admin panel.
 * These functions handle creating, updating, and deleting squads by communicating with the NestJS backend API.
 * Each function checks for user authentication, performs the necessary API calls, and handles success or error responses accordingly.
 * The deleteSquadAction function also triggers a revalidation of the squads page to reflect changes immediately.
 */
import { requireAuth } from "@/lib/auth-helpers";
import { NestFetch } from "@/lib/nest-api";
import { SquadPayload } from "@/types";
import { revalidatePath } from "next/cache";
/**
 * Action function to delete a squad.
 * @param id The ID of the squad to delete.
 * @returns A promise resolving to the result of the deletion operation.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function deleteSquadAction(id: number) {
  /**
   * Check whether the user is authenticated.
   * Unauthorized users are redirected to the login page.
   */
  await requireAuth();

  try {
    await NestFetch(`/api/squad/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/admin/squads");
    return { success: true, message: "Squad successfully deleted" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while deleting the squad",
    };
  }
}

/**
 *  Action function to create a new squad.
 * @param payload The data for the new squad to be created.
 * @returns A promise resolving to the result of the creation operation, including any data returned from the backend.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function createSquadAction(payload: SquadPayload) {
  try {
    /**
     * Check whether the user is authenticated.
     * Unauthorized users are redirected to the login page.
     */
    await requireAuth();
    /**
     * Forward the squad creation request to the NestJS backend.
     */
    const data = await NestFetch("/api/squad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: true, message: "Squad successfully created", data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while creating the squad",
    };
  }
}

/**
 * Action function to update an existing squad.
 * @param id The ID of the squad to update.
 * @param payload The updated data for the squad.
 * @returns A promise resolving to the result of the update operation, including any data returned from the backend.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function updateSquadAction(id: number, payload: SquadPayload) {
  try {
    /**
     * Check whether the user is authenticated.
     * Unauthorized users are redirected to the login page.
     */
    await requireAuth();

    /**
     * Forward the squad update request to the NestJS backend.
     */
    const data = await NestFetch(`/api/squad/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: true, message: "Squad successfully updated", data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while updating the squad",
    };
  }
}
