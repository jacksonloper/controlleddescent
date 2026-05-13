export type ProfileSegment = {
  diameterMm: number
  lengthMm: number
  label: string
}

export type FlangeHoleSpec = {
  holeDiameterMm: number
  radialOffsetMm: number
}

export type PartSpec = {
  id: string
  name: string
  summary: string
  operation: string
  profile: ProfileSegment[]
  outerDiameterMm: number
  flangeHoles: FlangeHoleSpec
}

export const integratedSheavePlate: PartSpec = {
  id: 'integrated-sheave-plate',
  name: 'Integrated sheave plate',
  summary:
    'A single printed body with two outer flanges, two rope grooves, and a one-inch 4 mm center section.',
  operation:
    'This viewer shows the OpenSCAD form directly so you can inspect the stepped profile and the M4 clearance holes cut through the two outer flanges.',
  profile: [
    { diameterMm: 20, lengthMm: 4, label: 'Outer flange' },
    { diameterMm: 5, lengthMm: 8, label: 'Rope groove' },
    { diameterMm: 20, lengthMm: 4, label: 'Inner flange' },
    { diameterMm: 4, lengthMm: 25.4, label: 'Center section' },
    { diameterMm: 20, lengthMm: 4, label: 'Inner flange' },
    { diameterMm: 5, lengthMm: 8, label: 'Rope groove' },
    { diameterMm: 20, lengthMm: 4, label: 'Outer flange' },
  ],
  outerDiameterMm: 20,
  flangeHoles: {
    holeDiameterMm: 4.5,
    radialOffsetMm: 7,
  },
}

export const totalProfileLengthMm = integratedSheavePlate.profile.reduce(
  (total, segment) => total + segment.lengthMm,
  0,
)
