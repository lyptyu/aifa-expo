import React from 'react';
import { Image, View } from 'react-native';

interface LogoProps {
  width: number;
  height: number;
  className?: string;
}

export default function Logo({ width, height, className }: LogoProps) {
  return (
    <View className="items-center">
      <Image 
        source={require('../assets/images/aifaicon.png')}
        style={{width, height}}
        className={className}
        resizeMode="contain"
      />
    </View>
  );
}