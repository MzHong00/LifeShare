import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

import { COLORS, SPACING } from '@/constants/theme';
import { useToastStore } from '@/stores/useToastStore';

export const Toast = () => {
  const { isVisible, options } = useToastStore();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isVisible) {
      // 쇼 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 하이드 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 15,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, slideAnim]);

  if (!isVisible && (fadeAnim as any)._value === 0) return null;

  const renderIcon = () => {
    const iconSize = 20;

    switch (options.type) {
      case 'success':
        return <CheckCircle2 size={iconSize} color={COLORS.success} />;
      case 'error':
        return <AlertCircle size={iconSize} color={COLORS.error} />;
      default:
        return <Info size={iconSize} color={COLORS.primary} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom:
            insets.bottom + SPACING.layout + (Platform.OS === 'ios' ? 0 : 20),
        },
      ]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          styles.toast,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.iconWrapper}>{renderIcon()}</View>
          <Text style={styles.message}>{options.message}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    backgroundColor: 'rgba(25, 31, 40, 0.5)', // 투명도가 적용된 Toss-style 다크 그레이
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '90%',
    maxWidth: 400,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    lineHeight: 20,
  },
});
