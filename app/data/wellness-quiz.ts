// app/data/wellness-quiz.ts

export interface WellnessQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    doshaType: 'vata' | 'pitta' | 'kapha';
    points: { [key: string]: number };
  }[];
}

export interface Herb {
  id: string;
  name: string;
  scientificName: string;
  oneLiner: string;
  description: string;
  imageSrc: string;
  qrCode: string;
  benefits: string[];
  doshaTypes: ('vata' | 'pitta' | 'kapha')[];
  arLink?: string;
}

export const wellnessQuestions: WellnessQuestion[] = [
  {
    id: 1,
    question: "How are you feeling today?",
    options: [
      {
        id: "A",
        text: "Anxious & Tired",
        doshaType: "vata",
        points: { ashwagandha: 2, brahmi: 1, tulsi: 1 }
      },
      {
        id: "B",
        text: "Stressed & Overwhelmed",
        doshaType: "pitta",
        points: { amla: 2, brahmi: 1, tulsi: 1 }
      },
      {
        id: "C",
        text: "Low Energy & Sluggish",
        doshaType: "kapha",
        points: { tulsi: 2, ginger: 2, ashwagandha: 1 }
      },
      {
        id: "D",
        text: "Scattered & Unfocused",
        doshaType: "vata",
        points: { brahmi: 2, tulsi: 1, ashwagandha: 1 }
      }
    ]
  },
  {
    id: 2,
    question: "What is your main wellness goal?",
    options: [
      {
        id: "A",
        text: "Better Sleep & Less Stress",
        doshaType: "vata",
        points: { ashwagandha: 2, brahmi: 1, amla: 1 }
      },
      {
        id: "B",
        text: "Boost Energy & Focus",
        doshaType: "kapha",
        points: { tulsi: 2, brahmi: 1, ginger: 1 }
      },
      {
        id: "C",
        text: "Improve Digestion & Detox",
        doshaType: "pitta",
        points: { amla: 2, ginger: 1, tulsi: 1 }
      },
      {
        id: "D",
        text: "Enhance Mood & Clarity",
        doshaType: "vata",
        points: { brahmi: 2, ashwagandha: 1, tulsi: 1 }
      }
    ]
  },
  {
    id: 3,
    question: "How is your appetite?",
    options: [
      {
        id: "A",
        text: "Irregular, I sometimes forget to eat",
        doshaType: "vata",
        points: { ashwagandha: 1, ginger: 1, tulsi: 1 }
      },
      {
        id: "B",
        text: "Strong, I get 'hangry' if I'm late",
        doshaType: "pitta",
        points: { amla: 2, brahmi: 1 }
      },
      {
        id: "C",
        text: "Slow, I feel full for a long time",
        doshaType: "kapha",
        points: { ginger: 2, tulsi: 1 }
      }
    ]
  },
  {
    id: 4,
    question: "What describes your energy patterns?",
    options: [
      {
        id: "A",
        text: "Bursts of energy, then crashes",
        doshaType: "vata",
        points: { ashwagandha: 2, brahmi: 1 }
      },
      {
        id: "B",
        text: "Intense energy, but burns out quickly",
        doshaType: "pitta",
        points: { amla: 1, brahmi: 2 }
      },
      {
        id: "C",
        text: "Steady but low energy throughout",
        doshaType: "kapha",
        points: { tulsi: 2, ginger: 1 }
      }
    ]
  },
  {
    id: 5,
    question: "How do you handle stress?",
    options: [
      {
        id: "A",
        text: "I worry and overthink everything",
        doshaType: "vata",
        points: { brahmi: 2, ashwagandha: 1, tulsi: 1 }
      },
      {
        id: "B",
        text: "I get irritated and impatient",
        doshaType: "pitta",
        points: { amla: 2, brahmi: 1 }
      },
      {
        id: "C",
        text: "I withdraw and feel heavy",
        doshaType: "kapha",
        points: { tulsi: 2, ginger: 1 }
      }
    ]
  }
];

