import urllib.request
import urllib.parse
import re
import json
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8')
            # Extract video titles / ids / mp4 urls
            # Coverr pages usually contain video slugs or direct cdn URLs
            # Let's find cdn.coverr.co URLs
            mp4s = re.findall(r'https://cdn\.coverr\.co/videos/([^/"\']+)/1080p\.mp4', html)
            for vid_slug in mp4s:
                if 'temp' in vid_slug or 'user-ai' in vid_slug:
                    continue
                full_mp4 = f"https://cdn.coverr.co/videos/{vid_slug}/1080p.mp4"
                if full_mp4 not in [r['url'] for r in results]:
                    results.append({'title': vid_slug, 'url': full_mp4, 'source': 'Coverr'})
            
            # Also check 720p if 1080p not found
            if len(results) < 2:
                mp4s_720 = re.findall(r'https://cdn\.coverr\.co/videos/([^/"\']+)/720p\.mp4', html)
                for vid_slug in mp4s_720:
                    if 'temp' in vid_slug or 'user-ai' in vid_slug:
                        continue
                    full_mp4 = f"https://cdn.coverr.co/videos/{vid_slug}/720p.mp4"
                    if full_mp4 not in [r['url'] for r in results]:
                        results.append({'title': vid_slug, 'url': full_mp4, 'source': 'Coverr'})
    except Exception as e:
        print(f"Coverr search error for {query}: {e}")
    return results

themes = {
    "Theme 1: Dark city at night / neon lights / urban chaos": ["city at night", "neon city", "urban night traffic", "dark city"],
    "Theme 2: Courtroom / legal documents / justice scales": ["lawyer", "justice scale", "courtroom", "documents law", "judge gavel"],
    "Theme 3: Person scrolling phone in dark room / phone addiction": ["person using phone dark", "smartphone bed dark", "scrolling phone night", "phone dark"],
    "Theme 4: Broken empty home / rain on window / abandoned": ["rain on window", "abandoned house", "empty dark room", "rain window window"],
    "Theme 5: Desert dawn / sunrise over dunes": ["desert sunrise", "sand dunes sunrise", "desert dawn", "dunes morning"],
    "Theme 6: Campfire at night / warm fire": ["campfire night", "bonfire night", "fireplace fire", "warm fire"],
    "Theme 7: Starry night sky / milky way desert": ["starry night", "milky way night", "desert night stars", "stars night sky"],
    "Theme 8: Desert sunset / golden hour dunes": ["desert sunset", "dunes sunset", "golden hour desert", "sunset dunes"]
}

final_results = {}

for theme_name, queries in themes.items():
    print(f"\n========================================\n{theme_name}\n========================================")
    found = []
    used_urls = set()
    for q in queries:
        if len(found) >= 3:
            break
        res = search_coverr(q)
        for r in res:
            if r['url'] not in used_urls:
                if verify_url(r['url']):
                    used_urls.add(r['url'])
                    found.append(r)
                    print(f"  [{r['source']}] {r['title']} -> {r['url']}")
                    if len(found) >= 3:
                        break
        time.sleep(0.5)
    final_results[theme_name] = found

