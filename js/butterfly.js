const BUTTERFLY_COUNT = 7;

// Warna-warna lembut
const COLORS = [
  ['#f4a7c3', '#f9d0e0'], // pink
  ['#a8c8f0', '#cce0f8'], // biru muda
  ['#b8e0c8', '#d6f0e0'], // mint
  ['#f0d0a0', '#f8e8c8'], // krem
  ['#d4b0f0', '#e8d4f8'], // lavender
];

function createButterflySVG(primary, secondary) {
  return `
  <svg viewBox="0 0 40 36" xmlns="http://www.w3.org/2000/svg" width="40" height="36">
    <!-- sayap kiri atas -->
    <ellipse class="wing-left" cx="12" cy="10" rx="11" ry="9"
      fill="${primary}" fill-opacity="0.82"
      style="transform-origin: 20px 18px; animation: flapLeft var(--flap) ease-in-out infinite;" />
    <!-- sayap kiri bawah -->
    <ellipse class="wing-left" cx="11" cy="24" rx="8" ry="7"
      fill="${secondary}" fill-opacity="0.75"
      style="transform-origin: 20px 18px; animation: flapLeft var(--flap) ease-in-out infinite;" />
    <!-- sayap kanan atas -->
    <ellipse class="wing-right" cx="28" cy="10" rx="11" ry="9"
      fill="${primary}" fill-opacity="0.82"
      style="transform-origin: 20px 18px; animation: flapRight var(--flap) ease-in-out infinite;" />
    <!-- sayap kanan bawah -->
    <ellipse class="wing-right" cx="29" cy="24" rx="8" ry="7"
      fill="${secondary}" fill-opacity="0.75"
      style="transform-origin: 20px 18px; animation: flapRight var(--flap) ease-in-out infinite;" />
    <!-- badan -->
    <ellipse cx="20" cy="18" rx="2" ry="9" fill="#7a5c3a" fill-opacity="0.7" />
    <!-- antena kiri -->
    <line x1="19" y1="9" x2="14" y2="3" stroke="#7a5c3a" stroke-width="0.8" stroke-opacity="0.7"/>
    <circle cx="14" cy="3" r="1" fill="#7a5c3a" fill-opacity="0.7"/>
    <!-- antena kanan -->
    <line x1="21" y1="9" x2="26" y2="3" stroke="#7a5c3a" stroke-width="0.8" stroke-opacity="0.7"/>
    <circle cx="26" cy="3" r="1" fill="#7a5c3a" fill-opacity="0.7"/>
  </svg>`;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Butterfly {
  constructor(container) {
    this.container = container;
    this.el = document.createElement('div');
    this.el.className = 'butterfly';

    // Pilih warna acak
    const [primary, secondary] = COLORS[Math.floor(Math.random() * COLORS.length)];

    // Kecepatan kepak acak per kupu-kupu
    const flapDuration = rand(0.32, 0.55).toFixed(2) + 's';
    this.el.style.setProperty('--flap', flapDuration);

    this.el.innerHTML = createButterflySVG(primary, secondary);

    // Ukuran acak
    this.size = rand(28, 48);
    this.el.style.width = this.size + 'px';
    this.el.style.height = this.size + 'px';

    // Posisi awal acak
    this.x = rand(5, 90);
    this.y = rand(10, 80);

    // Arah & kecepatan terbang
    this.vx = rand(0.08, 0.18) * (Math.random() < 0.5 ? 1 : -1);
    this.vy = rand(0.06, 0.14) * (Math.random() < 0.5 ? 1 : -1);

    // Drift: target acak yang berubah perlahan — sebar ke seluruh layar
    this.tx = rand(5, 92);
    this.ty = rand(5, 88);
    this.driftTimer = 0;
    this.driftInterval = rand(120, 240);

    // Rotasi lambat mengikuti arah
    this.angle = 0;

    // Delay mulai agar tidak semua muncul serentak
    this.el.style.opacity = '0';
    setTimeout(() => {
      this.el.style.transition = 'opacity 1s';
      this.el.style.opacity = '1';
    }, rand(0, 2000));

    container.appendChild(this.el);
  }

  update() {
    this.driftTimer++;

    // Ganti target drift secara berkala
    if (this.driftTimer >= this.driftInterval) {
      this.tx = rand(5, 92);
      this.ty = rand(5, 85);
      this.driftTimer = 0;
      this.driftInterval = rand(180, 360);
    }

    // Tarik perlahan ke arah target
    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    this.vx += dx * 0.0012;
    this.vy += dy * 0.0012;

    // Batasi kecepatan
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const maxSpeed = 0.28;
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Pantul di tepi
    if (this.x < 2)  { this.x = 2;  this.vx = Math.abs(this.vx); }
    if (this.x > 95) { this.x = 95; this.vx = -Math.abs(this.vx); }
    if (this.y < 2)  { this.y = 2;  this.vy = Math.abs(this.vy); }
    if (this.y > 90) { this.y = 90; this.vy = -Math.abs(this.vy); }

    // Rotasi mengikuti arah gerak (miring sedikit)
    const targetAngle = Math.atan2(this.vy, this.vx) * (180 / Math.PI) * 0.3;
    this.angle += (targetAngle - this.angle) * 0.05;

    // Flip horizontal jika bergerak ke kiri
    const flipX = this.vx < 0 ? -1 : 1;

    this.el.style.transform =
      `translate(${this.x}vw, ${this.y}vh) rotate(${this.angle}deg) scaleX(${flipX})`;
  }
}

// Init
const container = document.getElementById('butterflies');
const butterflies = Array.from({ length: BUTTERFLY_COUNT }, () => new Butterfly(container));

function loop() {
  butterflies.forEach(b => b.update());
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
