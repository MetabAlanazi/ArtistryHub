"use client";
import { Input, Button } from "@artistry-hub/ui";
import { Filter, Download } from "lucide-react";

type Props = {
  onSearch?: (q: string) => void;
  right?: React.ReactNode;
};

export default function Toolbar({ onSearch, right }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="sticky top-[var(--subnav-top,4rem)] z-20 -mt-2 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white/70 p-3 backdrop-blur">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Input
            placeholder="Search products or artists…"
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-72"
          />
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          {right}
        </div>
      </div>
    </div>
  );
}
