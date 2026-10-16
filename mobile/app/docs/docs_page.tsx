import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  FileText,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  Search,
  MapPin,
  Package,
  Layers,
  ArrowRight,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
} from 'lucide-react-native';
import { Colis } from '../colis/create-colis';
import {
  getColisGroupedByCity,
  CityColisGroup,
  CityGroupingMode,
  formatCitySummaryText,
} from './colisByCity';
import {
  generateAllCitiesPrintHTML,
  generateCityPrintHTML,
  generateSingleColisPrintHTML,
  printHtmlContent,
  sharePdfFile,
} from './printService';

export interface DocsPageProps {
  colisList: Colis[];
  direction?: 'MA_TO_FR' | 'FR_TO_MA';
  onNavigateToColis?: () => void;
}

export default function DocsPage({
  colisList,
  direction = 'MA_TO_FR',
  onNavigateToColis,
}: DocsPageProps) {
  const [groupMode, setGroupMode] = useState<CityGroupingMode>('origin');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string | null>(null);

  // Grouped cities list
  const cityGroups = useMemo(() => {
    return getColisGroupedByCity(colisList, groupMode);
  }, [colisList, groupMode]);

  // Overall totals
  const totalParcels = colisList.length;
  const totalWeight = useMemo(() => {
    return Math.round(colisList.reduce((acc, c) => acc + (Number(c.weight) || 0), 0) * 10) / 10;
  }, [colisList]);
  const totalPrice = useMemo(() => {
    return colisList.reduce((acc, c) => acc + (Number(c.price) || 0), 0);
  }, [colisList]);

  // Filtered city groups based on search & filter pill
  const filteredGroups = useMemo(() => {
    return cityGroups.filter((g) => {
      const matchesPill =
        selectedCityFilter === 'all' ||
        g.city.toLowerCase() === selectedCityFilter.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        g.city.toLowerCase().includes(q) ||
        g.colis.some(
          (c) =>
            c.id.toLowerCase().includes(q) ||
            c.senderName.toLowerCase().includes(q) ||
            c.receiverName.toLowerCase().includes(q)
        );

      return matchesPill && matchesSearch;
    });
  }, [cityGroups, selectedCityFilter, searchQuery]);

  // Toggle city collapse
  const toggleCityExpand = (city: string) => {
    setExpandedCities((prev) => ({
      ...prev,
      [city]: !prev[city],
    }));
  };

  // Expand all / Collapse all
  const toggleAllExpand = () => {
    const allExpanded = filteredGroups.every((g) => expandedCities[g.city]);
    const newState: Record<string, boolean> = {};
    filteredGroups.forEach((g) => {
      newState[g.city] = !allExpanded;
    });
    setExpandedCities(newState);
  };

  // Master Action: Print All Cities (Strict 1 page per city)
  const handlePrintAllCities = async () => {
    if (cityGroups.length === 0) return;
    setIsProcessing(true);
    const html = generateAllCitiesPrintHTML(cityGroups, groupMode, direction);
    await printHtmlContent(html);
    setIsProcessing(false);
  };

  // Master Action: Share PDF of All Cities
  const handleShareAllCities = async () => {
    if (cityGroups.length === 0) return;
    setIsProcessing(true);
    const html = generateAllCitiesPrintHTML(cityGroups, groupMode, direction);
    await sharePdfFile(html, `ColisExpress_Feuilles_Par_Villes.pdf`);
    setIsProcessing(false);
  };

  // City Action: Print single city
  const handlePrintCity = async (group: CityColisGroup) => {
    setIsProcessing(true);
    const html = generateCityPrintHTML(group, groupMode, direction);
    await printHtmlContent(html);
    setIsProcessing(false);
  };

  // City Action: Share PDF for single city
  const handleShareCity = async (group: CityColisGroup) => {
    setIsProcessing(true);
    const html = generateCityPrintHTML(group, groupMode, direction);
    await sharePdfFile(html, `ColisExpress_${group.city}.pdf`);
    setIsProcessing(false);
  };

  // Individual Colis Action: Print Ticket
  const handlePrintSingleColis = async (colis: Colis) => {
    setIsProcessing(true);
    const html = generateSingleColisPrintHTML(colis);
    await printHtmlContent(html);
    setIsProcessing(false);
  };

  // Summary human readable text
  const summaryText = useMemo(() => {
    return formatCitySummaryText(colisList, groupMode);
  }, [colisList, groupMode]);

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            {onNavigateToColis && (
              <TouchableOpacity
                onPress={onNavigateToColis}
                style={styles.backButton}
                activeOpacity={0.7}
                accessibilityLabel="Retour aux colis"
              >
                <ArrowLeft size={20} color="#ffffff" strokeWidth={2.4} />
              </TouchableOpacity>
            )}
            <View style={styles.iconCircle}>
              <FileText size={22} color="#1d4ed8" strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Documents & Impression</Text>
              <Text style={styles.headerSubtitle}>
                Bordereaux par ville • {direction === 'MA_TO_FR' ? 'Maroc ➔ France' : 'France ➔ Maroc'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Statistics Banner */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalParcels}</Text>
              <Text style={styles.statLabel}>Total Colis</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{cityGroups.length}</Text>
              <Text style={styles.statLabel}>Villes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalWeight} kg</Text>
              <Text style={styles.statLabel}>Poids Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalPrice} DH</Text>
              <Text style={styles.statLabel}>Montant</Text>
            </View>
          </View>

          {/* Quick Summary Pill Banner */}
          <View style={styles.summaryTextPill}>
            <Layers size={14} color="#1d4ed8" style={{ marginRight: 6 }} />
            <Text style={styles.summaryTextPillContent} numberOfLines={2}>
              {summaryText}
            </Text>
          </View>
        </View>

        {/* Grouping Mode Switcher */}
        <View style={styles.modeSwitcherContainer}>
          <Text style={styles.sectionLabel}>Grouper les colis par :</Text>
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[styles.modeButton, groupMode === 'origin' && styles.modeButtonActive]}
              onPress={() => setGroupMode('origin')}
              activeOpacity={0.8}
            >
              <MapPin
                size={14}
                color={groupMode === 'origin' ? '#ffffff' : '#64748b'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.modeButtonText, groupMode === 'origin' && styles.modeButtonTextActive]}>
                Ville de Départ (Origine)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeButton, groupMode === 'destination' && styles.modeButtonActive]}
              onPress={() => setGroupMode('destination')}
              activeOpacity={0.8}
            >
              <MapPin
                size={14}
                color={groupMode === 'destination' ? '#ffffff' : '#64748b'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.modeButtonText, groupMode === 'destination' && styles.modeButtonTextActive]}>
                Ville d'Arrivée (Dest.)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Master Print & Share Actions Card */}
        <View style={styles.masterActionCard}>
          <View style={styles.masterHeader}>
            <View style={styles.badgeRule}>
              <Text style={styles.badgeRuleText}>Règle d'impression</Text>
            </View>
            <Text style={styles.masterNotice}>
              Chaque ville est imprimée sur sa propre page séparée
            </Text>
          </View>

          <View style={styles.masterButtonsRow}>
            {/* Primary Print All Button */}
            <TouchableOpacity
              style={[styles.masterPrintBtn, isProcessing && styles.btnDisabled]}
              onPress={handlePrintAllCities}
              disabled={isProcessing}
              activeOpacity={0.85}
            >
              {isProcessing ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Printer size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <View>
                    <Text style={styles.masterPrintBtnText}>Imprimer Toutes les Villes</Text>
                    <Text style={styles.masterPrintBtnSub}>1 page par ville (Agadir, Casa...)</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Share PDF Button */}
            <TouchableOpacity
              style={[styles.masterShareBtn, isProcessing && styles.btnDisabled]}
              onPress={handleShareAllCities}
              disabled={isProcessing}
              activeOpacity={0.85}
            >
              <Share2 size={16} color="#1d4ed8" style={{ marginRight: 6 }} />
              <Text style={styles.masterShareBtnText}>Exporter PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar & Filter Pills */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Search size={16} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une ville, n° colis, client..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>

          {/* City Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pillsScroll}
            contentContainerStyle={styles.pillsContainer}
          >
            <TouchableOpacity
              style={[styles.pill, selectedCityFilter === 'all' && styles.pillActive]}
              onPress={() => setSelectedCityFilter('all')}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, selectedCityFilter === 'all' && styles.pillTextActive]}>
                Toutes ({cityGroups.length})
              </Text>
            </TouchableOpacity>

            {cityGroups.map((g) => {
              const isActive = selectedCityFilter.toLowerCase() === g.city.toLowerCase();
              return (
                <TouchableOpacity
                  key={g.city}
                  style={[styles.pill, isActive && styles.pillActive]}
                  onPress={() => setSelectedCityFilter(isActive ? 'all' : g.city)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                    {g.city} ({g.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>
            Villes & Détail des Colis ({filteredGroups.length})
          </Text>
          <TouchableOpacity onPress={toggleAllExpand} activeOpacity={0.7}>
            <Text style={styles.expandAllText}>
              {filteredGroups.every((g) => expandedCities[g.city]) ? 'Tout replier' : 'Tout déplier'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* City Cards */}
        {filteredGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={36} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>Aucun colis trouvé</Text>
            <Text style={styles.emptyStateSubtitle}>
              Aucun colis ne correspond à vos critères de recherche.
            </Text>
          </View>
        ) : (
          filteredGroups.map((group) => {
            const isExpanded = !!expandedCities[group.city];
            return (
              <View key={group.city} style={styles.cityCard}>
                {/* City Card Header */}
                <TouchableOpacity
                  style={styles.cityCardHeader}
                  onPress={() => toggleCityExpand(group.city)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cityCardHeaderLeft}>
                    <View style={styles.cityBadgeIcon}>
                      <MapPin size={18} color="#1d4ed8" />
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.cityNameText}>{group.city}</Text>
                        <View style={styles.colisCountBadge}>
                          <Text style={styles.colisCountText}>
                            {group.count} {group.count > 1 ? 'colis' : 'colis'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.cityMetaText}>
                        Poids : {Math.round(group.totalWeight * 10) / 10} kg • Total : {group.totalPrice} MAD
                        {group.unpaidCount > 0 ? ` • ⚠️ ${group.unpaidCount} non payé(s)` : ''}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cityCardHeaderRight}>
                    {isExpanded ? (
                      <ChevronUp size={20} color="#64748b" />
                    ) : (
                      <ChevronDown size={20} color="#64748b" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* City Specific Print Buttons Toolbar */}
                <View style={styles.cityActionToolbar}>
                  <TouchableOpacity
                    style={styles.cityPrintButton}
                    onPress={() => handlePrintCity(group)}
                    activeOpacity={0.8}
                  >
                    <Printer size={14} color="#1d4ed8" style={{ marginRight: 6 }} />
                    <Text style={styles.cityPrintButtonText}>
                      Imprimer {group.city} ({group.count})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cityShareButton}
                    onPress={() => handleShareCity(group)}
                    activeOpacity={0.8}
                  >
                    <Share2 size={14} color="#475569" style={{ marginRight: 4 }} />
                    <Text style={styles.cityShareButtonText}>PDF</Text>
                  </TouchableOpacity>
                </View>

                {/* Expanded Colis List */}
                {isExpanded && (
                  <View style={styles.parcelsListContainer}>
                    <View style={styles.parcelsListDivider} />
                    {group.colis.map((item, idx) => {
                      const isPaid = item.isPaid !== false;
                      return (
                        <View key={item.id} style={styles.parcelRow}>
                          <View style={styles.parcelIndexBadge}>
                            <Text style={styles.parcelIndexText}>{idx + 1}</Text>
                          </View>

                          <View style={styles.parcelInfo}>
                            <View style={styles.parcelTopLine}>
                              <Text style={styles.parcelTrackingId}>{item.id}</Text>
                              <View
                                style={[
                                  styles.miniPaidBadge,
                                  isPaid ? styles.miniPaidSuccess : styles.miniPaidDanger,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.miniPaidText,
                                    isPaid ? styles.miniPaidTextSuccess : styles.miniPaidTextDanger,
                                  ]}
                                >
                                  {isPaid ? 'Payé' : 'Non payé'}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.parcelRouteText}>
                              <Text style={styles.parcelSender}>De: {item.senderName} ({item.fromCity})</Text>
                              <Text style={styles.parcelReceiver}>À: {item.receiverName} ({item.toCity})</Text>
                            </View>

                            <View style={styles.parcelDetailsRow}>
                              <Text style={styles.parcelSpecText}>⚖️ {item.weight} kg</Text>
                              <Text style={styles.parcelSpecText}>💰 {item.price} MAD</Text>
                              <Text style={styles.parcelSpecText}>
                                {item.isADomicile !== false ? '🏠 Domicile' : '📦 Relais'}
                              </Text>
                            </View>
                          </View>

                          {/* Print single parcel ticket button */}
                          <TouchableOpacity
                            style={styles.parcelPrintBtn}
                            onPress={() => handlePrintSingleColis(item)}
                            activeOpacity={0.7}
                            accessibilityLabel="Imprimer reçu colis"
                          >
                            <Printer size={14} color="#2563eb" />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1d4ed8',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#bfdbfe',
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#e2e8f0',
  },
  summaryTextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 10,
  },
  summaryTextPillContent: {
    fontSize: 11,
    color: '#1e40af',
    fontWeight: '600',
    flex: 1,
  },
  modeSwitcherContainer: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginLeft: 2,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 3,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  modeButtonActive: {
    backgroundColor: '#1d4ed8',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButtonText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
  },
  modeButtonTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  masterActionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    marginBottom: 16,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  masterHeader: {
    marginBottom: 10,
  },
  badgeRule: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  badgeRuleText: {
    color: '#b45309',
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  masterNotice: {
    fontSize: 11.5,
    color: '#334155',
    fontWeight: '600',
  },
  masterButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  masterPrintBtn: {
    flex: 2,
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  masterPrintBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  masterPrintBtnSub: {
    color: '#bfdbfe',
    fontSize: 9.5,
    fontWeight: '500',
  },
  masterShareBtn: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  masterShareBtnText: {
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 12,
  },
  searchSection: {
    marginBottom: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0f172a',
    padding: 0,
  },
  pillsScroll: {
    marginHorizontal: -4,
  },
  pillsContainer: {
    paddingHorizontal: 4,
    gap: 6,
  },
  pill: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  listHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  expandAllText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2563eb',
  },
  cityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  cityCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cityNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 8,
  },
  colisCountBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  colisCountText: {
    color: '#1d4ed8',
    fontSize: 10,
    fontWeight: '700',
  },
  cityMetaText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  cityCardHeaderRight: {
    marginLeft: 8,
  },
  cityActionToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  cityPrintButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    paddingVertical: 7,
  },
  cityPrintButtonText: {
    color: '#1d4ed8',
    fontSize: 11.5,
    fontWeight: '700',
  },
  cityShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  cityShareButtonText: {
    color: '#475569',
    fontSize: 11.5,
    fontWeight: '600',
  },
  parcelsListContainer: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  parcelsListDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 8,
  },
  parcelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
  },
  parcelIndexBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  parcelIndexText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  parcelInfo: {
    flex: 1,
  },
  parcelTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  parcelTrackingId: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1d4ed8',
    fontFamily: 'monospace',
  },
  miniPaidBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  miniPaidSuccess: {
    backgroundColor: '#dcfce7',
  },
  miniPaidDanger: {
    backgroundColor: '#fee2e2',
  },
  miniPaidText: {
    fontSize: 8.5,
    fontWeight: '700',
  },
  miniPaidTextSuccess: {
    color: '#15803d',
  },
  miniPaidTextDanger: {
    color: '#b91c1c',
  },
  parcelRouteText: {
    marginTop: 2,
  },
  parcelSender: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '500',
  },
  parcelReceiver: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '500',
  },
  parcelDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  parcelSpecText: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '600',
  },
  parcelPrintBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
  },
  emptyStateSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
});
