// ============================================================
// Coffee Tongkrong — Design Tokens → tema React Native
// Sumber kebenaran: ~/coffee-tongkrong/tokens.css v2 (25 Agustus 2026).
// Aturan: px CSS = dp RN (konversi 1:1). JANGAN hard-code nilai
// di komponen — semua warna/ukuran/waktu lewat objek theme ini.
// ============================================================

// ---- Netral (ladder surface: hierarki via langkah tone, bukan shadow) ----
export const color = {
  surfaceLowest: "#241510", // inset / well di bawah base
  base: "#2A1810",          // background app
  surface: "#3B2317",       // kartu / panel
  field: "#4A2E1E",         // input field
  surfaceHigh: "#5C3B27",   // hover kartu / panel terangkat

  // ---- Brand ----
  accent: "#FF8A3D",        // CTA gradient start
  accentStrong: "#E85D04",  // CTA gradient end
  caramel: "#C98A4B",       // aksen sekunder / pill nav @28%

  // ---- Teks ----
  textPrimary: "#FFF4E6",   // cream — teks utama di gelap
  textSecondary: "#C9AD93",

  // ---- Status (fill saja) ----
  success: "#8FA86B",
  danger: "#C94F3D",

  // ---- Alias semantik (rasio kontras terverifikasi, lihat tokens.css) ----
  onAccent: "#2A1810",      // teks DI ATAS accent: 7.24:1 · accentStrong: 4.85:1
  successText: "#A9C287",   // 7.47:1 di surface · 9.04:1 di surfaceLowest
  dangerText: "#FFB4AB",    // 8.60:1 di surface
  dangerBorder: "#FF8A80",  // border input invalid (non-teks ≥3:1)
  hairline: "rgba(255,244,230,0.14)", // border halus kartu/social
} as const;

// ---- Gradient brand ----
export const gradient = {
  accent: { type: "linear", angleDeg: 135, from: color.accent, to: color.accentStrong },
} as const;

// ---- State layer scrim M3 (overlay cream/konten) ----
export const stateLayer = {
  hover: 0.08,            // web saja — sentuh langsung pakai pressed
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
  disabledContent: 0.38,
} as const;

// ---- Fokus (web utilitas; RN: indikator fokus keyboard eksternal manual) ----
export const focusRing = {
  width: 2,
  color: color.accent,
} as const;

// ---- Tipografi (Poppins dibundel via expo-font — lihat fonts.ts) ----
export const fontFamily = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
  extrabold: "Poppins_800ExtraBold", // heading & brand (aturan HANDOFF §5)
} as const;

// bobot numerik untuk dokumentasi/komponen yang minta fontWeight
export const fontWeight = {
  regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800,
} as const;

const step = (fontSize: number, lineHeight: number, letterSpacing = 0) =>
  ({ fontSize, lineHeight, letterSpacing });

// Type scale 8 step — ukuran <11px DILARANG (audit 24 Agu 2026)
export const type = {
  micro: step(11, 16),        // badge, pill status, meta
  caption: step(12, 16),      // tagline, helper text
  bodySm: step(13, 18),       // sub-info, harga sekunder
  label: step(14, 20),        // label form, tombol
  body: step(15, 22),         // teks utama
  title: step(16, 24),        // judul kartu
  headline: step(20, 28),     // judul seksi / sapaan
  display: step(28, 34, -0.25), // h1 / brand — weight 800
} as const;

// ---- Spacing grid 4pt (index = --space-N di tokens.css) ----
export const space = [0, 4, 8, 12, 16, 20, 24, 32, 48] as const;

// ---- Radius ----
export const radius = {
  xs: 6,    // badge kecil, tag
  sm: 12,   // thumb kecil, stepper
  md: 16,   // input field, pill nav (paling dominan)
  lg: 24,   // kartu glass / panel
  xl: 28,   // frame layar / sheet penuh
  full: 999, // pill status, chip, mitra
} as const;

// ---- Elevasi: bayangan HANYA untuk elemen mengambang
//      (permukaan tetap ladder tone — keputusan desain §6) ----
const makeShadow = (elevation: number, y: number, blur: number, opacity: number) => ({
  elevation,
  shadowColor: "#000000",
  shadowOpacity: opacity,
  shadowRadius: blur / 2, // iOS: radius ≈ setengah blur CSS
  shadowOffset: { width: 0, height: y },
});

export const shadow = {
  card: makeShadow(2, 2, 8, 0.3),     // kartu terangkat
  fab: makeShadow(6, 6, 16, 0.35),    // FAB keranjang
  overlay: makeShadow(12, 12, 32, 0.45), // snackbar / modal
} as const;

// ---- Motion (paritas wiring Penpot HANDOFF §3 — JANGAN diubah) ----
export const durationMs = {
  micro: 180,           // feedback komponen (press, toggle)
  container: 320,       // transisi dalam layar
  screenPush: 300,      // navigasi push antar-layar
  screenDissolve: 400,  // navigasi dissolve
  hero: 600,            // animasi hero/reveal
  splashDissolve: 800,  // dissolve splash A→B
} as const;

// kurva bezier (x1,y1,x2,y2) → dipakai dengan Easing.bezier(...) Reanimated
export const easingBezier = {
  standard: [0.2, 0, 0, 1],
  decelerate: [0.05, 0.7, 0.1, 1],
  back: [0.34, 1.56, 0.64, 1], // pop badge welcome ("ease-out-back")
} as const;

// ---- Z-index ladder ----
export const zIndex = {
  base: 0,
  raised: 2,   // layar masuk saat transisi
  fab: 20,
  toast: 50,
  overlay: 99,
} as const;

// ---- Target sentuh & layout ----
export const layout = {
  tapMin: 48,    // target sentuh minimum (audit 24 Agu)
  screenMax: 430, // lebar maks konten
} as const;

// ---- Agregat bertipe ----
export const theme = {
  color,
  gradient,
  stateLayer,
  focusRing,
  fontFamily,
  fontWeight,
  type,
  space,
  radius,
  shadow,
  motion: { durationMs, easingBezier },
  zIndex,
  layout,
} as const;

export type Theme = typeof theme;
