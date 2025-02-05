
import { BookOpen } from "lucide-react";
import type { Question } from "@/data/catechism/types";

interface QuestionSectionProps {
  question: Question;
}

export const QuestionSection = ({ question }: QuestionSectionProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-brand-800 mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        Question {question.id}
      </h2>
      <p className="text-lg text-brand-700 leading-relaxed">{question.question}</p>
    </div>
  );
};
