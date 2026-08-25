// Bottom nav — anatomi Penpot §4: bar 56px r28 surface (margin 24, bottom 48),
// pill aktif 64×32 caramel @.28, ikon Feather 24 stroke2, label 12px.
// Slot Favorit sengaja tanpa tujuan (aturan HANDOFF §4). Hanya di Home & Profil.
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Polyline, Line } from "react-native-svg";
import { theme } from "../../theme/theme";

type NavKey = "home" | "menu" | "favorit" | "profil";

function Icon({ name, color }: { name: NavKey; color: string }) {
  const common = {
    width: 24, height: 24, viewBox: "0 0 24 24",
    fill: "none" as const, stroke: color, strokeWidth: 2,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  if (name === "home")
    return (
      <Svg {...common}>
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <Polyline points="9 22 9 12 15 12 15 22" />
      </Svg>
    );
  if (name === "menu")
    return (
      <Svg {...common}>
        <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <Polyline points="14 2 14 8 20 8" />
        <Line x1={16} y1={13} x2={8} y2={13} />
        <Line x1={16} y1={17} x2={8} y2={17} />
        <Polyline points="10 9 9 9 8 9" />
      </Svg>
    );
  if (name === "favorit")
    return (
      <Svg {...common}>
        <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </Svg>
    );
  return (
    <Svg {...common}>
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx={12} cy={7} r={4} />
    </Svg>
  );
}

const LABELS: Record<NavKey, string> = {
  home: "Beranda",
  menu: "Menu",
  favorit: "Favorit",
  profil: "Profil",
};

export function BottomNav({
  active,
  onPressHome,
  onPressMenu,
  onPressProfil,
}: {
  active: Extract<NavKey, "home" | "profil">;
  onPressHome: () => void;
  onPressMenu: () => void;
  onPressProfil: () => void;
}) {
  const slot = (key: NavKey) => {
    const isActive = key === active;
    const content = (
      <>
        {isActive ? <View style={styles.pill} /> : null}
        <Icon name={key} color={isActive ? theme.color.accent : theme.color.textSecondary} />
        <Text style={[styles.label, isActive && styles.labelOn]}>{LABELS[key]}</Text>
      </>
    );
    if (key === "favorit") {
      // tanpa interaksi — halaman tujuan belum ada (aturan §4)
      return (
        <View key={key} style={styles.item}>
          {content}
        </View>
      );
    }
    const handler =
      key === "home" ? onPressHome : key === "menu" ? onPressMenu : onPressProfil;
    return (
      <Pressable
        key={key}
        onPress={handler}
        style={({ pressed }) => [styles.item, styles.btn, pressed && styles.pressed]}
        accessibilityRole="tab"
        accessibilityLabel={`Buka halaman ${LABELS[key]}`}
        accessibilityState={{ selected: isActive }}
      >
        {content}
      </Pressable>
    );
  };

  return <View style={styles.bar}>{(["home", "menu", "favorit", "profil"] as NavKey[]).map(slot)}</View>;
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: theme.space[6],
    right: theme.space[6],
    bottom: theme.space[7], // legacy 48 → snap grid 48
    height: 56,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.color.surface,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-evenly",
    paddingHorizontal: 4,
    paddingVertical: 2,
    ...theme.shadow.card,
  },
  item: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  btn: { minWidth: 64, borderRadius: 14 },
  pressed: { opacity: 0.85 },
  pill: {
    position: "absolute",
    top: 4,
    width: 64,
    height: 32,
    borderRadius: 16, // r16 persis §4
    backgroundColor: "rgba(201,138,75,0.28)",
  },
  label: {
    fontSize: theme.type.caption.fontSize,
    lineHeight: 12,
    fontFamily: theme.fontFamily.regular,
    color: theme.color.textSecondary,
  },
  labelOn: {
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.medium,
  },
});
