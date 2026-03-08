"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/User";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type QuestionnaireAnswer = {
  question: string;
  answer: string | string[];
};

type UserQuestionnaire = {
  questionnaireName: string;
  submittedAt: string;
  answers: QuestionnaireAnswer[];
};

type AdminUserSummary = {
  username: string;
  completedCount: number;
  questionnaires: UserQuestionnaire[];
};

export default function AdminPanelPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== Role.ADMIN) {
      router.push("/");
      return;
    }

    async function loadAdminData() {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await fetch("/api/admin");

        if (!res.ok) {
          const errorData = await res.json();
          setErrorMessage(errorData.error ?? "Failed to load admin data");
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Something went wrong while loading admin data");
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [user, router]);

  if (!user || user.role !== Role.ADMIN) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Questionnaire Completion Summary
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : users.length === 0 ? (
          <p>No questionnaire submissions found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Completed Questionnaires</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((userSummary) => (
                <TableRow
                  key={userSummary.username}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedUser(userSummary)}
                >
                  <TableCell>{userSummary.username}</TableCell>
                  <TableCell>{userSummary.completedCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? `${selectedUser.username}'s Answers` : "Answers"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {selectedUser?.questionnaires.map((questionnaire, index) => (
              <Card key={index} className="p-4 space-y-4">
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Username:</span>{" "}
                    {selectedUser.username}
                  </p>
                  <p>
                    <span className="font-semibold">Questionnaire:</span>{" "}
                    {questionnaire.questionnaireName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted:{" "}
                    {new Date(questionnaire.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-3">
                  {questionnaire.answers.map((qa, qaIndex) => (
                    <div key={qaIndex} className="rounded-md border p-3">
                      <p>
                        <span className="font-semibold">Q:</span> {qa.question}
                      </p>
                      <p>
                        <span className="font-semibold">A:</span>{" "}
                        {Array.isArray(qa.answer)
                          ? qa.answer.join(", ")
                          : qa.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
