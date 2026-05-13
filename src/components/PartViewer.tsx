import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { ExtrudeGeometry, LatheGeometry, Shape, Vector2 } from 'three'
import type { Group } from 'three'
import type { PartSpec } from '../parts'

function buildProfile(spec: PartSpec) {
  let offset = 0
  const points = [new Vector2(0, 0)]

  spec.profile.forEach((segment) => {
    const radius = segment.diameterMm / 2
    points.push(new Vector2(radius, offset))
    offset += segment.lengthMm
    points.push(new Vector2(radius, offset))
  })

  points.push(new Vector2(0, offset))

  return { points, totalLength: offset }
}

function grooveCenters(spec: PartSpec, totalLength: number) {
  let offset = 0
  const centers: number[] = []

  spec.profile.forEach((segment) => {
    if (segment.label === 'Rope groove') {
      centers.push(offset + segment.lengthMm / 2 - totalLength / 2)
    }

    offset += segment.lengthMm
  })

  return centers
}

function IntegratedSheavePlateMesh({ spec }: { spec: PartSpec }) {
  const group = useRef<Group>(null)
  const { points, totalLength } = useMemo(() => buildProfile(spec), [spec])
  const bodyGeometry = useMemo(() => {
    const geometry = new LatheGeometry(points, 96)
    geometry.translate(0, -totalLength / 2, 0)
    return geometry
  }, [points, totalLength])

  const plateGeometry = useMemo(() => {
    const shape = new Shape()
    const halfWidth = spec.plate.widthMm / 2
    const halfHeight = spec.plate.heightMm / 2
    const holeRadius = spec.plate.holeDiameterMm / 2
    const holeOffset = spec.plate.holeSpacingMm / 2

    shape.moveTo(-halfWidth, -halfHeight)
    shape.lineTo(halfWidth, -halfHeight)
    shape.lineTo(halfWidth, halfHeight)
    shape.lineTo(-halfWidth, halfHeight)
    shape.closePath()

    const leftHole = new Shape()
    leftHole.absellipse(-holeOffset, 0, holeRadius, holeRadius, 0, Math.PI * 2, false, 0)
    const rightHole = new Shape()
    rightHole.absellipse(holeOffset, 0, holeRadius, holeRadius, 0, Math.PI * 2, false, 0)

    shape.holes.push(leftHole, rightHole)

    const geometry = new ExtrudeGeometry(shape, {
      depth: spec.plate.thicknessMm,
      bevelEnabled: false,
      curveSegments: 48,
    })

    geometry.rotateX(-Math.PI / 2)
    geometry.translate(0, totalLength / 2, 0)

    return geometry
  }, [spec, totalLength])

  const grooves = useMemo(() => grooveCenters(spec, totalLength), [spec, totalLength])

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.45
    }
  })

  return (
    <group ref={group} rotation={[0.55, 0.75, 0]}>
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#d8dee9" metalness={0.18} roughness={0.38} />
      </mesh>
      <mesh geometry={plateGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#bfced9" metalness={0.08} roughness={0.52} />
      </mesh>
      {grooves.map((position) => (
        <mesh key={position} position={[0, position, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.4, 0.5, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.55} metalness={0.02} />
        </mesh>
      ))}
      <mesh position={[0, -totalLength / 2 - 7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[28, 64]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

export function PartViewer({ spec }: { spec: PartSpec }) {
  return (
    <div className="viewer-shell">
      <Canvas camera={{ position: [28, 18, 28], fov: 38 }} shadows dpr={[1, 1.5]}>
        <color attach="background" args={['#0b1220']} />
        <ambientLight intensity={0.8} />
        <directionalLight
          castShadow
          position={[24, 28, 18]}
          intensity={1.4}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-18, 10, -18]} intensity={0.35} />
        <IntegratedSheavePlateMesh spec={spec} />
        <OrbitControls enablePan={false} minDistance={24} maxDistance={70} />
      </Canvas>
    </div>
  )
}
