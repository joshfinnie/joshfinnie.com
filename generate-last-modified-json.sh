#!/usr/bin/env bash
set -euo pipefail

cd src/pages/blog

echo "{"
git ls-tree -r --name-only HEAD | while read filename; do
  echo "  \"$filename\": \"$(git log -1 --format="%ad" -- $filename)\","
done
echo "}"
