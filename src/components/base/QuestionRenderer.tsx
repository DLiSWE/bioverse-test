"use client";

import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

export type Question = {
  id: number;
  type: "input" | "mcq";
  question: string;
  options?: string[];
};

type QuestionRendererProps = {
  question: Question;
  value: any;
  onChange: (value: any) => void;
};

export default function QuestionRenderer({
  question,
  value,
  onChange,
}: QuestionRendererProps) {
  if (question.type === "input") {
    return (
      <div className="space-y-2">
        <p className="font-medium">{question.question}</p>
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  if (question.type === "mcq") {
    return (
      <div className="space-y-2">
        <p className="font-medium">{question.question}</p>

        {question.options?.map((option) => (
          <label key={option} className="block">
            <Checkbox
              checked={(value || []).includes(option)}
              onCheckedChange={(checked) => {
                const prev = value || [];
                const updated = checked
                  ? [...prev, option]
                  : prev.filter((o: string) => o !== option);
                onChange(updated);
              }}
            />
            <span className="ml-2">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  return null;
}
