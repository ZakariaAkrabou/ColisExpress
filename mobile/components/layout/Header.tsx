import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { Bell, MapPin } from 'lucide-react-native';

export interface HeaderProps {
  direction?: 'MA_TO_FR' | 'FR_TO_MA';
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  unreadNotifications?: boolean | number;
  title?: string;
  subtitle?: string;
  location?: string;
  onLocationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  direction = 'MA_TO_FR',
  onNotificationPress,
  unreadNotifications = true,
  title = 'ColisExpress',
  subtitle,
  location,
  onLocationPress,
}) => {
  const displayLocation =
    location ||
    subtitle ||
    (direction === 'MA_TO_FR' ? 'Maroc ➔ France' : 'France ➔ Maroc');

  return (
    <View style={styles.headerWrapper} className="bg-blue-700 pt-3 pb-3 px-4 shadow-md">
      <View style={styles.headerContainer} className="flex-row items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <View style={styles.brandContainer} className="flex-row items-center space-x-2.5 flex-1">
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/logo.jpeg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText} className="text-white text-lg font-bold tracking-tight">
              {title}
            </Text>
            
            {/* Location row */}
            <TouchableOpacity
              activeOpacity={onLocationPress ? 0.7 : 1}
              onPress={onLocationPress}
              disabled={!onLocationPress}
              style={styles.locationRow}
            >
              <MapPin size={13} color="#93c5fd" strokeWidth={2.4} style={styles.pinIcon} />
              <Text style={styles.subtitleText} className="text-blue-100 text-xs font-medium" numberOfLines={1}>
                {displayLocation}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          {onLocationPress ? (
            <TouchableOpacity
              onPress={onLocationPress}
              activeOpacity={0.7}
              style={styles.locationButton}
              accessibilityLabel="Afficher les localisations"
              accessibilityRole="button"
            >
              <MapPin size={18} color="#FFFFFF" strokeWidth={2.2} />
            </TouchableOpacity>
          ) : null}

          {/* Right: Notifications Bell with Badge */}
          <TouchableOpacity
            onPress={onNotificationPress}
            activeOpacity={0.7}
            style={styles.notificationButton}
            className="w-10 h-10 items-center justify-center rounded-full relative"
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Bell size={22} color="#FFFFFF" strokeWidth={2.2} />
            {unreadNotifications ? (
              <View style={styles.notificationDot} className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-400 rounded-full border border-blue-700" />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#1d4ed8',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingBottom: 14,
    paddingHorizontal: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  titleContainer: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pinIcon: {
    marginRight: 3,
  },
  subtitleText: {
    color: '#dbeafe',
    fontSize: 12,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#fb7185',
    borderWidth: 1.5,
    borderColor: '#1d4ed8',
  },
});
