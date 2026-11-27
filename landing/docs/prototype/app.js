/*
  Prototipo de la landing de Nativa 360.
  Simula las respuestas de la API (GET /negocio, /productos/destacados,
  /promociones, /eventos y /visitas-doctor) con datos de ejemplo.

  Estados de demostración (agregar a la dirección):
    ?demo=error  → la API no responde (escenarios de error de HU-01, HU-16, HU-20 y HU-21)
    ?demo=vacio  → no hay destacados, novedades ni visitas
*/

// Enlace al prototipo de la tienda, dentro del mismo repo central.
const STORE_URL = "../../../e-com/docs/prototype/index.html";

// Datos de respaldo: se usan si la API no responde (HU-01 y HU-17).
const FALLBACK_BUSINESS = {
  telefono: "2771-0000",
  whatsapp: "8888-7777",
  direccion: "50 m este de la Municipalidad de Pérez Zeledón",
};

const MOCK_API = {
  negocio: {
    descripcion:
      "Suplementos, vitaminas, productos naturales y cuidado personal, con la asesoría de personas que de verdad te escuchan.",
    direccion: "50 m este de la Municipalidad de Pérez Zeledón",
    telefono: "2771-1234",
    whatsapp: "8888-7777",
    horario: [
      { dias: "Lunes a viernes", numeros: [1, 2, 3, 4, 5], abre: 8, cierra: 18 },
      { dias: "Sábado", numeros: [6], abre: 8, cierra: 16 },
      { dias: "Domingo", numeros: [0], abre: null, cierra: null },
    ],
    instagramUrl: "https://www.instagram.com/",
    facebookUrl: "https://www.facebook.com/",
  },
  destacados: [
    {
      id: 1,
      nombre: "Omega 3",
      categoria: "Vitaminas",
      descripcion: "Aceite de pescado de alta pureza, 60 cápsulas blandas.",
      precio: 8000,
      arte: { forma: "frasco", color: "#2b5c9e", etiqueta: "OMEGA 3" },
      tinte: "#eaf2fb",
    },
    {
      id: 2,
      nombre: "Vitamina C 1000 mg",
      categoria: "Vitaminas",
      descripcion: "Refuerza tus defensas todos los días. Frasco de 100 tabletas.",
      precio: 6500,
      arte: { forma: "frasco", color: "#e98a2c", etiqueta: "VIT C" },
      tinte: "#fdf1e4",
    },
    {
      id: 3,
      nombre: "Spirulina en polvo",
      categoria: "Superalimentos",
      descripcion: "Proteína vegetal y hierro para tus batidos, 250 g.",
      precio: 9500,
      arte: { forma: "bolsa", color: "#3a9a5b", etiqueta: "SPIRULINA" },
      tinte: "#e4f4ea",
    },
    {
      id: 4,
      nombre: "Té de manzanilla",
      categoria: "Tés e infusiones",
      descripcion: "Infusión relajante para cerrar el día, caja de 25 bolsitas.",
      precio: 2500,
      arte: { forma: "caja", color: "#d9b23b", etiqueta: "MANZANILLA" },
      tinte: "#fbf5e1",
    },
  ],
  promociones: [
    {
      titulo: "Vitamina C 1000 mg",
      descuento: 10,
      descripcion: "Cuidá tus defensas en temporada de lluvias con un precio especial.",
      hasta: "2026-11-30",
      arte: { forma: "frasco", color: "#e98a2c", etiqueta: "VIT C" },
    },
  ],
  eventos: [
    {
      titulo: "Charla de alimentación consciente",
      fecha: "2026-12-05",
      horario: "5:00 p. m. a 6:30 p. m.",
      ubicacion: "Local de Nativa 360",
    },
    {
      titulo: "Feria de productos orgánicos",
      fecha: "2026-12-14",
      horario: "9:00 a. m. a 2:00 p. m.",
      ubicacion: "Frente a la tienda",
    },
  ],
  visitas: [
    {
      doctor: "Dr. Luis Vargas",
      especialidad: "Medicina natural",
      fecha: "2026-12-12",
      horario: "9:00 a. m. a 12:00 p. m.",
    },
    {
      doctor: "Dra. Carolina Mora",
      especialidad: "Nutrición",
      fecha: "2026-12-19",
      horario: "1:00 p. m. a 4:00 p. m.",
    },
  ],
};

