import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, Check } from "lucide-react"

import { cn } from "@/lib/utils"

const selectTriggerClasses = cva(
  "flex h-10 w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-sm text-white outline-none transition-colors focus-visible:border-cyan-400/60 focus-visible:ring-2 focus-visible:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "h-9 text-sm",
        lg: "h-11 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const selectContentClasses = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-3xl border border-[#2b2f35] bg-[#11151a] text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)]",
  {
    variants: {
      position: {
        popper: "",
        "item-aligned": "",
      },
    },
    defaultVariants: {
      position: "popper",
    },
  }
)

const selectItemClasses = cva(
  "relative flex cursor-pointer select-none items-center rounded-xl px-4 py-2 text-sm text-white outline-none transition-colors focus:bg-[#1a2028] data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-800 data-[highlighted]:text-cyan-300",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof selectTriggerClasses>
>(({ className, size, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerClasses({ size, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-white/70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(selectContentClasses({ position }), className)}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(selectItemClasses(), className)}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-3 inline-flex items-center text-cyan-400">
      <Check className="h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export { SelectTrigger, SelectContent, SelectItem }
