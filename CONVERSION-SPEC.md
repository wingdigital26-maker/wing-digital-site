# Conversion spec — porting a page onto design system v2

Read this in full before editing. `index.html` is the built reference: when this
spec is ambiguous, copy what `index.html` does. `style.css` is the system.

**Do not edit `style.css`, `script.js`, or `index.html`.** If you believe you
need a new CSS class, you are almost certainly meant to reuse a named layout.
Report it instead of adding it.

## Non-negotiables

1. **Zero `style="..."` attributes.** The old pages have up to 28 each. Every one
   goes. Use the utilities (`.measure-xs/-sm/.measure/-lg`, `.stack-3/-4/-5`,
   `.gap-5/-6`) or a named layout.
2. **Zero `<style>` blocks in the page.** The `#wing-helper` CSS now lives in
   `style.css`.
3. **No em dash and no en dash, anywhere.** Write `Dallas-Fort Worth` with a
   plain hyphen. The old pages are inconsistent about this.
4. **No banned copy**: get started, transform, unlock, seamless, elevate,
   empower, leverage, robust, cutting-edge, game-changer, "in today's",
   "whether you're a X or a Y", "it's not just X it's Y".
   Say "book a call" or "see the work", never "get started".
5. **Never invent a fact.** Keep every number, claim, and quote exactly as it is
   in the current file unless this spec tells you otherwise. You are converting
   markup and tightening phrasing, not writing new claims. If a sentence needs a
   number you do not have, cut the sentence.
6. **Every image needs `width`, `height`, and `alt`.** Add `loading="lazy"` to
   everything except the first image on the page. This fixes site-wide layout
   shift. Get real pixel dimensions with:
   `python -c "from PIL import Image;print(Image.open('assets/NAME').size)"`
   (if PIL is missing, use the aspect the layout implies and say so in your report).

## Required page skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>...</title>
<meta name="description" content="...">
<link rel="canonical" href="https://wingdigital26-maker.github.io/wing-digital-site/PAGE.html">
<meta property="og:type" content="website">   <!-- "article" on blog posts -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="...">
<meta property="og:image" content="https://wingdigital26-maker.github.io/wing-digital-site/assets/IMG">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="assets/wing-mark.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css?v=2">
<!-- keep every existing JSON-LD block, corrected where this spec says so -->
</head>
<body>
<noscript><style>.rv{opacity:1!important;transform:none!important}.qa .ans{display:block!important}</style></noscript>
```
(The `<noscript>` block is the one permitted `<style>` element.)

Then: nav, page-head, content, cta-strip, footer, mascot, `<script src="script.js?v=2"></script>`.

**Canonical, og:*, and twitter:card are now required on every page.** Seven
pages are missing them today.

## Nav — copy verbatim onto every page

```html
<nav id="nav">
  <div class="wrap">
    <a href="index.html" class="logo"><img src="assets/wing-mark.png" alt="" width="30" height="30">Wing Digital</a>
    <div class="navlinks">
      <a href="index.html">Home</a>
      <a href="services.html">Services</a>
      <a href="work.html">Work</a>
      <a href="blog.html">Blog</a>
      <a href="about.html">About</a>
    </div>
    <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <a href="contact.html" class="btn nav-cta">Contact us</a>
  </div>
</nav>
```

`script.js` sets `aria-current="page"` by filename, so do not hand-write an
active state. The old `.roll` double-span hover markup is gone; do not carry it over.

## Page head — every page except index

```html
<header class="page-head">
  <div class="wrap">
    <div class="band-rule"><span class="lbl l">SECTION NAME</span><span class="lbl r">SHORT INDEX</span></div>
    <h1>The page headline.</h1>
    <p class="lead">One or two sentences. Under 30 words.</p>
  </div>
</header>
```

The old canvas backgrounds (`canvas.bghead`, `waves`/`particles`/`aurora`/`grid`)
are **deleted**. The system has no canvas layer. So is the whole `.aurora`,
`.hmote`, `.blob`, `.glowlayer`, and `.darkzone` vocabulary.

Every page needs exactly one `<h1>`. `contact.html` currently has none.

## Named layouts — use these, do not invent

- **`.band-rule`** opens every section. Mono label left, mono index right, on a
  1px rule. This is the site's spine, so use it on every band.
- **`.ledger` + `.lrow`** replaces every card grid of services, steps, or
  principles. Row = `<span class="n">01</span>`, `<h3>`, `<div class="body">`,
  `<span class="ar" aria-hidden="true">&#8594;</span>`. Wrap the row in `<a>` when
  it links somewhere, otherwise use a `<div>` and leave the arrow span empty.
