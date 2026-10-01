import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import ColisPage, { Colis } from './colis/colis_page';
import ClientsPage, { Client } from './client/clients_page';
import SettingsPage from './settings_page';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 260;

// Seed Mock Data
const initialClients: Client[] = [
  {
    id: 'CL-101',
    name: 'Youssef El Amrani',
    phone: '+212 6 6123 4567',
    email: 'youssef.elamrani@gmail.com',
       contry:'france',

    city: 'Casablanca',
    address: '24 Rue de Goulmima, Bourgone, Casablanca',
    totalShipments: 4,
  },
  {
    id: 'CL-102',
    name: 'Marie Dupont',
    phone: '+33 6 7890 1234',
    email: 'marie.dupont@yahoo.fr',
    contry:'france',
    city: 'Paris',
    address: '142 Rue de Rivoli, 75001 Paris',
    totalShipments: 3,
  },
  {
    id: 'CL-103',
    name: 'Karim Bensalah',
    phone: '+212 6 9876 5432',
    email: 'k.bensalah@outlook.com',
    contry:'morocco',

    city: 'Marrakech',
    address: '45 Avenue Mohammed VI, Marrakech',
    totalShipments: 2,
  },
  {
    id: 'CL-104',
    name: 'Jean-Pierre Martin',
    phone: '+33 6 1234 5678',
    email: 'jp.martin@gmail.com',
    contry:'morocco',

    city: 'Lyon',
    address: '12 Quai Saint-Antoine, 69002 Lyon',
    totalShipments: 5,
  },
];

const initialColis: Colis[] = [
  {
    id: 'CX-8021',
    senderName: 'Marie Dupont',
    senderPhone: '+33 6 7890 1234',
    receiverName: 'Youssef El Amrani',
    receiverPhone: '+212 6 6123 4567',
    fromCity: 'Paris',
    toCity: 'Casablanca',
        quantity:3,
    weight: 12.5,
    price: 35,
    status: 'in_transit',
    date: '06/08/2026',
    description: 'Clothing items, documents, and sweets.',
  },
  {
    id: 'CX-3940',
    senderName: 'Jean-Pierre Martin',
    senderPhone: '+33 6 1234 5678',
    receiverName: 'Karim Bensalah',
    receiverPhone: '+212 6 9876 5432',
    fromCity: 'Lyon',
    toCity: 'Marrakech',
        quantity:1,
    weight: 8.2,
    price: 24,
    status: 'pending',
    date: '07/08/2026',
    description: 'Electronics parts and books.',
  },
  {
    id: 'CX-1032',
    senderName: 'Marie Dupont',
    senderPhone: '+33 6 7890 1234',
    receiverName: 'Karim Bensalah',
    receiverPhone: '+212 6 9876 5432',
    fromCity: 'Marseille',
    toCity: 'Tangier',
    quantity:2,
    weight: 22.0,
    price: 65,
    status: 'delivered',
    date: '01/08/2026',
    description: 'Household tools and coffee machine.',
  },
  // Reverse directions
  {
    id: 'CX-4950',
    senderName: 'Youssef El Amrani',
    senderPhone: '+212 6 6123 4567',
    receiverName: 'Marie Dupont',
    receiverPhone: '+33 6 7890 1234',
    fromCity: 'Casablanca',
    toCity: 'Paris',
    weight: 5.5,
    price: 20,
    status: 'in_transit',
    date: '05/08/2026',
    description: 'Moroccan argan oil and spices.',
  },
  {
    id: 'CX-7731',
    senderName: 'Karim Bensalah',
    senderPhone: '+212 6 9876 5432',
    receiverName: 'Jean-Pierre Martin',
    receiverPhone: '+33 6 1234 5678',
    fromCity: 'Marrakech',
    toCity: 'Lyon',
    quantity:2,

    weight: 15.0,
    price: 45,
    status: 'delivered',
    date: '28/07/2026',
    description: 'Handcrafted leather bags and slippers.',
  },
];

