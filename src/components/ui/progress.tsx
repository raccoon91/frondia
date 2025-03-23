import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const progressVariants = cva("overflow-hidden relative w-full rounded-full", {
  variants: {
    variant: {
      primary: "bg-primary/20 [&>div]:bg-primary",
      success: "bg-sky-200 [&>div]:bg-sky-500",
      failure: "bg-destructive/30 [&>div]:bg-destructive",
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
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ variant, size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all"
        style={{
          transform: variant === "failure" ? `translateX(${value}%)` : `translateX(-${100 - (value || 0)}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
