import React, { useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { withSpring, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '../../shared/components/Icon';
import { pageSpring } from '../../shared/domain/navigation';
import { styles } from '../../shared/theme/styles';
import { colors } from '../../shared/theme/tokens';

export type SheetState = 'closed' | 'entry' | 'recording' | 'success';

type EntryModalProps = {
  state: SheetState; entry: string; onChange: (value: string) => void; onClose: () => void;
  onRecord: () => void; onStop: () => void; onSave: () => void; onHistory: () => void;
  error: string | null; saving: boolean; successMessage: string;
};

export function EntryModal({ state, entry, onChange, onClose, onRecord, onStop, onSave, onHistory, error, saving, successMessage }: EntryModalProps) {
  const sheetDragY = useSharedValue(0);
  const sheetDragStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetDragY.value }] }));
  useEffect(() => { sheetDragY.value = 0; }, [sheetDragY, state]);
  const dismissGesture = useMemo(() => Gesture.Pan()
    .activeOffsetY(12)
    .failOffsetX([-18, 18])
    .onUpdate((event) => { sheetDragY.value = Math.max(0, event.translationY); })
    .onEnd((event) => {
      if (event.translationY > 105 || event.velocityY > 850) {
        sheetDragY.value = withTiming(Math.max(event.translationY + 220, 320), { duration: 110 }, (finished) => {
          if (finished) scheduleOnRN(onClose);
        });
      } else sheetDragY.value = withSpring(0, pageSpring);
    })
    .onFinalize((_event, success) => { if (!success) sheetDragY.value = withSpring(0, pageSpring); }), [onClose, sheetDragY]);

  if (state === 'closed') return null;
  if (state === 'success') return <Modal visible transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalSuccess}><View style={styles.successCard}>
      <View style={styles.successBadge}><Icon name="checkmark" size={34} /></View>
      <Text style={styles.successTitle}>Lançamento processado</Text><Text style={styles.successMeta}>{successMessage}</Text>
      <View style={[styles.sheetActions, { width: '100%', marginTop: 28 }]}>
        <Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryText}>Fechar</Text></Pressable>
        <Pressable style={styles.primaryButton} onPress={onHistory}><Text style={styles.primaryText}>Ver histórico</Text></Pressable>
      </View>
    </View></View>
  </Modal>;

  return <Modal visible transparent animationType="slide" onRequestClose={onClose}>
    <GestureHandlerRootView style={styles.modalKeyboard}>
      <KeyboardAvoidingView style={styles.modalKeyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.overlay}>
          <Pressable accessibilityRole="button" accessibilityLabel="Fechar registro" onPress={onClose} style={styles.modalBackdrop} />
          <GestureDetector gesture={dismissGesture}>
            <Animated.View style={[styles.sheet, sheetDragStyle]}>
              <LinearGradient pointerEvents="none" colors={['#2C3A25', '#172014']} style={styles.sheetGradient} />
              <View style={styles.sheetHandleArea}><View style={styles.sheetHandle} /></View>
              {state === 'recording' ? <View style={styles.recording}>
                <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Ouvindo...</Text><CloseButton onClose={onClose} /></View>
                <View style={styles.wave}>{[20, 36, 50, 30, 43, 24, 46].map((height, index) => <View key={index} style={[styles.waveBar, { height }]} />)}</View>
                <Text style={styles.recordingText}>Pode falar naturalmente.</Text>
                <View style={[styles.sheetActions, { width: '100%' }]}>
                  <Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryText}>Cancelar</Text></Pressable>
                  <Pressable style={[styles.primaryButton, { backgroundColor: colors.expense }]} onPress={onStop}><Icon name="stop" size={15} /><Text style={styles.primaryText}>Parar</Text></Pressable>
                </View>
              </View> : <>
                <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Registrar agora</Text><CloseButton onClose={onClose} /></View>
                <Text style={styles.sheetCopy}>Escreva do seu jeito ou fale para registrar.</Text>
                <ScrollView style={styles.entryFormScroll} contentContainerStyle={styles.entryFormContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                  <TextInput value={entry} onChangeText={onChange} placeholder="Ex.: Gastei 35 reais no Uber" placeholderTextColor={colors.muted} style={styles.textArea} multiline blurOnSubmit={false} returnKeyType="default" />
                </ScrollView>
                {error && <Text style={styles.apiErrorText}>{error}</Text>}
                <View style={styles.sheetActions}>
                  <Pressable style={styles.secondaryButton} onPress={onRecord}><Icon name="mic-outline" size={18} /><Text style={styles.secondaryText}>Falar</Text></Pressable>
                  <Pressable disabled={saving} style={[styles.primaryButton, saving && { opacity: 0.7 }]} onPress={onSave}><Text style={styles.primaryText}>{saving ? 'Enviando...' : 'Confirmar'}</Text></Pressable>
                </View>
              </>}
            </Animated.View>
          </GestureDetector>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  </Modal>;
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel="Fechar registro" onPress={onClose} style={styles.sheetClose}>
    <Icon name="close" size={19} color={colors.textPrimary} />
  </Pressable>;
}
