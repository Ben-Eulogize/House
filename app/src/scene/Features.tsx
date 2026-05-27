import { GEO } from '../data/house'
import type { SurfaceId } from '../data/finishes'
import { SurfaceMaterial, useSurfaceHandlers } from './surface'

function B({ surface, args, position, rotation }:
  { surface: SurfaceId; args: [number, number, number]; position: [number, number, number]; rotation?: [number, number, number] }) {
  const h = useSurfaceHandlers(surface)
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow {...h}>
      <boxGeometry args={args} />
      <SurfaceMaterial surface={surface} />
    </mesh>
  )
}

function P({ args, position, color, roughness = 0.85, metalness = 0 }:
  { args: [number, number, number]; position: [number, number, number]; color: string; roughness?: number; metalness?: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}

// glass + rail panel. axis 'x' runs E-W, 'z' runs N-S.
function Balustrade({ cx, cz, len, axis, baseY }: { cx: number; cz: number; len: number; axis: 'x' | 'z'; baseY: number }) {
  const railH = useSurfaceHandlers('balustrade')
  const glassH = useSurfaceHandlers('glazing')
  const glass: [number, number, number] = axis === 'x' ? [len, 1.0, 0.015] : [0.015, 1.0, len]
  const rail: [number, number, number] = axis === 'x' ? [len, 0.05, 0.05] : [0.05, 0.05, len]
  return (
    <group>
      <mesh position={[cx, baseY + 0.5, cz]} {...glassH}>
        <boxGeometry args={glass} />
        <SurfaceMaterial surface="glazing" />
      </mesh>
      <mesh position={[cx, baseY + 1.02, cz]} {...railH}>
        <boxGeometry args={rail} />
        <SurfaceMaterial surface="balustrade" />
      </mesh>
    </group>
  )
}

export function Features() {
  const alfCx = (GEO.ALF_WEST + GEO.LF_E) / 2
  const alfCz = (GEO.ALF_SOUTH + GEO.LF_N) / 2

  // East (rear) balcony over the GF roof, accessed from the rumpus (D6)
  const ebX0 = GEO.FF_E, ebX1 = GEO.GF_E + 1.0
  const ebZ0 = -3.0, ebZ1 = 3.0
  const ebCx = (ebX0 + ebX1) / 2

  return (
    <group>
      {/* ── Alfresco vergola (NE) ── */}
      <B surface="vergola" args={[GEO.ALF_W, 0.12, GEO.ALF_D]} position={[alfCx, 3.1, alfCz]} />
      {Array.from({ length: 11 }).map((_, i) => (
        <B key={i} surface="vergola" args={[GEO.ALF_W - 0.2, 0.02, 0.18]}
          position={[alfCx, 3.18, GEO.ALF_SOUTH + 0.4 + i * ((GEO.ALF_D - 0.8) / 10)]}
          rotation={[(15 * Math.PI) / 180, 0, 0]} />
      ))}
      {[GEO.ALF_WEST + 0.15, GEO.LF_E - 0.15].map((x) =>
        [GEO.ALF_SOUTH + 0.15, GEO.LF_N - 0.15].map((z) => (
          <B key={`${x}-${z}`} surface="posts" args={[0.1, 3.1, 0.1]} position={[x, 1.55, z]} />
        )),
      )}

      {/* ── East (rear) balcony, FF ── */}
      <P args={[ebX1 - ebX0, 0.15, ebZ1 - ebZ0]} position={[ebCx, GEO.FF_Y - 0.075, (ebZ0 + ebZ1) / 2]} color="#b3ac9f" roughness={0.9} />
      <Balustrade cx={ebX1} cz={(ebZ0 + ebZ1) / 2} len={ebZ1 - ebZ0} axis="z" baseY={GEO.FF_Y} />
      <Balustrade cx={ebCx} cz={ebZ1} len={ebX1 - ebX0} axis="x" baseY={GEO.FF_Y} />
      <Balustrade cx={ebCx} cz={ebZ0} len={ebX1 - ebX0} axis="x" baseY={GEO.FF_Y} />
      {/* Privacy screens flanking the balcony (Monument slats) */}
      {[ebZ1, ebZ0].map((z) =>
        Array.from({ length: 16 }).map((_, i) => (
          <B key={`${z}-${i}`} surface="privacyScreen" args={[ebX1 - ebX0 - 0.2, 0.04, 0.05]}
            position={[ebCx, GEO.FF_Y + 1.2 + i * 0.11, z]} />
        )),
      )}

      {/* ── Front balcony (north, FF) ── */}
      <P args={[3.2, 0.15, 1.5]} position={[6.0, GEO.FF_Y - 0.075, GEO.FF_N + 0.75]} color="#b3ac9f" roughness={0.9} />
      <Balustrade cx={6.0} cz={GEO.FF_N + 1.5} len={3.2} axis="x" baseY={GEO.FF_Y} />
      <B surface="posts" args={[0.18, 2.6, 0.065]} position={[4.5, GEO.FF_Y + 1.3, GEO.FF_N + 1.4]} />
      <B surface="posts" args={[0.18, 2.6, 0.065]} position={[7.5, GEO.FF_Y + 1.3, GEO.FF_N + 1.4]} />

      {/* ── Porch at the SW entry (west face, south end) ── */}
      <P args={[1.5, 0.15, 3.0]} position={[GEO.GF_W - 0.85, GEO.GF_Y - 0.075, -3.5]} color="#b3ac9f" roughness={0.9} />
      {[-4.7, -3.5, -2.3].map((z) => (
        <B key={z} surface="posts" args={[0.18, 2.75, 0.065]} position={[GEO.GF_W - 1.45, GEO.GF_Y + 1.375, z]} />
      ))}
      <B surface="roof" args={[1.8, 0.1, 3.4]} position={[GEO.GF_W - 0.9, GEO.GF_Y + 2.75, -3.5]} />

      {/* ── External stairs on the south (GF down to garden) ── */}
      <ExternalStairs />

      {/* ── Venetian blind over W20 (FF west, guest) ── */}
      <B surface="privacyScreen" args={[0.05, 2.0, 3.3]} position={[GEO.FF_W - 0.12, GEO.FF_Y + 1.3, 0]} />

      {/* ── Downpipes (Grey Pebble, tied to eaves render) ── */}
      {([
        [GEO.GF_E + 0.12, GEO.GF_N], [GEO.GF_E + 0.12, GEO.GF_S], [GEO.GF_W - 0.12, GEO.GF_S],
      ] as const).map(([x, z], i) => (
        <B key={i} surface="eaves" args={[0.09, GEO.GF_CEIL, 0.09]} position={[x, GEO.GF_CEIL / 2, z]} />
      ))}

      {/* ── Skylights on the main roof ── */}
      {[-1.2, 1.2].map((z, i) => (
        <mesh key={i} position={[3.0 + i * 1.6, 9.55, z]} {...useSurfaceHandlers('glazing')}>
          <boxGeometry args={[0.72, 0.08, 0.55]} />
          <SurfaceMaterial surface="glazing" />
        </mesh>
      ))}

      {/* ── PV array on the GF west roof ── */}
      <group position={[GEO.GF_W + 4.0, GEO.GF_CEIL + 0.16, 0]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const r = Math.floor(i / 6), c = i % 6
          return <P key={i} args={[1.0, 0.04, 0.95]} position={[r * 1.1, 0.04, -3.2 + c * 1.05]} color="#161726" roughness={0.3} metalness={0.5} />
        })}
      </group>
    </group>
  )
}

function ExternalStairs() {
  const h = useSurfaceHandlers('stairs')
  const railH = useSurfaceHandlers('balustrade')
  // Runs along the south wall (in X), descending GF -> ground, hugging the face.
  const n = 13
  const run = 4.4
  const rise = GEO.GF_Y / n
  const going = run / n
  const x0 = 3.0
  const z = GEO.GF_S - 0.85
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => (
        <mesh key={i} position={[x0 + i * going, GEO.GF_Y - i * rise - rise / 2, z]} castShadow receiveShadow {...h}>
          <boxGeometry args={[going + 0.02, rise, 1.5]} />
          <SurfaceMaterial surface="stairs" />
        </mesh>
      ))}
      <mesh position={[x0 + run / 2, GEO.GF_Y / 2 + 0.5, z - 0.7]} rotation={[0, 0, Math.atan2(GEO.GF_Y, run)]} {...railH}>
        <boxGeometry args={[Math.sqrt(run * run + GEO.GF_Y * GEO.GF_Y), 0.05, 0.05]} />
        <SurfaceMaterial surface="balustrade" />
      </mesh>
    </group>
  )
}
