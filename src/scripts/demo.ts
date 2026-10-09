/**
 * Hero session loop (SessionDemo.astro). One card: deal off the deck 0.6 s, tutor asks,
 * you answer, back revealed when you finish, evaluating dots, stamp slam, feedback,
 * then the card goes to your pile (GOOD) or flips and slides under the deck (AGAIN).
 * The clock stops while paused, off screen or in a hidden tab.
 */
import { hop } from "./archie";

type DemoCard = {
  deck: string;
  q: string;
  said: string;
  a: string;
  good: boolean;
};
type Phases = Record<"asking" | "answer" | "evaluating" | "feedback", string>;

const TOTAL = 8;
const E = "cubic-bezier(.23,1,.32,1)";
const EIO = "cubic-bezier(.65,0,.35,1)";

export function runDemo(root: HTMLElement) {
  const cards: DemoCard[] = JSON.parse(root.dataset.cards || "[]");
  const phases: Phases = JSON.parse(root.dataset.phases || "{}");
  if (!cards.length || matchMedia("(prefers-reduced-motion: reduce)").matches)
    return; // the markup already shows the first card, graded

  const q = <T extends HTMLElement = HTMLElement>(s: string) =>
    root.querySelector(s) as T;
  const el = {
    deck: q("[data-deck]"),
    knownN: q("[data-known-n]"),
    segs: Array.from(root.querySelectorAll<HTMLElement>("[data-segs] i")),
    leftN: q("[data-left-n]"),
    knownPileN: q("[data-known-pile-n]"),
    deckPile: q("[data-deck-pile]"),
    knownPile: q("[data-known-pile]"),
    pileIdx: q("[data-known-pile] .idx"),
    slot: q(".demo-slot"),
    card: q("[data-card]"),
    flip: q("[data-flip]"),
    idx: [q("[data-idx-a]"), q("[data-idx-b]")],
    q: q("[data-q]"),
    ans: q("[data-ans]"),
    a: q("[data-a]"),
    stamp: q("[data-stamp]"),
    bars: q("[data-bars]"),
    dots: q("[data-dots]"),
    phase: q("[data-phase]"),
    said: q("[data-said]"),
    saidText: q("[data-said-text]"),
    pause: q<HTMLButtonElement>("[data-pause]"),
    archie: q("[data-archie]"),
  };

  /* ---- a clock that only runs while the demo can be seen ---- */
  let paused = false;
  let visible = true;
  const live = new Set<Animation>();
  const running = () => !paused && visible && !document.hidden;
  const sync = () => {
    root.classList.toggle("paused", !running());
    live.forEach((a) => (running() ? a.play() : a.pause()));
  };
  const sleep = (ms: number) =>
    new Promise<void>((done) => {
      let left = ms;
      let last = performance.now();
      const tick = () => {
        const now = performance.now();
        if (running()) left -= now - last;
        last = now;
        if (left <= 0) done();
        else setTimeout(tick, 40);
      };
      setTimeout(tick, 40);
    });
  const anim = (
    target: Element,
    frames: Keyframe[],
    opts: KeyframeAnimationOptions,
  ) => {
    const a = target.animate(frames, opts);
    live.add(a);
    if (!running()) a.pause();
    return a.finished.then(() => {
      live.delete(a);
    });
  };

  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      sync();
    },
    { threshold: 0.15 },
  ).observe(root);
  document.addEventListener("visibilitychange", sync);
  el.pause.hidden = false;
  el.pause.addEventListener("click", () => {
    paused = !paused;
    el.pause.textContent = paused
      ? el.pause.dataset.playLabel!
      : el.pause.dataset.pauseLabel!;
    el.pause.setAttribute("aria-pressed", String(paused));
    sync();
  });

  /* ---- view helpers ---- */
  let left = TOTAL;
  let known = 0;
  const counts = () => {
    el.leftN.textContent = String(left);
    el.knownN.textContent = String(known);
    el.knownPileN.textContent = String(known);
    el.segs.forEach((s, i) => s.classList.toggle("on", i < known));
    el.knownPile.style.opacity = known ? "1" : "0.35"; // an empty pile is just a slot
  };
  const setPhase = (p: keyof Phases) => {
    el.phase.textContent = phases[p];
    const thinking = p === "evaluating";
    el.dots.classList.toggle("hidden", !thinking);
    el.bars.classList.toggle("hidden", thinking);
    el.bars.classList.toggle("you", p === "answer");
  };
  const offset = (to: HTMLElement) => {
    const a = el.card.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    return {
      x: b.left + b.width / 2 - (a.left + a.width / 2),
      y: b.top + b.height / 2 - (a.top + a.height / 2),
      s: b.width / a.width,
    };
  };

  async function play(c: DemoCard, n: number) {
    el.deck.textContent = c.deck;
    el.q.textContent = c.q;
    el.a.textContent = c.a;
    el.idx.forEach((i) => (i.firstChild!.textContent = String(n)));
    el.ans.classList.add("off");
    el.stamp.classList.remove("slam");
    el.stamp.innerHTML = "";
    el.said.classList.add("off");
    el.slot.style.zIndex = "";

    // deal off the deck and flip face up
    setPhase("asking");
    left -= 1;
    counts();
    const from = offset(el.deckPile);
    el.card.style.opacity = "1";
    anim(el.deckPile, [{ transform: "none" }, { transform: "translateY(-6px) rotate(-3deg)", offset: 0.45 }, { transform: "none" }], { duration: 320, easing: E });
    await Promise.all([
      anim(el.card, [{ transform: `translate(${from.x}px,${from.y}px) rotate(-14deg) scale(${from.s})`, opacity: 0.4 }, { transform: "none", opacity: 1 }], { duration: 600, easing: E }),
      anim(el.flip, [{ transform: "rotateY(180deg)" }, { transform: "rotateY(0)" }], { duration: 600, easing: E }),
    ]);
    await sleep(1500);

    // your turn: words arrive as you say them
    setPhase("answer");
    el.said.classList.remove("off");
    const words = c.said.split(" ");
    for (let k = 1; k <= words.length; k++) {
      el.saidText.textContent = `“${words.slice(0, k).join(" ")}${k === words.length ? "”" : ""}`;
      await sleep(Math.max(140, 1200 / words.length));
    }
    await sleep(250);

    // the back shows as soon as you finish speaking, then the grade
    el.ans.classList.remove("off");
    setPhase("evaluating");
    await sleep(850);
    el.stamp.innerHTML = c.good
      ? '<span class="stamp stamp-good">GOOD</span>'
      : '<span class="stamp stamp-again">AGAIN</span>';
    el.stamp.classList.add("slam");
    setPhase("feedback");
    await sleep(1800);

    if (c.good) {
      el.slot.style.zIndex = "4"; // lands on top of the pile
      const to = offset(el.knownPile);
      await anim(el.card, [{ transform: "none" }, { transform: `translate(${to.x}px,${to.y}px) rotate(8deg) scale(${to.s})` }], { duration: 650, easing: EIO, fill: "forwards" });
      known += 1;
      el.pileIdx.firstChild!.textContent = String(n);
    } else {
      // turn it over and slide it under the deck: it comes round again
      const to = offset(el.deckPile);
      await anim(el.flip, [{ transform: "rotateY(0)" }, { transform: "rotateY(180deg)" }], { duration: 320, easing: E, fill: "forwards" });
      await anim(el.card, [{ transform: "none" }, { transform: `translate(${to.x}px,${to.y}px) rotate(-6deg) scale(${to.s})` }], { duration: 650, easing: EIO, fill: "forwards" });
      left += 1;
    }
    el.card.style.opacity = "0";
    el.card.getAnimations().forEach((a) => a.cancel());
    el.flip.getAnimations().forEach((a) => a.cancel());
    counts();
    await sleep(380);
  }

  (async () => {
    for (;;) {
      left = TOTAL;
      known = 0;
      counts();
      el.card.style.opacity = "0";
      if (el.archie) hop(el.archie);
      await sleep(700);
      for (let i = 0; i < cards.length; i++) await play(cards[i], i + 1);
      await sleep(900);
    }
  })();
}
