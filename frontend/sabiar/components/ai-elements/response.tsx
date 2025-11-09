"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type ResponseProps = ComponentProps<"div">;

export const Response = ({ className, ...props }: ResponseProps) => (
  <div className={cn("prose dark:prose-invert max-w-none", className)} {...props} />
);
