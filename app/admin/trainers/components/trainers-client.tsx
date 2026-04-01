"use client";

/**
 * TrainersClient component responsible for rendering the list of trainers in the admin panel.
 * It displays a table of trainers with options to edit or delete each trainer.
 * The component also includes a button to create a new trainer, which opens the TrainerForm component.
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil } from "lucide-react";
import { Trainer } from "@/types";
import DeleteTrainerButton from "@/app/admin/trainers/components/delete-trainer-button";
import { useState } from "react";
import TrainerForm from "@/app/admin/trainers/components/trainer-form";
import { Gender } from "@/types";

export default function TrainersClient({ trainers }: { trainers: Trainer[] }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | undefined>(
    undefined
  );
  const genderMap: Record<Gender, string> = {
    Male: "Männlich",
    Female: "Weiblich",
    Other: "Divers",
  };

  // Handler function to open the TrainerForm in create mode
  function handleCreate() {
    setMode("create");
    setSelectedTrainer(undefined);
    setOpen(true);
  }

  // Handler function to open the TrainerForm in edit mode with the selected trainer's data
  function handleEdit(trainer: Trainer) {
    setMode("edit");
    setSelectedTrainer(trainer);
    setOpen(true);
  }

  return (
    <div>
      <Button
        className="flex justify-center w-full mb-4 cursor-pointer"
        onClick={handleCreate}
      >
        <CirclePlus className="w-4 h-4 mr-2" />
        Neuen Trainer erstellen
      </Button>

      {/* Table displaying the list of trainers with options to edit or delete each trainer */}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Vorname</TableHead>
            <TableHead>Nachname</TableHead>
            <TableHead>Geschlecht</TableHead>
            <TableHead>Bearbeiten</TableHead>
            <TableHead>Löschen</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {trainers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                Keine Trainer gefunden.
              </TableCell>
            </TableRow>
          ) : (
            trainers.map((trainer) => (
              <TableRow key={trainer.id}>
                <TableCell>{trainer.firstName}</TableCell>
                <TableCell>{trainer.lastName}</TableCell>
                <TableCell>{genderMap[trainer.gender]}</TableCell>

                <TableCell>
                  <Button
                    title="Trainer bearbeiten"
                    type="button"
                    className="cursor-pointer"
                    onClick={() => handleEdit(trainer)}
                  >
                    <Pencil />
                  </Button>
                </TableCell>
                <TableCell>
                  <DeleteTrainerButton id={trainer.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TrainerForm
        open={open}
        setOpen={setOpen}
        trainer={selectedTrainer}
        mode={mode}
      />
    </div>
  );
}
