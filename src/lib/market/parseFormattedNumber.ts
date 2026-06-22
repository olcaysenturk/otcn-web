export function parseFormattedNumber(value: string): number {
  const normalized = value.replace(/[$,%\s]/g, "");
  const multiplier = normalized.endsWith("T")
    ? 1_000_000_000_000
    : normalized.endsWith("B")
      ? 1_000_000_000
      : normalized.endsWith("M")
        ? 1_000_000
        : normalized.endsWith("K")
          ? 1_000
          : 1;

  return Number.parseFloat(normalized.replace(/[TBMK]/g, "")) * multiplier || 0;
}
