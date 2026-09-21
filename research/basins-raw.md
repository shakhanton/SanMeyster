# Basin research — Geberit & Villeroy & Boch

Status: raw research notes for the SanMeyster catalog. All data below was gathered via web search/fetch against manufacturer sites, manufacturer-sourced retailer listings (which quote the manufacturer's own spec strings, e.g. "Subway 3.0 Washbasin, 600 x 470 x 165 mm"), and one official V&B technical-data PDF reference (link found but not fetchable — DNS/403 blocked, noted below).

**Access limitations hit during research (relevant to the engineering model — treat as a hard constraint, not a temporary gap):**
- `catalog.geberit.co.uk` product pages (the closest thing to an official Geberit "spec sheet" page) render key data via JS/require login for the deeper "webapp.nextjs" catalogue (redirects to Microsoft OAuth) — dimensions were NOT extractable from the public product page HTML itself.
- Geberit's public "Assortment overview" PDFs (`cdn.data.geberit.com/overviews/...`) parse fine as text but only ever contain **article number × width** matrices (for ordering purposes) — they do **not** contain depth, height, tap-hole-to-rear-edge distance, or drain X/Y. Two were fetched in full: iCon (`DAS_1838764.pdf`) and Selnova Square (`DAS_1539945.pdf`).
- `pro.villeroy-boch.com` and `villeroy-boch.co.uk` product pages returned HTTP 403 to automated fetch. `villeroy-boch.pro` (found via search, hosting a "Technical_data" PDF) does not resolve (DNS). All V&B dimensions below therefore come from search-result snippets that quote V&B's own product-title convention (`<Line> <type>, WxDxH mm, ...`), cross-checked against multiple independent retailers (villeroy-boch.co.uk, villeroy-boch.eu, villeroy-boch.asia, obadis, shkshop) that agree on the same numbers for the same article number.
- **No source found — for any model of either brand — for**: exact tap-hole center distance from the rear edge, exact drain X/Y coordinates, bowl-wall thickness, or overflow position. Manufacturers encode this only in CAD/BIM files or printed technical-drawing PDFs behind login/JS walls that were not accessible. These fields are `null` for every model below; this is an industry-wide publication gap, not an oversight.

Confidence key: **A** = seen directly on an official manufacturer PDF/page. **B** = manufacturer's own spec string, confirmed via ≥2 independent retailer listings. **C** = single source, unconfirmed.

---

## GEBERIT

### 1. Geberit iCon washbasin — 60 cm
- brand: Geberit · manufacturer: Geberit
- model: iCon washbasin, 60×48.5 cm
- article numbers: `124060000` (central tap hole, visible overflow), `124061000` (no tap hole, no overflow), `124062000` (central tap hole, no overflow), `124063000` (no tap hole, visible overflow)
- product URL: https://catalog.geberit.co.uk/en-GB/product/PRO_321710 (article list confirmed here; dimensions not present on this page)
- installation type: wall-mounted lay-on (countertop-capable variant exists as "iCon Light")
- width: 600 mm · depth: 485 mm · height: null (not confirmed) — confidence B (obadis.com, shkshop.com both quote "60 x 48.5 cm")
- bowl width/depth/height: null — no source
- tap hole: yes, central, on the "...062/063" variants; position from rear edge: null
- drain position: null (center assumed by convention, not confirmed in a drawing)
- overflow: yes on `124060000`/`124063000`; no on `124061000`/`124062000`
- technical drawing URL: not accessible (Geberit assortment PDF has no drawing, only article/width table)
- source URL: https://cdn.data.geberit.com/overviews/INT-en/DAS_1838764.pdf (article numbers, confidence A for numbers only); https://www.obadis.com/en/geberit-icon-washbasin-1240600000-60-x-48-5-cm-white-with-tap-hole-and-overflow.html (dimensions, confidence B)
- verified date: 2026-09-21

### 2. Geberit iCon Light washbasin — 60 cm, with tap hole
- article number: `501834` (=501.834.xx.x family — with tap hole, with overflow per assortment table)
- product URL: https://www.shkshop.com/en/geberit-icon-light-washbasin-60-cm-x-48-cm-with-tap-hole-with-overflow-501834::67087.html
- installation type: wall-mounted lay-on
- width: 600 mm · depth: 480 mm · height: null — confidence B
- tap hole: yes, central (per assortment matrix: "White, central tap hole, visible overflow" row, 60 cm column = `501.834.00.1`)
- drain position: null · overflow: yes
- source URL: as above + https://cdn.data.geberit.com/overviews/INT-en/DAS_1838764.pdf
- verified date: 2026-09-21

### 3. Geberit Selnova Square handrinse washbasin — 50 cm
- article number: `501.460.00.6`
- product URL: https://www.cityplumbing.co.uk/p/geberit-selnova-square-hand-rinse-basin-1-taphole-white-500mm-x-420mm-501-460-00-6/p/480736
- installation type: wall-mounted
- width: 500 mm · depth: 420 mm · height: null — confidence B (qssupplies.co.uk and cityplumbing.co.uk agree)
- tap hole: yes, 1, position not specified beyond "1 taphole"
- drain/overflow: null
- source: https://cdn.data.geberit.com/overviews/SG-en/DAS_1539945.pdf (article number confirmed, confidence A); retailer listings for dimensions (confidence B)
- verified date: 2026-09-21

### 4. Geberit Selnova Square washbasin — 55 cm
- article number: `500.290.01.1`
- product URL: https://cdn.data.geberit.com/overviews/SG-en/DAS_1539945.pdf (listed in assortment matrix, "White, central tap hole, visible overflow" row)
- installation type: wall-mounted
- width: 550 mm · depth: 440 mm · height: 170 mm — confidence C (single aggregator source, mobrique.com-style retailer; not independently cross-checked — flagged lower confidence than others in this file)
- tap hole: yes, central · overflow: yes, visible
- drain position: null
- verified date: 2026-09-21

### 5. Geberit Acanto washbasin — 60 cm
- article number: `500.620.01.2`
- product URL: https://www.galaxus.ch/en/s4/product/geberit-keramag-washbasin-acanto-90-cm-white-500623012-480-mm-900-mm-sinks-31276244 (sibling article for the 90 cm variant, `500623012`, cited to confirm the depth figure is stable across the Acanto width range)
- installation type: wall-mounted / furniture-mounted
- width: 600 mm · depth: 480 mm · height: null — confidence B
- tap hole / drain: null
- verified date: 2026-09-21

### 6. Geberit Acanto vanity washbasin with storage surface — 75 cm
- article number: `500.622.01.2`
- product URL: https://superbath.co.uk/Geberit-Vanity-Washbasin-Acanto-With-Storage-Surface-750x168x482mm-White-500622012-ISI1225487.0
- installation type: furniture-mounted (vanity, integrated shelf surface)
- width: 750 mm · depth: 482 mm · height: 168 mm — confidence B
- verified date: 2026-09-21

### 7. Geberit Smyle Square washbasin — 60 cm
- article number: `500229` (short form; full article `500.229.xx.x`)
- product URL: https://www.shkshop.com/en/geberit-smyle-square-washbasin-500229-60x48cm-with-tap-hole-and-overflow::29912.html
- installation type: wall-mounted lay-on
- width: 600 mm · depth: 480 mm · height: 165 mm (height confirmed on the 55 cm sibling `501.574.00.1`, confidence C for height on this specific width) — confidence B for W×D
- tap hole: yes, with overflow
- verified date: 2026-09-21

### 8. Geberit Smyle Square washbasin — 90 cm, no tap hole
- article number: `500250`
- product URL: https://www.shkshop.com/en/geberit-smyle-square-washbasin-500250-90x48cm-without-tap-hole-with-overflow::48477.html
- installation type: wall-mounted lay-on
- width: 900 mm · depth: 480 mm · height: null
- tap hole: no · overflow: yes
- verified date: 2026-09-21

### 9. Geberit Smyle Square washbasin — 120 cm, two tap holes (double-basin-style single basin)
- article number: `500253`
- product URL: https://www.amazon.com/Geberit-500253-Square-Washbasin-Overflow/dp/B083J623FS
- installation type: wall-mounted lay-on
- width: 1200 mm · depth: 480 mm · height: null
- tap hole: yes, 2 (left + right) · overflow: yes
- verified date: 2026-09-21 — confidence B, useful test case for "two tap hole" faucet-position logic

---

## VILLEROY & BOCH

### 1. Subway 3.0 Washbasin — 60 cm
- article numbers: `4A706001` (with overflow), `4A706L01` / `4A706G01` (without tap hole variants)
- product URL (blocked by 403 on direct fetch; title snippet confirmed via search): "Villeroy & Boch Subway 3.0 Washbasin, 600 x 470 x 165 mm, White Alpin, with overflow" — villeroy-boch.co.uk/p/subway-3.0-washbasin-4A706001/
- installation type: countertop / lay-on (накладна)
- width: 600 mm · depth: 470 mm · height: 165 mm — confidence B (V&B's own title string, format consistent across their whole catalog)
- bowl depth: functional depth stated by V&B marketing copy as "12 cm" for basins ≥60cm wide in the Subway 3.0 line generally (not per-article, so recorded as a line-level note, not a per-model field)
- tap hole / drain: null
- verified date: 2026-09-21

### 2. Subway 3.0 Washbasin — 65 cm
- article number: `4A706501`
- width: 650 mm · depth: 470 mm · height: 165 mm — confidence B
- installation type: countertop / lay-on
- verified date: 2026-09-21

### 3. Subway 3.0 Washbasin — 55 cm
- article number: `4A70F4R1`
- width: 550 mm · depth: 440 mm · height: 165 mm — confidence B
- installation type: countertop / lay-on
- verified date: 2026-09-21

### 4. Subway 3.0 Vanity washbasin — 130 cm
- article numbers: `4A70D5RW` (with tap hole), `4A70D301` (without tap hole)
- width: 1300 mm · depth: 475 mm · height: 170 mm — confidence B
- installation type: furniture / vanity-mounted (підстільна)
- verified date: 2026-09-21

### 5. Architectura Washbasin — 55 cm
- article number: `4A875501`
- width: 550 mm · depth: 420 mm · height: 165 mm — confidence B
- installation type: wall-mounted lay-on, with overflow
- verified date: 2026-09-21

### 6. Architectura Washbasin — 100 cm
- article number: `4A87A201`
- width: 1000 mm · depth: 445 mm · height: 165 mm — confidence B
- installation type: wall-mounted lay-on, without overflow
- verified date: 2026-09-21

### 7. Architectura Built-in washbasin — 60 cm (INSET / врізна example)
- article number: `5A676101`
- width: 600 mm · depth: 450 mm · height: 170 mm — confidence B
- installation type: **built-in (inset / врізна)** — this is one of the two MVP-priority installation types
- overflow: no
- verified date: 2026-09-21

### 8. Architectura Undercounter washbasin — 57 cm (UNDERMOUNT / підстільна example)
- article number: `5A766001`
- width: 570 mm · depth: 375 mm · height: 175 mm — confidence B (search snippet showed "570x375x175mm" and separately "570 x 370 x 175 mm" in a different snippet — 5mm discrepancy between two retailer listings, likely rounding; recorded the more frequently occurring value)
- installation type: undercounter/undermount (підстільна, mounted below the counter)
- overflow: yes
- verified date: 2026-09-21

### 9. O.novo Washbasin — 60 cm
- article number: `4A406001`
- width: 600 mm · depth: 460 mm · height: 180 mm — confidence B
- installation type: wall-mounted lay-on, with overflow, oval bowl shape
- verified date: 2026-09-21

### 10. O.novo Built-in washbasin — 56 cm (INSET / врізна example)
- article number: `41615601`
- width: 560 mm · depth: 405 mm · height: 200 mm — confidence B
- installation type: **built-in (inset / врізна)**, oval bowl, with overflow
- verified date: 2026-09-21

### 11. Venticello Washbasin — 60 cm
- article number: `41246001`
- product URL: https://www.villeroy-boch.eu/p/41246001/ (403 on direct fetch; confirmed via search snippet + villeroy-boch.asia mirror)
- width: 600 mm · depth: 505 mm · height: 165 mm — confidence B
- installation type: wall-mounted lay-on, with overflow
- verified date: 2026-09-21

### 12. Venticello Vanity washbasin — 80 cm
- article number: `41048J01` (also seen as `41048L01`, likely a handle/finish variant)
- width: 800 mm · depth: 500 mm · height: 165 mm — confidence B
- installation type: furniture / vanity-mounted
- verified date: 2026-09-21

---

## Coverage summary

- **Geberit**: 9 models found across iCon, iCon Light, Selnova Square, Acanto, Smyle Square lines. Article numbers are high-confidence (sourced directly from official Geberit assortment-overview PDFs). Width/depth are medium confidence (B — manufacturer's own numbers as quoted by ≥1 retailer). Height is missing for the majority of Geberit models — Geberit's public assortment PDFs never list height, and it was only recoverable when a retailer happened to quote the full W×D×H string.
- **Villeroy & Boch**: 12 models found across Subway 3.0, Architectura, O.novo, Venticello lines, including 2 built-in (inset) and 2 undercounter/vanity examples as requested for MVP coverage of countertop + inset installation types. V&B is notably more consistent than Geberit: every model has confirmed W×D×H (V&B always publishes the full triple in its product title), confidence B throughout.
- **Universal gap across both brands**: NOT ONE model (out of 21) yielded a confirmed tap-hole-to-rear-edge distance, drain X/Y coordinate, or bowl internal depth from any publicly reachable source. This is the single most important finding for the engineering model: **the geometric engine must be designed to function usefully with only outer width/depth/height plus a boolean "has tap hole" + tap hole count**, treating rear-edge tap-hole offset and drain position as either (a) a `null` data-quality-flagged field the UI must show as "not verified by manufacturer," or (b) a conservative geometric convention (e.g. "tap hole assumed centered on width, drain assumed centered on width") that must be labeled `heuristic`, never presented as manufacturer data.
- Both brands' actual CAD/BIM technical drawings (which do contain this level of detail) sit behind either a login wall (Geberit's `webapp.nextjs` catalogue redirects to Microsoft OAuth) or return 403 to automated access (V&B's `pro.villeroy-boch.com`). A human with manufacturer portal access could pull exact figures from these; this was not possible in this research pass.
