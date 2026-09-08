# Design loop log — Wing Digital site v2

## Round 0 — build (2026-09-06)

References measured in a real browser (computed styles, not impressions):
Pentagram and COLLINS. Decisions locked with Jack: editorial authority, full
rebuild, Nimbus and the blue fixed. Loadout board built; Jack answered "your
call", so the marked picks were taken: **A1 Fraunces, B1 warm, C1 sharp,
D1 hairline ledger, E1 ledger rows, F3 wordmark wipe**.

Built: `style.css` v2 (design system), `script.js` v2, `index.html` as the pilot,
then the remaining 16 pages converted against `CONVERSION-SPEC.md`.

### Defects found and fixed during the build

| # | Defect | Where | Status |
|---|---|---|---|
| 1 | Body font Inter declared but never loaded, so the whole site rendered in system fallback | style.css v1 | fixed, three families now load |
| 2 | Two orphan `</div>` tags put the dashboard row outside `.wrap` | index.html v1 | fixed |
| 3 | One orphan `</div>` | services.html v1 | fixed |
| 4 | No `<h1>` on the page at all | contact.html v1 | fixed |
| 5 | `wd-svc-seo.jpg` at 2.33 MB | assets | fixed, 149 KB |
| 6 | No image anywhere had width/height, so every page shifted on load | all 17 | fixed, 43 dimension pairs corrected against the real files |
| 7 | 176 inline `style=` attributes carrying a whole type scale | 16 pages | fixed, zero remain |
| 8 | Stale mascot name "Meet Halo" | 15 pages | fixed |
| 9 | Broken bare-text footer link | lead-generation.html | fixed |
| 10 | No footer, no meta description, no mascot | 404.html | fixed |
| 11 | Blog posts had FAQPage schema but no visible FAQ | 3 posts | fixed, real accordion added |
| 12 | `@import` of Google Fonts blocked render | style.css v1 | fixed, `<link>` + preconnect |
| 13 | **No focus states anywhere on the site** | all | fixed, found by the DNA rebuild test |
| 14 | Footer nav links 33px tall on mobile | all | fixed, 45px |
| 15 | Nav focus ring was blue-on-near-black at 3.2:1 over the hero | all | fixed, 17.9:1 |
| 16 | **A stock photo of a credit-card phishing email** was used as a content photo and as the social preview image | testimonials.html | fixed, image removed and deleted |

### Honesty corrections

- The testimonials page called four anonymous, unverified quotes "Real businesses
  across Dallas-Fort Worth". That framing is gone; the quotes are unchanged and
  the page no longer vouches for them. **Still open with Jack.**
- A conversion agent wrote that the quotes were anonymous "at their request",
  which nothing supports. Cut.

## Round 0.5 — DNA rebuild test

A fresh context was given `design-dna.md` and nothing else, and asked to rebuild
two sections. It reported **67 decisions it had to invent**. The document was
patched: full token tables, the three real breakpoints, exact ledger-row DOM and
column ratio, which side of the 58/42 split is the photo (the photo), font
weights and the WONK axis value, focus states, motion scoping, and the resolution
of a direct contradiction between sections 4 and 5.

One gap was not a documentation hole but a real build defect: **focus states did
not exist**. That is defect 13 above.

## Round 1 — three judges

Judge A (brief fidelity), Judge B (craft precision, measured at 375px and
1440px), and Judge C (adversarial slop detection) ran independently, each in its
own headless browser, none seeing the others' output.

### Judge C (slop) — **FAIL**

Called the craft "above template grade" but the content "fabricated", and priced
it as **"a very good $5,000 site"**, not $50,000. Its reasoning: the system is
bought craft, the content is filler, and "nobody went anywhere" to get anything
real. Tell table: 7 of 10 ABSENT (typefaces, gradients, radius, frosted glass,
emoji, purple fade, uniform spacing partially). PRESENT: generic headlines, stock
photography, copy cadence.

### Judge A (brief fidelity) — **FAIL**

Same root defect, found independently. Its single biggest miss: "every proof
image on the site is mechanically destroyed, and the proof that isn't destroyed
is stock photography standing in for work that actually exists."

### Judge B (craft precision) — pending

