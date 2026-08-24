// Pemuatan font Poppins (wajib dibundel — bukan CDN, lihat HANDOFF-CODING.md §3).
// Bobot yang dipakai aplikasi sesuai token fontWeight: 400–800.
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

let preloaded = false;

export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  if (error && !preloaded) {
    // fail closed: tanpa Poppins identitas brand rusak — hentikan, jangan lanjut diam-diam
    throw new Error("Gagal memuat font Poppins: " + error.message);
  }
  preloaded = loaded;
  return loaded;
}
