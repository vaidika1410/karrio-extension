"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_FILTER_OPTIONS } from "@/lib/application-status";

interface ApplicationsToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

export function ApplicationsToolbar({
  search,
  setSearch,
  status,
  setStatus,
}: ApplicationsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company or role..."
          className="h-10 border-border/80 bg-background pl-9"
        />
      </div>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="h-10 w-full border-border/80 bg-background sm:w-[200px]">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
