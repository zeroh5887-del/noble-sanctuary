import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TermsScreen from './src/screens/TermsScreen';
import DisclaimerScreen from './src/screens/DisclaimerScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdminScreen from './src/screens/AdminScreen';
import { generateUserCode } from './src/services/userService';

const Stack = createNativeStackNavigator();

export default function App() {
  const [disclaimerViewCount, setDisclaimerViewCount] = useState(0);
  const [userCode, setUserCode] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const MAX_DISCLAIMER_VIEWS = 3;

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check disclaimer view count for today
      const lastDate = await AsyncStorage.getItem('disclaimerLastDate');
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        // New day - reset counter
        await AsyncStorage.setItem('disclaimerLastDate', today);
        await AsyncStorage.setItem('disclaimerViewCount', '0');
        setDisclaimerViewCount(0);
      } else {
        // Same day - get current count
        const count = parseInt(await AsyncStorage.getItem('disclaimerViewCount') || '0');
        setDisclaimerViewCount(count);
      }

      // Get or create user code
      let code = await AsyncStorage.getItem('userCode');
      if (!code) {
        code = generateUserCode();
        await AsyncStorage.setItem('userCode', code);
      }
      setUserCode(code);

      // Check if admin
      const adminStatus = await AsyncStorage.getItem('isAdmin');
      if (adminStatus === 'true') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisclaimerComplete = async () => {
    try {
      const newCount = disclaimerViewCount + 1;
      await AsyncStorage.setItem('disclaimerViewCount', String(newCount));
      setDisclaimerViewCount(newCount);
    } catch (error) {
      console.error('Error updating disclaimer view count:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0f0f0f' },
        }}
      >
        {disclaimerViewCount < MAX_DISCLAIMER_VIEWS ? (
          <>
            <Stack.Screen
              name="Terms"
              options={{ animationEnabled: false }}
            >
              {(props) => (
                <TermsScreen {...props} onAccept={handleDisclaimerComplete} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Disclaimer"
              options={{ animationEnabled: false }}
            >
              {(props) => (
                <DisclaimerScreen 
                  {...props} 
                  onAccept={handleDisclaimerComplete}
                  viewCount={disclaimerViewCount}
                  maxViews={MAX_DISCLAIMER_VIEWS}
                />
              )}
            </Stack.Screen>
          </>
        ) : isAdmin ? (
          <Stack.Screen
            name="Admin"
            options={{ animationEnabled: false }}
          >
            {(props) => <AdminScreen {...props} userCode={userCode} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="Home"
            options={{ animationEnabled: false }}
          >
            {(props) => <HomeScreen {...props} userCode={userCode} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    width: 60,
    height: 60,
    backgroundColor: '#d4af37',
    borderRadius: 30,
  },
});
