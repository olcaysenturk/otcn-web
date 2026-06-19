"use client";

import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountTableSkeleton } from "@/components/account/AccountSkeleton";
import { AccountTabs } from "@/components/account/AccountTabs";
import { PageCard } from "@/components/ui/page-card";
import { ResponsivePageWrapper } from "@/components/ui/responsive-page-wrapper";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { ArrowLeft, Plus, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/search-input";
import { formatIBAN } from "@/lib/utils/bank";
import { deleteUserBank, getUserBanks } from "@/services/account";
import { useModalStore } from "@/stores/useModalStore";
import { UserBank } from "@/types/bank";
import { toast } from "sonner";

export default function AccountBankPage() {
  const { t, locale } = useI18n();
  const { openModal } = useModalStore();

  const [banks, setBanks] = useState<UserBank[]>([]);
  const [searchedBanks, setSearchedBanks] = useState<UserBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<number | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const fetchBanks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserBanks();
      setBanks(data);
      setSearchedBanks(data);
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const onConfirmDelete = async () => {
    if (!bankToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteUserBank(bankToDelete);
      if (result.success) {
        toast.success(t("common.success"));
        fetchBanks();
      } else {
        toast.error(result.message || t("common.error"));
      }
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsDeleting(false);
      setBankToDelete(null);
    }
  };

  const bankRows = useMemo(
    () => searchedBanks,
    [searchedBanks],
  );

  return (
    <PageCard>
      <ResponsivePageWrapper>
        {/* Mobile Header */}
        <div className="flex items-center gap-3 bg-[#0F1415] p-4 text-white lg:hidden mb-6">
          <Link href={withLocale("/account", locale)} className="rounded p-1 hover:bg-white/10">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <span className="text-lg font-semibold">{t("account.menu.bank")}</span>
        </div>

        {/* Desktop Header */}
        <AccountHeader
          title={t("accountHeader.title")}
          description={t("accountHeader.description")}
        />

        <div className="hidden lg:block">
          <AccountTabs active="bank" />
        </div>

        <div className="bg-[#1C2425] rounded-[32px] p-6 lg:p-8 border border-white/10 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">{t("account.bank.title")}</h2>
            <button
              onClick={() => openModal("add-bank-account", { onSuccess: fetchBanks })}
              className="hidden lg:flex items-center gap-1.5 px-4 h-9 border border-[#25B88A] rounded-full text-[#25B88A] text-sm font-semibold hover:bg-emerald-500/10 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {t("account.bank.add")}
            </button>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block mb-6">
            <SearchInput
              placeholder={t("account.bank.search")}
              className="w-[500px]"
              onSearch={(a: string | null) => {
                if (!a) {
                  setSearchedBanks(banks);
                  return;
                }
                const filteredBanks = banks.filter((bank) =>
                  bank.bankName?.toLowerCase().includes(a.toLowerCase()) ||
                  bank.label.toLowerCase().includes(a.toLowerCase()) ||
                  bank.iban?.toLowerCase().includes(a.toLowerCase())
                )
                setSearchedBanks(filteredBanks);
              }}
            />
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileSearch((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 shrink-0 hover:bg-white/10 transition-colors"
              >
                {showMobileSearch ? <X className="h-5 w-5 text-gray-300" /> : <Search className="h-5 w-5 text-gray-300" />}
              </button>
              <button
                onClick={() => openModal("add-bank-account", { onSuccess: fetchBanks })}
                className="flex flex-1 items-center justify-center gap-1.5 h-9 border border-[#25B88A] rounded-full text-[#25B88A] text-sm font-semibold hover:bg-emerald-500/10 transition-colors bg-transparent px-4"
              >
                <Plus className="h-4 w-4" />
                {t("account.bank.add")}
              </button>
            </div>
            {showMobileSearch && (
              <SearchInput
                placeholder={t("account.bank.search")}
                className="w-full"
                onSearch={(a: string | null) => {
                  if (!a) {
                    setSearchedBanks(banks);
                    return;
                  }
                  const filteredBanks = banks.filter((bank) =>
                    bank.bankName?.toLowerCase().includes(a.toLowerCase()) ||
                    bank.label.toLowerCase().includes(a.toLowerCase()) ||
                    bank.iban?.toLowerCase().includes(a.toLowerCase())
                  );
                  setSearchedBanks(filteredBanks);
                }}
              />
            )}
          </div>

          {isLoading ? (
            <AccountTableSkeleton />
          ) : searchedBanks.length === 0 ? (
            <div className="flex flex-col items-center gap-6">
              <EmptyState
                title={t("account.bank.noData")}
                description={t("account.bank.noDataDescription")}
                className="min-h-[300px] bg-transparent backdrop-blur-none"
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">{t("account.bank.columns.bank")}</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">{t("account.bank.columns.accountName")}</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">{t("account.bank.columns.taxId")}</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">{t("account.bank.columns.iban")}</th>
                      <th className="px-6 py-4 text-right" />
                    </tr>
                  </thead>
                  <tbody className="bg-[#1C2425] divide-y divide-white/10">
                    {bankRows.map((row, idx) => (
                      <tr key={`${row.id}-${idx}`} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {row.logoUrl ? (
                              <img src={row.logoUrl} alt={row.bankName} className="h-8 w-8 rounded-full object-contain bg-white border border-white/10" />
                            ) : (
                              <span
                                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white uppercase"
                                style={{ backgroundColor: row.color || "#7C3AED" }}
                              >
                                {row.bankName?.[0] || row.label?.[0]}
                              </span>
                            )}
                            <span className="text-sm font-semibold text-white">{row.bankName || row.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{row.label}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{row.taxId || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">{formatIBAN(row.iban)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setBankToDelete(row.id)}
                              className="p-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {bankRows.map((row, idx) => (
                  <div key={idx} className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {row.logoUrl ? (
                          <img src={row.logoUrl} alt={row.bankName} className="h-10 w-10 rounded-full object-contain shrink-0 bg-white border border-white/10" />
                        ) : (
                          <span
                            className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white shrink-0 uppercase"
                            style={{ backgroundColor: row.color || "#7C3AED" }}
                          >
                            {row.bankName?.[0] || row.label?.[0]}
                          </span>
                        )}
                        <span className="text-base font-semibold text-white">{row.bankName || row.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setBankToDelete(row.id)}
                          className="p-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-[140px_1fr] gap-2">
                        <span className="text-sm text-gray-500">{t("account.bank.columns.accountName")}</span>
                        <span className="text-sm font-medium text-white truncate">{row.label}</span>
                      </div>
                      <div className="grid grid-cols-[140px_1fr] gap-2">
                        <span className="text-sm text-gray-500">{t("account.bank.columns.taxId")}</span>
                        <span className="text-sm font-medium text-white">{row.taxId || "-"}</span>
                      </div>
                      <div className="grid grid-cols-[140px_1fr] gap-2">
                        <span className="text-sm text-gray-500">{t("account.bank.columns.iban")}</span>
                        <span className="text-sm font-medium text-white break-all">{formatIBAN(row.iban)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        <ConfirmationModal
          isOpen={!!bankToDelete}
          onClose={() => setBankToDelete(null)}
          onConfirm={onConfirmDelete}
          title={t("account.bank.deleteModal.title")}
          description={t("account.bank.deleteModal.description")}
          confirmText={t("account.bank.deleteModal.confirm")}
          cancelText={t("account.bank.deleteModal.cancel")}
          isLoading={isDeleting}
        />
      </ResponsivePageWrapper>


    </PageCard>
  );
}
