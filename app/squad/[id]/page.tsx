/**
 * ViewSquad component responsible for displaying the details of a squad, including its name, date, players, trainers, and backup players.
 * It fetches the squad data from the backend API using the squad ID obtained from the URL parameters.
 * The component also includes a CopyLinkButton to allow users to easily copy the current page URL to share the squad details.
 */

import { Position, SquadResponse } from "@/types";
import { decodeSquadId } from "@/lib/hashids";
import AnimatedLineup from "@/app/squad/[id]/components/animated-lineup";

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
    <AnimatedLineup
      squad={squad}
      fieldPositions={fieldPositions}
      backups={backups}
      formattedDate={formattedDate}
    />
  );
}
