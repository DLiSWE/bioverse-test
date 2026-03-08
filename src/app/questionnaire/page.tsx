"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect, useRouter } from "next/navigation";

type Questionnaire = {
  id: number;
  name: string;
};

export default function QuestionnaireSelectionPage() {
  const { user } = useAuth();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadQuestionnaires() {
      const res = await fetch("/api/questionnaire");
      const data = await res.json();
      setQuestionnaires(data);
    }

    loadQuestionnaires();
  }, [user, router]);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Select a Questionnaire
      </h1>

      <div className="space-y-4">
        {questionnaires.map((q) => (
          <Link
            key={q.id}
            href={`/questionnaire/${q.id}`}
            className="block border rounded-lg p-4 hover:bg-gray-50"
          >
            {q.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
