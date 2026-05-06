/*
 * Helper functions for authentication checks.
* The requireAuth function verifies if a user session exists and redirects to the login page if not authenticated.

 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session) redirect("/login");
  return session;
}
