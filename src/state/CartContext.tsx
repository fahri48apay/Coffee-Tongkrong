// State keranjang + pesanan + riwayat — port logika JS demo.html.
// Konteks global karena dipakai Home/Menu/Keranjang/Bayar/Profil.
import {
  createContext, useContext, useMemo, useState, type ReactNode,
} from "react";
import { CATALOG, SERVICE_FEE, rp } from "../data/menu";

const cartCount = (cart: Record<string, number>) =>
  Object.values(cart).reduce((a, b) => a + b, 0);
const cartSubtotal = (cart: Record<string, number>) =>
  Object.entries(cart).reduce((a, [id, q]) => a + CATALOG[id].price * q, 0);
const cartTotal = (cart: Record<string, number>) => {
  const s = cartSubtotal(cart);
  return s ? s + SERVICE_FEE : 0;
};

export type ActiveOrder = {
  kode: string;
  metode: string;
  item: string; // ringkasan contoh: "Kopi Susu Gula Aren ×2 +1 menu lain"
  step: number; // 0=Diterima 1=Disiapkan 2=Siap Diambil
};
export type HistoryItem = { kode: string; meta: string; total: string };

type CartCtx = {
  cart: Record<string, number>;
  count: number;
  subtotal: number;
  total: number;
  addItem: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  activeOrder: ActiveOrder | null;
  history: HistoryItem[];
  placeOrder: (metode: string) => string; // kembalikan kode pesanan
  resetAfterPay: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

// contoh terisi by default agar layar Profil tidak kosong (paritas demo)
const SAMPLE_ORDER: ActiveOrder = {
  kode: "CT-512804",
  metode: "QRIS",
  item: "Kopi Susu Gula Aren ×2",
  step: 1,
};
const SAMPLE_HISTORY: HistoryItem[] = [
  { kode: "CT-498112", meta: "16 Agu 2026 · Americano Dingin +1 lainnya", total: "Rp 37rb" },
  { kode: "CT-476301", meta: "9 Agu 2026 · Matcha Latte ×2", total: "Rp 40rb" },
  { kode: "CT-452118", meta: "2 Agu 2026 · Nasi Goreng Spesial +1 lainnya", total: "Rp 37rb" },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(SAMPLE_ORDER);
  const [history, setHistory] = useState<HistoryItem[]>(SAMPLE_HISTORY);

  const value = useMemo<CartCtx>(() => {
    const setQty = (id: string, q: number) =>
      setCart((c) => {
        const next = { ...c };
        if (q <= 0) delete next[id];
        else next[id] = q;
        return next;
      });

    return {
      cart,
      count: cartCount(cart),
      subtotal: cartSubtotal(cart),
      total: cartTotal(cart),
      addItem: (id) => setQty(id, (cart[id] ?? 0) + 1),
      inc: (id) => setQty(id, (cart[id] ?? 0) + 1),
      dec: (id) => setQty(id, (cart[id] ?? 0) - 1),
      activeOrder,
      history,
      placeOrder: (metode) => {
        const kode = "CT-" + String(Date.now()).slice(-6);
        const entries = Object.entries(cart);
        if (entries.length) {
          const first = entries[0];
          const item =
            CATALOG[first[0]].name + " ×" + first[1] +
            (entries.length > 1 ? ` +${entries.length - 1} menu lain` : "");
          setActiveOrder({ kode, metode, item, step: 1 });
          setHistory((h) => [
            {
              kode,
              meta: "Hari ini · " + item.replace(/ \+\d+ menu lain/, ""),
              total: rp(cartSubtotal(cart)),
            },
            ...h,
          ]);
        }
        return kode;
      },
      resetAfterPay: () => setCart({}),
    };
  }, [cart, activeOrder, history]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart harus di dalam CartProvider");
  return ctx;
}
