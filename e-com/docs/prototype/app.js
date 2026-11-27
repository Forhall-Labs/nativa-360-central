/*
  Prototipo del comercio electrónico de Nativa 360.
  Una sola página con rutas en el hash (#/...). Simula la API con datos de
  ejemplo y guarda el carrito, la sesión y los pedidos en el navegador.

  Rutas:
    #/                       catálogo, búsqueda y filtros (HU-02, HU-03, HU-22)
    #/productos/:id          detalle (HU-04, HU-05)
    #/carrito                carrito (HU-05)
    #/checkout               registro del pedido y entrega (HU-06, HU-23)
    #/pedidos/:codigo        pedido registrado y WhatsApp (HU-06, HU-07, HU-26)
    #/mis-pedidos            pedidos del cliente (HU-26)
    #/ingresar, #/registro   cuenta del cliente (HU-24, HU-25)

  Cuenta de prueba: ana@correo.com / nativa360. Estado de error: ?demo=error
*/

const WHATSAPP_NUMBER = "50688887777";
const PAGE_SIZE = 12;

const CATEGORIES = [
  "Vitaminas",
  "Superalimentos",
  "Tés e infusiones",
  "Cuidado personal",
  "Deportistas",
];

const PRODUCTS = [
  {
    id: 1,
    nombre: "Omega 3",
    categoria: "Vitaminas",
    precio: 8000,
    stock: 10,
    pack: ["frasco", "#2b5c9e", "OMEGA 3"],
    tinte: "#eaf2fb",
    resumen: "Aceite de pescado de alta pureza, 60 cápsulas blandas.",
  },
  {
    id: 2,
    nombre: "Vitamina C 1000 mg",
    categoria: "Vitaminas",
    precio: 6500,
    stock: 24,
    pack: ["frasco", "#e98a2c", "VIT C"],
    tinte: "#fdf1e4",
    resumen: "Refuerza tus defensas todos los días. Frasco de 100 tabletas.",
  },
  {
    id: 3,
    nombre: "Spirulina en polvo",
    categoria: "Superalimentos",
    precio: 9500,
    stock: 8,
    pack: ["bolsa", "#3a9a5b", "SPIRULINA"],
    tinte: "#e4f4ea",
    resumen: "Proteína vegetal y hierro para tus batidos, 250 g.",
  },
  {
    id: 4,
    nombre: "Té de manzanilla",
    categoria: "Tés e infusiones",
    precio: 2500,
    stock: 20,
    pack: ["caja", "#d9b23b", "MANZANILLA"],
    tinte: "#fbf5e1",
    resumen: "Infusión relajante para cerrar el día, 25 bolsitas.",
  },
  {
    id: 5,
    nombre: "Magnesio + Zinc",
    categoria: "Vitaminas",
    precio: 7200,
    stock: 3,
    pack: ["frasco", "#7b5ea7", "MAGNESIO"],
    tinte: "#f1ecf8",
    resumen: "Apoya músculos y descanso. 90 tabletas.",
  },
  {
    id: 6,
    nombre: "Colágeno hidrolizado",
    categoria: "Deportistas",
    precio: 14900,
    stock: 0,
    pack: ["bolsa", "#c2577a", "COLÁGENO"],
    tinte: "#fbeaf0",
    resumen: "Para piel, articulaciones y recuperación, 300 g.",
  },
  {
    id: 7,
    nombre: "Té verde orgánico",
    categoria: "Tés e infusiones",
    precio: 3200,
    stock: 15,
    pack: ["caja", "#5f8f3e", "TÉ VERDE"],
    tinte: "#ecf4e4",
    resumen: "Antioxidante natural, 20 bolsitas de hoja entera.",
  },
  {
    id: 8,
    nombre: "Aceite de coco",
    categoria: "Cuidado personal",
    precio: 5800,
    stock: 12,
    pack: ["frasco", "#8fb8c9", "COCO"],
    tinte: "#eef6f9",
    resumen: "Prensado en frío, 500 ml.",
    activo: false,
  },
  {
    id: 9,
    nombre: "Proteína vegetal",
    categoria: "Deportistas",
    precio: 18500,
    stock: 6,
    pack: ["bolsa", "#8a6a4a", "PROTEÍNA"],
    tinte: "#f5efe8",
    resumen: "Arveja y arroz, sabor vainilla, 1 kg.",
  },
  {
    id: 10,
    nombre: "Cúrcuma con pimienta",
    categoria: "Vitaminas",
    precio: 6900,
    stock: 14,
    pack: ["frasco", "#d79a1c", "CÚRCUMA"],
    tinte: "#fcf3df",
    resumen: "Antiinflamatorio natural, 60 cápsulas.",
  },
  {
    id: 11,
    nombre: "Crema de caléndula",
    categoria: "Cuidado personal",
    precio: 4500,
    stock: 9,
    pack: ["tubo", "#e2a33b", "CALÉNDULA"],
    tinte: "#fdf4e3",
    resumen: "Calma y repara la piel sensible, 60 g.",
  },
  {
    id: 12,
    nombre: "Extracto de propóleo",
    categoria: "Cuidado personal",
    precio: 5200,
    stock: 7,
    pack: ["gotero", "#9c5a1e", "PROPÓLEO"],
    tinte: "#f8eee4",
    resumen: "Gotas para la garganta, 30 ml.",
  },
  {
    id: 13,
    nombre: "Chía orgánica",
    categoria: "Superalimentos",
    precio: 3900,
    stock: 25,
    pack: ["bolsa", "#4b4f5c", "CHÍA"],
    tinte: "#eef0f3",
    resumen: "Fibra y omega 3 vegetal, 400 g.",
  },
  {
    id: 14,
    nombre: "Té de jengibre & limón",
    categoria: "Tés e infusiones",
    precio: 2900,
    stock: 18,
    pack: ["caja", "#e0b84c", "JENGIBRE"],
    tinte: "#fcf6e2",
    resumen: "Reconfortante y digestivo, 20 bolsitas.",
  },
  {
    id: 15,
    nombre: "Vitamina D3 + K2",
    categoria: "Vitaminas",
    precio: 9900,
    stock: 11,
    pack: ["gotero", "#2f7a8c", "D3 + K2"],
    tinte: "#e6f3f5",
    resumen: "En gotas, para huesos fuertes, 30 ml.",
  },
];

