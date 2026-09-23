"use client";

import { useState } from "react";

export function useSelectableEntries<T extends object>(
  createInitialEntries: () => T[],
) {
  const [entries, setEntries] = useState<T[]>(createInitialEntries);

  const [selected, setSelected] = useState<boolean[]>(() =>
    entries.map(() => true),
  );

  function onEntryChange(index: number, patch: Partial<T>) {
    setEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, ...patch } : entry,
      ),
    );
  }

  function onSelectedChange(index: number, checked: boolean) {
    setSelected((current) =>
      current.map((value, entryIndex) =>
        entryIndex === index ? checked : value,
      ),
    );
  }

  return {
    entries,
    selected,
    onEntryChange,
    onSelectedChange,
  };
}
