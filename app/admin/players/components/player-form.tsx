"use client";

/**
 * PlayerForm component responsible for creating and editing players.
 * It renders a form inside a shadcn/ui Sheet component and uses React Hook Form with Zod validation.
 * Depending on the mode it calls either createPlayerAction or updatePlayerAction.
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Player } from "@/types";
import {
  createPlayerAction,
  updatePlayerAction,
} from "@/app/admin/players/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  firstName: z.string().trim().min(1, "Vorname ist erforderlich"),
  lastName: z.string().trim().min(1, "Nachname ist erforderlich"),
  gender: z.enum(["Male", "Female", "Other"]),
});

/**
 * PlayerForm component for creating and editing players.
 */
export default function PlayerForm({
  open,
  setOpen,
  mode = "create",
  player,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  player?: Player;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "Other",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        firstName: mode === "edit" && player ? player.firstName : "",
        lastName: mode === "edit" && player ? player.lastName : "",
        gender: mode === "edit" && player ? player.gender : "Other",
      });
    }
  }, [open, mode, player, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
    };
    const response =
      mode === "edit" && player
        ? await updatePlayerAction(player.id, payload)
        : await createPlayerAction(payload);

    if (!response.success) {
      toast.error(
        "Fehler beim " +
          (mode === "edit" ? "Aktualisieren" : "Erstellen") +
          " des Spielers: "
      );
      return;
    }
    setOpen(false);
    router.refresh();
    {
      toast.success(
        "Spieler erfolgreich " + (mode === "edit" ? "aktualisiert" : "erstellt")
      );
    }
  }

  const router = useRouter();

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {mode === "edit" ? "Spieler bearbeiten" : "Spieler erstellen"}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <Field className="mb-2">
              <FieldLabel>Vorname</FieldLabel>
              <Input autoFocus {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </Field>

            <Field className="mb-4">
              <FieldLabel>Nachname</FieldLabel>
              <Input {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </Field>

            <Field className="mb-4">
              <FieldLabel>Geschlecht</FieldLabel>

              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex w-full gap-4"
                  >
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="Male"
                        id="male"
                        className="cursor-pointer"
                      />
                      <Label htmlFor="male" className="cursor-pointer">
                        Männlich
                      </Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="Female"
                        id="female"
                        className="cursor-pointer"
                      />
                      <Label htmlFor="female" className="cursor-pointer">
                        Weiblich
                      </Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="Other"
                        id="other"
                        className="cursor-pointer"
                      />
                      <Label htmlFor="other" className="cursor-pointer">
                        Divers
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </Field>

            <SheetFooter>
              <Button
                type="submit"
                className="cursor-pointer"
                aria-label="Spieler speichern"
              >
                Speichern
              </Button>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  aria-label="Bearbeitung abbrechen"
                >
                  Abbrechen
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
