import type { HouseModel, Opening, WallSeg } from './types'

// ── Level datums (RL → model Y, with Y=0 at RL 28.890) ──
const LF_Y = 0.0 // RL 28.890
const GF_Y = 3.45 // RL 32.340
const FF_Y = 6.65 // RL 35.540

// ── Footprint extents (metres) ──
// Lower Floor: 12.01 (E-W) × 18.71 (N-S), with an open alfresco recess at SW.
const LF_E = 6.005,
  LF_W = -6.005,
  LF_N = 9.355,
  LF_S = -9.355
// Alfresco notch (open, covered by the floor over): SW corner.
const ALF_W = 6.35 // E-W width of alfresco
const ALF_D = 4.5 // N-S depth
const ALF_EAST = LF_W + ALF_W // = 0.345 — east edge of alfresco
const ALF_NORTH = LF_S + ALF_D // = -4.855 — north edge of alfresco

// Ground Floor: 12.01 × 21.02, south aligned to LF, extends north (garage end).
const GF_E = 6.005,
  GF_W = -6.005,
  GF_S = -9.355,
  GF_N = 11.665
const GF_CZ = (GF_N + GF_S) / 2 // 1.155

// First Floor: 8.26 × 11.37, north edge aligned to LF north, centred E-W.
const FF_E = 4.13,
  FF_W = -4.13,
  FF_N = 9.355,
  FF_S = -2.015
const FF_CZ = (FF_N + FF_S) / 2 // 3.67

const levels = [
  { id: 'LF', name: 'Lower Floor', rl: 28.89, baseY: LF_Y, height: 3.0, wallThickness: 0.27 },
  { id: 'GF', name: 'Ground Floor', rl: 32.34, baseY: GF_Y, height: 2.75, wallThickness: 0.27 },
  { id: 'FF', name: 'First Floor', rl: 35.54, baseY: FF_Y, height: 2.6, wallThickness: 0.185 },
]

// ── External wall segments ──
// surface drives the finish: wallWest defaults to cladding, others to render.
const walls: WallSeg[] = [
  // Lower Floor
  { id: 'LF-N', level: 'LF', facade: 'N', cx: 0, cz: LF_N, length: 12.01, surface: 'wallNorth' },
  { id: 'LF-E', level: 'LF', facade: 'E', cx: LF_E, cz: 0, length: 18.71, surface: 'wallEast' },
  // South wall east of the alfresco recess
  {
    id: 'LF-S',
    level: 'LF',
    facade: 'S',
    cx: (ALF_EAST + LF_E) / 2,
    cz: LF_S,
    length: LF_E - ALF_EAST,
    surface: 'wallSouth',
  },
  // West wall (north of the alfresco recess) — Monument cladding
  {
    id: 'LF-W',
    level: 'LF',
    facade: 'W',
    cx: LF_W,
    cz: (ALF_NORTH + LF_N) / 2,
    length: LF_N - ALF_NORTH,
    surface: 'wallWest',
  },
  // Alfresco inner walls (render), facing into the covered recess
  {
    id: 'LF-alfN',
    level: 'LF',
    facade: 'S',
    cx: (LF_W + ALF_EAST) / 2,
    cz: ALF_NORTH,
    length: ALF_EAST - LF_W,
    surface: 'wallSouth',
  },
  {
    id: 'LF-alfE',
    level: 'LF',
    facade: 'W',
    cx: ALF_EAST,
    cz: (LF_S + ALF_NORTH) / 2,
    length: ALF_NORTH - LF_S,
    surface: 'wallSouth',
  },

  // Ground Floor (full rectangle)
  { id: 'GF-N', level: 'GF', facade: 'N', cx: 0, cz: GF_N, length: 12.01, surface: 'wallNorth' },
  { id: 'GF-E', level: 'GF', facade: 'E', cx: GF_E, cz: GF_CZ, length: 21.02, surface: 'wallEast' },
  { id: 'GF-S', level: 'GF', facade: 'S', cx: 0, cz: GF_S, length: 12.01, surface: 'wallSouth' },
  { id: 'GF-W', level: 'GF', facade: 'W', cx: GF_W, cz: GF_CZ, length: 21.02, surface: 'wallWest' },

  // First Floor (setback, EPS clad)
  { id: 'FF-N', level: 'FF', facade: 'N', cx: 0, cz: FF_N, length: 8.26, surface: 'wallNorth' },
  { id: 'FF-E', level: 'FF', facade: 'E', cx: FF_E, cz: FF_CZ, length: 11.37, surface: 'wallEast' },
  { id: 'FF-S', level: 'FF', facade: 'S', cx: 0, cz: FF_S, length: 8.26, surface: 'wallSouth' },
  { id: 'FF-W', level: 'FF', facade: 'W', cx: FF_W, cz: FF_CZ, length: 11.37, surface: 'wallWest' },
]

// ── Openings (Rev S Window & External Door schedules) ──
// width × height are the glazed sizes; facade is taken from the schedule's
// ORIENT column. offset/sill are estimated placements along each wall.
const W = (
  id: string,
  level: string,
  facade: Opening['facade'],
  width: number,
  height: number,
  sill: number,
  offset: number,
  room: string,
): Opening => ({ id, kind: 'window', level, facade, width, height, sill, offset, room })

const D = (
  id: string,
  level: string,
  facade: Opening['facade'],
  width: number,
  height: number,
  offset: number,
  room: string,
): Opening => ({ id, kind: 'door', level, facade, width, height, sill: 0, offset, room })

