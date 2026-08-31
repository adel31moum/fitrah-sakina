import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

url = "https://coverr.co/s?q=city+night"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

# Let's search for coverr video URLs or JSON data in script tags
matches = re.findall(r'https://[^"\']+\.mp4', html)
print("All MP4 matches:")
for m in set(matches):
    if 'coverr' in m:
        print(m)

