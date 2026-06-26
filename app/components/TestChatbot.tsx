'use client';

import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';

export default function TestChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<string[]>(['Hello! I am Dr. Vaidya. Ask me anything about plants!']);

  const handleSend = () => {
    console.log('SEND CLICKED - Input text:', inputText);
    if (inputText.trim()) {
      setMessages(prev => [...prev, `You: ${inputText}`, `Dr. Vaidya: Thank you for asking about "${inputText}". This is a test response!`]);
      setInputText('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('INPUT CHANGED:', e.target.value);
    setInputText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('KEY PRESSED:', e.key);
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Test Button */}
      <button
        onClick={() => {
          console.log('OPEN BUTTON CLICKED');
          setIsOpen(true);
        }}
        className="fixed bottom-6 left-6 z-50 bg-blue-500 text-white p-4 rounded-full"
      >
        <Bot className="w-6 h-6" />
        Test Chat
      </button>

      {/* Simple Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-black">Test Dr. Vaidya</h3>
              <button
                onClick={() => {
                  console.log('CLOSE BUTTON CLICKED');
                  setIsOpen(false);
                }}
                className="text-black hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded text-black text-sm">
                  {msg}
                </div>
              ))}
            </div>

            {/* Test Buttons */}
            <div className="p-2 border-t">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => {
                    console.log('TEST BUTTON 1 CLICKED');
                    setInputText('What is Tulsi?');
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded text-xs"
                >
                  Test Tulsi
                </button>
                <button
                  onClick={() => {
                    console.log('TEST BUTTON 2 CLICKED');
                    setInputText('Benefits of Neem?');
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded text-xs"
                >
                  Test Neem
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onClick={() => console.log('INPUT CLICKED')}
                  onFocus={() => console.log('INPUT FOCUSED')}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-black focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
