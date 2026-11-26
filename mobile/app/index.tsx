
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from './home/home';
import ColisPage from './colis/colis_page';
import ClientsPage, { Client } from './client/clientPage';
import LocationsPage from './locations/locations_page';
import DocsPage from './docs/docs_page';
import SettingsPage from './settings_page';

import Header from '../components/layout/Header';
import Footer, { TabType } from '../components/layout/Footer';
import SplashScreen from './auth/splash';
import LoginScreen from './auth/login';

import { INITIAL_COLIS } from '../services/mockData';
import type { Colis } from '../types/colis.types';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from '../services/clientService';

type AppFlowState = 'splash' | 'login' | 'app';
export type AppRoute = TabType;

export default function AppScreen() {
  const [flowState, setFlowState] = useState<AppFlowState>('splash');
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [direction, setDirection] = useState<'MA_TO_FR' | 'FR_TO_MA'>('MA_TO_FR');

  const [colisList, setColisList] = useState<Colis[]>(INITIAL_COLIS);
  const [clientsList, setClientsList] = useState<Client[]>([]);

  // Load clients from MongoDB when the app starts.
  useEffect(() => {
    let isMounted = true;

    const loadClients = async () => {
      try {
        const clients = await getClients();

        if (isMounted) {
          setClientsList(clients);
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Impossible de récupérer les clients.';

        if (isMounted) {
          Alert.alert('Erreur de connexion', message);
        }
      }
    };

    loadClients();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'MA_TO_FR' ? 'FR_TO_MA' : 'MA_TO_FR'));
  };

  // ---------------- CLIENTS: MongoDB API ----------------

  const handleAddClient = async (newClient: Client): Promise<boolean> => {
    try {
      // The server generates the real MongoDB ID.
      const savedClient = await createClient({
        name: newClient.name,
        phone: newClient.phone,
        city: newClient.city,
      });

      setClientsList((prev) => [savedClient, ...prev]);
      Alert.alert('Succès', 'Le client a été enregistré avec succès.');

      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Impossible d’enregistrer le client.';

      Alert.alert('Erreur', message);
      return false;
    }
  };

  const handleUpdateClient = async (
    updatedClient: Client
  ): Promise<boolean> => {
    try {
      const savedClient = await updateClient(updatedClient.id, {
        name: updatedClient.name,
        phone: updatedClient.phone,
        city: updatedClient.city,
      });

      setClientsList((prev) =>
        prev.map((client) =>
          client.id === savedClient.id ? savedClient : client
        )
      );

      Alert.alert('Succès', 'Les informations du client ont été modifiées.');
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Impossible de modifier le client.';

      Alert.alert('Erreur', message);
      return false;
    }
  };

  const handleDeleteClient = async (
    clientId: string
  ): Promise<boolean> => {
    try {
      await deleteClient(clientId);

      setClientsList((prev) =>
        prev.filter((client) => client.id !== clientId)
      );

      Alert.alert('Succès', 'Le client a été supprimé.');
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Impossible de supprimer le client.';

      Alert.alert('Erreur', message);
      return false;
    }
  };

  // ---------------- AUTHENTICATION ----------------

  if (flowState === 'splash') {
    return <SplashScreen onFinish={() => setFlowState('login')} />;
  }

  if (flowState === 'login') {
    return <LoginScreen onLoginSuccess={() => setFlowState('app')} />;
  }

  // ---------------- ROUTES ----------------

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'colis':
        return (
          <ColisPage
            direction={direction}
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
              // This only clears local Colis data.
              // It does not delete MongoDB clients.
              setColisList([]);
            }}
            onRestoreDefaultData={() => {
              // Restore Colis mock data only.
              // MongoDB clients remain unchanged.
              setColisList(INITIAL_COLIS);
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

      <StatusBar barStyle="light-content" />

      {currentRoute !== 'home' && currentRoute !== 'docs' && (
        <Header
          direction={direction}
          onLocationPress={() => setCurrentRoute('locations')}
          onDocsPress={() => setCurrentRoute('docs')}
        />
      )}

      <View style={styles.content}>
        {renderCurrentRoute()}
      </View>

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
