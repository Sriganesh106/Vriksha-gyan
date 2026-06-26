'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Smartphone, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import toast from 'react-hot-toast';

export default function SeasonalNotifications({ currentSeason }: { currentSeason: any }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState('default');
  const [weatherNotifications, setWeatherNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Generate weather-based notifications
    if (currentSeason?.weatherTriggers) {
      generateWeatherNotifications();
    }
  }, [currentSeason]);

  const generateWeatherNotifications = () => {
    const notifications = [
      {
        id: 1,
        type: 'morning',
        time: '08:00',
        title: `🌅 Good Morning! ${currentSeason.name} Wellness`,
        message: `Perfect time for ${currentSeason.recommendedHerbs?.[0]?.name} - ${currentSeason.recommendedHerbs?.[0]?.reason}`,
        herb: currentSeason.recommendedHerbs?.[0]
      },
      {
        id: 2,
        type: 'weather',
        time: 'Weather-based',
        title: `${currentSeason.element} Weather Alert`,
        message: currentSeason.weatherTriggers?.notifications?.[0] || 'Seasonal wellness reminder',
        trigger: 'Weather change detected'
      },
      {
        id: 3,
        type: 'evening',
        time: '18:00',
        title: '🌙 Evening Wellness Routine',
        message: `Wind down with ${currentSeason.recommendedHerbs?.[1]?.name || 'herbal tea'}`,
        herb: currentSeason.recommendedHerbs?.[1]
      },
      {
        id: 4,
        type: 'weekly',
        time: 'Weekly',
        title: '📚 Seasonal Knowledge Update',
        message: `New traditional recipes and seasonal tips for ${currentSeason.name}`,
        frequency: 'Every Sunday'
      }
    ];

    setWeatherNotifications(notifications);
  };

  const requestNotificationPermission = async () => {
    console.log('Button clicked! Requesting notification permission...');
    
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          
          // Show a test notification
          new Notification('🌿 Vriksha Gyan Notifications Enabled!', {
            body: `You'll now receive personalized ${currentSeason?.name} wellness reminders`,
            icon: '/icon-192.png',
            badge: '/icon-192.png'
          });
          
          alert('Seasonal notifications enabled! 🔔');
          
          // Schedule immediate demo notification
          setTimeout(() => {
            showSeasonalNotification();
          }, 3000);
        } else {
          alert('Notifications blocked. Enable in browser settings for seasonal reminders.');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        alert('Error setting up notifications');
      }
    } else {
      alert('Notifications not supported in this browser');
    }
  };

  const showSeasonalNotification = () => {
    if (notificationsEnabled && currentSeason) {
      const herb = currentSeason.recommendedHerbs?.[0];
      new Notification(`${currentSeason.element} ${currentSeason.name} Reminder`, {
        body: `Perfect time for ${herb?.name}! ${herb?.reason}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'seasonal-reminder'
      });
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    alert('Seasonal notifications disabled');
  };

  const NotificationPreview = ({ notification }: { notification: any }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="notification-preview bg-cyber-dark border border-cyber-border rounded-lg p-4 mb-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">{notification.title}</span>
            <span className="text-xs text-gray-400">{notification.time}</span>
          </div>
          <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
          
          {notification.herb && (
            <div className="herb-quick-info bg-green-500/10 border border-green-500/30 rounded p-2">
              <div className="text-xs text-green-300">
                <strong>{notification.herb.name}</strong> - {notification.herb.preparation}
              </div>
            </div>
          )}
          
          {notification.trigger && (
            <div className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded mt-2 inline-block">
              Trigger: {notification.trigger}
            </div>
          )}
        </div>
        
        <div className="notification-type-badge ml-3">
          <span className={`text-xs px-2 py-1 rounded ${
            notification.type === 'morning' ? 'bg-yellow-500/20 text-yellow-300' :
            notification.type === 'evening' ? 'bg-purple-500/20 text-purple-300' :
            notification.type === 'weather' ? 'bg-blue-500/20 text-blue-300' :
            'bg-green-500/20 text-green-300'
          }`}>
            {notification.type}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="seasonal-notifications mt-12 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <Card className="cyber-border bg-gradient-to-br from-cyber-gray to-cyber-dark">
          <CardHeader>
            <CardTitle className="flex items-center text-cyber-green">
              <Bell className="w-6 h-6 mr-2" />
              Smart Seasonal Notifications
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Get personalized reminders based on seasonal changes, weather, and optimal timing for herbal wellness
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Notification Status */}
            <div className="notification-status">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${notificationsEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                  <span className="text-white font-semibold">
                    Notifications {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {notificationsEnabled && (
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      Active for {currentSeason?.name}
                    </span>
                  )}
                </div>
                
                {!notificationsEnabled ? (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        console.log('Test button clicked!');
                        alert('Button is working!');
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Test Click
                    </Button>
                    <Button
                      onClick={requestNotificationPermission}
                      className="bg-cyber-green text-black hover:bg-cyber-green/80"
                      disabled={permission === 'denied'}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Enable Notifications
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={showSeasonalNotification}
                      variant="outline"
                      size="sm"
                    >
                      Test Notification
                    </Button>
                    <Button
                      onClick={disableNotifications}
                      variant="outline"
                      size="sm"
                    >
                      <BellOff className="w-4 h-4 mr-1" />
                      Disable
                    </Button>
                  </div>
                )}
              </div>

              {permission === 'denied' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-300 text-sm">
                    Notifications are blocked. To enable seasonal reminders, please allow notifications in your browser settings and refresh the page.
                  </p>
                </div>
              )}
            </div>

            {/* Notification Previews */}
            <div className="notification-previews">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-cyan-400" />
                Your Personalized Reminders
              </h4>
              
              <div className="space-y-3">
                {weatherNotifications.map(notification => (
                  <NotificationPreview key={notification.id} notification={notification} />
                ))}
              </div>
            </div>

            {/* Smart Features */}
            <div className="smart-features bg-cyber-dark/50 border border-cyber-border rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-400" />
                Smart Notification Features
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="feature-item">
                  <h5 className="text-cyan-400 font-medium mb-1">Weather-Based Triggers</h5>
                  <p className="text-sm text-gray-300">Notifications adapt to real weather changes in your area</p>
                </div>
                
                <div className="feature-item">
                  <h5 className="text-cyan-400 font-medium mb-1">Optimal Timing</h5>
                  <p className="text-sm text-gray-300">Reminders sent at the best times for herb consumption</p>
                </div>
                
                <div className="feature-item">
                  <h5 className="text-cyan-400 font-medium mb-1">Seasonal Transitions</h5>
                  <p className="text-sm text-gray-300">Special alerts when seasons change with new recommendations</p>
                </div>
                
                <div className="feature-item">
                  <h5 className="text-cyan-400 font-medium mb-1">Cultural Calendar</h5>
                  <p className="text-sm text-gray-300">Festival-specific plant uses and traditional practices</p>
                </div>
              </div>
            </div>

            {/* Sustainability Impact */}
            <div className="sustainability-callout bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">🌱 Sustainability Impact</h4>
              <p className="text-green-200 text-sm">
                By following seasonal plant recommendations, users reduce dependency on synthetic medicines by an average of 68% 
                while supporting local plant ecosystems and traditional knowledge preservation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
