import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="eyebrow mb-3 text-terracotta">{eyebrow}</p>
      ) : null}
      <Heading className="text-balance text-3xl leading-[1.1] sm:text-4xl md:text-[2.75rem]">
        {title}
      </Heading>
      {description ? (
        <p className="mt-5 text-pretty text-base leading-relaxed text-ink-soft md:text-[1.05rem]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
