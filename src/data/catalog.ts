import type { CatalogItem } from '../lib/types'

export const catalog: CatalogItem[] = [
  { sku: 'KL-120', name: '12000 BTU Duvar Tipi Klima', aliases: ['12lik klima', '12 binlik', 'kl 120'], unit: 'adet', packSize: 1, listPrice: 18400, stock: 23 },
  { sku: 'KL-180', name: '18000 BTU Duvar Tipi Klima', aliases: ['18lik klima', '18 binlik', 'kl 180'], unit: 'adet', packSize: 1, listPrice: 24600, stock: 9 },
  { sku: 'BRK-12', name: 'Bakır Boru 1/2', aliases: ['yarim bakir', '1/2 boru', 'bakir 12'], unit: 'metre', packSize: 25, listPrice: 118, stock: 430 },
  { sku: 'BRK-14', name: 'Bakır Boru 1/4', aliases: ['ceyrek bakir', '1/4 boru', 'bakir 14'], unit: 'metre', packSize: 25, listPrice: 86, stock: 610 },
  { sku: 'VLV-20', name: 'Küresel Vana 20 mm', aliases: ['20 vana', 'vana 20', 'kuresel 20'], unit: 'adet', packSize: 10, listPrice: 890, stock: 17 },
  { sku: 'VLV-25', name: 'Küresel Vana 25 mm', aliases: ['25 vana', 'vana 25', 'kuresel 25'], unit: 'adet', packSize: 10, listPrice: 1040, stock: 6 }
]
