// Get questionnaire data for admin panel
import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

type AnswerRow = {
  id: number;
  username: string;
  questionnaire_id: number;
  question_id: number;
  answer: string | string[];
  created_at: string;
};

type QuestionnaireRow = {
  id: number;
  name: string;
};

type QuestionRow = {
  id: number;
  question: string | { question?: string };
};

export async function GET() {
  const { data: answers, error: answersError } = await supabase
    .from("questionnaire_answers")
    .select("id, username, questionnaire_id, question_id, answer, created_at")
    .order("created_at", { ascending: false });

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  const typedAnswers = (answers ?? []) as AnswerRow[];

  if (typedAnswers.length === 0) {
    return NextResponse.json([]);
  }

  const questionnaireIds = [
    ...new Set(typedAnswers.map((a) => a.questionnaire_id)),
  ];
  const questionIds = [...new Set(typedAnswers.map((a) => a.question_id))];

  const { data: questionnaires, error: questionnairesError } = await supabase
    .from("questionnaire_questionnaires")
    .select("id, name")
    .in("id", questionnaireIds);

  if (questionnairesError) {
    return NextResponse.json(
      { error: questionnairesError.message },
      { status: 500 },
    );
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questionnaire_questions")
    .select("id, question")
    .in("id", questionIds);

  if (questionsError) {
    return NextResponse.json(
      { error: questionsError.message },
      { status: 500 },
    );
  }

  const typedQuestionnaires = (questionnaires ?? []) as QuestionnaireRow[];
  const typedQuestions = (questions ?? []) as QuestionRow[];

  const questionnaireMap = new Map<number, string>();
  for (const questionnaire of typedQuestionnaires) {
    questionnaireMap.set(questionnaire.id, questionnaire.name);
  }

  const questionMap = new Map<number, string>();
  for (const question of typedQuestions) {
    const questionText =
      typeof question.question === "string"
        ? question.question
        : (question.question?.question ?? "Unknown Question");

    questionMap.set(question.id, questionText);
  }

  const groupedUsers: Record<
    string,
    {
      username: string;
      completedCount: number;
      questionnaires: {
        questionnaireName: string;
        submittedAt: string;
        answers: {
          question: string;
          answer: string | string[];
        }[];
      }[];
    }
  > = {};

  for (const answerRow of typedAnswers) {
    const username = answerRow.username;
    const questionnaireName =
      questionnaireMap.get(answerRow.questionnaire_id) ??
      "Unknown Questionnaire";
    const questionText =
      questionMap.get(answerRow.question_id) ?? "Unknown Question";

    if (!groupedUsers[username]) {
      groupedUsers[username] = {
        username,
        completedCount: 0,
        questionnaires: [],
      };
    }

    const userGroup = groupedUsers[username];

    // Temporary grouping strategy:
    // treat rows with the same username + questionnaire_id + created_at
    // as one questionnaire submission
    const existingQuestionnaire = userGroup.questionnaires.find(
      (q) =>
        q.questionnaireName === questionnaireName &&
        q.submittedAt === answerRow.created_at,
    );

    if (existingQuestionnaire) {
      existingQuestionnaire.answers.push({
        question: questionText,
        answer: answerRow.answer,
      });
    } else {
      userGroup.questionnaires.push({
        questionnaireName,
        submittedAt: answerRow.created_at,
        answers: [
          {
            question: questionText,
            answer: answerRow.answer,
          },
        ],
      });

      userGroup.completedCount += 1;
    }
  }

  return NextResponse.json(Object.values(groupedUsers));
}
