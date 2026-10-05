import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, Package, Plus, Users, MoreHorizontal } from 'lucide-react-native';

export type TabType = 'home' | 'colis' | 'clients' | 'more';

export interface FooterProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddPress: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  onTabChange,
  onAddPress,
}) => {
  return (
    <View style={styles.footerContainer} className="bg-white border-t border-slate-100 flex-row items-center justify-around py-2 px-1">
      {/* Tab 1: Accueil */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('home')}
        activeOpacity={0.7}
      >
        <Home
          size={22}
          color={activeTab === 'home' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'home' ? 2.4 : 1.8}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'home' && styles.activeTabLabel,
          ]}
        >
          Accueil
        </Text>
      </TouchableOpacity>

      {/* Tab 2: Colis */}
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

      {/* Tab 3: Elevated Center Plus Button */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={onAddPress}
          activeOpacity={0.85}
          accessibilityLabel="Ajouter un colis"
          accessibilityRole="button"
        >
          <Plus size={24} color="#FFFFFF" strokeWidth={2.8} />
        </TouchableOpacity>
      </View>

      {/* Tab 4: Clients */}
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

      {/* Tab 5: Plus (More) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('more')}
        activeOpacity={0.7}
      >
        <MoreHorizontal
          size={22}
          color={activeTab === 'more' ? '#2563eb' : '#94a3b8'}
          strokeWidth={activeTab === 'more' ? 2.4 : 1.8}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'more' && styles.activeTabLabel,
          ]}
        >
          Plus
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
});
