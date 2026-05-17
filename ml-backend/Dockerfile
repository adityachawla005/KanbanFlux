FROM python:3.11-slim

WORKDIR /app

# Install deps first (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model (~50 MB, baked into the image)
RUN python -m spacy download en_core_web_sm

# Copy source
COPY app.py extract.py ./

EXPOSE 5001

# --preload shares the already-loaded spaCy model across workers
CMD ["gunicorn", "app:app", \
     "--bind", "0.0.0.0:5001", \
     "--workers", "1", \
     "--timeout", "60", \
     "--preload"]
