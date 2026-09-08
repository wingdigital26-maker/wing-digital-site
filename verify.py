#!/usr/bin/env python3
"""verify.py - enforce the Wing Digital design-dna.md checklist across the site.

Covers the mechanically checkable subset of "Tests a bad copy would fail"
(design-dna.md section 8) plus Jack's hard rules. Run before any publish:

    python verify.py

Exit 0 = clean. Exit 1 = failures.
"""
import glob
import io
import os
import re
import sys

FAILS, WARNS = [], []


def fail(f, msg):
    FAILS.append((f, msg))


def warn(f, msg):
    WARNS.append((f, msg))


BANNED = [
    "get started", "transform your", "unlock", "seamless", "elevate your",
    "empower", "leverage", "robust", "cutting-edge", "cutting edge",
    "game-changer", "game changer", "in today's", "whether you're",
    "it's not just", "supercharge", "revolutioniz", "the future of",
]

# tags we do not expect to be closed
VOID = {"br", "img", "hr", "input", "meta", "link", "source", "area", "base",
        "col", "embed", "param", "track", "wbr"}


def strip_noscript(s):
    return re.sub(r"<noscript>.*?</noscript>", " ", s, flags=re.S | re.I)


def check_html(path):
    f = os.path.basename(path)
    s = io.open(path, encoding="utf-8").read()
    body = strip_noscript(s)

    # --- structure -------------------------------------------------------
    h1 = len(re.findall(r"<h1[\s>]", s))
    if h1 != 1:
        fail(f, "has %d <h1> elements, needs exactly 1" % h1)

    # --- DNA test 7: no inline styles ------------------------------------
    n = len(re.findall(r'\sstyle="', body))
    if n:
        fail(f, '%d inline style=" attribute(s)' % n)

    # only the noscript <style> is allowed
    n = len(re.findall(r"<style[\s>]", body))
    if n:
        fail(f, "%d <style> block(s) outside noscript" % n)

    # --- DNA test 8: no en/em dashes -------------------------------------
    for dash, name in (("—", "em dash"), ("–", "en dash")):
        if dash in s:
            fail(f, "%d %s(es) (Jack's standing rule: none)"
                 % (s.count(dash), name))

    # --- DNA test 10: head completeness ----------------------------------
    for pat, label in (
        (r'rel="canonical"', "canonical"),
        (r'property="og:title"', "og:title"),
        (r'property="og:image"', "og:image"),
        (r'name="twitter:card"', "twitter:card"),
        (r'name="description"', "meta description"),
    ):
        if not re.search(pat, s, re.I):
            fail(f, "missing %s" % label)

    # --- DNA test 11: images ---------------------------------------------
    for m in re.finditer(r"<img\b[^>]*>", s, re.I):
        tag = m.group(0)
        src = (re.search(r'src="([^"]*)"', tag) or [None, "?"])[1]
        for attr in ("width", "height", "alt"):
            if not re.search(r"\b%s=" % attr, tag, re.I):
                fail(f, "<img %s> missing %s" % (src, attr))

    # --- stylesheet is the versioned one ---------------------------------
    if not re.search(r'href="style\.css\?v=2"', s):
        fail(f, "does not link style.css?v=2")
    if not re.search(r'src="script\.js\?v=2"', s):
        warn(f, "does not link script.js?v=2")

    # --- dead internal links ---------------------------------------------
    here = os.path.dirname(path)
    for m in re.finditer(r'href="([^"#?:]+\.html)"', s):
        if not os.path.exists(os.path.join(here, m.group(1))):
            fail(f, "dead link to %s" % m.group(1))

    # --- referenced assets exist -----------------------------------------
    for m in re.finditer(r'(?:src|href)="(assets/[^"]+)"', s):
        asset = m.group(1).split("?")[0]   # strip cache-busting ?v=N
        if not os.path.exists(os.path.join(here, asset)):
            fail(f, "missing asset %s" % asset)

    # --- banned copy (visible text only) ---------------------------------
    text = re.sub(r"<(script|style)\b.*?</\1>", " ", body, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text).lower()
    for b in BANNED:
        if b in text:
            fail(f, 'banned copy "%s"' % b)

    # --- hard rule 8: no phone CTAs off the contact page -----------------
    if f not in ("contact.html",):
        visible = re.sub(r"<(script|style)\b.*?</\1>", " ", body,
                         flags=re.S | re.I)
        visible = re.sub(r"<[^>]+>", " ", visible)
        for m in re.finditer(r"\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}", visible):
            fail(f, "phone number %s in visible copy (hard rule 8)"
                 % m.group(0))
        if re.search(r'href="tel:', s, re.I):
            fail(f, "tel: link present (hard rule 8)")

    # --- tag balance ------------------------------------------------------
    for tag in ("div", "section", "header", "footer"):
        o = len(re.findall(r"<%s[\s>]" % tag, s, re.I))
        c = len(re.findall(r"</%s>" % tag, s, re.I))
        if o != c:
            fail(f, "<%s> unbalanced: %d open, %d close" % (tag, o, c))

    # --- mascot name ------------------------------------------------------
    if "Meet Halo" in s:
        fail(f, 'stale mascot name "Meet Halo" (should be Nimbus)')

    # --- every form control needs a persistent label (test 9d) -----------
    for m in re.finditer(r"<(input|textarea)\b[^>]*>", s, re.I):
        tag = m.group(0)
        if re.search(r'type="hidden"', tag, re.I):
            continue
        fid = re.search(r'id="([^"]+)"', tag)
        if not fid or ('for="%s"' % fid.group(1)) not in s:
            nm = (re.search(r'name="([^"]*)"', tag) or [None, "?"])[1]
            fail(f, "form field %s has no <label for>" % nm)

    # --- FAQ markup matches what script.js expects -----------------------
    for m in re.finditer(r'<div class="qa">(.*?)</div>\s*</div>', s, re.S):
        if "<button" not in m.group(1) or 'class="ans"' not in m.group(1):
            fail(f, ".qa block missing a button or .ans panel")


