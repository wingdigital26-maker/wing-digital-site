# Wing Digital — design DNA v2

The reproducible rules behind the site. Built 2026-09-06 under the `design-loop`
skill, from measured references (Pentagram, COLLINS) crossed with Wing's own brand.

**How to use this.** Every future page, client dashboard, deck, or email that
carries Wing's own brand inherits these rules. Do not re-roll the look. If a new
thing does not fit a named layout below, that is a signal the layout list needs
one more entry, not that the page needs a one-off style.

Everything here is measured from `style.css`, not described from memory.

---

## 1. Type

Three families. All SIL OFL 1.1, free for commercial use, confirmed 2026-09-06.

| Role | Face | Licence |
|---|---|---|
| Display | Fraunces (variable: opsz, wght, SOFT, WONK) | SIL OFL 1.1 |
| Body / UI | Instrument Sans | SIL OFL 1.1 |
| Labels, numerals, indices | IBM Plex Mono | SIL OFL 1.1 |

Loaded from Google Fonts via `<link>` with `preconnect`. **Never with `@import`**
inside the stylesheet, which is what the v1 site did and which blocked render.

**The ladder. Eleven roles, and a twelfth is a defect.**

*(Corrected 2026-09-07. This section originally claimed "six sizes, a seventh is
a defect". The build then shipped twelve, because a site carrying long-form prose,
forms, captions and mono labels genuinely needs more than six. The rule was wrong,
not the build. What follows is the real ladder, measured. The rule that still holds
is the one that matters, now scoped: **above 21px, no two roles may sit within 1px
of each other.** That is drift and it is visible. Below 21px the sizes are
functional UI steps (button 15, small print 14, mono label 12) and 1px gaps there
are normal in any real system; what is NOT allowed below 21px is an element
rendering at a different size than the paragraph it sits inside, which is how
`.facts .txt b` ended up 1px smaller than its own text.)*

| Token | Size | Line-height | Tracking |
|---|---|---|---|
| `.t-display` | `clamp(52px, 8.4vw, 128px)` | **1.0** | -0.035em |
| `h1` | `clamp(38px, 5.6vw, 82px)` | 1.0 | -0.033em |
| `h2` | `clamp(30px, 3.9vw, 54px)` | 1.04 | -0.028em |
| `h3` | `clamp(21px, 1.8vw, 26px)` | 1.14 | -0.02em |
| `.fig` (fact ledger) | `clamp(30px, 3.4vw, 44px)` | 1.0 | -0.03em |
| `.lead` | `clamp(18px, 1.5vw, 21px)` | 1.45 | -0.012em |
| hero paragraph | 18px | 1.5 | -0.005em |
| body | 17px | 1.55 | -0.005em |
| `.post` prose | 17px | 1.68 | -0.005em |
| `.btn`, nav links | 15px | 1.0 | -0.008em |
| `.cap`, list items, small print | 14px | 1.5 | -0.005em |
| `.lbl`, `.n`, form labels, footer headings | 12px mono | 1.0 | **+0.12em**, uppercase |

Type scale ratio is roughly **1.42** between display steps and **1.3** at the
body end, which is a wide scale on purpose: the gap between the headline and the
body copy is what makes a page read as designed rather than typed.

Display line-height is **exactly 1.0**, copied from both references. Tracking is
negative everywhere except labels, where it is strongly positive. That contrast
between tight display and airy mono labels is the single most identifying feature
of the typography.

Measure caps: body `68ch`, `.lead` `52ch`, `.post` `70ch`, captions `46ch`.

## 2. Colour

Warm. Nothing on this site is neutral grey and nothing is pure black or white.

