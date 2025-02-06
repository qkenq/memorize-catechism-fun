export interface DragAndDropAnswer {
  visibleParts: string[];
  segments: string[];
  correctOrder: number[];
}

export interface FillInBlankAnswer {
  beforeBlank: string;
  blank: string;
  afterBlank: string;
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  type?: 'standard' | 'fillInBlank' | 'dragAndDrop';
  dragAndDropData?: DragAndDropAnswer;
  round2Data?: DragAndDropAnswer;
  round3Data?: DragAndDropAnswer;
  fillInBlankData?: FillInBlankAnswer;
}