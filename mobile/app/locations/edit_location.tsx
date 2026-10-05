import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

import type { LocationCountry, LocationItem } from './locations_page';

interface EditLocationPageProps {
  location: LocationItem;
  onClose: () => void;
  onSave: (location: LocationItem) => void;
}

export default function EditLocationPage({ location, onClose, onSave }: EditLocationPageProps) {
  const [city, setCity] = useState(location.city);
  const [country, setCountry] = useState<LocationCountry>(location.country);

  useEffect(() => {
    setCity(location.city);
    setCountry(location.country);
  }, [location]);

  const handleSubmit = () => {
    if (!city.trim()) {
      Alert.alert('Missing city', 'Please enter a city name before saving.');
      return;
    }

    onSave({
      ...location,
      city: city.trim(),
      country,
    });
    onClose();
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Location</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>City name</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Ex: Rabat"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <Text style={styles.label}>Country</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, country === 'morocco' && styles.activeTabButton]}
            onPress={() => setCountry('morocco')}
          >
            <Text style={[styles.tabText, country === 'morocco' && styles.activeTabText]}>Morocco</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, country === 'france' && styles.activeTabButton]}
            onPress={() => setCountry('france')}
          >
            <Text style={[styles.tabText, country === 'france' && styles.activeTabText]}>France</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Update location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 4,
    marginTop: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  activeTabText: {
    color: '#f8fafc',
  },
  saveButton: {
    marginTop: 22,
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
});
