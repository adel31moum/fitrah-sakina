import urllib.request
import urllib.parse
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def verify_url(url):
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception as e:
        return False

def get_coverr_mp4s(query):
    url = f"https://coverr.co/s?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    found = []
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            matches = re.findall(r'https://cdn\.coverr\.co/videos/([^/]+)/(1080p|720p|original)\.mp4', html)
            for slug, res in matches:
                if not any(x in slug for x in ['paywall', 'temp', 'user-ai']):
                    mp4 = f"https://cdn.coverr.co/videos/{slug}/1080p.mp4"
                    if mp4 not in found and verify_url(mp4):
                        found.append(mp4)
    except Exception as e:
        print(f"Error {query}: {e}")
    return found

for q in ["desert", "sunrise", "sunset", "dunes", "dune", "dawn", "golden hour", "starry night", "milky way"]:
    res = get_coverr_mp4s(q)
    print(f"Query '{q}': found {len(res)} MP4s:")
    for r in res[:5]:
        print("  ", r)

