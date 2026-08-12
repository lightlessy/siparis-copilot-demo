import { catalog } from '../data/catalog'
import { customers } from '../data/customers'
import type { CatalogItem, Customer, ParsedOrder } from './types'

const normalize = (value: string) => value.toLocaleLowerCase('tr-TR').replace(/[.,;:()]/g, ' ').replace(/\s+/g, ' ').trim()

function detectCustomer(text: string): Customer | null {
  const n = normalize(text)
  return customers.find((c) => [c.name, ...c.aliases].some((alias) => n.includes(normalize(alias)))) ?? null
}

function detectItem(chunk: string): { item: CatalogItem | null; confidence: number } {
  const n = normalize(chunk)
  for (const item of catalog) {
    if (n.includes(normalize(item.sku))) return { item, confidence: 0.99 }
  }
  const ranked = catalog
    .map((item) => {
      const terms = [item.name, ...item.aliases].map(normalize)
      const score = Math.max(...terms.map((term) => term.split(' ').filter((word) => word.length > 2 && n.includes(word)).length / Math.max(1, term.split(' ').length)))
      return { item, score }
    })
    .sort((a, b) => b.score - a.score)
  return ranked[0]?.score >= 0.34 ? { item: ranked[0].item, confidence: Math.min(0.9, 0.55 + ranked[0].score / 3) } : { item: null, confidence: 0.2 }
}

function detectQuantity(chunk: string) {
  const matches = normalize(chunk).match(/\b(\d+(?:[.,]\d+)?)\s*(adet|tane|metre|m|koli)?\b/g) ?? []
  if (!matches.length) return { quantity: null, unit: null }
  const parsed = matches.map((m) => {
    const p = m.match(/(\d+(?:[.,]\d+)?)\s*(adet|tane|metre|m|koli)?/)
    return { quantity: p ? Number(p[1].replace(',', '.')) : null, unit: p?.[2] ?? null }
  })
  return parsed[0]
}

export function parseOrder(text: string): ParsedOrder {
  const customer = detectCustomer(text)
  const chunks = text.split(/(?:,|\bve\b|\bbir de\b)/i).map((x) => x.trim()).filter(Boolean)
  const lines = chunks.flatMap((chunk) => {
    const { item, confidence } = detectItem(chunk)
    if (!item) return []
    const qty = detectQuantity(chunk)
    const price = customer?.priceOverrides?.[item.sku] ?? item.listPrice
    let issue = ''
    if (qty.unit === 'koli' && item.packSize > 1) issue = `Koli adedi ${item.packSize}. ${qty.quantity ?? '?'} koli = ${(qty.quantity ?? 0) * item.packSize} adet olarak mı girilsin?`
    else if (qty.quantity == null) issue = 'Miktar bulunamadı.'
    else if ((qty.quantity ?? 0) > item.stock && item.unit !== 'metre') issue = `Stok ${item.stock} ${item.unit}. İstenen miktar stoktan yüksek.`
    return [{
      raw: chunk,
      sku: item.sku,
      product: item.name,
      quantity: qty.quantity,
      unit: qty.unit === 'tane' ? 'adet' : qty.unit || item.unit,
      unitPrice: price,
      stock: item.stock,
      confidence: issue ? Math.min(confidence, 0.72) : confidence,
      issue: issue || undefined
    }]
  })
  return {
    customerId: customer?.id ?? null,
    customerName: customer?.name ?? '',
    lines,
    notes: customer ? [] : ['Müşteri eşleşmedi.']
  }
}
