# My Travel App — Hybrid Online/Offline AI Architecture

A hackathon-ready travel app that pairs a **cloud LLM** (rich itinerary generation +
landmark recognition) with a **local on-device LLM** (Gemma 2 2B, quantized,
served by Ollama) for offline travel assistance.

```
my-travel-app/
├── models/
│   ├── gemma-2-2b-it-Q4_K_M.gguf   # you supply this binary (see step 2)
│   ├── Modelfile                   # Ollama build config (Wayfinder Nepal)
│   ├── build_offline.sh            # rebuild gemma-offline
│   └── finetune/                   # Nepal Q&A + LoRA train/merge scripts
└── frontend/                       # React + Vite + Tailwind app
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── OnlineItinerary.jsx
    │   │   ├── OfflineChat.jsx
    │   │   └── LandmarkScanner.jsx
    │   ├── services/
    │   │   ├── onlineLlmService.js
    │   │   └── offlineLlmService.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 1. Prerequisites

- Node.js 18+ and npm
- [Ollama](https://ollama.com/download) installed locally (macOS/Linux/Windows)
- A GGUF build of Gemma 2 2B Instruct, quantized `Q4_K_M`
  (e.g. from `bartowski/gemma-2-2b-it-GGUF` on Hugging Face)
- (Optional) An API key for your cloud LLM provider (OpenAI, Gemini, etc.) if you
  wire `onlineLlmService.js` to a real backend instead of the built-in demo mode

---

## 2. Download the local model

Place the quantized GGUF file at `models/gemma-2-2b-it-Q4_K_M.gguf`. Example:

```bash
cd my-travel-app/models
curl -L -o gemma-2-2b-it-Q4_K_M.gguf \
  "https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf"
```

> The file is large (~1.7GB) — it's git-ignored by default, don't commit it.

---

## 3. Build the Ollama model (Wayfinder Nepal)

The local assistant is **Gemma 2 2B Instruct** packaged as `gemma-offline` with a Nepal-guide system prompt. Chat also retrieves matching rows from `models/finetune/nepal_travel.jsonl`.

```bash
chmod +x models/build_offline.sh
./models/build_offline.sh
```

Or equivalently:

```bash
cd models
ollama create gemma-offline -f ./Modelfile
```

Verify:

```bash
ollama run gemma-offline "What should I see in Kathmandu in one day?"
```

### Optional: actual LoRA weight fine-tune (needs a NVIDIA GPU)

This machine-class laptop (no CUDA, Python 3.14) cannot train Gemma 2 2B locally. On Colab or a GPU box (Python 3.10–3.12):

```bash
cd models/finetune
pip install -r requirements.txt
huggingface-cli login    # accept the Gemma 2 license
python train_lora.py
python merge_lora.py
```

Convert the merged Hugging Face folder to GGUF with [llama.cpp](https://github.com/ggerganov/llama.cpp) `convert_hf_to_gguf.py`, place `gemma-2-2b-it-wayfinder-Q4_K_M.gguf` in `models/`, then rerun `./models/build_offline.sh`.

Start the Ollama server (usually auto-starts, but if not):

```bash
ollama serve
```

It listens on `http://localhost:11434` by default — this is what
`offlineLlmService.js` talks to.

---

## 4. Frontend setup

```bash
cd my-travel-app/frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Make sure `tailwind.config.js` content globs include your source files:

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

And that `src/index.css` (imported in `main.jsx`) contains:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Run the dev server:

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

---

## 5. Wiring the cloud LLM (optional, for real online mode)

`onlineLlmService.js` ships with a **demo/simulation mode** so the app is fully
functional at a hackathon even without API keys. To connect a real provider:

1. Create a small backend proxy (Node/Express, Cloudflare Worker, etc.) that
   holds your OpenAI/Gemini API key server-side (never ship keys in frontend code).
2. Point `CLOUD_API_ENDPOINT` in `onlineLlmService.js` at that proxy.
3. Set `USE_DEMO_MODE = false` in the same file.

---

## 6. How the offline/online split works

- **OfflineChat.jsx** always talks to `http://localhost:11434` (your machine).
  It pings `/api/tags` on mount/interval to show a live "Online/Offline" badge
  for the Ollama server itself.
- **OnlineItinerary.jsx** and **LandmarkScanner.jsx** talk to your cloud
  service/proxy and require internet connectivity.
- This means the offline assistant keeps working on a plane or with no signal,
  while the richer cloud features activate whenever connectivity returns.

---

## 7. Troubleshooting

| Symptom | Fix |
|---|---|
| `OfflineChat` shows "Offline" badge permanently | Run `ollama serve`, confirm `ollama list` shows `gemma-offline` |
| CORS error calling `localhost:11434` | Set `OLLAMA_ORIGINS=*` env var before `ollama serve` |
| Model replies with stray `<end_of_turn>` text | Rebuild with `./models/build_offline.sh` so stop tokens are applied |
| Slow first response | First call loads the model into memory; subsequent calls are faster |

---

## 8. Tech stack summary

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Cloud AI**: pluggable service layer (`onlineLlmService.js`) — demo mode or real API
- **Local AI**: Gemma 2 2B Instruct (Q4_K_M GGUF) as Wayfinder Nepal via Ollama `/api/chat`
- **Landmark Scanner**: file upload / camera capture UI, pluggable vision endpoint
