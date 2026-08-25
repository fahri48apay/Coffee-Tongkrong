// 05 · Menu Kategori Lengkap — board 1910px: header sticky (back, judul,
// search, chips kategori), 4 seksi × 4 item. Filter chip + search live
// paritas demo; FAB tampil di sini (aturan FAB hanya Home/Menu).
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { MENU_SECTIONS } from "../data/menu";
import { MenuItemCard } from "../components/menu/MenuItemCard";
import { CartFab } from "../components/nav/CartFab";
import { Snackbar } from "../components/auth/Snackbar";
import { useCart } from "../state/CartContext";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const CHIPS: Array<{ label: string; key: string | null }> = [
  { label: "Semua", key: null },
  { label: "Kopi", key: "kopi" },
  { label: "Non-Kopi", key: "nonkopi" },
  { label: "Snacks", key: "snacks" },
  { label: "Makanan", key: "berat" },
];

export default function MenuScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const { addItem, count } = useCart();

  const [chip, setChip] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [snack, setSnack] = useState<string | null>(null);

  // FAB muncul ulang tiap kembali ke layar ini (paritas syncFab demo)
  const [, force] = useState(0);
  useFocusEffect(useCallback(() => force((n) => n + 1), []));

  const cardW =
    (Math.min(winW, theme.layout.screenMax) -
      theme.space[6] * 2 -
      theme.space[3]) / 2;

  const ql = q.trim().toLowerCase();

  const sections = MENU_SECTIONS.filter((s) => !chip || s.cat === chip).map(
    (s) => ({
      ...s,
      items: ql
        ? s.items.filter((it) => it.name.toLowerCase().includes(ql))
        : s.items,
    }),
  ).filter((s) => s.items.length > 0);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* header — gradasi base→transparan paritas .m-head */}
        <View style={[styles.head, { paddingTop: insets.top + 14 }]}>
          <View style={styles.topbar}>
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
            <Text style={styles.title}>Menu Tongkrongan</Text>
          </View>

          <TextInput
            style={styles.search}
            value={q}
            onChangeText={setQ}
            placeholder="Cari di menu…"
            placeholderTextColor={theme.color.textSecondary}
            accessibilityLabel="Cari di menu"
            autoCorrect={false}
          />

          <View style={styles.chips}>
            {CHIPS.map((c) => {
              const on = chip === c.key;
              return (
                <Pressable
                  key={c.label}
                  onPress={() => setChip(c.key)}
                  style={[styles.chip, on && styles.chipOn]}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter ${c.label}`}
                  accessibilityState={{ selected: on }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {sections.map((s) => (
          <View key={s.cat}>
            <Text style={styles.secLabel}>{s.label}</Text>
            <View style={styles.grid}>
              {s.items.map((it) => (
                <MenuItemCard
                  key={it.thumb}
                  item={it}
                  style={{ width: cardW }}
                  onPress={() => {
                    addItem(it.thumb);
                    setSnack(`${it.name} masuk keranjang ☕`);
                  }}
                />
              ))}
            </View>
          </View>
        ))}

        {sections.length === 0 ? (
          <Text style={styles.empty}>Tidak ketemu — coba kata kunci lain ya ☕</Text>
        ) : null}

        <View style={{ height: 130 }} />
      </ScrollView>

      <CartFab count={count} onPress={() => navigation.navigate("Keranjang")} />
      <Snackbar message={snack} onDone={() => setSnack(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.base },
  head: {
    paddingHorizontal: theme.space[6],
    paddingBottom: theme.space[3],
    gap: 14,
    backgroundColor: theme.color.base,
    // gradasi bawah transparan (CSS linear-gradient 80%) — RN pakai shadow tipis:
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(201,173,147,0.12)",
    zIndex: theme.zIndex.raised,
  },
  topbar: { flexDirection: "row", alignItems: "center", gap: 14 },
  back: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.color.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: theme.type.headline.fontSize,
    lineHeight: theme.type.headline.lineHeight,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
  },
  search: {
    backgroundColor: theme.color.field,
    borderRadius: theme.radius.lg, // legacy 22 → snap lg
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: theme.type.bodySm.fontSize,
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.regular,
  },
  chips: { flexDirection: "row", gap: theme.space[2] },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: theme.color.surface,
  },
  chipOn: { backgroundColor: theme.color.accent },
  chipText: {
    fontSize: theme.type.micro.fontSize,
    lineHeight: 14,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textSecondary,
  },
  chipTextOn: { color: theme.color.onAccent }, // fix audit: bukan putih (2.16 FAIL)
  secLabel: {
    marginHorizontal: theme.space[6],
    marginTop: theme.space[6],
    marginBottom: 14,
    fontSize: theme.type.body.fontSize,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: theme.space[3],
    paddingHorizontal: theme.space[6],
  },
  empty: {
    marginTop: theme.space[6],
    textAlign: "center",
    color: theme.color.textSecondary,
    fontSize: theme.type.bodySm.fontSize,
    fontFamily: theme.fontFamily.medium,
  },
});
