import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';

import CreateColis, { Colis } from './create-colis';
import ViewColis from './view_colis';
import UpdateColis from './update_colis';

export { Colis };

export interface ColisPageProps {
  direction: 'FR_TO_MA' | 'MA_TO_FR';
  colisList: Colis[];
  onAddColis: (colis: Colis) => void;
  onUpdateColis?: (updatedColis: Colis) => void;
}

const DEFAULT_PARCEL_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500';
export default function ColisPage({
  direction,
  colisList,
  onAddColis,
  onUpdateColis,
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
  const cities = ['all', ...Array.from(new Set(colisList.flatMap(c => [c.toCity, c.fromCity]).filter(Boolean)))];
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

  const getStatusLabel = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending';
      case 'in_transit':
        return '🚚 Transit';
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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>➕ New Colis</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search parcels..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearchBtn}>
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Row: Status (left) & City (right) */}
      <View style={styles.filterRow}>
        {/* Status Dropdown */}
        <View style={styles.dropdownWrapper}>
          <Text style={styles.dropdownLabel}>Status</Text>
          <TouchableOpacity
            style={[styles.dropdownToggle, statusMenuVisible && styles.dropdownToggleActive]}
            onPress={() => {
              setStatusMenuVisible(!statusMenuVisible);
              setCityMenuVisible(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownToggleText}>
              {statusFilter === 'all'
                ? `All (${colisList.length})`
                : statusFilter === 'pending'
                  ? `⏳ Pending (${colisList.filter(c => c.status === 'pending').length})`
                  : statusFilter === 'in_transit'
                    ? `🚚 Transit (${colisList.filter(c => c.status === 'in_transit').length})`
                    : `✅ Delivered (${colisList.filter(c => c.status === 'delivered').length})`}
            </Text>
            <Text style={styles.dropdownChevron}>{statusMenuVisible ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {statusMenuVisible && (
            <View style={styles.dropdownMenu}>
              {(['all', 'pending', 'in_transit', 'delivered'] as const).map((filter) => {
                const isActive = statusFilter === filter;
                const count = filter === 'all'
                  ? colisList.length
                  : colisList.filter(c => c.status === filter).length;
                const label = filter === 'all' ? 'All' : filter === 'pending' ? '⏳ Pending' : filter === 'in_transit' ? '🚚 Transit' : '✅ Delivered';
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
          <Text style={styles.dropdownLabel}>City</Text>
          <TouchableOpacity
            style={[styles.dropdownToggle, cityMenuVisible && styles.dropdownToggleActive]}
            onPress={() => {
              setCityMenuVisible(!cityMenuVisible);
              setStatusMenuVisible(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownToggleText}>
              {cityFilter === 'all' ? 'All Cities' : cityFilter}
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
                      {city === 'all' ? 'All Cities' : city}
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
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No parcels found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search query or filter</Text>
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
                        <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
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

                    {/* Route
                    <View style={styles.routeHeader}>
                      <Text style={styles.routeCityText} numberOfLines={1}>
                        {item.fromCity}
                      </Text>
                      <Text style={styles.routeArrowText}>➔</Text>
                      <Text style={styles.routeCityText} numberOfLines={1}>
                        {item.toCity}
                      </Text>
                    </View> */}

                    {/* Sender (left) & Receiver (right) */}
                    <View style={styles.senderReceiverRow}>
                      {/* Sender - Left Side */}
                      <View style={styles.personColumn}>
                        <Text style={styles.personName} numberOfLines={1}>{item.senderName}</Text>
                        <Text style={styles.personDetail} numberOfLines={1}>📍 {item.fromCity}</Text>
                        <Text style={styles.personDetail} numberOfLines={1}>📞 {item.senderPhone}</Text>
                      </View>
                      {/* Divider */}
                      <View style={styles.personDivider} />
                      {/* Receiver - Right Side */}
                      <View style={styles.personColumn}>
                        <Text style={styles.personName} numberOfLines={1}>{item.receiverName}</Text>
                        <Text style={styles.personDetail} numberOfLines={1}>📍 {item.toCity}</Text>
                        <Text style={styles.personDetail} numberOfLines={1}>📞 {item.receiverPhone}</Text>
                      </View>
                    </View>

                    {/* Specs footer */}
                    <View style={styles.cardFooterGrid}>
                      <View style={styles.miniMetric}>
                        <Text style={styles.miniMetricLabel}>Qty</Text>
                        <Text style={styles.miniMetricVal}>{item.quantity ?? 1}</Text>
                      </View>
                      <View style={styles.miniMetricDivider} />
                      <View style={styles.miniMetric}>
                        <Text style={styles.miniMetricLabel}>Weight</Text>
                        <Text style={styles.miniMetricVal}>{item.weight} kg</Text>
                      </View>
                      <View style={styles.miniMetricDivider} />
                      <View style={styles.miniMetric}>
                        <Text style={styles.miniMetricLabel}>Price</Text>
                        <Text style={styles.miniMetricValHighlight}>{item.price} MAD</Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.cardActionRow}>
                      <TouchableOpacity
                        style={styles.viewActionBtn}
                        onPress={() => setViewColis(item)}
                      >
                        <Text style={styles.viewActionText}>👁️ View</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.editActionBtn}
                        onPress={() => setEditColis(item)}
                      >
                        <Text style={styles.editActionText}>✏️ Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* --- SEPARATE MODALS --- */}
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
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 38,
    color: '#f8fafc',
    fontSize: 13,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 6,
    gap: 8,
  },
  dropdownWrapper: {
    flex: 1,
    zIndex: 10,
  },
  dropdownLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownToggleActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#1a2744',
  },
  dropdownToggleText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  dropdownChevron: {
    color: '#94a3b8',
    fontSize: 8,
    marginLeft: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 2,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#293548',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  dropdownItemText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  dropdownCheck: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
  },
  listScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  // 2-by-2 Grid Layout Styles
  gridTwoByTwoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48.5%', // Two side-by-side per row
    backgroundColor: '#1e293b',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  whatsappIcon: {
    fontSize: 14,
  },
  cardImageWrapper: {
    height: 95,
    width: '100%',
    position: 'relative',
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
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackingIdTag: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
  },
  statusTransit: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
  },
  statusDelivered: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  cardContent: {
    padding: 8,
  },
  paymentTagRow: {
    marginBottom: 4,
  },
  paidChip: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  paidChipSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  paidChipDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  paidChipText: {
    fontSize: 9,
    fontWeight: '800',
  },
  paidTextSuccess: {
    color: '#10b981',
  },
  paidTextDanger: {
    color: '#ef4444',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  routeCityText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#f8fafc',
    flex: 1,
  },
  routeArrowText: {
    fontSize: 11,
    color: '#38bdf8',
    marginHorizontal: 2,
  },
  senderReceiverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  personColumn: {
    flex: 1,
  },
  personColumnLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#38bdf8',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  personName: {
    fontSize: 8,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 1,
  },
  personDetail: {
    fontSize: 7,
    color: '#94a3b8',
    fontWeight: '500',
  },
  personDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 6,
  },
  cardFooterGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 6,
    borderRadius: 6,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  miniMetricDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#334155',
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
    fontSize: 7,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 1,
  },
  miniMetricValHighlight: {
    fontSize: 7,
    fontWeight: '800',
    color: '#38bdf8',
    marginTop: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  viewActionBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  viewActionText: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: '700',
  },
  editActionBtn: {
    flex: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 3,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  editActionText: {
    fontSize: 10,
    color: '#f59e0b',
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
});
