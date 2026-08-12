import type { Customer } from '../lib/types'

export const customers: Customer[] = [
  { id: 'c1', name: 'Arda Teknik', aliases: ['arda', 'arda teknik'], priceOverrides: { 'KL-120': 17650, 'BRK-12': 109 } },
  { id: 'c2', name: 'Mavi Mekanik', aliases: ['mavi', 'mavi mekanik'] },
  { id: 'c3', name: 'Kuzey Klima', aliases: ['kuzey', 'kuzey klima'], priceOverrides: { 'KL-180': 23750 } }
]
