"use client";

import React from "react";
import { ChevronRight, Copy } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { CryptoTransactionsTabProps } from "./types";
import { TransactionStatusPill } from "./TransactionStatusPill";

export function CryptoTransactionsTab({ rows, loading, t, copyWithToast, onDeclareClick, onDetailClick }: CryptoTransactionsTabProps) {
    const compactHash = (value: string, head = 6, tail = 6) => {
        if (!value) return "-";
        if (value.length <= head + tail + 3) return value;
        return `${value.slice(0, head)}...${value.slice(-tail)}`;
    };
    const hasValue = (value?: string) => Boolean(value && value.trim() && value.trim() !== "-");

    return (
        <div className="mt-4">
            <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="hidden lg:grid grid-cols-[0.9fr_1fr_1.25fr_1fr_1fr_1.6fr_1.6fr_0.4fr] items-center gap-x-4 px-4 text-xs font-medium text-slate-500">
                    <div>{t("transactions.crypto.headers.asset")}</div>
                    <div>{t("transactions.crypto.headers.network")}</div>
                    <div>{t("transactions.table.headers.date")}</div>
                    <div>{t("transactions.crypto.headers.amount")}</div>
                    <div>{t("transactions.table.headers.status")}</div>
                    <div>{t("transactions.crypto.headers.address")}</div>
                    <div>{t("transactions.crypto.headers.txid")}</div>
                    <div />
                </div>

                {/* Rows */}
                {rows.map((row) => {
                    const [datePart, timePart] = row.date.split(" ");
                    const isDeclared = Boolean(row.hasDeclaration);
                    const shouldShowDeclare = row.type === "deposit" && Boolean(row.needsDeclaration);
                    const assetText = String(row.asset || "-").toUpperCase();

                    return (
                        <div key={row.id} className="flex flex-col gap-3">
                            {/* Desktop View */}
                            <div className="hidden lg:grid grid-cols-[0.9fr_1fr_1.25fr_1fr_1fr_1.6fr_1.6fr_1fr] items-center gap-x-4 rounded-full border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 transition hover:bg-slate-50/50">
                                <div className="font-medium uppercase">{assetText}</div>
                                <div>{row.network}</div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{datePart}</span>
                                    <span className="text-xs text-slate-500">{timePart}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">{row.amount}</span>
                                    <span className="text-xs text-slate-500">≈ ₺0.00</span>
                                </div>
                                <div>
                                    <TransactionStatusPill status={row.status} t={t} withMinWidth />
                                </div>

                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="truncate">{compactHash(row.address)}</span>
                                    {hasValue(row.address) && (
                                        <button
                                            type="button"
                                            className="rounded p-1 text-slate-500 hover:bg-slate-100"
                                            onClick={() => copyWithToast(row.address)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="truncate">{compactHash(row.txId)}</span>
                                    {hasValue(row.txId) && (
                                        <button
                                            type="button"
                                            className="rounded p-1 text-slate-500 hover:bg-slate-100"
                                            onClick={() => copyWithToast(row.txId)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    {isDeclared ? (
                                        <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            {t("transactions.crypto.declared")}
                                        </span>
                                    ) : shouldShowDeclare ? (
                                        <button
                                            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm whitespace-nowrap"
                                            onClick={() => onDeclareClick(row.type, row.transactionId)}
                                        >
                                            {t("transactions.crypto.declare")}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => onDetailClick(row)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 shadow-sm"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="lg:hidden rounded-[28px] border border-slate-200 bg-white p-5 text-sm text-slate-900">
                                <div className="mb-6 flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[16px] font-semibold tracking-tight text-slate-900">{datePart}</span>
                                        <span className="text-sm text-slate-500">{timePart}</span>
                                    </div>
                                    {!shouldShowDeclare && (
                                        <button
                                            type="button"
                                            onClick={() => onDetailClick(row)}
                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-800 bg-white text-slate-800 transition"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">{t("transactions.crypto.headers.asset")}</span>
                                        <span className="text-base font-medium uppercase">{assetText}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">{t("transactions.crypto.headers.network")}</span>
                                        <span className="text-base font-medium">{row.network}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">{t("transactions.crypto.headers.amount")}</span>
                                        <div className="text-right">
                                            <div className="text-[16px] font-semibold">{row.amount}</div>
                                            <div className="text-xs text-slate-500">≈ ₺0.00</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">{t("transactions.table.headers.status")}</span>
                                        <TransactionStatusPill status={row.status} t={t} withMinWidth />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">{t("transactions.crypto.headers.address")}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="truncate max-w-[140px] text-base font-medium">{compactHash(row.address)}</span>
                                            {hasValue(row.address) && (
                                                <button
                                                    type="button"
                                                    className="rounded p-1 text-slate-500 hover:bg-slate-100"
                                                    onClick={() => copyWithToast(row.address)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">{t("transactions.crypto.headers.txid")}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="truncate max-w-[140px] text-base font-medium">{compactHash(row.txId)}</span>
                                            {hasValue(row.txId) && (
                                                <button
                                                    type="button"
                                                    className="rounded p-1 text-slate-500 hover:bg-slate-100"
                                                    onClick={() => copyWithToast(row.txId)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isDeclared ? (
                                    <div className="mt-4">
                                        <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            {t("transactions.crypto.declared")}
                                        </span>
                                    </div>
                                ) : shouldShowDeclare ? (
                                    <button
                                        className="mt-4 w-full rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                                        onClick={() => onDeclareClick(row.type, row.transactionId)}
                                    >
                                        {t("transactions.crypto.declare")}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    );
                })}

                {!loading && rows.length === 0 && (
                    <EmptyState
                        title={t("common.emptyState.title")}
                        description={t("common.emptyState.description")}
                    />
                )}
            </div>
        </div>
    );
}
