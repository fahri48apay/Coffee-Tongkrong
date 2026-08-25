// Kartu menu (Home grid & Menu sections) + kartu promo (Home strip & Profil grid).
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { THUMBS } from "../../data/thumbs";
import type { MenuItem } from "../../data/menu";
import { theme } from "../../theme/theme";

export function MenuItemCard({
  item,
  onPress,
  style,
}: {
  item: MenuItem;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, style, pressed && styles.pressedCard]}
      accessibilityRole="button"
      accessibilityLabel={`Tambah ${item.name} ke keranjang`}
    >
      <View style={styles.thumb}>
        <SvgXml xml={THUMBS[item.thumb] ?? ""} width={56} height={56} />
      </View>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.price}>{item.priceLabel}</Text>
    </Pressable>
  );
}

type Promo = {
  tag: string; title: string; desc: string; code: string; grad: boolean;
};

export function PromoCard({
  promo,
  variant,
  onPress,
}: {
  promo: Promo;
  variant: "strip" | "grid";
  onPress: () => void;
}) {
  const inner = (
    <>
      <View style={[
        styles.tag,
        !promo.grad && styles.tagPlain,
      ]}>
        <Text style={[styles.tagText, !promo.grad && styles.tagTextPlain]}>
          {promo.tag}
        </Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.title, !promo.grad && styles.titlePlain]} numberOfLines={variant === "grid" ? 2 : 1}>
          {promo.title}
        </Text>
        <Text style={[styles.desc, !promo.grad && styles.descPlain]} numberOfLines={2}>
          {promo.desc}
        </Text>
      </View>
      <View style={[styles.codeBox, !promo.grad && styles.codeBoxPlain]}>
        <Text style={[styles.codeText, !promo.grad && styles.codeTextPlain]}>
          {promo.code}
        </Text>
      </View>
    </>
  );

  if (promo.grad) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          variant === "strip" ? styles.strip : styles.grid,
          pressed && styles.pressedCard,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Promo ${promo.title}. Kode ${promo.code}. Buka menu`}
      >
        <LinearGradient
          colors={[theme.color.accent, theme.color.accentStrong]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {inner}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.strip,
        styles.plain,
        variant === "grid" && styles.grid,
        pressed && styles.pressedCard,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Promo ${promo.title}. Kode ${promo.code}. Buka menu`}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 12,
    paddingBottom: 14,
    alignItems: "center",
  },
  pressedCard: { transform: [{ scale: 0.97 }] },
  thumb: {
    width: 64, height: 64, borderRadius: theme.radius.full,
    backgroundColor: theme.color.caramel,
    alignItems: "center", justifyContent: "center",
  },
  name: {
    marginTop: 12,
    minHeight: 34,
    fontSize: theme.type.bodySm.fontSize,
    lineHeight: 17,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textPrimary,
    textAlign: "center",
  },
  price: {
    marginTop: 4,
    alignSelf: "flex-end",
    color: theme.color.accent,
    fontSize: theme.type.label.fontSize,
    lineHeight: theme.type.label.lineHeight,
    fontFamily: theme.fontFamily.extrabold,
    fontVariant: ["tabular-nums"],
  },

  // --- promo ---
  strip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space[3],
    minWidth: 272,
    height: 76,
    borderRadius: 18,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  grid: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.space[2],
    height: "auto",
    minHeight: 110,
    paddingVertical: 14,
  },
  plain: {
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: "rgba(201,138,75,0.35)",
  },
  tag: {
    backgroundColor: "rgba(42,24,16,0.2)",
    borderRadius: theme.radius.xs,
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  tagPlain: { backgroundColor: "rgba(255,138,61,0.16)" },
  tagText: {
    color: theme.color.base,
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.extrabold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  tagTextPlain: { color: theme.color.accent },
  title: {
    color: theme.color.base,
    fontSize: 13.5,
    lineHeight: 17,
    fontFamily: theme.fontFamily.bold,
  },
  titlePlain: { color: theme.color.textPrimary },
  desc: {
    color: theme.color.base,
    fontSize: theme.type.micro.fontSize,
    lineHeight: 15,
    fontFamily: theme.fontFamily.medium,
    marginTop: 2,
    opacity: 0.85,
  },
  descPlain: { color: theme.color.textSecondary },
  codeBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(42,24,16,0.45)",
    borderRadius: theme.radius.xs,
    paddingHorizontal: 7,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  codeBoxPlain: { borderColor: "rgba(201,138,75,0.55)" },
  codeText: {
    color: theme.color.base,
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.extrabold,
  },
  codeTextPlain: { color: theme.color.caramel },
});
