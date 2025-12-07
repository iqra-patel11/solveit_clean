// src/pages/QuestionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import AnswerForm from "../components/AnswerForm.jsx";
import AnswerList from "../components/AnswerList.jsx";
import { useAuth } from "../context/AuthContext.jsx";


export default function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const snap = await getDoc(doc(db, "questions", id));
        if (snap.exists()) {
          setQuestion({ id: snap.id, ...snap.data() });
        } else {
          setQuestion(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingQuestion(false);
      }
    };

    loadQuestion();
  }, [id]);

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

  if (loadingQuestion) return <p>Loading…</p>;
  if (!question) return <p>Question not found.</p>;

  const created = question.createdAt?.toDate
    ? question.createdAt.toDate()
    : null;

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
