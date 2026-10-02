"use client";

import { useEffect, useRef, useState } from "react";

/**
 * How many columns of at least `minWidth` px fit in the element, updated as
 * it resizes. Used to size a page as "N full rows" whatever the screen.
 *
 * Example: a 1240px container with 240px cards and 20px gaps fits
 * floor((1240 + 20) / (240 + 20)) = 4 columns.
 */
export function useGridColumns(minWidth: number, gap: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = el.getBoundingClientRect().width;
      setColumns(Math.max(1, Math.floor((width + gap) / (minWidth + gap))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [minWidth, gap]);

  return { ref, columns };
}
