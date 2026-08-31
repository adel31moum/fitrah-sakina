import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

# Test Coverr
def search_coverr(query):
    url = f"https://coverr.co/s?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            print(f"Coverr search '{query}' status 200, length {len(html)}")
            # look for mp4 links or video data
            mp4s = re.findall(r'https://files\.coverr\.co/[^"\']+\.mp4', html)
            if not mp4s:
                mp4s = re.findall(r'https://[^"\']+\.mp4', html)
            print("Found mp4s:", mp4s[:5])
    except Exception as e:
        print(f"Coverr error '{query}': {e}")

# Test Pixabay
def search_pixabay(query):
    url = f"https://pixabay.com/videos/search/{urllib.parse.quote(query)}/"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            print(f"Pixabay search '{query}' status 200, length {len(html)}")
            mp4s = re.findall(r'https://cdn\.pixabay\.com/video/[^"\']+\.mp4', html)
            print("Pixabay mp4s:", mp4s[:5])
    except Exception as e:
        print(f"Pixabay error '{query}': {e}")

search_coverr("city night")
search_pixabay("city night")
