"""Check native browser files against point-defined sight lines, without app imports."""
import base64
import csv
import hashlib
from fractions import Fraction as F
from html.parser import HTMLParser
import io
import json
from pathlib import Path
import sys

class Reading(HTMLParser):
    def __init__(self):
        super().__init__()
        self.record = ''
        self.in_record = False
        self.assets = []
        self.markers = []
        self.scripts = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'pre' and a.get('id') == 'exact-record':
            self.in_record = True
        if tag == 'script':
            self.scripts += 1
        if tag == 'img':
            self.assets.append(a['src'])
        if tag == 'circle' and 'data-probe' in a:
            self.markers.append(a)
    def handle_endtag(self, tag):
        if tag == 'pre':
            self.in_record = False
    def handle_data(self, text):
        if self.in_record:
            self.record += text

def fields(text):
    return {row[0]: row[1] for row in list(csv.reader(io.StringIO(text)))[1:]}

def crossing(h, s, a, b):
    # Independent 2x2 determinant; each line comes from its pole and eye.
    A, B, C = h, a, h*a
    X, Y, Z = h, b, h*(s+b)
    det = A*Y-X*B
    if det == 0:
        return None
    return (C*Y-Z*B)/det, (A*Z-X*C)/det

def check_record(f):
    h, s, a, b = [F(f[k]) for k in ('pole_height','pole_gap','front_retreat','rear_retreat')]
    e = F(f['setback_half_width'])
    u = e*F(f['probe_percent'])/100
    v = u if f['error_model'] == 'shared' else -u
    assert F(f['front_error']) == u and F(f['rear_error']) == v
    assert F(f['adjusted_front']) == a+u and F(f['adjusted_rear']) == b+v
    pt = crossing(h,s,a+u,b+v)
    assert pt is not None
    assert F(f['probe_distance']) == -pt[0]
    assert F(f['probe_height']) == pt[1]
    assert f['independent_kind'] == 'unbounded'
    assert f['shared_kind'] == 'bounded'
    assert F(f['shared_lowH']) == F(f['shared_highH']) == 1255
    assert (F(f['shared_lowD']),F(f['shared_highD'])) == (30250,31250)
    assert f['license'] == 'PolyForm Noncommercial 1.0.0'
    assert 'Copyright (c) 2026 Anthony Mercer' in f['required_notice']
    return f['error_model'], F(f['probe_percent'])/100

root = Path(sys.argv[1])
manifest = json.loads(Path('public/source-manifest.json').read_text())
expected = [a['sha256'] for a in manifest['assets'] if a['path'].endswith('.jpg')]
results = []
for engine in ('chromium','firefox'):
    for width in (1440,375):
        name = f'{engine}-{width}'
        for suffix in ('shared.csv', 'record.csv'):
            check_record(fields((root/f'{name}-{suffix}').read_text()))
        for suffix in ('shared-reading.html','reading.html','offline-reading.html'):
            p = Reading()
            p.feed((root/f'{name}-{suffix}').read_text())
            assert p.scripts == 0
            mode,t = check_record(fields(p.record))
            hashes = [hashlib.sha256(base64.b64decode(src.split(',',1)[1])).hexdigest() for src in p.assets]
            assert hashes == expected
            assert len(p.markers) == 1
            point = p.markers[0]
            assert abs(float(point['cx'])-float(215+100*t)) < 1e-9
            assert abs(float(point['cy'])-float(155-100*(t if mode == 'shared' else -t))) < 1e-9
            results.append({'file': f'{name}-{suffix}', 'model':mode, 'sourceImages':len(hashes), 'marker': [point['cx'],point['cy']]})
print(json.dumps({'records': 20, 'readings':results, 'method':'Python Fraction; point-defined 2x2 line intersection; decoded original source bytes; actual SVG marker coordinates'},indent=2))
