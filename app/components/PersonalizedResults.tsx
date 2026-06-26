// app/components/PersonalizedResults.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, RotateCcw, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { herbs, doshaDescriptions, type Herb } from '../data/wellness-quiz';
import PlantQRGallery from './PlantQRGallery';

interface WellnessResults {
  userName: string;
  primaryDosha: 'vata' | 'pitta' | 'kapha';
  topHerbs: Herb[];
  doshaScores: { vata: number; pitta: number; kapha: number };
  herbScores: { [key: string]: number };
}

export const PersonalizedResults: React.FC = () => {
  const [results, setResults] = useState<WellnessResults | null>(null);
  const [showQRGallery, setShowQRGallery] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedResults = localStorage.getItem('wellnessResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const handleRetakeQuiz = () => {
    localStorage.removeItem('wellnessResults');
    window.location.reload();
  };

  const handleShare = () => {
    const shareText = `I just discovered my personalized wellness path with Vriksha Gyan! My top herbs are: ${results?.topHerbs.map(h => h.name).join(', ')}. Discover yours at VrikshaGyan.com 🌿✨`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Personalized Wellness Kit - Vriksha Gyan',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard! Share on your social media 🌿');
    }
  };

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyber-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your personalized results...</p>
        </div>
      </div>
    );
  }

  const dosha = doshaDescriptions[results.primaryDosha];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 bg-cyber-green/20 rounded-full flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-cyber-green" />
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-4">
          {results.userName}, Your <span className="text-cyber-green">Personalized Wellness Kit</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-6">
          Based on ancient Ayurvedic wisdom, here are the herbs perfectly aligned with your constitution
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            onClick={handleShare} 
            className="bg-gray-800 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-6 py-3"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Button 
            onClick={handleRetakeQuiz} 
            className="bg-gray-800 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-6 py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </div>

      {/* Dosha Analysis */}
      <Card className="p-6 bg-cyber-gray border-2 border-cyber-green/30">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Primary Constitution: <span className="text-cyber-green">{dosha.name}</span>
          </h2>
          <p className="text-gray-300 text-lg">{dosha.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Your Characteristics:</h3>
            <ul className="space-y-2">
              {dosha.characteristics.map((char, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-cyber-green rounded-full"></div>
                  {char}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Dosha Balance:</h3>
            <div className="space-y-3">
              {Object.entries(results.doshaScores).map(([doshaType, score]) => {
                const percentage = (score / Math.max(...Object.values(results.doshaScores))) * 100;
                return (
                  <div key={doshaType}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 capitalize">{doshaType}</span>
                      <span className="text-cyber-green">{score}</span>
                    </div>
                    <div className="w-full bg-cyber-border rounded-full h-2">
                      <div
                        className="bg-cyber-green h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Herb Recommendations */}
      <div>
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Your <span className="text-cyber-green">Sacred Herb Trinity</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {results.topHerbs.map((herb, index) => (
            <motion.div
              key={herb.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full overflow-hidden group hover:shadow-lg hover:shadow-cyber-green/20 transition-all duration-300 bg-cyber-gray border-2 border-cyber-green/30">
                <div className="relative">
                  <img
                    src={herb.imageSrc}
                    alt={herb.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-cyber-green text-cyber-dark px-3 py-1 rounded-full text-sm font-bold">
                    #{index + 1} Match
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{herb.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 italic">{herb.scientificName}</p>
                  
                  <p className="text-cyber-green font-semibold mb-4 text-lg">
                    {herb.oneLiner}
                  </p>

                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {herb.description}
                  </p>

                  {herb.benefits && herb.benefits.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {herb.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 bg-cyber-green rounded-full"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Usage Guide */}
      <Card className="p-6 bg-cyber-gray border-2 border-cyber-green/30">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          How to Use Your <span className="text-cyber-green">Wellness Kit</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-cyber-green font-bold text-lg">1</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Start Slowly</h3>
            <p className="text-gray-300 text-sm">
              Begin with one herb at a time. Allow your body to adjust for 1-2 weeks before adding the next.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-cyber-green font-bold text-lg">2</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Consistency is Key</h3>
            <p className="text-gray-300 text-sm">
              Take your herbs at the same time daily. Morning is ideal for energizing herbs, evening for calming ones.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-cyber-green font-bold text-lg">3</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Listen to Your Body</h3>
            <p className="text-gray-300 text-sm">
              Pay attention to how you feel. Adjust dosage or timing based on your body's response.
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-cyber-dark rounded-lg border border-cyber-green/30">
          <p className="text-center text-gray-300 text-sm">
            <span className="text-cyber-green font-semibold">Important:</span> Consult with an Ayurvedic practitioner or healthcare provider before starting any new herbal regimen, especially if you have existing health conditions or take medications.
          </p>
        </div>
      </Card>

      {/* AYUSH Doctor Consultation Notice */}
      <Card className="p-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-2 border-amber-500/50">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚕️</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              <span className="text-amber-400">Consult a Certified AYUSH Doctor</span>
            </h3>
            <p className="text-gray-300 mb-4">
              This wellness kit is a personalized recommendation based on traditional Ayurvedic principles. For safe and effective use, we strongly recommend consulting with a certified AYUSH practitioner who can:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Verify the herbs are suitable for your specific health condition</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Provide accurate dosage and preparation methods</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Monitor your progress and adjust recommendations</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Ensure no interactions with existing medications</span>
              </li>
            </ul>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
              <p className="text-amber-200 text-sm font-semibold mb-2">
                🌿 Bridging Traditional Wisdom with Modern Healthcare
              </p>
              <p className="text-gray-300 text-sm">
                We believe in transparency and responsible wellness. Our platform connects you with verified AYUSH practitioners to ensure your herbal journey is safe, effective, and aligned with professional medical guidance.
              </p>
            </div>
            <a href="/doctors">
              <Button className="w-full bg-amber-500 text-white hover:bg-amber-600">
                <ExternalLink className="w-4 h-4 mr-2" />
                Find Certified AYUSH Doctors Near You
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* AI Wellness Retreat Planner */}
      <Card className="p-8 text-center bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-2 border-cyan-500/50">
        <h2 className="text-3xl font-bold text-white mb-4">
          <span className="text-cyan-400">✨ Experience the Magic</span>
        </h2>
        <p className="text-gray-300 mb-6 text-lg">
          Let our AI create a personalized 3-day wellness retreat just for you - tailored to your dosha, goals, and favorite herbs.
        </p>
        
        <div className="flex justify-center">
          <a href="#retreat">
            <Button
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 text-lg"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Plan Your Wellness Retreat
            </Button>
          </a>
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
          Your dosha will be automatically detected ✓
        </p>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 text-center bg-gradient-to-r from-cyber-gray to-cyber-dark border-2 border-cyber-green/50">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to Begin Your <span className="text-cyber-green">Wellness Journey?</span>
        </h2>
        <p className="text-gray-300 mb-6 text-lg">
          Experience these sacred herbs in immersive AR and learn their traditional preparation methods.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            onClick={() => {
              setSelectedPlant(undefined);
              setShowQRGallery(true);
            }}
            className="px-8 bg-cyber-green text-cyber-dark hover:bg-cyber-green/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Explore All Plants
          </Button>
          <Button 
            className="px-8 bg-cyber-gray border-2 border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-dark"
            onClick={handleRetakeQuiz}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </Card>

      {/* QR Gallery Modal */}
      <PlantQRGallery 
        isOpen={showQRGallery}
        onClose={() => {
          setShowQRGallery(false);
          setSelectedPlant(undefined);
        }}
        selectedPlant={selectedPlant}
      />
    </motion.div>
  );
};
