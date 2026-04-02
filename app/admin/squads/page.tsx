/**
 * Admin page for managing squads.
 * Displays a list of all squads fetched from the NestJS backend API.
 * Allows navigation to view, edit or delete each squad, as well as creating a new squad.
 */

import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NestFetch } from "@/lib/nest-api";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { Squad } from "@/types";
import DeleteSquadButton from "@/app/admin/squads/components/delete-squad-button";
import { encodeSquadId } from "@/lib/hashids";
import { CirclePlus } from "lucide-react";
import IconTooltipButton from "@/app/admin/components/icon-tooltip-button";

export default async function SquadsPage() {
  // Check if the user is authenticated, if not redirect to login page
  const session = await auth();
  if (!session) redirect("/login");

  // Fetch all squads from the NestJS backend API
  let squads: Squad[] = [];
  try {
    squads = await NestFetch<Squad[]>("/api/squad");
  } catch {
    return <div className="p-4 text-destructive">Backend nicht erreichbar</div>;
  }

  return (
    <div className="p-4">
      <Button className="flex justify-center mb-4" asChild>
        <Link href="/admin/squads/new">
          {" "}
          <CirclePlus className="w-4 h-4 mr-2" /> Neues Team erstellen
        </Link>
      </Button>

      {/* Table displaying the list of squads with options to view, edit or delete each squad */}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead className="text-center">Ansehen</TableHead>
            <TableHead className="text-center">Bearbeiten</TableHead>
            <TableHead className="text-center">Löschen</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {squads.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                Keine Teams gefunden.
              </TableCell>
            </TableRow>
          ) : (
            squads.map((squad) => (
              <TableRow key={squad.id}>
                <TableCell>{squad.id}</TableCell>
                <TableCell>{squad.name}</TableCell>
                <TableCell>{squad.description}</TableCell>
                <TableCell>
                  {new Date(squad.date).toLocaleDateString("de-CH")}
                </TableCell>
                <TableCell className="text-center">
                  <IconTooltipButton
                    variant="outline"
                    tooltip="Team ansehen"
                    tooltipSide="left"
                    asChild
                  >
                    <Link
                      href={`/squad/${encodeSquadId(squad.id)}`}
                      target="_blank"
                    >
                      <Eye />
                    </Link>
                  </IconTooltipButton>
                </TableCell>
                <TableCell className="text-center">
                  <IconTooltipButton
                    variant="default"
                    tooltip="Team bearbeiten"
                    tooltipSide="left"
                    asChild
                  >
                    <Link href={`/admin/squads/${squad.id}/edit`}>
                      <Pencil />
                    </Link>
                  </IconTooltipButton>
                </TableCell>
                <TableCell className="text-center">
                  <DeleteSquadButton id={squad.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
