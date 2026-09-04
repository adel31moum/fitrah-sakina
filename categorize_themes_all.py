import json
import urllib.request
import re

with open('mixkit_videos.json') as f:
    videos = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

def check_url(url):
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception as e:
        return False

# Let's inspect titles for specific themes
def find_by_words(words_must, words_any=[]):
    matches = []
    for v in videos.values():
        t = v['title'].lower()
        if all(w in t for w in words_must):
            if not words_any or any(w in t for w in words_any):
                matches.append(v)
    return matches

print("=== Theme 4 (Rain/Window/Abandoned/Empty) ===")
for m in find_by_words(['rain']) + find_by_words(['window']) + find_by_words(['house']) + find_by_words(['room']):
    print(f"ID {m['id']} | Title: {m['title']}")

print("\n=== Theme 5 (Desert Sunrise/Dawn) ===")
for m in find_by_words(['desert']) + find_by_words(['dune']) + find_by_words(['sahara']):
    print(f"ID {m['id']} | Title: {m['title']}")

print("\n=== Theme 6 (Campfire/Fire/Warm Fire) ===")
for m in find_by_words(['fire']) + find_by_words(['flame']) + find_by_words(['camp']):
    print(f"ID {m['id']} | Title: {m['title']}")

print("\n=== Theme 7 (Stars/Night Sky) ===")
for m in find_by_words(['star']) + find_by_words(['sky']) + find_by_words(['night']):
    print(f"ID {m['id']} | Title: {m['title']}")

print("\n=== Theme 8 (Desert Sunset/Dunes Golden Hour) ===")
for m in find_by_words(['sunset']):
    print(f"ID {m['id']} | Title: {m['title']}")

