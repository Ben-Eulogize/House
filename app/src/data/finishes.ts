// Finish definitions and the surface map that the switcher controls.
// "spec" finishes are the actual Horizon selections (External Colour &
// Finishes Schedule); the rest are alternatives to trial.

export type FinishCategory = 'render' | 'cladding' | 'brick' | 'roof' | 'metal' | 'timber' | 'glass' | 'concrete'

export interface Finish {
  id: string
  name: string
  brand?: string
  category: FinishCategory
  color: string // hex
  roughness: number
  metalness: number
  spec?: boolean // part of the real Horizon selection
}

export const FINISHES: Record<string, Finish> = {
  // ── Real Horizon selections ──
  greyPebbleHalf: { id: 'greyPebbleHalf', name: 'Grey Pebble ½ Strength', brand: 'Dulux S14B1H', category: 'render', color: '#cec8c1', roughness: 0.9, metalness: 0, spec: true },
  greyPebbleQuarter: { id: 'greyPebbleQuarter', name: 'Grey Pebble ¼ Strength', brand: 'Dulux S14B1Q', category: 'render', color: '#e3e0da', roughness: 0.9, metalness: 0, spec: true },
  monument: { id: 'monument', name: 'Monument', brand: 'Colorbond', category: 'metal', color: '#383c3d', roughness: 0.5, metalness: 0.2, spec: true },
  monumentAxon: { id: 'monumentAxon', name: 'Axon 133 Smooth — Monument', brand: 'Scyon / Colorbond', category: 'cladding', color: '#383c3d', roughness: 0.7, metalness: 0.05, spec: true },
  surfmist: { id: 'surfmist', name: 'Surfmist', brand: 'Colorbond', category: 'roof', color: '#e6dfd2', roughness: 0.45, metalness: 0.2, spec: true },
  pacificMaple: { id: 'pacificMaple', name: 'Sliced Pacific Maple', brand: 'Hume — clear stain', category: 'timber', color: '#9a7449', roughness: 0.65, metalness: 0, spec: true },
  concreteTile: { id: 'concreteTile', name: 'Concrete + tile', category: 'concrete', color: '#b3ac9f', roughness: 0.9, metalness: 0, spec: true },
  glazingClear: { id: 'glazingClear', name: 'Clear glazing', category: 'glass', color: '#a9c5d2', roughness: 0.08, metalness: 0, spec: true },

  // ── Alternative renders / paint colours ──
  renderWhite: { id: 'renderWhite', name: 'Vivid White', brand: 'Dulux', category: 'render', color: '#f1efe9', roughness: 0.9, metalness: 0 },
  renderDune: { id: 'renderDune', name: 'Dune', brand: 'Colorbond', category: 'render', color: '#cabfa9', roughness: 0.9, metalness: 0 },
  renderWoodland: { id: 'renderWoodland', name: 'Woodland Grey', brand: 'Colorbond', category: 'render', color: '#4c4e49', roughness: 0.9, metalness: 0 },
  renderBasalt: { id: 'renderBasalt', name: 'Basalt', brand: 'Dulux', category: 'render', color: '#4a4b4d', roughness: 0.9, metalness: 0 },

  // ── Alternative claddings ──
  claddingSpottedGum: { id: 'claddingSpottedGum', name: 'Timber slats — Spotted Gum', category: 'cladding', color: '#7c5a38', roughness: 0.7, metalness: 0 },
  claddingBlackwood: { id: 'claddingBlackwood', name: 'Timber slats — Blackbutt', category: 'cladding', color: '#b08a55', roughness: 0.7, metalness: 0 },
  claddingWhiteWeatherboard: { id: 'claddingWhiteWeatherboard', name: 'Weatherboard — White', category: 'cladding', color: '#ece9e1', roughness: 0.75, metalness: 0 },
  claddingCharcoal: { id: 'claddingCharcoal', name: 'Matrix panel — Charcoal', category: 'cladding', color: '#33373a', roughness: 0.7, metalness: 0.05 },

  // ── Alternative bricks ──
  brickRed: { id: 'brickRed', name: 'Face brick — Red', category: 'brick', color: '#9a5746', roughness: 0.95, metalness: 0 },
  brickBrown: { id: 'brickBrown', name: 'Face brick — Brown', category: 'brick', color: '#6f5648', roughness: 0.95, metalness: 0 },
  brickGrey: { id: 'brickGrey', name: 'Face brick — Grey', category: 'brick', color: '#8b8a85', roughness: 0.95, metalness: 0 },
  brickBaggedWhite: { id: 'brickBaggedWhite', name: 'Bagged brick — White', category: 'brick', color: '#dcd7cd', roughness: 0.95, metalness: 0 },

  // ── Alternative roof colours ──
  roofMonument: { id: 'roofMonument', name: 'Monument', brand: 'Colorbond', category: 'roof', color: '#383c3d', roughness: 0.45, metalness: 0.2 },
  roofBasalt: { id: 'roofBasalt', name: 'Basalt', brand: 'Colorbond', category: 'roof', color: '#46484a', roughness: 0.45, metalness: 0.2 },
  roofWoodland: { id: 'roofWoodland', name: 'Woodland Grey', brand: 'Colorbond', category: 'roof', color: '#4c4e49', roughness: 0.45, metalness: 0.2 },
  roofTerracotta: { id: 'roofTerracotta', name: 'Terracotta tile', category: 'roof', color: '#9c4a2f', roughness: 0.8, metalness: 0 },

  // ── Alternative metal / powdercoat colours (frames, fascia, balustrade…) ──
  metalBlack: { id: 'metalBlack', name: 'Matte Black', category: 'metal', color: '#1c1c1d', roughness: 0.5, metalness: 0.2 },
  metalSilver: { id: 'metalSilver', name: 'Anodised Silver', category: 'metal', color: '#b8bbbe', roughness: 0.35, metalness: 0.6 },
  metalSurfmist: { id: 'metalSurfmist', name: 'Surfmist', brand: 'Colorbond', category: 'metal', color: '#e6dfd2', roughness: 0.45, metalness: 0.2 },
  metalWoodland: { id: 'metalWoodland', name: 'Woodland Grey', category: 'metal', color: '#4c4e49', roughness: 0.5, metalness: 0.2 },
}

