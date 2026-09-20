# Offline Model

This directory contains the Ollama configuration and fine-tuning sources for
the Travel Tech Hackathon project's Nepal travel assistant.

The GGUF weights are intentionally ignored because the base model is about
1.7 GB and should not be committed to ordinary GitHub repository storage.
Place `gemma-2-2b-it-Q4_K_M.gguf` here before building the local model:

```bash
./models/build_offline.sh
```

The script also detects a LoRA-merged derivative named
`gemma-2-2b-it-wayfinder-*.gguf`. Fine-tuning instructions and training data
are in `models/finetune/`.

The dashboard's offline assistant calls Ollama at
`http://localhost:11434` using the `gemma-offline` model. Override these values
with `VITE_OLLAMA_URL` and `VITE_OLLAMA_MODEL` when needed.
## Frontend setup (new)

The dashboard's AI Assistant and Offline Assistant pages now call Ollama
directly from the browser instead of using hardcoded mock replies. Two
things are required for this to work:

1. Copy `.env.example` to `.env` in the project root and adjust
   `VITE_OLLAMA_URL` / `VITE_OLLAMA_MODEL` if you changed the defaults.
2. Ollama blocks cross-origin requests by default, so the Vite dev server
   (usually `http://localhost:5173`) needs to be allowed. Start Ollama with:

   ```bash
   OLLAMA_ORIGINS=* ollama serve
   ```

   (Use a specific origin instead of `*` if you want to be stricter.)

All online AI features—including chat, itinerary generation, and Landmark
Explorer—use the server-only `GEMINI_API_KEY` in `.env.local`. Never expose the
key with a `VITE_` prefix. Get a key at https://aistudio.google.com/apikey.
Without it, each feature displays a clear configuration error.