export const herbs: { [key: string]: Herb } = {
  ashwagandha: {
    id: "ashwagandha",
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    oneLiner: "The premier herb for stress and vitality",
    description: "Known as 'Indian Ginseng', this powerful adaptogen helps your body manage stress while boosting energy and mental clarity.",
    imageSrc: "/plants/ashwagandha.jpg",
    qrCode: "/qr-code-ashwagandha.jpeg",
    benefits: ["Reduces stress & anxiety", "Boosts energy levels", "Improves sleep quality", "Enhances mental clarity"],
    doshaTypes: ["vata", "kapha"],
    arLink: "https://mywebar.com/p/Project_0_o1i2s8yzqr"
  },
  brahmi: {
    id: "brahmi",
    name: "Turmeric",
    scientificName: "Curcuma longa",
    oneLiner: "The golden anti-inflammatory healer",
    description: "Known as the 'Golden Spice', turmeric is a powerful anti-inflammatory and antioxidant that supports joint health, digestion, and overall wellness.",
    imageSrc: "/plants/turmeric.jpg",
    qrCode: "/qr-code.jpg",
    benefits: ["Powerful anti-inflammatory", "Supports joint health", "Aids digestion", "Boosts immunity"],
    doshaTypes: ["vata", "pitta"],
    arLink: "https://mywebar.com/p/Project_0_o1i2s8yzqr"
  },
  tulsi: {
    id: "tulsi",
    name: "Thyme",
    scientificName: "Thymus vulgaris",
    oneLiner: "The aromatic respiratory and immunity booster",
    description: "A powerful aromatic herb known for its antimicrobial properties, thyme supports respiratory health, boosts immunity, and aids digestion.",
    imageSrc: "/plants/tulsi.jpg",
    qrCode: "/qr-code-thyme.jpg",
    benefits: ["Supports respiratory health", "Boosts immunity", "Antimicrobial properties", "Aids digestion"],
    doshaTypes: ["kapha", "vata"],
    arLink: "https://mywebar.com/p/Project_0_o1i2s8yzqr"
  },
  amla: {
    id: "amla",
    name: "Amla",
    scientificName: "Phyllanthus emblica",
    oneLiner: "The cooling detoxifier and rejuvenator",
    description: "Rich in Vitamin C, this superfruit cools the body, aids digestion, and provides powerful antioxidant protection.",
    imageSrc: "/plants/amla.jpeg",
    qrCode: "/qr-code-amla.jpeg",
    benefits: ["Powerful antioxidant", "Aids digestion", "Cools the body", "Boosts immunity"],
    doshaTypes: ["pitta", "kapha"],
    arLink: "https://mywebar.com/p/Project_0_o1i2s8yzqr"
  },
  ginger: {
    id: "ginger",
    name: "Cardamom",
    scientificName: "Elettaria cardamomum",
    oneLiner: "The aromatic digestive and breath freshener",
    description: "Known as the 'Queen of Spices', cardamom aids digestion, freshens breath, and provides a warming, aromatic boost to overall wellness.",
    imageSrc: "/plants/cardamon.jpg",
    qrCode: "/qr-code-cardamon.jpeg",
    benefits: ["Aids digestion", "Freshens breath", "Reduces inflammation", "Supports respiratory health"],
    doshaTypes: ["kapha", "vata"],
    arLink: "https://mywebar.com/p/Project_0_o1i2s8yzqr"
  }
};

export const doshaDescriptions = {
  vata: {
    name: "Vata",
    description: "Air & Space elements. You tend to be creative, energetic, but may experience anxiety and irregular patterns.",
    characteristics: ["Creative & Quick-thinking", "Variable energy", "Prone to worry", "Irregular routines"]
  },
  pitta: {
    name: "Pitta", 
    description: "Fire & Water elements. You tend to be focused, intense, but may experience stress and irritability.",
    characteristics: ["Goal-oriented & Intense", "Strong appetite", "Prone to irritation", "High achiever"]
  },
  kapha: {
    name: "Kapha",
    description: "Earth & Water elements. You tend to be calm, steady, but may experience low energy and sluggishness.",
    characteristics: ["Calm & Steady", "Strong endurance", "Prone to lethargy", "Loyal & caring"]
  }
};