const DETAILS = {
  1: "Omega 3 de aceite de pescado purificado, rico en EPA y DHA. Apoya la salud del corazón y del cerebro. Tomar una cápsula al día con las comidas.",
  2: "Vitamina C de liberación prolongada con bioflavonoides. Ayuda a mantener las defensas y la producción de colágeno. Una tableta al día.",
  3: "Spirulina 100 % pura en polvo, fuente de proteína vegetal, hierro y clorofila. Mezclá una cucharadita en tu batido o jugo.",
};

// RN-19 y RN-20: promoción vigente hasta el último día del mes actual.
const PROMOTIONS = [{ productoId: 2, descuento: 10, hasta: endOfMonth() }];

const ZONES = [
  { id: "centro", nombre: "San Isidro centro", cubierta: true },
  { id: "daniel-flores", nombre: "Daniel Flores", cubierta: true },
  { id: "palmares", nombre: "Palmares", cubierta: true },
  { id: "rivas", nombre: "Rivas", cubierta: false },
  { id: "otra", nombre: "Otra zona", cubierta: false },
];

const DEMO_USER = {
  nombre: "Ana Mora",
  correo: "ana@correo.com",
  telefono: "88887777",
  clave: "nativa360",
};

const SEED_ORDERS = [
  {
    codigo: "N360-0038",
    correo: "ana@correo.com",
    fecha: "2026-10-28",
    estado: "entregado",
    entrega: "retiro",
    lineas: [
      { id: 4, nombre: "Té de manzanilla", cantidad: 2, precio: 2500 },
      { id: 13, nombre: "Chía orgánica", cantidad: 1, precio: 3900 },
    ],
  },
  {
    codigo: "N360-0041",
    correo: "ana@correo.com",
    fecha: "2026-11-18",
    estado: "confirmado",
    entrega: "retiro",
    lineas: [{ id: 1, nombre: "Omega 3", cantidad: 1, precio: 8000 }],
  },
];

const STATUS_LABEL = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  confirmado: "Confirmado",
  preparado: "Preparado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

/* ---------- Guardado en el navegador ---------- */

