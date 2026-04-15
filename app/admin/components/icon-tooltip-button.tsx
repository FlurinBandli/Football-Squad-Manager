import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ReactNode, ComponentProps } from "react";

export default function IconTooltipButton({
  tooltip,
  children,
  tooltipSide = "top",
  ...props
}: {
  tooltip: string;
  children: ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
} & ComponentProps<typeof Button>) {
  return (
    <TooltipProvider delayDuration={500} skipDelayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
