/**
 * Pixel art for the landing: the speaking-card logo, Archie and the small icons.
 * Literal port of _design/08-visual-divergence/engram-ui-kit.html (`drawLogoN`,
 * `logoSeqN`, `A.map`, `ICON`), the same source the app's PixelLogo is checked against.
 * Card back is fixed to Graph, the approved default (ART-STYLE §8).
 *
 * Sprites are rows of palette keys; '.' is empty. Each key becomes a CSS class
 * (`pK`, `pB`, ...) coloured from the active table in global.css, so one SVG follows
 * every table. `toPaths` emits one <path> per key instead of one <rect> per run.
 */

export type Rows = string[];

export function toPaths(rows: Rows): string {
  const runs: Record<string, string> = {};
  rows.forEach((row, y) => {
    if (!row) return;
    for (let x = 0; x < row.length;) {
      const c = row[x];
      if (c === ".") {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === c) w++;
      runs[c] = (runs[c] || "") + `M${x} ${y}h${w}v1h-${w}z`;
      x += w;
    }
  });
  return Object.keys(runs)
    .map((c) => `<path class="p${c}" d="${runs[c]}"/>`)
    .join("");
}

/* ---------- the logo: 32-unit design grid rasterised at N px wide ---------- */

type Shade = "r" | "l" | null;
type Face = "back" | undefined;

type Hair = { x: number; y: number; w: number; h: number }[];

/** One logo frame at definition N as palette rows, plus the Graph back's
 *  hairlines. w = card width in design units (18 = full face). */
export function logoGridN(
  N: number,
  w: number,
  swap: boolean,
  shade: Shade,
  ray: number,
  face?: Face,
): { rows: Rows; hair: Hair } {
  const k = N / 32;
  const W = N;
  const H = Math.round(26 * k);
  const g: string[][] = [];
  for (let y = 0; y < H; y++) g.push(new Array(W).fill("."));
  const cx = 10.5;
  const x0 = Math.round((cx - w / 2) * k);
  const x1 = Math.round((cx + w / 2) * k) - 1;
  const ty = Math.round(2 * k);
  const by = Math.round(24 * k) - 1;
  const rr = Math.max(1, Math.round(k));
  const t = Math.max(1, Math.round(k * 0.8));
  const edge = w <= 2;
  const inC = (xx: number, yy: number) => {
    if (yy < ty || yy > by || xx < x0 || xx > x1) return false;
    const dx = Math.max(x0 + rr - xx, xx - (x1 - rr), 0);
    const dy = Math.max(ty + rr - yy, yy - (by - rr), 0);
    return !(
      dx > 0 &&
      dy > 0 &&
      dx * dx + dy * dy > rr * rr + (rr > 1 ? rr * 0.6 : 0)
    );
  };
  for (let y = ty; y <= by; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!inC(x, y)) continue;
      let rim = false;
      for (let d = 1; d <= t && !rim; d++) {
        if (
          !inC(x - d, y) ||
          !inC(x + d, y) ||
          !inC(x, y - d) ||
          !inC(x, y + d)
        )
          rim = true;
      }
      if (rim && x1 - x0 > 1) {
        g[y][x] = "K";
        continue;
      }
      let c = edge ? "D" : "B";
      // Graph back: plain card colour here, hairlines drawn on top below.
      if (!edge && !shade && N > 16) {
        if (!inC(x + 2 * t, y) || !inC(x, y + 2 * t)) c = "D";
        else if (!inC(x - 2 * t, y) || !inC(x, y - 2 * t)) c = "L";
      }
      if (
        !edge &&
        shade &&
        ((shade === "r" && x > cx * k) || (shade === "l" && x < cx * k))
      )
        c = "D";
      g[y][x] = c;
    }
  }
  if (w >= 6 && face !== "back") {
    const ins = (w >= 12 ? 4 : 2) * k;
    const lh = Math.max(1, Math.round(2 * k));
    const sh = Math.max(1, Math.round(k / 2));
    const hiY = Math.round((swap ? 15 : 8) * k);
    const loY = Math.round((swap ? 8 : 15) * k);
    const lx0 = Math.round(x0 + ins);
    const lx1 = Math.round(x1 - ins);
    for (let x = lx0; x <= lx1; x++) {
      for (let j = 0; j < lh + sh; j++) {
        const ch = j < lh ? null : "D";
        g[hiY + j][x] = ch || "W";
        g[loY + j][x] = ch || "Q";
      }
    }
  }
  const seg = (
    ax: number,
    ay: number,
    bx: number,
    by2: number,
    th: number,
    col: string,
  ) => {
    ax *= k;
    ay *= k;
    bx *= k;
    by2 *= k;
    const r2 = (th * k) / 2;
    const vx = bx - ax;
    const vy = by2 - ay;
    const L2 = vx * vx + vy * vy || 1;
    for (
      let yy = Math.floor(Math.min(ay, by2) - r2 - 1);
      yy <= Math.ceil(Math.max(ay, by2) + r2 + 1);
      yy++
    ) {
      for (
        let xx = Math.floor(Math.min(ax, bx) - r2 - 1);
        xx <= Math.ceil(Math.max(ax, bx) + r2 + 1);
        xx++
      ) {
        if (yy < 0 || yy >= H || xx < 0 || xx >= W || g[yy][xx] !== ".")
          continue;
        const px = xx + 0.5;
        const py = yy + 0.5;
        const tt = Math.max(
          0,
          Math.min(1, ((px - ax) * vx + (py - ay) * vy) / L2),
        );
        const ex = ax + tt * vx - px;
        const ey = ay + tt * vy - py;
        if (ex * ex + ey * ey <= r2 * r2 + (k < 1.5 ? 0.25 : 0))
          g[yy][xx] = col;
      }
    }
  };
  const len = [1.4, 2, 4, 6, 8][ray];
  seg(24, 13, 23 + Math.max(1, len), 13, 2, ray === 0 ? "S" : "B");
  if (ray >= 2) {
    const f = ray === 2 ? 0.45 : 1;
    const ex2 = 23.6 + 4.6 * f;
    const ey2 = 9.2 - 2.6 * f;
    seg(23.6, 9.2, ex2, ey2, 2, "S");
    seg(23.6, 26 - 9.2, ex2, 26 - ey2, 2, "S");
  }
  const rows = g.map((r) => r.join(""));
  const hair: Hair = [];
  if (face === "back" && !edge && x1 - x0 > 2 * t + 1) {
    // hairline graph paper: about 7 squares across a full card
    const cell = (18 * k) / 7;
    const lw = Math.max(0.35, k * 0.28);
    const ix0 = x0 + t;
    const iy0 = ty + t;
    const iw = x1 - x0 + 1 - 2 * t;
    const ih = by - ty + 1 - 2 * t;
    for (let gx = cell * 0.5; gx < iw; gx += cell)
      hair.push({ x: ix0 + gx, y: iy0, w: lw, h: ih });
    for (let gy = cell * 0.5; gy < ih; gy += cell)
      hair.push({ x: ix0, y: iy0 + gy, w: iw, h: lw });
  }
  return { rows, hair };
}