const CATEGORIES = [
  { nombre: "Vitaminas", icono: "pill" },
  { nombre: "Superalimentos", icono: "sprout" },
  { nombre: "Tés e infusiones", icono: "cup" },
  { nombre: "Cuidado personal", icono: "sparkles" },
  { nombre: "Deportistas", icono: "dumbbell" },
];

/* ---------- Íconos de línea ---------- */

const ICONS = {
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  leaf: [
    "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
    "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  ],
  chat: [
    "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  ],
  sprout: [
    "M7 20h10",
    "M10 20c5.5-2.5.8-6.4 3-10",
    "M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z",
    "M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z",
  ],
  heart: [
    "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
  ],
  bag: ["M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", "M3 6h18", "M16 10a4 4 0 0 1-8 0"],
  stethoscope: [
    "M5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 12 0V4a2 2 0 0 0-2-2h-1",
    "M8 15v1a6 6 0 0 0 12 0v-4",
    "M20 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  ],
  card: ["M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "M2 10h20"],
  gift: [
    "M20 12v10H4V12",
    "M2 7h20v5H2z",
    "M12 22V7",
    "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z",
    "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  ],
  pin: ["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", "M12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"],
  phone: [
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  ],
  clock: ["M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z", "M12 6v6l4 2"],
  calendar: [
    "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    "M16 2v4M8 2v4M3 10h18",
  ],
  external: [
    "M15 3h6v6",
    "M10 14 21 3",
    "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  ],
  instagram: [
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z",
    "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
    "M17.5 6.5h.01",
  ],
  facebook: ["M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"],
  pill: ["m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z", "m8.5 8.5 7 7"],
  cup: [
    "M17 8h1a4 4 0 1 1 0 8h-1",
    "M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z",
    "M6 2v2M10 2v2M14 2v2",
  ],
  sparkles: ["M12 3l1.9 5.8L20 10.5l-6.1 1.7L12 18l-1.9-5.8L4 10.5l6.1-1.7z", "M19 3v4M21 5h-4"],
  dumbbell: [
    "M6.5 6.5l11 11",
    "M21 21l-1-1",
    "M3 3l1 1",
    "M18 22l4-4",
    "M2 6l4-4",
    "M3 10l7-7",
    "M14 21l7-7",
  ],
};

const SVG_NS = "http://www.w3.org/2000/svg";

function icon(name) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  for (const d of ICONS[name] ?? []) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]:empty").forEach((slot) => {
    slot.append(icon(slot.dataset.icon));
  });
}

/* ---------- Ilustraciones de producto (SVG) ---------- */

const BODIES = {
  // Frasco de cápsulas o tabletas
  frasco: (color) => `
    <rect x="34" y="8" width="52" height="22" rx="6" fill="#1b2b44"/>
    <rect x="34" y="24" width="52" height="6" fill="#0f1c2e" opacity=".4"/>
    <rect x="22" y="30" width="76" height="122" rx="20" fill="${color}"/>
    <rect x="22" y="30" width="18" height="122" rx="9" fill="#fff" opacity=".18"/>`,
  // Bolsa de pie (doypack)
  bolsa: (color) => `
    <path d="M26 18h68l8 128a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8z" fill="${color}"/>
    <rect x="26" y="18" width="68" height="12" fill="#000" opacity=".12"/>
    <path d="M26 18h12l-6 136h-6a8 8 0 0 1-8-8z" fill="#fff" opacity=".16"/>`,
  // Caja de té
  caja: (color) => `
    <path d="M24 40 44 22h68l-20 18z" fill="${color}" opacity=".7"/>
    <path d="M92 40l20-18v112l-20 18z" fill="${color}" opacity=".85"/>
    <rect x="24" y="40" width="68" height="112" rx="4" fill="${color}"/>`,
};

const LABEL_LAYOUT = {
  frasco: { x: 22, y: 66, w: 76, h: 58, cx: 60 },
  bolsa: { x: 24, y: 62, w: 72, h: 62, cx: 60 },
  caja: { x: 30, y: 70, w: 56, h: 56, cx: 58 },
};

function productArt({ forma, color, etiqueta }) {
  const layout = LABEL_LAYOUT[forma];
  const label = `
    <rect x="${layout.x}" y="${layout.y}" width="${layout.w}" height="${layout.h}" rx="6" fill="#fff"/>
    <path d="M${layout.cx - 5} ${layout.y + 22}c0-6 4-10 11-11-1 7-5 11-11 11Zm0 0c2-3 4-5 7-7"
      fill="none" stroke="#3a9a5b" stroke-width="2" stroke-linecap="round"/>
    <text x="${layout.cx}" y="${layout.y + 38}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif"
      font-size="7" font-weight="700" fill="#55657d" letter-spacing="1.5">NATIVA 360</text>
    <text x="${layout.cx}" y="${layout.y + 51}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif"
      font-size="${etiqueta.length > 8 ? 8 : 11}" font-weight="800" fill="#163b6e">${etiqueta}</text>`;

  const wrapper = document.createElement("span");
  wrapper.innerHTML = `<svg class="product-art" viewBox="0 0 120 160" aria-hidden="true">${BODIES[forma](color)}${label}</svg>`;
  return wrapper.firstElementChild;
}

/* ---------- Utilidades ---------- */

const demo = new URLSearchParams(window.location.search).get("demo");

/** Simula una llamada a la API con un pequeño retraso. */
function fetchMock(key) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (demo === "error") {
        reject(new Error("La API no responde"));
        return;
      }
      const data = MOCK_API[key];
      resolve(demo === "vacio" && Array.isArray(data) ? [] : data);
    }, 500);
  });
}

