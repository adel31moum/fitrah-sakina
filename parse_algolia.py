import urllib.request
import urllib.parse
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

def get_coverr_videos(query):
    url = f"https://coverr.co/s?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    videos = []
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
            for s in scripts:
                if 'hits' in s and 'cdn.coverr.co' in s:
                    # extract json objects containing hits
                    for hit_match in re.finditer(r'\{"hits":\[(.*?)\]', s):
                        # try parsing
                        try:
                            hits_raw = hit_match.group(1)
                            # let's find all video objects inside hits
                            # Or parse regex for items in hits
                        except Exception as e:
                            pass
                    # Let's search for "slug":"..." and "title":"..." or "description":"..." inside script s
                    hit_items = re.findall(r'\{"id":"([^"]+)".*?"title":"([^"]+)".*?"slug":"([^"]+)"', s)
                    if not hit_items:
                        hit_items = re.findall(r'"title":"([^"]+)".*?"slug":"([^"]+)"', s)
                    
                    # Alternatively parse all "slug":"coverr-[^"]+" or "slug":"[^"]+"
                    slugs = re.findall(r'"slug":"(coverr-[^"]+)"', s)
                    descriptions = re.findall(r'"description":"([^"]+)"', s)
                    titles = re.findall(r'"title":"([^"]+)"', s)
                    tags = re.findall(r'"tags":\[(.*?)\]', s)

                    # Let's extract video objects directly
                    # Let's find occurrences of cdn.coverr.co/videos/
                    mp4s = re.findall(r'https://cdn\.coverr\.co/videos/([^/]+)/(1080p|720p|original)\.mp4', s)
                    for slug, res_type in mp4s:
                        if not slug.startswith('temp') and not slug.startswith('user-ai') and not slug.startswith('coverr-paywall'):
                            mp4_1080 = f"https://cdn.coverr.co/videos/{slug}/1080p.mp4"
                            if mp4_1080 not in [v['mp4'] for v in videos]:
                                videos.append({'slug': slug, 'mp4': mp4_1080})
    except Exception as e:
        print(f"Error for {query}: {e}")
    return videos

print("Searching courtroom...")
vids = get_coverr_videos("courtroom")
for v in vids:
    print(v)

