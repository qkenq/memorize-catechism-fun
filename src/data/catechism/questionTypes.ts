export type QuestionType = 'standard' | 'fillInBlank' | 'dragAndDrop';

export interface FillInBlankAnswer {
  beforeBlank: string;
  blank: string;
  afterBlank: string;
}

export interface DragAndDropAnswer {
  visibleParts: string[];  // The 2/3 visible portions of each sentence
  segments: string[];      // The 1/3 gap portions to be dragged
  correctOrder: number[];
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  type?: QuestionType;
  fillInBlankData?: FillInBlankAnswer;
  dragAndDropData?: DragAndDropAnswer;
}