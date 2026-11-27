/*
  Prototipo del panel de administración de Nativa 360.
  Rutas en el hash; datos de ejemplo guardados en el navegador.

    #/                      inicio
    #/pedidos[/:codigo]     pedidos, estados, pagos, descuentos y cancelaciones
                            (HU-10, HU-12, HU-29, HU-30, HU-31)
    #/productos[/:id|nuevo] productos e imágenes (HU-08, HU-28)
    #/categorias            categorías (HU-27)
    #/inventario            existencias y movimientos (HU-09)
    #/clientes[/:id]        clientes e historial (HU-11, HU-12)
    #/contenido/:pestaña    negocio, promociones, eventos y multimedia (HU-13, HU-32, HU-33)
    #/visitas               visitas del doctor (HU-14)
    #/usuarios              usuarios y roles (HU-15)
    inicio y cierre de sesión (HU-34)
*/

const PASSWORD = "nativa360";

const MODULES = [
  { id: "inicio", label: "Inicio", icon: "home", path: "#/" },
  { id: "pedidos", label: "Pedidos", icon: "orders", path: "#/pedidos" },
  { id: "productos", label: "Productos", icon: "box", path: "#/productos" },
  { id: "categorias", label: "Categorías", icon: "tag", path: "#/categorias" },
  { id: "inventario", label: "Inventario", icon: "stack", path: "#/inventario" },
  { id: "clientes", label: "Clientes", icon: "users", path: "#/clientes" },
  { id: "contenido", label: "Contenido", icon: "megaphone", path: "#/contenido/negocio" },
  { id: "visitas", label: "Visitas del doctor", icon: "steth", path: "#/visitas" },
  { id: "usuarios", label: "Usuarios", icon: "shield", path: "#/usuarios" },
];

// RN-15, RN-23, RN-27 y RN-28: qué puede hacer cada rol.
const ROLES = {
  administrador: {
    label: "Administrador",
    modules: MODULES.map((module) => module.id),
    actions: ["precio", "crear_producto", "estado", "pago", "descuento", "cancelar"],
  },
  empleado: {
    label: "Empleado",
    modules: ["inicio", "pedidos", "productos", "inventario", "clientes"],
    actions: ["estado", "pago", "cancelar"],
  },
  propietario: {
    label: "Propietario",
    modules: ["inicio", "pedidos"],
    actions: [],
  },
};

const STATUS = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  confirmado: "Confirmado",
  preparado: "Preparado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

// HU-10: transiciones permitidas (la confirmación pasa por el pago, HU-29).
const NEXT_STATUS = {
  pendiente: ["en_revision"],
  en_revision: [],
  confirmado: ["preparado"],
  preparado: ["entregado"],
  entregado: [],
  cancelado: [],
};

const VISIT_STATUS = {
  confirmada: "Confirmada",
  pendiente_confirmar: "Pendiente de confirmar",
  cancelada: "Cancelada",
};

/* ---------- Datos de ejemplo ---------- */

function seed() {
  const products = [
    [
      1,
      "VIT-001",
      "Omega 3",
      "Vitaminas",
      8000,
      10,
      ["frasco", "#2b5c9e", "OMEGA 3"],
      "#eaf2fb",
      true,
    ],
    [
      2,
      "VIT-002",
      "Vitamina C 1000 mg",
      "Vitaminas",
      6500,
      24,
      ["frasco", "#e98a2c", "VIT C"],
      "#fdf1e4",
      true,
    ],
    [
      3,
      "SUP-001",
      "Spirulina en polvo",
      "Superalimentos",
      9500,
      8,
      ["bolsa", "#3a9a5b", "SPIRULINA"],
      "#e4f4ea",
      true,
    ],
    [
      4,
      "TE-001",
      "Té de manzanilla",
      "Tés e infusiones",
      2500,
      20,
      ["caja", "#d9b23b", "MANZANILLA"],
      "#fbf5e1",
      true,
    ],
    [
      5,
      "VIT-003",
      "Magnesio + Zinc",
      "Vitaminas",
      7200,
      3,
      ["frasco", "#7b5ea7", "MAGNESIO"],
      "#f1ecf8",
      false,
    ],
    [
      6,
      "DEP-001",
      "Colágeno hidrolizado",
      "Deportistas",
      14900,
      0,
      ["bolsa", "#c2577a", "COLÁGENO"],
      "#fbeaf0",
      false,
    ],
    [
      7,
      "TE-002",
      "Té verde orgánico",
      "Tés e infusiones",
      3200,
      15,
      ["caja", "#5f8f3e", "TÉ VERDE"],
      "#ecf4e4",
      false,
    ],
    [
      8,
      "CUI-001",
      "Aceite de coco",
      "Cuidado personal",
      5800,
      12,
      ["frasco", "#8fb8c9", "COCO"],
      "#eef6f9",
      false,
      "inactivo",
    ],
    [
      9,
      "DEP-002",
      "Proteína vegetal",
      "Deportistas",
      18500,
      6,
      ["bolsa", "#8a6a4a", "PROTEÍNA"],
      "#f5efe8",
      false,
    ],
    [
      10,
      "VIT-004",
      "Cúrcuma con pimienta",
      "Vitaminas",
      6900,
      2,
      ["frasco", "#d79a1c", "CÚRCUMA"],
      "#fcf3df",
      false,
    ],
    [
      11,
      "CUI-002",
      "Crema de caléndula",
      "Cuidado personal",
      4500,
      9,
      ["tubo", "#e2a33b", "CALÉNDULA"],
      "#fdf4e3",
      false,
    ],
    [
      12,
      "CUI-003",
      "Extracto de propóleo",
      "Cuidado personal",
      5200,
      7,
      ["gotero", "#9c5a1e", "PROPÓLEO"],
      "#f8eee4",
      false,
    ],
  ].map(
    ([
      id,
      codigo,
      nombre,
      categoria,
      precio,
      stock,
      pack,
      tinte,
      destacado,
      estado = "activo",
    ]) => ({
      id,
      codigo,
      nombre,
      categoria,
      precio,
      stock,
      pack,
      tinte,
      destacado,
      estado,
      descripcion: `${nombre} de calidad seleccionada por Nativa 360.`,
    }),
  );

  const customers = [
    {
      id: 1,
      nombre: "Ana Mora",
      correo: "ana@correo.com",
      telefono: "88887777",
      direccion: "Barrio Los Ángeles, San Isidro",
    },
    {
      id: 2,
      nombre: "Carlos Rojas",
      correo: "carlos.rojas@correo.com",
      telefono: "87112233",
      direccion: "Daniel Flores",
    },
    {
      id: 3,
      nombre: "Laura Jiménez",
      correo: "laura.j@correo.com",
      telefono: "86554411",
      direccion: "Palmares",
    },
    {
      id: 4,
      nombre: "José Solano",
      correo: "jsolano@correo.com",
      telefono: "83009988",
      direccion: "San Isidro centro",
    },
    {
      id: 5,
      nombre: "Fernanda Quesada",
      correo: "ferq@correo.com",
      telefono: "89776655",
      direccion: "Rivas",
    },
  ];

  const line = (productId, cantidad) => {
    const product = products.find((item) => item.id === productId);
    return { productoId: productId, nombre: product.nombre, cantidad, precio: product.precio };
  };
  const step = (estado, fecha, usuario, nota = "") => ({ estado, fecha, usuario, nota });

  const orders = [
    {
      codigo: "N360-0043",
      clienteId: 2,
      fecha: "2026-11-26",
      estado: "pendiente",
      entrega: "retiro",
      lineas: [line(3, 1), line(4, 2)],
      historial: [step("pendiente", "2026-11-26", "Cliente (tienda en línea)")],
    },
    {
      codigo: "N360-0042",
      clienteId: 1,
      fecha: "2026-11-25",
      estado: "en_revision",
      entrega: "retiro",
      lineas: [line(1, 2), line(4, 2)],
      historial: [
        step("pendiente", "2026-11-25", "Cliente (tienda en línea)"),
        step("en_revision", "2026-11-25", "María Solís", "Coordinando por WhatsApp"),
      ],
    },
    {
      codigo: "N360-0041",
      clienteId: 1,
      fecha: "2026-11-18",
      estado: "confirmado",
      entrega: "retiro",
      lineas: [line(1, 1)],
      pago: { monto: 8000, referencia: "SINPE 55102" },
      historial: [
        step("pendiente", "2026-11-18", "Cliente (tienda en línea)"),
        step("confirmado", "2026-11-18", "María Solís", "Pago verificado · SINPE 55102"),
      ],
    },
    {
      codigo: "N360-0040",
      clienteId: 3,
      fecha: "2026-11-15",
      estado: "preparado",
      entrega: "domicilio",
      direccion: "Palmares, 200 m norte de la plaza",
      lineas: [line(9, 1), line(2, 2)],
      pago: { monto: 31500, referencia: "SINPE 44871" },
      historial: [
        step("pendiente", "2026-11-15", "Cliente (tienda en línea)"),
        step("confirmado", "2026-11-15", "Laura Campos", "Pago verificado"),
        step("preparado", "2026-11-16", "María Solís"),
      ],
    },
    {
      codigo: "N360-0039",
      clienteId: 4,
      fecha: "2026-11-08",
      estado: "entregado",
      entrega: "retiro",
      lineas: [line(12, 1), line(11, 1)],
      pago: { monto: 9700, referencia: "Efectivo en tienda" },
      historial: [
        step("pendiente", "2026-11-08", "Cliente (tienda en línea)"),
        step("confirmado", "2026-11-08", "María Solís"),
        step("preparado", "2026-11-08", "María Solís"),
        step("entregado", "2026-11-09", "María Solís"),
      ],
    },
    {
      codigo: "N360-0038",
      clienteId: 1,
      fecha: "2026-10-28",
      estado: "entregado",
      entrega: "retiro",
      lineas: [line(4, 2), line(7, 1)],
      pago: { monto: 8200, referencia: "SINPE 39120" },
      historial: [
        step("pendiente", "2026-10-28", "Cliente (tienda en línea)"),
        step("entregado", "2026-10-29", "María Solís"),
      ],
    },
    {
      codigo: "N360-0037",
      clienteId: 5,
      fecha: "2026-10-22",
      estado: "cancelado",
      entrega: "domicilio",
      direccion: "Rivas",
      lineas: [line(6, 1)],
      historial: [
        step("pendiente", "2026-10-22", "Cliente (tienda en línea)"),
        step("cancelado", "2026-10-22", "Laura Campos", "Zona sin cobertura de envío"),
      ],
    },
  ];
  orders.forEach((order) => {
    order.descuento = order.descuento || 0;
  });

  return {
    products,
    customers,
    orders,
    categories: [
      { id: 1, nombre: "Vitaminas", estado: "activo" },
      { id: 2, nombre: "Superalimentos", estado: "activo" },
      { id: 3, nombre: "Tés e infusiones", estado: "activo" },
      { id: 4, nombre: "Cuidado personal", estado: "activo" },
      { id: 5, nombre: "Deportistas", estado: "activo" },
    ],
    movements: [
      {
        productoId: 1,
        tipo: "entrada",
        cantidad: 24,
        motivo: "Pedido al proveedor",
        usuario: "María Solís",
        fecha: "2026-11-20",
      },
      {
        productoId: 6,
        tipo: "salida",
        cantidad: 2,
        motivo: "Producto vencido",
        usuario: "Laura Campos",
        fecha: "2026-11-19",
      },
      {
        productoId: 10,
        tipo: "ajuste",
        cantidad: 2,
        motivo: "Conteo físico",
        usuario: "María Solís",
        fecha: "2026-11-17",
      },
    ],
    business: {
      descripcion: "Suplementos, vitaminas, productos naturales y cuidado personal.",
      direccion: "50 m este de la Municipalidad de Pérez Zeledón",
      telefono: "2771-1234",
      whatsapp: "8888-7777",
      horario: "Lunes a viernes 8:00 a. m. a 6:00 p. m. · Sábado 8:00 a. m. a 4:00 p. m.",
      instagram: "https://www.instagram.com/",
      facebook: "https://www.facebook.com/",
    },
    promotions: [
      {
        id: 1,
        titulo: "10 % en Vitamina C",
        productoId: 2,
        descuento: 10,
        inicio: "2026-11-01",
        fin: "2026-11-30",
        estado: "activo",
      },
    ],
    events: [
      {
        id: 1,
        nombre: "Charla de alimentación consciente",
        fecha: "2026-12-05",
        inicio: "17:00",
        fin: "18:30",
        presencial: true,
        ubicacion: "Local de Nativa 360",
        estado: "activo",
      },
      {
        id: 2,
        nombre: "Feria de productos orgánicos",
        fecha: "2026-12-14",
        inicio: "09:00",
        fin: "14:00",
        presencial: true,
        ubicacion: "Frente a la tienda",
        estado: "activo",
      },
    ],
    media: [
      {
        id: 1,
        titulo: "Receta de batido verde",
        tipo: "video",
        enlace: "https://www.instagram.com/",
        inicio: "2026-11-01",
        fin: "2026-11-30",
        estado: "activo",
      },
    ],
    visits: [
      {
        id: 1,
        doctor: "Dr. Luis Vargas",
        especialidad: "Medicina natural",
        fecha: "2026-12-12",
        inicio: "09:00",
        fin: "12:00",
        estado: "confirmada",
      },
      {
        id: 2,
        doctor: "Dra. Carolina Mora",
        especialidad: "Nutrición",
        fecha: "2026-12-19",
        inicio: "13:00",
        fin: "16:00",
        estado: "pendiente_confirmar",
      },
    ],
    users: [
      {
        id: 1,
        nombre: "Laura Campos",
        correo: "admin@nativa360.com",
        rol: "administrador",
        estado: "activo",
      },
      {
        id: 2,
        nombre: "María Solís",
        correo: "maria@nativa360.com",
        rol: "empleado",
        estado: "activo",
      },
      {
        id: 3,
        nombre: "Santiago Araya",
        correo: "santiago@nativa360.com",
        rol: "propietario",
        estado: "activo",
      },
      {
        id: 4,
        nombre: "Pedro Rojas",
        correo: "pedro@nativa360.com",
        rol: "empleado",
        estado: "deshabilitado",
      },
    ],
  };
}

