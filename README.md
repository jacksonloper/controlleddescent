# controlleddescent

A lightweight Vite + React + Three.js site for exploring early contraption parts with orbit controls while keeping OpenSCAD files as the editable source of truth.

## Included parts

- **Spool** — 15 mm barrel radius, 30 mm winding length, 30 mm flanges, 12 mm square bore.
- **Square-to-round shaft** — 30 mm square center section with 30 mm round journals on both sides.
- **Pulley housing** — top hook eye, cheek shaft holes sized slightly over the round shaft, and paired M4 clearance holes spaced 56 mm apart with the shaft hole positioned between them.
- **Full assembly** — a fitted color-separated view of the spool, shaft, and housing together.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## Netlify

The repository includes `netlify.toml` so Netlify can publish the static Vite build from `dist`.
