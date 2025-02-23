import { LordsDay } from '../types';

export const lordsDay1: LordsDay = {
  id: 1,
  title: "Lord's Day 1",
  questions: [
    {
      id: 1,
      question: "What is your only comfort in life and death?",
      answer: "That I am not my own, but belong with body and soul, both in life and in death, to my faithful Savior Jesus Christ. He has fully paid for all my sins with his precious blood and has set me free from all the power of the devil. He also preserves me in such a way that without the will of my heavenly Father not a hair can fall from my head; indeed, all things must work together for my salvation. Therefore, by his Holy Spirit he also assures me of eternal life and makes me heartily willing and ready from now on to live for him.",
      type: "dragAndDrop",
      dragAndDropData: {
        visibleParts: [
          "That I am not my own, but belong with body and soul, both in life and in death, to my faithful",
          "He has fully paid for all my sins with his precious blood and has set me",
          "He also preserves me in such a way that without the will of my heavenly Father not a hair can fall from my head; indeed, all things must",
          "Therefore, by his Holy Spirit he also assures me of eternal life and makes me heartily willing and ready from"
        ],
        segments: [
          "Savior Jesus Christ.",
          "free from all the power of the devil.",
          "work together for my salvation.",
          "now on to live for him."
        ],
        correctOrder: [0, 1, 2, 3]
      }
    },
    {
      id: 2,
      question: "What do you need to know in order to live and die in the joy of this comfort?",
      answer: "First, how great my sins and misery are; Second, how I am delivered from all my sins and misery; Third, how I am to be thankful to God for such deliverance.",
      type: "dragAndDrop",
      dragAndDropData: {
        visibleParts: [
          "First, how great my sins and",
          "Second, how I am delivered from all my sins",
          "Third, how I am to be thankful to God"
        ],
        segments: [
          "misery are;",
          "and misery;",
          "for such deliverance."
        ],
        correctOrder: [0, 1, 2]
      }
    }
  ]
};