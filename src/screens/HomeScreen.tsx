// 04 · Home — port demo #home: tanggal dinamis, sapaan, search live,
// strip promo, grid menu favorit 2 kolom, FAB keranjang, bottom nav aktif Beranda.
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MENU, PROMOS } from "../data/menu";
import { MenuItemCard, PromoCard } from "../components/menu/MenuItemCard";
import { BottomNav } from "../components/nav/BottomNav";
import { CartFab } from "../components/nav/CartFab";
import { Snackbar } from "../components/auth/Snackbar";
import { useCart } from "../state/CartContext";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { addItem, count } = useCart();

  const [q, setQ] = useState("");
  const [snack, setSnack] = useState<string | null>(null);

  // lebar kartu grid 2 kolom: (lebar konten − gap 12) / 2 — paritas .grid CSS
  const { width: winW } = useWindowDimensions();
  const cardW =
    (Math.min(winW, theme.layout.screenMax) -
      theme.space[6] * 2 -
      theme.space[3]) / 2;

  const tanggal = useMemo(
    () =>
      new Date().toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      }),
    [],
  );

  const terlihat = useMemo(
    () =>
      MENU.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase())),
    [q],
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.date}>{tanggal}</Text>
        <Text style={styles.hTitle}>Mau ngopi apa hari ini?</Text>

        <TextInput
          style={styles.search}
          value={q}
          onChangeText={setQ}
          placeholder="Cari kopi favoritmu"
          placeholderTextColor={theme.color.textSecondary}
          accessibilityLabel="Cari kopi favoritmu"
          autoCorrect={false}
        />

        {/* promo strip — scroll horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.promoStrip}
          contentContainerStyle={{ gap: theme.space[3], paddingHorizontal: 2 }}
        >
          {PROMOS.map((p) => (
            <PromoCard
              key={p.code}
              promo={p}
              variant="strip"
              onPress={() => navigation.navigate("Menu")}
            />
          ))}
        </ScrollView>

        <View style={styles.secRow}>
          <Text style={styles.secLabel}>Menu favorit</Text>
          <Pressable
            onPress={() => navigation.navigate("Menu")}
            accessibilityRole="link"
            hitSlop={6}
          >
            <Text style={styles.seeAll}>Lihat semua ›</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {terlihat.map((m) => (
            <MenuItemCard
              key={m.thumb}
              item={m}
              style={{ width: cardW }}
              onPress={() => {
                addItem(m.thumb);
                setSnack(`${m.name} masuk keranjang ☕`);
              }}
            />
          ))}
        </View>
        {terlihat.length === 0 ? (
          <Text style={styles.empty}>
            Tidak ketemu — coba kata kunci lain ya ☕
          </Text>
        ) : null}
      </ScrollView>

      <CartFab count={count} onPress={() => navigation.navigate("Keranjang")} />
      <BottomNav
        active="home"
        onPressHome={() => {}}
        onPressMenu={() => navigation.navigate("Menu")}
        onPressProfil={() => navigation.navigate("Profil")}
      />
      <Snackbar message={snack} onDone={() => setSnack(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.base },
  scroll: {
    paddingHorizontal: theme.space[6],
    paddingBottom: 130,
  },
  date: {
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
  },
  hTitle: {
    marginTop: 6,
    fontSize: theme.type.headline.fontSize,
    lineHeight: theme.type.headline.lineHeight,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
  },
  search: {
    marginTop: theme.space[6],
    backgroundColor: theme.color.field,
    borderRadius: theme.radius.lg, // legacy 24 → radius-lg token
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: theme.type.bodySm.fontSize,
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.medium,
  },
  promoStrip: {
    marginTop: theme.space[4],
    marginHorizontal: -theme.space[6],
    paddingHorizontal: theme.space[5],
  },
  secRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.space[6],
    marginBottom: 14,
  },
  secLabel: {
    fontSize: theme.type.body.fontSize,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
  },
  seeAll: {
    fontSize: theme.type.caption.fontSize,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.accent,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: theme.space[3],
  },
  empty: {
    marginTop: theme.space[5],
    textAlign: "center",
    color: theme.color.textSecondary,
    fontSize: theme.type.bodySm.fontSize,
    fontFamily: theme.fontFamily.medium,
  },
});
