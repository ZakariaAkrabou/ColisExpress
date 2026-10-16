import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Infinite spinner animation
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    // Auto transition to login screen after 2.5s
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2600);

    return () => {
      spinLoop.stop();
      clearTimeout(timer);
    };
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Truck & Road City Background Image */}
      <ImageBackground
        source={require('../../assets/truck_banner.jpg')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Blue overlay matching the mockup theme */}
        <View style={styles.overlay} />

        {/* Content Container */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Slogan */}
          <Text style={styles.sloganText}>Vos colis, notre priorité</Text>
        </Animated.View>

        {/* Bottom Loading Indicator */}
        <View style={styles.loaderContainer}>
          <Animated.View
            style={[
              styles.spinnerCircle,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>

        {/* Bottom Stylized Curved Wave in Red & White */}
        <View style={styles.waveContainer} pointerEvents="none">
          <Svg
            width={width}
            height={85}
            viewBox={`0 0 ${width} 85`}
            fill="none"
          >
            {/* White wave border/accent */}
            <Path
              d={`M0,45 Q${width * 0.3},85 ${width * 0.7},35 T${width},15 L${width},85 L0,85 Z`}
              fill="#FFFFFF"
            />
            {/* Red accent ribbon wave */}
            <Path
              d={`M0,58 Q${width * 0.35},95 ${width * 0.75},42 T${width},25 L${width},85 L0,85 Z`}
              fill="#E11D48"
            />
          </Svg>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3C88',
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 60, 136, 0.82)',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: height * 0.16,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 220,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  sloganText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.4,
    opacity: 0.95,
    marginTop: 15,
  },
  loaderContainer: {
    alignItems: 'center',
    marginBottom: height * 0.12,
  },
  spinnerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderTopColor: '#FFFFFF',
    borderRightColor: '#FFFFFF',
    marginBottom: 10,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: width,
    height: 85,
  },
});
