"use client";

/**
 * TrainerCombobox component used for selecting a trainer.
 *
 * Displays a searchable combobox listing all available trainers.
 * When a trainer is selected, the selected trainer object
 * is returned to the parent component via the onSelect callback.
 */
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxList,
  ComboboxInput,
} from "@/components/ui/combobox";
import { Trainer } from "@/types";

export default function TrainerCombobox({
  trainers,
  value,
  onSelect,
}: {
  trainers: Trainer[];
  value?: Trainer;
  onSelect: (trainer: Trainer) => void;
}) {
  return (
    <div className="w-44">
      <Combobox
        items={trainers}
        value={value}
        onValueChange={(trainer) => trainer && onSelect(trainer)}
        /**
         * Defines how trainers are displayed as text in the combobox input.
         */
        itemToStringLabel={(trainer: Trainer) =>
          `${trainer.firstName} ${trainer.lastName}`
        }
        itemToStringValue={(trainer: Trainer) => String(trainer.id)}
      >
        <ComboboxInput placeholder="Trainer auswählen" />
        <ComboboxContent>
          <ComboboxEmpty>Keine Trainer gefunden</ComboboxEmpty>
          <ComboboxList>
            {(trainer: Trainer) => (
              <ComboboxItem
                key={trainer.id}
                value={trainer}
                /**
                 * When a trainer is clicked, pass the trainer object
                 * to the parent component.
                 */
              >
                {trainer.firstName} {trainer.lastName}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
