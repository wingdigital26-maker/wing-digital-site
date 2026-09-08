# Wing Digital site — design brief (2026-09-06)

Rebuild of https://wingdigital26-maker.github.io/wing-digital-site/ to a
"$50,000 agency site" standard. Run under the `design-loop` skill.

## The ask

Jack: "make it better, less AI-like, make it look like a $50,000 website."

## Decisions locked with Jack (2026-09-06)

| Question | Answer |
|---|---|
| Direction | **Editorial authority** — serif display, generous white space, asymmetric photo splits, proof laid out like a magazine feature |
| Scope | **Full rebuild, all pages** (17 html files, one shared stylesheet) |
| Fixed / untouchable | **Nimbus mascot stays. Blue accent #2757E6 stays.** |
| Open to change | Sigil intro, palette beyond the blue, typography, layout, copy |

## STAGE 1 — References (measured, not eyeballed)

One reference is a copy. Two crossed with Wing's own brand is a style.
Both references below were loaded in a real browser and their computed styles
extracted, so these are measurements and not impressions.

### Reference A — Pentagram (pentagram.com)

Chosen for: restraint and authority. The most credible design consultancy on
earth sells itself with almost no decoration. That is the tone a services
business needs.

Measured:

- **One typeface** ("Plain"), 622 text nodes. No display/body pair at all.
- **Tight type scale**: 13 / 16 / 19 / 32 / 52px. Only five sizes on the page.
- **Display tracking** -1.04px at 52px = **-2%**. Line-height 54.6/52 = **1.05**.
- **Body** 16px, and a *lot* of 13px — small text used confidently, not apologetically.
- **Radius 4px** dominant (232 uses). Pills (9999px) used exactly 11 times.
- **Ink is #1A1A1A**, not black. Muted text #767676. No pure black anywhere.
- Colour is carried almost entirely by the work photography, not by the UI.

Borrowing: the tight size ladder, -2% display tracking, 4px photo radius,
near-black-not-black ink, and the confidence to use 13px labels.

### Reference B — COLLINS (wearecollins.com)

Chosen for: warmth and the serif/sans pairing. Proves an editorial site can be
warm without being soft, and shows a real radius *scale* rather than one value.

Measured:

- **Three families**: Graphik (sans, 38 nodes), Portrait Text (serif, 7), Times (9).
  Serif is used sparingly — it is a seasoning, not the base.
- **Ink is #140700** — a *warm* near-black with red in it, not neutral grey.
  Muted #5E5855 (warm grey). Paper #F8F8F7.
- **Radius scale 4 / 16 / 96 / 160px** — four distinct values with clear jobs.
- **Display** 72px / line-height 72px = **1.0 exactly**, tracking -1.44px = **-2%**.
- **Body** 16 / 20.8 = 1.3, tracking -0.16px = -1%.
- Labels at 12px and 14px, line-height 1.0, tracking -0.16px.

Borrowing: the warm ink, the multi-step radius scale, display line-height 1.0,
and serif-as-seasoning rather than serif-everywhere.

### What stays original to Wing

Not borrowed, must be ours: the mark and sigil, the blue accent and how it is
rationed, Nimbus, all photography, all copy, the "ledger row" service layout,
and the proof/dashboard sections. The references supply rhythm and restraint.
They do not supply content.

## The slop we are removing

Audited against the tell table. Present on the current site:

| Tell | Where | Fix |
|---|---|---|
| Frosted glass | 11 `backdrop-filter: blur()` rules in style.css | Delete all of them |
| Banned copy | "get started" in index.html | Rewrite |
| En dashes | 2 in index.html, 4 in about.html | Strip (Jack's standing rule) |
| Rule of three | 3 process steps, 3 bars, 3 stats, 3 dashboard shots | Break the count or restructure |
| Playfair Display | The default AI editorial serif | Replace with Fraunces |
| Inter | The default AI UI sans | Replace with Instrument Sans |

`slop_lint.py` also reports `single-typeface` on style.css because the families
are declared via CSS variables it cannot see. That is a lint false positive on
the current file, but the *real* problem is that both fonts chosen are the two
most predictable choices available, which is the actual tell.

## Typography (Stage 6 — licence gate)

| Role | Face | Source | Licence | Commercial use |
|---|---|---|---|---|
| Display | **Fraunces** (variable, opsz/SOFT/WONK) | Google Fonts | SIL OFL 1.1 | Yes, free |
| Body / UI | **Instrument Sans** | Google Fonts | SIL OFL 1.1 | Yes, free |
| Labels / index | **IBM Plex Mono** | Google Fonts | SIL OFL 1.1 | Yes, free |

All three confirmed SIL OFL 1.1, which permits commercial use and web
embedding. No paid licence needed, nothing to buy.

Why these and not the obvious ones: Playfair and Inter are the two faces every
AI-generated site reaches for, which is precisely why they read as AI. Fraunces
carries real optical-size and "wonk" axes so the display type has character at
size; Instrument Sans has more personality in its terminals than Inter without
becoming a costume; IBM Plex Mono gives the numbers and labels editorial
credibility.

## Jack's eight hard rules — how this build satisfies them

1. **Full-viewport hero, transparent header, animated opening** — kept, rebuilt.
2. **Scroll animation only near the top** — one reveal moment, first band only.
3. **Services links to a real hub page** — services.html stays a real page.
4. **No photo reused anywhere** — audit agent is producing the asset-use map.
5. **FAQ on home and about** — both keep FAQ plus FAQPage schema.
6. **~2s branded intro** — the sigil intro is kept and re-timed.
7. **Brand loadout board before personality is final** — `loadout.html`, built and
   shown to Jack before the 17-page rollout. This is the gate.
8. **No phone-number CTAs** — every CTA routes to contact.html. Number lives on
   the contact page and in JSON-LD only.

Plus the mobile chrome budget: header not sticky on phones, one persistent
element maximum, footer under ~700px.

## Stage plan

1. ~~Pick references~~ done, measured above.
2. Build the design system (`style.css`) and `loadout.html`. **Gate: Jack picks.**
3. Rebuild index.html to the locked personality. Pilot before scaling.
4. Roll across the remaining 16 pages.
5. Three parallel judges (brief fidelity / craft precision / slop detection),
   max 4 rounds, logged to `loop-log.md`.
6. Codify `design-dna.md`, then rebuild one section from the DNA alone and diff.
7. Copy de-slop pass via `humanizer` plus a non-Claude model pass.