export function drawLogoN(
  N: number,
  w: number,
  swap: boolean,
  shade: Shade,
  ray: number,
  face?: Face,
): string {
  const { rows, hair } = logoGridN(N, w, swap, shade, ray, face);
  let out = toPaths(rows);
  if (hair.length) {
    out += '<g class="px-hair" shape-rendering="geometricPrecision">';
    for (const r of hair) {
      out += `<rect x="${r.x.toFixed(2)}" y="${r.y.toFixed(2)}" width="${r.w.toFixed(2)}" height="${r.h.toFixed(2)}"/>`;
    }
    out += "</g>";
  }
  return out;
}

type Frame = [number, boolean, Shade, number, Face?];

/** The 4.6 s loop: ray grows, 360° flip onto the card back, lines swap, back again. */
export function logoFramesN(N: number): Frame[] {
  const f: Frame[] = [];
  const cl =
    N <= 16
      ? [13, 8, 4]
      : N <= 32
        ? [16, 13, 10, 7, 4]
        : [17, 15.5, 13.5, 11, 8.5, 6, 3.5];
  const op = cl.slice().reverse();
  const e = N >= 48 ? 1.4 : 2;
  const hold = (sw: boolean, r: number, n: number) => {
    for (let i = 0; i < n; i++) f.push([18, sw, null, r]);
  };
  const flip = (sw: boolean) => {
    cl.forEach((w) => f.push([w, sw, w <= 7 ? "r" : null, 4]));
    f.push([e, sw, null, 4]);
    op.forEach((w) => f.push([w, sw, w <= 7 ? "l" : null, 4, "back"]));
    f.push([18, sw, null, 4, "back"]);
    cl.forEach((w) => f.push([w, sw, w <= 7 ? "r" : null, 4, "back"]));
    f.push([e, sw, null, 4]);
    op.forEach((w) => f.push([w, !sw, w <= 7 ? "l" : null, 4]));
  };
  hold(false, 0, 10);
  [1, 2, 3].forEach((r) => hold(false, r, 1));
  hold(false, 4, 3);
  flip(false);
  hold(true, 4, 6);
  [3, 2, 1].forEach((r) => hold(true, r, 1));
  hold(true, 0, 8);
  [1, 2, 3].forEach((r) => hold(true, r, 1));
  hold(true, 4, 3);
  flip(true);
  hold(false, 4, 6);
  [3, 2, 1].forEach((r) => hold(false, r, 1));
  return f;
}

export function logoSeqN(N: number): string[] {
  return logoFramesN(N).map((a) => drawLogoN(N, ...a));
}

export const LOGO_LOOP_MS = 4600;

export function logoSvg(
  N: number,
  inner = drawLogoN(N, 18, false, null, 0),
): string {
  return `<svg class="px" viewBox="0 0 ${N} ${Math.round((26 * N) / 32)}" aria-hidden="true">${inner}</svg>`;
}

/* ---------- Archie, the filing cabinet (16 x 16) ---------- */

