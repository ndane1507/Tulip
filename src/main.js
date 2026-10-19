import "@fontsource/be-vietnam-pro/vietnamese-400.css";
import "@fontsource/be-vietnam-pro/latin-400.css";
import "@fontsource/cormorant-garamond/vietnamese-400.css";
import "@fontsource/cormorant-garamond/vietnamese-400-italic.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "./style.css";
import { gift } from "./config.js";
import { gardenMarkup } from "./garden.js";
import flower from "@tabler/icons/outline/plant-2.svg?raw";
import sparkle from "@tabler/icons/outline/sparkles.svg?raw";
import music from "@tabler/icons/outline/music.svg?raw";
import replay from "@tabler/icons/outline/rotate-clockwise.svg?raw";
import arrow from "@tabler/icons/outline/arrow-up-right.svg?raw";
import close from "@tabler/icons/outline/x.svg?raw";
import sun from "@tabler/icons/outline/sun.svg?raw";

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
document.title = gift.title;
document.querySelector("#app").innerHTML = `
  <main class="world" id="world" aria-label="Vườn tulip và những lời chúc">
    <div class="ambient-glow" aria-hidden="true"></div><div class="moonlight" aria-hidden="true"></div>
    <div class="night-moon" aria-hidden="true"><span></span></div>
    <div class="light-column" aria-hidden="true"></div>
    <canvas id="atmosphere" aria-hidden="true"></canvas>
    <header class="scene-header"><div class="wordmark">${flower}<span>một chút an yên</span></div><button class="sound-button" id="sound" aria-label="Bật nhạc nền" aria-pressed="false">${music}<span>Nhạc nền</span><i class="sound-bars" aria-hidden="true"><b></b><b></b><b></b></i></button></header>
    <div class="scene-heading"><p class="eyebrow">MỘT VƯỜN TULIP · MỘT LỜI CHÚC NHỎ</p><h1>${escape(gift.heading)}<br><em>${escape(gift.emphasis)}</em></h1><p class="subtitle">${escape(gift.subtitle)}</p></div>
    <div class="garden-floor" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="garden-stage" id="garden-stage">${gardenMarkup()}</div>
    <div class="wish-notes" aria-hidden="true">${gift.wishes.map((wish, i) => `<div class="wish-note wish-${i}" style="--note-delay:${i * 0.42}s;--phase:-${i * 2.8}s;--wish-index:${i}"><span class="wish-spark">✧</span><span>${escape(wish)}</span></div>`).join("")}</div>
    <div class="bottom-mist" aria-hidden="true"></div><div class="vignette" aria-hidden="true"></div><div class="film-grain" aria-hidden="true"></div>
    <div class="scene-controls"><button class="quiet-button" id="replay">${replay}<span>Xem hoa nở</span></button><p class="touch-hint">${sparkle}<span>Chạm nhẹ để thắp sáng khu vườn</span></p><button class="quiet-button greeting-button" id="read-wish"><span>Đọc lời chúc</span>${arrow}</button></div>
    <section class="welcome" id="welcome" aria-labelledby="welcome-title"><div class="welcome-botanical" aria-hidden="true">${gardenMarkup("intro-")}</div><div class="orbit orbit-one" aria-hidden="true"></div><div class="orbit orbit-two" aria-hidden="true"></div><div class="welcome-card"><div class="gift-seal">${flower}</div><p class="eyebrow">DỪNG LẠI MỘT CHÚT, HÍT THỞ THẬT SÂU</p><h2 id="welcome-title">Một chút bình yên,<br><em>gửi đến bạn.</em></h2><p class="welcome-copy">Có một khu vườn nhỏ đang chờ bạn ghé qua.<br>Cùng vài lời chúc, cho một ngày thật đẹp.</p><button class="open-gift" id="open-gift">Ghé khu vườn <span>${arrow}</span></button><p class="welcome-footnote">${music} Bật một chút nhạc, tận hưởng một chút yên.</p></div><p class="welcome-sign">Mong mọi điều tốt lành sẽ đến với bạn.</p></section>
  </main>
  <dialog id="wish-dialog" aria-labelledby="dialog-title"><button class="dialog-close" aria-label="Đóng lời chúc">${close}</button><div class="dialog-emblem">${sun}</div><p class="eyebrow">MỘT LỜI CHÚC NHỎ GỬI BẠN</p><h2 id="dialog-title">Mọi điều tốt lành.</h2><div class="greeting-copy">${gift.greeting.map((line) => `<p>${escape(line)}</p>`).join("")}</div><div class="little-flower" aria-hidden="true">${flower}</div></dialog>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

const $ = (selector) => document.querySelector(selector);
const world = $("#world"),
  dialog = $("#wish-dialog"),
  stage = $("#garden-stage");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const audio = new Audio(gift.music);
audio.loop = true;
audio.volume = 0.32;
audio.preload = "none";
let opened = false,
  ready = false,
  musicOn = false,
  musicDesired = false,
  resumeMusic = false,
  musicFailed = false;
let bloomTimer, toastTimer, lastFocus;
$(".scene-header").inert = true;
$(".scene-controls").inert = true;
$(".scene-heading").inert = true;
function toast(text) {
  $("#toast").textContent = text;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 3300);
}
function updateMusic() {
  const button = $("#sound");
  button.setAttribute("aria-pressed", String(musicOn));
  button.setAttribute("aria-label", musicOn ? "Tắt nhạc nền" : "Bật nhạc nền");
  button.classList.toggle("is-playing", musicOn);
  button.querySelector("span").textContent = musicOn
    ? "Nhạc đang bật"
    : "Nhạc nền";
}
async function playMusic(quiet = false) {
  if (musicFailed) {
    if (!quiet) toast("Chưa tải được nhạc. Bạn vẫn có thể ngắm hoa nhé.");
    return;
  }
  musicDesired = true;
  try {
    await audio.play();
    if (musicDesired && !document.hidden) musicOn = true;
    else audio.pause();
  } catch {
    musicDesired = false;
    if (!quiet) toast("Chạm lại nút nhạc để thử phát nhé.");
  }
  updateMusic();
}
function stopMusic() {
  musicDesired = false;
  musicOn = false;
  resumeMusic = false;
  audio.pause();
  updateMusic();
}
audio.addEventListener("error", () => {
  musicFailed = true;
  musicDesired = false;
  musicOn = false;
  updateMusic();
  if (opened) toast("Chưa tải được nhạc. Khu vườn vẫn đang nở hoa.");
});
$("#sound").addEventListener("click", () =>
  musicOn || musicDesired ? stopMusic() : playMusic(),
);
function startGarden() {
  clearTimeout(bloomTimer);
  world.classList.remove("growing", "ready");
  ready = false;
  // Restart the finite opening sequence; perpetual wind lives on separate groups.
  void world.offsetWidth;
  world.classList.add("opened", "growing");
  bloomTimer = setTimeout(
    () => {
      ready = true;
      world.classList.add("ready");
    },
    reduced.matches ? 50 : 5400,
  );
}
$("#open-gift").addEventListener("click", () => {
  if (opened) return;
  opened = true;
  $("#welcome").inert = true;
  $(".scene-heading").inert = false;
  startGarden();
  playMusic(true);
  setTimeout(
    () => {
      $("#welcome").hidden = true;
      $(".scene-header").inert = false;
      $(".scene-controls").inert = false;
      $("#read-wish").focus({ preventScroll: true });
    },
    reduced.matches ? 0 : 1000,
  );
});
$("#replay").addEventListener("click", () => {
  startGarden();
  if (reduced.matches)
    toast("Hoa đã nở. Thiết bị đang bật chế độ giảm chuyển động.");
});
$("#read-wish").addEventListener("click", () => {
  lastFocus = document.activeElement;
  dialog.showModal();
  dialog.querySelector(".dialog-close").focus({ preventScroll: true });
});
dialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () =>
  lastFocus?.focus({ preventScroll: true }),
);
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    dialog.close();
});

// Atmospheric depth: distant stars, warm fireflies, airborne pollen, falling petals.
// One 30fps loop, bounded particle counts, and no work while the tab is hidden.
const canvas = $("#atmosphere"),
  ctx = canvas.getContext("2d");
let width = 0,
  height = 0,
  stars = [],
  flies = [],
  petals = [],
  bursts = [],
  ripples = [],
  shooting = null;
let frame = 0,
  lastTime = 0,
  time = 0,
  lastShooting = 0,
  pointer = { x: 0, y: 0 },
  drift = { x: 0, y: 0 },
  attractor = null;
function resize() {
  width = innerWidth;
  height = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const small = width < 600;
  stars = Array.from({ length: small ? 42 : 85 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.85,
    r: 0.3 + Math.random() * 0.65,
    phase: Math.random() * 7,
  }));
  flies = Array.from({ length: small ? 18 : 32 }, (_, i) => ({
    x: width * (0.16 + Math.random() * 0.68),
    y: height * (0.28 + Math.random() * 0.64),
    phase: Math.random() * 7,
    r: 0.6 + Math.random() * 1.2,
    depth: 0.4 + Math.random() * 0.7,
    tint: i % 3,
  }));
  petals = Array.from({ length: small ? 4 : 7 }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    phase: i * 1.9,
    size: 3 + Math.random() * 3,
    speed: 7 + Math.random() * 10,
  }));
  if (reduced.matches) paint(0, 0);
}
function drawPetal(x, y, size, angle, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(0.45 + Math.abs(Math.sin(angle * 1.8)) * 0.55, 1);
  ctx.globalAlpha = alpha;
  const gradient = ctx.createLinearGradient(-size, -size, size, size);
  gradient.addColorStop(0, "#f1cad9");
  gradient.addColorStop(1, "#a06d91");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.bezierCurveTo(-size * 1.4, 0, -size * 0.8, -size * 1.7, 0, -size);
  ctx.bezierCurveTo(size * 0.9, -size * 0.6, size * 0.9, size * 0.2, 0, size);
  ctx.fill();
  ctx.restore();
}
function paint(t, dt) {
  ctx.clearRect(0, 0, width, height);
  for (const s of stars) {
    const alpha = 0.16 + (Math.sin(t * 0.0007 + s.phase) + 1) * 0.13;
    ctx.fillStyle = `rgba(190,213,207,${alpha})`;
    ctx.beginPath();
    ctx.arc(s.x + drift.x * 0.3, s.y + drift.y * 0.3, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const f of flies) {
    let x =
        f.x +
        Math.sin(t * 0.00035 * f.depth + f.phase) * 32 +
        drift.x * f.depth,
      y = f.y + Math.cos(t * 0.0004 + f.phase) * 24;
    if (attractor && opened && ready) {
      const dx = attractor.x - x,
        dy = attractor.y - y,
        distance = Math.hypot(dx, dy);
      if (distance < 180) {
        const strength = (1 - distance / 180) * 0.22;
        x += dx * strength;
        y += dy * strength;
      }
    }
    const alpha = 0.18 + (Math.sin(t * 0.0015 + f.phase) + 1) * 0.24;
    const color =
      f.tint === 0
        ? "245,207,154"
        : f.tint === 1
          ? "218,231,157"
          : "209,186,218";
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${color},.7)`;
    ctx.beginPath();
    ctx.arc(x, y, f.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  if (opened && ready && !reduced.matches) {
    for (const p of petals) {
      p.y += dt * 0.001 * p.speed;
      p.x += Math.sin(t * 0.0005 + p.phase) * dt * 0.006;
      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      drawPetal(
        p.x,
        p.y,
        p.size,
        Math.sin(t * 0.0007 + p.phase) * 1.2,
        0.18 + Math.sin(t * 0.001 + p.phase) * 0.06,
      );
    }
    if (t - lastShooting > 14000) {
      lastShooting = t;
      shooting = {
        x: width * (0.15 + Math.random() * 0.5),
        y: height * 0.1,
        start: t,
      };
    }
    if (shooting) {
      const p = (t - shooting.start) / 1100;
      if (p > 1) shooting = null;
      else {
        const x = shooting.x + p * 130,
          y = shooting.y + p * 65;
        const g = ctx.createLinearGradient(x - 70, y - 35, x, y);
        g.addColorStop(0, "#dfe9d700");
        g.addColorStop(1, `rgba(226,236,208,${Math.sin(p * Math.PI) * 0.5})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 70, y - 35);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }
  bursts = bursts.filter((p) => t - p.start < 1600);
  for (const p of bursts) {
    const q = (t - p.start) / 1600;
    const x = p.x + Math.cos(p.angle) * p.distance * q,
      y = p.y + Math.sin(p.angle) * p.distance * q - q * 20;
    ctx.fillStyle = `rgba(245,222,184,${(1 - q) * 0.8})`;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.1, (1 - q) * 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ripples = ripples.filter((r) => t - r.start < 1900);
  for (const r of ripples) {
    const q = (t - r.start) / 1900;
    ctx.strokeStyle = `rgba(197,218,179,${(1 - q) * 0.2})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, 8 + q * 95, 4 + q * 35, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}
function tick(now) {
  if (document.hidden || reduced.matches) return;
  if (now - lastTime >= 32) {
    const dt = Math.min(now - lastTime, 45);
    time += dt;
    lastTime = now;
    drift.x += (pointer.x - drift.x) * 0.035;
    drift.y += (pointer.y - drift.y) * 0.035;
    stage.style.setProperty("--parallax-x", `${drift.x * 0.3}px`);
    stage.style.setProperty("--parallax-y", `${drift.y * 0.15}px`);
    paint(time, dt);
  }
  frame = requestAnimationFrame(tick);
}
resize();
addEventListener("resize", resize);
frame = requestAnimationFrame(tick);
world.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch" || reduced.matches) return;
  pointer.x = (event.clientX / width - 0.5) * 20;
  pointer.y = (event.clientY / height - 0.5) * 14;
  attractor = { x: event.clientX, y: event.clientY };
});
world.addEventListener("pointerleave", () => {
  pointer.x = 0;
  pointer.y = 0;
  attractor = null;
});
world.addEventListener("pointerdown", (event) => {
  if (
    !opened ||
    !ready ||
    reduced.matches ||
    event.target.closest("button,dialog")
  )
    return;
  for (let i = 0; i < 18; i++)
    bursts.push({
      x: event.clientX,
      y: event.clientY,
      angle: (Math.PI * 2 * i) / 18,
      distance: 25 + Math.random() * 70,
      start: time,
    });
  if (bursts.length > 126) bursts = bursts.slice(-126);
  ripples.push({ x: event.clientX, y: event.clientY, start: time });
  if (ripples.length > 4) ripples = ripples.slice(-4);
});
document.addEventListener("visibilitychange", () => {
  world.classList.toggle("sleeping", document.hidden);
  cancelAnimationFrame(frame);
  if (document.hidden) {
    resumeMusic = musicDesired;
    audio.pause();
    musicOn = false;
    updateMusic();
  } else {
    lastTime = performance.now();
    if (!reduced.matches) frame = requestAnimationFrame(tick);
    if (resumeMusic) playMusic(true);
  }
});
reduced.addEventListener("change", () => {
  cancelAnimationFrame(frame);
  if (reduced.matches) {
    pointer.x = pointer.y = drift.x = drift.y = 0;
    stage.style.setProperty("--parallax-x", "0px");
    stage.style.setProperty("--parallax-y", "0px");
    if (opened) {
      ready = true;
      world.classList.add("ready");
    }
    paint(0, 0);
  } else {
    lastTime = performance.now();
    frame = requestAnimationFrame(tick);
  }
});
