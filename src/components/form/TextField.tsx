// TextField — port .field/.input-wrap login.html: label, ikon kiri,
// min-height 52 (target sentuh), placeholder full-opacity (fix audit),
// border accent saat fokus, invalid → border danger + shake 320ms ±5px.
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { theme } from "../../theme/theme";
import { EyeIcon, EyeOffIcon } from "./Icons";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string | null;
  icon: React.ReactNode;
  placeholder: string;
  secure?: boolean;
  keyboardType?: "default" | "email-address";
  autoComplete?: "email" | "password" | "name";
  inputRef?: React.RefObject<TextInput | null>;
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function TextField({
  label, value, onChangeText, error, icon, placeholder,
  secure = false, keyboardType, autoComplete, inputRef, onSubmitEditing, style,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (!error) return;
    // shake 320ms ±5px — paritas @keyframes shake login.html
    shakeX.value = withSequence(
      withTiming(-5, { duration: 80 }),
      withTiming(5, { duration: 80 }),
      withTiming(-5, { duration: 80 }),
      withTiming(5, { duration: 80 }),
      withTiming(0, { duration: 0 }),
    );
  }, [error, shakeX]);

  const animated = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const borderColor = error
    ? theme.color.dangerBorder
    : focused
      ? theme.color.accent
      : "transparent";

  const inputStyle: StyleProp<TextStyle> = {
    ...theme.type.body,
    flex: 1,
    color: theme.color.textPrimary,
    paddingVertical: 0,
  };

  return (
    <View style={[{ marginBottom: theme.space[4] }, style]}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.wrap, { borderColor }, animated]}>
        <View style={styles.iconBox}>{icon}</View>
        <TextInput
          ref={inputRef}
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.color.textSecondary}
          secureTextEntry={secure && !showPass}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={label}
        />
        {secure ? (
          <Pressable
            onPress={() => setShowPass((s) => !s)}
            accessibilityRole="button"
            accessibilityLabel={showPass ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            hitSlop={4}
            style={styles.eye}
          >
            {showPass
              ? <EyeOffIcon color={theme.color.textSecondary} />
              : <EyeIcon color={theme.color.textSecondary} />}
          </Pressable>
        ) : null}
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.type.label.fontSize,
    lineHeight: theme.type.label.lineHeight,
    fontFamily: theme.fontFamily.semibold,
    color: theme.color.textPrimary,
    marginBottom: theme.space[2],
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    backgroundColor: theme.color.field,
    borderWidth: 1.5,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space[4],
  },
  iconBox: { marginRight: theme.space[3], minWidth: 20 },
  eye: {
    position: "absolute",
    right: 6,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
  },
  error: {
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    color: theme.color.dangerText,
    marginTop: 6,
  },
});
