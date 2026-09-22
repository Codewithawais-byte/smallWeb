'use client';

import { useCallback, useState } from 'react';

/**
 * The back/forward stack, deliberately kept client-side and separate
 * from the persisted Visit log in Mongo.
 *
 * - `stack` + `index` is a classic browser history stack: navigating
 *   to a brand-new address truncates anything ahead of `index` and
 *   pushes the new address — this is what makes "forward can be lost"
 *   correct (type a new address after going back, and forward is gone).
 * - `back`/`forward` just move `index` — they never touch the stack.
 * - "Restore on return" falls out for free: an address always maps
 *   deterministically to the same site content, so re-showing
 *   `stack[index]` after going back always shows exactly what was
 *   left. No separate snapshot/cache needed.
 * - This stack is per-tab and ephemeral (a real browser's is too).
 *   The permanent, cross-session History view is powered by the
 *   Visit collection in Mongo instead — a completely separate
 *   mechanism for a completely separate constraint.
 */
export function useBrowserStack(initial: string | null = null) {
  const [stack, setStack] = useState<string[]>(initial ? [initial] : []);
  const [index, setIndex] = useState<number>(initial ? 0 : -1);

  const current = index >= 0 ? stack[index] : null;
  const canBack = index > 0;
  const canForward = index >= 0 && index < stack.length - 1;

  const navigate = useCallback(
    (address: string) => {
      setStack((prev) => {
        const next = prev.slice(0, index + 1);
        next.push(address);
        return next;
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
