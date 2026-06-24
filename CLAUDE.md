# otcn-web — Engineering & Design System Guide

Bu dosya tüm Claude/AI çalışmalarını yönlendiren **bağlayıcı** kurallardır. Buradaki
kurallar varsayılan davranışların üzerindedir ve istisnasız uygulanır.

## Proje

- Next.js (App Router) + TypeScript + Tailwind CSS v4 (`@config "../../tailwind.config.mjs"`).
- Kripto / OTC alım-satım web uygulaması. **Türkçe-öncelikli** arayüz, **yalnızca dark tema**.
- Route'lar locale-prefixli: tüm sayfalar `src/app/[locale]/...` altında. i18n için `@/lib/i18n`.
- UI altyapısı **shadcn/ui (new-york)** tabanlı. Bileşenler `src/components/ui/*`,
  sınıf birleştirme `cn()` (`@/lib/utils`), varyantlar **CVA** (`class-variance-authority`),
  ikonlar **lucide-react**.
- Doğrulama: `npm run lint` (eslint) + `npx tsc --noEmit`. Build: `npm run build`.

---

## Design System tek otoritedir

Bu proje sıfırdan başlamadı; tasarım altyapısı başka bir projeden taşındı ve **Figma
"Bitanova" dosyası** upstream tasarım kaynağıdır (bkz. memory `bitanova-figma-source`).
Tasarım sisteminin **üç kaynağı her zaman birbiriyle tutarlı olmalıdır**:

1. **Token'lar** — `tailwind.config.mjs` (renk/radius/font/animasyon) + `src/app/globals.css`
   (HSL CSS değişkenleri + tipografi utility'leri).
2. **Bileşenler** — `src/components/ui/*`.
3. **Canlı referans** — `src/app/[locale]/design/page.tsx` ("Design Guideline" sayfası).

Bu üçü çelişirse iş **eksik/hatalıdır**. Aşağıdaki 3 kural değişmezdir.

### Kural 1 — Renkler: kapalı palet (başka renk YOK)

Yalnızca aşağıdaki paletteki renkler kullanılabilir. **Palet dışında hiçbir renk
(hex, rgb, hsl) tanıtılamaz.**

**Marka / Çekirdek**
- Primary (Orange) `#F54A14` → token `primary` / `orange-*`
- Secondary (Teal) `#84E9E8` → token `secondary` / `teal-*`
- Accent (Lime) `#C7F022` → token `accent` / `lime-300` (seçim/aktif vurgu)
- Black / Base `#0E0F10` → `card` / `popover` / `system-base` (ana kart & yüzey)
- White / Text `#F4F7F8` → `foreground`
- Background `#1F2628` → `background` / `system-bg`
- Border `#3A4043` → `border` / `input`
- Body text `#C5C9CC` → `muted-foreground` / `system-body`
- Secondary/muted text `#5E666A` → `gray-steel` / `system-secondary`

**Durum (State)**
- Success `#27E9A6` · Error/Destructive `#FF4D6D` · Warning `#FFD951` (ikon `#E2B308`) · Info `#487AF6`

**İşleme özel** — Para Çek `#27E9A6` (`para-cek`), Para Yatır `#FF4D6D` (`para-yatir`)

Kurallar:
- **Önce semantik Tailwind token'ı** kullan: `bg-primary`, `text-foreground`, `border-border`,
  `text-muted-foreground` vb. Doğrudan hex (`bg-[#0E0F10]`) yalnızca **paletteki bir değere
  birebir eşitse** kabul edilir (kod tabanı bunu yaygın yapar). Palette olmayan hex = ihlal.
- `purple-*` ve `blue-*` skalaları **legacy/geçici** ("DEĞİŞECEK") — yeni işte kullanma.
- Yeni bir renk/ton gerçekten gerekiyorsa: **aynı değişiklikte** `tailwind.config.mjs` +
  `globals.css` CSS değişkenleri + design sayfasının "Colors" sekmesi güncellenir. Üçü birden.

### Kural 2 — Bileşenler: yeniden kullan, varyantla genişlet, asla fork'lama

- Mevcut `src/components/ui/*` bileşenlerini kullan. Mevcut envanter:
  `accordion, autocomplete-input, badge, bar, button, checkbox, date-range-picker, drawer,
  filter-pill, infobox, input, label, page-card, pagination, responsive-filter,
  responsive-page-wrapper, search-input, select, skeleton, svg-icon, switch, table, tabs,
  textarea` + `form/`, `AssetSelectDropdown, CoinIcon, ConfirmationModal, EmptyState,
  PillSelect, ValueChangeHighlight`.
- İhtiyaç mevcut bileşenle **tam uyuşmuyorsa**: o bileşene **yeni bir variant/prop ekle** —
  paralel bir bileşen yaratma, tek seferlik inline stille çözme. Pattern örnekleri:
  - CVA tabanlı varyant: `button.tsx`, `input.tsx` (`variants: { variant: {...}, size: {...} }`,
    `export { Component, componentVariants }`).
  - Map tabanlı varyant: `infobox.tsx`, `badge.tsx`.
- Gerçekten yeni bir bileşen şartsa (hiçbiri yakın değilse): CVA + `cn()` + `data-slot` +
  bileşeni ve `*Variants`'ı export et + üstüne ilgili **Figma node** referans yorumu koy
  (mevcut bileşenlerdeki `// Matched to Figma "..." (52609-xxxx)` formatı).
- Tablolar için **tek kanonik bileşen `ui/table.tsx` → `DataTable`**'dır. Yeni tablo yazma
  (bkz. memory `shared-data-table`).

### Kural 3 — Design sayfasını senkron tut

`src/app/[locale]/design/page.tsx` tasarım sisteminin **görsel sözleşmesi ve regresyon
kalkanıdır**. Tasarım sistemine dokunan her değişiklik — yeni token, yeni variant, yeni
bileşen, değişen spec — **aynı değişiklikte** bu sayfaya da yansıtılmalıdır (ilgili sekme:
Colors / Typography / Buttons / Forms / Navigation / Data & Feedback). Bir variant ekleyip
design sayfasında göstermemek = iş yarım.

---

## Konvansiyonlar

- **Tipografi:** `globals.css` utility'lerini kullan (`text-h1…h3`, `text-title-*`,
  `text-body-*`, `*-medium`). Var olan bir ölçek için ad-hoc `text-[..px]` yazma. Yazı tipi:
  **Sora** (başlık/tasarım, `font-sora`), **Satoshi** (gövde, varsayılan `body`).
- **Tema:** yalnızca dark (`.dark`). Light-only stil ekleme.
- **Dil:** arayüz metinleri Türkçe. Ürün terimleri sabit: "Para Çek" / "Para Yatır".
- **Radius/animasyon/gradient** token'ları `tailwind.config.mjs`'dedir; oradan kullan.
- Bileşenlerdeki Figma referans yorumlarını koru ve güncelle.

## İş akışı

- Değişiklik sonrası: `npm run lint` ve `npx tsc --noEmit` temiz olmalı; UI değişiminde
  `npm run build` ile doğrula.
- Renk/variant/bileşen değişikliklerinde **Kural 1–3 checklist'ini** uygula: token ↔ bileşen ↔
  design sayfası üçü de güncel mi?
</content>
</invoke>
