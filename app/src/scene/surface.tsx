import { useMemo } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { FINISHES, type SurfaceId } from '../data/finishes'
import { useStore } from '../store/useStore'

// Reactive material for a finish surface. Reads the assigned finish from the
// store and adds a highlight when the surface is hovered or selected.
export function SurfaceMaterial({ surface }: { surface: SurfaceId }) {
  const finishId = useStore((s) => s.finishes[surface])
  const isSel = useStore((s) => s.selected === surface)
  const isHov = useStore((s) => s.hovered === surface)
  const f = FINISHES[finishId]
  const isGlass = f.category === 'glass'

  const emissive = isSel ? '#2f6fed' : isHov ? '#7aa2f7' : '#000000'
  const emissiveIntensity = isSel ? 0.45 : isHov ? 0.25 : 0

  return (
    <meshStandardMaterial
      color={f.color}
      roughness={f.roughness}
      metalness={f.metalness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      transparent={isGlass}
      opacity={isGlass ? 0.32 : 1}
      side={isGlass ? 2 : 0}
    />
  )
}

// Click + hover handlers that drive selection for a given surface.
export function useSurfaceHandlers(surface: SurfaceId) {
  const select = useStore((s) => s.select)
  const hover = useStore((s) => s.hover)
  return useMemo(
    () => ({
      onClick: (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        select(surface)
      },
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        hover(surface)
        document.body.style.cursor = 'pointer'
      },
      onPointerOut: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        hover(null)
        document.body.style.cursor = 'auto'
      },
    }),
    [surface, select, hover],
  )
}
