# PediDrip: Pediatric Infusion Calculator

เว็บไซต์ single-page สำหรับคำนวณการผสมยา infusion ในผู้ป่วยเด็ก ออกแบบให้พยาบาล แพทย์ประจำบ้าน และแพทย์ทั่วไปใช้เป็นเครื่องมือช่วยคำนวณเบื้องต้น

## Tech stack
Vanilla HTML/CSS/JavaScript ล้วน ไม่มี framework, ไม่มี build step, ไม่มีฐานข้อมูล — เปิดไฟล์ `index.html` ในเบราว์เซอร์ได้ทันที

## โครงสร้างไฟล์
- `index.html` — โครงหน้า (header, disclaimer, ช่องกรอกน้ำหนัก/route, 2 section แยกตามหมวดยา, footer)
- `style.css` — ธีมสีขาว/ชมพู/เทา (สีหลักปรับได้ที่ `--color-primary` ใน `:root`), การ์ดยาแยกสีต่อชนิด, responsive layout, ใช้ฟอนต์ Noto Sans Thai (โหลดจาก Google Fonts ใน `index.html`) เพื่อให้ตัวอักษรไทยและอังกฤษมีลักษณะเดียวกัน — หากไม่มีอินเทอร์เน็ตตอนเปิดครั้งแรก จะ fallback ไปใช้ฟอนต์ของระบบแทน
- `script.js` — ข้อมูลยา (`DRUGS`) และตรรกะการคำนวณ/แสดงผลทั้งหมด
- `CLAUDE.md` — เอกสารนี้

## หลักการคำนวณ
ผู้ใช้กำหนด rate ที่ต้องการต่อยาในรูป **X ml/hr = Y (หน่วยยาของแต่ละตัว)** และปริมาตร IV รวมที่จะผสม **V ml** ระบบใช้น้ำหนักตัว **W kg** และ route ที่เลือกร่วมกันทุกยา แล้วคำนวณ:

```
massToMcg (ตัวคูณ)     = doseMassUnit === "mg" ? 1000 : 1
timeToHour (ตัวคูณ)    = doseTimeUnit === "min" ? 60 : 1
concentration (mcg/ml) = Y × massToMcg × timeToHour × W / X
totalDrug (mg)         = concentration × V / 1000
ampuleVolume (ml)      = totalDrug (mg) / ampuleConcentration (mg/ml)
maxConcentration       = central หรือ peripheral max ของยานั้น ตาม route ที่เลือก
exceedsMax             = concentration > maxConcentration
```

ยาแต่ละตัวมีหน่วย dose ไม่เหมือนกัน (mcg หรือ mg, ต่อนาทีหรือต่อชั่วโมง) โค้ดจึงแปลงทุกหน่วยเป็น "mcg/kg/hr" ก่อนคำนวณเสมอ ผ่าน field `doseMassUnit`/`doseTimeUnit` ของยานั้นๆ (ดูหัวข้อ "วิธีเพิ่ม/แก้ไขยาใหม่")

ผลลัพธ์ที่แสดง: จำนวน mg ของยาที่ต้องใช้, ปริมาตรที่ต้องดูดจาก ampule, ปริมาตร IV รวม, สูตร rate ที่กำหนด, และ badge เทียบความเข้มข้นกับ max concentration ของ route ที่เลือก (เขียว = อยู่ในเกณฑ์, แดง = เกิน)

โค้ดคำนวณและ render อยู่ในฟังก์ชัน `calculateDrug()` และ `renderResult()` ใน `script.js`

## หมวดหมู่ยา
หน้าเว็บแบ่งยาเป็น 2 หมวด แสดงเป็น section แยกกัน กำหนดผ่าน field `category` ของยาแต่ละตัว:
- `cardiovascular` → แสดงใน section "Cardiovascular Drugs"
- `sedative_nmb` → แสดงใน section "Sedative and NMB Drugs"