/* ---------- Estado y guardado ---------- */

const STORE_KEY = "n360-panel";

function load() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORE_KEY));
    if (saved?.db) return saved;
  } catch {
    // Sin almacenamiento: se usan los datos de ejemplo.
  }
  return { db: seed(), sessionId: null };
}

const saved = load();
const db = saved.db;
let sessionId = saved.sessionId;

function save() {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ db, sessionId }));
  } catch {
    // El prototipo sigue funcionando en memoria.
  }
}

const ui = {
  orderStatus: "",
  orderSearch: "",
  from: "",
  to: "",
  productSearch: "",
  customerSearch: "",
  productDraft: null,
};

/* ---------- Utilidades ---------- */

const $ = (selector) => document.querySelector(selector);
const view = $("[data-view]");

const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const money = (value) => `₡${Math.round(value).toLocaleString("en-US").replace(/,/g, " ")}`;

const today = () => new Date().toISOString().slice(0, 10);

/** Fechas en formato dd/mm/aaaa (ui-spec). */
const dmy = (iso) => (iso ? iso.split("-").reverse().join("/") : "");

const fold = (text) => String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const icon = (name) => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;

const badge = (key, label) => `<span class="badge badge--${key}">${esc(label)}</span>`;

function art(product) {
  const [shape, color, label] = product.pack;
  const top = { frasco: 66, bolsa: 62, caja: 70, gotero: 72, tubo: 48 }[shape];
  return `<svg viewBox="0 0 120 160" aria-hidden="true" style="--art:${color}"><use href="#art-${shape}"/>
    <text x="60" y="${top + 34}" text-anchor="middle" font-size="${label.length > 8 ? 8 : 11}" font-weight="800" fill="#163b6e">${esc(label)}</text></svg>`;
}

const thumb = (product) =>
  `<span class="thumb" style="--tint:${product.tinte}">${art(product)}</span>`;

const me = () => db.users.find((user) => user.id === sessionId);
const role = () => ROLES[me()?.rol];
const canSee = (module) => role()?.modules.includes(module);
const can = (action) => role()?.actions.includes(action);

const customerOf = (order) => db.customers.find((customer) => customer.id === order.clienteId);
const productOf = (id) => db.products.find((product) => product.id === Number(id));
const subtotal = (order) =>
  order.lineas.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
const totalOf = (order) => subtotal(order) - (order.descuento || 0);
const isPaid = (order) => ["confirmado", "preparado", "entregado"].includes(order.estado);

let toastTimer;
function toast(message) {
  const box = $("[data-toast]");
  box.innerHTML = `${icon("check")} ${esc(message)}`;
  box.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    box.hidden = true;
  }, 3000);
}

function head(title, subtitle = "", actions = "", back = "") {
  return `<div class="head"><div>
      ${back ? `<a class="back" href="${back}">${icon("back")} Volver</a>` : ""}
      <h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ""}
    </div>${actions ? `<div class="btn-row">${actions}</div>` : ""}</div>`;
}

const empty = (iconName, title, text, extra = "") =>
  `<div class="empty">${icon(iconName)}<h2>${title}</h2><p>${text}</p>${extra}</div>`;

const denied = () =>
  `<div class="card empty denied">${icon("ban")}<h2>No tenés permiso para esta acción</h2>
    <p>Tu rol (${esc(role()?.label)}) no tiene acceso a este módulo. Consultá con el administrador.</p>
    <a class="btn btn--ghost" href="#/">Ir al inicio</a></div>`;

function fld({
  name,
  label,
  type = "text",
  value = "",
  error,
  hint,
  required = true,
  wide = false,
  attrs = "",
  options,
}) {
  const control = options
    ? `<select id="m-${name}" name="${name}" ${attrs}>${options}</select>`
    : type === "textarea"
      ? `<textarea id="m-${name}" name="${name}" ${attrs}>${esc(value)}</textarea>`
      : `<input id="m-${name}" name="${name}" type="${type}" value="${esc(value)}" ${attrs} />`;
  return `<div class="fld ${error ? "fld--bad" : ""} ${wide ? "wide" : ""}">
    <label for="m-${name}">${label}${required ? ' <span class="req">*</span>' : ""}</label>
    ${control}
    ${error ? `<p class="fld__err">${icon("alert")} ${error}</p>` : hint ? `<p class="fld__hint">${hint}</p>` : ""}
  </div>`;
}

const optionList = (items, selected) =>
  items
    .map(
      ([value, label]) =>
        `<option value="${esc(value)}" ${String(value) === String(selected) ? "selected" : ""}>${esc(label)}</option>`,
    )
    .join("");

/* ---------- Ventanas modales ---------- */

const dialog = $("[data-modal]");
let activeModal = null;

function openModal(name, ctx = {}, values = {}, errors = {}) {
  const modal = MODALS[name];
  activeModal = { name, ctx };
  dialog.innerHTML = `<form class="form" data-modal-form novalidate>
      <div class="modal__head"><h2>${modal.title(ctx)}</h2>
        <button class="modal__close" type="button" data-do="close-modal" aria-label="Cerrar">${icon("close")}</button></div>
      <div class="modal__body form">${modal.body(ctx, values, errors)}
        <div class="modal__foot">
          <button class="btn btn--ghost" type="button" data-do="close-modal">Cancelar</button>
          <button class="btn ${modal.danger ? "btn--danger-solid" : "btn--primary"}" type="submit">${modal.submitLabel || "Guardar"}</button>
        </div>
      </div>
    </form>`;
  if (!dialog.open) dialog.showModal();
  dialog
    .querySelector(".fld--bad input, .fld--bad select, .fld--bad textarea, input, select, textarea")
    ?.focus();
}

function closeModal() {
  activeModal = null;
  if (dialog.open) dialog.close();
}

const required = (value) => String(value ?? "").trim() !== "";

