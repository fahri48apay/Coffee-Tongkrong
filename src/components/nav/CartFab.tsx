// FAB keranjang — CSS .cartfab demo: gradien 56px kanan-bawah, badge hitam
// berborder caramel, bump saat item masuk. HANYA dirender di Home & Menu.
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../theme/theme";

export function CartFab({ count, onPress }: { count: number; onPress: () => void }) {
  const bump = useSharedValue(1);

  useEffect(() => {
    if (count > 0) {
      // fabBump: 40% scale 1.16 dalam .35s
      bump.value = withSequence(
        withTiming(1.16, { duration: 140 }),
        withTiming(1, { duration: 210 }),
      );
    }
  }, [count, bump]);

  const st = useAnimatedStyle(() => ({ transform: [{ scale: bump.value }] }));

  return (
    <Pressable
      onPress={onPress}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel={count ? `Buka keranjang, ${count} item` : "Buka keranjang"}
    >
      <Animated.View style={st}>
        <LinearGradient
          colors={[theme.color.accent, theme.color.accentStrong]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.circle}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path d="M6 7h12l-1.2 12.2a2 2 0 01-2 1.8H9.2a2 2 0 01-2-1.8L6 7z"
              fill="none" stroke={theme.color.base} strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M9 10V6a3 3 0 016 0v4"
              fill="none" stroke={theme.color.base} strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </LinearGradient>
      </Animated.View>
      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: 20,
    bottom: 110,
    width: 56,
    height: 56,
    zIndex: theme.zIndex.fab,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    ...{
      elevation: 10, shadowColor: "#E85D04", shadowOpacity: 0.45,
      shadowRadius: 13, shadowOffset: { width: 0, height: 10 },
    }, // .cartfab 0 10 26 rgba(232,93,4,.45)
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.color.base,
    borderWidth: 1.5,
    borderColor: theme.color.caramel,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: theme.color.textPrimary,
    fontSize: theme.type.micro.fontSize,
    fontFamily: theme.fontFamily.bold,
  },
});
