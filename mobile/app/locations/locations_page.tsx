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
    Alert.alert('Delete location', 'Are you sure you want to remove this city?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setLocations((prev) => prev.filter((location) => location.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Locations</Text>
          <Text style={styles.subtitle}>{locations.filter((item) => item.country === countryTab).length} cities</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddPage(true)}>
          <Text style={styles.addButtonText}>+ Add location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, countryTab === 'morocco' && styles.tabButtonActive]}
          onPress={() => setCountryTab('morocco')}
        >
          <Text style={[styles.tabText, countryTab === 'morocco' && styles.tabTextActive]}>Morocco</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, countryTab === 'france' && styles.tabButtonActive]}
          onPress={() => setCountryTab('france')}
        >
          <Text style={[styles.tabText, countryTab === 'france' && styles.tabTextActive]}>France</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search city"
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filteredLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyText}>No location found</Text>
          </View>
        ) : (
          filteredLocations.map((location) => (
            <View key={location.id} style={styles.locationCard}>
              <View style={styles.locationInfo}>
                <Text style={styles.cityName}>{location.city}</Text>
                <Text style={styles.regionName}>{location.country === 'morocco' ? 'Morocco' : 'France'}</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingLocation(location)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteLocation(location.id)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
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
    backgroundColor: '#020817',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 3,
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#1d4ed8',
  },
  tabText: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    paddingVertical: 12,
    fontSize: 15,
  },
  list: {
    flex: 1,
    paddingBottom: 20,
  },
  locationCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  locationInfo: {
    flex: 1,
    marginRight: 12,
  },
  cityName: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  regionName: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 34,
    marginBottom: 8,
  },
  emptyText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
  },
});
