#!/usr/bin/env bash
# setup.sh — scaffolds the my-travel-app folder/file structure.
# Usage: bash setup.sh
set -e

mkdir -p my-travel-app/models
mkdir -p my-travel-app/frontend/public
mkdir -p my-travel-app/frontend/src/components
mkdir -p my-travel-app/frontend/src/services

touch my-travel-app/models/gemma-2-2b-it-Q4_K_M.gguf
touch my-travel-app/models/Modelfile

touch my-travel-app/frontend/src/components/OnlineItinerary.jsx
touch my-travel-app/frontend/src/components/OfflineChat.jsx
touch my-travel-app/frontend/src/components/LandmarkScanner.jsx

touch my-travel-app/frontend/src/services/onlineLlmService.js
touch my-travel-app/frontend/src/services/offlineLlmService.js

touch my-travel-app/frontend/src/App.jsx
touch my-travel-app/frontend/src/main.jsx

touch my-travel-app/frontend/package.json
touch my-travel-app/frontend/vite.config.js

touch my-travel-app/README.md

echo "✅ my-travel-app/ scaffold created."
echo "Next: paste the provided code into each file, then follow README.md."
