export type SharedTimeFilterValue =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "last90"
  | "thisMonth"
  | "lastMonth"
  | "custom";

type ResolveTimeRangeParams = {
  timeFilter: SharedTimeFilterValue;
  customFromTs?: number;
  customToTs?: number;
  defaultDays?: number;
  nowTs?: number;
};

function startOfDay(date: Date): number {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next.getTime();
}

function endOfDay(date: Date): number {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next.getTime();
}

export function resolveTimeRange({
  timeFilter,
  customFromTs,
  customToTs,
  defaultDays = 30,
  nowTs = Date.now(),
}: ResolveTimeRangeParams): { from: number; to: number } {
  let from = nowTs - defaultDays * 24 * 60 * 60 * 1000;
  let to = nowTs;

  if (timeFilter === "today") {
    from = startOfDay(new Date(nowTs));
  } else if (timeFilter === "yesterday") {
    const yesterday = new Date(nowTs);
    yesterday.setDate(yesterday.getDate() - 1);
    from = startOfDay(yesterday);
    to = endOfDay(yesterday);
  } else if (timeFilter === "last7") {
    from = nowTs - 7 * 24 * 60 * 60 * 1000;
  } else if (timeFilter === "last30") {
    from = nowTs - 30 * 24 * 60 * 60 * 1000;
  } else if (timeFilter === "last90") {
    from = nowTs - 90 * 24 * 60 * 60 * 1000;
  } else if (timeFilter === "thisMonth") {
    const first = new Date(nowTs);
    first.setDate(1);
    from = startOfDay(first);
  } else if (timeFilter === "lastMonth") {
    const firstOfLastMonth = new Date(nowTs);
    firstOfLastMonth.setMonth(firstOfLastMonth.getMonth() - 1);
    firstOfLastMonth.setDate(1);
    from = startOfDay(firstOfLastMonth);

    const lastOfLastMonth = new Date(nowTs);
    lastOfLastMonth.setDate(0);
    to = endOfDay(lastOfLastMonth);
  } else if (timeFilter === "custom" && customFromTs) {
    from = customFromTs;
    to = customToTs ?? nowTs;
  }

  return { from, to };
}
