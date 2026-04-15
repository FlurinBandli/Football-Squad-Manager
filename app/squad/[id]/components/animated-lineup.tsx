"use client";

import { Position, SquadResponse } from "@/types";
import CopyLinkButton from "@/app/squad/[id]/components/copy-link-button";
import { UserRound } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export default function AnimatedLineup({
  squad,
  formattedDate,
  fieldPositions,
  backups,
}: {
  squad: SquadResponse;
  formattedDate: string;
  fieldPositions: { key: Position; label: string }[];
  backups: SquadResponse["squadPlayers"];
}) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        staggerDirection: -1,
      },
    },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="m-3">
        <h1 className="text-3xl font-semibold">{squad.name}</h1>
        <p className="text-lg text-muted-foreground">{formattedDate}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div
          className="lg:w-3/4 bg-cover bg-no-repeat bg-center p-4 md:p-5 lg:p-6 min-h-165 rounded-2xl flex flex-col"
          style={{
            backgroundImage: "url(/football_pitch.avif)",
          }}
        >
          <motion.div
            className="flex flex-1 flex-col justify-between py-6"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {fieldPositions.map((position) => {
              // Filter the squad players based on their position to display them in the correct area of the football pitch
              const players = squad.squadPlayers.filter(
                (sp) => sp.position === position.key
              );
              return (
                <motion.div
                  key={position.key}
                  variants={rowVariants}
                  className="flex flex-col items-center"
                >
                  <span
                    className="flex justify-center text-xl lg:text-2xl font-semibold text-white  tracking-wide pb-2"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {position.label}
                  </span>
                  <div className="flex flex-row flex-wrap gap-2 md:gap-3 lg:gap-4 justify-evenly w-full ">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex flex-col items-center gap-2 text-sm lg:text-base rounded-full bg-black/40 text-white backdrop-blur-sm px-3 py-2"
                      >
                        <UserRound className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                        <span>
                          {player.player.firstName} {player.player.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="lg:w-1/4 rounded-2xl border bg-muted/30 p-5 flex flex-col gap-8">
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