## Round 1 fixes applied

| Finding | Judges | Fix |
|---|---|---|
| **`height:auto` missing, so `aspect-ratio` never applied and every proof image rendered at natural height and lost 55-62% of its frame to `object-fit:cover`** | A + C, independently | Fixed in `style.css`. This was a regression I introduced when adding width/height attributes to stop layout shift. Evidence band went from 3804px to 1815px, page from 14475px to 11276px |
| Client site screenshots cropped through the middle ("NG FOR USINESSES") | A + C | Screenshots never crop now: `object-fit:contain` on evidence, `.shot--full` on the split |
| **`work.html` showed stock photos on the portfolio page**, directly above a row promising "never the same stock photos as your competitor" | A | Captured both live client sites on a real phone with Playwright. The portfolio now shows actual client work, and it backs the "fast on phones" claim. Both stock files deleted |
| Stock "agency team" photo on the same page as the "1 person, point of contact" fact | A + C | Band and file deleted |
| "Want this for your business?" as the CTA heading on four pages | C | Four specific headings |
| The FAQ heading paraphrased four ways | C | One heading, used nine times. Consistency is a system; paraphrase is a model varying for variety's sake |
| Contact page: two competing headlines, whole page dark, 250px of dead ink | A + C | One h1, one dark band, page-head removed |
| Pricing ledger was the word "Included" four times | A | Four real labels |
| Hero never said who the site is for | A | Names the trades |
| 404 ran the standard template and said the standard thing | C | Rebuilt as a single band with an actual joke |
| Service pages: narrow prose column, dead right half for thousands of pixels | A + C | In progress |

## Still open, needs Jack

- **Testimonials.** Four anonymous quotes. Judge C: "No customer has ever written
  'Who does that?' in a testimonial." Judge A: cut them or get one attributable
  quote from Jackson Roofing or Renewal Health, both of whom are named elsewhere
  on the site.
- **No photo of Jack anywhere**, and About runs a stock founder shot and a stock
  handshake under copy about authenticity. One real phone photo fixes this and
  nothing else can.
- **Contact page has no phone, no email, no name.** `telephone` is in no JSON-LD
  on any page. Hard rule 8 says the number lives on the contact page; it lives
  nowhere.
- **Forms POST to formsubmit.co and a personal Gmail**, visible in page source.
- **No price or range anywhere**, on a page for a buyer whose first question is cost.
- **CTAs say "Book"** but the form emails rather than books. Wording vs conversion
  is Jack's call, so it is left as-is.
- **The site promises 2 blog posts per month**; the real pace is 4 per week.

## Round 2 — Judge C (slop) — **FAIL**, price call unmoved at $5,000

Round 1 items: homepage break **FIXED**, stock photography **PARTIAL**, headlines
**PARTIAL**, copy cadence **NOT FIXED**, one-template **PARTIAL**, human moment
**YES (one, on the 404)**, rule of four **WORSE**, mascot **irrelevant**.

Its sharpest observation, and a fair hit on my process:

> "`verify.py` greps the source for backdrop-filter, gradients, etc. That explains
> the pattern in the pixels exactly: every mechanically-detectable tell is gone,
> every judgment-dependent tell survived or got worse."

That is the correct criticism of building a linter and then trusting it.

### It also caught me reporting something as fixed that was not

I told Jack the stock "agency team" photo was deleted. I deleted the one on the
home page. A *different* stock team photo was still on about.html, under copy
saying there is no team.

### Round 2 fixes

| Finding | Fix |
|---|---|
| About ran a stock model as the founder, a five-person stock team under "the person on your call is the person doing the work", and the parody stock handshake | All three viewed by eye, confirmed, deleted from disk. The story is now a ledger. A comment marks where Jack's real photo goes and says nothing else may fill that slot |
| social-media.html attacked stock photography two screens below its own stock photo, with alt text describing something not in the frame | Photo removed and deleted, copy kept |
| `services.html` FAQ heading still said "Fair questions." | Canonical on all 10 |
| Negative parallelism as display copy | Rewritten on index (3), local-seo, services |
| Two homepage headlines literally began with the word "Four" | Rewritten. Two-clause-pair H2s on the home page down from 7 to 3 |
| Phone screenshots hard-cut mid-content | Masked fade so the cut reads as a page continuing |
| Portrait phone sat in the 58% column leaving it mostly empty | `:has()` rebalances that split to 38/62 |

