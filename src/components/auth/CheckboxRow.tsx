// Checkbox custom — port .remember login.html (22×22, border caramel r7,
// checked → bg accent + centang on-accent). Baris sentuh min-height 44.
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { theme } from "../../theme/theme";

export function CheckboxRow({
  checked,
  onPress,
  label,
}: {
  checked: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.row}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      hitSlop={4}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? (
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path
              d="M2.5 6.5 L5 9 L9.5 3.5"
              fill="none"
              stroke={theme.color.onAccent}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    minHeight: 44,
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: theme.color.caramel,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    backgroundColor: theme.color.accent,
    borderColor: theme.color.accent,
  },
  label: {
    fontSize: theme.type.label.fontSize,
    lineHeight: theme.type.label.lineHeight,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.regular,
  },
});
