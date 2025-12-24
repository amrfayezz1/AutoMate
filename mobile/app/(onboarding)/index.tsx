import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { useAppStore } from '@/stores/appStore';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  descriptionKey: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'car-sport',
    titleKey: 'onboarding.slide1Title',
    descriptionKey: 'onboarding.slide1Description',
  },
  {
    id: '2',
    icon: 'notifications',
    titleKey: 'onboarding.slide2Title',
    descriptionKey: 'onboarding.slide2Description',
  },
  {
    id: '3',
    icon: 'document-text',
    titleKey: 'onboarding.slide3Title',
    descriptionKey: 'onboarding.slide3Description',
  },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const setFirstLaunch = useAppStore((state) => state.setFirstLaunch);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const getSlideColor = (index: number) => {
    const colors = [theme.primary, theme.warning, theme.success];
    return colors[index] || theme.primary;
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    setFirstLaunch(false);
    router.replace('/(auth)/login');
  };

  const styles = createStyles(theme);

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => (
    <View style={styles.slide}>
      <View style={[styles.iconContainer, { backgroundColor: getSlideColor(index) + '20' }]}>
        <Ionicons name={item.icon} size={80} color={getSlideColor(index)} />
      </View>
      <Text style={styles.title}>{t(item.titleKey)}</Text>
      <Text style={styles.description}>{t(item.descriptionKey)}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        
        return (
          <Animated.View
            key={index}
            style={[styles.dot, { width: dotWidth, opacity, backgroundColor: theme.primary }]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>{t('common.skip')}</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Dots */}
      {renderDots()}

      {/* Bottom Actions */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1
              ? t('onboarding.getStarted')
              : t('common.next')}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    skipButton: {
      position: 'absolute',
      top: 60,
      right: Spacing.lg,
      zIndex: 10,
      padding: Spacing.sm,
    },
    skipText: {
      color: theme.textSecondary,
      fontSize: FontSizes.md,
    },
    slide: {
      width,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
    },
    iconContainer: {
      width: 160,
      height: 160,
      borderRadius: BorderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    title: {
      fontSize: FontSizes.xxxl,
      fontWeight: '700',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: Spacing.md,
    },
    description: {
      fontSize: FontSizes.lg,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 28,
      paddingHorizontal: Spacing.lg,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: Spacing.xl,
    },
    dot: {
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    bottomContainer: {
      paddingHorizontal: Spacing.lg,
    },
    nextButton: {
      backgroundColor: theme.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
    },
    nextButtonText: {
      color: '#FFF',
      fontSize: FontSizes.lg,
      fontWeight: '600',
    },
  });
