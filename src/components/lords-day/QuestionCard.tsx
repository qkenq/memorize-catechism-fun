import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Question } from "@/data/catechism/types";
import { QuestionSection } from "./QuestionSection";
import { AnswerSection } from "./AnswerSection";
import { FillInBlankQuestion } from "./FillInBlankQuestion";
import { DragAndDropQuestion } from "./DragAndDropQuestion";
import { useState } from "react";

interface QuestionCardProps {
  question: Question;
  showAnswer: boolean;
  onShowAnswer: () => void;
  onSelfScore: (understood: boolean) => void;
  userLevel?: number;
}

export const QuestionCard = ({
  question,
  showAnswer,
  onShowAnswer,
  onSelfScore,
  userLevel = 1,
}: QuestionCardProps) => {
  const [interactiveScore, setInteractiveScore] = useState<boolean | null>(null);

  // Determine if this should be an interactive question
  const shouldBeInteractive = userLevel === 1 && Math.random() < 1/3;
  const questionType = shouldBeInteractive 
    ? Math.random() < 0.5 ? 'fillInBlank' : 'dragAndDrop'
    : 'standard';

  const handleInteractiveAnswer = (isCorrect: boolean) => {
    setInteractiveScore(isCorrect);
    onSelfScore(isCorrect);
  };

  // Generate fill-in-blank data
  const getFillInBlankData = () => {
    const words = question.answer.split(' ');
    const blankIndex = Math.floor(words.length / 2);
    return {
      beforeBlank: words.slice(0, blankIndex).join(' '),
      blank: words[blankIndex],
      afterBlank: words.slice(blankIndex + 1).join(' '),
    };
  };

  // Generate drag-and-drop data
  const getDragAndDropData = () => {
    const segments = question.answer.split('. ');
    const correctOrder = segments.map((_, index) => index);
    const shuffledSegments = [...segments].sort(() => Math.random() - 0.5);
    return {
      segments: shuffledSegments,
      correctOrder: shuffledSegments.map(segment => segments.indexOf(segment)),
    };
  };

  return (
    <Card className="p-6 mb-8 animate-fade-in">
      <div className="space-y-6">
        <QuestionSection question={question} />

        {questionType === 'standard' ? (
          showAnswer ? (
            <AnswerSection 
              answer={question.answer}
              onSelfScore={onSelfScore}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-brand-600 italic">
                Take a moment to think about or write down your answer before revealing the correct one.
              </p>
              <Button 
                onClick={onShowAnswer}
                className="w-full hover:scale-105 transition-transform"
              >
                Show Answer
              </Button>
            </div>
          )
        ) : questionType === 'fillInBlank' ? (
          <FillInBlankQuestion
            question={question.question}
            answerData={getFillInBlankData()}
            onAnswer={handleInteractiveAnswer}
          />
        ) : (
          <DragAndDropQuestion
            question={question.question}
            answerData={getDragAndDropData()}
            onAnswer={handleInteractiveAnswer}
          />
        )}
      </div>
    </Card>
  );
};