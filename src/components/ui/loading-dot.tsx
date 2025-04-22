import { type VariantProps, cva } from "class-variance-authority";
import type { FC } from "react";

import { cn } from "@/lib/utils";

const dotVariants = cva("rounded-full animate-bounce", {
  variants: {
    variant: {
      default: "bg-background",
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
    size: {
      default: "size-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface LoadingDotProps extends VariantProps<typeof dotVariants> {
  gap?: string;
}

export const LoadingDot: FC<LoadingDotProps> = ({ gap = "gap-1", variant, size }) => {
  return (
    <div className={cn("flex justify-center items-center dark:invert", gap)}>
      <div className={cn(dotVariants({ variant, size }), "[animation-delay:-0.3s]")} />
      <div className={cn(dotVariants({ variant, size }), "[animation-delay:-0.15s]")} />
      <div className={cn(dotVariants({ variant, size }))} />
    </div>
  );
};
