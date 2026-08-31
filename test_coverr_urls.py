import urllib.request

test_urls = [
    "https://cdn.coverr.co/videos/coverr-gloomy-city-at-night-6099/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-the-city-at-night-2412/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-cars-in-the-city-at-night-5837/1080p.mp4"
]

headers = {'User-Agent': 'Mozilla/5.0'}

for url in test_urls:
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"{resp.status} - {url}")
    except Exception as e:
        print(f"FAILED - {url} : {e}")

