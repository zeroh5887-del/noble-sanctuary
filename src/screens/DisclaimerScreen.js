import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DisclaimerScreen = ({ onAccept, viewCount = 0, maxViews = 3 }) => {
  const navigation = useNavigation();

  const handleAccept = () => {
    onAccept();
    
    // Check if we've shown disclaimer enough times
    if (viewCount + 1 >= maxViews) {
      // All 3 views complete - go to chat
      navigation.replace('Home');
    } else {
      // Show again - go back to Terms for another cycle
      navigation.replace('Terms');
    }
  };

  const remainingViews = maxViews - viewCount - 1;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.title}>⚠️ 最終上注意</Text>
        <Text style={styles.subtitle}>Final Warning Before Using</Text>

        {/* View Counter */}
        <View style={styles.viewCounterSection}>
          <Text style={styles.viewCounterText}>
            残り確認: {remainingViews} / {maxViews - 1}
          </Text>
        </View>

        <View style={styles.criticalSection}>
          <Text style={styles.criticalTitle}>🚩 これを読んでください</Text>
          <Text style={styles.criticalText}>
            このアプリは、医療的な握保を提供していません。これは協会慮炎計画ではありません。自殺を考えている場合、今すぐ電話し、真師に連絡してください。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌙 あなたが受けるもの</Text>
          <Text style={styles.text}>
            • その時の気持ちを話すこと
            • 耳を傾けてくれる空間
            • 辛さを理解している存在
            
            ずっと、それだけです。他には何を与えても いけていません。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚫 あなたが受けないもの</Text>
          <Text style={styles.text}>
            • 医学的アドバイス
            • 心理療法。カウンセリング
            • 箋断、治療、解決策
            • 人生的なナチや決定
            • 専門的な治療として機能
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 責任免責</Text>
          <Text style={styles.text}>
            • あなたがこのアプリを使って好画なことをしくじったら、作成者を責めないでください
            • これを使って自殺をしたら、作成者は責任を持ちません
            • あなたの責任です
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 緊急連絡先</Text>
          <Text style={styles.emergencyNumber}>いのちの電話: 0570-783-556</Text>
          <Text style={styles.emergencyNumber}>よりそいホットライン: 0120-279-338</Text>
          <Text style={styles.emergencyNumber}>TELL Lifeline: 03-5774-0992</Text>
          <Text style={styles.emergencySubtext}>今この値段で電話し、真師に連絡してください。</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.warningText}>
            このアプリを使用して何かをした際の全てのい責任は、自分にあります。
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
        <Text style={styles.acceptButtonText}>
          {remainingViews > 0 ? '確認しました' : 'チャットを始める'}
        </Text>
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
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#8b7355',
    textAlign: 'center',
    marginBottom: 20,
  },
  viewCounterSection: {
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#3d2015',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  viewCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d4af37',
    textAlign: 'center',
  },
  criticalSection: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: '#3d2015',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  criticalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ff6b6b',
    marginBottom: 8,
  },
  criticalText: {
    fontSize: 12,
    color: '#ffcccc',
    lineHeight: 20,
  },
  section: {
    marginBottom: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#2a2015',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#d4af37',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 8,
  },
  text: {
    fontSize: 11,
    color: '#c9b037',
    lineHeight: 18,
  },
  emergencyNumber: {
    fontSize: 11,
    color: '#ff6b6b',
    fontWeight: '700',
    marginVertical: 4,
  },
  emergencySubtext: {
    fontSize: 10,
    color: '#ffcccc',
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#ff6b6b',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    fontWeight: '600',
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