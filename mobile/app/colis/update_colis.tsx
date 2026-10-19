import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { Edit3, X, Check } from 'lucide-react-native';
import { Colis } from './create-colis';

export interface UpdateColisProps {
  visible: boolean;
  colis: Colis | null;
  direction?: 'FR_TO_MA' | 'MA_TO_FR';
  onClose: () => void;
  onSubmit: (updatedColis: Colis) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500',
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500',
  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=500',
];

export default function UpdateColis({
  visible,
  colis,
  onClose,
  onSubmit,
}: UpdateColisProps) {
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [weight, setWeight] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [isADomicile, setIsADomicile] = useState<boolean>(true);
  const [status, setStatus] = useState<Colis['status']>('pending');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (colis && visible) {
      setSenderName(colis.senderName || '');
      setSenderPhone(colis.senderPhone || '');
      setReceiverName(colis.receiverName || '');
      setReceiverPhone(colis.receiverPhone || '');
      setFromCity(colis.fromCity || '');
      setToCity(colis.toCity || '');
      setWeight(colis.weight ? String(colis.weight) : '');
      setQuantity(colis.quantity ? String(colis.quantity) : '1');
      setPrice(colis.price ? String(colis.price) : '');
      setIsPaid(colis.isPaid !== undefined ? colis.isPaid : true);
      setIsADomicile(colis.isADomicile !== undefined ? colis.isADomicile : true);
      setStatus(colis.status || 'pending');
      setDescription(colis.description || '');
      setImage(colis.image || PRESET_IMAGES[0]);
    }
  }, [colis, visible]);

  if (!colis) return null;

  const handleUpdateSubmit = () => {
    if (!senderName.trim() || !receiverName.trim() || !fromCity.trim() || !toCity.trim() || !weight.trim() || !price.trim()) {
      Alert.alert('Champs obligatoires', 'Veuillez remplir tous les champs obligatoires marqués d\'un *');
      return;
    }

    const updatedColis: Colis = {
      ...colis,
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      quantity: parseInt(quantity, 10) || 1,
      weight: parseFloat(weight) || 1,
      price: parseFloat(price) || 10,
      isPaid: isPaid,
      isADomicile: isADomicile,
      status,
      description: description.trim(),
      image: image.trim() || PRESET_IMAGES[0],
    };

    onSubmit(updatedColis);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerIconBadge}>
                <Edit3 size={18} color="#d97706" strokeWidth={2.4} />
              </View>
              <Text style={styles.modalTitle}>Modifier Colis ({colis.id})</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Status Selection */}
            <Text style={styles.formSectionTitle}>⚡ Statut de l'envoi</Text>
            <View style={styles.statusPickerRow}>
              {(['pending', 'in_transit', 'delivered'] as const).map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.statusChip,
                    status === st && styles.statusChipActive,
                  ]}
                  onPress={() => setStatus(st)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      status === st && styles.statusChipActiveText,
                    ]}
                  >
                    {st === 'pending' ? '⏳ En attente' : st === 'in_transit' ? '🚚 En transit' : '✅ Livré'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Radio Buttons for Payment Status */}
            <Text style={styles.formSectionTitle}>💳 Statut de paiement (Payé)</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  isPaid === true && styles.radioButtonSelectedSuccess,
                ]}
                onPress={() => setIsPaid(true)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isPaid === true && styles.radioCircleSelectedSuccess,
                  ]}
                >
                  {isPaid === true && <View style={styles.radioInnerCircle} />}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    isPaid === true && styles.radioTextSelectedSuccess,
                  ]}
                >
                  Oui (Payé)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  isPaid === false && styles.radioButtonSelectedDanger,
                ]}
                onPress={() => setIsPaid(false)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isPaid === false && styles.radioCircleSelectedDanger,
                  ]}
                >
                  {isPaid === false && <View style={styles.radioInnerCircleDanger} />}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    isPaid === false && styles.radioTextSelectedDanger,
                  ]}
                >
                  Non (Non Payé)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Radio Buttons for Delivery Mode */}
            <Text style={styles.formSectionTitle}>🏠 Mode de livraison</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  isADomicile === true && styles.radioButtonSelectedSuccess,
                ]}
                onPress={() => setIsADomicile(true)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isADomicile === true && styles.radioCircleSelectedSuccess,
                  ]}
                >
                  {isADomicile === true && <View style={styles.radioInnerCircle} />}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    isADomicile === true && styles.radioTextSelectedSuccess,
                  ]}
                >
                  🏠 À domicile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  isADomicile === false && styles.radioButtonSelectedSuccess,
                ]}
                onPress={() => setIsADomicile(false)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isADomicile === false && styles.radioCircleSelectedSuccess,
                  ]}
                >
                  {isADomicile === false && <View style={styles.radioInnerCircle} />}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    isADomicile === false && styles.radioTextSelectedSuccess,
                  ]}
                >
                  📦 Point relais
                </Text>
              </TouchableOpacity>
            </View>

            {/* Image Selection */}
            <Text style={styles.formSectionTitle}>🖼️ Photo du colis</Text>
            <View style={styles.imageSelectorContainer}>
              {PRESET_IMAGES.map((imgUrl, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.presetImageWrapper,
                    image === imgUrl && styles.presetImageSelected,
                  ]}
                  onPress={() => setImage(imgUrl)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: imgUrl }} style={styles.presetImage} />
                  {image === imgUrl && (
                    <View style={styles.selectedCheckOverlay}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.formInput}
              placeholder="Ou URL personnalisée de l'image"
              placeholderTextColor="#94a3b8"
              value={image}
              onChangeText={setImage}
            />

            {/* Sender Details */}
            <Text style={styles.formSectionTitle}>👤 Expéditeur (Départ)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Nom complet de l'expéditeur *"
              placeholderTextColor="#94a3b8"
              value={senderName}
              onChangeText={setSenderName}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Téléphone de l'expéditeur"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={senderPhone}
              onChangeText={setSenderPhone}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Ville de départ *"
              placeholderTextColor="#94a3b8"
              value={fromCity}
              onChangeText={setFromCity}
            />

            {/* Receiver Details */}
            <Text style={styles.formSectionTitle}>📍 Destinataire (Arrivée)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Nom complet du destinataire *"
              placeholderTextColor="#94a3b8"
              value={receiverName}
              onChangeText={setReceiverName}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Téléphone du destinataire"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={receiverPhone}
              onChangeText={setReceiverPhone}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Ville de destination *"
              placeholderTextColor="#94a3b8"
              value={toCity}
              onChangeText={setToCity}
            />

            {/* Package Specifications */}
            <Text style={styles.formSectionTitle}>📦 Spécifications du colis</Text>
            <View style={styles.specInputRow}>
              <TextInput
                style={[styles.formInput, { flex: 1, marginRight: 6 }]}
                placeholder="Poids (kg) *"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <TextInput
                style={[styles.formInput, { flex: 1, marginRight: 6 }]}
                placeholder="Qté *"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              <TextInput
                style={[styles.formInput, { flex: 1 }]}
                placeholder="Prix (MAD) *"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Description du contenu / Notes"
              placeholderTextColor="#94a3b8"
              multiline={true}
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity
              style={styles.formSubmitButton}
              onPress={handleUpdateSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.formSubmitText}>Enregistrer les modifications</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContentLarge: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 14,
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    marginBottom: 10,
  },
  formSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statusPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 6,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusChipActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  statusChipText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  statusChipActiveText: {
    color: '#1d4ed8',
    fontWeight: '800',
  },

  // Radio Buttons
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  radioButtonSelectedSuccess: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  radioButtonSelectedDanger: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelectedSuccess: {
    borderColor: '#22c55e',
  },
  radioCircleSelectedDanger: {
    borderColor: '#ef4444',
  },
  radioInnerCircle: {
    height: 9,
    width: 9,
    borderRadius: 4.5,
    backgroundColor: '#22c55e',
  },
  radioInnerCircleDanger: {
    height: 9,
    width: 9,
    borderRadius: 4.5,
    backgroundColor: '#ef4444',
  },
  radioText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  radioTextSelectedSuccess: {
    color: '#15803d',
    fontWeight: '800',
  },
  radioTextSelectedDanger: {
    color: '#b91c1c',
    fontWeight: '800',
  },

  imageSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  presetImageWrapper: {
    width: '23%',
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  presetImageSelected: {
    borderColor: '#2563eb',
  },
  presetImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedCheckOverlay: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#2563eb',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  specInputRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  formSubmitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 26,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  formSubmitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
