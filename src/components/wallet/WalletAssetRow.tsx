import { ChevronDown, ChevronUp, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { ReactNode, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getApiLocale } from "@/lib/i18n/config";
import { ValueChangeHighlight } from "@/components/ui/ValueChangeHighlight";

import { WalletSidebarAsset } from "@/types/wallet";
import { D } from "@/lib/math/decimal";
import { formatDecimalFromString, formatDecimalValue } from "@/lib/math/formatDecimal";

interface WalletAssetRowProps {
    asset: WalletSidebarAsset;
    displayCurrency?: "TRY" | "USDT";
    isExpanded: boolean;
    onToggleExpand: (e: React.MouseEvent) => void;
    onClick: () => void;
    actionButtons: ReactNode;
}

export function WalletAssetRow({
    asset,
    displayCurrency = "TRY",
    isExpanded,
    onToggleExpand,
    onClick,
    actionButtons,
}: WalletAssetRowProps) {
    const { t, locale } = useI18n();
    const { icon, name, symbol, amount, fiat, available, inOrder, withdraw } = asset;
    // TODO: USDT precision is hardcoded to 2 for now. Make this dynamic/configurable later.
    const precision = (asset.symbol === "TRY" || asset.symbol === "USDT")
        ? 2
        : (asset.asset?.displayPrecision ?? asset.asset?.precision);

    const formatValue = (value: string) => {
        if (precision === undefined) return value;
        return formatDecimalFromString(value, precision, { minDecimals: 2 });
    };

    const inOrderDec = precision === undefined ? D.from(Number(inOrder) || 0) : D.parse(inOrder, precision);
    const withdrawDec = precision === undefined ? D.from(Number(withdraw) || 0) : D.parse(withdraw, precision);
    const lockedTotal = formatDecimalValue(
        D.add(inOrderDec, withdrawDec, precision ?? -1),
        { minDecimals: 2 }
    );

    const formattedWithdraw = formatValue(withdraw);
    const formattedInOrder = formatValue(inOrder);
    const numberLocale = getApiLocale(locale);

    const equivalentValue = (() => {
        if (displayCurrency === "USDT") {
            if (asset.symbol === "USDT") {
                return `≈ ${formatValue(amount)} USDT`;
            }
            const usdt = asset.usdtValue ?? 0;
            return `≈ ${usdt.toLocaleString(numberLocale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })} USDT`;
        }

        if (asset.symbol === "TRY") {
            return `≈ ₺${formatValue(amount)}`;
        }

        const tryVal = asset.fiatValue;
        if (typeof tryVal === "number") {
            return `≈ ₺${tryVal.toLocaleString(numberLocale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }

        return fiat;
    })();

    const comparisonValue = useMemo(() => {
        if (displayCurrency === "USDT") {
            if (asset.symbol === "USDT") return Number(amount);
            return asset.usdtValue ?? 0;
        }

        if (asset.symbol === "TRY") return Number(amount);
        return asset.fiatValue ?? 0;
    }, [amount, asset.fiatValue, asset.symbol, asset.usdtValue, displayCurrency]);

    return (
        <div className="overflow-hidden rounded-4xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]">
            {/* Mobile Card View */}
            <div className="flex flex-col p-5 lg:hidden" onClick={onClick}>
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center">
                            {typeof icon === "string" ? (
                                <Image
                                    src={icon}
                                    alt={name}
                                    fill
                                    sizes="40px"
                                    className="object-contain"
                                />
                            ) : (
                                icon
                            )}
                        </div>
                        <div>
                            <p className="text-body-lg-medium text-white">
                                {name} <span className="text-body-sm text-gray-400">({symbol})</span>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(e);
                        }}
                        aria-label="Aksiyonlar"
                    >
                        <EllipsisVertical className="h-5 w-5" />
                    </button>
                </div>

                {/* Stats */}
                <div className="mb-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <span className="text-body-md text-gray-400">{t("wallet.table.headers.amount")}</span>
                        <div className="text-right">
                            <span className="block text-body-lg-medium text-white">{formatValue(amount)}</span>
                            <span className="block text-body-xs text-gray-400">
                                <ValueChangeHighlight
                                    value={comparisonValue}
                                    className="block rounded px-1 text-body-xs text-gray-400"
                                >
                                    {equivalentValue}
                                </ValueChangeHighlight>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-body-md text-gray-400">{t("wallet.table.headers.available")}</span>
                        <span className="text-body-lg-medium text-white">{formatValue(available)}</span>
                    </div>
                    <div
                        className="flex cursor-pointer items-center justify-between"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(e);
                        }}
                    >
                        <span className="text-body-md text-gray-400">{t("wallet.table.headers.locked")}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-body-lg-medium text-white">{lockedTotal}</span>
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 [&>button]:w-full [&>button]:justify-center [&>button]:rounded-full [&>button]:py-6">
                    <div className="contents" onClick={(e) => e.stopPropagation()}>
                        {actionButtons}
                    </div>
                </div>
            </div>

            {/* Desktop Table Row View */}
            <div
                className="hidden cursor-pointer items-center p-4 lg:grid lg:grid-cols-[1fr_1fr_1fr_1.3fr]"
                onClick={onClick}
            >
                <div className="col-span-1 flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0 flex items-center justify-center">
                        {typeof icon === "string" ? (
                            <Image
                                src={icon}
                                alt={name}
                                fill
                                sizes="32px"
                                className="object-contain"
                            />
                        ) : (
                            icon
                        )}
                    </div>
                    <div>
                        <p className="text-title-sm text-white">
                            {name}
                        </p>
                        <p className="text-body-xs text-gray-400">({symbol})</p>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-title-sm text-white">
                        {formatValue(amount)}
                    </span>
                    <span className="text-body-xs text-gray-400">
                        <ValueChangeHighlight
                            value={comparisonValue}
                            className="w-fit rounded px-1 text-body-xs text-gray-400"
                        >
                            {equivalentValue}
                        </ValueChangeHighlight>
                    </span>
                </div>

                <div className="text-title-sm text-white">
                    {formatValue(available)}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        className="flex items-center gap-2 text-title-sm text-white"
                        onClick={onToggleExpand}
                        aria-expanded={isExpanded}
                    >
                        <span>{lockedTotal}</span>
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                    </button>
                    <div className="flex items-center gap-2 pl-4" onClick={(e) => e.stopPropagation()}>
                        {actionButtons}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div
                    className="grid grid-cols-3 gap-4 border-t border-white/10 bg-white/5 px-6 py-4 text-body-sm text-gray-300"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="col-span-2 space-y-3 text-body-sm-medium">
                        <p>{t("wallet.totalBalance.withdrawing")}</p>
                        <p>{t("wallet.totalBalance.locked")}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-3 text-body-sm-medium text-white">
                        <span>{formattedWithdraw} {symbol}</span>
                        <span>{formattedInOrder} {symbol}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