## ข้อมูลยา (DRUGS config)
ค่าทั้งหมดด้านล่างเป็นข้อมูลที่ผู้ใช้ (ทีมคลินิก) ระบุและยืนยันมาเองโดยตรง ล่าสุดวันที่ 2026-09-20 ไม่ใช่ค่าที่ AI ค้นคว้าหรือสมมติขึ้น **ต้องมีการทบทวนความถูกต้องเป็นระยะตามนโยบายของหน่วยงาน**

### Cardiovascular Drugs

| ยา | Ampule | หน่วย dose | Central max | Peripheral max | หมายเหตุ |
|---|---|---|---|---|---|
| Adrenaline (Epinephrine) | 1 mg/ml | mcg/kg/min | 64 mcg/ml | 16 mcg/ml | |
| Levophed (Norepinephrine) | 4 mg/4 ml (1 mg/ml) | mcg/kg/min | 64 mcg/ml | 16 mcg/ml | |
| Dopamine | 250 mg/10 ml (25 mg/ml) | mcg/kg/min | 6000 mcg/ml | 800 mcg/ml | |
| Dobutamine | 250 mg/20 ml (12.5 mg/ml) | mcg/kg/min | 5000 mcg/ml | 5000 mcg/ml | peripheral max = central max ตามที่ผู้ใช้ยืนยัน |
| Milrinone | 10 mg/10 ml (1 mg/ml) | mcg/kg/min | 200 mcg/ml | 200 mcg/ml | peripheral max = central max ตามที่ผู้ใช้ยืนยัน |
| Amiodarone | 50 mg/ml | mcg/kg/min | 6000 mcg/ml (6 mg/ml) | 2000 mcg/ml (2 mg/ml) | ผู้ใช้ให้มาเป็น mg/ml แปลงเป็น mcg/ml เพื่อเก็บหน่วยเดียวกันทั้งระบบ |
| Lidocaine 2% | ไม่ระบุขนาด ampule — ใช้ความเข้มข้น 2% = 20 mg/ml (มาตรฐาน w/v: 1% = 10 mg/ml) | mcg/kg/min | 8000 mcg/ml (8 mg/ml) | 8000 mcg/ml (8 mg/ml) | ampule concentration (20 mg/ml) เป็นค่าที่คำนวณจาก % ไม่ใช่ตัวเลขที่ผู้ใช้ให้ตรงๆ — ควรตรวจสอบซ้ำ |
| Nicardipine | 10 mg/10 ml (1 mg/ml) | mcg/kg/min | 500 mcg/ml (0.5 mg/ml) | 200 mcg/ml (0.2 mg/ml) | |
| NTG (Nitroglycerin) | 25 mg/5 ml (5 mg/ml) | mcg/kg/min | 400 mcg/ml | 400 mcg/ml | |

### Sedative and NMB Drugs

| ยา | Ampule | หน่วย dose | Central max | Peripheral max | หมายเหตุ |
|---|---|---|---|---|---|
| Fentanyl | 100 mcg/2 ml (50 mcg/ml) | mcg/kg/hr | 50 mcg/ml | 50 mcg/ml | |
| Midazolam | 5 mg/ml | mg/kg/hr | 5000 mcg/ml (5 mg/ml) | 5000 mcg/ml (5 mg/ml) | |
| Dexmedetomidine (Precedex) | 200 mcg/2 ml (100 mcg/ml) | mcg/kg/hr | 4 mcg/ml | 4 mcg/ml | ผู้ใช้ระบุค่าตั้งต้นเป็น "4 mg/ml" ซึ่งเกินความเข้มข้นดิบของ ampule (0.1 mg/ml) เป็นไปไม่ได้ทางฟิสิกส์ — ผู้ใช้ยืนยันแก้เป็น 4 mcg/ml (เท่ากับ peripheral) |
| Cisatracurium (Nimbex) | 10 mg/5 ml (2 mg/ml) | mcg/kg/min | 2000 mcg/ml (2 mg/ml) | 400 mcg/ml (0.4 mg/ml) | ผู้ใช้ระบุค่าตั้งต้นเป็น "5 mg/ml" ซึ่งเกินความเข้มข้นดิบของ ampule (2 mg/ml) เป็นไปไม่ได้ทางฟิสิกส์ — ผู้ใช้ยืนยันแก้เป็น 2 mg/ml (เท่ากับความเข้มข้นดิบของ ampule พอดี) |

