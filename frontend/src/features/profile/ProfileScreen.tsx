import { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { GlassCard } from '../../shared/components/GlassCard';
import { Icon } from '../../shared/components/Icon';
import { styles } from '../../shared/theme/styles';
import { colors } from '../../shared/theme/tokens';

// 1. Importamos o nosso Client HTTP e o nosso Model (Type) do Usuário
import { getPerfilUsuario } from '../../shared/api/client';
import type { UsuarioLogado } from '../../shared/domain/User';
import React from 'react';

export function ProfileScreen() {
  // 2. Criamos os estados para guardar o usuário, erros ou estado de carregamento
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // 3. O useEffect dispara a chamada à API do Spring Boot assim que a tela monta
  useEffect(() => {
    async function carregarDadosDoBanco() {
      try {
        setLoading(true);
        const dadosDoJava = await getPerfilUsuario();
        setUsuario(dadosDoJava); // Salva o nome e email no estado do React
      } catch (error) {
        setErro("Não foi possível carregar os dados do perfil.");
        console.error(error);
      } finally {
        setLoading(false); // Desliga o indicador de carregamento
      }
    }

    carregarDadosDoBanco();
  }, []);

  return (
    <ScrollView style={styles.pageScroll} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Perfil</Text>
      <Text style={styles.screenSubtitle}>Sua conta e preferências.</Text>
      
      <GlassCard variant="balance" style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Icon name="person-outline" size={28} color={colors.ink} />
        </View>

        {/* 4. Renderização Condicional Inteligente */}
        {loading ? (
          <ActivityIndicator size="small" color={colors.ink} style={{ marginTop: 10 }} />
        ) : erro ? (
          <>
            <Text style={styles.profileName}>Erro no Servidor</Text>
            <Text style={styles.profileMail}>{erro}</Text>
          </>
        ) : (
          <>
            {/* Se o usuário existir, exibe o Nome e Email vindos do Java! */}
            <Text style={styles.profileName}>{usuario?.nome}</Text>
            <Text style={styles.profileMail}>{usuario?.email}</Text>
          </>
        )}
      </GlassCard>
    </ScrollView>
  );
}
