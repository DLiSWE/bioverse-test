// Get questionnaire data for admin panel
import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: answers, error: answersError } = await supabase
    .from("questionnaire_answers")
    .select("id, username, questionnaire_id, question_id, answer, created_at")
    .order("created_at", { ascending: false });

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  const questionnaireIds = [...new Set(answers.map((a) => a.questionnaire_id))];
  const questionIds = [...new Set(answers.map((a) => a.question_id))];

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

  const formatted = answers.map((answerRow) => {
    const questionnaire = questionnaires.find(
      (q) => q.id === answerRow.questionnaire_id,
    );

    const question = questions.find((q) => q.id === answerRow.question_id);

    return {
      id: answerRow.id,
      username: answerRow.username,
      questionnaire_name: questionnaire?.name ?? "Unknown Questionnaire",
      question_text:
        typeof question?.question === "object" &&
        question?.question !== null &&
        "question" in question.question
          ? question.question.question
          : "Unknown Question",
      answer: answerRow.answer,
      created_at: answerRow.created_at,
    };
  });

  return NextResponse.json(formatted);
}
