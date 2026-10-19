import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { Package, Plus, Search, MapPin, Phone, FileText } from 'lucide-react-native';

import CreateColis, { Colis } from './create-colis';
import ViewColis from './view_colis';
import UpdateColis from './update_colis';
import { SafeAreaView } from 'react-native-safe-area-context';

export { Colis };

export interface ColisPageProps {
  direction: 'FR_TO_MA' | 'MA_TO_FR';
  colisList: Colis[];
  onAddColis: (colis: Colis) => void;
  onUpdateColis?: (updatedColis: Colis) => void;
  onNavigateToDocs?: (city?: string) => void;
}

const DEFAULT_PARCEL_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500';

export default function ColisPage({
  direction,
  colisList,
  onAddColis,
  onUpdateColis,
  onNavigateToDocs,
}: ColisPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all');
  const [cityFilter, setCityFilter] = useState('all');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewColis, setViewColis] = useState<Colis | null>(null);
  const [editColis, setEditColis] = useState<Colis | null>(null);

  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [cityMenuVisible, setCityMenuVisible] = useState(false);

  const handleUpdate = (updated: Colis) => {
    if (onUpdateColis) {
      onUpdateColis(updated);
    }
    if (viewColis && viewColis.id === updated.id) {
      setViewColis(updated);
    }
  };

  const handleStatusQuickChange = (colisId: string, newStatus: Colis['status']) => {
    const itemToUpdate = colisList.find((c) => c.id === colisId);
    if (itemToUpdate) {
      const updated = { ...itemToUpdate, status: newStatus };
      handleUpdate(updated);
    }
  };

  const cities = ['all', ...Array.from(new Set(colisList.flatMap((c) => [c.toCity, c.fromCity]).filter(Boolean)))];

  const filteredColis = colisList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.senderName.toLowerCase().includes(search.toLowerCase()) ||
      item.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      item.fromCity.toLowerCase().includes(search.toLowerCase()) ||
      item.toCity.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    const matchesCity =
      cityFilter === 'all' || item.toCity === cityFilter || item.fromCity === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
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

  const getStatusTextStyle = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return styles.statusTextPending;
      case 'in_transit':
        return styles.statusTextTransit;
      case 'delivered':
        return styles.statusTextDelivered;
    }
  };

  const getStatusLabel = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return '⏳ En attente';
      case 'in_transit':
        return '🚚 En transit';
      case 'delivered':
        return '✅ Livré';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Package size={22} color="#1d4ed8" strokeWidth={2.4} style={{ marginRight: 6 }} />
            <Text style={styles.title}>Gestion des Colis</Text>
          </View>
          <Text style={styles.subtitle}>
            {direction === 'FR_TO_MA' ? '🇫🇷 France ➔ 🇲🇦 Maroc' : '🇲🇦 Maroc ➔ 🇫🇷 France'} • {filteredColis.length} colis
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.85}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 4 }} />
          <Text style={styles.addButtonText}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par ID, nom, ville..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearchBtn}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Row: Status & City Dropdowns */}
      <View style={styles.filterRow}>
        {/* Status Dropdown */}
        <View style={styles.dropdownWrapper}>
          <Text style={styles.dropdownLabel}>Statut</Text>
          <TouchableOpacity
            style={[styles.dropdownToggle, statusMenuVisible && styles.dropdownToggleActive]}
            onPress={() => {
              setStatusMenuVisible(!statusMenuVisible);
              setCityMenuVisible(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownToggleText} numberOfLines={1}>
              {statusFilter === 'all'
                ? `Tous (${colisList.length})`
                : statusFilter === 'pending'
                ? `En attente (${colisList.filter((c) => c.status === 'pending').length})`
                : statusFilter === 'in_transit'
                ? `En transit (${colisList.filter((c) => c.status === 'in_transit').length})`
                : `Livré (${colisList.filter((c) => c.status === 'delivered').length})`}
            </Text>
            <Text style={styles.dropdownChevron}>{statusMenuVisible ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {statusMenuVisible && (
            <View style={styles.dropdownMenu}>
              {(['all', 'pending', 'in_transit', 'delivered'] as const).map((filter) => {
                const isActive = statusFilter === filter;
                const count =
                  filter === 'all'
                    ? colisList.length
                    : colisList.filter((c) => c.status === filter).length;
                const label =
                  filter === 'all'
                    ? 'Tous'
                    : filter === 'pending'
                    ? 'En attente'
                    : filter === 'in_transit'
                    ? 'En transit'
                    : 'Livré';
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    onPress={() => {
                      setStatusFilter(filter);
                      setStatusMenuVisible(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                      {label} ({count})
                    </Text>
                    {isActive && <Text style={styles.dropdownCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* City Dropdown */}
        <View style={styles.dropdownWrapper}>
          <Text style={styles.dropdownLabel}>Ville</Text>
          <TouchableOpacity
            style={[styles.dropdownToggle, cityMenuVisible && styles.dropdownToggleActive]}
            onPress={() => {
              setCityMenuVisible(!cityMenuVisible);
              setStatusMenuVisible(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownToggleText} numberOfLines={1}>
              {cityFilter === 'all' ? 'Toutes les villes' : cityFilter}
            </Text>
            <Text style={styles.dropdownChevron}>{cityMenuVisible ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {cityMenuVisible && (
            <View style={styles.dropdownMenu}>
              {cities.map((city) => {
                const isActive = cityFilter === city;
                return (
                  <TouchableOpacity
                    key={city}
                    style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    onPress={() => {
                      setCityFilter(city);
                      setCityMenuVisible(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                      {city === 'all' ? 'Toutes les villes' : city}
                    </Text>
                    {isActive && <Text style={styles.dropdownCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* 2-by-2 Grid Layout of Colis Cards */}
      <ScrollView contentContainerStyle={styles.listScrollContent} showsVerticalScrollIndicator={false}>
        {filteredColis.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={42} color="#cbd5e1" strokeWidth={1.5} />
            <Text style={styles.emptyText}>Aucun colis trouvé</Text>
            <Text style={styles.emptySubtext}>Essayez de modifier votre recherche ou vos filtres</Text>
          </View>
        ) : (
          <View style={styles.gridTwoByTwoContainer}>
            {filteredColis.map((item) => {
              const isPaid = item.isPaid !== false;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridCard}
                  onPress={() => setViewColis(item)}
                  activeOpacity={0.85}
                >
                  {/* Parcel Image Header */}
                  <View style={styles.cardImageWrapper}>
                    <Image
                      source={{ uri: item.image || DEFAULT_PARCEL_IMAGE }}
                      style={styles.cardImage}
                    />
                    {/* WhatsApp button - top right of image */}
                    <TouchableOpacity
                      style={styles.whatsappButton}
                      onPress={() => {
                        const phone = item.receiverPhone.replace(/[^\d+]/g, '');
                        const msg = encodeURIComponent(`Bonjour ${item.receiverName}, votre colis ${item.id} est en route!`);
                        Linking.openURL(`https://wa.me/${phone}?text=${msg}`);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.whatsappIcon}>💬</Text>
                    </TouchableOpacity>
                    <View style={styles.cardImageOverlay}>
                      <Text style={styles.trackingIdTag}>{item.id}</Text>
                      <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                        <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
                          {getStatusLabel(item.status)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Body */}
                  <View style={styles.cardContent}>
                    {/* Payment tag */}
                    <View style={styles.paymentTagRow}>
                      <View style={[styles.paidChip, isPaid ? styles.paidChipSuccess : styles.paidChipDanger]}>
                        <Text style={[styles.paidChipText, isPaid ? styles.paidTextSuccess : styles.paidTextDanger]}>
                          {isPaid ? '🟢 Payé' : '🔴 Non Payé'}
                        </Text>
                      </View>
                    </View>

                    {/* Sender & Receiver Info */}
                    <View style={styles.senderReceiverRow}>
                      {/* Sender */}
                      <View style={styles.personColumn}>
                        <Text style={styles.personColumnLabel}>Expéditeur</Text>
                        <Text style={styles.personName} numberOfLines={1}>{item.senderName}</Text>
                        <Text style={styles.personDetail} numberOfLines={1}>📍 {item.fromCity}</Text>
                        <Text style={styles.personDetail} numberOfLines={1}>📞 {item.senderPhone}</Text>
                      </View>
                      {/* Divider */}
                      <View style={styles.personDivider} />
                      {/* Receiver */}
                      <View style={styles.personColumn}>
                        <Text style={styles.personColumnLabel}>Destinataire</Text>
                        <Text style={styles.personName} numberOfLines={1}>{item.receiverName}</Text>
                        <Text style={styles.personDetail} numberOfLines={1}>📍 {item.toCity}</Text>
                        <Text style={styles.personDetail} numberOfLines={1}>📞 {item.receiverPhone}</Text>
                      </View>
                    </View>

                    {/* Specs footer */}
                    <View style={styles.cardFooterGrid}>
                      <View style={styles.miniMetric}>
                        <Text style={styles.miniMetricLabel}>Qté</Text>
                        <Text style={styles.miniMetricVal}>{item.quantity ?? 1}</Text>
                      </View>
                      <View style={styles.miniMetricDivider} />
                      <View style={styles.miniMetric}>
                        <Text style={styles.miniMetricLabel}>Poids</Text>
                        <Text style={styles.miniMetricVal}>{item.weight} kg</Text>
                      </View>
                      <View style={styles.miniMetricDivider} />
                      <View style={styles.miniMetric}>
                        <Text style={styles.miniMetricLabel}>Prix</Text>
                        <Text style={styles.miniMetricValHighlight}>{item.price} MAD</Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.cardActionRow}>
                      <TouchableOpacity
                        style={styles.viewActionBtn}
                        onPress={() => setViewColis(item)}
                      >
                        <Text style={styles.viewActionText}>👁️ Détails</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.editActionBtn}
                        onPress={() => setEditColis(item)}
                      >
                        <Text style={styles.editActionText}>✏️ Modifier</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* --- MODALS --- */}
      <CreateColis
        visible={showCreateModal}
        direction={direction}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onAddColis}
      />

      <ViewColis
        visible={!!viewColis}
        colis={viewColis}
        onClose={() => setViewColis(null)}
        onEdit={(colisToEdit) => {
          setViewColis(null);
          setEditColis(colisToEdit);
        }}
        onStatusChange={handleStatusQuickChange}
        onOpenDocs={onNavigateToDocs}
      />

      <UpdateColis
        visible={!!editColis}
        colis={editColis}
        direction={direction}
        onClose={() => setEditColis(null)}
        onSubmit={handleUpdate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  docsNavButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  docsNavButtonText: {
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearch: {
    color: '#94a3b8',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  dropdownWrapper: {
    flex: 1,
    zIndex: 10,
  },
  dropdownLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownToggleActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  dropdownToggleText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  dropdownChevron: {
    color: '#64748b',
    fontSize: 9,
    marginLeft: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemActive: {
    backgroundColor: '#eff6ff',
  },
  dropdownItemText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: '#1e40af',
    fontWeight: '700',
  },
  dropdownCheck: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '800',
  },
  listScrollContent: {
    paddingBottom: 30,
  },
  // 2-by-2 Grid Layout Styles
  gridTwoByTwoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  whatsappButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#25D366',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  whatsappIcon: {
    fontSize: 14,
  },
  cardImageWrapper: {
    height: 95,
    width: '100%',
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackingIdTag: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusTransit: {
    backgroundColor: '#dbeafe',
  },
  statusDelivered: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  statusTextPending: {
    color: '#b45309',
  },
  statusTextTransit: {
    color: '#1d4ed8',
  },
  statusTextDelivered: {
    color: '#15803d',
  },
  cardContent: {
    padding: 10,
  },
  paymentTagRow: {
    marginBottom: 6,
  },
  paidChip: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  paidChipSuccess: {
    backgroundColor: '#dcfce7',
  },
  paidChipDanger: {
    backgroundColor: '#fee2e2',
  },
  paidChipText: {
    fontSize: 9,
    fontWeight: '800',
  },
  paidTextSuccess: {
    color: '#15803d',
  },
  paidTextDanger: {
    color: '#b91c1c',
  },
  senderReceiverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  personColumn: {
    flex: 1,
  },
  personColumnLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  personName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 1,
  },
  personDetail: {
    fontSize: 8,
    color: '#64748b',
    fontWeight: '500',
  },
  personDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 6,
  },
  cardFooterGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 6,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  miniMetricDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e2e8f0',
  },
  miniMetric: {
    alignItems: 'center',
    flex: 1,
  },
  miniMetricLabel: {
    fontSize: 8,
    color: '#64748b',
    fontWeight: '600',
  },
  miniMetricVal: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },
  miniMetricValHighlight: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1d4ed8',
    marginTop: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    gap: 6,
  },
  viewActionBtn: {
    flex: 1,
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  viewActionText: {
    fontSize: 10,
    color: '#1d4ed8',
    fontWeight: '700',
  },
  editActionBtn: {
    flex: 1,
    backgroundColor: '#fef3c7',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  editActionText: {
    fontSize: 10,
    color: '#d97706',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
