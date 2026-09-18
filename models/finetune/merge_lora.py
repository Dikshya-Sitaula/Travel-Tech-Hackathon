#!/usr/bin/env python3
"""Merge LoRA adapter into base Gemma weights (needs GPU or lots of RAM)."""

from __future__ import annotations

import argparse
from pathlib import Path

import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

ROOT = Path(__file__).resolve().parent
BASE = "google/gemma-2-2b-it"


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--base", default=BASE)
    p.add_argument("--adapter", type=Path, default=ROOT / "out" / "wayfinder-lora")
    p.add_argument("--out", type=Path, default=ROOT / "out" / "wayfinder-merged")
    args = p.parse_args()

    tokenizer = AutoTokenizer.from_pretrained(args.base)
    model = AutoModelForCausalLM.from_pretrained(
        args.base,
        torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
        device_map="auto",
    )
    model = PeftModel.from_pretrained(model, str(args.adapter))
    merged = model.merge_and_unload()
    args.out.mkdir(parents=True, exist_ok=True)
    merged.save_pretrained(str(args.out), safe_serialization=True)
    tokenizer.save_pretrained(str(args.out))
    print(f"Merged model saved to {args.out}")
    print(
        "Convert with llama.cpp:\n"
        f"  python convert_hf_to_gguf.py {args.out} --outfile "
        "../../gemma-2-2b-it-wayfinder-Q8_0.gguf --outtype q8_0\n"
        "Then quantize to Q4_K_M if you want a smaller Ollama file."
    )


if __name__ == "__main__":
    main()
