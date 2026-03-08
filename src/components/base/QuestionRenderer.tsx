"use client";

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
        <input
          className="border p-2 w-full"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (question.type === "mcq") {
    return (
      <div className="space-y-2">
        <p className="font-medium">{question.question}</p>

        {question.options?.map((option) => (
          <label key={option} className="block">
            <input
              type="checkbox"
              checked={(value || []).includes(option)}
              onChange={(e) => {
                const prev = value || [];

                const updated = e.target.checked
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
