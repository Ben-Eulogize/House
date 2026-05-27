import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStore, type ViewName } from '../store/useStore'
import { Walls } from './Walls'
import { Roof } from './Roof'
import { Slabs } from './Structure'
import { Features } from './Features'
import { Site } from './Site'

const VIEWS: Record<ViewName, { pos: [number, number, number]; tgt: [number, number, number] }> = {
  NE: { pos: [24, 14, 26], tgt: [0, 4, 0] },
  NW: { pos: [-24, 14, 26], tgt: [0, 4, 0] },
  SE: { pos: [24, 13, -26], tgt: [0, 4, 0] },
  SW: { pos: [-24, 13, -26], tgt: [0, 4, 0] },
  West: { pos: [-32, 9, 2], tgt: [0, 4, 0] },
  Aerial: { pos: [10, 36, -12], tgt: [0, 3, 0] },
}

function CameraRig() {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as { target: THREE.Vector3; update: () => void } | null
  const view = useStore((s) => s.view)
  const nonce = useStore((s) => s.viewNonce)

  useEffect(() => {
    const v = VIEWS[view]
    camera.position.set(...v.pos)
    if (controls) {
      controls.target.set(...v.tgt)
      controls.update()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, nonce, controls])

  return null
}

function Sun() {
  const ref = useRef<THREE.DirectionalLight>(null)
  const az = useStore((s) => s.sunAzimuth)
  useEffect(() => {
    if (!ref.current) return
    const r = 40
    const a = (az * Math.PI) / 180
    const elev = (42 * Math.PI) / 180
    ref.current.position.set(Math.cos(a) * r * Math.cos(elev), Math.sin(elev) * r, Math.sin(a) * r * Math.cos(elev))
  }, [az])
  return (
    <directionalLight
      ref={ref}
      intensity={2.2}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-30}
      shadow-camera-right={30}
      shadow-camera-top={30}
      shadow-camera-bottom={-30}
      shadow-camera-near={1}
      shadow-camera-far={120}
      shadow-bias={-0.0003}
    />
  )
}

export function Scene() {
  const deselect = useStore((s) => s.select)
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 45, near: 0.1, far: 400, position: VIEWS.NE.pos }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onPointerMissed={() => deselect(null)}
    >
      <color attach="background" args={['#aacbe6']} />
      <fog attach="fog" args={['#aacbe6', 90, 220]} />

      <hemisphereLight args={['#cfe3f7', '#6b6354', 0.6]} />
      <ambientLight intensity={0.35} />
      <Sun />

      <Slabs />
      <Walls />
      <Roof />
      <Features />
      <Site />

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={6} maxDistance={90} maxPolarAngle={Math.PI / 2.05} target={[0, 4, 0]} />
      <CameraRig />
    </Canvas>
  )
}
