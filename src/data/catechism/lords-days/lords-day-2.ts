import { LordsDay } from '../types';

export const lordsDay2: LordsDay = {
  id: 2,
  title: "Lord's Day 2",
  questions: [
    {
      id: 3,
      question: "From where do you know your sins and misery?",
      answer: "From the law of God.",
      type: "dragAndDrop",
      dragAndDropData: {
        visibleParts: ["From the law"],
        segments: ["of God."],
        correctOrder: [0]
      }
    },
    {
      id: 4,
      question: "What does God's law require of us?",
      answer: "Christ teaches us this in a summary in Matthew 22: Love the Lord your God with all your heart and with all your soul and with all your mind. This is the first and greatest commandment. And the second is like it: Love your neighbor as yourself. All the Law and the Prophets hang on these two commandments.",
      type: "dragAndDrop",
      dragAndDropData: {
        visibleParts: [
          "Christ teaches us this in a summary in Matthew 22:",
          "This is the first and",
          "And the second is"
        ],
        segments: [
          "Love the Lord your God with all your heart and with all your soul and with all your mind.",
          "greatest commandment.",
          "like it: Love your neighbor as yourself.",
          "All the Law and the Prophets hang on these two commandments."
        ],
        correctOrder: [0, 1, 2, 3]
      }
    },
    {
      id: 5,
      question: "Can you keep all this perfectly?",
      answer: "No, I am inclined by nature to hate God and my neighbor.",
      type: "dragAndDrop",
      dragAndDropData: {
        visibleParts: ["No, I am inclined by nature to"],
        segments: ["hate God and my neighbor."],
        correctOrder: [0]
      }
    }
  ]
};