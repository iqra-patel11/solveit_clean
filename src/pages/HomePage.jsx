// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import QuestionCard from "../components/QuestionCard.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function HomePage() {
  const [questions, setQuestions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, "questions"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 🔥 SORT BY LIKES (MOST LIKED FIRST)
      const sorted = list.sort((a, b) => {
        return (b.likes || 0) - (a.likes || 0);
      });

      setQuestions(sorted);
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Latest questions</h1>
        {user && (
          <Link to="/ask" className="btn-primary">
            Ask a question
          </Link>
        )}
      </div>
      {questions.length === 0 && (
        <p>No questions yet. Be the first to ask!</p>
      )}
      <div className="question-list">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
}