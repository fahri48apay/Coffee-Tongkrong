// 03 · Welcome — animasi seremoni kontinu (gabungan state A+B board Penpot):
// ring scale-in .9s bezier(.22,1,.36,1) · uap 3 path naik 16→-4px op .2→.85
// (1,3s ease-out, delay 200/450/620ms) · badge pop .42s back-easing delay 750ms
// · mark naik 4px. Dwell 2100ms → dissolve ke Pilih Cara (TIMING demo).
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CupMark } from "../components/splash/CupMark";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const DWELL_MS = 2100;        // TIMING.WELCOME_DWELL (demo) — paritas §3
const REDUCED_DWELL_MS = 1400;

const STEAM_PATHS = [
  { d: "M22 64 C14 52 30 46 22 34 C16 25 24 18 28 10", delay: 200 },
  { d: "M42 68 C34 54 50 48 42 34 C36 23 44 16 48 6", delay: 450 },
  { d: "M62 64 C54 52 70 46 62 34 C56 25 64 18 68 10", delay: 620 },
] as const;

const outQuad = Easing.out(Easing.quad);
const backBezier = Easing.bezier(...theme.motion.easingBezier.back);

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const reduce = useReducedMotion();

  // ring: scale .72→1 + opacity 0→.5 + naik 4px ("mark naik" §4)
  const ringScale = useSharedValue(reduce ? 1 : 0.72);
  const ringOpacity = useSharedValue(reduce ? 0.5 : 0);
  const blockY = useSharedValue(reduce ? 0 : 4);

  // badge pop: scale .6→1, op 0→1 (delay 750ms)
  const badgeScale = useSharedValue(reduce ? 1 : 0.6);
  const badgeOp = useSharedValue(reduce ? 1 : 0);

  // uap: 3 path — translateY 16→-4, opacity .2→.85 (delay per path)
  const s1y = useSharedValue(reduce ? -4 : 16);
  const s2y = useSharedValue(reduce ? -4 : 16);
  const s3y = useSharedValue(reduce ? -4 : 16);
  const s1o = useSharedValue(reduce ? 0.85 : 0.2);
  const s2o = useSharedValue(reduce ? 0.85 : 0.2);
  const s3o = useSharedValue(reduce ? 0.85 : 0.2);

  useEffect(() => {
    if (!reduce) {
      const ringDur = 900;
      const ringEase = Easing.bezier(0.22, 1, 0.36, 1); // ringIn CSS
      ringScale.value = withTiming(1, { duration: ringDur, easing: ringEase });
      ringOpacity.value = withTiming(0.5, { duration: ringDur, easing: ringEase });
      blockY.value = withTiming(0, { duration: 550, easing: outQuad });

      badgeScale.value = withDelay(
        750, withTiming(1, { duration: 420, easing: backBezier }));
      badgeOp.value = withDelay(750, withTiming(1, { duration: 420, easing: outQuad }));

      [s1y, s2y, s3y].forEach((sv, i) => {
        sv.value = withDelay(STEAM_PATHS[i].delay,
          withTiming(-4, { duration: 1300, easing: outQuad }));
      });
      [s1o, s2o, s3o].forEach((sv, i) => {
        sv.value = withDelay(STEAM_PATHS[i].delay,
          withTiming(0.85, { duration: 1300, easing: outQuad }));
      });
    }
    const t = setTimeout(
      () => navigation.replace("PilihCara"),
      reduce ? REDUCED_DWELL_MS : DWELL_MS,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, navigation]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }, { translateY: blockY.value }],
    opacity: ringOpacity.value,
  }));
  const sA = useAnimatedStyle(() => ({
    transform: [{ translateY: s1y.value }], opacity: s1o.value,
  }));
  const sB = useAnimatedStyle(() => ({
    transform: [{ translateY: s2y.value }], opacity: s2o.value,
  }));
  const sC = useAnimatedStyle(() => ({
    transform: [{ translateY: s3y.value }], opacity: s3o.value,
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOp.value,
  }));

  return (
    <View style={styles.screen}>
      <View style={styles.center}>
        {/* uap — overlap ke atas cangkir (marginBottom -58 paritas CSS) */}
        <View style={styles.steamWrap} pointerEvents="none">
          <Animated.View style={[StyleSheet.absoluteFill, sA]}>
            <Svg width={84} height={72} viewBox="0 0 84 72">
              <Path d={STEAM_PATHS[0].d} stroke={theme.color.textPrimary}
                strokeWidth={4.5} strokeLinecap="round" fill="none" />
            </Svg>
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, sB]}>
            <Svg width={84} height={72} viewBox="0 0 84 72">
              <Path d={STEAM_PATHS[1].d} stroke={theme.color.textPrimary}
                strokeWidth={4.5} strokeLinecap="round" fill="none" />
            </Svg>
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, sC]}>
            <Svg width={84} height={72} viewBox="0 0 84 72">
              <Path d={STEAM_PATHS[2].d} stroke={theme.color.textPrimary}
                strokeWidth={4.5} strokeLinecap="round" fill="none" />
            </Svg>
          </Animated.View>
        </View>

        <Animated.View style={[styles.ring, ringStyle]}>
          <View style={styles.cupBadge}>
            <CupMark size={58} />
            <Animated.View style={[styles.badge, badgeStyle]}>
              <Svg width={56} height={56} viewBox="0 0 56 56">
                <Circle cx={28} cy={28} r={26} fill={theme.color.accent} />
                <Path d="M17 29 L25 37 L39 21" stroke="#FFFFFF" strokeWidth={5}
                  strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </Svg>
            </Animated.View>
          </View>
        </Animated.View>

        <Text style={styles.title}>Selamat datang!</Text>
        <Text style={styles.subtitle}>Kopi hangat dan cerita menantimu.</Text>

        {/* loader titik — bounce loop 1,1s, delay berjenjang */}
        <View style={styles.loader}>
          {[0, 1, 2].map((i) => (
            <LoaderDot key={i} big={i === 1} baseDelay={i * 180} paused={!!reduce} />
          ))}
        </View>
      </View>
    </View>
  );
}

