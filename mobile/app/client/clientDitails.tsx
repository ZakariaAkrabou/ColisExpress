// clientDitails.tsx

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MapPin, Phone, User, X, Pencil, Trash2, Save } from 'lucide-react-native';

import type { Client } from './clientPage';
import type { Colis } from '../colis/colis_page';

interface ClientDetailModalProps {
  client: Client | null;
  visible: boolean;
  onClose: () => void;
  colisList?: Colis[];
  onUpdateClient: (client: Client) => Promise<boolean>;
  onDeleteClient: (clientId: string) => Promise<boolean>;
}

export default function ClientDetailModal({
  client,
  visible,
  onClose,
  colisList = [],
  onUpdateClient,
  onDeleteClient,
}: ClientDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setCity(client.city);
      setIsEditing(false);
    }
  }, [client]);

  if (!client) return null;

  const handleSave = async () => {
    if (!name.trim() || !phone.trim() || !city.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (saving) return;

    const updatedClient: Client = {
      ...client,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
    };

    try {
      setSaving(true);

      const success = await onUpdateClient(updatedClient);

      if (success) {
        setIsEditing(false);
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Supprimer le client',
      `Voulez-vous vraiment supprimer ${client.name} ? Cette action est définitive.`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            if (saving) return;

            try {
              setSaving(true);
              await onDeleteClient(client.id);
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Détails du client</Text>
              <Text style={styles.headerSubtitle}>
                Informations et coordonnées
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={21} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.avatar}>
              <User size={30} color="#2563eb" />
            </View>

            {!isEditing ? (
              <>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientCity}>{client.city}</Text>

                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Phone size={19} color="#2563eb" />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Téléphone</Text>
                      <Text style={styles.infoValue}>{client.phone}</Text>
                    </View>
                  </View>

                  <View style={styles.separator} />

                  <View style={styles.infoRow}>
                    <MapPin size={19} color="#2563eb" />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Ville</Text>
                      <Text style={styles.infoValue}>{client.city}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.shipmentsCard}>
                  <Text style={styles.shipmentsNumber}>
                    {client.totalShipments ?? 0}
                  </Text>
                  <Text style={styles.shipmentsLabel}>
                    Colis associés
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                  activeOpacity={0.85}
                >
                  <Pencil size={17} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>Modifier le client</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={confirmDelete}
                  activeOpacity={0.85}
                >
                  <Trash2 size={17} color="#dc2626" />
                  <Text style={styles.deleteButtonText}>Supprimer le client</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.editTitle}>Modifier les informations</Text>

                <Text style={styles.fieldLabel}>Nom complet</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nom complet"
                  placeholderTextColor="#94a3b8"
                />

                <Text style={styles.fieldLabel}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Téléphone"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                />

                <Text style={styles.fieldLabel}>Ville</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Ville"
                  placeholderTextColor="#94a3b8"
                />

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleSave}
                  disabled={saving}
                  activeOpacity={0.85}
                >
                  <Save size={17} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setName(client.name);
                    setPhone(client.phone);
                    setCity(client.city);
                    setIsEditing(false);
                  }}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '90%',
    minHeight: '65%',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 3,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 22,
    paddingBottom: 35,
    alignItems: 'stretch',
  },
  avatar: {
    alignSelf: 'center',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  clientName: {
    textAlign: 'center',
    color: '#0f172a',
    fontSize: 21,
    fontWeight: '800',
  },
  clientCity: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 13,
    marginTop: 5,
    marginBottom: 22,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 5,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  infoValue: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  shipmentsCard: {
    marginTop: 15,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  shipmentsNumber: {
    color: '#1d4ed8',
    fontSize: 24,
    fontWeight: '800',
  },
  shipmentsLabel: {
    color: '#475569',
    fontSize: 12,
    marginTop: 3,
  },
  editButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 22,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
  editTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#0f172a',
    fontSize: 14,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 14,
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },
});
