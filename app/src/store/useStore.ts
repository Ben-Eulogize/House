import { create } from 'zustand'
import { SURFACES, type SurfaceId } from '../data/finishes'

export type ViewName = 'NE' | 'NW' | 'SE' | 'SW' | 'Aerial' | 'West' | 'ElN' | 'ElS' | 'ElE' | 'ElW'

function specDefaults(): Record<SurfaceId, string> {
  const out = {} as Record<SurfaceId, string>
  for (const s of SURFACES) out[s.id] = s.spec
  return out
}

interface State {
  finishes: Record<SurfaceId, string>
  selected: SurfaceId | null
  hovered: SurfaceId | null
  view: ViewName
  viewNonce: number // bump to re-trigger a camera move even if view repeats
  sunAzimuth: number // degrees, time-of-day control
  setFinish: (surface: SurfaceId, finish: string) => void
  select: (surface: SurfaceId | null) => void
  hover: (surface: SurfaceId | null) => void
  setView: (v: ViewName) => void
  setSun: (deg: number) => void
  resetToSpec: () => void
}

export const useStore = create<State>((set) => ({
  finishes: specDefaults(),
  selected: null,
  hovered: null,
  view: 'NE',
  viewNonce: 0,
  sunAzimuth: 135,
  setFinish: (surface, finish) =>
    set((s) => ({ finishes: { ...s.finishes, [surface]: finish } })),
  select: (surface) => set({ selected: surface }),
  hover: (surface) => set({ hovered: surface }),
  setView: (v) => set((s) => ({ view: v, viewNonce: s.viewNonce + 1 })),
  setSun: (deg) => set({ sunAzimuth: deg }),
  resetToSpec: () => set({ finishes: specDefaults() }),
}))
