// src/components/AnswerForm.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";

export default function AnswerForm({ questionId }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "answers"), {
        questionId,
        body: body.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });
      setBody("");
    } catch (err) {
      console.error(err);
      alert("Failed to post answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field">
        <label>Your answer</label>
        <textarea
          rows="4"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a helpful answer…"
        />
      </div>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Posting…" : "Post answer"}
      </button>
    </form>
  );
}
