import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { buttonVariants } from "./button";
import { cx, VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const toggleVariants = (variants: VariantProps<typeof buttonVariants>) =>
  cx(
    "data-[state=on]:translate-x-boxShadowX data-[state=on]:translate-y-boxShadowY data-[state=on]:shadow-none data-[state=on]:bg-main-muted",
    buttonVariants(variants)
  );

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof buttonVariants>) {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
