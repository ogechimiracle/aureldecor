import { Quote } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialsSection() {
  return (
    <div className="border-y border-line bg-ivory">
      <Container className="py-20 md:py-28">
        <SectionHeading
          eyebrow="In their words"
          title="What clients say."
          description="Feedback from recent commissions — shared once we have permission to publish."
        />

        <p className="mt-4 inline-block rounded-sm border border-dashed border-line-strong px-3 py-1.5 text-xs text-ink-mute">
          Sample client quotations shown as placeholder content — to be replaced
          with verified, attributed feedback before launch.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Reveal key={index} delay={(index % 2) * 0.08}>
              <figure className="flex h-full flex-col rounded-sm border border-line bg-card p-8">
                <Quote className="size-6 text-terracotta/70" aria-hidden />
                <blockquote className="mt-5 flex-1 text-pretty font-serif text-lg leading-relaxed text-ink">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <span className="block text-xs uppercase tracking-[0.16em] text-ink">
                    {testimonial.name}
                  </span>
                  <span className="mt-1 block text-xs text-ink-mute">
                    {testimonial.role} · {testimonial.project}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}