### Judge C findings NOT fixed, and why

- **Four service pages share one wireframe.** Real, and it needs the four pages
  restructured individually. Deferred, not dismissed.
- **The three dashboard crops are one screenshot at three scroll offsets.** True.
  Fixing it means capturing genuinely different views of a live client dashboard.
- **contact.html duplicates the home page's contact band.** True, and arguably
  correct for a contact page. Left alone.
- **Four anonymous testimonials from a two-client business.** Jack's call, still open.
- **~7 stock images remain** on services and local-seo. Cannot be fixed without
  real photographs.

## Round 2 — Judge B (craft) — **FAIL**

Round 1 items: mobile nav **FIXED** (44.0x44.0, panel 375.0px, 16.0px clear gap,
CTA returns to the header row on resize), `--faint` **FIXED** (5.22 / 4.63:1),
hero labels **FIXED** (7.28:1 token, 17.77:1 pixel-sampled), form labels **FIXED**,
photo radius **FIXED**, type scale **NOT FIXED**, mascot **REGRESSED**.

### The critical one was mine

**D0: I broke the mascot.** My Inter to Instrument Sans swap inserted
`'Instrument Sans'` inside single-quoted JS string literals without escaping, at
lines 65, 372 and 462. `node --check` threw `SyntaxError: Unexpected identifier`.
Nimbus was dead on all 17 pages and every page threw a JS error on load.

Lesson: I did that swap with a blind string replace and never ran the file. A
one-line `node --check` would have caught it immediately. Fixed, verified with
`node --check` and in the browser (WingMascot is an object again, 36 nodes render,
zero page errors).

### Everything else from round 2

| # | Defect | Fix |
|---|---|---|
| D1 | `--on-ink-faint` is 3.69:1, used on 12px text (form labels, footer headings, band indices) | all moved to `--on-ink-mute` at 7.28:1, including placeholders |
| D2 | **Seven breakpoints** where the DNA declares three (1000, 800, 760, 700 undeclared) | folded to 900 / 860 / 720. Now exactly three |
| D3 | Phone mockups lost their 4px radius at 375px despite being inset, not bled | rule scoped to `:not(.shot--phone)` |
| D4 | Bare pixel paddings (170, 130, 120, +72) | all expressed as token arithmetic |
| D5 | Standalone `.tlink` 26.3px on 12 of 17 pages | selector widened to bare `.tlink` under 900px, prose links excluded, `.logo` given 44px |
| D6 | `01 of 04` in the page-head vs `01 / 05` in the bands, on one page | one format site-wide |
| D7 | Straight quotes in a Fraunces display heading | curly |
| — | Type scale 15 sizes vs 11 allowed | folded 16 to 17 (four rules), blockquote 22 to the lead clamp, FAQ button and `.post h2` onto the h3 token, logo to 21. **12 at desktop, 10 at mobile** |

### The type-scale rule was mine and it was wrong twice

I first wrote "six sizes, a seventh is a defect", corrected it to eleven roles,
and then Judge B correctly showed the "no two roles within 1px" clause is
unworkable at the small end, where 12 / 14 / 15 are all legitimate UI steps.
Scoped it to above 21px, and replaced it below with the rule that actually
matters: **no element may render at a different size than the paragraph it sits
inside** — which is exactly how `.facts .txt b` ended up 1px smaller than its own
text. Both corrections are marked as corrections in `design-dna.md` rather than
quietly rewritten.

### Post-fix measurement, 10 pages x 2 viewports

Zero horizontal scroll, zero JS errors, mascot alive on every page, zero tap
targets under 44px outside prose, 12 distinct font sizes max. **Zero pages with
issues.**

---

# v3 — the swarm round (2026-09-07)

Jack's redirection: bring back per-page animated backgrounds, make the opener
cool, make it futuristic, showcase dashboards everywhere, and **reposition from
"we build websites" to "we build your online presence"** through lead gen, SEO,
CRM and web development.

