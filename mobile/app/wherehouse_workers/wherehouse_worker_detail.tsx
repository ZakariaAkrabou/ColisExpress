import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {
  X,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Edit3,
  Trash2,
  HardHat,
  Globe,
} from 'lucide-react-native';
import { WarehouseWorker } from './types';
import {
  WhatsAppIcon,
  contactWorkerViaWhatsApp,
  callWorkerDirectly,
  emailWorkerDirectly,
} from './whatsappUtils';

export interface WarehouseWorkerDetailProps {
  worker: WarehouseWorker | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (worker: WarehouseWorker) => void;
  onDelete: (workerId: string) => void;
}

export const WarehouseWorkerDetailModal: React.FC<WarehouseWorkerDetailProps> = ({
  worker,
  visible,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!worker) return null;

  const initials = worker.fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'ouvrier d'entrepôt",
      `Êtes-vous certain de vouloir supprimer le compte de ${worker.fullName} ? Cette action révoquera immédiatement ses accès à l'application.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            onDelete(worker.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials || 'WW'}</Text>
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.workerName}>{worker.fullName}</Text>
                <Text style={styles.workerIdBadge}>ID: {worker.id}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {/* Primary Action: Direct WhatsApp Chat */}
            <TouchableOpacity
              style={styles.whatsAppButtonLarge}
              onPress={() =>
                contactWorkerViaWhatsApp(worker.phoneNumber, worker.fullName)
              }
              activeOpacity={0.85}
            >
              <View style={styles.whatsAppIconCircle}>
                <WhatsAppIcon size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.whatsAppBtnTitle}>Contacter sur WhatsApp</Text>
                <Text style={styles.whatsAppBtnSub}>
                  Ouvrir une discussion directe avec {worker.fullName}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Quick Details Cards */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Coordonnées & Accès</Text>

              {/* Phone Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoLeft}>
                  <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
                    <Phone size={18} color="#2563eb" />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.infoLabel}>Numéro de téléphone</Text>
                    <View style={styles.phoneValueRow}>
                      <Globe size={15} color="#2563eb" />
                      <Text style={styles.infoValue}>{worker.phoneNumber}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => callWorkerDirectly(worker.phoneNumber)}
                  activeOpacity={0.7}
                >
                  <Phone size={16} color="#2563eb" />
                </TouchableOpacity>
              </View>

              {/* Email Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoLeft}>
                  <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                    <Mail size={18} color="#16a34a" />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.infoLabel}>Adresse email</Text>
                    <Text style={styles.infoValue}>{worker.email}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => emailWorkerDirectly(worker.email, worker.fullName)}
                  activeOpacity={0.7}
                >
                  <Mail size={16} color="#16a34a" />
                </TouchableOpacity>
              </View>

              {/* Password Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoLeft}>
                  <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
                    <Lock size={18} color="#d97706" />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.infoLabel}>Mot de passe de session</Text>
                    <Text style={styles.passwordValue}>
                      {showPassword ? worker.password : '••••••••••••'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={16} color="#64748b" />
                  ) : (
                    <Eye size={16} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Date Card */}
              {worker.createdAt ? (
                <View style={styles.infoCard}>
                  <View style={styles.infoLeft}>
                    <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
                      <Calendar size={18} color="#64748b" />
                    </View>
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={styles.infoLabel}>Date d'enregistrement</Text>
                      <Text style={styles.infoValue}>{worker.createdAt}</Text>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Trash2 size={16} color="#dc2626" />
              <Text style={styles.deleteBtnText}>Supprimer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                onClose();
                onEdit(worker);
              }}
              activeOpacity={0.85}
            >
              <Edit3 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.editBtnText}>Modifier l'ouvrier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  workerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  workerIdBadge: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
  },
  whatsAppButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  whatsAppIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsAppBtnTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  whatsAppBtnSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  detailsSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  phoneValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 6,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  passwordValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 6,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
