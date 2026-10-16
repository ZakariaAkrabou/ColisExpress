import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import {
  ChevronRight,
  Truck,
  Clock,
  Zap,
  CheckCircle2,
  CircleDot,
  ArrowRightLeft,
} from 'lucide-react-native';
import { FranceFlagCircle, MoroccoFlagCircle } from '../../components/common/Icons';

const { width } = Dimensions.get('window');

export interface HomeScreenProps {
  userName?: string;
  direction?: 'MA_TO_FR' | 'FR_TO_MA';
  onSelectDirection?: (dir: 'MA_TO_FR' | 'FR_TO_MA') => void;
  onToggleDirection?: () => void;
  onLocationPress?: () => void;
  onNavigateTab?: (tab: 'home' | 'colis' | 'clients' | 'locations' | 'settings' | 'docs' | 'invoices') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'Zakaria',
  direction = 'FR_TO_MA',
  onSelectDirection,
  onToggleDirection,
  onNavigateTab,
}) => {
  const isFrToMa = direction === 'FR_TO_MA';

  const handleSelect = (selectedDir: 'MA_TO_FR' | 'FR_TO_MA') => {
    if (onSelectDirection) {
      onSelectDirection(selectedDir);
    } else if (onNavigateTab) {
      onNavigateTab('colis');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2E70" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Top Hero Section with Centered Logo */}
        <View style={styles.heroCard}>
          {/* Logo Center */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Centered Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={styles.heroGreeting}>Bonjour, {userName}</Text>
            <Text style={styles.heroSubtitle}>
              Sélectionnez le serveur de routage pour vos expéditions
            </Text>
          </View>

          {/* Quick Swap Direction Button */}
          {onToggleDirection && (
            <TouchableOpacity
              style={styles.quickSwapBar}
              activeOpacity={0.8}
              onPress={onToggleDirection}
            >
              <ArrowRightLeft size={16} color="#DBEAFE" strokeWidth={2.2} />
              <Text style={styles.quickSwapText}>
                Direction actuelle : {isFrToMa ? 'France ➔ Maroc' : 'Maroc ➔ France'}
              </Text>
              <Text style={styles.quickSwapAction}>Inverser</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Zap size={18} color="#0B3E96" strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Lignes d'Expédition (Serveurs)</Text>
          </View>
          <Text style={styles.sectionHelp}>Touchez une destination pour continuer</Text>
        </View>

        {/* Route Card 1: France ➔ Maroc */}
        <TouchableOpacity
          style={[
            styles.routeCard,
            isFrToMa && styles.routeCardActive,
          ]}
          activeOpacity={0.88}
          onPress={() => handleSelect('FR_TO_MA')}
        >
          {/* Top Header Row with Flags and Status Badge */}
          <View style={styles.routeTopRow}>
            <View style={styles.flagsCombo}>
              <FranceFlagCircle size={40} />
              <View style={styles.arrowBetweenFlags}>
                <Text style={styles.arrowIconText}>➔</Text>
              </View>
              <MoroccoFlagCircle size={40} />
            </View>

            {/* Status Pill Badge */}
            {isFrToMa ? (
              <View style={styles.activePill}>
                <CheckCircle2 size={13} color="#FFFFFF" strokeWidth={2.6} />
                <Text style={styles.activePillText}>Serveur Actif</Text>
              </View>
            ) : (
              <View style={styles.inactivePill}>
                <CircleDot size={12} color="#64748B" strokeWidth={2.2} />
                <Text style={styles.inactivePillText}>Disponible</Text>
              </View>
            )}
          </View>

          {/* Route Description */}
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>France ➔ Maroc</Text>
            <Text style={styles.routeSubtitle}>
              Départ : Paris, Lyon, Marseille • Arrivée : Casa, Rabat, Tanger
            </Text>
          </View>

          {/* Card Footer Details & CTA */}
          <View style={styles.routeFooter}>
            <View style={styles.metaItem}>
              <Clock size={14} color="#64748B" strokeWidth={2} />
              <Text style={styles.metaText}>Délai : 3 à 5 jours ouvrés</Text>
            </View>

            <View style={[styles.actionIndicator, isFrToMa && styles.actionIndicatorActive]}>
              <Text style={[styles.actionIndicatorText, isFrToMa && styles.actionIndicatorTextActive]}>
                {isFrToMa ? 'Accéder' : 'Choisir'}
              </Text>
              <ChevronRight size={15} color={isFrToMa ? '#FFFFFF' : '#1D4ED8'} strokeWidth={2.5} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Route Card 2: Maroc ➔ France */}
        <TouchableOpacity
          style={[
            styles.routeCard,
            !isFrToMa && styles.routeCardActive,
          ]}
          activeOpacity={0.88}
          onPress={() => handleSelect('MA_TO_FR')}
        >
          {/* Top Header Row with Flags and Status Badge */}
          <View style={styles.routeTopRow}>
            <View style={styles.flagsCombo}>
              <MoroccoFlagCircle size={40} />
              <View style={styles.arrowBetweenFlags}>
                <Text style={styles.arrowIconText}>➔</Text>
              </View>
              <FranceFlagCircle size={40} />
            </View>

            {/* Status Pill Badge */}
            {!isFrToMa ? (
              <View style={styles.activePill}>
                <CheckCircle2 size={13} color="#FFFFFF" strokeWidth={2.6} />
                <Text style={styles.activePillText}>Serveur Actif</Text>
              </View>
            ) : (
              <View style={styles.inactivePill}>
                <CircleDot size={12} color="#64748B" strokeWidth={2.2} />
                <Text style={styles.inactivePillText}>Disponible</Text>
              </View>
            )}
          </View>

          {/* Route Description */}
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>Maroc ➔ France</Text>
            <Text style={styles.routeSubtitle}>
              Départ : Casa, Marrakech, Fès • Arrivée : Paris, Lyon, Lille
            </Text>
          </View>

          {/* Card Footer Details & CTA */}
          <View style={styles.routeFooter}>
            <View style={styles.metaItem}>
              <Clock size={14} color="#64748B" strokeWidth={2} />
              <Text style={styles.metaText}>Délai : 3 à 5 jours ouvrés</Text>
            </View>

            <View style={[styles.actionIndicator, !isFrToMa && styles.actionIndicatorActive]}>
              <Text style={[styles.actionIndicatorText, !isFrToMa && styles.actionIndicatorTextActive]}>
                {!isFrToMa ? 'Accéder' : 'Choisir'}
              </Text>
              <ChevronRight size={15} color={!isFrToMa ? '#FFFFFF' : '#1D4ED8'} strokeWidth={2.5} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: '#0B3E96',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#0B3E96',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  heroGreeting: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13.5,
    color: '#BFDBFE',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  quickSwapBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    gap: 8,
  },
  quickSwapText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  quickSwapAction: {
    color: '#93C5FD',
    fontSize: 11.5,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionHelp: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  routeCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  routeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  flagsCombo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowBetweenFlags: {
    marginHorizontal: 8,
  },
  arrowIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  inactivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  inactivePillText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  routeInfo: {
    marginBottom: 14,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  routeSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  routeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    gap: 3,
  },
  actionIndicatorActive: {
    backgroundColor: '#1D4ED8',
  },
  actionIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  actionIndicatorTextActive: {
    color: '#FFFFFF',
  },
});