## วิธีเพิ่ม/แก้ไขยาใหม่
เพิ่ม object ใหม่ในอาร์เรย์ `DRUGS` ที่ต้นไฟล์ `script.js` โดยระบุ:
- `id` — string ไม่ซ้ำ (ใช้ผูก DOM)
- `name` — ชื่อยาที่แสดงผล
- `category` — `"cardiovascular"` หรือ `"sedative_nmb"` (ต้องมี container `#drug-list-<category>` อยู่ใน `index.html` แล้ว ถ้าจะเพิ่มหมวดใหม่ต้องเพิ่ม section/container ใน `index.html` ด้วย)
- `color` — สี accent ของการ์ด (hex) — เลี่ยงโทนแดง (ใช้แสดงสถานะ "เกิน max" อยู่แล้ว) และโทนชมพู/ม่วงแดง (สีหลักของเว็บ/header)
- `ampuleLabel` — ข้อความแสดงความแรง ampule ที่จะแสดงผล
- `ampuleConcMgPerMl` — ความเข้มข้นของ ampule ในหน่วย mg/ml (ใช้คำนวณปริมาตรที่ต้องดูด) — **ค่านี้ควรมากกว่าหรือเท่ากับทั้ง central และ peripheral max เสมอ** เพราะการผสม/เจือจางทำให้เข้มข้นขึ้นกว่ายาดิบไม่ได้ ถ้าตัวเลขที่ได้มาขัดกับกฎนี้ ให้ตรวจสอบกับผู้ให้ข้อมูลก่อนใส่ในระบบ
- `doseMassUnit` — `"mcg"` หรือ `"mg"` (หน่วยมวลของ dose ที่ผู้ใช้กรอก)
- `doseTimeUnit` — `"min"` หรือ `"hr"` (หน่วยเวลาของ dose ที่ผู้ใช้กรอก)
- `centralMaxMcgPerMl`, `peripheralMaxMcgPerMl` — ค่า max concentration ของแต่ละ route แปลงเป็นหน่วย **mcg/ml เสมอ** แม้ค่าตั้งต้นจะได้มาเป็น mg/ml หรือ %
- `displayMassUnit` (optional) — `"mcg"` หรือ `"mg"` หน่วยที่ใช้แสดงตัวเลขปริมาณยา (ตัวหนา) ในผลลัพธ์ ถ้าไม่ระบุ default เป็น `"mg"` — ใช้ `"mcg"` กับยาที่ปริมาณต่อการผสมมักเป็นตัวเลขเล็กมากถ้าแสดงเป็น mg (เช่น Fentanyl, Dexmedetomidine) การคำนวณภายในยังคงเป็น mg เหมือนเดิม field นี้มีผลแค่การแสดงผล

การ์ดยาและ event listener ทั้งหมดถูกสร้างอัตโนมัติจากอาร์เรย์นี้ ไม่ต้องแก้ `index.html` (ยกเว้นกรณีเพิ่มหมวดหมู่ใหม่)

## ข้อควรระวังด้านความปลอดภัย
เครื่องมือนี้เป็นเพียงตัวช่วยคำนวณ **ไม่ใช่คำแนะนำทางการแพทย์และไม่ทดแทนการตรวจสอบของเภสัชกร/นโยบายของหน่วยงาน** ก่อนนำไปใช้จริงหรือแก้ไขค่า max concentration ควรตรวจสอบกับแหล่งอ้างอิงทางคลินิกและผู้เชี่ยวชาญด้านยาเสมอ โดยเฉพาะค่าที่มีหมายเหตุว่าเป็นค่าที่แปลง/คำนวณมา (Lidocaine 2%, Amiodarone) หรือค่าที่แก้ไขจากตัวเลขตั้งต้นที่ขัดแย้งกันเอง (Dexmedetomidine, Cisatracurium)
