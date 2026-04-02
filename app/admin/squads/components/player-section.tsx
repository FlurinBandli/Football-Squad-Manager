"use client";

import { Player, Position } from "@/types";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2 } from "lucide-react";
import PlayerCombobox from "@/app/admin/squads/components/player-combobox";

export default function PlayerSection({
  title,
  position,
  playersInPosition,
  availablePlayers,
  addPlayerToPosition,
  removePlayer,
  isAdding,
  setIsAdding,
}: {
  title: string;
  position: Position;
  playersInPosition: Player[];
  availablePlayers: (currentPlayerId?: number) => Player[];
  addPlayerToPosition: (player: Player, position: Position) => void;
  removePlayer: (playerId: number) => void;
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-center gap-2 pt-4">
        <span className="font-semibold">{title}</span>
        <Button
          title="Spieler hinzufügen"
          type="button"
          className="cursor-pointer"
          onClick={() => setIsAdding(true)}
        >
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-row flex-wrap justify-center gap-2">
        {playersInPosition.map((player) => (
          <div
            key={player.id}
            className="flex flex-col items-center text-center gap-2"
          >
            <div className="flex flex-row-reverse gap-2">
              <Button
                title="Spieler entfernen"
                type="button"
                size="icon"
                variant="destructive"
                className="cursor-pointer"
                onClick={() => removePlayer(player.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <PlayerCombobox
                players={availablePlayers(player.id)}
                value={player}
                onSelect={(p) => {
                  removePlayer(player.id);
                  addPlayerToPosition(p, position);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        {isAdding && (
          <div className="flex flex-row-reverse gap-2">
            <Button
              title="Hinzufügen abbrechen"
              type="button"
              size="icon"
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setIsAdding(false)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <PlayerCombobox
              players={availablePlayers()}
              onSelect={(player) => {
                addPlayerToPosition(player, position);
                setIsAdding(false);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
