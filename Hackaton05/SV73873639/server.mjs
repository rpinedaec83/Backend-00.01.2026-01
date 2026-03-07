import express from "express";
import crypto from "node:crypto";

const app = express();
app.use(express.json());

// Servir frontend (misma origin => sin CORS)
app.use(express.static("public"));

/* =========================
   Utilidades / Errores
========================= */
class DomainError extends Error {
  constructor(message, code = "DOMAIN_ERROR", details = undefined) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.details = details;
  }
}
const uuid = () => crypto.randomUUID();
const assert = (cond, msg, code = "ASSERTION_FAILED", details) => {
  if (!cond) throw new DomainError(msg, code, details);
};

/* =========================
   Estados (estaciones)
========================= */
const RepairStatus = Object.freeze({
  RECEIVED: "RECEIVED",
  INITIAL_REVIEW_DONE: "INITIAL_REVIEW_DONE",
  AWAITING_AUTH: "AWAITING_AUTH",
  AUTHORIZED: "AUTHORIZED",
  IN_REPAIR: "IN_REPAIR",
  QA: "QA",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  DELIVERED: "DELIVERED",
  REJECTED: "REJECTED",
});

const AllowedTransitions = Object.freeze({
  [RepairStatus.RECEIVED]: [RepairStatus.INITIAL_REVIEW_DONE],
  [RepairStatus.INITIAL_REVIEW_DONE]: [RepairStatus.AWAITING_AUTH],
  [RepairStatus.AWAITING_AUTH]: [RepairStatus.AUTHORIZED, RepairStatus.REJECTED],
  [RepairStatus.AUTHORIZED]: [RepairStatus.IN_REPAIR],
  [RepairStatus.IN_REPAIR]: [RepairStatus.QA],
  [RepairStatus.QA]: [RepairStatus.READY_FOR_PICKUP],
  [RepairStatus.READY_FOR_PICKUP]: [RepairStatus.DELIVERED],
  [RepairStatus.DELIVERED]: [],
  [RepairStatus.REJECTED]: [],
});

/* =========================
   Entidades (Clases ES6+)
========================= */
class Phone {
  constructor({ imei, serial, brand, model }) {
    assert(typeof imei === "string" && imei.trim(), "IMEI requerido");
    assert(typeof serial === "string" && serial.trim(), "Serial requerido");
    this.imei = imei.trim();
    this.serial = serial.trim();
    this.brand = (brand ?? "UNKNOWN").toString().trim().toUpperCase();
    this.model = (model ?? "UNKNOWN").toString().trim();
  }
}

class Technician {
  constructor({ name, skills = [] }) {
    assert(typeof name === "string" && name.trim(), "Nombre de técnico requerido");
    this.id = uuid();
    this.name = name.trim();
    this.skills = new Set(skills.map((s) => s.toString().trim().toUpperCase()));
  }
  canHandle(brand) {
    return this.skills.has(brand.toString().trim().toUpperCase());
  }
}

class SparePart {
  constructor({ name, unitCost, compatibleBrands = [] }) {
    assert(typeof name === "string" && name.trim(), "Nombre de repuesto requerido");
    assert(Number.isFinite(unitCost) && unitCost >= 0, "Costo unitario inválido");
    this.id = uuid();
    this.name = name.trim();
    this.unitCost = unitCost;
    this.compatibleBrands = new Set(compatibleBrands.map((b) => b.toString().trim().toUpperCase()));
  }
  isCompatible(brand) {
    if (this.compatibleBrands.size === 0) return true; // “universal” en demo
    return this.compatibleBrands.has(brand.toString().trim().toUpperCase());
  }
}

class Branch {
  constructor({ name }) {
    assert(typeof name === "string" && name.trim(), "Nombre de sucursal requerido");
    this.id = uuid();
    this.name = name.trim();
  }
}

class RepairOrder {
  #history = [];
  #parts = new Map(); // partId -> { partSnapshot, qty }
  #technicianId = null;

