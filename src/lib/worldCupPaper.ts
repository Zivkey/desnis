import { createToggleStore } from "./toggleStore";

/** Whether the head-to-head paper (opened by clicking the ball) is showing. */
const store = createToggleStore();

// Methods are closures, not `this`-dependent, so destructuring them is safe.
export const { subscribe, getSnapshot, getServerSnapshot } = store;
export const setPaperOpen = store.set;
