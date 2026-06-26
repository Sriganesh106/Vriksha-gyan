export interface QuizOption {
  id: string;
  imageSrc: string;
  name: string;
}

export interface QuizQuestion {
  question: string;
  correctAnswer: string;
  options: QuizOption[];
}

export const questions: QuizQuestion[] = [
  {
    question: "Which sacred plant is known as the 'Queen of Herbs' and is revered in Ayurveda for its adaptogenic properties?",
    correctAnswer: "Tulsi",
    options: [
      { id: "A", imageSrc: "/plants/tulsi.jpg", name: "Tulsi (Holy Basil)" },
      { id: "B", imageSrc: "/plants/neem.jpg", name: "Neem" },
      { id: "C", imageSrc: "/plants/turmeric.jpg", name: "Turmeric" },
      { id: "D", imageSrc: "/plants/aloe-vera.jpg", name: "Aloe Vera" },
    ],
  },
  {
    question: "This powerful adaptogen is called 'Indian Ginseng' and is famous for reducing stress and boosting vitality. Identify it:",
    correctAnswer: "Ashwagandha",
    options: [
      { id: "A", imageSrc: "/plants/ashwagandha.jpg", name: "Ashwagandha" },
      { id: "B", imageSrc: "/plants/tulsi.jpg", name: "Tulsi" },
      { id: "C", imageSrc: "/plants/neem.jpg", name: "Neem" },
      { id: "D", imageSrc: "/plants/turmeric.jpg", name: "Turmeric" },
    ],
  },
  {
    question: "Known as 'Nature's Pharmacy', this tree's leaves, bark, and seeds have potent antibacterial and antifungal properties:",
    correctAnswer: "Neem",
    options: [
      { id: "A", imageSrc: "/plants/turmeric.jpg", name: "Turmeric" },
      { id: "B", imageSrc: "/plants/neem.jpg", name: "Neem" },
      { id: "C", imageSrc: "/plants/aloe-vera.jpg", name: "Aloe Vera" },
      { id: "D", imageSrc: "/plants/tulsi.jpg", name: "Tulsi" },
    ],
  },
  {
    question: "This golden-yellow spice contains curcumin, a powerful anti-inflammatory compound used for thousands of years:",
    correctAnswer: "Turmeric",
    options: [
      { id: "A", imageSrc: "/plants/ashwagandha.jpg", name: "Ashwagandha" },
      { id: "B", imageSrc: "/plants/neem.jpg", name: "Neem" },
      { id: "C", imageSrc: "/plants/turmeric.jpg", name: "Turmeric (Haldi)" },
      { id: "D", imageSrc: "/plants/tulsi.jpg", name: "Tulsi" },
    ],
  },
  {
    question: "This succulent plant is called the 'Plant of Immortality' and is renowned for its healing and soothing properties on skin:",
    correctAnswer: "Aloe Vera",
    options: [
      { id: "A", imageSrc: "/plants/tulsi.jpg", name: "Tulsi" },
      { id: "B", imageSrc: "/plants/aloe-vera.jpg", name: "Aloe Vera" },
      { id: "C", imageSrc: "/plants/ashwagandha.jpg", name: "Ashwagandha" },
      { id: "D", imageSrc: "/plants/turmeric.jpg", name: "Turmeric" },
    ],
  },
  {
    question: "Which herb is known as 'Brahmi' and is considered the ultimate brain tonic in Ayurveda?",
    correctAnswer: "Brahmi",
    options: [
      { id: "A", imageSrc: "/plants/brahmi.jpg", name: "Brahmi (Bacopa)" },
      { id: "B", imageSrc: "/plants/ashwagandha.jpg", name: "Ashwagandha" },
      { id: "C", imageSrc: "/plants/tulsi.jpg", name: "Tulsi" },
      { id: "D", imageSrc: "/plants/neem.jpg", name: "Neem" },
    ],
  },
  {
    question: "This Himalayan herb is prized for promoting deep sleep and calming the nervous system:",
    correctAnswer: "Jatamansi",
    options: [
      { id: "A", imageSrc: "/plants/jatamansi.jpg", name: "Jatamansi" },
      { id: "B", imageSrc: "/plants/brahmi.jpg", name: "Brahmi" },
      { id: "C", imageSrc: "/plants/ashwagandha.jpg", name: "Ashwagandha" },
      { id: "D", imageSrc: "/plants/tulsi.jpg", name: "Tulsi" },
    ],
  },
  {
    question: "Which warming spice is excellent for digestion and is called 'Vishwabhesaj' (universal medicine)?",
    correctAnswer: "Ginger",
    options: [
      { id: "A", imageSrc: "/plants/turmeric.jpg", name: "Turmeric" },
      { id: "B", imageSrc: "/plants/ginger.jpg", name: "Ginger (Adrak)" },
      { id: "C", imageSrc: "/plants/amla.jpg", name: "Amla" },
      { id: "D", imageSrc: "/plants/neem.jpg", name: "Neem" },
    ],
  },
];