  constructor({ branchId, phone, customerName, laborCostEstimate }) {
    assert(typeof branchId === "string" && branchId, "branchId requerido");
    assert(phone instanceof Phone, "phone inválido");
    assert(typeof customerName === "string" && customerName.trim(), "customerName requerido");
    assert(Number.isFinite(laborCostEstimate) && laborCostEstimate >= 0, "laborCostEstimate inválido");

    this.id = uuid();
    this.branchId = branchId;
    this.phone = phone;
    this.customerName = customerName.trim();
    this.laborCostEstimate = laborCostEstimate;

    this.initialDiagnosis = null;
    this.authorizationText = null;
    this.depositAmount = 0;

    this.status = RepairStatus.RECEIVED;
    this.#pushHistory("Orden creada y equipo recepcionado", { status: this.status });
  }

  #pushHistory(message, meta = {}) {
    this.#history.push({ at: new Date().toISOString(), message, ...meta });
  }

  get history() {
    return [...this.#history];
  }

  get parts() {
    return [...this.#parts.values()].map(({ partSnapshot, qty }) => ({ ...partSnapshot, qty }));
  }

  get technicianId() {
    return this.#technicianId;
  }

  requireStatus(...allowed) {
    assert(
      allowed.includes(this.status),
      `Operación no permitida en estado ${this.status}`,
      "INVALID_STATE",
      { current: this.status, allowed }
    );
  }

  transitionTo(nextStatus) {
    const allowed = AllowedTransitions[this.status] ?? [];
    assert(
      allowed.includes(nextStatus),
      `Transición inválida: ${this.status} -> ${nextStatus}`,
      "INVALID_TRANSITION",
      { from: this.status, to: nextStatus, allowed }
    );
    this.status = nextStatus;
    this.#pushHistory("Cambio de estación/estado", { status: this.status });
  }

  recordInitialDiagnosis({ diagnosis, technicianId }) {
    this.requireStatus(RepairStatus.RECEIVED);
    assert(typeof diagnosis === "string" && diagnosis.trim(), "Diagnóstico requerido");
    assert(typeof technicianId === "string" && technicianId, "technicianId requerido");

    this.initialDiagnosis = diagnosis.trim();
    this.#technicianId = technicianId;

    this.#pushHistory("Diagnóstico inicial registrado", { technicianId });
    this.transitionTo(RepairStatus.INITIAL_REVIEW_DONE);
    this.transitionTo(RepairStatus.AWAITING_AUTH);
  }

  addPart({ part, qty }) {
    assert(part instanceof SparePart, "Repuesto inválido");
    assert(Number.isInteger(qty) && qty > 0, "Cantidad inválida");
    assert(part.isCompatible(this.phone.brand), "Repuesto no compatible", "INCOMPATIBLE_PART", {
      brand: this.phone.brand,
      partId: part.id,
    });

    const existing = this.#parts.get(part.id);
    const newQty = (existing?.qty ?? 0) + qty;

    this.#parts.set(part.id, {
      partSnapshot: { id: part.id, name: part.name, unitCost: part.unitCost },
      qty: newQty,
    });

    this.#pushHistory("Repuesto agregado/actualizado", { partId: part.id, qty: newQty });
  }

  get quotedPartsTotal() {
    let sum = 0;
    for (const { partSnapshot, qty } of this.#parts.values()) {
      sum += partSnapshot.unitCost * qty;
    }
    return sum;
  }

  get quotedTotal() {
    return this.laborCostEstimate + this.quotedPartsTotal;
  }

  authorizeAndDeposit({ authorizationText, depositAmount }) {
    this.requireStatus(RepairStatus.AWAITING_AUTH);

    assert(typeof authorizationText === "string" && authorizationText.trim(), "Autorización escrita requerida");
    assert(Number.isFinite(depositAmount) && depositAmount >= 0, "Abono inválido");

    const minDeposit = 0.5 * this.quotedTotal;
    assert(
      depositAmount >= minDeposit,
      "Abono insuficiente (mínimo 50% del total cotizado)",
      "INSUFFICIENT_DEPOSIT",
      { quotedTotal: this.quotedTotal, minDeposit, received: depositAmount }
    );

    this.authorizationText = authorizationText.trim();
    this.depositAmount = depositAmount;

    this.#pushHistory("Autorización y abono registrados", {
      depositAmount: this.depositAmount,
      quotedTotal: this.quotedTotal,
    });

    this.transitionTo(RepairStatus.AUTHORIZED);
  }

  assignTechnician({ technician }) {
    this.requireStatus(RepairStatus.AUTHORIZED);
    assert(technician instanceof Technician, "Técnico inválido");
    assert(technician.canHandle(this.phone.brand), "Técnico sin skill compatible", "TECHNICIAN_SKILL_MISMATCH", {
      brand: this.phone.brand,
      technicianId: technician.id,
    });

    this.#technicianId = technician.id;
    this.#pushHistory("Técnico asignado", { technicianId: technician.id });
  }

  advance() {
    const next = (AllowedTransitions[this.status] ?? [])[0];
    assert(next, `No existe siguiente estado desde ${this.status}`, "NO_NEXT_STATE");
    this.transitionTo(next);
  }

  toJSON() {
    return {
      id: this.id,
      branchId: this.branchId,
      customerName: this.customerName,
      phone: this.phone,
      laborCostEstimate: this.laborCostEstimate,
      parts: this.parts,
      quotedTotal: this.quotedTotal,
      initialDiagnosis: this.initialDiagnosis,
      authorizationText: this.authorizationText,
      depositAmount: this.depositAmount,
      technicianId: this.#technicianId,
      status: this.status,
      history: this.history,
    };
  }
}

