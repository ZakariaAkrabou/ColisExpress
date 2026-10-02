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
      setStatus(colis.status || 'pending');
      setDescription(colis.description || '');
      setImage(colis.image || PRESET_IMAGES[0]);
    }
  }, [colis, visible]);

  if (!colis) return null;

  const handleUpdateSubmit = () => {
    if (!senderName.trim() || !receiverName.trim() || !fromCity.trim() || !toCity.trim() || !weight.trim() || !price.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields marked with *');
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
              <Text style={styles.modalIcon}>✏️</Text>
              <Text style={styles.modalTitle}>Update Colis ({colis.id})</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Status Selection */}
            <Text style={styles.formSectionTitle}>⚡ Shipment Status</Text>
            <View style={styles.statusPickerRow}>
              {(['pending', 'in_transit', 'delivered'] as const).map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.statusChip,
                    status === st && styles.statusChipActive,
                  ]}
                  onPress={() => setStatus(st)}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      status === st && styles.statusChipActiveText,
                    ]}
                  >
                    {st === 'pending' ? '⏳ Pending' : st === 'in_transit' ? '🚚 In Transit' : '✅ Delivered'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Radio Buttons for Payment Status */}
            <Text style={styles.formSectionTitle}>💳 Payment Status (Payé)</Text>
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
                  Oui / Yes (Paid)
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
                  Non / No (Unpaid)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Image Selection */}
            <Text style={styles.formSectionTitle}>🖼️ Parcel Photo / Image</Text>
            <View style={styles.imageSelectorContainer}>
              {PRESET_IMAGES.map((imgUrl, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.presetImageWrapper,
                    image === imgUrl && styles.presetImageSelected,
                  ]}
                  onPress={() => setImage(imgUrl)}
                >
                  <Image source={{ uri: imgUrl }} style={styles.presetImage} />
                  {image === imgUrl && (
                    <View style={styles.selectedCheckOverlay}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.formInput}
              placeholder="Or paste custom Image URL"
              placeholderTextColor="#94a3b8"
              value={image}
              onChangeText={setImage}
            />

            {/* Sender Details */}
            <Text style={styles.formSectionTitle}>👤 Sender Details</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Sender Name *"
              placeholderTextColor="#94a3b8"
              value={senderName}
              onChangeText={setSenderName}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Sender Phone Number"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={senderPhone}
              onChangeText={setSenderPhone}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Sender Origin City *"
              placeholderTextColor="#94a3b8"
              value={fromCity}
              onChangeText={setFromCity}
            />

            {/* Receiver Details */}
            <Text style={styles.formSectionTitle}>📍 Receiver Details</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Receiver Name *"
              placeholderTextColor="#94a3b8"
              value={receiverName}
              onChangeText={setReceiverName}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Receiver Phone Number"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={receiverPhone}
              onChangeText={setReceiverPhone}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Receiver Destination City *"
              placeholderTextColor="#94a3b8"
              value={toCity}
              onChangeText={setToCity}
            />

            {/* Package Specifications */}
            <Text style={styles.formSectionTitle}>📦 Package Specs</Text>
            <View style={styles.specInputRow}>
              <TextInput
                style={[styles.formInput, { flex: 1, marginRight: 6 }]}
                placeholder="Weight (kg) *"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <TextInput
                style={[styles.formInput, { flex: 1, marginRight: 6 }]}
                placeholder="Qty *"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              <TextInput
                style={[styles.formInput, { flex: 1 }]}
                placeholder="Price (€) *"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Package Description"
              placeholderTextColor="#94a3b8"
              multiline={true}
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.formSubmitButton} onPress={handleUpdateSubmit} activeOpacity={0.85}>
              <Text style={styles.formSubmitText}>Save Changes</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContentLarge: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 14,
    marginBottom: 14,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#0f172a',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '700',
  },
  modalBody: {
    marginBottom: 10,
  },
  formSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38bdf8',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 3,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  statusChipText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },
  statusChipActiveText: {
    color: '#0f172a',
    fontWeight: '800',
  },

  // Radio Buttons
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 6,
  },
  radioButtonSelectedSuccess: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  radioButtonSelectedDanger: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelectedSuccess: {
    borderColor: '#10b981',
  },
  radioCircleSelectedDanger: {
    borderColor: '#ef4444',
  },
  radioInnerCircle: {
    height: 9,
    width: 9,
    borderRadius: 4.5,
    backgroundColor: '#10b981',
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
    color: '#94a3b8',
  },
  radioTextSelectedSuccess: {
    color: '#10b981',
    fontWeight: '800',
  },
  radioTextSelectedDanger: {
    color: '#ef4444',
    fontWeight: '800',
  },

  imageSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  presetImageWrapper: {
    width: '23%',
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#334155',
    position: 'relative',
  },
  presetImageSelected: {
    borderColor: '#3b82f6',
  },
  presetImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedCheckOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  formInput: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
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
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  formSubmitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
