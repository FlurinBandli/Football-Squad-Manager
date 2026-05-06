/**
 * This is the main page for managing players in the admin panel.
 *  It checks for user authentication, fetches all players from the backend API,
 *  and renders the PlayersClient component to display the list of players.
 * If the backend is unreachable, it shows an error message.
 */

import { NestFetch } from "@/lib/nest-api";
import { Player } from "@/types";
import PlayersClient from "@/app/admin/players/components/players-client";

type PlayersPageProps = {
  searchParams: Promise<{ query?: string; page?: string }>;
};

export default async function Players({ searchParams }: PlayersPageProps) {
  // Fetch all players from the NestJS backend API
  let players: Player[] = [];
  try {
    players = await NestFetch<Player[]>("/api/player");
  } catch {
    return <div className="p-4 text-destructive">Backend nicht erreichbar</div>;
  }

  const params = await searchParams;
  const query = params.query?.toLowerCase() ?? "";
  const currentPage = Number(params.page ?? "1");
  const itemsPerPage = 8;

  const filteredPlayers = players.filter((player) =>
    `${player.firstName} ${player.lastName}`.toLowerCase().includes(query)
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <PlayersClient
        players={paginatedPlayers}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
