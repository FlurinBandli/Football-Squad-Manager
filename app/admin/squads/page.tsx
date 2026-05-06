/**
 * Admin page for managing squads.
 * Displays a list of all squads fetched from the NestJS backend API.
 * Allows navigation to view, edit or delete each squad, as well as creating a new squad.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NestFetch } from "@/lib/nest-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { Squad } from "@/types";
import DeleteSquadButton from "@/app/admin/squads/components/delete-squad-button";
import { encodeSquadId } from "@/lib/hashids";
import { CirclePlus } from "lucide-react";
import IconTooltipLink from "@/app/admin/components/icon-tooltip-link";
import AdminSearchInput from "@/app/admin/components/admin-search-input";
import AdminPagination from "@/app/admin/components/admin-pagination";

type SquadsPageProps = {
  searchParams: Promise<{ query?: string; page?: string }>;
};

export default async function SquadsPage({ searchParams }: SquadsPageProps) {
  // Fetch all squads from the NestJS backend API
  let squads: Squad[] = [];
  try {
    squads = await NestFetch<Squad[]>("/api/squad");
  } catch {
    return <div className="p-4 text-destructive">Backend nicht erreichbar</div>;
  }

  const params = await searchParams;
  const query = params.query?.toLowerCase() ?? "";
  const currentPage = Number(params.page ?? "1");
  const itemsPerPage = 8;

  const filteredSquads = squads.filter((squad) =>
    squad.name.toLowerCase().includes(query)
  );

  const totalPages = Math.ceil(filteredSquads.length / itemsPerPage);

  const paginatedSquads = filteredSquads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <AdminSearchInput placeholder="Suchen..." />
        <Button asChild className="w-fit cursor-pointer">
          <Link href="/admin/squads/new">
            <CirclePlus className="w-4 h-4 mr-2" /> Neues Team erstellen
          </Link>
        </Button>
      </div>

      {/* Table displaying the list of squads with options to view, edit or delete each squad */}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden lg:table-cell">Beschreibung</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead className="text-center">Aktionen</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredSquads.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                Keine Teams gefunden.
              </TableCell>
            </TableRow>
          ) : (
            paginatedSquads.map((squad) => (
              <TableRow key={squad.id}>
                <TableCell className="hidden md:table-cell">
                  {squad.id}
                </TableCell>

                <TableCell>{squad.name}</TableCell>

                <TableCell className="hidden lg:table-cell">
                  {squad.description}
                </TableCell>

                <TableCell>
                  {new Intl.DateTimeFormat("de-CH", {
                    timeZone: "Europe/Zurich",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(squad.date))}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5 md:gap-3">
                    <IconTooltipLink
                      href={`/squad/${encodeSquadId(squad.id)}`}
                      target="_blank"
                      variant="outline"
                      tooltip="Team ansehen"
                      tooltipSide="left"
                    >
                      <Eye />
                    </IconTooltipLink>

                    <IconTooltipLink
                      href={`/admin/squads/${squad.id}/edit`}
                      variant="default"
                      tooltip="Team bearbeiten"
                      tooltipSide="left"
                    >
                      <Pencil />
                    </IconTooltipLink>

                    <DeleteSquadButton id={squad.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AdminPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
