// src/pages/QuestionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import AnswerForm from "../components/AnswerForm.jsx";
import AnswerList from "../components/AnswerList.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [commentText, setCommentText] = useState("");

  const { user } = useAuth();

  // 🔥 REAL-TIME QUESTION FETCH (FIXED)
  useEffect(() => {
    const ref = doc(db, "questions", id);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setQuestion({ id: snap.id, ...snap.data() });
      } else {
        setQuestion(null);
      }
      setLoadingQuestion(false);
    });

    return () => unsub();
  }, [id]);

  // ANSWERS (unchanged)
  useEffect(() => {
    const q = query(
      collection(db, "answers"),
      where("questionId", "==", id),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnswers(list);
    });

    return () => unsub();
  }, [id]);

  // 🔥 ADD COMMENT
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const ref = doc(db, "questions", id);

      await updateDoc(ref, {
        comments: arrayUnion({
          text: commentText,
          user: user?.email || "anonymous",
          likes: 0,
          dislikes: 0,
          createdAt: new Date(),
        }),
      });

      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  // 🔥 LIKE / DISLIKE COMMENT
  const handleCommentAction = async (index, type) => {
    try {
      const ref = doc(db, "questions", id);

      const updatedComments = [...(question.comments || [])];

      if (type === "like") {
        updatedComments[index].likes =
          (updatedComments[index].likes || 0) + 1;
      } else {
        updatedComments[index].dislikes =
          (updatedComments[index].dislikes || 0) + 1;
      }

      await updateDoc(ref, {
        comments: updatedComments,
      });
    } catch (err) {
      console.error("Comment update error:", err);
    }
  };

  if (loadingQuestion) return <p>Loading…</p>;
  if (!question) return <p>Question not found.</p>;

  const created = question.createdAt?.toDate
    ? question.createdAt.toDate()
    : null;

  // 🔥 SORT COMMENTS (MOST LIKED FIRST)
  const sortedComments = [...(question.comments || [])].sort(
    (a, b) => (b.likes || 0) - (a.likes || 0)
  );

  return (
    <div>
      <div className="card">
        <h1>{question.title}</h1>
        {question.body && <p>{question.body}</p>}

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
      </div>

      {/* 🔥 COMMENTS */}
      <div className="card" style={{ marginTop: "15px" }}>
        <h2>Comments</h2>

        {user && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, padding: "8px" }}
            />
            <button onClick={handleAddComment}>Post</button>
          </div>
        )}

        {sortedComments.length > 0 ? (
          sortedComments.map((c, index) => (
            <div key={index} className="question-card" style={{ marginBottom: "8px" }}>
              <p>{c.text}</p>
              <small>{c.user}</small>

              <div className="question-actions">
                <button onClick={() => handleCommentAction(index, "like")}>
                  👍 {c.likes || 0}
                </button>

                <button onClick={() => handleCommentAction(index, "dislike")}>
                  👎 {c.dislikes || 0}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <h2>Answers</h2>
      <AnswerList answers={answers} />

      {user ? (
        <AnswerForm questionId={id} />
      ) : (
        <p>Log in to post an answer.</p>
      )}
    </div>
  );
}