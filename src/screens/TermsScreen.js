import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const TermsScreen = ({ onAccept }) => {
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [checkbox4, setCheckbox4] = useState(false);
  const navigation = useNavigation();

  const allChecked = checkbox1 && checkbox2 && checkbox3 && checkbox4;

  const handleAccept = () => {
    if (allChecked) {
      onAccept();
      navigation.replace('Disclaimer');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.title}>⚠️ 利用規約 & 責任免責</Text>
        <Text style={styles.subtitle}>Terms of Service & Liability Waiver</Text>

        {/* Section 1: Medical Disclaimer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>医療不責任 (Medical Disclaimer)</Text>
          <Text style={styles.text}>
            このアプリは、医療サービス、心理療法、または専門的な治療を提供していません。
            
            This app is NOT:
            • Medical service
            • Psychology treatment
            • Professional therapy
            • Doctor's advice
            • Crisis intervention service
            
            これはただの「聞く」アプリです。
          </Text>
        </View>

        {/* Section 2: Liability Waiver */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>責任免責 (Liability Waiver)</Text>
          <Text style={styles.text}>
            このアプリの作成者は:
            
            • あなたの使用によるいかなる事例にも責任を持ちません
            • あなたの精神的、認識的、可聴的、経済的損失に対し責任を持ちません
            • アプリの使用または使用できないことに対し責任を持ちません
            
            You use this app entirely at your own risk.
          </Text>
        </View>

        {/* Section 3: Privacy Guarantee */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>プライバシー保証 (Privacy Guarantee)</Text>
          <Text style={styles.text}>
            🔒 あなたのデータ:
            • あなたの電話の中にだけ保存されます
            • サーバーに送信されません
            • 管理者が話を聞く場合を除き、話を見ることができません
            • でもアプリがハックされても、あなたのデータは安全です
          </Text>
        </View>

        {/* Section 4: Emergency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>緊急時 (Emergency)</Text>
          <Text style={styles.text}>
            もしあなたが死の想いや自殺を考えている場合:
            
            いのちの電話: 0570-783-556
            よりそいホットライン: 0120-279-338
            TELL Lifeline: 03-5774-0992
            
            今すぐ電話してください。このアプリでは助けられません。
          </Text>
        </View>

        {/* Checkboxes */}
        <View style={styles.checkboxSection}>
          <Text style={styles.checkboxTitle}>以下に同意してください:</Text>
          
          <View style={styles.checkboxItem}>
            <TouchableOpacity 
              style={[styles.checkbox, checkbox1 && styles.checkboxChecked]}
              onPress={() => setCheckbox1(!checkbox1)}
            >
              <Text style={checkbox1 ? styles.checkmark : null}>✓</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              このアプリは医療的アドバイスではなく、ただの「聞く」場所であることを理解しました。
            </Text>
          </View>
          
          <View style={styles.checkboxItem}>
            <TouchableOpacity 
              style={[styles.checkbox, checkbox2 && styles.checkboxChecked]}
              onPress={() => setCheckbox2(!checkbox2)}
            >
              <Text style={checkbox2 ? styles.checkmark : null}>✓</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              自分の使用は自分の責任であり、アプリ作成者を責めません。
            </Text>
          </View>
          
          <View style={styles.checkboxItem}>
            <TouchableOpacity 
              style={[styles.checkbox, checkbox3 && styles.checkboxChecked]}
              onPress={() => setCheckbox3(!checkbox3)}
            >
              <Text style={checkbox3 ? styles.checkmark : null}>✓</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              重大な問題がある場合、専門家や医者に連絡します。
            </Text>
          </View>
          
          <View style={styles.checkboxItem}>
            <TouchableOpacity 
              style={[styles.checkbox, checkbox4 && styles.checkboxChecked]}
              onPress={() => setCheckbox4(!checkbox4)}
            >
              <Text style={checkbox4 ? styles.checkmark : null}>✓</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              緊急時、上記の電話番号にお電話します。
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.acceptButton, !allChecked && styles.acceptButtonDisabled]} 
        onPress={handleAccept}
        disabled={!allChecked}
      >
        <Text style={styles.acceptButtonText}>一進む</Text>
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
    fontSize: 22,
    fontWeight: '700',
    color: '#d4af37',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: '#8b7355',
    textAlign: 'center',
    marginBottom: 20,
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
  checkboxSection: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: '#2a2015',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b6b',
  },
  checkboxTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff6b6b',
    marginBottom: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d4af37',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#d4af37',
  },
  checkmark: {
    color: '#1a1410',
    fontWeight: '700',
    fontSize: 14,
  },
  checkboxText: {
    fontSize: 11,
    color: '#c9b037',
    lineHeight: 16,
    flex: 1,
  },
  acceptButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: '#d4af37',
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#8b7355',
    opacity: 0.5,
  },
  acceptButtonText: {
    color: '#1a1410',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default TermsScreen;
