'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Calendar, Leaf } from 'lucide-react';
import { Button } from '../components/ui/button';
import SeasonalCalendar from '../components/SeasonalCalendar';
import SeasonalNotifications from '../components/SeasonalNotifications';
import { getCurrentSeason } from '../data/seasonalCalendar';
import Link from 'next/link';

export default function CalendarPage() {
  const [currentSeason, setCurrentSeason] = useState<any>(null);

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-gray to-cyber-dark">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-cyber-dark/90 backdrop-blur-md border-b border-cyber-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-cyber-green" />
                <h1 className="text-xl font-bold text-white">Ritucharya Calendar</h1>
              </div>
            </div>
            
            {currentSeason && (
              <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-cyber-green to-cyan-400 text-black px-4 py-2 rounded-full">
                <span className="text-lg">{currentSeason.element}</span>
                <span className="font-semibold">{currentSeason.name}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-green/5 to-transparent"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <div className="inline-block p-4 border-2 border-cyber-green rounded-full mb-6 pulse-glow">
              <Calendar className="w-16 h-16 text-cyber-green" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyber-green to-cyan-400 bg-clip-text text-transparent"
          >
            Ritucharya
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-2xl md:text-3xl font-semibold text-white mb-6"
          >
            Ancient Seasonal Wisdom Calendar
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the 5000-year-old science of living in harmony with nature's cycles. 
            Get personalized herbal recommendations, lifestyle guidance, and wellness tips 
            based on the current Ayurvedic season.
          </motion.p>

          {currentSeason && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="bg-gradient-to-r from-cyber-green/20 to-cyan-400/20 border border-cyber-green/50 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-3xl">{currentSeason.element}</span>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-cyber-green">{currentSeason.name}</h3>
                  <p className="text-cyan-400">{currentSeason.characteristics}</p>
                </div>
              </div>
              <p className="text-gray-300">
                Today's featured herb: <span className="text-cyber-green font-semibold">
                  {currentSeason.recommendedHerbs?.[0]?.name}
                </span> - {currentSeason.recommendedHerbs?.[0]?.reason}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg px-8 py-4" onClick={() => {
              document.getElementById('seasonal-calendar')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <Leaf className="w-5 h-5 mr-2" />
              Explore Today's Wisdom
            </Button>
            <Link href="/games">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Home className="w-5 h-5 mr-2" />
                Try Plant Games
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Seasonal floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: currentSeason?.colors?.[0] || '#00ff88'
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Main Seasonal Calendar */}
      <div id="seasonal-calendar">
        <SeasonalCalendar />
      </div>

      {/* Seasonal Notifications */}
      <SeasonalNotifications currentSeason={currentSeason} />

      {/* Additional Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyber-dark to-cyber-gray">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-cyber-green mb-4">
              Complete Wellness Ecosystem
            </h2>
            <p className="text-xl text-gray-300">
              Explore more features to enhance your Ayurvedic journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link href="/games">
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🎮</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Interactive Games</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Test your knowledge with our plant identification quiz, seasonal challenges, 
                    and interactive learning games.
                  </p>
                  <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-black">
                    Play Games →
                  </Button>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link href="/">
                <div className="bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-2xl p-8 hover:border-green-400 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">AI Plant Expert</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Chat with Dr. Vaidya, our AI-powered Ayurvedic expert, for personalized 
                    plant recommendations and traditional wisdom.
                  </p>
                  <Button variant="outline" className="border-green-400 text-green-300 hover:bg-green-400 hover:text-black">
                    Ask Dr. Vaidya →
                  </Button>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-cyber-border bg-cyber-dark">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-cyber-green font-semibold text-lg mb-2">
              Pixel_Pioneers | 🚀 Hack Karnataka
            </p>
            <p className="text-gray-400 mb-2">
              Preserving Ancient Wisdom Through Digital Innovation • Following Nature's Rhythms
            </p>
            {currentSeason && (
              <p className="text-sm text-cyan-400">
                Currently in {currentSeason.name} • {currentSeason.characteristics}
              </p>
            )}
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
