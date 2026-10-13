import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { processSteps } from "@/lib/data/process";

export function ProcessSection() {
  return (
    <div id="process" className="bg-canvas">
      <Container className="py-20 md:py-28">
        <SectionHeading
          eyebrow="How we work"
          title="A clear, considered process from first meeting to handover."
          description="Every project follows the same disciplined path. You always know what happens next, what is being decided, and what it will cost."
          align="center"
        />

        <ol className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <Reveal key={step.step} delay={(index % 3) * 0.08}>
              <li className="relative border-t border-line-strong pt-6">
                <span className="font-serif text-4xl text-terracotta/80">
                  {step.step}
                </span>
                <h3 className="mt-3 font-serif text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </div>
  );
}
