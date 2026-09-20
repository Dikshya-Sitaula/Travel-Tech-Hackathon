#!/usr/bin/env bash
# Build (or rebuild) the local Ollama model used by OfflineChat.
# If you later merge a LoRA GGUF named gemma-2-2b-it-wayfinder-*.gguf, this
# script points FROM at it automatically for that run.
set -euo pipefail

cd "$(dirname "$0")"

pick_weights() {
  local candidate
  for candidate in \
    gemma-2-2b-it-wayfinder-Q4_K_M.gguf \
    gemma-2-2b-it-wayfinder-Q8_0.gguf \
    gemma-2-2b-it-wayfinder.gguf \
    gemma-2-2b-it-Q4_K_M.gguf
  do
    if [[ -f "$candidate" ]]; then
      echo "./$candidate"
      return 0
    fi
  done
  return 1
}

FROM="$(pick_weights)" || {
  echo "No GGUF found in models/. Download gemma-2-2b-it-Q4_K_M.gguf first." >&2
  exit 1
}

echo "Using weights: $FROM"

tmp="$(mktemp)"
# Replace the FROM line only; keep the rest of Modelfile (system prompt, stops).
awk -v from="$FROM" 'NR==1 { print "FROM " from; next } { print }' Modelfile > "$tmp"
mv "$tmp" Modelfile

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama is not installed. See https://ollama.com/download" >&2
  exit 1
fi

ollama create gemma-offline -f ./Modelfile
echo "Built Ollama model: gemma-offline"
echo "Try: ollama run gemma-offline \"What should I see in Kathmandu in one day?\""
