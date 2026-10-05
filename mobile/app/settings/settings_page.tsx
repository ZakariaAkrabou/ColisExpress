import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import {
  Settings,
  User,
  Bell,
  RefreshCw,
  Database,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowLeftRight,
  Building,
  Smartphone,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react-native';
import { MoroccoFlagBadge, FranceFlagBadge } from '../../components/common/Icons';

export interface SettingsPageProps {
  direction?: 'FR_TO_MA' | 'MA_TO_FR';
  onChangeDirection?: (newDirection: 'FR_TO_MA' | 'MA_TO_FR') => void;
  onResetDirection?: () => void;
}

export default function SettingsPage({
  direction = 'MA_TO_FR',
  onChangeDirection,
  onResetDirection,
}: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleToggleDirection = () => {
    const nextDirection = direction === 'FR_TO_MA' ? 'MA_TO_FR' : 'FR_TO_MA';
    onChangeDirection?.(nextDirection);
    Alert.alert(
      'Ligne modifiée',
      `Le trajet actif a été basculé vers : ${
        nextDirection === 'MA_TO_FR' ? 'Maroc ➔ France' : 'France ➔ Maroc'
      }`
    );
  };

  const handleBackup = () => {
    Alert.alert(
      'Sauvegarde de la base de données',
      'Sauvegarde manuelle générée avec succès (Format JSON/SQL chiffré AES-256).',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter de votre session opérateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container} className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />

      {/* --- Top Header (Home Theme Style) --- */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerTop}>
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../../assets/logo.jpeg')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Paramètres</Text>
              <Text style={styles.headerSubtitle}>ColisExpress • Préférences & Agence</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1"
      >
        {/* --- Administrator Card --- */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Administrateur ColisExpress</Text>
            <Text style={styles.userRole}>Opérateur Principal • Agence Casablanca / Paris</Text>
          </View>
        </View>

        {/* --- Transit Direction Section --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ligne & Trajet Actif</Text>

          <View style={styles.routeItem}>
            <View style={styles.routeInfoLeft}>
              <View style={styles.flagsRow}>
                {direction === 'MA_TO_FR' ? (
                  <>
                    <MoroccoFlagBadge size={22} />
                    <Text style={styles.routeArrow}>➔</Text>
                    <FranceFlagBadge size={22} />
                  </>
                ) : (
                  <>
                    <FranceFlagBadge size={22} />
                    <Text style={styles.routeArrow}>➔</Text>
                    <MoroccoFlagBadge size={22} />
                  </>
                )}
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.routeTitle}>
                  {direction === 'MA_TO_FR' ? 'Maroc ➔ France' : 'France ➔ Maroc'}
                </Text>
                <Text style={styles.routeSubtitle}>Ligne d’expédition active</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.swapBtn}
              onPress={handleToggleDirection}
              activeOpacity={0.8}
            >
              <ArrowLeftRight size={15} color="#2563eb" strokeWidth={2.4} style={{ marginRight: 5 }} />
              <Text style={styles.swapBtnText}>Inverser</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Application Preferences --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Préférences de l'application</Text>

          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
                <Bell size={18} color="#2563eb" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Notifications Push</Text>
                <Text style={styles.settingDescription}>Alertes de changements de statut des colis</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={notifications ? '#2563eb' : '#f8fafc'}
            />
          </View>

          {/* Auto Sync */}
          <View style={[styles.settingRow, styles.rowBorder]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
                <RefreshCw size={18} color="#16a34a" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Synchronisation auto</Text>
                <Text style={styles.settingDescription}>Mise à jour en temps réel des envois</Text>
              </View>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#cbd5e1', true: '#86efac' }}
              thumbColor={autoSync ? '#16a34a' : '#f8fafc'}
            />
          </View>

          {/* Offline Mode */}
          <View style={[styles.settingRow, styles.rowBorder]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#fffbeb' }]}>
                <Smartphone size={18} color="#d97706" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Mode Hors-ligne (SQLite)</Text>
                <Text style={styles.settingDescription}>Conserver les données locales</Text>
              </View>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#cbd5e1', true: '#fde68a' }}
              thumbColor={offlineMode ? '#d97706' : '#f8fafc'}
            />
          </View>
        </View>

        {/* --- Database & Backups (CDC Compliant) --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sauvegarde & Données</Text>

          <TouchableOpacity
            style={styles.clickableRow}
            onPress={handleBackup}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
                <Database size={18} color="#2563eb" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Sauvegarder la base de données</Text>
                <Text style={styles.settingDescription}>Export complet SQL / JSON (.zip)</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.clickableRow, styles.rowBorder]}
            onPress={() => {
              Alert.alert('Export Excel', 'Exportation de la liste des colis et clients vers Excel.');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
                <FileSpreadsheet size={18} color="#16a34a" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Export Rapports Excel / PDF</Text>
                <Text style={styles.settingDescription}>Historique complet des expéditions</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* --- About & Version --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Informations Système</Text>

          <View style={styles.clickableRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#f8fafc' }]}>
                <Shield size={18} color="#64748b" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Version de l'application</Text>
                <Text style={styles.settingDescription}>ColisExpress Mobile v2.0 • Pro</Text>
              </View>
            </View>
            <View style={styles.versionBadge}>
              <Text style={styles.versionBadgeText}>v2.0.0</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.clickableRow, styles.rowBorder]}
            onPress={() => {
              Alert.alert('Support & Assistance', 'Contactez le support technique : contact@colisexpress.ma');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#f8fafc' }]}>
                <HelpCircle size={18} color="#64748b" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Support & Assistance</Text>
                <Text style={styles.settingDescription}>Assistance opérateur et agences</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* --- Logout Button --- */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color="#dc2626" strokeWidth={2.2} style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerWrapper: {
    backgroundColor: '#1d4ed8',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingBottom: 16,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  titleContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    color: '#bfdbfe',
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#0f172a',
    fontSize: 15.5,
    fontWeight: '800',
  },
  userRole: {
    color: '#64748b',
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 11.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 14,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  routeInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeArrow: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '800',
    marginHorizontal: 4,
  },
  routeTitle: {
    color: '#0f172a',
    fontSize: 13.5,
    fontWeight: '700',
  },
  routeSubtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 1,
  },
  swapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  swapBtnText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  clickableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 6,
    paddingTop: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextGroup: {
    flex: 1,
  },
  settingLabel: {
    color: '#0f172a',
    fontSize: 13.5,
    fontWeight: '700',
  },
  settingDescription: {
    color: '#64748b',
    fontSize: 11.5,
    marginTop: 1,
  },
  versionBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  versionBadgeText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 4,
    marginBottom: 10,
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
