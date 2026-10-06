import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { GlassCard } from '../../shared/components/GlassCard';
import { Icon } from '../../shared/components/Icon';
import { styles } from '../../shared/theme/styles';
import { colors } from '../../shared/theme/tokens';

export function ProfileScreen() {
  return <ScrollView style={styles.pageScroll} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Text style={styles.screenTitle}>Perfil</Text><Text style={styles.screenSubtitle}>Sua conta e preferências.</Text>
    <GlassCard variant="balance" style={styles.profileCard}><View style={styles.profileAvatar}><Icon name="person-outline" size={28} color={colors.ink} /></View><Text style={styles.profileName}>Perfil indisponível</Text><Text style={styles.profileMail}>A API ainda não fornece dados de usuário.</Text></GlassCard>
  </ScrollView>;
}
