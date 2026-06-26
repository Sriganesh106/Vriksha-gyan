'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, X, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { firebaseAuthService } from '../lib/firebaseAuth';

interface SimpleLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: any) => void;
}

const indianRegions = [
  'North India',
  'South India',
  'East India',
  'West India',
  'Central India',
  'Northeast India'
];

export default function SimpleLogin({ isOpen, onClose, onLogin }: SimpleLoginProps) {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !region) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const profile = {
        name: name.trim(),
        region,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save to Firebase
      try {
        await firebaseAuthService.saveUserProfile(profile);
        console.log('✅ Profile saved to Firebase');
      } catch (firebaseError) {
        console.warn('Firebase save failed, using localStorage:', firebaseError);
      }

      // Save to localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('ayurvedicProfile', JSON.stringify(profile));
      }

      onLogin(profile);
      onClose();
      
      // Reset form
      setName('');
      setRegion('');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md"
        >
          <Card className="bg-cyber-gray border-2 border-cyber-green/30 p-8 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-cyber-green transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-cyber-green" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome to <span className="text-cyber-green">Vriksha Gyan</span>
              </h2>
              <p className="text-gray-400">
                Enter your details to begin your wellness journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-green focus:outline-none transition-colors"
                  disabled={isLoading}
                />
              </div>

              {/* Region Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Your Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white focus:border-cyber-green focus:outline-none transition-colors"
                  disabled={isLoading}
                >
                  <option value="">Select your region</option>
                  {indianRegions.map((r) => (
                    <option key={r} value={r} className="bg-cyber-dark">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-lg bg-cyber-green text-cyber-dark hover:bg-cyber-green/90 font-semibold"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </span>
                ) : (
                  'Start Your Journey'
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Your data is securely stored and used only to personalize your experience
            </p>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
