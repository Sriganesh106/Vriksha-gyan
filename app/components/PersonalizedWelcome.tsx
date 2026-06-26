'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Leaf, Sun, Cloud, Wind, Edit3, X, Save, Database, Sparkles, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getCurrentSeason } from '../data/seasonalCalendar';
import { firebaseAuthService } from '../lib/firebaseAuth';

interface PersonalizedWelcomeProps {
  userProfile: any;
  onLogout: () => void;
  onUpdateProfile?: (updatedProfile: any) => void;
}

export default function PersonalizedWelcome({ userProfile, onLogout, onUpdateProfile }: PersonalizedWelcomeProps) {
  const [currentSeason, setCurrentSeason] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: userProfile?.name || '',
    region: userProfile?.region || ''
  });

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
  }, []);

  if (!userProfile) return null;

  const constitution = userProfile.constitutionData;
  const todaysRecommendation = getTodaysRecommendation(userProfile, currentSeason);

  function getTodaysRecommendation(profile: any, season: any) {
    if (!season || !profile.constitutionData) return null;

    const constitutionHerbs = profile.constitutionData.idealHerbs;
    const seasonalHerbs = season.recommendedHerbs?.map((h: any) => h.plant) || [];
    
    // Find overlap between constitutional and seasonal recommendations
    const perfectHerb = constitutionHerbs.find((herb: string) => 
      seasonalHerbs.some((seasonal: string) => seasonal.toLowerCase().includes(herb.toLowerCase()))
    );

    return {
      herb: perfectHerb || constitutionHerbs[0],
      reason: `Perfect for ${profile.constitutionData.name} constitution during ${season.name}`,
      timing: "Morning",
      preparation: getPreparationTip(perfectHerb || constitutionHerbs[0], profile.constitution)
    };
  }

  function getPreparationTip(herb: string, constitution: string) {
    const preparations: any = {
      vata: "with warm milk and ghee",
      pitta: "with cool water or aloe juice", 
      kapha: "with honey and warm water"
    };

    return `Take ${herb.toLowerCase()} ${preparations[constitution]}`;
  }

  const handleUpdateProfile = () => {
    setUpdateForm({
      name: userProfile?.name || '',
      region: userProfile?.region || ''
    });
    setShowUpdateForm(true);
  };

  const saveProfileUpdate = async () => {
    try {
      const updatedProfile = {
        ...userProfile,
        name: updateForm.name,
        region: updateForm.region,
        updatedAt: new Date().toISOString()
      };

      // Update Firebase profile
      await firebaseAuthService.updateUserProfile(updatedProfile);
      
      // Save to localStorage (client-side only) for backward compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem('ayurvedicProfile', JSON.stringify(updatedProfile));
      }
      
      // Call parent update handler if provided
      if (onUpdateProfile) {
        onUpdateProfile(updatedProfile);
      }

      setShowUpdateForm(false);
      alert(`✅ Profile updated successfully in the cloud! Welcome ${updateForm.name}! 🌿`);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('❌ Error updating profile. Please try again.');
    }
  };

  return (
    <>
      {/* Floating Profile Button */}
      <motion.button
        onClick={() => setShowProfile(!showProfile)}
        className="fixed top-6 right-6 z-40 bg-gradient-to-r from-cyber-green to-cyan-400 text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">{constitution?.element}</span>
          <User className="w-5 h-5" />
        </div>
      </motion.button>

      {/* Personalized Banner */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-cyber-dark/95 to-cyber-gray/95 backdrop-blur-sm border-b border-cyber-border p-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{constitution?.element}</span>
              <div>
                <div className="text-cyber-green font-semibold">
                  Welcome back, {userProfile.name}!
                </div>
                <div className="text-sm text-gray-400">
                  {constitution?.name} Constitution • {currentSeason?.name}
                </div>
              </div>
            </div>
          </div>

          {todaysRecommendation && (
            <div className="hidden md:flex items-center space-x-3 bg-cyber-dark/50 border border-cyber-border rounded-lg px-4 py-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div className="text-sm">
                <div className="text-white font-medium">Today's Perfect Herb</div>
                <div className="text-cyan-400">{todaysRecommendation.herb}</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Profile Sidebar */}
      {showProfile && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-0 right-0 h-full w-80 bg-cyber-gray border-l border-cyber-border z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-cyber-green">Your Profile</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
                ×
              </Button>
            </div>

            {/* Constitution Summary */}
            <Card className="mb-6 cyber-border">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyber-green to-cyan-400 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">{constitution?.element}</span>
                </div>
                <CardTitle className="text-cyber-green">{constitution?.name} Constitution</CardTitle>
                <p className="text-sm text-gray-400">{constitution?.characteristics}</p>
              </CardHeader>
            </Card>

            {/* Today's Personalized Recommendation */}
            {todaysRecommendation && (
              <Card className="mb-6 bg-gradient-to-br from-green-900/30 to-cyber-dark border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Perfect for You Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-white">{todaysRecommendation.herb}</h4>
                      <p className="text-sm text-green-200">{todaysRecommendation.reason}</p>
                    </div>
                    <div className="text-xs text-gray-300">
                      💡 {todaysRecommendation.preparation}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Constitution Details */}
            <Card className="mb-6 cyber-border">
              <CardHeader>
                <CardTitle className="text-white">Your Ideal Herbs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {constitution?.idealHerbs.map((herb: string, index: number) => (
                    <span key={index} className="text-xs bg-cyber-green/20 text-cyber-green px-2 py-1 rounded">
                      {herb}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-300">
                  <strong>Seasonal Focus:</strong> {constitution?.seasonalTips}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleUpdateProfile}
                variant="outline" 
                className="w-full justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
              
              <Button 
                onClick={onLogout}
                variant="outline" 
                className="w-full justify-start text-red-400 border-red-400 hover:bg-red-400 hover:text-black"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Switch Profile
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Update Profile Modal */}
      {showUpdateForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4"
          onClick={() => setShowUpdateForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cyber-gray border border-cyber-border rounded-lg w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyber-green to-cyan-400 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyber-green">Update Profile</h3>
                  <p className="text-gray-400 text-sm">Modify your personal information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    value={updateForm.name}
                    onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-green focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Region</label>
                  <select
                    value={updateForm.region}
                    onChange={(e) => setUpdateForm({...updateForm, region: e.target.value})}
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-green focus:outline-none"
                  >
                    <option value="">Select your region</option>
                    <option value="north">Northern India</option>
                    <option value="south">Southern India</option>
                    <option value="east">Eastern India</option>
                    <option value="west">Western India</option>
                    <option value="central">Central India</option>
                    <option value="northeast">Northeast India</option>
                    <option value="other">Other/International</option>
                  </select>
                </div>

                <div className="constitution-reminder p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl">{constitution?.element}</span>
                    <span className="text-purple-300 font-medium">Your Constitution: {constitution?.name}</span>
                  </div>
                  <p className="text-purple-200 text-xs">
                    Constitution cannot be changed as it's determined by your assessment
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={() => setShowUpdateForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveProfileUpdate}
                  disabled={!updateForm.name.trim()}
                  className="flex-1 bg-cyber-green text-black hover:bg-cyber-green/80"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
