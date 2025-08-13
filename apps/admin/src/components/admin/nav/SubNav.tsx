"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUB_NAV, canSee } from "@/lib/admin/nav";
import { cn } from "@artistry-hub/ui";

type Props = { section: "catalog" | "orders" | "analytics" | "customers" | "settings" | "dashboard"; role?: string };

export default function SubNav({ section, role = "superadmin" }: Props) {
  const pathname = usePathname();
  const items = SUB_NAV[section] ?? [];

  return (
    <div className="sticky top-14 z-30 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex flex-wrap gap-2 py-2">
          {items.filter(i => canSee(role, i.roles)).map((i) => {
            const active = pathname === i.href || pathname?.startsWith(i.href + "/");
            return (
              <Link
                key={i.key}
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium border",
                  active ? "bg-gray-900 text-white border-gray-900" : "bg-white hover:bg-gray-50"
                )}
              >
                {i.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
