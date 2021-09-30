#!/usr/local/bin/python3.8
import glob
import re
import shutil

files = []
for file in glob.glob("**/*.mdx"):
    files.append(file)

for file in glob.glob("**/*.md"):
    files.append(file)

for f in files:
    m = re.search(r'(\d\d\d\d-\d\d-\d\d-)([a-zA-Z0-9_\-()]*)(.*)', f)
    try:
        shutil.copy(f, f"{m.group(2).lower()}.md")
    except AttributeError:
        print(f"whole file: {f}")
