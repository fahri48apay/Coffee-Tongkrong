// Shell bersama layar auth (Login & Daftar) — port struktur .l-content
// login.html/demo #daftar: blob ambient, brand header, heading, glass card
// (CTA gradien + divider + social), footer slot, snackbar, reveal stagger.
import { type ReactNode } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import Animated, {
  Easing, FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CupMark } from "../splash/CupMark";
import { Snackbar } from "./Snackbar";
import { SocialRow } from "./SocialRow";
import { theme } from "../../theme/theme";

// reveal stagger login.html: translateY 24 → 0, delay i*90+120ms, hero 600ms
export const reveal = (i: number) =>
  FadeInDown.duration(theme.motion.durationMs.hero)
    .delay(i * 90 + 120)
    .easing(Easing.bezier(0.05, 0.7, 0.1, 1));

type AuthShellProps = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;          // isi form (fields + rows)
  ctaLabel: string;
  onSubmit: () => void;
  dividerText: string;
  socialPrefix: string;         // "Masuk dengan…" / "Daftar dengan…"
  onSocialPick: (name: string) => void;
  footer: ReactNode;
  snackMessage: string | null;
  onSnackDone: () => void;
};

export function AuthShell({
  title, subtitle, children, ctaLabel, onSubmit, dividerText,
  socialPrefix, onSocialPick, footer, snackMessage, onSnackDone,
}: AuthShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* blob ambient — simplifikasi tanpa blur 70px, opacity dikompensasi */}
      <View style={[styles.blob, styles.blobCaramel]} />
      <View style={[styles.blob, styles.blobOrange]} />

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
          <Animated.View entering={reveal(0)} style={styles.brand}>
            <LinearGradient
              colors={[theme.color.accent, theme.color.accentStrong]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoMark}
            >
              <CupMark size={28} />
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
            <Text style={styles.h1}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </Animated.View>

          {/* Glass card form */}
          <Animated.View entering={reveal(2)} style={styles.card}>
            {children}

            <Pressable
              onPress={onSubmit}
              accessibilityRole="button"
              accessibilityLabel={ctaLabel}
              style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            >
              <LinearGradient
                colors={[theme.color.accent, theme.color.accentStrong]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaLabel}>{ctaLabel}</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{dividerText}</Text>
              <View style={styles.dividerLine} />
            </View>

            <SocialRow prefix={socialPrefix} onPick={onSocialPick} />
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={reveal(3)} style={styles.footer}>
            {footer}
          </Animated.View>
        </ScrollView>

        <Snackbar message={snackMessage} onDone={onSnackDone} />
      </KeyboardAvoidingView>
    </View>
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
  content: {
    paddingHorizontal: theme.space[6],
    paddingTop: theme.space[5],
  },
  brand: {
    flexDirection: "row", alignItems: "center",
    gap: 14, marginBottom: theme.space[7],
  },
  logoMark: {
    width: 56, height: 56, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    ...{
      elevation: 6, shadowColor: "#E85D04", shadowOpacity: 0.35,
      shadowRadius: 12, shadowOffset: { width: 0, height: 8 },
    }, // login.html 0 8 24 rgba(232,93,4,.35)
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
    marginBottom: theme.space[6],
    fontFamily: theme.fontFamily.regular,
  },
  card: {
    backgroundColor: "rgba(59,35,23,0.62)",
    borderWidth: 1,
    borderColor: theme.color.hairline,
    borderRadius: theme.radius.lg,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: theme.space[5],
    ...theme.shadow.overlay,
  },
  cta: {
    borderRadius: theme.radius.full,
    overflow: "hidden",
    ...{
      elevation: 10, shadowColor: "#E85D04", shadowOpacity: 0.38,
      shadowRadius: 15, shadowOffset: { width: 0, height: 10 },
    }, // login.html 0 10 30 rgba(232,93,4,.38)
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
});
