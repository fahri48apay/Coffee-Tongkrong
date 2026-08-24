// 06 · Pilih Cara Pesan — port demo #pilih / board 06:
// 2 kartu mode (342px, surface, border caramel .35, r20→snap lg24)
// + divider "atau pesan online lewat" + pill mitra h44 (dot warna brand).
// Wiring §3: nongkrong→Reservasi · takeaway→Home · mitra→Menu (push left 300).
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { theme } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

const out = Easing.bezier(0.05, 0.7, 0.1, 1);
const reveal = (i: number) =>
  FadeInDown.duration(theme.motion.durationMs.container).delay(i * 70).easing(out);

function TableIcon() {
  // meja bundar caramel + 4 kursi cream (svg board 06)
  return (
    <Svg width={64} height={64} viewBox="0 0 56 56">
      <Circle cx={28} cy={27} r={12} fill={theme.color.caramel} />
      <Circle cx={28} cy={27} r={12} stroke={theme.color.textPrimary} strokeWidth={2} fill="none" />
      <Rect x={25} y={8} width={6} height={5} rx={1.5} fill={theme.color.textPrimary} opacity={0.55} />
      <Rect x={25} y={41} width={6} height={5} rx={1.5} fill={theme.color.textPrimary} opacity={0.55} />
      <Rect x={9} y={24.5} width={5} height={6} rx={1.5} fill={theme.color.textPrimary} opacity={0.55} />
      <Rect x={42} y={24.5} width={5} height={6} rx={1.5} fill={theme.color.textPrimary} opacity={0.55} />
    </Svg>
  );
}

function TakeAwayIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 56 56">
      <Path d="M17 21 h22 l-2.2 22.5 a4.5 4.5 0 01-4.5 4 h-8.6 a4.5 4.5 0 01-4.5-4 Z"
        fill={theme.color.textPrimary} opacity={0.92} />
      <Path d="M22.5 21 v-3.5 a5.5 5.5 0 0111 0 V21" stroke={theme.color.textPrimary}
        strokeWidth={3} fill="none" strokeLinecap="round" />
      <Circle cx={28} cy={34} r={5} fill={theme.color.caramel} />
    </Svg>
  );
}

function ArrowIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d="M9 6l6 6-6 6" stroke={theme.color.accent} strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

const MITRA = [
  { name: "GoFood", dot: "#00AA13" },
  { name: "GrabFood", dot: "#00B14F" },
  { name: "ShopeeFood", dot: "#EE4D2D" },
] as const;

export default function PilihCaraScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goReservasi = () => navigation.navigate("Reservasi");
  const goHome = () => navigation.navigate("Home");
  const goMenu = () => navigation.navigate("Menu");

  return (
    <View style={styles.screen}>
      {/* blob ambient */}
      <View style={[styles.blob, styles.blobCaramel]} />
      <View style={[styles.blob, styles.blobOrange]} />

      <Animated.View entering={reveal(0)} style={{ alignSelf: "stretch" }}>
        <Text style={styles.title}>Pilih cara pesanmu</Text>
        <Text style={styles.subtitle}>Santai di tongkrongan, atau bungkus pulang?</Text>
      </Animated.View>

      <ModeCard
        entering={reveal(1)}
        icon={<TableIcon />}
        heading="Nongkrong di Tempat"
        desc="Pesan meja dulu, datang tinggal duduk"
        onPress={goReservasi}
        accessibilityLabel="Nongkrong di Tempat. Pesan meja dulu, datang tinggal duduk. Buka halaman reservasi."
      />
      <ModeCard
        entering={reveal(2)}
        icon={<TakeAwayIcon />}
        heading="Take Away"
        desc="Pesan lewat aplikasi, ambil di kasir"
        onPress={goHome}
        accessibilityLabel="Take Away. Pesan lewat aplikasi, ambil di kasir. Buka beranda."
      />

      <Animated.View entering={reveal(3)} style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>atau pesan online lewat</Text>
        <View style={styles.dividerLine} />
      </Animated.View>

      <Animated.View entering={reveal(3)} style={styles.partners}>
        {MITRA.map((m) => (
          <Pressable
            key={m.name}
            onPress={goMenu}
            style={({ pressed }) => [styles.pt, pressed && styles.ptPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Pesan lewat ${m.name}. Buka menu.`}
          >
            <View style={[styles.dot, { backgroundColor: m.dot }]} />
            <Text style={styles.ptLabel}>{m.name}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}

function ModeCard({
  icon, heading, desc, onPress, accessibilityLabel, entering,
}: {
  icon: React.ReactNode;
  heading: string;
  desc: string;
  onPress: () => void;
  accessibilityLabel: string;
  entering: NonNullable<
    React.ComponentProps<typeof Animated.View>["entering"]
  >;
}) {
  return (
    <Animated.View entering={entering} style={{ alignSelf: "center", width: "100%", maxWidth: 342 }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.opt, pressed && styles.optPressed]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {icon}
        <View style={{ flex: 1 }}>
          <Text style={styles.optH}>{heading}</Text>
          <Text style={styles.optP}>{desc}</Text>
        </View>
        <ArrowIcon />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.base,
    paddingHorizontal: theme.space[6],
    paddingTop: 138, // posisi desain board 06
    overflow: "hidden",
  },
  blob: { position: "absolute", borderRadius: theme.radius.full },
  blobCaramel: {
    width: 260, height: 260, backgroundColor: theme.color.caramel,
    opacity: 0.16, top: -64, left: -84,
  },
  blobOrange: {
    width: 240, height: 240, backgroundColor: theme.color.accent,
    opacity: 0.12, bottom: -60, right: -70,
  },
  title: {
    fontSize: 22, lineHeight: 30,
    fontFamily: theme.fontFamily.extrabold,
    color: theme.color.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: theme.type.bodySm.fontSize,
    lineHeight: theme.type.bodySm.lineHeight,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.medium,
    marginBottom: theme.space[6], // legacy 26 → snap 24
  },
  opt: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space[5], // legacy 20
    paddingVertical: 30,
    paddingHorizontal: 22,
    borderRadius: theme.radius.lg, // legacy 20 → snap lg24
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: "rgba(201,138,75,0.35)",
    marginBottom: theme.space[5],
  },
  optPressed: { transform: [{ scale: 0.98 }] },
  optH: {
    fontSize: 17, lineHeight: 24,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
  },
  optP: {
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    color: theme.color.textSecondary,
    marginTop: 4,
    fontFamily: theme.fontFamily.medium,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space[3],
    marginTop: theme.space[2],
    marginBottom: theme.space[4],
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(201,173,147,0.25)" },
  dividerText: {
    color: theme.color.textSecondary,
    fontSize: theme.type.micro.fontSize, // source 10px → dinaikkan ke 11 (aturan audit)
    fontFamily: theme.fontFamily.regular,
  },
  partners: {
    flexDirection: "row",
    gap: 10,
  },
  pt: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    height: 44,
    borderRadius: theme.radius.lg, // legacy 22 → snap lg24
    backgroundColor: theme.color.surface,
  },
  ptPressed: { transform: [{ scale: 0.96 }] },
  dot: { width: 10, height: 10, borderRadius: theme.radius.full },
  ptLabel: {
    color: theme.color.textPrimary,
    fontSize: theme.type.micro.fontSize,
    lineHeight: theme.type.micro.lineHeight,
    fontFamily: theme.fontFamily.bold,
  },
});
