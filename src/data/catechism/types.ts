export interface Question {
  id: number;
  question: string;
  answer: string;
  type?: 'standard' | 'fillInBlank' | 'dragAndDrop';
  fillInBlankData?: {
    beforeBlank: string;
    blank: string;
    afterBlank: string;
  };
  dragAndDropData?: {
    segments: string[];
    correctOrder: number[];
  };
}

export interface LordsDay {
  id: number;
  title: string;
  questions: Question[];
}