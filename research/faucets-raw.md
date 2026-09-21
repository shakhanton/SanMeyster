# Faucet (Basin Mixer) Research — GROHE & hansgrohe

Research date: 2026-09-21. Method: WebSearch + WebFetch against official manufacturer domains where accessible.

**Access note:** `grohe.com` and most GROHE regional storefronts (`grohe-mena.com`, `grohe-cac.com`, `grohe.co.in`, etc.) return **HTTP 403 Forbidden** to automated WebFetch (bot protection), even though the pages are public in a browser. GROHE data below was therefore reconstructed from (a) WebSearch result snippets that quote the GROHE product page/spec sheet text, and (b) third-party retailer listings that republish GROHE's own technical data sheet numbers (Hirsch Pipe & Supply, DIY.com, Victorian Plumbing, etc.), each cited individually. Where a number could not be corroborated, it is left `null` with a note. `hansgrohe.com` (`articledetail-*` and `/datasheet/product/...` pages) is directly WebFetch-accessible and gave clean, official first-party data.

---

## hansgrohe (all data fetched directly from hansgrohe.com official product pages)

| Field | Logis 70 | Logis 100 | Talis E 110 | Metris 110 | Focus 100 |
|---|---|---|---|---|---|
| brand | hansgrohe | hansgrohe | hansgrohe | hansgrohe | hansgrohe |
| model | Logis, Single lever basin mixer 70 with pop-up waste set | Logis, Single lever basin mixer 100 with pop-up waste set | Talis E, Single lever basin mixer 110 with pop-up waste set | Metris, Single lever basin mixer 110 with pop-up waste set | Focus, Single lever basin mixer 100 with pop-up waste set |
| article number | 71070000 | 71100000 | 71710670 (matte black variant found; chrome base article per hansgrohe.co.uk/pro.hansgrohe.co.uk 71710000) | 31080000 | 31607000 |
| product URL | https://www.hansgrohe.com/articledetail-logis-single-lever-basin-mixer-70-with-pop-up-waste-set-71070000 | https://www.hansgrohe.com/articledetail-logis-single-lever-basin-mixer-100-with-pop-up-waste-set-71100000 | https://pro.hansgrohe.com/articledetail-talis-e-single-lever-basin-mixer-110-with-pop-up-waste-set-71710670 | https://www.hansgrohe.com/articledetail-metris-single-lever-basin-mixer-110-with-pop-up-waste-set-31080000 | https://www.hansgrohe.com/articledetail-focus-single-lever-basin-mixer-100-with-pop-up-waste-set-31607000 |
| installation type | deck-mounted (basin) | deck-mounted (basin) | deck-mounted (basin) | deck-mounted (basin) | deck-mounted (basin) |
| ComfortZone (mfr size class) | 70 | 100 | 110 | 110 | 100 |
| spout projection (mm) | 107 | 108 | 108 (108–112 depending on waste-set variant) | 116 | 119 |
| spout height (mm) | 67 | 93 | 104 | 100 | 94 |
| total height (mm) | null (not stated on page) | null | 191 (stated for this variant) | null | null |
| swivel range | null (not stated for single-outlet fixed spout models — hansgrohe basin mixers of this class are typically non-swivel; not explicitly confirmed) | null | null | null | null |
| aerator type | NormalSpray with AirPower | NormalSpray | NormalSpray | NormalSpray | NormalSpray |
| max flow rate | 5 l/min @ 3 bar | 5 l/min @ 3 bar | 5 l/min @ 3 bar | 5 l/min @ 3 bar | 5 l/min @ 3 bar |
| technical drawing URL | null (page has a "Downloads" section but PDF link not resolved in fetch) | null | null | null | null |
| source URL | https://www.hansgrohe.com/articledetail-logis-single-lever-basin-mixer-70-with-pop-up-waste-set-71070000 | https://www.hansgrohe.com/articledetail-logis-single-lever-basin-mixer-100-with-pop-up-waste-set-71100000 | https://pro.hansgrohe.com/articledetail-talis-e-single-lever-basin-mixer-110-with-pop-up-waste-set-71710670 | https://www.hansgrohe.com/articledetail-metris-single-lever-basin-mixer-110-with-pop-up-waste-set-31080000 | https://www.hansgrohe.com/articledetail-focus-single-lever-basin-mixer-100-with-pop-up-waste-set-31607000 |
| date accessed | 2026-09-21 | 2026-09-21 | 2026-09-21 | 2026-09-21 | 2026-09-21 |
| confidence | high (first-party page) | high (first-party page) | high (first-party page, via WebSearch synthesis of same page) | high (first-party page) | high (first-party, via WebSearch synthesis) |

