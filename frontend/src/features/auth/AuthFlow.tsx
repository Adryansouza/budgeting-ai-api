import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../../shared/theme/styles';
import { colors } from '../../shared/theme/tokens';

type AuthStage = 'onboarding' | 'login' | 'register' | 'recovery';

export function AuthFlow({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<AuthStage>('onboarding');
  const [slide, setSlide] = useState(0);
  const slides = [
    ['Registre seus gastos do seu jeito', 'Fale ou escreva como se estivesse apenas anotando.'],
    ['Fale ou escreva naturalmente', 'O Fluxo transforma uma frase curta em um lançamento claro.'],
    ['Entenda para onde seu dinheiro vai', 'Veja o que importa sem transformar sua rotina em planilhas.'],
  ];

  if (stage === 'onboarding') return <View style={styles.auth}>
    <Text style={styles.brand}>Fluxo</Text>
    <Text style={styles.authTitle}>{slides[slide][0]}</Text>
    <Text style={styles.authCopy}>{slides[slide][1]}</Text>
    <View style={styles.dots}>{slides.map((_, index) => <View key={index} style={[styles.dot, index === slide && styles.dotActive]} />)}</View>
    <Pressable style={styles.authButton} onPress={() => slide < 2 ? setSlide(slide + 1) : setStage('login')}>
      <LinearGradient pointerEvents="none" colors={['#D4FF54', '#C2F51C', '#AFE516']} locations={[0, 0.5, 1]} style={styles.authButtonGradient} />
      <View pointerEvents="none" style={styles.authButtonShine} />
      <Text style={styles.authButtonText}>{slide < 2 ? 'Continuar' : 'Começar'}</Text>
    </Pressable>
    <Pressable onPress={() => setStage('login')}><Text style={styles.authLink}>Pular</Text></Pressable>
  </View>;

  const isRegister = stage === 'register';
  const isRecovery = stage === 'recovery';
  const title = isRecovery ? 'Recupere sua senha' : isRegister ? 'Crie sua conta' : 'Bem-vindo de volta';
  const copy = isRecovery ? 'Enviaremos um link para redefinir sua senha.' : isRegister ? 'Comece a organizar sua vida financeira.' : 'Entre para acessar o seu Fluxo.';
  return <View style={styles.auth}>
    <Pressable onPress={() => setStage('login')}><Text style={styles.back}>← Voltar</Text></Pressable>
    <Text style={styles.brand}>Fluxo</Text><Text style={styles.authTitle}>{title}</Text><Text style={styles.authCopy}>{copy}</Text>
    {isRegister && <><Text style={styles.inputLabel}>Nome</Text><TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={colors.muted} /></>}
    <Text style={styles.inputLabel}>E-mail</Text><TextInput style={styles.input} placeholder="voce@email.com" placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" />
    {!isRecovery && <><Text style={styles.inputLabel}>Senha</Text><TextInput style={styles.input} placeholder="Sua senha" placeholderTextColor={colors.muted} secureTextEntry />{isRegister && <><Text style={styles.inputLabel}>Confirmar senha</Text><TextInput style={styles.input} placeholder="Confirme sua senha" placeholderTextColor={colors.muted} secureTextEntry /><Text style={styles.terms}>Ao criar sua conta, você concorda com os Termos de uso e a Política de privacidade.</Text></>}</>}
    <Pressable style={styles.authButton} onPress={isRecovery ? () => setStage('login') : onComplete}>
      <LinearGradient pointerEvents="none" colors={['#D4FF54', '#C2F51C', '#AFE516']} locations={[0, 0.5, 1]} style={styles.authButtonGradient} />
      <View pointerEvents="none" style={styles.authButtonShine} />
      <Text style={styles.authButtonText}>{isRecovery ? 'Enviar link' : isRegister ? 'Criar conta' : 'Entrar'}</Text>
    </Pressable>
    {!isRecovery && <Pressable onPress={() => setStage(stage === 'login' ? 'recovery' : 'login')}><Text style={styles.authLink}>{stage === 'login' ? 'Esqueci minha senha' : 'Já tenho uma conta'}</Text></Pressable>}
    {stage === 'login' && <Pressable onPress={() => setStage('register')}><Text style={styles.authLink}>Criar minha conta</Text></Pressable>}
  </View>;
}
