import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Package,
  Users,
  FileText,
  BarChart2,
  ChevronRight,
  CheckCircle2,
  Truck,
  RotateCcw,
  Bell,
  Menu,
  Home,
  Plus,
  MoreHorizontal,
  ArrowRight,
  Check,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ScanLine,
  Send,
  Clock,
  Building,
} from 'lucide-react-native';

export {
  Package,
  Users,
  FileText,
  BarChart2,
  ChevronRight,
  CheckCircle2,
  Truck,
  RotateCcw,
  Bell,
  Menu,
  Home,
  Plus,
  MoreHorizontal,
  ArrowRight,
  Check,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ScanLine,
  Send,
  Clock,
  Building,
};

// Custom Box 3D Package Logo Icon for Header
export const ColisLogoIcon = ({ size = 32, color = '#FFFFFF' }: { size?: number; color?: string }) => {
  return (
    <View
      style={[
        styles.logoContainer,
        { width: size, height: size, borderRadius: size * 0.28 },
      ]}
    >
      <Package size={size * 0.65} color={color} strokeWidth={2.3} />
    </View>
  );
};

import Svg, { Circle, Rect, Path, G, ClipPath, Defs } from 'react-native-svg';

// Custom SVG France Flag Circle
export const FranceFlagCircle = ({ size = 42 }: { size?: number }) => {
  const clipId = `fr-clip-${size}`;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 }}>
      <Svg width={size} height={size} viewBox="0 0 36 36">
        <Defs>
          <ClipPath id={clipId}>
            <Circle cx="18" cy="18" r="18" />
          </ClipPath>
        </Defs>
        <G clipPath={`url(#${clipId})`}>
          <Rect x="0" y="0" width="12" height="36" fill="#002654" />
          <Rect x="12" y="0" width="12" height="36" fill="#FFFFFF" />
          <Rect x="24" y="0" width="12" height="36" fill="#ED2939" />
        </G>
        <Circle cx="18" cy="18" r="17.5" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      </Svg>
    </View>
  );
};

// Custom SVG Morocco Flag Circle
export const MoroccoFlagCircle = ({ size = 42 }: { size?: number }) => {
  const clipId = `ma-clip-${size}`;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 }}>
      <Svg width={size} height={size} viewBox="0 0 36 36">
        <Defs>
          <ClipPath id={clipId}>
            <Circle cx="18" cy="18" r="18" />
          </ClipPath>
        </Defs>
        <G clipPath={`url(#${clipId})`}>
          <Circle cx="18" cy="18" r="18" fill="#C1272D" />
          {/* Moroccan 5-pointed star */}
          <Path
            d="M18 9.5 L19.9 15.3 H26 L21.1 18.9 L23 24.7 L18 21.1 L13 24.7 L14.9 18.9 L10 15.3 H16.1 Z"
            fill="none"
            stroke="#006233"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </G>
        <Circle cx="18" cy="18" r="17.5" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      </Svg>
    </View>
  );
};

// Morocco Flag Badge
export const MoroccoFlagBadge = ({ size = 26 }: { size?: number }) => {
  return (
    <View
      style={[
        styles.flagBadgeContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#fef2f2',
          borderWidth: 1,
          borderColor: '#fecaca',
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.6, textAlign: 'center' }}>🇲🇦</Text>
    </View>
  );
};

// France Flag Badge
export const FranceFlagBadge = ({ size = 26 }: { size?: number }) => {
  return (
    <View
      style={[
        styles.flagBadgeContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#eff6ff',
          borderWidth: 1,
          borderColor: '#bfdbfe',
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.6, textAlign: 'center' }}>🇫🇷</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  flagBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
