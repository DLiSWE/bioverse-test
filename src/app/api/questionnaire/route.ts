import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

// Get questionnaire for user
export async function GET() {
  const { data, error } = await supabase
    .from("questionnaire_questionnaires")
    .select("id, name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log(NextResponse.json(data));
  return NextResponse.json(data);
}

// Submit questionnaire answers
export async function POST() {
  return new Response("Submit Questionnaire API route");
}
