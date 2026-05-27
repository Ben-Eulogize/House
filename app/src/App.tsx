import { Sidebar } from './components/Sidebar'
import { Scene } from './scene/Scene'
import { SURFACES, FINISHES } from './data/finishes'
import { useStore } from './store/useStore'

function SelectionChip() {
  const selected = useStore((s) => s.selected)
  const finishes = useStore((s) => s.finishes)
  if (!selected) {
    return (
      <div className="absolute top-3 right-3 bg-black/55 text-white text-[11px] px-3 py-2 rounded-md pointer-events-none">
        Drag to orbit · scroll to zoom · click a surface to change its finish
      </div>
    )
  }
  const surf = SURFACES.find((s) => s.id === selected)!
  const f = FINISHES[finishes[selected]]
  return (
    <div className="absolute top-3 right-3 bg-black/70 text-white text-[12px] px-3 py-2 rounded-md flex items-center gap-2 pointer-events-none">
      <span className="inline-block w-3.5 h-3.5 rounded-sm border border-white/30" style={{ background: f.color }} />
      <span className="font-medium">{surf.label}</span>
      <span className="text-white/60">→ {f.name}</span>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <Sidebar />
      <main className="relative flex-1 min-w-0 min-h-0 order-1 md:order-2">
        <Scene />
        <SelectionChip />
      </main>
    </div>
  )
}
