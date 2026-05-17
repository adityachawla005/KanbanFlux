#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing dependencies (Flask + spaCy only, ~50MB)..."
pip install -q -r requirements.txt

python -c "import spacy; spacy.load('en_core_web_sm')" 2>/dev/null || {
    echo "Downloading spaCy en_core_web_sm (~15MB)..."
    python -m spacy download en_core_web_sm
}

echo ""
echo "Starting ML backend on http://localhost:5001"
python app.py