/* =========================
   “BD” en memoria (demo)
========================= */
const db = {
  branches: new Map(),
  technicians: new Map(),
  parts: new Map(),
  repairs: new Map(),
  reportedImeis: new Set(["356789012345678", "111111111111111"]),
  reportedSerials: new Set(["SN-LOST-0001"]),
};

/* =========================
   Endpoints (HTTP)
========================= */

// Verificación IMEI/Serial reportado
app.get("/api/devices/reported", (req, res) => {
  const imei = (req.query.imei ?? "").toString().trim();
  const serial = (req.query.serial ?? "").toString().trim();
  if (!imei || !serial) return res.status(400).json({ error: "imei y serial son requeridos" });

  const reported = db.reportedImeis.has(imei) || db.reportedSerials.has(serial);
  return res.json({ imei, serial, reported });
});

// Listados (para poblar selects del frontend)
app.get("/api/branches", (req, res) => res.json([...db.branches.values()]));
app.get("/api/technicians", (req, res) =>
  res.json([...db.technicians.values()].map((t) => ({ id: t.id, name: t.name, skills: [...t.skills] })))
);
app.get("/api/parts", (req, res) =>
  res.json([...db.parts.values()].map((p) => ({ id: p.id, name: p.name, unitCost: p.unitCost, compatibleBrands: [...p.compatibleBrands] })))
);

// Crear sucursal
app.post("/api/branches", (req, res, next) => {
  try {
    const branch = new Branch({ name: req.body?.name });
    db.branches.set(branch.id, branch);
    res.status(201).json(branch);
  } catch (e) {
    next(e);
  }
});

// Crear técnico
app.post("/api/technicians", (req, res, next) => {
  try {
    const tech = new Technician({ name: req.body?.name, skills: req.body?.skills ?? [] });
    db.technicians.set(tech.id, tech);
    res.status(201).json({ id: tech.id, name: tech.name, skills: [...tech.skills] });
  } catch (e) {
    next(e);
  }
});

// Crear repuesto
app.post("/api/parts", (req, res, next) => {
  try {
    const part = new SparePart({
      name: req.body?.name,
      unitCost: req.body?.unitCost,
      compatibleBrands: req.body?.compatibleBrands ?? [],
    });
    db.parts.set(part.id, part);
    res.status(201).json({ id: part.id, name: part.name, unitCost: part.unitCost, compatibleBrands: [...part.compatibleBrands] });
  } catch (e) {
    next(e);
  }
});

// Crear orden
app.post("/api/repairs", (req, res, next) => {
  try {
    const branchId = req.body?.branchId;
    assert(db.branches.has(branchId), "Sucursal inexistente", "BRANCH_NOT_FOUND", { branchId });

    const phone = new Phone(req.body?.phone ?? {});
    const repair = new RepairOrder({
      branchId,
      phone,
      customerName: req.body?.customerName,
      laborCostEstimate: req.body?.laborCostEstimate,
    });

    db.repairs.set(repair.id, repair);
    res.status(201).json(repair.toJSON());
  } catch (e) {
    next(e);
  }
});

