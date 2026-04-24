"use client";

/**
 * Client-side login form component for admin authentication.
 * It uses react-hook-form for form handling and zod for validation.
 * On successful login, it redirects the user to the admin squads page.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { EyeOff, Eye, LogIn } from "lucide-react";
import Logo from "@/public/fc-zh-leutschenbach-logo.avif";

/**
 * Zod schema for validating the login form inputs.
 * It ensures that both username and password are provided.
 */

const formSchema = z.object({
  username: z.string().trim().min(1, "Benutzername ist erforderlich"),
  password: z.string().trim().min(1, "Passwort ist erforderlich"),
});

export default function LoginForm() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Initializes React Hook Form with Zod validation.
   * Default values are empty for both input fields.
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  /**
   * Handles form submission.
   * Calls NextAuth's credentials provider to authenticate the user.
   */
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoginError(null);
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    // Show error message if credentials are invalid
    if (result?.error) {
      setLoginError("Ungültige Anmeldedaten");
      return;
    }

    // Redirect authenticated users to the admin dashboard
    if (result?.ok) {
      router.push("/admin/squads");
      return;
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white shadow-lg m-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Login</CardTitle>
          <Image
            src={Logo}
            alt="Logo FC Zürich-Leutschenbach"
            width={60}
            height={60}
          />
        </CardHeader>
        <CardContent>
          {loginError && (
            <p className="text-sm mb-1 text-red-600">{loginError}</p>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Field className="mb-2">
              <FieldLabel>Benutzername</FieldLabel>
              <Input autoFocus {...form.register("username")} />
              {form.formState.errors.username && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.username.message}
                </p>
              )}
            </Field>
            <Field className="mb-4">
              <FieldLabel>Passwort</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 flex items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Passwort verstecken" : "Passwort anzeigen"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </Field>
            <Button className="w-full cursor-pointer" type="submit">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
