'use client';

import React, { useState } from 'react';
import { getAyurvedicAIResponse } from '../lib/geminiAI';

export default function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<string[]>(['🙏 Hello! I am Dr. Vaidya. Ask me about any medicinal plant!']);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userQuestion = inputText.trim();
    setMessages(prev => [...prev, `You: ${userQuestion}`]);
    setInputText('');
    setIsLoading(true);

    try {
      console.log('🚀 Calling Gemini API with:', userQuestion);
      const response = await getAyurvedicAIResponse(userQuestion);
      console.log('✅ Got response:', response);
      setMessages(prev => [...prev, `Dr. Vaidya: ${response}`]);
    } catch (error) {
      console.error('❌ Error:', error);
      setMessages(prev => [...prev, `Dr. Vaidya: Sorry, I'm having technical difficulties. Please try again.`]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg"
      >
        🌿 Dr. Vaidya
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-green-100">
          <h3 className="font-bold text-green-800">🌿 Dr. Vaidya AI</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded text-sm text-black">
              {msg}
            </div>
          ))}
          {isLoading && (
            <div className="p-2 bg-blue-100 rounded text-sm text-blue-800">
              🤔 Dr. Vaidya is thinking...
            </div>
          )}
        </div>

        {/* Quick Buttons */}
        <div className="p-2 border-t">
          <div className="flex gap-2 mb-2 flex-wrap">
            <button
              onClick={() => setInputText('What are the benefits of Tulsi?')}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs"
            >
              Tulsi
            </button>
            <button
              onClick={() => setInputText('How to use Neem for skin?')}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs"
            >
              Neem
            </button>
            <button
              onClick={() => setInputText('Ashwagandha for stress relief?')}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs"
            >
              Ashwagandha
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about any medicinal plant..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-black focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? '...' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
