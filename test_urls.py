import urllib.request
import time

urls_to_test = [
    "https://assets.mixkit.co/videos/44556/44556-720.mp4",
    "https://assets.mixkit.co/videos/44556/44556-360.mp4",
    "https://assets.mixkit.co/videos/20106/20106-720.mp4",
    "https://assets.mixkit.co/videos/47601/47601-720.mp4",
    "https://assets.mixkit.co/videos/31414/31414-720.mp4",
    "https://assets.mixkit.co/videos/28096/28096-720.mp4",
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

for url in urls_to_test:
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"{resp.status} - {url}")
    except Exception as e:
        print(f"FAILED - {url} : {e}")

