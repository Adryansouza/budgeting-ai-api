import type { ReactNode } from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import React from 'react';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  variant?: 'balance' | 'category' | 'homeCategory' | 'categoryLight' | 'transaction';
  highlighted?: boolean;
};

export function GlassCard({
  children,
  style,
  contentStyle,
  variant = 'category',
  highlighted = false,
}: GlassCardProps) {
  const isBalance = variant === 'balance';
  const isHomeCategory = variant === 'homeCategory';
  const isLight = variant === 'categoryLight';
  const isTransaction = variant === 'transaction';

  /**
   * Blur propositalmente moderado.
   *
   * O efeito de vidro não deve depender apenas de blur.
   * Transparência + luz + contraste + highlight fazem a maior
   * parte do trabalho visual.
   */
  const blurIntensity = isBalance
    ? 28
    : isTransaction
      ? 18
      : isLight
        ? 22
        : isHomeCategory
          ? 13
          : 24;

  /**
   * Gradientes bem mais transparentes que na versão anterior.
   *
   * Antes o gradiente praticamente "pintava" o BlurView,
   * fazendo o card parecer uma View verde normal.
   */
  const surfaceGradient = isBalance
    ? [
      'rgba(137, 160, 101, 0.18)',
      'rgba(73, 94, 56, 0.10)',
      'rgba(17, 27, 14, 0.18)',
    ]
    : isLight
      ? [
        'rgba(255, 255, 255, 0.74)',
        'rgba(245, 248, 240, 0.67)',
        'rgba(224, 232, 216, 0.62)',
      ]
    : isHomeCategory
      ? [
        'rgba(106, 122, 79, 0.14)',
        'rgba(54, 66, 42, 0.12)',
        'rgba(14, 21, 12, 0.25)',
      ]
      : isTransaction
        ? [
          'rgba(137, 157, 108, 0.12)',
          'rgba(66, 84, 51, 0.08)',
          'rgba(18, 28, 15, 0.14)',
        ]
        : [
          'rgba(143, 166, 106, 0.16)',
          'rgba(76, 97, 57, 0.09)',
          'rgba(20, 31, 16, 0.17)',
        ];

  return (
    <View
      style={[
        glass.container,
        isBalance
          ? glass.balance
          : isTransaction
            ? glass.transaction
            : glass.category,
        style,
      ]}
    >
      {/* MATERIAL / GLASS */}
      <View
        pointerEvents="none"
        style={[
          glass.surfaceMask,

          isBalance
            ? glass.balanceMask
            : isLight
              ? glass.categoryLightMask
              : isHomeCategory
                ? glass.homeCategoryMask
                : isTransaction
                ? glass.transactionMask
                : glass.categoryMask,

          highlighted && glass.highlightedMask,
        ]}
      >
        {/* BLUR REAL DO CONTEÚDO ATRÁS */}
        <BlurView
          intensity={blurIntensity}
          tint={isLight ? 'light' : 'dark'}
          style={StyleSheet.absoluteFill}
        />

        {/* COR / TINGIMENTO DO VIDRO */}
        <LinearGradient
          colors={surfaceGradient as [string, string, ...string[]]}
          locations={[0, 0.52, 1]}
          start={{ x: 0.08, y: 0 }}
          end={{ x: 0.92, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* 
          REFLEXO SUPERIOR

          Agora ocupa somente a região superior do card.
          Isso cria uma sensação de luz incidindo sobre o vidro,
          em vez de simplesmente clarear a surface inteira.
        */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.14)',
            'rgba(255,255,255,0.055)',
            'rgba(255,255,255,0.018)',
            'rgba(255,255,255,0)',
          ]}
          locations={[0, 0.22, 0.55, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[glass.topGloss, isHomeCategory && glass.quietGloss]}
        />

        {/* 
          LUZ DIAGONAL MUITO SUTIL

          Evita aquele gradiente perfeitamente vertical,
          deixando o material menos "CSS genérico".
        */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.055)',
            'rgba(255,255,255,0.015)',
            'rgba(255,255,255,0)',
          ]}
          locations={[0, 0.42, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, isHomeCategory && glass.quietGloss]}
        />

        {/* REFLEXO FINO NA BORDA SUPERIOR */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.42)',
            'rgba(255,255,255,0.15)',
            'rgba(255,255,255,0.03)',
          ]}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={glass.edgeLight}
        />

        {/* 
          PEQUENA SOMBRA INTERNA NA PARTE INFERIOR.
          Ajuda a separar visualmente topo iluminado e base.
        */}
        {!isLight && (
          <LinearGradient
            colors={[
              'rgba(0,0,0,0)',
              'rgba(0,0,0,0.035)',
              'rgba(0,0,0,0.11)',
            ]}
            locations={[0, 0.55, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={glass.bottomDepth}
          />
        )}

      </View>

      {/* CONTEÚDO */}
      <View style={[glass.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

/* ============================================================
   GLASS ICON
   ============================================================ */

type GlassIconProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  muted?: boolean;
};

export function GlassIcon({
  children,
  style,
  muted = false,
}: GlassIconProps) {
  return (
    <View style={[glass.icon, style]}>
      {/* Base translúcida */}
      <BlurView
        intensity={20}
        tint="light"
        style={StyleSheet.absoluteFill}
      />

      {/* Material do botão */}
      <LinearGradient
        pointerEvents="none"
        colors={
          muted
            ? [
              'rgba(250,252,247,0.92)',
              'rgba(225,232,219,0.82)',
            ]
            : [
              'rgba(255,255,255,0.96)',
              'rgba(234,240,228,0.82)',
            ]
        }
        locations={[0, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Gloss do botão */}
      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(255,255,255,0.90)',
          'rgba(255,255,255,0.22)',
          'rgba(255,255,255,0)',
        ]}
        locations={[0, 0.4, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={glass.iconGloss}
      />

      {/* Reflexo superior */}
      <View
        pointerEvents="none"
        style={glass.iconHighlight}
      />

      {children}
    </View>
  );
}

/* ============================================================
   STYLES
   ============================================================ */

const glass = StyleSheet.create({
  /* ----------------------------------------------------------
     CONTAINER
     ---------------------------------------------------------- */

  container: {
    position: 'relative',

    borderRadius: 20,

    shadowColor: '#000000',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 4,
  },

  balance: {
    borderRadius: 24,

    shadowColor: '#050A04',
    shadowOpacity: 0.20,
    shadowRadius: 26,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 6,
  },

  category: {
    borderRadius: 20,

    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 7,
    },

    elevation: 3,
  },

  transaction: {
    borderRadius: 13,

    shadowOpacity: 0.11,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 2,
  },

  /* ----------------------------------------------------------
     SURFACE
     ---------------------------------------------------------- */

  surfaceMask: {
    ...StyleSheet.absoluteFill,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: 'rgba(235,245,225,0.10)',

    /**
     * MUITO mais transparente que antes.
     *
     * Isso permite que o BlurView e o conteúdo atrás
     * participem realmente do material.
     */
    backgroundColor: 'rgba(31,44,25,0.38)',
  },

  balanceMask: {
    borderRadius: 24,

    borderColor: 'rgba(220,236,194,0.16)',

    backgroundColor: 'rgba(39,55,30,0.42)',
  },

  categoryMask: {
    borderRadius: 20,

    borderColor: 'rgba(231,242,215,0.11)',

    backgroundColor: 'rgba(38,52,30,0.40)',
  },

  homeCategoryMask: {
    borderRadius: 20,
    borderColor: 'rgba(231,242,215,0.13)',
    backgroundColor: 'rgba(22,30,18,0.74)',
  },

  categoryLightMask: {
    borderRadius: 20,

    borderColor: 'rgba(255,255,255,0.46)',

    backgroundColor: 'rgba(238,243,233,0.60)',
  },

  transactionMask: {
    borderRadius: 13,

    borderColor: 'rgba(220,234,204,0.09)',

    backgroundColor: 'rgba(29,41,23,0.36)',
  },

  highlightedMask: {
    borderColor: 'rgba(185,246,0,0.42)',
  },

  /* ----------------------------------------------------------
     LIGHT / GLOSS
     ---------------------------------------------------------- */

  topGloss: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    /**
     * Antes era 72%.
     * Agora o reflexo fica concentrado no topo.
     */
    height: '38%',
  },

  quietGloss: {
    opacity: 0.56,
  },

  edgeLight: {
    position: 'absolute',

    top: 0,
    left: 12,
    right: 12,

    height: 1,

    opacity: 0.75,

    borderRadius: 999,
  },

  bottomDepth: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,

    height: '42%',
  },

  /* ----------------------------------------------------------
     CONTENT
     ---------------------------------------------------------- */

  content: {
    position: 'relative',
    zIndex: 1,
  },

  /* ----------------------------------------------------------
     ICON
     ---------------------------------------------------------- */

  icon: {
    width: 40,
    height: 40,

    borderRadius: 20,

    overflow: 'hidden',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.44)',

    backgroundColor: 'rgba(244,248,239,0.72)',

    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  iconGloss: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    height: '52%',
  },

  iconHighlight: {
    position: 'absolute',

    top: 1,
    left: 7,
    right: 7,

    height: 1,

    backgroundColor: 'rgba(255,255,255,0.92)',

    borderRadius: 999,
  },
});
