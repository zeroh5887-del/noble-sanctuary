import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DisclaimerScreen = ({ onAccept }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.title}>⚠️ 重要な警告</Text>
        <Text style={styles.subtitle}>Important Disclaimer</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>このアプリについて</Text>
          <Text style={styles.text}>
            • 医学的アドバイスではありません{"\n"}
            • 医者ではなく、AIです{"\n"}
            • 専門的な治療ではありません{"\n"}
            • 聞く場所です、解決ではありません
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
            • 緊急時は下記の番号にお電話ください{"\n"}
            • このアプリは責任を持ちません
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
            このアプリは聞く場所です。医療専門家ではありません。緊急時は必ず医師か専門家に連絡してください。
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
    backgroundColor: '#1a1410',
    marginTop: 40,
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
    color: '#d4af37',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#8b7355',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: '#2a2015',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#d4af37',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: '#c9b037',
    lineHeight: 20,
  },
  emergencyNumber: {
    fontSize: 11,
    color: '#ff6b6b',
    fontWeight: '600',
    marginVertical: 4,
  },
  warningText: {
    fontSize: 11,
    color: '#ff6b6b',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  acceptButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: '#d4af37',
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#1a1410',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DisclaimerScreen;
