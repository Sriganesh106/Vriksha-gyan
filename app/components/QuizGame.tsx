'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, CheckCircle, XCircle, Volume2, VolumeX } from 'lucide-react';
import { questions } from '../data/questions';
import { Button } from './ui/button';
import ShareableGenerator from './ShareableGenerator';
import { db, ref, push, set, serverTimestamp } from '../lib/firebase';
import toast from 'react-hot-toast';

interface QuizGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizGame({ isOpen, onClose }: QuizGameProps) {
  const [gameState, setGameState] = useState<'setup' | 'countdown' | 'playing' | 'feedback' | 'finished'>('setup');
  const [userName, setUserName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [showShareable, setShowShareable] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);

  // Text-to-speech state variables
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      // Auto-submit when time runs out
      handleAnswer('');
    }
  }, [gameState, timeLeft]);

  // Countdown effect
  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setTimeLeft(15);
    }
  }, [gameState, countdown]);

  // Text-to-speech setup
  useEffect(() => {
    // Check if text-to-speech is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      setSpeechSupported(true);
    }
  }, []);

  // Auto-read question when a new question starts
  useEffect(() => {
    if (gameState === 'playing' && speechSupported && speechSynthesis) {
      // Small delay to let the UI render first
      const timer = setTimeout(() => {
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        const currentQuestion = questions[currentQuestionIndex];
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
        
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        speechSynthesis.speak(utterance);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, gameState, speechSupported, speechSynthesis]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const startGame = () => {
    if (userName.trim()) {
      localStorage.setItem('herbalistName', userName);
      setGameState('countdown');
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    
    // Show score feedback
    if (correct) {
      toast.success('🎉 Correct! +100 points', { duration: 2000 });
    } else {
      toast.error('❌ Wrong answer! -50 points', { duration: 2000 });
    }
    
    if (correct) {
      setScore(score + 100);
    } else {
      setScore(Math.max(0, score - 50));
    }

    setGameState('feedback');

    // Move to next question or finish game
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(15);
        setGameState('playing');
      } else {
        handleGameOver();
      }
    }, 2000);
  };

  const handleGameOver = async () => {
    setGameState('finished');
    setSaveStatus('saving');
    
    // Save score to Realtime Database
    try {
      const scoresRef = ref(db, 'scores');
      const newScoreRef = push(scoresRef);
      
      await set(newScoreRef, {
        userName: userName,
        score: score,
        totalQuestions: questions.length,
        correctAnswers: Math.floor(score / 100), // Each correct answer is 100 points
        timestamp: serverTimestamp(),
        timestampNumber: Date.now() // For sorting purposes
      });
      
      console.log('Score saved successfully to Realtime Database!');
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving score:', error);
      setSaveStatus('error');
    }
  };


  // Text-to-speech functions
  const speakQuestion = () => {
    if (speechSynthesis && speechSupported && gameState === 'playing') {
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const currentQuestion = questions[currentQuestionIndex];
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('Failed to read question aloud!');
      };
      
      speechSynthesis.speak(utterance);
      toast.success('🔊 Reading question aloud...');
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const resetGame = () => {
    // Stop any ongoing speech
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    
    setGameState('setup');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCountdown(3);
    setShowShareable(false);
    setSaveStatus(null);
    setIsSpeaking(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!isOpen) return null;

  return (
    <div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cyber-gray border border-cyber-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-cyber-border">
                <h2 className="text-2xl font-bold text-cyber-green">
                  The Herbalist's Challenge
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Game Content */}
              <div className="p-6">
                {/* Setup Phase */}
                {gameState === 'setup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Welcome, Future Herbalist!
                      </h3>
                      <p className="text-gray-300">
                        Enter your herbalist name to begin the challenge
                      </p>
                    </div>
                    
                    <div className="max-w-md mx-auto">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your Herbalist Name"
                        className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-green focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && startGame()}
                      />
                    </div>
                    
                    <Button
                      onClick={startGame}
                      disabled={!userName.trim()}
                      size="lg"
                      className="px-8"
                    >
                      Begin Challenge
                    </Button>
                  </motion.div>
                )}

                {/* Countdown Phase */}
                {gameState === 'countdown' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      key={countdown}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-8xl font-bold text-cyber-green glow-text"
                    >
                      {countdown}
                    </motion.div>
                  </motion.div>
                )}

                {/* Playing Phase */}
                {(gameState === 'playing' || gameState === 'feedback') && (
                  <div className="space-y-6">
                    {/* Progress and Timer */}
                    <div className="flex justify-between items-center">
                      <div className="text-white">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-cyber-green font-semibold">
                          Score: {score}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Timer className="w-5 h-5 text-cyan-400" />
                          <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-cyan-400'}`}>
                            {timeLeft}s
                          </span>
                        </div>
                        
                        {/* Speaker Controls */}
                        {speechSupported && gameState === 'playing' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={isSpeaking ? stopSpeaking : speakQuestion}
                            className={`
                              flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all duration-300
                              ${isSpeaking 
                                ? 'border-orange-500 bg-orange-500/20 text-orange-400 animate-pulse' 
                                : 'border-cyan-400 bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30'
                              }
                            `}
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="w-4 h-4" />
                                <span className="text-sm font-medium">Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Listen</span>
                              </>
                            )}
                          </motion.button>
                        )}

                      </div>
                    </div>


                    {/* Progress Bar */}
                    <div className="w-full bg-cyber-dark rounded-full h-2">
                      <div
                        className="bg-cyber-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      />
                    </div>

                    {/* Question */}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-8">
                        {currentQuestion.question}
                      </h3>

                      {/* Answer Options */}
                      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {currentQuestion.options.map((option) => (
                          <motion.button
                            key={option.id}
                            onClick={() => handleAnswer(option.id)}
                            disabled={gameState === 'feedback'}
                            whileHover={{ scale: gameState === 'playing' ? 1.05 : 1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                              relative p-4 rounded-lg border-2 transition-all duration-300
                              ${gameState === 'feedback' && selectedAnswer === option.id
                                ? isCorrect
                                  ? 'border-green-500 bg-green-500/20'
                                  : 'border-red-500 bg-red-500/20'
                                : gameState === 'feedback' && option.id === currentQuestion.correctAnswer
                                  ? 'border-green-500 bg-green-500/20'
                                  : 'border-cyber-border hover:border-cyber-green bg-cyber-dark'
                              }
                              ${gameState === 'playing' ? 'cursor-pointer' : 'cursor-not-allowed'}
                            `}
                          >
                            <div className="space-y-3">
                              <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border border-cyber-border">
                                <img
                                  src={option.imageSrc}
                                  alt={option.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-white font-medium">
                                {option.name}
                              </div>
                            </div>

                            {/* Feedback Icons */}
                            {gameState === 'feedback' && selectedAnswer === option.id && (
                              <div className="absolute top-2 right-2">
                                {isCorrect ? (
                                  <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-red-500" />
                                )}
                              </div>
                            )}
                            
                            {gameState === 'feedback' && option.id === currentQuestion.correctAnswer && selectedAnswer !== option.id && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Finished Phase */}
                {gameState === 'finished' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                  >
                    <div>
                      <h3 className="text-3xl font-bold text-cyber-green mb-2">
                        Challenge Complete!
                      </h3>
                      <p className="text-xl text-white mb-4">
                        Well done, Herbalist {userName}!
                      </p>
                      <div className="text-4xl font-bold text-cyan-400 mb-4">
                        Final Score: {score} points
                      </div>
                      
                      {/* Save Status */}
                      <div className="mb-6">
                        {saveStatus === 'saving' && (
                          <div className="text-yellow-400 flex items-center justify-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                            <span>Saving to leaderboard...</span>
                          </div>
                        )}
                        {saveStatus === 'saved' && (
                          <div className="text-green-400 flex items-center justify-center space-x-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Score saved! Check the leaderboard!</span>
                          </div>
                        )}
                        {saveStatus === 'error' && (
                          <div className="text-red-400 flex items-center justify-center space-x-2">
                            <XCircle className="w-5 h-5" />
                            <span>Failed to save score. Please try again.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto">
                      <Button
                        onClick={() => setShowShareable(true)}
                        size="lg"
                        className="w-full"
                      >
                        Generate Shareable Card
                      </Button>
                      
                      <Button
                        onClick={resetGame}
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        Play Again
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shareable Generator */}
      <ShareableGenerator
        userName={userName}
        plantName={questions[Math.floor(Math.random() * questions.length)].options[0].name}
        plantImageSrc={questions[Math.floor(Math.random() * questions.length)].options[0].imageSrc}
        score={score}
        isOpen={showShareable}
        onClose={() => setShowShareable(false)}
      />
    </div>
  );
}