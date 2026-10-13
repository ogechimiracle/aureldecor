import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-ivory hover:bg-terracotta",
        accent: "bg-terracotta text-white hover:bg-terracotta-dark",
        outline:
          "border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-ivory",
        lightOutline:
          "border border-white/50 text-white hover:bg-white hover:text-ink",
        ghost: "text-ink hover:bg-sand/70",
        link: "text-ink underline-offset-4 hover:text-terracotta hover:underline px-0",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-11 px-6",
        lg: "h-12 px-8 text-[0.8rem]",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
