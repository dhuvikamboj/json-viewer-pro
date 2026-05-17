import { jsPDF } from "jspdf";

export type Product = {
  item_no: string;
  no_of_lamps: string;
  size: string;
  height: string;
  light_source: string;
  finish: string;
  materials: string;
  price: string;
  tag_id: string;
  image_path: string;
};

// A4 portrait in points
const W = 595.28;
const H = 841.89;
const BG = "#cfcfcf";
const DARK = "#111111";
const ROSE = "#a64367";
const GREEN = "#22c55e";

function drawPage(doc: jsPDF, p: Product) {
  // background
  doc.setFillColor(BG);
  doc.rect(0, 0, W, H, "F");

  // subtle dot noise
  doc.setFillColor(255, 255, 255);
  let seed = 0;
  for (const ch of p.item_no) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  for (let i = 0; i < 600; i++) {
    doc.circle(rand() * W, rand() * H, 0.4, "F");
  }

  // Title
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.text("DECOR CHRONICLE", W / 2, 80, { align: "center" });

  // Contact lines
  doc.setTextColor(DARK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  const cx = W / 2 - 110;
  doc.setDrawColor(DARK);
  doc.setLineWidth(1);
  doc.circle(cx, 115, 6, "S");
  doc.line(cx - 6, 115, cx + 6, 115);
  doc.line(cx, 109, cx, 121);
  doc.text("www.decorchronicle.com", cx + 14, 119);

  doc.setFillColor(GREEN);
  doc.circle(cx, 140, 7, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("W", cx, 143, { align: "center" });
  doc.setTextColor(DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text("+91 8595626577", cx + 14, 144);

  // Image frame (dark rounded rect placeholder)
  const frameW = W - 140;
  const frameH = 430;
  const fx = (W - frameW) / 2;
  const fy = 170;
  doc.setFillColor(DARK);
  doc.roundedRect(fx, fy, frameW, frameH, 24, 24, "F");
  doc.setTextColor("#3a3a3a");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("[ Product Image ]", W / 2, fy + frameH / 2, { align: "center" });

  // Specs
  const specs: [string, string][] = (
    [
      ["MATERIAL", p.materials],
      ["LIGHT SOURCE", p.light_source],
      ["SIZE", p.size],
      ["HEIGHT", p.height],
      ["FINISH", p.finish],
      ["LAMPS", p.no_of_lamps],
      ["ITEM NO", p.item_no],
    ] as [string, string][]
  ).filter(([, v]) => v && String(v).trim() !== "");

  doc.setTextColor(DARK);
  let y = fy + frameH + 40;
  for (const [k, v] of specs) {
    const label = `${k} : `;
    const val = String(v).toUpperCase();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const lw = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    const vw = doc.getTextWidth(val);
    const x0 = (W - (lw + vw)) / 2;
    doc.setFont("helvetica", "bold");
    doc.text(label, x0, y);
    doc.setFont("helvetica", "normal");
    doc.text(val, x0 + lw, y);
    y += 20;
  }

  // Price pill
  const price = `${Number(p.price).toLocaleString("en-IN")}/-`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  const pw = doc.getTextWidth(price);
  const pillW = pw + 70;
  const pillH = 44;
  const px = (W - pillW) / 2;
  const py = Math.max(40, y + 20);
  doc.setFillColor(DARK);
  doc.roundedRect(px, py, pillW, pillH, pillH / 2, pillH / 2, "F");
  doc.setTextColor(ROSE);
  doc.text(price, W / 2, py + pillH / 2 + 8, { align: "center" });
}

export function exportProductsPdf(products: Product[], filename = "decor-chronicle-catalogue.pdf") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  products.forEach((p, i) => {
    if (i > 0) doc.addPage();
    drawPage(doc, p);
  });
  doc.save(filename);
}
