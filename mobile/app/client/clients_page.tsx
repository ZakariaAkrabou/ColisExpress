import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colis } from '../colis/colis_page';
import { MoroccoFlagBadge, FranceFlagBadge } from '../../components/common/Icons';

export interface Client {
  id: string;
  name: string;
  phone: string;
  city: string;
  totalShipments: number;
}

interface ClientsPageProps {
  clientsList: Client[];
  colisList: Colis[];
  onAddClient: (client: Client) => void;
}

export default function ClientsPage({ clientsList, colisList, onAddClient }: ClientsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<'+212' | '+33'>('+212');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const handleAddSubmit = () => {
    if (!name.trim() || !phone.trim() || !city.trim()) {
      Alert.alert('Error', 'Please fill in Name, Phone, and City');
      return;
    }

    const fullPhone = `${phoneCountry} ${phone.trim()}`;
    const newClient: Client = {
      id: `CL-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      phone: fullPhone,
      city: city.trim(),
      totalShipments: 0,
    };

    onAddClient(newClient);
    setShowAddModal(false);

    // Reset Form
    setName('');
    setPhoneCountry('+212');
    setPhone('');
    setCity('');
  };

  const filteredClients = clientsList.filter((client) => {
    return (
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search) ||
      client.city.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getClientColis = (clientPhone: string) => {
    return colisList.filter(
      (c) => c.senderPhone === clientPhone || c.receiverPhone === clientPhone
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clients Database</Text>
          <Text style={styles.subtitle}>{clientsList.length} total contacts</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>👥 Add Client</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, phone or city..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Clients List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredClients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No clients found</Text>
            <Text style={styles.emptySubtext}>Try search with a different keyword</Text>
          </View>
        ) : (
          filteredClients.map((client) => {
            const activeColisCount = getClientColis(client.phone).length;
            return (
              <TouchableOpacity
                key={client.id}
                style={styles.clientCard}
                onPress={() => setSelectedClient(client)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.clientAvatar}>
                    <Text style={styles.avatarText}>
                      {client.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </Text>
                  </View>
                  <View style={styles.headerInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientPhone}>📞 {client.phone}</Text>
                  </View>
                  <View style={styles.shipmentBadge}>
                    <Text style={styles.badgeLabel}>Colis</Text>
                    <Text style={styles.badgeValue}>{activeColisCount || client.totalShipments}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.clientMeta}>📍 {client.city}</Text>
                  <Text style={styles.clientMetaLink}>View Profile ›</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Client Detail Modal */}
      {selectedClient && (
        <Modal visible={true} transparent={true} animationType="slide" onRequestClose={() => setSelectedClient(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Client Profile</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedClient(null)}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Profile Avatar Card */}
                <View style={styles.profileAvatarCard}>
                  <View style={styles.largeAvatar}>
                    <Text style={styles.largeAvatarText}>
                      {selectedClient.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </Text>
                  </View>
                  <Text style={styles.profileName}>{selectedClient.name}</Text>
                  <Text style={styles.profileId}>ID: {selectedClient.id}</Text>
                </View>

                {/* Actions Row */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Call Contact', `Calling ${selectedClient.phone}...`)}
                  >
                    <Text style={styles.actionIcon}>📞</Text>
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#10b981' }]}
                    onPress={() => Alert.alert('SMS Contact', `Opening message with ${selectedClient.phone}...`)}
                  >
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>SMS</Text>
                  </TouchableOpacity>
                </View>

                {/* Contact Information */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone Number</Text>
                    <Text style={styles.infoValue}>{selectedClient.phone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>City</Text>
                    <Text style={styles.infoValue}>{selectedClient.city}</Text>
                  </View>
                </View>

                {/* Associated Colis */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Shipment History ({getClientColis(selectedClient.phone).length})</Text>
                  {getClientColis(selectedClient.phone).length === 0 ? (
                    <Text style={styles.noColisText}>No shipments registered for this client.</Text>
                  ) : (
                    getClientColis(selectedClient.phone).map((colis) => (
                      <View key={colis.id} style={styles.clientColisItem}>
                        <View style={styles.colisHeader}>
                          <Text style={styles.colisId}>{colis.id}</Text>
                          <Text
                            style={[
                              styles.colisStatusText,
                              colis.status === 'delivered'
                                ? { color: '#10b981' }
                                : colis.status === 'in_transit'
                                ? { color: '#3b82f6' }
                                : { color: '#f59e0b' },
                            ]}
                          >
                            {colis.status.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.colisRoute}>
                          {colis.fromCity} ➔ {colis.toCity} ({colis.weight} kg)
                        </Text>
                        <Text style={styles.colisDate}>Date: {colis.date}</Text>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Client Modal */}
      <Modal visible={showAddModal} transparent={true} animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Client</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.formSectionTitle}>Client Details</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Full Name *"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <View style={styles.countrySelectorRow}>
                <TouchableOpacity
                  style={[
                    styles.countryTab,
                    phoneCountry === '+212' ? styles.countryTabActive : null,
                  ]}
                  onPress={() => setPhoneCountry('+212')}
                  activeOpacity={0.8}
                >
                  <MoroccoFlagBadge size={18} />
                  <Text
                    style={[
                      styles.countryCodeText,
                      phoneCountry === '+212' ? styles.countryCodeTextActive : null,
                    ]}
                  >
                    +212 (Maroc)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.countryTab,
                    phoneCountry === '+33' ? styles.countryTabActive : null,
                  ]}
                  onPress={() => setPhoneCountry('+33')}
                  activeOpacity={0.8}
                >
                  <FranceFlagBadge size={18} />
                  <Text
                    style={[
                      styles.countryCodeText,
                      phoneCountry === '+33' ? styles.countryCodeTextActive : null,
                    ]}
                  >
                    +33 (France)
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.formInput}
                placeholder="Phone Number *"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <Text style={styles.formSectionTitle}>City</Text>
              <TextInput
                style={styles.formInput}
                placeholder="City *"
                placeholderTextColor="#94a3b8"
                value={city}
                onChangeText={setCity}
              />

              <TouchableOpacity style={styles.formSubmitButton} onPress={handleAddSubmit}>
                <Text style={styles.formSubmitText}>Register Client</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#f8fafc',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  clientCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38bdf8',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
  clientPhone: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  shipmentBadge: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f59e0b',
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  clientMeta: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  clientMetaLink: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalContentLarge: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '90%',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 15,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '600',
  },
  modalBody: {
    marginBottom: 10,
  },
  profileAvatarCard: {
    alignItems: 'center',
    marginVertical: 10,
  },
  largeAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
    marginBottom: 10,
  },
  largeAvatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38bdf8',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  profileId: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionIcon: {
    fontSize: 14,
    color: '#fff',
    marginRight: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  infoSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#f8fafc',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  noColisText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },
  clientColisItem: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  colisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colisId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  colisStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  colisRoute: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  colisDate: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  formSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e2e8f0',
    marginTop: 15,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  formInput: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    color: '#f8fafc',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  countrySelectorRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 3,
    marginBottom: 10,
    gap: 6,
  },
  countryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  countryTabActive: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  countryCodeText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  countryCodeTextActive: {
    color: '#38bdf8',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  formSubmitButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  formSubmitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
