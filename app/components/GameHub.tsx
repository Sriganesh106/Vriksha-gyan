'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Users, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import QuizGame from './QuizGame';
import { db, ref, onValue } from '../lib/firebase';

interface LeaderboardEntry {
  id: string;
  userName: string;
  score: number;
  timestamp: any;
}

export default function GameHub({ currentSeason }: { currentSeason?: any }) {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time leaderboard for Realtime Database
  useEffect(() => {
    const scoresRef = ref(db, 'scores');

    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const leaderboardData: LeaderboardEntry[] = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(key => {
          leaderboardData.push({
            id: key,
            userName: data[key].userName,
            score: data[key].score,
            timestamp: data[key].timestampNumber || data[key].timestamp
          });
        });
      }
      
      // Sort by score descending and limit to top 10
      leaderboardData.sort((a, b) => (b.score || 0) - (a.score || 0));
      setLeaderboard(leaderboardData.slice(0, 10));
      setIsLoading(false);
      console.log('Leaderboard updated with', leaderboardData.length, 'entries');
    }, (error: any) => {
      console.error('Error fetching leaderboard:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-cyber-green mb-4 glow-text">
            Test Your Knowledge: The Herbalist's Challenge
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Prove your mastery of ancient medicinal wisdom. Answer questions about sacred plants 
            and climb the leaderboard to become a true Master Herbalist of Vriksha Gyan.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-6 h-6" />
                  <span>The Challenge Awaits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-gray-300 space-y-3">
                  <p>🌿 5 questions about sacred medicinal plants</p>
                  <p>⏱️ 15 seconds per question</p>
                  <p>🏆 +100 points for correct answers</p>
                  <p>📱 Generate your shareable achievement card</p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setIsGameOpen(true)}
                    size="lg"
                    className="w-full text-lg py-6 pulse-glow"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Start Challenge
                  </Button>
                </motion.div>

                <div className="text-center text-sm text-gray-400">
                  Your score will appear on the live leaderboard instantly!
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6" />
                  <span>Live Leaderboard</span>
                  <div className="ml-auto flex items-center space-x-1">
                    <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                    <span className="text-xs text-cyber-green">LIVE</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-12 bg-cyber-dark rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2" />
                    <p>Be the first Herbalist to take the challenge!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {leaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`
                          flex items-center justify-between p-3 rounded-lg
                          ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                            index === 2 ? 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border border-amber-600/30' :
                            'bg-cyber-dark border border-cyber-border'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${index === 0 ? 'bg-yellow-500 text-black' :
                              index === 1 ? 'bg-gray-400 text-black' :
                              index === 2 ? 'bg-amber-600 text-white' :
                              'bg-cyber-border text-gray-300'
                            }
                          `}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {entry.userName}
                            </div>
                            <div className="text-xs text-gray-400">
                              Herbalist
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${index < 3 ? 'text-cyber-green' : 'text-cyan-400'}`}>
                            {entry.score}
                          </div>
                          <div className="text-xs text-gray-400">
                            points
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Quiz Game Modal */}
      <QuizGame
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />
    </section>
  );
}