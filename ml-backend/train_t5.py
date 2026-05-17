"""
Fine-tune t5-small on task-title generation.

30 real-world examples: sentence → clean actionable title.
T5 learns to strip filler words and extract the core action.

Run:
    python train_t5.py

Saves model to ./models/t5-title-gen  (~10 min on CPU, ~2 min on GPU).
Flask backend auto-uses this model if the folder exists.
"""

import os
import torch
from transformers import (
    T5ForConditionalGeneration,
    T5Tokenizer,
    Trainer,
    TrainingArguments,
)
from torch.utils.data import Dataset

# ---------------------------------------------------------------------------
# Training pairs  (input → output)
# Each input uses the same "summarize as task title:" prefix T5 was pre-trained
# on similar tasks, so few examples are enough to adapt it.
# ---------------------------------------------------------------------------
TRAINING_DATA = [
    ("Aditya needs to fix the authentication bug by Friday it's urgent", "Fix authentication bug"),
    ("Rahul should handle the database migration before next sprint", "Handle database migration"),
    ("Someone write the API documentation low priority no rush", "Write API documentation"),
    ("We need to update the login page UI it looks outdated", "Update login page UI"),
    ("The payment gateway is broken fix it asap it's blocking users from subscribing", "Fix payment gateway"),
    ("Set up CI/CD pipeline for the project important", "Set up CI/CD pipeline"),
    ("Write unit tests for the user service module", "Write unit tests for user service"),
    ("The deployment to production is failing investigate and fix immediately", "Fix production deployment failure"),
    ("Add dark mode support to the dashboard eventually no rush", "Add dark mode to dashboard"),
    ("Migrate from REST to GraphQL this is a critical architectural change", "Migrate to GraphQL"),
    ("Update npm dependencies to fix security vulnerabilities urgent", "Update npm dependencies"),
    ("Design the new onboarding flow for new users", "Design user onboarding flow"),
    ("Integrate Stripe payment system before the launch", "Integrate Stripe payments"),
    ("Fix the memory leak in the WebSocket handler it is crashing the server", "Fix WebSocket memory leak"),
    ("Add email notifications for task assignments nice to have", "Add email notifications"),
    ("Refactor the auth middleware to use JWT tokens", "Refactor auth middleware to JWT"),
    ("Create API documentation using Swagger", "Create Swagger API docs"),
    ("The search functionality is returning wrong results fix this", "Fix search functionality"),
    ("Add pagination to the user list page", "Add pagination to user list"),
    ("Set up Redis caching for frequently accessed data performance improvement", "Set up Redis caching"),
    ("Write migration scripts for the new database schema", "Write database migration scripts"),
    ("Fix the broken image uploads on the profile page", "Fix profile image uploads"),
    ("Add rate limiting to the API endpoints security concern", "Add API rate limiting"),
    ("Optimize database queries the dashboard is loading too slow", "Optimize database queries"),
    ("Implement two factor authentication for admin accounts critical security", "Implement 2FA for admins"),
    ("Update the terms of service and privacy policy before launch", "Update terms of service"),
    ("Add export to CSV feature for the reports page whenever", "Add CSV export to reports"),
    ("Fix the CORS issue blocking the mobile app from accessing the API", "Fix CORS for mobile API"),
    ("Set up error monitoring with Sentry for production", "Set up Sentry error monitoring"),
    ("Implement role based access control for the admin panel", "Implement RBAC for admin panel"),
]

PREFIX = "summarize as task title: "


class TitleDataset(Dataset):
    def __init__(self, data, tokenizer, max_in=256, max_out=32):
        self.pairs = data
        self.tok = tokenizer
        self.max_in = max_in
        self.max_out = max_out

    def __len__(self):
        return len(self.pairs)

    def __getitem__(self, idx):
        src, tgt = self.pairs[idx]
        enc = self.tok(
            PREFIX + src,
            max_length=self.max_in,
            padding="max_length",
            truncation=True,
            return_tensors="pt",
        )
        with self.tok.as_target_tokenizer():
            dec = self.tok(
                tgt,
                max_length=self.max_out,
                padding="max_length",
                truncation=True,
                return_tensors="pt",
            )
        labels = dec.input_ids.squeeze().clone()
        labels[labels == self.tok.pad_token_id] = -100
        return {
            "input_ids": enc.input_ids.squeeze(),
            "attention_mask": enc.attention_mask.squeeze(),
            "labels": labels,
        }


def train():
    out_dir = os.path.join(os.path.dirname(__file__), "models", "t5-title-gen")
    print("Loading t5-small base…")
    tokenizer = T5Tokenizer.from_pretrained("t5-small")
    model = T5ForConditionalGeneration.from_pretrained("t5-small")

    dataset = TitleDataset(TRAINING_DATA, tokenizer)

    args = TrainingArguments(
        output_dir=out_dir,
        num_train_epochs=40,
        per_device_train_batch_size=4,
        learning_rate=3e-4,
        warmup_steps=10,
        weight_decay=0.01,
        save_strategy="epoch",
        logging_steps=10,
        no_cuda=not torch.cuda.is_available(),
        report_to="none",
    )

    trainer = Trainer(model=model, args=args, train_dataset=dataset)

    print(f"Fine-tuning on {len(TRAINING_DATA)} examples…")
    trainer.train()

    model.save_pretrained(out_dir)
    tokenizer.save_pretrained(out_dir)
    print(f"\nDone. Model saved to {out_dir}")
    print("Restart the Flask server — it will now use the fine-tuned model.")


if __name__ == "__main__":
    train()
