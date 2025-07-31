import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { useEffectEvent } from 'use-effect-event';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide: () => void;
}

// 常量定义
const CONSTANTS = {
  DEFAULT_DURATION: 3000,
  ANIMATION_DURATION: 300,
  MAX_WIDTH_RATIO: 0.8,
  Z_INDEX: 9999,
  BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.8)',
  TEXT_COLOR: 'white',
  FONT_SIZE: 16,
  LINE_HEIGHT: 22,
  PADDING_HORIZONTAL: 24,
  PADDING_VERTICAL: 12,
  BORDER_RADIUS: 8,
} as const;

const { width: screenWidth } = Dimensions.get('window');

export function Toast({ message, visible, duration = CONSTANTS.DEFAULT_DURATION, onHide }: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isShowing, setIsShowing] = useState(false);
  
  const onToastHide = useEffectEvent(() => {
    onHide();
  });

  // 显示动画
  const showAnimation = useCallback(() => {
    return Animated.timing(fadeAnim, {
      toValue: 1,
      duration: CONSTANTS.ANIMATION_DURATION,
      useNativeDriver: true,
    });
  }, [fadeAnim]);

  // 隐藏动画
  const hideAnimation = useCallback(() => {
    return Animated.timing(fadeAnim, {
      toValue: 0,
      duration: CONSTANTS.ANIMATION_DURATION,
      useNativeDriver: true,
    });
  }, [fadeAnim]);

  useEffect(() => {
    if (visible) {
      setIsShowing(true);
      showAnimation().start();

      // 自动隐藏
      const timer = setTimeout(() => {
        hideAnimation().start(() => {
          setIsShowing(false);
          onToastHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, showAnimation, hideAnimation, onToastHide]);

  // 样式定义
  const containerStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: CONSTANTS.Z_INDEX,
    pointerEvents: 'none' as const,
  }), []);

  const toastStyle = useMemo(() => ({
    opacity: fadeAnim,
    backgroundColor: CONSTANTS.BACKGROUND_COLOR,
    paddingHorizontal: CONSTANTS.PADDING_HORIZONTAL,
    paddingVertical: CONSTANTS.PADDING_VERTICAL,
    borderRadius: CONSTANTS.BORDER_RADIUS,
    maxWidth: screenWidth * CONSTANTS.MAX_WIDTH_RATIO,
  }), [fadeAnim]);

  const textStyle = useMemo(() => ({
    color: CONSTANTS.TEXT_COLOR,
    fontSize: CONSTANTS.FONT_SIZE,
    textAlign: 'center' as const,
    lineHeight: CONSTANTS.LINE_HEIGHT,
  }), []);

  if (!isShowing) {
    return null;
  }

  return (
    <View style={containerStyle}>
      <Animated.View style={toastStyle}>
        <Text style={textStyle}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}