| Token | Value | Job | Share |
|---|---|---|---|
| `--paper` | `#FAF9F6` | page ground | **60%** |
| `--sand` | `#EFEBE4` | alternating band ground | part of the 60 |
| `--ink` | `#141110` | type, dark bands, buttons | **30%** |
| `--stone` | `#6B6560` | body copy, labels | part of the 30 |
| `--faint` | `#98918B` | row numerals, arrows | part of the 30 |
| `--accent` | `#2757E6` | one CTA, one hover, one active state | **10%** |
| `--accent-ink` | `#1B3FAE` | links inside prose only | part of the 10 |
| `--hair` | `rgba(20,17,16,.13)` | every 1px divider and border | structural |
| `--hair-2` | `rgba(20,17,16,.07)` | the hover wash on a ledger row, nothing else | structural |
| `--ink-2` | `#1F1B19` | long-form body copy inside `.post` | structural |
| `--on-ink` / `--on-ink-mute` / `--on-ink-faint` | `rgba(250,249,246,.94/.62/.40)` | type on the dark grounds | structural |
| `--on-hair` | `rgba(250,249,246,.16)` | dividers on the dark grounds | structural |

The ink is warm (brown in the black) and the paper is warm (cream in the white).
The blue is the only cool thing on the page, which is why it lands so hard
against everything else. That is the entire colour idea.

Bands alternate `paper` and `sand` down the page. The dark `--ink` ground appears
exactly **twice** on the home page: the hero at the top and the contact block at
the bottom. It bookends, it does not punctuate.

## 3. Radius

Four values, four jobs. There is no fifth.

| Token | Value | Used on |
|---|---|---|
| `--r-chip` | 2px | buttons, inputs |
| `--r-photo` | **4px** | every photograph, always, no exceptions |
| `--r-card` | 12px | panels that contain other components |
| `--r-full` | 999px | the Nimbus orb and avatars only |

4px on photos is lifted straight from Pentagram, where it appears 232 times.

## 4. Spacing

Seven steps on roughly a 1.6 ratio, as tokens:

| Token | `--s1` | `--s2` | `--s3` | `--s4` | `--s5` | `--s6` | `--s7` |
|---|---|---|---|---|---|---|---|
| Value | 8px | 16px | 24px | 40px | 64px | 104px | 168px |

Never invent an eighth value. **Bare pixel numbers are forbidden in page markup,
not in the stylesheet**: the named layouts below legitimately hard-code their own
internal dimensions (a 76px numeral column, a 44px arrow column) because those are
properties of the layout, not of the rhythm. If you are writing a pixel value into
an HTML file, you are doing something wrong. If you are writing one into a named
layout's rule in `style.css`, that is expected and it must be listed in section 5.

Section band padding is `--s7` (168px) desktop, `--s6` (104px) under 860px.
Grid max width 1320px. **The gutter sits inside the max width**, so content maxes
at 1240px. `--gutter` is 40px desktop, 22px under 720px.

**Breakpoints. There are exactly three, and "mobile" means 900px.**

| Width | What changes |
|---|---|
| 900px | The real mobile breakpoint. Header stops being sticky, nav collapses to the burger, ledger rows and splits stack, `.split.flip` is neutralised. |
| 860px | Band padding only, `--s7` to `--s6`. |
| 720px | Gutter only, 40px to 22px. |

Do not add a fourth.

## 5. Named layouts

Each recurring section has a name and a rule. Reuse these instead of composing
something new.

- **Band rule.** Every section opens with a 1px `--ink` hairline, a mono label
  left, and a mono index right (`01 / 06`). This is the spine of the site and it
  is what makes twenty different sections feel like one document.
- **Ledger row.** Numbered full-width rows: `76px` numeral column, title column,
  body column, `44px` arrow column. On hover the row indents **18px** and takes a
  `--hair-2` wash, the title goes accent, the arrow slides 7px. Replaces every
  card grid of services, steps, or principles.
- **Asymmetric proof split.** 58/42, alternating with `.flip`. The photo bleeds
  the outer gutter by exactly one `--gutter`. **Never 50/50, never centred.** On
  mobile the photo goes full bleed and loses its radius.
