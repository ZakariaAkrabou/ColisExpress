import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Check,
  Building2,
  ShieldCheck,
  UserPlus,
} from 'lucide-react-native';
import { Client } from './clientPage';
import { MoroccoFlagBadge, FranceFlagBadge } from '../../components/common/Icons';

export interface CreateClientProps {
  onBack?: () => void;
  onClientCreated?: (newClient: Client) => void;
  existingClients?: Client[];
}

export default function CreateClientScreen({
  onBack,
  onClientCreated,
  existingClients = [],
}: CreateClientProps) {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState<'+212' | '+33'>('+212');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [addressMorocco, setAddressMorocco] = useState('');
  const [addressFrance, setAddressFrance] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom complet est obligatoire';
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire';
    } else {
      const fullPhone = `${countryCode} ${phoneNumber.trim()}`.replace(/\s+/g, '');
      const duplicate = existingClients.some(
        (c) => c.phone.replace(/\s+/g, '') === fullPhone
      );
      if (duplicate) {
        newErrors.phone = 'Ce numéro de téléphone est déjà enregistré pour un autre client';
      }
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Format d’email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const nextIdNumber = existingClients.length + 1;
    const formattedId = `CL-${String(nextIdNumber).padStart(3, '0')}`;
    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

    const newClient: Client = {
      id: formattedId,
      name: name.trim(),
      phone: fullPhone,
      email: email.trim() || undefined,
      city: city.trim() || (countryCode === '+212' ? 'Casablanca' : 'Paris'),
      address: addressMorocco.trim() || addressFrance.trim() || city.trim(),
      addressMorocco: addressMorocco.trim() || undefined,
      addressFrance: addressFrance.trim() || undefined,
      totalShipments: 0,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };

    if (onClientCreated) {
      onClientCreated(newClient);
    } else {
      Alert.alert('Succès', `Le client ${newClient.name} a été enregistré avec succès !`);
      onBack?.();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />

      <View style={styles.headerWrapper}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>Nouveau Client</Text>
            <Text style={styles.headerSubtitle}>Ajouter un expéditeur ou destinataire</Text>
          </View>

          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations Personnelles</Text>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Nom complet</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <View style={[styles.inputContainer, errors.name ? styles.inputError : null]}>
              <User size={18} color={errors.name ? '#ef4444' : '#2563eb'} strokeWidth={2.2} />
              <TextInput
                style={styles.textInput}
                placeholder="Ex : Ahmed El Idrissi"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Numéro de téléphone</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>

            <View style={styles.phoneInputRow}>
              <View style={styles.countrySelector}>
                <TouchableOpacity
                  style={[
                    styles.countryTab,
                    countryCode === '+212' ? styles.countryTabActive : null,
                  ]}
                  onPress={() => setCountryCode('+212')}
                  activeOpacity={0.8}
                >
                  <MoroccoFlagBadge size={18} />
                  <Text
                    style={[
                      styles.countryCodeText,
                      countryCode === '+212' ? styles.countryCodeTextActive : null,
                    ]}
                  >
                    +212
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.countryTab,
                    countryCode === '+33' ? styles.countryTabActive : null,
                  ]}
                  onPress={() => setCountryCode('+33')}
                  activeOpacity={0.8}
                >
                  <FranceFlagBadge size={18} />
                  <Text
                    style={[
                      styles.countryCodeText,
                      countryCode === '+33' ? styles.countryCodeTextActive : null,
                    ]}
                  >
                    +33
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.phoneInputContainer,
                  errors.phone ? styles.inputError : null,
                ]}
              >
                <Phone size={18} color={errors.phone ? '#ef4444' : '#2563eb'} strokeWidth={2.2} />
                <TextInput
                  style={styles.textInput}
                  placeholder="6 12 34 56 78"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                />
              </View>
            </View>
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Adresse Email (Optionnel)</Text>
            <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
              <Mail size={18} color={errors.email ? '#ef4444' : '#64748b'} strokeWidth={2.2} />
              <TextInput
                style={styles.textInput}
                placeholder="Ex : ahmed.idrissi@example.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Adresses Spécifiques</Text>

          <View style={styles.fieldGroup}>
            <View style={styles.addressSectionHeader}>
              <MoroccoFlagBadge size={20} />
              <Text style={styles.addressLabel}>Adresse au Maroc</Text>
            </View>
            <View style={styles.inputContainer}>
              <MapPin size={18} color="#dc2626" strokeWidth={2.2} />
              <TextInput
                style={styles.textInput}
                placeholder="Ex : 24 Rue de Goulmima, Bourgogne, Casablanca"
                placeholderTextColor="#94a3b8"
                value={addressMorocco}
                onChangeText={setAddressMorocco}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.addressSectionHeader}>
              <FranceFlagBadge size={20} />
              <Text style={styles.addressLabel}>Adresse en France</Text>
            </View>
            <View style={styles.inputContainer}>
              <MapPin size={18} color="#2563eb" strokeWidth={2.2} />
              <TextInput
                style={styles.textInput}
                placeholder="Ex : 142 Rue de Rivoli, 75001 Paris"
                placeholderTextColor="#94a3b8"
                value={addressFrance}
                onChangeText={setAddressFrance}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Ville principale</Text>
            <View style={styles.inputContainer}>
              <Building2 size={18} color="#64748b" strokeWidth={2.2} />
              <TextInput
                style={styles.textInput}
                placeholder="Ex : Casablanca / Paris"
                placeholderTextColor="#94a3b8"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>
        </View>

        <View style={styles.infoNoticeBox}>
          <ShieldCheck size={20} color="#2563eb" strokeWidth={2.2} />
          <Text style={styles.infoNoticeText}>
            Les informations du client seront synchronisées avec la base de données locale et associées lors de la création d’un envoi.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSave}
          activeOpacity={0.88}
        >
          <UserPlus size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 8 }} />
          <Text style={styles.submitButtonText}>Enregistrer le client</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerWrapper: {
    backgroundColor: '#1d4ed8',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 12,
    paddingBottom: 18,
    paddingHorizontal: 16,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    color: '#bfdbfe',
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  textInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 13.5,
    fontWeight: '500',
    marginLeft: 10,
    paddingVertical: 0,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
  phoneInputRow: {
    flexDirection: 'column',
    gap: 8,
  },
  countrySelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 3,
  },
  countryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  countryTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  countryCodeText: {
    color: '#64748b',
    fontSize: 12.5,
    fontWeight: '700',
  },
  countryCodeTextActive: {
    color: '#1d4ed8',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  addressSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  addressLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  infoNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 10,
    gap: 10,
  },
  infoNoticeText: {
    color: '#1e40af',
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 16,
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
  },
  cancelButton: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 13.5,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
