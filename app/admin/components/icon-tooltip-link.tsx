"use client";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

export default function IconTooltipLink({
  href,
  tooltip,
  children,
  tooltipSide = "top",
  target,
  className,
  size = "icon",
  variant = "default",
  "aria-label": ariaLabel,
}: {
  href: string;
  tooltip: string;
  children: ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  target?: string;
  className?: string;
  "aria-label"?: string;
} & VariantProps<typeof buttonVariants>) {
  return (
    <TooltipProvider delayDuration={500} skipDelayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            target={target}
            className={cn(buttonVariants({ variant, size }), className)}
            aria-label={ariaLabel ?? tooltip}
          >
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
