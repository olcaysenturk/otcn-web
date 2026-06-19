"use client";

import { Button } from "@/components/ui/button";
import { AssetSelectDropdown } from "@/components/ui/AssetSelectDropdown";
import { InfoBox } from "@/components/ui/infobox";
import { cn } from "@/lib/utils";
import { createDepositCryptoAddress, fetchDepositCryptoAddress } from "@/services/otc";
import { useCryptoStore } from "@/stores/useCryptoStore";
import { DepositCryptoAddress } from "@/types/otc";
import { ChevronDown, Copy, Plus } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type CryptoDepositProps = {
  asset?: string;
  t: (key: string, params?: Record<string, string>) => string;
};

export function CryptoDeposit({
  asset,
  t,
}: CryptoDepositProps) {
  const { cryptoAssets } = useCryptoStore();
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(asset || "BNB");
  const [selectedNetwork, setSelectedNetwork] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [depositAddress, setDepositAddress] = useState<DepositCryptoAddress[]>([]);

  const selectedAssetData = cryptoAssets?.find((c) => c.assetSymbol === selectedAsset);
  const assetOptions = useMemo(
    () =>
      (cryptoAssets ?? []).map((coin) => ({
        value: coin.assetSymbol,
        label: coin.assetSymbol,
        iconSrc: `/assets/coin-logo/${coin.assetSymbol}.svg`,
      })),
    [cryptoAssets]
  );
  const networkOptions = selectedAssetData?.network.map((n) => ({
    value: n.networkName,
    label: n.networkLabel,
  })) || [];



  const handleAssetChange = (value: string | undefined) => {
    if (!value) return;
    setSelectedAsset(value);
    const coinData = cryptoAssets?.find((c) => c.assetSymbol === value);
    setSelectedNetwork(coinData?.network?.[0]?.networkName);
    setDepositAddress([]);
  };

  const handleAddAddress = async () => {
    setLoading(true);
    const res = await createDepositCryptoAddress(selectedNetwork!);
    setLoading(false);
    if (res) {
      setDepositAddress([{ assetSymbol: selectedAsset!, networkName: selectedNetwork!, address: res.address }]);
    }
  };

  const getDepositCryptoAddress = async (coin: string) => {
    setLoading(true);
    const res = await fetchDepositCryptoAddress(coin);
    setLoading(false);
    if (res) {
      setDepositAddress(res);
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success(t("modals.funds.addressCopied"));
  };

  const handleNetworkChange = (value: string | undefined) => {
    setSelectedNetwork(value);
    setDepositAddress([]);
  };

  useEffect(() => {
    if (!selectedAsset) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getDepositCryptoAddress(selectedAsset);
  }, [selectedAsset]);

  useEffect(() => {
    if (!cryptoAssets?.length) return;

    const selectedAssetExists = selectedAsset
      ? cryptoAssets.some((coin) => coin.assetSymbol === selectedAsset)
      : false;
    const requestedAssetExists = asset
      ? cryptoAssets.some((coin) => coin.assetSymbol === asset)
      : false;

    const normalizedAsset = selectedAssetExists
      ? selectedAsset
      : requestedAssetExists
        ? asset
        : cryptoAssets[0]?.assetSymbol;

    if (!normalizedAsset) return;

    if (normalizedAsset !== selectedAsset) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAsset(normalizedAsset);
      return;
    }

    const coinData = cryptoAssets.find((coin) => coin.assetSymbol === normalizedAsset);
    const networks = coinData?.network ?? [];

    if (!networks.length) {
      if (selectedNetwork) {
        setSelectedNetwork(undefined);
      }
      return;
    }

    const hasSelectedNetwork = selectedNetwork
      ? networks.some((network) => network.networkName === selectedNetwork)
      : false;

    if (!hasSelectedNetwork) {
      setSelectedNetwork(networks[0].networkName);
    }
  }, [asset, cryptoAssets, selectedAsset, selectedNetwork]);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Info Box */}
      <InfoBox variant="info-dark" hideIcon>
        <ul className="flex flex-col gap-4">
          {[
            "cryptoDepositBullet1",
            "cryptoDepositBullet2",
            "cryptoDepositBullet3"
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#7FA6FF]" />
              <span className="text-[13px] leading-[140%] tracking-[-0.015em] text-gray-200"
                dangerouslySetInnerHTML={{ __html: t("modals.funds." + item, { "asset": selectedAsset || "BTC" }) }}></span>
            </li>
          ))}
        </ul>
      </InfoBox>

      {/* Content Section */}
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-6 w-full">

            {/* Coin Selector */}
            <div className="flex flex-col items-start gap-3 w-full">
              <label className="text-[14px] leading-3.5 font-medium text-gray-400">
                {t("modals.funds.selectCoin")}
              </label>

              <AssetSelectDropdown
                value={selectedAsset}
                options={assetOptions}
                placeholder={t("modals.funds.selectCoinPlaceholder")}
                onChange={(value) => handleAssetChange(value)}
              />
            </div>

            {/* Network Selector */}
            <div className="flex flex-col items-start gap-2 w-full">
              <label className="text-[14px] leading-3.5 font-medium text-gray-400">
                {t("modals.funds.network") || "Ağ"}
              </label>

              <div className="relative w-full">
                <select
                  value={selectedNetwork ?? ""}
                  onChange={(e) => handleNetworkChange(e.target.value)}
                  disabled={networkOptions.length === 0}
                  className={cn(
                    "h-[45px] w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white",
                    networkOptions.length === 0 && "cursor-not-allowed opacity-50"
                  )}
                >
                  <option value="" disabled className="bg-[#1C2425]">{t("modals.funds.networkPlaceholder")}</option>
                  {networkOptions.map((network, i) => (
                    <option key={i} value={network.value} className="bg-[#1C2425]">
                      {network.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {loading ? (
              <div className="w-full flex flex-col gap-5 animate-pulse">
                <div className="flex flex-row items-start gap-5 w-full">
                  <div className="shrink-0">
                    <div className="w-25 h-25 bg-white/10 rounded-[5.8px]" />
                  </div>

                  <div className="min-w-0 flex flex-col gap-2 flex-1">
                    <div className="h-3.5 w-16 bg-white/10 rounded" />
                    <div className="flex flex-row min-w-0 items-center gap-2 w-full">
                      <div className="flex-1 h-11.25 bg-white/10 rounded-xl" />
                      <div className="shrink-0 w-9 h-9 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ) : depositAddress?.length > 0 ? (
              <div className="w-full flex flex-col gap-5">
                <div className="flex flex-row items-start gap-5 w-full">
                  {/* QR Code */}
                  <div className="shrink-0 rounded-lg bg-white p-1">
                    <QRCodeSVG value={depositAddress[0].address} className="size-24" />
                  </div>

                  {/* Address Section */}
                  <div className="min-w-0 flex flex-col gap-2">
                    <label className="text-[14px] leading-3.5 font-medium text-gray-400">
                      {t("modals.funds.addressTitle")}
                    </label>

                    <div className="flex flex-row min-w-0 items-center gap-2 w-full">
                      <div className="flex min-w-0 flex-col gap-2 w-full">
                        <div className="relative min-w-0 px-4 py-3 truncate  bg-white/5 border border-white/10 rounded-xl text-sm font-medium tracking-[-0.015em] text-white ">
                          <div className="truncate max-w-full">
                            {depositAddress[0].address}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyAddress(depositAddress[0].address)}
                        className="shrink-0 w-9 h-9 bg-transparent border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {depositAddress[0]?.memoTag && (
                  <>
                    <div className="min-w-0 flex flex-col gap-2">
                      <label className="text-[14px] leading-3.5 font-medium text-gray-400">
                        {t("modals.funds.depositTagLabel")}
                      </label>

                      <div className="flex flex-row min-w-0 items-center gap-2 w-full">
                        <div className="flex min-w-0 flex-col gap-2 w-full">
                          <div className="relative min-w-0 px-4 py-3 truncate  bg-white/5 border border-white/10 rounded-xl text-sm font-medium tracking-[-0.015em] text-white ">
                            <div className="truncate max-w-full">
                              {depositAddress[0]?.memoTag}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopyAddress(depositAddress[0].memoTag!)}
                          className="shrink-0 w-9 h-9 bg-transparent border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                        >
                          <Copy className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <InfoBox variant="warning-dark">
                      <span className="text-[13px] leading-[140%] tracking-[-0.015em] text-gray-200">
                        {t("modals.funds.cryptoDepositMemoWarning", { "asset": selectedAsset || "BTC" })}
                      </span>
                    </InfoBox>
                  </>
                )}

              </div>
            ) : (
              <>
                {/* Divider */}
                <div className="w-full h-px bg-white/10" />

                {/* Warning Message */}
                <InfoBox variant="warning-dark">
                  <span className="text-[13px] leading-[140%] tracking-[-0.015em] text-gray-200">
                    {t("modals.funds.cryptoDepositWarning", { "asset": selectedAsset || "BTC" })}
                  </span>
                </InfoBox>

                {/* Add Address Button */}
                <Button
                  variant="green"
                  onClick={handleAddAddress}
                  disabled={!selectedNetwork}
                  className="shadow-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("modals.funds.createAddress")}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
