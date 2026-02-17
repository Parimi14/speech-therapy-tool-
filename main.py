from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import time
import json
import librosa
import numpy as np

# -------------------------------
# APP INITIALIZATION
# -------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# CONSTANT PATHS
# -------------------------------
RECORDINGS_DIR = "recordings"
REPORTS_FILE = "reports.json"

os.makedirs(RECORDINGS_DIR, exist_ok=True)

if not os.path.exists(REPORTS_FILE):
    with open(REPORTS_FILE, "w") as f:
        json.dump([], f)

# -------------------------------
# ROOT CHECK
# -------------------------------
@app.get("/")
def root():
    return {"message": "AI Speech Therapy Backend is running"}

# -------------------------------
# ANALYZE SPEECH (FAST VERSION)
# -------------------------------
@app.post("/analyze-speech/")
async def analyze_speech(file: UploadFile = File(...)):

    try:
        # -------------------------------
        # USER & FILE STORAGE
        # -------------------------------
        user_id = "user_1"   # can be dynamic later
        user_dir = os.path.join(RECORDINGS_DIR, user_id)
        os.makedirs(user_dir, exist_ok=True)

        audio_filename = f"{int(time.time())}_{file.filename or 'speech.webm'}"
        audio_path = os.path.join(user_dir, audio_filename)

        with open(audio_path, "wb") as f:
            f.write(await file.read())

        # -------------------------------
        # LOAD AUDIO (LIMIT TO 10 SECONDS)
        # -------------------------------
        y, sr = librosa.load(audio_path, sr=16000, mono=True, duration=5)

        if y is None or len(y) < sr:
            return {"error": "Audio too short or silent"}

        # -------------------------------
        # FAST FEATURE EXTRACTION
        # -------------------------------
        energy = float(np.mean(np.abs(y)))
        zcr = float(np.mean(librosa.feature.zero_crossing_rate(y)))
        pauses = int(np.sum(np.abs(y) < 0.01) / sr)

        # -------------------------------
        # STUTTERING LOGIC
        # -------------------------------
        if pauses > 10:
            stuttering = "High"
        elif pauses > 5:
            stuttering = "Medium"
        else:
            stuttering = "Low"

        pronunciation_score = max(40, 100 - pauses * 4)

        analysis = {
            "pauses": pauses,
            "energy": round(energy, 4),
            "articulation": round(zcr, 4),
            "stuttering_level": stuttering,
            "pronunciation_score": pronunciation_score
        }

        # -------------------------------
        # THERAPY SUGGESTIONS
        # -------------------------------
        suggestions = [
            "Practice slow and rhythmic speech",
            "Pause consciously between sentences",
            "Use deep breathing before speaking",
            "Practice mirror speaking daily",
            "Repeat long vowel sounds slowly",
            "Read aloud for 5 minutes every day",
            "Practice tongue and lip exercises",
            "Avoid rushing while speaking"
        ]

        if stuttering == "High":
            suggestions.append("Practice prolonged speech technique")
            suggestions.append("Speak using a metronome or steady beat")

        # -------------------------------
        # SAVE REPORT
        # -------------------------------
        with open(REPORTS_FILE, "r") as f:
            reports = json.load(f)

        reports.append({
            "user_id": user_id,
            "file": audio_filename,
            "analysis": analysis,
            "timestamp": int(time.time())
        })

        with open(REPORTS_FILE, "w") as f:
            json.dump(reports, f, indent=2)

        # -------------------------------
        # RESPONSE
        # -------------------------------
        return {
            "analysis": analysis,
            "suggestions": suggestions
        }

    except Exception as e:
        print("❌ Backend error:", e)
        return {"error": "Audio processing failed"}

# -------------------------------
# USER REPORTS
# -------------------------------
@app.get("/reports/{user_id}")
def get_reports(user_id: str):
    with open(REPORTS_FILE, "r") as f:
        reports = json.load(f)

    return [r for r in reports if r["user_id"] == user_id]







