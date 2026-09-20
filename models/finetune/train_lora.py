#!/usr/bin/env python3
"""
LoRA fine-tune for Wayfinder Nepal on google/gemma-2-2b-it.

This laptop has no NVIDIA GPU and system Python is 3.14, so this script is
meant to run on a CUDA box or Colab (Python 3.10–3.12).

  pip install -r requirements.txt
  huggingface-cli login   # accept Gemma 2 license on HF
  python train_lora.py

Outputs adapter weights to ./out/wayfinder-lora
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import torch
from datasets import Dataset
from peft import LoraConfig, TaskType, get_peft_model
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
)

ROOT = Path(__file__).resolve().parent
DEFAULT_DATA = ROOT / "nepal_travel.jsonl"
DEFAULT_OUT = ROOT / "out" / "wayfinder-lora"
BASE_MODEL = "google/gemma-2-2b-it"
SYSTEM = (
    "You are Wayfinder Nepal, an offline local travel guide. "
    "Keep answers short, practical, and conversational."
)


def load_rows(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            rows.append(
                {
                    "instruction": obj.get("instruction") or obj.get("input"),
                    "output": obj.get("output") or obj.get("response"),
                }
            )
    if not rows:
        raise SystemExit(f"No examples in {path}")
    return rows


def format_example(tokenizer, instruction: str, output: str) -> str:
    messages = [
        {"role": "user", "content": f"{SYSTEM}\n\n{instruction}"},
        {"role": "model", "content": output},
    ]
    return tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=False
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=DEFAULT_DATA)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--model", default=BASE_MODEL)
    parser.add_argument("--epochs", type=float, default=3.0)
    parser.add_argument("--lr", type=float, default=2e-4)
    parser.add_argument("--max-len", type=int, default=512)
    parser.add_argument("--lora-r", type=int, default=16)
    parser.add_argument("--cpu", action="store_true")
    args = parser.parse_args()

    use_cuda = torch.cuda.is_available() and not args.cpu
    if not use_cuda:
        print(
            "WARNING: no CUDA GPU. CPU LoRA on Gemma 2 2B will be extremely slow "
            "and may OOM. Prefer Colab T4/L4. Continuing anyway because --cpu "
            "or missing GPU.",
            file=sys.stderr,
        )

    tokenizer = AutoTokenizer.from_pretrained(args.model)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    rows = load_rows(args.data)
    texts = [format_example(tokenizer, r["instruction"], r["output"]) for r in rows]

    def tokenize(batch):
        return tokenizer(
            batch["text"],
            truncation=True,
            max_length=args.max_len,
            padding=False,
        )

    ds = Dataset.from_dict({"text": texts}).map(tokenize, batched=True, remove_columns=["text"])

    if use_cuda:
        bnb = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16,
            bnb_4bit_use_double_quant=True,
        )
        model = AutoModelForCausalLM.from_pretrained(
            args.model,
            quantization_config=bnb,
            device_map="auto",
            attn_implementation="eager",
        )
    else:
        model = AutoModelForCausalLM.from_pretrained(
            args.model,
            torch_dtype=torch.float32,
            device_map="cpu",
            attn_implementation="eager",
        )

    model.config.use_cache = False
    model.gradient_checkpointing_enable()

    lora = LoraConfig(
        r=args.lora_r,
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        task_type=TaskType.CAUSAL_LM,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    )
    model = get_peft_model(model, lora)
    model.print_trainable_parameters()

    args.out.mkdir(parents=True, exist_ok=True)
    training = TrainingArguments(
        output_dir=str(args.out),
        num_train_epochs=args.epochs,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=8 if use_cuda else 1,
        learning_rate=args.lr,
        logging_steps=5,
        save_strategy="epoch",
        bf16=use_cuda,
        fp16=False,
        optim="paged_adamw_8bit" if use_cuda else "adamw_torch",
        lr_scheduler_type="cosine",
        warmup_ratio=0.05,
        report_to=[],
        gradient_checkpointing=True,
    )

    trainer = Trainer(
        model=model,
        args=training,
        train_dataset=ds,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )
    trainer.train()
    trainer.save_model(str(args.out))
    tokenizer.save_pretrained(str(args.out))
    print(f"Saved LoRA adapter to {args.out}")
    print("Next: python merge_lora.py && convert the merged folder to GGUF.")


if __name__ == "__main__":
    os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
    main()
