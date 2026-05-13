# controlleddescent

A lightweight React + TypeScript + Three.js viewer for OpenSCAD mechanism studies.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## Deployment

The repository includes a `netlify.toml` so Netlify can deploy the static Vite build directly.

## Parts

- `parts/integrated-sheave-plate.scad` defines the first showcased part.
- The site renders a matching interactive study of the integrated sheave plate profile, center section, and M4 holes in the outer flanges.
