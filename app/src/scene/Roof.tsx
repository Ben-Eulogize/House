import { HOUSE, GEO } from '../data/house'
import { SurfaceMaterial, useSurfaceHandlers } from './surface'

const FF_CEIL = GEO.FF_CEIL
const GF_CEIL = GEO.GF_CEIL

function RoofPlane({ w, d, cx, cz, y, thickness, pitchDeg }:
  { w: number; d: number; cx: number; cz: number; y: number; thickness: number; pitchDeg: number }) {
  const h = useSurfaceHandlers('roof')
  return (
    <mesh position={[cx, y, cz]} rotation={[-(pitchDeg * Math.PI) / 180, 0, 0]} castShadow receiveShadow {...h}>
      <boxGeometry args={[w, thickness, d]} />
      <SurfaceMaterial surface="roof" />
    </mesh>
  )
}

export function Roof() {
  const fasciaH = useSurfaceHandlers('fascia')
  const capH = useSurfaceHandlers('parapetCap')
  const eavesH = useSurfaceHandlers('eaves')
  const cladH = useSurfaceHandlers('wallWest')

  const parH = 0.85
  const nsLen = GEO.GF_N - GEO.GF_S

  return (
    <group>
      {HOUSE.roofs.map((r) => (
        <RoofPlane key={r.id} {...r} />
      ))}

      {/* West (street) parapet — cladding body + Surfmist capping */}
      <mesh position={[GEO.GF_W, FF_CEIL + parH / 2, 0]} castShadow receiveShadow {...cladH}>
        <boxGeometry args={[0.27, parH, nsLen + 0.1]} />
        <SurfaceMaterial surface="wallWest" />
      </mesh>
      <mesh position={[GEO.GF_W, FF_CEIL + parH + 0.03, 0]} castShadow {...capH}>
        <boxGeometry args={[0.36, 0.07, nsLen + 0.2]} />
        <SurfaceMaterial surface="parapetCap" />
      </mesh>

      {/* Main roof fascia (Monument) — east (view) and north edges */}
      <mesh position={[GEO.FF_E + 0.45, FF_CEIL + 0.12, 0]} castShadow {...fasciaH}>
        <boxGeometry args={[0.14, 0.34, GEO.FF_N - GEO.FF_S + 0.9]} />
        <SurfaceMaterial surface="fascia" />
      </mesh>
      <mesh position={[(GEO.FF_W + GEO.FF_E) / 2, FF_CEIL + 0.12, GEO.FF_N + 0.45]} castShadow {...fasciaH}>
        <boxGeometry args={[GEO.FF_E - GEO.FF_W + 0.9, 0.34, 0.14]} />
        <SurfaceMaterial surface="fascia" />
      </mesh>

      {/* Eaves soffit under the east overhang */}
      <mesh position={[GEO.FF_E + 0.25, FF_CEIL - 0.02, 0]} {...eavesH}>
        <boxGeometry args={[0.4, 0.04, GEO.FF_N - GEO.FF_S]} />
        <SurfaceMaterial surface="eaves" />
      </mesh>

      {/* GF roof gutter along the south edge (Monument) */}
      <mesh position={[0, GF_CEIL - 0.03, GEO.GF_S - 0.16]} {...fasciaH}>
        <boxGeometry args={[GEO.GF_E - GEO.GF_W - 0.4, 0.12, 0.12]} />
        <SurfaceMaterial surface="fascia" />
      </mesh>
    </group>
  )
}
