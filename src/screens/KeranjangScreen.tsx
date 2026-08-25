// 08 · Keranjang — port demo #keranjang: item dgn stepper (target sentuh
// efektif 48px via hitSlop), ringkasan Subtotal/Layanan/Total tabular-nums,
// CTA disabled saat kosong. Back → layar asal (stack).
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import Svg, { Path, SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CupMark } from "../components/splash/CupMark";
import { THUMBS } from "../data/thumbs";
import { CATALOG, SERVICE_FEE, rp } from "../data/menu";
import { useCart } from "../state/CartContext";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

export default function KeranjangScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { cart, subtotal, total, inc, dec } = useCart();
  const entries = Object.entries(cart);

  return (
    <View style={styles.screen}>
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
        <Text style={styles.title}>Keranjang</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <CupMark size={58} />
          <Text style={styles.emptyText}>
            Keranjangmu masih kosong.{"\n"}Yuk pilih menu favoritmu dulu!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingHorizontal: theme.space[6] }}
          showsVerticalScrollIndicator={false}
        >
          {entries.map(([id, qty]) => {
            const it = CATALOG[id];
            return (
              <View key={id} style={styles.item}>
                <View style={styles.thumb}>
                  <SvgXml xml={THUMBS[id] ?? ""} width={42} height={42} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.itemName} numberOfLines={2}>{it.name}</Text>
                  <Text style={styles.itemPrice}>{rp(it.price)} / porsi</Text>
                  <View style={styles.stepper}>
                    <StepperBtn label={`Kurangi ${it.name}`} onPress={() => dec(id)}>−</StepperBtn>
                    <Text style={styles.qty} accessible accessibilityLiveRegion="polite">
                      {qty}
                    </Text>
                    <StepperBtn label={`Tambah ${it.name}`} onPress={() => inc(id)}>+</StepperBtn>
                  </View>
                </View>
                <Text style={styles.linePrice}>{rp(it.price * qty)}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.sum}>
        <View style={styles.sumRow}>
          <Text style={styles.sumLabel}>Subtotal</Text>
          <Text style={styles.sumValue}>{rp(subtotal)}</Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={styles.sumLabel}>Biaya layanan</Text>
          <Text style={styles.sumValue}>{rp(SERVICE_FEE)}</Text>
        </View>
        <View style={[styles.sumRow, styles.sumTotalRow]}>
          <Text style={styles.sumTotalLabel}>Total</Text>
          <Text style={styles.sumTotalValue}>{rp(total)}</Text>
        </View>
        <Pressable
          disabled={!entries.length}
          onPress={() => navigation.navigate("Pembayaran")}
          accessibilityRole="button"
          accessibilityLabel={
            entries.length ? `Lanjut ke pembayaran, total ${rp(total)}` : "Keranjang kosong"
          }
          accessibilityState={{ disabled: !entries.length }}
          style={({ pressed }) => [
            styles.cta,
            !entries.length && styles.ctaDisabled,
            pressed && entries.length > 0 && styles.ctaPressed,
          ]}
        >
          <LinearGradientCta active={entries.length > 0} />
          <Text style={styles.ctaLabel}>
            {entries.length ? `Lanjut ke Pembayaran · ${rp(total)}` : "Keranjang kosong"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function StepperBtn({
  children, onPress, label,
}: {
  children: string;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12} // target sentuh efektif 24+24 = 48 ✓ (fix audit)
      style={({ pressed }) => [styles.stepBtn, pressed && styles.stepPressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.stepText}>{children}</Text>
    </Pressable>
  );
}

// gradien .cta — komponen lokal agar bisa dinonaktifkan visualnya
function LinearGradientCta({ active }: { active: boolean }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { opacity: active ? 1 : 0.5 },
      ]}
    >
      <LinearGradient
        colors={[theme.color.accent, theme.color.accentStrong]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

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
  body: { flex: 1, paddingTop: theme.space[4] },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: theme.space[6],
  },
  emptyText: {
    textAlign: "center",
    color: theme.color.textSecondary,
    fontSize: theme.type.bodySm.fontSize,
    lineHeight: 20,
    fontFamily: theme.fontFamily.medium,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space[3],
    backgroundColor: theme.color.surface,
    borderRadius: 16,
    padding: theme.space[3],
    marginBottom: theme.space[3],
  },
  thumb: {
    width: 48, height: 48, borderRadius: theme.radius.full,
    backgroundColor: theme.color.caramel,
    alignItems: "center", justifyContent: "center",
  },
  info: { flex: 1 },
  itemName: {
    fontSize: theme.type.bodySm.fontSize,
    lineHeight: 17,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textPrimary,
  },
  itemPrice: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    marginTop: 1,
  },
  stepper: {
    flexDirection: "row", alignItems: "center", gap: 9,
    marginTop: theme.space[2],
  },
  stepBtn: {
    width: 24, height: 24, borderRadius: theme.radius.xs,
    backgroundColor: theme.color.field,
    alignItems: "center", justifyContent: "center",
    color: theme.color.textPrimary,
  },
  stepPressed: { transform: [{ scale: 0.88 }] },
  stepText: {
    fontSize: theme.type.label.fontSize,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
    lineHeight: 14,
  },
  qty: {
    fontSize: theme.type.bodySm.fontSize,
    minWidth: 16,
    textAlign: "center",
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.bold,
  },
  linePrice: {
    alignSelf: "flex-start",
    marginTop: 2,
    color: theme.color.accent,
    fontSize: theme.type.bodySm.fontSize,
    fontFamily: theme.fontFamily.extrabold,
    fontVariant: ["tabular-nums"],
  },
  sum: {
    paddingHorizontal: theme.space[6],
    paddingTop: theme.space[3],
    paddingBottom: theme.space[5],
    borderTopWidth: 1,
    borderTopColor: "rgba(255,244,230,0.07)",
  },
  sumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sumLabel: {
    fontSize: theme.type.caption.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
  },
  sumValue: {
    fontSize: theme.type.caption.fontSize,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    fontVariant: ["tabular-nums"],
  },
  sumTotalRow: { marginTop: theme.space[2], marginBottom: theme.space[4] },
  sumTotalLabel: {
    fontSize: theme.type.body.fontSize,
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.extrabold,
  },
  sumTotalValue: {
    fontSize: theme.type.body.fontSize,
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.extrabold,
    fontVariant: ["tabular-nums"],
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
});
