import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { r2, r3, tierLabel } from './eiq'
async function toDataURL(url: string): Promise<string>{ const res = await fetch(url); const blob = await res.blob(); return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.onerror = reject; reader.readAsDataURL(blob) }) }
export async function exportScenarioPDF(rows: any[], totals: {normal: number; scenario: number; change: number}){
  const doc = new jsPDF({ unit: 'pt', format: 'a4' }), margin = 40, width = doc.internal.pageSize.getWidth()
try {
  const logo = await toDataURL('/edra-logo.png');

  // Leer dimensiones reales del logo
  const props = (doc as any).getImageProperties(logo);
  const imgW = props.width;
  const imgH = props.height;

  // Bounding box: ajustá si querés más grande/chico
  const maxW = 220;   // ancho máximo permitido (pt)
  const maxH = 60;    // alto máximo permitido (pt)

  // Escala manteniendo proporción
  const scale = Math.min(maxW / imgW, maxH / imgH);
  const w = imgW * scale;
  const h = imgH * scale;

  // Posición (izquierda + centrado vertical en la caja)
  const x = margin;
  const y = margin + (maxH - h) / 2;

  doc.addImage(logo, 'PNG', x, y, w, h);
} catch {}
  doc.setFontSize(20); doc.text('Reporte – Calculadora EIQ (Escenario)', margin, 220)
  doc.setFontSize(11); const dateStr = new Date().toLocaleString(); doc.text(`Fecha: ${dateStr}`, margin, 240)
  doc.setDrawColor(50); doc.setFillColor(240, 245, 255); doc.roundedRect(margin, 270, width - margin*2, 96, 10, 10, 'F')
  doc.setFontSize(12)
  doc.text(`Normal field EIQ/ha: ${r2(totals.normal)}`, margin + 16, 300)
  doc.text(`Scenario field EIQ/ha: ${r2(totals.scenario)}`, margin + 16, 322)
  doc.text(`Change: ${(totals.change*100).toFixed(1)}%`, margin + 16, 344)
  doc.text(`Tier: ${tierLabel(totals.scenario) || '—'}`, margin + 16, 366)
  doc.addPage()
  ;(doc as any).autoTable({
    startY: margin,
    head: [[ '#','Producto','Veces','Normal rate','% Esc.','Scenario rate','% Campo','Dose EIQ/ha','Prod EIQ/ha','Field EIQ/ha','Default EIQ/ha' ]],
    body: rows.map((r: any, idx: number) => [ idx+1, r.product || '-', r.times ?? '', r3(r.normalRate ?? 0).toFixed(3), r.scenarioPct ?? '', r3(r.scenarioRate ?? 0).toFixed(3), r.fieldPct ?? '', r2(r.doseEIQha ?? 0).toFixed(2), r2(r.productEIQha ?? 0).toFixed(2), r2(r.fieldEIQha ?? 0).toFixed(2), r2(r.defaultEIQha ?? 0).toFixed(2) ]),
    styles: { fontSize: 8, cellPadding: 3 }, headStyles: { fillColor: [24, 44, 91], textColor: 255 }, alternateRowStyles: { fillColor: [245, 247, 255] }, margin: { left: margin, right: margin }
  })
  doc.save('reporte_eiq.pdf')
}