const formatPrice = (amount) => `₡${amount.toLocaleString("es-CR").replace(/,/g, " ")}`;

const toDate = (iso) => new Date(`${iso}T12:00:00`);

const formatLongDate = (iso) =>
  toDate(iso).toLocaleDateString("es-CR", { day: "numeric", month: "long" });

const formatShortMonth = (iso) =>
  toDate(iso).toLocaleDateString("es-CR", { month: "short" }).replace(".", "");

const formatHour = (hour) => {
  const suffix = hour < 12 ? "a. m." : "p. m.";
  const value = hour % 12 === 0 ? 12 : hour % 12;
  return `${value}:00 ${suffix}`;
};

/** HU-17: convierte "8888-7777" en el enlace https://wa.me/50688887777 */
function toWhatsAppUrl(number) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 8 ? `506${digits}` : digits}`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function withIcon(name, className) {
  const slot = el("span", className);
  slot.append(icon(name));
  return slot;
}

function hideSection(name) {
  document.querySelector(`[data-section="${name}"]`).hidden = true;
  const link = document.querySelector(`[data-section-link="${name}"]`);
  if (link) link.hidden = true;
}

function showSkeletons(container, count, modifier = "") {
  container.replaceChildren(
    ...Array.from({ length: count }, () => el("div", `skeleton ${modifier}`.trim())),
  );
}

/* ---------- HU-01, HU-17 y HU-18: negocio, WhatsApp y redes ---------- */

function renderHours(schedule) {
  const box = document.querySelector("[data-hours]");
  if (!schedule?.length) {
    box.hidden = true; // HU-01 negativo: sin horario no se muestra la tarjeta vacía.
    return;
  }
  const now = new Date();
  const today = schedule.find((row) => row.numeros.includes(now.getDay()));
  const hour = now.getHours();
  const open = today?.abre != null && hour >= today.abre && hour < today.cierra;

  const status = document.querySelector("[data-open-status]");
  status.textContent = open ? `Abierto · cierra ${formatHour(today.cierra)}` : "Cerrado ahora";
  status.className = `status ${open ? "status--open" : "status--closed"}`;

  document.querySelector("[data-hours-list]").replaceChildren(
    ...schedule.map((row) => {
      const item = el("div", row === today ? "hours__row hours__row--today" : "hours__row");
      const hours =
        row.abre == null ? "Cerrado" : `${formatHour(row.abre)} – ${formatHour(row.cierra)}`;
      item.append(el("dt", "", row.dias), el("dd", "", hours));
      return item;
    }),
  );
  box.hidden = false;
}

function renderSocial(business) {
  // HU-18: solo se muestran las redes que tienen enlace configurado.
  const networks = [
    { name: "Instagram", url: business.instagramUrl, icon: "instagram" },
    { name: "Facebook", url: business.facebookUrl, icon: "facebook" },
  ].filter((network) => network.url);

  document.querySelectorAll("[data-social]").forEach((list) => {
    list.replaceChildren(
      ...networks.map((network) => {
        const link = el("a");
        link.href = network.url;
        link.target = "_blank";
        link.rel = "noopener";
        link.setAttribute("aria-label", `${network.name} de Nativa 360 (abre en otra pestaña)`);
        link.append(icon(network.icon), el("span", "", network.name));
        const item = el("li");
        item.append(link);
        return item;
      }),
    );
    list.hidden = networks.length === 0;
  });
}

function renderBusiness(business) {
  document.querySelectorAll("[data-business]").forEach((node) => {
    const value = business[node.dataset.business];
    node.textContent = value ?? "";
    node.hidden = !value;
  });

  document.querySelectorAll("[data-phone-link]").forEach((link) => {
    link.textContent = business.telefono;
    link.href = `tel:+506${business.telefono.replace(/\D/g, "")}`;
  });

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    link.href = toWhatsAppUrl(business.whatsapp);
  });

  renderHours(business.horario);
  renderSocial(business);
}

/* ---------- HU-16: productos destacados ---------- */

function renderFeatured(products) {
  if (products.length === 0) {
    hideSection("destacados");
    return;
  }
  document.querySelector("[data-featured]").replaceChildren(
    ...products.map((product) => {
      const card = el("a", "product reveal");
      card.href = `${STORE_URL}#/productos/${product.id}`;
      card.setAttribute("aria-label", `${product.nombre}, ${formatPrice(product.precio)}`);

      const media = el("div", "product__media");
      media.style.setProperty("--product-tint", product.tinte);
      media.append(el("span", "product__badge", product.categoria), productArt(product.arte));

      const footer = el("div", "product__footer");
      footer.append(
        el("span", "product__price", formatPrice(product.precio)),
        withIcon("arrow", "product__go"),
      );

      const body = el("div", "product__body");
      body.append(
        el("h3", "product__title", product.nombre),
        el("p", "product__text", product.descripcion),
        footer,
      );

      card.append(media, body);
      return card;
    }),
  );
  observeReveal();
}

