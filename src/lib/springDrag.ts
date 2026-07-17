import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { sound } from "./sound";

gsap.registerPlugin(Draggable);

// Throw it, let go, it springs home — the same behaviour (and the same numbers)
// as the ClubCard on the homepage.
const RETURN_DURATION = 0.9;
const RETURN_EASE = "elastic.out(1, 0.55)";

// Past this many px a press counts as a drag rather than a click, so flinging
// an object doesn't also fire whatever its click does.
const DRAG_SLOP = 4;

/**
 * Makes `target` draggable, springing back to its origin on release.
 *
 * Attach this to an element that carries no transform of its own. CSS applies
 * `translate`/`rotate`/`scale` *after* `transform`, and GSAP writes the drag
 * into `transform` — so from inside a scaled element the drag comes out
 * multiplied, and from inside a rotated one it comes out skewed. GSAP maps the
 * pointer through *ancestor* transforms by itself, so nesting is fine; it's the
 * target's own transform that has to stay clear.
 *
 * Callers that must restrict *where* a drag can start should `disable()` the
 * returned instance and enable it only over a valid area. Vetoing inside
 * onPressInit does not work — by then the press is already live.
 */
export function createSpringDrag(
  target: Element,
  {
    onDragStateChange,
  }: {
    /** Fires false on press, true once the pointer passes the slop threshold. */
    onDragStateChange?: (dragged: boolean) => void;
  } = {},
) {
  const [drag] = Draggable.create(target, {
    type: "x,y",
    // Draggable would otherwise paint its own `grab` across the whole drag box,
    // including the transparent parts of a cutout, and it survives disable().
    // Inheriting hands the cursor back to the caller, which can gate it.
    cursor: "inherit",
    onPressInit() {
      onDragStateChange?.(false);
      gsap.killTweensOf(this.target); // re-grab mid-flight without a jump
      sound.grab();
    },
    onDrag() {
      if (Math.hypot(this.x, this.y) > DRAG_SLOP) onDragStateChange?.(true);
    },
    onRelease() {
      sound.release();
    },
    onDragEnd() {
      gsap.to(this.target, {
        x: 0,
        y: 0,
        duration: RETURN_DURATION,
        ease: RETURN_EASE,
      });
    },
  });

  return drag;
}
