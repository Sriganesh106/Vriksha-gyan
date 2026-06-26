'use client';

import React, { useState } from 'react';

export default function ModelChecker() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkModels = async () => {
    setLoading(true);
    setResult('Checking available models...');

    const API_KEY = 'AIzaSyDzHhHhNNuDNlOl3T_P9g0ovti5qZ333Ak';
    
    // Try different API versions to see what works
    const urls = [
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`,
    ];

    for (const url of urls) {
      try {
        console.log('🔍 Checking:', url);
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Models found:', data);
          setResult(`✅ Available models: ${JSON.stringify(data, null, 2)}`);
          return;
        } else {
          const errorText = await response.text();
          console.log('❌ Error for', url, ':', errorText);
        }
      } catch (error) {
        console.log('❌ Network error for', url, ':', error);
      }
    }
    
    setResult('❌ Could not fetch models from any API version');
    setLoading(false);
  };

  return (
    <div className="fixed top-20 left-4 z-50 bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-md">
      <h3 className="font-bold text-black mb-2">🔍 Model Checker</h3>
      <button
        onClick={checkModels}
        disabled={loading}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 mb-2"
      >
        {loading ? 'Checking...' : 'List Available Models'}
      </button>
      <div className="text-xs text-black bg-white p-2 rounded max-h-60 overflow-y-auto">
        {result || 'Click to check available models'}
      </div>
    </div>
  );
}
