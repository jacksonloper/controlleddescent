import pulleyHousingScadSource from '../assets/scad/pulley-housing.scad?raw'
import pulleyHousingScadUrl from '../assets/scad/pulley-housing.scad?url'
import assemblyScadSource from '../assets/scad/assembly.scad?raw'
import assemblyScadUrl from '../assets/scad/assembly.scad?url'
import shaftScadSource from '../assets/scad/shaft.scad?raw'
import shaftScadUrl from '../assets/scad/shaft.scad?url'
import spoolScadSource from '../assets/scad/spool.scad?raw'
import spoolScadUrl from '../assets/scad/spool.scad?url'

export type PartId = 'spool' | 'shaft' | 'housing' | 'assembly'

export type PartSpec = {
  id: PartId
  name: string
  summary: string
  assumptions: string[]
  dimensions: Array<{ label: string; value: string }>
  scadSource: string
  scadUrl: string
}

export const spoolDimensions = {
  barrelRadius: 15,
  barrelLength: 30,
  flangeRadius: 30,
  flangeThickness: 4,
  shaftSquare: 12,
} as const

export const shaftDimensions = {
  squareWidth: spoolDimensions.shaftSquare,
  squareLength: 30,
  roundRadius: 6,
  roundLength: 30,
} as const

export const housingDimensions = {
  cheekThickness: 6,
  cheekDepth: 22,
  innerGap: spoolDimensions.barrelLength + spoolDimensions.flangeThickness * 2 + 2,
  cheekBottomY: -112,
  shaftClearanceRadius: shaftDimensions.roundRadius + 0.6,
  topBridgeY: 28,
  topBridgeHeight: 12,
  topBridgeDepth: 14,
  eyeOuterRadius: 18,
  eyeInnerRadius: 7,
  eyeCenterY: 48,
  boltHoleRadius: 2.2,
  boltHoleSpacing: 56,
  upperBoltY: 22,
} as const

const lowerBoltY =
  housingDimensions.upperBoltY - housingDimensions.boltHoleSpacing

export const partCatalog: PartSpec[] = [
  {
    id: 'spool',
    name: 'Spool',
    summary:
      'A rope spool with 15 mm barrel radius, 30 mm winding length, 30 mm side flanges, and a square shaft bore.',
    assumptions: [
      'Flanges are 4 mm thick so the winding surface stays prominent while protecting the rope.',
      'The square shaft opening is 12 mm wide to match the shaft center section.',
    ],
    dimensions: [
      { label: 'Barrel radius', value: `${spoolDimensions.barrelRadius} mm` },
      { label: 'Barrel length', value: `${spoolDimensions.barrelLength} mm` },
      { label: 'Flange radius', value: `${spoolDimensions.flangeRadius} mm` },
      {
        label: 'Square bore',
        value: `${spoolDimensions.shaftSquare} × ${spoolDimensions.shaftSquare} mm`,
      },
    ],
    scadSource: spoolScadSource,
    scadUrl: spoolScadUrl,
  },
  {
    id: 'shaft',
    name: 'Square-to-round shaft',
    summary:
      'A 30 mm square drive section transitions to 30 mm round rods on both sides so the spool can key to the center and spin in the housing.',
    assumptions: [
      'The square section is centered so the spool sits evenly between the round bearing journals.',
      'Round shaft ends use a 6 mm radius so the housing hole can clear them with a small print-friendly allowance.',
    ],
    dimensions: [
      {
        label: 'Square section',
        value: `${shaftDimensions.squareWidth} × ${shaftDimensions.squareWidth} × ${shaftDimensions.squareLength} mm`,
      },
      {
        label: 'Round journals',
        value: `⌀${shaftDimensions.roundRadius * 2} × ${shaftDimensions.roundLength} mm each`,
      },
      {
        label: 'Overall length',
        value: `${shaftDimensions.squareLength + shaftDimensions.roundLength * 2} mm`,
      },
    ],
    scadSource: shaftScadSource,
    scadUrl: shaftScadUrl,
  },
  {
    id: 'housing',
    name: 'Pulley housing',
    summary:
      'A two-cheek housing with a top hook eye, shaft clearance holes, and two M4 mounting holes per cheek spaced 56 mm apart.',
    assumptions: [
      'The cheek spacing provides 1 mm of side clearance around the 38 mm-wide spool assembly.',
      'Each cheek is drilled in the order M4 hole, shaft hole, M4 hole so the shaft passes between the two bolt holes.',
    ],
    dimensions: [
      { label: 'Inner cheek gap', value: `${housingDimensions.innerGap} mm` },
      {
        label: 'Shaft clearance',
        value: `⌀${(housingDimensions.shaftClearanceRadius * 2).toFixed(1)} mm`,
      },
      {
        label: 'M4 hole spacing',
        value: `${housingDimensions.boltHoleSpacing} mm center to center`,
      },
      {
        label: 'Upper M4 hole center',
        value: `${housingDimensions.upperBoltY} mm from shaft centerline`,
      },
      {
        label: 'Hook eye',
        value: `⌀${housingDimensions.eyeInnerRadius * 2} mm opening`,
      },
      {
        label: 'Cheek bolts',
        value: `⌀${(housingDimensions.boltHoleRadius * 2).toFixed(1)} mm clearance`,
      },
    ],
    scadSource: pulleyHousingScadSource,
    scadUrl: pulleyHousingScadUrl,
  },
  {
    id: 'assembly',
    name: 'Full assembly',
    summary:
      'The spool, shaft, and pulley housing fitted together, with each part colored separately for a final fit check.',
    assumptions: [
      'The spool stays centered on the square section while the round shaft ends pass through the cheek clearance holes.',
      'The housing view reuses the same cheek layout, so the shaft sits between the two M4 holes on each side.',
    ],
    dimensions: [
      {
        label: 'Assembly width',
        value: `${housingDimensions.innerGap + housingDimensions.cheekThickness * 2} mm overall`,
      },
      {
        label: 'Spool fit gap',
        value: `${housingDimensions.innerGap - (spoolDimensions.barrelLength + spoolDimensions.flangeThickness * 2)} mm total side clearance`,
      },
      {
        label: 'Shaft support span',
        value: `${shaftDimensions.roundLength * 2 + shaftDimensions.squareLength} mm overall shaft length`,
      },
    ],
    scadSource: assemblyScadSource,
    scadUrl: assemblyScadUrl,
  },
]

export const defaultPartId: PartId = 'spool'

export const getBoltCenters = () => [housingDimensions.upperBoltY, lowerBoltY]
