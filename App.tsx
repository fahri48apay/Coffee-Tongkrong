// Shell aplikasi — gate font Poppins sebelum navigator siap.
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { CartProvider } from "./src/state/CartContext";
import { useAppFonts } from "./src/theme/fonts";

// tahan splash native sampai font siap (pola resmi expo-splash-screen)
void SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </SafeAreaProvider>
  );
}
