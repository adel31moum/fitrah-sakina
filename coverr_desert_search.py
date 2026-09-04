import urllib.request
import urllib.parse
import re
import json

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

def search_coverr(query):
    url = f"https://coverr.co/s?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    results = []
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            # Look for video objects or slugs
            # In script tags, hits contain slug or title
            slugs = re.findall(r'"slug":"(coverr-[^"]+)"', html)
            for slug in set(slugs):
                if not any(x in slug for x in ['paywall', 'temp', 'user-ai']):
                    url_1080 = f"https://cdn.coverr.co/videos/{slug}/1080p.mp4"
                    if verify_url(url_1080):
                        results.append({'title': slug.replace('coverr-', '').replace('-', ' '), 'url': url_1080})
    except Exception as e:
        print(f"Error {query}: {e}")
    return results

print("=== Coverr Desert Sunrise ===")
for r in search_coverr("desert sunrise") + search_coverr("sunrise dunes") + search_coverr("desert dawn"):
    print("Title:", r['title'], "| URL:", r['url'])

print("\n=== Coverr Desert Sunset ===")
for r in search_coverr("desert sunset") + search_coverr("sunset dunes") + search_coverr("golden hour desert"):
    print("Title:", r['title'], "| URL:", r['url'])

