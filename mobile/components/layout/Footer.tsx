import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Package, MapPin, Home, Users, Settings } from 'lucide-react-native';

export type TabType = 'colis' | 'locations' | 'home' | 'clients' | 'settings' | 'more';

export interface FooterProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddPress?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.footerContainer} className="bg-white border-t border-slate-100 flex-row items-center justify-around py-2 px-1">
      {/* 1. First: Colis */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('colis')}
        activeOpacity={0.7}
      >
        <Package
          size={22}
          color={activeTab === 'colis' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'colis' ? 2.4 : 1.8}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'colis' && styles.activeTabLabel,
          ]}
        >
          Colis
        </Text>
      </TouchableOpacity>

      {/* 2. Second: Locations */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('locations')}
        activeOpacity={0.7}
      >
        <MapPin
          size={22}
          color={activeTab === 'locations' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'locations' ? 2.4 : 1.8}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'locations' && styles.activeTabLabel,
          ]}
        >
          Locations
        </Text>
      </TouchableOpacity>

      {/* 3. Third (Center Elevated Button): Home */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={[
            styles.centerButton,
            activeTab === 'home' && styles.activeCenterButton,
          ]}
          onPress={() => onTabChange('home')}
          activeOpacity={0.85}
          accessibilityLabel="Accueil"
          accessibilityRole="button"
        >
          <Home size={24} color="#FFFFFF" strokeWidth={activeTab === 'home' ? 2.8 : 2.2} />
        </TouchableOpacity>
      </View>

      {/* 4. Fourth: Clients */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('clients')}
        activeOpacity={0.7}
      >
        <Users
          size={22}
          color={activeTab === 'clients' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'clients' ? 2.4 : 1.8}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'clients' && styles.activeTabLabel,
          ]}
        >
          Clients
        </Text>
      </TouchableOpacity>

      {/* 5. Fifth: Settings */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('settings')}
        activeOpacity={0.7}
      >
        <Settings
          size={22}
          color={activeTab === 'settings' || activeTab === 'more' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'settings' || activeTab === 'more' ? 2.4 : 1.8}
        />
        <Text
          style={[
            styles.tabLabel,
            (activeTab === 'settings' || activeTab === 'more') && styles.activeTabLabel,
          ]}
        >
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
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
    color: '#94a3b8',
    marginTop: 3,
  },
  activeTabLabel: {
    color: '#2563eb',
    fontWeight: '700',
  },
  centerButtonWrapper: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  activeCenterButton: {
    backgroundColor: '#2563eb',
    borderWidth: 2.5,
    borderColor: '#dbeafe',
    shadowColor: '#2563eb',
    shadowOpacity: 0.55,
    shadowRadius: 8,
  },
});
