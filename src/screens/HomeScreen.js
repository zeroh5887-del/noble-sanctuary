import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAIResponse } from '../services/aiService';

const HomeScreen = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  const dailyLimitRef = useRef(null);

  // Initialize daily timer on app start
  useEffect(() => {
    checkDailyLimit();
    startTimer();
  }, []);

  // Load previous messages
  useEffect(() => {
    loadMessages();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const checkDailyLimit = async () => {
    try {
      const lastDate = await AsyncStorage.getItem('lastDate');
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        // New day, reset timer
        await AsyncStorage.setItem('lastDate', today);
        await AsyncStorage.setItem('timeUsedToday', '0');
        setTimeRemaining(7200);
      } else {
        // Same day, get remaining time
        const timeUsed = parseInt(await AsyncStorage.getItem('timeUsedToday') || '0');
        setTimeRemaining(Math.max(0, 7200 - timeUsed));
      }
    } catch (error) {
      console.error('Error checking daily limit:', error);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    dailyLimitRef.current = interval;
    return () => clearInterval(interval);
  };

  const loadMessages = async () => {
    try {
      const saved = await AsyncStorage.getItem('messages');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading || timeRemaining <= 0) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('ja-JP')
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setUserInput('');
    Keyboard.dismiss();

    // Get AI response
    setIsLoading(true);
    try {
      const aiResponse = await getAIResponse(userInput);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('ja-JP')
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);

      // Update time used
      const timeUsed = parseInt(await AsyncStorage.getItem('timeUsedToday') || '0');
      await AsyncStorage.setItem('timeUsedToday', String(timeUsed + 1));
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
    setIsLoading(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>高貴なる庭園</Text>
        <Text style={styles.subtitle}>Noble Sanctuary</Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>今日の時間: {formatTime(timeRemaining)}</Text>
          {timeRemaining <= 0 && <Text style={styles.limitReached}>本日の利用時間に達しました</Text>}
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>ようこそ</Text>
            <Text style={styles.emptyText}>あなたの想いを聞かせてください</Text>
            <Text style={styles.emptySubtext}>心の奥底にある想いを、ここで共有してください</Text>
          </View>
        ) : (
          messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.messageTime}>{msg.timestamp}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input Area */}
      {timeRemaining > 0 ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="想いを共有してください..."
            placeholderTextColor="#888"
            value={userInput}
            onChangeText={setUserInput}
            multiline
            maxHeight={100}
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>送信</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.limitContainer}>
          <Text style={styles.limitMessage}>本日の利用時間に達しました。明日をお待ちください。</Text>
          <Text style={styles.emergencyText}>緊急時はこちらへ:</Text>
          <Text style={styles.emergencyNumber}>いのちの電話: 0570-783-556</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  timerContainer: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  timerText: {
    color: '#4db8ff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  limitReached: {
    color: '#ff4d4d',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messagesContent: {
    paddingVertical: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  messageBubble: {
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e3a8a',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    color: '#888',
    fontSize: 10,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  limitContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  limitMessage: {
    color: '#ff4d4d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  emergencyNumber: {
    color: '#4db8ff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default HomeScreen;
