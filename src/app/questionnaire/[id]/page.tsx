"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuestionRenderer from "@/components/base/QuestionRenderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function QuestionnairePage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadQuestions() {
      if (!id) return;

      const res = await fetch(`/api/questionnaire/${id}`);
      const data = await res.json();

      console.log("question data:", data);

      if (!Array.isArray(data)) {
        console.error("Expected an array but got:", data);
        setQuestions([]);
        return;
      }

      const formatted = data.map((q: any) => ({
        id: q.questionnaire_questions.id,
        ...q.questionnaire_questions.question,
      }));

      setQuestions(formatted);
    }

    loadQuestions();
  }, [id, user, router]);

  async function handleSubmit() {
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
    <div className="max-w-2xl mx-auto mt-10 space-y-4 my-10">
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
