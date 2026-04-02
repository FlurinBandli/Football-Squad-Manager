"use client";

/**
 * PlayerCombobox component used for selecting a player.
 *
 * Displays a searchable combobox listing all available players.
 * When a player is selected, the selected player object
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
import { Player } from "@/types";

export default function PlayerCombobox({
  players,
  value,
  onSelect,
}: {
  players: Player[];
  value?: Player;
  onSelect: (player: Player) => void;
}) {
  return (
    <div className="w-44">
      <Combobox
        items={players}
        value={value}
        onValueChange={(player) => {
          if (player && typeof player !== "string") {
            onSelect(player);
          }
        }}
        /**
         * Defines how players are displayed as text in the combobox input.
         */
        itemToStringLabel={(player: Player) =>
          `${player.firstName} ${player.lastName}`
        }
        itemToStringValue={(player: Player) => String(player.id)}
      >
        <ComboboxInput placeholder="Spieler auswählen" />
        <ComboboxContent>
          <ComboboxEmpty>Keine Spieler gefunden</ComboboxEmpty>
          <ComboboxList>
            {(player: Player) => (
              <ComboboxItem
                key={player.id}
                value={player}
                /**
                 * When a player is clicked, pass the player object
                 * to the parent component.
                 */
              >
                {player.firstName} {player.lastName}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
