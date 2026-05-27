import type { ReactNode } from 'react'
import { GEO } from '../data/house'
import type { SurfaceId } from '../data/finishes'
import { SurfaceMaterial, useSurfaceHandlers } from './surface'

// Finish-surfaced box helper.
function B({
  surface, args, position, rotation, children,
}: {
  surface: SurfaceId
  args: [number, number, number]
  position: [number, number, number]
  rotation?: [number, number, number]
  children?: ReactNode
}) {
  const h = useSurfaceHandlers(surface)
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow {...h}>
      <boxGeometry args={args} />
      <SurfaceMaterial surface={surface} />
      {children}
    </mesh>
  )
}

// Plain (non-selectable) box.
function P({
  args, position, rotation, color, roughness = 0.8, metalness = 0,
}: {
  args: [number, number, number]
  position: [number, number, number]
  rotation?: [number, number, number]
  color: string
  roughness?: number
  metalness?: number
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}

function GlassBalustrade({ cx, cz, w, alongZ = false }: { cx: number; cz: number; w: number; alongZ?: boolean }) {
  const railH = useSurfaceHandlers('balustrade')
  const args: [number, number, number] = alongZ ? [0.012, 1.0, w] : [w, 1.0, 0.012]
  const railArgs: [number, number, number] = alongZ ? [0.05, 0.05, w] : [w, 0.05, 0.05]
  return (
    <group>
      <mesh position={[cx, 0.5, cz]} {...useSurfaceHandlers('glazing')}>
        <boxGeometry args={args} />
        <SurfaceMaterial surface="glazing" />
      </mesh>
      <mesh position={[cx, 1.02, cz]} {...railH}>
        <boxGeometry args={railArgs} />
        <SurfaceMaterial surface="balustrade" />
      </mesh>
    </group>
  )
}

export function Features() {
  const FF_Y = GEO.FF_Y
  const GF_Y = GEO.GF_Y

  // Alfresco footprint (SW of lower floor)
  const alfCx = (GEO.LF_W + GEO.ALF_EAST) / 2
  const alfCz = (GEO.LF_S + GEO.ALF_NORTH) / 2

  // Front balcony (north, FF) — east portion
  const fbW = 4.1
  const fbX = GEO.FF_E - fbW / 2
  const fbZ = GEO.FF_N + 0.8

  // Rear balcony (south, FF)
  const rbW = 5.5
  const rbZ = GEO.FF_S - 1.45

  return (
    <group>
      {/* ── Front balcony ── */}
      <P args={[fbW, 0.15, 1.6]} position={[fbX, FF_Y - 0.075, fbZ]} color="#b3ac9f" roughness={0.9} />
      <group position={[0, FF_Y, 0]}>
        <GlassBalustrade cx={fbX} cz={fbZ + 0.8} w={fbW} />
        <GlassBalustrade cx={fbX + fbW / 2} cz={fbZ} w={1.6} alongZ />
      </group>
      {/* Timber posts at balcony edge */}
      <B surface="posts" args={[0.18, 2.6, 0.065]} position={[fbX - fbW / 2 + 0.2, FF_Y + 1.3, fbZ + 0.7]} />
      <B surface="posts" args={[0.18, 2.6, 0.065]} position={[fbX + fbW / 2 - 0.2, FF_Y + 1.3, fbZ + 0.7]} />

      {/* Privacy screen — west portion of FF north face (Monument slats) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <B
          key={i}
          surface="privacyScreen"
          args={[3.0, 0.04, 0.05]}
          position={[GEO.FF_W + 1.7, FF_Y + 0.2 + i * 0.12, GEO.FF_N + 0.12]}
        />
      ))}

      {/* ── Rear balcony ── */}
      <P args={[rbW, 0.15, 2.9]} position={[0, FF_Y - 0.075, rbZ]} color="#b3ac9f" roughness={0.9} />
      <group position={[0, FF_Y, 0]}>
        <GlassBalustrade cx={0} cz={rbZ - 1.45} w={rbW} />
        <GlassBalustrade cx={-rbW / 2} cz={rbZ} w={2.9} alongZ />
        <GlassBalustrade cx={rbW / 2} cz={rbZ} w={2.9} alongZ />
      </group>

      {/* ── Vergola over the alfresco ── */}
      <B surface="vergola" args={[GEO.ALF_W, 0.12, GEO.ALF_D]} position={[alfCx, 3.1, alfCz]} />
      {Array.from({ length: 12 }).map((_, i) => (
        <B
          key={i}
          surface="vergola"
          args={[GEO.ALF_W - 0.2, 0.02, 0.18]}
          position={[alfCx, 3.18, GEO.LF_S + 0.3 + i * ((GEO.ALF_D - 0.6) / 11)]}
          rotation={[(15 * Math.PI) / 180, 0, 0]}
        />
      ))}
      {/* Vergola posts */}
      {[GEO.LF_W + 0.15, GEO.ALF_EAST - 0.15].map((x) =>
        [GEO.LF_S + 0.15, GEO.ALF_NORTH - 0.15].map((z) => (
          <B key={`${x}-${z}`} surface="posts" args={[0.1, 3.1, 0.1]} position={[x, 1.55, z]} />
        )),
      )}

      {/* ── Porch at the west entry ── */}
      <P args={[1.6, 0.15, 3.0]} position={[GEO.GF_W - 0.85, GF_Y - 0.075, 2.0]} color="#b3ac9f" roughness={0.9} />
      {[0.6, 2.0, 3.4].map((z) => (
        <B key={z} surface="posts" args={[0.065, 2.75, 0.18]} position={[GEO.GF_W - 1.5, GF_Y + 1.375, z]} />
      ))}
      <B surface="roof" args={[1.9, 0.1, 3.4]} position={[GEO.GF_W - 0.9, GF_Y + 2.75, 2.0]} />

      {/* ── External stairs (south, west end) GF down to LF ── */}
      <ExternalStairs />

      {/* ── Venetian blind on W20 (west, FF guest) ── */}
      <B surface="privacyScreen" args={[0.05, 2.0, 3.2]} position={[GEO.FF_W - 0.12, FF_Y + 1.3, GEO.FF_CZ - 1.0]} />

      {/* ── Downpipes (Grey Pebble) at corners, tied to eaves render ── */}
      {([
        [GEO.GF_E + 0.12, GEO.GF_S],
        [GEO.GF_E + 0.12, GEO.GF_N],
        [GEO.GF_W - 0.12, GEO.GF_N],
      ] as const).map(([x, z], i) => (
        <B key={i} surface="eaves" args={[0.09, GF_Y + 2.75, 0.09]} position={[x, (GF_Y + 2.75) / 2, z]} />
      ))}

      {/* ── Skylights on the main roof ── */}
      {[0, 1].map((i) => (
        <mesh key={i} position={[1.4 + i * 2.0, 9.55, GEO.FF_CZ + 1.0]} {...useSurfaceHandlers('glazing')}>
          <boxGeometry args={[0.72, 0.08, 0.55]} />
          <SurfaceMaterial surface="glazing" />
        </mesh>
      ))}

      {/* ── PV array on the east roof ── */}
      <group position={[0, 9.7, GEO.FF_CZ - 1.5]} rotation={[-(5 * Math.PI) / 180, 0, 0]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const r = Math.floor(i / 6)
          const c = i % 6
          return <P key={i} args={[0.98, 0.04, 1.6]} position={[GEO.FF_E - 0.8 - c * 1.05, 0.05, r * 1.75]} color="#161726" roughness={0.3} metalness={0.5} />
        })}
      </group>
    </group>
  )
}

function ExternalStairs() {
  const h = useSurfaceHandlers('stairs')
  const railH = useSurfaceHandlers('balustrade')
  const GF_Y = GEO.GF_Y
  const n = 16
  const stX = GEO.LF_W + 0.9
  const run = 4.5
  const rise = GF_Y / n
  const going = run / n
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => (
        <mesh key={i} position={[stX, GF_Y - i * rise - rise / 2, GEO.LF_S - 0.8 - i * going]} castShadow receiveShadow {...h}>
          <boxGeometry args={[1.2, rise, going + 0.02]} />
          <SurfaceMaterial surface="stairs" />
        </mesh>
      ))}
      {/* Balustrade rail */}
      <mesh
        position={[stX + 0.65, GF_Y / 2 + 0.5, GEO.LF_S - 0.8 - run / 2]}
        rotation={[-Math.atan2(GF_Y, run), 0, 0]}
        {...railH}
      >
        <boxGeometry args={[0.05, 0.05, Math.sqrt(run * run + GF_Y * GF_Y)]} />
        <SurfaceMaterial surface="balustrade" />
      </mesh>
    </group>
  )
}
