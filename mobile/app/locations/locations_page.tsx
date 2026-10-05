import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { MapPin, Plus, Search, Trash2, Edit3 } from 'lucide-react-native';
import { MoroccoFlagBadge, FranceFlagBadge } from '../../components/common/Icons';

import AddLocationPage from './add_location';
import EditLocationPage from './edit_location';

export type LocationCountry = 'morocco' | 'france';

export interface LocationItem {
  id: string;
  city: string;
  country: LocationCountry;
}

export const initialLocations: LocationItem[] = [
  { id: 'LOC-201', city: 'Casablanca', country: 'morocco' },
  { id: 'LOC-202', city: 'Marrakech', country: 'morocco' },
  { id: 'LOC-203', city: 'Rabat', country: 'morocco' },
  { id: 'LOC-204', city: 'Tangier', country: 'morocco' },
  { id: 'LOC-205', city: 'Fes', country: 'morocco' },
  { id: 'LOC-301', city: 'Paris', country: 'france' },
  { id: 'LOC-302', city: 'Lyon', country: 'france' },
  { id: 'LOC-303', city: 'Marseille', country: 'france' },
  { id: 'LOC-304', city: 'Nice', country: 'france' },
  { id: 'LOC-305', city: 'Toulouse', country: 'france' },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);
  const [countryTab, setCountryTab] = useState<LocationCountry>('morocco');
  const [search, setSearch] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesCountry = location.country === countryTab;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 || location.city.toLowerCase().includes(query);

      return matchesCountry && matchesSearch;
    });
  }, [locations, countryTab, search]);

  const handleAddLocation = (newLocation: LocationItem) => {
    setLocations((prev) => [newLocation, ...prev]);
  };

  const handleSaveEdit = (updatedLocation: LocationItem) => {
    setLocations((prev) =>
      prev.map((location) => (location.id === updatedLocation.id ? updatedLocation : location))
    );
  };

  const handleDeleteLocation = (id: string) => {
    Alert.alert('Supprimer la localisation', 'Voulez-vous vraiment supprimer cette ville ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => setLocations((prev) => prev.filter((location) => location.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <MapPin size={22} color="#1d4ed8" strokeWidth={2.4} style={{ marginRight: 6 }} />
            <Text style={styles.title}>Villes & Agences</Text>
          </View>
          <Text style={styles.subtitle}>
            {locations.filter((item) => item.country === countryTab).length} villes en {countryTab === 'morocco' ? 'Maroc' : 'France'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddPage(true)}
          activeOpacity={0.85}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 4 }} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Country Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, countryTab === 'morocco' && styles.tabButtonActive]}
          onPress={() => setCountryTab('morocco')}
          activeOpacity={0.8}
        >
          <MoroccoFlagBadge size={20} />
          <Text style={[styles.tabText, countryTab === 'morocco' && styles.tabTextActive]}>
            Maroc ({locations.filter((l) => l.country === 'morocco').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, countryTab === 'france' && styles.tabButtonActive]}
          onPress={() => setCountryTab('france')}
          activeOpacity={0.8}
        >
          <FranceFlagBadge size={20} />
          <Text style={[styles.tabText, countryTab === 'france' && styles.tabTextActive]}>
            France ({locations.filter((l) => l.country === 'france').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94a3b8" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher une ville..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Locations List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <MapPin size={40} color="#cbd5e1" strokeWidth={1.5} />
            <Text style={styles.emptyText}>Aucune localisation trouvée</Text>
          </View>
        ) : (
          filteredLocations.map((location) => (
            <View key={location.id} style={styles.locationCard}>
              <View style={styles.locationIconBadge}>
                <MapPin size={20} color="#2563eb" strokeWidth={2.2} />
              </View>

              <View style={styles.locationInfo}>
                <Text style={styles.cityName}>{location.city}</Text>
                <Text style={styles.regionName}>
                  {location.country === 'morocco' ? 'Maroc • Agence / Point relais' : 'France • Agence / Point relais'}
                </Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingLocation(location)}
                  activeOpacity={0.7}
                  accessibilityLabel="Modifier"
                >
                  <Edit3 size={15} color="#d97706" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteLocation(location.id)}
                  activeOpacity={0.7}
                  accessibilityLabel="Supprimer"
                >
                  <Trash2 size={15} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {showAddPage && (
        <AddLocationPage
          onClose={() => setShowAddPage(false)}
          onSave={(newLocation) => {
            handleAddLocation(newLocation);
            setShowAddPage(false);
          }}
        />
      )}

      {editingLocation && (
        <EditLocationPage
          location={editingLocation}
          onClose={() => setEditingLocation(null)}
          onSave={(updated) => {
            handleSaveEdit(updated);
            setEditingLocation(null);
          }}
        />
      )}
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#1e40af',
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  clearSearch: {
    color: '#94a3b8',
    fontSize: 14,
    padding: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1.5,
  },
  locationIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
    marginRight: 8,
  },
  cityName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  regionName: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 10,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
  },
});
