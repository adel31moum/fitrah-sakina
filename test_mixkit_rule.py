import urllib.request

test_ids = [4257, 339, 221, 1114]
headers = {'User-Agent': 'Mozilla/5.0'}

for vid_id in test_ids:
    for res in [720, 1080, 360]:
        url = f"https://assets.mixkit.co/videos/{vid_id}/{vid_id}-{res}.mp4"
        req = urllib.request.Request(url, headers=headers, method='HEAD')
        try:
            with urllib.request.urlopen(req, timeout=3) as resp:
                print(f"VALID: {url}")
                break
        except Exception as e:
            pass
