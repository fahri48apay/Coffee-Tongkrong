// 10 · Daftar — paritas board 10 / demo #daftar: Nama+Email+Sandi, terms,
// CTA "Buat Akun →", divider "atau daftar dengan", footer ke Login.
// Wiring §3: CTA valid → Welcome push-up; masuk-link → push right ke Login.
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthShell } from "../components/auth/AuthShell";
import { TextField } from "../components/form/TextField";
import { LockIcon, MailIcon, UserIcon } from "../components/form/Icons";
import { CheckboxRow } from "../components/auth/CheckboxRow";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DaftarScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [terms, setTerms] = useState(false);
  const [namaErr, setNamaErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const namaRef = useRef<import("react-native").TextInput>(null);
  const emailRef = useRef<import("react-native").TextInput>(null);
  const passRef = useRef<import("react-native").TextInput>(null);

  const submit = () => {
    if (!nama.trim() || !email.trim() || !pass.trim()) {
      setSnack("Lengkapi dulu data-datamu ya ☕");
      (!nama.trim() ? namaRef : !email.trim() ? emailRef : passRef).current?.focus();
      return;
    }
    const okNama = nama.trim().length >= 2;
    const okEmail = EMAIL_RE.test(email.trim());
    const okPass = pass.length >= 8;
    setNamaErr(!okNama ? "Nama minimal 2 karakter ya." : null);
    setEmailErr(!okEmail ? "Hmm, format email belum benar nih." : null);
    setPassErr(!okPass ? "Kata sandi minimal 8 karakter ya." : null);
    if (!(okNama && okEmail && okPass)) {
      setSnack("Cek lagi format datamu ya ☕");
      return;
    }
    if (!terms) {
      setSnack("Centang dulu Syarat & Ketentuan ya ☕");
      return;
    }
    // wiring §3 board 10: CTA → push up 300 → Welcome
    navigation.navigate("Welcome");
  };

  return (
    <AuthShell
      title="Buat Akun Baru ☕"
      subtitle={
        <Text style={styles.subtitleText}>
          Daftar dan nikmati promo spesial tiap hari bareng{" "}
          <Text style={styles.subtitleStrong}>2.400+ penikmat kopi</Text>.
        </Text>
      }
      ctaLabel="Buat Akun →"
      onSubmit={submit}
      dividerText="atau daftar dengan"
      socialPrefix="Daftar dengan"
      onSocialPick={(nama2) => setSnack(`Daftar via ${nama2} (simulasi).`)}
      snackMessage={snack}
      onSnackDone={() => setSnack(null)}
      footer={
        <>
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <Pressable
            onPress={() => navigation.navigate("Login")}
            accessibilityRole="link"
            hitSlop={6}
          >
            <Text style={styles.link}>Masuk</Text>
          </Pressable>
        </>
      }
    >
      <TextField
        label="Nama Lengkap"
        icon={<UserIcon color={theme.color.textSecondary} />}
        placeholder="Siapa panggilanmu?"
        autoComplete="name"
        value={nama}
        onChangeText={(t) => {
          setNama(t);
          setNamaErr(null);
        }}
        error={namaErr}
        inputRef={namaRef}
        onSubmitEditing={() => emailRef.current?.focus()}
      />
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

      <CheckboxRow
        checked={terms}
        onPress={() => setTerms((v) => !v)}
        label="Saya setuju Syarat & Ketentuan"
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
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
