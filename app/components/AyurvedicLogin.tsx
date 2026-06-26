'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Leaf, Sun, Cloud, ChevronRight, X, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getCurrentSeason } from '../data/seasonalCalendar';
import { firebaseAuthService } from '../lib/firebaseAuth';

interface AyurvedicLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: any) => void;
}

export default function AyurvedicLogin({ isOpen, onClose, onLogin }: AyurvedicLoginProps) {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<any>(null);

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
  }, []);

  const constitutionData: any = {
    vata: {
      name: "Vata",
      element: "🌬️",
      characteristics: "Air & Space - Creative, Quick, Adaptable",
      strengths: ["Creative thinking", "Quick learner", "Adaptable"],
      challenges: ["Anxiety", "Irregular digestion", "Cold sensitivity"],
      idealHerbs: ["Ashwagandha", "Brahmi", "Jatamansi"],
      seasonalTips: "Extra care needed during autumn and winter",
      colors: ["#6366f1", "#8b5cf6"], // Purple/Indigo
      welcomeMessage: "Welcome, creative soul! Your adaptable nature thrives with consistent routines and warming herbs."
    },
    pitta: {
      name: "Pitta", 
      element: "🔥",
      characteristics: "Fire & Water - Focused, Leader, Determined",
      strengths: ["Natural leadership", "Sharp intellect", "Goal-oriented"],
      challenges: ["Anger", "Acidity", "Heat sensitivity"],
      idealHerbs: ["Amla", "Aloe Vera", "Mint"],
      seasonalTips: "Extra care needed during summer months",
      colors: ["#f59e0b", "#ef4444"], // Orange/Red
      welcomeMessage: "Welcome, natural leader! Your fiery energy benefits from cooling herbs and moderate practices."
    },
    kapha: {
      name: "Kapha",
      element: "🌊", 
      characteristics: "Earth & Water - Calm, Steady, Nurturing",
      strengths: ["Emotional stability", "Physical strength", "Compassionate"],
      challenges: ["Sluggishness", "Weight gain", "Congestion"],
      idealHerbs: ["Ginger", "Turmeric", "Trikatu"],
      seasonalTips: "Extra care needed during spring season",
      colors: ["#10b981", "#059669"], // Green
      welcomeMessage: "Welcome, steady soul! Your grounded nature benefits from energizing herbs and active practices."
    }
  };

  const handleAnswer = (answer: any) => {
    const newResponses = { ...responses, [currentQuestion]: answer };
    setResponses(newResponses);

    if (currentQuestion < constitutionQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate constitution
      const scores: any = { vata: 0, pitta: 0, kapha: 0 };
      Object.values(newResponses).forEach((response: any) => {
        scores[response.id]++;
      });

      const dominantDosha = Object.keys(scores).reduce((a, b) => 
        scores[a] > scores[b] ? a : b
      );

      setConstitution(dominantDosha);
      setStep('details');
    }
  };

  const completeLogin = async () => {
    try {
      setStep('saving'); // Add loading state
      
      const profileData = {
        constitution: constitution as 'vata' | 'pitta' | 'kapha',
        constitutionData: constitutionData[constitution!],
        name: userProfile.name,
        region: userProfile.region,
        currentSeason: currentSeason,
        personalizedRecommendations: getPersonalizedRecommendations()
      };

      // Create Firebase user and save profile
      const firebaseProfile = await firebaseAuthService.createAyurvedicUser(profileData);
      
      // Also save to localStorage for backward compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem('ayurvedicProfile', JSON.stringify(firebaseProfile));
      }
      
      // Call parent login handler with Firebase profile
      onLogin(firebaseProfile);
      
      alert(`🌿 Welcome ${firebaseProfile.name}! Your ${constitutionData[constitution!].name} constitution profile is saved to the cloud! 🌿`);
      onClose();
      
    } catch (error) {
      console.error('Error creating user profile:', error);
      alert('❌ Error saving profile. Please try again.');
      setStep('details'); // Go back to details step
    }
  };

  const getPersonalizedRecommendations = () => {
    const constData = constitutionData[constitution!];
    return {
      dailyHerbs: constData.idealHerbs,
      seasonalFocus: getSeasonalRecommendations(constitution!, currentSeason),
      lifestyleTips: getLifestyleTips(constitution!)
    };
  };

  const getSeasonalRecommendations = (dosha: string, season: any) => {
    if (!season) return [];
    
    const seasonalMap: any = {
      vata: {
        varsha: "Focus on ginger and warm spices during monsoon",
        shishir: "Ashwagandha with warm milk in winter",
        vasant: "Gentle detox with tulsi in spring"
      },
      pitta: {
        grishma: "Cooling herbs like mint and aloe in summer", 
        varsha: "Balance heat with coriander water",
        sharad: "Amla for autumn cooling"
      },
      kapha: {
        vasant: "Energizing ginger and turmeric in spring",
        varsha: "Digestive spices during monsoon",
        grishma: "Light, warming herbs even in summer"
      }
    };

    return seasonalMap[dosha]?.[season.key] || `Personalized ${dosha} recommendations for ${season.name}`;
  };

  const getLifestyleTips = (dosha: string) => {
    const tips: any = {
      vata: ["Maintain regular routines", "Stay warm", "Practice grounding exercises"],
      pitta: ["Avoid excessive heat", "Practice moderation", "Cool, calming activities"],
      kapha: ["Stay active", "Avoid heavy foods", "Energizing practices"]
    };
    return tips[dosha] || [];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-cyber-gray border border-cyber-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-cyber-border">
            <div>
              <h2 className="text-2xl font-bold text-cyber-green">
                🌿 Ayurvedic Identity Portal
              </h2>
              <p className="text-gray-400 text-sm">
                Discover your constitution for personalized wellness
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="p-6">
            {/* Welcome Step */}
            {step === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyber-green to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Welcome to Your Personalized Herbarium
                  </h3>
                  <p className="text-gray-300">
                    In Ayurveda, each person has a unique constitution (Prakriti). Let's discover yours 
                    to provide personalized seasonal recommendations and wellness guidance.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 my-8">
                  {Object.entries(constitutionData).map(([key, data]: [string, any]) => (
                    <div key={key} className="constitution-preview p-4 bg-cyber-dark border border-cyber-border rounded-lg text-center">
                      <div className="text-3xl mb-2">{data.element}</div>
                      <h4 className="font-semibold text-white mb-1">{data.name}</h4>
                      <p className="text-xs text-gray-400">{data.characteristics}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">
                    🌱 Why Constitution Matters for Sustainability
                  </h4>
                  <p className="text-green-200 text-sm">
                    Personalized recommendations reduce over-consumption, promote local plant use, 
                    and optimize health outcomes through targeted traditional knowledge.
                  </p>
                </div>

                <Button
                  onClick={() => setStep('constitution')}
                  size="lg"
                  className="w-full bg-cyber-green text-black hover:bg-cyber-green/80"
                >
                  Discover My Constitution
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Constitution Assessment */}
            {step === 'constitution' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center space-x-2 mb-4">
                    {constitutionQuestions.map((_, index) => (
                      <div key={index} className={`w-3 h-3 rounded-full ${
                        index <= currentQuestion ? 'bg-cyber-green' : 'bg-gray-600'
                      }`} />
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Question {currentQuestion + 1} of {constitutionQuestions.length}
                  </h3>
                </div>

                <div className="question-card">
                  <h4 className="text-lg font-semibold text-cyber-green mb-6 text-center">
                    {constitutionQuestions[currentQuestion].question}
                  </h4>

                  <div className="grid gap-4">
                    {constitutionQuestions[currentQuestion].options.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option)}
                        className="option-button p-4 bg-cyber-dark border border-cyber-border rounded-lg hover:border-cyber-green transition-colors text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{option.icon}</div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{option.text}</div>
                            {option.description && (
                              <div className="text-gray-400 text-sm">{option.description}</div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* User Details */}
            {step === 'details' && constitution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="constitution-result text-center mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-r from-cyber-green to-cyan-400">
                    <span className="text-4xl">{constitutionData[constitution].element}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-cyber-green mb-2">
                    You are {constitutionData[constitution].name} Constitution!
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {constitutionData[constitution].welcomeMessage}
                  </p>
                  
                  <div className="constitution-traits grid md:grid-cols-2 gap-4 my-6">
                    <div className="trait-card p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-2">Your Strengths</h4>
                      <ul className="text-green-200 text-sm space-y-1">
                        {constitutionData[constitution].strengths.map((strength: string, index: number) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="trait-card p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <h4 className="text-yellow-400 font-semibold mb-2">Watch Out For</h4>
                      <ul className="text-yellow-200 text-sm space-y-1">
                        {constitutionData[constitution].challenges.map((challenge: string, index: number) => (
                          <li key={index}>• {challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="user-details-form space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      value={userProfile.name || ''}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-green focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Region (Optional)</label>
                    <select
                      value={userProfile.region || ''}
                      onChange={(e) => setUserProfile({...userProfile, region: e.target.value})}
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-green focus:outline-none"
                    >
                      <option value="">Select your region</option>
                      <option value="north">Northern India</option>
                      <option value="south">Southern India</option>
                      <option value="east">Eastern India</option>
                      <option value="west">Western India</option>
                      <option value="central">Central India</option>
                      <option value="northeast">Northeast India</option>
                      <option value="other">Other/International</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={completeLogin}
                  disabled={!userProfile.name || step === 'saving'}
                  size="lg"
                  className="w-full bg-cyber-green text-black hover:bg-cyber-green/80"
                >
                  {step === 'saving' ? (
                    <>
                      <Database className="w-5 h-5 mr-2 animate-pulse" />
                      Saving to Cloud...
                    </>
                  ) : (
                    <>
                      Complete My Ayurvedic Profile
                      <Leaf className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
