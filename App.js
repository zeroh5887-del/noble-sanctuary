import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DisclaimerScreen from './src/screens/DisclaimerScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdminScreen from './src/screens/AdminScreen';
import { generateUserCode } from './src/services/userService';

const Stack = createNativeStackNavigator();

export default function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [userCode, setUserCode] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if disclaimer accepted
      const accepted = await AsyncStorage.getItem('disclaimerAccepted');
      if (accepted === 'true') {
        setDisclaimerAccepted(true);
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

  const handleDisclaimerAccept = async () => {
    try {
      await AsyncStorage.setItem('disclaimerAccepted', 'true');
      setDisclaimerAccepted(true);
    } catch (error) {
      console.error('Error accepting disclaimer:', error);
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
        {!disclaimerAccepted ? (
          <Stack.Screen
            name="Disclaimer"
            options={{ animationEnabled: false }}
          >
            {(props) => (
              <DisclaimerScreen {...props} onAccept={handleDisclaimerAccept} />
            )}
          </Stack.Screen>
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
