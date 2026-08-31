import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

url = "https://coverr.co/s?q=courtroom"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
for s in scripts:
    if 'hits' in s:
        # try json parsing
        try:
            data = json.loads(s)
            print("Successfully parsed script as JSON!")
            # print top level keys
            print("Keys:", list(data.keys()))
            for k, v in data.items():
                if isinstance(v, dict) and 'b' in v:
                    b = v['b']
                    if isinstance(b, dict) and 'hits' in b:
                        print(f"Key {k} has hits!")
                        for hit in b['hits']:
                            print("HIT:", hit.get('title'), "|", hit.get('slug'), "|", hit.get('downloads'), "|", hit.get('alts'))
        except Exception as e:
            print("JSON parse error:", e)

