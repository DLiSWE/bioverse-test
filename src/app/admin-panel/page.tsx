"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/User";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

type AdminAnswerRow = {
  id: number;
  username: string;
  questionnaire_name: string;
  question_text: string;
  answer: string | string[];
  created_at: string;
};

export default function AdminPanelPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<AdminAnswerRow[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== Role.ADMIN) {
      router.push("/");
      return;
    }

    async function loadAnswers() {
      const res = await fetch("/api/admin");
      const data = await res.json();

      if (Array.isArray(data)) {
        setRows(data);
      }
    }

    loadAnswers();
  }, [user, router]);

  if (!user || user.role !== Role.ADMIN) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>

      <div className="space-y-4 mb-10">
        {rows.map((row) => (
          <Card key={row.id} className="p-4 space-y-2">
            <p>
              <span className="font-semibold">User:</span> {row.username}
            </p>
            <p>
              <span className="font-semibold">Questionnaire:</span>{" "}
              {row.questionnaire_name}
            </p>
            <p>
              <span className="font-semibold">Question:</span>{" "}
              {row.question_text}
            </p>
            <p>
              <span className="font-semibold">Answer:</span>{" "}
              {Array.isArray(row.answer) ? row.answer.join(", ") : row.answer}
            </p>
            <p className="text-sm text-gray-500">
              Submitted: {new Date(row.created_at).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
