import { GEO } from '../data/house'

// Floor slabs. Neutral concrete — not a finish-selectable surface.
export function Slabs() {
  const slab = (xMin: number, xMax: number, zMin: number, zMax: number, y: number) => (
    <mesh position={[(xMin + xMax) / 2, y - 0.1, (zMin + zMax) / 2]} receiveShadow castShadow>
      <boxGeometry args={[xMax - xMin, 0.2, zMax - zMin]} />
      <meshStandardMaterial color="#b3ac9f" roughness={0.95} />
    </mesh>
  )
  return (
    <group>
      {slab(GEO.LF_W, GEO.LF_E, GEO.LF_S, GEO.LF_N, GEO.LF_Y)}
      {slab(GEO.GF_W, GEO.GF_E, GEO.GF_S, GEO.GF_N, GEO.GF_Y)}
      {slab(GEO.FF_W, GEO.FF_E, GEO.FF_S, GEO.FF_N, GEO.FF_Y)}
    </group>
  )
}
