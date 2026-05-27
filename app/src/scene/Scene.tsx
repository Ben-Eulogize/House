import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useStore, type ViewName } from '../store/useStore'
import { Walls } from './Walls'
import { Roof } from './Roof'
import { Slabs } from './Structure'
import { Features } from './Features'
import { Site } from './Site'

const VIEWS: Partial<Record<ViewName, { pos: [number, number, number]; tgt: [number, number, number] }>> = {
  NE: { pos: [24, 14, 26], tgt: [0, 4, 0] },
  NW: { pos: [-24, 14, 26], tgt: [0, 4, 0] },
  SE: { pos: [24, 13, -26], tgt: [0, 4, 0] },
  SW: { pos: [-24, 13, -26], tgt: [0, 4, 0] },
  West: { pos: [-32, 9, 2], tgt: [0, 4, 0] },
  Aerial: { pos: [10, 36, -12], tgt: [0, 3, 0] },
}

// Orthographic head-on elevation views (to overlay against the drawings).
const ELEV: Record<string, { pos: [number, number, number]; zoom: number }> = {
  ElN: { pos: [0, 5, 60], zoom: 38 }, // looking south at the North face
  ElS: { pos: [0, 5, -60], zoom: 38 }, // looking north at the South face
  ElE: { pos: [60, 5, 0], zoom: 52 }, // looking west at the East face
  ElW: { pos: [-60, 5, 0], zoom: 52 }, // looking east at the West face
}
const ELEV_TARGET: [number, number, number] = [0, 4.5, 0]

function isElevView(v: ViewName) {
  return v === 'ElN' || v === 'ElS' || v === 'ElE' || v === 'ElW'
}

function CameraRig() {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as { target: THREE.Vector3; update: () => void } | null
  const view = useStore((s) => s.view)
  const nonce = useStore((s) => s.viewNonce)

  useEffect(() => {
    if (isElevView(view)) return
    const v = VIEWS[view]!
    camera.position.set(...v.pos)
    if (controls) {
      controls.target.set(...v.tgt)
      controls.update()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, nonce, controls])

  return null
}

function Sun({ flat }: { flat: boolean }) {
  const ref = useRef<THREE.DirectionalLight>(null)
  const az = useStore((s) => s.sunAzimuth)
  useEffect(() => {
    if (!ref.current) return
    const r = 40
    const a = (az * Math.PI) / 180
    const elev = (42 * Math.PI) / 180
    ref.current.position.set(Math.cos(a) * r * Math.cos(elev), Math.sin(elev) * r, Math.sin(a) * r * Math.cos(elev))
  }, [az])
  return <directionalLight ref={ref} intensity={flat ? 1.1 : 2.2} castShadow={!flat} shadow-mapSize={[2048, 2048]} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-camera-near={1} shadow-camera-far={120} shadow-bias={-0.0003} />
}

function ElevationCamera({ view }: { view: ViewName }) {
  const cfg = ELEV[view]
  return (
    <OrthographicCamera
      makeDefault
      key={view}
      position={cfg.pos}
      zoom={cfg.zoom}
      near={0.1}
      far={200}
      onUpdate={(c) => c.lookAt(...ELEV_TARGET)}
    />
  )
}

export function Scene() {
  const deselect = useStore((s) => s.select)
  const view = useStore((s) => s.view)
  const isElev = isElevView(view)
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 45, near: 0.1, far: 400, position: [24, 14, 26] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onPointerMissed={() => deselect(null)}
    >
      <color attach="background" args={[isElev ? '#ffffff' : '#aacbe6']} />
      {!isElev && <fog attach="fog" args={['#aacbe6', 90, 220]} />}

      <hemisphereLight args={['#cfe3f7', '#6b6354', isElev ? 0.9 : 0.6]} />
      <ambientLight intensity={isElev ? 0.7 : 0.35} />
      <Sun flat={isElev} />

      <Slabs />
      <Walls />
      <Roof />
      <Features />
      {!isElev && <Site />}

      <OrbitControls makeDefault enabled={!isElev} enableDamping dampingFactor={0.08} minDistance={6} maxDistance={90} maxPolarAngle={Math.PI / 2.05} target={[0, 4, 0]} />
      {isElev && <ElevationCamera view={view} />}
      <CameraRig />
    </Canvas>
  )
}
