// 02 · Login — port login.html via AuthShell (Fase C→D refactor).
// Valid submit → Welcome push-up (wiring §3); daftar-link → board 10.
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withTiming,
} from "react-native-reanimated";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { AuthShell } from "../components/auth/AuthShell";
import { TextField } from "../components/form/TextField";
import { LockIcon, MailIcon } from "../components/form/Icons";
import { CheckboxRow } from "../components/auth/CheckboxRow";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginBase() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const emailRef = useRef<import("react-native").TextInput>(null);
  const passRef = useRef<import("react-native").TextInput>(null);

  const submit = () => {
    const okEmail = EMAIL_RE.test(email.trim());
    const okPass = pass.length >= 8;
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
    <AuthShell
      title="Selamat Datang! ☕"
      subtitle={
        <Text style={styles.subtitleText}>
          Masuk dan lanjutkan momen hangatmu bareng{" "}
          <Text style={styles.subtitleStrong}>2.400+ penikmat kopi</Text> lainnya.
        </Text>
      }
      ctaLabel="Masuk ke Tongkrongan →"
      onSubmit={submit}
      dividerText="atau lanjut dengan"
      socialPrefix="Masuk dengan"
      onSocialPick={(nama) => setSnack(`Masuk via ${nama} (simulasi).`)}
      snackMessage={snack}
      onSnackDone={() => setSnack(null)}
      footer={
        <>
          <Text style={styles.footerText}>Belum punya akun? </Text>
          <Pressable
            onPress={() => navigation.navigate("Daftar")}
            accessibilityRole="link"
            hitSlop={6}
          >
            <Text style={styles.link}>Daftar Gratis</Text>
          </Pressable>
        </>
      }
    >
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
        style={{ marginBottom: theme.space[2] }}
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
    </AuthShell>
  );
}

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
      <LoginBase />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitleText: {
    fontSize: theme.type.body.fontSize,
    lineHeight: theme.type.body.lineHeight,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.regular,
  },
  subtitleStrong: {
    color: theme.color.accent,
    fontFamily: theme.fontFamily.semibold,
  },
  link: {
    fontSize: theme.type.label.fontSize,
    lineHeight: theme.type.label.lineHeight,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.accent,
  },
  footerText: {
    fontSize: theme.type.label.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.regular,
  },
});
