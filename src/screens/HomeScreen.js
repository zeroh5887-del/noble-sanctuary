import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAncientAIResponse } from '../services/ancientAiService';

const HomeScreen = ({ userCode }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translations, setTranslations] = useState({});
  const scrollViewRef = useRef();

  useEffect(() => {
    checkDailyLimit();
    startTimer();
    loadMessages();
  }, []);

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
        await AsyncStorage.setItem('lastDate', today);
        await AsyncStorage.setItem('timeUsedToday', '0');
        setTimeRemaining(7200);
      } else {
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

    setIsLoading(true);
    try {
      const response = await getAncientAIResponse(userInput);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('ja-JP'),
        isCrisis: response.isCrisis,
        type: response.type
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);

      // Update time used
      const timeUsed = parseInt(await AsyncStorage.getItem('timeUsedToday') || '0');
      await AsyncStorage.setItem('timeUsedToday', String(timeUsed + 1));

      // If crisis, notify
      if (response.isCrisis) {
        Alert.alert(
          '⚠️ 緊急',
          'あなたの安全が心配です。今すぐ専門家に連絡してください。'
        );
      }
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

  const requestAdminContact = () => {
    Alert.alert(
      '管理者に連絡',
      'あなたのコード: ' + userCode + '\n\nこのコードを管理者に送ってください。管理者はあなたと話すためにアプリに通知を受け取ります。',
      [
        { text: 'キャンセル', onPress: () => {}, style: 'cancel' },
        { text: 'コピーしました', onPress: () => {} }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <Text style={styles.warningText}>⚠️ 警告: このアプリは医療ではありません。緊急時は専門家に連絡してください。</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>高貴なる庭園</Text>
        <Text style={styles.subtitle}>Noble Sanctuary</Text>
        <Text style={styles.userCode}>コード: {userCode}</Text>
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
            <Text style={styles.emptySubtext}>ここは安全な場所です</Text>
          </View>
        ) : (
          messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userMessage : styles.aiMessage,
                msg.isCrisis && styles.crisisMessage
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
            placeholderTextColor="#8b7355"
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

      {/* Admin Request Button */}
      <TouchableOpacity style={styles.adminButton} onPress={requestAdminContact}>
        <Text style={styles.adminButtonText}>管理者に連絡</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1410',
  },
  warningBanner: {
    backgroundColor: '#8b4513',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 40,
  },
  warningText: {
    color: '#d4af37',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#2a2015',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#d4af37',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#c9b037',
    textAlign: 'center',
    marginBottom: 5,
  },
  userCode: {
    fontSize: 10,
    color: '#8b7355',
    textAlign: 'center',
    marginBottom: 10,
  },
  timerContainer: {
    backgroundColor: '#1a1410',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#d4af37',
  },
  timerText: {
    color: '#d4af37',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
  limitReached: {
    color: '#ff6b6b',
    fontSize: 10,
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
    color: '#d4af37',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#c9b037',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 11,
    color: '#8b7355',
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
    backgroundColor: '#3d3020',
    borderLeftWidth: 3,
    borderLeftColor: '#d4af37',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2015',
    borderLeftWidth: 3,
    borderLeftColor: '#c9b037',
  },
  crisisMessage: {
    backgroundColor: '#8b4513',
    borderLeftColor: '#ff6b6b',
  },
  messageText: {
    color: '#d4af37',
    fontSize: 13,
    lineHeight: 20,
  },
  messageTime: {
    color: '#8b7355',
    fontSize: 9,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#2a2015',
    borderTopWidth: 2,
    borderTopColor: '#d4af37',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1410',
    color: '#d4af37',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 13,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#8b7355',
  },
  sendButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#1a1410',
    fontWeight: '700',
    fontSize: 13,
  },
  limitContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#2a2015',
    borderTopWidth: 2,
    borderTopColor: '#d4af37',
  },
  limitMessage: {
    color: '#ff6b6b',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  emergencyText: {
    color: '#d4af37',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 5,
  },
  emergencyNumber: {
    color: '#ff6b6b',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
  adminButton: {
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: '#8b7355',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  adminButtonText: {
    color: '#d4af37',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeScreen;
