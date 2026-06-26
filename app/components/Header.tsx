'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Brain, Calendar, User, LogOut, Leaf, Plane, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  userProfile: any;
  onLogout: () => void;
  onNavigate: (section: string) => void;
  currentSection: string;
}

export default function Header({ userProfile, onLogout, onNavigate, currentSection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Leaf,
      description: 'About Vriksha Gyan'
    },
    {
      id: 'wellness',
      label: 'Wellness Quiz',
      icon: Sparkles,
      description: 'Discover your personalized herbs'
    },
    {
      id: 'retreat',
      label: 'Wellness Retreat',
      icon: Plane,
      description: 'AI-powered retreat planner'
    },
    {
      id: 'doctors',
      label: 'Find AYUSH Doctors',
      icon: MapPin,
      description: 'Verified practitioners near you'
    },
    {
      id: 'calendar',
      label: 'Seasonal Calendar',
      icon: Calendar,
      description: 'Ayurvedic seasonal wisdom'
    }
  ];

  return (
    <>
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-cyber-dark/95 backdrop-blur-sm border-b border-cyber-green/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-cyber-green/20 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-cyber-green" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-cyber-green">Vriksha Gyan</h1>
              <p className="text-xs text-gray-400">Living Library</p>
            </div>
          </div>

          {/* User Info & Menu Toggle */}
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-cyber-gray rounded-lg border border-cyber-green/30">
                <User className="w-4 h-4 text-cyber-green" />
                <div>
                  <p className="text-sm font-semibold text-white">{userProfile.name}</p>
                  <p className="text-xs text-gray-400">{userProfile.region}</p>
                </div>
              </div>
            )}

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-cyber-green/20 hover:bg-cyber-green/30 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-cyber-green" />
              ) : (
                <Menu className="w-6 h-6 text-cyber-green" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-cyber-dark border-l-2 border-cyber-green/30 overflow-y-auto"
            >
              <div className="p-6">
                {/* Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Menu</h2>
                    <p className="text-sm text-gray-400">Navigate features</p>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg bg-cyber-gray hover:bg-cyber-green/20 transition-colors"
                  >
                    <X className="w-6 h-6 text-cyber-green" />
                  </button>
                </div>

                {/* User Profile in Menu (Mobile) */}
                {userProfile && (
                  <div className="md:hidden mb-6 p-4 bg-cyber-gray rounded-lg border border-cyber-green/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-cyber-green/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-cyber-green" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{userProfile.name}</p>
                        <p className="text-sm text-gray-400">{userProfile.region}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <nav className="space-y-3 mb-8">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          isActive
                            ? 'bg-cyber-green/10 border-cyber-green'
                            : 'bg-cyber-gray border-cyber-border hover:border-cyber-green/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isActive ? 'bg-cyber-green/20' : 'bg-cyber-dark'
                          }`}>
                            <Icon className={`w-6 h-6 ${isActive ? 'text-cyber-green' : 'text-gray-400'}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${isActive ? 'text-cyber-green' : 'text-white'}`}>
                              {item.label}
                            </h3>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Logout Button */}
                {userProfile && (
                  <div className="pt-6 border-t border-cyber-border">
                    <Button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-cyber-border">
                  <p className="text-center text-sm text-gray-500">
                    <span className="text-cyber-green font-semibold">Pixel_Pioneers</span>
                    <br />
                    <span className="inline-flex items-center gap-1">
                      🚀 Hack Karnataka
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
