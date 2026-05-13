import { useMemo, useState } from 'react'
import './App.css'

import { PartScene } from './components/PartScene'
import { defaultPartId, partCatalog, type PartId } from './data/parts'

function App() {
  const [activePartId, setActivePartId] = useState<PartId>(defaultPartId)

  const activePart = useMemo(
    () =>
      partCatalog.find((part) => part.id === activePartId) ?? partCatalog[0],
    [activePartId],
  )

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">controlled descent</p>
          <h1>Contraption parts viewer</h1>
          <p className="hero-copy">
            Lightweight React + Three.js sketches backed by OpenSCAD source for
            early spool, shaft, and pulley housing concepts.
          </p>
        </div>
        <div className="hero-notes">
          <h2>Design goals</h2>
          <ul>
            <li>Keep each part printable and easy to inspect with orbit controls.</li>
            <li>Preserve OpenSCAD as the editable source of truth for each part.</li>
            <li>Track clearances so the housing hardware does not clash with the spool.</li>
          </ul>
        </div>
      </section>

      <section className="workspace">
        <aside className="part-list" aria-label="Part list">
          {partCatalog.map((part) => (
            <button
              key={part.id}
              type="button"
              className={part.id === activePart.id ? 'part-button active' : 'part-button'}
              onClick={() => setActivePartId(part.id)}
            >
              <span>{part.name}</span>
              <small>{part.summary}</small>
            </button>
          ))}
        </aside>

        <section className="viewer-panel">
          <div className="viewer-header">
            <div>
              <p className="eyebrow">Selected part</p>
              <h2>{activePart.name}</h2>
            </div>
            <a href={activePart.scadUrl} download className="download-link">
              Download .scad
            </a>
          </div>
          <p className="part-summary">{activePart.summary}</p>
          <PartScene activePart={activePart.id} />
        </section>
      </section>

      <section className="details-grid">
        <article className="card">
          <h2>Key dimensions</h2>
          <dl className="dimension-list">
            {activePart.dimensions.map((dimension) => (
              <div key={dimension.label}>
                <dt>{dimension.label}</dt>
                <dd>{dimension.value}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className="card">
          <h2>Assumptions</h2>
          <ul className="bullet-list">
            {activePart.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card code-card">
        <div className="code-header">
          <div>
            <p className="eyebrow">OpenSCAD ground truth</p>
            <h2>{activePart.name} source</h2>
          </div>
          <span className="code-hint">Mirror the source here before refining the Three.js sketch.</span>
        </div>
        <pre>
          <code>{activePart.scadSource}</code>
        </pre>
      </section>
    </main>
  )
}

export default App
