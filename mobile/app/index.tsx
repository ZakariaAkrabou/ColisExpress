import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './home/home';
import ColisPage, { Colis } from './colis/colis_page';
import ClientsPage, { Client } from './client/clientPage';
import LocationsPage from './locations/locations_page';
import DocsPage from './docs/docs_page';
import SettingsPage from './settings_page';
import Header from '../components/layout/Header';
import Footer, { TabType } from '../components/layout/Footer';
import SplashScreen from './auth/splash';
import LoginScreen from './auth/login';
import { INITIAL_COLIS, INITIAL_CLIENTS } from '../services/mockData';

type AppFlowState = 'splash' | 'login' | 'app';
export type AppRoute = TabType;

export default function AppScreen() {
  const [flowState, setFlowState] = useState<AppFlowState>('splash');
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [direction, setDirection] = useState<'MA_TO_FR' | 'FR_TO_MA'>('MA_TO_FR');
  const [colisList, setColisList] = useState<Colis[]>(INITIAL_COLIS);
  const [clientsList, setClientsList] = useState<Client[]>(INITIAL_CLIENTS);

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'MA_TO_FR' ? 'FR_TO_MA' : 'MA_TO_FR'));
  };

  const handleAddColis = (newColis: Colis) => {
    setColisList([newColis, ...colisList]);
  };

  const handleUpdateColis = (updatedColis: Colis) => {
    setColisList((prev) =>
      prev.map((c) => (c.id === updatedColis.id ? updatedColis : c))
    );
  };

  const handleAddClient = (newClient: Client) => {
    setClientsList([newClient, ...clientsList]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClientsList((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
  };

  const handleDeleteClient = (clientId: string) => {
    setClientsList((prev) => prev.filter((c) => c.id !== clientId));
  };

  // 1. Initial Loading Splash Screen
  if (flowState === 'splash') {
    return <SplashScreen onFinish={() => setFlowState('login')} />;
  }

  // 2. Authentication Login Screen
  if (flowState === 'login') {
    return <LoginScreen onLoginSuccess={() => setFlowState('app')} />;
  }

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'colis':
        return (
          <ColisPage
            direction={direction}
            colisList={colisList}
            onAddColis={handleAddColis}
            onUpdateColis={handleUpdateColis}
            onNavigateToDocs={() => setCurrentRoute('docs')}
          />
        );
      case 'docs':
        return (
          <DocsPage
            colisList={colisList}
            direction={direction}
            onNavigateToColis={() => setCurrentRoute('colis')}
          />
        );
      case 'locations':
        return <LocationsPage />;
      case 'home':
        return (
          <HomeScreen
            userName="Zakaria"
            direction={direction}
            onSelectDirection={(selectedDir) => {
              setDirection(selectedDir);
              setCurrentRoute('colis');
            }}
            onToggleDirection={toggleDirection}
            onLocationPress={() => setCurrentRoute('locations')}
            onNavigateTab={(tab) => {
              if (tab === 'invoices' || tab === 'docs') {
                setCurrentRoute('docs');
              } else {
                setCurrentRoute(tab);
              }
            }}
          />
        );
      case 'clients':
        return (
          <ClientsPage
            clientsList={clientsList}
            colisList={colisList}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
          />
        );
      case 'settings':
      case 'more':
        return (
          <SettingsPage
            direction={direction}
            onChangeDirection={setDirection}
            onResetDirection={() => setCurrentRoute('home')}
            colisList={colisList}
            clientsList={clientsList}
            onUpdateColisList={setColisList}
            onClearAllData={() => {
              setColisList([]);
              setClientsList([]);
            }}
            onRestoreDefaultData={() => {
              setColisList(INITIAL_COLIS);
              setClientsList(INITIAL_CLIENTS);
            }}
            onLogout={() => setFlowState('login')}
          />
        );
      default:
        return (
          <HomeScreen
            userName="Zakaria"
            direction={direction}
            onSelectDirection={(selectedDir) => {
              setDirection(selectedDir);
              setCurrentRoute('colis');
            }}
            onToggleDirection={toggleDirection}
            onLocationPress={() => setCurrentRoute('locations')}
            onNavigateTab={(tab) => {
              if (tab === 'invoices' || tab === 'docs') {
                setCurrentRoute('docs');
              } else {
                setCurrentRoute(tab);
              }
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3E96" />
      
      {/* Top Application Header */}
      {currentRoute !== 'home' && currentRoute !== 'docs' && (
        <Header
          direction={direction}
          onLocationPress={() => setCurrentRoute('locations')}
          onDocsPress={() => setCurrentRoute('docs')}
        />
      )}

      {/* Route Content View */}
      <View style={styles.content}>
        {renderCurrentRoute()}
      </View>

      {/* Bottom Navigation */}
      <Footer
        activeTab={currentRoute}
        onTabChange={(tab) => setCurrentRoute(tab)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B3E96',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});