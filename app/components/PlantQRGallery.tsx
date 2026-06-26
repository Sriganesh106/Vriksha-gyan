'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { herbs } from '../data/wellness-quiz';

interface PlantQRGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlant?: string;
}

export default function PlantQRGallery({ isOpen, onClose, selectedPlant }: PlantQRGalleryProps) {
  if (!isOpen) return null;

  const displayHerbs = selectedPlant 
    ? [herbs[selectedPlant]].filter(Boolean)
    : Object.values(herbs);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-6xl my-8 bg-cyber-dark border-2 border-cyber-green/30 rounded-2xl"
        >
          <div className="sticky top-0 z-10 bg-cyber-dark border-b border-cyber-green/30 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedPlant ? herbs[selectedPlant]?.name : 'All Sacred Plants'} 
                  <span className="text-cyber-green"> AR Experience</span>
                </h2>
                <p className="text-gray-400">
                  Scan QR codes to explore plants in immersive augmented reality
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-cyber-gray hover:bg-cyber-green/20 transition-colors"
              >
                <X className="w-6 h-6 text-cyber-green" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[75vh] overflow-y-auto">
            <div className={`grid ${selectedPlant ? 'grid-cols-1 max-w-md mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
              {displayHerbs.map((herb, index) => (
                <motion.div
                  key={herb.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-cyber-gray border-2 border-cyber-green/30 p-4 hover:border-cyber-green transition-all flex flex-col h-full">
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold text-white mb-1">{herb.name}</h3>
                      <p className="text-xs text-gray-400 italic">{herb.scientificName}</p>
                    </div>

                    <div className="bg-white rounded-lg p-3 mb-3 mx-auto" style={{ maxWidth: selectedPlant ? '280px' : '200px' }}>
                      <img
                        src={herb.qrCode}
                        alt={`${herb.name} QR Code`}
                        className="w-full h-auto"
                      />
                    </div>

                    <p className="text-cyber-green text-xs font-semibold mb-3 text-center px-2 flex-grow min-h-[2.5rem] flex items-center justify-center">
                      {herb.oneLiner}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
