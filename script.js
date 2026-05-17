/* ═══════════════════════════════════════════════════════════
   NOSSO UNIVERSO — script.js
   Estrelas, corações pixel, digitação, lightbox, scroll fade
   ═══════════════════════════════════════════════════════════ */

"use strict";

/* ── PERSONALIZAÇÃO ─────────────────────────────────────── */
// 👇 Altere os nomes e o texto aqui!
const CONFIG = {
  namePerson1:   "KaKá",       // Nome exibido no hero (esquerda)
  namePerson2:   "Ariel",     // Nome exibido no hero (direita)
  footerSender:  "Ariel",     // Nome que assina no rodapé

  // Texto que aparece digitado no subtítulo do hero:
  heroText: "Cada foto aqui guarda um momento que meu coração escolheu guardar para sempre — porque com você, até o tempo quer parar.",

  // Velocidade de digitação em milissegundos por caractere:
  typeSpeed: 45,
};

/* ══════════════════════════════════════════════════════════
   1. PERSONALIZAR NOMES NA PÁGINA
   ══════════════════════════════════════════════════════════ */
function applyNames() {
  const nameLeft   = document.getElementById("nameLeft");
  const nameRight  = document.getElementById("nameRight");
  const footerName = document.getElementById("footerName");

  if (nameLeft)   nameLeft.textContent  = CONFIG.namePerson1;
  if (nameRight)  nameRight.textContent = CONFIG.namePerson2;
  if (footerName) footerName.textContent = CONFIG.footerSender;
}

/* ══════════════════════════════════════════════════════════
   2. CANVAS DE ESTRELAS ANIMADAS
   ══════════════════════════════════════════════════════════ */
function initStars() {
  const canvas = document.getElementById("starsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let stars = [];
  const STAR_COUNT = 200;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x:         Math.random() * canvas.width,
        y:         Math.random() * canvas.height,
        r:         Math.random() * 1.5 + 0.3,          // raio 0.3–1.8px
        alpha:     Math.random(),
        alphaDir:  Math.random() > 0.5 ? 1 : -1,
        speed:     Math.random() * 0.006 + 0.002,      // velocidade do brilho
        color:     pickStarColor(),
      });
    }
  }

  function pickStarColor() {
    const colors = [
      "255,255,255",   // branco
      "255,230,230",   // rosado
      "200,220,255",   // azulado
      "255,255,200",   // amarelado
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gradiente de fundo (céu estrelado)
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height * 0.3, 0,
      canvas.width / 2, canvas.height * 0.3, canvas.width * 0.7
    );
    grad.addColorStop(0,   "rgba(8,13,32,0)");
    grad.addColorStop(1,   "rgba(4,5,15,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar estrelas
    stars.forEach(star => {
      // Piscar suavemente
      star.alpha += star.speed * star.alphaDir;
      if (star.alpha >= 1)   { star.alpha = 1;   star.alphaDir = -1; }
      if (star.alpha <= 0.1) { star.alpha = 0.1; star.alphaDir = 1;  }

      // Glow suave
      ctx.save();
      const glowR = star.r * 3;
      const glowGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowR);
      glowGrad.addColorStop(0,   `rgba(${star.color},${star.alpha * 0.6})`);
      glowGrad.addColorStop(1,   `rgba(${star.color},0)`);
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(star.x, star.y, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Núcleo da estrela
      ctx.fillStyle = `rgba(${star.color},${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(drawStars);
  }

  window.addEventListener("resize", resize);
  resize();
  drawStars();
}

/* ══════════════════════════════════════════════════════════
   3. CORAÇÕES PIXEL ART SUBINDO
   ══════════════════════════════════════════════════════════ */
function initPixelHearts() {
  const container = document.getElementById("heartsContainer");
  if (!container) return;

  // Pixel art do coração: grid 12×12 em SVG
  function createHeartSVG(color, size) {
    // Mapa de pixels do coração (1=preenchido, 0=vazio)
    const map = [
      [0,0,1,1,0,0,0,1,1,0,0,0],
      [0,1,1,1,1,0,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
    ];

    const cols = map[0].length;
    const rows = map.length;
    const px   = size / cols;  // tamanho de cada "pixel"

    let rects = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (map[r][c]) {
          rects += `<rect x="${c * px}" y="${r * px}" width="${px}" height="${px}" fill="${color}"/>`;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * (rows/cols)}" viewBox="0 0 ${cols * px} ${rows * px}" style="image-rendering:pixelated">${rects}</svg>`;
  }

  const COLORS = [
    "#e8738a", // rosa médio
    "#f4a0b5", // rosa claro
    "#c0254a", // carmesim
    "#ff6b8a", // rosa vivo
    "#ffb3c6", // rosa pálido
  ];

  function spawnHeart() {
    const size      = Math.random() * 14 + 10;      // 10–24px
    const color     = COLORS[Math.floor(Math.random() * COLORS.length)];
    const left      = Math.random() * 100;            // % horizontal
    const duration  = Math.random() * 12 + 10;       // 10–22s
    const drift     = (Math.random() - 0.5) * 120;   // desvio horizontal
    const delay     = Math.random() * 5;

    const el = document.createElement("div");
    el.classList.add("pixel-heart");
    el.style.cssText = `
      left: ${left}%;
      --drift: ${drift}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: 0;
    `;
    el.innerHTML = createHeartSVG(color, size);
    container.appendChild(el);

    // Remover após a animação (evitar DOM infinito)
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, (duration + delay) * 1000 + 500);
  }

  // Spawn inicial e contínuo
  for (let i = 0; i < 12; i++) spawnHeart();
  setInterval(spawnHeart, 1200);
}

/* ══════════════════════════════════════════════════════════
   4. EFEITO DE DIGITAÇÃO (TYPEWRITER) NO HERO
   ══════════════════════════════════════════════════════════ */
function initTypewriter() {
  const el   = document.getElementById("heroSubtitle");
  if (!el) return;

  const text  = CONFIG.heroText;
  let   index = 0;

  // Pequeno delay antes de começar
  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = text.slice(0, index);
      index++;
      if (index > text.length) {
        clearInterval(interval);
        el.classList.add("done"); // remove o cursor piscante
      }
    }, CONFIG.typeSpeed);
  }, 1400);
}

