'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Copy, Star, Award, Leaf } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from './ui/button';

interface ShareableGeneratorProps {
  userName: string;
  plantName: string;
  plantImageSrc: string;
  score: number;
  isOpen: boolean;
  onClose: () => void;
  constitution?: string;
  plantBenefits?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert';
  completionTime?: string;
}

export default function ShareableGenerator({
  userName,
  plantName,
  plantImageSrc,
  score,
  isOpen,
  onClose,
  constitution = "Vata",
  plantBenefits = ["Digestive Health", "Respiratory Support"],
  difficulty = "Intermediate",
  completionTime = "2:30"
}: ShareableGeneratorProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCard = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('herbarium-card');
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#0a0a0a',
          scale: 3,
          width: 450,
          height: 700,
          useCORS: true,
          allowTaint: true,
        });
        const image = canvas.toDataURL('image/png');
        setGeneratedImage(image);
      }
    } catch (error) {
      console.error('Error generating card:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCard = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.download = `vriksha-gyan-${userName}-card.png`;
      link.href = generatedImage;
      link.click();
    }
  };

  const shareToSocial = async (platform: 'instagram' | 'twitter' | 'whatsapp') => {
    if (generatedImage) {
      const shareText = `🌿 Just mastered ${plantName} in Vriksha Gyan! Scored ${score} points as a ${difficulty} level Herbalist! 
      
Perfect for ${constitution} constitution 💚
      
#VrikshaGyan #DigitalHerbarium #AyurvedicWisdom #PlantKnowledge #${plantName.replace(/\s+/g, '')}`;

      if (platform === 'whatsapp') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
        return;
      }

      if (platform === 'twitter') {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, '_blank');
        return;
      }

      // Instagram/General sharing
      if (navigator.share) {
        try {
          const response = await fetch(generatedImage);
          const blob = await response.blob();
          const file = new File([blob], `vriksha-gyan-${plantName.toLowerCase()}-card.png`, { type: 'image/png' });
          
          await navigator.share({
            files: [file],
            title: `My ${plantName} Herbarium Card`,
            text: shareText
          });
        } catch (error) {
          copyToClipboard();
        }
      } else {
        copyToClipboard();
      }
    }
  };

  const copyToClipboard = async () => {
    if (generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Image copied to clipboard! Paste it into your Instagram story.');
      } catch (error) {
        alert('Unable to copy image. Please use the download button instead.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-cyber-gray border border-cyber-border rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cyber-green mb-2">
            Generate Your Herbarium Card
          </h2>
          <p className="text-gray-300">
            Create a shareable card of your achievement!
          </p>
        </div>

        {/* Enhanced Card Preview */}
        <div className="flex justify-center mb-6">
          <div
            id="herbarium-card"
            className="w-96 h-[600px] bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-dark border-2 border-cyber-green rounded-xl p-6 relative overflow-hidden"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-cyber-green/30 via-transparent to-cyan-400/20"></div>
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-4 right-4 w-8 h-8 border border-cyber-green/20 rounded-full"></div>
                <div className="absolute bottom-8 left-6 w-6 h-6 border border-cyan-400/20 rounded-full"></div>
                <div className="absolute top-1/3 left-4 w-4 h-4 bg-cyber-green/10 rounded-full"></div>
              </div>
            </div>
            
            {/* Header */}
            <div className="relative z-10 text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="w-5 h-5 text-cyber-green mr-2" />
                <div className="text-cyber-green text-xl font-bold tracking-wider">
                  VRIKSHA GYAN
                </div>
                <Leaf className="w-5 h-5 text-cyber-green ml-2" />
              </div>
              <div className="text-xs text-gray-400 tracking-widest">
                DIGITAL HERBARIUM
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyber-green to-transparent mt-2"></div>
            </div>
            
            {/* Plant Image with Enhanced Frame */}
            <div className="relative z-10 flex justify-center mb-4">
              <div className="relative">
                <div className="w-36 h-36 rounded-full border-3 border-cyber-green p-1 bg-gradient-to-br from-cyber-green/20 to-cyan-400/20">
                  <div className="w-full h-full rounded-full border-2 border-gray-800 overflow-hidden bg-cyber-gray">
                    <img
                      src={plantImageSrc}
                      alt={plantName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyber-green"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-cyber-green"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-cyber-green"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-cyber-green"></div>
              </div>
            </div>
            
            {/* Plant Name */}
            <div className="relative z-10 text-center mb-4">
              <div className="text-white text-xl font-bold mb-1">
                {plantName}
              </div>
              <div className="text-cyber-green text-sm font-medium">
                Herbalist: {userName}
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
              <div className="bg-cyber-gray/30 border border-cyber-green/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <div className="text-yellow-400 text-lg font-bold">{score}</div>
                </div>
                <div className="text-xs text-gray-400">POINTS</div>
              </div>
              
              <div className="bg-cyber-gray/30 border border-cyan-400/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Award className="w-4 h-4 text-cyan-400 mr-1" />
                  <div className="text-cyan-400 text-sm font-bold">{difficulty}</div>
                </div>
                <div className="text-xs text-gray-400">LEVEL</div>
              </div>
            </div>
            
            {/* Constitution & Benefits */}
            <div className="relative z-10 mb-4">
              <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3">
                <div className="text-center mb-2">
                  <div className="text-purple-300 text-sm font-semibold">Constitution Match</div>
                  <div className="text-purple-400 text-lg font-bold">{constitution}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Key Benefits:</div>
                  <div className="text-xs text-green-300">
                    {plantBenefits.slice(0, 2).join(" • ")}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Time & Achievement */}
            <div className="relative z-10 text-center mb-4">
              <div className="inline-flex items-center bg-gradient-to-r from-cyber-green/20 to-cyan-400/20 border border-cyber-green/50 rounded-full px-4 py-2">
                <div className="text-cyber-green text-xs font-medium">
                  Completed in {completionTime} • Ancient Wisdom Preserved
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="relative z-10 text-center">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyber-green to-transparent mx-auto mb-2"></div>
              <div className="text-xs text-gray-500 italic">
                "Every plant is a teacher, every leaf a lesson"
              </div>
              <div className="text-xs text-cyber-green/60 mt-1">
                🕉️ Ayurvedic Learning Platform
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {!generatedImage ? (
            <Button
              onClick={generateCard}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Card'}
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={downloadCard}
                variant="outline"
                className="w-full bg-cyber-green/10 border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black"
              >
                <Download className="w-4 h-4 mr-2" />
                Download HD Card
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => shareToSocial('instagram')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  IG
                </Button>
                
                <Button
                  onClick={() => shareToSocial('twitter')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  X
                </Button>
                
                <Button
                  onClick={() => shareToSocial('whatsapp')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  WA
                </Button>
              </div>
              
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Image
              </Button>
            </div>
          )}
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}