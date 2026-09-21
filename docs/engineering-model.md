# Engineering model

> Phase 2 output for SanMeyster, built strictly on
> [`docs/ergonomics-and-standards.md`](./ergonomics-and-standards.md) and the
> catalog data in `src/data/`. Every threshold used below traces to a
> `StandardRule` with a real source (see `src/data/standards.json`); nothing
> here introduces a new numeric constant that isn't already in that research.

## 1. Coordinate system

A basin is modeled in a 2D vertical cross-section (the "side profile" the SVG
renders), origin at the **rear-top edge of the basin, at the rim**:

- **Y axis** — depth, 0 at the rear edge, increasing toward the front edge.
  `basin.depth` is the outer footprint depth; the bowl's usable interior
  (`bowlDepth`) is smaller and, per the research, unknown for nearly every
  cataloged model — treated as `null` unless the catalog entry has it.
- **Z axis** — height, 0 at the rim, increasing downward into the bowl (so a
  bowl bottom is at `+bowlHeight` if known) and increasing upward above the
  rim for the faucet body.
- **X axis** (width) is not modeled in the 2D cross-section — the app assumes
  the faucet is mounted on the basin's width centerline, since no research
  source or catalog entry gave an off-center tap-hole position. This is a
  declared simplification, not a hidden one.

