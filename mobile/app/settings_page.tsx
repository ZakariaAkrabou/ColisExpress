import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsPageProps {
  direction: 'FR_TO_MA' | 'MA_TO_FR';
  onChangeDirection: (newDirection: 'FR_TO_MA' | 'MA_TO_FR') => void;
  onResetDirection: () => void;
}

export default function SettingsPage({
  direction,
  onChangeDirection,
  onResetDirection,
}: SettingsPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleToggleDirection = () => {
    const nextDirection = direction === 'FR_TO_MA' ? 'MA_TO_FR' : 'FR_TO_MA';
    onChangeDirection(nextDirection);
    Alert.alert(
      'Direction Changed',
      `Transit direction switched to: ${
        nextDirection === 'FR_TO_MA' ? 'France ➔ Morocco' : 'Morocco ➔ France'
      }`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>System Settings</Text>
        <Text style={styles.subtitle}>Manage preferences & agency details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>CM</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Casmoh Manager</Text>
            <Text style={styles.userRole}>Administrator • Paris Agency</Text>
          </View>
        </View>

        {/* Transit Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transit Configuration</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Active Direction</Text>
              <Text style={styles.settingDesc}>
                {direction === 'FR_TO_MA' ? '🇫🇷 France ➔ 🇲🇦 Morocco' : '🇲🇦 Morocco ➔ 🇫🇷 France'}
              </Text>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={handleToggleDirection}>
              <Text style={styles.actionBtnText}>Swap</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.dangerItem} onPress={onResetDirection}>
            <Text style={styles.dangerItemText}>🔄 Choose Another Direction</Text>
            <Text style={styles.dangerItemSub}>Return to main welcome selector</Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Dark Theme Mode</Text>
              <Text style={styles.settingDesc}>Use low-light visual themes</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#334155', true: '#10b981' }}
              thumbColor={darkMode ? '#f8fafc' : '#94a3b8'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Alerts on parcel status change</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#334155', true: '#10b981' }}
              thumbColor={notifications ? '#f8fafc' : '#94a3b8'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Background Auto-Sync</Text>
              <Text style={styles.settingDesc}>Sync shipments data every 10 min</Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#334155', true: '#10b981' }}
              thumbColor={autoSync ? '#f8fafc' : '#94a3b8'}
            />
          </View>
        </View>

        {/* Agency Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Casmoh Agency Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Paris Office</Text>
            <Text style={styles.infoValue}>12 Rue de l'Express, 75010 Paris</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Casablanca Office</Text>
            <Text style={styles.infoValue}>85 Boulevard d'Anfa, Casablanca</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Support Hotline</Text>
            <Text style={styles.infoValue}>+33 1 45 67 89 10</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Support</Text>
            <Text style={styles.infoValue}>contact@colisexpress.com</Text>
          </View>
        </View>

        {/* About App */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>ColisExpress v1.0.0 (Casmoh Edition)</Text>
          <Text style={styles.footerSubText}>© 2026 ColisExpress Inc. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  userRole: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38bdf8',
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
  },
  settingDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  dangerItem: {
    marginTop: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerItemText: {
    color: '#f87171',
    fontWeight: '700',
    fontSize: 14,
  },
  dangerItemSub: {
    color: '#b91c1c',
    fontSize: 11,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  infoLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#f8fafc',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  footerSubText: {
    fontSize: 9,
    color: '#475569',
    marginTop: 4,
  },
});