- **`.split` / `.split.flip`** is the 58/42 photo-and-text band. Alternate `.flip`
  down the page. `.shot` holds the image, `.txt` holds the words. Never 50/50.
- **`.evidence`** is the 2+1 image arrangement (first child spans both columns).
- **`.facts`** is the figure-plus-explanation ledger. Add `.facts--plain` when the
  left column is a word rather than a number.
- **`.postlist` + `.plink`** is the blog index row.
- **`.post`** wraps all long-form prose. It styles h2/h3/p/ul/a/blockquote for
  you, which is what replaces the inline styles.
- **`.panel`**, `.grid-2`, `.grid-4` only when a row genuinely will not work.

**Refusals that the judges will check.** No section has exactly three equal
cards. No card has both a shadow and a border. Every photo is `--r-photo` (4px),
never another radius. The accent blue appears at most twice per viewport, so do
not colour headings, labels, and buttons all blue on one screen.

## FAQ markup

```html
<div class="faq">
  <div class="qa"><button>The question?<span class="ic" aria-hidden="true"></span></button>
    <div class="ans"><p>The answer.</p></div></div>
</div>
```
`script.js` wires `aria-expanded`, `aria-controls`, and `hidden`. Do not add them
by hand and do not use `<details>`. Keep the visible questions and the FAQPage
JSON-LD in sync; several pages currently drift.

## CTA strip — closes every page except index and contact

```html
<section class="cta-strip">
  <div class="wrap inner">
    <div>
      <h2 class="measure">Headline that asks for the call.</h2>
      <p class="lead stack-3">One sentence.</p>
    </div>
    <a href="contact.html" class="btn">Book a free consultation</a>
  </div>
</section>
```

**Hard rule 8: no phone number anywhere except contact.html and JSON-LD.** Every
CTA is a link to contact.html.

## Footer — copy verbatim from index.html

Three-column footer (`Services` / `Company` / `Reading`). Two fixes it carries:
`lead-generation.html` currently has a broken bare-text footer link, and
`404.html` has no footer at all. Both get the standard footer.

## Mascot — copy verbatim from index.html

Including `title="Meet Nimbus"`. **Fifteen pages currently say "Meet Halo",
which is the old name.** The chat `items` array should be tailored to the page
(a service page answers questions about that service), but the greeting stays.
`404.html` gets the mascot too.

## Image assignments — one photo, one slot, site-wide

Hard rule 4: no content photo appears in more than one place. Current
assignments to preserve, and the fixes:

| Page | Image |
|---|---|
| index (hero) | `wd-skyline.jpg` |
| index (proof) | `work-jackson.png`, `work-renewal.png` |
| index (evidence) | `shot-dashboard.png`, `shot-seo.png`, `shot-pages.png` |
| index (band) | `wd-agency-team.jpg` |
| services | `wd-svc-web.jpg`, `wd-svc-seo.jpg`, `wd-svc-social.jpg`, `wd-svc-leads.jpg` |
| website-design | `wd-webdesign.jpg` |
| local-seo | `wd-localseo.jpg` |
| social-media | `wd-social.jpg` |
| lead-generation | `wd-email-hero.jpg` |
| blog index + posts | `wd-blog-cost.jpg`, `wd-blog-storefront.jpg`, `wd-blog-maps.jpg` |
| about | `wd-about-founder.jpg`, `wd-about-meeting.jpg`, `wd-about-local.jpg`, `wd-fortworth.jpg` |
| **work.html** | **`wd-work-roofing.jpg`, `wd-work-rankings.jpg`** (currently orphaned, now used) |
| **testimonials** | **`wd-work-email.jpg`** (currently orphaned, now used) |
| case study pages | assigned separately, do not add an image not listed here |

`wd-svc-seo.jpg` is **2.33 MB**. Leave the file alone but make sure it is
`loading="lazy"` and has width/height, and note it in your report.

## What to report back

- Every file you changed.
- Any fact, number, or claim you could not verify, quoted with its file and line.
- Anything this spec did not cover that you had to decide, and what you chose.
- Any place you wanted a new CSS class and what you did instead.
- Confirm for each page: one h1, zero inline styles, zero en/em dashes, canonical
  plus og tags present, all images have width/height/alt.
