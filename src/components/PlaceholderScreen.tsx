// Placeholder layar untuk Fase A — diganti implementasi asli per fase berikutnya.
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: theme.color.base,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.semibold,
    ...theme.type.title,
  },
});
