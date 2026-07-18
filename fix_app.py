with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() == "}, 50);":
        pass
    else:
        new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
