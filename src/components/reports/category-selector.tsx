"use client";

import { issueCategories } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CategorySelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {issueCategories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            "focus-ring rounded-lg border px-3 py-3 text-left text-sm font-semibold transition",
            value === category
              ? "border-civic-blue bg-blue-50 text-civic-blue shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
