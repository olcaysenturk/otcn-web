"use client";

import { useMemo } from "react";
import { MoreVertical } from "lucide-react";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
};

type Props<T> = {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  actionsLabel?: string;
  tabs?: { key: string; label: string }[];
  activeTab?: string;
};

export function TransactionTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  actionsLabel = "Detay",
  tabs,
  activeTab,
}: Props<T>) {
  const mappedTabs = tabs ?? [];

  const tableContent = useMemo(
    () =>
      data.map((row, idx) => (
        <tr key={idx} className="border-b last:border-0">
          {columns.map((col) => (
            <td
              key={String(col.key)}
              className={`px-3 py-2 text-xs text-slate-800 dark:text-slate-200 ${col.align === "center"
                ? "text-center"
                : col.align === "right"
                  ? "text-right"
                  : "text-left"
                }`}
            >
              {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
            </td>
          ))}
          <td className="px-3 py-2 text-right">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
              {actionsLabel}
              <MoreVertical className="h-4 w-4" />
            </button>
          </td>
        </tr>
      )),
    [data, columns, actionsLabel],
  );

  return (
    <div className="space-y-4 ">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
        {description && <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>}
      </div>

      {mappedTabs.length > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {mappedTabs.map((tab) => (
            <button
              key={tab.key}
              className={[
                "rounded-full px-4 py-2 transition",
                activeTab === tab.key
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-3 py-2">
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-2 text-right"> </th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      </div>
    </div>
  );
}
