import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, Package, Users, MapPin, Settings } from 'lucide-react-native';

export type TabType = 'home' | 'colis' | 'clients' | 'locations' | 'settings' | 'more';

export interface FooterProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddPress?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  onTabChange,
}) => {
  const isHome = activeTab === 'home';
  const isColis = activeTab === 'colis';
  const isClients = activeTab === 'clients';
  const isLocations = activeTab === 'locations';
  const isSettings = activeTab === 'settings' || activeTab === 'more';

  return (
    <View style={styles.footerContainer}>
      {/* 1. Colis (Left 1) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('colis')}
        activeOpacity={0.7}
      >
        <Package
          size={22}
          color={isColis ? '#2563EB' : '#94A3B8'}
          strokeWidth={isColis ? 2.5 : 1.8}
        />
        <Text style={[styles.tabLabel, isColis && styles.activeTabLabel]}>
          Colis
        </Text>
      </TouchableOpacity>

      {/* 2. Clients (Left 2) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('clients')}
        activeOpacity={0.7}
      >
        <Users
          size={22}
          color={isClients ? '#2563EB' : '#94A3B8'}
          strokeWidth={isClients ? 2.5 : 1.8}
        />
        <Text style={[styles.tabLabel, isClients && styles.activeTabLabel]}>
          Clients
        </Text>
      </TouchableOpacity>

      {/* 3. Center Elevated Home Button (Accueil) */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={[styles.centerButton, isHome && styles.centerButtonActive]}
          onPress={() => onTabChange('home')}
          activeOpacity={0.85}
          accessibilityLabel="Accueil"
          accessibilityRole="button"
        >
          <Home size={26} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={[styles.centerLabel, isHome && styles.activeCenterLabel]}>
          Accueil
        </Text>
      </View>

      {/* 4. Localisation (Right 1) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('locations')}
        activeOpacity={0.7}
      >
        <MapPin
          size={22}
          color={isLocations ? '#2563EB' : '#94A3B8'}
          strokeWidth={isLocations ? 2.5 : 1.8}
        />
        <Text style={[styles.tabLabel, isLocations && styles.activeTabLabel]}>
          Location
        </Text>
      </TouchableOpacity>

      {/* 5. Paramètres (Right 2) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('settings')}
        activeOpacity={0.7}
      >
        <Settings
          size={22}
          color={isSettings ? '#2563EB' : '#94A3B8'}
          strokeWidth={isSettings ? 2.5 : 1.8}
        />
        <Text style={[styles.tabLabel, isSettings && styles.activeTabLabel]}>
          Paramètres
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 4,
    letterSpacing: -0.2,
  },
  activeTabLabel: {
    color: '#2563EB',
    fontWeight: '700',
  },
  centerButtonWrapper: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  centerButtonActive: {
    backgroundColor: '#0B3E96',
    transform: [{ scale: 1.05 }],
    borderColor: '#EFF6FF',
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  activeCenterLabel: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
});
