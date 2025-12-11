import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "info" | "warning" | "success";
};

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  info: "bg-primary/15 text-primary border-primary/30",
  warning: "bg-secondary/20 text-secondary-foreground border-secondary/40",
  success: "bg-accent/20 text-accent border-accent/40",
};

export function Badge({
  className,
  tone = "info",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
