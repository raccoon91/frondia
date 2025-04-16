import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const multiProgressVariants = cva("overflow-hidden relative w-full rounded-full", {
  variants: {
    variant: {
      primary: "data-[slot=progress]:bg-primary/20 [&>div]:data-[slot=progress-indicator]:bg-primary",
      destructive: "data-[slot=progress]:bg-destructive/30 [&>div]:data-[slot=progress-indicator]:bg-destructive",
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

interface MultiProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof multiProgressVariants> {
  values?: number[];
}

function MultiProgress({ variant = "primary", size, className, values, ...props }: MultiProgressProps) {
  const indicators = React.useMemo(() => {
    const result: { left: number; width: number; isLast: boolean }[] = [];

    if (!values?.length) return result;

    for (let i = 0; i < values.length; i++) {
      if (i === 0) {
        result.push({
          left: 0,
          width: values[i],
          isLast: values.length === 1 || i === values.length - 1,
        });
      } else {
        result.push({
          left: values[i - 1],
          width: values[i],
          isLast: values.length === 1 || i === values.length - 1,
        });
      }
    }

    return result;
  }, [values]);

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
          className={cn("absolute h-full", indicator.isLast ? "" : "border-r border-background")}
        />
      ))}
    </ProgressPrimitive.Root>
  );
}

export { MultiProgress };
