import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Package,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Truck,
  Edit3,
  Trash2,
  Check,
  User,
  Building2,
  AlertTriangle,
} from 'lucide-react-native';
import { Client } from './clientPage';
import { Colis } from '../colis/colis_page';
import { MoroccoFlagBadge, FranceFlagBadge } from '../../components/common/Icons';

const { height } = Dimensions.get('window');

export interface ClientDetailProps {
  client: Client | null;
  visible: boolean;
  onClose: () => void;
  colisList?: Colis[];
  onUpdateClient?: (updatedClient: Client) => void;
  onDeleteClient?: (clientId: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailProps> = ({
  client,
  visible,
  onClose,
  colisList = [],
  onUpdateClient,
  onDeleteClient,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editCountryCode, setEditCountryCode] = useState<'+212' | '+33'>('+212');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editAddressMorocco, setEditAddressMorocco] = useState('');
  const [editAddressFrance, setEditAddressFrance] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (client) {
      setIsEditing(false);
      setEditName(client.name);
      
      const isMoroccoPhone = client.phone.startsWith('+212');
      setEditCountryCode(isMoroccoPhone ? '+212' : '+33');
      
      const rawNumber = client.phone.replace('+212', '').replace('+33', '').trim();
      setEditPhone(rawNumber);
      
      setEditEmail(client.email || '');
      setEditCity(client.city || '');
      setEditAddressMorocco(client.addressMorocco || client.address || '');
      setEditAddressFrance(client.addressFrance || '');
      setErrors({});
    }
  }, [client, visible]);

  if (!client) return null;

  const isMorocco = client.phone.startsWith('+212');
  const initials = client.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Associated colis for this client
  const clientColis = colisList.filter(
    (c) =>
      c.senderPhone.replace(/\s+/g, '') === client.phone.replace(/\s+/g, '') ||
      c.receiverPhone.replace(/\s+/g, '') === client.phone.replace(/\s+/g, '') ||
      c.senderName.toLowerCase() === client.name.toLowerCase() ||
      c.receiverName.toLowerCase() === client.name.toLowerCase()
  );

  const handleCall = () => {
    const cleanPhone = client.phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Appel', `Appel direct vers le ${client.phone}`);
    });
  };

  const handleWhatsApp = () => {
    const cleanPhone = client.phone.replace(/[^0-9]/g, '');
    const url = `whatsapp://send?phone=${cleanPhone}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp', `Envoi de message WhatsApp à ${client.name} (${client.phone})`);
    });
  };

  const handleEmail = () => {
    if (!client.email) return;
    Linking.openURL(`mailto:${client.email}`).catch(() => {
      Alert.alert('Email', `Envoi d'un email à ${client.email}`);
    });
  };

  const handleDelete = () => {
    const hasColis = clientColis.length > 0;
    
    Alert.alert(
      'Supprimer le client',
      hasColis
        ? `Attention : Ce client est associé à ${clientColis.length} colis. Êtes-vous sûr de vouloir le supprimer définitivement ?`
        : `Êtes-vous sûr de vouloir supprimer ${client.name} de vos contacts ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            onDeleteClient?.(client.id);
            onClose();
            Alert.alert('Client supprimé', `Le client ${client.name} a été supprimé avec succès.`);
          },
        },
      ]
    );
  };

  const handleSaveEdit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editName.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!editPhone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    }

    if (editEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
      newErrors.email = 'Format d’email invalide';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullPhone = `${editCountryCode} ${editPhone.trim()}`;
    const updatedClient: Client = {
      ...client,
      name: editName.trim(),
      phone: fullPhone,
      email: editEmail.trim() || undefined,
      city: editCity.trim() || client.city,
      address: editAddressMorocco.trim() || editAddressFrance.trim() || client.address,
      addressMorocco: editAddressMorocco.trim() || undefined,
      addressFrance: editAddressFrance.trim() || undefined,
    };

    onUpdateClient?.(updatedClient);
    setIsEditing(false);
    Alert.alert('Succès', 'Les informations du client ont été mises à jour avec succès.');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalBackdrop}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          {/* Sheet Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <View style={styles.headerInfo}>
                <Text style={styles.clientTitleName} numberOfLines={1}>
                  {isEditing ? 'Modifier Client' : client.name}
                </Text>
                <View style={styles.headerMetaRow}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idBadgeText}>{client.id}</Text>
                  </View>
                  <Text style={styles.totalBadgeText}>
                    {client.totalShipments || clientColis.length} colis expédiés
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons: Edit, Delete, Close */}
            <View style={styles.headerRightActions}>
              {!isEditing ? (
                <>
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    style={styles.headerActionBtn}
                    activeOpacity={0.7}
                  >
                    <Edit3 size={17} color="#2563eb" strokeWidth={2.2} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleDelete}
                    style={[styles.headerActionBtn, styles.headerDeleteBtn]}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={17} color="#dc2626" strokeWidth={2.2} />
                  </TouchableOpacity>
                </>
              ) : null}

              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <X size={18} color="#64748b" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Action Buttons (Only in view mode) */}
          {!isEditing ? (
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.callBtn]}
                onPress={handleCall}
                activeOpacity={0.85}
              >
                <Phone size={16} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnText}>Appeler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.whatsappBtn]}
                onPress={handleWhatsApp}
                activeOpacity={0.85}
              >
                <Send size={16} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Scrollable Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            {isEditing ? (
              /* --- EDIT FORM MODE --- */
              <View style={styles.editFormContainer}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Nom complet *</Text>
                  <View style={[styles.inputContainer, errors.name ? styles.inputError : null]}>
                    <User size={17} color="#2563eb" strokeWidth={2.2} />
                    <TextInput
                      style={styles.textInput}
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Nom et prénom"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                  {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Numéro de téléphone *</Text>
                  <View style={styles.countrySelector}>
                    <TouchableOpacity
                      style={[
                        styles.countryTab,
                        editCountryCode === '+212' ? styles.countryTabActive : null,
                      ]}
                      onPress={() => setEditCountryCode('+212')}
                      activeOpacity={0.8}
                    >
                      <MoroccoFlagBadge size={16} />
                      <Text
                        style={[
                          styles.countryCodeText,
                          editCountryCode === '+212' ? styles.countryCodeTextActive : null,
                        ]}
                      >
                        +212 (MA)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.countryTab,
                        editCountryCode === '+33' ? styles.countryTabActive : null,
                      ]}
                      onPress={() => setEditCountryCode('+33')}
                      activeOpacity={0.8}
                    >
                      <FranceFlagBadge size={16} />
                      <Text
                        style={[
                          styles.countryCodeText,
                          editCountryCode === '+33' ? styles.countryCodeTextActive : null,
                        ]}
                      >
                        +33 (FR)
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.inputContainer, errors.phone ? styles.inputError : null, { marginTop: 8 }]}>
                    <Phone size={17} color="#2563eb" strokeWidth={2.2} />
                    <TextInput
                      style={styles.textInput}
                      value={editPhone}
                      onChangeText={setEditPhone}
                      placeholder="6 12 34 56 78"
                      placeholderTextColor="#94a3b8"
                      keyboardType="phone-pad"
                    />
                  </View>
                  {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Adresse Email</Text>
                  <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
                    <Mail size={17} color="#64748b" strokeWidth={2.2} />
                    <TextInput
                      style={styles.textInput}
                      value={editEmail}
                      onChangeText={setEditEmail}
                      placeholder="email@example.com"
                      placeholderTextColor="#94a3b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>

                <View style={styles.fieldGroup}>
                  <View style={styles.alignCenterRow}>
                    <MoroccoFlagBadge size={16} />
                    <Text style={[styles.fieldLabel, { marginLeft: 6, marginBottom: 0 }]}>
                      Adresse au Maroc
                    </Text>
                  </View>
                  <View style={[styles.inputContainer, { marginTop: 6 }]}>
                    <MapPin size={17} color="#dc2626" strokeWidth={2.2} />
                    <TextInput
                      style={styles.textInput}
                      value={editAddressMorocco}
                      onChangeText={setEditAddressMorocco}
                      placeholder="Rue, quartier, ville au Maroc"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <View style={styles.alignCenterRow}>
                    <FranceFlagBadge size={16} />
                    <Text style={[styles.fieldLabel, { marginLeft: 6, marginBottom: 0 }]}>
                      Adresse en France
                    </Text>
                  </View>
                  <View style={[styles.inputContainer, { marginTop: 6 }]}>
                    <MapPin size={17} color="#2563eb" strokeWidth={2.2} />
                    <TextInput
                      style={styles.textInput}
                      value={editAddressFrance}
                      onChangeText={setEditAddressFrance}
                      placeholder="Rue, code postal, ville en France"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Ville principale</Text>
                  <View style={styles.inputContainer}>
                    <Building2 size={17} color="#64748b" strokeWidth={2.2} />
                    <TextInput
                      style={styles.textInput}
                      value={editCity}
                      onChangeText={setEditCity}
                      placeholder="Casablanca / Paris"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>
              </View>
            ) : (
              /* --- VIEW DETAILS MODE --- */
              <>
                {/* Section: Adresses Enregistrées */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionCategoryTitle}>
                    Adresses Enregistrées
                  </Text>

                  {/* Adresse Maroc Card */}
                  <View style={styles.addressCard}>
                    <View style={styles.addressCardHeader}>
                      <View style={styles.alignCenterRow}>
                        <MoroccoFlagBadge size={22} />
                        <Text style={styles.addressCountryLabel}>Adresse Maroc</Text>
                      </View>
                    </View>

                    <View style={styles.addressBodyRow}>
                      <View style={[styles.pinIconBadge, { backgroundColor: '#fee2e2' }]}>
                        <MapPin size={15} color="#dc2626" strokeWidth={2.4} />
                      </View>
                      <Text style={styles.addressValueText}>
                        {client.addressMorocco || client.address || client.city || 'Non renseignée'}
                      </Text>
                    </View>
                  </View>

                  {/* Adresse France Card */}
                  <View style={styles.addressCard}>
                    <View style={styles.addressCardHeader}>
                      <View style={styles.alignCenterRow}>
                        <FranceFlagBadge size={22} />
                        <Text style={styles.addressCountryLabel}>Adresse France</Text>
                      </View>
                    </View>

                    <View style={styles.addressBodyRow}>
                      <View style={[styles.pinIconBadge, { backgroundColor: '#e0e7ff' }]}>
                        <MapPin size={15} color="#2563eb" strokeWidth={2.4} />
                      </View>
                      <Text style={styles.addressValueText}>
                        {client.addressFrance || 'Non renseignée'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Section: Coordonnées de contact */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionCategoryTitle}>
                    Coordonnées de Contact
                  </Text>

                  <View style={styles.contactContainer}>
                    <TouchableOpacity
                      style={styles.contactRow}
                      onPress={handleCall}
                      activeOpacity={0.7}
                    >
                      <View style={styles.contactLeft}>
                        <View style={styles.contactIconCircle}>
                          <Phone size={15} color="#2563eb" strokeWidth={2.2} />
                        </View>
                        <View style={styles.contactTextGroup}>
                          <Text style={styles.contactSublabel}>Téléphone</Text>
                          <Text style={styles.contactMainText}>{client.phone}</Text>
                        </View>
                      </View>
                      {isMorocco ? <MoroccoFlagBadge size={20} /> : <FranceFlagBadge size={20} />}
                    </TouchableOpacity>

                    {client.email ? (
                      <TouchableOpacity
                        style={[styles.contactRow, styles.contactRowBorder]}
                        onPress={handleEmail}
                        activeOpacity={0.7}
                      >
                        <View style={styles.contactLeft}>
                          <View style={styles.contactIconCircle}>
                            <Mail size={15} color="#2563eb" strokeWidth={2.2} />
                          </View>
                          <View style={styles.contactTextGroup}>
                            <Text style={styles.contactSublabel}>Email</Text>
                            <Text style={styles.contactMainText}>{client.email}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                {/* Section: Date d'enregistrement */}
                <View style={styles.dateCard}>
                  <View style={styles.alignCenterRow}>
                    <View style={styles.dateIconCircle}>
                      <Calendar size={14} color="#64748b" strokeWidth={2.2} />
                    </View>
                    <Text style={styles.dateLabelText}>Client depuis le</Text>
                  </View>
                  <Text style={styles.dateValueText}>{client.createdAt || '08/07/2026'}</Text>
                </View>

                {/* Section: Historique des Colis */}
                <View style={styles.colisSectionWrapper}>
                  <View style={styles.colisSectionHeader}>
                    <View style={styles.alignCenterRow}>
                      <View style={styles.colisIconBadge}>
                        <Package size={16} color="#2563eb" strokeWidth={2.4} />
                      </View>
                      <Text style={styles.colisSectionTitle}>Historique des Colis</Text>
                    </View>
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>
                        {clientColis.length} colis trouvés
                      </Text>
                    </View>
                  </View>

                  {clientColis.length === 0 ? (
                    <View style={styles.emptyColisCard}>
                      <Package size={28} color="#94a3b8" />
                      <Text style={styles.emptyColisTitle}>Aucun colis enregistré</Text>
                      <Text style={styles.emptyColisSubtitle}>
                        Ce client n'a pas encore de colis associé.
                      </Text>
                    </View>
                  ) : (
                    clientColis.map((colis) => (
                      <View key={colis.id} style={styles.colisCard}>
                        <View style={styles.colisCardLeft}>
                          <View style={styles.alignCenterRow}>
                            <Text style={styles.colisIdText}>{colis.id}</Text>
                            <View style={styles.weightBadge}>
                              <Text style={styles.weightBadgeText}>• {colis.weight} kg</Text>
                            </View>
                          </View>

                          <Text style={styles.colisRouteText}>
                            {colis.fromCity} ➔ {colis.toCity}
                          </Text>
                          <Text style={styles.colisDateText}>{colis.date}</Text>
                        </View>

                        <View
                          style={[
                            styles.statusBadge,
                            colis.status === 'delivered'
                              ? styles.statusDelivered
                              : colis.status === 'in_transit'
                              ? styles.statusTransit
                              : styles.statusPending,
                          ]}
                        >
                          {colis.status === 'delivered' ? (
                            <CheckCircle2 size={13} color="#16a34a" style={{ marginRight: 4 }} />
                          ) : colis.status === 'in_transit' ? (
                            <Truck size={13} color="#2563eb" style={{ marginRight: 4 }} />
                          ) : (
                            <Clock size={13} color="#d97706" style={{ marginRight: 4 }} />
                          )}
                          <Text
                            style={[
                              styles.statusBadgeText,
                              colis.status === 'delivered'
                            ? styles.statusTextDelivered
                            : colis.status === 'in_transit'
                            ? styles.statusTextTransit
                            : styles.statusTextPending,
                            ]}
                          >
                            {colis.status === 'delivered'
                              ? 'Livré'
                              : colis.status === 'in_transit'
                              ? 'En transit'
                              : 'En attente'}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.sheetFooter}>
            {isEditing ? (
              <View style={styles.editFooterActions}>
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  style={styles.cancelEditBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelEditBtnText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveEdit}
                  style={styles.saveEditBtn}
                  activeOpacity={0.88}
                >
                  <Check size={16} color="#FFFFFF" strokeWidth={2.6} style={{ marginRight: 6 }} />
                  <Text style={styles.saveEditBtnText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeFooterBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.closeFooterBtnText}>Fermer la fiche</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ClientDetailModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 24,
  },
  dragHandle: {
    width: 42,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
  },
  clientTitleName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  idBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginRight: 8,
  },
  idBadgeText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
  },
  totalBadgeText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDeleteBtn: {
    backgroundColor: '#fef2f2',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  callBtn: {
    backgroundColor: '#2563eb',
  },
  whatsappBtn: {
    backgroundColor: '#16a34a',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    maxHeight: height * 0.6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  // Section Layouts
  sectionContainer: {
    marginBottom: 16,
  },
  sectionCategoryTitle: {
    color: '#94a3b8',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  alignCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Address Cards
  addressCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addressCountryLabel: {
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  addressBodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  pinIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  addressValueText: {
    color: '#334155',
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
  },
  // Contact Box
  contactContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  contactRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  contactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  contactTextGroup: {
    flex: 1,
  },
  contactSublabel: {
    color: '#94a3b8',
    fontSize: 10.5,
    fontWeight: '500',
  },
  contactMainText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  // Date Card
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  dateIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  dateLabelText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  dateValueText: {
    color: '#0f172a',
    fontSize: 12.5,
    fontWeight: '700',
  },
  // Colis Section
  colisSectionWrapper: {
    marginBottom: 8,
  },
  colisSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  colisIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  colisSectionTitle: {
    color: '#0f172a',
    fontSize: 13.5,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countBadgeText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyColisCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  emptyColisTitle: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyColisSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  colisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  colisCardLeft: {
    flex: 1,
    marginRight: 10,
  },
  colisIdText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  weightBadge: {
    marginLeft: 6,
  },
  weightBadgeText: {
    color: '#2563eb',
    fontSize: 11.5,
    fontWeight: '700',
  },
  colisRouteText: {
    color: '#334155',
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 3,
  },
  colisDateText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 20,
  },
  statusDelivered: {
    backgroundColor: '#f0fdf4',
  },
  statusTransit: {
    backgroundColor: '#eff6ff',
  },
  statusPending: {
    backgroundColor: '#fffbeb',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextDelivered: {
    color: '#16a34a',
  },
  statusTextTransit: {
    color: '#2563eb',
  },
  statusTextPending: {
    color: '#d97706',
  },
  // Edit Form Styles
  editFormContainer: {
    paddingVertical: 4,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#334155',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    marginLeft: 8,
    paddingVertical: 0,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
  countrySelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 2,
  },
  countryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
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
    fontSize: 12,
    fontWeight: '700',
  },
  countryCodeTextActive: {
    color: '#1d4ed8',
  },
  // Sheet Footer
  sheetFooter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },
  closeFooterBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeFooterBtnText: {
    color: '#334155',
    fontSize: 13.5,
    fontWeight: '700',
  },
  editFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelEditBtn: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelEditBtnText: {
    color: '#475569',
    fontSize: 13.5,
    fontWeight: '700',
  },
  saveEditBtn: {
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
  saveEditBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
