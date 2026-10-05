import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {
  Search,
  Plus,
  Package,
  ScanLine,
  X,
  Users,
} from 'lucide-react-native';
import { Colis } from '../colis/colis_page';
import ClientDetailModal from './clientDetail';
import CreateClientScreen from './createClient';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  addressMorocco?: string;
  addressFrance?: string;
  totalShipments: number;
  createdAt?: string;
}

export interface ClientsPageProps {
  clientsList: Client[];
  colisList?: Colis[];
  onAddClient?: (client: Client) => void;
  onUpdateClient?: (updatedClient: Client) => void;
  onDeleteClient?: (clientId: string) => void;
  onOpenCreateClient?: () => void;
  onClientPress?: (client: Client) => void;
}

export default function ClientsPage({
  clientsList,
  colisList = [],
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onOpenCreateClient,
  onClientPress,
}: ClientsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  const filteredClients = clientsList.filter((client) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      client.name.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      (client.email && client.email.toLowerCase().includes(term)) ||
      (client.city && client.city.toLowerCase().includes(term))
    );
  });

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    if (onClientPress) {
      onClientPress(client);
    }
  };

  const handleOpenCreate = () => {
    if (onOpenCreateClient) {
      onOpenCreateClient();
    } else {
      setIsCreatingClient(true);
    }
  };

  const handleUpdate = (updatedClient: Client) => {
    setSelectedClient(updatedClient);
    onUpdateClient?.(updatedClient);
  };

  const handleDelete = (clientId: string) => {
    setSelectedClient(null);
    onDeleteClient?.(clientId);
  };

  if (isCreatingClient) {
    return (
      <CreateClientScreen
        onBack={() => setIsCreatingClient(false)}
        onClientCreated={(newClient) => {
          onAddClient?.(newClient);
          setIsCreatingClient(false);
        }}
        existingClients={clientsList}
      />
    );
  }

  return (
    <View style={styles.container} className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.headerContainer} className="px-5 pt-4 pb-2">
        <Text style={styles.pageTitle} className="text-slate-900 text-2xl font-bold tracking-tight">
          Clients
        </Text>
      </View>

      <View style={styles.searchBarWrapper} className="px-4 mb-3">
        <View style={styles.searchBar} className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-sm">
          <Search size={20} color="#94a3b8" strokeWidth={2.2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un client..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-slate-800 text-sm ml-3 py-0 font-normal"
          />
          {search.length > 0 ? (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7} className="mr-2">
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity activeOpacity={0.7} style={styles.scanButton}>
            <ScanLine size={20} color="#2563eb" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionButtonWrapper} className="px-4 mb-3">
        <TouchableOpacity
          style={styles.newClientButton}
          onPress={handleOpenCreate}
          activeOpacity={0.88}
          className="w-full bg-blue-600 rounded-2xl py-3.5 flex-row items-center justify-center shadow-md shadow-blue-500/25"
        >
          <Plus size={19} color="#FFFFFF" strokeWidth={2.8} />
          <Text style={styles.newClientButtonText} className="text-white font-bold text-base ml-2">
            Nouveau client
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        className="flex-1"
      >
        {filteredClients.length === 0 ? (
          <View style={styles.emptyState} className="py-16 items-center justify-center px-6">
            <View style={styles.emptyIconCircle} className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
              <Users size={28} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle} className="text-slate-800 font-bold text-base">
              Aucun client trouvé
            </Text>
            <Text style={styles.emptySubtitle} className="text-slate-400 text-xs text-center mt-1">
              Aucun résultat ne correspond à "{search}"
            </Text>
          </View>
        ) : (
          filteredClients.map((client) => (
            <TouchableOpacity
              key={client.id}
              style={styles.clientCard}
              onPress={() => handleSelectClient(client)}
              activeOpacity={0.75}
              className="bg-white rounded-2xl p-4 mx-4 mb-2.5 border border-slate-100 flex-row items-center justify-between shadow-xs"
            >
              <View style={styles.avatarBadge} className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3.5">
                <Package size={22} color="#2563eb" strokeWidth={2.2} />
              </View>

              <View style={styles.clientInfo} className="flex-1 mr-2">
                <Text style={styles.clientName} className="text-slate-900 font-bold text-[15px]" numberOfLines={1}>
                  {client.name}
                </Text>
                {client.email ? (
                  <Text style={styles.clientEmail} className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                    {client.email}
                  </Text>
                ) : null}
                <Text style={styles.clientPhone} className="text-slate-600 text-xs font-medium mt-1" numberOfLines={1}>
                  {client.phone}
                </Text>
              </View>

              <View style={styles.colisCountContainer}>
                <Text style={styles.colisCountText} className="text-slate-600 text-xs font-medium">
                  {client.totalShipments} colis
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <ClientDetailModal
        client={selectedClient}
        visible={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        colisList={colisList}
        onUpdateClient={handleUpdate}
        onDeleteClient={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 10,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 0,
  },
  scanButton: {
    padding: 2,
  },
  actionButtonWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  newClientButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  newClientButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  clientInfo: {
    flex: 1,
    marginRight: 8,
  },
  clientName: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  clientEmail: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  clientPhone: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  colisCountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colisCountText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#1e293b',
    fontSize: 15,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
