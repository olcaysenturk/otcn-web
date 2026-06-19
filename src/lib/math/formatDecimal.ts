"use client";

import { D, decimal } from "@/lib/math/decimal";

type FormatOptions = {
  minDecimals?: number;
};

function ensureMinDecimals(value: string, minDecimals: number) {
  const separator = decimal.FRACTION_SEPERATOR;
  if (!value.includes(separator)) {
    return `${value}${separator}${"0".repeat(minDecimals)}`;
  }

  const [intPart, decPart = ""] = value.split(separator);
  if (decPart.length >= minDecimals) return value;
  return `${intPart}${separator}${decPart.padEnd(minDecimals, "0")}`;
}

export function formatDecimalValue(value: decimal, options: FormatOptions = {}) {
  const minDecimals = options.minDecimals ?? 2;
  const trimmed = D.format(value, true);
  return ensureMinDecimals(trimmed, minDecimals);
}

export function formatDecimalFromString(
  raw: string,
  precision: number,
  options: FormatOptions = {}
) {
  const parsed = D.parse(raw, precision);
  const fixed = D.set(parsed, precision);
  return formatDecimalValue(fixed, options);
}
