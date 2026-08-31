import urllib.request
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

sitemap_url = "https://mixkit.co/sitemap.xml"
req = urllib.request.Request(sitemap_url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        xml = resp.read().decode('utf-8')
        sub_sitemaps = re.findall(r'<loc>(https://mixkit\.co/sitemap-[^<]+)</loc>', xml)
        print("Sub sitemaps:", sub_sitemaps)
except Exception as e:
    print("Sitemap error:", e)

