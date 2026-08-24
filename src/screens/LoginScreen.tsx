// 02 · Login — port utuh login.html ke RN (Fase C).
// Sumber nilai: CSS login.html (blob, glass card rgba(59,35,23,.62),
// field 52px, tombol pill gradien 56px, shake ±5px, reveal stagger 90ms).
// Alur sesuai wiring Penpot §3: valid → Welcome (push up); daftar-link → board 10.
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import Animated, {
  Easing, FadeInDown, useAnimatedStyle, useSharedValue, withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { TextField } from "../components/form/TextField";
import { LockIcon, MailIcon } from "../components/form/Icons";
import { CheckboxRow } from "../components/auth/CheckboxRow";
import { SocialRow } from "../components/auth/SocialRow";
import { Snackbar } from "../components/auth/Snackbar";
import { CupMark } from "../components/splash/CupMark";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// uap statis di atas cangkir (simplifikasi: tanpa loop animasi 2,4 dtk —
// glyph 24px hampir tak terlihat geraknya; animasi uap nyata ada di Welcome §4)
function SteamGlyph() {
  return (
    <Svg width={26} height={12} viewBox="0 0 24 11">
      <Path d="M9 1 q-1.5 2 0 4.4" stroke={theme.color.textPrimary} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.9} />
      <Path d="M13 0.8 q1.6 2.2 0 4.8" stroke={theme.color.textPrimary} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.9} />
      <Path d="M17 1.4 q-1.2 1.8 0 3.6" stroke={theme.color.textPrimary} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.9} />
    </Svg>
  );
}

function LoginScreenBase() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  const submit = () => {
    const okEmail = EMAIL_RE.test(email.trim());
    const okPass = pass.length >= 8;
    // tandai hanya bila terisi (paritas perilaku demo/login)
    setEmailErr(!okEmail && email !== "" ? "Hmm, format email belum benar nih." : null);
    setPassErr(!okPass && pass !== "" ? "Kata sandi minimal 8 karakter ya." : null);
    if (!(okEmail && okPass)) {
      setSnack("Lengkapi dulu email & kata sandimu ya ☕");
      (email.trim() === "" ? emailRef : passRef).current?.focus();
      return;
    }
    // wiring §3: click CTA → push up 300 ease-out → Welcome
    navigation.navigate("Welcome");
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ambient blobs — simplifikasi: tanpa blur 70px (RN tidak murah blur),
          dikompensasi opacity rendah; posisi/ukuran sama dgn login.html */}
      <View style={[styles.blob, styles.blobCaramel]} />
      <View style={[styles.blob, styles.blobOrange]} />
      {/* bean dekoratif */}
      <View style={[styles.decoBean, { top: 120, right: 36, transform: [{ rotate: "-24deg" }] }]} />
      <View style={[styles.decoBean, { top: 300, left: -8, transform: [{ rotate: "40deg" }] }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + theme.space[5] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}
          <Animated.View
            entering={reveal(0)}
            style={styles.brand}
          >
            <LinearGradient
              colors={[theme.color.accent, theme.color.accentStrong]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoMark}
            >
              <SteamGlyph />
              <CupMark size={26} />
            </LinearGradient>
            <View>
              <Text style={styles.brandName}>
                Coffee <Text style={{ color: theme.color.accent }}>Tongkrong</Text>
              </Text>
              <Text style={styles.brandTag}>NGOPI · NGOBROL · NONGKRONG</Text>
            </View>
          </Animated.View>

          {/* Heading */}
          <Animated.View entering={reveal(1)}>
            <Text style={styles.h1}>Selamat Datang! ☕</Text>
            <Text style={styles.subtitle}>
              Masuk dan lanjutkan momen hangatmu bareng{" "}
              <Text style={styles.subtitleStrong}>2.400+ penikmat kopi</Text>{" "}
              lainnya.
            </Text>
          </Animated.View>

          {/* Glass card form */}
          <Animated.View entering={reveal(2)} style={styles.card}>
            <TextField
              label="Email"
              icon={<MailIcon color={theme.color.textSecondary} />}
              placeholder="nama@contoh.com"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setEmailErr(null);
              }}
              error={emailErr}
              inputRef={emailRef}
              onSubmitEditing={() => passRef.current?.focus()}
            />
            <TextField
              label="Kata Sandi"
              secure
              icon={<LockIcon color={theme.color.textSecondary} />}
              placeholder="Minimal 8 karakter"
              autoComplete="password"
              value={pass}
              onChangeText={(t) => {
                setPass(t);
                setPassErr(null);
              }}
              error={passErr}
              inputRef={passRef}
              onSubmitEditing={submit}
            />

            <View style={styles.rowBetween}>
              <CheckboxRow checked={remember} onPress={() => setRemember((v) => !v)} label="Ingat saya" />
              <Pressable
                onPress={() => setSnack("Link reset dikirim ke email-mu (simulasi).")}
                accessibilityRole="link"
                hitSlop={4}
              >
                <Text style={styles.link}>Lupa kata sandi?</Text>
              </Pressable>
            </View>

            {/* CTA — pill gradien, teks espresso di atas accent (7.24:1) */}
            <Pressable
              onPress={submit}
              accessibilityRole="button"
              accessibilityLabel="Masuk ke Tongkrongan"
              style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            >
              <LinearGradient
                colors={[theme.color.accent, theme.color.accentStrong]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaLabel}>Masuk ke Tongkrongan →</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau lanjut dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            <SocialRow onPick={(nama) => setSnack(`Masuk via ${nama} (simulasi).`)} />
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={reveal(3)} style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <Pressable
              onPress={() => navigation.navigate("Daftar")}
              accessibilityRole="link"
              hitSlop={6}
            >
              <Text style={styles.link}>Daftar Gratis</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>

        <Snackbar message={snack} onDone={() => setSnack(null)} />
      </KeyboardAvoidingView>
    </View>
  );
}

