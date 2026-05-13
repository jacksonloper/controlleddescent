import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'

import {
  type PartId,
  getBoltCenters,
  housingDimensions,
  shaftDimensions,
  spoolDimensions,
} from '../data/parts'

const defaultMaterial = new THREE.MeshStandardMaterial({
  color: '#d7d9de',
  metalness: 0.12,
  roughness: 0.4,
})

const accentMaterial = new THREE.MeshStandardMaterial({
  color: '#8fb8ff',
  metalness: 0.08,
  roughness: 0.35,
})

const helperMaterial = new THREE.MeshStandardMaterial({
  color: '#b6e3c5',
  metalness: 0.04,
  roughness: 0.55,
})

const createBoxMesh = (size: [number, number, number]) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), defaultMaterial)
  mesh.updateMatrix()
  return mesh
}

const createCylinderMesh = (radius: number, length: number) => {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 64),
    defaultMaterial,
  )
  mesh.rotation.z = Math.PI / 2
  mesh.updateMatrix()
  return mesh
}

const unionMeshes = (meshes: THREE.Mesh[]) => {
  const [firstMesh, ...restMeshes] = meshes

  if (!firstMesh) {
    throw new Error('unionMeshes requires at least one mesh; received an empty array.')
  }

  return restMeshes.reduce((combinedMesh, mesh) => CSG.union(combinedMesh, mesh), firstMesh)
}

const createSpoolGeometry = () => {
  const barrel = createCylinderMesh(
    spoolDimensions.barrelRadius,
    spoolDimensions.barrelLength,
  )

  const leftFlange = createCylinderMesh(
    spoolDimensions.flangeRadius,
    spoolDimensions.flangeThickness,
  )
  leftFlange.position.x =
    -(spoolDimensions.barrelLength + spoolDimensions.flangeThickness) / 2
  leftFlange.updateMatrix()

  const rightFlange = createCylinderMesh(
    spoolDimensions.flangeRadius,
    spoolDimensions.flangeThickness,
  )
  rightFlange.position.x =
    (spoolDimensions.barrelLength + spoolDimensions.flangeThickness) / 2
  rightFlange.updateMatrix()

  const bore = createBoxMesh([
    spoolDimensions.barrelLength + spoolDimensions.flangeThickness * 2 + 2,
    spoolDimensions.shaftSquare,
    spoolDimensions.shaftSquare,
  ])

  const spool = unionMeshes([barrel, leftFlange, rightFlange])
  const finalMesh = CSG.subtract(spool, bore)
  finalMesh.geometry.computeVertexNormals()

  return finalMesh.geometry
}

const createHousingGeometry = () => {
  const outerWidth = housingDimensions.innerGap + housingDimensions.cheekThickness * 2
  const cheekHeight = housingDimensions.topBridgeY - housingDimensions.cheekBottomY

  const leftCheek = createBoxMesh([
    housingDimensions.cheekThickness,
    cheekHeight,
    housingDimensions.cheekDepth,
  ])
  leftCheek.position.set(
    -(housingDimensions.innerGap + housingDimensions.cheekThickness) / 2,
    (housingDimensions.topBridgeY + housingDimensions.cheekBottomY) / 2,
    0,
  )
  leftCheek.updateMatrix()

  const rightCheek = createBoxMesh([
    housingDimensions.cheekThickness,
    cheekHeight,
    housingDimensions.cheekDepth,
  ])
  rightCheek.position.set(
    (housingDimensions.innerGap + housingDimensions.cheekThickness) / 2,
    (housingDimensions.topBridgeY + housingDimensions.cheekBottomY) / 2,
    0,
  )
  rightCheek.updateMatrix()

  const bridge = createBoxMesh([
    outerWidth,
    housingDimensions.topBridgeHeight,
    housingDimensions.topBridgeDepth,
  ])
  bridge.position.y = housingDimensions.topBridgeY
  bridge.updateMatrix()

  const eye = createCylinderMesh(housingDimensions.eyeOuterRadius, outerWidth)
  eye.position.y = housingDimensions.eyeCenterY
  eye.updateMatrix()

  const shaftHole = createCylinderMesh(
    housingDimensions.shaftClearanceRadius,
    housingDimensions.cheekThickness + 2,
  )
  const boltHoleLength = housingDimensions.cheekThickness + 2

  const holes: THREE.Mesh[] = []

  for (const cheekX of [leftCheek.position.x, rightCheek.position.x]) {
    const cheekShaftHole = shaftHole.clone()
    cheekShaftHole.position.set(cheekX, 0, 0)
    cheekShaftHole.updateMatrix()
    holes.push(cheekShaftHole)

    for (const boltCenterY of getBoltCenters()) {
      const boltHole = createCylinderMesh(
        housingDimensions.boltHoleRadius,
        boltHoleLength,
      )
      boltHole.position.set(cheekX, boltCenterY, 0)
      boltHole.updateMatrix()
      holes.push(boltHole)
    }
  }

  const eyeHole = createCylinderMesh(housingDimensions.eyeInnerRadius, outerWidth + 2)
  eyeHole.position.y = housingDimensions.eyeCenterY
  eyeHole.updateMatrix()
  holes.push(eyeHole)

  const housingBody = unionMeshes([leftCheek, rightCheek, bridge, eye])
  const finalMesh = holes.reduce(
    (currentMesh, hole) => CSG.subtract(currentMesh, hole),
    housingBody,
  )

  finalMesh.geometry.computeVertexNormals()
  return finalMesh.geometry
}

