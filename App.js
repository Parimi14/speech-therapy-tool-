import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import UserDetails from "./components/UserDetails";
import SpeechRecorder from "./components/SpeechRecorder";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* Background Clouds */}
      <div className="clouds">
        <div className="cloud small c1"></div>
        <div className="cloud medium c2"></div>
        <div className="cloud large c3"></div>
        <div className="cloud small c4"></div>
        <div className="cloud medium c5"></div>
      </div>

      <div className="container">
        <h1>AI Based Speech Therapy Tool</h1>

        {/* 🌙 Dark mode button */}
        <button onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>
{darkMode && (
  <div className="particles">
    <div className="particle p1"></div>
    <div className="particle p2"></div>
    <div className="particle p3"></div>
    <div className="particle p4"></div>
    <div className="particle p5"></div>
  </div>
)}
{darkMode && (
  <div className="stars">
    {/* Small stars */}
    <div className="star small" style={{ top: "10%", left: "15%" }}></div>
    <div className="star small" style={{ top: "20%", left: "40%" }}></div>
    <div className="star small" style={{ top: "35%", left: "70%" }}></div>
    <div className="star small" style={{ top: "50%", left: "25%" }}></div>
    <div className="star small" style={{ top: "65%", left: "55%" }}></div>
    <div className="star small" style={{ top: "80%", left: "80%" }}></div>

    {/* Medium stars */}
    <div className="star medium" style={{ top: "15%", left: "60%" }}></div>
    <div className="star medium" style={{ top: "30%", left: "20%" }}></div>
    <div className="star medium" style={{ top: "55%", left: "45%" }}></div>
    <div className="star medium" style={{ top: "75%", left: "10%" }}></div>

    {/* Large stars */}
    <div className="star large" style={{ top: "25%", left: "80%" }}></div>
    <div className="star large" style={{ top: "60%", left: "65%" }}></div>
  </div>
)}
{darkMode && (
  <div className="stars">
    {Array.from({ length: 60 }).map((_, i) => (
      <div
        key={i}
        className={`star ${
          i % 3 === 0 ? "small" : i % 3 === 1 ? "medium" : "large"
        }`}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`
        }}
      ></div>
    ))}
  </div>
)}
{darkMode && (
  <>
    {/* ⭐ Stars */}
    <div className="stars">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className={`star ${
            i % 3 === 0 ? "small" : i % 3 === 1 ? "medium" : "large"
          }`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}
    </div>

    {/* ✨ Subtle particles */}
    <div className="particles">
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
      <div className="particle p5"></div>
    </div>
  </>
)}



        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<UserDetails />} />
          <Route path="/speech" element={<SpeechRecorder />} />
        </Routes>

        <div className="footer">
          © 2025 AI Based Speech Therapy Tool | MCA Project
        </div>
      </div>
    </div>
  );
}

export default App;