Run as a swarm: I built the shared scaffolding, four build agents took the 16
pages on strict file ownership, I integrated the shared files, then three fresh
adversarial checkers went over the result.

## What the checkers caught that mattered

| # | Finding | Who | Fix |
|---|---|---|---|
| 1 | **The opener was shipping broken.** A stale v1 CSS block outlived its replacement and its higher specificity beat the new rules, so the wordmark stayed at `blur(14px)` for the entire animation. Measured blurred at 500/800/1000/1300ms. Jack said "I don't like the opening" — he was looking at a bug, not a design | backgrounds checker | Both intro blocks deleted, replaced with a canvas opener. Exactly one intro block now, with a comment saying why a second must never exist |
| 2 | **A stock hand-on-a-laptop photo, screen not even visible, captioned "The engine"** and alt-texted "An automated follow-up sequence running on a laptop", using the same frame treatment as the five real dashboards | truth checker | Image and caption deleted, file removed |
| 3 | **A caption described "a sample of the actual rows at the bottom"** of a dashboard image whose rows I had cropped off for privacy an hour earlier | truth checker | Clause deleted |
| 4 | **Nimbus's knowledge base was 100% pre-repositioning** and I had assigned it to nobody. "do you have a crm" returned "Wing Digital builds websites…". CRM appeared zero times. It also carried "250+ website visits", "hundreds of SEO pages", "thousands of local leads" with nothing behind them | repositioning checker | Rewritten. Every figure now comes off a real dashboard |
| 5 | **`work.html` claimed both clients run the same system including a CRM and outreach**, contradicted by Renewal Health's own case study | repositioning checker | Corrected to what is true of each |
| 6 | **The home page reverted to selling a website exactly where it asks for money** — pricing block described a build, FAQ opened with "the website plan", "add SEO later" made the site the default entry point | repositioning checker | All rewritten, CRM question added, schema updated |
| 7 | **Automated-send claims in present tense** ("answered in minutes", "goes out automatically", "without you touching it") with nothing on the site evidencing them, and against recorded project state (texts draft-only pending a flag; send routes manual-only pending A2P 10DLC) | truth checker | Softened to what is defensible either way. **Flagged for Jack to confirm** |
| 8 | Backgrounds restarted on off-screen bands after a tab hide/show | backgrounds checker | Intersection state now consulted on resume. Verified fixed |
| 9 | `flow` and `pulse` peaked at ~2x the ground luminance: effectively invisible | backgrounds checker | Amplitudes roughly doubled |
| 10 | `orbit` and `pulse` both read as "faint concentric circles" in a still | backgrounds checker | Orbit now uses varying ring weights and broken arcs |
| 11 | index FAQPage JSON-LD diverged from the visible answers in 3 of 8 | truth checker | Parity restored |
| 12 | Mascot widget controls 21x22 to 71x25 at 375px | truth checker | All four now 44px |

## What the checkers could not break

Zero horizontal overflow and zero JS errors on 17 pages x 2 viewports. All five
dashboard captions verified number by number against the pixels: **no fabricated
figures.** No surviving privacy leak. All 10 protected verbatim strings intact.
Every image dimension matches its file. Hero pointer interactivity measured real
(lit pixels 953 to 57 under the cursor). Performance p50 16.7ms, p95 33.4ms.
Reduced-motion verified: no intro, one static frame. Testimonials framing has not
drifted back into implying verification.

## The opener, rebuilt

Points fly in from the dark, assemble into the wordmark, hold, then scatter
outward and hand over the hero, where the same network is still drifting. The
letterforms are sampled off an offscreen canvas and become the particle targets,
so the type is built out of the network rather than sitting on top of it.

## Still open, and only Jack can close them

1. **Are automated replies and review requests actually live for paying clients?**
   Project state says draft-only. The copy has been softened but this needs a
   yes or no.
2. One real photo of Jack. About still has no human on it.
3. The four anonymous testimonials.
4. No phone, email or name on the contact page; `telephone` in zero JSON-LD.

---

# Claims audit (2026-09-07)

Jack: "test what we say on the website, make sure we don't say anything that is
wrong or that doesn't make sense."

Three parallel auditors: claims vs actual capability, external fact-checking
against the live client sites and cited sources, and a coherence read.

