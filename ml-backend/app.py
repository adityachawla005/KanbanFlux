"""
Flask ML backend — spaCy task extraction (no PyTorch required).
Local:  python app.py
Prod:   gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 60 --preload
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from extract import extract_tasks, _load_spacy

app = Flask(__name__)

# Accept comma-separated origins from env — defaults to localhost for dev
_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
CORS(app, origins=[o.strip() for o in _origins])

# Pre-load the spaCy model at startup (works with gunicorn --preload)
_load_spacy()


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/extract-tasks")
def extract():
    body = request.get_json(silent=True)
    if not body or not body.get("text", "").strip():
        return jsonify({"error": "No text provided"}), 400

    text = body["text"].strip()
    if len(text) < 10:
        return jsonify({"error": "Text too short"}), 400

    try:
        tasks = extract_tasks(text)
        return jsonify({"tasks": tasks})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"Ready. Listening on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
