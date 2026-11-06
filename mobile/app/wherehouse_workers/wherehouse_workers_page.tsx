import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import {
  Search,
  Plus,
  ArrowLeft,
  X,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  HardHat,
  Edit3,
  Trash2,
  Users,
  ShieldCheck,
  Globe,
  MessageCircle,
} from 'lucide-react-native';
import { WarehouseWorker, WarehouseWorkersPageProps, WorkerModalMode } from './types';
import { INITIAL_WAREHOUSE_WORKERS } from './mockWorkers';
import { AddEditWorkerModal } from './add_edit_worker_modal';
import { WarehouseWorkerDetailModal } from './wherehouse_worker_detail';
import {
  WhatsAppIcon,
  contactWorkerViaWhatsApp,
  callWorkerDirectly,
} from './whatsappUtils';

export default function WherehouseWorkersPage({
  onBack,
  workersList: initialWorkersList,
  onUpdateWorkersList,
}: WarehouseWorkersPageProps) {
  // Local state if not managed from parent
  const [localWorkers, setLocalWorkers] = useState<WarehouseWorker[]>(
    initialWorkersList || INITIAL_WAREHOUSE_WORKERS
  );

  const workers = initialWorkersList !== undefined ? initialWorkersList : localWorkers;

  const updateWorkers = (newWorkers: WarehouseWorker[]) => {
    if (onUpdateWorkersList) {
      onUpdateWorkersList(newWorkers);
    } else {
      setLocalWorkers(newWorkers);
    }
  };

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<WorkerModalMode>('add');
  const [selectedWorker, setSelectedWorker] = useState<WarehouseWorker | null>(null);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailWorker, setDetailWorker] = useState<WarehouseWorker | null>(null);

  // Card password reveal state (workerId -> boolean)
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});

  const togglePasswordReveal = (workerId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [workerId]: !prev[workerId],
    }));
  };

  // Filtered workers based on search
  const filteredWorkers = workers.filter((w) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      w.fullName.toLowerCase().includes(term) ||
      w.phoneNumber.includes(term) ||
      w.email.toLowerCase().includes(term)
    );
  });

  // Handle Add New Worker
  const handleOpenAddModal = () => {
    setSelectedWorker(null);
    setModalMode('add');
    setModalVisible(true);
  };

  // Handle Edit Worker
  const handleOpenEditModal = (worker: WarehouseWorker) => {
    setSelectedWorker(worker);
    setModalMode('edit');
    setModalVisible(true);
  };

  // Handle Open Detail
  const handleOpenDetail = (worker: WarehouseWorker) => {
    setDetailWorker(worker);
    setDetailVisible(true);
  };

  // Save (Add or Update)
  const handleSaveWorker = (
    workerData: Omit<WarehouseWorker, 'id' | 'createdAt'>,
    workerId?: string
  ) => {
    if (modalMode === 'add') {
      const newWorker: WarehouseWorker = {
        ...workerData,
        id: `WW-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toLocaleDateString('fr-FR'),
      };
      const updated = [newWorker, ...workers];
      updateWorkers(updated);
      Alert.alert(
        'Ouvrier ajouté',
        `Le profil de ${newWorker.fullName} a été créé avec succès.`
      );
    } else if (workerId) {
      const updated = workers.map((w) =>
        w.id === workerId ? { ...w, ...workerData } : w
      );
      updateWorkers(updated);
      Alert.alert(
        'Ouvrier mis à jour',
        `Les informations de ${workerData.fullName} ont été enregistrées.`
      );
    }
  };

  // Delete Worker
  const handleDeleteWorker = (workerId: string) => {
    const workerToDelete = workers.find((w) => w.id === workerId);
    Alert.alert(
      "Supprimer l'ouvrier d'entrepôt",
      `Êtes-vous certain de vouloir supprimer définitivement ${workerToDelete?.fullName || 'cet ouvrier'} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const updated = workers.filter((w) => w.id !== workerId);
            updateWorkers(updated);
            Alert.alert(
              'Ouvrier supprimé',
              `${workerToDelete?.fullName || 'L’ouvrier'} a été retiré de la liste.`
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>
          ) : null}

          <View style={styles.headerTextGroup}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.headerTitle}>Ouvriers d'Entrepôt</Text>
              <View style={styles.badgeContainer}>
                <HardHat size={14} color="#93c5fd" />
                <Text style={styles.badgeText}>{workers.length}</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>
              Gestion des comptes, accès & contact WhatsApp
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={handleOpenAddModal}
            activeOpacity={0.85}
          >
            <Plus size={20} color="#1d4ed8" strokeWidth={2.6} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom, téléphone, email..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearch('')}
              style={styles.searchClearBtn}
            >
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Metric summary strip */}
        <View style={styles.metricsStrip}>
          <View style={styles.metricItem}>
            <View style={styles.metricHeaderRow}>
              <Users size={14} color="#2563eb" style={{ marginRight: 4 }} />
              <Text style={styles.metricVal}>{workers.length}</Text>
            </View>
            <Text style={styles.metricLabel}>Total Ouvriers</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <View style={styles.metricHeaderRow}>
              <ShieldCheck size={14} color="#16a34a" style={{ marginRight: 4 }} />
              <Text style={[styles.metricVal, { color: '#16a34a' }]}>
                {workers.filter((w) => !!w.password).length}
              </Text>
            </View>
            <Text style={styles.metricLabel}>Comptes Sécurisés</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <View style={styles.metricHeaderRow}>
              <MessageCircle size={14} color="#25D366" style={{ marginRight: 4 }} />
              <Text style={[styles.metricVal, { color: '#059669' }]}>
                {workers.filter((w) => !!w.phoneNumber).length}
              </Text>
            </View>
            <Text style={styles.metricLabel}>WhatsApp Direct</Text>
          </View>
        </View>

        {/* Add worker banner CTA */}
        <TouchableOpacity
          style={styles.addBannerBtn}
          onPress={handleOpenAddModal}
          activeOpacity={0.85}
        >
          <View style={styles.addBannerLeft}>
            <View style={styles.addBannerIconCircle}>
              <Plus size={20} color="#FFFFFF" strokeWidth={2.6} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.addBannerTitle}>Ajouter un ouvrier d'entrepôt</Text>
              <Text style={styles.addBannerSubtitle}>
                Créer un compte avec mot de passe et numéro WhatsApp
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Section title & count */}
        <View style={styles.listSectionHeader}>
          <Text style={styles.listSectionTitle}>
            Liste des Ouvriers ({filteredWorkers.length})
          </Text>
          {search ? (
            <Text style={styles.listSectionFilter}>Filtre: "{search}"</Text>
          ) : null}
        </View>

        {/* Workers List */}
        {filteredWorkers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <HardHat size={36} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle}>Aucun ouvrier trouvé</Text>
            <Text style={styles.emptySubtitle}>
              {search
                ? `Aucun résultat pour "${search}". Modifiez votre recherche ou ajoutez un nouveau profil.`
                : 'Aucun ouvrier d’entrepôt enregistré pour le moment.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={handleOpenAddModal}
              activeOpacity={0.85}
            >
              <Plus size={16} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 6 }} />
              <Text style={styles.emptyAddBtnText}>Ajouter le premier ouvrier</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredWorkers.map((worker) => {
            const initials = worker.fullName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            const isPasswordRevealed = !!revealedPasswords[worker.id];

            return (
              <View key={worker.id} style={styles.workerCard}>
                {/* Card Top: Avatar, Name, ID */}
                <TouchableOpacity
                  style={styles.cardHeaderPressable}
                  onPress={() => handleOpenDetail(worker)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardAvatar}>
                    <Text style={styles.cardAvatarText}>{initials || 'WW'}</Text>
                  </View>

                  <View style={styles.cardMainInfo}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardName}>{worker.fullName}</Text>
                      <View style={styles.cardIdBadge}>
                        <Text style={styles.cardIdText}>{worker.id}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Card Fields: Phone, Email, Password */}
                <View style={styles.cardFieldsContainer}>
                  {/* Phone */}
                  <View style={styles.cardFieldRow}>
                    <View style={styles.cardFieldLeft}>
                      <Globe size={15} color="#2563eb" style={{ marginRight: 6 }} />
                      <Text style={styles.cardFieldText}>{worker.phoneNumber}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => callWorkerDirectly(worker.phoneNumber)}
                      style={styles.smallCallBtn}
                      activeOpacity={0.7}
                    >
                      <Phone size={13} color="#2563eb" />
                    </TouchableOpacity>
                  </View>

                  {/* Email */}
                  <View style={styles.cardFieldRow}>
                    <View style={styles.cardFieldLeft}>
                      <Mail size={14} color="#64748b" style={{ marginRight: 6 }} />
                      <Text style={styles.cardFieldText}>{worker.email}</Text>
                    </View>
                  </View>

                  {/* Password Field with Eye Toggle */}
                  <View style={styles.cardFieldRow}>
                    <View style={styles.cardFieldLeft}>
                      <Lock size={14} color="#64748b" style={{ marginRight: 6 }} />
                      <Text style={styles.cardPasswordLabel}>Mot de passe :</Text>
                      <Text style={styles.cardPasswordText}>
                        {isPasswordRevealed ? worker.password : '••••••••'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => togglePasswordReveal(worker.id)}
                      style={styles.smallEyeBtn}
                      activeOpacity={0.7}
                    >
                      {isPasswordRevealed ? (
                        <EyeOff size={14} color="#64748b" />
                      ) : (
                        <Eye size={14} color="#64748b" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Card Actions Footer: Prominent WhatsApp Button + Edit/Delete */}
                <View style={styles.cardActionsFooter}>
                  {/* WHATSAPP BUTTON FOR EVERY SINGLE WORKER */}
                  <TouchableOpacity
                    style={styles.whatsAppButton}
                    onPress={() =>
                      contactWorkerViaWhatsApp(worker.phoneNumber, worker.fullName)
                    }
                    activeOpacity={0.82}
                  >
                    <WhatsAppIcon size={18} color="#FFFFFF" />
                    <Text style={styles.whatsAppBtnText}>WhatsApp</Text>
                  </TouchableOpacity>

                  {/* Quick Edit Button */}
                  <TouchableOpacity
                    style={styles.actionBtnSecondary}
                    onPress={() => handleOpenEditModal(worker)}
                    activeOpacity={0.75}
                  >
                    <Edit3 size={15} color="#2563eb" />
                    <Text style={styles.actionBtnSecondaryText}>Modifier</Text>
                  </TouchableOpacity>

                  {/* Quick Delete Button */}
                  <TouchableOpacity
                    style={styles.actionBtnDelete}
                    onPress={() => handleDeleteWorker(worker.id)}
                    activeOpacity={0.75}
                  >
                    <Trash2 size={15} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add / Edit Popup Modal */}
      <AddEditWorkerModal
        visible={modalVisible}
        mode={modalMode}
        worker={selectedWorker}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveWorker}
      />

      {/* Detail Modal */}
      <WarehouseWorkerDetailModal
        visible={detailVisible}
        worker={detailWorker}
        onClose={() => setDetailVisible(false)}
        onEdit={(w) => handleOpenEditModal(w)}
        onDelete={(id) => handleDeleteWorker(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextGroup: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#bfdbfe',
    marginTop: 2,
  },
  headerAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 10,
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#e2e8f0',
  },
  addBannerBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  addBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  addBannerSubtitle: {
    fontSize: 11,
    color: '#dbeafe',
    marginTop: 2,
  },
  listSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  listSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  listSectionFilter: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  workerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderPressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardMainInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  cardIdBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardIdText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  cardFieldsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 10,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardFieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardFieldText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  cardPasswordLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginRight: 6,
  },
  cardPasswordText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  smallEyeBtn: {
    padding: 4,
  },
  smallCallBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
  },
  whatsAppButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
    gap: 6,
  },
  whatsAppBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    gap: 4,
  },
  actionBtnSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  actionBtnDelete: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 20,
  },
  emptyAddBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
