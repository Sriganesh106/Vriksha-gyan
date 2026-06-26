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

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
    if (season?.recommendedHerbs && season.recommendedHerbs.length > 0) {
      setTodayHerb(season.recommendedHerbs[0]);
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
      case 'games':
        return (
          <section className="min-h-screen py-20 px-4">
            <GameHub />
          </section>
        );
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-cyber-green text-black hover:bg-cyber-green/90"
                    onClick={() => handleNavigate('wellness')}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Discover Your Wellness Path
                  </Button>
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

      {/* AI Chatbot */}
      <FinalChatbot />
    </main>
  );
}
