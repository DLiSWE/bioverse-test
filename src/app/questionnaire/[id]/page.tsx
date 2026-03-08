"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionRenderer from "@/components/base/QuestionRenderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

type AnswerValue = string | string[];
type AnswerMap = Record<number, AnswerValue>;

export default function QuestionnairePage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadData() {
      if (!id || !user?.username) return;

      try {
        const questionsRes = await fetch(`/api/questionnaire/${id}`);
        const questionsData = await questionsRes.json();

        if (!Array.isArray(questionsData)) {
          console.error("Expected an array but got:", questionsData);
          setQuestions([]);
          return;
        }

        const formatted = questionsData.map((q: any) => ({
          id: q.questionnaire_questions.id,
          ...q.questionnaire_questions.question,
        }));

        setQuestions(formatted);

        const answersRes = await fetch(
          `/api/questionnaire/${id}/previous-answers?username=${encodeURIComponent(user.username)}`,
        );

        const previousAnswers = await answersRes.json();

        if (Array.isArray(previousAnswers)) {
          const mapped: AnswerMap = {};

          previousAnswers.forEach((a: any) => {
            mapped[a.question_id] = a.answer;
          });

          setAnswers(mapped);
        }
      } catch (err) {
        console.error("Failed to load questionnaire data:", err);
      }
    }

    loadData();
  }, [id, user, router]);

  async function handleSubmit() {
    // validation: no empty or whitespace answers
    const invalid = questions.some((q) => {
      const value = answers[q.id];

      if (Array.isArray(value)) {
        return value.length === 0;
      }

      if (!value || value.trim() === "") {
        return true;
      }

      return false;
    });

    if (invalid) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const res = await fetch("/api/questionnaire/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user?.username,
        questionnaire_id: Number(id),
        answers,
      }),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/questionnaire");
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4 my-10 px-8">
      <h1 className="text-4xl font-bold text-center">Questionnaire</h1>

      <Card className="p-6 space-y-6">
        {questions.map((q) => (
          <QuestionRenderer
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(value) =>
              setAnswers((prev) => ({
                ...prev,
                [q.id]: value,
              }))
            }
          />
        ))}
      </Card>

      <Button className="mt-6" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
