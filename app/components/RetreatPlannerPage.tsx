'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, Leaf, ArrowRight, Loader2, Home, Clock, TreePine, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { generateWellnessRetreat, type RetreatItinerary } from '../lib/geminiAI';

const locations = [
  { 
    value: 'kerala', 
    label: 'Kerala - Backwaters & Ayurveda', 
    emoji: '🌴',
    bestFor: ['pitta', 'vata'],
    climate: 'warm-humid',
    description: 'Cooling backwaters, authentic Ayurveda centers'
  },
  { 
    value: 'coorg', 
    label: 'Karnataka (Coorg) - Coffee Plantations', 
    emoji: '☕',
    bestFor: ['vata', 'pitta', 'kapha'],
    climate: 'moderate',
    description: 'Pleasant year-round, perfect for all doshas'
  },
  { 
    value: 'rishikesh', 
    label: 'Rishikesh - Yoga Capital', 
    emoji: '🧘',
    bestFor: ['kapha', 'pitta'],
    climate: 'cool-dry',
    description: 'Spiritual energy, mountain air, yoga ashrams'
  },
  { 
    value: 'goa', 
    label: 'Goa - Beach Wellness', 
    emoji: '🏖️',
    bestFor: ['vata', 'kapha'],
    climate: 'warm-coastal',
    description: 'Beaches, sea breeze, relaxation'
  },
  { 
    value: 'himachal', 
    label: 'Himachal Pradesh - Mountain Retreat', 
    emoji: '⛰️',
    bestFor: ['pitta'],
    climate: 'cold-mountain',
    description: 'Cool mountains, fresh air, peaceful'
  },
  { 
    value: 'surprise', 
    label: 'Surprise Me!', 
    emoji: '✨',
    bestFor: ['vata', 'pitta', 'kapha'],
    climate: 'varied',
    description: 'Let AI choose the best location for you'
  }
];

const wellnessGoals = [
  { value: 'stress-relief', label: 'Stress Relief & Relaxation', icon: '🧘', color: 'from-blue-500/20 to-cyan-500/20' },
  { value: 'energy-boost', label: 'Energy & Vitality', icon: '⚡', color: 'from-yellow-500/20 to-orange-500/20' },
  { value: 'mental-clarity', label: 'Mental Clarity & Focus', icon: '🧠', color: 'from-purple-500/20 to-pink-500/20' },
  { value: 'detox', label: 'Detox & Rejuvenation', icon: '✨', color: 'from-green-500/20 to-emerald-500/20' },
  { value: 'sleep', label: 'Better Sleep', icon: '🌙', color: 'from-indigo-500/20 to-blue-500/20' }
];

const doshas = [
  { value: 'vata', label: 'Vata', description: 'Air & Space - Creative & Energetic' },
  { value: 'pitta', label: 'Pitta', description: 'Fire & Water - Focused & Intense' },
  { value: 'kapha', label: 'Kapha', description: 'Earth & Water - Calm & Steady' }
];

