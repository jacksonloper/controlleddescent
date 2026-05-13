export type ProfileSegment = {
  diameterMm: number
  lengthMm: number
  label: string
}

export type PlateSpec = {
  widthMm: number
  heightMm: number
  thicknessMm: number
  holeDiameterMm: number
  holeSpacingMm: number
}

export type PartSpec = {
  id: string
  name: string
  summary: string
  operation: string
  profile: ProfileSegment[]
  plate: PlateSpec
}

export const integratedSheavePlate: PartSpec = {
  id: 'integrated-sheave-plate',
  name: 'Integrated sheave plate',
  summary:
    'A single printed body that combines a stepped sheave, a one-inch 4 mm shaft section, and a fastening plate.',
  operation:
    'Rope rides in the two 5 mm grooves while the 4 mm shaft section keys the part into the rest of the mechanism and the plate provides a bolt-on mounting face.',
  profile: [
    { diameterMm: 20, lengthMm: 4, label: 'Outer cheek' },
    { diameterMm: 5, lengthMm: 8, label: 'Rope groove' },
    { diameterMm: 20, lengthMm: 4, label: 'Inner cheek' },
    { diameterMm: 4, lengthMm: 25.4, label: 'Integrated shaft' },
    { diameterMm: 20, lengthMm: 4, label: 'Inner cheek' },
    { diameterMm: 5, lengthMm: 8, label: 'Rope groove' },
    { diameterMm: 20, lengthMm: 4, label: 'Outer cheek' },
  ],
  plate: {
    widthMm: 42,
    heightMm: 28,
    thicknessMm: 4,
    holeDiameterMm: 4.5,
    holeSpacingMm: 26,
  },
}

export const totalProfileLengthMm = integratedSheavePlate.profile.reduce(
  (total, segment) => total + segment.lengthMm,
  0,
)
