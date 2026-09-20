// ข้อมูลยา — แก้ไข/เพิ่มยาใหม่ได้ที่นี่ (ดูรายละเอียดที่มาของค่าแต่ละตัวใน CLAUDE.md)
// doseMassUnit: "mcg" | "mg" — หน่วยมวลของ dose ที่ผู้ใช้กรอก
// doseTimeUnit: "min" | "hr" — หน่วยเวลาของ dose ที่ผู้ใช้กรอก
// category: "cardiovascular" | "sedative_nmb" — ใช้จัดกลุ่มการ์ดบนหน้าเว็บ
const DRUGS = [
  // ---- Cardiovascular drugs ----
  {
    id: "adrenaline",
    name: "Adrenaline (Epinephrine)",
    category: "cardiovascular",
    color: "#2563eb",
    ampuleLabel: "1 mg/ml",
    ampuleConcMgPerMl: 1,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 64,
    peripheralMaxMcgPerMl: 16,
  },
  {
    id: "levophed",
    name: "Levophed (Norepinephrine)",
    category: "cardiovascular",
    color: "#7c3aed",
    ampuleLabel: "4 mg/4 ml",
    ampuleConcMgPerMl: 1,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 64,
    peripheralMaxMcgPerMl: 16,
  },
  {
    id: "dopamine",
    name: "Dopamine",
    category: "cardiovascular",
    color: "#0d9488",
    ampuleLabel: "250 mg/10 ml (25 mg/ml)",
    ampuleConcMgPerMl: 25,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 6000,
    peripheralMaxMcgPerMl: 800,
  },
  {
    id: "dobutamine",
    name: "Dobutamine",
    category: "cardiovascular",
    color: "#16a34a",
    ampuleLabel: "250 mg/20 ml (12.5 mg/ml)",
    ampuleConcMgPerMl: 12.5,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 5000,
    peripheralMaxMcgPerMl: 5000,
  },
  {
    id: "milrinone",
    name: "Milrinone",
    category: "cardiovascular",
    color: "#b45309",
    ampuleLabel: "10 mg/10 ml (1 mg/ml)",
    ampuleConcMgPerMl: 1,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 200,
    peripheralMaxMcgPerMl: 200,
  },
  {
    id: "amiodarone",
    name: "Amiodarone",
    category: "cardiovascular",
    color: "#4338ca",
    ampuleLabel: "50 mg/ml",
    ampuleConcMgPerMl: 50,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 6000,
    peripheralMaxMcgPerMl: 2000,
  },
  {
    id: "lidocaine",
    name: "Lidocaine 2%",
    category: "cardiovascular",
    color: "#0e7490",
    ampuleLabel: "2% (20 mg/ml)",
    ampuleConcMgPerMl: 20,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 8000,
    peripheralMaxMcgPerMl: 8000,
  },
  {
    id: "nicardipine",
    name: "Nicardipine",
    category: "cardiovascular",
    color: "#65a30d",
    ampuleLabel: "10 mg/10 ml (1 mg/ml)",
    ampuleConcMgPerMl: 1,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 500,
    peripheralMaxMcgPerMl: 200,
  },
  {
    id: "ntg",
    name: "NTG (Nitroglycerin)",
    category: "cardiovascular",
    color: "#ea580c",
    ampuleLabel: "25 mg/5 ml (5 mg/ml)",
    ampuleConcMgPerMl: 5,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 400,
    peripheralMaxMcgPerMl: 400,
  },

  // ---- Sedative and NMB drugs ----
  {
    id: "fentanyl",
    name: "Fentanyl",
    category: "sedative_nmb",
    color: "#0284c7",
    ampuleLabel: "100 mcg/2 ml (50 mcg/ml)",
    ampuleConcMgPerMl: 0.05,
    doseMassUnit: "mcg",
    doseTimeUnit: "hr",
    centralMaxMcgPerMl: 50,
    peripheralMaxMcgPerMl: 50,
    displayMassUnit: "mcg",
  },
  {
    id: "midazolam",
    name: "Midazolam",
    category: "sedative_nmb",
    color: "#475569",
    ampuleLabel: "5 mg/ml",
    ampuleConcMgPerMl: 5,
    doseMassUnit: "mg",
    doseTimeUnit: "hr",
    centralMaxMcgPerMl: 5000,
    peripheralMaxMcgPerMl: 5000,
  },
  {
    id: "dexmedetomidine",
    name: "Dexmedetomidine (Precedex)",
    category: "sedative_nmb",
    color: "#059669",
    ampuleLabel: "200 mcg/2 ml (100 mcg/ml)",
    ampuleConcMgPerMl: 0.1,
    doseMassUnit: "mcg",
    doseTimeUnit: "hr",
    centralMaxMcgPerMl: 4,
    peripheralMaxMcgPerMl: 4,
    displayMassUnit: "mcg",
  },
  {
    id: "cisatracurium",
    name: "Cisatracurium (Nimbex)",
    category: "sedative_nmb",
    color: "#a16207",
    ampuleLabel: "10 mg/5 ml (2 mg/ml)",
    ampuleConcMgPerMl: 2,
    doseMassUnit: "mcg",
    doseTimeUnit: "min",
    centralMaxMcgPerMl: 2000,
    peripheralMaxMcgPerMl: 400,
  },
];

function doseUnitLabel(drug) {
  return `${drug.doseMassUnit}/kg/${drug.doseTimeUnit}`;
}

function fmtNum(value, decimals) {
  if (!isFinite(value)) return "-";
  return Number(value.toFixed(decimals)).toString();
}

