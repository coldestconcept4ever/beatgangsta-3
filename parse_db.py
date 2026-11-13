import re

with open("src/data/uadDatabase.ts") as f:
    text = f.read()

# Match entries in object exports
matches = re.findall(r"export const (\w+)|([a-zA-Z0-9_]+):\s*\{", text)
plugins = []
for line in text.splitlines():
    if "displayName:" in line or "name:" in line:
        plugins.append(line.strip())

print("Total plugin name lines:", len(plugins))
for p in plugins[:40]:
    print(p)