const openings: Opening[] = [
  // ── Lower Floor ──
  W('W1', 'LF', 'S', 1.51, 0.6, 1.5, 2.0, 'Bath'),
  W('W2', 'LF', 'S', 0.45, 1.2, 1.0, -1.0, 'Laundry'),
  W('W3', 'LF', 'S', 1.57, 0.6, 1.5, 0.2, 'Pantry'),
  W('W4', 'LF', 'E', 4.0, 2.7, 0.2, -4.0, 'Dining'),
  W('W5', 'LF', 'N', 1.57, 1.8, 0.6, 0.0, 'Family/Dining'),
  W('W6', 'LF', 'N', 1.57, 1.8, 0.6, -4.0, 'Family/Dining'),
  W('W7', 'LF', 'W', 1.81, 1.8, 0.6, -3.5, 'Family/Dining'),
  W('W8', 'LF', 'E', 1.81, 1.2, 0.9, 6.0, 'Media Room'),
  W('W9', 'LF', 'W', 2.17, 1.8, 0.6, 5.5, 'Guest/Study'),
  W('W22', 'LF', 'N', 1.81, 2.7, 0.1, 3.5, 'Stairs'),
  D('D1', 'LF', 'S', 0.9, 2.1, -2.0, 'Laundry'),
  D('D3', 'LF', 'E', 4.7, 2.85, 1.0, 'Dining'),

  // ── Ground Floor ──
  W('W10', 'GF', 'S', 1.81, 0.6, 1.5, -2.0, 'Bath'),
  W('W11', 'GF', 'S', 1.57, 0.6, 1.5, 3.0, 'Ensuite'),
  W('W12', 'GF', 'E', 4.0, 1.8, 0.3, 7.2, 'Master'),
  W('W14', 'GF', 'E', 3.0, 1.37, 0.6, 3.3, 'Bed 2'),
  W('W13', 'GF', 'N', 1.81, 1.8, 0.3, 4.85, 'Master'),
  W('W16', 'GF', 'N', 2.41, 0.9, 0.9, 2.6, 'Bed 3'),
  W('W17', 'GF', 'W', 1.0, 1.37, 0.6, -4.0, 'Bed 3'),
  W('W19', 'GF', 'N', 3.01, 0.6, 1.95, -4.4, 'Garage'),
  D('D2', 'GF', 'N', 3.25, 2.6, -0.3, 'Living'),
  D('D4', 'GF', 'W', 5.0, 2.38, 6.5, 'Garage'),
  D('D5', 'GF', 'W', 1.2, 2.34, 1.5, 'Entry'),
  D('D7', 'GF', 'E', 1.81, 2.1, -4.0, 'Living'),

  // ── First Floor ──
  W('W18', 'FF', 'N', 1.81, 2.4, 0.1, -2.0, 'Stairs'),
  W('W24', 'FF', 'N', 2.41, 1.2, 0.6, 2.1, 'Guest'),
  W('W20', 'FF', 'W', 3.12, 1.8, 0.3, -1.5, 'Guest'),
  W('W21', 'FF', 'E', 4.56, 0.9, 1.5, 0.0, 'Stairs'),
  D('D6', 'FF', 'W', 3.61, 2.2, 3.6, 'Guest'),
  // Rear-balcony access (implied by the 15.6 m² south balcony)
  D('D-RB', 'FF', 'S', 3.0, 2.2, 0.0, 'Guest'),
]

// ── Roof planes ──
const FF_CEIL = FF_Y + 2.6 // 9.25
const roofs = [
  // Main pitched roof over the first floor, extended north as the front canopy.
  {
    id: 'roof-main',
    w: 8.26 + 1.0,
    d: 11.37 + 1.8 + 0.5,
    cx: 0,
    cz: (FF_N + 1.8 + (FF_S - 0.5)) / 2,
    y: FF_CEIL + 0.55,
    thickness: 0.18,
    pitchDeg: 5,
    surface: 'roof',
  },
  // Flat roof over the ground floor south deck (between FF south and GF south).
  {
    id: 'roof-gf-south',
    w: 12.01 + 0.4,
    d: FF_S - GF_S,
    cx: 0,
    cz: (FF_S + GF_S) / 2,
    y: GF_Y + 2.75 + 0.06,
    thickness: 0.12,
    pitchDeg: 2,
    surface: 'roof',
  },
  // Flat roof over the ground floor north strip (garage end, north of FF).
  {
    id: 'roof-gf-north',
    w: 12.01 + 0.4,
    d: GF_N - FF_N,
    cx: 0,
    cz: (GF_N + FF_N) / 2,
    y: GF_Y + 2.75 + 0.06,
    thickness: 0.12,
    pitchDeg: 0,
    surface: 'roof',
  },
  // Side flat roofs over GF where it is wider than FF (east + west strips).
  {
    id: 'roof-gf-east',
    w: GF_E - FF_E,
    d: 11.37,
    cx: (GF_E + FF_E) / 2,
    cz: FF_CZ,
    y: GF_Y + 2.75 + 0.06,
    thickness: 0.12,
    pitchDeg: 0,
    surface: 'roof',
  },
  {
    id: 'roof-gf-west',
    w: GF_E - FF_E,
    d: 11.37,
    cx: (GF_W + FF_W) / 2,
    cz: FF_CZ,
    y: GF_Y + 2.75 + 0.06,
    thickness: 0.12,
    pitchDeg: 0,
    surface: 'roof',
  },
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

// Geometry constants other scene parts need.
export const GEO = {
  LF_E, LF_W, LF_N, LF_S,
  GF_E, GF_W, GF_N, GF_S, GF_CZ,
  FF_E, FF_W, FF_N, FF_S, FF_CZ,
  ALF_W, ALF_D, ALF_EAST, ALF_NORTH,
  LF_Y, GF_Y, FF_Y,
}
