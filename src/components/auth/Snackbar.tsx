// Snackbar M3 — port .snackbar login.html: krem #F3DFC9, radius 14,
// slide dari bawah, auto-tutup 3200ms, diumumkan ke screen reader.
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { theme } from "../../theme/theme";

const SHOW_MS = 3200;

export function Snackbar({
  message,
  onDone,
}: {
  message: string | null;
  onDone: () => void;
}) {
  const ty = useSharedValue(140);

  useEffect(() => {
    if (!message) return;
    ty.value = withTiming(0, { duration: theme.motion.durationMs.container });
    const t = setTimeout(onDone, SHOW_MS);
    return () => clearTimeout(t);
  }, [message, onDone, ty]);

  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  if (!message) return null;

  return (
    <Animated.View
      style={[styles.box, animated]}
      accessible
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    bottom: theme.space[6],
    alignSelf: "center",
    width: "88%",
    maxWidth: 380,
    backgroundColor: "#F3DFC9",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    ...theme.shadow.overlay,
  },
  text: {
    color: theme.color.base,
    fontSize: theme.type.label.fontSize,
    lineHeight: theme.type.label.lineHeight,
    fontFamily: theme.fontFamily.semibold,
  },
});
