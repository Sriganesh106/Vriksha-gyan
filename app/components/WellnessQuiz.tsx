// app/components/WellnessQuiz.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Brain, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { wellnessQuestions, herbs, doshaDescriptions } from '../data/wellness-quiz';
import { PersonalizedResults } from './PersonalizedResults';
import { db, ref, push, set } from '../lib/firebase';
import toast from 'react-hot-toast';

interface QuizAnswer {
  questionId: number;
  selectedOption: string;
}

export const WellnessQuiz: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [userName, setUserName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleStart = () => {
    if (userName.trim()) {
      setIsStarted(true);
    }
  };

  const handleAnswerSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const newAnswer: QuizAnswer = {
      questionId: wellnessQuestions[currentQuestion].id,
      selectedOption,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentQuestion < wellnessQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, calculate results
      calculateResults(updatedAnswers);
    }
  };

  const calculateResults = async (finalAnswers: QuizAnswer[]) => {
    const herbScores: { [key: string]: number } = {};
    const doshaScores = { vata: 0, pitta: 0, kapha: 0 };

    // Calculate herb scores and dosha scores
    finalAnswers.forEach((answer) => {
      const question = wellnessQuestions.find(q => q.id === answer.questionId);
      const option = question?.options.find(opt => opt.id === answer.selectedOption);
      
      if (option) {
        // Add to dosha scores
        doshaScores[option.doshaType]++;
        
        // Add to herb scores
        Object.entries(option.points).forEach(([herb, points]) => {
          herbScores[herb] = (herbScores[herb] || 0) + points;
        });
      }
    });

    // Determine primary dosha
    const primaryDosha = Object.entries(doshaScores).reduce((a, b) => 
      doshaScores[a[0] as keyof typeof doshaScores] > doshaScores[b[0] as keyof typeof doshaScores] ? a : b
    )[0] as keyof typeof doshaScores;

    // Get top 3 herbs
    const topHerbs = Object.entries(herbScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([herbId]) => herbs[herbId]);

    const resultsData = {
      userName,
      primaryDosha,
      topHerbs: topHerbs, // Save full herb objects with all properties
      doshaScores,
      herbScores,
      timestamp: Date.now(),
      completedAt: new Date().toISOString()
    };

    // Store results in localStorage
    localStorage.setItem('wellnessResults', JSON.stringify(resultsData));

    // Save to Firebase Realtime Database
    try {
      const wellnessResultsRef = ref(db, 'wellness-results');
      const newResultRef = push(wellnessResultsRef);
      
      await set(newResultRef, resultsData);
      
      console.log('✅ Wellness quiz results saved to Firebase');
      toast.success('🌿 Your wellness profile saved successfully!');
    } catch (error) {
      console.error('❌ Error saving wellness results to Firebase:', error);
      toast.error('Could not save to cloud, but results are saved locally');
    }

    setShowResults(true);
  };

  if (showResults) {
    return <PersonalizedResults />;
  }

  if (!isStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Card className="p-8 bg-cyber-gray border-2 border-cyber-green/30">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-cyber-green/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-cyber-green" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Discover Your <span className="text-cyber-green">Personalized Wellness Path</span>
          </h2>
          
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Take our ancient wisdom-powered quiz to discover which sacred herbs align with your unique constitution and wellness needs.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 text-left">
              <Brain className="w-6 h-6 text-cyber-green flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Mind Analysis</h4>
                <p className="text-sm text-gray-400">Assess your mental patterns</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <Heart className="w-6 h-6 text-cyber-green flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Body Wisdom</h4>
                <p className="text-sm text-gray-400">Understand your constitution</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <Sparkles className="w-6 h-6 text-cyber-green flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Personalized Kit</h4>
                <p className="text-sm text-gray-400">Get your custom herbs</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter your name to begin..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white placeholder-gray-400 focus:border-cyber-green focus:outline-none transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <Button 
            onClick={handleStart}
            disabled={!userName.trim()}
            className="w-full py-4 text-lg bg-cyber-green text-cyber-dark hover:bg-cyber-green/90"
          >
            Begin Your Wellness Journey
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            ✨ Takes 2 minutes • Based on 5000+ years of Ayurvedic wisdom
          </p>
        </Card>
      </motion.div>
    );
  }

  const currentQ = wellnessQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / wellnessQuestions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {wellnessQuestions.length}
          </span>
          <span className="text-sm text-cyber-green font-semibold">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-cyber-border rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-cyber-green to-green-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <Card className="p-8 bg-cyber-gray border-2 border-cyber-green/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {currentQ.question}
            </h3>

            <div className="space-y-4 mb-8">
              {currentQ.options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                    selectedOption === option.id
                      ? 'border-cyber-green bg-cyber-green/10 text-white'
                      : 'border-cyber-border bg-cyber-dark text-gray-300 hover:border-cyber-green/50 hover:bg-cyber-gray'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                      selectedOption === option.id
                        ? 'border-cyber-green bg-cyber-green text-cyber-dark'
                        : 'border-gray-500 text-gray-500'
                    }`}>
                      {option.id}
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Select an option to continue
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedOption}
                className="px-8 bg-cyber-green text-cyber-dark hover:bg-cyber-green/90"
              >
                {currentQuestion === wellnessQuestions.length - 1 ? 'Get My Results' : 'Next Question'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
