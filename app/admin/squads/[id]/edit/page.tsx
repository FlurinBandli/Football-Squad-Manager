/**
 * Server component for editing a squad. It fetches the list of players and trainers from the backend and renders the SquadForm component.
 * If the backend cannot be reached, a fallback error is displayed.
 */

import { NestFetch } from "@/lib/nest-api";
import { Player, Trainer, Squad } from "@/types";
import SquadForm from "@/app/admin/squads/components/squad-form";

export default async function EditSquad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /**
   * Fetch available players from the backend.
   * These will later be selectable inside the squad builder.
   */
  let players: Player[] = [];
  try {
    players = await NestFetch<Player[]>("/api/player");
  } catch {
    return <div className="p-4 text-destructive">Backend nicht erreichbar</div>;
  }

  /**
   * Fetch available trainers from the backend.
   * These can be assigned to the squad.
   */
  let trainers: Trainer[] = [];
  try {
    trainers = await NestFetch<Trainer[]>("/api/trainer");
  } catch {
    return <div className="p-4 text-destructive">Backend nicht erreichbar</div>;
  }

  let squad: Squad;
  try {
    squad = await NestFetch<Squad>(`/api/squad/${id}`);
  } catch {
    return <div className="p-4 text-destructive">Backend nicht erreichbar</div>;
  }

  /**
   * Render the squad creation form with the fetched data.
   */
  return (
    <SquadForm
      players={players}
      trainers={trainers}
      mode="edit"
      initialSquad={squad}
    />
  );
}
