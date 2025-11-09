"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type ActionsProps = ComponentProps<"div">;

export const Actions = ({ className, ...props }: ActionsProps) => (
  <div className={cn("flex items-center gap-2", className)} {...props} />
);

export type ActionProps = ComponentProps<typeof Button> & {
  label?: string;
};

export const Action = ({ className, label, children, ...props }: ActionProps) => (
  <Button
    variant="ghost"
    size="sm"
    className={cn("h-8 gap-2", className)}
    {...props}
  >
    {children}
    {label && <span className="sr-only">{label}</span>}
  </Button>
);
