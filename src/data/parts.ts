import pulleyHousingScadSource from '../assets/scad/pulley-housing.scad?raw'
import pulleyHousingScadUrl from '../assets/scad/pulley-housing.scad?url'
import shaftScadSource from '../assets/scad/shaft.scad?raw'
import shaftScadUrl from '../assets/scad/shaft.scad?url'
import spoolScadSource from '../assets/scad/spool.scad?raw'
import spoolScadUrl from '../assets/scad/spool.scad?url'

export type PartId = 'spool' | 'shaft' | 'housing'

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
  upperBoltY: -42,
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
      'The upper M4 mounting hole starts 42 mm below the shaft center so fasteners stay clear of the 30 mm spool flanges.',
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
        label: 'Hook eye',
        value: `⌀${housingDimensions.eyeInnerRadius * 2} mm opening`,
      },
      {
        label: 'Cheek bolts',
        value: `${housingDimensions.boltHoleRadius * 2} mm clearance radius`,
      },
    ],
    scadSource: pulleyHousingScadSource,
    scadUrl: pulleyHousingScadUrl,
  },
]

export const defaultPartId: PartId = 'spool'

export const getBoltCenters = () => [housingDimensions.upperBoltY, lowerBoltY]
