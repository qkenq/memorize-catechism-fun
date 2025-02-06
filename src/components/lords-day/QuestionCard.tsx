import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Question } from "@/data/catechism/types";
import { QuestionSection } from "./QuestionSection";
import { AnswerSection } from "./AnswerSection";
import { FillInBlankQuestion } from "./FillInBlankQuestion";
import { DragAndDropQuestion } from "./DragAndDropQuestion";
import { useState } from "react";
import type { FillInBlankAnswer, DragAndDropAnswer } from "@/data/catechism/questionTypes";

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
  const [completedFillInBlank, setCompletedFillInBlank] = useState(false);
  const [interactiveScore, setInteractiveScore] = useState<boolean | null>(null);

  const shouldBeInteractive = userLevel === 1;
  
  const questionType = question.type || (shouldBeInteractive 
    ? (!completedFillInBlank ? 'fillInBlank' : 'dragAndDrop')
    : 'standard');

  const handleInteractiveAnswer = (isCorrect: boolean) => {
    setInteractiveScore(isCorrect);
    if (isCorrect && questionType === 'fillInBlank') {
      setCompletedFillInBlank(true);
    }
    onSelfScore(isCorrect);
  };

  const prepareAnswerSegments = () => {
    if (question.dragAndDropData) {
      return question.dragAndDropData;
    }

    if (question.fillInBlankData) {
      return question.fillInBlankData;
    }

    const words = question.answer.split(' ');
    const twoThirdsIndex = Math.floor(words.length * (2/3));
    
    if (questionType === 'fillInBlank') {
      const fillInBlankAnswer: FillInBlankAnswer = {
        beforeBlank: words.slice(0, twoThirdsIndex).join(' '),
        blank: words.slice(twoThirdsIndex, twoThirdsIndex + Math.ceil(words.length/3)).join(' '),
        afterBlank: words.slice(twoThirdsIndex + Math.ceil(words.length/3)).join(' ')
      };
      return fillInBlankAnswer;
    } else if (questionType === 'dragAndDrop') {
      const sentences = question.answer.split(/(?<=[.]) /).filter(s => s.trim());
      const dragAndDropAnswer: DragAndDropAnswer = {
        visibleParts: sentences.slice(0, Math.ceil(sentences.length * (2/3))).map(s => s.trim()),
        segments: sentences.slice(Math.ceil(sentences.length * (2/3))).map(s => s.trim()),
        correctOrder: Array.from({ length: sentences.length - Math.ceil(sentences.length * (2/3)) }, (_, i) => i)
      };
      return dragAndDropAnswer;
    }
    return null;
  };

  return (
    <Card className="p-6 mb-8 animate-fade-in w-full max-w-none">
      <div className="space-y-6">
        {questionType === 'standard' ? (
          <>
            <QuestionSection question={question} />
            {showAnswer ? (
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
            )}
          </>
        ) : questionType === 'fillInBlank' ? (
          <FillInBlankQuestion
            question={question.question}
            answerData={prepareAnswerSegments() as FillInBlankAnswer}
            onAnswer={handleInteractiveAnswer}
          />
        ) : (
          <DragAndDropQuestion
            answerData={prepareAnswerSegments() as DragAndDropAnswer}
            onAnswer={handleInteractiveAnswer}
          />
        )}

        {shouldBeInteractive && completedFillInBlank && questionType === 'dragAndDrop' && (
          <div className="mt-4 p-4 bg-brand-50 rounded-lg">
            <p className="text-brand-700">
              Great job with the fill-in-the-blank! Now try to arrange the remaining parts in the correct order.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};