// Diagnóstico inicial
app.post("/api/repairs/:id/initial-diagnosis", (req, res, next) => {
  try {
    const repair = db.repairs.get(req.params.id);
    assert(repair, "Orden no encontrada", "REPAIR_NOT_FOUND", { id: req.params.id });

    const techId = req.body?.technicianId;
    assert(db.technicians.has(techId), "Técnico inexistente", "TECH_NOT_FOUND", { techId });

    repair.recordInitialDiagnosis({ diagnosis: req.body?.diagnosis, technicianId: techId });
    res.json(repair.toJSON());
  } catch (e) {
    next(e);
  }
});

// Agregar repuestos
app.post("/api/repairs/:id/parts", (req, res, next) => {
  try {
    const repair = db.repairs.get(req.params.id);
    assert(repair, "Orden no encontrada", "REPAIR_NOT_FOUND", { id: req.params.id });

    const partId = req.body?.partId;
    const part = db.parts.get(partId);
    assert(part, "Repuesto inexistente", "PART_NOT_FOUND", { partId });

    repair.addPart({ part, qty: req.body?.qty });
    res.json(repair.toJSON());
  } catch (e) {
    next(e);
  }
});

// Autorizar + abono 50%
app.post("/api/repairs/:id/authorize", (req, res, next) => {
  try {
    const repair = db.repairs.get(req.params.id);
    assert(repair, "Orden no encontrada", "REPAIR_NOT_FOUND", { id: req.params.id });

    repair.authorizeAndDeposit({
      authorizationText: req.body?.authorizationText,
      depositAmount: req.body?.depositAmount,
    });

    res.json(repair.toJSON());
  } catch (e) {
    next(e);
  }
});

// Asignar técnico por skill/marca
app.post("/api/repairs/:id/assign-technician", (req, res, next) => {
  try {
    const repair = db.repairs.get(req.params.id);
    assert(repair, "Orden no encontrada", "REPAIR_NOT_FOUND", { id: req.params.id });

    const techId = req.body?.technicianId;
    const tech = db.technicians.get(techId);
    assert(tech, "Técnico inexistente", "TECH_NOT_FOUND", { techId });

    repair.assignTechnician({ technician: tech });
    res.json(repair.toJSON());
  } catch (e) {
    next(e);
  }
});

// Avanzar estación
app.post("/api/repairs/:id/advance", (req, res, next) => {
  try {
    const repair = db.repairs.get(req.params.id);
    assert(repair, "Orden no encontrada", "REPAIR_NOT_FOUND", { id: req.params.id });

    repair.advance();
    res.json(repair.toJSON());
  } catch (e) {
    next(e);
  }
});

// Consultar orden
app.get("/api/repairs/:id", (req, res, next) => {
  try {
    const repair = db.repairs.get(req.params.id);
    assert(repair, "Orden no encontrada", "REPAIR_NOT_FOUND", { id: req.params.id });
    res.json(repair.toJSON());
  } catch (e) {
    next(e);
  }
});

// Seed demo (opcional para probar rápido)
app.post("/api/seed", (req, res) => {
  const branch = new Branch({ name: "Sucursal Centro" });
  db.branches.set(branch.id, branch);

  const t1 = new Technician({ name: "Téc. Ana", skills: ["SAMSUNG", "XIAOMI"] });
  const t2 = new Technician({ name: "Téc. Luis", skills: ["APPLE"] });
  db.technicians.set(t1.id, t1);
  db.technicians.set(t2.id, t2);

  const p1 = new SparePart({ name: "Batería OEM", unitCost: 35, compatibleBrands: ["SAMSUNG"] });
  const p2 = new SparePart({ name: "Módulo Pantalla", unitCost: 90, compatibleBrands: ["APPLE", "SAMSUNG"] });
  db.parts.set(p1.id, p1);
  db.parts.set(p2.id, p2);

  res.json({
    branchId: branch.id,
    technicians: [
      { id: t1.id, name: t1.name, skills: [...t1.skills] },
      { id: t2.id, name: t2.name, skills: [...t2.skills] },
    ],
    parts: [
      { id: p1.id, name: p1.name, unitCost: p1.unitCost },
      { id: p2.id, name: p2.name, unitCost: p2.unitCost },
    ],
  });
});

/* =========================
   Manejo de errores
========================= */
app.use((err, req, res, next) => {
  if (err instanceof DomainError) {
    return res.status(400).json({ error: err.message, code: err.code, details: err.details });
  }
  return res.status(500).json({ error: "Error interno", details: String(err?.message ?? err) });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));