
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

export const catechism: LordsDay[] = [
  {
    id: 1,
    title: "Lord's Day 1",
    questions: [
      {
        id: 1,
        question: "What is your only comfort in life and death?",
        answer: "That I am not my own, but belong with body and soul, both in life and in death, to my faithful Saviour Jesus Christ. He has fully paid for all my sins with His precious blood, and has set me free from all the power of the devil. He also preserves me in such a way that without the will of my heavenly Father not a hair can fall from my head; indeed, all things must work together for my salvation. Therefore, by His Holy Spirit He also assures me of eternal life and makes me heartily willing and ready from now on to live for Him.",
      },
      {
        id: 2,
        question: "What do you need to know in order to live and die in the joy of this comfort?",
        answer: "First, how great my sins and misery are; second, how I am delivered from all my sins and misery; third, how I am to be thankful to God for such deliverance.",
      },
    ],
  },
  // More Lord's Days can be added here
];
