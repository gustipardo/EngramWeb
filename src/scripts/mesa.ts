/**
 * Page behaviour shared by the landing: day/night + theme controls (window.engramTheme
 * is defined inline in Layout.astro so the table is set before first paint), the
 * logo's flip loop, Archie's blink and greeting, scroll reveals and the mobile menu.
 */
import { LOGO_LOOP_MS, logoSeqN } from "../lib/pixel";
import { blink, hop, reduceMotion } from "./archie";

type ThemeApi = {
  toggleNight(): void;
  setTheme(id: string): void;
};
const theme = (window as unknown as { engramTheme?: ThemeApi }).engramTheme;
const root = document.documentElement;

/* ---- day / night toggle and theme picker ---- */
function syncThemeControls() {
  const night = root.dataset.night === "1";
  document
    .querySelectorAll<HTMLElement>("[data-night-toggle]")
    .forEach((b) =>
      b.setAttribute(
        "aria-label",
        (night ? b.dataset.labelDay : b.dataset.labelNight) || "",
      ),
    );
  document
    .querySelectorAll<HTMLElement>("[data-set-theme]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(b.dataset.setTheme === root.dataset.theme),
      ),
    );
  const paper = getComputedStyle(root).getPropertyValue("--mesa-paper").trim();
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  if (paper) meta.setAttribute("content", paper);
}
document
  .querySelectorAll("[data-night-toggle]")
  .forEach((b) => b.addEventListener("click", () => theme?.toggleNight()));
document
  .querySelectorAll<HTMLElement>("[data-set-theme]")
  .forEach((b) =>
    b.addEventListener("click", () => theme?.setTheme(b.dataset.setTheme!)),
  );
document.addEventListener("engram:theme", syncThemeControls);
syncThemeControls();

/* ---- the logo's flip loop, frame by frame (~24 fps from a 33 ms tick) ---- */
const loops = Array.from(
  document.querySelectorAll<HTMLElement>("[data-logo-n]"),
);
if (loops.length && !reduceMotion()) {
  const seqs = new Map<number, string[]>();
  const items = loops.map((el) => {
    const n = Number(el.dataset.logoN);
    if (!seqs.has(n)) seqs.set(n, logoSeqN(n));
    return { svg: el.querySelector("svg")!, seq: seqs.get(n)!, last: -1 };
  });
  const t0 = performance.now();
  setInterval(() => {
    if (document.hidden) return;
    const now = performance.now() - t0;
    for (const it of items) {
      const i =
        Math.floor(now / (LOGO_LOOP_MS / it.seq.length)) % it.seq.length;
      if (i !== it.last) {
        it.svg.innerHTML = it.seq[i];
        it.last = i;
      }
    }
  }, 33);
}

/* ---- Archie: blink every ~4 s, say hi once when seen, hop when pressed ---- */
const archies = Array.from(document.querySelectorAll("[data-archie]"));
setInterval(() => {
  if (!document.hidden)
    archies.forEach((a, i) => setTimeout(() => blink(a), (i % 5) * 90));
}, 4000);
archies.forEach((a) => {
  if (a.tagName === "BUTTON") a.addEventListener("click", () => hop(a));
});
const greet = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      greet.unobserve(e.target);
      setTimeout(() => hop(e.target), 300);
    }),
  { threshold: 0.6 },
);
document.querySelectorAll("[data-greet]").forEach((a) => greet.observe(a));

/* ---- scroll reveals ---- */
const reveal = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      reveal.unobserve(e.target);
    }),
  { rootMargin: "0px 0px -8% 0px" },
);
document.querySelectorAll(".reveal").forEach((r) => reveal.observe(r));

/* ---- mobile menu ---- */
const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu-btn]");
const menu = document.querySelector<HTMLElement>("[data-menu]");
menuBtn?.addEventListener("click", () => {
  const open = menu!.hidden;
  menu!.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
});
menu
  ?.querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => {
      menu.hidden = true;
      menuBtn?.setAttribute("aria-expanded", "false");
    }),
  );
