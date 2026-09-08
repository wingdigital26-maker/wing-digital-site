# v3 spec — repositioning, backgrounds, dashboards

Read this AND `CONVERSION-SPEC.md` AND `design-dna.md` before editing anything.
`index.html` is the reference build. Everything in `CONVERSION-SPEC.md` still
applies (zero inline styles, no en/em dashes, no banned copy, one h1, canonical
plus og tags, width/height/alt on every image).

**Do not edit** `style.css`, `script.js`, `assets/bg.js`, `verify.py`,
`index.html`, or any file another agent owns. **Do not run git.**

---

## 1. THE REPOSITIONING (the most important part of this job)

Jack's words: *"I want the focus to be not that we make websites, but that we
create an online presence for them through lead generation, SEO, CRMs, web
development. That should be the focus, not really website building."*

So: **a website is one component of the product, not the product.** Any page
that currently reads "we build websites and also do some marketing" is wrong and
must read "we build and run your entire online presence, of which the site is
one part."

**The canonical line** (use it, do not paraphrase into a new one):

> Everything that happens before the phone rings.

**The positioning paragraph**, adapt in tone but never contradict:

> Wing Digital builds and runs the whole online presence for a Dallas-Fort Worth
> business: the search ranking, the website, the content, the outreach list, and
> the CRM that makes sure nobody who calls gets forgotten.

### The four services, reframed

Keep the four filenames (they hold their SEO and their inbound links). Change how
they are framed. The service is the outcome; the deliverable is underneath it.

| # | Frame it as | File | Old label, now retired |
|---|---|---|---|
| 01 | **Get found** — Local SEO | `local-seo.html` | Local SEO |
| 02 | **Get chosen** — Web development | `website-design.html` | Website Design |
| 03 | **Get the lead** — Lead generation and CRM | `lead-generation.html` | Lead Generation |
| 04 | **Stay in front** — Content and social | `social-media.html` | Social Media |

Note the order: **web development is number two, not number one.** That ordering
is the repositioning made visible. Use this order everywhere the four appear
(home ledger, services hub, footer, nav dropdowns, mascot answers).

Rename in visible copy:
- "Website Design" becomes **"Web Development"**
- "Social Media" becomes **"Content and Social"**
- "Lead Generation" becomes **"Lead Generation and CRM"**
- "Local SEO" stays **"Local SEO"**

**CRM is now first-class.** It was barely mentioned. Every lead lands in a CRM
Wing runs, with follow-up, and that is a named part of the offer. Do not invent
a product name, a screenshot, or a feature list for it beyond what
`lead-generation.html` already claims.

### Words to retire

"Website design", "we build websites", "your website, live in two weeks" as a
*headline* claim. Two weeks is still true and still worth saying, but as a
detail inside the web development service, not as the top-line promise.

---

## 2. BACKGROUNDS — one variant per page

`assets/bg.js` is built and working. You add one line of markup, nothing else.

Put this as the **first child** of the page's dark band (`.hero`, `.page-head`
or `.contact`):

```html
<div class="bg" data-bg="VARIANT" aria-hidden="true"></div>
```

and add this script tag immediately **before** `script.js` at the bottom:

```html
<script src="assets/bg.js?v=1"></script>
```

**Variant per page.** This is what stops every page opening the same way, which
was Jack's complaint. Use exactly these:

| Page | `data-bg` | What it is |
|---|---|---|
| index (hero) | `signal` | drifting nodes linking up, with a scan sweep (already done) |
| services + the 4 service pages | `mesh` | perspective grid running to a horizon |
| work, work-jackson-roofing, work-renewal-health | `orbit` | concentric rings with markers riding them |
| blog + the 3 posts | `grid` | fine dot grid with a light moving over it |
| about, testimonials | `flow` | slow horizontal field lines |
| contact, 404 | `pulse` | rings pulsing out from a point |

One `.bg` per page. It only goes on a dark band; never on a light editorial band.
Do not add CSS for it, do not change its opacity, do not add a second one.

---

## 3. DASHBOARDS EVERYWHERE

Jack: *"I want to showcase dashboards whenever we show somebody something."*

Every client we mention should be shown with its dashboard, because the
dashboard is what proves the work happened. Available real assets:

| Asset | What it shows | Client |
|---|---|---|
| `assets/dash-jackson-overview.jpg` | 2,414 businesses on the outreach list, 12 articles published, 11 live pages | Jackson Roofing |
| `assets/dash-jackson-outreach.jpg` | outreach list totals, business types and cities (AGGREGATE ONLY - the named-company rows were cropped off on 2026-09-07 because they expose real third-party businesses) | Jackson Roofing |
| `assets/shot-dashboard.png` | 13 published in 30 days, 29 total, 38 live pages | Renewal Health |
| `assets/shot-seo.png` | the published content list | Renewal Health |
| `assets/shot-pages.png` | published per month chart | Renewal Health |

All six are real screenshots of real client dashboards. **Every number in them is
real and you must not restate a number that is not visible in the image you are
using.** If you caption one, caption what is actually in that frame.

Hard rule 4 still applies: **one asset, one slot, site-wide.** Coordinate by
sticking to the assignments your own task prompt gives you.

Dashboard images are screenshots: use `.frame` with a `.cap`, or `.evidence`.
Never crop one with `object-fit:cover` in a way that cuts text.

The Jackson outreach dashboard is the single best proof on the site that Wing
does lead generation and not just websites. Use it where that argument is made.

---

## 4. FUTURISTIC, WITHOUT BREAKING THE CRAFT

Jack wants it to feel futuristic and cool. The editorial layout stays; the
futurism comes from the backgrounds, the intro, the mono labels, and restraint.

Allowed and encouraged:
- mono `.lbl` labels used as system readouts (`SIGNAL / 02`, `LIVE`, `DFW`)
- the accent blue as a signal colour, sparingly
- hairline rules and grid structure

Still banned, because they are what made it look generated:
- two-hue gradients, frosted glass, pill buttons, emoji icons
- three equal cards in a row
- any new border-radius value
- decorative motion below the first band (hard rule 2)

---

## 5. WHAT TO REPORT

- Files changed, and the `data-bg` variant you used.
- Every headline you rewrote, old to new, so the repositioning can be checked.
- Any dashboard caption you wrote, and which image it describes.
- Anything you could not do without inventing a fact.
- Your `python verify.py` output (must be PASS) and your `slop_lint.py` output.