/* ---------- HU-21: promociones y eventos vigentes ---------- */

function promoCard(promo) {
  const card = el("article", "promo reveal");
  const text = el("div");
  const until = el("span", "promo__until");
  until.append(
    icon("calendar"),
    document.createTextNode(`Hasta el ${formatLongDate(promo.hasta)}`),
  );
  text.append(
    el("p", "promo__discount", `-${promo.descuento} %`),
    el("h3", "promo__title", promo.titulo),
    el("p", "promo__text", promo.descripcion),
    until,
  );
  card.append(text, productArt(promo.arte));
  return card;
}

function eventCard(event) {
  const card = el("article", "event reveal");
  const date = el("div", "event__date");
  date.append(
    el("span", "event__day", String(toDate(event.fecha).getDate())),
    el("span", "event__month", formatShortMonth(event.fecha)),
  );
  const info = el("div");
  const time = el("p", "event__meta");
  time.append(icon("clock"), document.createTextNode(event.horario));
  const place = el("p", "event__meta");
  place.append(icon("pin"), document.createTextNode(event.ubicacion));
  info.append(el("p", "event__tag", "Evento"), el("h3", "event__title", event.titulo), time, place);
  card.append(date, info);
  return card;
}

function renderNews(promotions, events) {
  if (promotions.length === 0 && events.length === 0) {
    hideSection("novedades");
    return;
  }
  const items = [];
  if (promotions.length > 0) items.push(promoCard(promotions[0]));
  if (events.length > 0) {
    const list = el("div", "events");
    list.append(...events.map(eventCard));
    items.push(list);
  }
  document.querySelector("[data-news]").replaceChildren(...items);
  observeReveal();
}

