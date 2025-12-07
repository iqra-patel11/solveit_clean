// src/components/AnswerList.jsx
import React from "react";

export default function AnswerList({ answers }) {
  if (!answers || answers.length === 0) {
    return <p>No answers yet.</p>;
  }

  return (
    <div className="answers">
      {answers.map((ans) => {
        const created = ans.createdAt?.toDate
          ? ans.createdAt.toDate()
          : null;

        return (
          <div key={ans.id} className="card answer-card">
            <p>{ans.body}</p>
            <div className="question-meta">
              <span>{ans.authorName || "Anonymous"}</span>
              {created && <span>{created.toLocaleString()}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
