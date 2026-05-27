import { HOUSE, GEO } from '../data/house'
import { SurfaceMaterial, useSurfaceHandlers } from './surface'

const FF_CEIL = GEO.FF_Y + 2.6 // 9.25
const GF_CEIL = GEO.GF_Y + 2.75 // 6.2

function RoofPlane({
  w, d, cx, cz, y, thickness, pitchDeg,
}: { w: number; d: number; cx: number; cz: number; y: number; thickness: number; pitchDeg: number }) {
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

  const mainNorth = GEO.FF_N + 1.8 // canopy edge
  const parH = 0.85

  return (
    <group>
      {HOUSE.roofs.map((r) => (
        <RoofPlane key={r.id} {...r} />
      ))}

      {/* West parapet — body (cladding) + Surfmist capping */}
      <mesh position={[GEO.GF_W, FF_CEIL + parH / 2, GEO.GF_CZ]} castShadow receiveShadow {...cladH}>
        <boxGeometry args={[0.27, parH, 21.42]} />
        <SurfaceMaterial surface="wallWest" />
      </mesh>
      <mesh position={[GEO.GF_W, FF_CEIL + parH + 0.03, GEO.GF_CZ]} castShadow {...capH}>
        <boxGeometry args={[0.36, 0.07, 21.5]} />
        <SurfaceMaterial surface="parapetCap" />
      </mesh>

      {/* Prominent north canopy fascia (Monument) */}
      <mesh position={[0, FF_CEIL + 0.18, mainNorth]} castShadow {...fasciaH}>
        <boxGeometry args={[9.46, 0.42, 0.14]} />
        <SurfaceMaterial surface="fascia" />
      </mesh>
      {/* Soffit under the canopy (eaves lining) */}
      <mesh position={[0, FF_CEIL - 0.02, (GEO.FF_N + mainNorth) / 2]} {...eavesH}>
        <boxGeometry args={[9.26, 0.04, 1.8]} />
        <SurfaceMaterial surface="eaves" />
      </mesh>
      {/* East & south roof edge fascia */}
      <mesh position={[GEO.FF_E + 0.5, FF_CEIL + 0.12, GEO.FF_CZ]} castShadow {...fasciaH}>
        <boxGeometry args={[0.12, 0.28, 13.0]} />
        <SurfaceMaterial surface="fascia" />
      </mesh>
      <mesh position={[GEO.FF_W - 0.5, FF_CEIL + 0.12, GEO.FF_CZ]} castShadow {...fasciaH}>
        <boxGeometry args={[0.12, 0.28, 13.0]} />
        <SurfaceMaterial surface="fascia" />
      </mesh>

      {/* Gutters (Monument) along GF roof edges, tied to fascia surface */}
      <mesh position={[0, GF_CEIL - 0.03, GEO.GF_S - 0.18]} {...fasciaH}>
        <boxGeometry args={[12.4, 0.12, 0.12]} />
        <SurfaceMaterial surface="fascia" />
      </mesh>
    </group>
  )
}