const storage = {
  read(key, fallback) {
    try {
      const raw = window.localStorage.getItem(`n360-${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      window.localStorage.setItem(`n360-${key}`, JSON.stringify(value));
    } catch {
      // Sin almacenamiento disponible: el prototipo sigue funcionando en memoria.
    }
  },
};

const state = {
  cart: storage.read("carrito", []),
  session: storage.read("sesion", null),
  users: storage.read("usuarios", [DEMO_USER]),
  orders: storage.read("pedidos", SEED_ORDERS),
  detailQty: 1,
  checkout: { entrega: "retiro", zona: "", errors: {}, sending: false, values: {} },
  justPlaced: null,
  firstCatalogLoad: true,
};

const persist = () => {
  storage.write("carrito", state.cart);
  storage.write("sesion", state.session);
  storage.write("usuarios", state.users);
  storage.write("pedidos", state.orders);
};

/* ---------- Utilidades ---------- */

const app = document.getElementById("app");
const apiDown = new URLSearchParams(window.location.search).get("demo") === "error";

function endOfMonth() {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return last.toISOString().slice(0, 10);
}

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );

const colones = (amount) => `₡${String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;

const normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const longDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const findProduct = (id) => PRODUCTS.find((product) => product.id === Number(id));
const isActive = (product) => product && product.activo !== false;

function activePromo(product) {
  const today = new Date().toISOString().slice(0, 10);
  return PROMOTIONS.find((promo) => promo.productoId === product.id && promo.hasta >= today);
}

/** HU-22: precio vigente, con una sola promoción como máximo (RN-21). */
function priceOf(product) {
  const promo = activePromo(product);
  return promo ? Math.round(product.precio * (1 - promo.descuento / 100)) : product.precio;
}

function icon(name) {
  return `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

const LABEL_Y = { frasco: 66, bolsa: 62, caja: 70, gotero: 72, tubo: 48 };

function pack(product) {
  const [shape, color, label] = product.pack;
  const top = LABEL_Y[shape];
  const cx = shape === "caja" ? 58 : 60;
  const size = label.length > 8 ? 7.5 : 10;
  return `<svg class="pack" viewBox="0 0 120 160" aria-hidden="true" style="--art:${color}">
    <use href="#art-${shape}"/>
    <text x="${cx}" y="${top + 24}" text-anchor="middle" font-size="6.5" font-weight="700" fill="#3a9a5b" letter-spacing="1.4">NATIVA 360</text>
    <text x="${cx}" y="${top + 38}" text-anchor="middle" font-size="${size}" font-weight="800" fill="#163b6e">${esc(label)}</text>
  </svg>`;
}

function priceBlock(product, extraClass = "") {
  const now = priceOf(product);
  const was =
    now === product.precio ? "" : `<span class="price__was">${colones(product.precio)}</span>`;
  return `<span class="price ${extraClass}"><span class="price__now">${colones(now)}</span>${was}</span>`;
}

function stockTag(product) {
  if (product.stock === 0) return `<span class="stock stock--out">${icon("alert")} Agotado</span>`;
  if (product.stock <= 3)
    return `<span class="stock stock--low">${icon("alert")} Quedan ${product.stock} unidades</span>`;
  return `<span class="stock stock--ok">${icon("check")} Disponible</span>`;
}

function emptyState({ iconName, title, text, action = "", error = false }) {
  return `<section class="empty ${error ? "empty--error" : ""}">
    <span class="empty__icon">${icon(iconName)}</span>
    <h2>${title}</h2>
    <p>${text}</p>
    ${action}
  </section>`;
}

function parseRoute() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [path, query = ""] = raw.split("?");
  return { parts: path.split("/").filter(Boolean), params: new URLSearchParams(query) };
}

function go(hash) {
  window.location.hash = hash;
}

let toastTimer;
function toast(html) {
  const box = document.querySelector("[data-toast]");
  box.innerHTML = html;
  box.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    box.hidden = true;
  }, 3200);
}

/* ---------- Carrito ---------- */

const cartCount = () => state.cart.reduce((sum, line) => sum + line.qty, 0);

function updateHeader({ bump = false } = {}) {
  const badge = document.querySelector("[data-cart-count]");
  badge.textContent = String(cartCount());
  badge.setAttribute("aria-label", `${cartCount()} productos en el carrito`);
  if (bump) {
    badge.classList.remove("badge--bump");
    void badge.offsetWidth;
    badge.classList.add("badge--bump");
  }
  const label = document.querySelector("[data-account-label]");
  const link = document.querySelector("[data-account-link]");
  if (state.session) {
    label.textContent = `Hola, ${state.session.nombre.split(" ")[0]}`;
    link.href = "#/mis-pedidos";
  } else {
    label.textContent = "Ingresar";
    link.href = "#/ingresar";
  }
}

/** HU-05: agrega respetando las existencias (RN-05). */
function addToCart(id, qty = 1) {
  const product = findProduct(id);
  if (!isActive(product) || product.stock === 0) return;
  const line = state.cart.find((item) => item.id === product.id);
  const current = line ? line.qty : 0;
  const next = Math.min(current + qty, product.stock);
  if (line) line.qty = next;
  else state.cart.push({ id: product.id, qty: next });
  persist();
  updateHeader({ bump: true });
  const capped = next < current + qty;
  toast(
    `${icon("check")} ${capped ? `Solo hay ${product.stock} unidades disponibles` : `${esc(product.nombre)} agregado al carrito`} <a href="#/carrito">Ver carrito</a>`,
  );
}

function cartLines() {
  return state.cart.map((line) => {
    const product = findProduct(line.id);
    const available = isActive(product) && product.stock > 0;
    return {
      ...line,
      product,
      available,
      unit: priceOf(product),
      total: priceOf(product) * line.qty,
    };
  });
}

const cartTotal = () =>
  cartLines()
    .filter((line) => line.available)
    .reduce((sum, line) => sum + line.total, 0);

/* ---------- Vistas ---------- */

function productTile(product) {
  const promo = activePromo(product);
  const out = product.stock === 0;
  const flag = out
    ? `<span class="flag flag--out">Agotado</span>`
    : promo
      ? `<span class="flag flag--sale">-${promo.descuento} %</span>`
      : "";
  return `<article class="tile">
    <a class="tile__media" href="#/productos/${product.id}" style="--tint:${product.tinte}" tabindex="-1" aria-hidden="true">
      <span class="flag">${esc(product.categoria)}</span>${flag}${pack(product)}
    </a>
    <div class="tile__body">
      <a class="tile__name" href="#/productos/${product.id}">${esc(product.nombre)}</a>
      <p class="tile__desc">${esc(product.resumen)}</p>
      <div class="tile__foot">
        ${priceBlock(product)}
        <button class="add" type="button" data-act="add" data-id="${product.id}" ${out ? "disabled" : ""}
          aria-label="${out ? `${esc(product.nombre)} agotado` : `Agregar ${esc(product.nombre)} al carrito`}">${icon("plus")}</button>
      </div>
    </div>
  </article>`;
}

/* HU-02, HU-03 y HU-22: catálogo con búsqueda, filtros, paginación y promociones */
function catalogView(params) {
  if (apiDown) {
    return emptyState({
      iconName: "alert",
      error: true,
      title: "No pudimos cargar los productos",
      text: "No pudimos cargar los productos. Revisá tu conexión e intentá de nuevo.",
      action: `<button class="button button--main" type="button" data-act="retry">Reintentar</button>`,
    });
  }

  const search = (params.get("buscar") || "").slice(0, 100);
  const category = params.get("categoria") || "";
  const page = Number(params.get("pagina") || 1);
  const term = normalize(search);

  const visible = PRODUCTS.filter(isActive);
  const matches = visible.filter(
    (product) =>
      (!category || product.categoria === category) &&
      (!term || normalize(`${product.nombre} ${product.resumen}`).includes(term)),
  );
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const shown = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtered = Boolean(search || category);

  const linkWith = (changes) => {
    const next = new URLSearchParams({ buscar: search, categoria: category, ...changes });
    [...next.keys()].forEach((key) => !next.get(key) && next.delete(key));
    const query = next.toString();
    return `#/${query ? `?${query}` : ""}`;
  };

  const chips = [{ name: "", label: "Todos", count: visible.length }]
    .concat(
      CATEGORIES.map((name) => ({
        name,
        label: name,
        count: visible.filter((product) => product.categoria === name).length,
      })),
    )
    .map(
      (chip) =>
        `<a class="chip ${chip.name === category ? "chip--on" : ""}" href="${linkWith({ categoria: chip.name, pagina: "" })}"
          ${chip.name === category ? 'aria-current="true"' : ""}>${esc(chip.label)}<span class="chip__count">${chip.count}</span></a>`,
    )
    .join("");

  const promoProduct = findProduct(PROMOTIONS[0].productoId);
  const promo = activePromo(promoProduct);
  const strip =
    promo && !filtered
      ? `<section class="promo-strip">
          <div>
            <span class="promo-strip__tag">Promoción</span>
            <h2>-${promo.descuento} % en ${esc(promoProduct.nombre)}</h2>
            <p>Hasta el ${longDate(promo.hasta)} o hasta agotar existencias.</p>
          </div>
          <a class="button" href="#/productos/${promoProduct.id}">Ver producto ${icon("next")}</a>
        </section>`
      : "";

  let results;
  if (state.firstCatalogLoad) {
    results = `<div class="products">${'<div class="skel"></div>'.repeat(8)}</div>`;
  } else if (matches.length === 0) {
    results = emptyState({
      iconName: "search",
      title: `No encontramos productos para «${esc(search || category)}»`,
      text: "Probá con otra palabra o revisá la categoría seleccionada.",
      action: `<a class="button button--line" href="#/">Limpiar búsqueda y filtros</a>`,
    });
  } else if (shown.length === 0) {
    results = emptyState({
      iconName: "box",
      title: "No hay más productos para mostrar",
      text: "Esta página no existe en el catálogo.",
      action: `<a class="button button--line" href="${linkWith({ pagina: "" })}">Volver a la primera página</a>`,
    });
  } else {
    const pager =
      pages > 1
        ? `<nav class="pager" aria-label="Páginas">${Array.from({ length: pages }, (_, index) => {
            const number = index + 1;
            return `<a href="${linkWith({ pagina: number === 1 ? "" : String(number) })}" ${number === page ? 'aria-current="page"' : ""}>${number}</a>`;
          }).join("")}</nav>`
        : "";
    results = `<div class="products">${shown.map(productTile).join("")}</div>${pager}`;
  }

  return `${strip}
    <div class="catalog">
      <aside class="filters" aria-label="Categorías">
        <p class="filters__title">Categorías</p>
        <div class="chips">${chips}</div>
      </aside>
      <section>
        <div class="results-bar">
          <div>
            <h1 class="page-title">${search ? `Resultados para «${esc(search)}»` : esc(category || "Todos los productos")}</h1>
            <p class="page-sub">${matches.length} ${matches.length === 1 ? "producto" : "productos"}</p>
          </div>
          ${filtered ? `<a class="text-button" href="#/">${icon("close")} Limpiar filtros</a>` : ""}
        </div>
        ${results}
      </section>
    </div>`;
}

/* HU-04 y HU-05: detalle del producto */
function productView(id) {
  const product = findProduct(id);
  if (!/^\d+$/.test(id) || !product) {
    return emptyState({
      iconName: "search",
      title: "Producto no encontrado",
      text: "Revisá el enlace o buscá el producto en el catálogo.",
      action: `<a class="button button--main" href="#/">Ir al catálogo</a>`,
    });
  }
  if (!isActive(product)) {
    return emptyState({
      iconName: "box",
      title: "Este producto ya no está disponible",
      text: "Puede que lo hayamos dejado de vender. Mirá otros productos parecidos en el catálogo.",
      action: `<a class="button button--main" href="#/?categoria=${encodeURIComponent(product.categoria)}">Ver ${esc(product.categoria)}</a>`,
    });
  }
  const out = product.stock === 0;
  const qty = Math.min(state.detailQty, Math.max(product.stock, 1));
  const promo = activePromo(product);

  return `<nav class="crumbs" aria-label="Ruta">
      <a href="#/">Tienda</a> / <a href="#/?categoria=${encodeURIComponent(product.categoria)}">${esc(product.categoria)}</a> / <span>${esc(product.nombre)}</span>
    </nav>
    <div class="detail">
      <div class="detail__media" style="--tint:${product.tinte}">
        ${promo ? `<span class="flag flag--sale">-${promo.descuento} %</span>` : ""}${pack(product)}
      </div>
      <div class="detail__info">
        <p class="detail__cat">${esc(product.categoria)}</p>
        <h1 class="page-title">${esc(product.nombre)}</h1>
        <div class="detail__price">${priceBlock(product)}</div>
        <div>${stockTag(product)}</div>
        <p class="page-sub">${esc(DETAILS[product.id] || product.resumen)}</p>
        <div class="buy">
          <div class="stepper" role="group" aria-label="Cantidad">
            <button type="button" data-act="qty" data-delta="-1" aria-label="Quitar una unidad" ${qty <= 1 || out ? "disabled" : ""}>${icon("minus")}</button>
            <output aria-live="polite">${out ? 0 : qty}</output>
            <button type="button" data-act="qty" data-delta="1" data-max="${product.stock}" aria-label="Agregar una unidad" ${qty >= product.stock || out ? "disabled" : ""}>${icon("plus")}</button>
          </div>
          <button class="button button--main button--lg" type="button" data-act="add-detail" data-id="${product.id}" ${out ? "disabled" : ""}>
            ${out ? "No disponible" : `${icon("cart")} Agregar al carrito`}
          </button>
        </div>
        <ul class="perks">
          <li>${icon("store")} Retiro en tienda sin costo de envío</li>
          <li>${icon("chat")} Coordinás el pago por WhatsApp con nuestro equipo</li>
          <li>${icon("leaf")} Productos naturales seleccionados</li>
        </ul>
      </div>
    </div>`;
}

/* HU-05: carrito */
function cartView() {
  const lines = cartLines();
  if (lines.length === 0) {
    return emptyState({
      iconName: "cart",
      title: "Tu carrito está vacío",
      text: "Agregá productos desde el catálogo para armar tu pedido.",
      action: `<a class="button button--main" href="#/">Ver productos</a>`,
    });
  }
  const rows = lines
    .map(
      (line) => `<article class="line ${line.available ? "" : "line--off"}">
        <a class="line__thumb" href="#/productos/${line.id}" style="--tint:${line.product.tinte}" aria-hidden="true" tabindex="-1">${pack(line.product)}</a>
        <div>
          <a class="line__name" href="#/productos/${line.id}">${esc(line.product.nombre)}</a>
          <p class="line__unit">${colones(line.unit)} c/u</p>
          ${line.available ? "" : `<p class="line__warn">${icon("alert")} Ya no está disponible</p>`}
          ${
            line.available
              ? `<div class="stepper stepper--sm line__qty" role="group" aria-label="Cantidad de ${esc(line.product.nombre)}">
                  <button type="button" data-act="line" data-id="${line.id}" data-delta="-1" aria-label="Quitar una unidad">${icon("minus")}</button>
                  <output>${line.qty}</output>
                  <button type="button" data-act="line" data-id="${line.id}" data-delta="1" aria-label="Agregar una unidad" ${line.qty >= line.product.stock ? "disabled" : ""}>${icon("plus")}</button>
                </div>`
              : ""
          }
        </div>
        <p class="line__total">${line.available ? colones(line.total) : "—"}</p>
        <button class="remove" type="button" data-act="remove" data-id="${line.id}" aria-label="Eliminar ${esc(line.product.nombre)}">${icon("trash")}</button>
      </article>`,
    )
    .join("");

  const available = lines.filter((line) => line.available);
  return `<h1 class="page-title">Tu carrito</h1>
    <p class="page-sub">${cartCount()} ${cartCount() === 1 ? "producto" : "productos"}</p>
    <div class="split">
      <div class="lines">${rows}</div>
      <aside class="panel summary">
        <h2>Resumen</h2>
        <div class="summary__row"><span>Subtotal</span><span>${colones(cartTotal())}</span></div>
        <div class="summary__row"><span>Envío</span><span>Se define en el siguiente paso</span></div>
        <div class="summary__row summary__row--total"><span>Total estimado</span><span>${colones(cartTotal())}</span></div>
        <p class="note">${icon("chat")} El total final se confirma por WhatsApp. No cobramos nada en línea.</p>
        <button class="button button--main button--lg button--block" type="button" data-act="to-checkout" ${available.length ? "" : "disabled"}>
          Continuar con el pedido ${icon("next")}
        </button>
        <a class="button button--line button--block" href="#/">Seguir comprando</a>
      </aside>
    </div>`;
}

function field({
  name,
  label,
  type = "text",
  value = "",
  error,
  hint,
  required = true,
  attrs = "",
}) {
  return `<div class="field ${error ? "field--invalid" : ""}">
    <label for="f-${name}">${label}${required ? ' <span class="req">*</span>' : ""}</label>
    <input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" ${attrs}
      ${error ? `aria-invalid="true" aria-describedby="e-${name}"` : ""} />
    ${error ? `<p class="field__error" id="e-${name}">${icon("alert")} ${error}</p>` : ""}
    ${hint && !error ? `<p class="field__hint">${hint}</p>` : ""}
  </div>`;
}

/* HU-06 y HU-23: checkout */
function checkoutView() {
  const lines = cartLines().filter((line) => line.available);
  if (lines.length === 0) return cartView();
  const { entrega, zona, errors, sending, values } = state.checkout;
  const user = state.session;
  const zoneInfo = ZONES.find((zone) => zone.id === zona);
  const shipping = entrega === "retiro" ? "₡0" : "Se acuerda por WhatsApp";

  const zoneOptions = ZONES.map(
    (zone) =>
      `<option value="${zone.id}" ${zone.id === zona ? "selected" : ""}>${zone.nombre}</option>`,
  ).join("");

  const delivery =
    entrega === "domicilio"
      ? `<div class="field ${errors.zona ? "field--invalid" : ""}">
          <label for="f-zona">Zona <span class="req">*</span></label>
          <select id="f-zona" name="zona" data-act="zone">
            <option value="">Elegí tu zona</option>${zoneOptions}
          </select>
          ${errors.zona ? `<p class="field__error">${icon("alert")} ${errors.zona}</p>` : ""}
        </div>
        ${zoneInfo && !zoneInfo.cubierta ? `<p class="note note--warn">${icon("alert")} No hacemos envíos a esa zona. Podés elegir retiro en tienda.</p>` : ""}
        ${field({ name: "direccion", label: "Dirección de entrega", value: values.direccion, error: errors.direccion })}
        ${field({ name: "contacto", label: "Persona que recibe", value: values.contacto, error: errors.contacto })}`
      : `<p class="note">${icon("store")} Retirás en la tienda, 50 m este de la Municipalidad de Pérez Zeledón. Te avisamos por WhatsApp cuando esté listo.</p>`;

  return `<nav class="crumbs" aria-label="Ruta"><a href="#/carrito">${icon("back")} Volver al carrito</a></nav>
    <h1 class="page-title">Finalizar pedido</h1>
    <p class="page-sub">Revisá tus datos. El pago y la entrega se coordinan por WhatsApp.</p>
    <div class="split">
      <form class="panel form" data-form="checkout" novalidate>
        <h2>1. Tus datos de contacto</h2>
        <div class="cols">
          ${field({ name: "nombre", label: "Nombre completo", value: values.nombre ?? user.nombre, error: errors.nombre, attrs: 'autocomplete="name"' })}
          ${field({ name: "telefono", label: "Teléfono", type: "tel", value: values.telefono ?? user.telefono, error: errors.telefono, hint: "8 dígitos, para coordinar por WhatsApp", attrs: 'autocomplete="tel" inputmode="numeric"' })}
        </div>
        <h2>2. ¿Cómo lo querés recibir?</h2>
        <div class="options" role="radiogroup" aria-label="Tipo de entrega">
          <label class="option">
            <input type="radio" name="entrega" value="retiro" data-act="delivery" ${entrega === "retiro" ? "checked" : ""} />
            <span class="option__icon">${icon("store")}</span>
            <span><strong>Retiro en tienda</strong><span>Sin costo de envío</span></span>
          </label>
          <label class="option">
            <input type="radio" name="entrega" value="domicilio" data-act="delivery" ${entrega === "domicilio" ? "checked" : ""} />
            <span class="option__icon">${icon("truck")}</span>
            <span><strong>Envío a domicilio</strong><span>Costo según la zona</span></span>
          </label>
        </div>
        ${delivery}
        ${errors.stock ? `<p class="note note--error">${icon("alert")} ${errors.stock}</p>` : ""}
        ${errors.api ? `<p class="note note--error">${icon("alert")} ${errors.api}</p>` : ""}
        <button class="button button--main button--lg button--block" type="submit" ${sending ? "disabled" : ""}>
          ${sending ? "Registrando tu pedido…" : `${icon("check")} Registrar pedido`}
        </button>
      </form>
      <aside class="panel summary">
        <h2>Tu pedido</h2>
        <ul class="mini-lines">
          ${lines.map((line) => `<li><span>${line.qty} × ${esc(line.product.nombre)}</span><span>${colones(line.total)}</span></li>`).join("")}
        </ul>
        <div class="summary__row"><span>Envío</span><span>${shipping}</span></div>
        <div class="summary__row summary__row--total"><span>Total estimado</span><span>${colones(cartTotal())}</span></div>
        <p class="note">${icon("chat")} Registrar el pedido no cobra nada. Después te escribimos para confirmar disponibilidad y pago.</p>
      </aside>
    </div>`;
}

function whatsappLink(order) {
  const lines = order.lineas.map(
    (line) => `• ${line.cantidad} × ${line.nombre} (${colones(line.cantidad * line.precio)})`,
  );
  const total = order.lineas.reduce((sum, line) => sum + line.cantidad * line.precio, 0);
  const text = [
    `Hola Nativa 360, quiero coordinar mi pedido ${order.codigo}:`,
    ...lines,
    `Total estimado: ${colones(total)}`,
    order.entrega === "retiro" ? "Lo retiro en la tienda." : `Envío a: ${order.direccion}`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* HU-06, HU-07 y HU-26: pedido registrado o detalle de un pedido */
function orderView(code) {
  const order = state.orders.find((item) => item.codigo === code);
  if (!order || !state.session || order.correo !== state.session.correo) {
    return emptyState({
      iconName: "box",
      title: "Pedido no encontrado",
      text: "Revisá el código o ingresá con la cuenta con la que hiciste el pedido.",
      action: `<a class="button button--main" href="#/mis-pedidos">Ir a mis pedidos</a>`,
    });
  }
  const total = order.lineas.reduce((sum, line) => sum + line.cantidad * line.precio, 0);
  const fresh = state.justPlaced === order.codigo;
  const header = fresh
    ? `<span class="done__check">${icon("check")}</span>
       <h1 class="page-title">¡Pedido registrado!</h1>
       <p class="page-sub">Tu código de pedido es <span class="code">${order.codigo}</span></p>`
    : `<h1 class="page-title">Pedido <span class="code">${order.codigo}</span></h1>
       <p class="page-sub">Registrado el ${longDate(order.fecha)} · <span class="status status--${order.estado}">${STATUS_LABEL[order.estado]}</span></p>`;

  return `<div class="done">
      ${header}
      ${
        fresh
          ? `<ol class="steps">
              <li><b>1</b>Escribinos por WhatsApp con el mensaje ya armado.</li>
              <li><b>2</b>Confirmamos disponibilidad, total y forma de pago.</li>
              <li><b>3</b>${order.entrega === "retiro" ? "Retirás tu pedido en la tienda." : "Te lo enviamos a la dirección indicada."}</li>
            </ol>`
          : ""
      }
      <a class="button button--green button--lg" href="${whatsappLink(order)}" target="_blank" rel="noopener">
        ${icon("chat")} Coordinar por WhatsApp <span class="visually-hidden">(abre en otra pestaña)</span>
      </a>
      <section class="panel order-card">
        <ul class="mini-lines">
          ${order.lineas.map((line) => `<li><span>${line.cantidad} × ${esc(line.nombre)}</span><span>${colones(line.cantidad * line.precio)}</span></li>`).join("")}
        </ul>
        <div class="summary__row summary__row--total"><span>Total estimado</span><span>${colones(total)}</span></div>
        <p class="page-sub">${order.entrega === "retiro" ? "Retiro en tienda" : `Envío a domicilio · ${esc(order.direccion)}`}</p>
      </section>
      <a class="text-button" href="#/mis-pedidos">${icon("back")} Ver todos mis pedidos</a>
    </div>`;
}

/* HU-26: mis pedidos */
function ordersView() {
  const mine = state.orders
    .filter((order) => order.correo === state.session.correo)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.codigo.localeCompare(a.codigo));
  const header = `<div class="results-bar">
      <div><h1 class="page-title">Mis pedidos</h1><p class="page-sub">${esc(state.session.nombre)} · ${esc(state.session.correo)}</p></div>
      <button class="button button--line" type="button" data-act="logout">${icon("logout")} Cerrar sesión</button>
    </div>`;
  if (mine.length === 0) {
    return (
      header +
      emptyState({
        iconName: "box",
        title: "Todavía no tenés pedidos",
        text: "Cuando registres tu primer pedido lo vas a ver acá con su estado.",
        action: `<a class="button button--main" href="#/">Ver productos</a>`,
      })
    );
  }
  return `${header}<div class="orders">${mine
    .map((order) => {
      const total = order.lineas.reduce((sum, line) => sum + line.cantidad * line.precio, 0);
      const items = order.lineas.reduce((sum, line) => sum + line.cantidad, 0);
      return `<a class="order-row" href="#/pedidos/${order.codigo}">
        <span><strong>${order.codigo}</strong><small>${longDate(order.fecha)} · ${items} ${items === 1 ? "producto" : "productos"}</small></span>
        <span class="status status--${order.estado}">${STATUS_LABEL[order.estado]}</span>
        <strong>${colones(total)}</strong>
        ${icon("next")}
      </a>`;
    })
    .join("")}</div>`;
}

function authLayout(title, text, form) {
  const art = [findProduct(3), findProduct(1), findProduct(4)].map(pack).join("");
  return `<div class="auth">
    <div class="auth__side">
      <div class="auth__art">${art}</div>
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
    <div class="auth__form">${form}</div>
  </div>`;
}

/* HU-25: ingreso */
function loginView(params, errors = {}, values = {}) {
  const back = params.get("volver") || "";
  return authLayout(
    "Tu bienestar, a un clic.",
    "Ingresá para registrar pedidos y seguir su estado.",
    `<form class="form" data-form="login" data-back="${esc(back)}" novalidate>
      <div><h1 class="page-title">Ingresar</h1><p class="page-sub">¿No tenés cuenta? <a href="#/registro${back ? `?volver=${back}` : ""}">Creá una</a></p></div>
      ${errors.general ? `<p class="note note--error">${icon("alert")} ${errors.general}</p>` : ""}
      ${field({ name: "correo", label: "Correo", type: "email", value: values.correo, error: errors.correo, attrs: 'autocomplete="email"' })}
      ${field({ name: "clave", label: "Contraseña", type: "password", error: errors.clave, attrs: 'autocomplete="current-password"' })}
      <button class="button button--main button--lg button--block" type="submit">Ingresar</button>
      <p class="demo-hint">Cuenta de prueba: <strong>ana@correo.com</strong> · contraseña <strong>nativa360</strong></p>
    </form>`,
  );
}

/* HU-24: registro */
function registerView(params, errors = {}, values = {}) {
  const back = params.get("volver") || "";
  return authLayout(
    "Creá tu cuenta en Nativa 360.",
    "Con tu cuenta registrás pedidos en línea y los retirás en la tienda.",
    `<form class="form" data-form="register" data-back="${esc(back)}" novalidate>
      <div><h1 class="page-title">Crear cuenta</h1><p class="page-sub">¿Ya tenés cuenta? <a href="#/ingresar${back ? `?volver=${back}` : ""}">Ingresá</a></p></div>
      ${errors.general ? `<p class="note note--error">${icon("alert")} ${errors.general}</p>` : ""}
      ${field({ name: "nombre", label: "Nombre completo", value: values.nombre, error: errors.nombre, attrs: 'autocomplete="name"' })}
      ${field({ name: "correo", label: "Correo", type: "email", value: values.correo, error: errors.correo, attrs: 'autocomplete="email"' })}
      ${field({ name: "telefono", label: "Teléfono", type: "tel", value: values.telefono, error: errors.telefono, hint: "8 dígitos", attrs: 'inputmode="numeric"' })}
      ${field({ name: "clave", label: "Contraseña", type: "password", error: errors.clave, hint: "Al menos 8 caracteres", attrs: 'autocomplete="new-password"' })}
      <button class="button button--main button--lg button--block" type="submit">Crear cuenta</button>
    </form>`,
  );
}

/* ---------- Validaciones ---------- */

const PHONE_OK = (value) => /^\d{8}$/.test(value.replace(/[\s-]/g, ""));
const EMAIL_OK = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function validateCheckout(data) {
  const errors = {};
  if (!data.nombre.trim()) errors.nombre = "El nombre es obligatorio";
  if (!data.telefono.trim()) errors.telefono = "El teléfono es obligatorio";
  else if (!PHONE_OK(data.telefono)) errors.telefono = "Ingresá un teléfono de 8 dígitos";
  if (state.checkout.entrega === "domicilio") {
    const zone = ZONES.find((item) => item.id === state.checkout.zona);
    if (!zone) errors.zona = "Elegí tu zona";
    else if (!zone.cubierta) errors.zona = "No hacemos envíos a esa zona";
    if (!data.direccion?.trim()) errors.direccion = "La dirección de entrega es obligatoria";
    if (!data.contacto?.trim()) errors.contacto = "El contacto de entrega es obligatorio";
  }
  const short = cartLines().find((line) => line.available && line.qty > line.product.stock);
  if (short)
    errors.stock = `Solo hay ${short.product.stock} unidades disponibles de ${short.product.nombre}`;
  return errors;
}

function placeOrder(data) {
  const next = 42 + state.orders.filter((order) => order.codigo >= "N360-0042").length;
  const order = {
    codigo: `N360-${String(next).padStart(4, "0")}`,
    correo: state.session.correo,
    fecha: new Date().toISOString().slice(0, 10),
    estado: "pendiente",
    entrega: state.checkout.entrega,
    direccion: data.direccion || "",
    lineas: cartLines()
      .filter((line) => line.available)
      .map((line) => ({
        id: line.id,
        nombre: line.product.nombre,
        cantidad: line.qty,
        precio: line.unit,
      })),
  };
  state.orders.push(order);
  state.cart = [];
  state.justPlaced = order.codigo;
  state.checkout = { entrega: "retiro", zona: "", errors: {}, sending: false, values: {} };
  persist();
  updateHeader();
  go(`#/pedidos/${order.codigo}`);
}

/* ---------- Enrutador ---------- */

let currentRouteKey = "";

function render() {
  const { parts, params } = parseRoute();
  const [section, id] = parts;
  const routeKey = parts.join("/");
  let view;

  if (!section) view = catalogView(params);
  else if (section === "productos") view = productView(id ?? "");
  else if (section === "carrito") view = cartView();
  else if (section === "checkout") {
    if (!state.session) return go("#/ingresar?volver=checkout");
    view = checkoutView();
  } else if (section === "pedidos") view = orderView(id);
  else if (section === "mis-pedidos") {
    if (!state.session) return go("#/ingresar?volver=mis-pedidos");
    view = ordersView();
  } else if (section === "ingresar") view = loginView(params);
  else if (section === "registro") view = registerView(params);
  else
    view = emptyState({
      iconName: "search",
      title: "Página no encontrada",
      text: "La dirección no existe en la tienda.",
      action: `<a class="button button--main" href="#/">Ir al catálogo</a>`,
    });

  app.innerHTML = view;
  document.getElementById("buscar").value = params.get("buscar") || "";

  if (routeKey !== currentRouteKey) {
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
    state.detailQty = 1;
    if (section !== "pedidos") state.justPlaced = null;
  }
  currentRouteKey = routeKey;

  if (!section && state.firstCatalogLoad && !apiDown) {
    setTimeout(() => {
      state.firstCatalogLoad = false;
      render();
    }, 450);
  }
}

/* ---------- Eventos ---------- */

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-act]");
  if (!target || target.tagName === "SELECT" || target.type === "radio") return;
  const { act, id } = target.dataset;

  if (act === "add") addToCart(id);
  if (act === "add-detail") addToCart(id, state.detailQty);
  if (act === "qty") {
    state.detailQty = Math.max(1, state.detailQty + Number(target.dataset.delta));
    render();
  }
  if (act === "line") {
    const line = state.cart.find((item) => item.id === Number(id));
    const product = findProduct(id);
    const next = line.qty + Number(target.dataset.delta);
    if (next < 1) {
      if (window.confirm(`¿Querés eliminar ${product.nombre} del carrito?`)) {
        state.cart = state.cart.filter((item) => item !== line);
      }
    } else {
      line.qty = Math.min(next, product.stock);
    }
    persist();
    updateHeader();
    render();
  }
  if (act === "remove") {
    state.cart = state.cart.filter((item) => item.id !== Number(id));
    persist();
    updateHeader();
    render();
  }
  if (act === "to-checkout") go("#/checkout");
  if (act === "retry") window.location.reload();
  if (act === "logout") {
    state.session = null;
    persist();
    updateHeader();
    go("#/");
  }
});

app.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.act !== "delivery" && target.dataset.act !== "zone") return;
  const form = target.closest("form");
  state.checkout.values = Object.fromEntries(new FormData(form));
  if (target.dataset.act === "delivery") state.checkout.entrega = target.value;
  if (target.dataset.act === "zone") state.checkout.zona = target.value;
  state.checkout.errors = {};
  render();
});

