import React, { useState } from "react";

function UserDetails() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [problem, setProblem] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !age || !problem) {
      alert("Please fill all details");
      return;
    }

    // save user details (for now localStorage is enough)
    localStorage.setItem(
      "userDetails",
      JSON.stringify({ name, age, problem })
    );

    setSubmitted(true);
  };

  return (
    <div className="card">
      <h2>👤 User Details</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select value={problem} onChange={(e) => setProblem(e.target.value)}>
          <option value="">Select Problem</option>
          <option value="Stuttering">Stuttering</option>
          <option value="Fluency Issue">Fluency Issue</option>
          <option value="Pronunciation Problem">Pronunciation Problem</option>
        </select>

        <button type="submit">✅ Submit Details</button>
      </form>

      {submitted && (
        <p style={{ color: "green", marginTop: "10px" }}>
          ✔ Details saved successfully
        </p>
      )}
    </div>
  );
}

export default UserDetails;
