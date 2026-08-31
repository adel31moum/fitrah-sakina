import urllib.request
import urllib.parse
import re
from bs4 import BeautifulSoup
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def ddg_search(query):
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    links = []
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', class_='result__url'):
                raw_url = a.get('href', '')
                text = a.text.strip()
                # parse duckduckgo redirect url
                m = re.search(r'uddg=([^&]+)', raw_url)
                if m:
                    actual_url = urllib.parse.unquote(m.group(1))
                    links.append((text, actual_url))
    except Exception as e:
        print(f"DDG error for '{query}': {e}")
    return links

def verify_url(url):
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception as e:
        return False

queries_by_theme = {
    "1. Dark city at night / neon lights / urban chaos": [
        "site:mixkit.co/free-stock-video/ dark city night",
        "site:mixkit.co/free-stock-video/ neon lights city",
        "site:mixkit.co/free-stock-video/ urban night traffic",
        "site:coverr.co gloomy city at night",
        "site:coverr.co city roads at night"
    ],
    "2. Courtroom / legal documents / justice scales": [
        "site:mixkit.co/free-stock-video/ legal",
        "site:mixkit.co/free-stock-video/ justice",
        "site:mixkit.co/free-stock-video/ court",
        "site:mixkit.co/free-stock-video/ lawyer",
        "site:mixkit.co/free-stock-video/ contract signature"
    ],
    "3. Person scrolling phone in dark room / phone addiction": [
        "site:mixkit.co/free-stock-video/ smartphone dark",
        "site:mixkit.co/free-stock-video/ scrolling phone night",
        "site:mixkit.co/free-stock-video/ phone bed dark",
        "site:mixkit.co/free-stock-video/ looking at phone dark",
        "site:mixkit.co/free-stock-video/ mobile phone screen dark"
    ],
    "4. Broken empty home / rain on window / abandoned": [
        "site:mixkit.co/free-stock-video/ rain window",
        "site:mixkit.co/free-stock-video/ raindrops glass",
        "site:mixkit.co/free-stock-video/ abandoned room",
        "site:mixkit.co/free-stock-video/ empty dark room",
        "site:coverr.co raindrops on the window"
    ],
    "5. Desert dawn / sunrise over dunes": [
        "site:mixkit.co/free-stock-video/ desert sunrise",
        "site:mixkit.co/free-stock-video/ dunes morning",
        "site:mixkit.co/free-stock-video/ desert dawn",
        "site:mixkit.co/free-stock-video/ sand dunes sunrise",
        "site:coverr.co desert sunrise"
    ],
    "6. Campfire at night / warm fire": [
        "site:mixkit.co/free-stock-video/ campfire night",
        "site:mixkit.co/free-stock-video/ bonfire night",
        "site:mixkit.co/free-stock-video/ fireplace flame",
        "site:mixkit.co/free-stock-video/ camp fire night",
        "site:coverr.co sparks from a bonfire"
    ],
    "7. Starry night sky / milky way desert": [
        "site:mixkit.co/free-stock-video/ starry night",
        "site:mixkit.co/free-stock-video/ milky way stars",
        "site:mixkit.co/free-stock-video/ desert stars night",
        "site:mixkit.co/free-stock-video/ night sky stars",
        "site:coverr.co starry night sky"
    ],
    "8. Desert sunset / golden hour dunes": [
        "site:mixkit.co/free-stock-video/ desert sunset",
        "site:mixkit.co/free-stock-video/ sand dunes sunset",
        "site:mixkit.co/free-stock-video/ golden hour desert",
        "site:mixkit.co/free-stock-video/ dunes sunset",
        "site:coverr.co an empty desert"
    ]
}

results_by_theme = {}

for theme, q_list in queries_by_theme.items():
    print(f"\n========================================\n{theme}\n========================================")
    candidates = []
    seen_mixkit_ids = set()
    for q in q_list:
        time.sleep(1)
        links = ddg_search(q)
        for text, url in links:
            # Check Mixkit pattern
            m = re.search(r'mixkit\.co/free-stock-video/([^/]+)-(\d+)/?$', url)
            if m:
                slug, vid_id = m.group(1), m.group(2)
                if vid_id not in seen_mixkit_ids:
                    seen_mixkit_ids.add(vid_id)
                    mp4_720 = f"https://assets.mixkit.co/videos/{vid_id}/{vid_id}-720.mp4"
                    candidates.append({'title': slug.replace('-', ' '), 'url': mp4_720, 'id': vid_id, 'source': 'Mixkit', 'page': url})
            # Check Coverr pattern
            m_cov = re.search(r'coverr\.co/videos/([^/]+)', url)
            if m_cov:
                slug = m_cov.group(1)
                mp4_cov = f"https://cdn.coverr.co/videos/{slug}/1080p.mp4"
                candidates.append({'title': slug.replace('-', ' '), 'url': mp4_cov, 'id': slug, 'source': 'Coverr', 'page': url})
    
    # Filter & verify
    verified = []
    for c in candidates:
        if verify_url(c['url']):
            verified.append(c)
            print(f"  FOUND [{c['source']}] ({c['id']}) Title: {c['title']} => {c['url']}")
            if len(verified) >= 3:
                break
    results_by_theme[theme] = verified