app.addEventListener("submit", (event) => {
  const form = event.target;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const back = form.dataset.back;

  if (form.dataset.form === "checkout") {
    if (state.checkout.sending) return; // HU-06: evita pedidos duplicados por doble clic.
    state.checkout.values = data;
    state.checkout.errors = validateCheckout(data);
    if (Object.keys(state.checkout.errors).length > 0) {
      render();
      document
        .querySelector(".field--invalid input, .field--invalid select, .note--error")
        ?.focus?.();
      return;
    }
    state.checkout.sending = true;
    render();
    setTimeout(() => placeOrder(data), 900);
  }

  if (form.dataset.form === "login") {
    const errors = {};
    if (!data.correo.trim()) errors.correo = "El correo es obligatorio";
    if (!data.clave) errors.clave = "La contraseña es obligatoria";
    const user = state.users.find((item) => item.correo === data.correo.trim().toLowerCase());
    if (!Object.keys(errors).length && (!user || user.clave !== data.clave)) {
      errors.general = "Correo o contraseña incorrectos";
    }
    if (Object.keys(errors).length) {
      app.innerHTML = loginView(new URLSearchParams(back ? { volver: back } : {}), errors, data);
      return;
    }
    state.session = { nombre: user.nombre, correo: user.correo, telefono: user.telefono };
    persist();
    updateHeader();
    go(back ? `#/${back}` : "#/");
  }

  if (form.dataset.form === "register") {
    const errors = {};
    const email = data.correo.trim().toLowerCase();
    if (!data.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!EMAIL_OK(email)) errors.correo = "Ingresá un correo válido";
    if (!PHONE_OK(data.telefono)) errors.telefono = "Ingresá un teléfono de 8 dígitos";
    if (data.clave.length < 8) errors.clave = "La contraseña debe tener al menos 8 caracteres";
    if (!errors.correo && state.users.some((user) => user.correo === email)) {
      errors.general = "Ya existe una cuenta con ese correo. ¿Querés ingresar?";
    }
    if (Object.keys(errors).length) {
      app.innerHTML = registerView(new URLSearchParams(back ? { volver: back } : {}), errors, data);
      return;
    }
    const user = {
      nombre: data.nombre.trim(),
      correo: email,
      telefono: data.telefono.replace(/\D/g, ""),
      clave: data.clave,
    };
    state.users.push(user);
    state.session = { nombre: user.nombre, correo: user.correo, telefono: user.telefono };
    persist();
    updateHeader();
    go(back ? `#/${back}` : "#/");
  }
});

document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const term = event.target.buscar.value.trim();
  const { params } = parseRoute();
  const next = new URLSearchParams();
  if (term) next.set("buscar", term);
  if (params.get("categoria")) next.set("categoria", params.get("categoria"));
  go(`#/${next.toString() ? `?${next}` : ""}`);
});

window.addEventListener("hashchange", render);
updateHeader();
render();
