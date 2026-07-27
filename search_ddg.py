import urllib.request
import urllib.parse
import re
import sys

query = sys.argv[1]
url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
for s in snippets:
    print(re.sub(r'<[^>]*>', '', s).strip())
