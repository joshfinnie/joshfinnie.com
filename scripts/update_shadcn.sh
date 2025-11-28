#!/usr/bin/env bash
set -euo pipefail

# Directory containing your shadcn components
COMPONENT_DIR="src/components/ui"

# Loop over each .tsx file
for file in "$COMPONENT_DIR"/*.tsx; do
  # Skip if no files match
  [ -e "$file" ] || continue

  # Get the component name without extension
  component_name=$(basename "$file" .tsx)

  echo "Updating component: $component_name"

  # Run shadcn-ui update for this component
  npx shadcn@latest add -y -o "$component_name"
done

echo "All components updated."
