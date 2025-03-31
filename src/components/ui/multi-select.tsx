import React, { forwardRef, KeyboardEvent, useEffect, useMemo } from "react";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Separator } from "./separator";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";

const multiSelectVariants = cva("mx-1", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options?: MultiSelectOption[];
  defaultValues?: string[];
  values?: string[];
  placeholder?: string;
  maxCount?: number;
  className?: string;
  onSelectValue?: (values: string[]) => void;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      variant,
      options = [],
      defaultValues = [],
      values = [],
      placeholder = "Select options",
      maxCount = 3,
      className,
      onSelectValue,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValues);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const selectedOptions = useMemo(
      () => options.filter((option) => selectedValues.includes(option.value)),
      [selectedValues, options],
    );

    useEffect(() => {
      if (!values.length) return;

      setSelectedValues(values);
    }, [values]);

    const handleChangeKeyword = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];

        newSelectedValues.pop();

        setSelectedValues(newSelectedValues);
        onSelectValue?.(newSelectedValues);
      }
    };

    const handleOpen = () => {
      setIsPopoverOpen(true);
    };

    const handleClose = () => {
      setIsPopoverOpen(false);
    };

    const handleSelectValue = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((selectedValue) => selectedValue !== value)
        : [...selectedValues, value];

      setSelectedValues(newSelectedValues);
      onSelectValue?.(newSelectedValues);
    };

    const handleSelectAll = () => {
      const allValues = options.map((option) => option.value);

      setSelectedValues(allValues);
      onSelectValue?.(allValues);
    };

    const handleClear = (value: string) => {
      const newSelectedValues = selectedValues.filter((selectedValue) => selectedValue !== value);

      setSelectedValues(newSelectedValues);
      onSelectValue?.(newSelectedValues);
    };

    const handleClearAll = () => {
      setSelectedValues([]);
      onSelectValue?.([]);
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={true}>
        <MultiSelectTrigger
          ref={ref}
          variant={variant}
          placeholder={placeholder}
          maxCount={maxCount}
          className={className}
          selectedOptions={selectedOptions}
          onOpen={handleOpen}
          onClear={handleClear}
          onClearAll={handleClearAll}
          {...props}
        />

        <MultiSelectContent
          selectedValues={selectedValues}
          options={options}
          onChangeKeyword={handleChangeKeyword}
          onClose={handleClose}
          onSelect={handleSelectValue}
          onSelectAll={handleSelectAll}
          onClear={handleClear}
          onClearAll={handleClearAll}
        />
      </Popover>
    );
  },
);

interface MultiSelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  selectedOptions: MultiSelectOption[];
  placeholder?: string;
  maxCount?: number;
  className?: string;
  onOpen: () => void;
  onClear: (value: string) => void;
  onClearAll: () => void;
}

const MultiSelectTrigger = forwardRef<HTMLButtonElement, MultiSelectTriggerProps>(
  (
    { selectedOptions = [], variant, maxCount = 3, placeholder, className, onOpen, onClear, onClearAll, ...props },
    ref,
  ) => {
    return (
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          onClick={onOpen}
          variant="outline"
          className={cn("overflow-hidden relative gap-0 w-full p-0", className)}
          {...props}
        >
          <div className="overflow-hidden flex flex-1 items-center">
            {!selectedOptions.length && (
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
              </div>
            )}

            {selectedOptions.slice(0, maxCount).map((option) => (
              <Badge key={option.value} className={cn(multiSelectVariants({ variant }))}>
                {option.label}
              </Badge>
            ))}
          </div>

          {selectedOptions.length > 0 && (
            <div className="flex items-center justify-center ml-2">
              <Badge variant="secondary" className={cn(multiSelectVariants({ variant: "secondary" }))}>
                {`${selectedOptions.length} option`}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-center w-8 h-8 mr-1 bg-inherit">
            <ChevronDown className="h-4 text-muted-foreground opacity-50" />
          </div>

          {selectedOptions.length > 0 ? (
            <div
              className="absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 mr-1 bg-inherit z-1 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                onClearAll();
              }}
            >
              <XIcon className="h-4 text-muted-foreground" />
            </div>
          ) : null}
        </Button>
      </PopoverTrigger>
    );
  },
);

interface MultiSelectContentProps {
  options?: MultiSelectOption[];
  selectedValues?: string[];
  onClose: () => void;
  onChangeKeyword: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (value: string) => void;
  onSelectAll: () => void;
  onClear: (value: string) => void;
  onClearAll: () => void;
}

function MultiSelectContent({
  options = [],
  selectedValues = [],
  onClose,
  onChangeKeyword,
  onSelect,
  onSelectAll,
  onClear,
  onClearAll,
}: MultiSelectContentProps) {
  const handleToggle = (option: MultiSelectOption) => () => {
    if (selectedValues.includes(option.value)) {
      onClear(option.value);
    } else {
      onSelect(option.value);
    }
  };

  return (
    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" onEscapeKeyDown={onClose}>
      <Command>
        <CommandInput placeholder="Search" onKeyDown={onChangeKeyword} />

        <CommandGroup>
          <CommandItem onSelect={onSelectAll} className="flex-1 h-9 justify-center border cursor-pointer">
            Select All
          </CommandItem>
        </CommandGroup>

        <CommandList className="max-h-[200px]">
          <CommandEmpty>No results found</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={handleToggle(option)}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-input",
                      isSelected ? "bg-primary border-primary" : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <CheckIcon className="h-4 w-4 text-primary-foreground" />
                  </div>

                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>

        <Separator />

        <div className="flex items-center justify-between p-1">
          <Button variant="ghost" className="flex-1" onClick={onClearAll}>
            Clear
          </Button>
          <Separator orientation="vertical" className="min-h-6 h-full mx-1" />
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </Command>
    </PopoverContent>
  );
}

export { MultiSelect };
