/** Archie's moves, timings from the kit (ART-STYLE §7): blink 140 ms, hop 560 ms. */

const E = "cubic-bezier(.23,1,.32,1)";
export const reduceMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export function blink(ch: Element) {
  if (reduceMotion()) return;
  ch.classList.add("blink");
  setTimeout(() => ch.classList.remove("blink"), 140);
}

/** The approved greeting: squash, rise, settle, drawers pop in turn, blink. */
export function hop(ch: Element) {
  if (reduceMotion()) return;
  ch.querySelectorAll(".c-all").forEach((g) =>
    g.animate(
      [
        { transform: "none" },
        { transform: "scale(1.08,.9)", offset: 0.2 },
        { transform: "translateY(-14%) scale(.96,1.05)", offset: 0.5 },
        { transform: "none" },
      ],
      { duration: 560, easing: E },
    ),
  );
  ch.querySelectorAll(".c-part").forEach((p, i) =>
    p.animate(
      [
        { transform: "none" },
        { transform: "translateY(8%) scale(1.1)", offset: 0.45 },
        { transform: "none" },
      ],
      { duration: 240, delay: 200 + i * 140, easing: E },
    ),
  );
  setTimeout(() => blink(ch), 380);
}
