import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../theme/styles';
import { colors } from '../theme/tokens';
import { Icon } from './Icon';

export function ApiNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return <View style={styles.apiNotice}>
    <Icon name="cloud-offline-outline" size={14} color={colors.expense} />
    <Text style={styles.apiNoticeText}>{message}</Text>
  </View>;
}
