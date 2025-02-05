
export interface Question {
  id: number;
  question: string;
  answer: string;
}

export interface LordsDay {
  id: number;
  title: string;
  questions: Question[];
}
