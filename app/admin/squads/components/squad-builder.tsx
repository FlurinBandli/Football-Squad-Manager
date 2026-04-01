"use client";

/**
 * SquadBuilder component for building a football squad with players and trainers.
 *
 * allows the admin to add players to different positions (striker, midfielder, defender, goalkeeper, backup) and also add trainers.
 *
 * Players can be added via a combobox that lists all players
 * Trainers can be added via a combobox that lists all trainers
 *
 */

import { Player, Trainer, Position, SquadState } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlayerCombobox from "@/app/admin/squads/components/player-combobox";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2 } from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import TrainerCombobox from "@/app/admin/squads/components/trainer-combobox";

export default function SquadBuilder({
  players,
  trainers,
  squad,
  setSquad,
}: {
  players: Player[];
  trainers: Trainer[];
  squad: SquadState;
  setSquad: Dispatch<SetStateAction<SquadState>>;
}) {
  /**
   * State variables to track whether the combobox for adding a player/trainer is open for each position.
   * When true, the corresponding combobox will be displayed to allow selection.
   */
  const [addingStriker, setAddingStriker] = useState(false);
  const [addingMidfielder, setAddingMidfielder] = useState(false);
  const [addingDefender, setAddingDefender] = useState(false);
  const [addingGoalkeeper, setAddingGoalkeeper] = useState(false);
  const [addingBackup, setAddingBackup] = useState(false);
  const [addingTrainer, setAddingTrainer] = useState(false);

  const selectedPlayerIds = squad.players.map((sp) => sp.player.id);

  const playersByPosition = (position: Position) =>
    squad.players
      .filter((sp) => sp.position === position)
      .map((sp) => sp.player);

  const addPlayerToPosition = (player: Player, position: Position) => {
    setSquad((prev) => {
      if (prev.players.some((sp) => sp.player.id === player.id)) return prev;
      return {
        ...prev,
        players: [...prev.players, { player, position }],
      };
    });
  };

  const removePlayer = (playerId: number) => {
    setSquad((prev) => ({
      ...prev,
      players: prev.players.filter((sp) => sp.player.id !== playerId),
    }));
  };

  const addTrainer = (trainer: Trainer) => {
    setSquad((prev) => {
      if (prev.trainers.some((t) => t.id === trainer.id)) return prev;
      return {
        ...prev,
        trainers: [...prev.trainers, trainer],
      };
    });
  };

  const removeTrainer = (trainerId: number) => {
    setSquad((prev) => ({
      ...prev,
      trainers: prev.trainers.filter((t) => t.id !== trainerId),
    }));
  };

  const renderPlayerSection = (
    title: string,
    position: Position,
    isAdding: boolean,
    setIsAdding: Dispatch<SetStateAction<boolean>>
  ) => (
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
        {playersByPosition(position).map((player) => (
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
                players={players.filter(
                  (p) => p.id === player.id || !selectedPlayerIds.includes(p.id)
                )}
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
              players={players.filter((p) => !selectedPlayerIds.includes(p.id))}
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

  const renderTrainerSection = (
    title: string,
    isAdding: boolean,
    setIsAdding: Dispatch<SetStateAction<boolean>>
  ) => (
    <>
      <div className="flex items-center justify-center gap-2 pt-4">
        <span className="font-semibold">{title}</span>
        <Button
          title="Trainer hinzufügen"
          type="button"
          className="cursor-pointer"
          onClick={() => setIsAdding(true)}
        >
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-2">
        {squad.trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="flex flex-col items-center text-center gap-2"
          >
            <div className="flex flex-row-reverse gap-2">
              <Button
                title="Trainer entfernen"
                type="button"
                size="icon"
                variant="destructive"
                className="cursor-pointer"
                onClick={() => removeTrainer(trainer.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <TrainerCombobox
                trainers={trainers.filter(
                  (t) =>
                    t.id === trainer.id ||
                    !squad.trainers.some((bt) => bt.id === t.id)
                )}
                value={trainer}
                onSelect={(t) => {
                  removeTrainer(trainer.id);
                  addTrainer(t);
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
            <TrainerCombobox
              trainers={trainers.filter(
                (t) => !squad.trainers.some((b) => b.id === t.id)
              )}
              onSelect={(trainer) => {
                addTrainer(trainer);
                setIsAdding(false);
              }}
            />
          </div>
        )}
      </div>{" "}
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aufstellung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4">
          {/* left side: the lineup */}
          <div className="flex flex-col gap-4 border-2 w-2/3">
            {/* striker section */}
            {renderPlayerSection(
              "Sturm",
              "Striker",
              addingStriker,
              setAddingStriker
            )}

            {/* midfielder section */}

            {renderPlayerSection(
              "Mittelfeld",
              "Midfielder",
              addingMidfielder,
              setAddingMidfielder
            )}

            {/* defender section */}

            {renderPlayerSection(
              "Verteidigung",
              "Defender",
              addingDefender,
              setAddingDefender
            )}

            {/* goalkeeper section */}

            {renderPlayerSection(
              "Torwart",
              "Goalkeeper",
              addingGoalkeeper,
              setAddingGoalkeeper
            )}
          </div>

          {/* right side the trainers and backups */}
          <div className="flex flex-col gap-4 border-2 w-1/3">
            {/* trainer section */}

            {renderTrainerSection("Trainer", addingTrainer, setAddingTrainer)}

            {/* backup section */}

            {renderPlayerSection(
              "Ersatz",
              "Backup",
              addingBackup,
              setAddingBackup
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