// eslint-disable-next-line react-hooks/rules-of-hooks -- komponen terpisah, hook aman
function LoaderDot({ big, baseDelay, paused }: { big: boolean; baseDelay: number; paused: boolean }) {
  const y = useSharedValue(0);
  useEffect(() => {
    if (paused) return;
    y.value = withDelay(baseDelay, withRepeat(
      withSequence(
        withTiming(-6, { duration: 370, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 370, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    ));
  }, [paused, baseDelay, y]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={[
      styles.dot, big && styles.dotBig, !big && styles.dotDim, st,
    ]} />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.base },
  center: { flex: 1, alignItems: "center", paddingTop: 292 }, // .ring margin-top 292
  steamWrap: {
    width: 84, height: 72, marginBottom: -58, zIndex: 2,
    alignItems: "center", justifyContent: "flex-end",
  },
  ring: {
    width: 148, height: 148, borderRadius: theme.radius.full,
    borderWidth: 1.5, borderColor: theme.color.caramel, opacity: 0.5,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(201,138,75,0.06)",
  },
  cupBadge: { position: "relative" },
  badge: {
    position: "absolute",
    right: -26, bottom: -14,
    width: 62, height: 62, // final state B (delta §4: 56 → 62)
  },
  title: {
    fontSize: 22, lineHeight: 30,
    fontFamily: theme.fontFamily.extrabold,
    color: theme.color.textPrimary,
    marginTop: 36, // Penpot QA fix: title y476 − ring bottom 440 = 36
  },
  subtitle: {
    fontSize: theme.type.label.fontSize,
    lineHeight: theme.type.label.lineHeight,
    color: theme.color.textSecondary,
    marginTop: 6, // Penpot QA fix: sub y512 − title bottom 506 = 6
    fontFamily: theme.fontFamily.medium,
  },
  loader: {
    flexDirection: "row", gap: 7, alignItems: "center",
    position: "absolute", bottom: 110, alignSelf: "center",
  },
  dot: {
    width: 9, height: 9, borderRadius: theme.radius.full,
    backgroundColor: theme.color.accent, opacity: 0.45,
  },
  dotBig: { width: 11, height: 11, opacity: 1 },
  dotDim: { opacity: 0.45 },
});
