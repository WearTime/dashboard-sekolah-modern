#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PROJECT_ROOT="$(realpath "$SCRIPT_DIR/..")"

folders=(
  "uploads/siswa"
  "uploads/guru"
  "uploads/prestasi"
  "uploads/ekstrakulikuler"
  "uploads/ekstrakulikuler/gallery"
  "uploads/program"
  "uploads/program-jurusan"
  "uploads/kegiatan"
)

echo "🔧 Creating upload directories in project root: $PROJECT_ROOT"
echo

for folder in "${folders[@]}"; do
  target="$PROJECT_ROOT/$folder"

  if [ ! -d "$target" ]; then
    mkdir -p "$target"
    touch "$target/.gitkeep"
    echo "✅ Created: $folder"
  else
    echo "⏭️  Exists: $folder"
  fi
done

echo
echo "✨ Upload directories ready in $PROJECT_ROOT!"
echo
