// A boolean shared between components that sit in different branches of the
// tree. /world-cup needs this twice: the photo's expanded state and the match
// paper's open state are each read by the stage, the vote bar and the object
// itself — one inside the scaled stage, one pinned to the viewport — so a React
// provider would have to wrap the entire page to join them up.
//
// Exposed for useSyncExternalStore. A boolean is a stable snapshot under
// Object.is, so getSnapshot can return it raw.
export function createToggleStore() {
  let value = false;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => value,
    getServerSnapshot: () => false,
    set(next: boolean) {
      if (value === next) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
  };
}