function calculateDrug(drug, weightKg, route, rateMl, doseValue, ivVolumeMl) {
  const inputsValid =
    weightKg > 0 &&
    (route === "central" || route === "peripheral") &&
    rateMl > 0 &&
    doseValue > 0 &&
    ivVolumeMl > 0;

  if (!inputsValid) return null;

  // แปลง dose ให้เป็นหน่วยกลาง mcg/kg/hr ก่อนคำนวณ ไม่ว่าผู้ใช้จะกรอกเป็น mcg หรือ mg, ต่อนาทีหรือต่อชั่วโมง
  const massToMcg = drug.doseMassUnit === "mg" ? 1000 : 1;
  const timeToHour = drug.doseTimeUnit === "min" ? 60 : 1;

  // ความเข้มข้นที่ต้องผสม (mcg/ml) = dose ต่อชั่วโมงทั้งหมด / rate ที่กำหนด
  const concentration = (doseValue * massToMcg * timeToHour * weightKg) / rateMl;
  const totalDrugMg = (concentration * ivVolumeMl) / 1000;
  const ampuleVolumeMl = totalDrugMg / drug.ampuleConcMgPerMl;
  const maxConcentration =
    route === "central" ? drug.centralMaxMcgPerMl : drug.peripheralMaxMcgPerMl;
  const exceedsMax = concentration > maxConcentration;

  return { concentration, totalDrugMg, ampuleVolumeMl, maxConcentration, exceedsMax };
}

function createDrugCard(drug) {
  const card = document.createElement("article");
  card.className = "drug-card";
  card.dataset.drugId = drug.id;
  card.style.setProperty("--drug-color", drug.color);

  const unitLabel = doseUnitLabel(drug);

  card.innerHTML = `
    <div class="drug-card__header">
      <h2>${drug.name}</h2>
      <span class="drug-card__ampule">Ampule ${drug.ampuleLabel}</span>
    </div>
    <div class="drug-card__inputs">
      <div class="field-group">
        <label>Rate ที่ต้องการ</label>
        <div class="rate-inputs">
          <input type="number" class="input-rate-ml" min="0" step="any" placeholder="1" aria-label="ml/hr" />
          <span class="unit-text">ml/hr =</span>
          <input type="number" class="input-rate-dose" min="0" step="any" placeholder="0.1" aria-label="${unitLabel}" />
          <span class="unit-text">${unitLabel}</span>
        </div>
      </div>
      <div class="field-group">
        <label>ปริมาตร IV ที่ต้องการผสมทั้งหมด (ml)</label>
        <input type="number" class="input-iv-volume" min="0" step="any" placeholder="50" />
      </div>
    </div>
    <div class="drug-card__result">
      <p class="result-placeholder">กรอกน้ำหนักตัว, route และข้อมูลด้านบนให้ครบเพื่อดูผลการคำนวณ</p>
    </div>
  `;

  return card;
}

function renderResult(card, drug, result, rateMl, doseValue, ivVolumeMl) {
  const resultEl = card.querySelector(".drug-card__result");

  if (!result) {
    resultEl.innerHTML =
      '<p class="result-placeholder">กรอกน้ำหนักตัว, route และข้อมูลด้านบนให้ครบเพื่อดูผลการคำนวณ</p>';
    return;
  }

  const { concentration, totalDrugMg, ampuleVolumeMl, maxConcentration, exceedsMax } = result;
  const badgeClass = exceedsMax ? "danger" : "safe";
  const badgeText = exceedsMax
    ? `เกิน max concentration (จำกัดที่ ${fmtNum(maxConcentration, 3)} mcg/ml)`
    : `อยู่ในเกณฑ์ปลอดภัย (max ${fmtNum(maxConcentration, 3)} mcg/ml)`;

  const displayUnit = drug.displayMassUnit || "mg";
  const displayAmount = displayUnit === "mcg" ? totalDrugMg * 1000 : totalDrugMg;

  resultEl.innerHTML = `
    <div class="result-main">${drug.name} ${fmtNum(displayAmount, 3)} ${displayUnit}</div>
    <div class="result-detail">ดูดจาก ampule ${drug.ampuleLabel} = ${fmtNum(ampuleVolumeMl, 3)} ml</div>
    <div class="result-iv">+ IV รวม ${fmtNum(ivVolumeMl, 2)} ml</div>
    <div class="result-formula">(${fmtNum(rateMl, 2)} ml/hr = ${fmtNum(doseValue, 3)} ${doseUnitLabel(drug)})</div>
    <span class="concentration-badge ${badgeClass}">ความเข้มข้น ${fmtNum(concentration, 3)} mcg/ml — ${badgeText}</span>
  `;
}

function renderAll() {
  const weightKg = parseFloat(document.getElementById("weight-input").value);
  const routeInput = document.querySelector('input[name="route"]:checked');
  const route = routeInput ? routeInput.value : null;

  DRUGS.forEach((drug) => {
    const card = document.querySelector(`[data-drug-id="${drug.id}"]`);
    const rateMl = parseFloat(card.querySelector(".input-rate-ml").value);
    const doseValue = parseFloat(card.querySelector(".input-rate-dose").value);
    const ivVolumeMl = parseFloat(card.querySelector(".input-iv-volume").value);

    const result = calculateDrug(drug, weightKg, route, rateMl, doseValue, ivVolumeMl);
    renderResult(card, drug, result, rateMl, doseValue, ivVolumeMl);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const containers = {
    cardiovascular: document.getElementById("drug-list-cardiovascular"),
    sedative_nmb: document.getElementById("drug-list-sedative_nmb"),
  };

  DRUGS.forEach((drug) => containers[drug.category].appendChild(createDrugCard(drug)));

  document.body.addEventListener("input", renderAll);
  document.body.addEventListener("change", renderAll);

  renderAll();
});
