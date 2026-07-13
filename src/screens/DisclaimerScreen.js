import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DisclaimerScreen = ({ onAccept }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.title}>重要な免責事項</Text>
        <Text style={styles.subtitle}>Important Disclaimer</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>このアプリについて</Text>
          <Text style={styles.text}>
            • 医学的アドバイスではありません{"\n"}
            • カウンセリングサービスではありません{"\n"}
            • 精神科医の診断ツールではありません{"\n"}
            • 話を聞く場所です
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>プライバシーについて</Text>
          <Text style={styles.text}>
            • すべてのデータはあなたの電話に保存されます{"\n"}
            • サーバーには何も保存されません{"\n"}
            • 管理者はあなたのチャット履歴を見ることができません{"\n"}
            • 完全なプライバシーが保証されます
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>あなたの責任</Text>
          <Text style={styles.text}>
            • 自己責任でご利用ください{"\n"}
            • 重大な問題がある場合は医師に相談してください{"\n"}
            • 緊急時は下記の番号にお電話ください
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>緊急連絡先</Text>
          <Text style={styles.emergencyNumber}>いのちの電話: 0570-783-556</Text>
          <Text style={styles.emergencyNumber}>よりそいホットライン: 0120-279-338</Text>
          <Text style={styles.emergencyNumber}>TELL Lifeline: 03-5774-0992</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.warningText}>
            このアプリは聞く場所です。医療専門家ではありません。
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
        <Text style={styles.acceptButtonText}>同意して続ける</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1e3a8a',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4db8ff',
    marginBottom: 8,
  },
  text: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 20,
  },
  emergencyNumber: {
    fontSize: 12,
    color: '#ff4d4d',
    fontWeight: '600',
    marginVertical: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#ff4d4d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  acceptButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DisclaimerScreen;
