"""
spaCy-only task extraction pipeline — no PyTorch, no T5, installs in seconds.

Step 1  spaCy sentence splitter       → one candidate task per sentence
Step 2  spaCy NER                      → PERSON = assignee, DATE = deadline
Step 3  Keyword lists                  → priority (high / medium / low)
Step 4  spaCy dependency parser        → clean actionable title
         ROOT verb + dobj/attr/nsubj   e.g. "fix the auth bug" → "Fix auth bug"
"""

import re
import spacy

_nlp = None

HIGH_KEYWORDS = [
    "urgent", "asap", "critical", "high priority", "immediately",
    "important", "blocker", "blocking", "must", "emergency",
]
LOW_KEYWORDS = [
    "low priority", "no rush", "whenever", "eventually", "minor",
    "nice to have", "optional", "later", "backlog", "someday",
]

# Words that indicate task ownership but aren't the task itself
OWNERSHIP_VERBS = {"need", "needs", "should", "must", "have", "has", "want", "wants"}

# Filler phrases to strip before building the title
FILLER = re.compile(
    r"\b(needs? to|should|must|has to|have to|please|can you|could you|going to|will)\b",
    flags=re.IGNORECASE,
)


def _load_spacy():
    global _nlp
    if _nlp is None:
        try:
            _nlp = spacy.load("en_core_web_sm")
        except OSError:
            raise RuntimeError(
                "spaCy model not found. Run: python -m spacy download en_core_web_sm"
            )
    return _nlp


# ---------------------------------------------------------------------------
# Step 3 — priority detection
# ---------------------------------------------------------------------------
def _detect_priority(text: str) -> str:
    t = text.lower()
    if any(kw in t for kw in HIGH_KEYWORDS):
        return "high"
    if any(kw in t for kw in LOW_KEYWORDS):
        return "low"
    return "medium"


# ---------------------------------------------------------------------------
# Step 4 — spaCy dependency-parser title extraction
#
# Strategy:
#   1. Find the ROOT token (main verb)
#   2. If ROOT is an ownership verb (needs, should…), find the xcomp / ccomp child
#      which is the real action verb
#   3. Collect: action verb + direct object (dobj) + any compound modifiers
#   4. Capitalise and clean
# ---------------------------------------------------------------------------
def _extract_title(sent) -> str:
    # Find root
    root = next((t for t in sent if t.dep_ == "ROOT"), None)
    if root is None:
        return _fallback_title(sent.text)

    # If root is an ownership verb, dig into xcomp (e.g. "Rahul should [handle] the migration")
    action = root
    if root.lemma_.lower() in OWNERSHIP_VERBS:
        xcomp = next((c for c in root.children if c.dep_ in ("xcomp", "ccomp")), None)
        if xcomp:
            action = xcomp

    # Collect the action verb + its direct subtree (dobj, prep, compound…)
    # but skip subject, ownership-verb subtrees, and named entities used as assignees
    skip_deps = {"nsubj", "nsubjpass", "aux", "auxpass", "punct", "cc", "mark"}
    skip_ents = {ent.start for ent in sent.ents if ent.label_ == "PERSON"}

    def collect(token, depth=0):
        """Recursively collect token + relevant children."""
        if depth > 3:
            return []
        parts = []
        for child in token.lefts:
            if child.dep_ not in skip_deps and child.i not in skip_ents:
                parts.extend(collect(child, depth + 1))
        parts.append(token)
        for child in token.rights:
            if child.dep_ not in skip_deps and child.i not in skip_ents:
                if child.dep_ in ("dobj", "pobj", "attr", "compound", "amod", "prep", "advmod"):
                    parts.extend(collect(child, depth + 1))
        return parts

    tokens = collect(action)
    if not tokens:
        return _fallback_title(sent.text)

    title = " ".join(t.text for t in sorted(tokens, key=lambda t: t.i))

    # Strip filler phrases that leaked through
    title = FILLER.sub("", title).strip()
    title = re.sub(r"\s{2,}", " ", title)

    # Capitalise first letter, max 60 chars
    title = title.strip(" ,.")
    if not title:
        return _fallback_title(sent.text)
    return (title[0].upper() + title[1:])[:60]


def _fallback_title(text: str) -> str:
    """Strip common filler and return first 60 chars."""
    cleaned = FILLER.sub("", text).strip(" ,.")
    cleaned = re.sub(r"\s{2,}", " ", cleaned)
    return (cleaned[0].upper() + cleaned[1:])[:60] if cleaned else text[:60]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
def extract_tasks(text: str) -> list[dict]:
    nlp = _load_spacy()
    doc = nlp(text)

    tasks = []
    for sent in doc.sents:
        if len(sent.text.strip()) < 15:
            continue

        sent_doc = nlp(sent.text)

        # Step 2 — NER
        assignee = None
        deadline = None
        for ent in sent_doc.ents:
            if ent.label_ == "PERSON" and assignee is None:
                assignee = ent.text
            elif ent.label_ in ("DATE", "TIME") and deadline is None:
                deadline = ent.text

        # Step 3 — priority
        priority = _detect_priority(sent.text)

        # Step 4 — title via dependency parsing
        title = _extract_title(sent_doc[0:len(sent_doc)])

        tasks.append({
            "title": title,
            "assignee": assignee,
            "priority": priority,
            "deadline": deadline,
            "source_sentence": sent.text.strip(),
        })

    return tasks
