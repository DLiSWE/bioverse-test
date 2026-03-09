import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; user: string }> },
) {
  const { id, user } = await params;
  const questionnaireId = Number(id);

  if (Number.isNaN(questionnaireId)) {
    return NextResponse.json(
      { error: "Invalid questionnaire id" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("questionnaire_answers")
    .select("question_id, answer")
    .eq("questionnaire_id", questionnaireId)
    .eq("username", user);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
