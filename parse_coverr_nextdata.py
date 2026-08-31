import urllib.request
import urllib.parse
import json
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

def search_coverr_json(query):
    url = f"https://coverr.co/s?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
            if m:
                data = json.loads(m.group(1))
                page_props = data.get('props', {}).get('pageProps', {})
                videos = page_props.get('videos', [])
                if not videos and 'initialState' in page_props:
                    videos = page_props.get('initialState', {}).get('videos', [])
                
                print(f"Query: '{query}' -> Found {len(videos)} videos in NEXT_DATA")
                res = []
                for v in videos[:10]:
                    title = v.get('title') or v.get('description') or v.get('slug')
                    slug = v.get('slug')
                    urls = v.get('urls', {})
                    # Prefer mp4 1080p, 720p, etc
                    mp4_url = urls.get('mp4') or urls.get('mp4_download') or urls.get('mp4_720')
                    if not mp4_url and slug:
                        mp4_url = f"https://cdn.coverr.co/videos/{slug}/1080p.mp4"
                    res.append({'title': title, 'slug': slug, 'mp4': mp4_url, 'v': v})
                return res
            else:
                print("No __NEXT_DATA__ found")
    except Exception as e:
        print(f"Error for '{query}': {e}")
    return []

res = search_coverr_json("courtroom")
for r in res[:5]:
    print("Title:", r['title'])
    print("MP4:", r['mp4'])
    print("Keys in v:", list(r['v'].keys()))
    print("---")

