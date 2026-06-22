const COREWEB_SYMBOL_ALIASES: Record<string, string> = {
  RNDR: "render",
};

const COREWEB_SVG_SYMBOLS = new Set([
  "chvx",
  "cnhx",
  "cofx",
  "nvdx",
  "tsmx",
  "uk1x",
  "whtx",
  "xomx",
]);

const LEGACY_ONLY_SYMBOLS = new Set([
  "ATR",
  "BNB",
  "DASH",
  "DYM",
  "JTO",
  "MATIC",
  "MNT",
  "SEI",
  "STRK",
  "STARKNET",
  "STX",
  "TIA",
  "VDA",
  "W",
]);

export function getCoinIconPath(symbol: string) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (LEGACY_ONLY_SYMBOLS.has(normalizedSymbol)) {
    const legacySymbol = normalizedSymbol === "STARKNET" ? "STRK" : normalizedSymbol;
    return `/assets/coin-logo/${legacySymbol}.svg`;
  }

  const coreWebSymbol =
    COREWEB_SYMBOL_ALIASES[normalizedSymbol] ?? normalizedSymbol.toLowerCase();
  const extension = COREWEB_SVG_SYMBOLS.has(coreWebSymbol) ? "svg" : "png";

  return `/assets/icons/crypto/${coreWebSymbol}.${extension}`;
}
