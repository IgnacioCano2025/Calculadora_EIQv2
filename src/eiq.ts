export type Product = { name: string; minRate?: number | null; maxRate?: number | null; eiqPerHa?: number | null }
export type RowInput = { product?: string; times: number; normalRate?: number; scenarioPct: number; fieldPct: number }
export type RowComputed = RowInput & { scenarioRate: number; doseEIQha: number; productEIQha: number; fieldEIQha: number; defaultEIQha: number }
export const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100
export const r3 = (x: number) => Math.round((x + Number.EPSILON) * 1000) / 1000
export function getProduct(products: Product[], name?: string){ if(!name) return undefined; return products.find(p => p.name === name) }
export function calcRow(products: Product[], row: RowInput): RowComputed {
  const p = getProduct(products, row.product)
  const normalRateRaw = row.normalRate ?? (p?.maxRate ?? p?.minRate ?? 0)
  const normalRate = Number.isFinite(normalRateRaw) ? normalRateRaw : 0
  const scenarioRate = normalRate * (row.scenarioPct / 100)
  const baseEiq = p?.eiqPerHa ?? 0
  const doseEIQha = normalRate > 0 ? baseEiq * (scenarioRate / normalRate) : 0
  const productEIQha = doseEIQha * (row.times ?? 0)
  const fieldEIQha = productEIQha * ((row.fieldPct ?? 0) / 100)
  const defaultEIQha = baseEiq * (row.times ?? 0)
  return { ...row, scenarioRate, doseEIQha, productEIQha, fieldEIQha, defaultEIQha }
}
export function tierLabel(val: number){ if (!val || val <= 0) return ''; if (val < 200) return 'Leading'; if (val < 500) return 'Advanced'; if (val < 800) return 'Engaged'; return 'Too high for Regenerative agriculture' }
