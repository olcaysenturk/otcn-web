"use client";

import React from "react";
import { ChevronDown, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { FiatTransactionsTabProps } from "./types";
import { TransactionStatusPill } from "./TransactionStatusPill";

export function FiatTransactionsTab({ rows, loading, t, expanded, onExpand }: FiatTransactionsTabProps) {
    return (
        <div className="mt-4">
            <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_0.5fr] items-center px-4 text-xs font-medium text-slate-500">
                    <div>{t("transactions.table.headers.date")}</div>
                    <div>{t("transactions.table.headers.amount")}</div>
                    <div>{t("transactions.table.headers.status")}</div>
                    <div>{t("transactions.table.headers.type")}</div>
                    <div>{t("transactions.table.headers.bank")}</div>
                    <div />
                </div>

                {/* Rows */}
                {rows.map((row) => {
                    const isExpanded = expanded === row.id;
                    const typeLabel = row.type === "withdraw" ? t("transactionTypes.withdraw") : t("transactionTypes.deposit");
                    const [datePart, timePart] = row.date.split(" ");

                    return (
                        <div
                            key={row.id}
                            className="group relative flex flex-col transition-all duration-200"
                        >
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <div
                                    className={cn(
                                        "rounded-3xl border transition-all duration-200",
                                        isExpanded
                                            ? "border-violet-500 bg-white ring-1 ring-violet-500/20"
                                            : "border-slate-200 bg-white hover:bg-slate-50"
                                    )}
                                >
                                    {/* Main Row Content */}
                                    <div
                                        onClick={() => onExpand(isExpanded ? null : row.id)}
                                        className={cn(
                                            "grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_0.5fr] items-center p-4 cursor-pointer",
                                            isExpanded ? "border-b border-slate-100" : ""
                                        )}
                                    >
                                        {/* Date */}
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 dark:text-white">{datePart}</span>
                                            <span className="text-xs text-slate-500">{timePart}</span>
                                        </div>

                                        {/* Amount */}
                                        <div className="font-semibold text-slate-900 dark:text-white">
                                            {row.amount}
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <TransactionStatusPill status={row.status} t={t} />
                                        </div>

                                        {/* Type */}
                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            {typeLabel}
                                        </div>

                                        {/* Bank */}
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white">
                                            {row.bank}
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 text-slate-400 transition-transform duration-200",
                                                    isExpanded ? "rotate-180" : ""
                                                )}
                                            />
                                        </div>

                                        {/* Action */}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className={cn(
                                                    "inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
                                                    isExpanded
                                                        ? "border-slate-800 bg-white text-slate-800"
                                                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                                )}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Detail View */}
                                    <div
                                        className={cn(
                                            "grid overflow-hidden transition-all duration-300 ease-in-out",
                                            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        )}
                                    >
                                        <div className="min-h-0">
                                            <div className="px-8 pb-8 pt-4">
                                                <div className="flex flex-col gap-4">
                                                    <DetailRow label={`${t("transactions.table.detail.id")}:`} value={row.id} />
                                                    <DetailRow label={`${t("transactions.table.detail.bankName")}:`} value={row.bankAccount} />
                                                    <DetailRow label={`${t("transactions.table.detail.iban")}:`} value={row.iban} />
                                                    <DetailRow label={`${t("transactions.table.detail.description")}:`} value={row.description || "-"} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden">
                                <div
                                    onClick={() => onExpand(isExpanded ? null : row.id)}
                                    className={cn(
                                        "relative flex flex-col rounded-[28px] border bg-white p-5 transition-all duration-200 cursor-pointer",
                                        isExpanded
                                            ? "border-violet-500 ring-1 ring-violet-500/20"
                                            : "border-slate-200"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-semibold tracking-tight text-slate-900">{datePart}</span>
                                            <span className="text-sm text-slate-500">{timePart}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-800 bg-white text-slate-800"
                                        >
                                            <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-90")} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">{t("transactions.table.headers.amount")}</span>
                                            <span className="text-lg font-semibold text-slate-900">{row.amount}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">{t("transactions.table.headers.status")}</span>
                                            <TransactionStatusPill status={row.status} t={t} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">{t("transactions.table.headers.type")}</span>
                                            <span className="text-lg font-medium text-slate-900">{typeLabel}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">{t("transactions.table.headers.bank")}</span>
                                            <div className="flex items-center gap-1 text-lg font-medium text-slate-900">
                                                {row.bank}
                                                <ChevronDown className={cn("h-5 w-5 text-slate-500 transition-transform", isExpanded && "rotate-180")} />
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-slate-900">{t("transactions.table.detail.id")}:</span>
                                                <span className="text-sm font-medium text-slate-800">{row.id}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-slate-900">{t("transactions.table.detail.bankName")}:</span>
                                                <span className="text-sm font-medium text-slate-800">{row.bankAccount}</span>
                                            </div>
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-sm font-semibold text-slate-900">IBAN:</span>
                                                <span className="text-right text-sm font-medium text-slate-800 break-all">{row.iban}</span>
                                            </div>
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-sm font-semibold text-slate-900">{t("transactions.table.detail.description")}:</span>
                                                <span className="text-right text-sm font-medium text-slate-800 break-words max-w-[60%]">
                                                    {row.description || "-"}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
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

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-900 dark:text-white">{label}</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">{value}</span>
        </div>
    );
}
