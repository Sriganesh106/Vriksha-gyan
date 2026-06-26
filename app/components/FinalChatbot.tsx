'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User } from 'lucide-react';
import { getAyurvedicAIResponse } from '../lib/geminiAI';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function FinalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🙏 Namaste! I'm Dr. Vaidya, your traditional Ayurvedic physician with over 30 years of experience in Dravyaguna Shastra (medicinal plant science).\n\n🌿 I can guide you through:\n• Sanskrit names & botanical classifications\n• Traditional preparations (churna, kwath, ghrita)\n• Dosha-specific usage & seasonal recommendations\n• Proper dosages & contraindications\n• Ancient wisdom from Charaka Samhita & Sushruta Samhita\n\nWhich sacred plant medicine would you like to explore today? 🕉️",
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

  // Smart response handler for common interactions
  const getSmartResponse = (input: string): string | null => {
    const lowerInput = input.toLowerCase().trim();
    
    // Check for specific plant names FIRST - if found, let AI handle it
    const specificPlants = ['tulsi', 'basil', 'ashwagandha', 'turmeric', 'haldi', 'cardamom', 'ela', 'elaichi', 'ginger', 'adrak', 'neem', 'amla', 'brahmi', 'thyme'];
    if (specificPlants.some(plant => lowerInput.includes(plant))) {
      return null; // Let AI handle specific plant questions
    }
    
    // Greetings
    if (['hi', 'hello', 'hey', 'namaste', 'namaskar'].some(greeting => lowerInput.includes(greeting))) {
      return "🙏 Namaste! Welcome to my Ayurvedic consultation. I'm Dr. Vaidya, and I'm delighted to share the ancient wisdom of medicinal plants with you.\n\n🌿 How may I guide you today? You can ask me about:\n• Specific herbs and their traditional uses\n• Dosha-based plant recommendations\n• Seasonal herbal guidance\n• Traditional preparation methods\n\nWhich aspect of plant medicine interests you most?";
    }
    
    // Thank you responses
    if (['thank', 'thanks', 'dhanyawad'].some(thanks => lowerInput.includes(thanks))) {
      return "🙏 You're most welcome! It brings me great joy to share this sacred knowledge of plant medicine. May these herbs bring you health and harmony.\n\n🌿 Feel free to ask me anything else about Ayurvedic plant wisdom. I'm here to guide you on your wellness journey!";
    }
    
    // General plant questions (only if no specific plant mentioned)
    if (lowerInput.includes('plant') && !lowerInput.includes('specific')) {
      return "🌿 Ah, plants - the divine gift of nature! In Ayurveda, we call them 'Vanaspati' (forest lords). Each plant has unique properties:\n\n🌱 **Rasa** (taste) - Sweet, sour, salty, pungent, bitter, astringent\n🔥 **Virya** (potency) - Heating or cooling effect\n🌀 **Prabhava** (special effect) - Unique therapeutic action\n\nWhich specific plant would you like to explore? I can share its traditional uses, Sanskrit name, and preparation methods.";
    }
    
    // General herbs questions
    if (['herb', 'herbs', 'medicine', 'ayurveda'].some(term => lowerInput.includes(term)) && lowerInput.length < 20) {
      return "🙏 Namaste! Let me share some sacred herbal wisdom with you:\n\n🌿 **Essential Ayurvedic Herbs:**\n\n**🌱 Tulsi (Vishnu Priya)** - The Queen of Herbs\n• Tridoshic - balances all three doshas\n• Chew 2-3 leaves at sunrise for immunity\n• Sacred to Lord Vishnu, purifies mind & body\n\n**💪 Ashwagandha (Horse's Strength)** - Ultimate Rasayana\n• Best for Vata dosha, builds Ojas (vitality)\n• 1-3g with warm milk before bed\n• Reduces stress, enhances strength\n\n**✨ Turmeric (Haridra)** - Golden Goddess\n• Anti-inflammatory, purifies blood\n• Golden milk with black pepper\n• Excellent for skin and liver health\n\n**🌿 Cardamom (Ela)** - Queen of Spices\n• Digestive fire enhancer, heart tonic\n• Chew 1-2 pods after meals\n• Balances Kapha, freshens breath\n\nWhich herb calls to you? I can share deeper wisdom about any of these sacred plants! 🕉️";
    }
    
    // Goodbye responses
    if (['bye', 'goodbye', 'see you', 'alvida'].some(bye => lowerInput.includes(bye))) {
      return "🙏 May you be blessed with perfect health and harmony! Remember the wisdom of our ancestors - 'Sarve bhavantu sukhinah' (May all beings be happy).\n\n🌿 Keep the sacred knowledge of plants close to your heart. Until we meet again, stay connected with nature's healing power!\n\nNamaste! 🕉️";
    }
    
    return null; // No smart response found, use AI
  };

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
      // Check for smart responses first
      const smartResponse = getSmartResponse(currentInput);
      
      let responseText: string;
      if (smartResponse) {
        responseText = smartResponse;
      } else {
        responseText = await getAyurvedicAIResponse(currentInput);
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      // toast.success('🌿 Dr. Vaidya responded!');
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "🙏 Namaste! I'm Dr. Vaidya, experiencing some technical difficulties with my consultation system. However, I can still share some traditional plant wisdom!\n\n🌿 **Quick Remedies:**\n• **Tulsi** - Chew 2-3 leaves for immunity\n• **Ginger** - With honey for digestion\n• **Turmeric** - Golden milk for inflammation\n\nPlease try your question again, or ask about specific herbs!",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
      // toast.error('Connection issue - please try again!');
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

  const plantSuggestions = [
    { name: "Tulsi", icon: "🌿", query: "Tell me about Tulsi's Sanskrit name, traditional uses, and preparation methods" },
    { name: "Cardamom", icon: "🌱", query: "What is the Ayurvedic significance of Cardamom and how should it be used for different doshas?" },
    { name: "Ashwagandha", icon: "💪", query: "Explain Ashwagandha as a Rasayana - its traditional preparation and contraindications" },
    { name: "Turmeric", icon: "✨", query: "Share the traditional Ayurvedic knowledge of Turmeric including Sanskrit name and seasonal usage" }
  ];

  const quickQuestions = [
    "What are the traditional preparation methods for herbal medicines?",
    "How to determine the right dosage according to Ayurvedic principles?",
    "Which herbs are best for balancing Vata dosha during winter season?"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          background: 'linear-gradient(135deg, #10b981, #06d6a0)',
          color: 'black',
          padding: '12px 20px',
          borderRadius: '25px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
        }}
      >
        <Bot size={20} />
        <span>Ask Dr. Vaidya</span>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #1f2937, #111827)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
              height: '700px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #10b981',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 214, 160, 0.1))',
              borderRadius: '16px 16px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #10b981, #06d6a0)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot color="black" size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#10b981', fontWeight: 'bold', fontSize: '18px' }}>Dr. Vaidya AI</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9ca3af' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                    Ayurvedic Expert Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ef4444',
                  padding: '8px',
                  borderRadius: '8px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map(message => (
                <div key={message.id} style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    maxWidth: '85%',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: message.sender === 'user' 
                        ? '#10b981' 
                        : 'linear-gradient(135deg, #06d6a0, #10b981)'
                    }}>
                      {message.sender === 'user' ? (
                        <User color="black" size={16} />
                      ) : (
                        <Bot color="black" size={16} />
                      )}
                    </div>
                    
                    {/* Message */}
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      whiteSpace: 'pre-line',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      background: message.sender === 'user'
                        ? '#10b981'
                        : '#374151',
                      color: message.sender === 'user' ? 'black' : 'white',
                      borderBottomRightRadius: message.sender === 'user' ? '4px' : '12px',
                      borderBottomLeftRadius: message.sender === 'user' ? '12px' : '4px'
                    }}>
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #06d6a0, #10b981)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Bot color="black" size={16} />
                    </div>
                    <div style={{
                      background: '#374151',
                      border: '1px solid #10b981',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      borderBottomLeftRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></div>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '0.2s' }}></div>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Plant Suggestions */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #374151',
              background: 'rgba(16, 185, 129, 0.05)'
            }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#9ca3af' }}>🌿 Quick plant queries:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {plantSuggestions.map(plant => (
                  <button
                    key={plant.name}
                    onClick={() => handleQuickQuestion(plant.query)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      padding: '8px 12px',
                      background: '#374151',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#10b981',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#10b981';
                      e.currentTarget.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#374151';
                      e.currentTarget.style.color = '#10b981';
                    }}
                  >
                    <span>{plant.icon}</span>
                    <span>{plant.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Questions */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #374151',
              background: 'rgba(6, 214, 160, 0.05)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {quickQuestions.map(question => (
                  <button
                    key={question}
                    onClick={() => handleQuickQuestion(question)}
                    style={{
                      fontSize: '11px',
                      padding: '6px 10px',
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#06d6a0',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#06d6a0';
                      e.currentTarget.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1f2937';
                      e.currentTarget.style.color = '#06d6a0';
                    }}
                  >
                    {question.split(' ').slice(0, 3).join(' ')}...
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid #10b981',
              background: '#1f2937'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
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
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: '#374151',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  style={{
                    padding: '12px 16px',
                    background: !inputText.trim() || isTyping ? '#6b7280' : '#10b981',
                    color: 'black',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: !inputText.trim() || isTyping ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isTyping ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid black',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                ⚡ Powered by Gemini AI • Press Enter to send
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
