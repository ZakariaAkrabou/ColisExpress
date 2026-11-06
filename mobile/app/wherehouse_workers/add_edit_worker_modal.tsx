import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  HardHat,
  Globe,
} from 'lucide-react-native';
import { WarehouseWorker, WorkerModalMode } from './types';

export interface AddEditWorkerModalProps {
  visible: boolean;
  mode: WorkerModalMode;
  worker?: WarehouseWorker | null;
  onClose: () => void;
  onSave: (workerData: Omit<WarehouseWorker, 'id' | 'createdAt'>, workerId?: string) => void;
}

export const AddEditWorkerModal: React.FC<AddEditWorkerModalProps> = ({
  visible,
  mode,
  worker,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState<'+212' | '+33'>('+212');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && worker) {
        setFullName(worker.fullName || '');
        const isFr = (worker.phoneNumber || '').startsWith('+33');
        setCountryCode(isFr ? '+33' : '+212');
        const strippedPhone = (worker.phoneNumber || '')
          .replace('+212', '')
          .replace('+33', '')
          .trim();
        setPhoneRaw(strippedPhone);
        setEmail(worker.email || '');
        setPassword(worker.password || '');
        setShowPassword(false);
      } else {
        // Reset for new worker
        setFullName('');
        setCountryCode('+212');
        setPhoneRaw('');
        setEmail('');
        setPassword('');
        setShowPassword(false);
      }
      setErrors({});
    }
  }, [visible, mode, worker]);

  // Quick password generator
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setShowPassword(true);
  };

  const validate = (): boolean => {
    const newErrors: {
      fullName?: string;
      phoneNumber?: string;
      email?: string;
      password?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Le nom complet est obligatoire.';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Le nom doit comporter au moins 3 caractères.';
    }

    if (!phoneRaw.trim()) {
      newErrors.phoneNumber = 'Le numéro de téléphone est obligatoire.';
    } else if (phoneRaw.replace(/[^0-9]/g, '').length < 8) {
      newErrors.phoneNumber = 'Numéro de téléphone incomplet (min 8 chiffres).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "L'adresse email est obligatoire.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Format d’email invalide (ex: nom@domaine.com).';
    }

    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est obligatoire.';
    } else if (password.trim().length < 6) {
      newErrors.password = 'Le mot de passe doit comporter au moins 6 caractères.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert(
        'Formulaire incomplet',
        'Veuillez corriger les erreurs indiquées avant d’enregistrer.'
      );
      return;
    }

    const cleanedRaw = phoneRaw.trim().replace(/\s+/g, ' ');
    const formattedPhone = `${countryCode} ${cleanedRaw}`;

    const workerPayload: Omit<WarehouseWorker, 'id' | 'createdAt'> = {
      fullName: fullName.trim(),
      phoneNumber: formattedPhone,
      email: email.trim().toLowerCase(),
      password: password.trim(),
    };

    onSave(workerPayload, worker?.id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.headerIconCircle}>
                <HardHat size={20} color="#2563eb" strokeWidth={2.4} />
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.modalTitle}>
                  {mode === 'add'
                    ? "Nouvel Ouvrier d'Entrepôt"
                    : "Modifier l'Ouvrier"}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {mode === 'add'
                    ? "Créer un profil avec mot de passe et contact"
                    : `Mettre à jour les informations de ${worker?.fullName || ''}`}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* 1. Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Nom complet <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputBox,
                  errors.fullName ? styles.inputBoxError : null,
                ]}
              >
                <User size={18} color={errors.fullName ? '#ef4444' : '#64748b'} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Ex: Youssef Berrada"
                  placeholderTextColor="#94a3b8"
                  value={fullName}
                  onChangeText={(val: string) => {
                    setFullName(val);
                    if (errors.fullName) {
                      setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }
                  }}
                  autoCapitalize="words"
                />
              </View>
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}
            </View>

            {/* 2. Phone Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Numéro de téléphone (WhatsApp){' '}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View
                style={[
                  styles.phoneRow,
                  errors.phoneNumber ? styles.inputBoxError : null,
                ]}
              >
                {/* Prefix Toggle with Lucide Globe Icon */}
                <TouchableOpacity
                  style={styles.countryPicker}
                  onPress={() =>
                    setCountryCode(countryCode === '+212' ? '+33' : '+212')
                  }
                  activeOpacity={0.8}
                >
                  <Globe size={16} color="#2563eb" strokeWidth={2.2} />
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                </TouchableOpacity>

                <View style={styles.phoneDivider} />

                <TextInput
                  style={styles.phoneInput}
                  placeholder="6 12 34 56 78"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={phoneRaw}
                  onChangeText={(val: string) => {
                    setPhoneRaw(val);
                    if (errors.phoneNumber) {
                      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                    }
                  }}
                />
              </View>
              {errors.phoneNumber ? (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Sera utilisé pour contacter l’ouvrier directement sur WhatsApp.
                </Text>
              )}
            </View>

            {/* 3. Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Adresse e-mail <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputBox,
                  errors.email ? styles.inputBoxError : null,
                ]}
              >
                <Mail size={18} color={errors.email ? '#ef4444' : '#64748b'} />
                <TextInput
                  style={styles.textInput}
                  placeholder="nom@colisexpress.ma"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val: string) => {
                    setEmail(val);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* 4. Password */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelWithAction}>
                <Text style={styles.fieldLabel}>
                  Mot de passe <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.generateBtn}
                  onPress={handleGeneratePassword}
                  activeOpacity={0.7}
                >
                  <Sparkles size={13} color="#2563eb" style={{ marginRight: 4 }} />
                  <Text style={styles.generateBtnText}>Générer</Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.inputBox,
                  errors.password ? styles.inputBoxError : null,
                ]}
              >
                <Lock size={18} color={errors.password ? '#ef4444' : '#64748b'} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Mot de passe (min. 6 car.)"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val: string) => {
                    setPassword(val);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#64748b" />
                  ) : (
                    <Eye size={18} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Mot de passe d'accès pour ce compte ouvrier.
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Check size={18} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>
                {mode === 'add' ? "Ajouter l'ouvrier" : 'Enregistrer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  labelWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#ef4444',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
  },
  generateBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  inputBoxError: {
    borderColor: '#ef4444',
    backgroundColor: '#fff5f5',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 10,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
    marginLeft: 6,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 2,
  },
  helperText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    marginLeft: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
