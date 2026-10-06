import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { styles } from '../theme/styles';
import { colors } from '../theme/tokens';

export type IconName = keyof typeof Ionicons.glyphMap;

export function Icon({ name, size = 20, color = colors.ink }: { name: IconName; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export function RoundIcon({ name, onPress }: { name: IconName; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={styles.iconButton}>
    <Icon name={name} size={17} color={colors.textSecondary} />
  </Pressable>;
}
