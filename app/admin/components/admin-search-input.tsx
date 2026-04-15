"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState, useTransition } from "react";

type AdminSearchInputProps = {
  placeholder?: string;
};

export default function AdminSearchInput({
  placeholder = "Suche...",
}: AdminSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") ?? "";
  const [value, setValue] = useState(query);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setValue(query);
  }, [query]);

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, 500);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          handleSearch(next);
        }}
      />
    </div>
  );
}
