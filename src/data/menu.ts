// Data menu, promo, meja — verbatim dari konstanta demo.html (sumber §2).
// Harga = ribuan rupiah (pola PRICES demo); format tampil: "Rp 18rb".

export type MenuItem = { name: string; priceLabel: string; thumb: string };

export const MENU: MenuItem[] = [
  { name: "Kopi Susu Gula Aren", priceLabel: "Rp 18rb", thumb: "thumbKopi" },
  { name: "Americano Dingin", priceLabel: "Rp 15rb", thumb: "thumbAmer" },
  { name: "Croissant Butter", priceLabel: "Rp 22rb", thumb: "thumbCroissant" },
  { name: "Matcha Latte", priceLabel: "Rp 20rb", thumb: "thumbMatcha" },
];

export const MENU_SECTIONS: Array<{
  label: string;
  cat: string;
  items: MenuItem[];
}> = [
  ["Kopi", "kopi", [
    ["Kopi Susu Gula Aren", "Rp 18rb", "thumbKopi"],
    ["Americano Dingin", "Rp 15rb", "thumbAmer"],
    ["Cappuccino", "Rp 20rb", "thumbCap"],
    ["Espresso Tunggal", "Rp 12rb", "thumbEsp"],
  ]],
  ["Non Kopi", "nonkopi", [
    ["Matcha Latte", "Rp 20rb", "thumbMatcha"],
    ["Chocolate Dingin", "Rp 18rb", "thumbChoco"],
    ["Red Velvet Latte", "Rp 22rb", "thumbRed"],
    ["Lemon Tea", "Rp 12rb", "thumbLemon"],
  ]],
  ["Snacks", "snacks", [
    ["Croissant Butter", "Rp 22rb", "thumbCroissant"],
    ["Kentang Goreng", "Rp 15rb", "thumbFries"],
    ["Pisang Goreng", "Rp 13rb", "thumbPisang"],
    ["Donat Cokelat", "Rp 12rb", "thumbDonat"],
  ]],
  ["Makanan Berat", "berat", [
    ["Nasi Goreng Spesial", "Rp 25rb", "thumbNasgor"],
    ["Mie Goreng Jawa", "Rp 22rb", "thumbMie"],
    ["Ayam Geprik Rice", "Rp 23rb", "thumbGeprek"],
    ["Spageti Bolognes", "Rp 30rb", "thumbSpag"],
  ]],
].map(([label, cat, rows]) => ({
  label: label as string,
  cat: cat as string,
  items: (rows as string[][]).map(([name, priceLabel, thumb]) => ({
    name, priceLabel, thumb,
  })),
}));

// id thumbnail → harga ribuan (map PRICES demo.html)
export const PRICES: Record<string, number> = {
  kopi: 18, amer: 15, cap: 20, esp: 12, matcha: 20, choco: 18, red: 22,
  lemon: 12, croissant: 22, fries: 15, pisang: 13, donat: 12, nasgor: 25,
  mie: 22, geprek: 23, spag: 30,
};

export const SERVICE_FEE = 2; // ribuan
export const rp = (n: number) => "Rp " + n + "rb";

export const CATALOG: Record<string, { name: string; price: number }> =
  Object.fromEntries([
    ...MENU.map((m) => [m.thumb, { name: m.name, price: PRICES[m.thumb] ?? 0 }]),
    ...MENU_SECTIONS.flatMap((s) => s.items).map((m) => [
      m.thumb, { name: m.name, price: PRICES[m.thumb] ?? 0 },
    ]),
  ]);

export const PROMOS = [
  { tag: "Gratis", title: "Beli 2 Gratis 1", desc: "Kopi Susu Gula Aren · tiap Jumat", code: "TONGKRONGAN", grad: true },
  { tag: "-20%", title: "Diskon Matcha", desc: "Matcha Latte s/d akhir pekan", code: "MATCHA20", grad: false },
  { tag: "Baru", title: "Potongan Rp 5rb", desc: "Transaksi pertama di aplikasi", code: "NGOPIPERTAMA", grad: false },
] as const;

// [id, kapasitas, tersedia] — selMeja default T5 (paritas demo)
export const TABLES: Array<{ id: string; kapasitas: string; bebas: boolean }> = [
  { id: "T1", kapasitas: "2-4 orang", bebas: true },
  { id: "T2", kapasitas: "2 orang", bebas: false },
  { id: "T3", kapasitas: "4-6 orang", bebas: false },
  { id: "T4", kapasitas: "2-4 orang", bebas: true },
  { id: "T5", kapasitas: "4-6 orang", bebas: true },
  { id: "T6", kapasitas: "2 orang", bebas: false },
  { id: "T7", kapasitas: "2-4 orang", bebas: true },
  { id: "T8", kapasitas: "6-8 orang", bebas: true },
];