function SpoolModel() {
  const geometry = useMemo(() => createSpoolGeometry(), [])

  return (
    <mesh geometry={geometry} material={accentMaterial} castShadow receiveShadow />
  )
}

function ShaftModel() {
  return (
    <group>
      <mesh material={helperMaterial} castShadow receiveShadow>
        <boxGeometry
          args={[
            shaftDimensions.squareLength,
            shaftDimensions.squareWidth,
            shaftDimensions.squareWidth,
          ]}
        />
      </mesh>
      <mesh
        position={[
          -(shaftDimensions.squareLength + shaftDimensions.roundLength) / 2,
          0,
          0,
        ]}
        rotation={[0, 0, Math.PI / 2]}
        material={defaultMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            shaftDimensions.roundRadius,
            shaftDimensions.roundRadius,
            shaftDimensions.roundLength,
            64,
          ]}
        />
      </mesh>
      <mesh
        position={[
          (shaftDimensions.squareLength + shaftDimensions.roundLength) / 2,
          0,
          0,
        ]}
        rotation={[0, 0, Math.PI / 2]}
        material={defaultMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            shaftDimensions.roundRadius,
            shaftDimensions.roundRadius,
            shaftDimensions.roundLength,
            64,
          ]}
        />
      </mesh>
    </group>
  )
}

function HousingModel() {
  const geometry = useMemo(() => createHousingGeometry(), [])

  return (
    <mesh geometry={geometry} material={defaultMaterial} castShadow receiveShadow />
  )
}

function SceneContents({ activePart }: { activePart: PartId }) {
  return (
    <>
      <color attach="background" args={['#0b1020']} />
      <ambientLight intensity={1.2} />
      <directionalLight
        castShadow
        intensity={1.8}
        position={[90, 110, 60]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight intensity={0.9} position={[-70, 35, -75]} />
      <gridHelper args={[220, 22, '#2f5fbf', '#24304d']} position={[0, -70, 0]} />
      <axesHelper args={[45]} />
      <group rotation={[-0.25, 0.75, 0]}>
        {activePart === 'spool' ? <SpoolModel /> : null}
        {activePart === 'shaft' ? <ShaftModel /> : null}
        {activePart === 'housing' ? <HousingModel /> : null}
      </group>
      <OrbitControls enablePan enableZoom maxDistance={260} minDistance={40} />
    </>
  )
}

export function PartScene({ activePart }: { activePart: PartId }) {
  return (
    <div className="viewer-shell">
      <Canvas camera={{ fov: 42, position: [75, 55, 90] }} shadows>
        <SceneContents activePart={activePart} />
      </Canvas>
    </div>
  )
}
