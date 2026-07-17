import { createToggleStore } from "./toggleStore";

/** Whether the /world-cup photo is expanded into its full-bleed state. */
const store = createToggleStore();

// Methods are closures, not `this`-dependent, so destructuring them is safe.
export const { subscribe, getSnapshot, getServerSnapshot } = store;
export const setPhotoExpanded = store.set;
