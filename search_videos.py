import urllib.request
import urllib.parse
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

def search_mixkit(query):
    url = f"https://mixkit.co/free-stock-video/{urllib.parse.quote(query)}/"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            # Look for video mp4 links or data attributes
            mp4s = re.findall(r'https://assets\.mixkit\.co/videos/[^"\']+\.mp4', html)
            return list(set(mp4s))
    except Exception as e:
        print(f"Mixkit search error for {query}: {e}")
        return []

def search_mixkit_alt(query):
    # Mixkit search url format might be https://mixkit.co/free-stock-video/search/{query}/ or similar
    url = f"https://mixkit.co/free-stock-video/search/{urllib.parse.quote(query)}/"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            mp4s = re.findall(r'https://assets\.mixkit\.co/videos/[^"\']+\.mp4', html)
            return list(set(mp4s))
    except Exception as e:
        print(f"Mixkit alt search error for {query}: {e}")
        return []

queries = [
    ("Dark city at night / neon lights / urban chaos", ["neon city night", "city night dark", "urban night"]),
    ("Courtroom / legal documents / justice scales", ["courtroom", "justice scale", "lawyer document"]),
    ("Person scrolling phone in dark room / phone addiction", ["phone dark room", "scrolling phone night", "smartphone dark"]),
    ("Broken empty home / rain on window / abandoned", ["rain on window", "abandoned house", "empty dark room"]),
    ("Desert dawn / sunrise over dunes", ["desert sunrise", "desert dawn", "dunes sunrise"]),
    ("Campfire at night / warm fire", ["campfire night", "fireplace warm", "camp fire"]),
    ("Starry night sky / milky way desert", ["starry night desert", "milky way desert", "stars night sky"]),
    ("Desert sunset / golden hour dunes", ["desert sunset", "dunes sunset", "golden hour desert"])
]

for theme, q_list in queries:
    print(f"=== {theme} ===")
    found = []
    for q in q_list:
        res = search_mixkit(q)
        if not res:
            res = search_mixkit_alt(q)
        for r in res:
            if r not in found:
                found.append(r)
    for f in found[:5]:
        print("  ", f)

