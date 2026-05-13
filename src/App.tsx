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
  {
    label: 'Flange holes',
    value: `4 × ${integratedSheavePlate.flangeHoles.holeDiameterMm} mm`,
  },
]

function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Controlled Descent</p>
          <h1>Interactive part studies for a printed mechanism.</h1>
          <p className="lede">
            A lightweight React, TypeScript, and Three.js viewer for orbiting around the
            current OpenSCAD part and checking its proportions.
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
                <li>Validate the stepped lathed profile before printing.</li>
                <li>Inspect the one-inch 4 mm center section between the two inner flanges.</li>
                <li>Confirm the M4 clearance holes land in both outer flanges.</li>
              </ul>
            </div>
            <div>
              <h3>Viewer focus</h3>
              <ul>
                <li>Orbit, pan, and zoom the current OpenSCAD form without automatic motion.</li>
                <li>Keep the scene stripped back so the geometry reads clearly.</li>
                <li>Add more parts later once this first shape is represented accurately.</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