/* ══════════════════════════════════════════════════════════
   5. LIGHTBOX
   ══════════════════════════════════════════════════════════ */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lbImg    = document.getElementById("lightboxImg");
  const lbCap    = document.getElementById("lightboxCaption");
  const lbClose  = document.getElementById("lightboxClose");

  if (!lightbox) return;

  // Abrir ao clicar em um polaroid
  document.querySelectorAll(".polaroid").forEach(polaroid => {
    polaroid.addEventListener("click", () => {
      const img     = polaroid.querySelector("img");
      const caption = polaroid.dataset.caption || polaroid.querySelector(".polaroid-caption")?.textContent || "";

      lbImg.src           = img.src;
      lbImg.alt           = img.alt;
      lbCap.textContent   = caption;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Fechar ao clicar no fundo ou no ×
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });
}

/* ══════════════════════════════════════════════════════════
   6. FADE-IN AO ROLAR A PÁGINA (IntersectionObserver)
   ══════════════════════════════════════════════════════════ */
function initScrollFade() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animar apenas uma vez
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   7. BOTÃO DE MÚSICA
   ══════════════════════════════════════════════════════════ */
  function initMusic() {
  const btn   = document.getElementById("musicBtn");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio) return;

  let playing = false;

  btn.addEventListener("click", () => {
    if (playing) {
      audio.pause();
      btn.classList.remove("playing");
      btn.title = "Tocar música";
    } else {
      audio.play().catch(() => {
        // Navegador bloqueou autoplay — ok, usuário pode tentar novamente
        console.info("Autoplay bloqueado. Toque novamente.");
      });
      btn.classList.add("playing");
      btn.title = "Pausar música";
    }
    playing = !playing;
  });
}

/* ══════════════════════════════════════════════════════════
   8. ROTAÇÃO ALEATÓRIA EXTRA NOS POLAROIDS (ao carregar)
   ══════════════════════════════════════════════════════════ */
function randomizePolaroidRotation() {
  document.querySelectorAll(".polaroid").forEach(p => {
    // Pega a rotação base do inline style e adiciona variação mínima
    const base = parseFloat(getComputedStyle(p).getPropertyValue("--rot")) || 0;
    const extra = (Math.random() - 0.5) * 0.8; // ±0.4 graus
    p.style.setProperty("--rot", `${(base + extra).toFixed(2)}deg`);
    p.style.transform = `rotate(${(base + extra).toFixed(2)}deg)`;
  });
}

/* ══════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  applyNames();
  initStars();
  initPixelHearts();
  initTypewriter();
  initLightbox();
  initScrollFade();
  initMusic();
  randomizePolaroidRotation();

  console.log(
    "%c💖 Nosso Universo",
    "font-family:cursive;font-size:22px;color:#e8738a;"
  );
  console.log(
    "%cFeito com amor ✨",
    "font-family:cursive;font-size:14px;color:#f4a0b5;"
  );
});
