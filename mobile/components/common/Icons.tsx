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
