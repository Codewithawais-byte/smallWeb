"use client";

import { useCallback, useState } from "react";

export function useBrowserStack(initial: string | null = null) {
  const [stack, setStack] = useState<string[]>(initial ? [initial] : []);
  const [index, setIndex] = useState<number>(initial ? 0 : -1);

  const current = index >= 0 ? stack[index] : null;
  const canBack = index > 0;
  const canForward = index >= 0 && index < stack.length - 1;

  const navigate = useCallback(
    (address: string) => {
      setStack((prev) => {
        // New navigation truncates everything after the current index
        const next = prev.slice(0, index + 1);
        next.push(address);
        return next;
        // Typing or clicking a new link after going back destroys the old forward history
      });
      setIndex((i) => i + 1);
    },
    [index],
  );

  const back = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const forward = useCallback(() => {
    setIndex((i) => (i < stack.length - 1 ? i + 1 : i));
  }, [stack.length]);

  return { current, canBack, canForward, navigate, back, forward };
}
