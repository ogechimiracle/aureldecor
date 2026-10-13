import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-line bg-ivory", className)}>
      <Container
        className={cn(
          "py-16 md:py-24",
          align === "center" && "text-center",
        )}
      >
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          {eyebrow ? (
            <p className="eyebrow mb-4 text-terracotta">{eyebrow}</p>
          ) : null}
          <h1 className="text-balance font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}