export default function AppScreen() {
  const [currentScreen, setCurrentScreen] = useState<'direction_selection' | 'dashboard'>('direction_selection');
  const [direction, setDirection] = useState<'FR_TO_MA' | 'MA_TO_FR'>('FR_TO_MA');
  const [activeTab, setActiveTab] = useState<'colis' | 'clients' | 'settings'>('colis');
  const [colisList, setColisList] = useState<Colis[]>(initialColis);
  const [clientsList, setClientsList] = useState<Client[]>(initialClients);
  
  // Animated sidebar setup
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    if (sidebarOpen) {
      // Close Sidebar
      Animated.parallel([
        Animated.timing(sidebarAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setSidebarOpen(false));
    } else {
      // Open Sidebar
      setSidebarOpen(true);
      Animated.parallel([
        Animated.timing(sidebarAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSelectDirection = (selectedDir: 'FR_TO_MA' | 'MA_TO_FR') => {
    setDirection(selectedDir);
    setCurrentScreen('dashboard');
    setActiveTab('colis');
  };

  const handleAddColis = (newColis: Colis) => {
    setColisList([newColis, ...colisList]);
    
    // Increment total shipments for sender/receiver if they exist in client list
    setClientsList(prevClients => 
      prevClients.map(client => {
        if (client.phone === newColis.senderPhone || client.phone === newColis.receiverPhone) {
          return { ...client, totalShipments: client.totalShipments + 1 };
        }
        return client;
      })
    );
  };

  const handleAddClient = (newClient: Client) => {
    setClientsList([newClient, ...clientsList]);
  };

  const getFilteredColisByDirection = () => {
    // Filter colis that correspond to route
    return colisList.filter(item => {
      if (direction === 'FR_TO_MA') {
        // France to Morocco (from French cities to Moroccan cities)
        const frenchCities = ['paris', 'lyon', 'marseille', 'nice', 'toulouse'];
        return frenchCities.includes(item.fromCity.toLowerCase()) || 
               // Default backup in case user adds custom cities
               item.id.startsWith('CX-8') || item.id.startsWith('CX-3') || item.id.startsWith('CX-1');
      } else {
        // Morocco to France
        const moroccanCities = ['casablanca', 'marrakech', 'tangier', 'rabat', 'agadir'];
        return moroccanCities.includes(item.fromCity.toLowerCase()) || 
               item.id.startsWith('CX-4') || item.id.startsWith('CX-7');
      }
    });
  };

  const renderActiveScreen = () => {
    const routeColis = getFilteredColisByDirection();
    switch (activeTab) {
      case 'colis':
        return (
          <ColisPage
            direction={direction}
            colisList={routeColis}
            onAddColis={handleAddColis}
          />
        );
      case 'clients':
        return (
          <ClientsPage
            clientsList={clientsList}
            colisList={colisList}
            onAddClient={handleAddClient}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            direction={direction}
            onChangeDirection={setDirection}
            onResetDirection={() => setCurrentScreen('direction_selection')}
          />
        );
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'colis':
        return 'Colis Express';
      case 'clients':
        return 'Clients Directory';
      case 'settings':
        return 'App Settings';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {currentScreen === 'direction_selection' ? (
        // --- Direction Selection Page ---
        <View style={styles.selectionContainer}>
          <View style={styles.selectHeader}>
            <Text style={styles.logoBadge}>✈️ CASMOH EXPRESS</Text>
            <Text style={styles.selectTitle}>ColisExpress</Text>
            <Text style={styles.selectSubtitle}>Select your transit direction to get started</Text>
          </View>

          <View style={styles.optionCards}>
            <TouchableOpacity 
              style={[styles.directionCard, styles.frToMaColor]}
              onPress={() => handleSelectDirection('FR_TO_MA')}
              activeOpacity={0.95}
            >
              <View style={styles.cardFlags}>
                <Text style={styles.flagIcon}>🇫🇷</Text>
                <Text style={styles.arrowIcon}>➔</Text>
                <Text style={styles.flagIcon}>🇲🇦</Text>
              </View>
              <Text style={styles.cardTitle}>France to Morocco</Text>
              <Text style={styles.cardDesc}>Manage parcels outbound from France reaching Moroccan destinations.</Text>
              <View style={styles.statTag}>
                <Text style={styles.statText}>
                  {colisList.filter(c => ['paris', 'lyon', 'marseille'].includes(c.fromCity.toLowerCase())).length} Active shipments
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.directionCard, styles.maToFrColor]}
              onPress={() => handleSelectDirection('MA_TO_FR')}
              activeOpacity={0.95}
            >
              <View style={styles.cardFlags}>
                <Text style={styles.flagIcon}>🇲🇦</Text>
                <Text style={styles.arrowIcon}>➔</Text>
                <Text style={styles.flagIcon}>🇫🇷</Text>
              </View>
              <Text style={styles.cardTitle}>Morocco to France</Text>
              <Text style={styles.cardDesc}>Track shipments coming from Moroccan agencies to French distribution centers.</Text>
              <View style={styles.statTag}>
                <Text style={styles.statText}>
                  {colisList.filter(c => ['casablanca', 'marrakech', 'tangier'].includes(c.fromCity.toLowerCase())).length} Active shipments
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.selectFooter}>
            <Text style={styles.footerNote}>Casmoh Shipment Management System v1.0</Text>
          </View>
        </View>
      ) : (
        // --- Dashboard Layout with Animated Sidebar ---
        <View style={styles.dashboardContainer}>
          {/* Main Top Header Bar */}
          <View style={styles.mainHeaderBar}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
              <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{getPageTitle()}</Text>
            <View style={styles.miniRouteBadge}>
              <Text style={styles.miniRouteText}>
                {direction === 'FR_TO_MA' ? '🇫🇷➔🇲🇦' : '🇲🇦➔🇫🇷'}
              </Text>
            </View>
          </View>

          {/* Core Content Area */}
          <View style={styles.contentArea}>
            {renderActiveScreen()}
          </View>

          {/* Sidebar Drawer Overlay */}
          {sidebarOpen && (
            <TouchableOpacity 
              style={styles.drawerOverlay} 
              activeOpacity={1} 
              onPress={toggleSidebar}
            >
              <Animated.View style={[styles.overlayBg, { opacity: overlayOpacity }]} />
            </TouchableOpacity>
          )}

          {/* Animated Sidebar Panel */}
          <Animated.View 
            style={[
              styles.sidebarPanel, 
              { transform: [{ translateX: sidebarAnim }] }
            ]}
          >
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarBrand}>📦 CASMOH</Text>
              <Text style={styles.sidebarRouteSub}>
                {direction === 'FR_TO_MA' ? 'France to Morocco' : 'Morocco to France'}
              </Text>
            </View>

            <View style={styles.sidebarNav}>
              <TouchableOpacity 
                style={[styles.navItem, activeTab === 'colis' && styles.activeNavItem]}
                onPress={() => {
                  setActiveTab('colis');
                  toggleSidebar();
                }}
              >
                <Text style={styles.navIcon}>📦</Text>
                <Text style={[styles.navText, activeTab === 'colis' && styles.activeNavText]}>Colis (Parcels)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.navItem, activeTab === 'clients' && styles.activeNavItem]}
                onPress={() => {
                  setActiveTab('clients');
                  toggleSidebar();
                }}
              >
                <Text style={styles.navIcon}>👥</Text>
                <Text style={[styles.navText, activeTab === 'clients' && styles.activeNavText]}>Clients (Contacts)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.navItem, activeTab === 'settings' && styles.activeNavItem]}
                onPress={() => {
                  setActiveTab('settings');
                  toggleSidebar();
                }}
              >
                <Text style={styles.navIcon}>⚙️</Text>
                <Text style={[styles.navText, activeTab === 'settings' && styles.activeNavText]}>Settings</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sidebarFooter}>
              <View style={styles.adminCard}>
                <View style={styles.adminAvatar}>
                  <Text style={styles.adminAvatarText}>AD</Text>
                </View>
                <View style={styles.adminInfo}>
                  <Text style={styles.adminName}>Casmoh Admin</Text>
                  <Text style={styles.adminRole}>Operator</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.changeRouteBtn}
                onPress={() => {
                  setCurrentScreen('direction_selection');
                  toggleSidebar();
                }}
              >
                <Text style={styles.changeRouteText}>🔄 Switch Route</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  // Selection Screen
  selectionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
    backgroundColor: '#0f172a',
  },
  selectHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    color: '#38bdf8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  selectTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8fafc',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  selectSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  optionCards: {
    marginVertical: 20,
  },
  directionCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  frToMaColor: {
    backgroundColor: '#1e293b',
  },
  maToFrColor: {
    backgroundColor: '#1e293b',
  },
  cardFlags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  flagIcon: {
    fontSize: 30,
  },
  arrowIcon: {
    fontSize: 18,
    color: '#38bdf8',
    marginHorizontal: 12,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  cardDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 18,
  },
  statTag: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  statText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
  },
  selectFooter: {
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 11,
    color: '#475569',
  },

  // Dashboard Structure
  dashboardContainer: {
    flex: 1,
    position: 'relative',
  },
  mainHeaderBar: {
    height: 56,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  menuButtonText: {
    fontSize: 22,
    color: '#f8fafc',
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    flex: 1,
    textAlign: 'left',
  },
  miniRouteBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  miniRouteText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
  },
  contentArea: {
    flex: 1,
  },

  // Sidebar Drawer
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  overlayBg: {
    flex: 1,
    backgroundColor: '#000',
  },
  sidebarPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#1e293b',
    zIndex: 20,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 20,
    marginTop: 20,
  },
  sidebarBrand: {
    fontSize: 20,
    fontWeight: '900',
    color: '#f8fafc',
  },
  sidebarRouteSub: {
    fontSize: 12,
    color: '#38bdf8',
    marginTop: 4,
    fontWeight: '600',
  },
  sidebarNav: {
    flex: 1,
    marginTop: 30,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  activeNavItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  navIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  navText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  activeNavText: {
    color: '#f8fafc',
    fontWeight: '800',
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 20,
    marginBottom: 20,
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  adminAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  adminInfo: {
    marginLeft: 10,
  },
  adminName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  adminRole: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  changeRouteBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  changeRouteText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
});
