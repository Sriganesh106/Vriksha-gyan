'use client';

import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  ref, 
  set, 
  get, 
  push, 
  serverTimestamp, 
  onValue,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';
import { db, auth, app } from './firebase';

export interface AyurvedicProfile {
  uid: string;
  name: string;
  region: string;
  constitution: 'vata' | 'pitta' | 'kapha';
  constitutionData: any;
  joinedAt: string;
  lastLoginAt: string;
  currentSeason: any;
  personalizedRecommendations: any;
  gameStats: {
    totalGamesPlayed: number;
    totalScore: number;
    averageScore: number;
    plantsLearned: string[];
    achievements: string[];
  };
  preferences: {
    notifications: boolean;
    shareProgress: boolean;
    language: string;
  };
}

class FirebaseAuthService {
  private currentUser: FirebaseUser | null = null;
  private userProfile: AyurvedicProfile | null = null;
  private isAuthEnabled: boolean = false;

  constructor() {
    // Check if Firebase Auth is available and enabled
    try {
      if (auth) {
        this.isAuthEnabled = true;
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
          this.currentUser = user;
          if (user) {
            this.loadUserProfile(user.uid);
          }
        });
      }
    } catch (error) {
      console.warn('Firebase Auth not available, using fallback mode:', error);
      this.isAuthEnabled = false;
    }
  }

  // Create anonymous user and Ayurvedic profile
  async createAyurvedicUser(profileData: Partial<AyurvedicProfile>): Promise<AyurvedicProfile> {
    try {
      let uid: string;
      
      if (this.isAuthEnabled) {
        // Try Firebase Auth if available
        try {
          const userCredential = await signInAnonymously(auth);
          const user = userCredential.user;
          uid = user.uid;

          // Update display name
          await updateProfile(user, {
            displayName: profileData.name
          });
        } catch (authError) {
          console.warn('Firebase Auth failed, using fallback UID:', authError);
          uid = this.generateFallbackUID();
        }
      } else {
        // Use fallback UID generation
        uid = this.generateFallbackUID();
      }

      // Create comprehensive user profile
      const ayurvedicProfile: AyurvedicProfile = {
        uid: uid,
        name: profileData.name || 'Herbalist',
        region: profileData.region || 'India',
        constitution: profileData.constitution || 'vata',
        constitutionData: profileData.constitutionData || {},
        joinedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        currentSeason: profileData.currentSeason || null,
        personalizedRecommendations: profileData.personalizedRecommendations || {},
        gameStats: {
          totalGamesPlayed: 0,
          totalScore: 0,
          averageScore: 0,
          plantsLearned: [],
          achievements: []
        },
        preferences: {
          notifications: true,
          shareProgress: true,
          language: 'en'
        }
      };

      // Save to Firebase Realtime Database
      await this.saveUserProfile(ayurvedicProfile);
      
      this.userProfile = ayurvedicProfile;
      
      console.log('✅ Ayurvedic user created successfully:', ayurvedicProfile);
      return ayurvedicProfile;

    } catch (error) {
      console.error('❌ Error creating Ayurvedic user:', error);
      throw error;
    }
  }

  // Generate fallback UID when Firebase Auth is not available
  private generateFallbackUID(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Save user profile to Firebase
  async saveUserProfile(profile: AyurvedicProfile): Promise<void> {
    try {
      const userRef = ref(db, `users/${profile.uid}`);
      await set(userRef, {
        ...profile,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ User profile saved to Firebase');
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      throw error;
    }
  }

  // Load user profile from Firebase
  async loadUserProfile(uid: string): Promise<AyurvedicProfile | null> {
    try {
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const profile = snapshot.val() as AyurvedicProfile;
        this.userProfile = profile;
        
        // Update last login
        await this.updateLastLogin(uid);
        
        console.log('✅ User profile loaded:', profile);
        return profile;
      } else {
        console.log('❌ No user profile found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<AyurvedicProfile>): Promise<void> {
    if (!this.currentUser) throw new Error('No authenticated user');
    
    try {
      const userRef = ref(db, `users/${this.currentUser.uid}`);
      await set(userRef, {
        ...this.userProfile,
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      this.userProfile = { ...this.userProfile, ...updates } as AyurvedicProfile;
      console.log('✅ User profile updated');
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }

  // Update last login timestamp
  async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = ref(db, `users/${uid}/lastLoginAt`);
      await set(userRef, new Date().toISOString());
    } catch (error) {
      console.error('❌ Error updating last login:', error);
    }
  }

  // Save game score and update stats
  async saveGameScore(gameData: {
    plantName: string;
    score: number;
    difficulty: string;
    completionTime: string;
    gameType: string;
  }): Promise<void> {
    if (!this.currentUser || !this.userProfile) {
      throw new Error('No authenticated user or profile');
    }

    try {
      // Save individual game score (existing functionality)
      const scoresRef = ref(db, 'gameScores');
      await push(scoresRef, {
        ...gameData,
        uid: this.currentUser.uid,
        userName: this.userProfile.name,
        constitution: this.userProfile.constitution,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      // Update user game statistics
      const updatedStats = {
        ...this.userProfile.gameStats,
        totalGamesPlayed: this.userProfile.gameStats.totalGamesPlayed + 1,
        totalScore: this.userProfile.gameStats.totalScore + gameData.score,
        plantsLearned: Array.from(new Set([...this.userProfile.gameStats.plantsLearned, gameData.plantName]))
      };
      
      updatedStats.averageScore = Math.round(updatedStats.totalScore / updatedStats.totalGamesPlayed);

      // Add achievements
      const achievements = [...this.userProfile.gameStats.achievements];
      if (gameData.score >= 90 && !achievements.includes('High_Scorer')) {
        achievements.push('High_Scorer');
      }
      if (updatedStats.plantsLearned.length >= 5 && !achievements.includes('Plant_Explorer')) {
        achievements.push('Plant_Explorer');
      }
      if (updatedStats.totalGamesPlayed >= 10 && !achievements.includes('Dedicated_Learner')) {
        achievements.push('Dedicated_Learner');
      }

      updatedStats.achievements = achievements;

      // Update user profile with new stats
      await this.updateUserProfile({ gameStats: updatedStats });

      console.log('✅ Game score saved and stats updated');
    } catch (error) {
      console.error('❌ Error saving game score:', error);
      throw error;
    }
  }

  // Get user's game history
  async getUserGameHistory(): Promise<any[]> {
    if (!this.currentUser) return [];

    try {
      const scoresRef = ref(db, 'gameScores');
      const userScoresQuery = query(scoresRef, orderByChild('uid'), equalTo(this.currentUser.uid));
      
      return new Promise((resolve) => {
        onValue(userScoresQuery, (snapshot) => {
          const scores: any[] = [];
          if (snapshot.exists()) {
            const data = snapshot.val();
            Object.keys(data).forEach(key => {
              scores.push({ id: key, ...data[key] });
            });
          }
          // Sort by timestamp descending
          scores.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          resolve(scores);
        });
      });
    } catch (error) {
      console.error('❌ Error fetching user game history:', error);
      return [];
    }
  }

  // Get leaderboard with user context
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const scoresRef = ref(db, 'gameScores');
      
      return new Promise((resolve) => {
        onValue(scoresRef, (snapshot) => {
          const scores: any[] = [];
          if (snapshot.exists()) {
            const data = snapshot.val();
            Object.keys(data).forEach(key => {
              scores.push({ id: key, ...data[key] });
            });
          }
          
          // Sort by score descending and take top scores
          const topScores = scores
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, limit);
            
          resolve(topScores);
        });
      });
    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      return [];
    }
  }

  // Get current user profile
  getCurrentUserProfile(): AyurvedicProfile | null {
    return this.userProfile;
  }

  // Get current Firebase user
  getCurrentUser(): FirebaseUser | null {
    return this.currentUser;
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      if (this.isAuthEnabled && auth) {
        await auth.signOut();
      }
      this.currentUser = null;
      this.userProfile = null;
      console.log('✅ User signed out');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      // Don't throw error for signout issues
      this.currentUser = null;
      this.userProfile = null;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: FirebaseUser | null, profile: AyurvedicProfile | null) => void): () => void {
    if (this.isAuthEnabled && auth) {
      return onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        if (user && this.userProfile) {
          callback(user, this.userProfile);
        } else {
          callback(user, null);
        }
      });
    } else {
      // Return empty unsubscribe function for fallback mode
      return () => {};
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
export { auth };
