'use client';

import React, { useState } from 'react';

export default function APITest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing API...');

    const API_KEY = 'AIzaSyDzHhHhNNuDNlOl3T_P9g0ovti5qZ333Ak';
    const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    console.log('🔑 Testing with API Key:', API_KEY.substring(0, 10) + '...');
    console.log('🌐 Testing URL:', URL);

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: 'Hello! Please say hi back.'
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 100,
          }
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        setResult(`❌ API Error: ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Success response:', JSON.stringify(data, null, 2));
      
      // Check if response was blocked by safety filters
      if (data.candidates && data.candidates[0] && data.candidates[0].finishReason) {
        console.log('🛡️ Finish reason:', data.candidates[0].finishReason);
        if (data.candidates[0].finishReason === 'SAFETY') {
          setResult(`❌ Response blocked by safety filters. Try a simpler question.`);
          return;
        }
      }

      // Detailed response parsing with error checking
      if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
        setResult(`❌ No candidates in response: ${JSON.stringify(data)}`);
        return;
      }

      const candidate = data.candidates[0];
      if (!candidate || !candidate.content) {
        setResult(`❌ No content in candidate: ${JSON.stringify(candidate)}`);
        return;
      }

      // Handle different response formats
      const content = candidate.content;
      let text = null;

      // Check if content has parts (standard format)
      if (content.parts && Array.isArray(content.parts) && content.parts.length > 0) {
        text = content.parts[0].text;
      }
      // Check if content has direct text
      else if (content.text) {
        text = content.text;
      }
      // Check if candidate has direct text
      else if (candidate.text) {
        text = candidate.text;
      }

      if (text) {
        setResult(`✅ API Working! Response: ${text}`);
      } else {
        setResult(`❌ No text found in response. Full content: ${JSON.stringify(content)}`);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setResult(`❌ Network Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded-lg p-4 max-w-md">
      <h3 className="font-bold text-black mb-2">🧪 API Test</h3>
      <button
        onClick={testAPI}
        disabled={loading}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 mb-2"
      >
        {loading ? 'Testing...' : 'Test Gemini API'}
      </button>
      <div className="text-sm text-black bg-gray-100 p-2 rounded max-h-40 overflow-y-auto">
        {result || 'Click to test API'}
      </div>
    </div>
  );
}
