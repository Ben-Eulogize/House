import type { HouseModel, Opening, WallSeg } from './types'

// Coordinate system (metres): X+ = East, Z+ = North, Y+ = Up.
// Validated against Rev S plans — building-relative orientation read off the
// window codes: long axis (18.71 LF / 21.02 GF) runs EAST–WEST; short axis
// (12.01) runs NORTH–SOUTH. Street/garage/entry = WEST end; living + alfresco
// open EAST to the view; external stairs on the SOUTH; garage at NW, entry SW.

const LF_Y = 0.0 // RL 28.890
const GF_Y = 3.45 // RL 32.340
const FF_Y = 6.65 // RL 35.540

// Footprint extents (X = E-W, Z = N-S). GF shares its EAST face with LF and
// extends further WEST (garage projects toward the street).
const GF_E = 10.51, GF_W = -10.51, GF_N = 6.005, GF_S = -6.005
const LF_E = 10.51, LF_W = -8.2, LF_N = 6.005, LF_S = -6.005
const FF_E = 9.0, FF_W = -2.37, FF_N = 4.13, FF_S = -4.13

// Alfresco (open, covered by floor over) at the NE corner of the lower floor.
const ALF_W = 4.5 // E-W span
const ALF_D = 6.35 // N-S span
const ALF_WEST = LF_E - ALF_W // 6.01
const ALF_SOUTH = LF_N - ALF_D // -0.345

const levels = [
  { id: 'LF', name: 'Lower Floor', rl: 28.89, baseY: LF_Y, height: 3.0, wallThickness: 0.27 },
  { id: 'GF', name: 'Ground Floor', rl: 32.34, baseY: GF_Y, height: 2.75, wallThickness: 0.27 },
  { id: 'FF', name: 'First Floor', rl: 35.54, baseY: FF_Y, height: 2.6, wallThickness: 0.185 },
]

const walls: WallSeg[] = [
  // ── Lower Floor ── (rectangular envelope; alfresco is a covered NE corner)
  { id: 'LF-S', level: 'LF', facade: 'S', cx: (LF_W + LF_E) / 2, cz: LF_S, length: LF_E - LF_W, surface: 'wallSouth' },
  { id: 'LF-N', level: 'LF', facade: 'N', cx: (LF_W + LF_E) / 2, cz: LF_N, length: LF_E - LF_W, surface: 'wallNorth' },
  { id: 'LF-E', level: 'LF', facade: 'E', cx: LF_E, cz: 0, length: LF_N - LF_S, surface: 'wallEast' },
  { id: 'LF-W', level: 'LF', facade: 'W', cx: LF_W, cz: 0, length: LF_N - LF_S, surface: 'wallWest' },

  // ── Ground Floor ── (full rectangle, garage at west)
  { id: 'GF-S', level: 'GF', facade: 'S', cx: 0, cz: GF_S, length: GF_E - GF_W, surface: 'wallSouth' },
  { id: 'GF-N', level: 'GF', facade: 'N', cx: 0, cz: GF_N, length: GF_E - GF_W, surface: 'wallNorth' },
  { id: 'GF-E', level: 'GF', facade: 'E', cx: GF_E, cz: 0, length: GF_N - GF_S, surface: 'wallEast' },
  { id: 'GF-W', level: 'GF', facade: 'W', cx: GF_W, cz: 0, length: GF_N - GF_S, surface: 'wallWest' },

  // ── First Floor ── (setback, EPS clad)
  { id: 'FF-S', level: 'FF', facade: 'S', cx: (FF_W + FF_E) / 2, cz: FF_S, length: FF_E - FF_W, surface: 'wallSouth' },
  { id: 'FF-N', level: 'FF', facade: 'N', cx: (FF_W + FF_E) / 2, cz: FF_N, length: FF_E - FF_W, surface: 'wallNorth' },
  { id: 'FF-E', level: 'FF', facade: 'E', cx: FF_E, cz: 0, length: FF_N - FF_S, surface: 'wallEast' },
  { id: 'FF-W', level: 'FF', facade: 'W', cx: FF_W, cz: 0, length: FF_N - FF_S, surface: 'wallWest' },
]

// offset is the LOCAL position along a wall from its midpoint. Sign per facade
// (from the wall's outward rotation): N +→East, S +→West, E +→South, W +→North.
const W = (id: string, level: string, facade: Opening['facade'], width: number, height: number, sill: number, offset: number, room: string): Opening =>
  ({ id, kind: 'window', level, facade, width, height, sill, offset, room })
const D = (id: string, level: string, facade: Opening['facade'], width: number, height: number, offset: number, room: string): Opening =>
  ({ id, kind: 'door', level, facade, width, height, sill: 0, offset, room })

