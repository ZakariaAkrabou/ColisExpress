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
import { Plus, X, ArrowLeft, ArrowRight, Check } from 'lucide-react-native';

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
  price: number; // in MAD
  isPaid?: boolean; // Payment status (true = Yes/Payed, false = No/Unpaid)
  isADomicile?: boolean; // (true = À domicile, false = Point de collecte)
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
  const [isADomicile, setIsADomicile] = useState<boolean>(true); // Default: À domicile
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
    setIsADomicile(true);
    setDescription('');
    setImage(PRESET_IMAGES[0]);
  };

  const handleNextStep1 = () => {
    if (!senderName.trim()) {
      Alert.alert('Expéditeur obligatoire', 'Veuillez saisir le nom de l\'expéditeur pour continuer.');
      return;
    }
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    if (!receiverName.trim()) {
      Alert.alert('Destinataire obligatoire', 'Veuillez saisir le nom du destinataire pour continuer.');
      return;
    }
    setCurrentStep(3);
  };

  const handleFormSubmit = () => {
    if (!fromCity.trim() || !toCity.trim() || !weight.trim() || !price.trim()) {
      Alert.alert('Champs obligatoires', 'Veuillez renseigner la ville de départ, la destination, le poids et le prix.');
      return;
    }

    const newColis: Colis = {
      id: `CX-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim() || (direction === 'FR_TO_MA' ? '+33 6 12 34 56 78' : '+212 6 61 23 45 67'),
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim() || (direction === 'FR_TO_MA' ? '+212 6 61 23 45 67' : '+33 6 12 34 56 78'),
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      quantity: parseInt(quantity, 10) || 1,
      weight: parseFloat(weight) || 1,
      price: parseFloat(price) || 10,
      isPaid: isPaid,
      isADomicile: isADomicile,
      status: 'pending',
      date: new Date().toLocaleDateString('fr-FR'),
      description: description.trim() || 'Aucune description fournie',
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
              <View style={styles.headerIconBadge}>
                <Plus size={18} color="#2563eb" strokeWidth={2.4} />
              </View>
              <Text style={styles.modalTitle}>Enregistrer un Colis</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Stepper Progress Bar */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={[styles.stepItem, currentStep === 1 && styles.stepItemActive]}
              onPress={() => setCurrentStep(1)}
              activeOpacity={0.8}
            >
              <View style={[styles.stepNumberBadge, currentStep === 1 && styles.stepNumberBadgeActive]}>
                <Text style={[styles.stepNumberText, currentStep === 1 && styles.stepNumberTextActive]}>1</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelActive]}>Expéditeur</Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              style={[styles.stepItem, currentStep === 2 && styles.stepItemActive]}
              onPress={() => {
                if (senderName.trim()) setCurrentStep(2);
                else Alert.alert('Attention', 'Veuillez d\'abord remplir les infos expéditeur');
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.stepNumberBadge, currentStep === 2 && styles.stepNumberBadgeActive]}>
                <Text style={[styles.stepNumberText, currentStep === 2 && styles.stepNumberTextActive]}>2</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelActive]}>Destinataire</Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              style={[styles.stepItem, currentStep === 3 && styles.stepItemActive]}
              onPress={() => {
                if (senderName.trim() && receiverName.trim()) setCurrentStep(3);
                else Alert.alert('Attention', 'Veuillez remplir expéditeur et destinataire d\'abord');
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.stepNumberBadge, currentStep === 3 && styles.stepNumberBadgeActive]}>
                <Text style={[styles.stepNumberText, currentStep === 3 && styles.stepNumberTextActive]}>3</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>Colis</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Direction badge */}
            <View style={styles.directionBadge}>
              <Text style={styles.directionBadgeText}>
                {direction === 'FR_TO_MA' ? '🇫🇷 France ➔ 🇲🇦 Maroc' : '🇲🇦 Maroc ➔ 🇫🇷 France'}
              </Text>
            </View>

            {/* STEP 1: SENDER DETAILS */}
            {currentStep === 1 && (
              <View style={styles.stepFormContent}>
                <Text style={styles.formSectionTitle}>Étape 1 : Expéditeur</Text>
                <Text style={styles.stepInstructionText}>Saisissez les coordonnées de la personne qui envoie le colis.</Text>

                <Text style={styles.inputSubLabel}>Nom complet *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nom & prénom de l'expéditeur *"
                  placeholderTextColor="#94a3b8"
                  value={senderName}
                  onChangeText={setSenderName}
                />

                <Text style={styles.inputSubLabel}>Numéro de téléphone</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Ex : +33 6 12 34 56 78"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={senderPhone}
                  onChangeText={setSenderPhone}
                />

                <Text style={styles.inputSubLabel}>Ville de départ *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={direction === 'FR_TO_MA' ? 'Ville en France (ex : Paris) *' : 'Ville au Maroc (ex : Casablanca) *'}
                  placeholderTextColor="#94a3b8"
                  value={fromCity}
                  onChangeText={setFromCity}
                />

                {/* Radio Buttons for Delivery Mode (isADomicile) */}
                <Text style={styles.inputSubLabel}>Mode de Livraison *</Text>
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

                <TouchableOpacity
                  style={styles.nextStepButton}
                  onPress={handleNextStep1}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextStepText}>Suivant : Destinataire ➔</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2: RECEIVER DETAILS */}
            {currentStep === 2 && (
              <View style={styles.stepFormContent}>
                <Text style={styles.formSectionTitle}>Étape 2 : Destinataire</Text>
                <Text style={styles.stepInstructionText}>Saisissez les coordonnées de la personne qui réceptionnera le colis.</Text>

                <Text style={styles.inputSubLabel}>Nom complet *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nom & prénom du destinataire *"
                  placeholderTextColor="#94a3b8"
                  value={receiverName}
                  onChangeText={setReceiverName}
                />

                <Text style={styles.inputSubLabel}>Numéro de téléphone</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Ex : +212 6 61 23 45 67"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={receiverPhone}
                  onChangeText={setReceiverPhone}
                />

                <Text style={styles.inputSubLabel}>Ville d'arrivée *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={direction === 'FR_TO_MA' ? 'Ville au Maroc (ex : Casablanca) *' : 'Ville en France (ex : Paris) *'}
                  placeholderTextColor="#94a3b8"
                  value={toCity}
                  onChangeText={setToCity}
                />

                {/* Radio Buttons for Payment Status */}
                <Text style={styles.inputSubLabel}>Statut de paiement *</Text>
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

                <View style={styles.stepNavRow}>
                  <TouchableOpacity
                    style={styles.backStepButton}
                    onPress={() => setCurrentStep(1)}
                    activeOpacity={0.8}
                  >
                    <ArrowLeft size={16} color="#334155" style={{ marginRight: 4 }} />
                    <Text style={styles.backStepText}>Retour</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.nextStepButton, { flex: 1, marginLeft: 10 }]}
                    onPress={handleNextStep2}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.nextStepText}>Suivant : Infos colis ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

           
            {currentStep === 3 && (
              <View style={styles.stepFormContent}>
                <Text style={styles.formSectionTitle}>Étape 3 : Caractéristiques & Photo</Text>
                <Text style={styles.stepInstructionText}>Spécifiez les métriques, la photo et la description du colis.</Text>

                {/* Summary badge of sender -> receiver */}
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryText}>
                    👤 {senderName} ({fromCity}) ➔ 📍 {receiverName} ({toCity})
                  </Text>
                </View>

                {/* Colis Image Selector */}
                <Text style={styles.inputSubLabel}>Photo du colis</Text>
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
                  placeholder="Ou collez l'URL personnalisée d'une image"
                  placeholderTextColor="#94a3b8"
                  value={image}
                  onChangeText={setImage}
                />

                {/* Package Specifications */}
                <Text style={styles.inputSubLabel}>Métriques du colis</Text>
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
                  placeholder="Description du contenu / Remarques"
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
                    activeOpacity={0.8}
                  >
                    <ArrowLeft size={16} color="#334155" style={{ marginRight: 4 }} />
                    <Text style={styles.backStepText}>Retour</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.formSubmitButton, { flex: 1, marginLeft: 10 }]}
                    onPress={handleFormSubmit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.formSubmitText}>Créer l'expédition</Text>
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
    backgroundColor: '#eff6ff',
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
  // Stepper Header
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 6,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  stepItemActive: {
    backgroundColor: '#eff6ff',
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  stepNumberBadgeActive: {
    backgroundColor: '#2563eb',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
  },
  stepNumberTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#1e40af',
    fontWeight: '700',
  },
  stepDivider: {
    width: 14,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  modalBody: {
    marginBottom: 10,
  },
  directionBadge: {
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  directionBadgeText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '700',
  },
  stepFormContent: {
    paddingBottom: 20,
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  stepInstructionText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  inputSubLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryBox: {
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
  },

  // Radio Buttons
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    height: 55,
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
    height: 70,
    textAlignVertical: 'top',
  },
  stepNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  backStepButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backStepText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  nextStepButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  nextStepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  formSubmitButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  formSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
