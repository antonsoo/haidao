# The first island problem

## Read a printed witness, not an imagined original

The retained source is Waseda University Library **ni02 00649**, catalogued as
**1777**. The preface visible in PDF opening 9 is dated **乾隆四十年四月** (1775).
The header in opening 10 identifies Liu Hui of Jin as author and Li Chunfeng of
Tang as commentator. The bibliographic preface describes collecting scattered
material from the *Yongle Encyclopedia*. This is evidence for a later
transmission of the ancient work, not an ancient autograph.

The complete public-domain PDF is distributed through
[Wikimedia Commons](https://commons.wikimedia.org/w/index.php?curid=99007136).
Its SHA-256 is
`f187bc664284f3b60742641fb2e0afd69ce9f3342819d4aab358b771372edd0c`.
The retained metadata response is
[waseda-metadata.json](../public/sources/waseda-metadata.json).
Five whole photographed openings are retained, with their outer margins,
two leaves, notes and library marks. Nothing has been cropped, whitened or
retouched. The app's geometry diagrams are original modern drawings.

| PDF opening | What to inspect |
| --- | --- |
| 9 | Bibliographic preface; compilation statement and 1775 date |
| 10 | Heading and first problem on the left leaf |
| 11 | Height procedure, received commentary, small editorial correction, distance procedure |
| 12 | Distance answer at the start of the right leaf; the next pine problem follows |
| 13 | Continuation of the pine commentary; the conversion of fifty bu to three hundred chi crosses openings 12–13 |

The ten selected Chinese clauses were transcribed against these photographs.
Modern punctuation and excerpt boundaries are supplied. English renderings are
new. Thirty vocabulary entries include modern Mandarin pinyin. Neither those
renderings nor the pronunciation aids claim to be a critical edition or an
ancient reconstruction.

## The discrepancy worth operating

The main procedure says **相多為法**: use the excess as divisor. In opening 11,
the received commentary has **二表相去為相多以為法**, interpreting that excess
as the distance between the two poles. The smaller editorial **案** corrects
this to **前後去表相減餘四步為相多非二表相去也**: subtract the retreats; the
remaining four bu is the excess, not the pole gap. The numerical distance
commentary uses four as divisor as well.

We describe these as three voices in this witness. The project does not claim
that the contradictory phrase existed in a third-century original, originated
with Li Chunfeng himself, or was corrected by a named individual whose hand is
not established here.

## The observations and units

`h=5`, `s=1000`, `a=123`, `b=127`, all in bu. The source gives the pole height as
three zhang: ten chi per zhang and six chi per bu make this five bu. Three
hundred bu make a li, explicitly used in the first problem's commentary.
The next pine problem's commentary also converts fifty bu to three hundred
chi. No absolute metre equivalent or modern walking pace is assumed.

The poles and eyes are on a level baseline in the model. Each eye is on the
ground. The poles are vertical and equal. Ground alignment is not the same as
putting the two pole tips and the peak on one optical line.

## A second observation tests the recipe

Each observation independently specifies a line:

```text
Front: h*x + a*y = h*a
Rear:  h*x + b*y = h*(s+b)
```

At `(-D,H)`, equality yields `D=as/(b-a)` and `H=h+hs/(b-a)`.
For an arbitrary nonzero proposed divisor `f`, the recipe instead gives
`D=as/f`, `H=h+hs/f`. Substitution into the front line is an identity. The rear
height residual is

```text
candidate H - rear-line height = h*s*((b-a)-f)/(b*f)
```

Thus the wrong divisor can pass the first observation. With the pole-gap divisor
`f=1000`, `D=123`, `H=10`, while the rear ray predicts `6250/127`; the residual is
`-4980/127 bu`. The correct difference divisor is four, giving `D=30750` and
`H=1255`, the stated distance and height after converting li to bu.

When `s=b-a`, the two proposed divisors are numerically equal: both choices must
pass. When `b=a`, no difference-divisor candidate exists. When `b<a`, the exact
intersection is behind the front pole and below pole height, outside the source's
forward-island conditions. The algebra is retained instead of inventing a
positive forward distance.

## Modern independent setback intervals

With fixed positive `h,s` and `a∈[a₀-e,a₀+e]`, `b∈[b₀-e,b₀+e]`, `H` and `D`
increase with `a` and decrease with `b` throughout `b>a>0`. Their lower bounds
occur at `(a₀-e,b₀+e)`; finite upper bounds occur at `(a₀+e,b₀-e)` if that corner
still has `b>a`. If the allowed difference interval contains positive values but
reaches zero, forward islands have no finite upper bound. Parallel or reversed
pairs remain described as part of the allowed record. If an allowed setback
reaches zero, the model reports an invalid domain without clipping the interval.

This is a chosen interval experiment, not historical measurement precision,
rounding inferred from integer givens, or a confidence interval. Pole height and
gap uncertainty, terrain and atmospheric effects are omitted explicitly.

## Reproducing the retained assets

`scripts/source-assets.py --pdf SOURCE.pdf` checks the PDF identity and renders
whole openings 9–13 using Poppler 24.02.0 (`pdftoppm`, 3600-pixel longest edge,
JPEG quality 88). The authoritative public `source-manifest.json` records every
retained source and font asset's size and SHA-256. A watched Vite virtual module
reads that one manifest; it is not imported through Vite's public-file loader.

The CJK font is a renamed subset of the official Noto Sans CJK TC Regular font.
`public/fonts/provenance.json` records its original identity and tool versions.
With fontTools 4.67.0 and Brotli 1.2.1 installed, pass the original to
`scripts/source-assets.py --font NotoSansCJKtc-Regular.otf`. The generated
`characters.txt` states the retained characters. The Atkinson variable font and
both complete OFL notices are distributed locally. No font network requests are
needed.

The few lint exceptions have specific purposes: the three scrollable image
regions need keyboard focus; independent CSS components do not share a global
specificity ladder; browser journeys intentionally inspect rendered visible
text. Other recommended checks remain enabled.