- **Evidence 2+1.** Three images where the first spans both columns at 21:9 and
  the next two sit at 4:3 beneath. This exists specifically so three images never
  appear as three equal tiles.
- **Fact ledger.** A 180px display-type figure against an explanation. Static.
  Replaced the animated counting stat tiles, which were decoration pretending to
  be information.
- **Post list.** 170px thumbnail, title and summary, arrow. Same hover grammar as
  the ledger row.

## 6. Motion

Two motion moments per page and no more.

1. The intro: the wordmark holds 1.0s, then wipes left to right over 0.95s
   (`cubic-bezier(.76,0,.24,1)`). Total under 2 seconds.
2. One reveal: the **first two** `.rv` elements below the fold fade up 26px over
   1.1s. Every element after that is static, forever. (Jack's hard rule 2.)

Hover easing is `cubic-bezier(.19,1,.22,1)` at 0.45s to 0.55s throughout. The
hero photo drifts 1.06x to 1.12x over 26s and that is the only ambient motion on
the site.

`prefers-reduced-motion` kills all of it, including the intro.

## 7. The refusals

What this design will not do. These are what make it distinctive, so they matter
more than the rules above.

1. **No section has exactly three equal cards.** Four services, four process
   steps, four facts, and a 2+1 evidence block. This is the strongest single
   anti-slop move on the site.
2. **No `backdrop-filter` anywhere.** v1 had eleven. Frosted glass is decoration
   standing in for hierarchy.
3. **No two-hue gradients.** The hero scrim is a single-hue tonal wash of `--ink`
   and nothing else on the site is a gradient at all.
4. **No pills.** Buttons are 2px. A pill is the most common shape on the internet.
5. **A card never has both a shadow and a border.** `.panel` gets a border,
   `.panel.on-sand` gets a shadow, never both.
6. **The accent appears at most twice per viewport.** If a screen has a blue
   button, its headings are not blue.
7. **Every photo is 4px.** Not 8, not 12, not 16.
8. **No inline `style=` attributes.** v1 had 176 of them carrying a whole
   typographic scale. If a page needs a value, it needs a token or a utility.
9. **No animated counters and no decorative progress bars.** v1 had three bars at
   25/60/100% that meant nothing.
10. **No phone-number CTAs** outside contact.html and JSON-LD (Jack's hard rule 8).

## 8. Tests a bad copy would fail

Concrete, checkable assertions. **Tests 1-9 and 11-14 apply to any page or
fragment. Tests 2 and 10 are whole-page only** and a single section cannot satisfy
them, so do not run them against a component.

Run `python verify.py` from the site folder: it enforces the mechanical subset of
this list plus Jack's hard rules across every page. `slop_lint.py` covers the
cross-project tells. Neither replaces the three judges.

1. Three font families are declared, all three load, and no fourth appears
   (the mascot script shipped Inter until 2026-09-07).
2. At least four distinct border-radius values exist, and every `<img>` on the
   page computes to exactly 4px (or 0 at mobile full-bleed).
3. Display line-height computes to exactly 1.0 and tracking to -0.035em.
4. `.lbl` computes to IBM Plex Mono, 12px, letter-spacing 0.12em, uppercase.
5. No section element contains exactly three equal-width children.
6. `backdrop-filter` appears zero times in the stylesheet.
7. Zero `style="` attributes in any HTML file.
8. Zero en dashes and zero em dashes in any HTML file.
9. The accent hue `#2757E6` paints under 12% of any viewport.
9b. Every text colour clears 4.5:1 against the ground it actually sits on.
    `--faint` was `#98918B` and failed at 2.62:1 on sand until 2026-09-07.
9c. The burger renders at 44x44 under 900px. If it does not, the site has no
    navigation on phones at all, which has happened once and was invisible to
    every check except a real screenshot.
9d. Every form control has a persistent `<label>`, never a placeholder alone.
10. Every page has exactly one `<h1>`, plus canonical, og:title, og:image.
11. Every `<img>` has width, height, and alt.
12. The dark `--ink` ground appears at most twice per page.
13. Body copy never exceeds 68ch.
14. No page has more than two elements that animate on scroll.

## 9. Cast and assets

- **Nimbus** is the orb assistant, fixed bottom right at 64px, arriving 2.6s after
  load. He is the **one** persistent element on mobile (chrome budget: the header
  is not sticky under 900px, so Nimbus is the only fixed thing on screen).
- **Photography rule** (Jack's hard rule 4): no content photo appears in more than
  one slot anywhere on the site. The logo, mark, and footer brand are identity,
  not content, and are exempt. Client site screenshots are captured live with
  Playwright rather than reused, so the case study pages and the home page proof
  bands show different frames of the same site.

## 10. Rebuild test

Stage 4 of the design-loop skill requires that a fresh context can rebuild a
section from this file alone and match. That test has **not been run yet** for
v2. Until it has, treat this DNA as provisional: every difference the rebuild
produces is a rule that is missing from this document and needs adding.

---

## 11. Implementation reference

Added 2026-09-06 after the section 10 rebuild test. A fresh context given only
this document produced 67 decisions it had to invent. Everything below is the
answer to one of those, so that the next rebuild has nothing left to guess.

### 11.1 Type, exactly

| | Family | Weight | Variation settings |
|---|---|---|---|
| `.t-display` | Fraunces | 400 | `"SOFT" 0, "WONK" 1, "opsz" 144` |
| `h1` | Fraunces | 400 | `"SOFT" 0, "WONK" 1, "opsz" 96` |
| `h2` | Fraunces | 400 | `"SOFT" 0, "WONK" 1, "opsz" 60` |
| `h3` | Fraunces | 400 | `"opsz" 30` |
| `h4` | Instrument Sans | 600 | n/a |
| body, `.lead` | Instrument Sans | 400 | n/a |
| `.btn`, `.tlink` | Instrument Sans | 500 | n/a |
| `.lbl`, `.n` | IBM Plex Mono | 400 | n/a |

**WONK 1 is not optional.** It is the axis that gives Fraunces its odd, slightly
wrong-looking single-storey `g` and cocked terminals, and it is the single reason
this reads as a chosen typeface rather than a default serif. Never set it to 0.

The font request, verbatim:

```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400&display=swap
```

Fallbacks: display `Georgia, "Times New Roman", serif`; sans `-apple-system,
"Segoe UI", Helvetica, Arial, sans-serif`; mono `ui-monospace, SFMono-Regular,
Menlo, monospace`.

Colour assignment: headings `--ink`. Body copy `--stone`, except inside `.post`
where it is `--ink-2` because long-form needs the extra weight. `.lbl` is
`--stone`, and `--ink` only when it carries `.lbl--ink` (the left label of a band
rule). Row numerals and arrows are `--faint`. Links inherit, except inside
`.post` where they are `--accent-ink` and underlined.

Ignore the "1.42 ratio" line in section 1 when it conflicts with the clamps. **The
clamps are the specification**; the ratio is a description of them and it is
approximate.

### 11.2 Ledger row, exact DOM

```html
<div class="ledger">
  <a class="lrow" href="target.html">          <!-- <div> when it goes nowhere -->
    <span class="n">01</span>
    <h3>The title</h3>
    <div class="body">
      <p>One sentence.</p>
      <ul><li>Optional supporting points</li></ul>
    </div>
    <span class="ar" aria-hidden="true">&#8594;</span>   <!-- left empty on a div row -->
  </a>
</div>
```

- Grid is `76px minmax(0,1fr) minmax(0,1.05fr) 44px`, gap `--s4`, `align-items:start`.
  **The body column is very slightly wider than the title column**, which is what
  keeps the titles from looking like a heading column in a table.
- Row padding `--s4` vertical. Divider is `1px solid var(--hair)` on
  `border-bottom`, plus a `border-top` on the `.ledger` wrapper.
- Hover and `:focus-visible` are identical: `padding-left: 18px` (**not**
  `translateX`, because the grid should reflow rather than slide), a `--hair-2`
  background that stops at the wrap, `h3` to `--accent`, `.ar` `translateX(7px)`
  to `--accent`. Transition `.55s var(--ease)`.
- Numerals are zero-padded two digits. The `.n` is mono 12px `+0.1em`, `--faint`,
  with `padding-top: 8px` to sit on the title's optical baseline.
- Under 900px: grid becomes `44px 1fr`, the body moves to column 2, the arrow is
  `display:none`, padding drops to `--s3`, and the hover indent is gone.

### 11.3 Asymmetric proof split, resolved

**The photo takes the 58.** `.shot` is the first child and the major column;
`.txt` is 42. A proof band is carried by the evidence, not the caption.

- `grid-template-columns: 58fr 42fr`, gap `--s5`, `align-items: center`.
- `.split.flip` swaps to `42fr 58fr` and reorders so the photo sits right.
- The bleed is a **negative margin of exactly one `--gutter`**, not a viewport
  bleed. The photo reaches the true viewport edge only when the window is exactly
  `maxw + 2*gutter`. This is deliberate: a full `calc(50% - 50vw)` bleed makes the
  page feel like a slideshow.
- Photo is `aspect-ratio: 16/11`, `object-fit: cover`, `--r-photo`.
- Under 900px: single column, photo first, photo full-bleed both sides with
  `border-radius: 0`, `.flip` neutralised.
- `.txt` contains, in order: a `.lbl`, an `h3`, one or two `<p>`, and one
  `.tlink`. A `.split` never contains a `.btn`; buttons live in `.cta-strip`.

### 11.4 Band rule

- The hairline spans the grid, not the viewport.
- `padding-top: 14px` between rule and labels; `margin-bottom: --s4` to content.
- Markup is `<div class="band-rule">` with two spans: `.lbl.lbl--ink` left,
  `.lbl.r` right.
- **On a dark ground** (`.page-head`, `.contact`) the border becomes `--on-hair`,
  the left label `--on-ink-mute`, the right `--on-ink-faint`. Handled by
  descendant selectors, so just place the same markup inside a dark section.
- The index denominator counts the numbered bands on that page and **must be
  true**. A two-band page reads `01 / 02`, never `01 / 06`.

### 11.5 Grounds

After the dark hero, the first band is `paper`, then bands alternate
paper / sand / paper / sand. The `.cta-strip` is always sand. The contact band is
always `--ink`. At rest a band carries **no accent at all**; the blue appears only
on hover, on `:focus-visible`, on the current nav item, and on the one primary
button in a viewport. A screen with no blue on it is correct and normal.

### 11.6 Focus and states

Every interactive element takes `:focus-visible` with a 2px `--accent` outline at
3px offset, switching to `--paper` on dark grounds. Inputs use a 0 offset. Ledger
and post-list rows mirror their full hover state on focus. Every page's first tab
stop is a `.skip` link to `#main`. There are no `:visited` or `:active` styles.

Hover states are left enabled on touch devices; nothing on the site depends on
hover to be usable or readable.

### 11.7 Motion, scoped

"Two motion moments" counts **entrances only**: the intro and the single reveal.
Hover and focus transitions do not count against the budget and are unlimited.
Under `prefers-reduced-motion` every animation and transition is reduced to
0.001ms, the intro is removed entirely, `.rv` is shown immediately, and the hero
photo stops drifting.

### 11.8 Nimbus

Fixed, `right: 18px; bottom: 16px` (12px each under 900px), `z-index: 55`, 64px,
`--r-full`, fading in 2.6s after load via a `.on` class. It is the only fixed
element on a phone, because the header is not sticky there.
