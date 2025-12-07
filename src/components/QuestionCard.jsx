// src/components/QuestionCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function QuestionCard({ question }) {
  const created = question.createdAt?.toDate
    ? question.createdAt.toDate()
    : null;

  return (
    <Link to={`/question/${question.id}`} className="question-card">
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
  );
}
