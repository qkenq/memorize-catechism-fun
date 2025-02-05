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
  dragAndDropData?: import('./questionTypes').DragAndDropAnswer;
}

export interface LordsDay {
  id: number;
  title: string;
  questions: Question[];
}