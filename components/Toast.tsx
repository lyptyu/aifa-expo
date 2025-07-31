import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { useEffectEvent } from 'use-effect-event';
interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide: () => void;
}

const { width } = Dimensions.get('window');

export function Toast({ message, visible, duration = 3000, onHide }: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isShowing, setIsShowing] = useState(false);
  const onToastHide = useEffectEvent(()=>{
    onHide();
  })
  useEffect(() => {
    if (visible) {
      setIsShowing(true);
      // 显示动画
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // 自动隐藏
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsShowing(false);
          onToastHide()
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, duration]);

  if (!isShowing) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          maxWidth: width * 0.8,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}