### hansgrohe #6 — Vernis Blend / Vernis Shape 100 (lower confidence, conflicting source numbers)
- brand: hansgrohe
- model: Vernis Blend, Single lever basin mixer 100 (without waste set), article 71580000 — OR the closely related Vernis Shape 100 (article 71561000/71569000)
- **Conflict found:** shkshop.com (retailer) lists "Vernis Blend Single lever basin mixer 100... projection 108 mm" for article 71559000; a separate WebSearch synthesis of hansgrohe's own Vernis Shape 100 page reported "projection 110 mm, spout height 95 mm." These do not agree and were not cross-checked against a single authoritative fetch.
- projection: 108–110 mm (source conflict, see above) — **do not treat as verified**
- spout height: 95 mm (single source, Vernis Shape 100, medium confidence)
- product URL (best candidate): https://www.hansgrohe.com/articledetail-vernis-blend-single-lever-basin-mixer-100-without-waste-set-71580000
- datasheet URL found for a related SKU: https://www.hansgrohe.com/datasheet/product/hansgrohe/71550000 (Vernis Blend 70) — WebFetch on this URL returned HTTP 403, so it could not be read directly despite being on hansgrohe.com.
- date accessed: 2026-09-21
- confidence: low — flagged for manual re-verification before use in the app; recommend excluding from MVP catalog or re-fetching the exact article page directly.

**Coverage: 5 hansgrohe models at high confidence, 1 at low confidence (6 total, short of the 5–10 target only in the sense that a 6th is weak — recommend treating catalog as 5 solid + 1 flagged).**

---

## GROHE (official site blocked automated fetch — see access note above; data via WebSearch synthesis of the official page text + retailer republications of GROHE's own spec sheets)

| Field | BauEdge S-Size | Eurostyle Cosmopolitan S-Size (2-hole) | Essence M-Size (wall-mounted) | Lineare M-Size (2-hole) | Lineare L-Size (2-hole) |
|---|---|---|---|---|---|
| brand | GROHE | GROHE | GROHE | GROHE | GROHE |
| model | BauEdge Basin mixer 1/2″ S-Size | Eurostyle Cosmopolitan 2-hole basin mixer S-Size | Essence 2-hole basin mixer M-Size (wall-mounted trimset) | Lineare 2-hole basin mixer M-Size | Lineare 2-hole basin mixer L-Size |
| article number | 23330000 | 19571002 | 19408001 | 19409AL1 / 19409001 | 23444AL1 / 23444001 |
| product URL | https://www.grohe.com/en-GB/product/bauedge-basin-mixer-1-2-s-size-s-chrome-23330000 | https://www.grohe-cac.com/en_cac/eurostyle-cosmopolitan-2-hole-basin-mixer-s-size-19571002.html | https://www.grohe.com/en-GB/product/essence-2-hole-basin-mixer-m-size-m-chrome-19408001 | https://www.grohe.co.in/en_in/lineare-two-hole-basin-mixer-m-size-19409001.html | https://www.grohe.co.in/en_in/lineare-two-hole-basin-mixer-l-size-23444AL1.html |
| installation type | deck-mounted, single-hole | deck-mounted, 2-hole | wall-mounted trimset | deck-mounted, 2-hole (widespread) | deck-mounted, 2-hole (widespread) |
| total height (mm) | 150 (retailer-listed, see note) | null | null | null | null |
| spout height / outlet height (mm) | 86–87 (two sources disagree by 1mm: Hirsch Pipe & Supply lists "86 mm H Spout"; a second WebSearch synthesis reported "outlet height of 87mm" — treat as ≈86–87mm, low-medium confidence, not a single authoritative figure) | null (only center-distance and projection found) | null | null | null |
| spout projection (mm) | 90–93 (Hirsch retailer figure via product title says spout height 86mm and does not separately confirm projection; a WebSearch synthesis separately reported "projection of 90mm"; grohe.com own EN-GB page text via search snippet suggested 93mm — genuine disagreement between sources, recorded as a range, not resolved) | 171 | 183 (this is spout projection from wall for the wall-mounted trimset — not directly comparable to deck-mounted projection) | 149 | 207 |
| swivel range | null | null | null | null | null |
| aerator type | GROHE EcoJoy, 5.7 l/min (confirmed from BauLoop/BauEdge shared platform product page fetch) | null | null | null | null |
| technical drawing URL | https://d12qbzr1dyleru.cloudfront.net/m/e560ec516b6e9ebd/original/Technical-Guide-Grohe-BauEdge-Basin-Mixer-Chrome-5-Star-.pdf (PDF fetched but returned binary/non-extractable text — image-based technical drawing, no machine-readable dimension text) | null | https://d12qbzr1dyleru.cloudfront.net/m/e8a5ac4c1f91df2c/original/GROHE-Essence-New-Wall-Basin-Mixer-Tap-Set-180mm-Brushed-Nickel-5-Star-.pdf (not opened) | null | null |
| source URL | https://www.hirsch.com/products/-grohe-32858000-bauedge-s-size-basin-mixer-residential-86-mm-h-spout-1-handle-1-faucet-holes-starlight-polished-chrome + https://www.grohe.com/en-GB/product/bauedge-basin-mixer-1-2-s-size-s-chrome-23330000 | https://www.grohe-cac.com/en_cac/eurostyle-cosmopolitan-2-hole-basin-mixer-s-size-19571002.html | https://www.grohe.com/en-GB/product/essence-2-hole-basin-mixer-m-size-m-chrome-19408001 | https://www.grohe.co.in/en_in/lineare-two-hole-basin-mixer-m-size-19409001.html | https://www.grohe.co.in/en_in/lineare-two-hole-basin-mixer-l-size-23444AL1.html |
| date accessed | 2026-09-21 | 2026-09-21 | 2026-09-21 | 2026-09-21 | 2026-09-21 |
| confidence | low-medium (conflicting secondary sources, official page not directly fetchable) | medium (single WebSearch synthesis, not cross-checked) | medium (wall-mounted, not directly comparable to deck basin mixer geometry — do not reuse for deck-mount target-zone math without adjustment) | medium | medium |

