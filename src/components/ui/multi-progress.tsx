import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const multiProgressVariants = cva("overflow-hidden relative w-full rounded-full", {
  variants: {
    variant: {
      primary: "data-[slot=progress]:bg-primary/20 [&>div]:data-[slot=progress-indicator]:bg-primary",
      destructive: "data-[slot=progress]:bg-destructive/30 [&>div]:data-[slot=progress-indicator]:bg-destructive",
    },
    size: {
      default: "h-3",
      sm: "h-2",
      lg: "h-4",
      xl: "h-5",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

interface MultiProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof multiProgressVariants> {
  data?: { value: number; label: string }[];
}

function MultiProgress({ variant = "primary", size, className, data, ...props }: MultiProgressProps) {
  const indicators = React.useMemo(() => {
    const result: { left: number; width: number; isLast: boolean; label: string }[] = [];

    if (!data?.length) return result;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        result.push({
          left: 0,
          width: data[i].value,
          label: data[i].label,
          isLast: data.length === 1 || i === data.length - 1,
        });
      } else {
        result.push({
          left: data[i - 1].value,
          width: data[i].value,
          label: data[i].label,
          isLast: data.length === 1 || i === data.length - 1,
        });
      }
    }

    return result;
  }, [data]);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(multiProgressVariants({ variant, size }), className)}
      {...props}
    >
      {indicators.map((indicator, index) => (
        <ProgressPrimitive.Indicator
          key={index}
          data-slot="progress-indicator"
          style={{
            left: `${indicator.left}%`,
            width: `${indicator.width}%`,
          }}
          title={indicator.label}
          className={cn("absolute h-full", indicator.isLast ? "" : "border-r border-background")}
        />
      ))}
    </ProgressPrimitive.Root>
  );
}

export { MultiProgress };