/* ---------- HU-20: próximas visitas del doctor ---------- */

function renderVisits(visits) {
  if (visits.length === 0) {
    hideSection("visitas");
    return;
  }
  document.querySelector("[data-visits]").replaceChildren(
    ...visits.map((visit) => {
      const item = el("li", "visit reveal");
      const date = el("div", "visit__date");
      date.append(
        el("span", "visit__month", formatShortMonth(visit.fecha)),
        el("span", "visit__day", String(toDate(visit.fecha).getDate())),
      );
      const info = el("div");
      info.append(
        el("p", "visit__name", visit.doctor),
        el("p", "visit__detail", visit.especialidad),
      );
      const time = el("span", "visit__time");
      time.append(icon("clock"), document.createTextNode(visit.horario));
      item.append(date, info, time);
      return item;
    }),
  );

  // Tarjeta flotante del hero con la próxima visita.
  const [next] = visits;
  document.querySelector("[data-hero-visit-text]").textContent =
    `${formatLongDate(next.fecha)} · ${next.doctor}`;
  document.querySelector("[data-hero-visit]").hidden = false;
  observeReveal();
}

/* ---------- Presentación, categorías y comportamiento ---------- */

function renderHero() {
  const art = [
    { forma: "bolsa", color: "#3a9a5b", etiqueta: "SPIRULINA" },
    { forma: "frasco", color: "#2b5c9e", etiqueta: "OMEGA 3" },
    { forma: "caja", color: "#d9b23b", etiqueta: "MANZANILLA" },
  ];
  document.querySelector("[data-hero-products]").replaceChildren(...art.map(productArt));
}

function renderCategories() {
  document.querySelector("[data-categories]").replaceChildren(
    ...CATEGORIES.map((category) => {
      const link = el("a", "category");
      link.href = `${STORE_URL}#/?categoria=${encodeURIComponent(category.nombre)}`;
      link.append(withIcon(category.icono, "category__icon"), el("span", "", category.nombre));
      return link;
    }),
  );
}

function setupMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("menu");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("nav--open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setupHeaderShadow() {
  const header = document.querySelector("[data-header]");
  const update = () => header.classList.toggle("header--scrolled", window.scrollY > 10);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

let revealObserver;

function observeReveal() {
  const pending = document.querySelectorAll(".reveal:not(.reveal--visible)");
  if (!("IntersectionObserver" in window)) {
    pending.forEach((node) => node.classList.add("reveal--visible"));
    return;
  }
  revealObserver ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  pending.forEach((node) => revealObserver.observe(node));
}

function init() {
  document.querySelector("[data-year]").textContent = String(new Date().getFullYear());
  document.querySelectorAll("[data-store-link]").forEach((link) => {
    link.href = STORE_URL;
  });
  hydrateIcons();
  renderHero();
  renderCategories();
  setupMenu();
  setupHeaderShadow();
  document
    .querySelectorAll(".section__head, .visits-intro, .about__text, .perk")
    .forEach((node) => {
      node.classList.add("reveal");
    });
  observeReveal();

  showSkeletons(document.querySelector("[data-featured]"), 4);
  showSkeletons(document.querySelector("[data-news]"), 2);
  showSkeletons(document.querySelector("[data-visits]"), 2, "skeleton--short");

  // Cada sección carga por separado: si una falla, las demás siguen.
  fetchMock("negocio")
    .then(renderBusiness)
    .catch(() => renderBusiness({ ...FALLBACK_BUSINESS }));

  fetchMock("destacados")
    .then(renderFeatured)
    .catch(() => hideSection("destacados"));

  Promise.all([fetchMock("promociones"), fetchMock("eventos")])
    .then(([promotions, events]) => renderNews(promotions, events))
    .catch(() => hideSection("novedades"));

  fetchMock("visitas")
    .then(renderVisits)
    .catch(() => hideSection("visitas"));
}

init();
