export const FORMAT_CONFIG = {
  // Binlik ayracı
  thousandSeparator: ",",

  // Ondalık ayracı
  fractionSeparator: ".",
} as const;

export type FormatConfig = typeof FORMAT_CONFIG;
