#!/usr/bin/env python3
"""
AI Sales Agent Model Training
Trains a fine-tuned model for retail sales conversations using GPU acceleration
"""

import torch
import json
import os
import sys
from pathlib import Path

# Fix encoding for Windows
if sys.platform == 'win32':
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    sys.stdout.reconfigure(encoding='utf-8')

from training_data import get_training_data
from transformers import AutoTokenizer, AutoModelForCausalLM, TextDataset, DataCollatorForLanguageModeling
from transformers import Trainer, TrainingArguments

print("=" * 60)
print("RETAIL GENIE - AI SALES AGENT TRAINER")
print("=" * 60)

# Check GPU availability
print("\n[SYSTEM] Checking GPU availability...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[OK] Device: {device}")
if torch.cuda.is_available():
    print(f"     GPU: {torch.cuda.get_device_name(0)}")
    print(f"     VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")

# Create training directory
training_dir = Path("trained_models")
training_dir.mkdir(exist_ok=True)

# Save training data to file
print("\n[DATA] Preparing training data...")
training_data = get_training_data()
print(f"[OK] Loaded {len(training_data)} training examples")

# Format training data as conversational text
training_text = []
for customer_msg, agent_response in training_data:
    conversation = f"Customer: {customer_msg}\nAgent: {agent_response}\n\n"
    training_text.append(conversation)

# Save to file for training
train_file = training_dir / "train_conversations.txt"
with open(train_file, "w", encoding="utf-8") as f:
    f.write("".join(training_text))

print(f"[OK] Training data saved: {train_file}")
print(f"     Total conversations: {len(training_text)}")

# Load base model and tokenizer
print("\n[MODEL] Loading base model...")
model_name = "distilgpt2"  # Small, fast, good for retail
print(f"     Base model: {model_name}")
print("     Note: DistilGPT2 is optimized for CPU/GPU and trains quickly")

try:
    tokenizer = AutoTokenizer.from_json_file(Path("tokenizer_config.json")) if Path("tokenizer_config.json").exists() else AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    print("[OK] Model and tokenizer loaded")
except Exception as e:
    print(f"[WARNING] Error loading model: {e}")
    print("     Using backup: Will train from fresh state")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)

# Add special tokens for retail context
special_tokens = ["<CUSTOMER>", "<AGENT>", "<PRODUCT>", "<PRICE>", "<OCCASION>", "<STYLE>"]
tokenizer.add_tokens(special_tokens)
model.resize_token_embeddings(len(tokenizer))

# Save tokenizer
tokenizer.save_pretrained(str(training_dir / "tokenizer"))
print(f"[OK] Tokenizer configured with {len(tokenizer)} tokens")

# Prepare dataset
print("\n[TRAINING] Preparing dataset...")
train_dataset = TextDataset(
    tokenizer=tokenizer,
    file_path=str(train_file),
    block_size=128
)

data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=False
)

# Training arguments
training_args = TrainingArguments(
    output_dir=str(training_dir / "checkpoints"),
    overwrite_output_dir=True,
    num_train_epochs=5,
    per_device_train_batch_size=4,
    save_steps=50,
    save_total_limit=3,
    logging_steps=10,
    learning_rate=2e-4,
    warmup_steps=100,
    no_cuda=not torch.cuda.is_available(),
    fp16=torch.cuda.is_available(),  # Mixed precision training for GPU
    gradient_accumulation_steps=2,
)

print(f"  Epochs: {training_args.num_train_epochs}")
print(f"  Batch size: {training_args.per_device_train_batch_size}")
print(f"  Mixed precision: {'Yes (GPU)' if torch.cuda.is_available() else 'No (CPU)'}")

# Initialize trainer
print("\n[TRAINER] Initializing trainer...")
trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=train_dataset,
)

print("[OK] Trainer ready")

# Train the model
print("\n[TRAINING] Starting model training...")
print("[INFO] This will take a few minutes...\n")

try:
    trainer.train()
    print("\n[OK] Training completed successfully!")
    
    # Save final model
    final_model_path = training_dir / "final_model"
    model.save_pretrained(str(final_model_path))
    tokenizer.save_pretrained(str(final_model_path))
    print(f"[OK] Model saved to: {final_model_path}")
    
    # Save model info
    model_info = {
        "model_name": model_name,
        "base_model": model_name,
        "num_parameters": model.num_parameters(),
        "training_examples": len(training_text),
        "device": str(device),
        "training_completed": True
    }
    
    with open(training_dir / "model_info.json", "w") as f:
        json.dump(model_info, f, indent=2)
    
    print(f"[OK] Model info saved")
    print(f"\n{'='*60}")
    print("TRAINING COMPLETE!")
    print(f"{'='*60}")
    print(f"Model ready for inference at: {final_model_path}")
    print(f"Parameters: {model.num_parameters():,}")
    print(f"Device: {device}")
    
except Exception as e:
    print(f"\n[ERROR] Training error: {e}")
    print("[INFO] Saving checkpoint...")
    checkpoint_path = training_dir / "failed_checkpoint"
    model.save_pretrained(str(checkpoint_path))
    tokenizer.save_pretrained(str(checkpoint_path))
    print(f"Checkpoint saved to: {checkpoint_path}")
    raise

print("\n[SUCCESS] Sales agent model trained and ready!")
