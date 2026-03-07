/**
 * app.js
 * Controlador de interfaz: enlaza formularios con la API.
 */

import { api } from "./api.js";

const $ = (id) => document.getElementById(id);

const seedOut = $("seedOut");
const checkOut = $("checkOut");
const createOut = $("createOut");
const orderOut = $("orderOut");

const badgeStatus = $("badgeStatus");
const pillApi = $("pillApi");
const timeline = $("timeline");
const toastEl = $("toast");
const chipsSeed = $("chipsSeed");

const helpModal = $("helpModal");
$("btnHelp").addEventListener("click", (e) => {
  e.preventDefault();
  helpModal.showModal();
});
$("btnCloseHelp").addEventListener("click", () => helpModal.close());

let currentRepair = null;

const STATUS_STEPS = [
  "RECEIVED",
  "INITIAL_REVIEW_DONE",
  "AWAITING_AUTH",
  "AUTHORIZED",
  "IN_REPAIR",
  "QA",
  "READY_FOR_PICKUP",
  "DELIVERED",
];

function print(el, obj) {
  el.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

function toast(msg, type = "warn") {
  toastEl.className = `toast show ${type}`;
  toastEl.textContent = msg;
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => {
    toastEl.className = "toast";
    toastEl.textContent = "";
  }, 4200);
}

function setStatusBadge(status) {
  badgeStatus.textContent = `Estado: ${status ?? "—"}`;
  badgeStatus.classList.remove("ok", "warn", "bad");

  if (!status) return;
  if (status === "DELIVERED") badgeStatus.classList.add("ok");
  else if (status === "REJECTED") badgeStatus.classList.add("bad");
  else badgeStatus.classList.add("warn");
}

function renderTimeline(status) {
  timeline.innerHTML = "";
  const idx = STATUS_STEPS.indexOf(status);

  for (let i = 0; i < STATUS_STEPS.length; i++) {
    const s = STATUS_STEPS[i];
    const div = document.createElement("div");
    div.className = "step";
    div.textContent = s;

    if (i < idx) div.classList.add("done");
    if (i === idx) div.classList.add("active");

    timeline.appendChild(div);
  }
}

function setRepairId(id) {
  $("repairId").value = id;
}

function setSeedChips(seed) {
  chipsSeed.innerHTML = "";
  const mk = (label, value) => {
    const d = document.createElement("div");
    d.className = "chip";
    d.textContent = `${label}: ${value}`;
    chipsSeed.appendChild(d);
  };

  mk("branchId", seed.branchId);
  if (seed.technicians?.[0]) mk("tech #1", seed.technicians[0].id);
  if (seed.technicians?.[1]) mk("tech #2", seed.technicians[1].id);
  if (seed.parts?.[0]) mk("part #1", seed.parts[0].id);
  if (seed.parts?.[1]) mk("part #2", seed.parts[1].id);
}

async function bootHealth() {
  try {
    await api.health();
    pillApi.textContent = "API: OK (3000)";
    pillApi.style.borderColor = "rgba(39,192,125,.6)";
    toast("API disponible ✅", "ok");
  } catch (e) {
    pillApi.textContent = "API: NO DISPONIBLE (¿servidor apagado?)";
    pillApi.style.borderColor = "rgba(255,77,77,.6)";
    toast("No hay backend. Ejecuta: npm install && npm run start", "bad");
    print(orderOut, e.message);
  }
}

async function refreshOrder() {
  const id = $("repairId").value.trim();
  if (!id) return toast("No hay repairId.", "warn");

  const data = await api.getRepair(id);
  currentRepair = data;

  setStatusBadge(data.status);
  renderTimeline(data.status);
  print(orderOut, data);
  toast("Orden actualizada.", "ok");
}

/** =========================
 *  Eventos
 *  ========================= */
$("btnSeed").addEventListener("click", async () => {
  try {
    const data = await api.seed();
    setSeedChips(data);
    print(seedOut, data);

    // Autorrelleno
    $("branchId").value = data.branchId;
    $("diagTechId").value = data.technicians[0]?.id ?? "";
    $("assignTechId").value = data.technicians[0]?.id ?? "";
    $("partId").value = data.parts[0]?.id ?? "";

    toast("Datos demo creados.", "ok");
  } catch (e) {
    print(seedOut, e.message);
    toast("Error en Seed (revisa backend).", "bad");
  }
});

