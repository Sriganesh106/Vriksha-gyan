'use client';

import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { getAyurvedicAIResponse } from '../lib/geminiAI';
import toast from 'react-hot-toast';

export default function WorkingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<string[]>(['🙏 Hello! I am Dr. Vaidya, your AI Ayurvedic expert. Ask me about any medicinal plant!']);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userQuestion = inputText.trim();
    setMessages(prev => [...prev, `You: ${userQuestion}`]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await getAyurvedicAIResponse(userQuestion);
      setMessages(prev => [...prev, `Dr. Vaidya: ${response}`]);
      toast.success('🌿 Dr. Vaidya responded!');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, `Dr. Vaidya: I apologize, I'm having technical difficulties. Please try again.`]);
      toast.error('Connection issue - please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    { text: 'Tulsi', query: 'What are the benefits of Tulsi?' },
    { text: 'Neem', query: 'How to use Neem for skin problems?' },
    { text: 'Ashwagandha', query: 'Ashwagandha for stress relief?' },
    { text: 'Turmeric', query: 'Benefits of Turmeric?' }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          backgroundColor: '#10b981',
          color: 'white',
          padding: '16px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Bot size={24} />
        <span style={{ display: 'none' }}>Ask Dr. Vaidya</span>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f0fdf4',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot color="white" size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#065f46', fontWeight: 'bold' }}>Dr. Vaidya AI</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Ayurvedic Expert</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#ef4444',
              padding: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              padding: '12px',
              backgroundColor: msg.startsWith('You:') ? '#dbeafe' : '#f0fdf4',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#1f2937'
            }}>
              {msg}
            </div>
          ))}
          {isLoading && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#92400e'
            }}>
              🤔 Dr. Vaidya is thinking...
            </div>
          )}
        </div>

        {/* Quick Questions */}
        <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>🌿 Quick questions:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {quickQuestions.map(q => (
              <button
                key={q.text}
                onClick={() => setInputText(q.query)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about any medicinal plant..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              style={{
                padding: '12px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: (!inputText.trim() || isLoading) ? 0.5 : 1
              }}
            >
              {isLoading ? '...' : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
