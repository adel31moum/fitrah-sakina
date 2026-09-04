import urllib.request
import re
from bs4 import BeautifulSoup
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

categories = [
    "city", "night", "rain", "desert", "fire", "phone", "legal", "law", "stars", "sunset", "sunrise", "dunes", "house", "room"
]

def fetch_category(cat):
    url = f"https://mixkit.co/free-stock-video/{cat}/"
    req = urllib.request.Request(url, headers=headers)
    time.sleep(2)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            print(f"Category '{cat}' successfully loaded, HTML size {len(html)}")
            # Extract links to videos
            vids = []
            for a in soup.find_all('a', href=True):
                href = a['href']
                # Mixkit video pages look like: /free-stock-video/title-slug-1234/
                m = re.search(r'/free-stock-video/([a-z0-9-]+)-(\d+)/$', href)
                if m:
                    slug, vid_id = m.group(1), m.group(2)
                    vids.append((slug, vid_id, href))
            return vids
    except Exception as e:
        print(f"Error category '{cat}': {e}")
        return []

for c in categories:
    res = fetch_category(c)
    print(f"Cat '{c}': found {len(res)} video pages. Sample: {res[:2]}")

