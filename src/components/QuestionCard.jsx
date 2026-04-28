import React from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx"; // ✅ added

export default function QuestionCard({ question }) {
  const { user } = useAuth(); // ✅ added

  const created = question.createdAt?.toDate
    ? question.createdAt.toDate()
    : null;

  // 👍 Like
  const handleLike = async (e) => {
    e.stopPropagation();
    const ref = doc(db, "questions", question.id);
    await updateDoc(ref, {
      likes: increment(1),
    });
  };

  // 👎 Dislike
  const handleDislike = async (e) => {
    e.stopPropagation();
    const ref = doc(db, "questions", question.id);
    await updateDoc(ref, {
      dislikes: increment(1),
    });
  };

  // 🗑️ Delete
  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Delete this question?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "questions", question.id));
  };

  return (
    <div className="question-card">
      <Link to={`/question/${question.id}`}>
        <h2>{question.title}</h2>

        {question.body && (
          <p className="question-body">
            {question.body.slice(0, 120)}
            {question.body.length > 120 ? "…" : ""}
          </p>
        )}

        <div className="question-meta">
          <span>{question.authorName || "Anonymous"}</span>
          {created && <span>{created.toLocaleString()}</span>}
          {question.tags && question.tags.length > 0 && (
            <span className="tags">
              {question.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </Link>

      {/* 🔥 ACTION BUTTONS */}
      <div className="question-actions">
        <button onClick={handleLike}>
          👍 {question.likes || 0}
        </button>

        <button onClick={handleDislike}>
          👎 {question.dislikes || 0}
        </button>

        {/* 🔐 ONLY OWNER CAN DELETE */}
        {user?.uid === question.authorId && (
          <button onClick={handleDelete}>
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}