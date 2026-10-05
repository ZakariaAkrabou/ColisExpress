import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './home/home';
import ColisPage, { Colis } from './colis/colis_page';
import ClientsPage, { Client } from './client/clientPage';
import SettingsPage from './settings_page';
import Footer, { TabType } from '../components/layout/Footer';
import { INITIAL_COLIS, INITIAL_CLIENTS } from '../services/mockData';

export default function AppScreen() {
  const [currentRoute, setCurrentRoute] = useState<TabType>('home');
  const [direction, setDirection] = useState<'MA_TO_FR' | 'FR_TO_MA'>('MA_TO_FR');
  const [colisList, setColisList] = useState<Colis[]>(INITIAL_COLIS);
  const [clientsList, setClientsList] = useState<Client[]>(INITIAL_CLIENTS);

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'MA_TO_FR' ? 'FR_TO_MA' : 'MA_TO_FR'));
  };

  const handleAddColis = (newColis: Colis) => {
    setColisList([newColis, ...colisList]);
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

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <HomeScreen
            direction={direction}
            onToggleDirection={toggleDirection}
            onNavigateTab={(tab) => {
              if (tab === 'colis') setCurrentRoute('colis');
              else if (tab === 'clients') setCurrentRoute('clients');
              else if (tab === 'settings') setCurrentRoute('more');
            }}
          />
        );
      case 'colis':
        return (
          <ColisPage
            direction={direction}
            colisList={colisList}
            onAddColis={handleAddColis}
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
      case 'more':
        return (
          <SettingsPage
            direction={direction}
            onChangeDirection={setDirection}
            onResetDirection={() => setCurrentRoute('home')}
          />
        );
      default:
        return <HomeScreen direction={direction} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-blue-700">
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />
      
      {/* Route Content View */}
      <View style={styles.content} className="flex-1 bg-slate-50">
        {renderCurrentRoute()}
      </View>

      {/* Bottom Navigation */}
      <Footer
        activeTab={currentRoute}
        onTabChange={(tab) => setCurrentRoute(tab)}
        onAddPress={() => setCurrentRoute('colis')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d4ed8',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
