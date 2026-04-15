"use client";

/**
 * Component for rendering a button to delete a trainer, with a confirmation dialog.
 * When the delete button is clicked, an AlertDialog is shown to confirm the action.
 * If the user confirms, the deleteTrainerAction is called to perform the deletion,
 * and a toast notification is displayed based on the result.
 */

import { Trash2 } from "lucide-react";
import { deleteTrainerAction } from "@/app/admin/trainers/actions";
import IconTooltipButton from "@/app/admin/components/icon-tooltip-button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteTrainerButton({ id }: { id: number }) {
  const handleDelete = async () => {
    const result = await deleteTrainerAction(id);
    if (result.success) {
      toast.success("Trainer erfolgreich gelöscht");
    } else {
      toast.error("Fehler beim Löschen des Trainers");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IconTooltipButton
          tooltip="Trainer löschen"
          tooltipSide="left"
          variant="destructive"
          className="cursor-pointer"
        >
          <Trash2 />
        </IconTooltipButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Trainer wirklich löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Abbrechen
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDelete}
          >
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
