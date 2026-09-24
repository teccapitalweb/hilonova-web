const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const progress = document.querySelector(".scroll-progress");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.count);
    const suffix = entry.target.dataset.suffix || "";
    const startedAt = performance.now();
    const tick = (now) => {
      const progressValue = Math.min(1, (now - startedAt) / 1000);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      entry.target.textContent = `${Math.round(target * eased).toString().padStart(target < 10 ? 2 : 1, "0")}${suffix}`;
      if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: .7 });
document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

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

const courses = {
  supervisor: {
    index: "01", category: "Operaciones", title: "Supervisor de producción en confección",
    image: "assets/course-supervisor.webp", pdf: "assets/programas/supervisor-produccion.pdf",
    objective: "Desarrollar competencias para coordinar líneas de confección, administrar personal, cumplir programas de producción y controlar indicadores de productividad y calidad.",
    audience: "Supervisores, líderes de línea, jefes de producción, ingenieros industriales y textiles, técnicos de manufactura y personal que busca ascender.",
    modules: ["Funciones del supervisor", "Control de producción", "Indicadores KPI", "Manejo operativo del personal", "Mejora continua"],
  },
  quality: {
    index: "02", category: "Calidad", title: "Control de calidad en confección",
    image: "assets/course-control-calidad.webp", pdf: "assets/programas/control-calidad-confeccion.pdf",
    objective: "Implementa controles durante la confección y detecta oportunamente defectos que generan reprocesos, devoluciones o pérdidas económicas.",
    audience: "Inspectores de calidad, supervisores de producción, responsables de maquila, ingenieros textiles, diseñadores y propietarios de talleres.",
    modules: ["Fundamentos del control de calidad", "Defectos de confección", "Inspección durante el proceso", "Introducción al sistema AQL", "Inspección final y liberación"],
  },
  costing: {
    index: "03", category: "Rentabilidad", title: "Costeo real de prendas para maquila",
    image: "assets/course-costeo.webp", pdf: "assets/programas/costeo-real-prendas.pdf",
    objective: "Calcula de manera estructurada el costo real de fabricación considerando materiales, mano de obra, tiempos, procesos externos, desperdicios y gastos asociados.",
    audience: "Propietarios de talleres y marcas, encargados de costos, diseñadores, ingenieros textiles, compradores, emprendedores y responsables de producción.",
    modules: ["Estructura del costo de una prenda", "Costeo de telas y materiales", "Costeo de confección", "Costos adicionales", "Integración del precio"],
  },
  planning: {
    index: "04", category: "Planeación", title: "Planeación y programación de producción",
    image: "assets/course-planeacion.webp", pdf: "assets/programas/planeacion-produccion.pdf",
    objective: "Organiza órdenes, recursos, materiales y capacidades para cumplir fechas de entrega y aprovechar mejor los recursos disponibles.",
    audience: "Planeadores de producción, jefes de taller, supervisores, ingenieros, responsables de maquila, emprendedores y propietarios de fábricas de ropa.",
    modules: ["Fundamentos de planeación", "Cálculo de capacidad", "Programación de órdenes", "Seguimiento de producción", "Tablero de control"],
  },
  waste: {
    index: "05", category: "Eficiencia", title: "Reducción de mermas en corte y confección",
    image: "assets/reduccion-mermas.webp", pdf: "assets/programas/reduccion-mermas.pdf",
    objective: "Identifica fuentes de desperdicio en corte y confección y aplica controles para mejorar el aprovechamiento de materiales y reducir costos.",
    audience: "Jefes de corte, supervisores, ingenieros, responsables de costos, patronistas, propietarios de talleres y personal de producción.",
    modules: ["Identificación de las mermas", "Consumo y rendimiento de tela", "Optimización de trazo y corte", "Mermas durante confección", "Sistema de control de desperdicios"],
  },
  maquila: {
    index: "06", category: "Maquila", title: "Supervisión y control de maquilas de confección",
    image: "assets/supervision-maquilas.webp", pdf: "assets/programas/supervision-control-maquilas.pdf",
    objective: "Planea, supervisa y controla procesos de maquila asegurando especificaciones, calidad, cantidades, tiempos y fechas de entrega.",
    audience: "Supervisores de maquila, jefes de producción, encargados de talleres, ingenieros, responsables de calidad, emprendedores y marcas de ropa.",
    modules: ["Planeación y organización de una maquila", "Control de materiales e inventarios", "Supervisión de la producción", "Control de calidad de la maquila", "Entrega y evaluación del proveedor"],
  },
};

const courseDialog = document.querySelector("[data-course-dialog]");
let lastFocusedCourse = null;
const openCourse = (courseKey, trigger) => {
  const course = courses[courseKey];
  if (!course || !courseDialog) return;
  lastFocusedCourse = trigger;
  courseDialog.querySelector("[data-dialog-index]").textContent = `${course.index} / PROGRAMA`;
  courseDialog.querySelector("[data-dialog-category]").textContent = course.category;
  courseDialog.querySelector("[data-dialog-title]").textContent = course.title;
  courseDialog.querySelector("[data-dialog-objective]").textContent = course.objective;
  courseDialog.querySelector("[data-dialog-audience]").textContent = course.audience;
  const image = courseDialog.querySelector("[data-dialog-image]"); image.src = course.image; image.alt = course.title;
  courseDialog.querySelector("[data-dialog-modules]").innerHTML = course.modules.map((module) => `<li>${module}</li>`).join("");
  courseDialog.querySelector("[data-dialog-pdf]").href = course.pdf;
  courseDialog.setAttribute("aria-hidden", "false");
  document.body.classList.add("dialog-open");
  courseDialog.querySelector("[data-dialog-close]").focus();
};
const closeCourse = () => {
  courseDialog?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("dialog-open");
  lastFocusedCourse?.focus();
};
document.querySelectorAll(".course-card[data-course]").forEach((card) => {
  card.addEventListener("click", () => openCourse(card.dataset.course, card));
  card.addEventListener("keydown", (event) => {
    if (["Enter", " "].includes(event.key)) { event.preventDefault(); openCourse(card.dataset.course, card); }
  });
});
document.querySelectorAll("[data-dialog-close]").forEach((button) => button.addEventListener("click", closeCourse));
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && courseDialog?.getAttribute("aria-hidden") === "false") closeCourse(); });

document.querySelector("[data-year]").textContent = new Date().getFullYear();
