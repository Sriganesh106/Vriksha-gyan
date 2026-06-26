# 🌿 Vriksha Gyan - AYUSH Digital Platform

**Bridging Traditional Ayurvedic Wisdom with Modern Technology**

A comprehensive Next.js platform that connects users with personalized Ayurvedic wellness recommendations, certified AYUSH practitioners, and immersive AR plant experiences.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## ✨ Key Features

### 1. **Personalized Wellness Quiz**
- AI-powered dosha analysis (Vata, Pitta, Kapha)
- Customized herbal recommendations
- Results saved to Firebase Realtime Database
- Shareable wellness profiles

### 2. **AYUSH Doctor Directory**
- Verified AYUSH practitioners database
- Search by city (Bangalore, Hubli, etc.)
- Real contact information and credentials
- Transparent, no fake ratings

### 3. **AI Ayurvedic Chatbot**
- Powered by Google Gemini AI
- Expert knowledge on medicinal plants
- Traditional preparation methods
- Dosage and safety information

### 4. **AR Plant Experience**
- QR codes for 5 medicinal plants
- Immersive 3D AR visualization
- Plant benefits and usage guide
- WebAR integration

### 5. **AI Wellness Retreat Planner**
- Personalized 3-day retreat itineraries
- Dosha-specific recommendations
- Real locations in India
- Seasonal considerations

### 6. **Interactive Quiz Game**
- Educational plant knowledge quiz
- Real-time leaderboard
- Score tracking with Firebase
- Shareable achievement cards

---

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Firebase Realtime Database
- **AI:** Google Gemini 2.5 Flash
- **Icons:** Lucide React
- **AR:** WebAR (MyWebAR)

---

## 📁 Project Structure

```
vriksha-gyan/
├── app/
│   ├── components/
│   │   ├── WellnessQuiz.tsx          # Dosha analysis quiz
│   │   ├── PersonalizedResults.tsx   # Wellness recommendations
│   │   ├── DoctorsPage.tsx           # AYUSH doctor directory
│   │   ├── FinalChatbot.tsx          # AI Ayurvedic expert
│   │   ├── RetreatPlannerPage.tsx    # AI retreat planner
│   │   ├── PlantQRGallery.tsx        # AR plant QR codes
│   │   └── QuizGame.tsx              # Educational quiz
│   ├── lib/
│   │   ├── firebase.ts               # Firebase configuration
│   │   ├── geminiAI.ts               # Gemini AI integration
│   │   └── firebaseAuth.ts           # User authentication
│   ├── data/
│   │   ├── wellness-quiz.ts          # Wellness quiz data
│   │   └── ayush-doctors.json        # Doctor database
│   └── globals.css                   # Global styles
├── public/
│   ├── plants/                       # Plant images
│   ├── qr-code-*.jpeg                # AR QR codes
│   └── data/ayush-doctors.json       # Doctor data
└── README.md
```

---

## 🔑 Environment Setup

The app uses the following APIs (keys are configured):

- **Firebase:** Realtime Database for storing quiz results
- **Google Gemini AI:** For chatbot and retreat planner
- **Foursquare Places:** For location data (optional)

---

## 🌟 Unique Features

### **Transparency & Trust**
- No fake ratings or misleading information
- Clear disclaimer to consult certified AYUSH doctors
- Bridges users with real practitioners

### **Cultural Authenticity**
- Traditional Ayurvedic terminology
- Sanskrit plant names
- Dosha-based recommendations
- Seasonal wellness guidance

### **Modern UX**
- Clean, professional Inter font
- Responsive design
- Smooth animations
- Accessible interface

---

## 📊 Data Sources

- **AYUSH Doctors:** Ministry of AYUSH verified practitioners
- **Plant Data:** Traditional Ayurvedic texts and modern research
- **Dosha Analysis:** Classical Ayurvedic principles

---

## 🎯 Target Users

- Individuals seeking natural wellness solutions
- People interested in Ayurveda
- Users looking for certified AYUSH practitioners
- Wellness enthusiasts

---

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📝 License

This project is built for educational and wellness purposes.

---

## 👥 Contact

For questions or feedback about Vriksha Gyan, please reach out through the platform.

---

**Built with 🌿 for promoting traditional Ayurvedic wisdom in the digital age.**
