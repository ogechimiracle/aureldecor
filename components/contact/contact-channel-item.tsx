import type { LucideIcon } from "lucide-react";

interface ContactChannelItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export function ContactChannelItem({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: ContactChannelItemProps) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-start gap-3"
      >
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-terracotta transition-colors group-hover:border-terracotta/40 group-hover:bg-terracotta/5">
          <Icon className="size-4" aria-hidden />
        </span>
        <span>
          <span className="block text-xs uppercase tracking-[0.14em] text-ink-mute">
            {label}
          </span>
          <span className="mt-0.5 block text-sm break-words text-ink transition-colors group-hover:text-terracotta">
            {value}
          </span>
        </span>
      </a>
    </li>
  );
}