const MODALS = {
  // HU-10: cambio de estado con observación
  estado: {
    title: () => "Cambiar estado",
    body: ({ order }, values, errors) =>
      fld({
        name: "estado",
        label: "Nuevo estado",
        options: optionList(
          NEXT_STATUS[order.estado].map((key) => [key, STATUS[key]]),
          values.estado,
        ),
        error: errors.estado,
      }) +
      fld({
        name: "nota",
        label: "Observación",
        type: "textarea",
        required: false,
        value: values.nota,
        hint: "Por ejemplo: Coordinando por WhatsApp",
      }),
    submit: ({ order }, values) => {
      if (!NEXT_STATUS[order.estado].includes(values.estado))
        return { estado: "Ese cambio de estado no está permitido" };
      changeStatus(order, values.estado, values.nota);
      return null;
    },
    done: "Estado actualizado",
  },
  // HU-29: confirmar pago verificado
  pago: {
    title: ({ order }) => `Confirmar pago de ${order.codigo}`,
    submitLabel: "Confirmar pago",
    body: ({ order }, values, errors) =>
      `<p class="notice notice--info">${icon("money")} Total del pedido: <strong>${money(totalOf(order))}</strong>. Confirmá solo si verificaste que el dinero llegó.</p>` +
      fld({
        name: "monto",
        label: "Monto recibido (₡)",
        type: "number",
        value: values.monto,
        error: errors.monto,
        attrs: 'inputmode="numeric" min="0"',
      }) +
      fld({
        name: "referencia",
        label: "Referencia del pago",
        value: values.referencia,
        error: errors.referencia,
        hint: "Número de SINPE, depósito o «Efectivo en tienda»",
      }),
    submit: ({ order }, values) => {
      const amount = Number(values.monto);
      if (!required(values.monto))
        return { monto: "Ingresá el monto recibido para confirmar el pago" };
      if (amount <= 0) return { monto: "El monto debe ser mayor a 0" };
      if (amount !== totalOf(order))
        return { monto: `El monto no coincide con el total del pedido (${money(totalOf(order))})` };
      if (!required(values.referencia)) return { referencia: "La referencia es obligatoria" };
      order.pago = { monto: amount, referencia: values.referencia.trim() };
      changeStatus(order, "confirmado", `Pago verificado · ${values.referencia.trim()}`);
      return null;
    },
    done: "Pago confirmado",
  },
  // HU-31: descuento manual (solo administrador)
  descuento: {
    title: ({ order }) => `Aplicar descuento a ${order.codigo}`,
    submitLabel: "Aplicar descuento",
    body: ({ order }, values, errors) =>
      `<p class="notice notice--info">${icon("percent")} Subtotal: <strong>${money(subtotal(order))}</strong></p>` +
      fld({
        name: "monto",
        label: "Descuento (₡)",
        type: "number",
        value: values.monto,
        error: errors.monto,
        attrs: 'min="0"',
      }) +
      fld({ name: "motivo", label: "Motivo", value: values.motivo, error: errors.motivo }),
    submit: ({ order }, values) => {
      const amount = Number(values.monto);
      if (!(amount > 0)) return { monto: "El descuento debe ser mayor a 0" };
      if (amount >= subtotal(order)) return { monto: "El descuento no puede superar el total" };
      if (!required(values.motivo)) return { motivo: "El motivo del descuento es obligatorio" };
      order.descuento = amount;
      order.historial.push({
        estado: order.estado,
        fecha: today(),
        usuario: me().nombre,
        nota: `Descuento de ${money(amount)} · ${values.motivo.trim()}`,
      });
      return null;
    },
    done: "Descuento aplicado",
  },
  // HU-30: cancelación con revisión del reembolso si ya estaba pagado
  cancelar: {
    title: ({ order }) => `¿Seguro que querés cancelar el pedido ${order.codigo}?`,
    submitLabel: "Cancelar pedido",
    danger: true,
    body: ({ order }, values, errors) =>
      (isPaid(order)
        ? `<p class="notice notice--warn">${icon("alert")} Este pedido ya fue pagado: requiere revisar el reembolso.</p>`
        : "") +
      fld({
        name: "nota",
        label: isPaid(order) ? "Detalle del reembolso" : "Motivo de la cancelación",
        type: "textarea",
        value: values.nota,
        error: errors.nota,
        hint: isPaid(order) ? "Por ejemplo: Reembolso por SINPE 98765" : "",
      }),
    submit: ({ order }, values) => {
      if (!required(values.nota))
        return { nota: isPaid(order) ? "Indicá cómo se hizo el reembolso" : "Indicá el motivo" };
      if (values.nota.length > 500) return { nota: "Máximo 500 caracteres" };
      changeStatus(order, "cancelado", values.nota.trim());
      return null;
    },
    done: "Pedido cancelado",
  },
  // HU-09: movimiento de inventario
  movimiento: {
    title: () => "Registrar movimiento",
    body: (ctx, values, errors) =>
      fld({
        name: "producto",
        label: "Producto",
        options: optionList(
          db.products
            .filter((p) => p.estado === "activo")
            .map((p) => [p.id, `${p.nombre} (${p.stock} disponibles)`]),
          values.producto ?? ctx.productId,
        ),
        error: errors.producto,
      }) +
      fld({
        name: "tipo",
        label: "Tipo",
        options: optionList(
          [
            ["entrada", "Entrada"],
            ["salida", "Salida"],
            ["ajuste", "Ajuste por conteo"],
          ],
          values.tipo,
        ),
      }) +
      fld({
        name: "cantidad",
        label: "Cantidad",
        type: "number",
        value: values.cantidad,
        error: errors.cantidad,
        hint: "En un ajuste, es la cantidad total que hay en la tienda",
        attrs: 'min="0" step="1"',
      }) +
      fld({
        name: "motivo",
        label: "Motivo",
        value: values.motivo,
        error: errors.motivo,
        hint: "Por ejemplo: Pedido al proveedor, Producto vencido",
      }),
    submit: (ctx, values) => {
      const product = productOf(values.producto);
      const qty = Number(values.cantidad);
      if (!Number.isInteger(qty) || String(values.cantidad).includes(","))
        return { cantidad: "La cantidad debe ser un número entero" };
      if (qty <= 0 && values.tipo !== "ajuste")
        return { cantidad: "La cantidad debe ser mayor a 0" };
      if (qty < 0) return { cantidad: "La cantidad no puede ser negativa" };
      if (!required(values.motivo)) return { motivo: "El motivo es obligatorio" };
      if (values.tipo === "salida" && qty > product.stock)
        return { cantidad: `No se puede sacar más de lo disponible (${product.stock} unidades)` };
      product.stock =
        values.tipo === "entrada"
          ? product.stock + qty
          : values.tipo === "salida"
            ? product.stock - qty
            : qty;
      db.movements.unshift({
        productoId: product.id,
        tipo: values.tipo,
        cantidad: qty,
        motivo: values.motivo.trim(),
        usuario: me().nombre,
        fecha: today(),
      });
      return null;
    },
    done: "Movimiento registrado",
  },
  // HU-27: categorías
  categoria: {
    title: ({ category }) => (category ? "Renombrar categoría" : "Nueva categoría"),
    body: ({ category }, values, errors) =>
      fld({
        name: "nombre",
        label: "Nombre",
        value: values.nombre ?? category?.nombre,
        error: errors.nombre,
      }),
    submit: ({ category }, values) => {
      const name = values.nombre.trim();
      if (!name) return { nombre: "El nombre es obligatorio" };
      if (db.categories.some((item) => item !== category && fold(item.nombre) === fold(name)))
        return { nombre: "Ya existe una categoría con ese nombre" };
      if (category) {
        db.products
          .filter((p) => p.categoria === category.nombre)
          .forEach((p) => {
            p.categoria = name;
          });
        category.nombre = name;
      } else {
        db.categories.push({ id: Date.now(), nombre: name, estado: "activo" });
      }
      return null;
    },
    done: "Categoría guardada",
  },
  // HU-13: promociones
  promocion: {
    title: ({ item }) => (item ? "Editar promoción" : "Nueva promoción"),
    body: ({ item = {} }, values, errors) =>
      fld({
        name: "titulo",
        label: "Título",
        value: values.titulo ?? item.titulo,
        error: errors.titulo,
      }) +
      fld({
        name: "producto",
        label: "Producto",
        options: optionList(
          db.products.filter((p) => p.estado === "activo").map((p) => [p.id, p.nombre]),
          values.producto ?? item.productoId,
        ),
      }) +
      fld({
        name: "descuento",
        label: "Descuento (%)",
        type: "number",
        value: values.descuento ?? item.descuento,
        error: errors.descuento,
      }) +
      `<div class="form-grid">${fld({ name: "inicio", label: "Desde", type: "date", value: values.inicio ?? item.inicio, error: errors.inicio })}${fld({ name: "fin", label: "Hasta", type: "date", value: values.fin ?? item.fin, error: errors.fin })}</div>`,
    submit: ({ item }, values) => {
      const pct = Number(values.descuento);
      if (!required(values.titulo)) return { titulo: "El título es obligatorio" };
      if (!(pct > 0)) return { descuento: "El descuento debe ser mayor a 0" };
      if (pct > 100) return { descuento: "El descuento no puede ser mayor a 100 %" };
      if (!values.inicio || !values.fin) return { fin: "Indicá las fechas de la promoción" };
      if (values.fin <= values.inicio)
        return { fin: "La fecha de fin debe ser posterior al inicio" };
      const overlap = db.promotions.some(
        (promo) =>
          promo !== item &&
          promo.estado === "activo" &&
          promo.productoId === Number(values.producto) &&
          promo.inicio <= values.fin &&
          values.inicio <= promo.fin,
      );
      if (overlap)
        return {
          producto: "Este producto ya tiene una promoción en esas fechas",
          fin: "Este producto ya tiene una promoción en esas fechas",
        };
      const data = {
        titulo: values.titulo.trim(),
        productoId: Number(values.producto),
        descuento: pct,
        inicio: values.inicio,
        fin: values.fin,
        estado: "activo",
      };
      if (item) Object.assign(item, data);
      else db.promotions.push({ id: Date.now(), ...data });
      return null;
    },
    done: "Promoción guardada",
  },
  // HU-13: eventos
  evento: {
    title: ({ item }) => (item ? "Editar evento" : "Nuevo evento"),
    body: ({ item = {} }, values, errors) =>
      fld({
        name: "nombre",
        label: "Nombre del evento",
        value: values.nombre ?? item.nombre,
        error: errors.nombre,
      }) +
      `<div class="form-grid">${fld({ name: "fecha", label: "Fecha", type: "date", value: values.fecha ?? item.fecha, error: errors.fecha })}
        <div></div>
        ${fld({ name: "inicio", label: "Hora de inicio", type: "time", value: values.inicio ?? item.inicio })}
        ${fld({ name: "fin", label: "Hora de fin", type: "time", value: values.fin ?? item.fin, error: errors.fin })}</div>` +
      `<label class="check"><input type="checkbox" name="presencial" ${(values.presencial ?? item.presencial ?? true) ? "checked" : ""}/> Es presencial</label>` +
      fld({
        name: "ubicacion",
        label: "Ubicación",
        required: false,
        value: values.ubicacion ?? item.ubicacion,
        error: errors.ubicacion,
      }),
    submit: ({ item }, values) => {
      const presencial = values.presencial === "on";
      if (!required(values.nombre)) return { nombre: "El nombre es obligatorio" };
      if (!values.fecha) return { fecha: "La fecha es obligatoria" };
      if (!values.inicio || !values.fin || values.fin <= values.inicio)
        return { fin: "La hora de fin debe ser posterior al inicio" };
      if (presencial && !required(values.ubicacion))
        return { ubicacion: "Indicá la ubicación del evento" };
      const data = {
        nombre: values.nombre.trim(),
        fecha: values.fecha,
        inicio: values.inicio,
        fin: values.fin,
        presencial,
        ubicacion: values.ubicacion?.trim() || "",
        estado: "activo",
      };
      if (item) Object.assign(item, data);
      else db.events.push({ id: Date.now(), ...data });
      return null;
    },
    done: "Evento guardado",
  },
  // HU-33: contenido multimedia
  multimedia: {
    title: ({ item }) => (item ? "Editar publicación" : "Nueva publicación"),
    body: ({ item = {} }, values, errors) =>
      fld({
        name: "titulo",
        label: "Título",
        value: values.titulo ?? item.titulo,
        error: errors.titulo,
      }) +
      fld({
        name: "tipo",
        label: "Tipo",
        options: optionList(
          [
            ["imagen", "Imagen"],
            ["video", "Video"],
          ],
          values.tipo ?? item.tipo,
        ),
      }) +
      fld({
        name: "enlace",
        label: "Enlace",
        type: "url",
        value: values.enlace ?? item.enlace,
        error: errors.enlace,
        hint: "Enlace a la imagen o al video (Instagram, YouTube…)",
      }) +
      `<div class="form-grid">${fld({ name: "inicio", label: "Publicar desde", type: "date", value: values.inicio ?? item.inicio })}${fld({ name: "fin", label: "Hasta", type: "date", required: false, value: values.fin ?? item.fin, error: errors.fin })}</div>`,
    submit: ({ item }, values) => {
      if (!required(values.titulo)) return { titulo: "El título es obligatorio" };
      if (!/^https?:\/\/\S+\.\S+/.test(values.enlace))
        return { enlace: "Ingresá un enlace válido" };
      if (values.fin && values.fin <= values.inicio)
        return { fin: "La fecha de fin debe ser posterior al inicio" };
      const data = {
        titulo: values.titulo.trim(),
        tipo: values.tipo,
        enlace: values.enlace,
        inicio: values.inicio || today(),
        fin: values.fin,
        estado: "activo",
      };
      if (item) Object.assign(item, data);
      else db.media.push({ id: Date.now(), ...data });
      return null;
    },
    done: "Publicación guardada",
  },
  // HU-14: visitas del doctor
  visita: {
    title: ({ item }) => (item ? "Editar visita" : "Nueva visita"),
    body: ({ item = {} }, values, errors) =>
      `<div class="form-grid">${fld({ name: "doctor", label: "Nombre del doctor", value: values.doctor ?? item.doctor, error: errors.doctor })}
        ${fld({ name: "especialidad", label: "Especialidad", value: values.especialidad ?? item.especialidad, error: errors.especialidad })}
        ${fld({ name: "fecha", label: "Fecha", type: "date", value: values.fecha ?? item.fecha, error: errors.fecha })}
        ${fld({ name: "estado", label: "Estado", options: optionList(Object.entries(VISIT_STATUS), values.estado ?? item.estado ?? "pendiente_confirmar") })}
        ${fld({ name: "inicio", label: "Hora de inicio", type: "time", value: values.inicio ?? item.inicio })}
        ${fld({ name: "fin", label: "Hora de fin", type: "time", value: values.fin ?? item.fin, error: errors.fin })}</div>` +
      `<p class="fld__hint">Solo las visitas <strong>confirmadas</strong> se publican en el sitio.</p>`,
    submit: ({ item }, values) => {
      if (!required(values.doctor)) return { doctor: "El nombre del doctor es obligatorio" };
      if (!required(values.especialidad)) return { especialidad: "La especialidad es obligatoria" };
      if (!values.fecha) return { fecha: "La fecha es obligatoria" };
      if (values.fecha < today())
        return { fecha: "La fecha de la visita no puede estar en el pasado" };
      if (!values.inicio || !values.fin || values.fin <= values.inicio)
        return { fin: "La hora de fin debe ser posterior al inicio" };
      const data = {
        doctor: values.doctor.trim(),
        especialidad: values.especialidad.trim(),
        fecha: values.fecha,
        inicio: values.inicio,
        fin: values.fin,
        estado: values.estado,
      };
      if (item) Object.assign(item, data);
      else db.visits.push({ id: Date.now(), ...data });
      return null;
    },
    done: "Visita guardada",
  },
  // HU-15: usuarios internos
  usuario: {
    title: ({ item }) => (item ? `Editar a ${item.nombre}` : "Nuevo usuario"),
    body: ({ item = {} }, values, errors) =>
      fld({
        name: "nombre",
        label: "Nombre",
        value: values.nombre ?? item.nombre,
        error: errors.nombre,
      }) +
      fld({
        name: "correo",
        label: "Correo",
        type: "email",
        value: values.correo ?? item.correo,
        error: errors.correo,
        attrs: item.id ? "disabled" : "",
      }) +
      fld({
        name: "rol",
        label: "Rol",
        options: optionList(
          Object.entries(ROLES).map(([key, value]) => [key, value.label]),
          values.rol ?? item.rol ?? "empleado",
        ),
        error: errors.rol,
      }) +
      (item.id
        ? ""
        : `<p class="fld__hint">La persona recibe un correo para crear su contraseña. El sistema no guarda contraseñas.</p>`),
    submit: ({ item }, values) => {
      if (!required(values.nombre)) return { nombre: "El nombre es obligatorio" };
      if (!item) {
        const email = String(values.correo).trim().toLowerCase();
        if (!email) return { correo: "El correo es obligatorio" };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          return { correo: "Ingresá un correo válido" };
        if (db.users.some((user) => user.correo === email))
          return { correo: "Ya existe un usuario con ese correo" };
        db.users.push({
          id: Date.now(),
          nombre: values.nombre.trim(),
          correo: email,
          rol: values.rol,
          estado: "activo",
        });
        return null;
      }
      const admins = db.users.filter(
        (user) => user.rol === "administrador" && user.estado === "activo",
      );
      if (item.rol === "administrador" && values.rol !== "administrador" && admins.length === 1)
        return { rol: "Tiene que quedar al menos un administrador" };
      item.nombre = values.nombre.trim();
      item.rol = values.rol;
      return null;
    },
    done: "Usuario guardado",
  },
  // Confirmación genérica para deshabilitar
  confirmar: {
    title: ({ title }) => title,
    submitLabel: "Sí, continuar",
    danger: true,
    body: ({ message }) => `<p>${message}</p>`,
    submit: ({ action }) => action(),
    done: "Cambios guardados",
  },
};

