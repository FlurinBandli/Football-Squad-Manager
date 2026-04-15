"use client";

/**
 * PlayersClient component responsible for rendering the list of players in the admin panel.
 * It displays a table of players with options to edit or delete each player.
 * The component also includes a button to create a new player, which opens the PlayerForm component.
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil } from "lucide-react";
import { Player } from "@/types";
import DeletePlayerButton from "@/app/admin/players/components/delete-player-button";
import PlayerForm from "@/app/admin/players/components/player-form";
import { useState } from "react";
import { Gender } from "@/types";
import IconTooltipButton from "@/app/admin/components/icon-tooltip-button";
import AdminSearchInput from "@/app/admin/components/admin-search-input";
import AdminPagination from "@/app/admin/components/admin-pagination";

export default function PlayersClient({
  players,
  totalPages,
  currentPage,
}: {
  players: Player[];
  totalPages: number;
  currentPage: number;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(
    undefined
  );

  const genderMap: Record<Gender, string> = {
    Male: "Männlich",
    Female: "Weiblich",
    Other: "Divers",
  };

  function handleCreate() {
    setMode("create");
    setSelectedPlayer(undefined);
    setOpen(true);
  }

  function handleEdit(player: Player) {
    setMode("edit");
    setSelectedPlayer(player);
    setOpen(true);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <AdminSearchInput placeholder="Nach Spielernamen suchen..." />
        <Button className="w-fit cursor-pointer" onClick={handleCreate}>
          <CirclePlus className="w-4 h-4 mr-2" />
          Neuen Spieler erstellen
        </Button>
      </div>

      {/* Table displaying the list of players with options to edit or delete each player */}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Vorname</TableHead>
            <TableHead>Nachname</TableHead>
            <TableHead>Geschlecht</TableHead>
            <TableHead>Bearbeiten</TableHead>
            <TableHead>Löschen</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {players.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                Keine Spieler gefunden.
              </TableCell>
            </TableRow>
          ) : (
            players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.firstName}</TableCell>
                <TableCell>{player.lastName}</TableCell>
                <TableCell>{genderMap[player.gender]}</TableCell>

                <TableCell>
                  <IconTooltipButton
                    tooltip="Spieler bearbeiten"
                    tooltipSide="left"
                    type="button"
                    className="cursor-pointer"
                    onClick={() => handleEdit(player)}
                  >
                    <Pencil />
                  </IconTooltipButton>
                </TableCell>
                <TableCell>
                  <DeletePlayerButton id={player.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PlayerForm
        open={open}
        setOpen={setOpen}
        player={selectedPlayer}
        mode={mode}
      />
      <AdminPagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
