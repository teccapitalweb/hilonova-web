const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const progress = document.querySelector(".scroll-progress");

const onScroll = () => {
  const top = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("scrolled", top > 20);
  progress.style.width = `${max > 0 ? (top / max) * 100 : 0}%`;
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

menuToggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const pathwayData = {
  operations: {
    number: "01",
    kicker: "Para supervisores y equipos de producción",
    title: "Convierte la experiencia en liderazgo medible.",
    copy: "Domina planeación, balanceo, supervisión de líneas, costos y métricas para operar con mayor control, productividad y claridad.",
    tags: ["Supervisión", "Planeación", "KPI", "Costeo"],
  },
  brand: {
    number: "02",
    kicker: "Para diseñadores y emprendedores textiles",
    title: "Pasa del concepto a una marca que sabe producir.",
    copy: "Integra patronaje, costeo, fichas técnicas, gestión de maquila y venta en línea para tomar decisiones con los pies en la operación.",
    tags: ["Patronaje", "Marca propia", "Producción", "Venta digital"],
  },
  quality: {
    number: "03",
    kicker: "Para inspectores, responsables y líderes de calidad",
    title: "Haz de la calidad un sistema, no una corrección tardía.",
    copy: "Construye criterios de inspección, aplica AQL, reduce mermas y fortalece la consistencia que exigen clientes y mercados de exportación.",
    tags: ["AQL", "Inspección", "Mermas", "Estandarización"],
  },
};

const panel = document.querySelector("#path-panel");
document.querySelectorAll("[data-path]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const data = pathwayData[tab.dataset.path];
    document.querySelectorAll("[data-path]").forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    panel.setAttribute("aria-labelledby", tab.id);
    panel.animate([{ opacity: .35, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 360, easing: "ease-out" });
    panel.querySelector("[data-path-number]").textContent = data.number;
    panel.querySelector("[data-path-kicker]").textContent = data.kicker;
    panel.querySelector("[data-path-title]").textContent = data.title;
    panel.querySelector("[data-path-copy]").textContent = data.copy;
    panel.querySelector("[data-path-tags]").innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join("");
  });
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;
    const tabs = [...document.querySelectorAll("[data-path]")];
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(tabs.indexOf(tab) + direction + tabs.length) % tabs.length];
    next.focus(); next.click();
  });
});

const track = document.querySelector("[data-course-track]");
const scrollCourses = (direction) => track?.scrollBy({ left: direction * Math.min(track.clientWidth * .82, 520), behavior: "smooth" });
document.querySelector("[data-slider-prev]")?.addEventListener("click", () => scrollCourses(-1));
document.querySelector("[data-slider-next]")?.addEventListener("click", () => scrollCourses(1));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion) {
  const visual = document.querySelector(".hero-visual");
  visual?.addEventListener("pointermove", (event) => {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    visual.querySelectorAll("[data-parallax]").forEach((item) => {
      const depth = Number(item.dataset.parallax);
      item.style.translate = `${x * 20 * depth}px ${y * 20 * depth}px`;
    });
  });
  visual?.addEventListener("pointerleave", () => visual.querySelectorAll("[data-parallax]").forEach((item) => { item.style.translate = "0 0"; }));

  const tilt = document.querySelector("[data-tilt]");
  tilt?.addEventListener("pointermove", (event) => {
    const rect = tilt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    tilt.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
  });
  tilt?.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
}

const canvas = document.querySelector(".thread-canvas");
const context = canvas?.getContext("2d");
if (canvas && context && !reducedMotion) {
  let width = 0, height = 0, frame = 0;
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth; height = canvas.clientHeight;
    canvas.width = width * ratio; canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const draw = () => {
    context.clearRect(0, 0, width, height);
    for (let line = 0; line < 7; line += 1) {
      context.beginPath();
      const base = height * (.16 + line * .115);
      for (let x = 0; x <= width; x += 24) {
        const y = base + Math.sin(x * .006 + frame * .009 + line) * (16 + line * 2);
        if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.strokeStyle = line % 2 ? "rgba(108,229,232,.09)" : "rgba(25,86,232,.12)";
      context.lineWidth = 1;
      context.stroke();
    }
    frame += 1;
    requestAnimationFrame(draw);
  };
  window.addEventListener("resize", resize);
  resize(); draw();
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
