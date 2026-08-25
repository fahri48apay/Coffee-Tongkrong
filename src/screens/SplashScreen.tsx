// 01 · Splash — smoke test paritas board "01/01b · Splash" (HANDOFF.md §4).
// Timing terkunci §3: tahan 1800ms → dissolve 800ms ease-in-out → Login.
// Data bean = demo.html BEANS dengan durasi dibagi 1,25 (produksi).
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Bean } from "../components/splash/Bean";
import { CupMark } from "../components/splash/CupMark";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const HOLD_MS = 1800;        // --dur? bukan token: pacing sinematik §3
const DISSOLVE_MS = 800;     // theme.motion.durationMs.splashDissolve
const REDUCED_HOLD_MS = 800; // reduced-motion: tanpa float, tunggu singkat

// [size, x, y, rot, amplitudePx, durationMs, delayMs, layer]
// sumber: plugin-data "anim" Penpot / demo.html ÷1,25
const BEANS: Array<
  [number, number, number, number, number, number, number, "front" | "back"]
> = [
  [36, 67, 193, 342, 14, 3680, 0, "front"],
  [26, 291, 181, 32, 12, 3384, 180, "front"],
  [40, 318, 288, 318, 15, 3800, 360, "front"],
  [24, 50, 314, 22, 12, 3320, 540, "front"],
  [22, 117, 151, 8, 12, 3264, 720, "back"],
  [30, 295, 465, 346, 13, 3504, 900, "front"],
  [32, 76, 492, 38, 13, 3560, 1080, "front"],
  [22, 308, 552, 328, 12, 3264, 1260, "front"],
  [20, 140, 630, 12, 11, 3200, 1440, "back"],
];

export default function SplashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      // fade > slide & tanpa ambient float (aturan aksesibilitas)
      const t = setTimeout(
        () => navigation.replace("Login"),
        REDUCED_HOLD_MS,
      );
      return () => clearTimeout(t);
    }
    // tahan HOLD_MS dulu (bean terus beranimasi), baru dissolve
    const hold = setTimeout(() => {
      opacity.value = withTiming(0, {
        duration: DISSOLVE_MS,
        easing: Easing.inOut(Easing.quad),
      });
    }, HOLD_MS);
    const go = setTimeout(
      () => navigation.replace("Login", { fadeIn: true }),
      HOLD_MS + DISSOLVE_MS + 60,
    );
    return () => {
      clearTimeout(hold);
      clearTimeout(go);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, navigation]);

  const fading = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.screen}>
      <Animated.View style={[StyleSheet.absoluteFill, fading]}>
        {BEANS.map(([size, x, y, rot, amp, dur, delay, layer], i) => (
          <Bean
            key={i}
            size={size}
            x={x}
            y={y}
            rot={rot}
            amplitudePx={amp}
            durationMs={dur}
            delayMs={delay}
            layer={layer}
          />
        ))}

        <View style={styles.logoWrap}>
          <View style={styles.ring}>
            <CupMark />
          </View>
          <Text style={styles.brandName}>
            Coffee <Text style={styles.brandAccent}>Tongkrong</Text>
          </Text>
          <Text style={styles.tagline}>Ngopi · Ngobrol · Nongkrong</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.base },
  logoWrap: {
    position: "absolute",
    top: 250, // koordinat desain board 390×844
    alignSelf: "center", // adaptif semua lebar layar
    width: 260,
    alignItems: "center",
    zIndex: 2,
  },
  ring: {
    width: 96,
    height: 96,
    borderRadius: 26,
    backgroundColor: theme.color.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    marginTop: 26, // Penpot: name y372 − logo bottom 346 = 26 (QA fix, dulu 22 ala demo)
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.extrabold,
    fontSize: 28, // Penpot board "brand / name" fs28 w800 (QA fix, dulu 26 ala demo)
    lineHeight: 34,
    letterSpacing: 0.3,
  },
  // simplifikasi: tanpa italic pada "Tongkrong" — Poppins italic tidak
  // dibundel (fake-italic tidak konsisten lintas platform); ganti warna saja.
  brandAccent: { color: theme.color.caramel },
  tagline: {
    marginTop: 4,
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.semibold, // Penpot fw600 (QA fix, dulu 500)
  },
});