$("formCheck").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const imei = $("imei").value.trim();
    const serial = $("serial").value.trim();
    const data = await api.checkReported(imei, serial);
    print(checkOut, data);

    if (data.reported) toast("Equipo REPORTADO ❌", "bad");
    else toast("Equipo NO reportado ✅", "ok");
  } catch (e) {
    print(checkOut, e.message);
    toast("Error al verificar.", "bad");
  }
});

$("formCreate").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const imei = $("imei").value.trim();
    const serial = $("serial").value.trim();

    const check = await api.checkReported(imei, serial);
    if (check.reported) {
      print(createOut, { error: "Equipo reportado: no puede ingresar al servicio", check });
      toast("No se puede crear: equipo reportado.", "bad");
      return;
    }

    const payload = {
      branchId: $("branchId").value.trim(),
      customerName: $("customerName").value.trim(),
      laborCostEstimate: Number($("labor").value),
      phone: {
        imei,
        serial,
        brand: $("brand").value.trim(),
        model: $("model").value.trim(),
      },
    };

    const order = await api.createRepair(payload);
    currentRepair = order;

    setRepairId(order.id);
    setStatusBadge(order.status);
    renderTimeline(order.status);

    print(createOut, order);
    print(orderOut, order);

    $("deposit").value = Number(order.minDeposit ?? 0).toFixed(2);
    toast("Orden creada ✅", "ok");
  } catch (e) {
    print(createOut, e.message);
    toast("Error al crear orden.", "bad");
  }
});

$("btnRefresh").addEventListener("click", async () => {
  try {
    await refreshOrder();
  } catch (e) {
    print(orderOut, e.message);
    toast("Error al refrescar.", "bad");
  }
});

$("btnAdvance").addEventListener("click", async () => {
  try {
    const id = $("repairId").value.trim();
    const data = await api.advance(id);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    print(orderOut, data);
    toast(`Advance → ${data.status}`, "ok");
  } catch (e) {
    print(orderOut, e.message);
    toast("No se pudo avanzar estación.", "bad");
  }
});

$("formDiag").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const id = $("repairId").value.trim();
    const payload = {
      technicianId: $("diagTechId").value.trim(),
      diagnosis: $("diagnosis").value.trim(),
    };

    const data = await api.initialDiagnosis(id, payload);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    print(orderOut, data);

    $("deposit").value = Number(data.minDeposit ?? 0).toFixed(2);
    toast("Diagnóstico registrado.", "ok");
  } catch (e) {
    print(orderOut, e.message);
    toast("Error en diagnóstico.", "bad");
  }
});

$("formPart").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const id = $("repairId").value.trim();
    const payload = {
      partId: $("partId").value.trim(),
      qty: Number($("qty").value),
    };

    const data = await api.addPart(id, payload);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    print(orderOut, data);

    $("deposit").value = Number(data.minDeposit ?? 0).toFixed(2);
    toast("Repuesto agregado.", "ok");
  } catch (e) {
    print(orderOut, e.message);
    toast("Error al agregar repuesto.", "bad");
  }
});

$("btnFillMinDeposit").addEventListener("click", () => {
  const min = currentRepair?.minDeposit ?? 0;
  $("deposit").value = Number(min).toFixed(2);
  toast("Abono mínimo aplicado.", "ok");
});

$("formAuth").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const id = $("repairId").value.trim();
    const payload = {
      authorizationText: $("authText").value.trim(),
      depositAmount: Number($("deposit").value),
    };

    const data = await api.authorize(id, payload);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    print(orderOut, data);
    toast("Autorización/abono registrados.", "ok");
  } catch (e) {
    print(orderOut, e.message);
    toast("Error en autorización/abono.", "bad");
  }
});

$("formAssign").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const id = $("repairId").value.trim();
    const payload = { technicianId: $("assignTechId").value.trim() };

    const data = await api.assignTechnician(id, payload);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    print(orderOut, data);
    toast("Técnico asignado.", "ok");
  } catch (e) {
    print(orderOut, e.message);
    toast("Error al asignar técnico (skill/marca).", "bad");
  }
});

bootHealth();