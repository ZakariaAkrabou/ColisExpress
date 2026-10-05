import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  Package,
  Users,
  FileText,
  BarChart2,
  ChevronRight,
  CheckCircle2,
  Truck,
  RotateCcw,
} from 'lucide-react-native';
import Header from '../../components/layout/Header';
import { MoroccoFlagBadge, FranceFlagBadge } from '../../components/common/Icons';

const { width } = Dimensions.get('window');

export interface HomeStats {
  totalColis: number | string;
  livres: number | string;
  enTransit: number | string;
  retournes: number | string;
}

export interface HomeScreenProps {
  direction?: 'MA_TO_FR' | 'FR_TO_MA';
  onToggleDirection?: () => void;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onNavigateTab?: (tab: 'colis' | 'clients' | 'invoices' | 'stats' | 'settings') => void;
  onViewAllStats?: () => void;
  stats?: Partial<HomeStats>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  direction = 'MA_TO_FR',
  onToggleDirection,
  onMenuPress,
  onNotificationPress,
  onNavigateTab,
  onViewAllStats,
  stats = {
    totalColis: '1 248',
    livres: '932',
    enTransit: '287',
    retournes: '29',
  },
}) => {
  return (
    <View style={styles.container} className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />

      {/* Top Header */}
      <Header
        direction={direction}
        onMenuPress={onMenuPress}
        onNotificationPress={onNotificationPress}
        unreadNotifications={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1"
      >

        <View style={styles.heroWrapper} className="bg-blue-700 pb-5 px-4 pt-2">

          <TouchableOpacity
            style={styles.routeHeader}
            onPress={onToggleDirection}
            activeOpacity={0.8}
            className="flex-row items-center justify-center my-2"
          >
            {direction === 'MA_TO_FR' ? (
              <>
                <MoroccoFlagBadge size={34} />
                <View style={styles.dashedRouteLine}>
                  <Text style={styles.dashedArrowText}>- - - - ➔</Text>
                </View>
                <FranceFlagBadge size={34} />
              </>
            ) : (
              <>
                <FranceFlagBadge size={34} />
                <View style={styles.dashedRouteLine}>
                  <Text style={styles.dashedArrowText}>- - - - ➔</Text>
                </View>
                <MoroccoFlagBadge size={34} />
              </>
            )}
          </TouchableOpacity>


          <View style={styles.heroCard} className="rounded-2xl overflow-hidden my-3 shadow-md">
            <Image
              source={require('../../assets/truck_banner.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Hero Slogan & Subtitle */}
          <View style={styles.heroTextContainer} className="items-center px-4 mt-2 mb-1">
            <Text style={styles.heroTitle} className="text-white text-xl font-bold text-center">
              Vos colis, notre priorité
            </Text>
            <Text style={styles.heroSubtitle} className="text-blue-100 text-xs text-center mt-1.5 leading-4">
              Un service fiable, rapide et sécurisé{'\n'}pour tous vos envois.
            </Text>
          </View>
        </View>

        {/* --- Main Action Navigation Grid (2x2 Cards) --- */}
        <View style={styles.mainGridSection} className="px-4 -mt-2">
          <View style={styles.gridRow} className="flex-row justify-between mb-3.5">
            {/* Card 1: Mes colis (Active Blue Card) */}
            <TouchableOpacity
              style={[styles.actionCard, styles.activeActionCard]}
              onPress={() => onNavigateTab?.('colis')}
              activeOpacity={0.85}
              className="bg-blue-600 rounded-2xl p-4 shadow-sm flex-row items-center justify-between"
            >
              <View style={styles.cardLeftContent}>
                <View style={styles.activeIconCircle} className="w-10 h-10 rounded-full bg-blue-500/80 items-center justify-center mb-2">
                  <Package size={20} color="#FFFFFF" strokeWidth={2.4} />
                </View>
                <Text style={styles.activeCardText} className="text-white font-bold text-base mt-1">
                  Mes colis
                </Text>
              </View>
              <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Card 2: Clients */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => onNavigateTab?.('clients')}
              activeOpacity={0.85}
              className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center justify-between border border-slate-100"
            >
              <View style={styles.cardLeftContent}>
                <View style={styles.inactiveIconCircle} className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mb-2">
                  <Users size={20} color="#334155" strokeWidth={2.2} />
                </View>
                <Text style={styles.inactiveCardText} className="text-slate-800 font-bold text-base mt-1">
                  Clients
                </Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow} className="flex-row justify-between mb-2">
            {/* Card 3: Factures */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => onNavigateTab?.('invoices')}
              activeOpacity={0.85}
              className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center justify-between border border-slate-100"
            >
              <View style={styles.cardLeftContent}>
                <View style={styles.inactiveIconCircle} className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mb-2">
                  <FileText size={20} color="#334155" strokeWidth={2.2} />
                </View>
                <Text style={styles.inactiveCardText} className="text-slate-800 font-bold text-base mt-1">
                  Factures
                </Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" strokeWidth={2.2} />
            </TouchableOpacity>

            {/* Card 4: Statistiques */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => onNavigateTab?.('stats')}
              activeOpacity={0.85}
              className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center justify-between border border-slate-100"
            >
              <View style={styles.cardLeftContent}>
                <View style={styles.inactiveIconCircle} className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mb-2">
                  <BarChart2 size={20} color="#334155" strokeWidth={2.2} />
                </View>
                <Text style={styles.inactiveCardText} className="text-slate-800 font-bold text-base mt-1">
                  Statistiques
                </Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Quick Overview Section ("Aperçu rapide") --- */}
        <View style={styles.quickOverviewSection} className="px-4 mt-5 mb-6">
          {/* Section Header */}
          <View style={styles.sectionHeaderRow} className="flex-row items-center justify-between mb-3.5">
            <Text style={styles.sectionTitle} className="text-slate-900 text-lg font-bold">
              Aperçu rapide
            </Text>
            <TouchableOpacity onPress={onViewAllStats || (() => onNavigateTab?.('stats'))} activeOpacity={0.7}>
              <Text style={styles.viewAllText} className="text-blue-600 text-sm font-semibold">
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2x2 Stats Summary Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statsRow} className="flex-row justify-between mb-3">
              {/* Stat 1: Total colis */}
              <View style={styles.statCard} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex-row items-center">
                <View style={[styles.statBadge, styles.blueStatBadge]} className="w-11 h-11 rounded-full bg-blue-50 items-center justify-center mr-3">
                  <Package size={22} color="#2563eb" strokeWidth={2.2} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel} className="text-slate-500 text-xs font-medium">
                    Total colis
                  </Text>
                  <Text style={styles.statValue} className="text-slate-900 text-lg font-bold mt-0.5">
                    {stats.totalColis ?? '1 248'}
                  </Text>
                </View>
              </View>

              {/* Stat 2: Livrés */}
              <View style={styles.statCard} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex-row items-center">
                <View style={[styles.statBadge, styles.greenStatBadge]} className="w-11 h-11 rounded-full bg-emerald-50 items-center justify-center mr-3">
                  <CheckCircle2 size={22} color="#16a34a" strokeWidth={2.2} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel} className="text-slate-500 text-xs font-medium">
                    Livrés
                  </Text>
                  <Text style={styles.statValue} className="text-slate-900 text-lg font-bold mt-0.5">
                    {stats.livres ?? '932'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow} className="flex-row justify-between">
              {/* Stat 3: En transit */}
              <View style={styles.statCard} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex-row items-center">
                <View style={[styles.statBadge, styles.amberStatBadge]} className="w-11 h-11 rounded-full bg-amber-50 items-center justify-center mr-3">
                  <Truck size={22} color="#d97706" strokeWidth={2.2} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel} className="text-slate-500 text-xs font-medium">
                    En transit
                  </Text>
                  <Text style={styles.statValue} className="text-slate-900 text-lg font-bold mt-0.5">
                    {stats.enTransit ?? '287'}
                  </Text>
                </View>
              </View>

              {/* Stat 4: Retournés */}
              <View style={styles.statCard} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex-row items-center">
                <View style={[styles.statBadge, styles.roseStatBadge]} className="w-11 h-11 rounded-full bg-rose-50 items-center justify-center mr-3">
                  <RotateCcw size={22} color="#e11d48" strokeWidth={2.2} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel} className="text-slate-500 text-xs font-medium">
                    Retournés
                  </Text>
                  <Text style={styles.statValue} className="text-slate-900 text-lg font-bold mt-0.5">
                    {stats.retournes ?? '29'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const CARD_WIDTH = (width - 44) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // Hero Section
  heroWrapper: {
    backgroundColor: '#1d4ed8',
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  dashedRouteLine: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedArrowText: {
    color: '#93c5fd',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  heroCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 12,
    backgroundColor: '#1e40af',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: 150,
  },
  heroTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    color: '#dbeafe',
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    fontWeight: '400',
  },
  // Main Grid
  mainGridSection: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  activeActionCard: {
    backgroundColor: '#2563eb', // Rich vivid blue
    borderColor: '#1d4ed8',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardLeftContent: {
    flex: 1,
  },
  activeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  inactiveIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  inactiveCardText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
  },
  // Quick Overview
  quickOverviewSection: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  viewAllText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  blueStatBadge: {
    backgroundColor: '#eff6ff',
  },
  greenStatBadge: {
    backgroundColor: '#f0fdf4',
  },
  amberStatBadge: {
    backgroundColor: '#fffbeb',
  },
  roseStatBadge: {
    backgroundColor: '#fef2f2',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 11.5,
    fontWeight: '500',
  },
  statValue: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
});
