export type QuestionType = 'standard' | 'fillInBlank' | 'dragAndDrop';

export interface FillInBlankAnswer {
  beforeBlank: string;
  blank: string;
  afterBlank: string;
}

export interface DragAndDropAnswer {
  segments: string[];      // The portions to be dragged
  correctOrder: number[];  // The correct order of the segments
  visibleParts?: string[]; // Made optional with ?
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  type?: QuestionType;
  fillInBlankData?: FillInBlankAnswer;
  dragAndDropData?: DragAndDropAnswer;
}