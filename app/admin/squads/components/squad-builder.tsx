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
import PlayerSection from "@/app/admin/squads/components/player-section";
import TrainerSection from "@/app/admin/squads/components/trainer-section";
import { useState, Dispatch, SetStateAction } from "react";

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

  const [addingSections, setAddingSections] = useState({
    Striker: false,
    Midfielder: false,
    Defender: false,
    Goalkeeper: false,
    Backup: false,
    Trainer: false,
  });

  const setSectionAdding = (
    section: keyof typeof addingSections,
    value: boolean
  ) => {
    setAddingSections((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const selectedPlayerIds = squad.players.map((sp) => sp.player.id);

  const playersByPosition = (position: Position) =>
    squad.players
      .filter((sp) => sp.position === position)
      .map((sp) => sp.player);

  const playerActions = {
    add: (player: Player, position: Position) => {
      setSquad((prev) => {
        if (prev.players.some((sp) => sp.player.id === player.id)) return prev;
        return {
          ...prev,
          players: [...prev.players, { player, position }],
        };
      });
    },
    remove: (playerId: number) => {
      setSquad((prev) => ({
        ...prev,
        players: prev.players.filter((sp) => sp.player.id !== playerId),
      }));
    },
    replace: (oldPlayerId: number, newPlayer: Player, position: Position) => {
      setSquad((prev) => ({
        ...prev,
        players: prev.players.map((sp) =>
          sp.player.id === oldPlayerId ? { player: newPlayer, position } : sp
        ),
      }));
    },
  };

  const availablePlayers = (currentPlayerId?: number) =>
    players.filter((p) => {
      if (p.id === currentPlayerId) return true;
      return !selectedPlayerIds.includes(p.id);
    });

  const trainerActions = {
    add: (trainer: Trainer) => {
      setSquad((prev) => {
        if (prev.trainers.some((t) => t.id === trainer.id)) return prev;
        return {
          ...prev,
          trainers: [...prev.trainers, trainer],
        };
      });
    },

    remove: (trainerId: number) => {
      setSquad((prev) => ({
        ...prev,
        trainers: prev.trainers.filter((t) => t.id !== trainerId),
      }));
    },

    replace: (oldTrainerId: number, newTrainer: Trainer) => {
      setSquad((prev) => ({
        ...prev,
        trainers: prev.trainers.map((t) =>
          t.id === oldTrainerId ? newTrainer : t
        ),
      }));
    },
  };

  const availableTrainers = (currentTrainerId?: number) =>
    trainers.filter((t) => {
      if (t.id === currentTrainerId) return true;
      return !squad.trainers.some((st) => st.id === t.id);
    });

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
            <PlayerSection
              title="Sturm"
              position="Striker"
              playersInPosition={playersByPosition("Striker")}
              availablePlayers={availablePlayers}
              playerActions={playerActions}
              isAdding={addingSections.Striker}
              setIsAdding={(value) => setSectionAdding("Striker", value)}
            />

            {/* midfielder section */}
            <PlayerSection
              title="Mittelfeld"
              position="Midfielder"
              playersInPosition={playersByPosition("Midfielder")}
              availablePlayers={availablePlayers}
              playerActions={playerActions}
              isAdding={addingSections.Midfielder}
              setIsAdding={(value) => setSectionAdding("Midfielder", value)}
            />

            {/* defender section */}
            <PlayerSection
              title="Verteidigung"
              position="Defender"
              playersInPosition={playersByPosition("Defender")}
              availablePlayers={availablePlayers}
              playerActions={playerActions}
              isAdding={addingSections.Defender}
              setIsAdding={(value) => setSectionAdding("Defender", value)}
            />

            {/* goalkeeper section */}
            <PlayerSection
              title="Torwart"
              position="Goalkeeper"
              playersInPosition={playersByPosition("Goalkeeper")}
              availablePlayers={availablePlayers}
              playerActions={playerActions}
              isAdding={addingSections.Goalkeeper}
              setIsAdding={(value) => setSectionAdding("Goalkeeper", value)}
            />
          </div>

          {/* right side the trainers and backups */}
          <div className="flex flex-col gap-4 border-2 w-1/3">
            {/* trainer section */}
            <TrainerSection
              title="Trainer"
              trainersInSquad={squad.trainers}
              availableTrainers={availableTrainers}
              trainerActions={trainerActions}
              isAdding={addingSections.Trainer}
              setIsAdding={(value) => setSectionAdding("Trainer", value)}
            />

            {/* backup section */}
            <PlayerSection
              title="Ersatz"
              position="Backup"
              playersInPosition={playersByPosition("Backup")}
              availablePlayers={availablePlayers}
              playerActions={playerActions}
              isAdding={addingSections.Backup}
              setIsAdding={(value) => setSectionAdding("Backup", value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
