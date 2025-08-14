import { calcRow, r2, r3 } from './eiq'
const products = [{ name:'ACROBAT', maxRate:2.0, eiqPerHa:77.41863023390722 }]
describe('EIQ calc – rounding parity', () => {
  it('100% scenario equals base EIQ', () => {
    const r = calcRow(products as any, { product:'ACROBAT', times:1, scenarioPct:100, fieldPct:100 })
    expect(r3(r.scenarioRate).toFixed(3)).toBe('2.000')
    expect(r2(r.doseEIQha).toFixed(2)).toBe(r2(77.41863023390722).toFixed(2))
    expect(r2(r.fieldEIQha).toFixed(2)).toBe(r2(77.41863023390722).toFixed(2))
  })
  it('50% scenario scales linearly with rates', () => {
    const r = calcRow(products as any, { product:'ACROBAT', times:2, scenarioPct:50, fieldPct:60 })
    const base = 77.41863023390722
    const expectedField = base * 0.6
    expect(r3(r.scenarioRate).toFixed(3)).toBe('1.000')
    expect(r2(r.fieldEIQha).toFixed(2)).toBe(r2(expectedField).toFixed(2))
  })
})


function expect(arg0: string) {
  throw new Error('Function not implemented.')
}
// Remove custom expect function to use Jest's expect
