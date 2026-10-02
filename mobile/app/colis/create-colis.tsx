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

export interface Colis {
  id: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  quantity?: number;
  weight: number; // in kg
  price: number; // in EUR
  isPaid?: boolean; // Payment status (true = Yes/Payed, false = No/Unpaid)
  status: 'pending' | 'in_transit' | 'delivered';
  date: string;
  description: string;
  image?: string;
}

export interface CreateColisProps {
  visible: boolean;
  direction: 'FR_TO_MA' | 'MA_TO_FR';
  onClose: () => void;
  onSubmit: (newColis: Colis) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500',
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500',
  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=500',
];

export default function CreateColis({
  visible,
  direction,
  onClose,
  onSubmit,
}: CreateColisProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [weight, setWeight] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [isPaid, setIsPaid] = useState<boolean>(true); // Default: Yes (Paid)
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0]);

  // Reset step & cities when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      if (direction === 'FR_TO_MA') {
        if (!fromCity) setFromCity('Paris');
        if (!toCity) setToCity('Casablanca');
      } else {
        if (!fromCity) setFromCity('Casablanca');
        if (!toCity) setToCity('Paris');
      }
    }
  }, [visible, direction]);

  const resetForm = () => {
    setCurrentStep(1);
    setSenderName('');
    setSenderPhone('');
    setReceiverName('');
    setReceiverPhone('');
    setFromCity('');
    setToCity('');
    setWeight('');
    setQuantity('1');
    setPrice('');
    setIsPaid(true);
    setDescription('');
    setImage(PRESET_IMAGES[0]);
  };

  const handleNextStep1 = () => {
    if (!senderName.trim()) {
      Alert.alert('Sender Required', 'Please enter the sender name to proceed.');
      return;
    }
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    if (!receiverName.trim()) {
      Alert.alert('Receiver Required', 'Please enter the receiver name to proceed.');
      return;
    }
    setCurrentStep(3);
  };

  const handleFormSubmit = () => {
    if (!fromCity.trim() || !toCity.trim() || !weight.trim() || !price.trim()) {
      Alert.alert('Missing Fields', 'Please fill in Origin, Destination, Weight and Price.');
      return;
    }

    const newColis: Colis = {
      id: `CX-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim() || (direction === 'FR_TO_MA' ? '+33 6 1234 5678' : '+212 6 6123 4567'),
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim() || (direction === 'FR_TO_MA' ? '+212 6 6123 4567' : '+33 6 1234 5678'),
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      quantity: parseInt(quantity, 10) || 1,
      weight: parseFloat(weight) || 1,
      price: parseFloat(price) || 10,
      isPaid: isPaid,
      status: 'pending',
      date: new Date().toLocaleDateString('fr-FR'),
      description: description.trim() || 'No description provided',
      image: image || PRESET_IMAGES[0],
    };

    onSubmit(newColis);
    resetForm();
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
              <Text style={styles.modalIcon}>➕</Text>
              <Text style={styles.modalTitle}>Register New Colis</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Stepper Progress Bar */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={[styles.stepItem, currentStep === 1 && styles.stepItemActive]}
              onPress={() => setCurrentStep(1)}
            >
              <View style={[styles.stepNumberBadge, currentStep === 1 && styles.stepNumberBadgeActive]}>
                <Text style={[styles.stepNumberText, currentStep === 1 && styles.stepNumberTextActive]}>1</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelActive]}>Sender</Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              style={[styles.stepItem, currentStep === 2 && styles.stepItemActive]}
              onPress={() => {
                if (senderName.trim()) setCurrentStep(2);
                else Alert.alert('Notice', 'Please fill sender details first');
              }}
            >
              <View style={[styles.stepNumberBadge, currentStep === 2 && styles.stepNumberBadgeActive]}>
                <Text style={[styles.stepNumberText, currentStep === 2 && styles.stepNumberTextActive]}>2</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelActive]}>Receiver</Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              style={[styles.stepItem, currentStep === 3 && styles.stepItemActive]}
              onPress={() => {
                if (senderName.trim() && receiverName.trim()) setCurrentStep(3);
                else Alert.alert('Notice', 'Please fill sender and receiver details first');
              }}
            >
              <View style={[styles.stepNumberBadge, currentStep === 3 && styles.stepNumberBadgeActive]}>
                <Text style={[styles.stepNumberText, currentStep === 3 && styles.stepNumberTextActive]}>3</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>Colis Infos</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Direction badge */}
            <View style={styles.directionBadge}>
              <Text style={styles.directionBadgeText}>
                {direction === 'FR_TO_MA' ? '🇫🇷 France ➔ 🇲🇦 Morocco' : '🇲🇦 Morocco ➔ 🇫🇷 France'}
              </Text>
            </View>

            {/* STEP 1: SENDER DETAILS */}
            {currentStep === 1 && (
              <View style={styles.stepFormContent}>
                <Text style={styles.formSectionTitle}>👤 Step 1: Sender Details</Text>
                <Text style={styles.stepInstructionText}>Enter the contact details of the person sending this parcel.</Text>

                <Text style={styles.inputSubLabel}>Nom complet *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Sender Full Name *"
                  placeholderTextColor="#94a3b8"
                  value={senderName}
                  onChangeText={setSenderName}
                />

                <Text style={styles.inputSubLabel}>📞 Numéro de téléphone</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Sender Phone Number (e.g. +33 6 12 34 56 78)"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={senderPhone}
                  onChangeText={setSenderPhone}
                />

                <Text style={styles.inputSubLabel}>🗺️ Ville de départ *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={direction === 'FR_TO_MA' ? 'From (e.g. Paris) *' : 'From (e.g. Casablanca) *'}
                  placeholderTextColor="#94a3b8"
                  value={fromCity}
                  onChangeText={setFromCity}
                />

                <TouchableOpacity
                  style={styles.nextStepButton}
                  onPress={handleNextStep1}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextStepText}>Next: Receiver Details ➔</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2: RECEIVER DETAILS */}
            {currentStep === 2 && (
              <View style={styles.stepFormContent}>
                <Text style={styles.formSectionTitle}>📍 Step 2: Receiver Details</Text>
                <Text style={styles.stepInstructionText}>Enter the recipient details at the destination point.</Text>

                <Text style={styles.inputSubLabel}>Nom complet *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Receiver Full Name *"
                  placeholderTextColor="#94a3b8"
                  value={receiverName}
                  onChangeText={setReceiverName}
                />

                <Text style={styles.inputSubLabel}>📞 Numéro de téléphone</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Receiver Phone Number (e.g. +212 6 61 23 45 67)"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={receiverPhone}
                  onChangeText={setReceiverPhone}
                />

                <Text style={styles.inputSubLabel}>🗺️ Ville d'arrivée *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={direction === 'FR_TO_MA' ? 'To (e.g. Casablanca) *' : 'To (e.g. Paris) *'}
                  placeholderTextColor="#94a3b8"
                  value={toCity}
                  onChangeText={setToCity}
                />
                {/* Radio Button for Payed (Yes / No) */}
                <Text style={styles.inputSubLabel}>💳 Payé / Payment Status *</Text>
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
                <View style={styles.stepNavRow}>
                  <TouchableOpacity
                    style={styles.backStepButton}
                    onPress={() => setCurrentStep(1)}
                  >
                    <Text style={styles.backStepText}>⬅️ Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.nextStepButton, { flex: 1, marginLeft: 10 }]}
                    onPress={handleNextStep2}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.nextStepText}>Next: Colis Infos ➔</Text>
                  </TouchableOpacity>
                </View>

              </View>

            )}

            {/* STEP 3: COLIS INFOS */}
            {currentStep === 3 && (
              <View style={styles.stepFormContent}>
                <Text style={styles.formSectionTitle}>📦 Step 3: Colis Specifications & Photo</Text>
                <Text style={styles.stepInstructionText}>Specify parcel metrics, payment status, photo and description.</Text>

                {/* Summary badge of sender -> receiver */}
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryText}>
                    👤 {senderName} ({fromCity}) ➔ 📍 {receiverName} ({toCity})
                  </Text>
                </View>



                {/* Colis Image Selector */}
                <Text style={styles.inputSubLabel}>🖼️ Parcel Photo / Image</Text>
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

                {/* Package Specifications */}
                <Text style={styles.inputSubLabel}>⚖️ Package Metrics</Text>
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
                  placeholder="Package Contents Description / Notes"
                  placeholderTextColor="#94a3b8"
                  multiline={true}
                  numberOfLines={3}
                  value={description}
                  onChangeText={setDescription}
                />

                <View style={styles.stepNavRow}>
                  <TouchableOpacity
                    style={styles.backStepButton}
                    onPress={() => setCurrentStep(2)}
                  >
                    <Text style={styles.backStepText}>⬅️ Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.formSubmitButton, { flex: 1, marginLeft: 10 }]}
                    onPress={handleFormSubmit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.formSubmitText}>Create Shipment 🚀</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    maxHeight: '92%',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 12,
    marginBottom: 12,
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
  // Stepper Header
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  stepItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  stepNumberBadgeActive: {
    backgroundColor: '#3b82f6',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
  },
  stepNumberTextActive: {
    color: '#ffffff',
  },
  stepLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  stepDivider: {
    width: 14,
    height: 1,
    backgroundColor: '#334155',
  },
  modalBody: {
    marginBottom: 10,
  },
  directionBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  directionBadgeText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  stepFormContent: {
    paddingBottom: 20,
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38bdf8',
    marginBottom: 4,
  },
  stepInstructionText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 14,
  },
  inputSubLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summaryBox: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },

  // Radio Buttons for Payment Status
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
    height: 55,
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
    height: 70,
    textAlignVertical: 'top',
  },
  stepNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backStepButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backStepText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  nextStepButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  nextStepText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  formSubmitButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  formSubmitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
