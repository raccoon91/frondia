import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const progressVariants = cva("overflow-hidden relative w-full rounded-full", {
  variants: {
    variant: {
      primary:
        "data-[slot=progress]:bg-primary/20 [&>div]:data-[slot=progress-indicator]:bg-primary [&>div]:data-[slot=overflow-indicator]:bg-teal-500",
      destructive:
        "data-[slot=progress]:bg-destructive/30 [&>div]:data-[slot=progress-indicator]:bg-destructive [&>div]:data-[slot=overflow-indicator]:bg-red-500",
    },
    size: {
      default: "h-3",
      sm: "h-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

function Progress({ variant = "primary", size, className, value, ...props }: ProgressProps) {
  const overflow = (value || 100) > 100;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ variant, size }), className)}
      {...props}
    >
      {overflow ? (
        <>
          <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className="w-full h-full flex-1 transition-all"
            style={{ transform: `translateX(-${100 - (100 / (value || 100)) * 100}%)` }}
          />

          <ProgressPrimitive.Indicator
            data-slot="overflow-indicator"
            className="absolute top-0 w-full h-full flex-1 transition-all"
            style={{ transform: `translateX(${(100 / (value || 100)) * 100}%)` }}
          />
        </>
      ) : (
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="w-full h-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - (value || 100)}%)` }}
        />
      )}
    </ProgressPrimitive.Root>
  );
}

export { Progress };