function changeStatus(order, status, note = "") {
  order.estado = status;
  order.historial.push({
    estado: status,
    fecha: today(),
    usuario: me().nombre,
    nota: note?.trim() || "",
  });
}

/* ---------- Pantallas ---------- */

function homeView() {
  const pending = db.orders.filter((order) => ["pendiente", "en_revision"].includes(order.estado));
  const month = today().slice(0, 7);
  const sales = db.orders
    .filter((order) => isPaid(order) && order.fecha.startsWith(month))
    .reduce((sum, order) => sum + totalOf(order), 0);
  const low = db.products.filter((product) => product.estado === "activo" && product.stock <= 3);
  const visit = db.visits
    .filter((item) => item.estado === "confirmada" && item.fecha >= today())
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
  const first = me().nombre.split(" ")[0];

  return `${head(`Hola, ${esc(first)} 👋`, `Esto es lo que pasa hoy en Nativa 360 · ${dmy(today())}`)}
    <div class="kpis">
      <a class="kpi kpi--amber" href="#/pedidos"><span class="kpi__icon">${icon("orders")}</span><div><p class="kpi__label">Pedidos por atender</p><p class="kpi__value">${pending.length}</p></div></a>
      <div class="kpi kpi--green"><span class="kpi__icon">${icon("trend")}</span><div><p class="kpi__label">Ventas confirmadas del mes</p><p class="kpi__value">${money(sales)}</p></div></div>
      <a class="kpi kpi--red" href="${canSee("inventario") ? "#/inventario" : "#/"}"><span class="kpi__icon">${icon("stack")}</span><div><p class="kpi__label">Productos con stock bajo</p><p class="kpi__value">${low.length}</p></div></a>
      <div class="kpi"><span class="kpi__icon">${icon("steth")}</span><div><p class="kpi__label">Próxima visita del doctor</p><p class="kpi__value" style="font-size:1.1rem">${visit ? `${dmy(visit.fecha)}` : "Sin visitas"}</p>${visit ? `<p class="kpi__label">${esc(visit.doctor)}</p>` : ""}</div></div>
    </div>
    <div class="grid-2">
      <section class="card"><h2 class="card__title">Pedidos por atender <a class="btn btn--ghost btn--sm" href="#/pedidos">Ver todos</a></h2>
        ${
          pending.length
            ? `<ul class="list">${pending
                .map(
                  (order) => `<li><a class="list__item" href="#/pedidos/${order.codigo}">
          <span><strong>${order.codigo}</strong><small>${esc(customerOf(order).nombre)} · ${dmy(order.fecha)}</small></span>
          <span class="list__end">${badge(order.estado, STATUS[order.estado])}<small>${money(totalOf(order))}</small></span></a></li>`,
                )
                .join("")}</ul>`
            : empty("check", "Todo al día", "No hay pedidos pendientes.")
        }
      </section>
      <section class="card"><h2 class="card__title">Stock bajo ${canSee("inventario") ? `<a class="btn btn--ghost btn--sm" href="#/inventario">Inventario</a>` : ""}</h2>
        ${
          low.length
            ? `<ul class="list">${low
                .map(
                  (
                    product,
                  ) => `<li class="list__item">${thumb(product)}<span><strong>${esc(product.nombre)}</strong><small>${esc(product.codigo)}</small></span>
          <span class="list__end">${product.stock === 0 ? badge("agotado", "Agotado") : badge("bajo", `${product.stock} unidades`)}</span></li>`,
                )
                .join("")}</ul>`
            : empty("check", "Sin alertas", "Todos los productos tienen existencias.")
        }
      </section>
    </div>`;
}

