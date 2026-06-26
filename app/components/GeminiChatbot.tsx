// app/components/GeminiChatbot.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Leaf, Sparkles, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { getAyurvedicAIResponse, getQuickPlantInfo } from '../lib/geminiAI';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🙏 Namaste! I'm Dr. Vaidya, your AI-powered Ayurvedic expert. I have deep knowledge of traditional Indian medicinal plants and their healing properties.\n\nAsk me about any herb - Tulsi, Neem, Ashwagandha, Turmeric, or any plant medicine question! I'll share traditional wisdom backed by centuries of Ayurvedic practice. 🌿",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await getAyurvedicAIResponse(currentInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      toast.success('🌿 Dr. Vaidya responded!');
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "🌿 I apologize, but I'm experiencing some technical difficulties connecting to my knowledge base. Please try asking your question again, or ask me about specific plants like Tulsi, Neem, Ashwagandha, or Turmeric!",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
      toast.error('Connection issue - please try again!');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const quickQuestions = [
    "What are the benefits of Tulsi?",
    "How to use Ashwagandha for stress?",
    "Neem uses for skin problems?",
    "Best herbs for immunity?",
    "Turmeric dosage and benefits?",
    "What is Ayurveda?"
  ];

  const plantSuggestions = [
    { name: "Tulsi", icon: "🌿", query: "Tell me about Tulsi benefits" },
    { name: "Neem", icon: "🌳", query: "How to use Neem medicinally?" },
    { name: "Ashwagandha", icon: "💪", query: "Ashwagandha for stress relief" },
    { name: "Turmeric", icon: "✨", query: "Turmeric health benefits" }
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyber-green to-cyan-400 text-black p-4 rounded-full shadow-lg hover:scale-110 transition-transform pulse-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6" />
          <span className="hidden md:block font-semibold">Ask Dr. Vaidya</span>
        </div>
        
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center md:justify-end p-4"
            onClick={(e) => {
              // Only close if clicking the backdrop, not the modal content
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 100 }}
              className="bg-cyber-gray border border-cyber-border rounded-lg w-full md:w-[420px] h-[85vh] md:h-[650px] flex flex-col cyber-border"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-cyber-border bg-gradient-to-r from-cyber-green/10 to-cyan-400/10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyber-green to-cyan-400 rounded-full flex items-center justify-center">
                    <Bot className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-cyber-green">Dr. Vaidya AI</h3>
                    <div className="text-xs text-gray-400 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Ayurvedic Expert Online
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-500/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-cyber-dark/50 to-cyber-gray">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-cyber-green text-black' 
                          : 'bg-gradient-to-r from-cyan-400 to-cyber-green text-black'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      {/* Message */}
                      <div
                        className={`p-3 rounded-lg whitespace-pre-line ${
                          message.sender === 'user'
                            ? 'bg-cyber-green text-black rounded-br-none'
                            : 'bg-cyber-dark border border-cyber-border text-white rounded-bl-none'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-cyber-green rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-black" />
                      </div>
                      <div className="bg-cyber-dark border border-cyber-border p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Plant Suggestions */}
              <div className="p-3 border-t border-cyber-border bg-cyber-dark/50">
                <p className="text-xs text-gray-400 mb-2">🌿 Quick plant queries:</p>
                <div className="grid grid-cols-2 gap-2">
                  {plantSuggestions.map(plant => (
                    <button
                      key={plant.name}
                      onClick={() => handleQuickQuestion(plant.query)}
                      className="flex items-center space-x-2 text-xs px-2 py-1 bg-cyber-gray border border-cyber-border rounded text-cyber-green hover:bg-cyber-green hover:text-black transition-colors"
                    >
                      <span>{plant.icon}</span>
                      <span>{plant.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Questions */}
              <div className="p-3 border-t border-cyber-border bg-cyber-dark/30">
                <div className="flex flex-wrap gap-1 mb-2">
                  {quickQuestions.slice(0, 3).map(question => (
                    <button
                      key={question}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs px-2 py-1 bg-cyber-dark border border-cyber-border rounded text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
                    >
                      {question.split(' ').slice(0, 3).join(' ')}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-cyber-border bg-cyber-dark">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isTyping && inputText.trim()) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask Dr. Vaidya about any medicinal plant..."
                    disabled={isTyping}
                    className="flex-1 px-3 py-2 bg-cyber-gray border border-cyber-border rounded text-white placeholder-gray-400 focus:border-cyber-green focus:outline-none disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    size="icon"
                    className="bg-cyber-green text-black hover:bg-cyber-green/80 disabled:opacity-50"
                  >
                    {isTyping ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ⚡ Powered by Gemini AI • Press Enter to send
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
