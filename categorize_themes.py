import json
import urllib.request
import re

with open('mixkit_videos.json') as f:
    videos = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

def check_url(url):
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception as e:
        return False

themes = {
    "1. Dark city at night / neon lights / urban chaos": lambda v: (
        any(k in v['title'] for k in ['neon', 'night city', 'city night', 'city at night', 'urban night', 'night traffic', 'street at night', 'traffic at night', 'city lights at night', 'tokyo night', 'flickering in the dark'])
    ),
    "2. Courtroom / legal documents / justice scales": lambda v: (
        any(k in v['title'] for k in ['judge', 'verdict', 'court', 'signing', 'contract', 'lawyer', 'legal', 'document', 'gavel', 'sentence'])
    ),
    "3. Person scrolling phone in dark room / phone addiction": lambda v: (
        any(k in v['title'] for k in ['phone', 'smartphone', 'texting', 'screen', 'typing on a cell']) and any(k in v['title'] for k in ['dark', 'bed', 'night', 'room', 'cell', 'smartphone', 'phone', 'texting'])
    ),
    "4. Broken empty home / rain on window / abandoned": lambda v: (
        any(k in v['title'] for k in ['rain', 'raindrops', 'window', 'glass', 'abandoned', 'empty room', 'dark room'])
    ),
    "5. Desert dawn / sunrise over dunes": lambda v: (
        ('desert' in v['title'] or 'dune' in v['title'] or 'sahara' in v['title']) and any(k in v['title'] for k in ['sunrise', 'dawn', 'morning', 'rising', 'sun'])
    ),
    "6. Campfire at night / warm fire": lambda v: (
        any(k in v['title'] for k in ['campfire', 'bonfire', 'fireplace', 'fire pit', 'burning log', 'flames over', 'flames in', 'warm fire', 'sparks'])
    ),
    "7. Starry night sky / milky way desert": lambda v: (
        any(k in v['title'] for k in ['star', 'starry', 'milky way', 'sky at night', 'night sky', 'galaxy'])
    ),
    "8. Desert sunset / golden hour dunes": lambda v: (
        ('desert' in v['title'] or 'dune' in v['title'] or 'sahara' in v['title']) and any(k in v['title'] for k in ['sunset', 'golden', 'setting', 'twilight', 'evening'])
    )
}

selected = {}

for theme, fn in themes.items():
    print(f"\n=== {theme} ===")
    matches = [v for v in videos.values() if fn(v)]
    valid_matches = []
    for m in matches:
        if check_url(m['url']):
            valid_matches.append(m)
            print(f"  ID {m['id']} | Title: {m['title']} | URL: {m['url']}")
    selected[theme] = valid_matches