def check_css(path):
    f = os.path.basename(path)
    s = io.open(path, encoding="utf-8").read()

    # DNA refusal 2
    n = len(re.findall(r"backdrop-filter\s*:[^;]*blur", s, re.I))
    if n:
        fail(f, "%d backdrop-filter blur rule(s) (refusal 2: none)" % n)

    # DNA test 1: three families declared
    fams = set()
    for m in re.finditer(r"--(?:display|sans|mono)\s*:\s*([^;]+)", s):
        fams.add(m.group(1).split(",")[0].strip().strip('"\''))
    if len(fams) < 3:
        fail(f, "only %d font families declared, DNA requires 3 (%s)"
             % (len(fams), ", ".join(sorted(fams))))

    # DNA test 2: radius scale
    radii = set(re.findall(r"--r-[\w-]+\s*:\s*([^;]+)", s))
    if len(radii) < 4:
        fail(f, "only %d radius tokens, DNA requires 4" % len(radii))

    # DNA refusal 3: no two-hue gradients
    for m in re.finditer(r"linear-gradient\(([^)]*)\)", s, re.I):
        hexes = re.findall(r"#[0-9a-fA-F]{3,8}", m.group(1))
        if len(set(h.lower() for h in hexes)) > 1:
            warn(f, "gradient with %d distinct hex stops: %s"
                 % (len(hexes), m.group(0)[:60]))

    # @import is what blocked render on v1
    if re.search(r"@import", s):
        fail(f, "@import in stylesheet (blocks render, use <link>)")

    # The burger is the only way into the nav on a phone. It is display:none by
    # default; if the mobile media query does not turn it back on, the site has
    # no navigation at all on phones. This shipped once, invisible to everything
    # except a screenshot. (design-dna.md test 9c)
    mob = re.search(r"@media\(max-width:900px\)\{(.*?)\n\}", s, re.S)
    if not mob or not re.search(r"\.burger\{[^}]*display:\s*flex", mob.group(1)):
        fail(f, "the burger is never set display:flex inside the 900px media "
                "query, so phones have NO navigation")

    # contrast: every text token against every ground it actually sits on
    def lum(hx):
        c = [int(hx[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
        return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]

    def ratio(a, b):
        l1, l2 = sorted([lum(a), lum(b)], reverse=True)
        return (l1 + .05) / (l2 + .05)

    tok = dict(re.findall(r"--([\w-]+):\s*(#[0-9A-Fa-f]{6})", s))
    for name in ("stone", "faint", "ink-2"):
        for ground in ("paper", "sand"):
            if name in tok and ground in tok:
                r = ratio(tok[name], tok[ground])
                if r < 4.5:
                    fail(f, "--%s on --%s is %.2f:1, needs 4.5:1"
                         % (name, ground, r))


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    os.chdir(here)

    pages = sorted(glob.glob("*.html"))
    pages = [p for p in pages if p != "loadout.html"]
    for p in pages:
        check_html(p)
    check_css("style.css")

    # site-wide: every asset used somewhere
    used = set()
    for p in pages + ["style.css", "script.js"]:
        s = io.open(p, encoding="utf-8").read()
        used |= set(re.findall(r"assets/([\w.-]+)", s))
    for a in sorted(os.listdir("assets")):
        if a not in used:
            warn("assets", "%s is referenced by no page" % a)

    # site-wide: no content photo used in two places (hard rule 4)
    IDENTITY = {"wing-mark.png", "wing-mark-hi.png", "wing-logo-box.png",
                "wing-digital-logo.png", "wing-mascot.js", "nimbus-kb.js",
                "halo.lottie.json"}
    where = {}
    for p in pages:
        s = io.open(p, encoding="utf-8").read()
        for m in re.finditer(r'<img[^>]+src="assets/([\w.-]+)"', s):
            where.setdefault(m.group(1), set()).add(p)
    for asset, ps in sorted(where.items()):
        if asset in IDENTITY:
            continue
        if len(ps) > 1:
            warn("assets", "%s rendered on %d pages (%s) - hard rule 4"
                 % (asset, len(ps), ", ".join(sorted(ps))))

    print("Wing Digital design-dna verification")
    print("%d pages + style.css checked\n" % len(pages))
    if FAILS:
        print("FAILURES (%d)" % len(FAILS))
        last = None
        for f, m in FAILS:
            if f != last:
                print("\n  %s" % f)
                last = f
            print("    FAIL  %s" % m)
    if WARNS:
        print("\nWARNINGS (%d)" % len(WARNS))
        last = None
        for f, m in WARNS:
            if f != last:
                print("\n  %s" % f)
                last = f
            print("    warn  %s" % m)
    if not FAILS:
        print("\nPASS - no failures.")
    return 1 if FAILS else 0


if __name__ == "__main__":
    sys.exit(main())
