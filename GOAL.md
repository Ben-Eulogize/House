# 49 Balls Head Road, Waverton: 3D House Model — Project Goal and Definition of Done

## One-line goal

Build an accurate, interactive 3D model of the finished house that is **perfect and
viewable from every side on the outside** and **fully modelled and walkable on the
inside**, built straight from the Horizon Homes Rev S construction plans and the
external finishes selections.

Two pillars, equal weight:
1. **Exterior fidelity** - orbit the house from any angle and it matches the plans and
   the architect's renders.
2. **Interior walkthrough** - drop inside and walk through every room across all three
   levels.

## Project facts (all verified against the plans in this repo)

| | |
|---|---|
| Address | 49 Balls Head Road, Waverton NSW |
| Legal | Lot 29, Section 7, DP 6894 |
| Builder / job | Horizon Homes, J1672 |
| Plan revision | **Rev S** (construction set, issued 27-01-2026); DA set is Rev K |
| Client | Benjamin and Jordan Sutton |
| Structure | 3 levels + garage, over a sloping site (street/high to harbour/low) |
| Total area | **520.0 m² / 56.0 squares** |
| Walls | 270mm cavity brick (external), 110mm single-skin brick (internal) |

### Levels and datum

The model datum is `Y = 0` at the Lower Floor finished level, **RL 28.890**. All
dimensions are in metres.

| Level | Finished floor RL | Model Y | Floor-to-ceiling | Floor area |
|---|---|---|---|---|
| Lower Ground Floor | 28.890 | 0.00 | 3.00 m | 191.4 m² |
| Ground Floor | 32.340 | 3.45 | 2.75 m | 163.0 m² |
| First Floor | 35.540 | 6.65 | 2.60 m | 65.9 m² |
| Finished ridge | 38.970 | 10.08 | - | - |

Ancillary areas: Garage 46.2, Alfresco 28.6, Rear Balcony 15.6, Front Balcony 6.5,
Porch 2.8 m². Internal door heights: 2340mm (Lower + Ground), 2040mm (First).

### Coordinate system (from the model, keep it)

`X+ = East`, `X- = West`, `Z+ = North` (street / high side), `Z- = South`
(harbour / low side), `Y+ = up`.

### Materials and finishes (from the External Selections Schedule)

The model must render these exact selections, per elevation:

| Element | Selection |
|---|---|
| Render (most walls) | Dulux **Grey Pebble** 1/2 Strength (S14B1H), acrylic render + paint |
| Cladding | James Hardie **Scyon Axon** 133mm, smooth, **Monument**, **west elevation only** |
| Roof sheeting | **Kliplock** profile, **Surfmist** |
| Parapet capping | Colorbond **Surfmist** |
| Fascia | Metal, **Monument** |
| Gutters / downpipes | Round/flatback half-round, **Monument** / 90mm PVC **Grey Pebble** |
| Eaves lining | **Grey Pebble** |
| Timber posts | **Monument**, porch x3 + balcony x3, 180x65 dressed |
| Windows / doors | Powder-coated aluminium, **Monument**, **black** hardware |
| Base brick | PGH common brick, standard cement mortar, flush joint |

## Goal 1: Exterior - perfect and viewable from all sides

**Definition of done:**

- **Massing and footprint are correct.** The Lower Floor is the real **L-shape
  (191.4 m²)**, not a full rectangle, and the **alfresco (28.6 m²)** is a distinct
  covered area on the south side, not merged into the main box. Each level's outline
  matches its plan (upper levels step back over the lower).
- **Roofline is correct.** The roof is pitched to the true **ridge RL 38.970 (Y=10.08)**,
  not a flat slab. Kliplock Surfmist finish, Monument fascia and gutters, correct
  overhangs and parapet capping.
- **All four elevations read true** against Rev S sheets p11 / p12 / p17: window and
  door positions, sizes and types (stacker, awning, fixed, sliding), balconies, porch,
  privacy screens, the Monument Axon cladding on the west wall only, render everywhere
  else.
