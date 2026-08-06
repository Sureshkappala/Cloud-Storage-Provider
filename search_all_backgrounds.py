import re

def search_bg():
    src_file = r"c:\Cloud Storage Provider\styles.css"
    with open(src_file, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    for i, line in enumerate(lines):
        if "background" in line or "bg-" in line:
            # Print if it has a color code or if it overrides backgrounds
            if "#" in line or "rgba" in line or "linear-gradient" in line:
                print(f"Line {i+1}: {line.strip()}")

if __name__ == "__main__":
    search_bg()
