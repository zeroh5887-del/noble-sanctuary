import AsyncStorage from '@react-native-async-storage/async-storage';

// All storage is local-only. No data is sent to servers.
// Users can clear all data anytime.

export const StorageService = {
  // User Preferences
  saveUserPreferences: async (preferences) => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  getUserPreferences: async () => {
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {};
    }
  },

  // Daily Usage Tracking (local only)
  checkDailyLimit: async () => {
    try {
      const lastDate = await AsyncStorage.getItem('lastDate');
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        await AsyncStorage.setItem('lastDate', today);
        await AsyncStorage.setItem('timeUsedToday', '0');
        return { exceeded: false, timeRemaining: 7200 };
      }
      
      const timeUsed = parseInt(await AsyncStorage.getItem('timeUsedToday') || '0');
      const timeRemaining = Math.max(0, 7200 - timeUsed);
      
      return {
        exceeded: timeRemaining <= 0,
        timeRemaining: timeRemaining
      };
    } catch (error) {
      console.error('Error checking daily limit:', error);
      return { exceeded: false, timeRemaining: 7200 };
    }
  },

  updateTimeUsed: async (seconds) => {
    try {
      const timeUsed = parseInt(await AsyncStorage.getItem('timeUsedToday') || '0');
      await AsyncStorage.setItem('timeUsedToday', String(timeUsed + seconds));
    } catch (error) {
      console.error('Error updating time used:', error);
    }
  },

  // Subscription Status (local only until payment integration)
  setSubscriptionStatus: async (status) => {
    try {
      const subscriptionData = {
        status: status, // 'free', 'trial', 'paid'
        startDate: new Date().toISOString(),
        expiresAt: status === 'trial' ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : null
      };
      await AsyncStorage.setItem('subscriptionStatus', JSON.stringify(subscriptionData));
    } catch (error) {
      console.error('Error setting subscription status:', error);
    }
  },

  getSubscriptionStatus: async () => {
    try {
      const status = await AsyncStorage.getItem('subscriptionStatus');
      if (!status) {
        // First time user - set to trial
        await StorageService.setSubscriptionStatus('trial');
        return { status: 'trial', isExpired: false };
      }
      
      const subData = JSON.parse(status);
      if (subData.expiresAt && new Date() > new Date(subData.expiresAt)) {
        return { status: subData.status, isExpired: true };
      }
      
      return { status: subData.status, isExpired: false };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return { status: 'free', isExpired: false };
    }
  },

  // Clear All Data (user's right to privacy)
  clearAllData: async () => {
    try {
      await AsyncStorage.clear();
      // Reset to trial
      await StorageService.setSubscriptionStatus('trial');
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
};
