import sys

def parse_midi(filename):
    with open(filename, 'rb') as f:
        data = f.read()

    def parse_vlq(idx):
        val = 0
        while True:
            b = data[idx]
            idx += 1
            val = (val << 7) | (b & 0x7F)
            if not (b & 0x80):
                break
        return val, idx

    def note_name(n):
        names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        oct_studio_one = (n // 12) - 2 # Studio One C-2 to G8 convention or C-1
        oct_std = (n // 12) - 1
        return f"{names[n % 12]}{oct_std} (MIDI {n})"

    division = int.from_bytes(data[12:14], 'big')
    print(f"Division (PPQ): {division}")

    p = 14
    notes = {}
    tempos = []
    
    while p < len(data):
        chunk_type = data[p:p+4].decode('latin1', errors='ignore')
        chunk_len = int.from_bytes(data[p+4:p+8], 'big')
        p += 8
        chunk_end = p + chunk_len
        
        idx = p
        running_status = 0
        cur_ticks = 0
        
        while idx < chunk_end:
            delta, idx = parse_vlq(idx)
            cur_ticks += delta
            if idx >= chunk_end: break
            
            b = data[idx]
            if b & 0x80:
                status = b
                idx += 1
                running_status = status
            else:
                status = running_status
                
            if status == 0xFF:
                mtype = data[idx]
                idx += 1
                mlen, idx = parse_vlq(idx)
                mdata = data[idx:idx+mlen]
                idx += mlen
                if mtype == 0x51:
                    uspq = int.from_bytes(mdata, 'big')
                    tempos.append(round(60000000 / uspq, 2))
                elif mtype == 0x03:
                    print("Track Name:", mdata.decode('latin1', errors='ignore'))
            elif status in (0xF0, 0xF7):
                slen, idx = parse_vlq(idx)
                idx += slen
            else:
                m = status & 0xF0
                if m in (0x80, 0x90):
                    note = data[idx]
                    vel = data[idx+1]
                    idx += 2
                    if m == 0x90 and vel > 0:
                        if note not in notes: notes[note] = []
                        notes[note].append((cur_ticks, vel))
                elif m in (0xA0, 0xB0, 0xE0):
                    idx += 2
                elif m in (0xC0, 0xD0):
                    idx += 1
        p = chunk_end
        
    print(f"Tempos: {tempos}")
    print("\nALL NOTES FOUND IN THIS MIDI FILE:")
    for n in sorted(notes.keys()):
        hits = notes[n]
        # convert ticks to beat/bar
        # bar = ticks // (division * 4) + 1
        bars = [f"{t/(division*4) + 1:.2f}" for t, v in hits[:10]]
        print(f"MIDI Note {n:3d} ({note_name(n)}): {len(hits):3d} total hits. First 10 bars: {bars}")

if __name__ == '__main__':
    parse_midi(sys.argv[1])
