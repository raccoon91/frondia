import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const switchVariants = cva(
  "relative peer focus-visible:ring-ring/50 inline-flex items-center rounded-full border-none shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 [&>span]:bg-background dark:[&>span]:data-[state=unchecked]:bg-foreground dark:[&>span]:data-[state=checked]:bg-primary-foreground",
        destructive:
          "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 [&>span]:bg-background dark:[&>span]:data-[state=unchecked]:bg-foreground dark:[&>span]:data-[state=checked]:bg-destructive-foreground",
      },
      size: {
        default: "h-5 w-8 shrink-0 [&>span]:size-4",
        sm: "h-4 w-7 shrink-0 [&>span]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root>, VariantProps<typeof switchVariants> {}

function Switch({ className, variant, size, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root data-slot="switch" className={cn(switchVariants({ variant, size }), className)} {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "absolute top-1/2 translate-y-[-50%] pointer-events-none block rounded-full ring-0 transition-all data-[state=unchecked]:left-[2px] data-[state=checked]:left-full data-[state=checked]:translate-x-[calc(-100%-2px)]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
