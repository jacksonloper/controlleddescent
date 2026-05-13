/**
 * Assembly fit tests.
 *
 * The guiding principle mirrors a 3-D intersection check:
 *   - intersection(A, B) should be empty   → parts do not penetrate each other
 *   - intersection(dilate(A), B) non-empty → parts are adjacent (touching / just-fit)
 *
 * Rather than running full CSG intersection, we verify the equivalent dimensional
 * constraints that guarantee those conditions hold for each mating surface.
 */
import { describe, it, expect } from 'vitest'
import { housingDimensions, shaftDimensions, spoolDimensions } from '../data/parts'

// Derived geometry values used across multiple tests
const spoolFlangeTipX =
  (spoolDimensions.barrelLength + spoolDimensions.flangeThickness) / 2 + // = 17 mm
  spoolDimensions.flangeThickness / 2 // + 2 mm half-flange = 19 mm total from centre

const bridgeBottomY =
  housingDimensions.topBridgeY - housingDimensions.topBridgeHeight / 2

describe('assembly fit', () => {
  // ── shaft journals ↔ cheek clearance holes ────────────────────────────────

  describe('shaft journals ↔ housing cheek holes', () => {
    it('shaft round radius is smaller than cheek clearance hole — no penetration', () => {
      // intersection(shaft_journal, cheek_solid) = ∅  iff  r_shaft < r_hole
      expect(shaftDimensions.roundRadius).toBeLessThan(
        housingDimensions.shaftClearanceRadius,
      )
    })

    it('radial clearance is positive but a 1.5× scaled journal would exceed the hole — parts are adjacent', () => {
      const clearance =
        housingDimensions.shaftClearanceRadius - shaftDimensions.roundRadius
      // clearance > 0 ↔ no penetration
      expect(clearance).toBeGreaterThan(0)
      // r_shaft × 1.5 > r_hole ↔ dilated shaft penetrates housing → they are adjacent
      expect(shaftDimensions.roundRadius * 1.5).toBeGreaterThan(
        housingDimensions.shaftClearanceRadius,
      )
    })
  })

  // ── spool flanges ↔ housing inner gap (X axis) ────────────────────────────

  describe('spool flanges ↔ housing inner gap', () => {
    it('spool flange tip stays within the inner gap — no penetration', () => {
      // intersection(spool, cheek_solid) = ∅  iff  flangeTip < innerGap/2
      expect(spoolFlangeTipX).toBeLessThan(housingDimensions.innerGap / 2)
    })

    it('side clearance is positive but under 2 mm — spool is snug in the gap', () => {
      const clearance = housingDimensions.innerGap / 2 - spoolFlangeTipX
      // clearance > 0 ↔ no penetration
      expect(clearance).toBeGreaterThan(0)
      // clearance < 2 ↔ dilated spool (dilated > 1 mm per side) would touch the cheek
      expect(clearance).toBeLessThan(2)
    })
  })

  // ── spool flanges ↔ housing bridge (Y axis) ───────────────────────────────

  describe('spool flanges ↔ housing bridge', () => {
    it('spool flange radius is below the bridge bottom — no penetration', () => {
      // At z=0 the flange reaches its maximum Y of flangeRadius.
      // intersection(spool_flange, bridge_solid) = ∅  iff  flangeRadius < bridgeBottomY
      expect(spoolDimensions.flangeRadius).toBeLessThan(bridgeBottomY)
    })

    it('bridge bottom is within 10 mm above spool flange top — bridge is close but clear', () => {
      const gap = bridgeBottomY - spoolDimensions.flangeRadius
      // gap > 0 ↔ no penetration
      expect(gap).toBeGreaterThan(0)
      // gap < 10 ↔ a ~10 mm dilation of the spool would reach the bridge
      expect(gap).toBeLessThan(10)
    })
  })

  // ── shaft square section ↔ spool bore ─────────────────────────────────────

  describe('shaft square section ↔ spool square bore', () => {
    it('shaft square width fits inside the spool square bore — key fit', () => {
      // The square section must be no wider than the bore opening.
      expect(shaftDimensions.squareWidth).toBeLessThanOrEqual(
        spoolDimensions.shaftSquare,
      )
    })
  })

  // ── shaft journals span the housing cheeks (X axis) ───────────────────────

  describe('shaft journal span ↔ cheek positions', () => {
    it('shaft journals reach beyond the outer cheek faces', () => {
      const cheekOuterX =
        housingDimensions.innerGap / 2 + housingDimensions.cheekThickness
      const journalOuterX =
        (shaftDimensions.squareLength + shaftDimensions.roundLength) / 2 +
        shaftDimensions.roundLength / 2
      // The journal must extend past the outer cheek face so it is supported.
      expect(journalOuterX).toBeGreaterThan(cheekOuterX)
    })
  })
})
