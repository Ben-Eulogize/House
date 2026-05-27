import { useMemo } from 'react'
import * as THREE from 'three'
import { HOUSE } from '../data/house'
import type { Opening, WallSeg, Facade } from '../data/types'
import { SurfaceMaterial, useSurfaceHandlers } from './surface'

const FACADE_ROT: Record<Facade, number> = {
  N: 0,
  S: Math.PI,
  E: Math.PI / 2,
  W: -Math.PI / 2,
}

function wallGeometry(length: number, height: number, thickness: number, holes: Opening[]) {
  const hl = length / 2
  const shape = new THREE.Shape()
  shape.moveTo(-hl, 0)
  shape.lineTo(hl, 0)
  shape.lineTo(hl, height)
  shape.lineTo(-hl, height)
  shape.closePath()

  for (const o of holes) {
    const w = Math.min(o.width, length - 0.2)
    const x = THREE.MathUtils.clamp(o.offset, -hl + w / 2 + 0.05, hl - w / 2 - 0.05)
    const y0 = THREE.MathUtils.clamp(o.sill, 0.05, height - 0.2)
    const y1 = Math.min(y0 + o.height, height - 0.05)
    const p = new THREE.Path()
    p.moveTo(x - w / 2, y0)
    p.lineTo(x + w / 2, y0)
    p.lineTo(x + w / 2, y1)
    p.lineTo(x - w / 2, y1)
    p.closePath()
    shape.holes.push(p)
  }

  const geom = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false })
  geom.translate(0, 0, -thickness / 2)
  geom.computeVertexNormals()
  return geom
}

function OpeningUnit({ o, thickness }: { o: Opening; thickness: number }) {
  const frameH = useSurfaceHandlers('windowFrames')
  const glassH = useSurfaceHandlers('glazing')
  const garageH = useSurfaceHandlers('garageDoor')
  const entryH = useSurfaceHandlers('entryDoor')

  const w = o.width
  const h = o.height
  const zOut = thickness / 2 + 0.01
  const cy = o.sill + h / 2

  // Solid doors
  if (o.id === 'D4') {
    return (
      <mesh position={[o.offset, cy, zOut]} castShadow {...garageH}>
        <boxGeometry args={[w, h, 0.1]} />
        <SurfaceMaterial surface="garageDoor" />
      </mesh>
    )
  }
  if (o.id === 'D5' || o.id === 'D1') {
    return (
      <mesh position={[o.offset, cy, zOut]} castShadow {...entryH}>
        <boxGeometry args={[w, h, 0.08]} />
        <SurfaceMaterial surface="entryDoor" />
      </mesh>
    )
  }

  // Glazed unit: frame ring + glass pane
  const t = 0.06
  return (
    <group position={[o.offset, cy, zOut]}>
      <mesh position={[-(w / 2 - 0.03), 0, 0]} {...frameH}>
        <boxGeometry args={[t, h, 0.09]} />
        <SurfaceMaterial surface="windowFrames" />
      </mesh>
      <mesh position={[w / 2 - 0.03, 0, 0]} {...frameH}>
        <boxGeometry args={[t, h, 0.09]} />
        <SurfaceMaterial surface="windowFrames" />
      </mesh>
      <mesh position={[0, h / 2 - 0.03, 0]} {...frameH}>
        <boxGeometry args={[w, t, 0.09]} />
        <SurfaceMaterial surface="windowFrames" />
      </mesh>
      <mesh position={[0, -(h / 2 - 0.03), 0]} {...frameH}>
        <boxGeometry args={[w, t, 0.09]} />
        <SurfaceMaterial surface="windowFrames" />
      </mesh>
      <mesh {...glassH}>
        <boxGeometry args={[w - 0.1, h - 0.1, 0.03]} />
        <SurfaceMaterial surface="glazing" />
      </mesh>
    </group>
  )
}

function Wall({ wall }: { wall: WallSeg }) {
  const level = HOUSE.levels.find((l) => l.id === wall.level)!
  const isPrimary = !wall.id.includes('alf')
  const holes = useMemo(
    () =>
      isPrimary
        ? HOUSE.openings.filter((o) => o.level === wall.level && o.facade === wall.facade)
        : [],
    [wall.level, wall.facade, isPrimary],
  )
  const geom = useMemo(
    () => wallGeometry(wall.length, level.height, level.wallThickness, holes),
    [wall.length, level.height, level.wallThickness, holes],
  )
  const handlers = useSurfaceHandlers(wall.surface as never)

  return (
    <group position={[wall.cx, level.baseY, wall.cz]} rotation={[0, FACADE_ROT[wall.facade], 0]}>
      <mesh geometry={geom} castShadow receiveShadow {...handlers}>
        <SurfaceMaterial surface={wall.surface as never} />
      </mesh>
      {holes.map((o) => (
        <OpeningUnit key={o.id} o={o} thickness={level.wallThickness} />
      ))}
    </group>
  )
}

export function Walls() {
  return (
    <group>
      {HOUSE.walls.map((w) => (
        <Wall key={w.id} wall={w} />
      ))}
    </group>
  )
}
