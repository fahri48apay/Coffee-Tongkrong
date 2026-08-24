// 02 · Login (placeholder Fase B) — fade-in 800ms ease-in-out saat datang dari
// splash, mempertahankan ilusi cross-dissolve Penpot (01b → 02).
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { PlaceholderScreen } from "../components/PlaceholderScreen";
import type { RootStackParamList } from "../navigation/RootNavigator";

export default function LoginScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, "Login">>();
  const opacity = useSharedValue(params?.fadeIn ? 0 : 1);

  useEffect(() => {
    if (params?.fadeIn) {
      opacity.value = withTiming(1, {
        duration: 800, // = --dur-splash-dissolve (paritas §3)
        easing: Easing.inOut(Easing.quad),
      });
    }
  }, [params?.fadeIn, opacity]);

  const entering = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, entering]}>
      <PlaceholderScreen title="Login" />
    </Animated.View>
  );
}
