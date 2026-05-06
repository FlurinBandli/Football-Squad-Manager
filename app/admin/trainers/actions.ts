"use server";

/** Action functions for managing trainers in the admin panel.
 * These functions handle creating, updating, and deleting trainers by communicating with the NestJS backend API.
 * Each function checks for user authentication, performs the necessary API calls, and handles success or error responses accordingly.
 * The deleteTrainerAction function also triggers a revalidation of the trainers page to reflect changes immediately.
 */

import { requireAuth } from "@/lib/auth-helpers";
import { NestFetch } from "@/lib/nest-api";
import { TrainerPayload } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Action function to delete a trainer.
 * @param id The ID of the trainer to delete.
 * @returns A promise resolving to the result of the deletion operation.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function deleteTrainerAction(id: number) {
  /**
   * Check whether the user is authenticated.
   * Unauthorized users are redirected to the login page.
   */
  await requireAuth();

  try {
    await NestFetch(`/api/trainer/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/admin/trainers");
    return { success: true, message: "Trainer successfully deleted" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while deleting the trainer",
    };
  }
}

/**
 * Action function to create a new trainer.
 * @param payload The data for the new trainer to be created.
 * @returns A promise resolving to the result of the creation operation, including any data returned from the backend.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function createTrainerAction(payload: TrainerPayload) {
  try {
    /**
     * Check whether the user is authenticated.
     * Unauthorized users are redirected to the login page.
     */
    await requireAuth();

    /**
     * Forward the trainer creation request to the NestJS backend.
     */
    const data = await NestFetch("/api/trainer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: true, message: "Trainer successfully created", data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while creating the trainer",
    };
  }
}

/**
 * Action function to update an existing trainer.
 * @param id The ID of the trainer to update.
 * @param payload The updated data for the trainer.
 * @returns A promise resolving to the result of the update operation, including any data returned from the backend.
 * @throws Redirects to the login page if the user is not authenticated.
 */
export async function updateTrainerAction(id: number, payload: TrainerPayload) {
  try {
    /**
     * Check whether the user is authenticated.
     * Unauthorized users are redirected to the login page.
     */
    await requireAuth();

    /**
     * Forward the trainer update request to the NestJS backend.
     */
    const data = await NestFetch(`/api/trainer/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: true, message: "Trainer successfully updated", data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while updating the trainer",
    };
  }
}
