// 07 · Reservasi Meja — port demo #reservasi: chips tanggal/jam statis,
// legenda status, grid 8 meja T1–T8 (soft-chip Tersedia/Penuh), T5 default,
// CTA gradien "Pesan Meja Terpilih". Back → PilihCara (wiring §3).
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TABLES } from "../data/menu";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

export default function ReservasiScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [sel, setSel] = useState("T5");

  const tanggal = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "short",
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.space[6],
          paddingTop: insets.top + 14,
          paddingBottom: theme.space[6],
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
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
          <Text style={styles.title}>Reservasi Meja</Text>
        </View>

        <View style={styles.chips}>
          <View style={[styles.chip, styles.chipOn]}>
            <Text style={[styles.chipText, styles.chipTextOn]}>{tanggal}</Text>
          </View>
          <View style={[styles.chip, styles.chipOn]}>
            <Text style={[styles.chipText, styles.chipTextOn]}>19.00 WIB</Text>
          </View>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.color.success }]} />
            <Text style={styles.legendText}>Tersedia</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.color.danger }]} />
            <Text style={styles.legendText}>Penuh</Text>
          </View>
        </View>

        <View style={styles.tables}>
          {TABLES.map((t) => {
            const isSel = t.id === sel;
            return (
              <Pressable
                key={t.id}
                disabled={!t.bebas}
                onPress={() => setSel(t.id)}
                style={[
                  styles.tbl,
                  !t.bebas && styles.tblFull,
                  isSel && t.bebas && styles.tblSel,
                ]}
                accessibilityRole={t.bebas ? "button" : "none"}
                accessibilityLabel={`Meja ${t.id}, ${t.kapasitas}, ${t.bebas ? "tersedia" : "penuh"}${isSel ? ", terpilih" : ""}`}
                accessibilityState={{ selected: isSel, disabled: !t.bebas }}
              >
                <View style={[styles.glyph, !t.bebas && styles.glyphFull]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.tblId}>{t.id}</Text>
                  <Text style={styles.tblCap}>{t.kapasitas}</Text>
                </View>
                <View style={[styles.pillst, t.bebas ? styles.pillOk : styles.pillNo]}>
                  <Text style={[styles.pillstText, t.bebas ? styles.pillOkText : styles.pillNoText]}>
                    {t.bebas ? "Tersedia" : "Penuh"}
                  </Text>
                </View>
                {isSel && t.bebas ? (
                  <View style={styles.badgeSel}>
                    <Svg width={10} height={10} viewBox="0 0 12 12">
                      <Path d="M2 6 l3 3 5-6" stroke="#FFFFFF" strokeWidth={2}
                        fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.note}>
          Meja ditahan 20 menit setelah reservasi dibuat.
        </Text>

        <Pressable
          onPress={() => navigation.navigate("Home")}
          accessibilityRole="button"
          accessibilityLabel={`Pesan meja terpilih ${sel}`}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <LinearGradient
            colors={[theme.color.accent, theme.color.accentStrong]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaLabel}>Pesan Meja Terpilih ({sel})</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.base },
  head: { flexDirection: "row", alignItems: "center", gap: 14 },
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
  chips: { flexDirection: "row", gap: theme.space[2], marginTop: theme.space[4] },
  chip: {
    paddingVertical: 9, paddingHorizontal: 13,
    borderRadius: 16, backgroundColor: theme.color.surface,
    alignSelf: "flex-start",
  },
  chipOn: { backgroundColor: theme.color.accent },
  chipText: {
    fontSize: theme.type.micro.fontSize, lineHeight: 14,
    fontFamily: theme.fontFamily.semibold, color: theme.color.textSecondary,
  },
  chipTextOn: { color: theme.color.onAccent },
  legend: { flexDirection: "row", gap: 22, alignItems: "center", marginTop: 16, marginBottom: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: theme.radius.full },
  legendText: {
    fontSize: theme.type.micro.fontSize, color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.regular,
  },
  tables: {
    flexDirection: "row", flexWrap: "wrap",
    justifyContent: "space-between", rowGap: 14,
  },
  tbl: {
    position: "relative",
    width: "48%",
    borderRadius: 16,
    backgroundColor: theme.color.surface,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space[3],
    borderWidth: 2,
    borderColor: "transparent",
  },
  tblFull: { opacity: 0.55 },
  tblSel: { borderColor: theme.color.accent },
  glyph: {
    width: 34, height: 34, borderRadius: theme.radius.full,
    backgroundColor: theme.color.caramel,
    borderWidth: 2, borderColor: "rgba(255,244,230,0.9)",
  },
  glyphFull: {
    backgroundColor: theme.color.field,
    borderColor: "rgba(255,244,230,0.3)",
  },
  tblId: {
    fontSize: theme.type.body.fontSize,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
  },
  tblCap: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    marginTop: 2,
    fontFamily: theme.fontFamily.regular,
  },
  pillst: {
    marginLeft: "auto",
    paddingHorizontal: 9, paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  pillOk: { backgroundColor: "rgba(143,168,107,0.18)" },
  pillNo: { backgroundColor: "rgba(201,79,61,0.2)" },
  pillstText: {
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.semibold,
  },
  pillOkText: { color: theme.color.successText }, // 7.47:1 di surface ✓
  pillNoText: { color: "#E59487" },               // 5.09:1 fix audit ✓
  badgeSel: {
    position: "absolute",
    top: -8, right: -6,
    width: 22, height: 22, borderRadius: theme.radius.full,
    backgroundColor: theme.color.accent,
    alignItems: "center", justifyContent: "center",
  },
  note: {
    fontSize: theme.type.micro.fontSize,
    color: theme.color.textSecondary,
    marginTop: 16, marginBottom: theme.space[4],
    marginHorizontal: 2,
    fontFamily: theme.fontFamily.regular,
  },
  cta: {
    borderRadius: 16, // .cta — bukan pill
    overflow: "hidden",
    ...{
      elevation: 8, shadowColor: "#E85D04", shadowOpacity: 0.35,
      shadowRadius: 12, shadowOffset: { width: 0, height: 10 },
    }, // .cta 0 10 24 rgba(232,93,4,.35)
  },
  ctaGradient: {
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  ctaPressed: { transform: [{ scale: 0.97 }] },
  ctaLabel: {
    color: theme.color.onAccent, // espresso di gradien = 7.24/4.85:1 ✓
    fontSize: theme.type.body.fontSize,
    fontFamily: theme.fontFamily.bold,
  },
});