- **Viewable from every angle.** Smooth orbit / zoom / pan with no gaps, no z-fighting,
  no missing faces. Preset views for N / S / E / W elevations plus an aerial / isometric.
  It should hold up as a replacement for the architect's still renders.
- **Sits on its site.** Correct ground plane and the street-to-harbour slope, so the
  three levels step down the block the way they will in reality.

## Goal 2: Interior - fully modelled and walkable

**Definition of done:**

- **First-person walk mode.** Pointer-lock mouse-look + WASD, eye height ~1.6m, walking
  on each floor slab, moving between the three levels via the staircase (plus a quick
  floor-jump for convenience).
- **Every room, every level, per the plans.** Interior partition walls, door openings,
  and the stair modelled to the Rev S dimensions. Verified Lower Floor rooms: Family /
  Dining / Kitchen (open plan) with the 1000 x 3000 island, Pantry, Laundry, Bath, Media
  Room, Wine Cellar, WIL / Storage, plus the Alfresco off the living area. Ground and
  First floors laid out from sheets p7 / p9 / p10 (bedrooms, master, ensuites, living,
  balconies, entry, etc.).
- **Interior finishes read correctly.** Floor materials per room per the plan legend
  (tile / timber / carpet), wall and ceiling colours, and the shape-defining fixtures:
  staircase, kitchen island, bathrooms, wine cellar, the gas fireplace (LOPI 4415HO
  GS2). Full loose furniture is not required for "done", but the rooms must read as the
  real spaces, not grey boxes.
- **Openings connect the spaces.** Doors, the stair void, and window reveals are real
  openings so the walkthrough flows and daylight reads through the glazing.

## Fidelity standard

**The Rev S construction plans are the single source of truth.** When the model and the
plans disagree, the plans win. Dimensions come from the sheets (available to the
millimetre), materials from the selections schedule, levels from the RL datum. The
architect's 3D renders are the visual bar for the exterior. `accuracy_audit.csv` is the
living scorecard: every fixed item flips to OK, every new item gets an entry.

## Current state (starting point)

The existing model (`index.html`, Three.js) is exterior-only and orbit-only, and is
**accurate on floor levels, wall thicknesses, and most windows** with correct material
colours. Three known gaps from `accuracy_audit.csv` are the first things to fix:

1. **Roof ridge too low** - flat at ~Y9.325 vs required ridge Y10.08 (missing ~0.75m of pitch).
2. **Lower-floor footprint is a full rectangle** (224.7 m²) vs the real 191.4 m² L-shape.
3. **Alfresco not separated** - merged into the box instead of a distinct covered area.

## Constraints and scope

- **Single-file, no build.** Stays as `index.html` + Three.js from CDN, so it keeps
  deploying as-is to GitHub Pages (`ben-eulogize.github.io/House/`) and Vercel
  (`house-one-chi.vercel.app`). No bundler unless there's a strong reason.
- **Runs on a phone and a laptop.** Interiors add geometry, so keep it performant.
- **Out of scope:** `rainbow.html` (an unrelated toy sharing this repo). Full furnishing,
  soft furnishings, and detailed landscaping are polish, not part of "done".
- **Nothing is pushed or deployed without Ben's say-so** (public repo).

## Source files (in this repo, all verified readable)

- `BALLSH49 (... REV S ...).pdf` - Horizon Homes Rev S construction set, 24 A3 sheets.
  Floor plans p7-p10, elevations p11 / p12 / p17, sections p13 / p14.
- `J1672 - ... DA PLANS - REV K.pdf` - earlier DA set, 21 sheets, incl. shadow diagrams.
- `BALLSH49 External Selections Schedule - DRAFT.docx` - colour and finishes selections.
- `accuracy_audit.csv` - model-vs-plans scorecard.
- `index.html` - the model.
