"use client";

import { Trainer } from "@/types";
import { UserPlus, Trash2 } from "lucide-react";
import TrainerCombobox from "@/app/admin/squads/components/trainer-combobox";
import IconTooltipButton from "@/app/admin/components/icon-tooltip-button";

export default function TrainerSection({
  title,
  trainersInSquad,
  availableTrainers,
  trainerActions,
  isAdding,
  setIsAdding,
}: {
  title: string;
  trainersInSquad: Trainer[];
  availableTrainers: (currentTrainerId?: number) => Trainer[];
  trainerActions: {
    add: (trainer: Trainer) => void;
    remove: (trainerId: number) => void;
    replace: (oldTrainerId: number, newTrainer: Trainer) => void;
  };
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-center gap-2 pt-4">
        <span className="font-semibold">{title}</span>
        <IconTooltipButton
          tooltip="Trainer hinzufügen"
          type="button"
          className="cursor-pointer"
          onClick={() => setIsAdding(true)}
        >
          <UserPlus className="w-4 h-4" />
        </IconTooltipButton>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-2">
        {trainersInSquad.map((trainer) => (
          <div
            key={trainer.id}
            className="flex flex-col items-center text-center gap-2"
          >
            <div className="flex flex-row-reverse gap-2">
              <IconTooltipButton
                tooltip="Trainer entfernen"
                type="button"
                size="icon"
                variant="destructive"
                className="cursor-pointer"
                onClick={() => trainerActions.remove(trainer.id)}
              >
                <Trash2 className="h-4 w-4" />
              </IconTooltipButton>
              <TrainerCombobox
                trainers={availableTrainers(trainer.id)}
                value={trainer}
                onSelect={(t) => {
                  trainerActions.replace(trainer.id, t);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        {isAdding && (
          <div className="flex flex-row-reverse gap-2">
            <IconTooltipButton
              tooltip="Hinzufügen abbrechen"
              type="button"
              size="icon"
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setIsAdding(false)}
            >
              <Trash2 className="h-4 w-4" />
            </IconTooltipButton>
            <TrainerCombobox
              trainers={availableTrainers()}
              onSelect={(trainer) => {
                trainerActions.add(trainer);
                setIsAdding(false);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
