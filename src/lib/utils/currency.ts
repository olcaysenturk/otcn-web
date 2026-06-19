// src/lib/utils/money.ts
import Decimal from "decimal.js";

/**
 * raw:   integer/raw değer (string | number | bigint)
 * prec:  bu raw değerin kaç decimal'e göre tutulduğu (örn: 8 -> BTC, 2 -> fiat)
 *
 * Örn:
 *   toUnitAmount("123456789", 8)  => Decimal(1.23456789)
 *   toUnitAmount(100000, 2)       => Decimal(1000)
 */
export function toUnitAmount(
  raw: string | number | bigint,
  prec: number
): Decimal {
  return new Decimal(raw).div(new Decimal(10).pow(prec));
}

export type FormatNumberOptions = {
  /** UI'de kaç hane göstereceğiz? (default: 2) */
  displayDecimals?: number;
  /** Gereksiz trailing 0'ları temizle (1.2300 -> 1.23, 1000.00 -> 1000) */
  trimZeros?: boolean;
  /** Binlik ayraç kullanılsın mı? */
  groupThousands?: boolean;
  /** Binlik ayraç karakteri (default: '.') */
  thousandSeparator?: string;
  /** Ondalık ayıraç (default: ',') */
  decimalSeparator?: string;
};

/**
 * Decimal/number/string değerini, binlik ve ondalık ayraçlarla formatlar.
 * Örn:
 *   formatNumber("1000.22")                    -> "1.000,22"
 *   formatNumber("1.0003333445", { ...crypto }) -> "1.0003333445"
 */
export function formatNumber(
  value: Decimal | number | string,
  {
    displayDecimals = 2,
    trimZeros = false,
    groupThousands = true,
    thousandSeparator = ".",
    decimalSeparator = ",",
  }: FormatNumberOptions = {}
): string {
  const dec =
    value instanceof Decimal ? value : new Decimal(value);

  // 1) Sabit haneli string üret
  let str = dec.toFixed(displayDecimals);

  // 2) Trailing 0 temizle (opsiyonel)
  if (trimZeros && str.includes(".")) {
    const [intPartRaw, fracPartRaw] = str.split(".");
    const trimmedFrac = fracPartRaw.replace(/0+$/, "");
    str = trimmedFrac ? `${intPartRaw}.${trimmedFrac}` : intPartRaw;
  }

  // 3) "." üzerinden integer / fractional ayır
  const [intPartRaw, fracPartRaw] = str.split(".");
  const isNegative = intPartRaw.startsWith("-");
  const intPartAbs = isNegative
    ? intPartRaw.slice(1)
    : intPartRaw;

  // 4) Binlik ayraç (isteğe bağlı)
  let intWithSep = intPartAbs;
  if (groupThousands && intPartAbs.length > 3) {
    const chars: string[] = [];
    let count = 0;

    for (let i = intPartAbs.length - 1; i >= 0; i--) {
      chars.push(intPartAbs[i]);
      count++;
      if (count === 3 && i !== 0) {
        chars.push(thousandSeparator);
        count = 0;
      }
    }

    intWithSep = chars.reverse().join("");
  }

  if (isNegative) {
    intWithSep = "-" + intWithSep;
  }

  // 5) Ondalık ayraç karakterini değiştir
  if (fracPartRaw === undefined || fracPartRaw.length === 0) {
    return intWithSep;
  }

  return intWithSep + decimalSeparator + fracPartRaw;
}

/**
 * Fiat için:
 *   raw + precision -> localized fiyat string
 *
 * Örn:
 *   formatFiatFromRaw(100022, 2, "₺")
 *    -> "₺ 1.000,22"
 */
export type FormatFiatOptions = {
  /** raw değerin kaç decimal olduğunu söylüyorsun (örn: 2) */
  precision: number;
  /** Sembol (₺, $, € vs.) */
  symbol?: string;
  /** Sembol solda mı olsun? (₺ 1.000,22) */
  symbolPosition?: "before" | "after";
  /** UI'de kaç decimal gösterelim? (default: precision) */
  displayDecimals?: number;
  /** Trailing zeros temizle */
  trimZeros?: boolean;
};

export function formatFiatFromRaw(
  raw: string | number | bigint,
  {
    precision,
    symbol = "",
    symbolPosition = "before",
    displayDecimals,
    trimZeros = false,
  }: FormatFiatOptions
): string {
  const amount = toUnitAmount(raw, precision);

  const formatted = formatNumber(amount, {
    displayDecimals: displayDecimals ?? precision,
    trimZeros,
    groupThousands: true,
    thousandSeparator: ".",
    decimalSeparator: ",",
  });

  if (!symbol) return formatted;

  return symbolPosition === "before"
    ? `${symbol} ${formatted}`
    : `${formatted} ${symbol}`;
}

/**
 * Kripto için:
 *   raw + precision -> kripto miktar string
 *
 * Örn:
 *   formatCryptoFromRaw("10003333445", 10, "BTC", { displayDecimals: 10 })
 *    -> "1.0003333445 BTC"
 */
export type FormatCryptoOptions = {
  precision: number;
  symbol?: string;
  /** UI'de kaç decimal gösterelim? (default: precision) */
  displayDecimals?: number;
  /** Trailing zeros temizle */
  trimZeros?: boolean;
  /** Binlik gruplama kullanılsın mı? (crypto'da çoğu yerde kapalı olur) */
  groupThousands?: boolean;
};

export function formatCryptoFromRaw(
  raw: string | number | bigint,
  {
    precision,
    symbol = "",
    displayDecimals,
    trimZeros = false,
    groupThousands = false,
  }: FormatCryptoOptions
): string {
  const amount = toUnitAmount(raw, precision);

  const formatted = formatNumber(amount, {
    displayDecimals: displayDecimals ?? precision,
    trimZeros,
    groupThousands,
    // Crypto için default: 1.0003333445 → integer küçükse binlik ayracı zaten görünmez,
    // decimal ayraç olarak "." kullanıyoruz.
    thousandSeparator: ",", // ister değiştirebilirsin
    decimalSeparator: ".",
  });

  if (!symbol) return formatted;

  return `${formatted} ${symbol}`;
}
