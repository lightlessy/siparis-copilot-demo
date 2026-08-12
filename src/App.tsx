import { useMemo, useState } from 'react'
import { Check, Copy, RotateCcw, TriangleAlert } from 'lucide-react'
import { examples } from './data/examples'
import { parseOrder } from './lib/parser'
import type { OrderLine } from './lib/types'
import './styles.css'

const money = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })

export default function App() {
  const [text, setText] = useState(examples[0].text)
  const [runText, setRunText] = useState(examples[0].text)
  const [copied, setCopied] = useState(false)
  const initial = useMemo(() => parseOrder(runText), [runText])
  const [edits, setEdits] = useState<Record<number, Partial<OrderLine>>>({})
  const parsed = useMemo(() => ({ ...initial, lines: initial.lines.map((line, i) => ({ ...line, ...edits[i] })) }), [initial, edits])
  const exceptions = parsed.lines.map((line, index) => ({ line, index })).filter(({ line }) => line.issue)
  const total = parsed.lines.reduce((sum, line) => sum + ((line.quantity ?? 0) * (line.unitPrice ?? 0)), 0)

  function analyze() {
    setEdits({})
    setCopied(false)
    setRunText(text)
  }

  function chooseExample(exampleText: string) {
    setText(exampleText)
    setRunText(exampleText)
    setEdits({})
    setCopied(false)
  }

  function updateLine(index: number, patch: Partial<OrderLine>) {
    setEdits((current) => ({ ...current, [index]: { ...current[index], ...patch } }))
  }

  function approve(index: number) {
    updateLine(index, { issue: undefined, confidence: 0.94 })
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(JSON.stringify(parsed, null, 2))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-wrap"><div className="brand-mark">S</div><div><div className="brand">Sipariş Copilot</div><div className="brand-sub">Operasyon demosu</div></div></div>
      <div className="topbar-right"><span className="dataset-pill">Demo katalog</span><span className="status-dot"/> Hazır</div>
    </header>

    <main className="page">
      <section className="summary-bar">
        <div><span>Müşteri</span><strong>{parsed.customerName || '—'}</strong></div>
        <div><span>Satır</span><strong>{parsed.lines.length}</strong></div>
        <div><span>Sipariş toplamı</span><strong>{total ? money.format(total) : '—'}</strong></div>
        <div className={exceptions.length ? 'summary-warning' : 'summary-ready'}><span>Durum</span><strong>{exceptions.length ? `${exceptions.length} kontrol` : 'ERP hazır'}</strong></div>
      </section>

      <div className="workspace">
        <section className="column source-column">
          <div className="section-band band-violet"><span>1</span><strong>Gelen sipariş</strong></div>
          <div className="column-head"><p>Mesajı yapıştır veya örneklerden birini seç.</p></div>
          <div className="example-row">{examples.map((example) => <button key={example.label} onClick={() => chooseExample(example.text)}>{example.label}</button>)}</div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false}/>
          <div className="source-actions"><button className="ghost" onClick={() => setText('')}><RotateCcw size={15}/> Temizle</button><button className="primary violet" onClick={analyze}>Siparişi hazırla</button></div>
        </section>

        <section className="column order-column">
          <div className="section-band band-blue"><span>2</span><strong>Sipariş</strong></div>
          <div className="column-head order-head"><div><p>Müşteri</p><h2>{parsed.customerName || 'Eşleşmedi'}</h2></div><span className="line-count">{parsed.lines.length} satır</span></div>
          {parsed.notes.map((note) => <div className="notice" key={note}><TriangleAlert size={16}/>{note}</div>)}
          <div className="order-list">
            {parsed.lines.map((line, index) => <article className={`order-card ${line.issue ? 'needs-review' : 'is-ready'}`} key={`${line.sku}-${index}`}>
              <div className="order-card-top"><div><strong>{line.product}</strong><span>{line.sku}</span></div><span className={`confidence ${line.issue ? 'warn' : ''}`}>{Math.round(line.confidence * 100)}%</span></div>
              <div className="field-grid">
                <label>Miktar<input type="number" value={line.quantity ?? ''} onChange={(e) => updateLine(index, { quantity: e.target.value ? Number(e.target.value) : null })}/></label>
                <label>Birim<input value={line.unit ?? ''} onChange={(e) => updateLine(index, { unit: e.target.value })}/></label>
                <label>Fiyat<input type="number" value={line.unitPrice ?? ''} onChange={(e) => updateLine(index, { unitPrice: e.target.value ? Number(e.target.value) : null })}/></label>
                <label>Stok<input value={line.stock ?? ''} readOnly/></label>
              </div>
              <div className="line-total"><span>Satır toplamı</span><strong>{line.quantity && line.unitPrice ? money.format(line.quantity * line.unitPrice) : '—'}</strong></div>
            </article>)}
            {!parsed.lines.length && <div className="empty">Sipariş satırı bulunamadı.</div>}
          </div>
        </section>

        <section className="column exceptions-column">
          <div className="section-band band-amber"><span>3</span><strong>Kontrol</strong></div>
          <div className="column-head"><p>{exceptions.length ? 'Yalnızca belirsiz alanları doğrula.' : 'Kontrol bekleyen alan yok.'}</p></div>
          <div className="exceptions-list">
            {exceptions.map(({ line, index }) => <article className="exception-card" key={index}>
              <div className="exception-title"><div className="warning-icon"><TriangleAlert size={16}/></div><div><strong>{line.product}</strong><span>{line.sku}</span></div></div>
              <p>{line.issue}</p>
              <div className="exception-actions"><button className="ghost" onClick={() => updateLine(index, { issue: undefined })}>Düzeltildi</button><button className="primary amber" onClick={() => approve(index)}><Check size={14}/> Onayla</button></div>
            </article>)}
            {!exceptions.length && <div className="ready"><div className="ready-icon"><Check size={20}/></div><strong>ERP çıktısı hazır</strong><span>Kontrol bekleyen alan yok.</span></div>}
          </div>
          <div className="output-box">
            <div className="output-head"><div><span>ÇIKTI</span><strong>ERP JSON</strong></div><button onClick={() => void copyOutput()}><Copy size={14}/> {copied ? 'Kopyalandı' : 'Kopyala'}</button></div>
            <pre>{JSON.stringify(parsed, null, 2)}</pre>
          </div>
        </section>
      </div>
    </main>
  </div>
}
