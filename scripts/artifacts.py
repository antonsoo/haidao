"""Inspect actual browser downloads, including source bytes and exact sight-line checks."""
import argparse
import base64
import csv
from fractions import Fraction as F
import hashlib
from html.parser import HTMLParser
import io
import json
import pathlib
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.images = []
        self.pres = {}
        self.pre_id = None
        self.pre_parts = []
        self.text = []
        self.scripts = 0
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'img': self.images.append(a)
        if tag == 'script': self.scripts += 1
        if tag == 'pre': self.pre_id = a.get('id', f'pre-{len(self.pres)}'); self.pre_parts = []
    def handle_endtag(self, tag):
        if tag == 'pre': self.pres[self.pre_id] = ''.join(self.pre_parts); self.pre_id = None
    def handle_data(self, text):
        self.text.append(text)
        if self.pre_id is not None: self.pre_parts.append(text)

def digest(data): return hashlib.sha256(data).hexdigest()
def field_map(text):
    rows = list(csv.reader(io.StringIO(text)))
    assert rows[0] == ['field','exact_value','unit','meaning']
    fields = {r[0]: r[1] for r in rows[1:] if r[0] != 'asset'}
    h,s,a,b = [F(fields[k]) for k in ('pole_height','pole_gap','front_retreat','rear_retreat')]
    for kind in ('difference','gap'):
        if fields[f'{kind}_divisor'] == 'undefined':
            assert kind == 'difference' and b == a
            continue
        f = F(fields[f'{kind}_divisor'])
        H = F(fields[f'{kind}_height']); D = F(fields[f'{kind}_distance'])
        assert f == (b-a if kind=='difference' else s)
        assert H == h+h*s/f and D == a*s/f
        front=h*(a+D)/a; rear=h*(s+b+D)/b
        assert F(fields[f'{kind}_front']) == front == H
        assert F(fields[f'{kind}_rear']) == rear
        assert F(fields[f'{kind}_rearResidual']) == H-rear
    return fields

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('directory',type=pathlib.Path)
    parser.add_argument('--readings',required=True,type=pathlib.Path)
    args=parser.parse_args()
    readings=json.loads(args.readings.read_text())
    directory=args.directory
    manifest=json.loads((ROOT/'public/source-manifest.json').read_text())
    identities={a['path']:a for a in manifest['assets']}
    html_count=csv_count=svg_count=0
    for file in directory.glob('*.csv'):
        field_map(file.read_text()); csv_count+=1
    for file in directory.glob('*.html'):
        html=file.read_text(); doc=Document(html)
        assert doc.scripts==0 and len(doc.images)==5
        for image,page in zip(doc.images,range(9,14)):
            data=base64.b64decode(image['src'].split(',',1)[1])
            assert digest(data)==identities[f'sources/waseda-{page:02}.jpg']['sha256']
        for name,mime in [('AtkinsonHyperlegibleNext.ttf','ttf'),('HaidaoCJK.woff2','woff2')]:
            data=base64.b64decode(re.search(rf'data:font/{mime};base64,([^\)]+)',html).group(1))
            assert digest(data)==identities[f'fonts/{name}']['sha256']
        field_map(doc.pres['exact-record'])
        assert json.loads(doc.pres['source-manifest'])==manifest
        visible=' '.join(' '.join(doc.text).split())
        for reading in readings:
            for key in ('chinese','english','note'):
                assert ' '.join(reading[key].split()) in visible,(file,key,reading['title'])
            for word in reading['words']:
                for field in word: assert ' '.join(field.split()) in visible
        for notice in ['LICENSE','public/fonts/Atkinson-OFL.txt','public/fonts/Noto-OFL.txt','public/fonts/Noto-NOTICE.txt']:
            assert (ROOT/notice).read_text().strip() in '\n'.join(doc.pres.values())
        html_count+=1
    for file in directory.glob('*.svg'):
        root=ET.fromstring(file.read_text())
        ns={'s':'http://www.w3.org/2000/svg'}
        metadata=json.loads(root.find('s:metadata',ns).text)
        assert metadata['license']==(ROOT/'LICENSE').read_text()
        assert metadata['fontLicense']==(ROOT/'public/fonts/Atkinson-OFL.txt').read_text()
        st=metadata['state']; h,s,a,b=[F(st[k],4) for k in ('pole','gap','front','rear')]
        f=b-a if st['choice']=='difference' else s
        c=root.find('.//s:path[@data-height]',ns)
        assert c is not None
        H,D=F(c.attrib['data-height']),F(c.attrib['data-distance'])
        assert H==h+h*s/f and D==a*s/f
        # Recover the scale from each real pole, and check the visible ray slopes.
        pole=root.findall('.//s:line[@class="pole"]',ns)[0]
        scale=(float(pole.attrib['y1'])-float(pole.attrib['y2']))/float(h)
        for kind,retreat in [('front',a),('rear',b)]:
            ray=root.findall(f'.//s:line[@class="{kind}"]',ns)[0]
            slope=-(float(ray.attrib['y2'])-float(ray.attrib['y1']))/(float(ray.attrib['x2'])-float(ray.attrib['x1']))
            assert abs(slope+float(h/retreat))<1e-10
        match=re.search(r'^M([^,]+),([^V]+)V(.+)$',c.attrib['d'])
        assert abs((float(match[2])-float(match[3]))/scale-float(H))<1e-7
        svg_count+=1
    pdf=directory/'haidao-reading.pdf'
    info=subprocess.check_output(['pdfinfo',str(pdf)],text=True)
    assert 'Tagged:          yes' in info and 'JavaScript:      no' in info
    pages=int(re.search(r'Pages:\s+(\d+)',info).group(1))
    pdf_text=subprocess.check_output(['pdftotext','-layout',str(pdf),'-'],text=True)
    flat=''.join(pdf_text.split())
    for reading in readings:
        for field in [reading['chinese'],reading['english'],reading['note'],*(item for word in reading['words'] for item in word)]:
            assert ''.join(field.split()) in flat, (reading['title'],field)
    bbox=directory/'pdf-bounds.html'
    subprocess.run(['pdftotext','-bbox',str(pdf),str(bbox)],check=True)
    tree=ET.parse(bbox);words=0
    for page in tree.getroot().iter('{http://www.w3.org/1999/xhtml}page'):
        width,height=float(page.attrib['width']),float(page.attrib['height'])
        for word in page:
            if word.tag.endswith('word'):
                assert 0<=float(word.attrib['xMin'])<=float(word.attrib['xMax'])<=width+.1
                assert 0<=float(word.attrib['yMin'])<=float(word.attrib['yMax'])<=height+.1
                words+=1
    extracts=directory/'pdf-images';extracts.mkdir(exist_ok=True)
    subprocess.run(['pdfimages','-j',str(pdf),str(extracts/'image')],check=True)
    pdf_image_hashes={digest(p.read_bytes()) for p in extracts.glob('*.jpg')}
    assert {identities[f'sources/waseda-{i:02}.jpg']['sha256'] for i in range(9,14)}<=pdf_image_hashes
    print(json.dumps({'html_files':html_count,'csv_files':csv_count,'svg_files':svg_count,'readings_per_html':len(readings),'language_fields_per_html':sum(3+3*len(r['words']) for r in readings),'whole_source_images_per_html':5,'source_jpegs_byte_identical_in_pdf':5,'pdf_pages':pages,'pdf_words_within_page_bounds':words,'tagged_pdf':True,'script_free_pdf':True},indent=2))

if __name__=='__main__': main()
