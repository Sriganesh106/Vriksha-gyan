'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Gamepad2, Trophy, Calendar, Zap, Users, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import GameHub from '../components/GameHub';
import { getCurrentSeason } from '../data/seasonalCalendar';
import Link from 'next/link';

export default function GamesPage() {
  const [currentSeason, setCurrentSeason] = useState<any>(null);

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyber-dark via-purple-900/20 to-cyber-dark">
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
                <Gamepad2 className="w-6 h-6 text-purple-400" />
                <h1 className="text-xl font-bold text-white">Plant Learning Games</h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {currentSeason && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-cyber-green to-cyan-400 text-black px-4 py-2 rounded-full">
                  <span className="text-lg">{currentSeason.element}</span>
                  <span className="font-semibold">{currentSeason.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
        
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
            <div className="inline-block p-4 border-2 border-purple-400 rounded-full mb-6 pulse-glow">
              <Gamepad2 className="w-16 h-16 text-purple-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Plant Games
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-2xl md:text-3xl font-semibold text-white mb-6"
          >
            Interactive Learning Adventures
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Master the art of plant identification through engaging games and challenges. 
            Test your knowledge, compete with others, and become a true plant expert!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700" onClick={() => {
              document.getElementById('game-hub')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <Zap className="w-5 h-5 mr-2" />
              Start Playing Now
            </Button>
            <Link href="/calendar">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-black">
                <Calendar className="w-5 h-5 mr-2" />
                Seasonal Calendar
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Gaming floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <div className="text-2xl">
                {['🌿', '🌱', '🍃', '🌺', '🌸'][Math.floor(Math.random() * 5)]}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Game Features Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-purple-400 mb-4">
              🎮 Game Features & Modes
            </h2>
            <p className="text-xl text-gray-300">
              Multiple ways to learn and challenge yourself
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Quiz Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="h-full bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 hover:border-blue-400 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-blue-300">Quiz Challenge</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Test your plant identification skills with timed multiple-choice questions. 
                    Each question features real plant images and traditional knowledge.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-blue-200">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      15-second timer per question
                    </div>
                    <div className="flex items-center text-sm text-blue-200">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Multiple difficulty levels
                    </div>
                    <div className="flex items-center text-sm text-blue-200">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Real plant images
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Seasonal Mode */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 hover:border-green-400 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-green-300">Seasonal Mode</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Learn about plants that are perfect for the current season. 
                    Questions adapt based on Ayurvedic seasonal wisdom.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-green-200">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Current season focus
                    </div>
                    <div className="flex items-center text-sm text-green-200">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Seasonal herb benefits
                    </div>
                    <div className="flex items-center text-sm text-green-200">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Traditional timing
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 hover:border-purple-400 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-purple-300">Global Leaderboard</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Compete with plant enthusiasts worldwide. Track your progress 
                    and climb the rankings as you master botanical knowledge.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-purple-200">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      Real-time rankings
                    </div>
                    <div className="flex items-center text-sm text-purple-200">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      Achievement badges
                    </div>
                    <div className="flex items-center text-sm text-purple-200">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      Social sharing
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Game Hub */}
      <div id="game-hub">
        <GameHub currentSeason={currentSeason} />
      </div>

      {/* Game Statistics */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyber-dark to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-purple-400 mb-4">
              🌿 Ayurvedic Learning Impact
            </h2>
            <p className="text-xl text-gray-300">
              Preserving ancient wisdom through interactive learning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-300">Medicinal Plants</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-2">5000+</div>
              <div className="text-gray-300">Years of Wisdom</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
              <div className="text-gray-300">Dosha Types</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-gray-300">Natural Healing</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-cyber-green mb-4">
              Explore More Features
            </h2>
            <p className="text-xl text-gray-300">
              Enhance your plant learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link href="/calendar">
                <div className="bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-2xl p-8 hover:border-green-400 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Seasonal Calendar</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Discover the perfect herbs for each season based on 5000-year-old 
                    Ayurvedic wisdom. Live seasonal recommendations updated daily.
                  </p>
                  <Button variant="outline" className="border-green-400 text-green-300 hover:bg-green-400 hover:text-black">
                    Explore Seasons →
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
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">AI Plant Expert</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Chat with Dr. Vaidya, our AI-powered Ayurvedic expert, for personalized 
                    plant recommendations and instant answers to your questions.
                  </p>
                  <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-black">
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
              Preserving Ancient Wisdom Through Digital Innovation • Gamified Learning
            </p>
            {currentSeason && (
              <p className="text-sm text-cyan-400">
                Currently in {currentSeason.name} • Perfect for seasonal plant challenges
              </p>
            )}
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
