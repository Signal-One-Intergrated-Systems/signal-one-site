"""Rebuild the site Inter asset from its unchanged source master.

Developer-only: python3 -m pip install fonttools brotli
Preserves the full encoded character set, 100–900 weight axis, default shaping,
kerning and the numeral features used by the site. Removes unused stylistic
alternates; checks every encoded glyph at each website weight before writing.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
source = root / "assets/fonts/Inter-Variable-source.woff2"
destination = root / "app/lib/fonts/Inter-Variable.woff2"
font = TTFont(source)
options = subset.Options()
options.layout_features = ["kern", "liga", "clig", "calt", "mark", "mkmk", "tnum", "lnum", "pnum", "case", "cpsp"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=set(code for table in font["cmap"].tables for code in table.cmap))
subsetter.subset(font)
for weight in (400, 600, 650, 700, 800):
    original = instantiateVariableFont(TTFont(source), {"wght": weight}, inplace=False)
    candidate = instantiateVariableFont(font, {"wght": weight}, inplace=False)
    original_cmap, candidate_cmap = original.getBestCmap(), candidate.getBestCmap()
    assert original_cmap.keys() == candidate_cmap.keys(), "Character coverage changed"
    for code, glyph in original_cmap.items():
        other = candidate_cmap[code]
        a = original["glyf"][glyph].getCoordinates(original["glyf"])[0]
        b = candidate["glyf"][other].getCoordinates(candidate["glyf"])[0]
        assert len(a) == len(b)
        assert all(abs(x1-x2) < .1 and abs(y1-y2) < .1 for (x1,y1), (x2,y2) in zip(a,b)), f"Outline changed: {code} at {weight}"
        assert original["hmtx"][glyph] == candidate["hmtx"][other], f"Metrics changed: {code} at {weight}"
font.flavor = "woff2"
font.save(destination)
print(f"Inter: {source.stat().st_size} → {destination.stat().st_size} bytes; encoded glyphs and website weight metrics preserved")
