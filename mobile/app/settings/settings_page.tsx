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
  Modal,
  TextInput,
  ActivityIndicator,
  Share,
} from 'react-native';
import {
  User,
  Lock,
  Key,
  Eye,
  EyeOff,
  Shield,
  ChevronRight,
  ArrowLeftRight,
  Check,
  X,
  RotateCcw,
  Trash,
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  LogOut,
  CheckCircle2,
  Mail,
  Phone,
  Database,
  RefreshCw,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { MoroccoFlagBadge, FranceFlagBadge } from '../../components/common/Icons';
import { Colis } from '../colis/colis_page';
import { Client } from '../client/clientPage';
import { INITIAL_COLIS, INITIAL_CLIENTS } from '../../services/mockData';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  agency: string;
  avatarText?: string;
}

export interface SettingsPageProps {
  direction?: 'FR_TO_MA' | 'MA_TO_FR';
  onChangeDirection?: (newDirection: 'FR_TO_MA' | 'MA_TO_FR') => void;
  onResetDirection?: () => void;
  colisList?: Colis[];
  clientsList?: Client[];
  onUpdateColisList?: (colis: Colis[]) => void;
  onClearAllData?: () => void;
  onRestoreDefaultData?: () => void;
  onLogout?: () => void;
  user?: UserProfile;
}

