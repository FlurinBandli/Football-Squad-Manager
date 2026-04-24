/**
 * Home page component that checks for user authentication and redirects accordingly.
 * If a session exists, the user is redirected to the admin squads page.
 * If no session exists, the user stays on the home page.
 */

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Image from "next/image";
import Logo from "@/public/fc-zh-leutschenbach-logo.avif";

export default async function HomePage() {
  const session = await auth();
  if (session) {
    redirect("/admin/squads");
  }
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-4">
      <p className="font-semibold text-2xl">
        Willkommen bei der Squad-App vom FC Zürich-Leutschenbach
      </p>
      <Image
        src={Logo}
        alt="Logo FC Zürich-Leutschenbach"
        width={200}
        height={200}
      />
    </main>
  );
}
