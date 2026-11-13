import json, re

with open("src/data/uadDatabase.ts") as f:
    content = f.read()

# Parse plugin objects from TypeScript
target_names = [
    "UAD Oxford Inflator",
    "UAD Little Labs VOG Bass Enhancer",
    "UAD Precision Maximizer",
    "UAD Pultec Passive EQ Collection",
    "UAD Studer A800 Tape Recorder",
    "UAD Thermionic Culture Vulture Distortion",
    "UAD Neve 33609 Stereo Limiter Compressor",
    "UAD SSL 4000 G Bus Compressor Collection",
    "UAD Empirical Labs EL7 FATSO Compressor",
    "UAD Precision Enhancer Hz"
]

for name in target_names:
    pattern = rf'\{{\s*"name":\s*"[^"]*",\s*"displayName":\s*"{re.escape(name)}".*?\n  \}}'
    # Simple regex search
    idx = content.find(f'"displayName": "{name}"')
    if idx != -1:
        start = content.rfind('{', 0, idx)
        # find matching bracket
        depth = 0
        end = start
        for i in range(start, len(content)):
            if content[i] == '{': depth += 1
            elif content[i] == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        block = content[start:end]
        print("==================================================")
        print("PLUGIN:", name)
        # print parameters and protips
        for line in block.splitlines():
            if '"name":' in line or '"range":' in line or '"defaultVal":' in line or '"proTips":' in line or 'hardwareModel' in line:
                print("  ", line.strip())