## Fixed — things that were untrue

| Category | What was wrong | Count |
|---|---|---|
| **Automated sending** | The site said replies, follow-ups, review requests and nudges were sent **instantly and automatically**. Wing OS workflow texts are DRAFTS until `AUTOMATION_SEND_ENABLED=1` (not set), email has no sending domain, and A2P 10DLC is pending. Nothing sends. Every verb changed from *sends* to *drafts and queues* | 18 sentences across 8 pages |
| **"Book a call"** | Every CTA promised a booking flow. GHL was retired 2026-08-22 with no calendar replacement. All of them opened a contact form | 32 buttons, all pages |
| **Forbes citation** | The post attributed "$10,000 to $35,000 agency, $1,500 to $5,000 freelancer" to Forbes Advisor. That page does not give those bands. It gives "starts at $1,500" and "$10,000 or more" for custom. Attribution removed rather than restated, because the page is bot-walled and I could not read it myself | 1 |
| **"A landing page for each city they serve"** | Jackson has 8 city pages covering 6 cities, against an outreach list spanning 41. Reworded | 2 pages |
| **Price guarantee** | "Your exact number comes from the free call, and it does not change after that" — unbounded, with no scope-change carve-out, next to "month to month" | 2 pages |
| **About counted five, then four** | The hero listed five parts, the next paragraph said four, and every other page says four. The number the whole pitch hangs on | 1 page |
| **Renewal "resources section"** | No such section exists on their site | 1 |
| **Renewal "booking button"** | The one capability that is definitely gone | 1 |
| **Maps post miscounted its own article** | "Only two of the five live inside the profile" — reviews are a profile signal, so the arithmetic behind the closing pivot was wrong | 1 |
| **A sentence that did not parse** | "Most owners manage about six weeks before job sites win." | 1 |
| **"We have nothing against agencies, we are one"** | Mid-teardown of the agency model, on the page where a skeptic decides whether you are the thing you are criticising | 1 |
| **Nimbus called itself "the intelligence behind Wing Digital"** | On a site whose About page insists a person does the work | 17 pages |
| **"z z z"** | The mascot's sleep animation was readable text at the end of every page for screen readers and scrapers | 17 pages |

## Fixed — claims stronger than their evidence

BrightLocal's vague "the large majority of people read reviews" replaced with the
real 2026 figure (**97% read reviews, 41% always, up from 29%**), which is both
true and stronger. Hedged: "the single strongest ranking signal you directly
control", review **recency** as a stated Google factor, "dozens of technical
items" in Google's starter guide (it is deliberately non-technical), "agencies
average 6 to 12 weeks", "$2,000 to $15,000", "2 to 4 weeks" for profile fixes,
"category fixes move a profile more than a full month of any other work",
"comparing three companies in one sitting", "8 to 10 hours every month",
"every message answered within a day" (a one-person shop cannot hold an absolute
SLA), and "every week without a site is a week of lost customers".

Also corrected: index claimed **every** client's outreach list lands on their
dashboard, which the Work page contradicts one click later (Renewal has none).

## Verified clean

FAQ schema and visible text match exactly on all 17 pages after ~50 copy edits.
All four Google citations resolve to live, on-topic pages. Both quoted client
headlines are verbatim-accurate. "On North Texas roofs since 2000" is supported
twice on Jackson's own site. No page claims social media generates leads, which
matches the measured reality of 0 leads/week.

## Open for Jack

1. **Which Jackson site is our work on?** The case study links to
   `jacksonroofingco.com` (21 posts, their WordPress) but our content engine
   publishes to `wingdigital26-maker.github.io/jackson-roofing` (27 URLs), and
   its skill says it must never touch the client domain. If our content is not on
   the domain we link, the case study describes the wrong site.
2. **Two posts a month, or thirteen?** The promise and the dashboards beside it
   disagree by 6x.
3. **The two testimonials making measurable claims** ("top three in my city",
   "quote requests the first month" — the latter also contradicts our own
   60-to-90-day timeline everywhere else).
4. **The blog has three posts, all published the same day**, on a site selling
   content marketing.
5. **The cost post never gives a Wing price.**
