import { BookOpen } from "lucide-react";
import type { Question } from "@/data/catechism/types";

interface QuestionSectionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionSection = ({ question, questionNumber, totalQuestions }: QuestionSectionProps) => {
  return (
    <div className="animate-fade-in">
      <div className="text-sm text-brand-600 mb-4">
        Question {questionNumber} of {totalQuestions}
      </div>
      <h2 className="text-xl font-semibold text-brand-800 mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        Question {question.id}
      </h2>
      <p className="text-lg text-brand-700 leading-relaxed">{question.question}</p>
    </div>
  );
};