/* HU-10 y HU-12: lista e historial de pedidos */
function ordersView() {
  const term = fold(ui.orderSearch);
  const badRange = ui.from && ui.to && ui.to < ui.from;
  const rows = db.orders
    .filter((order) => !ui.orderStatus || order.estado === ui.orderStatus)
    .filter((order) => !term || fold(`${order.codigo} ${customerOf(order).nombre}`).includes(term))
    .filter(
      (order) =>
        badRange || ((!ui.from || order.fecha >= ui.from) && (!ui.to || order.fecha <= ui.to)),
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.codigo.localeCompare(a.codigo));

  const pills = [["", "Todos"], ...Object.entries(STATUS)]
    .map(
      ([key, label]) =>
        `<button class="pill" type="button" data-do="order-status" data-value="${key}" aria-pressed="${ui.orderStatus === key}">${label}</button>`,
    )
    .join("");

  return `${head("Pedidos", "Seguimiento de los pedidos registrados en la tienda en línea.")}
    <div class="toolbar">
      <div class="search">${icon("search")}<input type="search" placeholder="Buscar por código o cliente" value="${esc(ui.orderSearch)}" data-input="orderSearch" aria-label="Buscar pedidos" /></div>
      <label class="fld" style="grid-auto-flow:column;align-items:center">Desde <input type="date" value="${ui.from}" data-input="from" /></label>
      <label class="fld" style="grid-auto-flow:column;align-items:center">Hasta <input type="date" value="${ui.to}" data-input="to" /></label>
    </div>
    <div class="toolbar"><div class="pills" role="group" aria-label="Filtrar por estado">${pills}</div></div>
    ${badRange ? `<p class="notice notice--error" style="margin-bottom:14px">${icon("alert")} La fecha final debe ser posterior a la inicial</p>` : ""}
    <div class="table-wrap">${
      rows.length
        ? `<table><thead><tr><th>Pedido</th><th>Cliente</th><th class="hide-sm">Fecha</th><th class="hide-sm">Entrega</th><th>Estado</th><th class="num">Total</th></tr></thead><tbody>
          ${rows
            .map(
              (
                order,
              ) => `<tr data-href="#/pedidos/${order.codigo}"><td><a href="#/pedidos/${order.codigo}"><strong>${order.codigo}</strong></a></td>
            <td>${esc(customerOf(order).nombre)}</td><td class="hide-sm">${dmy(order.fecha)}</td>
            <td class="hide-sm">${order.entrega === "retiro" ? "Retiro" : "Domicilio"}</td>
            <td>${badge(order.estado, STATUS[order.estado])}</td><td class="num"><strong>${money(totalOf(order))}</strong></td></tr>`,
            )
            .join("")}
          </tbody></table>`
        : empty(
            "orders",
            "No hay pedidos con esos filtros",
            "Probá con otro estado o rango de fechas.",
          )
    }</div>`;
}

/* HU-10, HU-29, HU-30 y HU-31: detalle de pedido */
function orderDetailView(code) {
  const order = db.orders.find((item) => item.codigo === code);
  if (!order)
    return empty(
      "orders",
      "Pedido no encontrado",
      "Revisá el código.",
      `<a class="btn btn--ghost" href="#/pedidos">Volver a pedidos</a>`,
    );
  const customer = customerOf(order);
  const next = NEXT_STATUS[order.estado];
  const closed = ["entregado", "cancelado"].includes(order.estado);

  const actions = [];
  if (can("estado") && next.length)
    actions.push(
      `<button class="btn btn--primary" type="button" data-do="modal" data-modal="estado">${icon("next")} Cambiar estado</button>`,
    );
  if (order.estado === "en_revision") {
    actions.push(
      can("pago")
        ? `<button class="btn btn--green" type="button" data-do="modal" data-modal="pago">${icon("money")} Confirmar pago</button>`
        : `<p class="notice notice--info">${icon("alert")} Un usuario con permiso tiene que confirmar el pago.</p>`,
    );
  }
  if (order.estado === "pendiente")
    actions.push(
      `<p class="notice notice--info">${icon("alert")} Pasalo a «En revisión» mientras coordinás por WhatsApp.</p>`,
    );
  if (can("descuento") && ["pendiente", "en_revision"].includes(order.estado)) {
    actions.push(
      `<button class="btn btn--ghost" type="button" data-do="modal" data-modal="descuento">${icon("percent")} Aplicar descuento</button>`,
    );
  }
  if (can("cancelar") && !closed)
    actions.push(
      `<button class="btn btn--danger" type="button" data-do="modal" data-modal="cancelar">${icon("ban")} Cancelar pedido</button>`,
    );
  if (closed)
    actions.push(
      `<p class="notice notice--info">${icon("check")} ${order.estado === "entregado" ? "Un pedido entregado no puede cambiar de estado." : "Este pedido está cancelado."}</p>`,
    );
  if (!role().actions.length)
    actions.push(
      `<p class="notice notice--info">${icon("alert")} Tu rol puede consultar los pedidos, pero no modificarlos.</p>`,
    );

  return `${head(`Pedido ${order.codigo}`, `Registrado el ${dmy(order.fecha)} · ${badge(order.estado, STATUS[order.estado])}`, "", "#/pedidos")}
    <div class="grid-2">
      <div>
        <section class="card"><h2 class="card__title">Productos</h2>
          <div class="lines">${order.lineas
            .map((item) => {
              const product = productOf(item.productoId);
              return `<div class="line">${product ? thumb(product) : ""}<span class="line__qty">${item.cantidad} ×</span><span class="line__name">${esc(item.nombre)}<br><small class="muted">${money(item.precio)} c/u</small></span><strong>${money(item.cantidad * item.precio)}</strong></div>`;
            })
            .join("")}</div>
          <div class="totals">
            <div><span class="muted">Subtotal</span><span>${money(subtotal(order))}</span></div>
            ${order.descuento ? `<div><span class="muted">Descuento</span><span>− ${money(order.descuento)}</span></div>` : ""}
            <div class="grand"><span>Total</span><span>${money(totalOf(order))}</span></div>
          </div>
        </section>
        <section class="card"><h2 class="card__title">Historial de estados</h2>
          <ol class="timeline">${order.historial.map((step) => `<li><strong>${STATUS[step.estado]}</strong>${step.nota ? ` · ${esc(step.nota)}` : ""}<small>${dmy(step.fecha)} · ${esc(step.usuario)}</small></li>`).join("")}</ol>
        </section>
      </div>
      <div>
        <section class="card actions-card"><h2 class="card__title">Acciones</h2>${actions.join("")}</section>
        <section class="card"><h2 class="card__title">Cliente y entrega</h2>
          <dl class="facts">
            <div><dt>Cliente</dt><dd>${canSee("clientes") ? `<a href="#/clientes/${customer.id}">${esc(customer.nombre)}</a>` : esc(customer.nombre)}</dd></div>
            <div><dt>Teléfono</dt><dd>${esc(customer.telefono)}</dd></div>
            <div><dt>Entrega</dt><dd>${order.entrega === "retiro" ? "Retiro en tienda" : `Envío a domicilio · ${esc(order.direccion)}`}</dd></div>
            ${order.pago ? `<div><dt>Pago verificado</dt><dd>${money(order.pago.monto)} · ${esc(order.pago.referencia)}</dd></div>` : ""}
          </dl>
          <a class="btn btn--green" style="margin-top:16px" href="https://wa.me/506${customer.telefono}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
        </section>
      </div>
    </div>`;
}

/* HU-08: lista de productos */
function productsView() {
  const term = fold(ui.productSearch);
  const rows = db.products.filter(
    (product) =>
      !term || fold(`${product.codigo} ${product.nombre} ${product.categoria}`).includes(term),
  );
  return `${head("Productos", "Lo que se muestra en la tienda en línea.", can("crear_producto") ? `<a class="btn btn--primary" href="#/productos/nuevo">${icon("plus")} Nuevo producto</a>` : "")}
    <div class="toolbar"><div class="search">${icon("search")}<input type="search" placeholder="Buscar por código, nombre o categoría" value="${esc(ui.productSearch)}" data-input="productSearch" aria-label="Buscar productos" /></div></div>
    <div class="table-wrap">${
      rows.length
        ? `<table><thead><tr><th>Producto</th><th class="hide-sm">Categoría</th><th class="num">Precio</th><th class="num">Stock</th><th>Estado</th></tr></thead><tbody>
      ${rows
        .map(
          (
            product,
          ) => `<tr data-href="#/productos/${product.id}"><td><div class="cell-main">${thumb(product)}<span><a href="#/productos/${product.id}"><strong>${esc(product.nombre)}</strong></a><small>${esc(product.codigo)}${product.destacado ? " · Destacado" : ""}</small></span></div></td>
        <td class="hide-sm">${esc(product.categoria)}</td><td class="num">${money(product.precio)}</td>
        <td class="num">${product.stock === 0 ? badge("agotado", "0") : product.stock <= 3 ? badge("bajo", product.stock) : product.stock}</td>
        <td>${badge(product.estado, product.estado === "activo" ? "Activo" : "Inactivo")}</td></tr>`,
        )
        .join("")}
      </tbody></table>`
        : empty(
            "box",
            "Sin resultados",
            `No hay productos que coincidan con «${esc(ui.productSearch)}».`,
          )
    }</div>`;
}

/* HU-08 y HU-28: formulario de producto */
function productFormView(id) {
  const isNew = id === "nuevo";
  if (isNew && !can("crear_producto")) return denied();
  const product = isNew ? null : productOf(id);
  if (!isNew && !product)
    return empty(
      "box",
      "Producto no encontrado",
      "",
      `<a class="btn btn--ghost" href="#/productos">Volver</a>`,
    );
  const draft = ui.productDraft || { values: {}, errors: {} };
  const v = (key) => draft.values[key] ?? product?.[key] ?? "";
  const e = draft.errors;
  const priceLocked = !can("precio");
  const preview = product ? thumb(product) : `<span class="thumb">${icon("upload")}</span>`;

  return `${head(isNew ? "Nuevo producto" : esc(product.nombre), isNew ? "Completá los datos y guardá." : `${esc(product.codigo)} · ${badge(product.estado, product.estado === "activo" ? "Activo" : "Inactivo")}`, "", "#/productos")}
    <div class="grid-2">
      <form class="card form" data-form="producto" data-id="${isNew ? "" : product.id}" novalidate>
        ${e.general ? `<p class="notice notice--error">${icon("alert")} ${e.general}</p>` : ""}
        <div class="form-grid">
          ${fld({ name: "codigo", label: "Código", value: v("codigo"), error: e.codigo, attrs: isNew ? "" : "disabled" })}
          ${fld({
            name: "categoria",
            label: "Categoría",
            options: optionList(
              db.categories.filter((c) => c.estado === "activo").map((c) => [c.nombre, c.nombre]),
              v("categoria"),
            ),
          })}
          ${fld({ name: "nombre", label: "Nombre", value: v("nombre"), error: e.nombre, wide: true })}
          ${fld({ name: "descripcion", label: "Descripción", type: "textarea", value: v("descripcion"), error: e.descripcion, wide: true })}
          ${fld({ name: "precio", label: "Precio (₡)", type: "number", value: v("precio"), error: e.precio, hint: priceLocked ? "Solo el administrador puede cambiar precios" : "", attrs: priceLocked ? "disabled" : 'min="0"' })}
          ${isNew ? fld({ name: "stock", label: "Existencias iniciales", type: "number", value: v("stock") || 0, attrs: 'min="0"', required: false }) : `<div class="fld"><span class="fld__label">Existencias</span><p><strong>${product.stock}</strong> · se cambian desde <a href="#/inventario">Inventario</a></p></div>`}
          <div class="fld wide"><span class="fld__label">Imagen <span class="req">*</span></span>
            <div class="upload">${preview}<div><input type="file" name="imagen" accept="image/png,image/jpeg,image/webp" data-file />
              <p class="fld__hint">JPG, PNG o WebP, máximo 5 MB.</p>${e.imagen ? `<p class="fld__err">${icon("alert")} ${e.imagen}</p>` : ""}</div></div></div>
          <label class="check wide"><input type="checkbox" name="destacado" ${(draft.values.destacado ?? product?.destacado) ? "checked" : ""} /> Mostrar en «Productos destacados» de la landing</label>
        </div>
        <div class="btn-row"><button class="btn btn--primary" type="submit">${icon("check")} Guardar</button><a class="btn btn--ghost" href="#/productos">Cancelar</a></div>
      </form>
      ${
        isNew
          ? ""
          : `<section class="card"><h2 class="card__title">Estado en la tienda</h2>
        <p class="muted" style="margin-bottom:14px">${product.estado === "activo" ? "El producto aparece en el catálogo. Si lo deshabilitás, deja de mostrarse pero sigue en los pedidos que ya lo incluyen." : "El producto está oculto en el catálogo."}</p>
        ${can("crear_producto") ? `<button class="btn ${product.estado === "activo" ? "btn--danger" : "btn--green"}" type="button" data-do="toggle-product" data-id="${product.id}">${product.estado === "activo" ? `${icon("ban")} Deshabilitar producto` : `${icon("check")} Volver a activar`}</button>` : `<p class="notice notice--info">${icon("alert")} Solo el administrador puede deshabilitar productos.</p>`}
      </section>`
      }
    </div>`;
}