const ARCHIE = {
  map: [
    ".KKKKKKKKKKKKKK.",
    ".KLLLLLLLLLLLDK.",
    ".KLWWLLLLLWWLDK.",
    ".KLWKLLLLLWKLDK.",
    ".KLLLLKKKLLLLDK.",
    ".KBBBBBBBBBBBDK.",
    ".KLLLLWWWLLLLDK.",
    ".KLLLLLKLLLLLDK.",
    ".KBBBBBBBBBBBDK.",
    ".KLLLLWWWLLLLDK.",
    ".KLLLLLKLLLLLDK.",
    ".KBBBBBBBBBBBDK.",
    ".KLLLLWWWLLLLDK.",
    ".KLLLLLKLLLLLDK.",
    ".KKKKKKKKKKKKKK.",
    "..KK........KK..",
  ],
  blink: { 2: "...LL.....LL....", 3: "...KK.....KK...." } as Record<
    number,
    string
  >,
  mouth: { 4: ".....KKKKK......", 5: "......KRK......." } as Record<
    number,
    string
  >,
  parts: [
    [6, 7],
    [9, 10],
    [12, 13],
  ],
};

export function archieSvg(): string {
  const h = ARCHIE.map.length;
  const w = ARCHIE.map[0].length;
  const sparse = (o: Record<number, string>) =>
    Array.from({ length: h }, (_, i) => o[i] || "");
  const parts = ARCHIE.parts
    .map(([a, b]) => {
      const rows = ARCHIE.map.map((r, y) => (y >= a && y <= b ? r : ""));
      return `<g class="c-part">${toPaths(rows)}</g>`;
    })
    .join("");
  return (
    `<svg class="px" viewBox="0 0 ${w} ${h + 2}" aria-hidden="true">` +
    `<rect class="pZ" x="2" y="${h + 0.6}" width="${w - 4}" height="1"/>` +
    `<g class="c-all"><g>${toPaths(ARCHIE.map)}</g>${parts}` +
    `<g class="c-blink">${toPaths(sparse(ARCHIE.blink))}</g>` +
    `<g class="c-mouth">${toPaths(sparse(ARCHIE.mouth))}</g></g></svg>`
  );
}

/* ---------- icons (12 x 12, drawn in currentColor) ---------- */

export const ICON: Record<string, Rows> = {
  sun: [
    ".....XX.....",
    ".X...XX...X.",
    "..X......X..",
    "....XXXX....",
    "...XXXXXX...",
    "XX.XXXXXX.XX",
    "XX.XXXXXX.XX",
    "...XXXXXX...",
    "....XXXX....",
    "..X......X..",
    ".X...XX...X.",
    ".....XX.....",
  ],
  moon: [
    "....XXXX....",
    "..XXXX......",
    ".XXXX.......",
    ".XXX........",
    "XXXX........",
    "XXXX........",
    "XXXX........",
    "XXXXX......X",
    ".XXXXX....XX",
    ".XXXXXXXXXX.",
    "..XXXXXXXX..",
    "....XXXX....",
  ],
  flame: [
    ".....X......",
    "....XX......",
    "....XXX.....",
    "...XXXX..X..",
    "...XXXXX.X..",
    "..XXXXXXXX..",
    "..XXX.XXXX..",
    "..XX...XXX..",
    "..XX...XX...",
    "...XX.XX....",
    "....XXX.....",
    "............",
  ],
  // not in the kit: same 12 x 12 grid and stroke weight as the kit's icons
  down: [
    ".....XX.....",
    ".....XX.....",
    ".....XX.....",
    ".....XX.....",
    "..X..XX..X..",
    "..XX.XX.XX..",
    "...XXXXXX...",
    "....XXXX....",
    ".....XX.....",
    "............",
    ".XXXXXXXXXX.",
    ".XXXXXXXXXX.",
  ],
  arrow: [
    "............",
    "......X.....",
    "......XX....",
    ".......XX...",
    "........XX..",
    ".XXXXXXXXXX.",
    ".XXXXXXXXXX.",
    "........XX..",
    ".......XX...",
    "......XX....",
    "......X.....",
    "............",
  ],
  plus: [
    "............",
    ".....XX.....",
    ".....XX.....",
    ".....XX.....",
    ".....XX.....",
    ".XXXXXXXXXX.",
    ".XXXXXXXXXX.",
    ".....XX.....",
    ".....XX.....",
    ".....XX.....",
    ".....XX.....",
    "............",
  ],
  check: [
    "............",
    "............",
    "..........XX",
    ".........XX.",
    "........XX..",
    "XX.....XX...",
    ".XX...XX....",
    "..XX.XX.....",
    "...XXX......",
    "....X.......",
    "............",
    "............",
  ],
  mail: [
    "............",
    "............",
    "XXXXXXXXXXXX",
    "XX........XX",
    "X.X......X.X",
    "X..X....X..X",
    "X...X..X...X",
    "X....XX....X",
    "X..........X",
    "XXXXXXXXXXXX",
    "............",
    "............",
  ],
};

export function iconSvg(name: keyof typeof ICON, cls = ""): string {
  const rows = ICON[name];
  return `<svg class="px ${cls}" viewBox="0 0 ${rows[0].length} ${rows.length}" aria-hidden="true">${toPaths(rows)}</svg>`;
}
