import { SURFACES, FINISHES, type SurfaceDef } from '../data/finishes'
import { useStore, type ViewName } from '../store/useStore'

const GROUP_ORDER: SurfaceDef['group'][] = ['Walls', 'Roof', 'Doors', 'Trim & Metal', 'Outdoor', 'Glazing']
const VIEWS: ViewName[] = ['NE', 'NW', 'SE', 'SW', 'West', 'Aerial']

function Swatch({ color }: { color: string }) {
  return <span className="inline-block w-4 h-4 rounded-sm border border-black/20 shrink-0" style={{ background: color }} />
}

function FinishOptions({ surface }: { surface: SurfaceDef }) {
  const current = useStore((s) => s.finishes[surface.id])
  const setFinish = useStore((s) => s.setFinish)
  return (
    <div className="grid grid-cols-2 gap-1.5 mt-2 mb-1 pl-1">
      {surface.options.map((fid) => {
        const f = FINISHES[fid]
        const active = current === fid
        return (
          <button
            key={fid}
            onClick={() => setFinish(surface.id, fid)}
            className={`flex items-center gap-2 text-left px-2 py-1.5 rounded-md border text-[11px] leading-tight transition
              ${active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-400 bg-white'}`}
          >
            <Swatch color={f.color} />
            <span className="flex-1 min-w-0">
              <span className="block truncate text-slate-800">{f.name}</span>
              {f.spec && <span className="text-[9px] uppercase tracking-wide text-emerald-600">spec</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function Sidebar() {
  const finishes = useStore((s) => s.finishes)
  const selected = useStore((s) => s.selected)
  const select = useStore((s) => s.select)
  const resetToSpec = useStore((s) => s.resetToSpec)
  const view = useStore((s) => s.view)
  const setView = useStore((s) => s.setView)
  const sun = useStore((s) => s.sunAzimuth)
  const setSun = useStore((s) => s.setSun)

  return (
    <aside className="order-2 md:order-1 w-full md:w-[330px] h-auto md:h-full max-h-[46vh] md:max-h-none shrink-0 bg-slate-50 border-t md:border-t-0 md:border-r border-slate-200 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200">
        <h1 className="text-[15px] font-semibold text-slate-900">49 Balls Head Road</h1>
        <p className="text-[11px] text-slate-500">External finishes — Horizon J1672 Rev S</p>
      </div>

      {/* Views + sun */}
      <div className="px-4 py-3 border-b border-slate-200 space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">View</div>
          <div className="flex flex-wrap gap-1">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-2.5 py-1 rounded-md text-[11px] border transition
                  ${view === v ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Sun direction</div>
          <input type="range" min={20} max={340} value={sun} onChange={(e) => setSun(Number(e.target.value))} className="w-full accent-slate-700" />
        </div>
      </div>

      {/* Finish surfaces */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="text-[11px] text-slate-500 px-1 mb-2">
          Click a surface in the model, or a row below, then pick a finish. <span className="text-emerald-600 font-medium">spec</span> = the actual selection.
        </p>
        {GROUP_ORDER.map((group) => (
          <div key={group} className="mb-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400 px-1 mb-1">{group}</div>
            <div className="space-y-0.5">
              {SURFACES.filter((s) => s.group === group).map((s) => {
                const f = FINISHES[finishes[s.id]]
                const isSel = selected === s.id
                return (
                  <div key={s.id}>
                    <button
                      onClick={() => select(isSel ? null : s.id)}
                      onMouseEnter={() => useStore.getState().hover(s.id)}
                      onMouseLeave={() => useStore.getState().hover(null)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-[12px] transition
                        ${isSel ? 'bg-blue-100' : 'hover:bg-slate-100'}`}
                    >
                      <Swatch color={f.color} />
                      <span className="flex-1 text-slate-800">{s.label}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[110px]">{f.name}</span>
                    </button>
                    {isSel && <FinishOptions surface={s} />}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-slate-200 space-y-2">
        <button onClick={resetToSpec} className="w-full py-1.5 rounded-md bg-slate-800 text-white text-[12px] hover:bg-slate-700">
          Reset to Horizon spec
        </button>
        <p className="text-[10px] text-amber-700 leading-snug">
          ⚠ Plans (Rev S) note render as Grey Pebble <b>¼</b> Strength; the Selections schedule says <b>½</b> Strength. Confirm with Horizon.
        </p>
      </div>
    </aside>
  )
}
