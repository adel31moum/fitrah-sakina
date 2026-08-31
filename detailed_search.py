import urllib.request
import urllib.parse
import re
import time
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

def check_url(url):
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception as e:
        return False

def get_mixkit_video_details(video_page_url):
    req = urllib.request.Request(video_page_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            title = soup.find('h1')
            title_text = title.text.strip() if title else ""
            mp4s = re.findall(r'https://assets\.mixkit\.co/videos/[^"\']+\.mp4', html)
            # Find the best mp4
            mp4_720 = None
            for m in mp4s:
                # convert e.g. -360.mp4 or preview to -720.mp4 or check direct link
                base_match = re.search(r'https://assets\.mixkit\.co/videos/(\d+)/\1', m)
                if base_match:
                    vid_id = base_match.group(1)
                    mp4_720 = f"https://assets.mixkit.co/videos/{vid_id}/{vid_id}-720.mp4"
                    break
            return title_text, mp4_720, mp4s
    except Exception as e:
        print(f"Error fetching {video_page_url}: {e}")
        return "", None, []

def search_mixkit_keyword(keyword):
    url = f"https://mixkit.co/free-stock-video/{urllib.parse.quote(keyword)}/"
    req = urllib.request.Request(url, headers=headers)
    results = []
    try:
        time.sleep(1.5)
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            links = soup.find_all('a', href=True)
            for l in links:
                href = l['href']
                if '/free-stock-video/' in href and href != '/free-stock-video/' and not href.startswith('/free-stock-video/tag/'):
                    full_url = "https://mixkit.co" + href if href.startswith('/') else href
                    if full_url not in results:
                        results.append(full_url)
    except Exception as e:
        print(f"Search error for {keyword}: {e}")
    return results

themes_keywords = {
    "1. Dark city at night / neon lights / urban chaos": ["neon-city", "night-city", "urban-night", "city-traffic-at-night"],
    "2. Courtroom / legal documents / justice scales": ["lawyer", "justice", "legal", "courtroom", "gavel"],
    "3. Person scrolling phone in dark room / phone addiction": ["phone-dark", "scrolling-phone", "using-smartphone-in-bed", "smartphone-dark"],
    "4. Broken empty home / rain on window / abandoned": ["rain-on-window", "abandoned-house", "empty-room", "rain-window"],
    "5. Desert dawn / sunrise over dunes": ["desert-sunrise", "sand-dunes", "desert-dawn", "desert-dunes"],
    "6. Campfire at night / warm fire": ["campfire", "fire-pit", "bonfire", "fireplace"],
    "7. Starry night sky / milky way desert": ["starry-night", "milky-way", "night-sky-stars", "desert-night"],
    "8. Desert sunset / golden hour dunes": ["desert-sunset", "sunset-desert", "dunes-sunset", "golden-hour-desert"]
}

for theme, kws in themes_keywords.items():
    print(f"\n========================================\n{theme}\n========================================")
    seen_ids = set()
    found_count = 0
    for kw in kws:
        if found_count >= 3:
            break
        video_pages = search_mixkit_keyword(kw)
        for vp in video_pages:
            m_id = re.search(r'-(\d+)/$', vp) or re.search(r'-(\d+)$', vp)
            if m_id:
                vid_id = m_id.group(1)
                if vid_id in seen_ids:
                    continue
                seen_ids.add(vid_id)
            title, mp4_720, all_mp4s = get_mixkit_video_details(vp)
            if mp4_720 and check_url(mp4_720):
                print(f"TITLE: {title}")
                print(f"PAGE: {vp}")
                print(f"URL: {mp4_720}")
                found_count += 1
                if found_count >= 3:
                    break
            time.sleep(1)

