'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Calendar, Leaf, ArrowRight, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { generateWellnessRetreat, type RetreatItinerary } from '../lib/geminiAI';

interface WellnessRetreatPlannerProps {
  userDosha: string;
  topHerb: string;
}

const locations = [
  { value: 'kerala', label: 'Kerala - Backwaters & Ayurveda', image: '/locations/kerala.jpg' },
  { value: 'coorg', label: 'Karnataka (Coorg) - Coffee Plantations', image: '/locations/coorg.jpg' },
  { value: 'rishikesh', label: 'Rishikesh - Yoga Capital', image: '/locations/rishikesh.jpg' },
  { value: 'goa', label: 'Goa - Beach Wellness', image: '/locations/goa.jpg' },
  { value: 'surprise', label: 'Surprise Me!', image: '/locations/surprise.jpg' }
];

const wellnessGoals = [
  { value: 'stress-relief', label: 'Stress Relief & Relaxation', icon: '🧘' },
  { value: 'energy-boost', label: 'Energy & Vitality', icon: '⚡' },
  { value: 'mental-clarity', label: 'Mental Clarity & Focus', icon: '🧠' },
  { value: 'detox', label: 'Detox & Rejuvenation', icon: '✨' },
  { value: 'sleep', label: 'Better Sleep', icon: '🌙' }
];

export default function WellnessRetreatPlanner({ userDosha, topHerb }: WellnessRetreatPlannerProps) {
  const [showPlanner, setShowPlanner] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<RetreatItinerary | null>(null);
  const [error, setError] = useState('');

  const handleGenerateRetreat = async () => {
    if (!selectedLocation || !selectedGoal) {
      setError('Please select both location and wellness goal');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const location = locations.find(l => l.value === selectedLocation)?.label || selectedLocation;
      const goal = wellnessGoals.find(g => g.value === selectedGoal)?.label || selectedGoal;
      
      const retreat = await generateWellnessRetreat(userDosha, goal, location, topHerb);
      setItinerary(retreat);
    } catch (err) {
      console.error('Error generating retreat:', err);
      setError('Failed to generate retreat. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setSelectedLocation('');
    setSelectedGoal('');
    setError('');
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setShowPlanner(true)}
        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 text-lg"
        size="lg"
      >
        <Calendar className="w-5 h-5 mr-2" />
        Ready for a Real Journey? Plan Your Wellness Retreat
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {showPlanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-5xl my-8 bg-cyber-dark border-2 border-cyber-green/30 rounded-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-cyber-dark border-b border-cyber-green/30 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Your <span className="text-cyber-green">Personalized Wellness Retreat</span>
                    </h2>
                    <p className="text-gray-400">
                      AI-powered itinerary crafted just for you
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPlanner(false);
                      handleReset();
                    }}
                    className="p-2 rounded-lg bg-cyber-gray hover:bg-cyber-green/20 transition-colors"
                  >
                    <X className="w-6 h-6 text-cyber-green" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {!itinerary ? (
                  /* Selection Form */
                  <div className="space-y-8">
                    {/* User Profile Summary */}
                    <Card className="bg-cyber-gray border-2 border-cyber-green/30 p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Your Wellness Profile</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-cyber-green/20 rounded-full flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-cyber-green" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Primary Dosha</p>
                            <p className="text-lg font-semibold text-white capitalize">{userDosha}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Top Recommended Herb</p>
                            <p className="text-lg font-semibold text-white">{topHerb}</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Location Selection */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-cyber-green" />
                        Choose Your Destination
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {locations.map((location) => (
                          <button
                            key={location.value}
                            onClick={() => setSelectedLocation(location.value)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              selectedLocation === location.value
                                ? 'border-cyber-green bg-cyber-green/10'
                                : 'border-cyber-border bg-cyber-gray hover:border-cyber-green/50'
                            }`}
                          >
                            <p className="font-semibold text-white">{location.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Wellness Goal Selection */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-cyber-green" />
                        Select Your Wellness Goal
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {wellnessGoals.map((goal) => (
                          <button
                            key={goal.value}
                            onClick={() => setSelectedGoal(goal.value)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              selectedGoal === goal.value
                                ? 'border-cyber-green bg-cyber-green/10'
                                : 'border-cyber-border bg-cyber-gray hover:border-cyber-green/50'
                            }`}
                          >
                            <span className="text-2xl mr-3">{goal.icon}</span>
                            <span className="font-semibold text-white">{goal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400">{error}</p>
                      </div>
                    )}

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerateRetreat}
                      disabled={isGenerating || !selectedLocation || !selectedGoal}
                      className="w-full py-6 text-lg bg-cyber-green text-cyber-dark hover:bg-cyber-green/90 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Crafting your unique journey... Our AI is designing the perfect retreat for you
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate My Personalized Retreat
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  /* Generated Itinerary */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Itinerary Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-4xl font-bold text-white mb-3">{itinerary.title}</h2>
                      <p className="text-xl text-cyber-green italic">{itinerary.tagline}</p>
                    </div>

                    {/* Day Cards */}
                    {[itinerary.day1, itinerary.day2, itinerary.day3].map((day, index) => (
                      <Card key={index} className="bg-cyber-gray border-2 border-cyber-green/30 p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-cyber-green/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-cyber-green">Day {index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{day.title}</h3>
                          </div>
                        </div>
                        <div className="space-y-3 ml-20">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex items-start gap-3">
                              <ArrowRight className="w-5 h-5 text-cyber-green mt-1 flex-shrink-0" />
                              <p className="text-gray-300">{activity}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center pt-6">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-dark"
                      >
                        Plan Another Retreat
                      </Button>
                      <Button
                        onClick={() => window.print()}
                        className="bg-cyber-green text-cyber-dark hover:bg-cyber-green/90"
                      >
                        Save Itinerary
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
