// 11 · Profil Akun — port demo #profil / board 11: header akun (avatar R,
// chip MEMBER EMAS), kartu Pesanan Berlangsung KONDISIONAL, Tongkrong Points
// + tier, promo grid, riwayat pesanan, list pengaturan, bottom nav aktif Profil.
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { PROMOS } from "../data/menu";
import { PromoCard } from "../components/menu/MenuItemCard";
import { BottomNav } from "../components/nav/BottomNav";
import { Snackbar } from "../components/auth/Snackbar";
import { useCart } from "../state/CartContext";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const STEPS = ["Diterima", "Disiapkan", "Siap Diambil"];
const TIERS = [
  { nama: "Perunggu", state: "done" },
  { nama: "Perak", state: "done" },
  { nama: "Emas", state: "on" },
  { nama: "Platinum", state: "" },
] as const;

export default function ProfilScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { activeOrder, history } = useCart();
  const [snack, setSnack] = useState<string | null>(null);
  const sim = (teks: string) => setSnack(`${teks} (simulasi).`);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header akun */}
        <View style={styles.pfHead}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nama}>Raka Wijaya</Text>
            <Text style={styles.email}>raka@contoh.com</Text>
            <View style={styles.chip}>
              <Text style={styles.chipText}>MEMBER EMAS · 240 PTS</Text>
            </View>
          </View>
          <Pressable
            onPress={() => sim("Ubah profil")}
            accessibilityRole="button"
            accessibilityLabel="Ubah profil"
            hitSlop={6}
          >
            <Text style={styles.edit}>Ubah Profil</Text>
          </Pressable>
        </View>

        {/* Pesanan berlangsung — KONDISIONAL */}
        {activeOrder ? (
          <View style={styles.orderCard}>
            <View style={styles.oTop}>
              <Text style={styles.oLabel}>Pesanan Berlangsung</Text>
              <Text style={styles.oKode}>#{activeOrder.kode} · {activeOrder.metode}</Text>
            </View>
            <Text style={styles.oItem}>{activeOrder.item}</Text>

            {/* stepper 3 langkah */}
            <View style={styles.stepsWrap}>
              <View style={styles.trackLine} />
              <View style={styles.stepsRow}>
                {STEPS.map((s, i) => {
                  const done = i < activeOrder.step;
                  const on = i === activeOrder.step;
                  return (
                    <View key={s} style={styles.stepCol}>
                      <View
                        style={[
                          styles.stepDot,
                          done && styles.stepDotDone,
                          on && styles.stepDotOn,
                        ]}
                      />
                      <Text
                        style={[
                          styles.stepLabel,
                          on && styles.stepLabelOn,
                        ]}
                      >
                        {s}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <Text style={styles.oStatus}>
              {activeOrder.step >= 2
                ? "Siap diambil — tunjukkan no. pesanan ke kasir"
                : "Disiapkan barista · siap ±10 mnt"}
            </Text>
          </View>
        ) : (
          <View style={styles.orderEmpty}>
            <Text style={styles.orderEmptyText}>
              Belum ada pesanan berlangsung.{"\n"}Pesananmu akan tampil di sini ☕
            </Text>
          </View>
        )}

        {/* Poin & Loyalty */}
        <View style={styles.loyalCard}>
          <Text style={styles.loyalLabel}>Tongkrong Points</Text>
          <Text style={styles.loyalNum}>240 PTS</Text>
          <View
            style={styles.track}
            accessibilityLabel="Progress 240 dari 500 poin menuju Platinum"
            accessible
          >
            <View style={styles.trackFill} />
          </View>
          <Text style={styles.loyalCap}>
            260 poin lagi menuju <Text style={{ fontFamily: theme.fontFamily.bold }}>PLATINUM</Text> · 400 pts = Kopi Gratis
          </Text>
          <View style={styles.tierRow}>
            {TIERS.map((t) => (
              <View key={t.nama} style={[
                styles.tier,
                t.state === "done" && styles.tierDone,
                t.state === "on" && styles.tierOn,
              ]}>
                <Text style={[
                  styles.tierText,
                  t.state === "done" && styles.tierTextDone,
                  t.state === "on" && styles.tierTextOn,
                ]}>
                  {t.nama}{t.state === "done" ? " ✓" : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Promo Untukmu */}
        <Text style={[styles.secLabel, { marginTop: theme.space[6] }]}>Promo Untukmu</Text>
        <View style={styles.promoGrid}>
          {PROMOS.slice(0, 2).map((p) => (
            <PromoCard
              key={p.code}
              promo={p}
              variant="grid"
              onPress={() => navigation.navigate("Menu")}
            />
          ))}
        </View>

        {/* Riwayat Pesanan */}
        <Text style={[styles.secLabel, { marginTop: theme.space[6] }]}>Riwayat Pesanan</Text>
        {history.map((h) => (
          <Pressable
            key={h.kode}
            onPress={() => sim(`Detail #${h.kode}`)}
            style={({ pressed }) => [styles.histRow, pressed && styles.rowPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Pesanan ${h.kode}, ${h.meta}, total ${h.total}, selesai`}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.hrKode}>#{h.kode}</Text>
              <Text style={styles.hrMeta}>{h.meta}</Text>
            </View>
            <View style={styles.hrRight}>
              <Text style={styles.hrHarga}>{h.total}</Text>
              <View style={styles.hrBadge}>
                <Text style={styles.hrBadgeText}>SELESAI</Text>
              </View>
            </View>
          </Pressable>
        ))}

        {/* Pengaturan akun */}
        <View style={styles.pfList}>
          {[
            { label: "Metode Pembayaran", danger: false },
            { label: "Alamat Tersimpan", danger: false },
            { label: "Pusat Bantuan", danger: false },
            { label: "Keluar", danger: true },
          ].map((it) => (
            <Pressable
              key={it.label}
              onPress={() => sim(it.label)}
              style={({ pressed }) => [styles.pfIt, pressed && styles.rowPressed]}
              accessibilityRole="button"
              accessibilityLabel={it.label}
            >
              <View style={[styles.itDot, it.danger && styles.itDotDanger]} />
              <Text style={[styles.itLabel, it.danger && styles.itLabelDanger]}>{it.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNav
        active="profil"
        onPressHome={() => navigation.navigate("Home")}
        onPressMenu={() => navigation.navigate("Menu")}
        onPressProfil={() => {}}
      />
      <Snackbar message={snack} onDone={() => setSnack(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.base },
  content: {
    paddingHorizontal: theme.space[6],
    paddingBottom: 130,
  },
  pfHead: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 72, height: 72, borderRadius: theme.radius.full,
    backgroundColor: theme.color.surfaceHigh,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: {
    fontSize: 30,
    fontFamily: theme.fontFamily.extrabold,
    color: theme.color.textPrimary,
  },
  nama: {
    fontSize: theme.type.headline.fontSize,
    lineHeight: theme.type.headline.lineHeight,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
  },
  email: {
    fontSize: theme.type.caption.fontSize,
    lineHeight: 17,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    marginTop: 2,
  },
  chip: {
    alignSelf: "flex-start",
    marginTop: theme.space[2],
    backgroundColor: "rgba(255,138,61,0.16)",
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.bold,
    letterSpacing: 0.5,
    color: theme.color.accent, // kontras terverifikasi (chip 5.42:1 audit)
  },
  edit: {
    fontSize: theme.type.bodySm.fontSize,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.accent,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  orderCard: {
    marginTop: theme.space[5],
    backgroundColor: theme.color.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(201,138,75,0.28)",
    padding: 16,
  },
  oTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: theme.space[2],
  },
  oLabel: {
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.bold,
    letterSpacing: 0.9,
    color: theme.color.accent,
    textTransform: "uppercase",
  },
  oKode: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    fontVariant: ["tabular-nums"],
  },
  oItem: {
    fontSize: theme.type.label.fontSize,
    lineHeight: 19,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textPrimary,
    marginTop: theme.space[2],
  },
  stepsWrap: { marginTop: 14, position: "relative" },
  trackLine: {
    position: "absolute",
    top: 5,
    left: "16%",
    right: "16%",
    height: 2,
    backgroundColor: theme.color.field,
  },
  stepsRow: { flexDirection: "row" },
  stepCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  stepDot: {
    width: 12, height: 12, borderRadius: theme.radius.full,
    backgroundColor: theme.color.field,
    borderWidth: 2, borderColor: "rgba(201,173,147,0.5)",
  },
  stepDotDone: {
    backgroundColor: theme.color.success,
    borderColor: theme.color.success,
  },
  stepDotOn: {
    backgroundColor: theme.color.accent,
    borderColor: theme.color.accent,
    ...{ shadowColor: theme.color.accent, shadowOpacity: 0.18, shadowRadius: 4, shadowOffset: { width: 0, height: 0 }, elevation: 0 },
  },
  stepLabel: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
  },
  stepLabelOn: {
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.semibold,
  },
  oStatus: {
    fontSize: theme.type.caption.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    marginTop: theme.space[3],
  },
  orderEmpty: {
    marginTop: theme.space[5],
    backgroundColor: theme.color.surface,
    borderRadius: 16,
    padding: 22,
  },
  orderEmptyText: {
    textAlign: "center",
    color: theme.color.textSecondary,
    fontSize: theme.type.bodySm.fontSize,
    lineHeight: 20,
    fontFamily: theme.fontFamily.medium,
  },
  loyalCard: {
    marginTop: theme.space[5],
    backgroundColor: theme.color.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(201,138,75,0.3)",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  loyalLabel: {
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.bold,
    letterSpacing: 0.9,
    color: theme.color.accent,
    textTransform: "uppercase",
  },
  loyalNum: {
    fontSize: 32, lineHeight: 38,
    fontFamily: theme.fontFamily.extrabold,
    color: theme.color.textPrimary,
    marginTop: 4,
    fontVariant: ["tabular-nums"],
  },
  track: {
    height: 8, borderRadius: 4,
    backgroundColor: theme.color.field,
    marginTop: theme.space[3],
    overflow: "hidden",
  },
  trackFill: { width: "48%", height: "100%", borderRadius: 4, backgroundColor: theme.color.accent },
  loyalCap: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    marginTop: theme.space[2],
  },
  tierRow: { flexDirection: "row", gap: 6, marginTop: 14 },
  tier: {
    flex: 1,
    alignItems: "center",
    borderRadius: 13,
    paddingVertical: 5,
    paddingHorizontal: 2,
    backgroundColor: theme.color.field,
  },
  tierDone: { backgroundColor: "rgba(143,168,107,0.18)" }, // teks 5.53:1 ✓
  tierOn: { backgroundColor: theme.color.accent },         // teks 7.24:1 ✓
  tierText: {
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textSecondary,
  },
  tierTextDone: { color: theme.color.successText },
  tierTextOn: { color: theme.color.base, fontFamily: theme.fontFamily.extrabold },
  secLabel: {
    fontSize: theme.type.body.fontSize,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
    marginBottom: 14,
  },
  promoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: theme.space[3],
  },
  histRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: theme.space[2],
  },
  rowPressed: { transform: [{ scale: 0.985 }] },
  hrKode: {
    fontSize: theme.type.caption.fontSize,
    lineHeight: 17,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textPrimary,
  },
  hrMeta: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    marginTop: 2,
  },
  hrRight: { marginLeft: "auto", alignItems: "flex-end" },
  hrHarga: {
    fontSize: theme.type.bodySm.fontSize,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.accent,
    fontVariant: ["tabular-nums"],
  },
  hrBadge: {
    backgroundColor: "rgba(143,168,107,0.15)",
    borderRadius: theme.radius.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginTop: 4,
  },
  hrBadgeText: {
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.successText,
  },
  pfList: { marginTop: 22, gap: theme.space[2] },
  pfIt: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space[3],
    backgroundColor: theme.color.surface,
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
  },
  itDot: {
    width: 8, height: 8, borderRadius: theme.radius.full,
    backgroundColor: theme.color.caramel, opacity: 0.8,
  },
  itDotDanger: { backgroundColor: "#E59487" },
  itLabel: {
    fontSize: theme.type.label.fontSize,
    fontFamily: theme.fontFamily.medium,
    color: theme.color.textPrimary,
  },
  itLabelDanger: { color: "#E59487" },
  chevron: {
    marginLeft: "auto",
    color: theme.color.textSecondary,
    fontSize: 18,
  },
});
