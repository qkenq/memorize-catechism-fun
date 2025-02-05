export type QuestionType = 'standard' | 'fillInBlank' | 'dragAndDrop';

export interface FillInBlankAnswer {
  beforeBlank: string;
  blank: string;
  afterBlank: string;
}

export interface DragAndDropAnswer {
  segments: string[];
  correctOrder: number[];
}

export interface EnhancedQuestion {
  id: number;
  question: string;
  answer: string;
  type: QuestionType;
  fillInBlankData?: FillInBlankAnswer;
  dragAndDropData?: DragAndDropAnswer;
}