/* HU-27: categorías */
function categoriesView() {
  return `${head("Categorías", "Se usan como filtros en la tienda en línea.", `<button class="btn btn--primary" type="button" data-do="modal" data-modal="categoria">${icon("plus")} Nueva categoría</button>`)}
    <div class="table-wrap"><table><thead><tr><th>Categoría</th><th class="num">Productos activos</th><th>Estado</th><th class="num">Acciones</th></tr></thead><tbody>
    ${db.categories
      .map((category) => {
        const count = db.products.filter(
          (p) => p.categoria === category.nombre && p.estado === "activo",
        ).length;
        return `<tr><td><strong>${esc(category.nombre)}</strong></td><td class="num">${count}</td><td>${badge(category.estado, category.estado === "activo" ? "Activa" : "Inactiva")}</td>
        <td class="num"><div class="btn-row" style="justify-content:flex-end">
          <button class="btn btn--ghost btn--sm" type="button" data-do="modal" data-modal="categoria" data-id="${category.id}">${icon("edit")} Renombrar</button>
          <button class="btn ${category.estado === "activo" ? "btn--danger" : "btn--ghost"} btn--sm" type="button" data-do="toggle-category" data-id="${category.id}">${category.estado === "activo" ? "Deshabilitar" : "Activar"}</button>
        </div></td></tr>`;
      })
      .join("")}
    </tbody></table></div>`;
}

/* HU-09: inventario */
function inventoryView() {
  const active = db.products
    .filter((product) => product.estado === "activo")
    .sort((a, b) => a.stock - b.stock);
  return `${head("Inventario", "Existencias por producto. Cada cambio queda registrado con motivo y responsable.", `<button class="btn btn--primary" type="button" data-do="modal" data-modal="movimiento">${icon("plus")} Registrar movimiento</button>`)}
    <div class="grid-2">
      <div class="table-wrap"><table><thead><tr><th>Producto</th><th class="num">Disponibles</th><th class="num"></th></tr></thead><tbody>
        ${active
          .map(
            (
              product,
            ) => `<tr><td><div class="cell-main">${thumb(product)}<span><strong>${esc(product.nombre)}</strong><small>${esc(product.codigo)}</small></span></div></td>
          <td class="num">${product.stock === 0 ? badge("agotado", "Agotado") : product.stock <= 3 ? badge("bajo", `${product.stock} · bajo`) : `<strong>${product.stock}</strong>`}</td>
          <td class="num"><button class="btn btn--ghost btn--sm" type="button" data-do="modal" data-modal="movimiento" data-id="${product.id}">Movimiento</button></td></tr>`,
          )
          .join("")}
      </tbody></table></div>
      <section class="card"><h2 class="card__title">Últimos movimientos</h2>
        <ul class="list">${db.movements
          .slice(0, 8)
          .map(
            (
              move,
            ) => `<li class="list__item"><span>${badge(move.tipo === "entrada" ? "activo" : move.tipo === "salida" ? "cancelado" : "confirmado", move.tipo === "entrada" ? `+${move.cantidad}` : move.tipo === "salida" ? `−${move.cantidad}` : `= ${move.cantidad}`)}</span>
          <span><strong>${esc(productOf(move.productoId)?.nombre)}</strong><small>${esc(move.motivo)} · ${esc(move.usuario)} · ${dmy(move.fecha)}</small></span></li>`,
          )
          .join("")}</ul>
      </section>
    </div>`;
}

/* HU-11: clientes */
function customersView() {
  const term = fold(ui.customerSearch.trim());
  const digits = ui.customerSearch.replace(/\D/g, "");
  const rows = db.customers.filter(
    (customer) =>
      !term ||
      fold(`${customer.nombre} ${customer.correo}`).includes(term) ||
      (digits.length >= 4 && customer.telefono.includes(digits)),
  );
  return `${head("Clientes", "Datos de contacto e historial de pedidos.")}
    <div class="toolbar"><div class="search">${icon("search")}<input type="search" placeholder="Buscar por nombre, teléfono o correo" value="${esc(ui.customerSearch)}" data-input="customerSearch" aria-label="Buscar clientes" /></div></div>
    <div class="table-wrap">${
      rows.length
        ? `<table><thead><tr><th>Cliente</th><th class="hide-sm">Teléfono</th><th class="hide-sm">Correo</th><th class="num">Pedidos</th></tr></thead><tbody>
      ${rows
        .map(
          (
            customer,
          ) => `<tr data-href="#/clientes/${customer.id}"><td><div class="cell-main"><span class="avatar">${esc(customer.nombre[0])}</span><a href="#/clientes/${customer.id}"><strong>${esc(customer.nombre)}</strong></a></div></td>
        <td class="hide-sm">${esc(customer.telefono)}</td><td class="hide-sm">${esc(customer.correo)}</td>
        <td class="num">${db.orders.filter((order) => order.clienteId === customer.id).length}</td></tr>`,
        )
        .join("")}
      </tbody></table>`
        : empty(
            "users",
            `No hay clientes que coincidan con «${esc(ui.customerSearch)}»`,
            "Probá con otro nombre, teléfono o correo.",
          )
    }</div>`;
}

