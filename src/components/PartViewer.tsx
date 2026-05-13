import { Canvas, extend, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { ExtrudeGeometry, Path, Shape } from 'three'
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { ThreeElement } from '@react-three/fiber'
import type { PartSpec, ProfileSegment } from '../parts'

extend({ OrbitControls: ThreeOrbitControls })

declare module '@react-three/fiber' {
  interface ThreeElements {
    orbitControls: ThreeElement<typeof ThreeOrbitControls>
  }
}

function positionSegments(profile: ProfileSegment[]) {
  const profileLength = profile.reduce((total, segment) => total + segment.lengthMm, 0)
  let offset = -profileLength / 2

  return profile.map((segment) => {
    const centerMm = offset + segment.lengthMm / 2
    offset += segment.lengthMm

    return { ...segment, centerMm }
  })
}

function buildOuterFlangeGeometry(spec: PartSpec, thicknessMm: number) {
  const shape = new Shape()
  const outerRadius = spec.outerDiameterMm / 2
  const holeRadius = spec.flangeHoles.holeDiameterMm / 2

  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)

  for (const direction of [-1, 1]) {
    const hole = new Path()
    hole.absellipse(
      direction * spec.flangeHoles.radialOffsetMm,
      0,
      holeRadius,
      holeRadius,
      0,
      Math.PI * 2,
      false,
      0,
    )
    shape.holes.push(hole)
  }

  const geometry = new ExtrudeGeometry(shape, {
    depth: thicknessMm,
    bevelEnabled: false,
    curveSegments: 64,
  })

  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, -thicknessMm / 2, 0)

  return geometry
}

function IntegratedSheavePlateMesh({ spec }: { spec: PartSpec }) {
  const segments = useMemo(() => positionSegments(spec.profile), [spec.profile])
  const outerFlanges = segments.filter((segment) => segment.label === 'Outer flange')
  const bodySegments = segments.filter((segment) => segment.label !== 'Outer flange')
  const flangeGeometry = useMemo(
    () => buildOuterFlangeGeometry(spec, outerFlanges[0]?.lengthMm ?? 4),
    [outerFlanges, spec],
  )

  return (
    <group rotation={[0.45, 0.65, 0]}>
      {bodySegments.map((segment) => (
        <mesh key={`${segment.label}-${segment.centerMm}`} position={[0, segment.centerMm, 0]}>
          <cylinderGeometry
            args={[segment.diameterMm / 2, segment.diameterMm / 2, segment.lengthMm, 96]}
          />
          <meshStandardMaterial color="#d6dde7" metalness={0.04} roughness={0.48} />
        </mesh>
      ))}
      {outerFlanges.map((segment, index) => (
        <mesh key={`outer-flange-${index}`} geometry={flangeGeometry} position={[0, segment.centerMm, 0]}>
          <meshStandardMaterial color="#dce3ec" metalness={0.04} roughness={0.44} />
        </mesh>
      ))}
    </group>
  )
}

function CameraControls() {
  const controls = useRef<ThreeOrbitControls>(null)
  const { camera, gl } = useThree()

  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enablePan
      minDistance={10}
      maxDistance={220}
      maxPolarAngle={Math.PI}
    />
  )
}

export function PartViewer({ spec }: { spec: PartSpec }) {
  return (
    <div className="viewer-shell">
      <Canvas camera={{ position: [52, 24, 52], fov: 34 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#0b1220']} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[24, 26, 20]} intensity={1.4} />
        <directionalLight position={[-16, -10, -22]} intensity={0.45} />
        <IntegratedSheavePlateMesh spec={spec} />
        <CameraControls />
      </Canvas>
    </div>
  )
}
