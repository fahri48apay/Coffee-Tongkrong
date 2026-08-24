// Navigator root — daftar rute sesuai mapping HANDOFF-CODING.md §4.
// Urutan & wiring antar-layar mengikuti HANDOFF.md §3 (27 interaksi, timing terkunci).
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from "../theme/theme";
import Splash from "../screens/SplashScreen";
import Login from "../screens/LoginScreen";
import Daftar from "../screens/DaftarScreen";
import Welcome from "../screens/WelcomeScreen";
import PilihCara from "../screens/PilihCaraScreen";
import Reservasi from "../screens/ReservasiScreen";
import Home from "../screens/HomeScreen";
import Menu from "../screens/MenuScreen";
import Keranjang from "../screens/KeranjangScreen";
import Pembayaran from "../screens/PembayaranScreen";
import Profil from "../screens/ProfilScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Daftar: undefined;
  Welcome: undefined;
  PilihCara: undefined;
  Reservasi: undefined;
  Home: undefined;
  Menu: undefined;
  Keranjang: undefined;
  Pembayaran: undefined;
  Profil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// tema navigasi gelap agar tidak ada kedip putih saat transisi
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: theme.color.accent,
    background: theme.color.base,
    card: theme.color.surface,
    text: theme.color.textPrimary,
    border: theme.color.hairline,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Daftar" component={Daftar} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="PilihCara" component={PilihCara} />
        <Stack.Screen name="Reservasi" component={Reservasi} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Keranjang" component={Keranjang} />
        <Stack.Screen name="Pembayaran" component={Pembayaran} />
        <Stack.Screen name="Profil" component={Profil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
