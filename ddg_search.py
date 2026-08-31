import urllib.request
import urllib.parse
import re
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def ddg_search(query):
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            links = []
            for a in soup.find_all('a', class_='result__url'):
                href = a.get('href', '')
                text = a.text.strip()
                links.append((text, href))
            return links
    except Exception as e:
        print("DDG error:", e)
        return []

print(ddg_search("site:mixkit.co/free-stock-video/ courtroom"))
