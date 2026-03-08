import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const questionnaireId = Number(id);

  if (Number.isNaN(questionnaireId)) {
    return NextResponse.json(
      { error: "Invalid questionnaire id" },
      { status: 400 },
    );
  }

  const { data: junctionRows, error: junctionError } = await supabase
    .from("questionnaire_junction")
    .select("question_id, priority")
    .eq("questionnaire_id", questionnaireId)
    .order("priority", { ascending: true });

  if (junctionError) {
    return NextResponse.json({ error: junctionError.message }, { status: 500 });
  }

  const questionIds = junctionRows.map((row) => row.question_id);

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

  const formatted = junctionRows.map((junctionRow) => {
    const matchingQuestion = questions.find(
      (q) => q.id === junctionRow.question_id,
    );

    return {
      priority: junctionRow.priority,
      questionnaire_questions: matchingQuestion,
    };
  });

  return NextResponse.json(formatted);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { username, questionnaire_id, answers } = body;

  if (!answers || Object.keys(answers).length === 0) {
    return NextResponse.json({ error: "No answers provided" }, { status: 400 });
  }

  const rows = Object.entries(answers).map(([question_id, answer]) => ({
    username,
    questionnaire_id,
    question_id: Number(question_id),
    answer,
  }));

  const { error } = await supabase.from("questionnaire_answers").insert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