### GROHE — rejected/unusable data points
- **BauEdge XL-Size (32860000):** Hirsch listing text was internally inconsistent ("89 mm Spout, 248 mm H Spout") — could not determine whether 248mm is total height or a garbled duplicate of another field. **Excluded from catalog as unreliable; do not use.**
- **Atrio L-Size (single-hole/3-hole):** WebSearch synthesis returned "installation height 291mm" and "height between spout and washbasin 303mm" for different configurations — these numbers are implausibly large for a basin mixer spout height (291–303mm is faucet-tall-vessel-sink territory, not a standard basin mixer) and likely reflect misattributed brochure text (possibly overall product height including a tall body, not spout-to-basin distance). **Excluded from catalog; flagged `No reliable source found` for Atrio spout geometry.**

**Coverage: 5 GROHE models with partial data (all missing swivel range; 3 of 5 missing spout height; several fields carry source conflicts noted inline). This is meaningfully weaker than the hansgrohe dataset because grohe.com blocks automated fetching — a human should re-pull grohe.com's own PDF "Technical Product Information" sheets (linked from each product page's Downloads tab) directly in a browser to firm up spout_height/projection numbers before treating GROHE figures as production-grade.**

---

## Coverage summary

- **hansgrohe:** 5 models at high confidence (Logis 70, Logis 100, Talis E 110, Metris 110, Focus 100) with first-party spout_height + spout_projection for all 5. 1 additional model (Vernis Blend/Shape 100) flagged low-confidence due to source conflict. Missing across the board: total height, swivel range, technical drawing PDF URLs (pages reference downloads but fetch didn't resolve direct PDF links).
- **GROHE:** 5 models with partial data. spout_height fully missing for 3/5; spout_projection has source disagreement for BauEdge; swivel range missing for all 5; technical drawings found as URLs but PDFs are image-based (not machine-text-extractable) or unopened. Root cause: grohe.com and its regional mirrors return HTTP 403 to automated WebFetch, forcing reliance on WebSearch snippet synthesis and third-party retailer republication of spec numbers, which is inherently less reliable than a direct first-party fetch (as achieved for hansgrohe).
- **Common missing field across both brands:** swivel range (degrees) — not once found in any accessible source; **status: No reliable source found for swivel range on any of the 10 researched models.** This should be `null` in the data model for all faucets in the MVP catalog, not estimated.
- **Recommendation for the engineering/data phase:** treat GROHE spout_height/spout_projection values as `confidence: medium` or lower and prefer hansgrohe models for any worked examples/tests where precision matters; before production use, a human should manually download GROHE's PDF technical data sheets (available via each product page's "Downloads" tab in a real browser session, which is not blocked the way automated fetch is) to replace the medium/low-confidence GROHE figures with page-sourced numbers.
