/**
 * This is the main page for managing trainers in the admin panel.
 *  It checks for user authentication, fetches all trainers from the backend API,
 *  and renders the TrainersClient component to display the list of trainers.
 * If the backend is unreachable, it shows an error message.
 */

import { NestFetch } from "@/lib/nest-api";
import { Trainer } from "@/types";
import TrainersClient from "@/app/admin/trainers/components/trainers-client";

type TrainersPageProps = {
  searchParams: Promise<{ query?: string; page?: string }>;
};

export default async function Trainers({ searchParams }: TrainersPageProps) {
  // Fetch all trainers from the NestJS backend API
  let trainers: Trainer[] = [];
  try {
    trainers = await NestFetch<Trainer[]>("/api/trainer");
  } catch {
    return <div className="p-4 text-destructive">Backend nicht erreichbar</div>;
  }

  const params = await searchParams;
  const query = params.query?.toLowerCase() ?? "";
  const currentPage = Number(params.page ?? "1");
  const itemsPerPage = 8;

  const filteredTrainers = trainers.filter((trainer) =>
    `${trainer.firstName} ${trainer.lastName}`.toLowerCase().includes(query)
  );

  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);
  const paginatedTrainers = filteredTrainers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <TrainersClient
        trainers={paginatedTrainers}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
