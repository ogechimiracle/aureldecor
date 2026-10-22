"use client";

import {
  FolderOpen,
  Inbox,
  LayoutDashboard,
  Settings,
  Tags,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const items: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
  { href: "/admin/account", label: "Account", icon: UserRound },
];

interface AdminNavProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function AdminNav({
  className,
  orientation = "vertical",
}: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Administration"
      className={cn(
        orientation === "vertical"
          ? "flex flex-col gap-1"
          : "flex gap-1 overflow-x-auto pb-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-3 whitespace-nowrap rounded-sm px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-accent text-on-accent"
                : "text-ink-soft hover:bg-sand/60 hover:text-ink",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
