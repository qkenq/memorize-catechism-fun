import { LordsDay } from './types';

const splitIntoThirds = (text: string): [string, string] => {
  const words = text.split(' ');
  const twoThirdsIndex = Math.floor(words.length * (2/3));
  return [
    words.slice(0, twoThirdsIndex).join(' '),
    words.slice(twoThirdsIndex).join(' ')
  ];
};

export const lordsDays1To10: LordsDay[] = [
  {
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
            "That I am not my own, but belong with body and soul, both in life and",
            "He has fully paid for all my sins with his precious",
            "He also preserves me in such a way that without the will of my heavenly Father not a hair can fall from my head;",
            "Therefore, by his Holy Spirit he also assures me of eternal life"
          ],
          segments: [
            "death, to my faithful Savior Jesus Christ.",
            "blood and has set me free from all the power of the devil.",
            "indeed, all things must work together for my salvation.",
            "and makes me heartily willing and ready from now on to live for him."
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
            "First, how great my",
            "Second, how I am delivered",
            "Third, how I am to be"
          ],
          segments: [
            "sins and misery are;",
            "from all my sins and misery;",
            "thankful to God for such deliverance."
          ],
          correctOrder: [0, 1, 2]
        }
      },
    ],
  },
  {
    id: 2,
    title: "Lord's Day 2",
    questions: [
      {
        id: 3,
        question: "From where do you know your sins and misery?",
        answer: "From the law of God.",
        type: "dragAndDrop",
        dragAndDropData: {
          segments: ["From the law of God."],
          correctOrder: [0]
        }
      },
      {
        id: 4,
        question: "What does God's law require of us?",
        answer: "Christ teaches us this in a summary in Matthew 22: Love the Lord your God with all your heart and with all your soul and with all your mind. This is the first and greatest commandment. And the second is like it: Love your neighbor as yourself. All the Law and the Prophets hang on these two commandments.",
        type: "dragAndDrop",
        dragAndDropData: {
          segments: [
            "Christ teaches us this in a summary in Matthew 22: Love the Lord your God with all your heart and with all your soul and with all your mind.",
            "This is the first and greatest commandment.",
            "And the second is like it: Love your neighbor as yourself.",
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
          segments: ["No, I am inclined by nature to hate God and my neighbor."],
          correctOrder: [0]
        }
      },
    ],
  },
  {
    id: 3,
    title: "Lord's Day 3",
    questions: [
      {
        id: 6,
        question: "Did God, then, create man so wicked and perverse?",
        answer: "No, on the contrary, God created man good and in his image, that is, in true righteousness and holiness, so that he might rightly know God his Creator, heartily love him, and live with him in eternal blessedness to praise and glorify him.",
      },
      {
        id: 7,
        question: "From where, then, did man's depraved nature come?",
        answer: "From the fall and disobedience of our first parents, Adam and Eve, in Paradise, for there our nature became so corrupt that we are all conceived and born in sin.",
      },
      {
        id: 8,
        question: "But are we so corrupt that we are totally unable to do any good and inclined to all evil?",
        answer: "Yes, unless we are regenerated by the Spirit of God.",
      },
    ],
  },
  {
    id: 4,
    title: "Lord's Day 4",
    questions: [
      {
        id: 9,
        question: "But does not God do man an injustice by requiring in his law what man cannot do?",
        answer: "No, for God so created man that he was able to do it. But man, at the instigation of the devil, in deliberate disobedience, robbed himself and all his descendants of these gifts.",
      },
      {
        id: 10,
        question: "Will God allow such disobedience and apostasy to go unpunished?",
        answer: "Certainly not. He is terribly displeased with our original sin as well as our actual sins. Therefore, he will punish them by a just judgment both now and eternally, as he has declared: \"Cursed is everyone who does not continue to do everything written in the Book of the Law.\"",
      },
      {
        id: 11,
        question: "But is God not also merciful?",
        answer: "God is indeed merciful, but he is also just. His justice requires that sin committed against the most high majesty of God also be punished with the most severe, that is, with everlasting, punishment of body and soul.",
      },
    ],
  },
  {
    id: 5,
    title: "Lord's Day 5",
    questions: [
      {
        id: 12,
        question: "Since, according to God's righteous judgment, we deserve temporal and eternal punishment, how can we escape this punishment and be again received into favor?",
        answer: "God demands that his justice be satisfied. Therefore, we must make full payment, either by ourselves or through another.",
      },
      {
        id: 13,
        question: "Can we by ourselves make this payment?",
        answer: "Certainly not. On the contrary, we daily increase our debt.",
      },
      {
        id: 14,
        question: "Can any mere creature pay for us?",
        answer: "No. In the first place, God will not punish another creature for the sin which man has committed. Furthermore, no mere creature can sustain the burden of God's eternal wrath against sin and deliver others from it.",
      },
      {
        id: 15,
        question: "What kind of mediator and deliverer must we seek?",
        answer: "One who is a true and righteous man, and yet more powerful than all creatures; that is, one who is at the same time true God.",
      },
    ],
  },
  {
    id: 6,
    title: "Lord's Day 6",
    questions: [
      {
        id: 16,
        question: "Why must he be a true and righteous man?",
        answer: "He must be a true man because the justice of God requires that the same human nature which has sinned should pay for sin. He must be a righteous man because one who himself is a sinner cannot pay for others.",
      },
      {
        id: 17,
        question: "Why must he at the same time be true God?",
        answer: "He must be true God so that by the power of his divine nature he might bear in his human nature the burden of God's wrath and might obtain for us and restore to us righteousness and life.",
      },
      {
        id: 18,
        question: "But who is that Mediator who at the same time is true God and a true and righteous man?",
        answer: "Our Lord Jesus Christ, who has become for us wisdom from God – that is, our righteousness, holiness, and redemption.",
      },
      {
        id: 19,
        question: "From where do you know this?",
        answer: "From the holy gospel, which God himself first revealed in Paradise. Later, he had it proclaimed by the patriarchs and prophets, and foreshadowed by the sacrifices and other ceremonies of the law. Finally, he had it fulfilled through his only Son.",
      },
    ],
  },
  {
    id: 7,
    title: "Lord's Day 7",
    questions: [
      {
        id: 20,
        question: "Are all men, then, saved by Christ just as they perished through Adam?",
        answer: "No. Only those are saved who by a true faith are grafted into Christ and accept all his benefits.",
      },
      {
        id: 21,
        question: "What is true faith?",
        answer: "True faith is a sure knowledge whereby I accept as true all that God has revealed to us in his Word. At the same time, it is a firm confidence that not only to others, but also to me, God has granted forgiveness of sins, everlasting righteousness, and salvation, out of mere grace, only for the sake of Christ's merits.",
      },
      {
        id: 22,
        question: "What, then, must a Christian believe?",
        answer: "All that is promised us in the gospel, which the articles of our catholic and undoubted Christian faith teach us in a summary.",
      },
      {
        id: 23,
        question: "What are these articles?",
        answer: "I believe in God the Father almighty, Creator of heaven and earth… (Apostles' Creed follows).",
      },
    ],
  },
  {
    id: 8,
    title: "Lord's Day 8",
    questions: [
      {
        id: 24,
        question: "How are these articles divided?",
        answer: "Into three parts: The first is about God the Father and our creation; The second about God the Son and our redemption; The third about God the Holy Spirit and our sanctification.",
      },
      {
        id: 25,
        question: "Since there is only one God, why do you speak of three persons: Father, Son, and Holy Spirit?",
        answer: "Because God has so revealed himself in his Word that these three distinct persons are the one, true, eternal God.",
      },
    ],
  },
  {
    id: 9,
    title: "Lord's Day 9",
    questions: [
      {
        id: 26,
        question: "What do you believe when you say: I believe in God the Father almighty, Creator of heaven and earth?",
        answer: "That the eternal Father of our Lord Jesus Christ, who out of nothing created heaven and earth and all that is in them, and who still upholds and governs them by his eternal counsel and providence, is, for the sake of Christ his Son, my God and my Father. In him I trust so completely as to have no doubt that he will provide me with all things necessary for body and soul, and will also turn to my good whatever adversity he sends me in this life of sorrow. He is able to do so as almighty God, and willing also as a faithful Father.",
      },
    ],
  },
  {
    id: 10,
    title: "Lord's Day 10",
    questions: [
      {
        id: 27,
        question: "What do you understand by the providence of God?",
        answer: "God's providence is his almighty and ever-present power, whereby, as with his hand, he still upholds heaven and earth and all creatures, and so governs them that leaf and blade, rain and drought, fruitful and barren years, food and drink, health and sickness, riches and poverty, indeed, all things, come to us not by chance but by his fatherly hand.",
      },
      {
        id: 28,
        question: "What does it benefit us to know that God has created all things and still upholds them by his providence?",
        answer: "We can be patient in adversity, thankful in prosperity, and with a view to the future we can have a firm confidence in our faithful God and Father that no creature shall separate us from his love; for all creatures are so completely in his hand that without his will they cannot so much as move.",
      },
    ],
  },
];