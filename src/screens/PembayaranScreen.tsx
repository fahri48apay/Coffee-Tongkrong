// 09 · Pembayaran — port demo #bayar: total tagihan, grup metode
// (Scan&Pay/E-Money/Kartu, dot inisial trademark-safe), radio select,
// overlay "Memproses" 1400ms → layar sukses (badge pop + kode pesanan)
// → reset keranjang → Home. placeOrder mencatat riwayat + pesanan aktif.
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { rp } from "../data/menu";
import { useCart } from "../state/CartContext";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const PROCESS_MS = 1400; // overlay demo

type Metode = {
  id: string;
  nama: string;
  sub: string;
  dot?: string;      // warna brand (trademark-safe: inisial + dot)
  huruf?: string;
  ikon?: "qris" | "kartu";
};

const GRUP: Array<{ label: string; items: Metode[] }> = [
  {
    label: "SCAN & PAY",
    items: [{ id: "QRIS", nama: "QRIS", sub: "Semua e-wallet & m-banking", ikon: "qris" }],
  },
  {
    label: "E-MONEY",
    items: [
      { id: "DANA", nama: "DANA", sub: "Dompet digital", dot: "#108EE9", huruf: "D" },
      { id: "GoPay", nama: "GoPay", sub: "Langsung dari aplikasi Gojek", dot: "#00AED6", huruf: "G" },
      { id: "OVO", nama: "OVO", sub: "OVO Cash", dot: "#4C2A86", huruf: "O" },
      { id: "ShopeePay", nama: "ShopeePay", sub: "Dompet Shopee", dot: "#EE4D2D", huruf: "S" },
    ],
  },
  {
    label: "KARTU",
    items: [{
      id: "Kartu Debit/Kredit",
      nama: "Kartu Debit / Kredit",
      sub: "Visa · Mastercard",
      ikon: "kartu",
    }],
  },
];

