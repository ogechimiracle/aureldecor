import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-sm border border-line bg-card p-7 transition-colors duration-300 hover:border-line-strong hover:bg-ivory"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full border border-line text-terracotta transition-colors group-hover:border-terracotta/40 group-hover:bg-terracotta/5">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-6 font-serif text-xl leading-snug text-ink">
        {service.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
        {service.description}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-terracotta">
        Learn more
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
