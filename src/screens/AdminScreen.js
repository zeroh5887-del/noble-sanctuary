import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = ({ userCode }) => {
  const [adminRequests, setAdminRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    loadAdminRequests();
    // Check for new requests every 5 seconds
    const interval = setInterval(loadAdminRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  const loadAdminRequests = async () => {
    try {
      const requests = await AsyncStorage.getItem('adminRequests');
      if (requests) {
        setAdminRequests(JSON.parse(requests));
      }
    } catch (error) {
      console.error('Error loading admin requests:', error);
    }
  };

  const selectUser = async (userCode) => {
    setSelectedUser(userCode);
    try {
      const key = `adminConversation_${userCode}`;
      const conv = await AsyncStorage.getItem(key);
      if (conv) {
        setConversation(JSON.parse(conv));
      } else {
        setConversation([]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendAdminMessage = async () => {
    if (!adminMessage.trim() || !selectedUser) return;

    const message = {
      id: Date.now(),
      text: adminMessage,
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString('ja-JP')
    };

    const updatedConversation = [...conversation, message];
    setConversation(updatedConversation);
    setAdminMessage('');
    Keyboard.dismiss();

    try {
      const key = `adminConversation_${selectedUser}`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedConversation));
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  if (!selectedUser) {
    return (
      <View style={styles.container}>
        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ 管理者モード: ユーザーの安全を優先してください</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>管理者ダッシュボード</Text>
          <Text style={styles.adminCode}>管理者コード: {userCode}</Text>
        </View>

        {/* Requests List */}
        <ScrollView style={styles.requestsList}>
          <Text style={styles.sectionTitle}>ユーザーリクエスト</Text>
          {adminRequests.length === 0 ? (
            <Text style={styles.noRequestsText}>リクエストはありません</Text>
          ) : (
            adminRequests.map((request, index) => (
              <TouchableOpacity
                key={index}
                style={styles.requestItem}
                onPress={() => selectUser(request.userCode)}
              >
                <Text style={styles.requestUserCode}>{request.userCode}</Text>
                <Text style={styles.requestMessage}>{request.message}</Text>
                <Text style={styles.requestTime}>{request.timestamp}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <Text style={styles.warningText}>⚠️ 管理者モード: ユーザーとの会話</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedUser(null)}>
          <Text style={styles.backButton}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ユーザー: {selectedUser}</Text>
      </View>

      {/* Conversation */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.conversationContainer}
        contentContainerStyle={styles.conversationContent}
      >
        {conversation.length === 0 ? (
          <View style={styles.emptyConversation}>
            <Text style={styles.emptyText}>まだメッセージはありません</Text>
          </View>
        ) : (
          conversation.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'admin' ? styles.adminMessage : styles.userMessage
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.messageTime}>{msg.timestamp}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="メッセージを送信..."
          placeholderTextColor="#8b7355"
          value={adminMessage}
          onChangeText={setAdminMessage}
          multiline
          maxHeight={100}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendAdminMessage}
        >
          <Text style={styles.sendButtonText}>送信</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#d4af37',
    textAlign: 'center',
  },
  adminCode: {
    fontSize: 10,
    color: '#8b7355',
    textAlign: 'center',
    marginTop: 10,
  },
  requestsList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 15,
  },
  requestItem: {
    backgroundColor: '#2a2015',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#d4af37',
  },
  requestUserCode: {
    color: '#d4af37',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  requestMessage: {
    color: '#c9b037',
    fontSize: 12,
    marginBottom: 5,
  },
  requestTime: {
    color: '#8b7355',
    fontSize: 10,
  },
  noRequestsText: {
    color: '#8b7355',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  conversationContent: {
    paddingVertical: 10,
  },
  emptyConversation: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#8b7355',
    fontSize: 12,
  },
  messageBubble: {
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '85%',
  },
  adminMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3d3020',
    borderLeftWidth: 3,
    borderLeftColor: '#d4af37',
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2015',
    borderLeftWidth: 3,
    borderLeftColor: '#c9b037',
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
  sendButtonText: {
    color: '#1a1410',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default AdminScreen;
