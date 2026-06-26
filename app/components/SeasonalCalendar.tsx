'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Bell, Leaf, Sun, Cloud, Snowflake, ChevronRight, X, Clock, Shirt, Utensils, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ayurvedicSeasons, getCurrentSeason } from '../data/seasonalCalendar';
import toast from 'react-hot-toast';

export default function SeasonalCalendar({ userProfile }: { userProfile?: any }) {
  const [currentSeason, setCurrentSeason] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const [showAllSeasons, setShowAllSeasons] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
    setSelectedSeason(season);
  }, []);

  const getSeasonIcon = (seasonName: string) => {
    if (seasonName.includes('Vasant')) return <Leaf className="w-8 h-8 text-green-500" />;
    if (seasonName.includes('Grishma')) return <Sun className="w-8 h-8 text-orange-500" />;
    if (seasonName.includes('Varsha')) return <Cloud className="w-8 h-8 text-blue-500" />;
    if (seasonName.includes('Sharad')) return <Leaf className="w-8 h-8 text-yellow-500" />;
    return <Snowflake className="w-8 h-8 text-cyan-500" />;
  };

  const getSeasonGradient = (seasonKey: string) => {
    const gradients: { [key: string]: string } = {
      vasant: 'from-green-500 to-emerald-600',
      grishma: 'from-orange-500 to-red-600', 
      varsha: 'from-blue-500 to-indigo-600',
      sharad: 'from-yellow-500 to-orange-600',
      shishir: 'from-cyan-500 to-blue-600',
      shishira: 'from-blue-600 to-purple-600'
    };
    return gradients[seasonKey] || 'from-cyber-green to-cyan-400';
  };

  if (!currentSeason) return <div>Loading seasonal wisdom...</div>;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-cyber-dark to-cyber-gray">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-cyber-green mb-4 glow-text">
            🌺 Ritucharya - Seasonal Wellness Calendar
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            Ancient Ayurvedic wisdom for living in harmony with nature's cycles
          </p>
          <p className="text-lg text-cyan-400">
            Sustainable health through seasonal adaptation • 5000+ years of proven wisdom
          </p>
        </motion.div>

        {/* Current Season Spotlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`current-season-spotlight bg-gradient-to-r ${getSeasonGradient(currentSeason.key)} p-8 rounded-2xl mb-12 text-white shadow-2xl`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="flex-shrink-0">
                {getSeasonIcon(currentSeason.name)}
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">{currentSeason.name}</h3>
                <p className="text-xl opacity-90 mb-2">{currentSeason.characteristics}</p>
                <p className="text-sm opacity-75">
                  {currentSeason.months?.map((m: number) => new Date(2024, m-1).toLocaleString('default', { month: 'long' })).join(' • ')}
                </p>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="text-sm opacity-75 mb-1">Today's Featured Herb</div>
              <div className="text-2xl font-bold mb-1">
                {currentSeason.recommendedHerbs?.[0]?.name}
              </div>
              <div className="text-sm opacity-90">
                {currentSeason.recommendedHerbs?.[0]?.reason}
              </div>
              <Button 
                variant="outline" 
                className="mt-3 border-white text-white hover:bg-white hover:text-black"
                onClick={() => toast.success(`Added ${currentSeason.recommendedHerbs?.[0]?.name} to your daily routine!`)}
              >
                Add to My Routine
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Personalized Recommendations */}
        {userProfile?.constitutionData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="personalized-section mb-12"
          >
            <Card className="cyber-border bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-300">
                  {userProfile.constitutionData.element} Personalized for Your {userProfile.constitutionData.name} Constitution
                </CardTitle>
                <p className="text-gray-300">
                  Herbs perfectly matched to your constitution and the current season
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="constitutional-herbs">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <span className="text-xl mr-2">{userProfile.constitutionData.element}</span>
                      Your Ideal Herbs
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {userProfile.constitutionData.idealHerbs.map((herb: string, index: number) => (
                        <div key={index} className="herb-tag text-center p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <span className="text-purple-300 font-medium">{herb}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="seasonal-match">
                    <h4 className="text-white font-semibold mb-3">Perfect Seasonal Match</h4>
                    <div className="match-card p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{currentSeason?.element}</span>
                        <div>
                          <h5 className="text-green-300 font-medium">
                            {userProfile.constitutionData.idealHerbs.find((herb: string) =>
                              currentSeason?.recommendedHerbs?.some((seasonal: any) => 
                                seasonal.name.toLowerCase().includes(herb.toLowerCase())
                              )
                            ) || userProfile.constitutionData.idealHerbs[0]}
                          </h5>
                          <p className="text-sm text-green-200">
                            Perfect for {userProfile.constitutionData.name} in {currentSeason?.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300">
                        💡 {userProfile.constitutionData.seasonalTips}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's Recommendations Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Herbal Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="h-full cyber-border bg-gradient-to-br from-cyber-gray to-cyber-dark">
              <CardHeader>
                <CardTitle className="flex items-center text-cyber-green">
                  <Leaf className="w-5 h-5 mr-2" />
                  Today's Herbal Wisdom
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSeason.recommendedHerbs?.map((herb: any, index: number) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="herb-card bg-cyber-dark/50 p-4 rounded-lg border border-cyber-border hover:border-cyber-green transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white text-lg">{herb.name}</h4>
                      <span className="text-xs text-cyan-400 bg-cyan-400/20 px-2 py-1 rounded">
                        {herb.timing}
                      </span>
                    </div>
                    <p className="text-sm text-cyber-green mb-2">🎯 {herb.reason}</p>
                    <p className="text-xs text-gray-300 mb-2">📋 {herb.preparation}</p>
                    <p className="text-xs text-gray-400">💊 {herb.dosage}</p>
                    
                    <div className="mt-3">
                      <h5 className="text-xs font-semibold text-white mb-1">Benefits:</h5>
                      <div className="flex flex-wrap gap-1">
                        {herb.benefits?.map((benefit: string, i: number) => (
                          <span key={i} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Lifestyle Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="h-full cyber-border bg-gradient-to-br from-cyber-gray to-cyber-dark">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Sun className="w-5 h-5 mr-2" />
                  Seasonal Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="lifestyle-tips">
                  {currentSeason.lifestyle?.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 mb-3">
                      <span className="text-cyber-green flex-shrink-0 mt-1">•</span>
                      <span className="text-gray-300 text-sm">{tip}</span>
                    </div>
                  ))}
                </div>

                {currentSeason.commonIssues && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="font-semibold text-red-300 mb-2 flex items-center">
                      ⚠️ Watch Out For:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentSeason.commonIssues.map((issue: string, index: number) => (
                        <span key={index} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sustainability Impact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="h-full cyber-border bg-gradient-to-br from-green-900/30 to-cyber-dark">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  🌱 Sustainability Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-green-300 mb-4">
                    Seasonal Living Benefits
                  </h4>
                </div>

                <div className="space-y-4">
                  <div className="impact-metric text-center">
                    <div className="text-3xl font-bold text-green-400">78%</div>
                    <div className="text-sm text-green-200">Reduced medicine dependency</div>
                  </div>
                  
                  <div className="impact-metric text-center">
                    <div className="text-3xl font-bold text-green-400">85%</div>
                    <div className="text-sm text-green-200">Local plant sourcing</div>
                  </div>
                  
                  <div className="impact-metric text-center">
                    <div className="text-3xl font-bold text-green-400">92%</div>
                    <div className="text-sm text-green-200">Lower carbon footprint</div>
                  </div>
                </div>

                <div className="sustainability-note p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-200 text-sm text-center">
                    Following seasonal rhythms reduces healthcare costs while supporting local ecosystems and preserving traditional knowledge.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Festival Integration */}
        {currentSeason.festivals && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="festival-integration mb-12"
          >
            <Card className="cyber-border bg-gradient-to-r from-purple-900/30 to-pink-900/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center">
                  🎉 Cultural Connections - Festivals & Plants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {currentSeason.festivals.map((festival: any, index: number) => (
                    <div key={index} className="festival-card p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <h4 className="font-semibold text-white text-lg mb-2">{festival.name}</h4>
                      <p className="text-purple-200 mb-2">🌿 {festival.plantUse}</p>
                      <p className="text-sm text-purple-300">{festival.significance}</p>
                      {festival.plants && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {festival.plants.map((plant: string, i: number) => (
                            <span key={i} className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded">
                              {plant}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* All Seasons Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="all-seasons-section"
        >
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowAllSeasons(!showAllSeasons)}
              variant="outline"
              size="lg"
              className="border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black"
            >
              {showAllSeasons ? 'Hide' : 'Explore'} All 6 Ayurvedic Seasons
              <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${showAllSeasons ? 'rotate-90' : ''}`} />
            </Button>
          </div>

          {showAllSeasons && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
              className="seasons-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Object.entries(ayurvedicSeasons).map(([key, season]: [string, any]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Object.keys(ayurvedicSeasons).indexOf(key) * 0.1 }}
                  onClick={() => {
                    setSelectedSeason(season);
                    setShowDetailModal(true);
                  }}
                  className={`season-card cursor-pointer transition-all duration-300 ${
                    selectedSeason?.name === season.name 
                      ? 'ring-2 ring-cyber-green scale-105' 
                      : 'hover:scale-102'
                  }`}
                >
                  <Card className={`h-full cyber-border bg-gradient-to-br ${getSeasonGradient(key)} text-white`}>
                    <CardHeader className="text-center">
                      <div className="mb-2">{getSeasonIcon(season.name)}</div>
                      <CardTitle className="text-white">{season.name}</CardTitle>
                      <p className="text-sm opacity-90">{season.characteristics}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-sm opacity-75 mb-2">
                          {season.months?.map((m: number) => new Date(2024, m-1).toLocaleString('default', { month: 'short' })).join(' • ')}
                        </div>
                        <div className="text-sm">
                          Key Herbs: {season.recommendedHerbs?.slice(0, 2).map((h: any) => h.plant).join(', ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Detailed Season Modal */}
        <AnimatePresence>
          {showDetailModal && selectedSeason && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-4xl my-8 bg-cyber-dark border-2 border-cyber-green/30 rounded-2xl"
              >
                {/* Modal Header */}
                <div className={`bg-gradient-to-r ${getSeasonGradient(Object.keys(ayurvedicSeasons).find(k => ayurvedicSeasons[k as keyof typeof ayurvedicSeasons].name === selectedSeason.name) || 'vasant')} p-6 rounded-t-2xl`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getSeasonIcon(selectedSeason.name)}
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedSeason.name}</h2>
                        <p className="text-white/90">{selectedSeason.characteristics}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Clothing Recommendations */}
                    {selectedSeason.clothing && (
                      <div className="bg-cyber-gray/50 border border-cyan-500/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Shirt className="w-5 h-5 text-cyan-400" />
                          <h3 className="text-xl font-bold text-white">Clothing Guide</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-cyan-300 mb-2">Recommended Fabrics:</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedSeason.clothing.fabrics.map((fabric: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-xs text-cyan-200">
                                  {fabric}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-purple-300 mb-2">Colors to Wear:</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedSeason.clothing.colors.map((color: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-xs text-purple-200">
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-green-300 mb-1">Style:</h4>
                            <p className="text-sm text-gray-300">{selectedSeason.clothing.style}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-red-300 mb-1">Avoid:</h4>
                            <p className="text-sm text-gray-300">{selectedSeason.clothing.avoid}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Daily Routine */}
                    {selectedSeason.dailyRoutine && (
                      <div className="bg-cyber-gray/50 border border-purple-500/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="w-5 h-5 text-purple-400" />
                          <h3 className="text-xl font-bold text-white">Daily Routine</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Sun className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-sm font-semibold text-yellow-300 mb-1">Wake Time</h4>
                              <p className="text-sm text-gray-300">{selectedSeason.dailyRoutine.wakeTime}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Leaf className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-sm font-semibold text-green-300 mb-1">Exercise</h4>
                              <p className="text-sm text-gray-300">{selectedSeason.dailyRoutine.exercise}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Utensils className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-sm font-semibold text-orange-300 mb-1">Meals</h4>
                              <p className="text-sm text-gray-300">{selectedSeason.dailyRoutine.meals}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Moon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-sm font-semibold text-blue-300 mb-1">Sleep</h4>
                              <p className="text-sm text-gray-300">{selectedSeason.dailyRoutine.sleep}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lifestyle Tips */}
                  <div className="mt-6 bg-cyber-gray/50 border border-green-500/30 rounded-xl p-5">
                    <h3 className="text-xl font-bold text-white mb-3">Lifestyle Tips</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedSeason.lifestyle?.map((tip: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span className="text-sm text-gray-300">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
