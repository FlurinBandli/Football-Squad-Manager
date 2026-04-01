/**
 * ViewSquad component responsible for displaying the details of a squad, including its name, date, players, trainers, and backup players.
 * It fetches the squad data from the backend API using the squad ID obtained from the URL parameters.
 * The component also includes a CopyLinkButton to allow users to easily copy the current page URL to share the squad details.
 */

import { Position, SquadResponse } from "@/types";
import CopyLinkButton from "@/app/squad/[id]/components/copy-link-button";
import { UserRound } from "lucide-react";
import { decodeSquadId } from "@/lib/hashids";

export default async function ViewSquad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Decode the hashid from the URL to obtain the actual database ID
  const decodedId = decodeSquadId(id);

  let squad: SquadResponse;

  try {
    // Fetch the squad data from the NestJS backend API
    const response = await fetch(
      `${process.env.NEST_API_URL}/api/squad/${decodedId}`
    );
    squad = await response.json();
  } catch {
    // If the API call fails, display an error message to the user
    return <div className="p-4 text-destructive">Backend nicht erreichbar</div>;
  }

  // Define the positions to be displayed on the football pitch with their corresponding labels
  const fieldPositions: { key: Position; label: string }[] = [
    { key: "Striker", label: "Sturm" },
    { key: "Midfielder", label: "Mittelfeld" },
    { key: "Defender", label: "Verteidigung" },
    { key: "Goalkeeper", label: "Torwart" },
  ];

  // Filter out the backup players from the squad to display them separately
  const backups = squad.squadPlayers.filter((sp) => sp.position === "Backup");

  // Format the squad date into Swiss date format
  const formattedDate = new Date(squad.date).toLocaleDateString("de-CH");

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="m-3">
        <h1 className="text-3xl font-semibold">{squad.name}</h1>
        <p className="text-lg text-muted-foreground">{formattedDate}</p>
      </div>

      <div className="flex gap-5">
        <div
          className="w-3/4 bg-cover bg-no-repeat bg-center p-6 min-h-165 rounded-2xl"
          style={{
            backgroundImage: "url(/football_pitch.avif)",
          }}
        >
          <div className="flex flex-col justify-between py-9 h-full">
            {fieldPositions.map((position) => {
              // Filter the squad players based on their position to display them in the correct area of the football pitch
              const players = squad.squadPlayers.filter(
                (sp) => sp.position === position.key
              );
              return (
                <div key={position.key}>
                  <span
                    className="flex justify-center text-2xl font-semibold text-white  tracking-wide pb-2"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {position.label}
                  </span>
                  <div className="flex flex-row flex-wrap gap-4 justify-evenly w-full ">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex flex-col items-center gap-2 rounded-full bg-black/40 text-white backdrop-blur-sm px-3 py-2"
                      >
                        <UserRound size={24} />
                        <span>
                          {player.player.firstName} {player.player.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-1/4 rounded-2xl border bg-muted/30 p-5 flex flex-col gap-8">
          <div>
            <p className="font-semibold text-2xl">Trainer</p>
            {squad.trainers.map((trainer) => (
              <div key={trainer.id}>
                {trainer.firstName} {trainer.lastName}
              </div>
            ))}
          </div>
          <div>
            <p className="font-semibold text-2xl">Ersatz</p>
            {backups.map((sp) => (
              <div key={sp.id}>
                {sp.player.firstName} {sp.player.lastName}
              </div>
            ))}
          </div>
          <CopyLinkButton />
        </div>
      </div>
    </main>
  );
}
