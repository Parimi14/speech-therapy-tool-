import React, { useState, useRef } from "react";

function SpeechRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  /* 🎙️ LIVE RECORDING */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm;codecs=opus" });

        setAudioBlob(blob);
        setFile(null);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      setError("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  /* 📂 FILE UPLOAD */
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAudioBlob(null);
    setError("");
  };

  /* 📊 SEND TO BACKEND */
  const analyzeSpeech = async () => {
    let audioToSend = null;

    if (audioBlob) {
      audioToSend = audioBlob;
    } else if (file) {
      audioToSend = file;
    } else {
      setError("Please record or upload an audio file");
      return;
    }

    console.log("Sending audio:", audioToSend);

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", audioToSend);
    formData.append("user_id", "user_1"); // later dynamic


    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-speech/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error("Error while analyzing speech:", err);
      setError("Audio processing failed. Please try again.");
    }

    setLoading(false);
  };

  /* 🖥️ UI */
  return (
    <div className="card">
      <h2>🎙️ Speech Analysis</h2>

      {/* RECORDING */}
      {!recording ? (
        <button onClick={startRecording}>🎤 Start Recording</button>
      ) : (
        <button onClick={stopRecording}>⏹️ Stop Recording</button>
      )}

      <p style={{ margin: "10px 0" }}>— OR —</p>

      {/* FILE UPLOAD */}
      <input type="file" accept="audio/*" onChange={handleFileChange} />

      <br /><br />

      <button onClick={analyzeSpeech}>📊 Analyze Speech</button>

      {/* LOADING */}
      {loading && <p>⏳ Analyzing speech...</p>}

      {/* ERROR */}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          ⚠️ {error}
        </p>
      )}

      {/* RESULT */}
      {result && result.analysis && (
        <div className="result-card">
          <h3>Analysis Result</h3>

          <p><b>Pauses:</b> {result.analysis.pauses}</p>
          <p><b>Energy:</b> {result.analysis.energy}</p>
          <p><b>Articulation:</b> {result.analysis.articulation}</p>
          <p><b>Stuttering Level:</b> {result.analysis.stuttering_level}</p>
          <p><b>Pronunciation Score:</b> {result.analysis.pronunciation_score}</p>

          <h4>Suggestions</h4>
          <ul>
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SpeechRecorder;



