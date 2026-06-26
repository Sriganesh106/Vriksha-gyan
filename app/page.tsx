'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';
import { Button } from './components/ui/button';
import GameHub from './components/GameHub';
import FloatingElements from './components/FloatingElements';
import FinalChatbot from './components/FinalChatbot';
import SeasonalCalendar from './components/SeasonalCalendar';
import SimpleLogin from './components/SimpleLogin';
import Header from './components/Header';
import { WellnessQuiz } from './components/WellnessQuiz';
import RetreatPlannerPage from './components/RetreatPlannerPage';
import DoctorsPage from './components/DoctorsPage';
import PlantQRGallery from './components/PlantQRGallery';
import { getCurrentSeason } from './data/seasonalCalendar';
import { firebaseAuthService } from './lib/firebaseAuth';

export default function Home() {
  const [currentSeason, setCurrentSeason] = useState<any>(null);
  const [todayHerb, setTodayHerb] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [showQRGallery, setShowQRGallery] = useState(false);

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
    if (season?.recommendedHerbs && season.recommendedHerbs.length > 0) {
      setTodayHerb(season.recommendedHerbs[0]);
    }

    // Check for hash navigation
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'wellness', 'retreat', 'doctors', 'calendar'].includes(hash)) {
      setCurrentSection(hash);
    }
  }, []);

  useEffect(() => {
    // Set mounted state and check for existing profile
    setIsMounted(true);
    
    // Listen for Firebase auth state changes (with fallback)
    try {
      const unsubscribe = firebaseAuthService.onAuthStateChange((user, profile) => {
        if (user && profile) {
          console.log('✅ Firebase user authenticated:', profile);
          setUserProfile(profile);
          
          // Also save to localStorage for backward compatibility
          if (typeof window !== 'undefined') {
            localStorage.setItem('ayurvedicProfile', JSON.stringify(profile));
          }
        } else {
          // Check localStorage as fallback
          if (typeof window !== 'undefined') {
            const savedProfile = localStorage.getItem('ayurvedicProfile');
            if (savedProfile) {
              try {
                const localProfile = JSON.parse(savedProfile);
                setUserProfile(localProfile);
                console.log('📱 Loaded profile from localStorage:', localProfile);
              } catch (error) {
                console.error('Error parsing saved profile:', error);
                localStorage.removeItem('ayurvedicProfile');
              }
            }
          }
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Firebase Auth not available, using localStorage only:', error);
      
      // Fallback to localStorage only
      if (typeof window !== 'undefined') {
        const savedProfile = localStorage.getItem('ayurvedicProfile');
        if (savedProfile) {
          try {
            const localProfile = JSON.parse(savedProfile);
            setUserProfile(localProfile);
            console.log('📱 Loaded profile from localStorage (fallback):', localProfile);
          } catch (error) {
            console.error('Error parsing saved profile:', error);
            localStorage.removeItem('ayurvedicProfile');
          }
        }
      }
      setIsLoading(false);
      
      return () => {}; // Empty cleanup function
    }
  }, []);

  // Show login after a delay if no profile
  useEffect(() => {
    if (!isLoading && !userProfile) {
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 2000); // Show login after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoading, userProfile]);

  const handleLogin = (profile: any) => {
    setUserProfile(profile);
    setShowLogin(false);
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await firebaseAuthService.signOut();
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ayurvedicProfile');
      }
      
      setUserProfile(null);
      setShowLogin(true);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Error logging out:', error);
    }
  };

  if (isLoading || !isMounted) {
    return (
      <main className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyber-green">Loading your personalized herbarium...</p>
        </div>
      </main>
    );
  }

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'wellness':
        return (
          <section className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <WellnessQuiz />
            </div>
          </section>
        );
      case 'retreat':
        return <RetreatPlannerPage />;
      case 'doctors':
        return <DoctorsPage />;
      case 'calendar':
        return (
          <section className="min-h-screen py-20 px-4">
            <SeasonalCalendar />
          </section>
        );
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-green/5 to-transparent"></div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center max-w-5xl mx-auto relative z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                  className="mb-8"
                >
                  <div className="inline-block p-4 border-2 border-cyber-green rounded-full mb-6 pulse-glow">
                    <Leaf className="w-16 h-16 text-cyber-green" />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyber-green to-cyan-400 bg-clip-text text-transparent"
                >
                  Vriksha Gyan
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-2xl md:text-4xl font-semibold text-white mb-6"
                >
                  The Living Library of Medicinal Plants
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  Transform static knowledge into interactive, immersive experiences. 
                  <span className="text-cyber-green font-semibold"> Digitally Preserve the DNA of Ancient Medicine</span>
                </motion.p>

                {/* AR Feature Highlight */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="mb-12 p-8 bg-gradient-to-r from-cyber-green/20 via-cyan-500/20 to-purple-500/20 border-2 border-cyber-green rounded-2xl max-w-4xl mx-auto cursor-pointer hover:border-cyber-green hover:shadow-lg hover:shadow-cyber-green/30 transition-all"
                  onClick={() => setShowQRGallery(true)}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-cyber-green/30 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-6 h-6 text-cyber-green" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Experience Plants in AR</h3>
                  </div>
                  <p className="text-center text-gray-300 text-lg mb-6">
                    Scan QR codes to view 3D models of medicinal plants in your space using Augmented Reality
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 text-sm mb-4">
                    <span className="px-4 py-2 bg-cyber-green/20 border border-cyber-green/50 rounded-full text-cyber-green">
                      🌿 Interactive 3D Models
                    </span>
                    <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-300">
                      📱 Mobile AR Experience
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300">
                      🔍 Detailed Plant Info
                    </span>
                  </div>
                  <p className="text-center text-cyber-green text-sm font-semibold">
                    👆 Click to view QR codes
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                >
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-cyber-green text-black hover:bg-cyber-green/90 shadow-lg shadow-cyber-green/50"
                    onClick={() => handleNavigate('wellness')}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Your AR Journey
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 py-4 border-2 border-cyber-green text-cyber-green hover:bg-cyber-green/10"
                    onClick={() => handleNavigate('doctors')}
                  >
                    Find AYUSH Doctors
                  </Button>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                >
                  {/* AR Plant Library - HERO FEATURE */}
                  <div className="bg-gradient-to-br from-cyber-green/20 to-cyan-500/20 border-2 border-cyber-green rounded-xl p-6 hover:border-cyber-green hover:shadow-lg hover:shadow-cyber-green/30 transition-all cursor-pointer relative overflow-hidden" onClick={() => setShowQRGallery(true)}>
                    <div className="absolute top-2 right-2 px-2 py-1 bg-cyber-green text-black text-xs font-bold rounded-full">
                      WOW!
                    </div>
                    <div className="w-12 h-12 bg-cyber-green/30 rounded-lg flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-cyber-green animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">AR Plant Library</h3>
                    <p className="text-gray-300 text-sm mb-3">View 3D medicinal plants in your space with QR code AR technology</p>
                    <div className="text-xs text-cyber-green font-semibold">🌿 Scan → View → Learn</div>
                  </div>

                  {/* AI Wellness Quiz */}
                  <div className="bg-cyber-gray/50 border-2 border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500 transition-all cursor-pointer" onClick={() => handleNavigate('wellness')}>
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">AI Wellness Quiz</h3>
                    <p className="text-gray-400 text-sm">Discover your Ayurvedic dosha and get personalized herb recommendations with AR access</p>
                  </div>

                  {/* AI Retreat Planner */}
                  <div className="bg-cyber-gray/50 border-2 border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition-all cursor-pointer" onClick={() => handleNavigate('retreat')}>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">AI Retreat Planner</h3>
                    <p className="text-gray-400 text-sm">Get personalized 3-day wellness retreat plans with real locations</p>
                  </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 pt-16 border-t border-cyber-green/20"
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyber-green mb-2">12+</div>
                    <div className="text-gray-400 text-sm">Verified Practitioners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">AI</div>
                    <div className="text-gray-400 text-sm">Powered Insights</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                    <div className="text-gray-400 text-sm">Wellness Support</div>
                  </div>
                </motion.div>
              </motion.div>

              <FloatingElements />
            </section>
          </>
        );
    }
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      {userProfile && (
        <Header 
          userProfile={userProfile}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentSection={currentSection}
        />
      )}

      {/* Main Content */}
      <div className={userProfile ? 'pt-20' : ''}>
        {renderSection()}
      </div>

      {/* Login Modal */}
      <SimpleLogin
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />

      {/* QR Gallery Modal */}
      <PlantQRGallery
        isOpen={showQRGallery}
        onClose={() => setShowQRGallery(false)}
      />

      {/* AI Chatbot */}
      <FinalChatbot />
    </main>
  );
}