// reveal stagger login.html: translateY 24 → 0, delay i*90ms + 120ms, hero 600ms
const reveal = (i: number) =>
  FadeInDown.duration(theme.motion.durationMs.hero)
    .delay(i * 90 + 120)
    .easing(Easing.bezier(0.05, 0.7, 0.1, 1));

export default function LoginScreen() {
  // paritas dissolve: fade-in 800ms saat datang dari splash (param dari SplashScreen)
  const route = useRoute<RouteProp<RootStackParamList, "Login">>();
  const opacity = useSharedValue(route.params?.fadeIn ? 0 : 1);

  useEffect(() => {
    if (route.params?.fadeIn) {
      opacity.value = withTiming(1, {
        duration: theme.motion.durationMs.splashDissolve,
        easing: Easing.inOut(Easing.quad),
      });
    }
  }, [route.params?.fadeIn, opacity]);

  const entering = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, entering]}>
      <LoginScreenBase />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.base, overflow: "hidden" },
  blob: { position: "absolute", borderRadius: theme.radius.full },
  blobCaramel: {
    width: 280, height: 280, backgroundColor: theme.color.caramel,
    opacity: 0.18, top: -80, left: -90,
  },
  blobOrange: {
    width: 240, height: 240, backgroundColor: theme.color.accent,
    opacity: 0.14, bottom: -60, right: -80,
  },
  decoBean: {
    position: "absolute", width: 26, height: 18,
    borderWidth: 2, borderColor: theme.color.caramel,
    borderRadius: theme.radius.full, opacity: 0.35,
  },
  content: {
    paddingHorizontal: theme.space[6],
    paddingTop: theme.space[5],
  },
  brand: {
    flexDirection: "row", alignItems: "center",
    gap: 14, marginBottom: theme.space[7], // legacy 34 → snap grid 32
  },
  logoMark: {
    width: 56, height: 56, borderRadius: 20,
    alignItems: "center", justifyContent: "center", gap: 1,
    ...{ elevation: 6, shadowColor: "#E85D04", shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } }, // login.html 0 8 24 rgba(232,93,4,.35)
  },
  brandName: {
    fontSize: theme.type.title.fontSize,
    lineHeight: theme.type.title.lineHeight,
    fontFamily: theme.fontFamily.extrabold,
    letterSpacing: 0.1,
    color: theme.color.textPrimary,
  },
  brandTag: {
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    color: theme.color.textSecondary,
    letterSpacing: 1.6,
    marginTop: 2,
    fontFamily: theme.fontFamily.medium,
  },
  h1: {
    fontSize: theme.type.display.fontSize,
    lineHeight: theme.type.display.lineHeight,
    letterSpacing: theme.type.display.letterSpacing,
    fontFamily: theme.fontFamily.extrabold,
    color: theme.color.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: theme.type.body.fontSize,
    lineHeight: theme.type.body.lineHeight,
    color: theme.color.textSecondary,
    marginBottom: theme.space[6], // legacy 26 → snap grid 24
    fontFamily: theme.fontFamily.regular,
  },
  subtitleStrong: {
    color: theme.color.accent,
    fontFamily: theme.fontFamily.semibold,
  },
  card: {
    backgroundColor: "rgba(59,35,23,0.62)", // glass login.html (tanpa backdrop-blur)
    borderWidth: 1,
    borderColor: theme.color.hairline,
    borderRadius: theme.radius.lg,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: theme.space[5], // legacy 22 → snap 20
    ...theme.shadow.overlay,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: theme.space[5],
  },
  link: {
    fontSize: theme.type.label.fontSize,
    lineHeight: theme.type.label.lineHeight,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.accent,
  },
  cta: {
    borderRadius: theme.radius.full,
    overflow: "hidden",
    ...{ elevation: 10, shadowColor: "#E85D04", shadowOpacity: 0.38, shadowRadius: 15, shadowOffset: { width: 0, height: 10 } }, // login.html 0 10 30 rgba(232,93,4,.38)
  },
  ctaPressed: { transform: [{ scale: 0.98 }] },
  ctaGradient: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.full,
  },
  ctaLabel: {
    color: theme.color.onAccent,
    fontSize: theme.type.title.fontSize,
    lineHeight: theme.type.title.lineHeight,
    fontFamily: theme.fontFamily.extrabold,
    letterSpacing: 0.2,
  },
  divider: {
    flexDirection: "row", alignItems: "center", gap: 14,
    marginTop: theme.space[5], marginBottom: theme.space[4],
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.color.hairline },
  dividerText: {
    color: theme.color.textSecondary,
    fontSize: theme.type.caption.fontSize,
    fontFamily: theme.fontFamily.regular,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.space[6],
  },
  footerText: {
    fontSize: theme.type.label.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.regular,
  },
});