export default function RetreatPlannerPage() {
  const [selectedDosha, setSelectedDosha] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<RetreatItinerary | null>(null);
  const [error, setError] = useState('');
  const [detectedDosha, setDetectedDosha] = useState('');

  // Helper function to parse and highlight activity text
  const parseActivity = (activity: string) => {
    // Extract time of day (Morning, Afternoon, Evening)
    const timeMatch = activity.match(/^(Morning|Afternoon|Evening):\s*/i);
    const timeOfDay = timeMatch ? timeMatch[1] : null;
    const mainText = timeMatch ? activity.replace(timeMatch[0], '') : activity;

    // Extract location names - multiple patterns
    const locations: Array<{name: string, city?: string}> = [];
    
    // Pattern 1: "at [Location Name], [City]" or "at [Location Name]'s [Facility], [City]"
    const atPattern = /at\s+([A-Z][^,]+?)(?:'s\s+([^,]+?))?,\s+([A-Z][a-z]+)/gi;
    let match;
    while ((match = atPattern.exec(mainText)) !== null) {
      const locationName = match[2] ? `${match[1]}'s ${match[2]}` : match[1];
      const city = match[3];
      locations.push({
        name: locationName.trim(),
        city: city
      });
    }
    
    // Pattern 2: "Visit [Location] in [City]"
    const visitPattern = /(?:visit|to)\s+([A-Z][^,]+?)\s+in\s+([A-Z][a-z]+)/gi;
    while ((match = visitPattern.exec(mainText)) !== null) {
      locations.push({
        name: match[1].trim(),
        city: match[2]
      });
    }
    
    // Pattern 3: Quoted locations
    const quotePattern = /"([^"]+)"/g;
    while ((match = quotePattern.exec(mainText)) !== null) {
      // Try to find city for quoted location
      const cityMatch = mainText.match(new RegExp(`"${match[1]}"[^,]*in\\s+([A-Z][a-z]+)`, 'i'));
      locations.push({
        name: match[1],
        city: cityMatch ? cityMatch[1] : undefined
      });
    }

    return { timeOfDay, mainText, locations };
  };

  // Helper to generate Google Maps link
  const getGoogleMapsLink = (locationName: string, city?: string) => {
    const query = city ? `${locationName}, ${city}, India` : `${locationName}, India`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  // Auto-detect user's dosha from wellness quiz results
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to get from localStorage (saved from quiz results)
      const savedDosha = localStorage.getItem('userDosha');
      
      // Try to get from wellness quiz results
      const wellnessResults = localStorage.getItem('wellnessResults');
      if (wellnessResults) {
        try {
          const results = JSON.parse(wellnessResults);
          if (results.primaryDosha) {
            setSelectedDosha(results.primaryDosha);
            setDetectedDosha(results.primaryDosha);
            return;
          }
        } catch (e) {
          console.error('Error parsing wellness results:', e);
        }
      }
      
      // Fallback to saved dosha
      if (savedDosha) {
        setSelectedDosha(savedDosha);
        setDetectedDosha(savedDosha);
      }
    }
  }, []);

  // Helper to check climate compatibility
  const getClimateWarning = () => {
    if (!selectedDosha || !selectedLocation) return null;
    
    const currentMonth = new Date().getMonth(); // 0-11
    const isWinter = currentMonth >= 10 || currentMonth <= 1; // Nov-Feb
    const isSummer = currentMonth >= 3 && currentMonth <= 5; // Apr-Jun
    
    const coldLocations = ['himachal', 'rishikesh'];
    const hotLocations = ['goa', 'kerala'];
    
    if (selectedDosha === 'kapha' && isWinter && coldLocations.includes(selectedLocation)) {
      return {
        type: 'warning',
        message: '⚠️ Kapha + Cold Climate: Your retreat will include extra warming activities and heated spaces to keep you comfortable.'
      };
    }
    
    if (selectedDosha === 'pitta' && isSummer && hotLocations.includes(selectedLocation)) {
      return {
        type: 'warning',
        message: '⚠️ Pitta + Hot Climate: Your retreat will focus on cooling activities and shaded areas to balance your dosha.'
      };
    }
    
    return null;
  };

  const handleGenerateRetreat = async () => {
    if (!selectedDosha || !selectedLocation || !selectedGoal) {
      setError('Please select dosha, location, and wellness goal');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const location = locations.find(l => l.value === selectedLocation)?.label || selectedLocation;
      const goal = wellnessGoals.find(g => g.value === selectedGoal)?.label || selectedGoal;
      
      console.log('🎯 Generating retreat for:', { dosha: selectedDosha, location, goal });
      
      const retreat = await generateWellnessRetreat(selectedDosha, goal, location, 'Ashwagandha');
      setItinerary(retreat);
    } catch (err: any) {
      console.error('❌ Error generating retreat:', err);
      setError(err.message || 'Failed to generate retreat. Please check the console for details and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setSelectedDosha('');
    setSelectedLocation('');
    setSelectedGoal('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cyber-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {!itinerary ? (
          /* Selection Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h1 className="text-5xl font-bold text-white mb-4">
                AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Wellness Retreat</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Let our AI create a personalized 3-day wellness journey tailored to your unique needs
              </p>
            </div>

            {/* Dosha Selection */}
            <Card className="bg-cyber-gray border-2 border-cyber-green/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Leaf className="w-6 h-6 text-cyber-green" />
                  Your Dosha
                </h3>
                {detectedDosha && (
                  <div className="px-4 py-2 bg-cyber-green/20 border border-cyber-green/50 rounded-lg">
                    <span className="text-cyber-green text-sm font-semibold">✓ Auto-detected from your quiz</span>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {doshas.map((dosha) => (
                  <button
                    key={dosha.value}
                    onClick={() => setSelectedDosha(dosha.value)}
                    className={`p-6 rounded-xl border-2 text-left transition-all relative ${
                      selectedDosha === dosha.value
                        ? 'border-cyber-green bg-cyber-green/10 scale-105'
                        : 'border-cyber-border bg-cyber-dark hover:border-cyber-green/50'
                    }`}
                  >
                    {detectedDosha === dosha.value && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-cyber-green rounded-full flex items-center justify-center">
                        <span className="text-cyber-dark text-xs font-bold">✓</span>
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-white mb-2">{dosha.label}</h4>
                    <p className="text-sm text-gray-400">{dosha.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Location Selection */}
            <Card className="bg-cyber-gray border-2 border-cyan-500/30 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-cyan-400" />
                Choose Your Destination
              </h3>
              {selectedDosha && (
                <p className="text-sm text-gray-400 mb-4">
                  ✨ Locations marked with a star are recommended for your {selectedDosha.charAt(0).toUpperCase() + selectedDosha.slice(1)} dosha
                </p>
              )}
              <div className="grid md:grid-cols-3 gap-4">
                {locations.map((location) => {
                  const isRecommended = selectedDosha && location.bestFor.includes(selectedDosha);
                  return (
                    <button
                      key={location.value}
                      onClick={() => setSelectedLocation(location.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                        selectedLocation === location.value
                          ? 'border-cyan-400 bg-cyan-500/10 scale-105'
                          : isRecommended
                          ? 'border-cyan-400/50 bg-cyan-500/5 hover:border-cyan-400'
                          : 'border-cyber-border bg-cyber-dark hover:border-cyan-400/50'
                      }`}
                    >
                      {isRecommended && (
                        <div className="absolute top-2 right-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                        </div>
                      )}
                      <span className="text-3xl mb-2 block">{location.emoji}</span>
                      <p className="font-semibold text-white text-sm mb-1">{location.label}</p>
                      <p className="text-xs text-gray-400">{location.description}</p>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Wellness Goal Selection */}
            <Card className="bg-cyber-gray border-2 border-purple-500/30 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Select Your Wellness Goal
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {wellnessGoals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setSelectedGoal(goal.value)}
                    className={`p-6 rounded-xl border-2 text-left transition-all bg-gradient-to-br ${goal.color} ${
                      selectedGoal === goal.value
                        ? 'border-purple-400 scale-105'
                        : 'border-cyber-border hover:border-purple-400/50'
                    }`}
                  >
                    <span className="text-3xl mr-3">{goal.icon}</span>
                    <span className="font-semibold text-white">{goal.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Climate Warning */}
            {getClimateWarning() && (
              <div className="p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
                <p className="text-yellow-300 text-center font-semibold">{getClimateWarning()?.message}</p>
                <p className="text-yellow-200/70 text-center text-sm mt-2">
                  Our AI will customize your retreat to ensure maximum comfort despite the climate.
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerateRetreat}
              disabled={isGenerating || !selectedDosha || !selectedLocation || !selectedGoal}
              className="w-full py-8 text-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Crafting your unique journey... Our AI is analyzing your Dosha, the current season, and searching for the best real-world locations for you
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-3" />
                  Generate My Personalized Retreat
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          /* Generated Itinerary */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Itinerary Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <h1 className="text-5xl font-bold text-white mb-4">{itinerary.title}</h1>
                <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 italic">
                  {itinerary.tagline}
                </p>
              </motion.div>
            </div>

            {/* Day Cards */}
            {[itinerary.day1, itinerary.day2, itinerary.day3].map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-gradient-to-br from-cyber-gray to-cyber-dark border-2 border-cyber-green/30 p-8 hover:border-cyber-green/50 transition-all">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl font-bold text-white">Day {index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{day.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-3 ml-26">
                    {day.activities.map((activity, actIndex) => {
                      const parsed = parseActivity(activity);
                      const isGardenActivity = parsed.mainText.toLowerCase().includes('garden') || parsed.mainText.toLowerCase().includes('botanical');
                      const isCenterActivity = parsed.mainText.toLowerCase().includes('center') || parsed.mainText.toLowerCase().includes('centre') || parsed.mainText.toLowerCase().includes('ayush') || parsed.mainText.toLowerCase().includes('college');
                      
                      return (
                        <div key={actIndex} className="bg-cyber-dark/50 rounded-lg p-4 hover:bg-cyber-dark/70 transition-all">
                          <div className="flex items-start gap-3">
                            {/* Time Icon */}
                            {parsed.timeOfDay && (
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span className="text-cyan-400 font-semibold text-sm">{parsed.timeOfDay}</span>
                              </div>
                            )}
                            
                            {/* Activity Icon */}
                            <div className="flex-shrink-0 mt-1">
                              {isGardenActivity ? (
                                <TreePine className="w-5 h-5 text-green-400" />
                              ) : isCenterActivity ? (
                                <Building2 className="w-5 h-5 text-blue-400" />
                              ) : (
                                <ArrowRight className="w-5 h-5 text-cyber-green" />
                              )}
                            </div>
                            
                            {/* Activity Text with Highlighted Locations */}
                            <div className="flex-1">
                              <p className="text-gray-300 leading-relaxed">
                                {parsed.mainText.split(/("([^"]+)")/g).map((part, i) => {
                                  // Highlight quoted text (locations)
                                  if (i % 3 === 1 && part.startsWith('"')) {
                                    return (
                                      <span key={i} className="text-cyber-green font-bold bg-cyber-green/10 px-2 py-0.5 rounded">
                                        {part.replace(/"/g, '')}
                                      </span>
                                    );
                                  }
                                  return <span key={i}>{part}</span>;
                                })}
                              </p>
                              
                              {/* Location Tags - Clickable with Google Maps */}
                              {parsed.locations.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {parsed.locations.map((loc, locIndex) => (
                                    <a
                                      key={locIndex}
                                      href={getGoogleMapsLink(loc.name, loc.city)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer"
                                      title={`Open ${loc.name} in Google Maps`}
                                    >
                                      <MapPin className="w-3 h-3" />
                                      {loc.name}
                                      {loc.city && <span className="text-cyan-400/70">• {loc.city}</span>}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-8">
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-dark"
              >
                <Home className="w-5 h-5 mr-2" />
                Plan Another Retreat
              </Button>
              <Button
                onClick={() => window.print()}
                className="px-8 py-4 text-lg bg-cyber-green text-cyber-dark hover:bg-cyber-green/90"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Save Itinerary
              </Button>
            </div>

            {/* AI Disclaimer */}
            <div className="mt-8 p-4 bg-cyber-gray/30 border border-cyber-green/20 rounded-lg">
              <p className="text-center text-gray-400 text-sm italic">
                ℹ️ Locations and details suggested by AI. Please verify before your visit.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
