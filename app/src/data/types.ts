// Structured model of the house, extracted from the Rev S construction plans
// (J1672, 49 Balls Head Road). Geometry is generated procedurally from this
// data — nothing about the shape is hard-coded in the scene components.
//
// Coordinate system (metres): X+ = East, Z+ = North, Y+ = Up.
// Datum: Y = 0 is RL 28.890 (Lower Floor finished level).

export type Facade = 'N' | 'S' | 'E' | 'W'
export type OpeningKind = 'window' | 'door'

export interface Level {
  id: string
  name: string
  rl: number // real level (AHD), for display
  baseY: number // floor height in model space
  height: number // floor-to-ceiling
  wallThickness: number
}

export interface Opening {
  id: string // schedule id, e.g. "W4" or "D3"
  kind: OpeningKind
  level: string // Level.id
  facade: Facade
  width: number // metres (horizontal)
  height: number // metres (vertical)
  sill: number // metres above the level floor to the opening base
  offset: number // metres along the facade from the wall midpoint (+ = toward N/E end)
  room?: string
  code?: string
  wall?: string // optional: pin the opening to a specific WallSeg.id
}

// A straight external wall run. Walls are extruded from a flat elevation
// rectangle with rectangular holes punched for the openings that sit on them.
export interface WallSeg {
  id: string
  level: string
  facade: Facade
  // Base centre-line of the wall in world space (Y is taken from the level).
  cx: number
  cz: number
  length: number
  // Which surface group drives this wall's finish (e.g. 'wallWest').
  surface: string
}

export interface RoofPlane {
  id: string
  // axis-aligned slab, optionally pitched about its X axis (slopes N/S)
  w: number
  d: number
  cx: number
  cz: number
  y: number
  thickness: number
  pitchDeg: number // rotation about X (degrees); + dips toward -Z (south)
  surface: string
}

export interface HouseModel {
  meta: {
    title: string
    address: string
    lot: string
    revision: string
    ridgeRL: number
  }
  levels: Level[]
  walls: WallSeg[]
  openings: Opening[]
  roofs: RoofPlane[]
}
