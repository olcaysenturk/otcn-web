"use client";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { walletDummyData } from "@/data/wallet-dummy-data";
import { useWalletAssets } from "@/hooks/use-wallet-assets";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import {
  getDefaultAppPreferences,
  getClientAppPreferences,
} from "@/lib/preferences/appPreferences";
import { fetchPendingDepositDeclarations } from "@/services/crypto";
import { useModalStore } from "@/stores/useModalStore";
import type { PendingDepositDeclaration } from "@/types/crypto";
import type { WalletSidebarAsset } from "@/types/wallet";
import {
  ChevronDown,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletAssetRow } from "./WalletAssetRow";
import { WalletDonutCard } from "./WalletDonutCard";
import { WalletNotification } from "./WalletNotification";
import { WalletSkeleton } from "./WalletSkeleton";
import { WalletTotalCard } from "./WalletTotalCard";

export function WalletOverview() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null);
  const [hideSmallAssets, setHideSmallAssets] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCurrency, setDisplayCurrency] = useState<"TRY" | "USDT">(
    () => getDefaultAppPreferences(locale).currency
  );
  const [pendingDeclarations, setPendingDeclarations] = useState<PendingDepositDeclaration[]>([]);
  const handleCurrencyChange = (next: "TRY" | "USDT") => {
    setDisplayCurrency(next);
  };

  const { assets, isLoading } = useWalletAssets({ locale });

  useEffect(() => {
    setDisplayCurrency(getClientAppPreferences(locale).currency);
  }, [locale]);

  useEffect(() => {
    let mounted = true;

    const loadPendingDeclarations = async () => {
      try {
        const list = await fetchPendingDepositDeclarations(locale);
        if (mounted) {
          setPendingDeclarations(list ?? []);
        }
      } catch {
        if (mounted) {
          setPendingDeclarations([]);
        }
      }
    };

    loadPendingDeclarations();

    const onUpdated = () => {
      loadPendingDeclarations();
    };

    window.addEventListener("transaction-updated", onUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("transaction-updated", onUpdated);
    };
  }, [locale]);

  const isEmptyState = assets.length === 0 || assets.length === 1; // Empty or only TRY exists

  const fiatAssets = assets.filter(a => a.symbol === "TRY");
  const cryptoAssets = assets.filter(a => a.symbol !== "TRY");
  const displayFiatAssets =
    fiatAssets.length > 0
      ? fiatAssets
      : [
        {
          id: "TRY-0",
          icon: "/assets/coin-logo/TRY.svg",
          name: "TRY",
          symbol: "TRY",
          amount: "0",
          fiat: "≈ ₺0",
          fiatValue: 0,
          available: "0",
          inOrder: "0",
          withdraw: "0",
          asset: null,
        } satisfies WalletSidebarAsset,
      ];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCryptoAssets = cryptoAssets.filter((asset) => {
    const passesSmallFilter = !hideSmallAssets || (asset.usdtValue ?? 0) >= 1;
    const passesSearch =
      !normalizedQuery ||
      asset.symbol.toLowerCase().includes(normalizedQuery) ||
      asset.name.toLowerCase().includes(normalizedQuery);
    return passesSmallFilter && passesSearch;
  });

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredCryptoAssets.length / itemsPerPage));
  const displayedAssets = filteredCryptoAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const assetCount = filteredCryptoAssets.length;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  if (isLoading) {
    return <WalletSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-6">
      {/* Header & Notification */}

      <div className="space-y-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-h3 text-white">
              {t("wallet.title")}
            </h1>
          </div>
          <p className="text-body-lg text-gray-400 mt-1">
            {t("wallet.subtitle")}
          </p>
        </div>

        {pendingDeclarations.length > 0 && (
          <WalletNotification
            pendingCount={pendingDeclarations.length}
            onAction={() => openModal("pending-transactions", { items: pendingDeclarations })}
          />
        )}
      </div>

      {/* Cards Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <WalletTotalCard
            isEmpty={isEmptyState}
            assets={assets}
            currency={displayCurrency}
            onCurrencyChange={handleCurrencyChange}
            variant="lime"
          />
        </div>
        <div className="min-w-0">
          <WalletDonutCard isEmpty={isEmptyState} assets={assets} displayCurrency={displayCurrency} />
        </div>
      </section>

      {/* Fiat Row (TRY) */}
      {displayFiatAssets.length > 0 && (
        <section className="rounded-[28px] border border-white/10 bg-[#1C2425] p-5 md:p-8">
          <div className="mb-2 hidden md:grid grid-cols-[1fr_1fr_1fr_1.3fr] px-6 text-title-sm text-gray-400">
            <div>{t("wallet.fiat.title")}</div>
            <div>{t("wallet.fiat.amount")}</div>
            <div>{t("wallet.fiat.available")}</div>
            <div>{t("wallet.fiat.locked")}</div>
          </div>
          {displayFiatAssets.map((asset) => (
            <WalletAssetRow
              key={asset.id}
              asset={asset}
              displayCurrency={displayCurrency}
              isExpanded={expandedAssetId === asset.id}
              onToggleExpand={(e) => {
                e.stopPropagation();
                setExpandedAssetId((current) => (current === asset.id ? null : asset.id));
              }}
              onClick={() => setExpandedAssetId((current) => (current === asset.id ? null : asset.id))}
              actionButtons={
                <>
                  <Button
                    variant="dark"
                    size="sm"
                    className="rounded-full shadow-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("funds", { mode: "deposit", asset: asset.symbol, assetType: "fiat" });
                    }}
                  >
                    {t("wallet.actions.deposit")}
                  </Button>
                  <Button
                    size="sm"
                    className="border-0 bg-[#C8FF00] text-black shadow-none hover:bg-[#B7EA00]"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(withLocale("/trade/easy", locale));
                    }}
                  >
                    {t("wallet.actions.trade")}
                  </Button>
                </>
              }
            />
          ))}
        </section>
      )}

      {/* Asset List Section */}
      <section className="rounded-[28px] border border-white/10 bg-[#1C2425] p-5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-title-md text-white">{t("wallet.table.title")}</h2>
          <span className="text-body-xs text-gray-400">{t("wallet.table.resultCount", { count: assetCount })}</span>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("wallet.table.searchPlaceholder")}
              className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-body-sm text-white outline-none placeholder:text-gray-500 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
              disabled={cryptoAssets.length === 0}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full border-white/20 px-4 py-2 text-body-xs-medium text-gray-300 hover:bg-white/5" disabled={cryptoAssets.length === 0}>
              {t("wallet.table.convertSmall")}
            </Button>
            <label className={`flex items-center gap-2 text-body-xs text-gray-300 select-none ${cryptoAssets.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={hideSmallAssets}
                  onChange={(e) => {
                    setHideSmallAssets(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="peer h-4 w-4 rounded border-gray-500 text-purple-600 focus:ring-purple-500"
                  disabled={cryptoAssets.length === 0}
                />
              </div>
              {t("wallet.table.hideSmall")}
            </label>
          </div>
        </div>

        {/* Table Headers */}
        <div className="w-full relative">
          <div className="w-full">
            <div className="mb-2 hidden md:grid grid-cols-[1fr_1fr_1fr_1.3fr] px-6 text-title-sm text-gray-400">
              <div>{t("wallet.table.headers.asset")}</div>
              <div>{t("wallet.table.headers.amount")}</div>
              <div>{t("wallet.table.headers.available")}</div>
              <div>{t("wallet.table.headers.locked")}</div>
            </div>

            {filteredCryptoAssets.length > 0 ? (
              <>
                <div className="space-y-4">
                  {displayedAssets.map((asset) => {
                    const isExpanded = expandedAssetId === asset.id;

                    return (
                      <WalletAssetRow
                        key={asset.id}
                        asset={asset}
                        displayCurrency={displayCurrency}
                        isExpanded={isExpanded}
                        onToggleExpand={(e) => {
                          e.stopPropagation();
                          setExpandedAssetId((current) => (current === asset.id ? null : asset.id));
                        }}
                        onClick={() => openModal("asset-detail", { asset, displayCurrency })}
                        actionButtons={
                          <>
                            <Button
                              variant="dark"
                              size="sm"
                              className="rounded-full shadow-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal("funds", { mode: "deposit", asset: asset.symbol, assetType: "crypto" });
                              }}
                            >
                              {t("wallet.actions.deposit")}
                            </Button>
                            <Button
                              size="sm"
                              className="border-0 bg-[#C8FF00] text-black shadow-none hover:bg-[#B7EA00]"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(withLocale("/trade/easy", locale));
                              }}
                            >
                              {t("wallet.actions.trade")}
                            </Button>
                          </>
                        }
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-body-xs text-gray-400">
                    {t("wallet.table.pagination.perPage")}
                    <span className="text-body-xs-medium text-gray-300">{itemsPerPage}</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            ) : (
              <div className="relative">
                {/* Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                  <h3 className="text-title-md text-white">{t("wallet.empty.title")}</h3>
                  <p className="mt-2 text-body-sm text-gray-400">
                    {t("wallet.empty.description")}
                  </p>
                  <Button
                    className="mt-6 rounded-full bg-[#7C3AED] px-8 py-2.5 text-white hover:bg-[#6D28D9]"
                    onClick={() => openModal("funds", { mode: "deposit" })}
                  >
                    {t("wallet.empty.action")}
                  </Button>
                </div>

                {/* Blurred Content */}
                <div className="space-y-4 opacity-40 blur-xs pointer-events-none select-none">
                  {walletDummyData.map((asset) => (
                    <WalletAssetRow
                      key={asset.id}
                      asset={asset}
                      isExpanded={false}
                      onToggleExpand={() => { }}
                      onClick={() => { }}
                      actionButtons={
                        <>
                          <Button variant="dark" size="sm" className="rounded-full shadow-none">
                            {t("wallet.actions.deposit")}
                          </Button>
                          <Button
                            size="sm"
                            className="border-0 bg-[#C8FF00] text-black shadow-none hover:bg-[#B7EA00]"
                          >
                            {t("wallet.actions.trade")}
                          </Button>
                        </>
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
