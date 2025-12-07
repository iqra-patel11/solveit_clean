// src/components/AskQuestionForm.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AskQuestionForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const tags = tagsText
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const docRef = await addDoc(collection(db, "questions"), {
        title: title.trim(),
        body: body.trim(),
        tags,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });

      navigate(`/question/${docRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field">
        <label>Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to ask?"
          required
        />
      </div>
      <div className="field">
        <label>Details</label>
        <textarea
          rows="5"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add more context so people can help you better."
        />
      </div>
      <div className="field">
        <label>Tags (comma separated)</label>
        <input
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="mern, javascript, college"
        />
      </div>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Posting…" : "Post question"}
      </button>
    </form>
  );
}