function customerDetailView(id) {
  const customer = db.customers.find((item) => item.id === Number(id));
  if (!customer)
    return empty(
      "users",
      "Cliente no encontrado",
      "",
      `<a class="btn btn--ghost" href="#/clientes">Volver</a>`,
    );
  const orders = db.orders
    .filter((order) => order.clienteId === customer.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const spent = orders.filter(isPaid).reduce((sum, order) => sum + totalOf(order), 0);
  return `${head(esc(customer.nombre), `${orders.length} pedidos · ${money(spent)} en compras confirmadas`, "", "#/clientes")}
    <div class="grid-2">
      <div class="table-wrap"><table><thead><tr><th>Pedido</th><th>Fecha</th><th>Estado</th><th class="num">Total</th></tr></thead><tbody>
        ${orders.map((order) => `<tr data-href="#/pedidos/${order.codigo}"><td><a href="#/pedidos/${order.codigo}"><strong>${order.codigo}</strong></a></td><td>${dmy(order.fecha)}</td><td>${badge(order.estado, STATUS[order.estado])}</td><td class="num">${money(totalOf(order))}</td></tr>`).join("")}
      </tbody></table></div>
      <section class="card"><h2 class="card__title">Contacto</h2>
        <dl class="facts">
          <div><dt>Correo</dt><dd>${esc(customer.correo)}</dd></div>
          <div><dt>Teléfono</dt><dd>${esc(customer.telefono)}</dd></div>
          <div><dt>Dirección</dt><dd>${esc(customer.direccion)}</dd></div>
        </dl>
        <a class="btn btn--green" style="margin-top:16px" href="https://wa.me/506${customer.telefono}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
      </section>
    </div>`;
}

/* HU-13, HU-32 y HU-33: contenido del sitio */
function contentView(tab = "negocio") {
  const tabs = [
    ["negocio", "Información del negocio"],
    ["promociones", "Promociones"],
    ["eventos", "Eventos"],
    ["multimedia", "Multimedia"],
  ];
  const now = today();
  const validity = (item) =>
    item.estado !== "activo"
      ? badge("inactivo", "Retirada")
      : item.fin && item.fin < now
        ? badge("vencida", "Vencida")
        : item.inicio > now
          ? badge("programada", "Programada")
          : badge("vigente", "Vigente");
  const toggle = (kind, item) =>
    `<button class="btn ${item.estado === "activo" ? "btn--danger" : "btn--ghost"} btn--sm" type="button" data-do="toggle-content" data-kind="${kind}" data-id="${item.id}">${item.estado === "activo" ? "Retirar" : "Publicar"}</button>`;
  const editBtn = (modal, id) =>
    `<button class="btn btn--ghost btn--sm" type="button" data-do="modal" data-modal="${modal}" data-id="${id}">${icon("edit")} Editar</button>`;
  let body = "";

  if (tab === "negocio") {
    const b = ui.businessDraft || { values: db.business, errors: {} };
    body = `<form class="card form" data-form="negocio" novalidate><div class="form-grid">
      ${fld({ name: "descripcion", label: "Descripción", type: "textarea", value: b.values.descripcion, wide: true })}
      ${fld({ name: "direccion", label: "Dirección", value: b.values.direccion, wide: true })}
      ${fld({ name: "telefono", label: "Teléfono", value: b.values.telefono, error: b.errors.telefono })}
      ${fld({ name: "whatsapp", label: "WhatsApp", value: b.values.whatsapp, error: b.errors.whatsapp })}
      ${fld({ name: "horario", label: "Horario", value: b.values.horario, wide: true, required: false })}
      ${fld({ name: "instagram", label: "Enlace de Instagram", value: b.values.instagram, error: b.errors.instagram, required: false })}
      ${fld({ name: "facebook", label: "Enlace de Facebook", value: b.values.facebook, error: b.errors.facebook, required: false })}
    </div><div class="btn-row"><button class="btn btn--primary" type="submit">${icon("check")} Guardar cambios</button></div>
    <p class="fld__hint">La landing muestra los cambios en su próxima actualización.</p></form>`;
  }
  if (tab === "promociones") {
    body = `<div class="toolbar"><button class="btn btn--primary" type="button" data-do="modal" data-modal="promocion">${icon("plus")} Nueva promoción</button></div>
      <div class="table-wrap"><table><thead><tr><th>Promoción</th><th class="hide-sm">Producto</th><th>Vigencia</th><th>Estado</th><th class="num"></th></tr></thead><tbody>
      ${db.promotions
        .map(
          (
            promo,
          ) => `<tr><td><strong>${esc(promo.titulo)}</strong><br><small class="muted">-${promo.descuento} %</small></td><td class="hide-sm">${esc(productOf(promo.productoId)?.nombre)}</td>
        <td>${dmy(promo.inicio)} – ${dmy(promo.fin)}</td><td>${validity(promo)}</td><td class="num"><div class="btn-row" style="justify-content:flex-end">${editBtn("promocion", promo.id)}${toggle("promotions", promo)}</div></td></tr>`,
        )
        .join("")}
      </tbody></table></div>`;
  }
  if (tab === "eventos") {
    body = `<div class="toolbar"><button class="btn btn--primary" type="button" data-do="modal" data-modal="evento">${icon("plus")} Nuevo evento</button></div>
      <div class="table-wrap"><table><thead><tr><th>Evento</th><th>Fecha</th><th class="hide-sm">Ubicación</th><th>Estado</th><th class="num"></th></tr></thead><tbody>
      ${db.events
        .map(
          (
            event,
          ) => `<tr><td><strong>${esc(event.nombre)}</strong></td><td>${dmy(event.fecha)}<br><small class="muted">${event.inicio} – ${event.fin}</small></td>
        <td class="hide-sm">${event.presencial ? esc(event.ubicacion) : "Virtual"}</td><td>${validity({ ...event, inicio: event.fecha, fin: event.fecha })}</td>
        <td class="num"><div class="btn-row" style="justify-content:flex-end">${editBtn("evento", event.id)}${toggle("events", event)}</div></td></tr>`,
        )
        .join("")}
      </tbody></table></div>`;
  }
  if (tab === "multimedia") {
    body = `<div class="toolbar"><button class="btn btn--primary" type="button" data-do="modal" data-modal="multimedia">${icon("plus")} Nueva publicación</button></div>
      <div class="table-wrap"><table><thead><tr><th>Publicación</th><th>Tipo</th><th>Periodo</th><th>Estado</th><th class="num"></th></tr></thead><tbody>
      ${db.media
        .map(
          (
            item,
          ) => `<tr><td><strong>${esc(item.titulo)}</strong></td><td>${item.tipo === "video" ? "Video" : "Imagen"}</td><td>${dmy(item.inicio)}${item.fin ? ` – ${dmy(item.fin)}` : ""}</td>
        <td>${validity(item)}</td><td class="num"><div class="btn-row" style="justify-content:flex-end">${editBtn("multimedia", item.id)}${toggle("media", item)}</div></td></tr>`,
        )
        .join("")}
      </tbody></table></div>`;
  }

  return `${head("Contenido del sitio", "Lo que ven los clientes en la landing y en la tienda.")}
    <div class="tabs" role="tablist">${tabs.map(([key, label]) => `<a class="tab" role="tab" href="#/contenido/${key}" aria-selected="${key === tab}">${label}</a>`).join("")}</div>
    ${body}`;
}

/* HU-14: visitas del doctor */
function visitsView() {
  const rows = [...db.visits].sort((a, b) => a.fecha.localeCompare(b.fecha));
  return `${head("Visitas del doctor", "Solo las visitas confirmadas se publican en la landing.", `<button class="btn btn--primary" type="button" data-do="modal" data-modal="visita">${icon("plus")} Nueva visita</button>`)}
    <div class="table-wrap"><table><thead><tr><th>Doctor</th><th>Fecha</th><th>Horario</th><th>Estado</th><th class="num"></th></tr></thead><tbody>
      ${rows
        .map(
          (
            visit,
          ) => `<tr><td><strong>${esc(visit.doctor)}</strong><br><small class="muted">${esc(visit.especialidad)}</small></td><td>${dmy(visit.fecha)}</td><td>${visit.inicio} – ${visit.fin}</td>
        <td>${badge(visit.estado, VISIT_STATUS[visit.estado])}${visit.estado === "confirmada" && visit.fecha >= today() ? `<br><small class="muted">Publicada en la landing</small>` : ""}</td>
        <td class="num"><div class="btn-row" style="justify-content:flex-end"><button class="btn btn--ghost btn--sm" type="button" data-do="modal" data-modal="visita" data-id="${visit.id}">${icon("edit")} Editar</button>
          ${visit.estado !== "cancelada" ? `<button class="btn btn--danger btn--sm" type="button" data-do="cancel-visit" data-id="${visit.id}">Cancelar</button>` : ""}</div></td></tr>`,
        )
        .join("")}
    </tbody></table></div>`;
}

/* HU-15: usuarios */
function usersView() {
  return `${head("Usuarios", "Cuentas del personal y su rol.", `<button class="btn btn--primary" type="button" data-do="modal" data-modal="usuario">${icon("plus")} Nuevo usuario</button>`)}
    <div class="table-wrap"><table><thead><tr><th>Usuario</th><th class="hide-sm">Correo</th><th>Rol</th><th>Estado</th><th class="num"></th></tr></thead><tbody>
      ${db.users
        .map(
          (
            user,
          ) => `<tr><td><div class="cell-main"><span class="avatar">${esc(user.nombre[0])}</span><strong>${esc(user.nombre)}${user.id === sessionId ? " (vos)" : ""}</strong></div></td>
        <td class="hide-sm">${esc(user.correo)}</td><td>${ROLES[user.rol].label}</td><td>${badge(user.estado, user.estado === "activo" ? "Activo" : "Deshabilitado")}</td>
        <td class="num"><div class="btn-row" style="justify-content:flex-end"><button class="btn btn--ghost btn--sm" type="button" data-do="modal" data-modal="usuario" data-id="${user.id}">${icon("edit")} Editar</button>
          ${user.id !== sessionId ? `<button class="btn ${user.estado === "activo" ? "btn--danger" : "btn--ghost"} btn--sm" type="button" data-do="toggle-user" data-id="${user.id}">${user.estado === "activo" ? "Deshabilitar" : "Activar"}</button>` : ""}</div></td></tr>`,
        )
        .join("")}
    </tbody></table></div>
    <section class="card" style="margin-top:20px"><h2 class="card__title">Permisos por rol</h2>
      <div class="table-wrap"><table><thead><tr><th>Acción</th>${Object.values(ROLES)
        .map((r) => `<th>${r.label}</th>`)
        .join("")}</tr></thead><tbody>
      ${[
        ["Cambiar precios", "precio"],
        ["Crear y deshabilitar productos", "crear_producto"],
        ["Confirmar pagos", "pago"],
        ["Aplicar descuentos", "descuento"],
        ["Cancelar pedidos", "cancelar"],
      ]
        .map(
          ([label, action]) =>
            `<tr><td>${label}</td>${Object.values(ROLES)
              .map(
                (r) =>
                  `<td>${r.actions.includes(action) ? badge("activo", "Sí") : badge("inactivo", "No")}</td>`,
              )
              .join("")}</tr>`,
        )
        .join("")}
      <tr><td>Actualizar existencias</td>${Object.values(ROLES)
        .map(
          (r) =>
            `<td>${r.modules.includes("inventario") ? badge("activo", "Sí") : badge("inactivo", "No")}</td>`,
        )
        .join("")}</tr>
      <tr><td>Gestionar usuarios y roles</td>${Object.values(ROLES)
        .map(
          (r) =>
            `<td>${r.modules.includes("usuarios") ? badge("activo", "Sí") : badge("inactivo", "No")}</td>`,
        )
        .join("")}</tr>
      </tbody></table></div></section>`;
}

/* HU-34: inicio de sesión */
function loginScreen(error = "", email = "") {
  const packs = [db.products[2], db.products[0], db.products[3]].map(art).join("");
  return `<section class="login__art"><div class="login__packs">${packs}</div>
      <h1>El panel de Nativa 360.</h1><p>Productos, inventario, pedidos y contenido del sitio en un solo lugar.</p></section>
    <section class="login__form"><form class="login__box form" data-form="login" novalidate>
      <div><h2>Ingresar al panel</h2><p class="muted">Usá tu cuenta del personal.</p></div>
      ${error ? `<p class="notice notice--error">${icon("alert")} ${error}</p>` : ""}
      ${fld({ name: "correo", label: "Correo", type: "email", value: email, attrs: 'autocomplete="username"' })}
      ${fld({ name: "clave", label: "Contraseña", type: "password", attrs: 'autocomplete="current-password"' })}
      <button class="btn btn--primary" type="submit">Ingresar</button>
      <div class="demo-accounts"><strong>Cuentas de prueba (contraseña nativa360)</strong>
        ${db.users.map((user) => `<button type="button" data-do="fill-login" data-email="${user.correo}"><span>${esc(user.correo)}</span><span class="muted">${user.estado === "activo" ? ROLES[user.rol].label : "Deshabilitada"}</span></button>`).join("")}
      </div>
    </form></section>`;
}

/* ---------- Estructura y enrutador ---------- */

function renderChrome() {
  const user = me();
  const pending = db.orders.filter((order) =>
    ["pendiente", "en_revision"].includes(order.estado),
  ).length;
  const [section] = parseRoute();
  const current = section || "inicio";
  $("[data-nav]").innerHTML = MODULES.filter((module) => canSee(module.id))
    .map(
      (module) =>
        `<a class="side__link" href="${module.path}" ${module.id === current ? 'aria-current="page"' : ""}>${icon(module.icon)}<span>${module.label}</span>${module.id === "pedidos" && pending ? `<span class="side__count">${pending}</span>` : ""}</a>`,
    )
    .join("");
  $("[data-side-foot]").innerHTML =
    `<strong>Prototipo</strong>Datos de ejemplo guardados en este navegador.<br><button class="btn btn--ghost btn--sm" style="margin-top:10px" type="button" data-do="reset">Restablecer datos</button>`;
  $("[data-user]").innerHTML =
    `<span class="avatar">${esc(user.nombre[0])}</span><span class="bar__who"><strong>${esc(user.nombre)}</strong><span>${role().label}</span></span>
    <button class="btn btn--ghost btn--sm" type="button" data-do="logout" aria-label="Cerrar sesión">${icon("logout")}<span class="hide-sm">Cerrar sesión</span></button>`;
  $("[data-role-switch]").innerHTML = db.users
    .filter((item) => item.estado === "activo")
    .map(
      (item) =>
        `<option value="${item.id}" ${item.id === user.id ? "selected" : ""}>${esc(item.nombre)} · ${ROLES[item.rol].label}</option>`,
    )
    .join("");
}

function parseRoute() {
  return (window.location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
}

let lastRoute = "";

function render() {
  const loggedIn = Boolean(me() && me().estado === "activo");
  $("[data-shell]").hidden = !loggedIn;
  $("[data-login]").hidden = loggedIn;
  if (!loggedIn) {
    $("[data-login]").innerHTML = loginScreen();
    return;
  }
  renderChrome();
  const [section = "inicio", id] = parseRoute();
  const route = `${section}/${id ?? ""}`;
  if (route !== lastRoute) {
    ui.productDraft = null;
    ui.businessDraft = null;
  }

  let html;
  if (!canSee(section) && MODULES.some((module) => module.id === section)) html = denied();
  else if (section === "inicio") html = homeView();
  else if (section === "pedidos") html = id ? orderDetailView(id) : ordersView();
  else if (section === "productos") html = id ? productFormView(id) : productsView();
  else if (section === "categorias") html = categoriesView();
  else if (section === "inventario") html = inventoryView();
  else if (section === "clientes") html = id ? customerDetailView(id) : customersView();
  else if (section === "contenido") html = contentView(id);
  else if (section === "visitas") html = visitsView();
  else if (section === "usuarios") html = usersView();
  else
    html = empty(
      "alert",
      "Página no encontrada",
      "",
      `<a class="btn btn--ghost" href="#/">Ir al inicio</a>`,
    );

  view.innerHTML = html;
  if (route !== lastRoute) {
    window.scrollTo(0, 0);
    $("[data-side]").classList.remove("side--open");
  }
  lastRoute = route;
}

function refresh(message) {
  save();
  render();
  if (message) toast(message);
}

/* ---------- Eventos ---------- */

function currentOrder() {
  const [, id] = parseRoute();
  return db.orders.find((order) => order.codigo === id);
}

const COLLECTIONS = { promotions: "promotions", events: "events", media: "media" };

document.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-href]");
  if (row && !event.target.closest("a, button")) {
    window.location.hash = row.dataset.href;
    return;
  }
  const target = event.target.closest("[data-do]");
  if (!target) return;
  const { do: action, id } = target.dataset;

  if (action === "menu") $("[data-side]").classList.toggle("side--open");
  if (action === "close-modal") closeModal();
  if (action === "logout") {
    sessionId = null;
    refresh();
    window.location.hash = "#/";
  }
  if (action === "reset") {
    Object.assign(db, seed());
    refresh("Datos de ejemplo restablecidos");
  }
  if (action === "fill-login") {
    document.getElementById("m-correo").value = target.dataset.email;
    document.getElementById("m-clave").value = PASSWORD;
  }
  if (action === "order-status") {
    ui.orderStatus = target.dataset.value;
    render();
  }
  if (action === "modal") {
    const name = target.dataset.modal;
    const ctx = { order: currentOrder() };
    if (name === "movimiento") ctx.productId = id;
    if (name === "categoria" && id) ctx.category = db.categories.find((c) => c.id === Number(id));
    if (id && ["promocion", "evento", "multimedia", "visita", "usuario"].includes(name)) {
      const list = {
        promocion: db.promotions,
        evento: db.events,
        multimedia: db.media,
        visita: db.visits,
        usuario: db.users,
      }[name];
      ctx.item = list.find((item) => item.id === Number(id));
    }
    openModal(name, ctx);
  }
  if (action === "toggle-product") {
    const product = productOf(id);
    if (product.estado === "activo") {
      openModal("confirmar", {
        title: `¿Deshabilitar ${product.nombre}?`,
        message:
          "Deja de mostrarse en el catálogo, pero se conserva en los pedidos que ya lo incluyen.",
        action: () => {
          product.estado = "inactivo";
        },
      });
    } else {
      product.estado = "activo";
      refresh("Producto activado");
    }
  }
  if (action === "toggle-category") {
    const category = db.categories.find((c) => c.id === Number(id));
    const count = db.products.filter(
      (p) => p.categoria === category.nombre && p.estado === "activo",
    ).length;
    if (category.estado === "activo" && count > 0) {
      toast(`Esta categoría tiene ${count} productos activos. Movelos o deshabilitalos primero.`);
      return;
    }
    category.estado = category.estado === "activo" ? "inactivo" : "activo";
    refresh("Categoría actualizada");
  }
  if (action === "toggle-content") {
    const item = db[COLLECTIONS[target.dataset.kind]].find((entry) => entry.id === Number(id));
    item.estado = item.estado === "activo" ? "inactivo" : "activo";
    refresh(item.estado === "activo" ? "Publicado" : "Retirado del sitio");
  }
  if (action === "cancel-visit") {
    const visit = db.visits.find((item) => item.id === Number(id));
    openModal("confirmar", {
      title: `¿Cancelar la visita del ${dmy(visit.fecha)}?`,
      message: "La visita deja de anunciarse en la landing.",
      action: () => {
        visit.estado = "cancelada";
      },
    });
  }
  if (action === "toggle-user") {
    const user = db.users.find((item) => item.id === Number(id));
    const admins = db.users.filter(
      (item) => item.rol === "administrador" && item.estado === "activo",
    );
    if (user.estado === "activo" && user.rol === "administrador" && admins.length === 1) {
      toast("Tiene que quedar al menos un administrador");
      return;
    }
    user.estado = user.estado === "activo" ? "deshabilitado" : "activo";
    refresh(user.estado === "activo" ? "Usuario activado" : "Usuario deshabilitado");
  }
});