export const GoogleDriveIcon = ({ size = 24 }: { size?: number }) => (
  <Image
    source={require('../../assets/Google_Drive.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const convertColisToCSV = (colis: Colis[]): string => {
  const headers = [
    'ID',
    'Expediteur',
    'Tel Expediteur',
    'Destinataire',
    'Tel Destinataire',
    'Depart',
    'Arrivee',
    'Poids (kg)',
    'Prix (EUR)',
    'Statut',
    'Date',
    'Description',
  ];
  const rows = colis.map((c) => [
    c.id,
    `"${(c.senderName || '').replace(/"/g, '""')}"`,
    `"${c.senderPhone || ''}"`,
    `"${(c.receiverName || '').replace(/"/g, '""')}"`,
    `"${c.receiverPhone || ''}"`,
    `"${c.fromCity || ''}"`,
    `"${c.toCity || ''}"`,
    c.weight,
    c.price,
    c.status,
    `"${c.date || ''}"`,
    `"${(c.description || '').replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

// Sample template for imports
const SAMPLE_IMPORT_COLIS: Colis[] = [
  {
    id: `CX-${Math.floor(1000 + Math.random() * 9000)}`,
    senderName: 'Karim Tazi',
    senderPhone: '+212 6 61 22 33 44',
    receiverName: 'Stéphane Morel',
    receiverPhone: '+33 6 11 22 33 44',
    fromCity: 'Casablanca',
    toCity: 'Paris',
    weight: 14.5,
    price: 42,
    status: 'pending',
    date: '16/10/2026',
    description: 'Effets personnels et artisanat marocain',
  },
  {
    id: `CX-${Math.floor(1000 + Math.random() * 9000)}`,
    senderName: 'Salma El Fassi',
    senderPhone: '+212 6 70 80 90 10',
    receiverName: 'Camille Leroy',
    receiverPhone: '+33 6 99 88 77 66',
    fromCity: 'Rabat',
    toCity: 'Lyon',
    weight: 6.8,
    price: 22,
    status: 'in_transit',
    date: '16/10/2026',
    description: 'Documents et souvenirs',
  },
];

export default function SettingsPage({
  direction = 'MA_TO_FR',
  onChangeDirection,
  onResetDirection,
  colisList,
  clientsList,
  onUpdateColisList,
  onClearAllData,
  onRestoreDefaultData,
  onLogout,
  user: initialUser,
}: SettingsPageProps) {
  // Local fallback states if not provided by parent
  const [localColis, setLocalColis] = useState<Colis[]>(colisList || INITIAL_COLIS);
  const [localClients, setLocalClients] = useState<Client[]>(clientsList || INITIAL_CLIENTS);

  // Sync with prop updates if available
  const activeColisList = colisList !== undefined ? colisList : localColis;
  const activeClientsList = clientsList !== undefined ? clientsList : localClients;

  // Logged User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(
    initialUser || {
      name: 'Zakaria Akrabou',
      email: 'zakaria.akrabou@colisexpress.ma',
      phone: '+212 6 12 34 56 78',
      role: 'Administrateur Principal',
      agency: 'Casablanca • Agence Centrale',
      avatarText: 'ZA',
    }
  );

  // Google Drive State
  const [isBackingUpDrive, setIsBackingUpDrive] = useState(false);
  const [lastDriveBackup, setLastDriveBackup] = useState('Aujourd’hui à 14:15');
  const [autoDriveSync, setAutoDriveSync] = useState(true);
  const driveAccountEmail = 'zakaria.akrabou@gmail.com';

  // Password Modification Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Export Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  // Import Modal States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [parsedColisCount, setParsedColisCount] = useState<number | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Transit Direction Toggle
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

  // --- GOOGLE DRIVE BACKUP ---
  const handleGoogleDriveBackup = async () => {
    setIsBackingUpDrive(true);

    const backupPayload = {
      application: 'ColisExpress',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      account: driveAccountEmail,
      operator: userProfile.name,
      stats: {
        totalColis: activeColisList.length,
        totalClients: activeClientsList.length,
        totalWeightKg: activeColisList.reduce((acc, c) => acc + (c.weight || 0), 0),
        totalRevenueEur: activeColisList.reduce((acc, c) => acc + (c.price || 0), 0),
      },
      colis: activeColisList,
      clients: activeClientsList,
    };

    // Simulate Cloud Drive Network Request
    setTimeout(() => {
      setIsBackingUpDrive(false);
      const now = new Date();
      const timeStr = `Aujourd’hui à ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;
      setLastDriveBackup(timeStr);

      Alert.alert(
        'Sauvegarde Google Drive réussie',
        `Vos données ont été synchronisées sur Google Drive avec succès !\n\n• Compte : ${driveAccountEmail}\n• Fichier : colisexpress_backup_${now.toISOString().slice(0, 10)}.json\n• Colis sauvegardés : ${activeColisList.length}\n• Clients sauvegardés : ${activeClientsList.length}`,
        [
          { text: 'OK', style: 'default' },
          {
            text: 'Partager / Enregistrer dans Drive',
            onPress: async () => {
              try {
                await Share.share({
                  title: `ColisExpress_Drive_Backup_${now.toISOString().slice(0, 10)}.json`,
                  message: JSON.stringify(backupPayload, null, 2),
                });
              } catch (err) {
                // Ignore cancel
              }
            },
          },
        ]
      );
    }, 1100);
  };

  // --- PASSWORD UPDATE HANDLER ---
  const handleSavePassword = () => {
    if (!oldPassword.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre mot de passe actuel.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert(
        'Mot de passe mis à jour',
        'Votre mot de passe a été modifié avec succès. Veuillez l’utiliser lors de votre prochaine connexion.'
      );
    }, 800);
  };

  // --- EXPORT COLIS HANDLER ---
  const handleTriggerExport = async () => {
    const fileName = `colisexpress_colis_${new Date().toISOString().slice(0, 10)}.${
      exportFormat === 'csv' ? 'csv' : 'json'
    }`;
    const content =
      exportFormat === 'csv'
        ? convertColisToCSV(activeColisList)
        : JSON.stringify(activeColisList, null, 2);

    try {
      await Share.share({
        title: fileName,
        message: content,
      });
      setShowExportModal(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager les données.');
    }
  };

  // --- IMPORT COLIS TEXT PARSER ---
  const handleImportTextChange = (text: string) => {
    setImportText(text);
    setImportError(null);

    if (!text.trim()) {
      setParsedColisCount(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setParsedColisCount(parsed.length);
      } else if (typeof parsed === 'object' && parsed !== null) {
        setParsedColisCount(1);
      } else {
        setParsedColisCount(null);
        setImportError('Le contenu doit être un tableau JSON valide de colis.');
      }
    } catch (e) {
      setParsedColisCount(null);
      setImportError('Syntaxe JSON invalide. Vérifiez le format.');
    }
  };

  // --- EXECUTE IMPORT ---
  const handleExecuteImport = (mode: 'merge' | 'replace') => {
    if (!importText.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir ou coller des données JSON à importer.');
      return;
    }

    try {
      const parsed = JSON.parse(importText);
      const items: any[] = Array.isArray(parsed) ? parsed : [parsed];

      const validated: Colis[] = items.map((item, index) => ({
        id: item.id || `CX-${Math.floor(1000 + Math.random() * 9000)}`,
        senderName: item.senderName || 'Expéditeur inconnu',
        senderPhone: item.senderPhone || '',
        receiverName: item.receiverName || 'Destinataire inconnu',
        receiverPhone: item.receiverPhone || '',
        fromCity: item.fromCity || (direction === 'MA_TO_FR' ? 'Casablanca' : 'Paris'),
        toCity: item.toCity || (direction === 'MA_TO_FR' ? 'Paris' : 'Casablanca'),
        weight: Number(item.weight) || 1.0,
        price: Number(item.price) || 20,
        status: ['pending', 'in_transit', 'delivered'].includes(item.status)
          ? item.status
          : 'pending',
        date: item.date || '16/10/2026',
        description: item.description || 'Colis importé',
        isPaid: item.isPaid,
        isADomicile: item.isADomicile,
      }));

      let updatedList: Colis[] = [];
      if (mode === 'replace') {
        updatedList = validated;
      } else {
        // Merge without duplicating ID
        const existingIds = new Set(activeColisList.map((c) => c.id));
        const nonDuplicates = validated.filter((c) => !existingIds.has(c.id));
        updatedList = [...nonDuplicates, ...activeColisList];
      }

      if (onUpdateColisList) {
        onUpdateColisList(updatedList);
      } else {
        setLocalColis(updatedList);
      }

      setShowImportModal(false);
      setImportText('');
      setParsedColisCount(null);

      Alert.alert(
        'Importation réussie',
        `${validated.length} colis ont été importés avec succès (${
          mode === 'replace' ? 'Liste remplacée' : 'Fusionné avec les colis existants'
        }). Total : ${updatedList.length} colis.`
      );
    } catch (e) {
      Alert.alert('Erreur d’importation', 'Impossible de parser le JSON des colis.');
    }
  };

  // --- RESTORE / EMPTY ALL DATA ---
  const handleEmptyAllData = () => {
    Alert.alert(
      '⚠️ Vider toutes les données',
      'Êtes-vous absolument sûr de vouloir supprimer TOUTES les données ?\n\nCette action supprimera définitivement l’intégralité des colis (' +
        activeColisList.length +
        ') et des clients (' +
        activeClientsList.length +
        ') de la base de données locale. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider toutes les données',
          style: 'destructive',
          onPress: () => {
            if (onClearAllData) {
              onClearAllData();
            }
            if (onUpdateColisList) {
              onUpdateColisList([]);
            }
            setLocalColis([]);
            setLocalClients([]);
            Alert.alert(
              'Données vidées',
              'Toutes les données ont été effacées. L’application est désormais vierge.'
            );
          },
        },
      ]
    );
  };

  // --- RESTORE DEFAULT DEMO DATA ---
  const handleRestoreDefaultData = () => {
    Alert.alert(
      'Restaurer les données de test',
      'Souhaitez-vous recharger la liste standard des colis et clients de démonstration ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Restaurer les données démo',
          onPress: () => {
            if (onRestoreDefaultData) {
              onRestoreDefaultData();
            }
            if (onUpdateColisList) {
              onUpdateColisList(INITIAL_COLIS);
            }
            setLocalColis(INITIAL_COLIS);
            setLocalClients(INITIAL_CLIENTS);
            Alert.alert(
              'Données restaurées',
              'Les données de démonstration ont été restaurées avec succès.'
            );
          },
        },
      ]
    );
  };

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter de votre session opérateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    );
  };

  // Password strength helper
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: '#cbd5e1', width: '0%' };
    if (pwd.length < 6) return { label: 'Trop court', color: '#ef4444', width: '30%' };
    if (pwd.length < 9) return { label: 'Moyen', color: '#f59e0b', width: '65%' };
    return { label: 'Fort & Sécurisé', color: '#10b981', width: '100%' };
  };

  const passStrength = getPasswordStrength(newPassword);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />

      {/* --- Top Header (Home Theme Style) --- */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerTop}>
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Paramètres</Text>
              <Text style={styles.headerSubtitle}>
                Profil • Google Drive • Données & Restauration
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ============================================================== */}
        {/* 1. LOGGED USER PROFILE CARD                                    */}
        {/* ============================================================== */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{userProfile.avatarText || 'ZA'}</Text>
              </View>
              <View style={styles.onlineBadge} />
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Actif</Text>
                </View>
              </View>
              <Text style={styles.profileRole}>{userProfile.role}</Text>
              <Text style={styles.profileAgency}>{userProfile.agency}</Text>
            </View>
          </View>

          {/* User Contact & Security Info */}
          <View style={styles.profileDetails}>
            <View style={styles.profileDetailRow}>
              <Mail size={15} color="#64748b" style={{ marginRight: 8 }} />
              <Text style={styles.profileDetailText}>{userProfile.email}</Text>
            </View>
            <View style={[styles.profileDetailRow, { marginTop: 6 }]}>
              <Phone size={15} color="#64748b" style={{ marginRight: 8 }} />
              <Text style={styles.profileDetailText}>{userProfile.phone}</Text>
            </View>
          </View>

          {/* Action: Modify Password */}
          <TouchableOpacity
            style={styles.modifyPasswordBtn}
            onPress={() => setShowPasswordModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.modifyPasswordLeft}>
              <View style={styles.keyIconCircle}>
                <Key size={16} color="#2563eb" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.modifyPasswordText}>Modifier mon mot de passe</Text>
                <Text style={styles.modifyPasswordSubtext}>Sécuriser l'accès à ce compte</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* 2. TRANSIT DIRECTION SECTION                                   */}
        {/* ============================================================== */}
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
              <ArrowLeftRight
                size={14}
                color="#2563eb"
                strokeWidth={2.4}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.swapBtnText}>Inverser</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================== */}
        {/* 3. GOOGLE DRIVE CLOUD BACKUP                                   */}
        {/* ============================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Sauvegarde Google Drive</Text>
            <View style={styles.cloudStatusBadge}>
              <View style={styles.cloudStatusDot} />
              <Text style={styles.cloudStatusText}>Drive Connecté</Text>
            </View>
          </View>

          {/* Drive Account Card */}
          <View style={styles.driveAccountBox}>
            <View style={styles.driveAccountLeft}>
              <View style={styles.driveIconBox}>
                <GoogleDriveIcon size={26} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driveAccountTitle}>Google Drive Cloud</Text>
                <Text style={styles.driveAccountEmail}>{driveAccountEmail}</Text>
                <Text style={styles.driveLastSync}>Dernière synchro : {lastDriveBackup}</Text>
              </View>
            </View>
          </View>

          {/* Auto Sync to Drive Toggle */}
          <View style={styles.driveToggleRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.driveToggleTitle}>Sauvegarde auto vers Google Drive</Text>
              <Text style={styles.driveToggleSub}>
                Envoi automatique quotidien des colis & clients
              </Text>
            </View>
            <Switch
              value={autoDriveSync}
              onValueChange={setAutoDriveSync}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={autoDriveSync ? '#2563eb' : '#f8fafc'}
            />
          </View>

          {/* Primary Action Button: Save Now to Google Drive */}
          <TouchableOpacity
            style={styles.backupDriveBtn}
            onPress={handleGoogleDriveBackup}
            disabled={isBackingUpDrive}
            activeOpacity={0.85}
          >
            {isBackingUpDrive ? (
              <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
            ) : (
              <View style={{ marginRight: 8 }}>
                <GoogleDriveIcon size={18} />
              </View>
            )}
            <Text style={styles.backupDriveBtnText}>
              {isBackingUpDrive
                ? 'Sauvegarde sur Google Drive en cours...'
                : 'Sauvegarder sur Google Drive'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* 4. IMPORT & EXPORT COLIS DATA                                  */}
        {/* ============================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Gestion des Données Colis</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{activeColisList.length} Colis</Text>
            </View>
          </View>

          {/* Export Colis Button */}
          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() => setShowExportModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
                <Download size={18} color="#2563eb" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Exporter les données des colis</Text>
                <Text style={styles.settingDescription}>
                  Format JSON technique ou fichier CSV (Excel)
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>

          {/* Import Colis Button */}
          <TouchableOpacity
            style={[styles.clickableRow, styles.rowBorder]}
            onPress={() => {
              setImportText('');
              setImportError(null);
              setParsedColisCount(null);
              setShowImportModal(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
                <Upload size={18} color="#16a34a" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Importer des colis</Text>
                <Text style={styles.settingDescription}>
                  Coller un JSON de colis ou fusionner des données
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* 5. RESTORE APP / DANGER ZONE (EMPTY ALL DATA)                   */}
        {/* ============================================================== */}
        <View style={[styles.sectionCard, styles.dangerCard]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: '#dc2626' }]}>
              Restauration & Remise à Zéro
            </Text>
            <View style={styles.dangerBadge}>
              <Text style={styles.dangerBadgeText}>Zone de Sécurité</Text>
            </View>
          </View>

          {/* Action 1: Empty All Data */}
          <TouchableOpacity
            style={styles.clickableRow}
            onPress={handleEmptyAllData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#fef2f2' }]}>
                <Trash size={18} color="#dc2626" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingLabel, { color: '#dc2626' }]}>
                  Vider toutes les données
                </Text>
                <Text style={styles.settingDescription}>
                  Restauration d'usine • Effacer tous les colis et clients
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#dc2626" />
          </TouchableOpacity>

          {/* Action 2: Restore Default Demo Data */}
          <TouchableOpacity
            style={[styles.clickableRow, styles.rowBorder]}
            onPress={handleRestoreDefaultData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#fffbeb' }]}>
                <RotateCcw size={18} color="#d97706" strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingLabel, { color: '#b45309' }]}>
                  Restaurer les données démo
                </Text>
                <Text style={styles.settingDescription}>
                  Recharger la liste standard des colis et clients de test
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* 6. SYSTEM INFO & LOGOUT                                        */}
        {/* ============================================================== */}
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

      {/* ============================================================== */}
      {/* MODAL: CHANGE PASSWORD                                         */}
      {/* ============================================================== */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
                  <Key size={18} color="#2563eb" strokeWidth={2.4} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.modalTitle}>Modifier le mot de passe</Text>
                  <Text style={styles.modalSubtitle}>{userProfile.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Old password */}
              <Text style={styles.inputLabel}>Mot de passe actuel</Text>
              <View style={styles.inputContainer}>
                <Lock size={16} color="#94a3b8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Saisissez votre mot de passe actuel"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showOldPass}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowOldPass(!showOldPass)}>
                  {showOldPass ? (
                    <EyeOff size={18} color="#64748b" />
                  ) : (
                    <Eye size={18} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>

              {/* New password */}
              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Nouveau mot de passe</Text>
              <View style={styles.inputContainer}>
                <Key size={16} color="#94a3b8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Au moins 6 caractères"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showNewPass}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                  {showNewPass ? (
                    <EyeOff size={18} color="#64748b" />
                  ) : (
                    <Eye size={18} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Strength Meter */}
              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarBg}>
                    <View
                      style={[
                        styles.strengthBarFill,
                        { width: passStrength.width as any, backgroundColor: passStrength.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthText, { color: passStrength.color }]}>
                    {passStrength.label}
                  </Text>
                </View>
              )}

              {/* Confirm new password */}
              <Text style={[styles.inputLabel, { marginTop: 14 }]}>
                Confirmer le nouveau mot de passe
              </Text>
              <View style={styles.inputContainer}>
                <Lock size={16} color="#94a3b8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Répétez le nouveau mot de passe"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showConfirmPass}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                  {showConfirmPass ? (
                    <EyeOff size={18} color="#64748b" />
                  ) : (
                    <Eye size={18} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>

              {confirmPassword.length > 0 && (
                <View style={styles.matchIndicator}>
                  {newPassword === confirmPassword ? (
                    <View style={styles.matchRow}>
                      <Check size={14} color="#16a34a" />
                      <Text style={styles.matchTextSuccess}>Les mots de passe correspondent</Text>
                    </View>
                  ) : (
                    <View style={styles.matchRow}>
                      <X size={14} color="#dc2626" />
                      <Text style={styles.matchTextError}>Les mots de passe ne correspondent pas</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSavePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSubmitText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL: EXPORT COLIS                                            */}
      {/* ============================================================== */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
                  <Download size={18} color="#2563eb" strokeWidth={2.4} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.modalTitle}>Exporter les Colis</Text>
                  <Text style={styles.modalSubtitle}>{activeColisList.length} colis disponibles</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowExportModal(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Format Selection */}
            <Text style={styles.inputLabel}>Sélectionnez le format d'exportation</Text>
            <View style={styles.formatSelector}>
              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'json' && styles.formatOptionActive,
                ]}
                onPress={() => setExportFormat('json')}
                activeOpacity={0.8}
              >
                <FileText
                  size={20}
                  color={exportFormat === 'json' ? '#2563eb' : '#64748b'}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  style={[
                    styles.formatOptionTitle,
                    exportFormat === 'json' && styles.formatOptionTitleActive,
                  ]}
                >
                  JSON
                </Text>
                <Text style={styles.formatOptionDesc}>Sauvegarde complète</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'csv' && styles.formatOptionActive,
                ]}
                onPress={() => setExportFormat('csv')}
                activeOpacity={0.8}
              >
                <FileSpreadsheet
                  size={20}
                  color={exportFormat === 'csv' ? '#2563eb' : '#64748b'}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  style={[
                    styles.formatOptionTitle,
                    exportFormat === 'csv' && styles.formatOptionTitleActive,
                  ]}
                >
                  CSV / Excel
                </Text>
                <Text style={styles.formatOptionDesc}>Tableur & Rapports</Text>
              </TouchableOpacity>
            </View>

            {/* Export Summary Box */}
            <View style={styles.exportSummaryBox}>
              <Text style={styles.exportSummaryTitle}>Aperçu du contenu :</Text>
              <Text style={styles.exportSummaryItem}>• {activeColisList.length} colis inclus</Text>
              <Text style={styles.exportSummaryItem}>
                • Poids total :{' '}
                {activeColisList.reduce((acc, c) => acc + (c.weight || 0), 0).toFixed(1)} kg
              </Text>
              <Text style={styles.exportSummaryItem}>
                • Montant total :{' '}
                {activeColisList.reduce((acc, c) => acc + (c.price || 0), 0)} €
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleTriggerExport}
                activeOpacity={0.8}
              >
                <Download size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalSubmitText}>Exporter & Partager</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL: IMPORT COLIS                                            */}
      {/* ============================================================== */}
      <Modal
        visible={showImportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
                  <Upload size={18} color="#16a34a" strokeWidth={2.4} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.modalTitle}>Importer des Colis</Text>
                  <Text style={styles.modalSubtitle}>Format JSON attendu</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowImportModal(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Quick Template Button */}
            <TouchableOpacity
              style={styles.templateBtn}
              onPress={() => {
                const sampleStr = JSON.stringify(SAMPLE_IMPORT_COLIS, null, 2);
                handleImportTextChange(sampleStr);
              }}
              activeOpacity={0.7}
            >
              <FileText size={15} color="#2563eb" style={{ marginRight: 6 }} />
              <Text style={styles.templateBtnText}>Charger un exemple de colis valide</Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Coller les données JSON des colis :</Text>
            <TextInput
              style={styles.importTextArea}
              multiline
              numberOfLines={7}
              placeholder="Exemple : [ { &quot;id&quot;: &quot;CX-1001&quot;, &quot;senderName&quot;: &quot;Ahmed&quot;, ... } ]"
              placeholderTextColor="#94a3b8"
              value={importText}
              onChangeText={handleImportTextChange}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Validation Feedback */}
            {parsedColisCount !== null && (
              <View style={styles.importSuccessBox}>
                <CheckCircle2 size={16} color="#16a34a" style={{ marginRight: 6 }} />
                <Text style={styles.importSuccessText}>
                  {parsedColisCount} colis valide{parsedColisCount > 1 ? 's' : ''} détecté
                  {parsedColisCount > 1 ? 's' : ''} !
                </Text>
              </View>
            )}

            {importError && (
              <View style={styles.importErrorBox}>
                <X size={16} color="#dc2626" style={{ marginRight: 6 }} />
                <Text style={styles.importErrorText}>{importError}</Text>
              </View>
            )}

            {/* Action Buttons: Merge or Replace */}
            <View style={styles.importActionRow}>
              <TouchableOpacity
                style={styles.importMergeBtn}
                onPress={() => handleExecuteImport('merge')}
                disabled={!parsedColisCount}
                activeOpacity={0.8}
              >
                <Text style={styles.importMergeBtnText}>
                  Fusionner (+{parsedColisCount || 0})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.importReplaceBtn}
                onPress={() => handleExecuteImport('replace')}
                disabled={!parsedColisCount}
                activeOpacity={0.8}
              >
                <Text style={styles.importReplaceBtnText}>Remplacer tout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 35,
  },

  /* --- Profile Card --- */
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  statusPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusPillText: {
    color: '#15803d',
    fontSize: 10.5,
    fontWeight: '700',
  },
  profileRole: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  profileAgency: {
    color: '#64748b',
    fontSize: 11.5,
    marginTop: 1,
  },
  profileDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDetailText: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '500',
  },
  modifyPasswordBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modifyPasswordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modifyPasswordText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '700',
  },
  modifyPasswordSubtext: {
    color: '#60a5fa',
    fontSize: 11,
    marginTop: 1,
  },

  /* --- Section Card --- */
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
  dangerCard: {
    borderColor: '#fecaca',
    backgroundColor: '#fffcfc',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 11.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  countBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countBadgeText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
  },
  dangerBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dangerBadgeText: {
    color: '#dc2626',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* --- Route Item --- */
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

  /* --- Google Drive Section --- */
  cloudStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  cloudStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
    marginRight: 5,
  },
  cloudStatusText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '700',
  },
  driveAccountBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  driveAccountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driveIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  driveAccountTitle: {
    color: '#0f172a',
    fontSize: 13.5,
    fontWeight: '700',
  },
  driveAccountEmail: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  driveLastSync: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  driveToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  driveToggleTitle: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  driveToggleSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  backupDriveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066da',
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#0066da',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  backupDriveBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },

  /* --- Clickable rows --- */
  clickableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 4,
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

  /* --- Modal Styles --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 18,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#64748b',
    fontSize: 11.5,
    marginTop: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    color: '#334155',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  textInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 13,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  strengthBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  strengthBarFill: {
    height: '100%',
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '700',
  },
  matchIndicator: {
    marginTop: 6,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchTextSuccess: {
    color: '#16a34a',
    fontSize: 11.5,
    fontWeight: '600',
    marginLeft: 4,
  },
  matchTextError: {
    color: '#dc2626',
    fontSize: 11.5,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 10,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  modalCancelText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#2563eb',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* --- Export Modal Format Selector --- */
  formatSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  formatOption: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  formatOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  formatOptionTitle: {
    color: '#334155',
    fontSize: 13.5,
    fontWeight: '700',
  },
  formatOptionTitleActive: {
    color: '#2563eb',
  },
  formatOptionDesc: {
    color: '#64748b',
    fontSize: 10.5,
    marginTop: 2,
    textAlign: 'center',
  },
  exportSummaryBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exportSummaryTitle: {
    color: '#0f172a',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  exportSummaryItem: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
  },

  /* --- Import Modal Styles --- */
  templateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  templateBtnText: {
    color: '#2563eb',
    fontSize: 11.5,
    fontWeight: '700',
  },
  importTextArea: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    color: '#0f172a',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    height: 120,
    textAlignVertical: 'top',
  },
  importSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  importSuccessText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '700',
  },
  importErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  importErrorText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  importActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  importMergeBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  importMergeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  importReplaceBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  importReplaceBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
