const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const navLinks = [...document.querySelectorAll(".nav a")];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const active = `.nav a[href="#${entry.target.id}"]`;
      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      document.querySelector(active)?.setAttribute("aria-current", "page");
    }
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 },
);

navSections.forEach((section) => navObserver.observe(section));

const revealTargets = [
  ...document.querySelectorAll(
    ".hero-media, .hero-copy, .intro > div, .section-heading, .project, .skill-grid > div, .timeline-item, .contact > div",
  ),
];

revealTargets.forEach((target) => target.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  },
  { threshold: 0.16 },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const topics = ["知识图谱", "GraphRAG", "AI4SE", "VLA 模型", "中间件架构", "多模态检索"];
const topicRotator = document.querySelector("#topic-rotator");
let topicIndex = 0;

if (topicRotator && !prefersReducedMotion) {
  window.setInterval(() => {
    topicRotator.classList.add("is-changing");
    window.setTimeout(() => {
      topicIndex = (topicIndex + 1) % topics.length;
      topicRotator.textContent = topics[topicIndex];
      topicRotator.classList.remove("is-changing");
    }, 180);
  }, 2200);
}

const counters = [...document.querySelectorAll("[data-count]")];

const formatCount = (value) => new Intl.NumberFormat("zh-CN").format(value);

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatCount(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  },
  { threshold: 0.7 },
);

counters.forEach((counter) => counterObserver.observe(counter));

const filterButtons = [...document.querySelectorAll(".filter-button")];
const projects = [...document.querySelectorAll(".project")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    projects.forEach((project) => {
      const tracks = project.dataset.track?.split(" ") ?? [];
      const show = filter === "all" || tracks.includes(filter);
      project.classList.toggle("is-hidden", !show);
    });
  });
});

const canvas = document.querySelector("#knowledge-canvas");
const ctx = canvas?.getContext("2d");
const pointer = { x: 0, y: 0, active: false };
let canvasWidth = 0;
let canvasHeight = 0;
let nodes = [];
let animationFrame = 0;

const colors = ["#315f8b", "#21483b", "#a64d3d", "#c99c42"];

const resizeCanvas = () => {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvas.width = Math.max(1, Math.floor(canvasWidth * ratio));
  canvas.height = Math.max(1, Math.floor(canvasHeight * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(18, Math.min(44, Math.floor(canvasWidth / 34)));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: 2 + Math.random() * 2.4,
    color: colors[index % colors.length],
  }));
};

const drawNetwork = () => {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > canvasWidth) node.vx *= -1;
    if (node.y < 0 || node.y > canvasHeight) node.vy *= -1;

    if (pointer.active) {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 170) {
        node.x -= dx * 0.0015;
        node.y -= dy * 0.0015;
      }
    }
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > 150) continue;
      ctx.strokeStyle = `rgba(23, 32, 27, ${0.14 * (1 - distance / 150)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  for (const node of nodes) {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  }

  animationFrame = requestAnimationFrame(drawNetwork);
};

if (canvas && ctx && !prefersReducedMotion) {
  resizeCanvas();
  drawNetwork();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
} else if (animationFrame) {
  cancelAnimationFrame(animationFrame);
}
