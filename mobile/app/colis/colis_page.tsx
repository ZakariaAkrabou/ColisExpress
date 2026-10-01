import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';

export interface Colis {
  id: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  weight: number; // in kg
  price: number; // in EUR
  status: 'pending' | 'in_transit' | 'delivered';
  date: string;
  description: string;
}

interface ColisPageProps {
  direction: 'FR_TO_MA' | 'MA_TO_FR';
  colisList: Colis[];
  onAddColis: (colis: Colis) => void;
}

export default function ColisPage({ direction, colisList, onAddColis }: ColisPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all');
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Form States
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleAddSubmit = () => {
    if (!senderName || !receiverName || !fromCity || !toCity || !weight || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newColis: Colis = {
      id: `CX-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName,
      senderPhone: senderPhone || '+33 6 1234 5678',
      receiverName,
      receiverPhone: receiverPhone || '+212 6 1234 5678',
      fromCity,
      toCity,
      weight: parseFloat(weight) || 1,
      price: parseFloat(price) || 10,
      status: 'pending',
      date: new Date().toLocaleDateString('fr-FR'),
      description: description || 'No description',
    };

    onAddColis(newColis);
    setShowAddModal(false);
    
    // Reset Form
    setSenderName('');
    setSenderPhone('');
    setReceiverName('');
    setReceiverPhone('');
    setFromCity('');
    setToCity('');
    setWeight('');
    setPrice('');
    setDescription('');
  };

  const filteredColis = colisList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.senderName.toLowerCase().includes(search.toLowerCase()) ||
      item.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      item.fromCity.toLowerCase().includes(search.toLowerCase()) ||
      item.toCity.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'in_transit':
        return styles.statusTransit;
      case 'delivered':
        return styles.statusDelivered;
    }
  };

  const getStatusLabel = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending';
      case 'in_transit':
        return '🚚 In Transit';
      case 'delivered':
        return '✅ Delivered';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Parcels Dashboard</Text>
          <Text style={styles.subtitle}>
            {direction === 'FR_TO_MA' ? '🇫🇷 France ➔ 🇲🇦 Morocco' : '🇲🇦 Morocco ➔ 🇫🇷 France'}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>➕ New Colis</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by tracking, sender, receiver..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'pending', 'in_transit', 'delivered'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, statusFilter === filter && styles.activeFilterTab]}
            onPress={() => setStatusFilter(filter)}
          >
            <Text style={[styles.filterTabText, statusFilter === filter && styles.activeFilterTabText]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Colis List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredColis.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No parcels found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or search term</Text>
          </View>
        ) : (
          filteredColis.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.colisCard}
              onPress={() => setSelectedColis(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.trackingId}>{item.id}</Text>
                <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                  <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.routeContainer}>
                  <View style={styles.routePoint}>
                    <Text style={styles.routeCity}>{item.fromCity}</Text>
                    <Text style={styles.routeLabel}>Sender: {item.senderName}</Text>
                  </View>
                  <Text style={styles.routeArrow}>➔</Text>
                  <View style={styles.routePoint}>
                    <Text style={styles.routeCity}>{item.toCity}</Text>
                    <Text style={styles.routeLabel}>Receiver: {item.receiverName}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.footerMetric}>
                  <Text style={styles.metricLabel}>Weight</Text>
                  <Text style={styles.metricValue}>{item.weight} kg</Text>
                </View>
                <View style={styles.footerMetric}>
                  <Text style={styles.metricLabel}>Price</Text>
                  <Text style={styles.metricValue}>{item.price} €</Text>
                </View>
                <View style={styles.footerMetric}>
                  <Text style={styles.metricLabel}>Date</Text>
                  <Text style={styles.metricValue}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Details Modal */}
      {selectedColis && (
        <Modal visible={true} transparent={true} animationType="slide" onRequestClose={() => setSelectedColis(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Colis Details</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedColis(null)}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.modalSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tracking Number</Text>
                    <Text style={styles.detailValueHighlight}>{selectedColis.id}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, getStatusStyle(selectedColis.status)]}>
                      <Text style={styles.statusText}>{getStatusLabel(selectedColis.status)}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Registered Date</Text>
                    <Text style={styles.detailValue}>{selectedColis.date}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Route & Address</Text>
                  <View style={styles.routeStep}>
                    <Text style={styles.stepDot}>🟢</Text>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>Origin</Text>
                      <Text style={styles.stepCity}>{selectedColis.fromCity}</Text>
                      <Text style={styles.stepSub}>{selectedColis.senderName} • {selectedColis.senderPhone}</Text>
                    </View>
                  </View>
                  <View style={styles.routeStep}>
                    <Text style={styles.stepDot}>🔴</Text>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>Destination</Text>
                      <Text style={styles.stepCity}>{selectedColis.toCity}</Text>
                      <Text style={styles.stepSub}>{selectedColis.receiverName} • {selectedColis.receiverPhone}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Specifications</Text>
                  <View style={styles.specGrid}>
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>Weight</Text>
                      <Text style={styles.specValue}>{selectedColis.weight} kg</Text>
                    </View>
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>Price Paid</Text>
                      <Text style={styles.specValue}>{selectedColis.price} €</Text>
                    </View>
                  </View>
                  <View style={styles.descriptionBox}>
                    <Text style={styles.specLabel}>Contents Description</Text>
                    <Text style={styles.descriptionText}>{selectedColis.description}</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Colis Modal */}
      <Modal visible={showAddModal} transparent={true} animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Colis</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.formSectionTitle}>Sender Details</Text>
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

              <Text style={styles.formSectionTitle}>Receiver Details</Text>
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

              <Text style={styles.formSectionTitle}>Route Details</Text>
              <TextInput
                style={styles.formInput}
                placeholder={direction === 'FR_TO_MA' ? 'Origin City (e.g., Paris) *' : 'Origin City (e.g., Casablanca) *'}
                placeholderTextColor="#94a3b8"
                value={fromCity}
                onChangeText={setFromCity}
              />
              <TextInput
                style={styles.formInput}
                placeholder={direction === 'FR_TO_MA' ? 'Destination City (e.g., Marrakech) *' : 'Destination City (e.g., Lyon) *'}
                placeholderTextColor="#94a3b8"
                value={toCity}
                onChangeText={setToCity}
              />

              <Text style={styles.formSectionTitle}>Package Specs</Text>
              <View style={styles.specInputRow}>
                <TextInput
                  style={[styles.formInput, { flex: 1, marginRight: 8 }]}
                  placeholder="Weight (kg) *"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
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
                placeholder="Package Contents / Description"
                placeholderTextColor="#94a3b8"
                multiline={true}
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity style={styles.formSubmitButton} onPress={handleAddSubmit}>
                <Text style={styles.formSubmitText}>Create Shipment</Text>
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
    backgroundColor: '#0f172a', // deep premium dark background
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
    color: '#38bdf8',
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#1e293b',
  },
  activeFilterTab: {
    backgroundColor: '#f59e0b', // Warm amber accent
  },
  filterTabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterTabText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  colisCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
    marginBottom: 10,
  },
  trackingId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusTransit: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  statusDelivered: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  cardBody: {
    marginBottom: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routePoint: {
    flex: 1,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  routeLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  routeArrow: {
    fontSize: 18,
    color: '#38bdf8',
    paddingHorizontal: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
  },
  footerMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 2,
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
  modalSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '600',
  },
  detailValueHighlight: {
    fontSize: 15,
    color: '#38bdf8',
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  routeStep: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepDot: {
    fontSize: 14,
    marginRight: 10,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  stepCity: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 2,
  },
  stepSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  specItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38bdf8',
  },
  descriptionBox: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
  },
  descriptionText: {
    color: '#f8fafc',
    fontSize: 13,
    lineHeight: 18,
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
  specInputRow: {
    flexDirection: 'row',
    marginBottom: 5,
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
