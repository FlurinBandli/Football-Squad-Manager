"use client";

/**
 * SquadForm component responsible for rendering the squad creation/editing form.
 * It includes input fields for squad information and integrates the SquadBuilder component for managing players and trainers.
 * The form uses React Hook Form with Zod for validation and submits the data to the backend API.
 */

import {
  Player,
  SquadState,
  Trainer,
  SquadPlayerInput,
  Squad,
  SquadPayload,
} from "@/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import SquadBuilder from "@/app/admin/squads/components/squad-builder";
import { useRouter } from "next/navigation";
import {
  createSquadAction,
  updateSquadAction,
} from "@/app/admin/squads/actions";
import { toast } from "sonner";

/**
 * Zod schema for validating the squad form inputs.
 * It ensures that all required fields are provided.
 */

const formSchema = z.object({
  name: z.string().trim().min(1, "Teamname ist erforderlich"),
  description: z.string().trim().min(1, "Beschreibung ist erforderlich"),
  date: z.date({
    error: "Datum ist erforderlich",
  }),
});

export default function SquadForm({
  players,
  trainers,
  mode = "create",
  initialSquad,
}: {
  players: Player[];
  trainers: Trainer[];
  mode?: "create" | "edit";
  initialSquad?: Squad;
}) {
  /**
   * Initializes React Hook Form with Zod validation.
   * Default values are empty for all input fields.
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: mode === "edit" && initialSquad ? initialSquad.name : "",
      description:
        mode === "edit" && initialSquad ? initialSquad.description : "",
      date:
        mode === "edit" && initialSquad
          ? new Date(initialSquad.date)
          : undefined,
    },
  });
  /**
   * Prefill the form and squad state in edit mode.
   */
  const mappedInitialPlayers =
    mode === "edit" && initialSquad
      ? initialSquad.squadPlayers
          .map((sp) => {
            const fullPlayer = players.find((p) => p.id === sp.player.id);
            if (!fullPlayer) return null;

            return {
              player: fullPlayer,
              position: sp.position,
            };
          })
          .filter((v): v is NonNullable<typeof v> => !!v)
      : [];

  const mappedInitialTrainers =
    mode === "edit" && initialSquad
      ? trainers.filter((t) =>
          initialSquad.trainers.some((st) => st.id === t.id)
        )
      : [];

  const [squad, setSquad] = useState<SquadState>({
    players: mappedInitialPlayers,
    trainers: mappedInitialTrainers,
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const squadPlayers: SquadPlayerInput[] = squad.players.map((sp) => ({
      player: {
        id: sp.player.id,
      },
      position: sp.position,
    }));

    const payload: SquadPayload = {
      trainers: squad.trainers.map((t) => ({ id: t.id })),
      name: data.name,
      description: data.description,
      date: data.date.toISOString(),
      squadPlayers,
    };

    const response =
      mode === "edit" && initialSquad
        ? await updateSquadAction(initialSquad.id, payload)
        : await createSquadAction(payload);

    if (!response.success) {
      toast.error(
        "Fehler beim " +
          (mode === "edit" ? "Aktualisieren" : "Erstellen") +
          " des Teams"
      );
      return;
    }
    router.push("/admin/squads");
    toast.success(
      "Team erfolgreich " + (mode === "edit" ? "aktualisiert" : "erstellt")
    );
  }

  return (
    <div className="w-full bg-slate-100 flex flex-col gap-2 p-4">
      <Card className="w-full bg-white shadow-lg ">
        <CardHeader className="flex items-center justify-center">
          <CardTitle>Team Infos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-row gap-4">
              <Field className="flex-1">
                <FieldLabel>Teamname</FieldLabel>
                <Input autoFocus {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </Field>

              <Field className="flex-3">
                <FieldLabel>Beschreibung</FieldLabel>
                <Input {...form.register("description")} />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </Field>

              <Field className="flex-1">
                <FieldLabel>Datum</FieldLabel>

                <Controller
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between cursor-pointer"
                        >
                          {field.value
                            ? format(field.value, "dd.MM.yyyy")
                            : "Datum auswählen"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {form.formState.errors.date && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </Field>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="cursor-pointer">
                {mode === "edit" ? "Team aktualisieren" : "Team erstellen"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/admin/squads")}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="w-full">
        <SquadBuilder
          players={players}
          trainers={trainers}
          squad={squad}
          setSquad={setSquad}
        />
      </div>
    </div>
  );
}
