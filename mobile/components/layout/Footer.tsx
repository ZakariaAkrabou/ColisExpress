import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Package, MapPin, Home, Users, Settings, FileText } from 'lucide-react-native';

export type TabType = 'colis' | 'docs' | 'locations' | 'home' | 'clients' | 'settings' | 'more';

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
    <View style={styles.footerContainer} className="bg-white border-t border-slate-100 flex-row items-center justify-between py-1.5 px-1">
      {/* 1. Colis */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('colis')}
        activeOpacity={0.7}
      >
        <Package
          size={19}
          color={activeTab === 'colis' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'colis' ? 2.4 : 1.8}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            activeTab === 'colis' && styles.activeTabLabel,
          ]}
        >
          Colis
        </Text>
      </TouchableOpacity>

      {/* 2. Docs */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('docs')}
        activeOpacity={0.7}
      >
        <FileText
          size={19}
          color={activeTab === 'docs' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'docs' ? 2.4 : 1.8}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            activeTab === 'docs' && styles.activeTabLabel,
          ]}
        >
          Docs
        </Text>
      </TouchableOpacity>

      {/* 3. Home / Accueil */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('home')}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.homeBadge,
            activeTab === 'home' && styles.homeBadgeActive,
          ]}
        >
          <Home
            size={18}
            color={activeTab === 'home' ? '#FFFFFF' : '#1d4ed8'}
            strokeWidth={activeTab === 'home' ? 2.6 : 2.0}
          />
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            activeTab === 'home' && styles.activeTabLabel,
          ]}
        >
          Accueil
        </Text>
      </TouchableOpacity>

      {/* 4. Clients */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('clients')}
        activeOpacity={0.7}
      >
        <Users
          size={19}
          color={activeTab === 'clients' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'clients' ? 2.4 : 1.8}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            activeTab === 'clients' && styles.activeTabLabel,
          ]}
        >
          Clients
        </Text>
      </TouchableOpacity>

      {/* 5. Locations */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('locations')}
        activeOpacity={0.7}
      >
        <MapPin
          size={19}
          color={activeTab === 'locations' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'locations' ? 2.4 : 1.8}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            activeTab === 'locations' && styles.activeTabLabel,
          ]}
        >
          Locations
        </Text>
      </TouchableOpacity>

      {/* 6. Settings / Paramètres */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('settings')}
        activeOpacity={0.7}
      >
        <Settings
          size={19}
          color={activeTab === 'settings' || activeTab === 'more' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'settings' || activeTab === 'more' ? 2.4 : 1.8}
        />
        <Text
          numberOfLines={1}
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
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
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
    paddingVertical: 2,
    minWidth: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#2563eb',
    fontWeight: '700',
  },
  homeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBadgeActive: {
    backgroundColor: '#1d4ed8',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
});
