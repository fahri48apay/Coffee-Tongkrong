// Bean kopi beranimasi — port board "01 · Splash" (HANDOFF.md §4).
// Durasi produksi = durasi demo ÷ 1,25 (demo memakai varian santai).
// Gerak: sinusoidal vertikal ±amplitudePx + rotasi dasar ±5°,
// delay stagger sesuai plugin-data "anim" Penpot.
import { memo, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Ellipse, Path } from "react-native-svg";
import { theme } from "../../theme/theme";

type BeanProps = {
  size: number;
  x: number;
  y: number;
  rot: number;
  amplitudePx: number;
  durationMs: number;
  delayMs: number;
  layer: "front" | "back";
};

function BeanInner({
  size, x, y, rot, amplitudePx, durationMs, delayMs, layer,
}: BeanProps) {
  const reduceMotion = useReducedMotion();
  const ty = useSharedValue(0);
  const rz = useSharedValue(rot);

  useEffect(() => {
    if (reduceMotion) return; // reduced-motion: bean statis (aturan §7 handoff)
    const half = durationMs / 2;
    const sine = Easing.inOut(Easing.sin);
    ty.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(-amplitudePx, { duration: half, easing: sine }),
          withTiming(amplitudePx, { duration: half, easing: sine }),
        ),
        -1,
      ),
    );
    rz.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(rot - 5, { duration: half, easing: sine }),
          withTiming(rot + 5, { duration: half, easing: sine }),
        ),
        -1,
      ),
    );
  }, [reduceMotion, amplitudePx, durationMs, delayMs, rot, ty, rz]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }, { rotate: `${rz.value}deg` }],
  }));

  const outline = layer === "back";

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bean,
        { left: x, top: y, width: size, height: size },
        outline && styles.back,
        animated,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Ellipse
          cx={20} cy={20} rx={12} ry={17}
          transform="rotate(-18 20 20)"
          fill={outline ? "none" : theme.color.caramel}
          stroke={outline ? theme.color.textPrimary : "none"}
          strokeWidth={outline ? 2 : 0}
        />
        <Path
          d="M20 5 C15 13 15 27 20 35"
          stroke={outline ? theme.color.textPrimary : theme.color.base}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bean: { position: "absolute", zIndex: 1 }, // z1 — di belakang logo ring (z2)
  back: { opacity: 0.4 },
});

export const Bean = memo(BeanInner);
