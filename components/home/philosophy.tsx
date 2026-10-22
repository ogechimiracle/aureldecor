import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { profile } from "@/lib/data/profile";

export function Philosophy() {
  return (
    <div className="border-y border-line bg-panel text-on-panel">
      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow mb-6 text-terracotta-soft">
                Design philosophy
              </p>
              <blockquote className="font-serif text-3xl leading-[1.25] text-on-panel sm:text-4xl md:text-[2.6rem]">
                “{profile.philosophy}”
              </blockquote>
            </Reveal>
          </div>

          <div className="lg:pt-4">
            <Reveal delay={0.1}>
              <p className="text-pretty leading-relaxed text-on-panel/75">
                Good interiors are not about a single trend or a signature look.
                They are about the relationship between function, comfort,
                aesthetics and the personality of the people who use them. My
                work holds those four things in balance — so a space feels
                effortless to live in, and unmistakably yours.
              </p>
            </Reveal>
            <dl className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {profile.values.map((value, index) => (
                <Reveal key={value.title} delay={0.15 + index * 0.06}>
                  <div className="border-t border-ivory/15 pt-5">
                    <dt className="font-serif text-xl text-on-panel">
                      {value.title}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-on-panel/65">
                      {value.description}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </div>
  );
}
