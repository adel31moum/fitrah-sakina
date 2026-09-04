import urllib.request
import re
from bs4 import BeautifulSoup
import time
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

categories = [
    "city", "night", "neon", "urban", "traffic",
    "legal", "law", "judge", "court", "justice", "contract", "document",
    "phone", "smartphone", "screen", "bed", "mobile",
    "rain", "window", "house", "abandoned", "storm",
    "desert", "dunes", "sunrise", "dawn", "morning",
    "fire", "campfire", "bonfire", "fireplace", "flames",
    "stars", "starry", "sky", "milky-way", "galaxy",
    "sunset", "golden-hour"
]

videos_by_id = {}

def verify_url(url):
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception as e:
        return False

for cat in categories:
    time.sleep(1.2)
    url = f"https://mixkit.co/free-stock-video/{cat}/"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a['href']
                m = re.search(r'/free-stock-video/([a-z0-9-]+)-(\d+)/$', href)
                if m:
                    slug, vid_id = m.group(1), m.group(2)
                    if vid_id not in videos_by_id:
                        title = slug.replace('-', ' ')
                        videos_by_id[vid_id] = {
                            'id': vid_id,
                            'slug': slug,
                            'title': title,
                            'url': f"https://assets.mixkit.co/videos/{vid_id}/{vid_id}-720.mp4",
                            'page': f"https://mixkit.co{href}",
                            'category_tags': [cat]
                        }
                    else:
                        videos_by_id[vid_id]['category_tags'].append(cat)
    except Exception as e:
        print(f"Error category '{cat}': {e}")

print(f"Total unique Mixkit videos harvested: {len(videos_by_id)}")

# Save harvested to json
with open('mixkit_videos.json', 'w') as f:
    json.dump(videos_by_id, f, indent=2)

