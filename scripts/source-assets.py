"""Reproduce five whole openings and verify the source identities; never crop a witness."""
import argparse
import hashlib
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
PDF_SHA = "f187bc664284f3b60742641fb2e0afd69ce9f3342819d4aab358b771372edd0c"

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", type=pathlib.Path)
    parser.add_argument("--font", type=pathlib.Path)
    args = parser.parse_args()
    if args.pdf:
        assert digest(args.pdf) == PDF_SHA, "Different source PDF"
        subprocess.run(["pdftoppm", "-f", "9", "-l", "13", "-scale-to", "3600", "-jpeg", "-jpegopt", "quality=88", str(args.pdf), str(ROOT / "public/sources/waseda")], check=True)
    if args.font:
        from fontTools import subset
        from fontTools.ttLib import TTFont
        assert digest(args.font) == "dce08bd4fd91aa8aa76ed8fea4b694c2dfb8550f67871e326843212ddbeb88b4", "Different original font"
        chars = set()
        for path in [*(ROOT / "src").rglob("*.ts"), ROOT / "index.html"]:
            chars.update(c for c in path.read_text() if ord(c) >= 0x80)
        chars.update("海島算經步丈尺里表間相多實法除乘今劉徽晉唐李淳風清案")
        font = TTFont(args.font, recalcTimestamp=False)
        missing = chars - {chr(n) for n in font.getBestCmap()}
        assert not missing, f"Missing source characters: {missing}"
        options = subset.Options()
        options.flavor = "woff2"
        options.name_IDs = ["*"]
        sub = subset.Subsetter(options=options)
        sub.populate(text="".join(sorted(chars)))
        sub.subset(font)
        for entry in font["name"].names:
            if entry.nameID in (1, 4, 6, 16):
                entry.string = ("HaidaoCJK" if entry.nameID == 6 else "Haidao CJK").encode(entry.getEncoding())
        (ROOT / "public/fonts/Noto-NOTICE.txt").write_text(font["name"].getDebugName(0) + "\nModified subset: Haidao CJK. SIL Open Font License 1.1; see Noto-OFL.txt.\n")
        font.flavor = "woff2"
        font.save(ROOT / "public/fonts/HaidaoCJK.woff2")
        (ROOT / "public/fonts/characters.txt").write_text("".join(sorted(chars)) + "\n")
        (ROOT / "public/fonts/provenance.json").write_text(json.dumps({"original": "https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/TraditionalChinese/NotoSansCJKtc-Regular.otf", "originalSha256": digest(args.font), "subsetName": "Haidao CJK", "tool": "fontTools 4.67.0; Brotli 1.2.1", "characters": len(chars), "license": "Noto-OFL.txt"}, indent=2) + "\n")
    assets = []
    for folder in ["sources", "fonts"]:
        for path in sorted((ROOT / "public" / folder).iterdir()):
            assets.append({"path": str(path.relative_to(ROOT / "public")), "bytes": path.stat().st_size, "sha256": digest(path)})
    manifest = {"witness": "Waseda University Library ni02 00649; catalogue date 1777; preface dated 1775", "description": "Five complete photographed openings, PDF pages 9-13. Rendered by Poppler 24.02.0, longest edge 3600 pixels, JPEG quality 88; no crop or retouch.", "pdf": "https://upload.wikimedia.org/wikipedia/commons/1/10/WUL-ni02_00649_%E6%B5%B7%E5%B3%B6%E7%AE%97%E7%B6%93.pdf", "pdfSha256": PDF_SHA, "commons": "https://commons.wikimedia.org/w/index.php?curid=99007136", "license": "Public domain; Commons PD-old / public domain mark. Original app, diagrams, transcription and English: MIT. Fonts: separate complete OFL notices.", "assets": assets}
    (ROOT / "public/source-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"assets": len(assets), "bytes": sum(a["bytes"] for a in assets)}))

if __name__ == "__main__":
    main()
