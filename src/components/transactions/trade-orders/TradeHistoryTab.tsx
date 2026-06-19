"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { TradeOrdersTabProps } from "./types";

export function TradeHistoryTab({ rows, loading, t, onDetailClick }: TradeOrdersTabProps) {
    return (
        <div className="mt-6">
            <div className="hidden lg:grid items-center px-4 text-sm text-slate-500 grid-cols-[1.2fr_1.2fr_0.8fr_1fr_1.4fr_1.4fr_1.4fr_0.4fr]">
                <span>{t("tradeOrders.table.headers.date")}</span>
                <span>{t("tradeOrders.table.headers.pair")}</span>
                <span>{t("tradeOrders.table.headers.side")}</span>
                <span>{t("tradeOrders.table.headers.filled")}</span>
                <span>{t("tradeOrders.table.headers.price")}</span>
                <span>{t("tradeOrders.table.headers.fee")}</span>
                <span>{t("tradeOrders.table.headers.total")}</span>
                <span />
            </div>

            <div className="mt-4 space-y-3">
                {rows.map((row, idx) => (
                    <div key={`${row.id}-${idx}`}>
                        {/* Desktop View */}
                        <div className="hidden lg:grid items-center rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition hover:bg-slate-50/50 grid-cols-[1.2fr_1.2fr_0.8fr_1fr_1.4fr_1.4fr_1.4fr_0.4fr]">
                            <div className="flex flex-col">
                                <span className="font-medium">{row.date}</span>
                                <span className="text-xs text-slate-500">{row.time}</span>
                            </div>
                            <span className="font-medium">{row.pair}</span>
                            <span className={row.side === "buy" ? "font-medium text-emerald-600" : "font-medium text-rose-500"}>
                                {t(`tradeOrders.side.${row.side}`)}
                            </span>
                            <span>{row.amount}</span>

                            <div className="flex flex-col">
                                <span>{row.price}</span>
                                <span className="text-xs text-slate-400 font-normal">≈ ₺0.00</span>
                            </div>

                            <div className="flex flex-col">
                                <span>{row.price}</span>
                                <span className="text-xs text-slate-400 font-normal">≈ ₺0.00</span>
                            </div>

                            <div className="flex flex-col">
                                <span>{row.total}</span>
                                <span className="text-xs text-slate-400 font-normal">≈ ₺0.00</span>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => onDetailClick(row)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 shadow-sm"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile View */}
                        <div className="lg:hidden rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-medium">{row.date}</div>
                                    <div className="text-xs text-slate-500">{row.time}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onDetailClick(row)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 shadow-sm"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="mt-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.pair")}</span>
                                    <span className="font-medium">{row.pair}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.side")}</span>
                                    <span className={row.side === "buy" ? "font-medium text-emerald-600" : "font-medium text-rose-500"}>
                                        {t(`tradeOrders.side.${row.side}`)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.filled")}</span>
                                    <span>{row.amount}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.price")}</span>
                                    <div className="flex flex-col items-end">
                                        <span>{row.price}</span>
                                        <span className="text-xs text-slate-400">≈ ₺0.00</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.fee")}</span>
                                    <div className="flex flex-col items-end">
                                        <span>{row.price}</span>
                                        <span className="text-xs text-slate-400">≈ ₺0.00</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.total")}</span>
                                    <div className="flex flex-col items-end">
                                        <span>{row.total}</span>
                                        <span className="text-xs text-slate-400">≈ ₺0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && rows.length === 0 && (
                <EmptyState
                    title={t("common.emptyState.title")}
                    description={t("common.emptyState.description")}
                    className="mt-4"
                />
            )}
        </div>
    );
}