document.addEventListener("input", (event) => {
  const key = event.target.dataset.input;
  if (!key) return;
  ui[key] = event.target.value;
  const position = event.target.selectionStart;
  render();
  const again = document.querySelector(`[data-input="${key}"]`);
  again.focus();
  if (again.type === "search") again.setSelectionRange(position, position);
});

$("[data-role-switch]").addEventListener("change", (event) => {
  sessionId = Number(event.target.value);
  refresh(`Ahora ves el panel como ${me().nombre} (${role().label})`);
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));

  if (form.matches("[data-modal-form]")) {
    const { name, ctx } = activeModal;
    const errors = MODALS[name].submit(ctx, values);
    if (errors) {
      openModal(name, ctx, values, errors);
      return;
    }
    closeModal();
    refresh(MODALS[name].done);
    return;
  }

  if (form.dataset.form === "login") {
    const user = db.users.find((item) => item.correo === values.correo.trim().toLowerCase());
    if (!values.correo || !values.clave) {
      $("[data-login]").innerHTML = loginScreen("Ingresá tu correo y tu contraseña", values.correo);
      return;
    }
    if (!user || values.clave !== PASSWORD) {
      $("[data-login]").innerHTML = loginScreen("Correo o contraseña incorrectos", values.correo);
      return;
    }
    if (user.estado !== "activo") {
      $("[data-login]").innerHTML = loginScreen(
        "Tu cuenta está deshabilitada. Consultá con el administrador",
        values.correo,
      );
      return;
    }
    sessionId = user.id;
    window.location.hash = "#/";
    refresh(`Sesión iniciada · ${user.nombre}`);
  }

  if (form.dataset.form === "producto") {
    const isNew = !form.dataset.id;
    const product = isNew ? null : productOf(form.dataset.id);
    const errors = {};
    const file = form.querySelector("[data-file]").files[0];
    const price = product && !can("precio") ? product.precio : Number(values.precio);
    if (isNew && !required(values.codigo)) errors.codigo = "El código es obligatorio";
    if (isNew && db.products.some((p) => fold(p.codigo) === fold(values.codigo)))
      errors.codigo = `Ya existe un producto con el código ${esc(values.codigo)}`;
    if (!required(values.nombre)) errors.nombre = "El nombre es obligatorio";
    if (!required(values.descripcion)) errors.descripcion = "La descripción es obligatoria";
    if (!(price > 0)) errors.precio = "El precio debe ser mayor a 0";
    if (isNew && !file) errors.imagen = "La imagen es obligatoria";
    if (file && !["image/jpeg", "image/png", "image/webp"].includes(file.type))
      errors.imagen = "El archivo debe ser una imagen JPG, PNG o WebP";
    if (file && file.size > 5 * 1024 * 1024) errors.imagen = "La imagen no puede pesar más de 5 MB";
    if (Object.keys(errors).length) {
      ui.productDraft = { values: { ...values, destacado: values.destacado === "on" }, errors };
      render();
      return;
    }
    const data = {
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim(),
      categoria: values.categoria,
      precio: price,
      destacado: values.destacado === "on",
    };
    if (product) {
      Object.assign(product, data);
    } else {
      const palette = ["#2b5c9e", "#3a9a5b", "#e98a2c", "#7b5ea7"];
      db.products.push({
        id: Date.now(),
        codigo: values.codigo.trim().toUpperCase(),
        stock: Number(values.stock) || 0,
        estado: "activo",
        pack: [
          "frasco",
          palette[db.products.length % palette.length],
          values.nombre.trim().slice(0, 9).toUpperCase(),
        ],
        tinte: "#eaf2fb",
        ...data,
      });
    }
    ui.productDraft = null;
    window.location.hash = "#/productos";
    refresh("Producto guardado");
  }

  if (form.dataset.form === "negocio") {
    const errors = {};
    if (
      !/^\d{8}$/.test(values.telefono.replace(/\D/g, "")) ||
      values.telefono.replace(/\D/g, "").length !== 8
    )
      errors.telefono = "Ingresá un teléfono de 8 dígitos";
    if (!required(values.whatsapp)) errors.whatsapp = "El número de WhatsApp es obligatorio";
    ["instagram", "facebook"].forEach((key) => {
      if (values[key] && !/^https?:\/\/\S+\.\S+/.test(values[key]))
        errors[key] = "Ingresá un enlace válido";
    });
    if (Object.keys(errors).length) {
      ui.businessDraft = { values, errors };
      render();
      return;
    }
    Object.assign(db.business, values);
    ui.businessDraft = null;
    refresh("Cambios guardados");
  }
});

dialog.addEventListener("close", () => {
  activeModal = null;
});

window.addEventListener("hashchange", render);
render();
