"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { TradeOrdersTabProps } from "./types";

export function OrderHistoryTab({ rows, loading, t, getStatusBadge, onDetailClick }: TradeOrdersTabProps) {
    return (
        <div className="mt-6">
            <div className="hidden lg:grid items-center px-4 text-sm text-slate-500 grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr_1fr_1fr_1fr_1fr_0.5fr]">
                <span>{t("tradeOrders.table.headers.date")}</span>
                <span>{t("tradeOrders.table.headers.pair")}</span>
                <span>{t("tradeOrders.table.headers.type")}</span>
                <span>{t("tradeOrders.table.headers.side")}</span>
                <span>{t("tradeOrders.table.headers.amount")}</span>
                <span>{t("tradeOrders.table.headers.filled")}</span>
                <span>{t("tradeOrders.table.headers.price")}</span>
                <span>{t("tradeOrders.table.headers.total")}</span>
                <span>{t("tradeOrders.table.headers.status")}</span>
                <span />
            </div>

            <div className="mt-4 space-y-3">
                {rows.map((row, idx) => (
                    <div key={`${row.id}-${idx}`}>
                        {/* Desktop View */}
                        <div className="hidden lg:grid items-center rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition hover:bg-slate-50/50 grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr_1fr_1fr_1fr_1fr_0.5fr]">
                            <div className="flex flex-col">
                                <span className="font-medium">{row.date}</span>
                                <span className="text-xs text-slate-500">{row.time}</span>
                            </div>
                            <span className="font-medium">{row.pair}</span>
                            <span>{row.type}</span>
                            <span className={row.side === "buy" ? "font-medium text-emerald-600" : "font-medium text-rose-500"}>
                                {t(`tradeOrders.side.${row.side}`)}
                            </span>
                            <span>{row.amount}</span>
                            <span>{row.filledAmount}</span>
                            <span>{row.price}</span>
                            <span>{row.total}</span>
                            <div>{getStatusBadge(row.status)}</div>
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
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.type")}</span>
                                    <span>{row.type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.side")}</span>
                                    <span className={row.side === "buy" ? "font-medium text-emerald-600" : "font-medium text-rose-500"}>
                                        {t(`tradeOrders.side.${row.side}`)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.amount")}</span>
                                    <span>{row.amount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.filled")}</span>
                                    <span>{row.filledAmount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.price")}</span>
                                    <span>{row.price}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.total")}</span>
                                    <span>{row.total}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("tradeOrders.table.headers.status")}</span>
                                    <div>{getStatusBadge(row.status)}</div>
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
