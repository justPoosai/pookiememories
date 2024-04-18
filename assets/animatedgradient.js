const canvas = window.canvas;
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;
let diag = Math.hypot(canvas.width, canvas.height);

function resize() {
  const { innerWidth: width, innerHeight: height } = window;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  diag = Math.hypot(width * dpr, height * dpr);
}

function* createHues() {
  let hue = 0;
  while (true) {
    yield hue;
    if (hue++ > 359) {
      hue = 0;
    }
  }
}

const hues = createHues();

function gradient() {
  const { width, height } = canvas;
  const wc = width / 2;
  const hc = height / 2;
  /** @type {CanvasGradient} */
  const g = ctx.createRadialGradient(wc, hc, 0, wc, hc, diag);
  return g;
}

function animate() {
  const g = gradient();
  const hue = hues.next().value;
  for (let i = 0; i < 360; i++) {
    g.addColorStop(i / 360, `hsl(${i - hue}, 100%, 50%)`);
  }
  const fillStyle = ctx.fillStyle;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let fps = 1000 / 120;
let then = 0;
function loop(now) {
  if (now - then > fps) {
    then = now;
    animate();
  }

  requestAnimationFrame(loop);
}

function init() {
  resize();
  loop(0);
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);