export type SurfaceId =
  | 'wallNorth' | 'wallEast' | 'wallSouth' | 'wallWest'
  | 'roof' | 'fascia' | 'parapetCap' | 'windowFrames' | 'glazing'
  | 'garageDoor' | 'entryDoor' | 'balustrade' | 'posts'
  | 'privacyScreen' | 'vergola' | 'stairs' | 'gutters' | 'eaves'

export interface SurfaceDef {
  id: SurfaceId
  label: string
  group: 'Walls' | 'Roof' | 'Doors' | 'Trim & Metal' | 'Outdoor' | 'Glazing'
  spec: string // default finish id (the real selection)
  options: string[] // selectable finish ids
}

const WALL_OPTIONS = [
  'greyPebbleHalf', 'greyPebbleQuarter', 'renderWhite', 'renderDune', 'renderWoodland', 'renderBasalt',
  'monumentAxon', 'claddingSpottedGum', 'claddingBlackwood', 'claddingWhiteWeatherboard', 'claddingCharcoal',
  'brickRed', 'brickBrown', 'brickGrey', 'brickBaggedWhite',
]
const ROOF_OPTIONS = ['surfmist', 'roofMonument', 'roofBasalt', 'roofWoodland', 'roofTerracotta']
const METAL_OPTIONS = ['monument', 'metalBlack', 'metalSilver', 'metalSurfmist', 'metalWoodland']

export const SURFACES: SurfaceDef[] = [
  { id: 'wallNorth', label: 'North wall', group: 'Walls', spec: 'greyPebbleHalf', options: WALL_OPTIONS },
  { id: 'wallEast', label: 'East wall', group: 'Walls', spec: 'greyPebbleHalf', options: WALL_OPTIONS },
  { id: 'wallSouth', label: 'South wall', group: 'Walls', spec: 'greyPebbleHalf', options: WALL_OPTIONS },
  { id: 'wallWest', label: 'West wall (cladding)', group: 'Walls', spec: 'monumentAxon', options: WALL_OPTIONS },
  { id: 'roof', label: 'Roof sheeting', group: 'Roof', spec: 'surfmist', options: ROOF_OPTIONS },
  { id: 'parapetCap', label: 'Parapet capping', group: 'Roof', spec: 'surfmist', options: ROOF_OPTIONS },
  { id: 'fascia', label: 'Fascia & gutters', group: 'Roof', spec: 'monument', options: METAL_OPTIONS },
  { id: 'eaves', label: 'Eaves lining', group: 'Roof', spec: 'greyPebbleHalf', options: ['greyPebbleHalf', 'greyPebbleQuarter', 'renderWhite', 'metalSurfmist'] },
  { id: 'garageDoor', label: 'Garage door', group: 'Doors', spec: 'monument', options: ['monument', 'metalWoodland', 'pacificMaple', 'metalBlack', 'metalSurfmist'] },
  { id: 'entryDoor', label: 'Entry door', group: 'Doors', spec: 'pacificMaple', options: ['pacificMaple', 'monument', 'metalBlack', 'claddingBlackwood'] },
  { id: 'windowFrames', label: 'Window & door frames', group: 'Trim & Metal', spec: 'monument', options: METAL_OPTIONS },
  { id: 'balustrade', label: 'Balustrade', group: 'Trim & Metal', spec: 'monument', options: METAL_OPTIONS },
  { id: 'posts', label: 'Timber posts', group: 'Trim & Metal', spec: 'monument', options: METAL_OPTIONS.concat(['pacificMaple']) },
  { id: 'privacyScreen', label: 'Privacy screen', group: 'Outdoor', spec: 'monument', options: METAL_OPTIONS.concat(['pacificMaple', 'claddingSpottedGum']) },
  { id: 'vergola', label: 'Vergola louvres', group: 'Outdoor', spec: 'surfmist', options: ['surfmist', 'monument', 'metalWoodland'] },
  { id: 'stairs', label: 'External stairs', group: 'Outdoor', spec: 'concreteTile', options: ['concreteTile', 'monument', 'metalSurfmist'] },
  { id: 'glazing', label: 'Glazing tint', group: 'Glazing', spec: 'glazingClear', options: ['glazingClear'] },
]
