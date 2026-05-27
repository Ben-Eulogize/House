import { GEO } from '../data/house'

// Floor slabs. Neutral concrete — not a finish-selectable surface.
export function Slabs() {
  const slab = (w: number, d: number, cx: number, cz: number, y: number) => (
    <mesh position={[cx, y - 0.1, cz]} receiveShadow castShadow>
      <boxGeometry args={[w, 0.2, d]} />
      <meshStandardMaterial color="#b3ac9f" roughness={0.95} />
    </mesh>
  )
  return (
    <group>
      {slab(12.01, 18.71, 0, 0, GEO.LF_Y)}
      {slab(12.01, 21.02, 0, GEO.GF_CZ, GEO.GF_Y)}
      {slab(8.26, 11.37, 0, GEO.FF_CZ, GEO.FF_Y)}
    </group>
  )
}
