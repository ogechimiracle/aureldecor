import type { ComponentProps } from "react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface SectionProps extends ComponentProps<"section"> {
  containerClassName?: string;
  bleed?: boolean;
}

export function Section({
  className,
  containerClassName,
  bleed = false,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-20 md:py-28", className)} {...props}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
