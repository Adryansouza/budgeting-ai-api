import React, { useEffect, useState } from 'react';

import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';


// ================================================================
// CONFIGURAÇÕES
// ================================================================

type AuthStage = 'welcome' | 'login';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);


// ================================================================
// FINANCIAL FLOW
// ================================================================

function FinancialFlow() {
  const movement = useSharedValue(0);
  const pulse = useSharedValue(0);
  const secondaryMovement = useSharedValue(0);

  useEffect(() => {
    movement.value = withRepeat(
      withTiming(1, {
        duration: 8000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    secondaryMovement.value = withRepeat(
      withTiming(1, {
        duration: 11000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    pulse.value = withRepeat(
      withTiming(1, {
        duration: 2400,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);


  // ==============================================================
  // CURVA PRINCIPAL
  // ==============================================================

  const mainPathProps = useAnimatedProps(() => {
    const offset = interpolate(
      movement.value,
      [0, 1],
      [-10, 14]
    );

    const vertical = interpolate(
      movement.value,
      [0, 1],
      [0, -12]
    );

    return {
      d: `
        M -30 ${315 + vertical}

        C 40 ${290 + offset},
          65 ${210 - offset},
          135 ${225 + vertical}

        C 210 ${245 - offset},
          235 ${330 + offset},
          310 ${290 + vertical}

        C 375 ${255 - offset},
          390 ${145 + offset},
          465 ${165 + vertical}

        C 535 ${185 - offset},
          560 ${115 + offset},
          650 ${80 + vertical}
      `,
    };
  });


  // ==============================================================
  // CURVA SECUNDÁRIA
  // ==============================================================

  const secondaryPathProps = useAnimatedProps(() => {
    const offset = interpolate(
      secondaryMovement.value,
      [0, 1],
      [-18, 18]
    );

    return {
      d: `
        M -40 390

        C 50 ${350 + offset},
          100 ${270 - offset},
          180 300

        C 260 ${330 + offset},
          280 ${395 - offset},
          360 350

        C 450 ${300 + offset},
          500 ${210 - offset},
          650 190
      `,
    };
  });


  // ==============================================================
  // TERCEIRA ONDA
  // ==============================================================

  const backgroundPathProps = useAnimatedProps(() => {
    const offset = interpolate(
      movement.value,
      [0, 1],
      [12, -12]
    );

    return {
      d: `
        M -50 470

        C 70 ${430 + offset},
          130 ${370 - offset},
          220 405

        C 300 ${440 + offset},
          360 ${480 - offset},
          430 420

        C 500 ${360 + offset},
          550 ${300 - offset},
          680 280
      `,
    };
  });


  // ==============================================================
  // PONTOS
  // ==============================================================

  const pointProps = useAnimatedProps(() => {
    const radius = interpolate(
      pulse.value,
      [0, 1],
      [4, 7]
    );

    const opacity = interpolate(
      pulse.value,
      [0, 1],
      [0.65, 1]
    );

    return {
      r: radius,
      opacity,
    };
  });


  const glowProps = useAnimatedProps(() => {
    const radius = interpolate(
      pulse.value,
      [0, 1],
      [14, 26]
    );

    const opacity = interpolate(
      pulse.value,
      [0, 1],
      [0.14, 0.03]
    );

    return {
      r: radius,
      opacity,
    };
  });


  // ==============================================================
  // MOVIMENTO DO CONTAINER
  // ==============================================================

  const containerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      secondaryMovement.value,
      [0, 1],
      [-4, 4]
    );

    return {
      transform: [
        {
          translateX,
        },
      ],
    };
  });


  // ==============================================================
  // SVG
  // ==============================================================

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.flowContainer,
        containerStyle,
      ]}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 600 520"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>

          {/* LINHA PRINCIPAL */}

          <SvgLinearGradient
            id="mainLine"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <Stop
              offset="0"
              stopColor="#C2F51C"
              stopOpacity="0"
            />

            <Stop
              offset="0.20"
              stopColor="#C2F51C"
              stopOpacity="0.75"
            />

            <Stop
              offset="0.65"
              stopColor="#D6FF54"
              stopOpacity="1"
            />

            <Stop
              offset="1"
              stopColor="#C2F51C"
              stopOpacity="0"
            />
          </SvgLinearGradient>


          {/* LINHA SECUNDÁRIA */}

          <SvgLinearGradient
            id="secondaryLine"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <Stop
              offset="0"
              stopColor="#C2F51C"
              stopOpacity="0"
            />

            <Stop
              offset="0.5"
              stopColor="#C2F51C"
              stopOpacity="0.22"
            />

            <Stop
              offset="1"
              stopColor="#C2F51C"
              stopOpacity="0"
            />
          </SvgLinearGradient>

        </Defs>


        {/* LINHAS VERTICAIS DE FUNDO */}

        <Path
          d="
            M 80 70
            L 80 450

            M 220 50
            L 220 450

            M 360 50
            L 360 450

            M 500 50
            L 500 450
          "
          stroke="#C2F51C"
          strokeWidth="1"
          strokeOpacity="0.035"
          strokeDasharray="4 12"
        />


        {/* ONDA DE FUNDO */}

        <AnimatedPath
          animatedProps={backgroundPathProps}
          fill="none"
          stroke="#C2F51C"
          strokeWidth="1"
          strokeOpacity="0.055"
        />


        {/* ONDA SECUNDÁRIA */}

        <AnimatedPath
          animatedProps={secondaryPathProps}
          fill="none"
          stroke="url(#secondaryLine)"
          strokeWidth="1.2"
        />


        {/* GLOW DA ONDA PRINCIPAL */}

        <AnimatedPath
          animatedProps={mainPathProps}
          fill="none"
          stroke="#C2F51C"
          strokeWidth="16"
          strokeOpacity="0.018"
        />


        {/* ONDA PRINCIPAL */}

        <AnimatedPath
          animatedProps={mainPathProps}
          fill="none"
          stroke="url(#mainLine)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />


        {/* PONTO 1 */}

        <AnimatedCircle
          cx="135"
          cy="225"
          fill="#C2F51C"
          animatedProps={glowProps}
        />

        <AnimatedCircle
          cx="135"
          cy="225"
          fill="#DFFF75"
          animatedProps={pointProps}
        />


        {/* PONTO 2 */}

        <AnimatedCircle
          cx="465"
          cy="165"
          fill="#C2F51C"
          animatedProps={glowProps}
        />

        <AnimatedCircle
          cx="465"
          cy="165"
          fill="#DFFF75"
          animatedProps={pointProps}
        />

      </Svg>
    </Animated.View>
  );
}


// ================================================================
// AUTH FLOW
// ================================================================

export function AuthFlow({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [stage, setStage] =
    useState<AuthStage>('welcome');


  // ==============================================================
  // WELCOME
  // ==============================================================

  if (stage === 'welcome') {
    return (
      <View style={styles.container}>

        <StatusBar
          barStyle="light-content"
          backgroundColor="#0D1414"
        />


        {/* ======================================================
            ANIMAÇÃO PRINCIPAL
        ====================================================== */}

        <View style={styles.hero}>

          <FinancialFlow />

          <View
            pointerEvents="none"
            style={styles.heroGlow}
          />

          <LinearGradient
            pointerEvents="none"
            colors={[
              'rgba(13,20,20,0)',
              'rgba(13,20,20,0.15)',
              '#0D1414',
            ]}
            locations={[
              0,
              0.55,
              1,
            ]}
            style={styles.heroFade}
          />

        </View>


        {/* ======================================================
            CONTEÚDO
        ====================================================== */}

        <View style={styles.content}>

          <View>

            <Text style={styles.title}>
              Seu dinheiro.{'\n'}
              Do seu jeito.
            </Text>

            <Text style={styles.subtitle}>
              Acompanhe sua vida financeira de forma simples,
              clara e sem complicação.
            </Text>

          </View>


          {/* ====================================================
              FOOTER
          ==================================================== */}

          <View style={styles.footer}>

            <Pressable
              onPress={() => setStage('login')}
              hitSlop={12}
              style={({ pressed }) => [
                styles.loginLink,
                pressed && {
                  opacity: 0.5,
                },
              ]}
            >
              <Text style={styles.loginText}>
                Entrar
              </Text>
            </Pressable>


            <Pressable
              onPress={() => setStage('login')}
              accessibilityRole="button"
              accessibilityLabel="Continuar"
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                pointerEvents="none"
                colors={[
                  '#D7FF4A',
                  '#C2F51C',
                  '#AFE500',
                ]}
                locations={[
                  0,
                  0.55,
                  1,
                ]}
                style={StyleSheet.absoluteFill}
              />

              <Text style={styles.arrow}>
                →
              </Text>

            </Pressable>

          </View>

        </View>

      </View>
    );
  }


  // ==============================================================
  // LOGIN
  // ==============================================================

  return (
    <View style={styles.loginScreen}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#0D1414"
      />


      {/* ========================================================
          ONDAS NO FUNDO
      ======================================================== */}

      <View
        pointerEvents="none"
        style={styles.loginFlow}
      >
        <FinancialFlow />

        <LinearGradient
          colors={[
            'rgba(13,20,20,0.10)',
            'rgba(13,20,20,0.55)',
            '#0D1414',
          ]}
          locations={[
            0,
            0.55,
            1,
          ]}
          style={StyleSheet.absoluteFill}
        />
      </View>


      {/* ========================================================
          HEADER
      ======================================================== */}

      <View style={styles.loginHeader}>

        <Pressable
          onPress={() => setStage('welcome')}
          hitSlop={14}
          style={({ pressed }) => [
            styles.backButton,
            pressed && {
              opacity: 0.5,
            },
          ]}
        >
          <Text style={styles.backArrow}>
            ←
          </Text>
        </Pressable>


        <Text style={styles.loginBrand}>
          Fluxo
        </Text>

      </View>


      {/* ========================================================
          CONTEÚDO
      ======================================================== */}

      <View style={styles.loginContent}>

        <View>

          <Text style={styles.loginEyebrow}>
            BEM-VINDO DE VOLTA
          </Text>

          <Text style={styles.loginTitle}>
            Continue seu{'\n'}
            <Text style={styles.loginTitleAccent}>
              fluxo.
            </Text>
          </Text>

          <Text style={styles.loginSubtitle}>
            Entre para acessar sua vida financeira.
          </Text>

        </View>


        {/* ======================================================
            FORMULÁRIO
        ====================================================== */}

        <View style={styles.form}>

          <View>

            <Text style={styles.fieldLabel}>
              E-mail
            </Text>

            <TextInput
              style={styles.field}
              placeholder="voce@email.com"
              placeholderTextColor="#4D5958"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#C2F51C"
            />

          </View>


          <View style={styles.passwordField}>

            <Text style={styles.fieldLabel}>
              Senha
            </Text>

            <TextInput
              style={styles.field}
              placeholder="••••••••"
              placeholderTextColor="#4D5958"
              secureTextEntry
              selectionColor="#C2F51C"
            />

          </View>

        </View>

      </View>


      {/* ========================================================
          BOTÃO
      ======================================================== */}

      <View style={styles.loginFooter}>

        <Pressable
          onPress={onComplete}
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
          ]}
        >

          <LinearGradient
            pointerEvents="none"
            colors={[
              '#D7FF4A',
              '#C2F51C',
              '#AFE500',
            ]}
            locations={[
              0,
              0.55,
              1,
            ]}
            style={StyleSheet.absoluteFill}
          />


          <Text style={styles.loginButtonText}>
            Entrar
          </Text>


          <View style={styles.loginButtonArrowContainer}>
            <Text style={styles.loginButtonArrow}>
              →
            </Text>
          </View>

        </Pressable>

      </View>

    </View>
  );
}


// ================================================================
// STYLES
// ================================================================

const styles = StyleSheet.create({

  // ==============================================================
  // WELCOME
  // ==============================================================

  container: {
    flex: 1,

    backgroundColor: '#0D1414',

    paddingHorizontal: 30,
    paddingBottom: 42,
  },


  // ==============================================================
  // HERO
  // ==============================================================

  hero: {
    height: SCREEN_HEIGHT * 0.49,

    marginHorizontal: -30,

    position: 'relative',

    overflow: 'hidden',
  },


  flowContainer: {
    ...StyleSheet.absoluteFillObject,

    top: 15,

    opacity: 0.95,
  },


  heroGlow: {
    position: 'absolute',

    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,

    borderRadius: SCREEN_WIDTH,

    backgroundColor: '#C2F51C',

    opacity: 0.025,

    top: 20,
    right: -SCREEN_WIDTH * 0.25,
  },


  heroFade: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,

    height: 150,
  },


  // ==============================================================
  // WELCOME CONTENT
  // ==============================================================

  content: {
    flex: 1,

    justifyContent: 'space-between',

    paddingTop: 5,
  },


  title: {
    color: '#FFFFFF',

    fontSize: 48,
    lineHeight: 52,

    fontWeight: '700',

    letterSpacing: -2,

    maxWidth: 350,
  },


  subtitle: {
    color: '#667171',

    fontSize: 15,
    lineHeight: 22,

    maxWidth: 300,

    marginTop: 19,
  },


  // ==============================================================
  // WELCOME FOOTER
  // ==============================================================

  footer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
  },


  loginLink: {
    paddingVertical: 10,
    paddingRight: 15,
  },


  loginText: {
    color: '#8C9696',

    fontSize: 15,

    fontWeight: '500',

    textDecorationLine: 'underline',
  },


  button: {
    width: 72,
    height: 72,

    borderRadius: 36,

    overflow: 'hidden',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#C2F51C',

    shadowOpacity: 0.15,

    shadowRadius: 20,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 6,
  },


  buttonPressed: {
    transform: [
      {
        scale: 0.93,
      },
    ],

    opacity: 0.9,
  },


  arrow: {
    color: '#0D1414',

    fontSize: 32,
    lineHeight: 34,

    fontWeight: '600',

    marginTop: -3,
  },


  // ==============================================================
  // LOGIN
  // ==============================================================

  loginScreen: {
    flex: 1,

    backgroundColor: '#0D1414',

    paddingHorizontal: 30,

    paddingTop: 18,
    paddingBottom: 38,

    overflow: 'hidden',
  },


  // ==============================================================
  // LOGIN BACKGROUND
  // ==============================================================

  loginFlow: {
    position: 'absolute',

    width: SCREEN_WIDTH * 1.25,
    height: SCREEN_HEIGHT * 0.48,

    top: -105,
    right: -SCREEN_WIDTH * 0.45,

    opacity: 0.28,

    transform: [
      {
        rotate: '-5deg',
      },
    ],
  },


  // ==============================================================
  // LOGIN HEADER
  // ==============================================================

  loginHeader: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    zIndex: 10,
  },


  backButton: {
    width: 44,
    height: 44,

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.035)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.06)',
  },


  backArrow: {
    color: '#FFFFFF',

    fontSize: 22,
    lineHeight: 24,

    marginTop: -2,
  },


  loginBrand: {
    color: '#C2F51C',

    fontSize: 20,

    fontWeight: '700',

    letterSpacing: -0.7,
  },


  // ==============================================================
  // LOGIN CONTENT
  // ==============================================================

  loginContent: {
    flex: 1,

    justifyContent: 'center',

    marginTop: -15,

    zIndex: 5,
  },


  loginEyebrow: {
    color: '#C2F51C',

    fontSize: 11,

    fontWeight: '700',

    letterSpacing: 2,

    marginBottom: 15,
  },


  loginTitle: {
    color: '#FFFFFF',

    fontSize: 48,
    lineHeight: 51,

    fontWeight: '700',

    letterSpacing: -2,
  },


  loginTitleAccent: {
    color: '#C2F51C',
  },


  loginSubtitle: {
    color: '#667171',

    fontSize: 15,
    lineHeight: 22,

    marginTop: 17,

    maxWidth: 280,
  },


  // ==============================================================
  // FORM
  // ==============================================================

  form: {
    marginTop: 46,
  },


  passwordField: {
    marginTop: 22,
  },


  fieldLabel: {
    color: '#A0AAAA',

    fontSize: 12,

    fontWeight: '600',

    marginBottom: 9,

    letterSpacing: 0.3,
  },


  field: {
    width: '100%',
    height: 58,

    paddingHorizontal: 18,

    color: '#FFFFFF',

    fontSize: 15,

    backgroundColor: 'rgba(255,255,255,0.035)',

    borderRadius: 17,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.07)',
  },


  // ==============================================================
  // LOGIN FOOTER
  // ==============================================================

  loginFooter: {
    zIndex: 5,
  },


  loginButton: {
    height: 64,

    borderRadius: 20,

    overflow: 'hidden',

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    position: 'relative',

    shadowColor: '#C2F51C',

    shadowOpacity: 0.12,

    shadowRadius: 20,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 5,
  },


  loginButtonPressed: {
    transform: [
      {
        scale: 0.98,
      },
    ],

    opacity: 0.9,
  },


  loginButtonText: {
    color: '#0D1414',

    fontSize: 16,

    fontWeight: '700',
  },


  loginButtonArrowContainer: {
    position: 'absolute',

    right: 8,

    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor: 'rgba(13,20,20,0.09)',

    justifyContent: 'center',
    alignItems: 'center',
  },


  loginButtonArrow: {
    color: '#0D1414',

    fontSize: 23,

    fontWeight: '600',

    marginTop: -2,
  },

});