import { Suspense, lazy } from 'react'
import './App.css'
import { integratedSheavePlate, totalProfileLengthMm } from './parts'

const PartViewer = lazy(async () => {
  const module = await import('./components/PartViewer')

  return { default: module.PartViewer }
})

const highlightedMetrics = [
  { label: 'Profile steps', value: `${integratedSheavePlate.profile.length}` },
  { label: 'Overall length', value: `${totalProfileLengthMm.toFixed(1)} mm` },
  { label: 'Bolt clearance', value: `M4 (${integratedSheavePlate.plate.holeDiameterMm} mm)` },
]

function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Controlled Descent</p>
          <h1>Interactive part studies for a printed mechanism.</h1>
          <p className="lede">
            A lightweight React, TypeScript, and Three.js site for exploring OpenSCAD parts
            before they reach the bench.
          </p>
          <div className="metric-grid">
            {highlightedMetrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </div>
        <Suspense fallback={<div className="viewer-shell viewer-fallback">Loading viewer…</div>}>
          <PartViewer spec={integratedSheavePlate} />
        </Suspense>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="section-tag">Part 01</p>
          <h2>{integratedSheavePlate.name}</h2>
          <p>{integratedSheavePlate.summary}</p>
          <p>{integratedSheavePlate.operation}</p>
          <a className="source-link" href="parts/integrated-sheave-plate.scad">
            View the OpenSCAD source
          </a>
        </article>

        <article className="panel">
          <p className="section-tag">Section recipe</p>
          <ol className="segment-list">
            {integratedSheavePlate.profile.map((segment, index) => (
              <li key={`${segment.label}-${index}`}>
                <span>{segment.label}</span>
                <strong>
                  {segment.diameterMm} mm × {segment.lengthMm} mm
                </strong>
              </li>
            ))}
          </ol>
        </article>

        <article className="panel panel-wide">
          <p className="section-tag">How the viewer helps</p>
          <div className="bullet-columns">
            <div>
              <h3>Design checks</h3>
              <ul>
                <li>Validate the stepped turning profile before printing.</li>
                <li>Confirm the two rope grooves sit between the 20 mm cheeks.</li>
                <li>Inspect the bolt plate footprint and M4 clearance spacing.</li>
              </ul>
            </div>
            <div>
              <h3>Next additions</h3>
              <ul>
                <li>Add more OpenSCAD parts beside this first integrated sheave plate.</li>
                <li>Introduce motion studies for rope path, fasteners, and mating parts.</li>
                <li>Keep Netlify deploys simple with a static Vite build.</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