The faucet is anchored at the **mounting surface**, which for a deck-mounted
faucet is taken as level with the basin rim (Z=0) at whatever Y-position the
tap hole sits — `faucetHolePosition` (distance from rear edge) when the
catalog knows it. No catalog entry currently has this field (§11 of the
research), so the calculator requires the user to input it directly (a
slider, defaulted to Y=0 purely as an interactive starting position, not as
a claimed typical value — there is no sourced "typical faucet-to-rear-edge
distance" to default to, per the research gap).

The bowl interior is assumed to span `Y=0` (rear rim) to `Y=bowlDepth` (or
`Y=depth` when `bowlDepth` is unknown) — i.e. no rear deck offset before the
bowl starts. This is a declared simplification: real countertop basins often
have a flat deck strip behind the bowl, but its width was not published for
any cataloged model, so the model would have to invent it to represent it.

Because of this, the diagrams draw **one** basin rectangle — outer width ×
whichever depth the calculation is actually using (bowl depth if the
catalog has it, else outer depth) — not two. An earlier version also drew a
second, smaller dashed rectangle inside it captioned "bowl boundaries
unknown," sized by an arbitrary 70%/84% shrink with no source and no
relationship to the real containment check. That was actively misleading —
it made the *known* outer boundary look uncertain by putting an "unknown"
label next to a fake shape beside it. Removed; see
`src/components/InstallationDiagramPlan.tsx`.

## 2. Physics of the jet — and what the model deliberately does not claim

The research (`docs/ergonomics-and-standards.md` §11) confirms **no
manufacturer or standard publishes the aerator's exit angle or initial jet
velocity** for any of the 10 researched faucet models. A true ballistic
trajectory (horizontal drift = exit velocity × fall time) cannot be computed
without those two inputs — so the model does not pretend to. Fabricating a
plausible-looking exit angle would violate the project's core rule against
invented numbers.

Instead the model makes one declared, physically-reasonable simplification,
stated explicitly wherever it's used in the UI:

> **Assumption A — vertical fall.** Basin-mixer spouts are designed so the
> aerator discharges water essentially straight down (this is the entire
> point of `spoutProjection` as a manufacturer spec — it's the *static*
> horizontal offset of the outlet from the mounting point, not a launch
> parameter). The model therefore treats the landing point's horizontal
> position as equal to the outlet's horizontal position:
>
> `landingY = faucetMountY + spoutProjection`
>
> This is a geometric placement, not a projectile-motion integration — there
> is no `t = sqrt(2h/g)` step, because there is no sourced horizontal
> velocity to multiply it by.

The vertical **drop height** (`spoutHeight`, sourced per-model from hansgrohe
directly and GROHE at lower confidence) still matters ergonomically even
without trajectory physics — it governs splash/bounce risk on impact. For
that, the model uses the two sourced heuristic bounds from
§9 of the research (not a physics derivation, explicitly labeled `heuristic`):

- `heuristic-spout-height-comfort`: 100–200 mm is the comfort range.
- `heuristic-max-splash-drop`: ≤250 mm is the ceiling before splash risk is
  flagged.

**Limitation, stated plainly**: if two faucets have identical `spoutHeight`
and `spoutProjection` but different real aerator angles or flow shaping
(e.g. one has a laminar-flow aerator, one doesn't), this model cannot tell
them apart — that data was not published by any researched manufacturer. The
geometry/ergonomics verdicts below are therefore a **necessary, declared
idealization**, not a CFD simulation.

**User-adjustable jet angle.** The calculator exposes an optional exit-angle
input (`jetAngleDeg`, degrees from vertical, default 0°) so a user who knows
their actual fixture leans off-vertical can explore that what-if. It extends
Assumption A with a straight-line drift term:
`landingY = faucetMountY + spoutProjection + spoutHeight × tan(angle)`. This
is still not ballistic physics (no gravity integration, no velocity) — just
a linear geometric extrapolation of "the jet exits at this angle and this
height, where does a straight line hit the bottom plane." It is always
labeled `heuristic` in the UI and explanation panel, and defaults to 0°
(reducing exactly to the original formula) rather than a fabricated typical
value, since no source publishes a typical angle either.

## 3. Target zone

`target_zone` is the Y-range (depth from rear edge) within which the landing
point should fall, together with the drain position when known. It is built
from three layers, most-specific first — never a single made-up constant:

1. **Bowl-geometry layer (best, rarely available):** if `drainPositionY` is
   known for the specific basin, target zone is centered on it. In practice
   this is `null` for every model in the current catalog (see research §11)
   — this layer exists for when manufacturer CAD data becomes available.
   The **diagrams** (not the compatibility calculation) still render a drain
   marker in this case, at the geometric center of the bowl footprint —
   most wash basins are designed with a center drain — always dashed and
   labeled "position unknown," never presented as a measured value.
2. **Heuristic industry-practice layer (used for the MVP):**
   `heuristic-target-zone-inset-min` (127 mm) /
   `heuristic-target-zone-inset-max` (254 mm) — "past the inner rim, toward
   the drain" — combined with the basin's own `bowlDepth` when known to
   convert the heuristic's *inches-past-rim* framing into an actual Y-range:
   - `min = frontInnerRimY - 254mm` (deepest acceptable point)
   - `max = frontInnerRimY - 127mm` (closest-to-front acceptable point)
   - `preferred = midpoint`
   Where `bowlDepth` is unknown, the zone is expressed as "N mm from the
   rear edge is unknown without bowl depth" and the UI shows a data-quality
   warning instead of guessing bowl depth.
3. **Regulatory constraint layer:** where a `mandatory` rule bounds a related
   quantity (e.g. UA's ≤300 mm max faucet-to-front-edge for the accessibility
   profile, DE's ≤400 mm), it tightens the zone's `max` bound when that
   jurisdiction profile is active. Mandatory rules only ever *constrain*
   (narrow) the heuristic zone — they never *widen* it beyond what geometry
   allows, and they are shown separately in the compatibility breakdown, not
   merged silently into the heuristic number.

`target_zone = { minimum, preferred, maximum }`, each an optional Y value in
mm from the rear edge — `null` fields where a layer couldn't be computed.

## 4. Compatibility model — five independent axes

Per the project rules, this is **not** a single score. Five independent
checks, each with its own verdict (`ok` / `warning` / `fail` / `unknown`):

| Axis | What it checks | Inputs | Can it fail hard? |
|---|---|---|---|
| **Geometry** | Does the computed landing point (§2) fall within the basin's bowl footprint at all? | `basin.width/depth`, `bowlWidth/bowlDepth` (if known), `landingY` | Yes — landing outside the bowl footprint is a hard geometric fail |
| **Ergonomics** | Is the landing point within `target_zone` (§3)? Is `spoutHeight` within the comfort range or over the splash ceiling? | `target_zone`, `spoutHeight` heuristics | Warning only — heuristic-sourced, never `mandatory` |
| **Standards** | Do basin height / faucet height / faucet-to-front-edge distance satisfy the *active jurisdiction profile's* `mandatory`/`recommended` rules from `standards.json`? | User-selected jurisdiction (`UA`/`DE`/`professional`), basin height, faucet-to-edge distance | Yes for `mandatory` rules in the active profile; `recommended` rules only warn |
| **Manufacturer** | Does the faucet's model line have a stated ComfortZone/compatibility note for this basin? | `faucet.recommendedBasinModels` (currently `null` for all catalog entries — no manufacturer in the research published a cross-brand compatibility table) | Never fails — absence of data renders `unknown`, not a failure |
| **Data quality** | How much of the computation relied on `null`-backed heuristics vs. real per-model sourced values? | Count of `null` fields used as heuristic fallbacks across the other four axes | Not a pass/fail axis — a transparency indicator (`🟢`/`🟡`/`🔴`) |

Each axis's verdict is computed independently and rendered independently in
the UI (`docs` §16–17 of the original brief) — they are never averaged or
combined into one number.

## 5. Algorithm (calculation engine, pure functions — see `src/calculator/`)

```
calculate(basin, faucet, installationType, jurisdictionProfile, overrides):
  1. resolve geometry inputs (§1) — basin dims, faucet mount Y, spout height/projection
     — apply user overrides (interactive sliders, §19 of the brief) on top of catalog data
  2. compute landingY (§2, Assumption A) — flag `insufficient-data` if faucetMountY unknown
     and no override supplied
  3. compute target_zone (§3) from whichever layer has data
  4. geometry axis: is landingY within [rearEdge, frontEdge] and within bowl width? (§4)
  5. ergonomics axis: is landingY within target_zone? is spoutHeight in comfort range?
  6. standards axis: for each usedInEngine rule in the active jurisdiction —
     compare basin height / faucet-to-edge distance against rule.value {min,max,nominal}
  7. manufacturer axis: look up faucet.recommendedBasinModels for basin.id (currently
     always `unknown` — no source data)
  8. data-quality axis: tally which inputs above came from a real Sourced value
     (confidence A/B/C) vs. a heuristic fallback vs. a user override
  9. return { geometry, ergonomics, standards, manufacturer, dataQuality, explanation[] }
     — explanation[] is a flat list of {rule, sourceUrl, computedValue} used for the
     "why this result" UI panel (brief §27)
```

No step invents a threshold that isn't already a `StandardRule` row. Where a
step has no rule to check against, it returns `unknown`, not a guess.