const openings: Opening[] = [
  // ── Lower Floor ──  (E facade offset = -worldZ; N offset = worldX-1.155; S = 1.155-worldX; W = worldZ)
  W('W4', 'LF', 'E', 4.0, 2.85, 0.05, 3.3, 'Dining'), // south end
  D('D3', 'LF', 'E', 4.7, 2.85, -2.6, 'Dining — alfresco'), // north end
  W('W5', 'LF', 'N', 1.57, 1.8, 0.6, -2.155, 'Family/Dining'),
  W('W6', 'LF', 'N', 1.57, 1.8, 0.6, -5.155, 'Family/Dining'),
  D('D2', 'LF', 'N', 3.25, 2.85, 4.845, 'Family — alfresco'), // NE, by alfresco
  W('W7', 'LF', 'W', 1.81, 1.8, 0.6, -2.0, 'Family/Dining'),
  W('W9', 'LF', 'W', 2.17, 1.8, 0.6, 3.0, 'Guest/Study'),
  W('W1', 'LF', 'S', 1.51, 0.6, 1.5, -4.845, 'Bath'),
  W('W2', 'LF', 'S', 0.45, 1.2, 1.0, -2.845, 'Laundry'),
  W('W3', 'LF', 'S', 1.57, 0.6, 1.5, -0.845, 'Pantry'),
  D('D1', 'LF', 'S', 0.9, 2.1, -6.345, 'Laundry'),

  // ── Ground Floor ──
  W('W12', 'GF', 'E', 4.0, 1.8, 0.3, 3.0, 'Master'), // south end
  W('W14', 'GF', 'E', 3.0, 1.37, 0.6, -2.8, 'Bed 2'), // north end
  D('D4', 'GF', 'W', 5.0, 2.38, 3.0, 'Garage'), // NW
  D('D5', 'GF', 'W', 1.2, 2.34, -3.5, 'Entry'), // SW
  W('W17', 'GF', 'W', 1.0, 1.37, 0.6, -0.5, 'Bed 3'),
  W('W19', 'GF', 'N', 3.01, 0.6, 1.95, -8.0, 'Garage'),
  W('W23', 'GF', 'N', 1.21, 0.6, 1.5, -2.0, 'Powder'),
  W('W16', 'GF', 'N', 2.41, 0.9, 0.9, 1.0, 'Bed 3'),
  W('W15', 'GF', 'N', 2.41, 0.9, 1.5, 4.0, 'Bed 2'),
  W('W13', 'GF', 'N', 1.81, 1.8, 0.3, 8.0, 'Master'),
  W('W10', 'GF', 'S', 1.81, 0.6, 1.5, 3.0, 'Bath'),
  W('W11', 'GF', 'S', 1.57, 0.6, 1.5, -2.0, 'Ensuite'),

  // ── First Floor ──  (D7 + W21 on east per elevation; D6 + W20 on west)
  D('D7', 'FF', 'E', 1.81, 2.1, 2.5, 'Rumpus — balcony'), // south end
  W('W21', 'FF', 'E', 4.56, 0.9, 1.6, -1.5, 'Stairs'), // north end, clerestory
  D('D6', 'FF', 'W', 3.61, 2.2, -1.5, 'Guest'),
  W('W20', 'FF', 'W', 3.12, 1.8, 0.3, 2.0, 'Guest'),
  W('W18', 'FF', 'N', 1.81, 2.4, 0.1, -3.315, 'Stairs'),
  W('W22', 'FF', 'N', 1.81, 2.4, 0.1, -5.315, 'Stairs'),
  W('W24', 'FF', 'N', 2.41, 1.2, 0.6, 1.685, 'Guest'),
  W('W27', 'FF', 'S', 1.21, 0.6, 1.5, 1.315, 'Powder'),
]

const FF_CEIL = FF_Y + 2.6 // 9.25
const GF_CEIL = GF_Y + 2.75 // 6.2
const roofs = [
  // Main pitched roof over the first floor (slopes about the E-W axis).
  { id: 'roof-main', w: (FF_E - FF_W) + 0.9, d: (FF_N - FF_S) + 0.9, cx: (FF_W + FF_E) / 2, cz: 0, y: FF_CEIL + 0.5, thickness: 0.18, pitchDeg: 5, surface: 'roof' },
  // Flat GF roofs around the FF setback.
  { id: 'roof-gf-w', w: FF_W - GF_W, d: GF_N - GF_S, cx: (GF_W + FF_W) / 2, cz: 0, y: GF_CEIL + 0.06, thickness: 0.12, pitchDeg: 1, surface: 'roof' },
  { id: 'roof-gf-e', w: GF_E - FF_E, d: GF_N - GF_S, cx: (GF_E + FF_E) / 2, cz: 0, y: GF_CEIL + 0.06, thickness: 0.12, pitchDeg: 0, surface: 'roof' },
  { id: 'roof-gf-n', w: FF_E - FF_W, d: GF_N - FF_N, cx: (FF_W + FF_E) / 2, cz: (GF_N + FF_N) / 2, y: GF_CEIL + 0.06, thickness: 0.12, pitchDeg: 0, surface: 'roof' },
  { id: 'roof-gf-s', w: FF_E - FF_W, d: FF_S - GF_S, cx: (FF_W + FF_E) / 2, cz: (GF_S + FF_S) / 2, y: GF_CEIL + 0.06, thickness: 0.12, pitchDeg: 0, surface: 'roof' },
]

export const HOUSE: HouseModel = {
  meta: {
    title: '49 Balls Head Road, Waverton',
    address: 'Lot 29 Sect. 7 DP 6894 — Horizon Homes J1672',
    lot: 'Lot 29',
    revision: 'Rev S (Construction Plans, 27-01-26)',
    ridgeRL: 38.97,
  },
  levels,
  walls,
  openings,
  roofs,
}

export const GEO = {
  LF_E, LF_W, LF_N, LF_S,
  GF_E, GF_W, GF_N, GF_S,
  FF_E, FF_W, FF_N, FF_S,
  ALF_W, ALF_D, ALF_WEST, ALF_SOUTH,
  LF_Y, GF_Y, FF_Y, FF_CEIL, GF_CEIL,
}
