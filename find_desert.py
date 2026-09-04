import urllib.request
import urllib.parse
import re
from bs4 import BeautifulSoup
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
}

def verify_url(url):
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception as e:
        return False

# Search Mixkit tag pages for desert, sunrise, sunset, dunes
tags = ["desert", "dunes", "sunrise", "sunset", "golden-hour", "dawn", "morning", "twilight"]

mixkit_desert_vids = []

for tag in tags:
    url = f"https://mixkit.co/free-stock-video/{tag}/"
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
                    title = slug.replace('-', ' ')
                    if any(k in title for k in ['desert', 'dune', 'sahara', 'sand']):
                        mixkit_desert_vids.append({'id': vid_id, 'title': title, 'slug': slug})
    except Exception as e:
        print(f"Error {tag}: {e}")

print("=== All Desert/Dunes Videos on Mixkit ===")
for v in mixkit_desert_vids:
    url = f"https://assets.mixkit.co/videos/{v['id']}/{v['id']}-720.mp4"
    if verify_url(url):
        print(f"ID {v['id']} | Title: {v['title']} | URL: {url}")