export default function PembayaranScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { total, placeOrder, resetAfterPay } = useCart();

  const [metode, setMetode] = useState<string | null>(null);
  const [memproses, setMemproses] = useState(false);
  const [sukses, setSukses] = useState<{ kode: string; metode: string } | null>(null);

  // badge pop delay 450ms back-easing (paritas @keyframes pop .s-badge)
  const badgeScale = useSharedValue(reduce ? 1 : 0.6);
  const badgeOp = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (!sukses && !reduce) return;
    if (reduce) return;
    badgeScale.value = withDelay(450,
      withTiming(1, { duration: 420, easing: Easing.bezier(...theme.motion.easingBezier.back) }));
    badgeOp.value = withDelay(450, withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) }));
  }, [sukses, reduce, badgeScale, badgeOp]);
  const badgeSt = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOp.value,
  }));

  const bayar = () => {
    if (!metode) return;
    setMemproses(true);
    setTimeout(() => {
      setMemproses(false);
      const kode = placeOrder(metode);
      setSukses({ kode, metode });
    }, PROCESS_MS);
  };

  const selesai = () => {
    resetAfterPay();
    navigation.replace("Home");
  };

  return (
    <View style={styles.screen}>
      {!sukses ? (
        <>
          <View style={[styles.head, { paddingTop: insets.top + 14 }]}>
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
              style={styles.back}
              hitSlop={6}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path d="M15 6l-6 6 6 6" stroke={theme.color.textPrimary}
                  strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </Svg>
            </Pressable>
            <Text style={styles.title}>Metode Pembayaran</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: theme.space[6], paddingBottom: theme.space[4] }}>
            <View style={styles.totalBox}>
              <View>
                <Text style={styles.totalLabel}>Total tagihan</Text>
                <Text style={styles.totalValue}>{rp(total)}</Text>
              </View>
              {/* cangkir mini opacity .9 */}
              <View style={{ opacity: 0.9 }}>
                <Svg width={34} height={34} viewBox="0 0 58 58">
                  <Rect x={10} y={20} width={30} height={26} rx={7} fill={theme.color.textPrimary} opacity={0.9} />
                  <Path d="M40 25 h4 a7 7 0 010 14 h-4" fill="none"
                    stroke={theme.color.textPrimary} strokeWidth={4} opacity={0.9} />
                  <Path d="M14 20 c0-5 22-5 22 0" fill={theme.color.caramel} />
                </Svg>
              </View>
            </View>

            {GRUP.map((g) => (
              <View key={g.label}>
                <Text style={styles.groupLabel}>{g.label}</Text>
                {g.items.map((m) => {
                  const sel = metode === m.id;
                  return (
                    <Pressable
                      key={m.id}
                      onPress={() => setMetode(m.id)}
                      style={[styles.pm, sel && styles.pmSel]}
                      accessibilityRole="radio"
                      accessibilityLabel={`${m.nama}. ${m.sub}`}
                      accessibilityState={{ selected: sel }}
                    >
                      <View style={[styles.dot, { backgroundColor: m.dot ?? "rgba(255,244,230,0.12)" }]}>
                        {m.huruf ? (
                          <Text style={styles.dotLetter}>{m.huruf}</Text>
                        ) : m.ikon === "qris" ? (
                          <QrisGlyph />
                        ) : (
                          <CardGlyph />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pmName}>{m.nama}</Text>
                        <Text style={styles.pmSub}>{m.sub}</Text>
                      </View>
                      <View style={[styles.radio, sel && styles.radioSel]}>
                        {sel ? <View style={styles.radioDot} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          <View style={styles.foot}>
            <Pressable
              disabled={!metode}
              onPress={bayar}
              accessibilityRole="button"
              accessibilityLabel={metode ? `Bayar ${rp(total)} via ${metode}` : "Pilih metode pembayaran"}
              accessibilityState={{ disabled: !metode }}
              style={({ pressed }) => [
                styles.cta,
                !metode && styles.ctaDisabled,
                pressed && metode && styles.ctaPressed,
              ]}
            >
              <LinearGradient
                colors={[theme.color.accent, theme.color.accentStrong]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.ctaLabel}>
                {metode ? `Bayar ${rp(total)} · ${metode}` : "Pilih metode pembayaran"}
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.success}>
          <Animated.View style={[styles.sBadge, badgeSt]}>
            <Svg width={32} height={32} viewBox="0 0 24 24">
              <Path d="M4 12.5 L9.5 18 L20 6.5" stroke="#FFFFFF" strokeWidth={3}
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </Svg>
          </Animated.View>
          <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
          <Text style={styles.successSub}>
            Dibayar via {sukses.metode} · siap ±10 mnt — tunjukkan no. pesanan ke kasir.
          </Text>
          <Text style={styles.orderCode}>NO. PESANAN · {sukses.kode}</Text>
          <Pressable
            onPress={selesai}
            accessibilityRole="button"
            accessibilityLabel="Kembali ke beranda"
            style={({ pressed }) => [styles.cta, styles.successCta, pressed && styles.ctaPressed]}
          >
            <LinearGradient
              colors={[theme.color.accent, theme.color.accentStrong]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.ctaLabel}>Kembali ke Beranda</Text>
          </Pressable>
        </View>
      )}

      {/* overlay memproses */}
      {memproses ? (
        <View style={styles.overlay} accessible accessibilityLiveRegion="polite">
          <SpinRing />
          <Text style={styles.overlayText}>Memproses pembayaran…</Text>
        </View>
      ) : null}
    </View>
  );
}

function QrisGlyph() {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24">
      <Path fill={theme.color.textPrimary} d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm10-2h3v3h-3v-3zm5-1h3v2h-3v-2zm-5 5h2v3h-2v-3zm4 0h4v4h-2v3h-2v-7z" />
    </Svg>
  );
}

function CardGlyph() {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24">
      <Rect x={2.5} y={5} width={19} height={14} rx={3} fill="none"
        stroke={theme.color.textPrimary} strokeWidth={2} />
      <Path d="M2.5 9.5h19" stroke={theme.color.textPrimary} strokeWidth={2.4} />
      <Path d="M6 15h4" stroke={theme.color.textPrimary} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// spinner .pay-spin — rotasi linear .8s infinite
function SpinRing() {
  const rot = useSharedValue(0);
  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      rot.value = withTiming(
        (Math.ceil(rot.value / 360) + 1) * 360,
        { duration: 800, easing: Easing.linear },
        (finished) => { if (finished) requestAnimationFrame(loop); },
      );
    };
    loop();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const st = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value % 360}deg` }],
  }));
  return (
    <Animated.View style={[styles.spin, st]}>
      <View style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
}

// guard kecil dihapus: langsung pakai useCart

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.base },
  head: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingHorizontal: theme.space[6],
  },
  back: {
    width: 36, height: 36, borderRadius: theme.radius.full,
    backgroundColor: theme.color.surface,
    alignItems: "center", justifyContent: "center",
  },
  title: {
    fontSize: theme.type.headline.fontSize,
    lineHeight: theme.type.headline.lineHeight,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
  },
  totalBox: {
    marginTop: theme.space[4],
    backgroundColor: theme.color.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(201,138,75,0.3)",
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
  },
  totalValue: {
    fontSize: 22, lineHeight: 28,
    color: theme.color.accent,
    fontFamily: theme.fontFamily.extrabold,
    fontVariant: ["tabular-nums"],
  },
  groupLabel: {
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.bold,
    letterSpacing: 0.9,
    color: theme.color.textSecondary,
    marginTop: 16,
    marginBottom: theme.space[2],
    marginHorizontal: 2,
  },
  pm: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space[3],
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 9,
  },
  pmSel: { borderColor: theme.color.accent },
  dot: {
    width: 36, height: 36, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
  },
  dotLetter: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: theme.fontFamily.extrabold,
  },
  pmName: {
    fontSize: theme.type.bodySm.fontSize,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textPrimary,
  },
  pmSub: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    marginTop: 1,
  },
  radio: {
    marginLeft: "auto",
    width: 20, height: 20, borderRadius: theme.radius.full,
    borderWidth: 2, borderColor: "rgba(201,173,147,0.5)",
    alignItems: "center", justifyContent: "center",
  },
  radioSel: { borderColor: theme.color.accent },
  radioDot: {
    width: 10, height: 10, borderRadius: theme.radius.full,
    backgroundColor: theme.color.accent,
  },
  foot: {
    paddingHorizontal: theme.space[6],
    paddingBottom: theme.space[5],
    paddingTop: theme.space[1],
  },
  cta: {
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    ...{
      elevation: 8, shadowColor: "#E85D04", shadowOpacity: 0.35,
      shadowRadius: 12, shadowOffset: { width: 0, height: 10 },
    },
  },
  ctaDisabled: { opacity: 0.5 },
  ctaPressed: { transform: [{ scale: 0.97 }] },
  ctaLabel: {
    color: theme.color.onAccent,
    fontSize: theme.type.body.fontSize,
    fontFamily: theme.fontFamily.bold,
  },
  success: {
    flex: 1,
    backgroundColor: theme.color.base,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.space[7],
  },
  sBadge: {
    width: 66, height: 66, borderRadius: theme.radius.full,
    backgroundColor: theme.color.accent,
    alignItems: "center", justifyContent: "center",
    ...{
      elevation: 10, shadowColor: "#E85D04", shadowOpacity: 0.45,
      shadowRadius: 16, shadowOffset: { width: 0, height: 12 },
    },
  },
  successTitle: {
    fontSize: 21, lineHeight: 27,
    fontFamily: theme.fontFamily.extrabold,
    color: theme.color.textPrimary,
    marginTop: theme.space[7],
  },
  successSub: {
    fontSize: theme.type.bodySm.fontSize,
    lineHeight: 19,
    color: theme.color.textSecondary,
    textAlign: "center",
    marginTop: theme.space[2],
    fontFamily: theme.fontFamily.medium,
  },
  orderCode: {
    marginTop: 16,
    fontSize: theme.type.micro.fontSize,
    letterSpacing: 1.5,
    color: theme.color.caramel,
    fontFamily: theme.fontFamily.bold,
  },
  successCta: { alignSelf: "center", width: 260, marginTop: 26 },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: theme.zIndex.overlay,
    backgroundColor: "rgba(26,13,7,0.78)",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  spin: {
    width: 44, height: 44, borderRadius: theme.radius.full,
    borderWidth: 4, borderColor: "rgba(255,244,230,0.2)",
    borderTopColor: theme.color.accent,
  },
  overlayText: {
    fontSize: theme.type.bodySm.fontSize,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textPrimary,
  },
});
