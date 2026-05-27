import { useMemo } from 'react'
import * as THREE from 'three'

// Ground that slopes from the high north (street, RL ~32) down to the low
// south (harbour, RL ~29). Matches the fall described on the plans.
export function Site() {
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(110, 110, 60, 60)
    g.rotateX(-Math.PI / 2)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const z = p.getZ(i)
      const base = 0.35 + (z + 9.355) * 0.145 // north high, south low
      const noise = Math.sin(x * 0.12) * 0.12 + Math.cos(z * 0.1) * 0.1
      p.setY(i, base + noise)
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geom} receiveShadow>
      <meshStandardMaterial color="#7d9468" roughness={1} />
    </mesh>
  )
}
