export type CatalogItem = {
  sku: string
  name: string
  aliases: string[]
  unit: 'adet' | 'metre' | 'koli'
  packSize: number
  listPrice: number
  stock: number
}

export type Customer = {
  id: string
  name: string
  aliases: string[]
  priceOverrides?: Record<string, number>
}

export type OrderLine = {
  raw: string
  sku: string | null
  product: string
  quantity: number | null
  unit: string | null
  unitPrice: number | null
  stock: number | null
  confidence: number
  issue?: string
}

export type ParsedOrder = {
  customerId: string | null
  customerName: string
  lines: OrderLine[]
  notes: string[]
}
